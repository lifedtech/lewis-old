import statistics

# --- Helpers ---
def avg(scores):
    valid = [s for s in scores if s is not None]
    return sum(valid) / len(valid) if valid else 0

def stdev(scores):
    valid = [s for s in scores if s is not None]
    return statistics.stdev(valid) if len(valid) > 1 else 0

def band_for(score):
    if score is None: return None
    if score >= 70: return "Thriving"
    if score >= 55: return "Steady"
    if score >= 40: return "Strained"
    return "Depleted"

# --- 1. LWI ---
def lwi_pattern(scores_dict, who5_overall):
    scores = [s for s in scores_dict.values() if s is not None]
    mean_val = avg(scores)
    sd_val = stdev(scores)
    shape = "even" if sd_val < 12 else "uneven"
    sanity = abs(mean_val - who5_overall) >= 15 if who5_overall is not None else False
    return {
        "id": "lwi",
        "mean": round(mean_val, 1),
        "band": band_for(mean_val),
        "spread": {"min": min(scores) if scores else 0, "max": max(scores) if scores else 0, "sd": round(sd_val, 1)},
        "shape": shape,
        "sanity_flag": sanity,
        "confidence": "measurement"
    }

# --- 2. recovery_load ---
def recovery_load_pattern(cum_raw, recovery):
    load_n = (cum_raw / 30) if cum_raw is not None else 0
    rf_map = {"recovered": 0, "somewhat": 0.33, "still_tired": 0.66, "anxious_at_rest": 1.0}
    rf = rf_map.get(recovery, 0)
    idx = 0.6 * load_n + 0.4 * rf
    label = "Light load" if idx < 0.34 else "Moderate load" if idx < 0.66 else "Carrying a lot"
    return {
        "id": "recovery_load",
        "label": label,
        "index": round(idx, 2),
        "confidence": "reflection",
        "contra_high_commitment": (label == "Carrying a lot" and rf >= 0.66)
    }

# --- 3. stress_load_pattern ---
def stress_load_pattern(clusters, portrait, arc):
    cluster_joined = " ".join(clusters).lower() if clusters else ""
    if "racing" in cluster_joined or "hard to switch off" in cluster_joined or portrait == "activated":
        label = "Wired & hard to switch off"
    elif "flat" in cluster_joined or portrait == "collapsed":
        label = "Flat & depleted"
    elif "fog" in cluster_joined:
        label = "Foggy & scattered"
    elif "cycle" in cluster_joined or "rhythm" in cluster_joined:
        label = "Rhythm-linked"
    else:
        label = "Settled"
        
    return {
        "id": "stress_load_pattern",
        "label": label,
        "confidence": "reflection"
    }

# --- 4. energy_rhythm ---
def energy_rhythm_pattern(zones, irregular, evening_stress):
    if irregular:
        shape = "Up-and-down"
    else:
        peak = max(zones, key=zones.get) if zones else "morning"
        shape = f"{peak.title()} riser" if peak != "afternoon" else "Afternoon dip"
        if shape == "Morning riser": shape = "Morning-led"
        
    sleep_onset = (zones.get("evening") == "High" or zones.get("night") == "High" or evening_stress)
    return {
        "id": "energy_rhythm",
        "label": shape,
        "sleep_onset_disruptor": sleep_onset,
        "confidence": "reflection"
    }

# --- 5. somatic_load ---
def somatic_load_pattern(load_index, awareness, body_flags):
    load_index = load_index or "low"
    label = {"low": "Body feels easy", "mod": "Some tension held", "high": "Carrying a lot in the body"}.get(load_index, "Body feels easy")
    signal_gap = (load_index == "high" and awareness in {"not_very", "rarely"})
    safety = "gentle_referral" if ("chronic_pain" in body_flags and load_index == "high") else None
    return {
        "id": "somatic_load",
        "label": label,
        "body_signal_gap": signal_gap,
        "confidence": "reflection",
        "safety": safety
    }

# --- 6. social_connection ---
def social_connection_pattern(rs_score, rel_ctx, sharing):
    if rs_score is None: return None
    base = "Connected & supported" if rs_score >= 55 else "More alone than you'd like"
    if rs_score >= 70 and rel_ctx == "connected": base = "Connected & supported"
    elif rs_score < 55: base = "More alone than you'd like"
    
    guarding = (rs_score >= 70 and sharing == "guarded")
    route = "boundaries" if rel_ctx in {"tension", "family_pressure"} else "deepen"
    
    if rel_ctx == "tension" and rs_score >= 55: base = "Connected but stretched"
    if guarding: base = "Held at a distance"
    
    return {
        "id": "social_connection",
        "label": base,
        "guarding_reflection": guarding,
        "route": route,
        "confidence": "measurement"
    }

# --- 7. purpose_in_pain ---
def purpose_in_pain_pattern(priority_rank, scores_dict, confirmed):
    if not priority_rank: return None
    cands = []
    for p in priority_rank[:3]:
        dim = None
        p_lower = p.lower()
        if "meaning" in p_lower: dim = "meaning"
        elif "connect" in p_lower or "relation" in p_lower: dim = "relationships"
        elif "energy" in p_lower: dim = "energy"
        elif "body" in p_lower or "phys" in p_lower: dim = "physical"
        
        if dim and dim in scores_dict and scores_dict[dim] is not None and scores_dict[dim] < 55:
            cands.append((dim, scores_dict[dim]))
            
    if not cands: return None
    d, s = min(cands, key=lambda x: x[1])
    firmness = {"Yes": "plain", "Partly": "soft", "Not quite": "withhold"}.get(confirmed, "plain")
    return {
        "id": "purpose_in_pain",
        "dimension": d,
        "report_firmness": firmness,
        "confidence": "measurement"
    }

# --- 8. agency_gap ---
def agency_gap_pattern(ac_score, flags, aspiration_distance, trajectory):
    if ac_score is None: return None
    if ac_score >= 55: return {"id": "agency_gap", "label": "Steady momentum", "confidence": "measurement"}
    stuck_flags = {"feel_stuck", "cant_follow_through", "not_in_control"}
    wide = (aspiration_distance == "large") or any(f in stuck_flags for f in flags)
    label = "A wide gap between where you are and where you'd like to be" if wide else "A little stuck"
    urgency = "higher" if trajectory == "worse" else "normal"
    return {
        "id": "agency_gap",
        "label": label,
        "urgency": urgency,
        "confidence": "measurement"
    }

# --- 9. financial_strain ---
def financial_strain_pattern(fw_score, fin_stress, flags):
    if fw_score is None: return None
    base = "At ease with money" if fw_score >= 70 else "Some pressure, manageable" if fw_score >= 55 else "Money's weighing on you" if fw_score >= 40 else "Money's a real strain"
    if fin_stress == "high_anxiety_daily": 
        base = "Money's a real strain" if fw_score >= 40 else base
    money_gate = (fw_score < 55 or "money_friction" in flags)
    return {
        "id": "financial_strain",
        "label": base,
        "free_path_first": money_gate,
        "score_unchanged": True,
        "confidence": "measurement"
    }

# --- 10. environmental_depletion ---
def environmental_depletion_pattern(ec_score, env_quality, nature_access, cultural_safety):
    if ec_score is None: return None
    label = "Restorative surroundings" if ec_score >= 70 else "Neutral" if ec_score >= 55 else "Draining more than restoring" if ec_score >= 40 else "Out of place"
    if env_quality in {"stressful", "chaotic", "no_control"}:
        label = "Draining more than restoring" if ec_score >= 55 else "Out of place"
    return {
        "id": "environmental_depletion",
        "label": label,
        "nature_dose": (nature_access in {"rarely", "no"}),
        "cultural_safety": cultural_safety,
        "confidence": "measurement"
    }

# --- 11. curiosity_depletion ---
def curiosity_depletion_pattern(ig_score, recency, flags):
    if ig_score is None: return None
    label = "Curious & engaged" if ig_score >= 70 else "Coasting" if ig_score >= 55 else "Running dry" if ig_score >= 40 else "No space for it right now"
    drained = ("too_drained" in flags) or recency == "no_space"
    if ig_score < 55 and drained:
        label = "Running dry"
    return {
        "id": "curiosity_depletion",
        "label": label,
        "lead_with_rest": drained,
        "confidence": "measurement"
    }

# --- 12. stability_urgency ---
def stability_urgency_pattern(stability_str, trajectory_dict, support_pref, recovery_load_label):
    compassion = "standard"
    if support_pref == "fragile" or stability_str == "very_turbulent" or recovery_load_label == "Carrying a lot":
        compassion = "gentlest"
    elif stability_str in {"unsettled", "mixed"}:
        compassion = "warm"
        
    urgency = {d: ("higher" if traj == "worse" else "normal") for d, traj in trajectory_dict.items()}
    return {
        "id": "stability_urgency",
        "compassion": compassion,
        "urgency": urgency
    }

# --- 13. bright_spot ---
def bright_spot_pattern(scores_dict, free_text):
    scored = {k: v for k, v in scores_dict.items() if v is not None}
    if not scored:
        return {"id": "bright_spot", "dimension": None, "tier": "none", "why": free_text, "confidence": "measurement"}
    top = max(scored, key=scored.get)
    s = scored[top]
    tier = "genuine" if s >= 55 else "modest" if s >= 40 else "none"
    return {
        "id": "bright_spot",
        "dimension": top if tier != "none" else None,
        "tier": tier,
        "why": free_text,
        "confidence": "measurement"
    }

# --- 14. priority_tension ---
def priority_tension_pattern(priority_rank, scores_dict, confirmed):
    pip = purpose_in_pain_pattern(priority_rank, scores_dict, confirmed)
    if not pip: return None
    return {
        "id": "priority_tension",
        "dimension": pip["dimension"],
        "surface": True,
        "firmness": pip.get("report_firmness", "plain")
    }

# --- 15. suggestion_readiness ---
def suggestion_readiness_pattern(planner, support_pref, prior, state, recovery_load_label):
    base_map = {"7day": 3, "one_thing": 2, "overwhelmed": 1}
    base = base_map.get(planner, 1)
    if state in {"activated", "collapsed"} or recovery_load_label == "Carrying a lot":
        base = min(base, 2)
    if support_pref == "fragile" or planner == "overwhelmed":
        base = 1
    why_different = (prior == "didnt_stick")
    return {
        "id": "suggestion_readiness",
        "stack_size": base,
        "shrink_with_why": why_different
    }

# --- PORTRAITS ---
def evaluate_portraits(scores_dict, patterns, lwi_data, safety_dict, leverage_dim):
    if all(s is not None and s < 40 for s in scores_dict.values()) or safety_dict.get("distress", {}).get("tier") == "signpost":
        return {"id": "depleted_field", "label": "Depleted across the board", "is_state_not_type": True}
        
    recovery = next((p for p in patterns if p and p["id"] == "recovery_load"), None)
    low_count = sum(1 for s in scores_dict.values() if s is not None and s < 55)
    if recovery and recovery.get("label") == "Carrying a lot" and low_count >= 2:
        return {"id": "carrying_a_lot", "label": "Carrying a lot right now", "is_state_not_type": True}
        
    ph = scores_dict.get("physical")
    en = scores_dict.get("energy")
    if ph is not None and ph < 55 and en is not None and en < 55 and leverage_dim == "physical":
        return {"id": "low_tank", "label": "Running on a low tank", "is_state_not_type": True}
        
    pip = next((p for p in patterns if p and p["id"] == "purpose_in_pain"), None)
    if pip:
        return {"id": "crossroads", "label": "At a crossroads", "is_state_not_type": True}
        
    rs = scores_dict.get("relationships")
    sc = next((p for p in patterns if p and p["id"] == "social_connection"), None)
    if (rs is not None and rs < 55) or (sc and sc.get("guarding_reflection")):
        return {"id": "connected_at_distance", "label": "Connected at a distance", "is_state_not_type": True}
        
    ac = scores_dict.get("accomplishment")
    if ac is not None and ac >= 70 and ((ph is not None and ph < 55) or (en is not None and en < 55)):
        return {"id": "holding_together", "label": "Holding it together", "is_state_not_type": True}
        
    if lwi_data.get("band") in {"Thriving", "Steady"} and lwi_data.get("shape") == "uneven":
        return {"id": "resourced_stretched", "label": "Resourced and stretched", "is_state_not_type": True}
        
    return {"id": "steady_ground", "label": "Steady ground", "is_state_not_type": True}

def run_pattern_engine(scores_dict, who5_overall, context, safety_dict, leverage_dim):
    patterns = []
    
    lwi = lwi_pattern(scores_dict, who5_overall)
    patterns.append(lwi)
    
    rec_load = recovery_load_pattern(context.get("cumulativeLoad_raw"), context.get("recoveryResponsiveness"))
    patterns.append(rec_load)
    
    slp = stress_load_pattern(context.get("stressPatternClusters", []), context.get("nervousSystemState"), None)
    patterns.append(slp)
    
    er = energy_rhythm_pattern(context.get("dayRhythmMap_zones", {}), False, False)
    patterns.append(er)
    
    sl = somatic_load_pattern("low", context.get("body_awareness", "medium"), context.get("flags", []))
    patterns.append(sl)
    
    sc = social_connection_pattern(scores_dict.get("relationships"), context.get("relationalContext"), "open")
    patterns.append(sc)
    
    pip = purpose_in_pain_pattern(context.get("priority_rank", []), scores_dict, context.get("priorityTensionCheck_confirmed"))
    if pip: patterns.append(pip)
    
    ag = agency_gap_pattern(scores_dict.get("accomplishment"), context.get("flags", []), "normal", "steady")
    patterns.append(ag)
    
    fs = financial_strain_pattern(scores_dict.get("financial"), "normal", context.get("flags", []))
    patterns.append(fs)
    
    ed = environmental_depletion_pattern(scores_dict.get("environment"), "normal", "yes", context.get("culturalBelonging", {}).get("safety"))
    patterns.append(ed)
    
    cd = curiosity_depletion_pattern(scores_dict.get("growth"), "recent", context.get("flags", []))
    patterns.append(cd)
    
    su = stability_urgency_pattern(context.get("lifeStability_str", "stable"), {}, context.get("supportPreference"), rec_load["label"])
    patterns.append(su)
    
    bs = bright_spot_pattern(scores_dict, context.get("brightSpotCheck"))
    patterns.append(bs)
    
    pt = priority_tension_pattern(context.get("priority_rank", []), scores_dict, context.get("priorityTensionCheck_confirmed"))
    if pt: patterns.append(pt)
    
    sr = suggestion_readiness_pattern(context.get("plannerReadiness", "one_thing"), context.get("supportPreference"), "none", context.get("nervousSystemState"), rec_load["label"])
    patterns.append(sr)
    
    portrait = evaluate_portraits(scores_dict, patterns, lwi, safety_dict, leverage_dim)
    
    return patterns, portrait
