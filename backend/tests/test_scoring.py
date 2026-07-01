import pytest
from scoring import (
    calculate_who5,
    calculate_diener,
    calculate_ins,
    calculate_pss10,
    calculate_ucla3,
    calculate_gse,
    calculate_promis,
    calculate_cfpb5,
)

def test_calculate_who5():
    # 5 items, max score 25
    assert calculate_who5([5, 5, 5, 5, 5]) == {"raw_score": 25, "normalized_score": 100.0}
    assert calculate_who5([0, 0, 0, 0, 0]) == {"raw_score": 0, "normalized_score": 0.0}
    with pytest.raises(ValueError):
        calculate_who5([5, 5])

def test_calculate_diener():
    # 8 items, 1-7 scale. Min 8, Max 56
    assert calculate_diener([7]*8) == {"raw_score": 56, "normalized_score": 100.0}
    assert calculate_diener([1]*8) == {"raw_score": 8, "normalized_score": 0.0}
    with pytest.raises(ValueError):
        calculate_diener([1])

def test_calculate_ins():
    assert calculate_ins([7]) == {"raw_score": 7, "normalized_score": 100.0}
    assert calculate_ins([1]) == {"raw_score": 1, "normalized_score": 0.0}
    with pytest.raises(ValueError):
        calculate_ins([])

def test_calculate_pss10():
    # Reverse items (0-indexed): 3, 4, 6, 7. Scale is 0-4.
    # If a person scores 0 on everything, the reverse ones will be 4. Total = 4 * 4 = 16.
    assert calculate_pss10([0]*10) == {"raw_score": 16, "normalized_score": 40.0}
    # If a person scores 4 on everything, the reverse ones will be 0. Total = 4 * 6 = 24.
    assert calculate_pss10([4]*10) == {"raw_score": 24, "normalized_score": 60.0}
    with pytest.raises(ValueError):
        calculate_pss10([])

def test_calculate_ucla3():
    # 3 items, assume 0-2 or similar, total max 6 according to current logic
    assert calculate_ucla3([2, 2, 2]) == {"raw_score": 6, "normalized_score": 100.0}
    assert calculate_ucla3([0, 0, 0]) == {"raw_score": 0, "normalized_score": 0.0}
    with pytest.raises(ValueError):
        calculate_ucla3([])

def test_calculate_gse():
    assert calculate_gse([3]*10) == {"raw_score": 30, "normalized_score": 100.0}
    assert calculate_gse([0]*10) == {"raw_score": 0, "normalized_score": 0.0}
    with pytest.raises(ValueError):
        calculate_gse([])

def test_calculate_promis():
    assert calculate_promis([4]*4) == {"raw_score": 16, "normalized_score": 100.0}
    assert calculate_promis([0]*4) == {"raw_score": 0, "normalized_score": 0.0}
    with pytest.raises(ValueError):
        calculate_promis([])

def test_calculate_cfpb5():
    # Items 0, 1, 2, 4 are reverse scored from a 0-4 scale: (4 - score). Item 3 is not.
    # Max possible stress points = 20.
    # Scores [0,0,0,4,0] -> (4-0) + (4-0) + (4-0) + 4 + (4-0) = 4+4+4+4+4 = 20 (max stress)
    assert calculate_cfpb5([0, 0, 0, 4, 0]) == {"raw_score": 20, "normalized_score": 100.0}
    # Scores [4,4,4,0,4] -> (4-4) + (4-4) + (4-4) + 0 + (4-4) = 0 (min stress)
    assert calculate_cfpb5([4, 4, 4, 0, 4]) == {"raw_score": 0, "normalized_score": 0.0}
    with pytest.raises(ValueError):
        calculate_cfpb5([])
