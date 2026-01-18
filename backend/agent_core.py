from browser_use import Agent, ChatGoogle, Controller
from dotenv import load_dotenv
import asyncio
from pydantic import BaseModel, Field
from typing import List

load_dotenv()

llm = ChatGoogle(model="gemini-2.0-flash-exp")

# Hardcoded for now, later this will be provided by the 
url = "https://www.prasklatechnology.com"



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


async def extract_redirects(url):
    # Extraction of navigation links
        
    extraction_controller = Controller(output_model=redirects)
    
    task = f"""
    Navigate to the provided {url}.     
    Explore the page and identify all sections. Scroll through all sections if needed.
    Find and list any links or buttons that takes user from the current page to another.
    Do not click any buttons that navigates away from the site.
    Stay on the domain of the provided url {url}
    """
    
    agent = Agent(task=task, llm=llm, controller=extraction_controller)
    extraction_result = await agent.run()
    
    """
    Will generate a structured output as below
    {"redirects": [{"caption": "Home", "url": "https://www.prasklatechnology.com/"}, {"caption": "About", "url": "https://www.prasklatechnology.com/about"}, {"caption": "Services", "url": "https://www.prasklatechnology.com/services"}, {"caption": "Clients", "url": "https://www.prasklatechnology.com/clients"}, {"caption": "Careers", "url": "https://www.prasklatechnology.com/career"}, {"caption": "Home", "url": "https://www.prasklatechnology.com/"}, {"caption": "About", "url": "https://www.prasklatechnology.com/about"}, {"caption": "Services", "url": "https://www.prasklatechnology.com/services"}, {"caption": "Clients", "url": "https://www.prasklatechnology.com/clients"}, {"caption": "Career", "url": "https://www.prasklatechnology.com/career"}, {"caption": "Privacy Policy", "url": "https://www.prasklatechnology.com/privacy-policy"}, {"caption": "Terms of Service", "url": "https://www.prasklatechnology.com/terms-of-service"}]}
    
    The Queue must be updated with new urls
    """
    extracted_urls = extraction_result.final_result()

    
async def validate_page():
    
    validation_controller = Controller(output_model= Values)
    
    task = f"""
    ROLE: Act as a Senior UI/UX Auditor and Conversion Rate Optimization (CRO) Specialist.

    GOAL: Conduct a strict, professional audit of {url} focusing on Visual Consistency and Call-to-Action (CTA) effectiveness.

    --- STEP 1: NAVIGATION & OBSERVATION ---
    1. Navigate to {url}.
    2. Slowly scroll from the top to the bottom of the page to ensure all lazy-loaded elements render.
    3. Identify every distinct section (Hero, Features, Testimonials, Footer, etc.).

    --- STEP 2: THEME VALIDATION (Design System Check) ---
    Analyze the visual identity across all sections.
    - Design : Does the design matches the content delivered and the enhances the view? Does it make the flow bad?
    - Consistency: Do the fonts, button styles, and spacing remain consistent?
    - Palette: Are the primary and secondary colors used correctly, or are there clashing colors?
    - Whitespace: Is the layout breathing properly, or is it cluttered?
    - SCORING: Provide a score (0-100). A score <80 requires severe critique.

    --- STEP 3: CTA EFFICIENCY (Conversion Check) ---
    Analyze all primary and secondary buttons.
    - Contrast: Do buttons stand out against their background?
    - Copywriting: Is the text actionable (e.g., "Get Started" vs "Submit")?
    - Placement: Are CTAs visible without excessive scrolling?
    - SCORING: Provide a score (0-100). Deduct points for generic text or low contrast.

    --- CONSTRAINTS ---
    - Be specific: Quote the exact text of the element when reporting an issue (e.g., "The 'Contact' button in the Footer...").
    - Be constructive and clear, Dont give general recommendations like 'improve color theme'. Mention what exactly can be changed and how can it improve the page.
    - Do NOT click links that leave the domain.
    - Stay strictly on {url}.
    """
    
    agent = Agent(llm=llm, task=task, controller=validation_controller)
    
    result = await agent.run()
    
    print(result.final_result()) 
    

