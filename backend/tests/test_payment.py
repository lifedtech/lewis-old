import os
import hmac
import hashlib
import json
import pytest
from fastapi.testclient import TestClient

from main import app
from auth import (
    save_encrypted_assessment_record,
    is_report_unlocked,
    record_successful_payment,
    save_payment_order,
)
import payment

client = TestClient(app)


@pytest.fixture(autouse=True)
def reset_payment_env(monkeypatch):
    monkeypatch.setenv("PAYMENT_MODE", "mock")
    monkeypatch.setenv("PERSONAL_REPORT_PRICE_PAISE", "74900")
    monkeypatch.setenv("TRANSFORMATION_BUNDLE_PRICE_PAISE", "149900")
    monkeypatch.setattr(payment, "PAYMENT_MODE", "mock")
    monkeypatch.setattr(payment, "PERSONAL_REPORT_PRICE_PAISE", 74900)


def test_payment_config_endpoint():
    response = client.get("/payment/config")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    config = data["config"]
    assert "key_id" in config
    assert "plans" in config
    assert config["plans"]["personal_report"]["amount_paise"] == 74900
    assert config["plans"]["personal_report"]["amount_inr"] == 749
    # Secret must never be in config
    assert "secret" not in json.dumps(config).lower()


def test_create_order_server_side_pricing():
    rep_uuid = save_encrypted_assessment_record(
        user_name="Test User",
        user_email="test@example.com",
        report_data={"dimensions": {"who5": {"scaled_score": 75}}}
    )

    # Frontend passes plan name only
    resp = client.post("/payment/create-order", json={
        "plan": "personal_report",
        "report_id": rep_uuid,
        "email": "test@example.com"
    })
    assert resp.status_code == 200
    order_data = resp.json()["order"]
    assert order_data["amount"] == 74900
    assert order_data["currency"] == "INR"
    assert order_data["report_uuid"] == rep_uuid
    assert order_data["order_id"].startswith("LS") or order_data["order_id"].startswith("order_")


def test_create_order_invalid_plan():
    resp = client.post("/payment/create-order", json={
        "plan": "non_existent_plan",
        "report_id": "REP-TEST"
    })
    assert resp.status_code == 400


def test_verify_payment_mock_flow_and_idempotency():
    rep_uuid = save_encrypted_assessment_record(
        user_name="Mock Tester",
        user_email="mock@example.com",
        report_data={"dimensions": {}}
    )

    # Initial report status: locked
    status_resp = client.get(f"/reports/{rep_uuid}/status")
    assert status_resp.status_code == 200
    assert status_resp.json()["is_unlocked"] is False

    # Create order
    create_resp = client.post("/payment/create-order", json={
        "plan": "personal_report",
        "report_id": rep_uuid
    })
    order_id = create_resp.json()["order"]["order_id"]

    # Verify payment
    verify_resp = client.post("/payment/verify", json={
        "order_id": order_id,
        "payment_id": "pay_mock_12345",
        "signature": "mock_sig_approved",
        "report_id": rep_uuid
    })
    assert verify_resp.status_code == 200
    assert verify_resp.json()["unlocked"] is True

    # Check unlock status now
    assert is_report_unlocked(rep_uuid) is True
    status_after = client.get(f"/reports/{rep_uuid}/status").json()
    assert status_after["is_unlocked"] is True

    # Idempotent re-verification (duplicate request / retry)
    dup_verify = client.post("/payment/verify", json={
        "order_id": order_id,
        "payment_id": "pay_mock_12345",
        "signature": "mock_sig_approved",
        "report_id": rep_uuid
    })
    assert dup_verify.status_code == 200
    assert dup_verify.json()["status"] == "success"


def test_hmac_verification_live_mode(monkeypatch):
    test_secret = "test_razorpay_secret_key_123"
    monkeypatch.setattr(payment, "get_payment_mode", lambda: "razorpay")
    monkeypatch.setattr(payment, "get_razorpay_credentials", lambda: ("rzp_test_key", test_secret))

    rep_uuid = save_encrypted_assessment_record(
        user_name="HMAC User",
        user_email="hmac@example.com",
        report_data={"dimensions": {}}
    )

    order_id = "order_live_987654"
    payment_id = "pay_live_456789"
    save_payment_order(order_id=order_id, report_uuid=rep_uuid, plan_id="personal_report", amount=74900)

    # Valid HMAC signature
    msg = f"{order_id}|{payment_id}"
    valid_sig = hmac.new(test_secret.encode(), msg.encode(), hashlib.sha256).hexdigest()

    # Invalid signature should be rejected with 400
    bad_resp = client.post("/payment/verify", json={
        "order_id": order_id,
        "payment_id": payment_id,
        "signature": "wrong_signature",
        "report_id": rep_uuid
    })
    assert bad_resp.status_code == 400

    # Valid signature should succeed and unlock
    good_resp = client.post("/payment/verify", json={
        "order_id": order_id,
        "payment_id": payment_id,
        "signature": valid_sig,
        "report_id": rep_uuid
    })
    assert good_resp.status_code == 200
    assert good_resp.json()["verified"] is True
    assert is_report_unlocked(rep_uuid) is True


def test_webhook_signature_and_reconciliation(monkeypatch):
    webhook_secret = "whsec_test_secret_999"
    monkeypatch.setattr(payment, "RAZORPAY_WEBHOOK_SECRET", webhook_secret)

    rep_uuid = save_encrypted_assessment_record(
        user_name="Webhook User",
        user_email="webhook@example.com",
        report_data={"dimensions": {}}
    )
    order_id = "order_wh_111222"
    payment_id = "pay_wh_333444"
    save_payment_order(order_id=order_id, report_uuid=rep_uuid, plan_id="personal_report", amount=74900)

    webhook_payload = {
        "event": "payment.captured",
        "payload": {
            "payment": {
                "entity": {
                    "id": payment_id,
                    "order_id": order_id,
                    "notes": {"report_uuid": rep_uuid}
                }
            }
        }
    }
    payload_bytes = json.dumps(webhook_payload).encode("utf-8")
    valid_wh_sig = hmac.new(webhook_secret.encode(), payload_bytes, hashlib.sha256).hexdigest()

    # Invalid webhook signature -> 400
    bad_wh = client.post("/payment/webhook", content=payload_bytes, headers={"X-Razorpay-Signature": "invalid_sig"})
    assert bad_wh.status_code == 400

    # Valid webhook signature -> 200 and reconciled
    good_wh = client.post("/payment/webhook", content=payload_bytes, headers={"X-Razorpay-Signature": valid_wh_sig})
    assert good_wh.status_code == 200
    assert is_report_unlocked(rep_uuid) is True
