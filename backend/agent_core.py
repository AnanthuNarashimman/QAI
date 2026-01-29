from browser_use import Agent, ChatGoogle, Controller
from dotenv import load_dotenv
import asyncio
import json
import logging
from pydantic import BaseModel, Field
from typing import List

load_dotenv()


class SocketIOLogHandler(logging.Handler):
    """Custom log handler that forwards browser-use logs to the frontend via SocketIO"""
    def __init__(self, emit_fn):
        super().__init__()
        self.emit_fn = emit_fn

    # Only forward messages containing these patterns
    ALLOW_PATTERNS = [
        '📍 Step',
        'Eval:',
        'Memory:',
        'Next goal:',
        '▶️',
        '🔗 Navigated',
        '🔍 Scrolled',
        '📄  Final Result',
        '✅ Task completed',
        '⚠️ Page readiness',
    ]

    def emit(self, record):
        message = record.getMessage()
        if not message.strip():
            return
        # Only forward useful agent activity logs
        if not any(pattern in message for pattern in self.ALLOW_PATTERNS):
            return
        self.emit_fn('log', {'message': message, 'type': 'agent'})



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
    
class Value(BaseModel):
    ctas_found: int
    cta_score: float
    cta_thoughts: list[Insight]
    theme_score: float
    theme_thoughts: list[Insight]
    
class Values(BaseModel):
    values: list[Value]


async def extract_redirects(url, emit_log=None):
    # Extraction of navigation links

    # Attach log handler if emit_log is provided
    handler = None
    if emit_log:
        handler = SocketIOLogHandler(emit_log)
        handler.setLevel(logging.INFO)
        logging.getLogger('browser_use').addHandler(handler)

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

    agent = Agent(task=task, llm=llm, controller=extraction_controller)
    extraction_result = await agent.run()

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

    
async def validate_page(url, audit_config=None, emit_log=None):

    # Attach log handler if emit_log is provided
    handler = None
    if emit_log:
        handler = SocketIOLogHandler(emit_log)
        handler.setLevel(logging.INFO)
        logging.getLogger('browser_use').addHandler(handler)

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

    4. RECORD specific issues with exact element names and locations

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
    - Only report issues, skip things that are fine
    - Do NOT click links that leave the domain
    - Stay strictly on {url}

    --- VALIDATION BEFORE CALLING DONE ---
    ⚠️ If ctas_found = 0, you missed CTAs. Most websites have multiple CTAs.
    ⚠️ If you have no specific element names in your issues, you didn't analyze properly.
    ⚠️ If scores are 0 with no reasoning, go back and re-analyze.
    """
    
    agent = Agent(llm=llm, task=task, controller=validation_controller)

    result = await agent.run()

    # Remove handler to avoid duplicate logs on next call
    if handler:
        logging.getLogger('browser_use').removeHandler(handler)

    validation_result = result.final_result()
    
    # Parse JSON string to dictionary if needed
    if isinstance(validation_result, str):
        validation_result = json.loads(validation_result)
    
    return validation_result
    

