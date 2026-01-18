from pydantic import BaseModel, Field
from typing import List

import google.genai as genai

class AuditConfig(BaseModel):
    website_type: str = Field(
        ...,
        description="The category of the website (e.g., E-commerce, SaaS, Blog, Portfolio)."
    )
    
    target_audience: str = Field(
        ...,
        description="Who is this website for? (e.g., Students, Enterprise, Elderly)."
    )
    
    theme_description: str = Field(
        ...,
        description="A description of the intended visual theme (e.g., 'Dark Galaxy', 'Minimalist White')."
    )
    
    primary_goal: str = Field(
        ...,
        description="The ONE main action the user wants visitors to take (e.g., 'Signup', 'Buy Now')."
    )
    
    inferred_tone: str = Field(
        ...,
        description="Based on the audience, what should the tone be? (e.g., 'Playful', 'Academic', 'Corporate')."
    )


def extract_audit_config(user_prompt: str):
    
    client = genai.Client()
    
    prompt = """
    You are an expert Project Manager. 
    Analyze the user's messy request and extract the project configuration.
    If the user misses details, infer reasonable defaults based on the website type.
    """
    
    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_json_schema": AuditConfig.model_json_schema(),
        },
    )
    
    strucrued_config = AuditConfig.model_validate_json(response.text)
    print(strucrued_config)
    