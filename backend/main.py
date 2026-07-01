from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional

from scoring import calculate_pss10, calculate_ucla3, calculate_gse, calculate_promis, calculate_cfpb5, calculate_root_driver
from content import route_content
from llm import generate_user_narrative, generate_pulse_narrative

import os
from dotenv import load_dotenv
load_dotenv()

app = FastAPI(title="LEWIS 9D Core Engine + AI")

raw_frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
frontend_urls = [url.strip().rstrip('/') for url in raw_frontend_url.split(",")]

if "*" in frontend_urls:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=frontend_urls,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

from typing import List, Optional, Dict, Any

class PulseInput(BaseModel):
    who5: List[int] = Field(..., description="Exactly 5 scores")
    life_stability: str
    active_pressures: List[str]
    priority_rank: List[str]
    arrival_word: Optional[str] = None

class FullAssessmentInput(BaseModel):
    # Core valid scales
    who5: List[int] = Field(..., description="Exactly 5 scores (0-5)")
    pss10: List[int] = Field(..., description="Exactly 10 scores (0-4)")
    ucla3: List[int] = Field(..., description="Exactly 3 scores (0-2)")
    gse: List[int] = Field(..., description="Exactly 10 scores (0-3)")
    promis: List[int] = Field(..., description="Exactly 4 scores (0-4)")
    cfpb5: List[int] = Field(..., description="Exactly 5 scores (0-4)")
    
    # New valid scales
    diener: Optional[Dict[str, int]] = Field(default={})
    ins: Optional[int] = Field(default=None)
    swls: Optional[Dict[str, int]] = Field(default={})

    # Stage 1 Context
    ageCategory: Optional[str] = None
    gender: Optional[str] = None
    identityRoles: List[str] = Field(default=[])
    lifeStability: Optional[int] = None
    active_pressures: List[str] = Field(default=[])
    bodyMovement: Optional[str] = None
    sleepQuality: Optional[str] = None
    bodyContext: List[str] = Field(default=[])
    relationalContext: Optional[str] = None
    priority_rank: List[str] = Field(default=[])
    arrival_word: Optional[str] = None
    financialPulse: Dict[str, Any] = Field(default={})
    environmentalPulse: Dict[str, Any] = Field(default={})
    intellectualPulse: Optional[str] = None
    culturalBelonging: Dict[str, Any] = Field(default={})
    bodyRhythm: Dict[str, Any] = Field(default={})

    # Stage 3
    bodyMapZones: List[str] = Field(default=[])
    dayRhythmMap: List[int] = Field(default=[])
    breathingBefore: Optional[str] = None
    breathingAfter: Optional[str] = None
    nervousSystemState: Optional[str] = None
    body_awareness: Optional[str] = None

    # Stage 5
    lifeLandscape: Dict[str, List[str]] = Field(default={})
    adaptiveDeepDives: Dict[str, Any] = Field(default={})
    brightSpotCheck: Optional[str] = None
    priorityTensionCheck: Optional[str] = None

    # Stage 6 & 7
    everydaySharing: Dict[str, Any] = Field(default={})
    externalConditions: Dict[str, Any] = Field(default={})
    priorAttempts: Optional[str] = None
    aspirationLandscape: Optional[str] = None
    supportPreferences: List[str] = Field(default=[])
    plannerReadiness: Optional[str] = None
    valuesCheck: List[str] = Field(default=[])
    financialAspiration: Optional[str] = None

    # Stage 8 & 9
    energyArc: Dict[str, str] = Field(default={})
    stressPatternClusters: List[str] = Field(default=[])
    recoveryResponsiveness: Optional[str] = None
    cumulativeLoad: Dict[str, Any] = Field(default={})
    soundPreference: Optional[str] = None
    quickChoices: Dict[str, Any] = Field(default={})

    # Legacy fields mapping
    max_time_available: int = Field(default=5)
    current_environment: str = Field(default="Anywhere")
    friction: Optional[str] = None
    somatic_load: Optional[str] = None
    flags: List[str] = Field(default=[])

@app.get("/")
def read_root():
    return {"status": "success", "message": "LEWIS 9D Core Engine is Online"}

@app.post("/pulse/calculate")
def calculate_pulse(payload: PulseInput):
    scaled_score = sum(payload.who5) * 4
    if scaled_score >= 70:   band = "Thriving"
    elif scaled_score >= 55: band = "Steady"
    elif scaled_score >= 40: band = "Stretched"
    else:                    band = "Asking for care"
    
    diagnostic_package = {
        "primary_root_driver": "Unknown (Pulse Check)",
        "prescribed_habit": "Mindful Check-in",
        "action_steps": "Take a moment to breathe and observe your state.",
        "context": f"User is in {band} band with score {scaled_score}. Priorities: {', '.join(payload.priority_rank[:3])}. Pressures: {', '.join(payload.active_pressures)}."
    }
    
    ai_message = generate_pulse_narrative(diagnostic_package)
    
    # Estimate other domains based on overall wellbeing and pressures to populate the radar chart
    base_est = max(10, scaled_score - 10)
    
    return {
        "status": "success", 
        "metrics": {"who5_scaled_score": scaled_score, "wellbeing_band": band},
        "ai_narrative": ai_message,
        "cascade_analysis": {"primary_root_driver": "General Stress (Pulse Estimate)"},
        "bright_spot": "Overall Adaptability",
        "prescription": {
            "habit_title": "Mindful Check-in",
            "micro_action": "Take a moment to breathe and observe your state."
        },
        "dimensions": {
            "emotional_wellbeing": scaled_score,
            "stress_load": 100 - base_est, # API returns stress, frontend inverts it
            "connection_isolation": 100 - (base_est + 5),
            "agency_efficacy": base_est + 10,
            "purpose_meaning": base_est + 5,
            "financial_stress": 100 - (base_est - 5)
        }
    }

@app.post("/assessment/full")
def calculate_full_assessment(payload: FullAssessmentInput):
    try:
        pss10_res = calculate_pss10(payload.pss10)
        ucla3_res = calculate_ucla3(payload.ucla3)
        gse_res = calculate_gse(payload.gse)
        promis_res = calculate_promis(payload.promis)
        cfpb5_res = calculate_cfpb5(payload.cfpb5)
        
        # Optional new scales scoring
        from scoring import calculate_diener, calculate_ins, calculate_swls
        diener_res = calculate_diener(list(payload.diener.values())) if payload.diener and len(payload.diener) == 8 else None
        ins_res = calculate_ins([payload.ins]) if payload.ins is not None else None
        swls_res = calculate_swls(list(payload.swls.values())) if payload.swls and len(payload.swls) == 5 else None

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    who5_scaled = sum(payload.who5) * 4

    root_driver = calculate_root_driver(
        who5=who5_scaled,
        pss10=pss10_res["normalized_score"],
        ucla3=ucla3_res["normalized_score"],
        gse=gse_res["normalized_score"],
        promis=promis_res["normalized_score"],
        cfpb5=cfpb5_res["normalized_score"],
    )

    recommended_habit = route_content(root_driver, payload.max_time_available, payload.current_environment)

    # Calculate Bright Spot (Highest relative wellness score)
    wellness_scores = {
        "Overall Wellbeing": who5_scaled,
        "Emotional & Mental": 100 - pss10_res["normalized_score"],
        "Relationships & Social": 100 - ucla3_res["normalized_score"],
        "Accomplishment & Agency": gse_res["normalized_score"],
        "Meaning & Spiritual": promis_res["normalized_score"],
        "Financial Wellness": 100 - cfpb5_res["normalized_score"]
    }
    if diener_res: wellness_scores["Intellectual & Growth"] = diener_res["normalized_score"]
    if ins_res: wellness_scores["Environmental & Cultural"] = ins_res["normalized_score"]
    
    bright_spot = max(wellness_scores, key=wellness_scores.get)

    diagnostic_package = {
        "explicit_dimension_scores": {
            "Overall Wellbeing (WHO5)": who5_scaled,
            "Emotional & Mental": 100 - pss10_res["normalized_score"],
            "Relationships & Social": 100 - ucla3_res["normalized_score"],
            "Accomplishment & Agency": gse_res["normalized_score"],
            "Meaning & Spiritual": promis_res["normalized_score"],
            "Financial Wellness": 100 - cfpb5_res["normalized_score"],
            "Intellectual & Growth (Diener)": diener_res["normalized_score"] if diener_res else None,
            "Environmental (INS)": ins_res["normalized_score"] if ins_res else None,
            "Life Satisfaction (SWLS)": swls_res["normalized_score"] if swls_res else None,
        },
        "calculated_root_driver": root_driver,
        "context_inputs": {
            "ageCategory": payload.ageCategory,
            "identityRoles": payload.identityRoles,
            "lifeStability": payload.lifeStability,
            "active_pressures": payload.active_pressures,
            "priority_rank": payload.priority_rank,
            "arrival_word": payload.arrival_word,
            "bodyMovement": payload.bodyMovement,
            "sleepQuality": payload.sleepQuality,
            "bodyMapZones": payload.bodyMapZones,
            "dayRhythmMap": payload.dayRhythmMap,
            "nervousSystemState": payload.nervousSystemState,
            "adaptiveDeepDives": payload.adaptiveDeepDives,
            "everydaySharing": payload.everydaySharing,
            "externalConditions": payload.externalConditions,
            "stressPatternClusters": payload.stressPatternClusters,
            "energyArc": payload.energyArc,
        },
        "validation_flags": payload.flags,
        "prescribed_habit": recommended_habit["title"],
        "action_steps": recommended_habit["action"],
    }

    ai_message = generate_user_narrative(diagnostic_package)

    return {
        "status": "success",
        "cascade_analysis": {"primary_root_driver": root_driver},
        "bright_spot": bright_spot,
        "ai_narrative": ai_message,
        "prescription": {
            "habit_title": recommended_habit["title"],
            "micro_action": recommended_habit["action"],
        },
        "dimensions": {
            "emotional_wellbeing":  who5_scaled,
            "stress_load":          pss10_res["normalized_score"],
            "connection_isolation": ucla3_res["normalized_score"],
            "agency_efficacy":      gse_res["normalized_score"],
            "purpose_meaning":      promis_res["normalized_score"],
            "financial_stress":     cfpb5_res["normalized_score"],
        },
    }
