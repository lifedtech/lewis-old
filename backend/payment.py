# payment.py — Razorpay Payment Gateway & Entitlement Management
import os
import time
import uuid
import hmac
import hashlib
import logging
from typing import Optional, Dict, Any
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger("lewis.payment")

# --- Configuration & Mode Resolution ------------------------------------------

PAYMENT_MODE = os.getenv("PAYMENT_MODE", "mock").strip().lower()
if PAYMENT_MODE not in ("mock", "razorpay"):
    logger.warning("Unknown PAYMENT_MODE '%s', defaulting to 'mock'", PAYMENT_MODE)
    PAYMENT_MODE = "mock"

# Resolve Key ID and Secret
RAZORPAY_KEY_ID = (
    os.getenv("RAZORPAY_KEY_ID") 
    or os.getenv("RAZORPAY_LIVE_KEY_ID") 
    or os.getenv("RAZORPAY_TEST_KEY_ID") 
    or ""
).strip()

RAZORPAY_KEY_SECRET = (
    os.getenv("RAZORPAY_KEY_SECRET") 
    or os.getenv("RAZORPAY_LIVE_KEY_SECRET") 
    or os.getenv("RAZORPAY_TEST_KEY_SECRET") 
    or ""
).strip()

RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET", "").strip()

# Authoritative Backend Pricing (in paise)
# 74900 paise = ₹749.00
PERSONAL_REPORT_PRICE_PAISE = int(os.getenv("PERSONAL_REPORT_PRICE_PAISE", "74900"))
TRANSFORMATION_BUNDLE_PRICE_PAISE = int(os.getenv("TRANSFORMATION_BUNDLE_PRICE_PAISE", "149900"))

PLAN_CATALOG: Dict[str, Dict[str, Any]] = {
    "personal_report": {
        "id": "personal_report",
        "name": "Personal Insight Report",
        "amount_paise": PERSONAL_REPORT_PRICE_PAISE,
        "amount_inr": PERSONAL_REPORT_PRICE_PAISE // 100,
        "currency": "INR",
        "description": "Complete 25-Page Lewis Insight Mirror (PDF) & Nervous System Profile",
    },
    "essential": {
        "id": "personal_report",
        "name": "Personal Insight Report",
        "amount_paise": PERSONAL_REPORT_PRICE_PAISE,
        "amount_inr": PERSONAL_REPORT_PRICE_PAISE // 100,
        "currency": "INR",
        "description": "Complete 25-Page Lewis Insight Mirror (PDF) & Nervous System Profile",
    },
    "bundle": {
        "id": "bundle",
        "name": "Transformation Bundle",
        "amount_paise": TRANSFORMATION_BUNDLE_PRICE_PAISE,
        "amount_inr": TRANSFORMATION_BUNDLE_PRICE_PAISE // 100,
        "currency": "INR",
        "description": "The complete insight report + 30-day guided habit architecture",
    },
    "transformation_bundle": {
        "id": "bundle",
        "name": "Transformation Bundle",
        "amount_paise": TRANSFORMATION_BUNDLE_PRICE_PAISE,
        "amount_inr": TRANSFORMATION_BUNDLE_PRICE_PAISE // 100,
        "currency": "INR",
        "description": "The complete insight report + 30-day guided habit architecture",
    }
}

# Optional Razorpay SDK client
_razorpay_client = None
if PAYMENT_MODE == "razorpay" and RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    try:
        import razorpay
        _razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        logger.info("Razorpay client initialized with Key ID: %s...", RAZORPAY_KEY_ID[:8])
    except Exception as exc:
        logger.warning("Could not initialize razorpay client (%s). Falling back to direct API.", exc)


def get_payment_mode() -> str:
    mode = os.getenv("PAYMENT_MODE", "").strip().lower()
    if not mode:
        # If test or live keys are present, default to razorpay mode
        if os.getenv("RAZORPAY_KEY_ID") or os.getenv("RAZORPAY_TEST_KEY_ID") or os.getenv("RAZORPAY_LIVE_KEY_ID"):
            return "razorpay"
        return "mock"
    return mode if mode in ("mock", "razorpay") else "mock"


def get_razorpay_credentials():
    key_id = (
        os.getenv("RAZORPAY_KEY_ID") 
        or os.getenv("RAZORPAY_TEST_KEY_ID") 
        or os.getenv("RAZORPAY_LIVE_KEY_ID") 
        or ""
    ).strip()
    key_secret = (
        os.getenv("RAZORPAY_KEY_SECRET") 
        or os.getenv("RAZORPAY_TEST_KEY_SECRET") 
        or os.getenv("RAZORPAY_LIVE_KEY_SECRET") 
        or ""
    ).strip()
    return key_id, key_secret


def get_public_payment_config() -> Dict[str, Any]:
    """
    Return safe public payment parameters for client initialization.
    NEVER exposes secrets.
    """
    mode = get_payment_mode()
    key_id, _ = get_razorpay_credentials()
    return {
        "payment_mode": mode,
        "key_id": key_id if mode == "razorpay" and key_id else "rzp_mock_lewis_test",
        "currency": "INR",
        "plans": {
            "personal_report": PLAN_CATALOG["personal_report"],
            "bundle": PLAN_CATALOG["bundle"],
        }
    }


def create_order(
    plan_key: str,
    report_uuid: str,
    user_email: Optional[str] = None,
    user_name: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a payment order. Price is authoritatively determined from backend config.
    """
    from auth import save_payment_order

    normalized_plan = (plan_key or "personal_report").strip().lower()
    plan_info = PLAN_CATALOG.get(normalized_plan)
    if not plan_info:
        raise ValueError(f"Invalid plan '{plan_key}'. Allowed plans: {list(PLAN_CATALOG.keys())}")

    amount = plan_info["amount_paise"]
    currency = plan_info["currency"]
    mode = get_payment_mode()
    key_id, key_secret = get_razorpay_credentials()

    if mode == "mock" or not (key_id and key_secret):
        # Local Development Mock Simulator
        order_id = f"order_mock_{uuid.uuid4().hex[:14]}"
        order_record = save_payment_order(
            order_id=order_id,
            report_uuid=report_uuid,
            plan_id=plan_info["id"],
            amount=amount,
            currency=currency,
            user_email=user_email
        )
        logger.info("Created MOCK payment order %s for report %s (₹%s)", order_id, report_uuid, amount / 100)
        return {
            "order_id": order_id,
            "amount": amount,
            "currency": currency,
            "plan": plan_info["id"],
            "plan_name": plan_info["name"],
            "report_uuid": report_uuid,
            "payment_mode": "mock",
            "key_id": "rzp_mock_lewis_test"
        }

    # Live or Test Mode via Razorpay API
    receipt_id = f"rcpt_{report_uuid[-8:]}_{int(time.time())}"
    notes = {
        "report_uuid": report_uuid,
        "plan_id": plan_info["id"],
        "user_email": user_email or "",
        "user_name": user_name or ""
    }

    try:
        if _razorpay_client:
            rp_order = _razorpay_client.order.create({
                "amount": amount,
                "currency": currency,
                "receipt": receipt_id,
                "notes": notes,
            })
            order_id = rp_order["id"]
        else:
            import requests
            resp = requests.post(
                "https://api.razorpay.com/v1/orders",
                auth=(key_id, key_secret),
                json={
                    "amount": amount,
                    "currency": currency,
                    "receipt": receipt_id,
                    "notes": notes,
                },
                timeout=10
            )
            if not resp.ok:
                raise RuntimeError(f"Razorpay order creation failed: {resp.status_code} {resp.text}")
            rp_order = resp.json()
            order_id = rp_order["id"]

        save_payment_order(
            order_id=order_id,
            report_uuid=report_uuid,
            plan_id=plan_info["id"],
            amount=amount,
            currency=currency,
            user_email=user_email
        )
        logger.info("Created Razorpay order %s for report %s (₹%s)", order_id, report_uuid, amount / 100)

        return {
            "order_id": order_id,
            "amount": amount,
            "currency": currency,
            "plan": plan_info["id"],
            "plan_name": plan_info["name"],
            "report_uuid": report_uuid,
            "payment_mode": "razorpay",
            "key_id": key_id
        }
    except Exception as exc:
        logger.error("Razorpay order creation failed: %s", exc)
        raise


def verify_payment(
    order_id: str,
    payment_id: str,
    signature: Optional[str],
    report_uuid: Optional[str] = None
) -> Dict[str, Any]:
    """
    Verify payment signature and idempotently unlock report entitlement.
    """
    from auth import record_successful_payment, get_payment_order

    if not order_id or not payment_id:
        raise ValueError("Missing order_id or payment_id")

    mode = get_payment_mode()
    key_id, key_secret = get_razorpay_credentials()

    # Mock order handling
    if order_id.startswith("order_mock_") or mode == "mock":
        res = record_successful_payment(
            order_id=order_id,
            payment_id=payment_id,
            signature=signature or "mock_sig_approved",
            report_uuid=report_uuid
        )
        return {
            "status": "success",
            "verified": True,
            "order_id": order_id,
            "payment_id": payment_id,
            "report_uuid": res.get("report_uuid") or report_uuid,
            "unlocked": True
        }

    # Razorpay standard HMAC SHA256 verification
    if not key_secret:
        raise RuntimeError("RAZORPAY_KEY_SECRET is not configured on the server")

    if not signature:
        raise ValueError("Missing payment signature for live verification")

    msg = f"{order_id}|{payment_id}"
    expected_signature = hmac.new(
        key_secret.encode("utf-8"),
        msg.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, signature):
        logger.warning("HMAC signature mismatch for order %s and payment %s", order_id, payment_id)
        raise ValueError("Payment signature verification failed")

    # Idempotent state recording & entitlement grant
    res = record_successful_payment(
        order_id=order_id,
        payment_id=payment_id,
        signature=signature,
        report_uuid=report_uuid
    )

    return {
        "status": "success",
        "verified": True,
        "order_id": order_id,
        "payment_id": payment_id,
        "report_uuid": res.get("report_uuid") or report_uuid,
        "unlocked": True
    }


def verify_webhook_signature(body_bytes: bytes, signature_header: str) -> bool:
    """
    Verify Razorpay webhook signature using RAZORPAY_WEBHOOK_SECRET.
    """
    if not RAZORPAY_WEBHOOK_SECRET or not signature_header:
        return False

    expected = hmac.new(
        RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
        body_bytes,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected, signature_header)


def process_webhook_event(event_payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Reconcile payment and unlock report entitlement from webhook event.
    """
    from auth import record_successful_payment, get_payment_order

    event_type = event_payload.get("event", "")
    payload_data = event_payload.get("payload", {})

    logger.info("Processing Razorpay webhook event: %s", event_type)

    if event_type in ("order.paid", "payment.captured", "payment.authorized"):
        payment_entity = payload_data.get("payment", {}).get("entity", {})
        order_entity = payload_data.get("order", {}).get("entity", {})

        order_id = payment_entity.get("order_id") or order_entity.get("id")
        payment_id = payment_entity.get("id")
        notes = payment_entity.get("notes") or order_entity.get("notes") or {}
        report_uuid = notes.get("report_uuid")

        if order_id and payment_id:
            res = record_successful_payment(
                order_id=order_id,
                payment_id=payment_id,
                signature="webhook_reconciled",
                report_uuid=report_uuid
            )
            return {"status": "success", "order_id": order_id, "reconciled": True}

    return {"status": "ignored", "event": event_type}
