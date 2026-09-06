# test_error_tracker.py — Tests for Error Tracking, DB Logging & Lewis OS APIs

import os
import pytest
from fastapi.testclient import TestClient
from main import app
from auth import init_db
from error_tracker import (
    log_error, get_errors, get_error_by_id, update_error_status,
    bulk_update_errors, delete_error, get_error_stats, sanitize_value,
    compute_error_fingerprint
)


@pytest.fixture(autouse=True)
def setup_db():
    init_db()
    # Clean up test errors before test run
    try:
        import sqlite3
        from auth import DB_PATH
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM lewis_error_logs WHERE error_type LIKE 'Test_%' OR error_type IN ('DatabaseTimeout', 'RazorpaySignatureMismatch', 'DeprecationWarning', 'OpenAIRateLimit', 'Info1', 'Info2', 'ReactRenderCrash')")
        conn.commit()
        conn.close()
    except Exception:
        pass


@pytest.fixture
def client():
    return TestClient(app)


def test_sanitize_value():
    payload = {
        "user_email": "test@example.com",
        "password": "SuperSecretPassword123!",
        "api_key": "sk-1234567890",
        "nested": {
            "token": "bearer xyz",
            "normal_field": "hello world"
        }
    }
    cleaned = sanitize_value(payload)
    assert cleaned["user_email"] == "test@example.com"
    assert cleaned["password"] == "[REDACTED]"
    assert cleaned["api_key"] == "[REDACTED]"
    assert cleaned["nested"]["token"] == "[REDACTED]"
    assert cleaned["nested"]["normal_field"] == "hello world"


def test_compute_fingerprint_clustering():
    fp1 = compute_error_fingerprint("backend", "ValueError", "/api/test", "Invalid integer: 42 at 0x7ffd12")
    fp2 = compute_error_fingerprint("backend", "ValueError", "/api/test", "Invalid integer: 99 at 0x7ffa88")
    assert fp1 == fp2


def test_log_error_and_deduplication():
    # 1. First error occurrence
    unique_msg = f"Connection timed out after {os.urandom(4).hex()}ms"
    err1 = log_error(
        level="error",
        source="backend",
        error_type="Test_DatabaseTimeout",
        message=unique_msg,
        path="/assessment/full",
        method="POST",
        status_code=504,
        context_data={"query": "SELECT * FROM users", "auth_token": "secret_token_123"}
    )
    assert err1["id"].startswith("err_")
    assert err1["occurrence_count"] == 1
    assert err1["status"] == "unresolved"

    # 2. Second identical error occurrence should increment count
    err2 = log_error(
        level="error",
        source="backend",
        error_type="Test_DatabaseTimeout",
        message=unique_msg,
        path="/assessment/full",
        method="POST",
        status_code=504,
    )
    assert err2["occurrence_count"] == 2
    assert err2["id"] == err1["id"]


def test_get_errors_and_sorting():
    # Insert a critical payment error and a frontend warning
    log_error(
        level="critical",
        source="payment",
        error_type="RazorpaySignatureMismatch",
        message="Signature mismatch for order_999",
        path="/payment/verify",
        method="POST",
    )
    log_error(
        level="warning",
        source="frontend",
        error_type="DeprecationWarning",
        message="Prop foo is deprecated in LewisButton",
        path="/screen/landing",
    )

    # Filter by source=payment
    payment_errors = get_errors(source="payment")
    assert any(e["error_type"] == "RazorpaySignatureMismatch" for e in payment_errors["errors"])
    assert all(e["source"] == "payment" for e in payment_errors["errors"])

    # Filter by level=critical
    critical_errors = get_errors(level="critical")
    assert all(e["level"] == "critical" for e in critical_errors["errors"])

    # Search query
    searched = get_errors(search="LewisButton")
    assert len(searched["errors"]) >= 1
    assert "LewisButton" in searched["errors"][0]["message"]

    # Sorting
    sorted_res = get_errors(sort_by="occurrence_count", sort_order="desc")
    counts = [e["occurrence_count"] for e in sorted_res["errors"]]
    assert counts == sorted(counts, reverse=True)


def test_update_status_and_stats():
    err = log_error(
        level="error",
        source="llm",
        error_type="OpenAIRateLimit",
        message="Rate limit reached for gpt-4o",
        path="/assessment/road-b",
    )
    err_id = err["id"]

    # Move to investigating
    updated = update_error_status(err_id, "investigating", "Checking API quota with provider")
    assert updated["status"] == "investigating"
    assert updated["resolution_notes"] == "Checking API quota with provider"

    # Move to resolved
    resolved = update_error_status(err_id, "resolved", "Switched fallback key")
    assert resolved["status"] == "resolved"
    assert resolved["resolved_at"] is not None

    # Check stats
    stats = get_error_stats()
    assert stats["total"] >= 1
    assert "by_source" in stats
    assert "by_level" in stats


def test_bulk_update_and_delete():
    e1 = log_error(level="info", source="frontend", error_type="Info1", message="info 1")
    e2 = log_error(level="info", source="frontend", error_type="Info2", message="info 2")
    
    updated_count = bulk_update_errors([e1["id"], e2["id"]], "ignored", "Bulk cleanup test")
    assert updated_count == 2

    # Delete
    assert delete_error(e1["id"]) is True
    assert get_error_by_id(e1["id"]) is None


def test_api_endpoints(client):
    # 1. Public client ingest
    client_res = client.post(
        "/api/errors/log",
        json={
            "level": "error",
            "source": "frontend",
            "error_type": "ReactRenderCrash",
            "message": "Cannot read properties of undefined (reading 'map')",
            "stack_trace": "TypeError at Dashboard.jsx:42",
            "path": "/dashboard",
            "context_data": {"activeScreen": "results"}
        }
    )
    assert client_res.status_code == 200
    data = client_res.json()
    assert data["status"] == "success"
    err_id = data["error_id"]

    # 2. Admin list
    list_res = client.get("/admin/errors?source=frontend")
    assert list_res.status_code == 200
    list_data = list_res.json()
    assert list_data["status"] == "success"
    assert any(e["id"] == err_id for e in list_data["errors"])

    # 3. Admin stats
    stats_res = client.get("/admin/errors/stats")
    assert stats_res.status_code == 200
    assert stats_res.json()["stats"]["total"] >= 1

    # 4. Admin single detail
    detail_res = client.get(f"/admin/errors/{err_id}")
    assert detail_res.status_code == 200
    assert detail_res.json()["error"]["id"] == err_id

    # 5. Admin patch status
    patch_res = client.patch(
        f"/admin/errors/{err_id}",
        json={"status": "resolved", "resolution_notes": "Fixed null check in Dashboard.jsx"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["error"]["status"] == "resolved"

    # 6. Admin bulk update
    bulk_res = client.post(
        "/admin/errors/bulk",
        json={"error_ids": [err_id], "status": "ignored"}
    )
    assert bulk_res.status_code == 200
    assert bulk_res.json()["updated_count"] >= 1

    # 7. Admin delete
    del_res = client.delete(f"/admin/errors/{err_id}")
    assert del_res.status_code == 200
    assert del_res.json()["deleted_id"] == err_id
