from browser_use import Agent, ChatGoogle
from dotenv import load_dotenv
import asyncio

load_dotenv()

llm = ChatGoogle(model='gemini-2.5-flash-lite')

async def test():
    url = "https://algo-flow-roan.vercel.app"
    
    task = f"""
    Navigate to the provided {url}
    Scroll down slowly and identify all sections
    Leave some time between scrolls to let the agent take screenshots
    """
    
    agent =  Agent(task=task, llm=llm)
    
    result = await agent.run()
    
    print(result.screenshot_paths())
    
if __name__ == '__main__':
    asyncio.run(test())

