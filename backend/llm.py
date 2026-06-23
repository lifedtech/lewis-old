# llm.py
from openai import OpenAI

# We set the base_url to Groq to test Llama-3 for free. 
# When you launch, you just change this URL to your RunPod Serverless endpoint!
client = OpenAI(
    api_key="REDACTED_GROQ_API_KEY", 
    base_url="https://api.groq.com/openai/v1"
)

def generate_user_narrative(diagnostic_data: dict) -> str:
    """
    Takes the raw JSON from our Matrix and asks Llama-3 to write a warm summary.
    """
    
    system_prompt = """
    You are the LEWIS Engine, an empathetic, highly intelligent wellbeing AI. 
    You are speaking directly to the user.
    
    Your goal is to translate the clinical JSON data provided into a warm, validating, 
    and conversational short paragraph (maximum 3 to 4 sentences).
    
    RULES:
    1. Acknowledge their Primary Root Driver with empathy (do not sound clinical).
    2. Gently introduce their prescribed Micro-Habit.
    3. Do NOT list raw scores or numbers. Treat them like a human, not a patient.
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
        return f"AI Generation Error: {str(e)}"