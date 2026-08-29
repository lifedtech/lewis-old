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

import redis

logger = logging.getLogger("lewis.mailqueue")

def get_redis_url() -> str:
    """Resolve Redis connection string from Railway or standard environment variables."""
    url = os.getenv("REDIS_URL") or os.getenv("REDIS_PRIVATE_URL")
    if url:
        return url

    host = os.getenv("REDISHOST") or os.getenv("REDIS_HOST")
    if host:
        port = os.getenv("REDISPORT") or os.getenv("REDIS_PORT", "6379")
        password = os.getenv("REDISPASSWORD") or os.getenv("REDIS_PASSWORD", "")
        user = os.getenv("REDISUSER", "default")
        auth = f"{user}:{password}@" if password else ""
        return f"redis://{auth}{host}:{port}/0"

    # None of REDIS_URL / REDIS_PRIVATE_URL / REDISHOST / REDIS_HOST were set
    # in this process's environment — falling back to localhost, which will
    # never work in production. Log this loudly ONCE at startup so "why is
    # it hitting localhost" is answered directly in the deploy log instead
    # of surfacing only as a recurring, unexplained connection-refused error.
    logger.warning(
        "No REDIS_URL/REDIS_PRIVATE_URL/REDISHOST/REDIS_HOST found in env — "
        "defaulting to redis://localhost:6379/0. On Railway: add REDIS_URL "
        "to this service's Variables tab, referencing the Redis service "
        "(e.g. ${{Redis.REDIS_URL}}), then redeploy."
    )
    return "redis://localhost:6379/0"

REDIS_URL = get_redis_url()
QUEUE_KEY = "lewis:mail:queue"      # ready-to-send jobs (list)
DELAYED_KEY = "lewis:mail:delayed"  # scheduled jobs (sorted set, score = due unix ts)
DEAD_KEY = "lewis:mail:dead"        # jobs that exhausted retries (list, for manual inspection)
MAX_ATTEMPTS = 3
RETRY_BACKOFF_SECONDS = 30

_redis = redis.from_url(REDIS_URL, decode_responses=True, socket_connect_timeout=5)


def _dispatch(kind: str, payload: dict) -> bool:
    import mailer  # local import: avoids mailer <-> mail_queue import cycle
    if kind == "payment_confirmation":
        return mailer.send_payment_confirmation_email(**payload)
    if kind == "report_delivery":
        return mailer.deferred_report_delivery(**payload)
    if kind == "support_notification":
        return mailer.send_support_notification_email(**payload)
    logger.error("Unknown mail job kind: %s", kind)
    return False


def enqueue(kind: str, payload: dict, delay_seconds: int = 0) -> None:
    """Queue a mail job. delay_seconds=0 means "send as soon as the worker is free"."""
    job = json.dumps({"kind": kind, "payload": payload, "attempts": 0})
    try:
        if delay_seconds > 0:
            _redis.zadd(DELAYED_KEY, {job: time.time() + delay_seconds})
        else:
            _redis.rpush(QUEUE_KEY, job)
    except Exception as e:
        # Redis unreachable (e.g. REDIS_URL not configured yet in this env):
        # fall back to the old direct-send-in-a-thread behavior rather than
        # dropping the email outright.
        logger.error("Redis enqueue failed (%s); sending %s directly instead", e, kind)
        threading.Thread(target=_dispatch, args=(kind, payload), daemon=True).start()


def _promote_due_delayed() -> None:
    due_jobs = _redis.zrangebyscore(DELAYED_KEY, "-inf", time.time())
    for job in due_jobs:
        # ponytail: ZREM + RPUSH isn't one atomic op, so a crash between them
        # could duplicate a job on the rare race. A duplicate send is a minor
        # annoyance; losing the job (the previous behavior) is not. Move to a
        # Lua script (or ZPOPMIN‑style atomic move) if duplicates ever matter.
        if _redis.zrem(DELAYED_KEY, job):
            _redis.rpush(QUEUE_KEY, job)


def _handle_job(raw: str) -> None:
    """Dispatch one popped job; retry with backoff, dead-letter after MAX_ATTEMPTS."""
    job = json.loads(raw)
    try:
        ok = _dispatch(job["kind"], job["payload"])
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


def _worker_loop() -> None:
    logger.info("Mail queue worker started (redis=%s)", REDIS_URL)
    last_error_log = 0.0
    while True:
        try:
            _promote_due_delayed()
            popped = _redis.blpop(QUEUE_KEY, timeout=1)
            if not popped:
                continue
            _, raw = popped
            _handle_job(raw)
        except Exception as loop_err:
            # Redis unreachable retries every 2s (so it recovers fast once
            # fixed), but only LOGS every 30s — otherwise an unreachable
            # Redis floods the deploy log with one identical line per retry
            # forever, burying the one useful line (get_redis_url()'s
            # startup warning) that explains why.
            now = time.time()
            if now - last_error_log > 30:
                logger.error("Mail worker loop error (Redis down?): %s", loop_err)
                last_error_log = now
            time.sleep(2)  # don't spin hot while Redis is unreachable


def start_worker() -> None:
    threading.Thread(target=_worker_loop, daemon=True).start()
