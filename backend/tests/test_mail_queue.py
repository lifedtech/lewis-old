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
    monkeypatch.setattr(mail_queue, "_dispatch", lambda kind, payload: False)

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


def test_successful_job_is_not_requeued(fake_redis, monkeypatch):
    monkeypatch.setattr(mail_queue, "_dispatch", lambda kind, payload: True)
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
    monkeypatch.setattr(mail_queue, "_dispatch", lambda kind, payload: calls.append((kind, payload)))

    mail_queue.enqueue("support_notification", {"x": 1})
    time.sleep(0.2)  # the fallback runs in a daemon thread
    assert calls == [("support_notification", {"x": 1})]
