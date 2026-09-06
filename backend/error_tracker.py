# error_tracker.py — Enterprise Error Tracking & DB Logging Engine
# Multi-mode storage (Supabase PostgreSQL / Direct Postgres / SQLite fallback)

import os
import re
import json
import uuid
import hashlib
import logging
import traceback
from datetime import datetime, timezone, timedelta
from typing import Optional, Dict, Any, List, Union

from auth import (
    get_pg_conn, has_pg, DATABASE_URL,
    USE_SUPABASE_REST, SUPABASE_URL, get_supabase_headers, _request,
    DB_PATH
)
import sqlite3

logger = logging.getLogger("lewis.error_tracker")

# In-memory store for fallback/test environments if DB unavailable
IN_MEMORY_ERRORS: Dict[str, Dict[str, Any]] = {}

SENSITIVE_KEYS_PATTERN = re.compile(
    r"(password|secret|token|authorization|apikey|api_key|credit_card|card_number|cvv|salt|hash|bearer)",
    re.IGNORECASE
)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _iso(dt: Optional[Union[datetime, str]]) -> str:
    if not dt:
        return _utcnow().isoformat()
    if isinstance(dt, str):
        return dt
    return dt.astimezone(timezone.utc).isoformat()


def sanitize_value(val: Any) -> Any:
    """Recursively scrub passwords, bearer tokens, API keys, and sensitive fields."""
    if isinstance(val, dict):
        sanitized = {}
        for k, v in val.items():
            if SENSITIVE_KEYS_PATTERN.search(str(k)):
                sanitized[k] = "[REDACTED]"
            else:
                sanitized[k] = sanitize_value(v)
        return sanitized
    elif isinstance(val, list):
        return [sanitize_value(item) for item in val]
    elif isinstance(val, str):
        # Scrub potential bearer tokens or long hashes in strings
        if len(val) > 2000:
            val = val[:2000] + "... [TRUNCATED]"
        return val
    return val


def compute_error_fingerprint(source: str, error_type: str, path: Optional[str], message: str) -> str:
    """
    Generate deterministic fingerprint to aggregate recurring errors.
    Strips memory addresses, numbers, and UUIDs for clean clustering.
    """
    clean_msg = re.sub(r"0x[0-9a-fA-F]+", "0x...", message or "")
    clean_msg = re.sub(r"[0-9a-fA-F-]{32,36}", "<UUID>", clean_msg)
    clean_msg = re.sub(r"\d+", "<NUM>", clean_msg)
    normalized = f"{source}:{error_type}:{path or ''}:{clean_msg.strip()[:150]}".lower()
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()[:16]


def log_error(
    level: str = "error",
    source: str = "backend",
    error_type: str = "UnknownError",
    message: str = "",
    stack_trace: Optional[str] = None,
    path: Optional[str] = None,
    method: Optional[str] = None,
    status_code: Optional[int] = None,
    user_identifier: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    context_data: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Log an error to the database. If an unresolved error with the same fingerprint exists,
    increments its occurrence_count and updates last_seen_at.
    """
    level = (level or "error").lower()
    if level not in ("info", "warning", "error", "critical"):
        level = "error"

    source = (source or "backend").lower()
    error_type = str(error_type or "Error")[:100]
    message = str(message or "An error occurred")
    if len(message) > 4000:
        message = message[:4000] + "... [TRUNCATED]"

    if stack_trace and len(stack_trace) > 15000:
        stack_trace = stack_trace[:15000] + "\n... [TRUNCATED]"

    sanitized_context = sanitize_value(context_data or {})
    context_json = json.dumps(sanitized_context, ensure_ascii=False) if sanitized_context else None

    fingerprint = compute_error_fingerprint(source, error_type, path, message)
    error_id = f"err_{uuid.uuid4().hex[:12]}"
    now_iso = _iso(_utcnow())

    # --- 1. PostgreSQL Native Driver ---
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    # Check if an unresolved/investigating issue with identical fingerprint already exists
                    cursor.execute(
                        """
                        SELECT id, occurrence_count FROM lewis_error_logs
                        WHERE fingerprint = %s AND status IN ('unresolved', 'investigating')
                        ORDER BY last_seen_at DESC LIMIT 1
                        """,
                        (fingerprint,)
                    )
                    existing = cursor.fetchone()
                    if existing:
                        existing_id = existing["id"]
                        cursor.execute(
                            """
                            UPDATE lewis_error_logs
                            SET occurrence_count = occurrence_count + 1,
                                last_seen_at = %s,
                                status_code = COALESCE(%s, status_code),
                                context_data = COALESCE(%s, context_data),
                                stack_trace = COALESCE(%s, stack_trace)
                            WHERE id = %s
                            RETURNING *
                            """,
                            (now_iso, status_code, context_json, stack_trace, existing_id)
                        )
                        updated = cursor.fetchone()
                        conn.commit()
                        conn.close()
                        return dict(updated) if updated else {"id": existing_id, "fingerprint": fingerprint}
                    else:
                        cursor.execute(
                            """
                            INSERT INTO lewis_error_logs (
                                id, fingerprint, level, source, error_type, message,
                                stack_trace, path, method, status_code, user_identifier,
                                ip_address, user_agent, context_data, status, occurrence_count,
                                created_at, last_seen_at
                            ) VALUES (
                                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'unresolved', 1, %s, %s
                            ) RETURNING *
                            """,
                            (
                                error_id, fingerprint, level, source, error_type, message,
                                stack_trace, path, method, status_code, user_identifier,
                                ip_address, user_agent, context_json, now_iso, now_iso
                            )
                        )
                        inserted = cursor.fetchone()
                        conn.commit()
                        conn.close()
                        return dict(inserted) if inserted else {"id": error_id, "fingerprint": fingerprint}
        except Exception as e:
            logger.error("PostgreSQL log_error failed: %s", e)

    # --- 2. Supabase REST API Fallback ---
    if USE_SUPABASE_REST:
        try:
            url = f"{SUPABASE_URL}/rest/v1/lewis_error_logs"
            # Check existing
            check_resp = _request(
                "GET",
                f"{url}?fingerprint=eq.{fingerprint}&status=in.(unresolved,investigating)&order=last_seen_at.desc&limit=1",
                headers=get_supabase_headers()
            )
            if check_resp.ok and check_resp.json():
                existing_rec = check_resp.json()[0]
                rec_id = existing_rec["id"]
                patch_payload = {
                    "occurrence_count": (existing_rec.get("occurrence_count") or 1) + 1,
                    "last_seen_at": now_iso,
                }
                if status_code is not None:
                    patch_payload["status_code"] = status_code
                if context_json:
                    patch_payload["context_data"] = context_json
                patch_resp = _request("PATCH", f"{url}?id=eq.{rec_id}", headers=get_supabase_headers(), json=patch_payload)
                if patch_resp.ok:
                    res_data = patch_resp.json()
                    return res_data[0] if res_data else existing_rec
            
            # Insert new
            payload = {
                "id": error_id,
                "fingerprint": fingerprint,
                "level": level,
                "source": source,
                "error_type": error_type,
                "message": message,
                "stack_trace": stack_trace,
                "path": path,
                "method": method,
                "status_code": status_code,
                "user_identifier": user_identifier,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "context_data": context_json,
                "status": "unresolved",
                "occurrence_count": 1,
                "created_at": now_iso,
                "last_seen_at": now_iso
            }
            resp = _request("POST", url, headers=get_supabase_headers(), json=payload)
            if resp.ok and resp.json():
                return resp.json()[0]
        except Exception as e:
            logger.error("Supabase REST log_error failed: %s", e)

    # --- 3. SQLite Fallback ---
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute(
            """
            SELECT id, occurrence_count FROM lewis_error_logs
            WHERE fingerprint = ? AND status IN ('unresolved', 'investigating')
            ORDER BY last_seen_at DESC LIMIT 1
            """,
            (fingerprint,)
        )
        row = cursor.fetchone()
        if row:
            existing_id = row["id"]
            cursor.execute(
                """
                UPDATE lewis_error_logs
                SET occurrence_count = occurrence_count + 1,
                    last_seen_at = ?,
                    status_code = COALESCE(?, status_code),
                    context_data = COALESCE(?, context_data),
                    stack_trace = COALESCE(?, stack_trace)
                WHERE id = ?
                """,
                (now_iso, status_code, context_json, stack_trace, existing_id)
            )
            conn.commit()
            cursor.execute("SELECT * FROM lewis_error_logs WHERE id = ?", (existing_id,))
            updated_row = cursor.fetchone()
            conn.close()
            return dict(updated_row) if updated_row else {"id": existing_id}
        else:
            cursor.execute(
                """
                INSERT INTO lewis_error_logs (
                    id, fingerprint, level, source, error_type, message,
                    stack_trace, path, method, status_code, user_identifier,
                    ip_address, user_agent, context_data, status, occurrence_count,
                    created_at, last_seen_at
                ) VALUES (
                    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unresolved', 1, ?, ?
                )
                """,
                (
                    error_id, fingerprint, level, source, error_type, message,
                    stack_trace, path, method, status_code, user_identifier,
                    ip_address, user_agent, context_json, now_iso, now_iso
                )
            )
            conn.commit()
            cursor.execute("SELECT * FROM lewis_error_logs WHERE id = ?", (error_id,))
            inserted_row = cursor.fetchone()
            conn.close()
            return dict(inserted_row) if inserted_row else {"id": error_id}
    except Exception as e:
        logger.error("SQLite log_error fallback failed: %s", e)

    # --- 4. Ephemeral In-Memory Store ---
    rec = {
        "id": error_id,
        "fingerprint": fingerprint,
        "level": level,
        "source": source,
        "error_type": error_type,
        "message": message,
        "stack_trace": stack_trace,
        "path": path,
        "method": method,
        "status_code": status_code,
        "user_identifier": user_identifier,
        "ip_address": ip_address,
        "user_agent": user_agent,
        "context_data": context_json,
        "status": "unresolved",
        "occurrence_count": 1,
        "resolution_notes": None,
        "resolved_at": None,
        "created_at": now_iso,
        "last_seen_at": now_iso
    }
    IN_MEMORY_ERRORS[error_id] = rec
    return rec


def get_errors(
    status: Optional[str] = None,
    source: Optional[str] = None,
    level: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: str = "last_seen_at",
    sort_order: str = "desc",
    limit: int = 50,
    offset: int = 0
) -> Dict[str, Any]:
    """
    Retrieve error logs with rich filtering, searching, sorting, and pagination for Lewis OS.
    """
    limit = max(1, min(limit, 200))
    offset = max(0, offset)

    # Allowed sorting fields
    allowed_sort_fields = {
        "created_at": "created_at",
        "last_seen_at": "last_seen_at",
        "occurrence_count": "occurrence_count",
        "level": "level",
        "error_type": "error_type",
        "status": "status"
    }
    sort_column = allowed_sort_fields.get(sort_by, "last_seen_at")
    direction = "ASC" if sort_order.lower() == "asc" else "DESC"

    # --- 1. PostgreSQL ---
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    conditions = []
                    params: List[Any] = []
                    if status and status.lower() != "all":
                        conditions.append("status = %s")
                        params.append(status.lower())
                    if source and source.lower() != "all":
                        conditions.append("source = %s")
                        params.append(source.lower())
                    if level and level.lower() != "all":
                        conditions.append("level = %s")
                        params.append(level.lower())
                    if search:
                        conditions.append("(message ILIKE %s OR error_type ILIKE %s OR path ILIKE %s OR user_identifier ILIKE %s)")
                        s_term = f"%{search}%"
                        params.extend([s_term, s_term, s_term, s_term])
                    
                    where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
                    
                    # Total count
                    count_query = f"SELECT COUNT(*) as count FROM lewis_error_logs {where_clause}"
                    cursor.execute(count_query, params)
                    total = cursor.fetchone()["count"]

                    # Fetch rows
                    query = f"SELECT * FROM lewis_error_logs {where_clause} ORDER BY {sort_column} {direction} LIMIT %s OFFSET %s"
                    cursor.execute(query, params + [limit, offset])
                    rows = cursor.fetchall()
                    conn.close()
                    return {
                        "total": total,
                        "limit": limit,
                        "offset": offset,
                        "errors": [dict(r) for r in rows]
                    }
        except Exception as e:
            logger.error("PostgreSQL get_errors failed: %s", e)

    # --- 2. SQLite Fallback ---
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        conditions = []
        params = []
        if status and status.lower() != "all":
            conditions.append("status = ?")
            params.append(status.lower())
        if source and source.lower() != "all":
            conditions.append("source = ?")
            params.append(source.lower())
        if level and level.lower() != "all":
            conditions.append("level = ?")
            params.append(level.lower())
        if search:
            conditions.append("(message LIKE ? OR error_type LIKE ? OR path LIKE ? OR user_identifier LIKE ?)")
            s_term = f"%{search}%"
            params.extend([s_term, s_term, s_term, s_term])
        
        where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        
        count_query = f"SELECT COUNT(*) as count FROM lewis_error_logs {where_clause}"
        cursor.execute(count_query, params)
        total = cursor.fetchone()["count"]

        query = f"SELECT * FROM lewis_error_logs {where_clause} ORDER BY {sort_column} {direction} LIMIT ? OFFSET ?"
        cursor.execute(query, params + [limit, offset])
        rows = cursor.fetchall()
        conn.close()
        return {
            "total": total,
            "limit": limit,
            "offset": offset,
            "errors": [dict(r) for r in rows]
        }
    except Exception as e:
        logger.error("SQLite get_errors failed: %s", e)

    # --- 3. Ephemeral In-Memory Store ---
    items = list(IN_MEMORY_ERRORS.values())
    if status and status.lower() != "all":
        items = [i for i in items if i.get("status") == status.lower()]
    if source and source.lower() != "all":
        items = [i for i in items if i.get("source") == source.lower()]
    if level and level.lower() != "all":
        items = [i for i in items if i.get("level") == level.lower()]
    if search:
        s_lower = search.lower()
        items = [i for i in items if s_lower in (i.get("message", "") + i.get("error_type", "") + i.get("path", "")).lower()]

    reverse = direction == "DESC"
    items.sort(key=lambda x: str(x.get(sort_column, "")), reverse=reverse)
    total = len(items)
    paged = items[offset : offset + limit]
    return {
        "total": total,
        "limit": limit,
        "offset": offset,
        "errors": paged
    }


def get_error_by_id(error_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve full details of a specific error by ID."""
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    cursor.execute("SELECT * FROM lewis_error_logs WHERE id = %s", (error_id,))
                    row = cursor.fetchone()
                    conn.close()
                    return dict(row) if row else None
        except Exception as e:
            logger.error("PostgreSQL get_error_by_id failed: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM lewis_error_logs WHERE id = ?", (error_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None
    except Exception as e:
        logger.error("SQLite get_error_by_id failed: %s", e)

    return IN_MEMORY_ERRORS.get(error_id)


def update_error_status(error_id: str, status: str, resolution_notes: Optional[str] = None) -> Optional[Dict[str, Any]]:
    """Update issue status (unresolved, investigating, resolved, ignored) and notes."""
    status = (status or "unresolved").lower()
    if status not in ("unresolved", "investigating", "resolved", "ignored"):
        raise ValueError(f"Invalid status '{status}'. Must be one of: unresolved, investigating, resolved, ignored.")

    resolved_at = _iso(_utcnow()) if status in ("resolved", "ignored") else None

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE lewis_error_logs
                        SET status = %s,
                            resolution_notes = COALESCE(%s, resolution_notes),
                            resolved_at = %s
                        WHERE id = %s
                        RETURNING *
                        """,
                        (status, resolution_notes, resolved_at, error_id)
                    )
                    row = cursor.fetchone()
                    conn.commit()
                    conn.close()
                    return dict(row) if row else None
        except Exception as e:
            logger.error("PostgreSQL update_error_status failed: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(
            """
            UPDATE lewis_error_logs
            SET status = ?,
                resolution_notes = COALESCE(?, resolution_notes),
                resolved_at = ?
            WHERE id = ?
            """,
            (status, resolution_notes, resolved_at, error_id)
        )
        conn.commit()
        cursor.execute("SELECT * FROM lewis_error_logs WHERE id = ?", (error_id,))
        row = cursor.fetchone()
        conn.close()
        return dict(row) if row else None
    except Exception as e:
        logger.error("SQLite update_error_status failed: %s", e)

    if error_id in IN_MEMORY_ERRORS:
        IN_MEMORY_ERRORS[error_id]["status"] = status
        if resolution_notes is not None:
            IN_MEMORY_ERRORS[error_id]["resolution_notes"] = resolution_notes
        IN_MEMORY_ERRORS[error_id]["resolved_at"] = resolved_at
        return IN_MEMORY_ERRORS[error_id]
    return None


def bulk_update_errors(error_ids: List[str], status: str, resolution_notes: Optional[str] = None) -> int:
    """Bulk update multiple errors."""
    if not error_ids:
        return 0
    status = status.lower()
    resolved_at = _iso(_utcnow()) if status in ("resolved", "ignored") else None
    count = 0

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    cursor.execute(
                        """
                        UPDATE lewis_error_logs
                        SET status = %s,
                            resolution_notes = COALESCE(%s, resolution_notes),
                            resolved_at = %s
                        WHERE id = ANY(%s)
                        """,
                        (status, resolution_notes, resolved_at, error_ids)
                    )
                    count = cursor.rowcount
                    conn.commit()
                    conn.close()
                    return count
        except Exception as e:
            logger.error("PostgreSQL bulk_update_errors failed: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        placeholders = ",".join("?" for _ in error_ids)
        cursor.execute(
            f"""
            UPDATE lewis_error_logs
            SET status = ?,
                resolution_notes = COALESCE(?, resolution_notes),
                resolved_at = ?
            WHERE id IN ({placeholders})
            """,
            [status, resolution_notes, resolved_at] + error_ids
        )
        count = cursor.rowcount
        conn.commit()
        conn.close()
        return count
    except Exception as e:
        logger.error("SQLite bulk_update_errors failed: %s", e)

    for eid in error_ids:
        if eid in IN_MEMORY_ERRORS:
            IN_MEMORY_ERRORS[eid]["status"] = status
            if resolution_notes:
                IN_MEMORY_ERRORS[eid]["resolution_notes"] = resolution_notes
            IN_MEMORY_ERRORS[eid]["resolved_at"] = resolved_at
            count += 1
    return count


def delete_error(error_id: str) -> bool:
    """Delete a specific error log."""
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    cursor.execute("DELETE FROM lewis_error_logs WHERE id = %s", (error_id,))
                    rc = cursor.rowcount
                    conn.commit()
                    conn.close()
                    return rc > 0
        except Exception as e:
            logger.error("PostgreSQL delete_error failed: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM lewis_error_logs WHERE id = ?", (error_id,))
        rc = cursor.rowcount
        conn.commit()
        conn.close()
        return rc > 0
    except Exception as e:
        logger.error("SQLite delete_error failed: %s", e)

    if error_id in IN_MEMORY_ERRORS:
        del IN_MEMORY_ERRORS[error_id]
        return True
    return False


def get_error_stats() -> Dict[str, Any]:
    """
    Get aggregate error counts for Lewis OS monitoring dashboard.
    """
    stats: Dict[str, Any] = {
        "total": 0,
        "unresolved": 0,
        "investigating": 0,
        "resolved": 0,
        "ignored": 0,
        "critical": 0,
        "last_24h": 0,
        "by_source": {},
        "by_level": {}
    }

    twenty_four_hours_ago = _iso(_utcnow() - timedelta(hours=24))

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    cursor.execute("SELECT COUNT(*) as total FROM lewis_error_logs")
                    stats["total"] = cursor.fetchone()["total"]

                    cursor.execute("SELECT status, COUNT(*) as count FROM lewis_error_logs GROUP BY status")
                    for row in cursor.fetchall():
                        st = row["status"]
                        stats[st] = row["count"]

                    cursor.execute("SELECT source, COUNT(*) as count FROM lewis_error_logs GROUP BY source")
                    for row in cursor.fetchall():
                        stats["by_source"][row["source"]] = row["count"]

                    cursor.execute("SELECT level, COUNT(*) as count FROM lewis_error_logs GROUP BY level")
                    for row in cursor.fetchall():
                        stats["by_level"][row["level"]] = row["count"]
                        if row["level"] == "critical":
                            stats["critical"] = row["count"]

                    cursor.execute("SELECT COUNT(*) as count FROM lewis_error_logs WHERE last_seen_at >= %s", (twenty_four_hours_ago,))
                    stats["last_24h"] = cursor.fetchone()["count"]
                    conn.close()
                    return stats
        except Exception as e:
            logger.error("PostgreSQL get_error_stats failed: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) as total FROM lewis_error_logs")
        stats["total"] = cursor.fetchone()["total"]

        cursor.execute("SELECT status, COUNT(*) as count FROM lewis_error_logs GROUP BY status")
        for row in cursor.fetchall():
            st = row["status"]
            stats[st] = row["count"]

        cursor.execute("SELECT source, COUNT(*) as count FROM lewis_error_logs GROUP BY source")
        for row in cursor.fetchall():
            stats["by_source"][row["source"]] = row["count"]

        cursor.execute("SELECT level, COUNT(*) as count FROM lewis_error_logs GROUP BY level")
        for row in cursor.fetchall():
            stats["by_level"][row["level"]] = row["count"]
            if row["level"] == "critical":
                stats["critical"] = row["count"]

        cursor.execute("SELECT COUNT(*) as count FROM lewis_error_logs WHERE last_seen_at >= ?", (twenty_four_hours_ago,))
        stats["last_24h"] = cursor.fetchone()["count"]
        conn.close()
        return stats
    except Exception as e:
        logger.error("SQLite get_error_stats failed: %s", e)

    # Ephemeral in-memory stats
    stats["total"] = len(IN_MEMORY_ERRORS)
    for rec in IN_MEMORY_ERRORS.values():
        st = rec.get("status", "unresolved")
        stats[st] = stats.get(st, 0) + 1
        src = rec.get("source", "backend")
        stats["by_source"][src] = stats["by_source"].get(src, 0) + 1
        lvl = rec.get("level", "error")
        stats["by_level"][lvl] = stats["by_level"].get(lvl, 0) + 1
        if lvl == "critical":
            stats["critical"] += 1
        if rec.get("last_seen_at", "") >= twenty_four_hours_ago:
            stats["last_24h"] += 1

    return stats
