# test_pending_confirmation_deliveries.py — the gap this closes: the
# payment-confirmation email only ever got one immediate, unretried
# dispatch attempt, unlike report_delivery and review_invitation which
# both already had a reconciliation safety net. A lost immediate dispatch
# (process restart mid-send, a momentary Brevo blip) meant the customer
# never got told their payment went through, with nothing watching for it.
import os
import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import auth


def test_sqlite_order_excluded_once_confirmation_sent():
    from auth import save_payment_order, update_order_email_status

    old_paid_at = (datetime.now(timezone.utc) - timedelta(seconds=120)).isoformat()
    save_payment_order(
        order_id="TEST-CONF-SQLITE-1",
        report_uuid="rep-conf-sqlite-1",
        plan_id="personal_report",
        amount=74900,
        currency="INR",
        user_email="user@example.com",
        user_name="Test User",
    )
    auth.record_successful_payment(order_id="TEST-CONF-SQLITE-1", payment_id="pay_test_1")
    update_order_email_status("TEST-CONF-SQLITE-1", "confirmation", True)
    conn = __import__("sqlite3").connect(auth.DB_PATH)
    conn.execute("UPDATE lewis_payment_orders SET paid_at = ? WHERE order_id = ?", (old_paid_at, "TEST-CONF-SQLITE-1"))
    conn.commit()
    conn.close()

    pending = auth.get_pending_confirmation_deliveries(min_age_seconds=60)

    assert not any(p["order_id"] == "TEST-CONF-SQLITE-1" for p in pending)


def test_sqlite_unsent_old_confirmation_is_pending():
    from auth import save_payment_order

    old_paid_at = (datetime.now(timezone.utc) - timedelta(seconds=120)).isoformat()
    save_payment_order(
        order_id="TEST-CONF-SQLITE-2",
        report_uuid="rep-conf-sqlite-2",
        plan_id="streamlined_report",
        amount=34900,
        currency="INR",
        user_email="user2@example.com",
        user_name="Test User Two",
    )
    auth.record_successful_payment(order_id="TEST-CONF-SQLITE-2", payment_id="pay_test_2")
    conn = __import__("sqlite3").connect(auth.DB_PATH)
    conn.execute("UPDATE lewis_payment_orders SET paid_at = ? WHERE order_id = ?", (old_paid_at, "TEST-CONF-SQLITE-2"))
    conn.commit()
    conn.close()

    pending = auth.get_pending_confirmation_deliveries(min_age_seconds=60)

    assert any(p["order_id"] == "TEST-CONF-SQLITE-2" for p in pending)


def test_too_recent_confirmation_is_not_yet_pending():
    from auth import save_payment_order

    save_payment_order(
        order_id="TEST-CONF-SQLITE-3",
        report_uuid="rep-conf-sqlite-3",
        plan_id="personal_report",
        amount=74900,
        currency="INR",
        user_email="user3@example.com",
        user_name="Test User Three",
    )
    auth.record_successful_payment(order_id="TEST-CONF-SQLITE-3", payment_id="pay_test_3")
    # paid_at defaults to "now" — well inside the 60s grace window.

    pending = auth.get_pending_confirmation_deliveries(min_age_seconds=60)

    assert not any(p["order_id"] == "TEST-CONF-SQLITE-3" for p in pending)


def test_in_memory_only_order_counts_as_pending(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", False)  # force past the Postgres/SQLite tiers
    auth.IN_MEMORY_ORDERS.clear()
    old_paid_at = (datetime.now(timezone.utc) - timedelta(seconds=120)).isoformat()
    auth.IN_MEMORY_ORDERS["TEST-CONF-MEM-1"] = {
        "order_id": "TEST-CONF-MEM-1",
        "report_uuid": "rep-mem-1",
        "status": "paid",
        "user_email": "mem@example.com",
        "user_name": "Mem User",
        "confirmation_mail_sent": False,
        "paid_at": old_paid_at,
    }

    pending = auth.get_pending_confirmation_deliveries(min_age_seconds=60)

    assert any(p["order_id"] == "TEST-CONF-MEM-1" for p in pending)


def test_reconcile_confirmations_resends_via_mailer(monkeypatch):
    """Exercises the actual mail_queue wiring, not just the DB query."""
    import mail_queue

    monkeypatch.setattr(
        auth, "get_pending_confirmation_deliveries",
        lambda min_age_seconds=60: [{
            "order_id": "ORD-RECONCILE-1",
            "payment_id": "pay_1",
            "report_uuid": "rep-1",
            "user_email": "reconcile@example.com",
            "user_name": "Reconcile Me",
            "amount": 34900,
            "currency": "INR",
        }]
    )
    calls = []
    monkeypatch.setattr(
        "mailer.send_payment_confirmation_email",
        lambda **kw: calls.append(kw) or True
    )

    mail_queue._reconcile_pending_confirmations()

    assert len(calls) == 1
    assert calls[0]["user_email"] == "reconcile@example.com"
    assert calls[0]["order_id"] == "ORD-RECONCILE-1"
    assert calls[0]["amount_formatted"] == "₹349"
