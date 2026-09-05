# test_pending_report_deliveries.py — covers the in-memory fallback tier in
# get_pending_report_deliveries(). Found live in prod: an order that only
# ever landed in IN_MEMORY_ORDERS (Postgres/SQLite writes not persisting)
# was findable by get_payment_order() but invisible to the reconciliation
# query, so a lost delayed-mail job could never be recovered.
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import auth


def test_sqlite_order_excluded_once_alert_sent():
    """Same dead-letter gate as the in-memory tier, exercised against the
    real (isolated test) SQLite DB via save_payment_order/update_order_email_status
    — catches a query referencing a column init_db() never actually added."""
    from auth import save_payment_order, update_order_email_status

    old_paid_at = (datetime.now(timezone.utc) - timedelta(seconds=600)).isoformat()
    save_payment_order(
        order_id="TEST-ORD-SQLITE-1",
        report_uuid="rep-sqlite-1",
        plan_id="personal_report",
        amount=74900,
        currency="INR",
        user_email="user@example.com",
        user_name="Test User",
    )
    auth.record_successful_payment(order_id="TEST-ORD-SQLITE-1", payment_id="pay_test_1")
    update_order_email_status("TEST-ORD-SQLITE-1", "report_alert", True)
    # Backdate paid_at directly — record_successful_payment always stamps "now".
    conn = __import__("sqlite3").connect(auth.DB_PATH)
    conn.execute("UPDATE lewis_payment_orders SET paid_at = ? WHERE order_id = ?", (old_paid_at, "TEST-ORD-SQLITE-1"))
    conn.commit()
    conn.close()

    pending = auth.get_pending_report_deliveries(min_age_seconds=300)

    assert not any(p["order_id"] == "TEST-ORD-SQLITE-1" for p in pending)


def test_in_memory_only_order_counts_as_pending(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)  # force past the Postgres/SQLite tiers
    auth.IN_MEMORY_ORDERS.clear()
    old_paid_at = (datetime.now(timezone.utc) - timedelta(seconds=600)).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-ORD-1"] = {
        "order_id": "TEST-ORD-1",
        "report_uuid": "rep-1",
        "status": "paid",
        "user_email": "user@example.com",
        "user_name": "Test User",
        "report_mail_sent": False,
        "paid_at": old_paid_at,
    }

    pending = auth.get_pending_report_deliveries(min_age_seconds=300)

    assert any(p["order_id"] == "TEST-ORD-1" for p in pending)


def test_in_memory_order_excluded_once_report_mail_sent(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)
    auth.IN_MEMORY_ORDERS.clear()
    old_paid_at = (datetime.now(timezone.utc) - timedelta(seconds=600)).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-ORD-2"] = {
        "order_id": "TEST-ORD-2",
        "status": "paid",
        "user_email": "user@example.com",
        "report_mail_sent": True,
        "paid_at": old_paid_at,
    }

    pending = auth.get_pending_report_deliveries(min_age_seconds=300)

    assert not any(p["order_id"] == "TEST-ORD-2" for p in pending)


def test_in_memory_order_excluded_once_alert_sent(monkeypatch):
    """The dead-letter gate: once the tech failure alert has fired for an
    order, it needs a human to fix and manually /admin/resend-report — not
    another automatic reconciliation attempt every 30s forever."""
    monkeypatch.setattr(auth, "has_pg", False)
    auth.IN_MEMORY_ORDERS.clear()
    old_paid_at = (datetime.now(timezone.utc) - timedelta(seconds=600)).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-ORD-4"] = {
        "order_id": "TEST-ORD-4",
        "status": "paid",
        "user_email": "user@example.com",
        "report_mail_sent": False,
        "report_alert_mail_sent": True,
        "paid_at": old_paid_at,
    }

    pending = auth.get_pending_report_deliveries(min_age_seconds=300)

    assert not any(p["order_id"] == "TEST-ORD-4" for p in pending)


def test_in_memory_order_too_recent_excluded(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)
    auth.IN_MEMORY_ORDERS.clear()
    recent_paid_at = datetime.now(timezone.utc).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-ORD-3"] = {
        "order_id": "TEST-ORD-3",
        "status": "paid",
        "user_email": "user@example.com",
        "report_mail_sent": False,
        "paid_at": recent_paid_at,
    }

    pending = auth.get_pending_report_deliveries(min_age_seconds=300)

    assert not any(p["order_id"] == "TEST-ORD-3" for p in pending)
