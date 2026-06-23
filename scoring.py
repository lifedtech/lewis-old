# scoring.py

def calculate_pss10(scores: list[int]) -> dict:
    if len(scores) != 10: raise ValueError("PSS-10 requires exactly 10 scores.")
    total_score = sum((4 - score) if i in [3, 4, 6, 7] else score for i, score in enumerate(scores))
    return {"raw_score": total_score, "normalized_score": round((total_score / 40) * 100, 1)}

def calculate_ucla3(scores: list[int]) -> dict:
    if len(scores) != 3: raise ValueError("UCLA-3 requires exactly 3 scores.")
    return {"raw_score": sum(scores), "normalized_score": round(((sum(scores) - 3) / 6) * 100, 1)}

def calculate_sqi(scores: list[int]) -> dict:
    if len(scores) != 4: raise ValueError("SQI requires exactly 4 scores.")
    return {"raw_score": sum(scores), "normalized_score": round((sum(scores) / 12) * 100, 1)}

# --- NEW: HELPER FOR THE REMAINING 5 DIMENSIONS ---
def calculate_standard_3q(scores: list[int]) -> dict:
    """Generic processor for standard 3-question, 0-4 scales."""
    if len(scores) != 3: raise ValueError("This instrument requires exactly 3 scores.")
    total_score = sum(scores)
    return {"raw_score": total_score, "normalized_score": round((total_score / 12) * 100, 1)}

# --- THE ULTIMATE 9D CASCADE ENGINE ---
def calculate_root_driver(who5: float, pss10: float, ucla3: float, sqi: float, pai: float, fsi: float, pmi: float, bwi: float, nhi: float) -> str:
    wellbeing_deficit = 100 - who5
    
    # Matrix Weights based on systemic impact
    pressures = {
        "Stress Load is the primary driver of the current state.": pss10 * 0.80,
        "Social Isolation & Disconnection is the primary root driver.": ucla3 * 0.85,
        "Chronic Sleep & Recovery Deficit is the primary driver.": sqi * 0.90,
        "Physical Sedentary Behavior is degrading biological baseline.": pai * 0.70,
        "Financial Stress is consuming cognitive bandwidth.": fsi * 0.75,
        "Lack of Purpose/Meaning is driving systemic apathy.": pmi * 0.65,
        "Burnout & Workload are exceeding recovery capacity.": bwi * 0.85,
        "Nutritional/Hydration Deficits are lowering systemic energy.": nhi * 0.60,
        "Low Emotional Wellbeing is a self-sustaining feedback loop.": wellbeing_deficit * 0.50
    }
    
    return max(pressures, key=pressures.get)