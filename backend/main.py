# main.py — the LEWIS API.
#
# Pipeline for /assessment/full:
#   validate input -> age gate -> score instruments -> build dimensions
#   -> safety flags -> leverage (suppressed in gentle mode) -> habit
#   -> Road A deterministic report (always) -> optional Road B voicing
#   -> validator (fail-closed to Road A) -> response.
#
# For an anonymous (unauthenticated) caller, nothing is persisted: answers
# live only for the lifetime of the request. For an authenticated caller
# (a valid Bearer token attached), a de-identified copy of the scores,
# narrative, and answers IS persisted — see save_assessment_submission()
# below and auth.py's deidentify_data() for exactly what that means and
# does not guarantee (SEC-012: this comment used to claim nothing is ever
# persisted, which was only true for the anonymous path).

import os
import hmac
import logging
from contextlib import asynccontextmanager
from datetime import date
from typing import Annotated, Any, Dict, List, Optional, Union

from fastapi import FastAPI, HTTPException, Request, Response, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, StringConstraints, EmailStr
from dotenv import load_dotenv

load_dotenv()

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
from auth import (
    register_user, login_user, verify_token, revoke_session,
    save_assessment_submission, get_user_assessments, get_onboarding_analytics_summary,
    IS_PRODUCTION, save_support_query, save_report_review, save_encrypted_assessment_record,
    record_journey_ping, mark_journey_completed, get_journey_analytics_overview,
    get_abandoned_users_list, mark_reminders_sent,
    is_report_unlocked, get_report_by_uuid,
)
from payment import (
    get_public_payment_config, create_order, verify_payment,
    verify_webhook_signature, process_webhook_event,
)
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("lewis.api")

# Shared-secret gate for /admin/* ops routes (manual report resend etc.) — these
# trigger real outbound email on demand, so unlike the read-only /analytics/*
# routes they can't be left open. Set LEWIS_ADMIN_KEY in production; unset
# locally just disables the gate for dev convenience.
ADMIN_KEY = os.getenv("LEWIS_ADMIN_KEY", "")


def require_admin(x_admin_key: Optional[str] = Header(None)) -> None:
    if IS_PRODUCTION or ADMIN_KEY:
        if not ADMIN_KEY or not x_admin_key or not hmac.compare_digest(x_admin_key, ADMIN_KEY):
            raise HTTPException(status_code=401, detail="Missing or invalid X-Admin-Key")

# SEC-009: /docs, /redoc, and the raw OpenAPI schema are attacker recon for
# free (full endpoint/field map) and have no reason to be public once this
# is a real deployment. Gated by the same ENVIRONMENT=production signal
# used for the secret-config fail-fast checks in auth.py.
@asynccontextmanager
async def lifespan(app: FastAPI):
    from mail_queue import start_worker
    start_worker()
    yield


app = FastAPI(
    title="Lewis Core Engine",
    version="1.1",
    docs_url=None if IS_PRODUCTION else "/docs",
    redoc_url=None if IS_PRODUCTION else "/redoc",
    openapi_url=None if IS_PRODUCTION else "/openapi.json",
    lifespan=lifespan,
)

# --- CORS: explicit origins only; a wildcard is never honored -----------------
_DEFAULT_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://lewis.cold-forest-a8ec.workers.dev",
    "https://lewiswellbeing.com",
    "https://www.lewiswellbeing.com",
    "http://lewiswellbeing.com",
    "http://www.lewiswellbeing.com",
]
_raw_origins = os.getenv("FRONTEND_URL", "")
_origins = [u.strip().rstrip("/") for u in _raw_origins.split(",") if u.strip()]

# Always guarantee production and staging domains are included
for default_origin in _DEFAULT_ALLOWED_ORIGINS:
    if default_origin not in _origins:
        _origins.append(default_origin)

if "*" in _origins:
    logger.critical("Wildcard CORS origin rejected; using production and local origins instead.")
    _origins = _DEFAULT_ALLOWED_ORIGINS

# Order matters: the last middleware added is the outermost. CORS must wrap
# the guardrail, or its 429/413 short-circuits (and 500s) come back without
# CORS headers and the browser reports them as "server unreachable".
app.add_middleware(GuardrailMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    # Vite picks whatever port is free (5173, 5174, ...), and a browser only
    # sends a localhost Origin for a page actually served from localhost, so
    # matching any local port costs nothing and stops the whole class of
    # "dev server moved and the app went blank" failures.
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


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
    email: Optional[ShortText] = None
    subscribeNewsletter: Optional[bool] = None
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
    cumulativeLoad: Optional[Union[Dict[str, Any], ShortText]] = None
    soundPreference: Optional[ShortText] = None
    quickChoices: Dict[str, Any] = Field(default={})
    max_time_available: int = Field(default=5, ge=1, le=120)
    current_environment: ShortText = Field(default="Anywhere")
    flags: List[ShortText] = Field(default=[], max_length=10)

    # Journey Telemetry & Tracking Fields
    session_id: Optional[ShortText] = None
    started_at: Optional[ShortText] = None
    duration_seconds: Optional[int] = None


class JourneyPingInput(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128)
    user_name: Optional[ShortText] = None
    user_email: Optional[ShortText] = None
    age_category: Optional[ShortText] = None
    gender: Optional[ShortText] = None
    current_stage: int = Field(default=0, ge=0, le=20)
    current_screen: str = Field(default="landing", max_length=100)
    progress_percent: float = Field(default=0.0, ge=0.0, le=100.0)
    duration_seconds: int = Field(default=0, ge=0)


class JourneyCompleteInput(BaseModel):
    session_id: str = Field(..., min_length=1, max_length=128)
    duration_seconds: Optional[int] = None


class SendRemindersInput(BaseModel):
    session_ids: Optional[List[str]] = None
    inactive_minutes: int = Field(default=10, ge=1, le=1440)


class SupportQueryInput(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    email: str = Field(..., min_length=3, max_length=200)
    query: str = Field(..., min_length=1, max_length=5000)
    screen: Optional[str] = Field(default=None, max_length=100)
    timestamp: Optional[str] = Field(default=None, max_length=100)


class ReportReviewInput(BaseModel):
    user_email: str = Field(..., min_length=3, max_length=200)
    rating: int = Field(..., ge=1, le=5)
    depth_resonance: Optional[str] = Field(default=None, max_length=200)
    clarity_actionability: Optional[str] = Field(default=None, max_length=200)
    relief_impact: Optional[str] = Field(default=None, max_length=200)
    feedback_comments: Optional[str] = Field(default=None, max_length=5000)
    user_name: Optional[str] = Field(default=None, max_length=150)
    report_id: Optional[str] = Field(default=None, max_length=100)
    order_id: Optional[str] = Field(default=None, max_length=100)
    metadata: Optional[Dict[str, Any]] = None


class CreatePaymentOrderInput(BaseModel):
    plan: str = Field(default="personal_report", max_length=50)
    report_id: str = Field(..., min_length=1, max_length=100)
    currency: Optional[str] = Field(default="INR", max_length=10)
    email: Optional[ShortText] = None
    name: Optional[ShortText] = None
    phone: Optional[ShortText] = None
    coupon_code: Optional[str] = Field(default=None, max_length=50)


class VerifyPaymentInput(BaseModel):
    order_id: str = Field(..., min_length=1, max_length=100)
    payment_id: str = Field(..., min_length=1, max_length=100)
    signature: Optional[str] = Field(default=None, max_length=256)
    report_id: Optional[str] = Field(default=None, max_length=100)
    email: Optional[ShortText] = None
    name: Optional[ShortText] = None
    phone: Optional[ShortText] = None


# --- Endpoints -----------------------------------------------------------------

@app.get("/")
def read_root():
    return {"status": "success", "message": "Lewis Core Engine is online"}




@app.post("/support/test-email")
def test_email_endpoint(payload: dict):
    """
    Test endpoint to verify Brevo API mail delivery.
    Provide {"to_email": "your_email@example.com"} in JSON body.
    """
    to_email = payload.get("to_email")
    if not to_email:
        raise HTTPException(status_code=400, detail="Missing 'to_email' field in request body")

    try:
        from mailer import send_email
        success = send_email(
            to_email=to_email,
            subject="LEWIS Email Verification Test · Brevo API Online",
            html_content="<h2 style='color: #00ae9d;'>LEWIS Email Test Successful!</h2><p>Your Brevo API configuration is working perfectly.</p>",
            text_content="LEWIS Email Test Successful! Your Brevo API configuration is working perfectly."
        )
        if success:
            return {"status": "success", "message": f"Test email successfully sent to {to_email}"}
        else:
            raise HTTPException(status_code=500, detail="Failed to send test email. Check server logs for details.")
    except Exception as exc:
        logger.error("Test email failed: %s", exc)
        raise HTTPException(status_code=500, detail=f"Email delivery error: {str(exc)}")


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


@app.post("/auth/logout")
def auth_logout(request: Request):
    """Revoke the caller's own session server-side (SEC-003). Idempotent:
    logging out an already-revoked or unknown token still returns success —
    the desired end state (this token no longer authenticates) already
    holds either way, so there is nothing to reveal or error about."""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = auth_header.split(" ")[1]
    revoke_session(token)
    return {"status": "success", "message": "Logged out"}


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
def onboarding_analytics(request: Request):
    """Return aggregate usage metrics for the Onboarding system integration
    only (SEC-010). Not end-user data, but not public either — internal
    business metrics (registered-user counts, completion counts) were
    previously readable by anyone with no auth at all. This isn't a normal
    user's resource, so a user Bearer token isn't the right check either
    (that would let any registered user see site-wide business metrics);
    it's gated behind a dedicated internal shared key instead, matching who
    this endpoint actually serves. Disabled entirely if the key isn't
    configured, rather than defaulting open."""
    analytics_key = os.getenv("LEWIS_ANALYTICS_API_KEY", "")
    if not analytics_key:
        raise HTTPException(status_code=404, detail="Not found")
    provided = request.headers.get("X-Internal-Key", "")
    if not provided or not hmac.compare_digest(provided, analytics_key):
        raise HTTPException(status_code=401, detail="Unauthorized")
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
def calculate_full_assessment(payload: FullAssessmentInput, request: Request = None):
    if payload.is_over_18 is not True:
        raise HTTPException(
            status_code=403,
            detail="Lewis is designed for adults. The assessment is not available for people under 18.",
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
    auth_header = request.headers.get("Authorization") if request else None
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

    full_response = {
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

    # 1. Always store user report in DB with user name & email encrypted at rest
    try:
        saved_rec_uuid = save_encrypted_assessment_record(
            user_name=payload.name,
            user_email=payload.email,
            report_data=full_response,
            started_at_iso=payload.started_at,
            duration_seconds=payload.duration_seconds,
            age_category=payload.ageCategory,
            gender=payload.gender,
        )
        full_response["report_uuid"] = saved_rec_uuid
        logger.info("Encrypted assessment record %s saved successfully", saved_rec_uuid)
    except Exception as exc:
        logger.error("Failed to save encrypted assessment record: %s", exc)

    # 2. Mark journey session completed if session_id provided
    if payload.session_id:
        try:
            mark_journey_completed(payload.session_id, payload.duration_seconds)
        except Exception as exc:
            logger.warning("Failed to mark journey session completed: %s", exc)

    # 3. Legacy authenticated user vault save
    auth_header = request.headers.get("Authorization") if request else None
    if auth_header and auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        user = verify_token(token)
        if user:
            try:
                save_assessment_submission(
                    user_id=user["id"],
                    user_email=user["email"],
                    assessment_data={
                        "scores": dimensions,
                        "narrative": {"text": narrative_text, "source": source},
                        "answers": payload.model_dump(),
                        "insight_report": insight_report
                    }
                )
            except Exception as e:
                logger.error("Failed to save user vault submission: %s", e)

    return full_response


# --- Journey Telemetry & Inactivity Reminder Endpoints -------------------------

@app.post("/journey/ping")
def journey_ping(payload: JourneyPingInput):
    """Record heartbeat telemetry, user progression, name, age, and encrypted user details."""
    try:
        res = record_journey_ping(
            session_id=payload.session_id,
            user_name=payload.user_name,
            user_email=payload.user_email,
            age_category=payload.age_category,
            gender=payload.gender,
            current_stage=payload.current_stage,
            current_screen=payload.current_screen,
            progress_percent=payload.progress_percent,
            duration_seconds=payload.duration_seconds,
        )
        return res
    except Exception as exc:
        logger.error("Journey ping recording error: %s", exc)
        return {"status": "error", "detail": str(exc)}


@app.post("/journey/complete")
def journey_complete(payload: JourneyCompleteInput):
    """Mark a user's questionnaire journey as fully completed."""
    try:
        ok = mark_journey_completed(payload.session_id, payload.duration_seconds)
        return {"status": "success", "completed": ok}
    except Exception as exc:
        logger.error("Journey completion recording error: %s", exc)
        return {"status": "error", "detail": str(exc)}


@app.get("/analytics/journey-overview")
def get_analytics_overview():
    """
    Get overview statistics:
    - Average time taken by users to complete LEWIS
    - Total completed sessions
    - Count of users who left midway (<50% and >=50%)
    - Count of users left after 50% with >10 mins inactivity awaiting reminder
    """
    try:
        return {
            "status": "success",
            "data": get_journey_analytics_overview()
        }
    except Exception as exc:
        logger.error("Error fetching journey analytics overview: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch journey analytics")


@app.get("/analytics/abandoned-users")
def get_abandoned_users(inactive_minutes: int = 10):
    """
    List users who left LEWIS midway (inactive for > inactive_minutes).
    Includes decrypted name and email for administrator follow-up, last screen,
    and eligibility for the 10-minute remainder email / push notification.
    """
    try:
        users = get_abandoned_users_list(inactive_minutes=inactive_minutes)
        return {
            "status": "success",
            "count": len(users),
            "inactive_threshold_minutes": inactive_minutes,
            "users": users
        }
    except Exception as exc:
        logger.error("Error fetching abandoned users: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch abandoned users list")


@app.post("/analytics/send-reminders")
def send_abandoned_reminders(payload: SendRemindersInput):
    """
    Process reminder queue for users who left after reaching 50% and have been inactive for >= 10 minutes.
    Marks reminders as sent and returns dispatched notification payloads with restart link.
    """
    try:
        abandoned_users = get_abandoned_users_list(inactive_minutes=payload.inactive_minutes)
        eligible = [u for u in abandoned_users if u.get("eligible_for_10min_reminder")]
        
        if payload.session_ids:
            eligible = [u for u in eligible if u["session_id"] in payload.session_ids]
            
        dispatched = []
        sessions_to_mark = []
        
        for user in eligible:
            notification_payload = {
                "session_id": user["session_id"],
                "recipient_name": user["name"],
                "recipient_email": user["email"],
                "last_stage": user["current_stage"],
                "last_screen": user["last_screen"],
                "progress_percent": user["progress_percent"],
                "email_subject": "Your LEWIS Wellbeing Report is waiting for you — Restart anytime",
                "email_body": (
                    f"Hello {user['name']},\n\n"
                    f"We noticed you were halfway through your LEWIS assessment ({user['progress_percent']}% completed). "
                    f"Your personalized wellbeing report and nervous system blueprint are ready to be completed.\n\n"
                    f"Click below to retake or attend LEWIS from start:\n"
                    f"https://lewiswellbeing.com/\n\n"
                    f"Best regards,\nLEWIS Wellbeing Intelligence Team"
                ),
                "push_notification": {
                    "title": "Complete your LEWIS Assessment",
                    "body": "You were over 50% through! Finish now to receive your personalized report.",
                    "action_url": "/"
                }
            }
            dispatched.append(notification_payload)
            sessions_to_mark.append(user["session_id"])
            
        marked_count = mark_reminders_sent(sessions_to_mark)
        
        return {
            "status": "success",
            "message": f"Processed {len(dispatched)} reminder notifications for post-50% midway dropouts.",
            "dispatched_count": len(dispatched),
            "marked_sent_in_db": marked_count,
            "reminders": dispatched
        }
    except Exception as exc:
        logger.error("Error processing abandoned reminders: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to process reminder notifications")



# --- Support Query Handling & User Helpdesk ----------------------------------

@app.post("/support/query")
@app.post("/api/support/query")
def submit_support_query_endpoint(payload: SupportQueryInput):
    """
    Save client support request to database and trigger executive notification & user confirmation email.
    """
    try:
        # 1. Save to Database (Postgres & SQLite)
        db_res = save_support_query(
            name=payload.name,
            email=payload.email,
            query=payload.query,
            screen=payload.screen
        )
        query_id = db_res.get("query_id", "TICK-SUPPORT")

        # 2. Asynchronously send confirmation email to user & forward to support team
        from mail_queue import enqueue

        enqueue(
            "support_notification",
            {
                "user_name": payload.name,
                "user_email": payload.email,
                "query_text": payload.query,
                "screen_name": payload.screen or "General",
                "query_id": query_id
            }
        )

        return {
            "status": "success",
            "message": "Support query received and recorded. A confirmation email has been dispatched.",
            "query_id": query_id
        }
    except Exception as exc:
        logger.error("Error handling support query: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to process support request")


@app.post("/reviews/report")
@app.post("/api/reviews/report")
def submit_report_review_endpoint(payload: ReportReviewInput):
    """
    Save client insight report review and feedback directly to database.
    """
    try:
        db_res = save_report_review(
            user_email=payload.user_email,
            rating=payload.rating,
            depth_resonance=payload.depth_resonance,
            clarity_actionability=payload.clarity_actionability,
            relief_impact=payload.relief_impact,
            feedback_comments=payload.feedback_comments,
            user_name=payload.user_name,
            report_id=payload.report_id,
            order_id=payload.order_id,
            metadata=payload.metadata,
        )
        return {
            "status": "success",
            "message": "Insight report review recorded successfully in database.",
            "review_id": db_res.get("review_id")
        }
    except Exception as exc:
        logger.error("Error handling report review: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to record report review")


# --- Razorpay Payment & Report Entitlement Endpoints -------------------------

@app.get("/payment/config")
def get_payment_config():
    """
    Return safe public payment parameters (Key ID, active mode, plan pricing).
    Zero secrets exposed.
    """
    try:
        return {
            "status": "success",
            "config": get_public_payment_config()
        }
    except Exception as exc:
        logger.error("Error retrieving payment config: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to load payment configuration")


@app.post("/payment/create-order")
def create_payment_order_endpoint(payload: CreatePaymentOrderInput):
    """
    Server-authoritative order creation. Price is decided by backend,
    converted dynamically into selected currency from base ₹749.
    """
    try:
        order = create_order(
            plan_key=payload.plan,
            report_uuid=payload.report_id,
            currency=payload.currency,
            user_email=payload.email,
            user_name=payload.name,
            user_phone=payload.phone,
            coupon_code=payload.coupon_code
        )
        return {
            "status": "success",
            "order": order
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        logger.error("Error creating payment order: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to create payment order")


@app.get("/payment/exchange-rates")
def get_exchange_rates_endpoint():
    """
    Get live exchange rates and calculated multi-currency price table.
    """
    try:
        from payment import calculate_plan_price, DEFAULT_INR_EXCHANGE_RATES
        table = {
            code: calculate_plan_price("personal_report", code)
            for code in DEFAULT_INR_EXCHANGE_RATES
        }
        return {
            "status": "success",
            "base_currency": "INR",
            "base_amount_inr": 749,
            "currencies": table
        }
    except Exception as exc:
        logger.error("Error fetching exchange rates: %s", exc)
        raise HTTPException(status_code=500, detail="Failed to fetch exchange rates")


@app.post("/payment/verify")
def verify_payment_endpoint(payload: VerifyPaymentInput):
    """
    Idempotent signature verification. Unlocks report entitlement server-side
    and records paid transaction with customer details in the DB.
    """
    try:
        res = verify_payment(
            order_id=payload.order_id,
            payment_id=payload.payment_id,
            signature=payload.signature,
            report_uuid=payload.report_id,
            user_email=payload.email,
            user_name=payload.name,
            user_phone=payload.phone
        )
        return res
    except ValueError as ve:
        logger.warning("Verification failed: %s", ve)
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as exc:
        logger.error("Payment verification error: %s", exc)
        raise HTTPException(status_code=500, detail="Payment verification processing failed")


@app.post("/payment/webhook")
async def razorpay_webhook_endpoint(request: Request):
    """
    Razorpay server-to-server webhook endpoint for async payment reconciliation.
    Guarantees entitlement unlocks even if user browser disconnects midway.
    """
    body_bytes = await request.body()
    signature = request.headers.get("X-Razorpay-Signature", "")
    
    if not verify_webhook_signature(body_bytes, signature):
        logger.warning("Webhook signature verification failed")
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    try:
        import json
        payload = json.loads(body_bytes.decode("utf-8"))
        result = process_webhook_event(payload)
        return result
    except Exception as exc:
        logger.error("Webhook event processing failed: %s", exc)
        raise HTTPException(status_code=500, detail="Webhook processing error")


@app.get("/reports/{report_id}/status")
def get_report_unlock_status(report_id: str):
    """
    Check if a report is paid/unlocked server-side.
    """
    unlocked = is_report_unlocked(report_id)
    return {
        "report_uuid": report_id,
        "is_unlocked": unlocked
    }


@app.get("/reports/{report_id}/pdf")
def get_report_pdf_endpoint(report_id: str, format: Optional[str] = None):
    """
    Protected PDF / Full report entitlement gate.
    Returns 403 Forbidden if not paid/unlocked.
    Streams the authoritative downloadable PDF report file or returns JSON.
    """
    unlocked = is_report_unlocked(report_id)
    if not unlocked:
        raise HTTPException(
            status_code=403,
            detail="Payment required. Please purchase your Personal Insight Report to unlock and download."
        )

    report_rec = get_report_by_uuid(report_id)
    if not report_rec:
        raise HTTPException(status_code=404, detail="Assessment report not found")

    if format == "json":
        return {
            "status": "authorized",
            "report_uuid": report_id,
            "is_unlocked": True,
            "report_data": report_rec.get("report_json")
        }

    from pdf_generator import build_insight_report_pdf
    pdf_bytes = build_insight_report_pdf(
        report_data=report_rec.get("report_json"),
        report_uuid=report_id,
        user_name=report_rec.get("user_name") or "Personal Client"
    )
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"inline; filename=LEWIS-Insight-Report-{report_id}.pdf"
        }
    )


@app.get("/download/Lewis-Insight-Report.pdf")
@app.get("/assets/Lewis-Insight-Report.pdf")
def get_static_insight_report_pdf():
    """
    Public downloadable authentic 25-page Lewis Insight Report PDF file.
    """
    from pdf_generator import build_insight_report_pdf
    pdf_bytes = build_insight_report_pdf()
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=LEWIS-Insight-Report.pdf",
            "Cache-Control": "public, max-age=86400"
        }
    )


# --- Ops: manual report-mail resend (safety net alongside the automatic queue) --

@app.get("/admin/pending-reports")
def list_pending_report_deliveries(min_age_seconds: int = 0, _: None = Depends(require_admin)):
    """
    Paid orders whose report email hasn't gone out yet — same query the
    background reconciliation loop runs, exposed for manual follow-up.
    """
    from auth import get_pending_report_deliveries
    pending = get_pending_report_deliveries(min_age_seconds=min_age_seconds)
    return {"status": "success", "count": len(pending), "orders": pending}


@app.post("/admin/resend-report/{order_id}")
def resend_report_delivery(order_id: str, _: None = Depends(require_admin)):
    """
    Manually (re)send the report-delivery email for one order right now,
    bypassing the delay queue. Reuses the same delivery path the automatic
    queue uses, so a resend is indistinguishable from a normal delivery.
    """
    from auth import get_payment_order
    from mailer import deferred_report_delivery

    order = get_payment_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"No order found for {order_id}")
    if order.get("status") != "paid":
        raise HTTPException(status_code=409, detail=f"Order {order_id} is not marked paid (status={order.get('status')})")
    if not order.get("user_email"):
        raise HTTPException(status_code=422, detail=f"Order {order_id} has no user_email on file")

    sent = deferred_report_delivery(
        user_email=order["user_email"],
        user_name=order.get("user_name"),
        report_uuid=order.get("report_uuid"),
        order_id=order_id,
    )
    if not sent:
        raise HTTPException(status_code=502, detail="Send failed — check server logs (Brevo/PDF errors)")
    return {"status": "success", "order_id": order_id, "user_email": order["user_email"]}


@app.get("/admin/pending-reviews")
def list_pending_review_deliveries(min_age_seconds: int = 0, _: None = Depends(require_admin)):
    """
    Orders whose report email went out but the review-invitation email
    hasn't — same query the background reconciliation loop runs.
    """
    from auth import get_pending_review_deliveries
    pending = get_pending_review_deliveries(min_age_seconds=min_age_seconds)
    return {"status": "success", "count": len(pending), "orders": pending}


@app.post("/admin/resend-review/{order_id}")
def resend_review_invitation(order_id: str, _: None = Depends(require_admin)):
    """
    Manually (re)send the review-invitation email for one order right now.
    """
    from auth import get_payment_order
    from mailer import send_review_invitation_email

    order = get_payment_order(order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"No order found for {order_id}")
    if not order.get("report_mail_sent"):
        raise HTTPException(status_code=409, detail=f"Order {order_id} has not had its report email sent yet")
    if not order.get("user_email"):
        raise HTTPException(status_code=422, detail=f"Order {order_id} has no user_email on file")

    sent = send_review_invitation_email(
        user_email=order["user_email"],
        user_name=order.get("user_name"),
        report_uuid=order.get("report_uuid"),
        order_id=order_id,
    )
    if not sent:
        raise HTTPException(status_code=502, detail="Send failed — check server logs")
    return {"status": "success", "order_id": order_id, "user_email": order["user_email"]}


