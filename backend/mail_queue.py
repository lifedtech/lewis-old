# mail_queue.py — Redis-backed queue for outbound mail.
#
# Root cause replaced: every email was fired via a raw threading.Thread(daemon=True)
# — or, for the 5-minute-delayed report, a thread that just time.sleep()s. On
# Railway (single process, redeployed/restarted routinely) a restart during that
# window kills the thread and the job vanishes silently: no retry, no record,
# no error anywhere. Backing the queue with Redis means a job survives a process
# restart (it lives in Redis, not a Python thread's stack) and gets retried on
# failure instead of disappearing.
import os
import json
import time
import logging
import threading
from typing import Optional

logger = logging.getLogger("lewis.mailqueue")

QUEUE_KEY = "lewis:mail:queue"
DELAYED_KEY = "lewis:mail:delayed"
DEAD_KEY = "lewis:mail:dead"
MAX_ATTEMPTS = 3
RETRY_BACKOFF_SECONDS = 30


def get_redis_client() -> Optional[object]:
    """Resolve and test Redis connection. Returns None if Redis is not configured or offline."""
    url = os.getenv("REDIS_URL") or os.getenv("REDIS_PRIVATE_URL")
    if not url:
        host = os.getenv("REDISHOST") or os.getenv("REDIS_HOST")
        if host:
            port = os.getenv("REDISPORT") or os.getenv("REDIS_PORT", "6379")
            password = os.getenv("REDISPASSWORD") or os.getenv("REDIS_PASSWORD", "")
            user = os.getenv("REDISUSER", "default")
            auth = f"{user}:{password}@" if password else ""
            url = f"redis://{auth}{host}:{port}/0"

    if not url or "localhost" in url:
        # In cloud / Railway without REDIS_URL, don't spam localhost connection errors
        return None

    try:
        import redis
        client = redis.from_url(url, decode_responses=True, socket_connect_timeout=3)
        client.ping()
        logger.info("Connected to Redis mail queue backend (%s)", url.split("@")[-1])
        return client
    except Exception as e:
        logger.warning("Redis configured but unreachable (%s) — using resilient in-memory scheduler", e)
        return None


_redis = get_redis_client()


def _dispatch(kind: str, payload: dict, is_final_attempt: bool = True) -> bool:
    import mailer  # local import: avoids mailer <-> mail_queue import cycle
    if kind == "payment_confirmation":
        return mailer.send_payment_confirmation_email(**payload)
    if kind == "report_delivery":
        # is_final_attempt gates mailer's tech@ "manual verification" alert —
        # only the last of MAX_ATTEMPTS tries should page tech@, not every
        # retry. Applies to both report shapes (full and streamlined), since
        # both flow through deferred_report_delivery.
        return mailer.deferred_report_delivery(is_final_attempt=is_final_attempt, **payload)
    if kind == "support_notification":
        return mailer.send_support_notification_email(**payload)
    if kind == "review_invitation":
        return mailer.send_review_invitation_email(**payload)
    logger.error("Unknown mail job kind: %s", kind)
    return False


def _dispatch_with_retry(kind: str, payload: dict, attempts: int = 0) -> None:
    """
    In-memory fallback's retry loop — mirrors _handle_job's Redis semantics
    (MAX_ATTEMPTS tries, RETRY_BACKOFF_SECONDS-per-attempt backoff) so a
    transient failure (a Brevo hiccup, a momentary PDF render error) gets
    retried instead of immediately handing the order to tech@ as a one-shot
    failure. No Redis to persist state in here, so a process restart mid-retry
    still loses the job the same way the file-header comment describes — this
    only closes the "gave up after one try" gap, not the "process died"
    one; that one needs Redis actually reachable.
    """
    is_final_attempt = (attempts + 1) >= MAX_ATTEMPTS
    try:
        ok = _dispatch(kind, payload, is_final_attempt=is_final_attempt)
    except Exception as e:
        logger.error("Mail job %s raised: %s", kind, e)
        ok = False
    if ok:
        return
    attempts += 1
    if attempts < MAX_ATTEMPTS:
        delay = RETRY_BACKOFF_SECONDS * attempts
        logger.warning("Mail job %s failed, retry %d/%d in %ds (in-memory)", kind, attempts, MAX_ATTEMPTS, delay)
        timer = threading.Timer(delay, _dispatch_with_retry, args=(kind, payload, attempts))
        timer.daemon = True
        timer.start()
    else:
        # Exhausted. Left unsent on purpose — mailer.py's own failure path
        # already flagged the order for manual verification on this last,
        # is_final_attempt=True call (report_alert_mail_sent), so there's
        # nothing further to mark here.
        logger.error("Mail job %s dropped after %d attempts (in-memory)", kind, MAX_ATTEMPTS)


def enqueue(kind: str, payload: dict, delay_seconds: int = 0) -> None:
    """
    Queue a mail job.
    Uses Redis if provisioned, or threaded in-memory timer if Redis is not present.
    """
    global _redis
    if _redis:
        try:
            job = json.dumps({"kind": kind, "payload": payload, "attempts": 0})
            if delay_seconds > 0:
                _redis.zadd(DELAYED_KEY, {job: time.time() + delay_seconds})
            else:
                _redis.rpush(QUEUE_KEY, job)
            return
        except Exception as e:
            logger.error("Redis enqueue error (%s); falling back to in-memory schedule", e)

    # In-memory execution (handles immediate and delayed jobs smoothly), with
    # the same MAX_ATTEMPTS retry the Redis path gets.
    if delay_seconds > 0:
        timer = threading.Timer(delay_seconds, _dispatch_with_retry, args=(kind, payload))
        timer.daemon = True
        timer.start()
        logger.info("Enqueued %s job in-memory (dispatches in %ds, up to %d attempts)", kind, delay_seconds, MAX_ATTEMPTS)
    else:
        thread = threading.Thread(target=_dispatch_with_retry, args=(kind, payload), daemon=True)
        thread.start()
        logger.info("Dispatched %s job immediately in background thread (up to %d attempts)", kind, MAX_ATTEMPTS)


def _promote_due_delayed() -> None:
    if not _redis:
        return
    due_jobs = _redis.zrangebyscore(DELAYED_KEY, "-inf", time.time())
    for job in due_jobs:
        if _redis.zrem(DELAYED_KEY, job):
            _redis.rpush(QUEUE_KEY, job)


def _handle_job(raw: str) -> None:
    if not _redis:
        return
    job = json.loads(raw)
    is_final_attempt = (job["attempts"] + 1) >= MAX_ATTEMPTS
    try:
        ok = _dispatch(job["kind"], job["payload"], is_final_attempt=is_final_attempt)
    except Exception as e:
        logger.error("Mail job %s raised: %s", job.get("kind"), e)
        ok = False
    if not ok:
        job["attempts"] += 1
        if job["attempts"] < MAX_ATTEMPTS:
            delay = RETRY_BACKOFF_SECONDS * job["attempts"]
            _redis.zadd(DELAYED_KEY, {json.dumps(job): time.time() + delay})
            logger.warning("Mail job %s failed, retry %d/%d in %ds", job["kind"], job["attempts"], MAX_ATTEMPTS, delay)
        else:
            _redis.rpush(DEAD_KEY, json.dumps(job))
            logger.error("Mail job %s dropped after %d attempts", job["kind"], MAX_ATTEMPTS)


def _reconcile_pending_confirmations() -> None:
    """Same recovery net as _reconcile_pending_deliveries(), for the
    payment-confirmation email — it previously had no other recovery path
    (see get_pending_confirmation_deliveries): a lost immediate dispatch
    (process restart mid-send, a momentary Brevo blip) meant the customer
    never got told their payment went through, with nothing watching for it."""
    try:
        from auth import get_pending_confirmation_deliveries
        from mailer import send_payment_confirmation_email
        pending = get_pending_confirmation_deliveries(min_age_seconds=60)
        for ord_info in pending:
            email = ord_info.get("user_email")
            if not email:
                continue
            amount = ord_info.get("amount") or 74900
            currency = ord_info.get("currency") or "INR"
            amount_formatted = (
                f"₹{amount / 100:.0f}" if currency == "INR" else f"{currency} {amount / 100:.2f}"
            )
            logger.info("Auto-reconciling unsent confirmation email for order %s (%s)", ord_info.get("order_id"), email)
            send_payment_confirmation_email(
                user_email=email,
                user_name=ord_info.get("user_name"),
                order_id=ord_info.get("order_id"),
                payment_id=ord_info.get("payment_id"),
                amount_formatted=amount_formatted,
                currency=currency,
                report_uuid=ord_info.get("report_uuid"),
            )
    except Exception as e:
        logger.warning("Pending confirmations reconciliation error: %s", e)


def _reconcile_pending_deliveries() -> None:
    """Check database for any paid orders older than 5 minutes whose report email has not yet been delivered."""
    try:
        from auth import get_pending_report_deliveries
        from mailer import deferred_report_delivery
        pending = get_pending_report_deliveries(min_age_seconds=int(os.getenv("REPORT_EMAIL_DELAY_SECONDS", "300")))
        for ord_info in pending:
            email = ord_info.get("user_email")
            if not email:
                continue
            logger.info("Auto-reconciling unsent report delivery for order %s (%s)", ord_info.get("order_id"), email)
            deferred_report_delivery(
                user_email=email,
                user_name=ord_info.get("user_name"),
                report_uuid=ord_info.get("report_uuid"),
                order_id=ord_info.get("order_id")
            )
    except Exception as e:
        logger.warning("Pending deliveries reconciliation error: %s", e)


def _reconcile_pending_reviews() -> None:
    """Same recovery net as _reconcile_pending_deliveries(), for the review-invitation
    email — it has no other recovery path (see get_pending_review_deliveries)."""
    try:
        from auth import get_pending_review_deliveries
        from mailer import send_review_invitation_email
        pending = get_pending_review_deliveries(min_age_seconds=int(os.getenv("REVIEW_EMAIL_DELAY_SECONDS", "1200")))
        for ord_info in pending:
            email = ord_info.get("user_email")
            if not email:
                continue
            logger.info("Auto-reconciling unsent review invitation for order %s (%s)", ord_info.get("order_id"), email)
            send_review_invitation_email(
                user_email=email,
                user_name=ord_info.get("user_name"),
                report_uuid=ord_info.get("report_uuid"),
                order_id=ord_info.get("order_id")
            )
    except Exception as e:
        logger.warning("Pending reviews reconciliation error: %s", e)


def _worker_loop() -> None:
    logger.info("Mail queue worker active (Redis: %s)", bool(_redis))
    last_reconcile = 0.0

    while True:
        try:
            now = time.time()
            if now - last_reconcile > 30:
                _reconcile_pending_confirmations()
                _reconcile_pending_deliveries()
                _reconcile_pending_reviews()
                last_reconcile = now

            if _redis:
                _promote_due_delayed()
                popped = _redis.blpop(QUEUE_KEY, timeout=2)
                if popped:
                    _, raw = popped
                    _handle_job(raw)
            else:
                time.sleep(2)
        except Exception as loop_err:
            time.sleep(10)


def start_worker() -> None:
    threading.Thread(target=_worker_loop, daemon=True).start()
