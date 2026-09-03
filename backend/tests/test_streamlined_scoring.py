# test_streamlined_scoring.py — Verification fixtures for reverse scoring & determinism
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from scoring_streamlined import (
    score_pss10,
    score_cfpb5,
    score_who5,
    score_ucla3,
    score_gse6,
    generate_streamlined_rro
)
from report_streamlined_html import render_streamlined_report_html

def test_pss10_reverse_scoring():
    # If all items are answered 0 (Never), reverse items (4,5,7,8) become 4.
    # Raw sum = 4 + 4 + 4 + 4 = 16.
    # Wellbeing = 100 * (40 - 16) / 40 = 60.0.
    all_zero = {i: 0 for i in range(1, 11)}
    raw, wb = score_pss10(all_zero)
    assert raw == 16
    assert wb == 60.0

    # Best possible scenario: non-reverse=0, reverse=4 (so reversed=0) -> raw = 0 -> wb = 100.0
    best_response = {1:0, 2:0, 3:0, 4:4, 5:4, 6:0, 7:4, 8:4, 9:0, 10:0}
    raw, wb = score_pss10(best_response)
    assert raw == 0
    assert wb == 100.0

def test_cfpb5_reverse_scoring():
    # CFPB-5: items 1,2,3,5 are reverse coded (4-x), item 4 is forward.
    # Best possible: items 1,2,3,5 are 0 (Not at all / describes me not at all -> becomes 4), item 4 is 4 (Always) -> sum = 20 -> 100.0
    best_cfpb = {1:0, 2:0, 3:0, 4:4, 5:0}
    score = score_cfpb5(best_cfpb)
    assert score == 100.0

def test_ucla3_scoring():
    # UCLA-3: items 1..3, raw 1 to 3 -> (9 - raw)/6 * 100
    # Minimum loneliness (all 1s) -> raw=3 -> (9-3)/6 * 100 = 100.0
    least_lonely = {1:1, 2:1, 3:1}
    assert score_ucla3(least_lonely) == 100.0
    # Maximum loneliness (all 3s) -> raw=9 -> 0.0
    most_lonely = {1:3, 2:3, 3:3}
    assert score_ucla3(most_lonely) == 0.0

def test_deterministic_rro_pipeline():
    sample_data = {
        "who5": {1: 4, 2: 3, 3: 4, 4: 3, 5: 4},
        "pss10": {1: 1, 2: 1, 3: 2, 4: 3, 5: 3, 6: 1, 7: 3, 8: 3, 9: 1, 10: 1},
        "ucla3": {1: 1, 2: 2, 3: 1},
        "gse6": {1: 3, 2: 3, 3: 4, 4: 3, 5: 4, 6: 3},
        "purpose": {1: 3, 2: 3, 3: 4, 4: 3},
        "cfpb5": {1: 1, 2: 1, 3: 1, 4: 3, 5: 1},
        "ins": 5,
        "growth": {1: 4, 2: 4, 3: 4},
        "growth_recency": "This week",
        "sleep_quality": "Consistently good",
        "activity_level": "Moderately active",
        "nature_access": "Yes, regularly",
        "cultural_belonging_1": "Strongly, I feel deeply at home",
        "transcendent_connection": "Deeply connected",
        "somatic_zones": ["Shoulders and back"],
        "ns_portrait": "Grounded",
        "stress_cluster": "The Surge",
        "recovery_responsiveness": "Genuinely recovered, I come back refreshed",
        "tension_before": 4,
        "tension_after": 2,
        "priority_top3": ["Emotional calm", "Body & recovery", "Meaning & purpose"],
        "name": "Alex"
    }

    rro1 = generate_streamlined_rro(sample_data, "sess_12345", "Alex")
    rro2 = generate_streamlined_rro(sample_data, "sess_12345", "Alex")

    assert rro1["meta"]["rrr_hash"] == rro2["meta"]["rrr_hash"]
    assert len(rro1["dimensions"]) == 9
    assert rro1["root_driver"] is not None
    assert rro1["suggestion"] is not None


def test_report_html_band_grouping_actually_follows_the_data():
    """Guards a real bug: sections 02/03/08 of the 12-page HTML used to
    hardcode which named dimensions appeared in which band (e.g.
    "Running on empty" was always exactly Body + Emotional calm, no
    matter what anyone's real bands were) — so the report looked
    personalized (real numbers) while its structure was actually a fixed
    demo. Flip which dimension is lowest and assert the report's band
    grouping flips with it."""
    base_dims = [
        {"key": "PH", "label": "Body and recovery", "score": 23, "band": 1},
        {"key": "EM", "label": "Emotional calm", "score": 27, "band": 1},
        {"key": "EN", "label": "Energy and drive", "score": 50, "band": 2},
        {"key": "RS", "label": "Relationships", "score": 67, "band": 3},
        {"key": "MS", "label": "Meaning and purpose", "score": 65, "band": 3},
        {"key": "AC", "label": "Progress and agency", "score": 56, "band": 3},
        {"key": "FW", "label": "Money and security", "score": 25, "band": 1},
        {"key": "IG", "label": "Curiosity and learning", "score": 37, "band": 1},
        {"key": "EC", "label": "Surroundings and belonging", "score": 44, "band": 2},
    ]
    html_default = render_streamlined_report_html({"dimensions": base_dims})

    # Swap Relationships (was Holding/band 3) into Running on empty
    # (band 1), and Body (was Running on empty) into Holding.
    swapped_dims = [dict(d) for d in base_dims]
    for d in swapped_dims:
        if d["key"] == "RS":
            d["score"], d["band"] = 20, 1
        elif d["key"] == "PH":
            d["score"], d["band"] = 70, 3
    html_swapped = render_streamlined_report_html({"dimensions": swapped_dims})

    # Section 03's "Running on empty" group must now name Relationships,
    # not Body.
    running_on_empty_default = html_default.split('Running on empty')[1][:2000]
    running_on_empty_swapped = html_swapped.split('Running on empty')[1][:2000]
    assert "Body and recovery" in running_on_empty_default
    assert "Relationships" not in running_on_empty_default
    assert "Relationships" in running_on_empty_swapped
    assert "Body and recovery" not in running_on_empty_swapped
