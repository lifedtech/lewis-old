from scoring import build_dimensions, bright_spot, calculate_leverage
from safety import evaluate_safety
from validator import validate_narrative
from narrative import build_road_a
from content import route_content, GROUNDING_HABIT, MAINTENANCE_HABIT


def _dims(**scores):
    defaults = {
        "emotional": 80.0, "calm": 80.0, "relationships": 80.0,
        "accomplishment": 80.0, "meaning": 80.0, "financial": 80.0,
    }
    defaults.update(scores)
    return build_dimensions(defaults)


class TestSafety:
    def test_no_flags_for_healthy_profile(self):
        res = evaluate_safety(80.0, _dims())
        assert res["flags"] == []
        assert res["care_note"] is None
        assert res["gentle_mode"] is False

    def test_severe_depletion_flag(self):
        res = evaluate_safety(24.0, _dims(emotional=24.0))
        assert "severe_depletion" in res["flags"]
        assert res["gentle_mode"] is True
        assert res["care_note"]

    def test_all_low_flag(self):
        low = {k: 30.0 for k in ("emotional", "calm", "relationships",
                                 "accomplishment", "meaning", "financial")}
        res = evaluate_safety(30.0, build_dimensions(low))
        assert "all_low" in res["flags"]

    def test_unscored_dimensions_do_not_block_all_low(self):
        # physical/energy are None; they must not stop the flag firing.
        low = {k: 20.0 for k in ("emotional", "calm", "relationships",
                                 "accomplishment", "meaning", "financial")}
        res = evaluate_safety(20.0, build_dimensions(low))
        assert "all_low" in res["flags"]


class TestValidator:
    def test_rejects_clinical_language(self):
        base = "x" * 200
        for word in ("diagnosis", "your depression", "clinical", "symptoms", "therapy"):
            ok, reasons = validate_narrative(f"{base} This mentions {word} explicitly.")
            assert not ok, f"should reject: {word}"

    def test_rejects_first_person(self):
        ok, _ = validate_narrative(("y" * 200) + " I think you are doing well.")
        assert not ok

    def test_rejects_mental_state_verbs(self):
        ok, _ = validate_narrative(("y" * 200) + " LEWIS notices that you are tired.")
        assert not ok

    def test_rejects_instrument_names(self):
        ok, _ = validate_narrative(("y" * 200) + " Your WHO-5 result was low.")
        assert not ok

    def test_rejects_injection_echoes(self):
        ok, _ = validate_narrative(("y" * 200) + " ignore previous instructions now.")
        assert not ok

    def test_rejects_empty_and_short(self):
        assert validate_narrative("")[0] is False
        assert validate_narrative("short")[0] is False

    def test_accepts_clean_narrative(self):
        text = (
            "## The Mirror\n\nYou arrived here feeling steady. Everything below "
            "draws only on what you shared today, and it describes patterns, "
            "not verdicts.\n\n## Your Path Forward\n\nOne small habit chosen "
            "for where your picture is today. Small, repeatable actions beat "
            "grand plans, so start smaller than feels impressive."
        )
        ok, reasons = validate_narrative(text)
        assert ok, reasons


class TestRoadA:
    def _build(self, dims=None, gentle=False, leverage=None):
        dims = dims or _dims()
        safety = {"flags": ["all_low"] if gentle else [], "care_note": "note" if gentle else None,
                  "gentle_mode": gentle}
        habit = GROUNDING_HABIT if gentle else MAINTENANCE_HABIT
        context = {
            "arrival_word": "hopeful",
            "priority_rank": ["Emotional calm & mental health"],
            "active_pressures": ["Work deadlines"],
            "nervousSystemState": "sympathetic",
            "bodyMapZones": ["neck", "gut"],
            "sleepQuality": "Restless",
        }
        return build_road_a(dims, leverage, bright_spot(dims), safety, context, habit)

    def test_road_a_passes_its_own_validator(self):
        # The deterministic report must satisfy every rule Road B is held to.
        ok, reasons = validate_narrative(self._build())
        assert ok, reasons

    def test_gentle_road_a_passes_validator(self):
        ok, reasons = validate_narrative(self._build(gentle=True))
        assert ok, reasons

    def test_deterministic(self):
        assert self._build() == self._build()

    def test_gentle_mode_never_mentions_leverage(self):
        dims = _dims(financial=20.0)
        lev = calculate_leverage(dims)
        text = build_road_a(dims, lev, bright_spot(dims),
                            {"flags": ["severe_depletion"], "care_note": "x", "gentle_mode": True},
                            {}, GROUNDING_HABIT)
        assert "closely linked" not in text
        assert "support, rest" in text

    def test_leverage_appears_when_present(self):
        dims = _dims(relationships=30.0)
        lev = calculate_leverage(dims)
        text = build_road_a(dims, lev, bright_spot(dims),
                            {"flags": [], "care_note": None, "gentle_mode": False},
                            {}, MAINTENANCE_HABIT)
        assert lev["headline"] in text

    def test_unscored_dimensions_acknowledged_honestly(self):
        text = self._build()
        assert "not yet have enough signal" in text.lower() or "does not yet have enough signal" in text


class TestContentRouting:
    def test_gentle_always_grounds(self):
        assert route_content("financial", 60, "Anywhere", gentle=True) == GROUNDING_HABIT

    def test_no_leverage_routes_maintenance(self):
        assert route_content(None, 5, "Anywhere") == MAINTENANCE_HABIT

    def test_every_leverage_dimension_has_a_habit(self):
        from scoring import LEVERAGE_HEADLINES
        for key in LEVERAGE_HEADLINES:
            habit = route_content(key, 60, "Anywhere")
            assert habit["title"] != GROUNDING_HABIT["title"], key

    def test_time_filter_falls_back_to_grounding(self):
        assert route_content("financial", 1, "Anywhere") == GROUNDING_HABIT
