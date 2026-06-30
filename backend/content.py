# content.py

CONTENT_CATALOG = [
    {"id": "h1", "root_driver": "Stress Load is the primary driver of the current state.", "title": "Box Breathing Reset", "time_required_min": 1, "environment": "Anywhere", "action": "Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 3 times."},
    {"id": "h2", "root_driver": "Social Isolation & Disconnection is the primary root driver.", "title": "The One-Text Pulse", "time_required_min": 1, "environment": "Anywhere", "action": "Send a simple message to an old friend: 'Hey, just saw something that reminded me of you!'"},
    {"id": "h3", "root_driver": "Low Emotional Wellbeing is a self-sustaining feedback loop.", "title": "The Wins Audit", "time_required_min": 3, "environment": "Desk", "action": "Write down exactly 3 micro-wins that went well today."},
    
    # --- NEW DIMENSIONS ---
    {"id": "h6", "root_driver": "Financial Stress is consuming cognitive bandwidth.", "title": "The Micro-Budget Check", "time_required_min": 5, "environment": "Desk", "action": "Log into your primary account. Check the balance. Write down exactly one expense you can delay until next week."},
    {"id": "h7", "root_driver": "Lack of Purpose/Meaning is driving systemic apathy.", "title": "The 'Why' Anchor", "time_required_min": 2, "environment": "Anywhere", "action": "Write down the name of one person who benefits from the work you do. Keep it visible."},
    {"id": "h8", "root_driver": "Lack of Agency/Efficacy is creating a feeling of being stuck.", "title": "The One-Thing Rule", "time_required_min": 1, "environment": "Anywhere", "action": "Write down one single task you have full control over today. Complete it before noon."}
]

def route_content(root_driver: str, max_time: int, environment: str) -> dict:
    candidates = [item for item in CONTENT_CATALOG if item["root_driver"] == root_driver]
    candidates = [item for item in candidates if item["time_required_min"] <= max_time]
    
    if environment != "Anywhere":
        specific_matches = [item for item in candidates if item["environment"] in [environment, "Anywhere"]]
        if specific_matches:
            candidates = specific_matches

    if candidates:
        return candidates[0]
        
    return {"title": "Universal Grounding Sequence", "action": "Take 3 slow, deep diaphragmatic breaths.", "time_required_min": 1, "environment": "Anywhere"}