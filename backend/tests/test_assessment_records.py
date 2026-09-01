# test_assessment_records.py — round-trips answers_json through
# save_encrypted_assessment_record() / get_report_by_uuid() on the SQLite
# fallback path, guarding the new per-question answer storage.
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import auth


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
