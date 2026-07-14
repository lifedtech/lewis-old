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
BAND_STRETCHED = 40

BANDS = ("Thriving", "Steady", "Stretched", "Asking for care")


def band_for(score: float) -> str:
    if score >= BAND_THRIVING:
        return "Thriving"
    if score >= BAND_STEADY:
        return "Steady"
    if score >= BAND_STRETCHED:
        return "Stretched"
    return "Asking for care"


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


# --- Leverage engine ---------------------------------------------------------
#
# Replaces the former "root driver". LEWIS reports a CONNECTION, not a
# cause: the dimension that, among the areas currently below Steady, is
# most closely linked with the rest of the picture. If nothing is below
# the gate, there is no leverage point — a balanced profile is reported
# as balanced, never assigned a fabricated "driver".

LEVERAGE_GATE = 55  # only dimensions below Steady are candidates

LEVERAGE_WEIGHTS = {
    "relationships":  0.85,
    "calm":           0.80,
    "financial":      0.75,
    "accomplishment": 0.70,
    "meaning":        0.65,
    "emotional":      0.50,
}

LEVERAGE_HEADLINES = {
    "relationships":  "Connection is the area most closely linked with the rest of your current picture. When connection gets a little care, the surrounding areas often ease alongside it.",
    "calm":           "Day-to-day stress load is the area most closely linked with the rest of your current picture. Small moments of decompression tend to give the other areas more room.",
    "financial":      "Financial pressure is the area most closely linked with the rest of your current picture. Even small steps toward clarity here often free up attention everywhere else.",
    "accomplishment": "Your sense of agency is the area most closely linked with the rest of your current picture. One small, fully-yours win at a time tends to loosen the whole pattern.",
    "meaning":        "Meaning and purpose is the area most closely linked with the rest of your current picture. Reconnecting with one thing that matters to you can quietly lift the rest.",
    "emotional":      "Everyday emotional wellbeing is the area most closely linked with the rest of your current picture. Gentle, consistent care here tends to steady the other areas too.",
}

LEVERAGE_FRAMING = (
    "This is a connection drawn from your answers today — not a cause, and not a verdict."
)


def calculate_leverage(dimensions: dict) -> dict | None:
    candidates = {}
    for key, weight in LEVERAGE_WEIGHTS.items():
        entry = dimensions.get(key)
        if entry and entry["score"] is not None and entry["score"] < LEVERAGE_GATE:
            candidates[key] = (100 - entry["score"]) * weight
    if not candidates:
        return None
    top = max(candidates, key=candidates.get)
    return {
        "dimension": top,
        "label": dimensions[top]["label"],
        "headline": LEVERAGE_HEADLINES[top],
        "framing": LEVERAGE_FRAMING,
    }
