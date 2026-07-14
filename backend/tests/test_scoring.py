import pytest

from scoring import (
    band_for, calculate_who5, calculate_pss10, calculate_ucla3,
    calculate_gse, calculate_promis, calculate_cfpb5, calculate_diener,
    calculate_ins, calculate_swls, build_dimensions, bright_spot,
    calculate_leverage, LEVERAGE_GATE,
)


class TestBands:
    def test_boundaries(self):
        assert band_for(100) == "Thriving"
        assert band_for(70) == "Thriving"
        assert band_for(69.9) == "Steady"
        assert band_for(55) == "Steady"
        assert band_for(54.9) == "Stretched"
        assert band_for(40) == "Stretched"
        assert band_for(39.9) == "Asking for care"
        assert band_for(0) == "Asking for care"


class TestWho5:
    def test_max(self):
        assert calculate_who5([5] * 5)["normalized_score"] == 100.0

    def test_min(self):
        assert calculate_who5([0] * 5)["normalized_score"] == 0.0

    def test_scaling_is_times_four(self):
        assert calculate_who5([3, 3, 3, 3, 3])["normalized_score"] == 60.0

    def test_rejects_wrong_length(self):
        with pytest.raises(ValueError):
            calculate_who5([3, 3, 3])

    def test_rejects_out_of_range(self):
        with pytest.raises(ValueError):
            calculate_who5([6, 0, 0, 0, 0])


class TestPss10:
    def test_reverse_items_4_5_7_8(self):
        # All zeros: the four positively-stated items reverse to 4 each.
        res = calculate_pss10([0] * 10)
        assert res["raw_score"] == 16
        assert res["stress_score"] == 40.0
        assert res["normalized_score"] == 60.0  # calm = 100 - stress

    def test_worst_case(self):
        # Highest stress: 4 on negative items, 0 on reverse items.
        scores = [4, 4, 4, 0, 0, 4, 0, 0, 4, 4]
        res = calculate_pss10(scores)
        assert res["raw_score"] == 40
        assert res["stress_score"] == 100.0
        assert res["normalized_score"] == 0.0

    def test_best_case(self):
        scores = [0, 0, 0, 4, 4, 0, 4, 4, 0, 0]
        res = calculate_pss10(scores)
        assert res["raw_score"] == 0
        assert res["normalized_score"] == 100.0


class TestUcla3:
    def test_loneliest_maps_to_zero_connection(self):
        res = calculate_ucla3([2, 2, 2])
        assert res["loneliness_score"] == 100.0
        assert res["normalized_score"] == 0.0

    def test_least_lonely_maps_to_full_connection(self):
        res = calculate_ucla3([0, 0, 0])
        assert res["normalized_score"] == 100.0

    def test_polarity_is_inverted_at_source(self):
        # Higher raw loneliness must always mean LOWER normalized score.
        lonely = calculate_ucla3([2, 1, 2])["normalized_score"]
        connected = calculate_ucla3([0, 1, 0])["normalized_score"]
        assert lonely < connected


class TestGse:
    def test_range(self):
        assert calculate_gse([4] * 10)["normalized_score"] == 100.0
        assert calculate_gse([1] * 10)["normalized_score"] == 0.0


class TestPromis:
    def test_range(self):
        assert calculate_promis([4] * 4)["normalized_score"] == 100.0
        assert calculate_promis([0] * 4)["normalized_score"] == 0.0


class TestCfpb5:
    def test_best_case_full_peace(self):
        # Items 1-3: 'Not at all' (4). Item 4: 'Always' money left (0).
        # Item 5: 'Never' controlled by finances (4).
        res = calculate_cfpb5([4, 4, 4, 0, 4])
        assert res["stress_score"] == 0.0
        assert res["normalized_score"] == 100.0

    def test_worst_case_full_stress(self):
        res = calculate_cfpb5([0, 0, 0, 4, 0])
        assert res["stress_score"] == 100.0
        assert res["normalized_score"] == 0.0

    def test_item4_polarity_differs_from_item5(self):
        # 'Always have money left over' is good; 'finances always control
        # my life' is bad — same answer index, opposite contribution.
        base = calculate_cfpb5([2, 2, 2, 0, 4])["stress_score"]
        flipped = calculate_cfpb5([2, 2, 2, 4, 0])["stress_score"]
        assert base < flipped


class TestOptionalScales:
    def test_diener(self):
        assert calculate_diener([7] * 8)["normalized_score"] == 100.0
        assert calculate_diener([1] * 8)["normalized_score"] == 0.0

    def test_ins(self):
        assert calculate_ins([7])["normalized_score"] == 100.0
        assert calculate_ins([1])["normalized_score"] == 0.0

    def test_swls(self):
        assert calculate_swls([7] * 5)["normalized_score"] == 100.0
        assert calculate_swls([1] * 5)["normalized_score"] == 0.0


class TestDimensions:
    def test_unscored_dimensions_are_null_not_faked(self):
        dims = build_dimensions({"emotional": 80.0})
        assert dims["physical"]["score"] is None
        assert dims["physical"]["band"] is None
        assert dims["energy"]["score"] is None
        assert dims["emotional"]["band"] == "Thriving"

    def test_bright_spot_picks_highest_scored(self):
        dims = build_dimensions({"emotional": 40.0, "meaning": 90.0, "calm": 60.0})
        assert bright_spot(dims) == "meaning"

    def test_bright_spot_none_when_nothing_scored(self):
        assert bright_spot(build_dimensions({})) is None


class TestLeverage:
    def _dims(self, **scores):
        defaults = {
            "emotional": 80.0, "calm": 80.0, "relationships": 80.0,
            "accomplishment": 80.0, "meaning": 80.0, "financial": 80.0,
        }
        defaults.update(scores)
        return build_dimensions(defaults)

    def test_thriving_profile_has_no_leverage(self):
        # The lowness gate: a balanced profile is never assigned a driver.
        assert calculate_leverage(self._dims()) is None

    def test_gate_boundary(self):
        assert calculate_leverage(self._dims(calm=LEVERAGE_GATE)) is None
        assert calculate_leverage(self._dims(calm=LEVERAGE_GATE - 0.1)) is not None

    def test_picks_gated_dimension(self):
        result = calculate_leverage(self._dims(relationships=30.0))
        assert result["dimension"] == "relationships"

    def test_language_is_non_causal(self):
        result = calculate_leverage(self._dims(financial=20.0, calm=25.0))
        headline = result["headline"].lower()
        for causal in ("root", "driver", "cause", "causing", "driving"):
            assert causal not in headline
        # The framing must explicitly disclaim causation.
        assert "not a cause" in result["framing"]

    def test_only_low_dimensions_compete(self):
        # relationships has the top weight, but it is above the gate here,
        # so the low financial dimension must win.
        result = calculate_leverage(self._dims(financial=30.0, relationships=60.0))
        assert result["dimension"] == "financial"
