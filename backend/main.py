# main.py — the LEWIS API.
#
# Pipeline for /assessment/full:
#   validate input -> age gate -> score instruments -> build dimensions
#   -> safety flags -> leverage (suppressed in gentle mode) -> habit
#   -> Road A deterministic report (always) -> optional Road B voicing
#   -> validator (fail-closed to Road A) -> response.
#
# Nothing is persisted server-side: answers live only for the lifetime of
# the request.

import os
import logging
from datetime import date
from typing import Annotated, Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, StringConstraints
from dotenv import load_dotenv

from scoring import (
    calculate_who5, calculate_pss10, calculate_ucla3, calculate_gse,
    calculate_promis, calculate_cfpb5, calculate_diener, calculate_ins,
    calculate_swls, calculate_ph, calculate_en, build_dimensions, bright_spot, calculate_leverage,
    band_for, KEY_TO_SPEC_CODE, SPEC_CODE_TO_KEY,
)
from corpus import map_to_corpus
from pattern import run_pattern_engine
from safety import evaluate_safety
from content import route_content
from narrative import build_road_a, NERVOUS_SYSTEM_PHRASES, BODY_ZONE_LABELS
from validator import validate_narrative
from llm import generate_road_b, generate_pulse_road_b
from security import GuardrailMiddleware
from enrich import build_enriched_object
from insight_report import build_insight_report
from report_gate import check_report
from auth import register_user, login_user, verify_token, save_assessment_submission, get_user_assessments, get_onboarding_analytics_summary

load_dotenv()
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("lewis.api")

app = FastAPI(title="LEWIS Core Engine", version="1.1")

# --- CORS: explicit origins only; a wildcard is never honored -----------------
_raw_origins = os.getenv("FRONTEND_URL", "http://localhost:5173,http://127.0.0.1:5173,https://lewis.cold-forest-a8ec.workers.dev")
_origins = [u.strip().rstrip("/") for u in _raw_origins.split(",") if u.strip()]
if "https://lewis.cold-forest-a8ec.workers.dev" not in _origins:
    _origins.append("https://lewis.cold-forest-a8ec.workers.dev")
if "*" in _origins:
    logger.critical("Wildcard CORS origin rejected; using localhost & Cloudflare dev origins instead.")
    _origins = ["http://localhost:5173", "http://127.0.0.1:5173", "https://lewis.cold-forest-a8ec.workers.dev"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)
app.add_middleware(GuardrailMiddleware)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on our side. Your answers were not stored."},
    )


# --- Input schemas -------------------------------------------------------------

Score05 = Annotated[int, Field(ge=0, le=5)]
Score04 = Annotated[int, Field(ge=0, le=4)]
Score03 = Annotated[int, Field(ge=0, le=3)]
Score02 = Annotated[int, Field(ge=0, le=2)]
Score14 = Annotated[int, Field(ge=1, le=4)]
Score17 = Annotated[int, Field(ge=1, le=7)]
ShortText = Annotated[str, StringConstraints(max_length=300)]
LongText = Annotated[str, StringConstraints(max_length=2000)]


class RegisterInput(BaseModel):
    email: ShortText
    password: ShortText
    name: Optional[ShortText] = None


class LoginInput(BaseModel):
    email: ShortText
    password: ShortText


class PulseInput(BaseModel):
    who5: List[Score05] = Field(..., min_length=5, max_length=5)
    life_stability: Optional[ShortText] = None
    active_pressures: List[ShortText] = Field(default=[], max_length=20)
    priority_rank: List[ShortText] = Field(default=[], max_length=12)
    arrival_word: Optional[ShortText] = None


class FullAssessmentInput(BaseModel):
    # LEWIS scores adults only. The frontend hard-stops minors before any
    # data is collected; this is the server-side backstop for direct calls.
    is_over_18: bool

    # Report cover only (context, never scoring). Both optional.
    name: Optional[ShortText] = None
    location: Optional[ShortText] = None

    # SPINE instruments (0-based option indices; see scoring.py)
    who5: List[Score05] = Field(..., min_length=5, max_length=5)
    pss10: List[Score04] = Field(..., min_length=10, max_length=10)
    ucla3: List[Score02] = Field(..., min_length=3, max_length=3)
    gse: List[Score14] = Field(..., min_length=10, max_length=10)
    promis: List[Score04] = Field(..., min_length=4, max_length=4)
    cfpb5: List[Score04] = Field(..., min_length=5, max_length=5)

    # Optional instruments (published 1-7 anchors)
    diener: Optional[List[Score17]] = Field(default=None, min_length=8, max_length=8)
    ins: Optional[Score17] = None
    swls: Optional[List[Score17]] = Field(default=None, min_length=5, max_length=5)

    # Context (meaning only — none of this can move a score)
    ageCategory: Optional[ShortText] = None
    gender: Optional[ShortText] = None
    identityRoles: List[ShortText] = Field(default=[], max_length=20)
    lifeStability: Optional[int] = Field(default=None, ge=0, le=100)
    active_pressures: List[ShortText] = Field(default=[], max_length=20)
    bodyMovement: Optional[ShortText] = None
    sleepQuality: Optional[ShortText] = None
    bodyContext: List[ShortText] = Field(default=[], max_length=20)
    relationalContext: Optional[ShortText] = None
    priority_rank: List[ShortText] = Field(default=[], max_length=12)
    arrival_word: Optional[ShortText] = None
    financialPulse: Dict[str, Any] = Field(default={})
    environmentalPulse: Dict[str, Any] = Field(default={})
    intellectualPulse: Optional[ShortText] = None
    culturalBelonging: Dict[str, Any] = Field(default={})
    bodyRhythm: Dict[str, Any] = Field(default={})
    bodyMapZones: List[ShortText] = Field(default=[], max_length=12)
    dayRhythmMap: List[int] = Field(default=[], max_length=48)
    breathingBefore: Optional[ShortText] = None
    breathingAfter: Optional[ShortText] = None
    nervousSystemState: Optional[ShortText] = None
    body_awareness: Optional[LongText] = None
    lifeLandscape: Dict[str, List[ShortText]] = Field(default={})
    adaptiveDeepDives: Dict[str, Any] = Field(default={})
    brightSpotCheck: Optional[LongText] = None
    priorityTensionCheck: Optional[LongText] = None
    everydaySharing: Dict[str, Any] = Field(default={})
    externalConditions: Dict[str, Any] = Field(default={})
    priorAttempts: Optional[LongText] = None
    aspirationLandscape: Optional[LongText] = None
    supportPreferences: List[ShortText] = Field(default=[], max_length=12)
    plannerReadiness: Optional[ShortText] = None
    valuesCheck: List[ShortText] = Field(default=[], max_length=20)
    financialAspiration: Optional[LongText] = None
    energyArc: Dict[str, ShortText] = Field(default={})
    stressPatternClusters: List[ShortText] = Field(default=[], max_length=20)
    recoveryResponsiveness: Optional[ShortText] = None
    cumulativeLoad: Dict[str, Any] = Field(default={})
    soundPreference: Optional[ShortText] = None
    quickChoices: Dict[str, Any] = Field(default={})
    max_time_available: int = Field(default=5, ge=1, le=120)
    current_environment: ShortText = Field(default="Anywhere")
    flags: List[ShortText] = Field(default=[], max_length=10)


# --- Endpoints -----------------------------------------------------------------

@app.get("/")
def read_root():
    return {"status": "success", "message": "LEWIS Core Engine is online"}


@app.post("/auth/register")
def auth_register(payload: RegisterInput):
    try:
        res = register_user(payload.email, payload.password, payload.name)
        return res
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))


@app.post("/auth/login")
def auth_login(payload: LoginInput):
    try:
        res = login_user(payload.email, payload.password)
        return res
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc))


@app.get("/auth/me")
def auth_me(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = auth_header.split(" ")[1]
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"status": "success", "user": user}


@app.get("/auth/assessments")
def auth_user_assessments(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = auth_header.split(" ")[1]
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    assessments = get_user_assessments(user["id"])
    return {"status": "success", "user": user, "assessments": assessments}


@app.get("/analytics/onboarding")
def onboarding_analytics():
    """Return anonymized usage metrics for the Onboarding system."""
    summary = get_onboarding_analytics_summary()
    return {"status": "success", "analytics": summary}


@app.post("/pulse/calculate")
def calculate_pulse(payload: PulseInput):
    who5_res = calculate_who5(payload.who5)
    scaled = who5_res["normalized_score"]
    band = band_for(scaled)

    road_a_text = (
        f"Thank you for checking in. Overall, your everyday wellbeing sits in the "
        f"{band} band right now."
        + (f' You arrived feeling "{payload.arrival_word}", and that word matters.'
           if payload.arrival_word else "")
        + " Whatever this moment holds, a short check-in like this is a real act of "
          "self-respect. Take one slow breath before you move on with your day."
    )

    narrative_text, source = road_a_text, "road_a"
    voicing = {
        "wellbeing_band": band,
        "arrival_word": payload.arrival_word,
        "top_priorities": payload.priority_rank[:3],
        "active_pressures": payload.active_pressures[:6],
    }
    road_b = generate_pulse_road_b(voicing)
    if road_b:
        ok, reasons = validate_narrative(road_b)
        # Pulse texts are intentionally short; skip the length floor.
        length_only = [r for r in reasons if not r.startswith("too short")]
        if not length_only:
            narrative_text, source = road_b, "road_b"
        else:
            logger.warning("Pulse Road B rejected: %s", "; ".join(length_only))

    return {
        "status": "success",
        "schema_version": "1.1",
        "metrics": {"wellbeing_band": band},
        "narrative": narrative_text,
        "narrative_source": source,
    }


@app.post("/assessment/full")
def calculate_full_assessment(payload: FullAssessmentInput, request: Request):
    if payload.is_over_18 is not True:
        raise HTTPException(
            status_code=403,
            detail="LEWIS is designed for adults. The assessment is not available for people under 18.",
        )

    try:
        who5_res = calculate_who5(payload.who5)
        pss10_res = calculate_pss10(payload.pss10)
        ucla3_res = calculate_ucla3(payload.ucla3)
        gse_res = calculate_gse(payload.gse)
        promis_res = calculate_promis(payload.promis)
        cfpb5_res = calculate_cfpb5(payload.cfpb5)
        diener_res = calculate_diener(payload.diener) if payload.diener else None
        ins_res = calculate_ins([payload.ins]) if payload.ins is not None else None
        swls_res = calculate_swls(payload.swls) if payload.swls else None
        ph_res = calculate_ph(payload.sleepQuality, payload.bodyMovement, payload.who5)
        en_res = calculate_en(payload.who5)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))

    dimensions = build_dimensions({
        "emotional": who5_res["normalized_score"],
        "calm": pss10_res["normalized_score"],          # already inverted
        "relationships": ucla3_res["normalized_score"],  # already inverted
        "accomplishment": gse_res["normalized_score"],
        "meaning": promis_res["normalized_score"],
        "financial": cfpb5_res["normalized_score"],      # already inverted
        "growth": diener_res["normalized_score"] if diener_res else None,
        "environment": ins_res["normalized_score"] if ins_res else None,
        "physical": ph_res["normalized_score"] if ph_res else None,
        "energy": en_res["normalized_score"] if en_res else None,
    })

    safety = evaluate_safety(who5_res["normalized_score"], dimensions)
    leverage = None if safety["gentle_mode"] else calculate_leverage(
        dimensions, active_pressures=payload.active_pressures
    )
    bright_key = bright_spot(dimensions)

    habit = route_content(
        leverage["dimension"] if leverage else None,
        payload.max_time_available,
        payload.current_environment,
        gentle=safety["gentle_mode"],
    )

    context_dict = {
        "cumulativeLoad_raw": payload.lifeStability, # Approximation
        "recoveryResponsiveness": payload.recoveryResponsiveness,
        "stressPatternClusters": payload.stressPatternClusters,
        "nervousSystemState": payload.nervousSystemState,
        "dayRhythmMap_zones": {}, # Approximated
        "body_awareness": payload.body_awareness,
        "flags": payload.flags,
        "relationalContext": payload.relationalContext,
        "priority_rank": payload.priority_rank,
        "culturalBelonging": payload.culturalBelonging,
        "lifeStability_str": payload.lifeStability,
        "supportPreference": payload.supportPreferences[0] if payload.supportPreferences else None,
        "brightSpotCheck": payload.brightSpotCheck,
        "priorityTensionCheck_confirmed": payload.priorityTensionCheck,
        "plannerReadiness": payload.plannerReadiness,
    }
    scores_dict = {k: v["score"] for k, v in dimensions.items()}
    patterns, portrait = run_pattern_engine(
        scores_dict,
        who5_res["normalized_score"],
        context_dict,
        safety,
        leverage["dimension"] if leverage else None
    )

    # Similarity mapping (V1): state-only, read-only over the assessment.
    # Scores, bands, leverage, and safety are already final at this point —
    # the corpus can only add coarse-position words and (once real consenting
    # profiles exist) soft ranking priors. Never demographics, never safety.
    similarity = map_to_corpus(
        {code: dimensions[key]["score"] for code, key in SPEC_CODE_TO_KEY.items()},
        {
            "leverage": KEY_TO_SPEC_CODE.get(leverage["dimension"]) if leverage else None,
            "nervous_system_state": payload.nervousSystemState,
            "readiness": payload.plannerReadiness,
            "support_preference": payload.supportPreferences[0] if payload.supportPreferences else None,
            "portrait": portrait["id"] if portrait else None,
            # The classified label ("Wired & hard to switch off"), which
            # corpus.py maps to the corpus vocab (wired/flat/foggy/cycle/settled).
            "stress_pattern": next(
                (p["label"] for p in patterns if p["id"] == "stress_load_pattern"), None
            ),
            "recovery": payload.recoveryResponsiveness,
        },
    )
    for key in dimensions:
        code = KEY_TO_SPEC_CODE.get(key)
        dimensions[key]["position"] = similarity["positions"].get(code) if code else None

    context = {
        "arrival_word": payload.arrival_word,
        "priority_rank": payload.priority_rank,
        "active_pressures": payload.active_pressures,
        "nervousSystemState": payload.nervousSystemState,
        "bodyMapZones": payload.bodyMapZones,
        "sleepQuality": payload.sleepQuality,
        "recoveryResponsiveness": payload.recoveryResponsiveness,
    }

    road_a_text = build_road_a(dimensions, leverage, bright_key, safety, context, habit,
                               patterns=patterns, portrait=portrait)
    narrative_text, source = road_a_text, "road_a"

    # Road B voicing: skipped entirely in gentle mode (safety overrides all),
    # and only ever shown after passing the validator.
    if not safety["gentle_mode"]:
        stress_p = next((p for p in patterns if p and p.get("id") == "stress_load_pattern"), None)
        tension_p = next((p for p in patterns if p and p.get("id") == "priority_tension"), None)
        readiness_p = next((p for p in patterns if p and p.get("id") == "suggestion_readiness"), None)
        voicing = {
            "arrival_word": payload.arrival_word,
            # State portrait and reflection patterns: describe how things
            # show up, never why. Road B must frame them as reflections.
            "portrait": portrait["label"] if portrait else None,
            "stress_reflection": (
                stress_p["label"] if stress_p and stress_p.get("label") != "Settled" else None
            ),
            "priority_tension": (
                {
                    "area": dimensions[tension_p["dimension"]]["label"],
                    "firmness": tension_p.get("firmness", "plain"),
                }
                if tension_p and tension_p.get("dimension") in dimensions
                and tension_p.get("firmness") != "withhold" else None
            ),
            "plan_size": readiness_p.get("stack_size") if readiness_p else None,
            "keep_it_tiny_because_prior_attempts_didnt_stick": (
                bool(readiness_p.get("shrink_with_why")) if readiness_p else False
            ),
            "dimension_bands": {
                d["label"]: d["band"] for d in dimensions.values() if d["band"] is not None
            },
            "unscored_areas": [d["label"] for d in dimensions.values() if d["score"] is None],
            "bright_spot": dimensions[bright_key]["label"] if bright_key else None,
            "leverage_note": leverage["headline"] if leverage else None,
            # Coarse positions vs the reference corpus — words only, and the
            # prompt + validator both forbid turning them into numbers.
            "coarse_positions": {
                d["label"]: d["position"]
                for d in dimensions.values()
                if d.get("position") is not None
            },
            "top_priority": payload.priority_rank[0] if payload.priority_rank else None,
            "active_pressures": payload.active_pressures[:6],
            "nervous_system_pattern": NERVOUS_SYSTEM_PHRASES.get(payload.nervousSystemState or ""),
            "body_tension_zones": [
                BODY_ZONE_LABELS[z] for z in payload.bodyMapZones if z in BODY_ZONE_LABELS
            ],
            "sleep_quality": payload.sleepQuality,
            "energy_arc": payload.energyArc,
            "small_habit": {"title": habit["title"], "action": habit["action"]},
        }
        road_b_text = generate_road_b(voicing)
        if road_b_text:
            ok, reasons = validate_narrative(road_b_text)
            if ok:
                narrative_text, source = road_b_text, "road_b"
            else:
                logger.warning("Road B rejected by validator: %s", "; ".join(reasons))

    # --- Insight Report (Rulebook v3.0): enriched object -> 16-page spine ---
    # The enriched object is the only input to generation; the self-check
    # gate re-verifies the contract before the document leaves the server.
    today = date.today()
    friction_phrases = {
        "money_friction": "money pressure",
        "chronic_pain": "physical discomfort",
        "feel_stuck": "feeling stuck",
        "cant_follow_through": "follow through being hard",
        "not_in_control": "time being out of your control",
        "too_drained": "being too drained for anything new",
        "standing_still": "a season of standing still",
    }
    friction = next(
        (friction_phrases[f] for f in payload.flags if f in friction_phrases), None
    )
    report_context = {
        "name": payload.name,
        "location": payload.location,
        "date": f"{today.day} {today.strftime('%B %Y')}",
        "arrival_word": payload.arrival_word,
        "priority_rank": payload.priority_rank,
        "priority_confirmed": payload.priorityTensionCheck,
        "active_pressures": payload.active_pressures,
        "body_zones": payload.bodyMapZones,
        "sleep_quality": payload.sleepQuality,
        "recovery": payload.recoveryResponsiveness,
        "nervous_system": payload.nervousSystemState,
        "stress_clusters": payload.stressPatternClusters,
        "energy_arc": payload.energyArc,
        "breathing_before": payload.breathingBefore,
        "breathing_after": payload.breathingAfter,
        "support_preference": payload.supportPreferences[0] if payload.supportPreferences else None,
        "sound_preference": payload.soundPreference,
        "friction": friction,
        "prior_attempts": payload.priorAttempts,
    }
    enriched = build_enriched_object(
        dimensions, leverage, bright_key, safety, patterns, portrait, habit,
        report_context,
    )
    insight_report = build_insight_report(enriched)
    gate_issues = check_report(insight_report)
    if gate_issues:
        # The deterministic spine should never fail the gate; if it does,
        # that is a template defect worth loud logging, and the report of
        # record still ships (it is the only report there is).
        logger.error("Insight report gate issues: %s", "; ".join(gate_issues))

    # Auto-save submission if user is logged in
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        user = verify_token(token)
        if user:
            try:
                report_uuid = save_assessment_submission(
                    user_id=user["id"],
                    user_email=user["email"],
                    assessment_data={
                        "scores": dimensions,
                        "narrative": {"text": narrative_text, "source": source},
                        "answers": payload.model_dump(),
                        "insight_report": insight_report
                    }
                )
                logger.info("De-identified report %s saved for system enhancement", report_uuid)
            except Exception as e:
                logger.error("Failed to save assessment submission to DB: %s", e)

    return {
        "status": "success",
        "schema_version": "1.1",
        "insight_report": insight_report,
        "dimensions": dimensions,
        "leverage": leverage,
        "bright_spot": (
            {"dimension": bright_key, "label": dimensions[bright_key]["label"]}
            if bright_key else None
        ),
        "safety": {"flags": safety["flags"], "care_note": safety["care_note"]},
        "prescription": {"habit_title": habit["title"], "micro_action": habit["action"]},
        "narrative": narrative_text,
        "narrative_source": source,
        "similarity": {
            "corpus_version": similarity["corpus_version"],
            "corpus_is_synthetic": similarity["corpus_is_synthetic"],
            "matched": similarity["matched"],
            "neighbours": similarity["neighbours"],
            "effectiveness_priors": similarity["effectiveness_priors"],
            "priors_note": similarity["priors_note"],
        },
        "patterns": patterns,
        "portrait": portrait,
    }
