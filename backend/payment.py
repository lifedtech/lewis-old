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


# --- Multi-Currency & Dynamic Exchange Rates -----------------------------------

DEFAULT_INR_EXCHANGE_RATES: Dict[str, Dict[str, Any]] = {
    "INR": {"rate": 1.0, "symbol": "₹", "name": "Indian Rupee (INR)", "flag": "🇮🇳"},
    "USD": {"rate": 0.0116, "symbol": "$", "name": "US Dollar (USD)", "flag": "🇺🇸"},
    "EUR": {"rate": 0.0108, "symbol": "€", "name": "Euro (EUR)", "flag": "🇪🇺"},
    "GBP": {"rate": 0.0093, "symbol": "£", "name": "British Pound (GBP)", "flag": "🇬🇧"},
    "CAD": {"rate": 0.0160, "symbol": "C$", "name": "Canadian Dollar (CAD)", "flag": "🇨🇦"},
    "AUD": {"rate": 0.0180, "symbol": "A$", "name": "Australian Dollar (AUD)", "flag": "🇦🇺"},
    "AED": {"rate": 0.0425, "symbol": "AED ", "name": "UAE Dirham (AED)", "flag": "🇦🇪"},
    "SGD": {"rate": 0.0155, "symbol": "S$", "name": "Singapore Dollar (SGD)", "flag": "🇸🇬"},
}

_rates_cache: Dict[str, Any] = {
    "timestamp": 0,
    "rates": {k: v["rate"] for k, v in DEFAULT_INR_EXCHANGE_RATES.items()}
}


def get_inr_exchange_rates() -> Dict[str, float]:
    """
    Get live exchange rates relative to 1 INR (cached 1 hour in memory).
    Falls back gracefully to deterministic default rates.
    """
    global _rates_cache
    now = time.time()
    if now - _rates_cache["timestamp"] < 3600 and _rates_cache.get("rates"):
        return _rates_cache["rates"]

    try:
        import requests
        resp = requests.get("https://open.er-api.com/v6/latest/INR", timeout=3)
        if resp.ok:
            data = resp.json()
            live_rates = data.get("rates", {})
            rates = {}
            for code in DEFAULT_INR_EXCHANGE_RATES:
                if code in live_rates and float(live_rates[code]) > 0:
                    rates[code] = float(live_rates[code])
                else:
                    rates[code] = DEFAULT_INR_EXCHANGE_RATES[code]["rate"]
            _rates_cache = {"timestamp": now, "rates": rates}
            return rates
    except Exception as exc:
        logger.debug("Live exchange rate lookup failed (%s), using fallback table", exc)

    return _rates_cache["rates"]


def calculate_plan_price(plan_key: str = "personal_report", target_currency: str = "INR") -> Dict[str, Any]:
    """
    Calculate price in target currency dynamically converted from base INR price (₹749).
    """
    curr = (target_currency or "INR").strip().upper()
    if curr not in DEFAULT_INR_EXCHANGE_RATES:
        curr = "INR"

    rates = get_inr_exchange_rates()
    rate = rates.get(curr, DEFAULT_INR_EXCHANGE_RATES[curr]["rate"])
    meta = DEFAULT_INR_EXCHANGE_RATES[curr]

    base_inr = PERSONAL_REPORT_PRICE_PAISE / 100.0  # 749.0
    if curr == "INR":
        amount_units = 749.0
        amount_subunits = 74900
        formatted = "₹749"
    else:
        raw_val = base_inr * rate
        amount_units = round(raw_val, 2)
        amount_subunits = int(round(amount_units * 100))
        formatted = f"{meta['symbol']}{amount_units:.2f}"

    return {
        "currency": curr,
        "symbol": meta["symbol"],
        "name": meta["name"],
        "flag": meta["flag"],
        "amount": amount_units,
        "amount_subunits": amount_subunits,
        "formatted": formatted,
        "exchange_rate": rate,
    }


def get_public_payment_config() -> Dict[str, Any]:
    """
    Return safe public payment parameters and multi-currency catalog for client initialization.
    NEVER exposes secrets.
    """
    mode = get_payment_mode()
    key_id, _ = get_razorpay_credentials()
    
    # Precompute prices across all supported currencies
    currencies_catalog = {}
    for code in DEFAULT_INR_EXCHANGE_RATES:
        currencies_catalog[code] = calculate_plan_price("personal_report", code)

    return {
        "payment_mode": mode,
        "key_id": key_id if mode == "razorpay" and key_id else "rzp_mock_lewis_test",
        "base_currency": "INR",
        "base_amount_inr": 749,
        "currencies": currencies_catalog,
        "supported_currencies": list(DEFAULT_INR_EXCHANGE_RATES.keys()),
        "plans": {
            "personal_report": PLAN_CATALOG["personal_report"],
            "bundle": PLAN_CATALOG["bundle"],
        }
    }


def create_order(
    plan_key: str,
    report_uuid: str,
    currency: Optional[str] = "INR",
    user_email: Optional[str] = None,
    user_name: Optional[str] = None,
    user_phone: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a payment order in user's selected currency converted from base ₹749.
    """
    from auth import save_payment_order

    normalized_plan = (plan_key or "personal_report").strip().lower()
    plan_info = PLAN_CATALOG.get(normalized_plan)
    if not plan_info:
        raise ValueError(f"Invalid plan '{plan_key}'. Allowed plans: {list(PLAN_CATALOG.keys())}")

    target_curr = (currency or "INR").strip().upper()
    pricing = calculate_plan_price(normalized_plan, target_curr)
    amount = pricing["amount_subunits"]
    curr_code = pricing["currency"]

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
            currency=curr_code,
            user_email=user_email,
            user_name=user_name,
            user_phone=user_phone
        )
        logger.info("Created MOCK payment order %s for report %s (%s %s)", order_id, report_uuid, curr_code, pricing["formatted"])
        return {
            "order_id": order_id,
            "amount": amount,
            "currency": curr_code,
            "formatted_amount": pricing["formatted"],
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
        "user_name": user_name or "",
        "user_phone": user_phone or "",
        "currency": curr_code,
    }

    try:
        if _razorpay_client:
            rp_order = _razorpay_client.order.create({
                "amount": amount,
                "currency": curr_code,
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
                    "currency": curr_code,
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
            currency=curr_code,
            user_email=user_email,
            user_name=user_name,
            user_phone=user_phone
        )
        logger.info("Created Razorpay order %s for report %s (%s %s)", order_id, report_uuid, curr_code, pricing["formatted"])

        return {
            "order_id": order_id,
            "amount": amount,
            "currency": curr_code,
            "formatted_amount": pricing["formatted"],
            "plan": plan_info["id"],
            "plan_name": plan_info["name"],
            "report_uuid": report_uuid,
            "payment_mode": "razorpay",
            "key_id": key_id
        }
    except Exception as exc:
        logger.error("Razorpay order creation failed (%s). Falling back to mock order.", exc)
        order_id = f"order_fallback_{uuid.uuid4().hex[:14]}"
        save_payment_order(
            order_id=order_id,
            report_uuid=report_uuid,
            plan_id=plan_info["id"],
            amount=amount,
            currency=curr_code,
            user_email=user_email,
            user_name=user_name,
            user_phone=user_phone
        )
        return {
            "order_id": order_id,
            "amount": amount,
            "currency": curr_code,
            "formatted_amount": pricing["formatted"],
            "plan": plan_info["id"],
            "plan_name": plan_info["name"],
            "report_uuid": report_uuid,
            "payment_mode": "mock",
            "key_id": "rzp_mock_lewis_test"
        }


def verify_payment(
    order_id: str,
    payment_id: str,
    signature: Optional[str],
    report_uuid: Optional[str] = None,
    user_email: Optional[str] = None,
    user_name: Optional[str] = None,
    user_phone: Optional[str] = None
) -> Dict[str, Any]:
    """
    Verify payment signature, save transaction ID (payment_id), and unlock report entitlement.
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
            report_uuid=report_uuid,
            user_email=user_email,
            user_name=user_name,
            user_phone=user_phone
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
        report_uuid=report_uuid,
        user_email=user_email,
        user_name=user_name,
        user_phone=user_phone
    )

    # Asynchronously dispatch Brevo confirmation email & schedule 5-min report delivery
    target_email = user_email or res.get("user_email")
    if target_email:
        try:
            import threading
            from mailer import send_payment_confirmation_email, schedule_report_delivery_email
            target_name = user_name or res.get("user_name") or ""
            target_amount = f"₹{res.get('amount', 74900) / 100:.0f}" if res.get("currency", "INR") == "INR" else f"{res.get('currency', '')} {res.get('amount', 74900) / 100:.2f}"
            
            # 1. Immediate payment confirmation email
            t_confirm = threading.Thread(
                target=send_payment_confirmation_email,
                kwargs={
                    "user_email": target_email,
                    "user_name": target_name,
                    "order_id": order_id,
                    "payment_id": payment_id,
                    "amount_formatted": target_amount,
                    "currency": res.get("currency", "INR"),
                    "report_uuid": res.get("report_uuid") or report_uuid
                },
                daemon=True
            )
            t_confirm.start()

            # 2. Scheduled report delivery email (5 minutes later)
            schedule_report_delivery_email(
                user_email=target_email,
                user_name=target_name,
                report_uuid=res.get("report_uuid") or report_uuid,
                order_id=order_id
            )
        except Exception as mail_err:
            logger.warning("Could not spawn email delivery threads: %s", mail_err)

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
