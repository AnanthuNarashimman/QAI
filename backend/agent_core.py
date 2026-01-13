from browser_use import Agent, ChatGoogle
from dotenv import load_dotenv
import asyncio

load_dotenv()

# --- 1. The Planning Phase ---
USER_GOAL = "This is an educational algorithm visualizer. It should be easy for students to navigate."
TEST_CONSTRAINTS = "Tone: Academic but friendly. Accessibility: High contrast needed."

async def main():
    llm = ChatGoogle(model="gemini-2.0-flash-exp")
    
    task = """
Navigate to 'https://algo-flow-roan.vercel.app/'. 
Explore the homepage and identify all sections. Scroll through all sections if needed.
Look for any 'Get Started' or 'Login' buttons or any button that looks like it will help us to proceed to the application page and describe what they do.
Do NOT click any buttons that navigate away from the site.
Stay on the algo-flow-roan.vercel.app domain.
"""
    
    agent = Agent(task=task, llm=llm)
    result = await agent.run()
    
    print("\n=== Agent Task Complete ===")
    print(f"Result: {result}")

if __name__ == "__main__":
    asyncio.run(main())