from browser_use import Agent, ChatGoogle, Controller
from dotenv import load_dotenv
import asyncio
from pydantic import BaseModel
from typing import List

load_dotenv()

llm = ChatGoogle(model="gemini-2.0-flash-exp")

class Value(BaseModel):
    ctas_found: int
    cta_score: float
    cta_issues: list[str]
    cta_recommendations: list[str]
    theme_score: float
    theme_issues: float
    theme_recommentdations: list[str]
        
class Values(BaseModel):
    values: list[Value]
    
class redirect(BaseModel):
    caption: str
    url: str
    
class redirects(BaseModel):
    posts: list[redirect]

async def extract_redirects(url):
    # Extraction of navigation links
    
    class Redirect(BaseModel):
        caption: str
        url: str
        
    class Redirects(BaseModel):
        redirects: list[Redirect]
        
    extraction_controller = Controller(output_model=Redirects)
    
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

    
async def validate_page(url):
    # Validation of a page
    
    url = "https://www.prasklatechnology.com"
    
    validation_controller = Controller(output_model=Values)
    
    task = f"""
    Navigate to the provided {url}.
    Explore the page and identify all sections.
    Validate the theme. See if the theme of different sections match with each other. Score the theme and mention issues and recommendations.
    Validate the CTA Efficiency. See if the CTAs are powerfull enough or clear to get the attention of customers. Score the CTAs and mention issues and recommendations.
    Do not click any links or buttons that navigates away from the site.
    Stay within the domain of the provided url{url}
    """
    
    agent = Agent(task=task, llm=llm, controller=validation_controller)
    validation_result = await agent.run()
    
    print(validation_result.final_result())
    

    

    

# controller = Controller(output_model=redirects)

# async def main():
#     llm = ChatGoogle(model="gemini-2.0-flash-exp")
    
#     task = """
# Navigate to 'https://www.prasklatechnology.com/'. 
# Explore the homepage and identify all sections. Scroll through all sections if needed.
# Find and list all links that takes us from this page to another
# Do NOT click any buttons that navigate away from the site.
# Stay on the prasklatechnology.com domain.
# """
    
#     agent = Agent(task=task, llm=llm, controller=controller)
#     result = await agent.run()
    
#     print("\n=== Agent Task Complete ===")
#     print(result.final_result())


