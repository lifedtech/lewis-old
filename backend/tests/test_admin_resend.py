# test_admin_resend.py — the /admin/* ops routes trigger real outbound
# email on demand, so the X-Admin-Key gate (main.require_admin) is a trust
# boundary worth its own check, independent of the resend logic itself.
from fastapi.testclient import TestClient

import main

client = TestClient(main.app)


def test_admin_route_rejects_missing_or_wrong_key(monkeypatch):
    monkeypatch.setattr(main, "ADMIN_KEY", "secret123")
    resp = client.get("/admin/pending-reports")
    assert resp.status_code == 401

    resp = client.get("/admin/pending-reports", headers={"X-Admin-Key": "wrong"})
    assert resp.status_code == 401


def test_admin_route_accepts_correct_key(monkeypatch):
    monkeypatch.setattr(main, "ADMIN_KEY", "secret123")
    resp = client.get("/admin/pending-reports", headers={"X-Admin-Key": "secret123"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "success"


def test_resend_report_404_for_unknown_order(monkeypatch):
    monkeypatch.setattr(main, "ADMIN_KEY", "")  # gate off (dev mode) — exercise the handler itself
    resp = client.post("/admin/resend-report/NO-SUCH-ORDER-ID")
    assert resp.status_code == 404
