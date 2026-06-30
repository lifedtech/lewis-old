# scoring.py

def calculate_pss10(scores: list[int]) -> dict:
    if len(scores) != 10: raise ValueError("PSS-10 requires exactly 10 scores.")
    total_score = sum((4 - score) if i in [3, 4, 6, 7] else score for i, score in enumerate(scores))
    return {"raw_score": total_score, "normalized_score": round((total_score / 40) * 100, 1)}

def calculate_ucla3(scores: list[int]) -> dict:
    if len(scores) != 3: raise ValueError("UCLA-3 requires exactly 3 scores.")
    return {"raw_score": sum(scores), "normalized_score": round((sum(scores) / 6) * 100, 1)} # 0-indexed: max 6

def calculate_gse(scores: list[int]) -> dict:
    if len(scores) != 10: raise ValueError("GSE requires exactly 10 scores.")
    total_score = sum(scores)
    return {"raw_score": total_score, "normalized_score": round((total_score / 30) * 100, 1)}

def calculate_promis(scores: list[int]) -> dict:
    if len(scores) != 4: raise ValueError("PROMIS requires exactly 4 scores.")
    total_score = sum(scores)
    return {"raw_score": total_score, "normalized_score": round((total_score / 16) * 100, 1)}

def calculate_cfpb5(scores: list[int]) -> dict:
    if len(scores) != 5: raise ValueError("CFPB-5 requires exactly 5 scores.")
    # Calculate financial STRESS
    # 0, 1, 2: 0=Describes completely (high stress)
    # 3: 0=Always (low stress)
    # 4: 0=Always (high stress)
    stress_points = (4 - scores[0]) + (4 - scores[1]) + (4 - scores[2]) + scores[3] + (4 - scores[4])
    return {"raw_score": stress_points, "normalized_score": round((stress_points / 20) * 100, 1)}

# --- THE ULTIMATE ENGINE ---
def calculate_root_driver(who5: float, pss10: float, ucla3: float, gse: float, promis: float, cfpb5: float) -> str:
    wellbeing_deficit = 100 - who5
    agency_deficit = 100 - gse
    meaning_deficit = 100 - promis
    
    # Matrix Weights based on systemic impact
    pressures = {
        "Stress Load is the primary driver of the current state.": pss10 * 0.80,
        "Social Isolation & Disconnection is the primary root driver.": ucla3 * 0.85,
        "Financial Stress is consuming cognitive bandwidth.": cfpb5 * 0.75,
        "Lack of Agency/Efficacy is creating a feeling of being stuck.": agency_deficit * 0.70,
        "Lack of Purpose/Meaning is driving systemic apathy.": meaning_deficit * 0.65,
        "Low Emotional Wellbeing is a self-sustaining feedback loop.": wellbeing_deficit * 0.50
    }
    
    return max(pressures, key=pressures.get)