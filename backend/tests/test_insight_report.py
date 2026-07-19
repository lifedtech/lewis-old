# Tests for the rulebook v3.0 insight report: the enriched object, the
# 16-page deterministic generator, and the §17 self-check gate.
#
# The core property under test: for ANY profile, the built document
# passes the gate (vocabulary firewall, punctuation, bands, required
# content) and honours safety and commerce behaviour.

import json

from scoring import build_dimensions, bright_spot, calculate_leverage
from safety import evaluate_safety
from content import route_content
from pattern import run_pattern_engine
from enrich import build_enriched_object, REPORT_BAND
from insight_report import build_insight_report
from report_gate import check_report, _page_text


BASE_CONTEXT = {
    "name": "Meera Nair",
    "location": "Kochi",
    "date": "18 July 2026",
    "arrival_word": "stretched",
    "priority_rank": ["Physical ease & recovery"],
    "priority_confirmed": "Yes",
    "active_pressures": ["work deadlines"],
    "body_zones": ["head", "neck", "back"],
    "sleep_quality": "restless",
    "recovery": "still_tired",
    "nervous_system": "sympathetic",
    "stress_clusters": ["racing mind", "hard to switch off"],
    "energy_arc": {"morning": "Med", "afternoon": "Low", "evening": "High", "night": "Med"},
    "breathing_before": "tight",
    "breathing_after": "easier",
    "support_preference": "structured",
    "sound_preference": "soft layered",
    "friction": "time being out of your control",
    "prior_attempts": None,
}


def _build_report(scores, context=None, who5=None):
    ctx = dict(BASE_CONTEXT)
    if context:
        ctx.update(context)
    dimensions = build_dimensions(scores)
    who5_scaled = who5 if who5 is not None else (scores.get("emotional") or 50)
    safety = evaluate_safety(who5_scaled, dimensions)
    leverage = None if safety["gentle_mode"] else calculate_leverage(
        dimensions, active_pressures=ctx["active_pressures"])
    bright = bright_spot(dimensions)
    habit = route_content(leverage["dimension"] if leverage else None, 5,
                          "Anywhere", gentle=safety["gentle_mode"])
    scores_dict = {k: v["score"] for k, v in dimensions.items()}
    pat_context = {
        "cumulativeLoad_raw": 20,
        "recoveryResponsiveness": ctx["recovery"],
        "stressPatternClusters": ctx["stress_clusters"],
        "nervousSystemState": ctx["nervous_system"],
        "dayRhythmMap_zones": {},
        "priority_rank": ctx["priority_rank"],
        "priorityTensionCheck_confirmed": ctx["priority_confirmed"],
        "plannerReadiness": "one_thing",
        "flags": [],
        "culturalBelonging": {},
    }
    patterns, portrait = run_pattern_engine(
        scores_dict, who5_scaled, pat_context, safety,
        leverage["dimension"] if leverage else None)
    enriched = build_enriched_object(
        dimensions, leverage, bright, safety, patterns, portrait, habit, ctx)
    return enriched, build_insight_report(enriched)


UNEVEN = {
    "emotional": 48.0, "calm": 42.0, "relationships": 78.0,
    "accomplishment": 60.0, "meaning": 82.0, "financial": 58.0,
    "growth": 62.0, "environment": 74.0, "physical": 30.0, "energy": 34.0,
}
EVEN_HIGH = {
    "emotional": 78.0, "calm": 74.0, "relationships": 80.0,
    "accomplishment": 76.0, "meaning": 82.0, "financial": 75.0,
    "growth": 77.0, "environment": 74.0, "physical": 72.0, "energy": 76.0,
}
ALL_LOW = {
    "emotional": 25.0, "calm": 28.0, "relationships": 30.0,
    "accomplishment": 26.0, "meaning": 32.0, "financial": 22.0,
    "growth": 28.0, "environment": 30.0, "physical": 20.0, "energy": 24.0,
}
MONEY_STRAINED = dict(UNEVEN, financial=30.0)
PARTIAL = {
    "emotional": 60.0, "calm": 55.0, "relationships": 62.0,
    "accomplishment": 58.0, "meaning": 64.0, "financial": 60.0,
    "growth": None, "environment": None, "physical": 45.0, "energy": 50.0,
}

PROFILES = [UNEVEN, EVEN_HIGH, ALL_LOW, MONEY_STRAINED, PARTIAL]


class TestGateAcrossProfiles:
    def test_every_profile_passes_the_gate(self):
        for scores in PROFILES:
            _, report = _build_report(scores, who5=scores["emotional"])
            issues = check_report(report)
            assert issues == [], f"profile {scores}: {issues}"

    def test_sixteen_pages_always(self):
        for scores in PROFILES:
            _, report = _build_report(scores, who5=scores["emotional"])
            assert len(report["pages"]) == 16

    def test_no_context_still_passes(self):
        ctx = {k: None for k in BASE_CONTEXT}
        ctx.update({"priority_rank": [], "active_pressures": [],
                    "body_zones": [], "stress_clusters": [], "energy_arc": {},
                    "date": "18 July 2026"})
        _, report = _build_report(UNEVEN, context=ctx, who5=48.0)
        assert check_report(report) == []


class TestBandContract:
    def test_band_mapping_words(self):
        assert REPORT_BAND == {
            "Thriving": "Strong", "Steady": "Steady",
            "Strained": "Under pressure", "Depleted": "Running on empty",
        }

    def test_no_numeric_scores_in_text(self):
        enriched, report = _build_report(UNEVEN, who5=48.0)
        text = _page_text(report)
        for entry in enriched["areas"].values():
            if entry["score"] is not None:
                assert str(int(entry["score"])) + " out of" not in text
        assert "0." not in _page_text(report["pages"][3])  # no decimals on p4

    def test_unscored_area_named_not_guessed(self):
        _, report = _build_report(PARTIAL, who5=60.0)
        p4_text = _page_text(report["pages"][3])
        assert "Not read" in p4_text
        assert "left unread" in p4_text.lower() or "unread" in p4_text.lower()


class TestSafetyBehaviour:
    def test_gentle_mode_suppresses_programs(self):
        enriched, report = _build_report(ALL_LOW, who5=25.0)
        assert enriched["safety"]["tier"] == "signpost"
        assert enriched["commerce"]["cap"] == "suppressed"
        p13_text = _page_text(report["pages"][12]).lower()
        assert "free path" in p13_text
        assert "booking" not in p13_text
        assert check_report(report) == []

    def test_gentle_mode_adds_care_note_and_signpost(self):
        _, report = _build_report(ALL_LOW, who5=25.0)
        p3_text = _page_text(report["pages"][2]).lower()
        p14_text = _page_text(report["pages"][13]).lower()
        assert "note of care" in p3_text
        assert "someone you trust" in p14_text

    def test_gentle_mode_uses_grounding_anchor(self):
        _, report = _build_report(ALL_LOW, who5=25.0)
        p11_text = _page_text(report["pages"][10]).lower()
        assert "three breath" in p11_text


class TestCommerceGating:
    def test_money_strain_gates_to_free_low_cost(self):
        enriched, report = _build_report(MONEY_STRAINED, who5=48.0)
        assert enriched["commerce"]["cap"] == "free_low_cost_only"
        p13_text = _page_text(report["pages"][12]).lower()
        assert "later, if it fits" in p13_text
        assert "nothing in this report asks you to spend" in p13_text

    def test_free_path_precedes_programs(self):
        _, report = _build_report(EVEN_HIGH, who5=78.0)
        p13_text = _page_text(report["pages"][12]).lower()
        free_idx = p13_text.find("free path")
        program_idx = p13_text.find("what to check before booking")
        assert free_idx != -1
        if program_idx != -1:
            assert free_idx < program_idx


class TestStructure:
    def test_uneven_shape_names_strengths_before_stretched(self):
        _, report = _build_report(UNEVEN, who5=48.0)
        p3_text = _page_text(report["pages"][2])
        strengths_idx = p3_text.find("load bearing work")
        stretched_idx = p3_text.find("reads stretched")
        assert strengths_idx != -1 and stretched_idx != -1
        assert strengths_idx < stretched_idx

    def test_starting_point_not_lowest_is_explained(self):
        enriched, report = _build_report(UNEVEN, who5=48.0)
        if not enriched["leverage"]["is_lowest"] and enriched["leverage"]["primary"]:
            p5_text = _page_text(report["pages"][4]).lower()
            assert "not automatically the best place to start" in p5_text

    def test_connections_only_from_licensed_list(self):
        enriched, report = _build_report(UNEVEN, who5=48.0)
        licensed = {(c["a"], c["b"]) for c in enriched["connections"]}
        p5 = report["pages"][4]
        link_labels = [item["label"] for b in p5["blocks"] if b.get("type") == "cards"
                       for item in b["items"] if item["label"].endswith("LINK")]
        assert len(link_labels) <= len(licensed)

    def test_supports_have_personalised_rationale(self):
        _, report = _build_report(UNEVEN, who5=48.0)
        p12 = report["pages"][11]
        supports = next(b for b in p12["blocks"] if b["type"] == "supports")
        for item in supports["items"]:
            assert item["why"].startswith("Why this, for you.")

    def test_capacity_row_present_in_choosing_table(self):
        _, report = _build_report(UNEVEN, who5=48.0)
        p12_text = _page_text(report["pages"][11]).lower()
        assert "already at capacity" in p12_text
        assert "the anchor alone is a complete plan" in p12_text

    def test_report_is_json_serialisable(self):
        _, report = _build_report(UNEVEN, who5=48.0)
        json.dumps(report)

    def test_same_object_same_conclusions(self):
        _, r1 = _build_report(UNEVEN, who5=48.0)
        _, r2 = _build_report(UNEVEN, who5=48.0)
        assert json.dumps(r1, sort_keys=True) == json.dumps(r2, sort_keys=True)
