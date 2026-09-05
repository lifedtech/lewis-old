# generate_demo_reports.py — builds one demo PDF for each report type
# through the real pipeline (real scoring, real Road A/B narration, real
# SSR/HTML rendering, real Playwright print) and drops them in
# generated_reports/ for a human to open and check.
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pdf_generator import build_insight_report_pdf, build_streamlined_report_pdf
from scoring_streamlined import generate_streamlined_rro

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "generated_reports")


def build_streamlined_demo() -> bytes:
    # A realistic, varied answer set — deliberately NOT the flat/default
    # profile, so scoring, band grouping, the link graph and root-driver
    # selection all have real work to do (exercises the exact sections
    # that were previously hardcoded: 02, 03, 05, 06, 07, 08, 09, 10).
    raw_data = {
        "who5": {1: 1, 2: 1, 3: 2, 4: 1, 5: 2},
        "pss10": {1: 3, 2: 3, 3: 2, 4: 3, 5: 3, 6: 2, 7: 3, 8: 3, 9: 2, 10: 2},
        "ucla3": {1: 2, 2: 1, 3: 2},
        "gse6": {1: 4, 2: 3, 3: 4, 4: 4, 5: 3, 6: 4},
        "purpose": {1: 4, 2: 4, 3: 3, 4: 4},
        "cfpb5": {1: 3, 2: 3, 3: 2, 4: 1, 5: 3},
        "ins": 3,
        "growth": {1: 2, 2: 2, 3: 2},
        "growth_recency": "A few months ago",
        "sleep_quality": "Generally poor",
        "activity_level": "Mostly sedentary, desk or screen most of the day",
        "nature_access": "Rarely",
        "cultural_belonging_1": "Somewhat, most of the time",
        "transcendent_connection": "Sometimes connected",
        "somatic_zones": ["Shoulders and back", "Jaw"],
        "ns_portrait": "Activated",
        "stress_cluster": "The Surge",
        "recovery_responsiveness": "Somewhat better, but not fully",
        "tension_before": 8,
        "tension_after": 5,
        "energy_arc": [
            {"k": "Morning", "v": 2}, {"k": "Afternoon", "v": 1},
            {"k": "Evening", "v": 3}, {"k": "Night", "v": 3},
        ],
        "arrival_word": "overwhelmed",
        "priority_top3": ["Emotional calm", "Body & recovery", "Money & security"],
        "tension_confirmed": "yes",
        "active_pressures": ["Sleep depletion", "Financial pressure"],
        "deepdive_flags": {
            "PH": ["Sleep isn't restoring me"],
            "FW": ["Money worry sits with me most days"],
        },
        "financial_stress": "High anxiety",
        "planner_readiness": "Give me one thing to focus on",
        "support_preference": "A mix of structure and flexibility",
        "name": "Priya",
    }
    rro = generate_streamlined_rro(raw_data, "demo-session-0001", "Priya")
    return build_streamlined_report_pdf(rro=rro, report_uuid="LSR2026-DEMO", user_name="Priya"), rro


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    full_pdf = build_insight_report_pdf()  # sample fixture -> the real 24-page pipeline
    full_path = os.path.join(OUT_DIR, "LEWIS-Insight-Report-FULL-24page-DEMO.pdf")
    with open(full_path, "wb") as f:
        f.write(full_pdf)
    print(f"wrote {len(full_pdf)} bytes -> {full_path}")

    streamlined_pdf, rro = build_streamlined_demo()
    streamlined_path = os.path.join(OUT_DIR, "LEWIS-Insight-Report-STREAMLINED-12page-DEMO.pdf")
    with open(streamlined_path, "wb") as f:
        f.write(streamlined_pdf)
    print(f"wrote {len(streamlined_pdf)} bytes -> {streamlined_path}")

    rro_path = os.path.join(OUT_DIR, "LEWIS-Insight-Report-STREAMLINED-12page-DEMO.rro.json")
    with open(rro_path, "w", encoding="utf-8") as f:
        json.dump(rro, f, indent=2)
    print(f"wrote RRO data -> {rro_path} (narration source: {rro['narration']['source']})")


if __name__ == "__main__":
    main()
