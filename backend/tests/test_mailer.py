# test_mailer.py — guards the "never send a generic report" policy: when a
# real customer's report can't be built or sent, no substitute goes out to
# them, and tech@ gets exactly one alert per order (not one per retry).
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import auth
import pdf_generator
import mailer


def _fake_order_store(monkeypatch, initial=None):
    """Minimal stand-in for the lewis_payment_orders row this code reads/writes
    (report_alert_mail_sent), so the idempotency check is exercised without a
    real DB (rung 3: stdlib dict fake)."""
    store = {"ORD-1": dict(initial or {})}

    def fake_get_payment_order(order_id):
        return store.get(order_id)

    def fake_update_order_email_status(order_id, email_type="confirmation", status=True):
        store.setdefault(order_id, {})[f"{email_type}_mail_sent"] = status
        return True

    monkeypatch.setattr(auth, "get_payment_order", fake_get_payment_order)
    monkeypatch.setattr(auth, "update_order_email_status", fake_update_order_email_status)
    return store


def test_pdf_failure_sends_no_customer_email_and_alerts_tech_once(monkeypatch):
    store = _fake_order_store(monkeypatch)

    sent_emails = []
    monkeypatch.setattr(mailer, "send_email", lambda **kw: sent_emails.append(kw) or True)
    monkeypatch.setattr(
        pdf_generator, "build_report_pdf_for_plan",
        lambda **kw: (_ for _ in ()).throw(RuntimeError("no real report data"))
    )

    result = mailer.send_report_delivery_email(
        user_email="customer@example.com",
        user_name="Jane Doe",
        report_uuid="REP-1",
        order_id="ORD-1",
        plan_id="personal_report",
    )

    assert result is False, "must not report success when nothing was sent to the customer"
    assert len(sent_emails) == 1, "exactly one email must go out: the tech@ alert, never a customer email"
    alert = sent_emails[0]
    assert alert["to_email"] == mailer.TECH_ALERT_EMAIL
    assert "Jane Doe" in alert["html_content"]
    assert "ORD-1" in alert["html_content"]
    assert store["ORD-1"]["report_alert_mail_sent"] is True


def test_alert_is_not_repeated_for_an_order_already_alerted(monkeypatch):
    _fake_order_store(monkeypatch, initial={"report_alert_mail_sent": True})

    sent_emails = []
    monkeypatch.setattr(mailer, "send_email", lambda **kw: sent_emails.append(kw) or True)
    monkeypatch.setattr(
        pdf_generator, "build_report_pdf_for_plan",
        lambda **kw: (_ for _ in ()).throw(RuntimeError("still failing"))
    )

    mailer.send_report_delivery_email(
        user_email="customer@example.com",
        user_name="Jane Doe",
        report_uuid="REP-1",
        order_id="ORD-1",
        plan_id="personal_report",
    )

    assert sent_emails == [], "an order already alerted must not re-alert tech@ on every retry"
