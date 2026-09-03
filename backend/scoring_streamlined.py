# scoring_streamlined.py — LEWIS Streamlined Deterministic Scoring, Inference & RRO Generator
# Based on LEWIS Scoring v1, Prior Link Set v1, Suggestion Library v1, and Report Engineering Spec v1.

from typing import Dict, Any, List, Optional, Tuple
import hashlib
import json
from datetime import datetime, timezone

VERSION_PINS = {
    "scoring_engine": "1.0.0",
    "link_set": "1.0",
    "copy_layer": "1.0",
    "suggestion_library": "1.0"
}

DIMENSION_META = {
    "PH": {"label": "Body & recovery", "full_name": "Physical & Regeneration", "confidence": "C", "ci": 12, "rider": True},
    "EM": {"label": "Emotional calm", "full_name": "Emotional & Mental", "confidence": "A", "ci": 5, "rider": False},
    "EN": {"label": "Energy & drive", "full_name": "Engagement & Energy", "confidence": "B", "ci": 8, "rider": False},
    "RS": {"label": "Relationships", "full_name": "Relationships & Social", "confidence": "B", "ci": 8, "rider": False},
    "MS": {"label": "Meaning & purpose", "full_name": "Meaning & Purpose", "confidence": "B", "ci": 8, "rider": True},
    "AC": {"label": "Progress & agency", "full_name": "Progress & Agency", "confidence": "A", "ci": 5, "rider": False},
    "FW": {"label": "Money & security", "full_name": "Financial Security", "confidence": "A", "ci": 5, "rider": False},
    "IG": {"label": "Curiosity & learning", "full_name": "Curiosity & Learning", "confidence": "C", "ci": 12, "rider": True},
    "EC": {"label": "Surroundings & belonging", "full_name": "Surroundings & Belonging", "confidence": "C", "ci": 12, "rider": True}
}

# Why each area sits at its confidence level — fixed facts about the
# measurement (which instrument, how many items), not user-dependent.
CONFIDENCE_WHY = {
    "EM": "Ten item published stress questionnaire, plus mood items",
    "AC": "Six item published self efficacy questionnaire",
    "RS": "Three item published loneliness questionnaire. Short, so we read it as a band rather than a number",
    "MS": "Four published items, plus one of ours",
    "FW": "Five published items, rescaled by us rather than using US scoring tables",
    "EN": "Two items only, and your own sorting put this area lower than the questions did",
    "PH": "Built from several inputs, because no short, well tested questionnaire exists for this",
    "IG": "Our own questions, not a published questionnaire",
    "EC": "One published item plus two of ours",
}

# 1.3 Categorical Item Mappings (0 to 100)
SLEEP_MAP = {
    "Consistently good": 100,
    "Variable, some good and some bad": 55,
    "Variable": 55,
    "Generally poor, difficulty falling or staying asleep": 20,
    "Generally poor": 20,
    "I haven't been tracking it": None
}

ACTIVITY_MAP = {
    "Very active, daily movement": 100,
    "Very active": 100,
    "Moderately active, a few times a week": 70,
    "Moderately active": 70,
    "Mostly sedentary, desk or screen most of the day": 30,
    "Mostly sedentary": 30,
    "My movement has dropped recently": 25,
    "Dropped recently": 25
}

NATURE_MAP = {
    "Yes, regularly": 100,
    "Sometimes": 65,
    "Rarely": 30,
    "No": 0
}

CULTURAL_MAP = {
    "Strongly, I feel deeply at home": 100,
    "Somewhat, it mostly fits": 75,
    "Partially, parts of it feel right": 50,
    "Not much, I feel like an outsider": 25,
    "This is an area of real pain for me": 0
}

TRANSCENDENT_MAP = {
    "Deeply connected": 100,
    "Somewhat": 75,
    "A little": 50,
    "Not at all": 25,
    "This feels painful right now": 0
}

GROWTH_RECENCY_MAP = {
    "This week": 100,
    "In the past month": 75,
    "A few months ago": 45,
    "I honestly can't remember": 25,
    "I don't have space for that right now": 20
}

def clamp(val: float, min_val: float = 0.0, max_val: float = 100.0) -> float:
    return max(min_val, min(max_val, val))

def get_band(score: Optional[int]) -> Optional[int]:
    if score is None:
        return None
    if score >= 75:
        return 4  # Strong
    elif score >= 55:
        return 3  # Steady
    elif score >= 40:
        return 2  # Strained
    else:
        return 1  # Depleted

# Reverse scoring logic
def score_who5(items: Dict[int, int]) -> Tuple[Optional[float], Dict[str, Any]]:
    # WHO-5: items 1..5, raw 0 to 5, higher is better
    valid_items = [items.get(i) for i in range(1, 6) if items.get(i) is not None]
    if len(valid_items) < 4:
        return None, {"who5_rested": 50.0, "who5_vigour": 50.0, "who5_mood": 50.0}
    
    # Prorate if 4 items
    if len(valid_items) == 4:
        avg = sum(valid_items) / 4.0
        full_items = [items.get(i) if items.get(i) is not None else avg for i in range(1, 6)]
    else:
        full_items = [items[i] for i in range(1, 6)]
    
    who5_rested = 100.0 * (full_items[3] / 5.0) # item 4
    who5_vigour = 100.0 * (full_items[2] / 5.0) # item 3
    who5_mood = 100.0 * (full_items[0] + full_items[1]) / 10.0 # items 1 & 2
    raw_total = sum(full_items)
    who5_total_scaled = (raw_total / 25.0) * 100.0
    
    return who5_total_scaled, {
        "who5_rested": who5_rested,
        "who5_vigour": who5_vigour,
        "who5_mood": who5_mood,
        "who5_total": who5_total_scaled,
        "who5_5": 100.0 * (full_items[4] / 5.0)
    }

def score_pss10(items: Dict[int, int]) -> Tuple[Optional[float], Optional[float]]:
    # PSS-10: items 1..10, raw 0 to 4.
    # Reverse coded: 4, 5, 7, 8 -> (4 - x)
    valid_items = [items.get(i) for i in range(1, 11) if items.get(i) is not None]
    if len(valid_items) < 9:
        return None, None
    
    rev_keys = {4, 5, 7, 8}
    transformed = []
    for i in range(1, 11):
        val = items.get(i)
        if val is None:
            # Prorate with mean of valid
            val = sum(valid_items) / len(valid_items)
        if i in rev_keys:
            transformed.append(4 - val)
        else:
            transformed.append(val)
            
    pss_raw = sum(transformed) # 0 to 40
    pss_wellbeing = 100.0 * (40.0 - pss_raw) / 40.0
    return pss_raw, pss_wellbeing

def score_ucla3(items: Dict[int, int]) -> Optional[float]:
    # UCLA-3: items 1..3, raw 1 to 3, higher is worse (3 to 9)
    valid = [items.get(i) for i in range(1, 4) if items.get(i) is not None]
    if len(valid) < 3:
        return None
    raw = sum(valid)
    rs = 100.0 * (9.0 - raw) / 6.0
    return rs

def score_gse6(items: Dict[int, int]) -> Optional[float]:
    # GSE-6: items 1..6, raw 1 to 4, higher is better (6 to 24)
    valid = [items.get(i) for i in range(1, 7) if items.get(i) is not None]
    if len(valid) < 5:
        return None
    if len(valid) == 5:
        avg = sum(valid) / 5.0
        raw = sum(valid) + avg
    else:
        raw = sum(valid)
    return 100.0 * (raw - 6.0) / 18.0

def score_purpose(items: Dict[int, int]) -> Optional[float]:
    # Purpose 4 items: raw 0 to 4, sum 0 to 16
    valid = [items.get(i) for i in range(1, 5) if items.get(i) is not None]
    if len(valid) < 3:
        return None
    if len(valid) == 3:
        avg = sum(valid) / 3.0
        raw = sum(valid) + avg
    else:
        raw = sum(valid)
    return 100.0 * raw / 16.0

def score_cfpb5(items: Dict[int, int]) -> Optional[float]:
    # CFPB-5: items 1..5, raw 0 to 4
    # Reverse coded: 1, 2, 3, 5 -> (4 - x), item 4 is forward
    valid = [items.get(i) for i in range(1, 6) if items.get(i) is not None]
    if len(valid) < 4:
        return None
    rev_keys = {1, 2, 3, 5}
    transformed = []
    for i in range(1, 6):
        val = items.get(i)
        if val is None:
            val = sum(valid) / len(valid)
        if i in rev_keys:
            transformed.append(4 - val)
        else:
            transformed.append(val)
    raw = sum(transformed)
    return 100.0 * raw / 20.0

def score_ins(val: Optional[int]) -> Optional[float]:
    # INS: 1 to 7 -> 0 to 100
    if val is None or val < 1 or val > 7:
        return None
    return 100.0 * (val - 1) / 6.0

def score_growth(items: Dict[int, int], recency_val: Optional[str]) -> Optional[float]:
    # Growth: 3 items (1 to 5) + 1 recency
    valid = [items.get(i) for i in range(1, 4) if items.get(i) is not None]
    if len(valid) < 2:
        return None
    avg_g = (sum(valid) / len(valid) - 1.0) / 4.0 * 100.0
    rec_score = GROWTH_RECENCY_MAP.get(recency_val, 50.0)
    return 0.70 * avg_g + 0.30 * rec_score

def calculate_nudge(dimension: str, data: Dict[str, Any]) -> float:
    # Nudges from somatic map and landscape gestalt (-5 to +5)
    somatic_zones = data.get("somatic_zones") or []
    nudge = 0.0
    if dimension == "PH":
        if len(somatic_zones) >= 3:
            nudge -= 4.0
        elif len(somatic_zones) == 0 and data.get("no_tension"):
            nudge += 4.0
    elif dimension == "EM":
        if "Head and neck" in somatic_zones or "Chest" in somatic_zones:
            nudge -= 3.0
    elif dimension == "EN":
        if data.get("ns_portrait") == "Collapsed":
            nudge -= 4.0
        elif data.get("ns_portrait") == "Grounded":
            nudge += 3.0
    return nudge

def evaluate_compassion_level(who5_score: Optional[float], lowest_score: float, data: Dict[str, Any]) -> int:
    # Level 3: high fragility / high depletion
    if data.get("support_preference") == "I need something gentle, I'm fragile right now" or data.get("support_preference") == "fragile":
        return 3
    if data.get("cultural_pain") or data.get("transcendent_pain"):
        return 3
    if (who5_score is not None and who5_score <= 35) or lowest_score < 30:
        return 3
    if (who5_score is not None and who5_score <= 50) or lowest_score < 45:
        return 2
    return 1

def build_link_graph(dim_scores: Dict[str, Optional[int]], data: Dict[str, Any]) -> Tuple[List[Dict[str, Any]], Optional[str]]:
    links = []
    # Edge 1: PH -> EM (Sleep)
    ph = dim_scores.get("PH") or 100
    em = dim_scores.get("EM") or 100
    fw = dim_scores.get("FW") or 100
    rs = dim_scores.get("RS") or 100
    ms = dim_scores.get("MS") or 100
    ac = dim_scores.get("AC") or 100
    en = dim_scores.get("EN") or 100
    ig = dim_scores.get("IG") or 100
    ec = dim_scores.get("EC") or 100
    
    pressures = data.get("active_pressures") or []
    ph_flags = data.get("deepdive_flags", {}).get("PH", [])
    
    # Edge 1: PH -> EM via sleep
    if ph < 55 and em < 55 and (data.get("sleep_quality") == "Generally poor" or "Sleep depletion" in pressures or "Sleep isn't restoring me" in ph_flags):
        links.append({
            "source": "PH", "target": "EM", "weight": 0.85, "directional": True,
            "tier": "Established",
            "title": "Sleep and emotional load",
            "body": "Your sleep and your emotional load are showing up together. In research, short or broken sleep reliably makes it harder to regulate mood the next day. That does not mean sleep is the whole story here, but it is the thread worth pulling first."
        })
    
    # Edge 2: PH -> EM via activity
    if ph < 55 and em < 55 and data.get("activity_level") in ["Mostly sedentary", "Dropped recently", "Mostly sedentary, desk or screen most of the day", "My movement has dropped recently"]:
        links.append({
            "source": "PH", "target": "EM", "weight": 0.80, "directional": True,
            "tier": "Established",
            "title": "Movement and mood",
            "body": "Movement and mood are moving together in your answers. Across randomised trials, regular activity has a consistent effect on low mood and distress. Worth naming that the evidence is stronger for structured activity than for movement in general."
        })
        
    # Edge 3: FW <-> EM (Money and emotional strain)
    if fw < 55 and em < 55 and ("Financial pressure" in pressures or data.get("financial_stress") in ["High anxiety", "Avoiding"] or "Money worry sits with me most days" in data.get("deepdive_flags", {}).get("FW", [])):
        links.append({
            "source": "FW", "target": "EM", "weight": 0.75, "directional": False,
            "tier": "Supported",
            "title": "Money and emotional load",
            "body": "Money and emotional load are sitting together in your answers. Research finds these two travel together consistently, and that each can feed the other. Which came first is not something this reflection can tell you, and it may not be the useful question."
        })

    # Edge 4: RS <-> EM (Loneliness and distress)
    if rs < 55 and em < 55 and ("Relationship strain" in pressures or "I feel more alone than I'd like" in data.get("deepdive_flags", {}).get("RS", [])):
        links.append({
            "source": "RS", "target": "EM", "weight": 0.75, "directional": False,
            "tier": "Supported",
            "title": "Connection and emotional calm",
            "body": "Connection and emotional load are showing up together in your reflection. Meaningful social connection is one of the most reliable buffers against ongoing stress."
        })

    # Edge 5: MS <-> EN (Purpose and energy)
    if ms < 55 and en < 55:
        links.append({
            "source": "MS", "target": "EN", "weight": 0.70, "directional": False,
            "tier": "Supported",
            "title": "Purpose and vitality",
            "body": "When a sense of direction feels distant, daily energy often flattens. Rebuilding clarity in small ways frequently restores daily vitality."
        })
        
    # Edge 6: AC <-> EM (Self-efficacy & coping)
    if ac < 55 and em < 55:
        links.append({
            "source": "AC", "target": "EM", "weight": 0.70, "directional": False,
            "tier": "Supported",
            "title": "Agency and overwhelm",
            "body": "When tasks feel overwhelming, confidence in handling what comes next drops. Setting very small, visible finishes rebuilds that sense of agency."
        })

    links_not_drawn = None
    if len(links) == 0:
        links_not_drawn = "Your answers do not show strong clustering between areas right now. Each area appears to be moving largely on its own terms."
        
    return links, links_not_drawn

def identify_root_driver(dim_scores: Dict[str, Optional[int]], links: List[Dict[str, Any]], data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    # Pick lowest scoring areas, leverage from outgoing links & confidence tier
    valid_dims = {k: v for k, v in dim_scores.items() if v is not None}
    if not valid_dims:
        return None
    
    sorted_dims = sorted(valid_dims.items(), key=lambda x: x[1])
    lowest_k, lowest_score = sorted_dims[0]
    
    # Check if a directional source exists in links
    driver_k = lowest_k
    override = False
    
    for l in links:
        if l.get("directional") and l.get("source") in valid_dims:
            src = l["source"]
            if valid_dims[src] <= 55 and valid_dims[src] <= lowest_score + 15:
                driver_k = src
                override = (driver_k != lowest_k)
                break
                
    meta = DIMENSION_META[driver_k]
    runner_up_k = sorted_dims[1][0] if len(sorted_dims) > 1 else driver_k
    
    why_this = f"Your {meta['label'].lower()} sits at the centre of how strain is spreading across your profile."
    why_not_lowest = f"While other areas may feel equally heavy, your {meta['label'].lower()} offers the cleanest leverage point."
    why_not_runner_up = f"Addressing {DIMENSION_META[runner_up_k]['label'].lower()} directly is harder without first stabilising {meta['label'].lower()}."
    
    honesty_rider = None
    if meta["confidence"] == "C":
        honesty_rider = "This area carries an indicative rating based on composite self-reflection items."
        
    return {
        "key": driver_k,
        "label": meta["label"],
        "leverage": 8.4 if driver_k in ["PH", "EM"] else 7.2,
        "override_applied": override,
        "why_not_lowest": why_not_lowest,
        "why_not_runner_up": why_not_runner_up,
        "why_this": why_this,
        "honesty_rider": honesty_rider,
        # Exposed for the "where one change reaches furthest" report page,
        # which shows this as the runner-up lever next to the driver.
        "runner_up_key": runner_up_k,
        "runner_up_label": DIMENSION_META[runner_up_k]["label"],
    }

def select_suggestion(root_driver: Optional[Dict[str, Any]], compassion_level: int, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    # Gate 1: Capacity ceiling
    readiness = data.get("planner_readiness")
    base_ceiling = "S2"
    if readiness == "I'd love a clear 7-day plan":
        base_ceiling = "S3"
    elif readiness == "I'm too overwhelmed for a plan right now":
        base_ceiling = "S0"
    elif readiness == "Give me one thing to focus on":
        base_ceiling = "S1"
        
    if compassion_level == 3 or data.get("support_preference") == "I need something gentle, I'm fragile right now":
        size_tier = "S0"
    else:
        size_tier = base_ceiling
        
    driver_key = root_driver["key"] if root_driver else "PH"
    
    # Library of evidence-grounded implementation intentions
    library = {
        "PH": {
            "S0": {"cue": "When you put your phone on charge tonight", "action": "take three slow breaths before stepping away from the screen", "dose": "under 60 seconds"},
            "S1": {"cue": "After finishing your lunch or evening meal", "action": "step outside into daylight for five quiet minutes", "dose": "5 minutes"},
            "S2": {"cue": "When your workday ends", "action": "take a ten-minute uninterrupted walk without headphones", "dose": "10 to 15 minutes"},
            "S3": {"cue": "Every morning upon waking", "action": "keep a consistent wake time across all seven days this week", "dose": "7-day commitment"}
        },
        "EM": {
            "S0": {"cue": "When you notice your mind racing", "action": "name the thought quietly out loud once, then let your shoulders drop", "dose": "under 60 seconds"},
            "S1": {"cue": "Before opening your morning messages", "action": "sit with your breath for three uninterrupted minutes", "dose": "3 minutes"},
            "S2": {"cue": "In the mid-afternoon pause", "action": "write down the two main things occupying your mental load, then close the notebook", "dose": "10 minutes"},
            "S3": {"cue": "Each evening 30 minutes before sleep", "action": "place all screens in another room and keep a low-light wind-down period", "dose": "30 minutes daily"}
        },
        "FW": {
            "S0": {"cue": "Before checking your bank balance", "action": "take one steady breath and remind yourself that checking is an act of clarity", "dose": "under 60 seconds"},
            "S1": {"cue": "On Saturday morning", "action": "spend five minutes listing upcoming known expenses for the week ahead", "dose": "5 minutes"},
            "S2": {"cue": "Once this week", "action": "review and cancel one recurring subscription you haven't used", "dose": "15 minutes"},
            "S3": {"cue": "Over the weekend", "action": "create a simple single-page cash flow buffer for the upcoming month", "dose": "30 minutes"}
        }
    }
    
    tier_lib = library.get(driver_key, library["PH"])
    chosen = tier_lib.get(size_tier, tier_lib["S0"])
    
    return {
        "id": f"{driver_key}-{size_tier}-001",
        "cue": chosen["cue"],
        "action": chosen["action"],
        "size_tier": size_tier,
        "evidence_tier": "established" if driver_key in ["PH", "EM"] else "supported",
        "dose_honesty": f"This is sized to about {chosen['dose']}, scaled to meet you where your current energy sits.",
        "evidence_note": "Based on implementation-intention research showing if-then cues double the likelihood of habit retention.",
        "lifed_disclosure": False,
        "why_this": f"Because your {DIMENSION_META.get(driver_key, {}).get('label', 'foundation')} is your strongest lever for immediate relief.",
        "excluded_dimension_note": None
    }

def generate_streamlined_rro(raw_data: Dict[str, Any], session_id: str, person_name: Optional[str] = None) -> Dict[str, Any]:
    # Pure deterministic pipeline
    # 1. Ingest & Validate
    who5_items = raw_data.get("who5") or {}
    pss10_items = raw_data.get("pss10") or {}
    ucla3_items = raw_data.get("ucla3") or {}
    gse6_items = raw_data.get("gse6") or {}
    purpose_items = raw_data.get("purpose") or {}
    cfpb5_items = raw_data.get("cfpb5") or {}
    ins_val = raw_data.get("ins")
    growth_items = raw_data.get("growth") or {}
    growth_recency = raw_data.get("growth_recency")
    
    # Cast keys to int
    def parse_dict(d):
        if isinstance(d, dict):
            return {int(k): int(v) for k, v in d.items() if str(k).isdigit() and str(v).isdigit()}
        return {}
        
    who5_dict = parse_dict(who5_items)
    pss_dict = parse_dict(pss10_items)
    ucla_dict = parse_dict(ucla3_items)
    gse_dict = parse_dict(gse6_items)
    purp_dict = parse_dict(purpose_items)
    cfpb_dict = parse_dict(cfpb5_items)
    growth_dict = parse_dict(growth_items)
    
    # 2. Score sub-instruments
    who5_total, who5_breakdown = score_who5(who5_dict)
    pss_raw, pss_wellbeing = score_pss10(pss_dict)
    rs_score = score_ucla3(ucla_dict)
    ac_score = score_gse6(gse_dict)
    purpose_score = score_purpose(purp_dict)
    fw_score = score_cfpb5(cfpb_dict)
    ins_score = score_ins(ins_val if isinstance(ins_val, int) else None)
    growth_score = score_growth(growth_dict, growth_recency)
    
    # Categoricals
    sleep_score = SLEEP_MAP.get(raw_data.get("sleep_quality"), 55)
    activity_score = ACTIVITY_MAP.get(raw_data.get("activity_level"), 50)
    nature_score = NATURE_MAP.get(raw_data.get("nature_access"), 50)
    cultural_score = CULTURAL_MAP.get(raw_data.get("cultural_belonging_1"), 50)
    transcendent_score = TRANSCENDENT_MAP.get(raw_data.get("transcendent_connection"), 50)
    
    # 3. Compute 9 Dimensions
    # PH
    if who5_total is not None and sleep_score is not None:
        ph_base = 0.35 * who5_breakdown["who5_rested"] + 0.25 * who5_breakdown["who5_vigour"] + 0.22 * sleep_score + 0.18 * (activity_score or 50)
    elif who5_total is not None:
        # Sleep null redistribution
        ph_base = 0.45 * who5_breakdown["who5_rested"] + 0.35 * who5_breakdown["who5_vigour"] + 0.20 * (activity_score or 50)
    else:
        ph_base = 50.0
    ph_score = int(round(clamp(ph_base + calculate_nudge("PH", raw_data))))
    
    # EM
    if pss_wellbeing is not None and who5_total is not None:
        em_base = 0.80 * pss_wellbeing + 0.20 * who5_breakdown["who5_mood"]
    elif pss_wellbeing is not None:
        em_base = pss_wellbeing
    else:
        em_base = 50.0
    em_score = int(round(clamp(em_base + calculate_nudge("EM", raw_data))))
    
    # EN
    if who5_total is not None:
        en_base = (who5_breakdown["who5_vigour"] + who5_breakdown["who5_5"]) / 2.0
    else:
        en_base = 50.0
    en_score = int(round(clamp(en_base + calculate_nudge("EN", raw_data))))
    
    # RS
    rs_final = int(round(rs_score)) if rs_score is not None else 50
    
    # MS
    if purpose_score is not None:
        ms_base = 0.70 * purpose_score + 0.30 * transcendent_score
    else:
        ms_base = float(transcendent_score)
    ms_score = int(round(clamp(ms_base)))
    
    # AC
    ac_final = int(round(ac_score)) if ac_score is not None else 50
    
    # FW
    fw_final = int(round(fw_score)) if fw_score is not None else 50
    
    # IG
    ig_final = int(round(growth_score)) if growth_score is not None else 50
    
    # EC
    if ins_score is not None:
        ec_base = 0.40 * ins_score + 0.30 * nature_score + 0.30 * cultural_score
    else:
        ec_base = 0.50 * nature_score + 0.50 * cultural_score
    ec_score = int(round(clamp(ec_base)))
    
    dim_scores = {
        "PH": ph_score,
        "EM": em_score,
        "EN": en_score,
        "RS": rs_final,
        "MS": ms_score,
        "AC": ac_final,
        "FW": fw_final,
        "IG": ig_final,
        "EC": ec_score
    }
    
    lowest_score = min(dim_scores.values())
    compassion_level = evaluate_compassion_level(who5_total, lowest_score, raw_data)
    
    # Deep dive flags
    deepdive_flags = raw_data.get("deepdive_flags") or {}
    deepdive_traj = raw_data.get("deepdive_trajectories") or {}
    
    # Assemble dimensions array
    dimensions_arr = []
    for k in ["PH", "EM", "EN", "RS", "MS", "AC", "FW", "IG", "EC"]:
        sc = dim_scores[k]
        m = DIMENSION_META[k]
        dimensions_arr.append({
            "key": k,
            "label": m["label"],
            "score": sc,
            "band": get_band(sc),
            "confidence": m["confidence"],
            "ci": m["ci"],
            "display_as_band_only": (k == "RS"),
            "flags": deepdive_flags.get(k, []),
            "trajectory": deepdive_traj.get(k, "same"),
            "context_line": None,
            "rider": m["rider"]
        })
        
    # Gestalt sort & Priority
    gestalt_sort = raw_data.get("domain_sort") or {}
    priority_top3 = raw_data.get("priority_top3") or ["Emotional calm", "Body & recovery", "Meaning & purpose"]
    
    # Links & Root Driver
    links, links_not_drawn = build_link_graph(dim_scores, raw_data)
    root_driver = identify_root_driver(dim_scores, links, raw_data)
    
    # Suggestion
    suggestion = select_suggestion(root_driver, compassion_level, raw_data)

    # Somatic & Breath
    somatic_zones = raw_data.get("somatic_zones") or []
    ns_portrait = raw_data.get("ns_portrait") or "Grounded"
    stress_cluster = raw_data.get("stress_cluster") or "The Surge"
    recovery_resp = raw_data.get("recovery_responsiveness") or "Somewhat better"
    
    breath_obj = None
    if raw_data.get("tension_before") is not None and raw_data.get("tension_after") is not None:
        tb = int(raw_data["tension_before"])
        ta = int(raw_data["tension_after"])
        breath_obj = {"before": tb, "after": ta, "delta": tb - ta}
        
    day_obj = raw_data.get("energy_arc") or [
        {"k": "Morning", "v": 2}, {"k": "Afternoon", "v": 2},
        {"k": "Evening", "v": 2}, {"k": "Night", "v": 1}
    ]
    
    # Tension check
    tension_key = None
    sorted_by_score = sorted(dim_scores.items(), key=lambda x: x[1])
    bottom_keys = [k for k, _ in sorted_by_score[:3]]
    for p_label in priority_top3:
        for k, meta in DIMENSION_META.items():
            if meta["label"].lower() in p_label.lower() and k in bottom_keys:
                tension_key = k
                break
        if tension_key:
            break

    # AI-voiced narration (Road B): same engine and same fail-closed
    # validator the full assessment flow uses (llm.py / validator.py) —
    # never shown unless it passes; the deterministic per-band template
    # wording already baked into the report stays the fallback.
    band_word = {4: "Thriving", 3: "Steady", 2: "Strained", 1: "Depleted"}
    narration = {"text": None, "source": "road_a"}
    try:
        from llm import generate_road_b
        from validator import validate_narrative
        voicing = {
            "arrival_word": raw_data.get("arrival_word"),
            "dimension_bands": {
                DIMENSION_META[k]["label"]: band_word.get(get_band(dim_scores[k]), "Steady")
                for k in dim_scores
            },
            "bright_spot": DIMENSION_META[sorted_by_score[-1][0]]["label"],
            "top_priority": priority_top3[0] if priority_top3 else None,
            "leverage_note": (root_driver or {}).get("why_this"),
            "small_habit": (
                {"title": suggestion.get("cue"), "action": suggestion.get("action")}
                if suggestion else None
            ),
            "nervous_system_pattern": (
                f"a {ns_portrait.lower()} pattern, part of the {stress_cluster.lower()} cluster"
                if ns_portrait else None
            ),
            "sleep_quality": raw_data.get("sleep_quality"),
        }
        road_b_text = generate_road_b(voicing)
        if road_b_text:
            ok, reasons = validate_narrative(road_b_text)
            if ok:
                narration = {"text": road_b_text, "source": "road_b"}
    except Exception:
        pass  # Road B is optional voicing; the deterministic report is never blocked by it.

    # Deterministic RRR hash
    raw_bytes = json.dumps(raw_data, sort_keys=True).encode("utf-8")
    rrr_hash = hashlib.sha256(raw_bytes).hexdigest()
    
    rro = {
        "meta": {
            "rro_id": f"rro_{session_id[:8]}_{rrr_hash[:8]}",
            "session_id": session_id,
            "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "name": person_name or raw_data.get("name") or "Friend",
            "date_display": datetime.now(timezone.utc).strftime("%d %B %Y"),
            "arrival_word": raw_data.get("arrival_word") or "ready",
            "versions": VERSION_PINS,
            "rrr_hash": rrr_hash
        },
        "compassion_level": compassion_level,
        "dimensions": dimensions_arr,
        "gestalt": {
            "sort": gestalt_sort,
            "divergences": [],
            "global_caution": None
        },
        "somatic": {
            "zones": somatic_zones,
            "portrait": ns_portrait,
            "cluster": stress_cluster,
            "recovery": recovery_resp
        },
        "breath": breath_obj,
        "day": day_obj,
        "links": links,
        "links_not_drawn": links_not_drawn,
        "root_driver": root_driver,
        "priority": {
            "top3": priority_top3,
            "tension_key": tension_key,
            "tension_confirmed": raw_data.get("tension_confirmed") or "yes"
        },
        "bright_spot": {
            "tier": 1 if max(dim_scores.values()) >= 55 else (2 if max(dim_scores.values()) >= 40 else 3),
            "key": sorted_by_score[-1][0],
            "text": raw_data.get("bright_spot_text")
        },
        "reflections": [
            "Your answers show genuine self-awareness in naming current friction points.",
            "A small change in your central lever can ease load across connected areas."
        ],
        "suggestion": suggestion,
        "suggestion_state": "normal",
        "narration": narration,
        "confidence_table": [
            [DIMENSION_META[k]["label"], DIMENSION_META[k]["confidence"], CONFIDENCE_WHY[k]]
            for k in sorted(DIMENSION_META, key=lambda k: (DIMENSION_META[k]["confidence"], k))
        ],
        "sources": {
            "instruments": [
                {"name": "WHO-5", "desc": "World Health Organization-Five Well-Being Index"},
                {"name": "PSS-10", "desc": "Perceived Stress Scale (Cohen et al.)"},
                {"name": "UCLA-3", "desc": "Brief Loneliness Scale (Hughes et al.)"},
                {"name": "GSE-6", "desc": "General Self-Efficacy Short Form (Romppel et al.)"},
                {"name": "CFPB-5", "desc": "Financial Well-Being Scale Short Form"},
                {"name": "INS", "desc": "Inclusion of Nature in Self Scale (Schultz)"}
            ],
            "link_evidence": [
                {"pair": "PH to EM", "citation": "Palmer et al. (2024), Psychological Bulletin; Singh et al. (2023), BJSM"},
                {"pair": "FW to EM", "citation": "Guan et al. (2022), PLOS ONE; Richardson et al. (2013)"}
            ]
        },
        "support_block": {
            "position": "after",
            "resources": [
                {"name": "Vandrevala Foundation Helpline (India)", "contact": "9999 666 555 · Free, 24/7 confidential mental health support"},
                {"name": "Tele-MANAS (Govt. of India)", "contact": "14416 or 1800 891 4416 · 24/7 toll-free mental health helpline"},
                {"name": "International Crisis Lines", "contact": "findahelpline.com · Free support worldwide in 130+ languages"}
            ]
        }
    }
    
    return rro
