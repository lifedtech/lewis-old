# Tests for the V1 similarity corpus engine. The invariants here are the
# spec's hard lines: state-only matching (never demographics, never safety),
# neutral priors from a synthetic corpus, read-only over the assessment,
# and coarse positions as words the validator's number-ban can never trip on.

import copy

import pytest

import corpus
from corpus import (
    build_state_vector, coarse_position, map_to_corpus, positions_for,
    SPEC_CODES, K_MIN,
)


FULL_SCORES = {
    "PH": 21.0, "EM": 72.0, "EN": 32.0, "RS": 83.3, "MS": 83.8,
    "AC": 80.0, "FW": 75.0, "IG": 79.2, "EC": 70.4,
}


class TestCorpusLoading:
    def test_corpus_loads_and_is_synthetic(self):
        rows = corpus._load()
        assert len(rows) == 10000
        assert all(r["is_synthetic"] for r in rows)


class TestCoarsePositions:
    def test_extremes(self):
        for code in SPEC_CODES:
            assert coarse_position(code, 5.0) == "lower"
            assert coarse_position(code, 95.0) == "higher"

    def test_positions_are_words_only(self):
        positions = positions_for(FULL_SCORES)
        assert set(positions) == set(SPEC_CODES)
        assert set(positions.values()) <= {"lower", "middle", "higher"}

    def test_unscored_dimensions_get_no_position(self):
        scores = dict(FULL_SCORES, PH=None, EN=None)
        positions = positions_for(scores)
        assert "PH" not in positions and "EN" not in positions


class TestStateVectorInvariants:
    def test_demographics_can_never_enter_the_vector(self):
        for forbidden in ("sex", "age_band", "region", "metro", "distress_tier"):
            with pytest.raises(ValueError):
                build_state_vector(FULL_SCORES, {forbidden: "anything"})

    def test_live_vocab_is_mapped_to_corpus_vocab(self):
        vec = build_state_vector(FULL_SCORES, {
            "leverage": "PH",
            "nervous_system_state": "sympathetic",   # live intake word
            "readiness": "7day",
            "support_preference": "Gentle",
        })
        assert vec["nervous_system_state"] == "activated"
        assert vec["readiness"] == "full"
        assert vec["support_preference"] == "gentle"

    def test_unknown_vocab_is_skipped_not_faked(self):
        vec = build_state_vector(FULL_SCORES, {"readiness": "extremely keen"})
        assert vec["readiness"] is None

    def test_portrait_accepts_id_or_display_label(self):
        # pattern.py speaks ids; the corpus CSV stores display labels — both
        # normalise to the id (mapping confirmed vs lewis_10000_profiles.jsonl).
        by_id = build_state_vector(FULL_SCORES, {"portrait": "low_tank"})
        by_label = build_state_vector(FULL_SCORES, {"portrait": "Running on a low tank"})
        assert by_id["portrait"] == by_label["portrait"] == "low_tank"

    def test_stress_pattern_label_maps_to_corpus_vocab(self):
        vec = build_state_vector(FULL_SCORES, {
            "stress_pattern": "Wired & hard to switch off",
            "recovery": "still_tired",
        })
        assert vec["stress_pattern"] == "wired"
        assert vec["recovery"] == "still_tired"


class TestMapping:
    def _state(self):
        return {"leverage": "PH", "nervous_system_state": "sympathetic",
                "readiness": "one_thing", "support_preference": "gentle",
                "portrait": "low_tank",
                "stress_pattern": "Wired & hard to switch off",
                "recovery": "still_tired"}

    def test_full_profile_matches(self):
        result = map_to_corpus(FULL_SCORES, self._state())
        assert result["matched"] is True
        assert result["neighbours"] >= K_MIN
        assert result["corpus_is_synthetic"] is True

    def test_priors_are_neutral_on_the_synthetic_corpus(self):
        # The never-infer list: no outcome claim may be drawn from synthetic
        # rows, so effectiveness priors must be empty until real data exists.
        result = map_to_corpus(FULL_SCORES, self._state())
        assert result["effectiveness_priors"] == {}
        assert "synthetic" in result["priors_note"]

    def test_thin_profile_falls_back_without_matching(self):
        # Below MIN_SHARED_DIMS scored dimensions there is no individual
        # matching — only archetype-level context (the positions).
        scores = {c: None for c in SPEC_CODES}
        scores.update({"PH": 30.0, "EM": 40.0, "EN": 35.0})
        result = map_to_corpus(scores, self._state())
        assert result["matched"] is False
        assert result["neighbours"] == 0
        assert result["positions"]  # coarse context still offered

    def test_mapping_is_read_only(self):
        scores = dict(FULL_SCORES)
        state = self._state()
        before = (copy.deepcopy(scores), copy.deepcopy(state))
        map_to_corpus(scores, state)
        assert (scores, state) == before


class TestEndToEnd:
    def test_full_assessment_carries_positions_and_neutral_similarity(self, monkeypatch):
        import main
        monkeypatch.setattr(main, "generate_road_b", lambda voicing: None)
        payload = main.FullAssessmentInput(
            is_over_18=True,
            who5=[3, 3, 3, 3, 3], pss10=[2] * 10, ucla3=[1, 1, 1],
            gse=[3] * 10, promis=[2, 2, 2, 2], cfpb5=[2] * 5,
            diener=[5] * 8, ins=4, swls=[4] * 5,
            sleepQuality="Fairly well", bodyMovement="Most days",
            nervousSystemState="sympathetic", plannerReadiness="one_thing",
            supportPreferences=["gentle"], active_pressures=["money"],
        )
        res = main.calculate_full_assessment(payload)
        sim = res["similarity"]
        assert sim["corpus_is_synthetic"] is True
        assert sim["effectiveness_priors"] == {}
        # Every scored W dimension carries a coarse-position word; numbers
        # never appear in position fields.
        for entry in res["dimensions"].values():
            assert entry.get("position") in (None, "lower", "middle", "higher")
        scored_w_dims = [k for k, d in res["dimensions"].items()
                        if d["score"] is not None and k != "calm"]
        assert all(res["dimensions"][k]["position"] is not None for k in scored_w_dims)
