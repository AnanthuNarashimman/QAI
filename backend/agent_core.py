from browser_use import Agent, BrowserSession, ChatGoogle, Controller
from dotenv import load_dotenv
import asyncio
import base64
import json
import logging
import re
from pydantic import BaseModel, Field
from typing import List

load_dotenv()

# Strip ANSI escape codes from strings
ANSI_RE = re.compile(r'\x1b\[[0-9;]*m')

def strip_ansi(text):
    return ANSI_RE.sub('', text)


class SocketIOLogHandler(logging.Handler):
    """Custom log handler that transforms raw browser-use logs into clean agentic messages"""
    def __init__(self, emit_fn):
        super().__init__()
        self.emit_fn = emit_fn

    def emit(self, record):
        raw = record.getMessage()
        if not raw.strip():
            return

        message = strip_ansi(raw).strip()

        # ── Step counter ──
        if '📍 Step' in raw:
            # Extract step number: "📍 Step 3:" → "Step 3"
            match = re.search(r'Step\s*(\d+)', message)
            if match:
                self.emit_fn('log', {
                    'message': f'Step {match.group(1)}',
                    'type': 'step'
                })
            return

        # ── Agent's next goal (thought bubble) ──
        if 'Next goal:' in raw:
            thought = message.split('Next goal:', 1)[-1].strip()
            if thought:
                self.emit_fn('log', {
                    'message': thought,
                    'type': 'thought'
                })
            return

        # ── Actions performed ──
        if '▶️' in raw:
            action = message.replace('▶️', '').strip()
            # Parse action type
            if 'navigate' in action.lower():
                url_match = re.search(r'url:\s*(\S+)', action)
                url = url_match.group(1).rstrip(',') if url_match else ''
                self.emit_fn('log', {
                    'message': f'Navigating to {url}' if url else 'Navigating...',
                    'type': 'action'
                })
            elif 'scroll' in action.lower():
                down = 'down' in action.lower()
                pages_match = re.search(r'pages:\s*([\d.]+)', action)
                pages = pages_match.group(1) if pages_match else ''
                direction = 'down' if down else 'up'
                self.emit_fn('log', {
                    'message': f'Scrolling {direction} {pages + " pages" if pages else ""}',
                    'type': 'action'
                })
            elif 'extract' in action.lower():
                self.emit_fn('log', {
                    'message': 'Extracting page content',
                    'type': 'action'
                })
            elif 'wait' in action.lower():
                sec_match = re.search(r'seconds:\s*(\d+)', action)
                sec = sec_match.group(1) if sec_match else ''
                self.emit_fn('log', {
                    'message': f'Waiting {sec + "s" if sec else ""} for page to load',
                    'type': 'action'
                })
            elif 'done' in action.lower():
                self.emit_fn('log', {
                    'message': 'Task completed',
                    'type': 'action'
                })
            # Skip write_file, replace_file, and other internal actions
            return

        # ── Navigation result ──
        if '🔗 Navigated' in raw:
            url = message.replace('🔗 Navigated to', '').strip()
            self.emit_fn('log', {
                'message': url,
                'type': 'url'
            })
            return

        # ── Scroll result ──
        if '🔍 Scrolled' in raw:
            self.emit_fn('log', {
                'message': message.replace('🔍 ', ''),
                'type': 'result'
            })
            return

        # ── Task completed ──
        if '✅ Task completed' in raw:
            self.emit_fn('log', {
                'message': 'Agent finished this task',
                'type': 'success'
            })
            return

        # ── Page readiness warning ──
        if '⚠️ Page readiness' in raw:
            self.emit_fn('log', {
                'message': 'Waiting for page to become ready...',
                'type': 'action'
            })
            return

        # Skip everything else (Eval, Memory, write_file, replace_file, etc.)



# Extraction related classes 
class redirect(BaseModel):
    caption: str
    url: str
    
class redirects(BaseModel):
    posts: list[redirect]
    
    

# Validation related classes
class Insight(BaseModel):
    element_name: str = Field(description="The specific website part (e.g., 'Hero Button', 'Footer')")
    issues: str = Field(description="The issue found")
    recommendations: str = Field(description="Recommendations to make it better")
    viewport_number: int = Field(description="The viewport number (1-based) where this issue was observed during scrolling")
    
class Value(BaseModel):
    ctas_found: int
    cta_score: float
    cta_thoughts: list[Insight]
    theme_score: float
    theme_thoughts: list[Insight]
    
class Values(BaseModel):
    values: list[Value]


async def extract_redirects(url, emit_log=None, stop_flag=None):
    # Extraction of navigation links

    # Attach log handler if emit_log is provided
    handler = None
    if emit_log:
        handler = SocketIOLogHandler(emit_log)
        handler.setLevel(logging.INFO)
        logging.getLogger('browser_use').addHandler(handler)

    # Build stop callback if stop_flag is provided
    stop_callback = None
    if stop_flag:
        async def stop_callback():
            return stop_flag.is_set()

    llm = ChatGoogle(model="gemini-2.5-flash-lite")

    extraction_controller = Controller(output_model=redirects)

    task = f"""
    Navigate to the provided {url}.
    Explore the page and identify all sections.

    Scroll through the ENTIRE page using viewport-based scrolling:
    - Use window.scrollBy(0, window.innerHeight) to scroll by one full viewport at a time
    - Scroll from 0vh → 100vh → 200vh → etc. until you reach the bottom
    - Pause briefly after each scroll to observe all elements

    Find and list any links or buttons that takes user from the current page to another.
    Do not click any buttons that navigates away from the site.
    Stay on the domain of the provided url {url}
    """

    agent = Agent(task=task, llm=llm, controller=extraction_controller, register_should_stop_callback=stop_callback)
    try:
        extraction_result = await agent.run()
    except InterruptedError:
        if handler:
            logging.getLogger('browser_use').removeHandler(handler)
        await agent.close()
        return None
    finally:
        await agent.close()

    # Remove handler to avoid duplicate logs on next call
    if handler:
        logging.getLogger('browser_use').removeHandler(handler)
    
    """
    Will generate a structured output as below
    {"redirects": [{"caption": "Home", "url": "https://www.prasklatechnology.com/"}, {"caption": "About", "url": "https://www.prasklatechnology.com/about"}, {"caption": "Services", "url": "https://www.prasklatechnology.com/services"}, {"caption": "Clients", "url": "https://www.prasklatechnology.com/clients"}, {"caption": "Careers", "url": "https://www.prasklatechnology.com/career"}, {"caption": "Home", "url": "https://www.prasklatechnology.com/"}, {"caption": "About", "url": "https://www.prasklatechnology.com/about"}, {"caption": "Services", "url": "https://www.prasklatechnology.com/services"}, {"caption": "Clients", "url": "https://www.prasklatechnology.com/clients"}, {"caption": "Career", "url": "https://www.prasklatechnology.com/career"}, {"caption": "Privacy Policy", "url": "https://www.prasklatechnology.com/privacy-policy"}, {"caption": "Terms of Service", "url": "https://www.prasklatechnology.com/terms-of-service"}]}
    
    The Queue must be updated with new urls
    """
    extracted_urls = extraction_result.final_result()
    
    # Parse JSON string to dictionary if needed
    if isinstance(extracted_urls, str):
        extracted_urls = json.loads(extracted_urls)
    
    return extracted_urls

    
async def validate_page(url, audit_config=None, emit_log=None, stop_flag=None):

    # Attach log handler if emit_log is provided
    handler = None
    if emit_log:
        handler = SocketIOLogHandler(emit_log)
        handler.setLevel(logging.INFO)
        logging.getLogger('browser_use').addHandler(handler)

    # Build stop callback if stop_flag is provided
    stop_callback = None
    if stop_flag:
        async def stop_callback():
            return stop_flag.is_set()

    llm = ChatGoogle(model="gemini-3-pro-preview")

    validation_controller = Controller(output_model= Values)
    
    # Build dynamic context section if audit_config is provided
    context_section = ""
    if audit_config:
        context_section = f"""
    --- USER'S INTENDED DESIGN ---
    The user describes their website as:
    - Type: {audit_config.get('website_type', 'Not specified')}
    - Target Audience: {audit_config.get('target_audience', 'Not specified')}
    - Theme: {audit_config.get('theme_description', 'Not specified')}
    - Intended Tone: {audit_config.get('inferred_tone', 'Not specified')}
    - Primary Goal: {audit_config.get('primary_goal', 'Not specified')}
    
    ⚠️ YOUR TASK: Compare the ACTUAL website against these intentions.
    - Does the design match the intended theme "{audit_config.get('theme_description', '')}"?
    - Does the tone match "{audit_config.get('inferred_tone', '')}"?
    - Are CTAs aligned with the primary goal "{audit_config.get('primary_goal', '')}"?
    - Is it appropriate for "{audit_config.get('target_audience', '')}"?
    - Point out specific mismatches between intended vs actual.
    """
    
    task = f"""
    ROLE: Act as a meticulous UI/UX Auditor who catches every visual flaw a human eye would notice.

    GOAL: Perform a SECTION-BY-SECTION deep audit of {url}. Do NOT give generic feedback. Every issue must reference a SPECIFIC element.
    {context_section}

    ⚠️ CRITICAL: ANALYZE AS YOU SCROLL - NOT AFTER!
    You have NO memory of previous viewports. You can ONLY see what is currently on screen.
    Therefore, you MUST analyze and record findings for each viewport BEFORE scrolling to the next.
    If you scroll first and try to analyze later, you will fail because you cannot see previous sections.

    --- PROCESS: SCROLL → ANALYZE → RECORD → REPEAT ---

    For EACH viewport, do ALL of the following BEFORE scrolling:

    1. IDENTIFY what section you're viewing (Hero, Features, Testimonials, Footer, etc.)

    2. FIND AND RECORD ALL CTAs in this viewport:
       - Look for buttons, links, form submits
       - Record the EXACT text (e.g., "Get Started", "Learn More", "Sign Up")
       - Note the section where you found it
       - Evaluate: visibility, contrast, copy quality, placement, size
       {"- Check if it aligns with primary goal: " + audit_config.get('primary_goal', '') if audit_config else ""}

    3. ANALYZE VISUAL ELEMENTS in this viewport:
       **Icons & Graphics:** colors consistent? same style? uniform sizes? pixelated?
       **Typography:** hierarchy correct? readable? good contrast? orphaned words?
       **Buttons:** hover states? uniform sizing? good contrast?
       **Spacing:** aligned? consistent gaps? proper breathing room?
       **Colors:** clashing? inconsistent accents? consistent shadows/borders?
       {"- Compare against intended theme: " + audit_config.get('theme_description', '') if audit_config else ""}

    4. RECORD specific issues with exact element names and locations.
       ⚠️ IMPORTANT: For EVERY issue you record, you MUST include the viewport_number you are currently on.
       Viewport 1 = the initial view (top of page), Viewport 2 = after first scroll, etc.

    5. ONLY THEN scroll using: window.scrollBy(0, window.innerHeight)

    --- STEP-BY-STEP EXECUTION ---

    STEP 1: Navigate to {url}

    STEP 2: VIEWPORT 1 (Top of page)
    - What section is this? (likely Hero/Header)
    - List ALL CTAs visible with their exact text
    - Note visual issues with specific element references
    - Record your findings
    - NOW scroll down one viewport

    STEP 3: VIEWPORT 2
    - Wait 2 seconds to observe
    - What section is this?
    - List ALL CTAs visible with their exact text
    - Note visual issues
    - Record findings
    - Scroll down

    STEP 4: Continue for VIEWPORT 3, 4, 5... until you reach the footer

    STEP 5: AFTER analyzing ALL viewports, compile final output:
    - ctas_found: Total count of ALL CTAs you recorded across all viewports
    - cta_score: 0-100 based on CTA quality (deduct for generic text, poor contrast, bad placement)
    - cta_thoughts: List of specific CTA issues found
    - theme_score: 0-100 based on visual issues (deduct 5-10 points per issue)
    - theme_thoughts: List of specific visual issues found
    {"- Call out mismatches between user's stated intent and actual implementation" if audit_config else ""}

    --- OUTPUT REQUIREMENTS ---
    - Reference elements by EXACT text/location (e.g., "The 'Learn More' button in Features section")
    - Give SPECIFIC fixes (e.g., "Change button color from #ccc to #0066cc for better contrast")
    - For EVERY issue in cta_thoughts and theme_thoughts, set viewport_number to the viewport where you found it (1 = top of page, 2 = after first scroll, etc.)
    - Only report issues, skip things that are fine
    - Do NOT click links that leave the domain
    - Stay strictly on {url}

    --- VALIDATION BEFORE CALLING DONE ---
    ⚠️ If ctas_found = 0, you missed CTAs. Most websites have multiple CTAs.
    ⚠️ If you have no specific element names in your issues, you didn't analyze properly.
    ⚠️ If scores are 0 with no reasoning, go back and re-analyze.
    """
    
    browser_session = BrowserSession()

    agent = Agent(
        llm=llm,
        task=task,
        controller=validation_controller,
        browser_session=browser_session,
        register_should_stop_callback=stop_callback,
    )

    try:
        result = await agent.run()

        validation_result = result.final_result()
        if isinstance(validation_result, str):
            validation_result = json.loads(validation_result)

    except InterruptedError:
        if handler:
            logging.getLogger('browser_use').removeHandler(handler)
        await browser_session.stop()
        await agent.close()
        return None, None
    finally:
        await browser_session.stop()
        await agent.close()

    # Remove handler to avoid duplicate logs on next call
    if handler:
        logging.getLogger('browser_use').removeHandler(handler)

    # Collect unique viewport numbers from all issues
    viewport_numbers = set()
    for val in validation_result.get('values', []):
        for thought in val.get('cta_thoughts', []):
            vp = thought.get('viewport_number')
            if vp is not None:
                viewport_numbers.add(int(vp))
        for thought in val.get('theme_thoughts', []):
            vp = thought.get('viewport_number')
            if vp is not None:
                viewport_numbers.add(int(vp))

    # Map browser-use's built-in step screenshots to viewport numbers.
    # The agent scrolls sequentially (VP1 → VP2 → VP3 ...), so the step screenshots
    # correspond to viewports in order. We take the last max_viewport screenshots
    # from the list (working from the end avoids blank/loading screenshots at the start).
    screenshots = {}
    if viewport_numbers:
        try:
            screenshot_paths = result.screenshot_paths()
            # Filter out None entries (e.g., pre-navigation step)
            valid_paths = [p for p in screenshot_paths if p is not None]

            max_vp = max(viewport_numbers)

            # The last max_vp screenshots map to viewports 1..max_vp in order
            if len(valid_paths) >= max_vp:
                vp_screenshots = valid_paths[-max_vp:]
            else:
                # Fewer screenshots than viewports — use what we have, mapped from VP1 onward
                vp_screenshots = valid_paths

            for i, path in enumerate(vp_screenshots):
                vp_num = i + 1
                if vp_num in viewport_numbers:
                    with open(path, 'rb') as f:
                        screenshots[vp_num] = base64.b64encode(f.read()).decode('utf-8')
        except Exception as e:
            print(f"Screenshot mapping failed for {url}: {e}")

    return validation_result, screenshots
    

