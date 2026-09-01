import io
import csv
import json
import pytest
from fastapi.testclient import TestClient

from main import app
from qa_dataset import (
    QUESTIONS_CATALOG,
    init_qa_schema,
    extract_and_store_user_answers,
    get_dataset_matrix,
    generate_dataset_csv,
)
from auth import save_encrypted_assessment_record

client = TestClient(app)


def test_question_catalog_completeness():
    assert len(QUESTIONS_CATALOG) >= 90
    keys = [q["question_key"] for q in QUESTIONS_CATALOG]
    assert "stage0_is_over_18" in keys
    assert "who5_q0" in keys
    assert "pss10_q0" in keys
    assert "gse_g1" in keys
    assert "promis_pr1" in keys
    assert "cfpb5_c1" in keys
    assert "diener_q0" in keys
    assert "stage5_ins" in keys
    assert "swls_q0" in keys
    assert "stage8_energy_arc_morning" in keys
    assert "stage3_body_map_zones" in keys


def test_qa_schema_initialization():
    init_qa_schema()
    # Ensure question endpoint returns catalog
    resp = client.get("/dataset/questions")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert data["count"] == len(QUESTIONS_CATALOG)


def test_assessment_ingestion_and_matrix_export():
    sample_payload = {
        "is_over_18": True,
        "name": "Dataset Tester",
        "email": "datasettester@example.com",
        "ageCategory": "25-34",
        "gender": "Female",
        "identityRoles": ["Professional/Leader", "Creator/Builder"],
        "lifeStability": 78,
        "active_pressures": ["Workload & deadlines", "Financial security"],
        "bodyMovement": "Daily intentional movement",
        "sleepQuality": "Deep & consistently restorative",
        "bodyContext": ["High screen time"],
        "who5": [5, 4, 4, 3, 5],
        "relationalContext": "Deeply anchored & supported",
        "priority_rank": [
            "Physical ease & recovery",
            "Emotional calm & mental health",
            "Energy & engagement",
            "Connection & relationships",
            "Meaning & purpose",
            "Progress & contribution",
            "Financial security & peace",
            "Intellectual growth & curiosity",
            "Environment & belonging"
        ],
        "arrival_word": "Curious",
        "financialPulse": {"comfort": "high"},
        "environmentalPulse": {"quiet": "yes"},
        "intellectualPulse": "Rich & expansive",
        "culturalBelonging": {"sense": "anchored"},
        "bodyRhythm": {"circadian": "aligned"},
        "attentionDriftDone": True,
        "affect": {"x": 0.65, "y": 0.45},
        "bodyMapZones": ["Neck / Throat", "Shoulders"],
        "dayRhythmMap": ["morning_peak", "afternoon_dip"],
        "breathingBefore": "Normal / Neutral",
        "breathingAfter": "Calmer & more open",
        "nervousSystemState": "Ventral Vagal (Safe & Social)",
        "body_awareness": "High clarity (Immediate body awareness)",
        "mazeCompletionTime": 14.8,
        "pss10": [1, 2, 1, 4, 4, 1, 3, 4, 1, 0],
        "ucla3": [0, 1, 0],
        "gse": [4, 4, 3, 4, 3, 4, 3, 4, 4, 4],
        "promis": [5, 4, 5, 4],
        "cfpb5": [4, 3, 3, 4, 1],
        "diener": [5, 5, 4, 5, 4, 5, 4, 5],
        "ins": 6,
        "swls": [4, 4, 5, 4, 3],
        "lifeLandscape": {"depleted": [], "okay": ["financial"], "strength": ["mental", "physical"]},
        "brightSpotCheck": "Emotional wellbeing",
        "priorityTensionCheck": "Work demands vs Rest",
        "everydaySharing": {"style": "Open with close circle"},
        "externalConditions": {"supportive": "family"},
        "priorAttempts": "Multiple sustained attempts",
        "aspirationLandscape": "Deep sustained vitality",
        "supportPreferences": ["Self-directed micro-habits", "1-on-1 expert coaching"],
        "plannerReadiness": "Ready immediately",
        "valuesCheck": ["Resilience", "Compassion"],
        "financialAspiration": "Emergency fund milestone",
        "energyArc": {"morning": "High / Peak Activation", "afternoon": "Moderate steady focus", "evening": "Relaxed & content", "night": "Calm transition into sleep"},
        "stressPatternClusters": ["Rumination / Overthinking"],
        "recoveryResponsiveness": "Rapid recovery (Hours)",
        "cumulativeLoad": "Light / Well managed",
        "soundPreference": "Natural soundscapes (Rain/Forest)",
        "quickChoices": {"color": "teal"},
        "session_id": "test_session_xyz",
        "started_at": "2026-09-01T10:00:00Z",
        "duration_seconds": 360,
    }

    rep_uuid = save_encrypted_assessment_record(
        user_name="Dataset Tester",
        user_email="datasettester@example.com",
        report_data={"dimensions": {"who5": {"scaled_score": 85, "wellbeing_band": "Robust"}}},
        started_at_iso="2026-09-01T10:00:00Z",
        duration_seconds=360,
        age_category="25-34",
        gender="Female",
        answers=sample_payload,
    )

    assert rep_uuid is not None

    # Test matrix data endpoint
    matrix_resp = client.get("/dataset/matrix?limit=10")
    assert matrix_resp.status_code == 200
    matrix_data = matrix_resp.json()
    assert matrix_data["status"] == "success"
    assert matrix_data["total_records"] >= 1
    assert len(matrix_data["columns"]) == len(QUESTIONS_CATALOG) + 7  # 7 metadata cols + all questions

    # Find the inserted row
    matching_rows = [r for r in matrix_data["rows"] if r["user_id"] == rep_uuid]
    assert len(matching_rows) == 1
    user_row = matching_rows[0]
    assert user_row["who5_q0"] == "All of the time" or user_row["who5_q0"] == "5.0" or user_row["who5_q0"] == "5"
    assert user_row["profile_age_category"] == "25-34"
    assert user_row["stage1_arrival_word"] == "Curious"
    assert "Neck / Throat" in user_row["stage3_body_map_zones"]

    # Test CSV export endpoint
    csv_resp = client.get("/dataset/export-csv?limit=10")
    assert csv_resp.status_code == 200
    assert "text/csv" in csv_resp.headers["content-type"]
    assert "attachment; filename=" in csv_resp.headers["content-disposition"]
    
    csv_text = csv_resp.text
    # Ensure BOM header is present for Excel
    assert csv_text.startswith("\ufeff") or "User / Assessment ID" in csv_text
    
    reader = csv.reader(io.StringIO(csv_text.lstrip("\ufeff")))
    headers = next(reader)
    assert "User / Assessment ID" in headers
    assert "Time Attended" in headers
    assert any("WHO5" in h for h in headers)
    assert any("PSS10" in h for h in headers)
