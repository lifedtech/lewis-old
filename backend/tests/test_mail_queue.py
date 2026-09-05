import os
import sys
import json
import time

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest

import mail_queue


class FakeRedis:
    """Minimal stand-in for redis-py covering the handful of calls mail_queue
    makes, so the queue/retry/dead-letter logic is exercised without needing
    a real Redis server or a new test-only dependency (rung 3: stdlib fake)."""

    def __init__(self):
        self.lists = {}
        self.zsets = {}

    def rpush(self, key, val):
        self.lists.setdefault(key, []).append(val)

    def blpop(self, key, timeout=1):
        lst = self.lists.get(key)
        if lst:
            return (key, lst.pop(0))
        return None

    def zadd(self, key, mapping):
        self.zsets.setdefault(key, {}).update(mapping)

    def zrangebyscore(self, key, lo, hi):
        return [m for m, score in self.zsets.get(key, {}).items() if score <= hi]

    def zrem(self, key, member):
        return self.zsets.get(key, {}).pop(member, None) is not None


@pytest.fixture
def fake_redis(monkeypatch):
    fr = FakeRedis()
    monkeypatch.setattr(mail_queue, "_redis", fr)
    return fr


def test_enqueue_immediate_goes_straight_to_ready_queue(fake_redis):
    mail_queue.enqueue("support_notification", {"a": 1})
    ready = fake_redis.lists[mail_queue.QUEUE_KEY]
    assert len(ready) == 1
    assert json.loads(ready[0]) == {"kind": "support_notification", "payload": {"a": 1}, "attempts": 0}
    assert mail_queue.DELAYED_KEY not in fake_redis.zsets


def test_enqueue_delayed_waits_then_promotes_when_due(fake_redis):
    mail_queue.enqueue("report_delivery", {"b": 2}, delay_seconds=300)
    assert not fake_redis.lists.get(mail_queue.QUEUE_KEY)

    # Fast-forward: back-date the due score instead of sleeping 300s in a test.
    due_key = next(iter(fake_redis.zsets[mail_queue.DELAYED_KEY]))
    fake_redis.zsets[mail_queue.DELAYED_KEY][due_key] = time.time() - 1

    mail_queue._promote_due_delayed()

    ready = fake_redis.lists[mail_queue.QUEUE_KEY]
    assert len(ready) == 1
    assert json.loads(ready[0])["kind"] == "report_delivery"
    assert not fake_redis.zsets[mail_queue.DELAYED_KEY]  # removed once promoted


def test_enqueue_delayed_not_yet_due_stays_put(fake_redis):
    mail_queue.enqueue("report_delivery", {"b": 2}, delay_seconds=300)
    mail_queue._promote_due_delayed()
    assert not fake_redis.lists.get(mail_queue.QUEUE_KEY)
    assert len(fake_redis.zsets[mail_queue.DELAYED_KEY]) == 1


def test_failed_job_is_rescheduled_then_dead_lettered_after_max_attempts(fake_redis, monkeypatch):
    seen_final_flags = []
    monkeypatch.setattr(
        mail_queue, "_dispatch",
        lambda kind, payload, is_final_attempt=True: seen_final_flags.append(is_final_attempt) or False
    )

    raw = json.dumps({"kind": "payment_confirmation", "payload": {}, "attempts": 0})

    for attempt in range(1, mail_queue.MAX_ATTEMPTS):
        mail_queue._handle_job(raw)
        due = fake_redis.zsets[mail_queue.DELAYED_KEY]
        assert len(due) == 1
        raw = next(iter(due))  # re-fetch the requeued (now attempts+1) job
        assert json.loads(raw)["attempts"] == attempt
        fake_redis.zsets[mail_queue.DELAYED_KEY].clear()  # simulate promotion consuming it

    mail_queue._handle_job(raw)  # final attempt: exhausts retries
    assert not fake_redis.zsets.get(mail_queue.DELAYED_KEY)
    dead = fake_redis.lists[mail_queue.DEAD_KEY]
    assert len(dead) == 1
    assert json.loads(dead[0])["attempts"] == mail_queue.MAX_ATTEMPTS

    # Only the very last attempt should be flagged final — earlier retries
    # must not tell mailer.py to page tech@ for a blip the next try might fix.
    assert seen_final_flags == [False] * (mail_queue.MAX_ATTEMPTS - 1) + [True]


def test_successful_job_is_not_requeued(fake_redis, monkeypatch):
    monkeypatch.setattr(mail_queue, "_dispatch", lambda kind, payload, is_final_attempt=True: True)
    raw = json.dumps({"kind": "support_notification", "payload": {}, "attempts": 0})
    mail_queue._handle_job(raw)
    assert not fake_redis.zsets.get(mail_queue.DELAYED_KEY)
    assert not fake_redis.lists.get(mail_queue.DEAD_KEY)


def test_enqueue_falls_back_to_direct_send_when_redis_is_down(monkeypatch):
    class BrokenRedis:
        def rpush(self, *a, **kw):
            raise ConnectionError("redis down")

    monkeypatch.setattr(mail_queue, "_redis", BrokenRedis())
    calls = []
    monkeypatch.setattr(
        mail_queue, "_dispatch",
        lambda kind, payload, is_final_attempt=True: calls.append((kind, payload, is_final_attempt)) or True
    )

    mail_queue.enqueue("support_notification", {"x": 1})
    time.sleep(0.2)  # the fallback runs in a daemon thread
    # First of up to MAX_ATTEMPTS tries, so not yet the final one.
    assert calls == [("support_notification", {"x": 1}, False)]


def test_in_memory_fallback_retries_then_gives_up(monkeypatch):
    """The gap this closes: with no Redis, enqueue() used to call _dispatch
    once and drop the job on failure with no retry at all — a single Brevo
    blip or momentary PDF error meant the customer's report was gone for
    good. Applies to both report shapes, since both route through the same
    "report_delivery" kind / _dispatch."""
    monkeypatch.setattr(mail_queue, "_redis", None)

    scheduled = []  # (delay, attempts) captured instead of really sleeping
    monkeypatch.setattr(
        mail_queue.threading, "Timer",
        lambda delay, fn, args: scheduled.append((delay, args)) or _NoopTimer()
    )

    seen_final_flags = []
    monkeypatch.setattr(
        mail_queue, "_dispatch",
        lambda kind, payload, is_final_attempt=True: seen_final_flags.append(is_final_attempt) or False
    )

    mail_queue.enqueue("report_delivery", {"order_id": "ORD-1"}, delay_seconds=300)
    assert len(scheduled) == 1  # the original delayed dispatch, not yet a retry

    # Simulate each Timer firing in turn, exactly as real retries would —
    # each failing call schedules exactly one more, until the final attempt.
    for _ in range(mail_queue.MAX_ATTEMPTS):
        delay, args = scheduled.pop(0)
        mail_queue._dispatch_with_retry(*args)

    assert seen_final_flags == [False] * (mail_queue.MAX_ATTEMPTS - 1) + [True]
    assert scheduled == []  # no further retry scheduled past the final attempt


class _NoopTimer:
    def __init__(self):
        self.daemon = None

    def start(self):
        pass
