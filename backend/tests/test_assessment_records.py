# test_assessment_records.py — round-trips answers_json through
# save_encrypted_assessment_record() / get_report_by_uuid() on the SQLite
# fallback path, guarding the new per-question answer storage.
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import auth
from scoring_streamlined import generate_streamlined_rro


def test_answers_json_round_trips(tmp_path, monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)
    monkeypatch.setattr(auth, "DATABASE_URL", "")
    monkeypatch.setattr(auth, "USE_SUPABASE_REST", False)
    monkeypatch.setattr(auth, "DB_PATH", str(tmp_path / "test_lewis.db"))
    auth.init_db()

    answers = {
        "who5": [4, 5, 3, 4, 5],
        "scored_instrument_answers": {
            "who5": [
                {"question": "I have felt cheerful and in good spirits", "answer": "Most of the time"},
            ],
        },
        "priorAttempts": "Tried journaling before.",
    }

    report_uuid = auth.save_encrypted_assessment_record(
        user_name="Jane Doe",
        user_email="jane@example.com",
        report_data={"dimensions": {"who5": {"wellbeing_band": "High", "scaled_score": 82.0}}},
        answers=answers,
    )

    rec = auth.get_report_by_uuid(report_uuid)

    assert rec is not None
    assert rec["answers_json"] == answers
    assert rec["report_json"]["dimensions"]["who5"]["wellbeing_band"] == "High"


def test_report_pdf_round_trips_per_plan(tmp_path, monkeypatch):
    """save_report_pdf/get_report_pdf must keep the 12-page streamlined and
    25-page full PDFs in separate columns — one report row can hold both,
    and asking for one plan's bytes must never return the other's."""
    monkeypatch.setattr(auth, "has_pg", False)
    monkeypatch.setattr(auth, "DATABASE_URL", "")
    monkeypatch.setattr(auth, "USE_SUPABASE_REST", False)
    monkeypatch.setattr(auth, "DB_PATH", str(tmp_path / "test_lewis.db"))
    auth.init_db()

    report_uuid = auth.save_encrypted_assessment_record(
        user_name="Jane Doe",
        user_email="jane@example.com",
        report_data={"dimensions": {"who5": {"wellbeing_band": "High", "scaled_score": 82.0}}},
    )

    assert auth.get_report_pdf(report_uuid, "streamlined_report") is None

    assert auth.save_report_pdf(report_uuid, "streamlined_report", b"%PDF-streamlined-bytes")
    assert auth.save_report_pdf(report_uuid, "personal_report", b"%PDF-full-bytes")

    assert bytes(auth.get_report_pdf(report_uuid, "streamlined_report")) == b"%PDF-streamlined-bytes"
    assert bytes(auth.get_report_pdf(report_uuid, "personal_report")) == b"%PDF-full-bytes"
    # No plan_id given: either stored PDF is an acceptable answer.
    assert bytes(auth.get_report_pdf(report_uuid)) in (b"%PDF-streamlined-bytes", b"%PDF-full-bytes")


def test_streamlined_rro_is_persisted_and_findable_by_its_returned_uuid(tmp_path, monkeypatch):
    """The bug: /assessment/streamlined generated a real RRO but never saved
    it, so get_report_by_uuid() always came back empty at delivery time and
    the frontend's client-side fallback ID pointed at nothing real. This
    guards the fix — save_encrypted_assessment_record(report_data=rro) must
    produce a report_uuid that finds the same RRO back, with real scored
    dimensions (not just a name/date placeholder shell)."""
    monkeypatch.setattr(auth, "has_pg", False)
    monkeypatch.setattr(auth, "DATABASE_URL", "")
    monkeypatch.setattr(auth, "USE_SUPABASE_REST", False)
    monkeypatch.setattr(auth, "DB_PATH", str(tmp_path / "test_lewis.db"))
    auth.init_db()

    sample_data = {
        "who5": {1: 4, 2: 3, 3: 4, 4: 3, 5: 4},
        "pss10": {1: 1, 2: 1, 3: 2, 4: 3, 5: 3, 6: 1, 7: 3, 8: 3, 9: 1, 10: 1},
        "ucla3": {1: 1, 2: 2, 3: 1},
        "gse6": {1: 3, 2: 3, 3: 4, 4: 3, 5: 4, 6: 3},
        "purpose": {1: 3, 2: 3, 3: 4, 4: 3},
        "cfpb5": {1: 1, 2: 1, 3: 1, 4: 3, 5: 1},
        "ins": 5,
        "growth": {1: 4, 2: 4, 3: 4},
        "name": "Priya",
    }
    rro = generate_streamlined_rro(sample_data, "sess_persist_test", "Priya")

    report_uuid = auth.save_encrypted_assessment_record(
        user_name="Priya",
        user_email="priya@example.com",
        report_data=rro,
        answers=sample_data,
    )
    assert report_uuid != rro["meta"]["rro_id"], "sanity: DB assigns its own uuid, distinct from the deterministic hash id"

    rec = auth.get_report_by_uuid(report_uuid)
    assert rec is not None, "the just-saved streamlined report must be findable by the uuid save returned"
    assert rec["report_json"]["dimensions"], "must carry real scored content, not just a name/date shell"
    assert rec["report_json"]["meta"]["name"] == "Priya"
