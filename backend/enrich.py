# enrich.py — builds the enriched object, the single input to report
# generation (Insight Report Generation Rulebook v3.0, §1 to §4).
#
# The golden rule: the enriched object decides; the renderer narrates.
# Every band word, connection, starting point, safety tier and commerce
# cap is fixed HERE, before a single sentence of the report is written.
# Two identical objects must produce identical conclusions.
#
# Nothing in this module invents data: it only re-expresses what the
# scoring, pattern, safety and leverage layers already concluded, in the
# vocabulary the report contract requires.

from scoring import KEY_TO_SPEC_CODE, W_MATRIX

# Internal band -> the four reader-facing words (rulebook, fixed set).
REPORT_BAND = {
    "Thriving": "Strong",
    "Steady": "Steady",
    "Strained": "Under pressure",
    "Depleted": "Running on empty",
}

# Wheel steps: four discrete steps only, never a numeric score on the page.
BAND_STEP = {"Strong": 4, "Steady": 3, "Under pressure": 2, "Running on empty": 1}

# The nine report areas, in spec-code order. Display names follow the
# approved final report; "asking about" rows feed the page 4 table.
AREA_DEFS = [
    ("MD", "meaning",        "Meaning & direction",
     "Whether your days connect to something that matters to you, and whether effort feels purposeful"),
    ("RS", "relationships",  "Relationships & support",
     "Whether you have people you can be open with, and whether connection feels real rather than dutiful"),
    ("EC", "environment",    "Environment & belonging",
     "Whether your surroundings ground you, and whether you feel a sense of place where you live"),
    ("IG", "growth",         "Curiosity & growth",
     "Whether you still have appetite for learning and exploring, and space to follow it"),
    ("AC", "accomplishment", "Agency & work",
     "Whether your actions feel like they matter, and how far intention travels toward doing"),
    ("FW", "financial",      "Financial steadiness",
     "How money feels to live with, in terms of control and worry rather than income"),
    ("EM", "emotional",      "Emotional calm",
     "How much of life feels manageable, and whether the mind settles once the day is done"),
    ("PH", "physical",       "Body & recovery",
     "Whether rest restores you, and whether your body has reserve behind its responsibilities"),
    ("EN", "energy",         "Usable energy",
     "Whether energy is available at the moments you actually need it"),
]

AREA_CODE_TO_NAME = {code: name for code, _, name, _ in AREA_DEFS}

# Composite areas rest on fewer, indirect questions: their readings are
# always offered, never asserted (read_type "supported" -> "offer").
SUPPORTED_AREAS = {"PH", "EN"}


def _find(patterns, pattern_id):
    for p in patterns or []:
        if p and p.get("id") == pattern_id:
            return p
    return None


def _build_areas(dimensions):
    areas = {}
    for code, key, name, asking in AREA_DEFS:
        entry = dimensions.get(key, {})
        score = entry.get("score")
        internal_band = entry.get("band")
        band = REPORT_BAND.get(internal_band) if internal_band else None
        read_type = (
            "absent" if score is None
            else "supported" if code in SUPPORTED_AREAS
            else "clear"
        )
        position = entry.get("position")
        areas[code] = {
            "key": key,
            "name": name,
            "asking_about": asking,
            "band": band,                      # one of the four words, or None
            "step": BAND_STEP.get(band),       # 1..4 for the wheel, or None
            "score": score,                    # internal only; never rendered
            "read_type": read_type,            # clear | supported | absent
            "register": "offer" if read_type == "supported" else "assert",
            "position": position,              # coarse words from the corpus, or None
        }
    return areas


def _downstream_of(primary_code, areas):
    """Up to two areas the starting point most plausibly feeds, drawn from
    the W influence row, restricted to areas currently low. Company, not
    cause: these become the only connections page 5 may draw."""
    if primary_code not in W_MATRIX:
        return []
    row = W_MATRIX[primary_code]
    low = [
        code for code in row
        if areas.get(code, {}).get("band") in ("Under pressure", "Running on empty")
    ]
    low.sort(key=lambda c: row[c], reverse=True)
    return [c for c in low if row[c] >= 0.4][:2]


def _connections(primary_code, downstream, areas):
    """The licensed connection list (patterns[].connects analogue). Only
    these pairs may be drawn on page 5."""
    links = []
    for i, target in enumerate(downstream):
        links.append({
            "a": primary_code,
            "b": target,
            "rank": "clearest" if i == 0 else "second",
        })
    return links


def _distress_tier(safety):
    # evaluate_safety collapses everything into gentle_mode; in rulebook
    # vocabulary that is the "signpost" tier (clear note, lower intensity,
    # no high-commitment programs). "urgent" has no trigger in the current
    # engine and "note" is reserved for future finer flags.
    return "signpost" if safety.get("gentle_mode") else "none"


def _commerce_cap(areas, patterns, tier):
    if tier != "none":
        return {"cap": "suppressed", "reason": "care before commerce"}
    fw = areas.get("FW", {})
    strain = _find(patterns, "financial_strain") or {}
    if fw.get("band") == "Running on empty" or strain.get("label") == "Money's a real strain":
        return {"cap": "free_low_cost_only", "reason": "money is strained right now"}
    if strain.get("free_path_first") or fw.get("band") == "Under pressure":
        return {"cap": "free_low_cost_only", "reason": "money is asking for some care"}
    return {"cap": "none", "reason": None}


def _handoff(leverage_code, patterns, tier):
    stress = _find(patterns, "stress_load_pattern") or {}
    label = stress.get("label") or ""
    if tier != "none":
        lead = "gentleness"
    elif label.startswith("Wired"):
        lead = "down-regulation"
    elif label.startswith("Flat"):
        lead = "gentle activation"
    elif label.startswith("Foggy"):
        lead = "simplification"
    else:
        lead = "steadiness"

    readiness = _find(patterns, "suggestion_readiness") or {}
    stack = 1 if tier != "none" else readiness.get("stack_size", 2)
    sizing = {1: "tiny", 2: "small"}.get(stack, "moderate")
    return {
        "lead_with": lead,
        "primary_focus": leverage_code,
        "habit_sizing": sizing,
        "shrink_with_why": bool(readiness.get("shrink_with_why")),
    }


def build_enriched_object(dimensions, leverage, bright_key, safety, patterns,
                          portrait, habit, context):
    """Assemble the complete enriched object. `context` carries only
    reader-facing texture (arrival word, zones, rhythm, priorities); it can
    change wording and suggestions, never a reading (invariant 5)."""
    areas = _build_areas(dimensions)

    lwi = _find(patterns, "lwi") or {}
    lwi_band = REPORT_BAND.get(lwi.get("band")) if lwi.get("band") else None

    primary_code = KEY_TO_SPEC_CODE.get(leverage["dimension"]) if leverage else None
    downstream = _downstream_of(primary_code, areas) if primary_code else []
    is_pair = bool(leverage and leverage.get("secondary"))
    secondary_code = KEY_TO_SPEC_CODE.get(leverage["secondary"]) if is_pair else None

    tier = _distress_tier(safety)
    commerce = _commerce_cap(areas, patterns, tier)

    scored = [a for a in areas.values() if a["band"] is not None]
    strengths = sorted(
        (a for a in scored if a["band"] in ("Strong", "Steady")),
        key=lambda a: a["score"], reverse=True,
    )
    stretched = [a for a in scored if a["band"] in ("Under pressure", "Running on empty")]

    # The lowest area, used only to honour the rule: if the starting point
    # is not the lowest area, the report must say why.
    lowest_code = min(scored, key=lambda a: a["score"])["key"] if scored else None
    lowest_code = KEY_TO_SPEC_CODE.get(lowest_code) if lowest_code else None

    enriched = {
        "completion": {"mode": "full"},
        "meta": {
            "name": (context.get("name") or "").strip() or None,
            "location": (context.get("location") or "").strip() or None,
            "date": context.get("date"),
        },
        "lwi": {
            "band": lwi_band,
            "shape": lwi.get("shape"),
            "sanity_flag": bool(lwi.get("sanity_flag")),
        },
        "areas": areas,
        "strength_codes": [KEY_TO_SPEC_CODE[a["key"]] for a in strengths],
        "stretched_codes": [KEY_TO_SPEC_CODE[a["key"]] for a in stretched],
        "bright_code": KEY_TO_SPEC_CODE.get(bright_key) if bright_key else None,
        "portrait": portrait or None,
        "leverage": {
            "primary": primary_code,
            "secondary": secondary_code,
            "downstream": downstream,
            "is_pair": is_pair,
            "coherence": (
                "offer" if (primary_code in SUPPORTED_AREAS or primary_code is None)
                else "assert"
            ),
            "is_lowest": primary_code == lowest_code,
            "lowest": lowest_code,
        },
        "connections": _connections(primary_code, downstream, areas),
        "patterns": {
            "recovery_load": _find(patterns, "recovery_load"),
            "stress": _find(patterns, "stress_load_pattern"),
            "energy_rhythm": _find(patterns, "energy_rhythm"),
            "bright_spot": _find(patterns, "bright_spot"),
            "priority_tension": _find(patterns, "priority_tension"),
            "social": _find(patterns, "social_connection"),
            "readiness": _find(patterns, "suggestion_readiness"),
        },
        "safety": {"tier": tier, "flags": list(safety.get("flags") or [])},
        "commerce": commerce,
        "handoff": _handoff(primary_code, patterns, tier),
        "habit": {"title": habit.get("title"), "action": habit.get("action")},
        "context": {
            "arrival_word": (context.get("arrival_word") or "").strip() or None,
            "top_priority": (context.get("priority_rank") or [None])[0],
            "priority_confirmed": context.get("priority_confirmed"),
            "active_pressures": (context.get("active_pressures") or [])[:6],
            "body_zones": context.get("body_zones") or [],
            "sleep_quality": context.get("sleep_quality"),
            "recovery": context.get("recovery"),
            "nervous_system": context.get("nervous_system"),
            "stress_clusters": context.get("stress_clusters") or [],
            "energy_arc": context.get("energy_arc") or {},
            "breathing_before": context.get("breathing_before"),
            "breathing_after": context.get("breathing_after"),
            "support_preference": context.get("support_preference"),
            "sound_preference": context.get("sound_preference"),
            "friction": context.get("friction"),
            "prior_attempts": context.get("prior_attempts"),
        },
    }
    return enriched
