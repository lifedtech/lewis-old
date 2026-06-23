from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

# IMPORT ALL LOGIC
from scoring import calculate_pss10, calculate_ucla3, calculate_sqi, calculate_standard_3q, calculate_root_driver
from content import route_content

# IMPORT YOUR NEW AI WRAPPER
from llm import generate_user_narrative

# --- THIS IS THE LINE THAT WAS MISSING! ---
app = FastAPI(title="LEWIS 9D Core Engine + AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PulseInput(BaseModel):
    who5: List[int] = Field(..., description="Exactly 5 scores")
    life_stability: str
    active_pressures: List[str]
    priority_rank: List[str]
    arrival_word: Optional[str] = None

class FullAssessmentInput(BaseModel):
    who5: List[int] = Field(..., description="Exactly 5 scores (0-5)")
    pss10: List[int] = Field(..., description="Exactly 10 scores (0-4)")
    ucla3: List[int] = Field(..., description="Exactly 3 scores (1-3)")
    sqi: List[int] = Field(..., description="Exactly 4 scores (0-3)")
    pai3: List[int] = Field(..., description="Exactly 3 scores (0-4) - Physical")
    fsi3: List[int] = Field(..., description="Exactly 3 scores (0-4) - Financial")
    pmi3: List[int] = Field(..., description="Exactly 3 scores (0-4) - Purpose")
    bwi3: List[int] = Field(..., description="Exactly 3 scores (0-4) - Burnout")
    nhi3: List[int] = Field(..., description="Exactly 3 scores (0-4) - Nutrition")
    max_time_available: int = Field(default=5)
    current_environment: str = Field(default="Anywhere")

@app.get("/")
def read_root(): return {"status": "success", "message": "LEWIS 9D Core Engine is Online"}

@app.post("/pulse/calculate")
def calculate_pulse(payload: PulseInput):
    scaled_score = sum(payload.who5) * 4
    if scaled_score >= 70: band = "Thriving"
    elif scaled_score >= 55: band = "Steady"
    elif scaled_score >= 40: band = "Stretched"
    else: band = "Asking for care"
    return {"status": "success", "metrics": {"who5_scaled_score": scaled_score, "wellbeing_band": band}}

@app.post("/assessment/full")
def calculate_full_assessment(payload: FullAssessmentInput):
    try:
        pss10_res = calculate_pss10(payload.pss10)
        ucla3_res = calculate_ucla3(payload.ucla3)
        sqi_res = calculate_sqi(payload.sqi)
        pai_res = calculate_standard_3q(payload.pai3)
        fsi_res = calculate_standard_3q(payload.fsi3)
        pmi_res = calculate_standard_3q(payload.pmi3)
        bwi_res = calculate_standard_3q(payload.bwi3)
        nhi_res = calculate_standard_3q(payload.nhi3)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    who5_scaled = sum(payload.who5) * 4

    root_driver = calculate_root_driver(
        who5=who5_scaled, pss10=pss10_res["normalized_score"], ucla3=ucla3_res["normalized_score"],
        sqi=sqi_res["normalized_score"], pai=pai_res["normalized_score"], fsi=fsi_res["normalized_score"],
        pmi=pmi_res["normalized_score"], bwi=bwi_res["normalized_score"], nhi=nhi_res["normalized_score"]
    )

    recommended_habit = route_content(root_driver, payload.max_time_available, payload.current_environment)

    # 1. CREATE THE DATA PACKAGE FOR THE AI
    diagnostic_package = {
        "primary_root_driver": root_driver,
        "prescribed_habit": recommended_habit["title"],
        "action_steps": recommended_habit["action"]
    }

    # 2. ASK LLAMA-3 TO WRITE THE NARRATIVE
    ai_message = generate_user_narrative(diagnostic_package)

    return {
        "status": "success",
        "cascade_analysis": {"primary_root_driver": root_driver},
        "ai_narrative": ai_message, # <-- THE AI RESULT IS APPENDED HERE
        "prescription": {
            "habit_title": recommended_habit["title"],
            "micro_action": recommended_habit["action"]
        },
        "dimensions": {
            "emotional_wellbeing": who5_scaled,
            "stress_load": pss10_res["normalized_score"],
            "connection_isolation": ucla3_res["normalized_score"],
            "sleep_recovery": sqi_res["normalized_score"],
            "physical_activity": pai_res["normalized_score"],
            "financial_peace": fsi_res["normalized_score"],
            "purpose_meaning": pmi_res["normalized_score"],
            "burnout_workload": bwi_res["normalized_score"],
            "nutrition_hydration": nhi_res["normalized_score"]
        }
    }