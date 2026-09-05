# test_report_linkage.py — a streamlined (₹349) and a later full (₹749)
# submission from the same person each get their own independent
# report_uuid (by design — see test_pdf_generator.py's
# test_plan_dispatch_sends_both_reports_independently_for_the_same_person),
# but nothing recorded they were the same person's journey until
# linked_report_uuid. Uses the real (test-isolated, see conftest.py) SQLite
# DB via save_encrypted_assessment_record/get_report_by_uuid.
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from auth import save_encrypted_assessment_record, get_report_by_uuid


def test_second_submission_links_back_to_the_first_for_the_same_email():
    streamlined_uuid = save_encrypted_assessment_record(
        user_name="Hero",
        user_email="hero-linkage@example.com",
        report_data={"dimensions": [{"code": "who5", "score": 70}]},
    )
    first_record = get_report_by_uuid(streamlined_uuid)
    assert first_record["linked_report_uuid"] is None, "first-ever submission has nothing to link to"

    full_uuid = save_encrypted_assessment_record(
        user_name="Hero",
        user_email="hero-linkage@example.com",
        report_data={"insight_report": {"pages": [{"number": 1}]}},
    )
    second_record = get_report_by_uuid(full_uuid)
    assert second_record["linked_report_uuid"] == streamlined_uuid, (
        "the later full submission must link back to the earlier streamlined one for the same person"
    )


def test_unrelated_emails_are_never_linked():
    save_encrypted_assessment_record(
        user_name="Person A",
        user_email="person-a@example.com",
        report_data={"dimensions": [{"code": "who5", "score": 70}]},
    )
    other_uuid = save_encrypted_assessment_record(
        user_name="Person B",
        user_email="person-b@example.com",
        report_data={"dimensions": [{"code": "who5", "score": 40}]},
    )
    other_record = get_report_by_uuid(other_uuid)
    assert other_record["linked_report_uuid"] is None, "different people must never be linked to each other"
