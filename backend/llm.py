# llm.py
import os
import logging
# pyrefly: ignore [missing-import]
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
 
# We set the base_url to Groq to test Llama-3 for free. 
# When you launch, you just change this URL to your RunPod Serverless endpoint!
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"), 
    base_url="https://api.groq.com/openai/v1"
)

def generate_user_narrative(diagnostic_data: dict) -> str:
    """
    Takes the raw JSON from our Matrix and asks Llama-3 to write a warm summary.
    """
    
    system_prompt = """
    Generate an empathetic, highly intelligent wellbeing summary addressed directly to the user.
    
    RULES:
    1. Acknowledge the user's Primary Root Driver with empathy (do not sound clinical).
    2. Gently introduce the prescribed Micro-Habit.
    3. Do NOT list raw scores or numbers. Treat them like a human, not a patient.
    4. CRITICAL: Do NOT use first-person pronouns ("I", "me", "my", "we", "us"). Do NOT refer to yourself as an AI or a system. Use objective framing or active gerunds.
    """
    
    # We turn the dictionary into a string so the AI can read it
    user_context = str(diagnostic_data)

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", # The exact model we discussed for RunPod!
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the user's latest data. Write their narrative: {user_context}"}
            ],
            temperature=0.7, # Adds a little bit of warmth/creativity
            max_tokens=150
        )
        return response.choices[0].message.content
        
    except Exception as e:
        logging.error(f"LLM Generation Error: {str(e)}")
        return "High traffic is currently preventing the generation of your AI narrative. Please try again later."