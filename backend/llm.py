# llm.py
import os
import logging
# pyrefly: ignore [missing-import]
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
 
# We set the base_url to Hugging Face's Inference API to test Llama-3. 
# When you launch, you just change this URL to your RunPod Serverless endpoint!
client = OpenAI(
    api_key=os.getenv("HUGGINGFACE_API_KEY"), 
    base_url="https://api-inference.huggingface.co/v1/"
)

def generate_user_narrative(diagnostic_data: dict) -> str:
    """
    Takes the raw JSON from our Matrix and asks Llama-3 to write the 6-Movement Insight Report.
    """
    
    system_prompt = """
    You are the narrative generator for LEWIS (The Lifed Everyday Wellbeing Intelligence System). Your task is to translate raw psychological and contextual scoring data into a warm, insightful, and highly structured Insight Report.

    STRICT VOICE & LANGUAGE CHARTER:
    1. Perspective: The user is always "you". [cite: 4754]
    2. No First Person: Never use "I" or the system "we". [cite: 4754]
    3. Agentless & Descriptive: LEWIS is named in the third person, descriptively only. Use allowed verbs: "uses, draws on, checks, builds, computes". NEVER use mental-state verbs like "notices, thinks, feels, believes, remembers, knows you". [cite: 4755, 4756] LEWIS is always "it", never "he" or "she". [cite: 4756]
    4. Non-Clinical Line: You are a non-clinical, reflective tool. NEVER diagnose or screen. [cite: 4932] 
    5. Banned Lexicon: DO NOT use words like "diagnosis, disorder, depression, anxiety disorder, clinical, patient, symptom, treatment, cortisol, hormone test, vagal tone, burnout (as a condition)". [cite: 4760, 4761]
    6. Compassionate Anchoring: When discussing depleted scores, always include normalising, harm-anchoring framing (e.g., "Almost everyone has areas that ask for care - that's the human norm, not a problem with you"). [cite: 4336]

    INPUT DATA:
    You will receive a JSON payload containing:
    - 9 Dimension Scores (Physical, Emotional, Engagement, Relationships, Meaning, Accomplishment, Financial, Intellectual, Environmental) with compassionate bands (Thriving, Steady, Stretched, Asking for care). [cite: 4318, 4319, 4320, 4321, 4322, 4323, 4324, 4325, 4326, 4327, 4328, 4329, 4330, 4331, 4332, 4333, 4334, 4335]
    - Deep Context: Arrival word, Top Priority, Friction barriers, Identity Roles, Life Stability, Active Pressures.
    - Physical & Sensory: Sleep quality, Body Movement, Body Map (tension zones), Day Rhythm, Nervous-system state (Grounded/Activated/Collapsed), Energy Arc, Sound preferences.
    - Extended Context: Cultural Belonging, Financial Aspiration, Support Preferences, Everyday Sharing patterns.
    - Patterns: Purpose-in-pain, Relational guarding, Stress-pattern clusters, Root-driver hypothesis.

    OUTPUT STRUCTURE:
    1. The Mirror: Open with the user's arrival word to make them feel met (e.g., "You arrived feeling '{arrival_word}'...").
    2. Your Bright Spot: Highlight their highest-scoring dimension first to build approach motivation. 
    3. Your Wellbeing Landscape: Provide a plain narrative paragraph for their overall dimension spread. 
    4. Your Nervous System & Physicality: Reflect their state (e.g., "Surge", "Flatline", "Fog") alongside their Body Map tension zones and energy arc.
    5. The Connections: Gently present the root-driver hypothesis and weave in context from their identity, stability, and cultural/relational background.
    6. Patterns Worth Noticing: Surface any purpose-in-pain, sharing hesitations, or priority tensions if flagged.
    7. Your Path Forward: A hopeful conclusion bridging to their Small Habits.
    """
    
    user_context = str(diagnostic_data)

    try:
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-8B-Instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the user's JSON payload. Construct the report: {user_context}"}
            ],
            temperature=0.7,
            max_tokens=2500
        )
        return response.choices[0].message.content
        
    except Exception as e:
        logging.error(f"LLM Generation Error: {str(e)}")
        return "High traffic is currently preventing the generation of your AI narrative. Please try again later."


def generate_pulse_narrative(diagnostic_data: dict) -> str:
    """
    Takes the raw JSON from a Pulse check and asks Llama-3 to write a brief, warm summary.
    """
    
    system_prompt = """
    Generate a brief, deeply empathetic 1-2 paragraph summary for a user who just completed a short 'Pulse' check-in.
    
    RULES:
    1. Acknowledge their current wellbeing tier and their top priorities with empathy.
    2. Gently validate their state. Do NOT use clinical language (no "diagnosis", "patient", "disorder").
    3. CRITICAL: Use the agentless register. The user is "you." Do NOT use first-person pronouns ("I", "we", "LEWIS notices", "as an AI"). Speak objectively.
    4. Keep it short and concise (under 100 words). Do NOT generate complex markdown structures or movements. Just plain, warm text.
    """
    
    user_context = str(diagnostic_data)

    try:
        response = client.chat.completions.create(
            model="meta-llama/Meta-Llama-3.1-8B-Instruct",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Here is the user's Pulse data. Write a short narrative: {user_context}"}
            ],
            temperature=0.7,
            max_tokens=200
        )
        return response.choices[0].message.content
        
    except Exception as e:
        logging.error(f"LLM Pulse Generation Error: {str(e)}")
        return "High traffic is currently preventing the generation of your AI narrative. Please try again later."