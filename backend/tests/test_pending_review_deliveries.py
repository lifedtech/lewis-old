# test_pending_review_deliveries.py — the review-invitation email had zero
# recovery path: send_review_invitation_email() never recorded its result
# anywhere, so a job lost to a redeploy mid-delay was unrecoverable. This
# covers the recovery query the same way test_pending_report_deliveries.py
# covers the report one.
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import auth


def test_in_memory_only_order_counts_as_pending_review(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)
    auth.IN_MEMORY_ORDERS.clear()
    old_sent_at = (datetime.now(timezone.utc) - timedelta(seconds=1500)).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-ORD-R1"] = {
        "order_id": "TEST-ORD-R1",
        "report_uuid": "rep-1",
        "user_email": "user@example.com",
        "user_name": "Test User",
        "report_mail_sent": True,
        "report_mail_sent_at": old_sent_at,
        "review_mail_sent": False,
    }

    pending = auth.get_pending_review_deliveries(min_age_seconds=1200)

    assert any(p["order_id"] == "TEST-ORD-R1" for p in pending)


def test_order_excluded_once_review_mail_sent(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)
    auth.IN_MEMORY_ORDERS.clear()
    old_sent_at = (datetime.now(timezone.utc) - timedelta(seconds=1500)).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-ORD-R2"] = {
        "order_id": "TEST-ORD-R2",
        "user_email": "user@example.com",
        "report_mail_sent": True,
        "report_mail_sent_at": old_sent_at,
        "review_mail_sent": True,
    }

    pending = auth.get_pending_review_deliveries(min_age_seconds=1200)

    assert not any(p["order_id"] == "TEST-ORD-R2" for p in pending)


def test_order_excluded_before_report_mail_sent(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)
    auth.IN_MEMORY_ORDERS.clear()
    auth.IN_MEMORY_ORDERS["TEST-ORD-R3"] = {
        "order_id": "TEST-ORD-R3",
        "user_email": "user@example.com",
        "report_mail_sent": False,
        "review_mail_sent": False,
    }

    pending = auth.get_pending_review_deliveries(min_age_seconds=1200)

    assert not any(p["order_id"] == "TEST-ORD-R3" for p in pending)


def test_order_too_recent_excluded(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)
    auth.IN_MEMORY_ORDERS.clear()
    recent_sent_at = datetime.now(timezone.utc).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-ORD-R4"] = {
        "order_id": "TEST-ORD-R4",
        "user_email": "user@example.com",
        "report_mail_sent": True,
        "report_mail_sent_at": recent_sent_at,
        "review_mail_sent": False,
    }

    pending = auth.get_pending_review_deliveries(min_age_seconds=1200)

    assert not any(p["order_id"] == "TEST-ORD-R4" for p in pending)
