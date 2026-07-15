# scoring.py — deterministic instrument scoring for LEWIS.
#
# Polarity convention: every dimension LEWIS exposes is WELLBEING polarity
# (0-100, higher = better). Instruments that natively measure a burden
# (PSS-10 stress, UCLA-3 loneliness, CFPB-5 financial stress) are inverted
# HERE, at the scoring layer, so no downstream consumer ever has to
# remember which way a number points.
#
# Answer encoding: the frontend sends 0-based option indices. For
# instruments whose published anchors start at 1 (UCLA-3: 1-3, GSE: 1-4),
# min-max normalization of the 0-based sum is mathematically identical to
# min-max normalization of the published raw score, so normalized scores
# match the standard scoring exactly.

BAND_THRIVING = 70
BAND_STEADY = 55
BAND_STRAINED = 40

BANDS = ("Thriving", "Steady", "Strained", "Depleted")


def band_for(score: float) -> str:
    if score >= BAND_THRIVING:
        return "Thriving"
    if score >= BAND_STEADY:
        return "Steady"
    if score >= BAND_STRAINED:
        return "Strained"
    return "Depleted"


def _check(scores, n, lo, hi, name):
    if len(scores) != n:
        raise ValueError(f"{name} requires exactly {n} scores.")
    for s in scores:
        if not isinstance(s, int) or s < lo or s > hi:
            raise ValueError(f"{name} answers must be integers between {lo} and {hi}.")


def calculate_who5(scores: list[int]) -> dict:
    """WHO-5: 5 items, 0-5 each. Raw 0-25, scaled x4 to 0-100. Wellbeing polarity."""
    _check(scores, 5, 0, 5, "WHO-5")
    raw = sum(scores)
    return {"raw_score": raw, "normalized_score": round(raw * 4.0, 1)}


def calculate_pss10(scores: list[int]) -> dict:
    """PSS-10: 10 items, 0-4 each. Items 4, 5, 7, 8 (indices 3, 4, 6, 7) are
    positively stated and reverse-scored. Returns stress (0-100, higher =
    more stress) and calm (inverted, wellbeing polarity)."""
    _check(scores, 10, 0, 4, "PSS-10")
    raw = sum((4 - s) if i in (3, 4, 6, 7) else s for i, s in enumerate(scores))
    stress = round((raw / 40) * 100, 1)
    return {"raw_score": raw, "stress_score": stress, "normalized_score": round(100 - stress, 1)}


def calculate_ucla3(scores: list[int]) -> dict:
    """UCLA-3 loneliness: 3 items, 0-2 each (equivalent to published 1-3
    anchors). Returns loneliness (higher = lonelier) and the inverted
    connection score (wellbeing polarity)."""
    _check(scores, 3, 0, 2, "UCLA-3")
    raw = sum(scores)
    loneliness = round((raw / 6) * 100, 1)
    return {"raw_score": raw, "loneliness_score": loneliness, "normalized_score": round(100 - loneliness, 1)}


def calculate_gse(scores: list[int]) -> dict:
    """GSE: 10 items, 1-4 each.
    Wellbeing polarity."""
    _check(scores, 10, 1, 4, "GSE")
    raw = sum(scores)
    return {"raw_score": raw, "normalized_score": round(((raw - 10) / 30) * 100, 1)}


def calculate_promis(scores: list[int]) -> dict:
    """PROMIS Meaning & Purpose SF 4a: 4 items, 0-4 each. Wellbeing polarity."""
    _check(scores, 4, 0, 4, "PROMIS M&P")
    raw = sum(scores)
    return {"raw_score": raw, "normalized_score": round((raw / 16) * 100, 1)}


def calculate_cfpb5(scores: list[int]) -> dict:
    """CFPB-5 financial wellbeing: 5 items, 0-4 each.
    Items 1-3 ("describes me": 0 = completely) and item 5 ("finances control
    my life": 0 = always) score stress when LOW; item 4 ("money left over":
    0 = always) scores stress when HIGH. Returns stress and the inverted
    financial-peace score (wellbeing polarity)."""
    _check(scores, 5, 0, 4, "CFPB-5")
    raw = (4 - scores[0]) + (4 - scores[1]) + (4 - scores[2]) + scores[3] + (4 - scores[4])
    stress = round((raw / 20) * 100, 1)
    return {"raw_score": raw, "stress_score": stress, "normalized_score": round(100 - stress, 1)}


def calculate_diener(scores: list[int]) -> dict:
    """Diener Flourishing Scale: 8 items, 1-7 each. Raw 8-56. Wellbeing polarity."""
    _check(scores, 8, 1, 7, "Diener Flourishing")
    raw = sum(scores)
    return {"raw_score": raw, "normalized_score": round(((raw - 8) / 48) * 100, 1)}


def calculate_ins(scores: list[int]) -> dict:
    """Inclusion of Nature in Self: 1 item, 1-7. Wellbeing polarity."""
    _check(scores, 1, 1, 7, "INS")
    return {"raw_score": scores[0], "normalized_score": round(((scores[0] - 1) / 6) * 100, 1)}


def calculate_swls(scores: list[int]) -> dict:
    """Satisfaction With Life Scale: 5 items, 1-7 each. Raw 5-35. Wellbeing polarity."""
    _check(scores, 5, 1, 7, "SWLS")
    raw = sum(scores)
    return {"raw_score": raw, "normalized_score": round(((raw - 5) / 30) * 100, 1)}


def calculate_ph(sleep_quality: str | None, body_movement: str | None, who5_scores: list[int]) -> dict | None:
    """Physical Ease composite (PH).
    0.35*sleep + 0.30*activity + 0.20*rested + 0.15*vigour."""
    weighted_sum = 0
    total_weight = 0
    
    if sleep_quality:
        sleep_val = {"good": 100, "mixed": 50, "poor": 0}.get(sleep_quality, 50)
        weighted_sum += sleep_val * 0.35
        total_weight += 0.35
        
    if body_movement:
        act_val = {"very_active": 100, "moderate": 50, "sedentary": 0}.get(body_movement, 50)
        weighted_sum += act_val * 0.30
        total_weight += 0.30
        
    weighted_sum += (who5_scores[3] / 5 * 100) * 0.20
    total_weight += 0.20
    
    weighted_sum += (who5_scores[2] / 5 * 100) * 0.15
    total_weight += 0.15
    
    if total_weight == 0:
        return None
        
    normalized = weighted_sum / total_weight
    return {"raw_score": round(normalized, 1), "normalized_score": round(normalized, 1)}


def calculate_en(who5_scores: list[int]) -> dict | None:
    """Energy & Engagement composite (EN).
    mean_available(who5[2], who5[4]) / 5 * 100"""
    items = [who5_scores[2], who5_scores[4]]
    if not items:
        return None
    val = (sum(items) / len(items)) / 5 * 100
    return {"raw_score": round(val, 1), "normalized_score": round(val, 1)}


# --- Dimension assembly -----------------------------------------------------
#
# The canonical LEWIS dimension set. "physical" and "energy" have no
# validated instrument in the current assessment; they are reported as
# unscored (score None) rather than fabricated. "calm" is the PSS-10 stress
# overlay expressed in wellbeing polarity.

DIMENSION_DEFS = [
    ("emotional",      "Emotional Wellbeing",        "Emotional",  "WHO-5"),
    ("calm",           "Stress & Calm",              "Calm",       "PSS-10"),
    ("relationships",  "Connection & Relationships", "Connection", "UCLA-3"),
    ("accomplishment", "Agency & Accomplishment",    "Agency",     "GSE"),
    ("meaning",        "Meaning & Purpose",          "Meaning",    "PROMIS M&P"),
    ("financial",      "Financial Peace",            "Financial",  "CFPB-5"),
    ("growth",         "Growth & Flourishing",       "Growth",     "Diener FS"),
    ("environment",    "Nature & Environment",       "Nature",     "INS"),
    ("physical",       "Physical Ease",              "Physical",   "Composite"),
    ("energy",         "Energy & Engagement",        "Energy",     "Composite"),
]


def build_dimensions(scores_by_key: dict) -> dict:
    """scores_by_key maps dimension key -> wellbeing-polarity score (or None).
    Returns an ordered dict of dimension entries with label, short label,
    score and band. Unscored dimensions carry score/band None."""
    dims = {}
    for key, label, short, source in DIMENSION_DEFS:
        score = scores_by_key.get(key)
        dims[key] = {
            "label": label,
            "short": short,
            "score": score,
            "band": band_for(score) if score is not None else None,
            "source": source,
        }
    return dims


def bright_spot(dimensions: dict) -> str | None:
    """Key of the highest-scoring scored dimension, or None."""
    scored = {k: d["score"] for k, d in dimensions.items() if d["score"] is not None}
    if not scored:
        return None
    return max(scored, key=scored.get)


# --- Leverage engine (Layer 3 §9: the W-matrix primary-leverage engine) -------
#
# LEWIS reports a CONNECTION, not a cause: among the areas currently low,
# the one that behaves as a net *source* of lowness under the v1 influence
# prior W (Open Items Resolutions, Part C1). The lowest score is often a
# consequence, not the place to start.
#
#   L(i)        = (100 − score(i)) / 100
#   Leverage(i) = L(i) · (Σⱼ W[i][j]·L(j) − 0.7·Σⱼ W[j][i]·L(j)) · PressureBonus(i)
#
# Guardrails: lowness gate L(i) ≥ 0.45 (score ≤ 55) — nothing is named on a
# balanced profile; separation gate — a top-two within 25% is named as a
# pair, never a false single winner. "calm" (PSS-10) is not a W dimension:
# in the locked spec stress feeds the EM composite rather than standing
# alone, so it can colour the report but never carries leverage.

SPEC_CODE_TO_KEY = {
    "PH": "physical", "EM": "emotional", "EN": "energy",
    "RS": "relationships", "MS": "meaning", "AC": "accomplishment",
    "FW": "financial", "IG": "growth", "EC": "environment",
}
KEY_TO_SPEC_CODE = {v: k for k, v in SPEC_CODE_TO_KEY.items()}

# v1 literature-prior influence matrix W[i][j]: row i drives column j.
# 0 none · 0.2 weak · 0.4 moderate · 0.6 strong · 0.8 very strong.
W_MATRIX = {
    "PH": {"EM": 0.5, "EN": 0.8, "RS": 0.2, "MS": 0.1, "AC": 0.3, "FW": 0.0, "IG": 0.2, "EC": 0.0},
    "EM": {"PH": 0.5, "EN": 0.6, "RS": 0.4, "MS": 0.3, "AC": 0.4, "FW": 0.2, "IG": 0.4, "EC": 0.1},
    "EN": {"PH": 0.2, "EM": 0.3, "RS": 0.3, "MS": 0.2, "AC": 0.5, "FW": 0.2, "IG": 0.4, "EC": 0.1},
    "RS": {"PH": 0.1, "EM": 0.5, "EN": 0.3, "MS": 0.4, "AC": 0.2, "FW": 0.1, "IG": 0.2, "EC": 0.3},
    "MS": {"PH": 0.1, "EM": 0.4, "EN": 0.4, "RS": 0.3, "AC": 0.4, "FW": 0.1, "IG": 0.3, "EC": 0.2},
    "AC": {"PH": 0.1, "EM": 0.3, "EN": 0.4, "RS": 0.2, "MS": 0.3, "FW": 0.4, "IG": 0.3, "EC": 0.1},
    "FW": {"PH": 0.2, "EM": 0.6, "EN": 0.3, "RS": 0.4, "MS": 0.2, "AC": 0.3, "IG": 0.2, "EC": 0.2},
    "IG": {"PH": 0.0, "EM": 0.2, "EN": 0.3, "RS": 0.2, "MS": 0.4, "AC": 0.3, "FW": 0.1, "EC": 0.1},
    "EC": {"PH": 0.3, "EM": 0.4, "EN": 0.2, "RS": 0.3, "MS": 0.2, "AC": 0.1, "FW": 0.1, "IG": 0.2},
}

LEVERAGE_GATE = 55            # score ≤ 55 ⇔ L ≥ 0.45: candidate to be named
LOWNESS_GATE = 0.45
INFLOW_PENALTY = 0.7
SEPARATION_RATIO = 0.25       # top-two within 25% → name the pair
PRESSURE_BONUS = 1.25

# Conservative keyword map from named active pressures (input 1.3) to the
# dimension whose leverage they corroborate. Workload/deadline pressure is
# deliberately unmapped: per the spec's worked trace, work stress is not
# personal-finance stress.
PRESSURE_KEYWORDS = {
    "FW": ("money", "financ", "debt", "rent", "bill", "income", "loan"),
    "PH": ("health", "body", "pain", "sleep", "illness", "injury"),
    "RS": ("relationship", "family", "partner", "friend", "lonel", "marriage"),
    "EN": ("energy", "exhaust", "tired", "fatigue", "burn"),
}

LEVERAGE_HEADLINES = {
    "physical":       "Body and recovery is the area most closely linked with the rest of your current picture. When rest gets even a little easier, the areas that run on it tend to ease too.",
    "emotional":      "Everyday emotional wellbeing is the area most closely linked with the rest of your current picture. Gentle, consistent care here tends to steady the other areas too.",
    "energy":         "Everyday energy is the area most closely linked with the rest of your current picture. Small, kind changes to how energy is spent and restored tend to ripple outward.",
    "relationships":  "Connection is the area most closely linked with the rest of your current picture. When connection gets a little care, the surrounding areas often ease alongside it.",
    "meaning":        "Meaning and purpose is the area most closely linked with the rest of your current picture. Reconnecting with one thing that matters to you can quietly lift the rest.",
    "accomplishment": "Your sense of agency is the area most closely linked with the rest of your current picture. One small, fully-yours win at a time tends to loosen the whole pattern.",
    "financial":      "Financial pressure is the area most closely linked with the rest of your current picture. Even small steps toward clarity here often free up attention everywhere else.",
    "growth":         "Curiosity and growth is the area most closely linked with the rest of your current picture. A little unhurried space for what interests you tends to feed the rest.",
    "environment":    "Your surroundings are the area most closely linked with the rest of your current picture. Small changes to the spaces you live in tend to give everything else more room.",
}

LEVERAGE_FRAMING = (
    "This is a connection drawn from your answers today — not a cause, and not a verdict."
)


def _pressure_matches(code: str, active_pressures: list[str] | None) -> bool:
    if not active_pressures:
        return False
    keywords = PRESSURE_KEYWORDS.get(code, ())
    for pressure in active_pressures:
        text = str(pressure).lower()
        if any(k in text for k in keywords):
            return True
    return False


def calculate_leverage(dimensions: dict, active_pressures: list[str] | None = None) -> dict | None:
    # Continuous lowness for every scored W dimension; unscored dimensions
    # neither drive nor receive (skip-renormalisation convention, A6).
    lowness = {}
    for code, key in SPEC_CODE_TO_KEY.items():
        entry = dimensions.get(key)
        if entry and entry["score"] is not None:
            lowness[code] = (100.0 - entry["score"]) / 100.0

    scores = {}
    for code, L_i in lowness.items():
        if L_i < LOWNESS_GATE:
            continue  # not low enough to lead with
        out_to_low = sum(W_MATRIX[code][j] * lowness[j] for j in lowness if j != code)
        in_from_low = sum(W_MATRIX[j][code] * lowness[j] for j in lowness if j != code)
        bonus = PRESSURE_BONUS if _pressure_matches(code, active_pressures) else 1.0
        scores[code] = L_i * (out_to_low - INFLOW_PENALTY * in_from_low) * bonus

    if not scores:
        return None

    ranked = sorted(scores, key=scores.get, reverse=True)
    top = ranked[0]
    top_key = SPEC_CODE_TO_KEY[top]

    # Separation gate: a runner-up within 25% of the winner is named as a
    # pair — the engine refuses to crown a false single winner.
    secondary_key = None
    if len(ranked) > 1:
        second = ranked[1]
        if scores[top] > 0 and (scores[top] - scores[second]) <= SEPARATION_RATIO * abs(scores[top]):
            secondary_key = SPEC_CODE_TO_KEY[second]

    result = {
        "dimension": top_key,
        "label": dimensions[top_key]["label"],
        "headline": LEVERAGE_HEADLINES[top_key],
        "framing": LEVERAGE_FRAMING,
        "secondary": secondary_key,
        "secondary_label": dimensions[secondary_key]["label"] if secondary_key else None,
    }
    if secondary_key:
        result["headline"] = (
            f"{dimensions[top_key]['label']} and {dimensions[secondary_key]['label'].lower()} "
            "are moving together as the areas most closely linked with the rest of your current "
            "picture. Care for either tends to ease both."
        )
    return result
