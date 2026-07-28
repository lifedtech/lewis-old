# auth.py — Anonymized Insight Report Engine & Multi-Mode DB (Supabase PostgreSQL / REST + SQLite Fallback)
import sqlite3
import hashlib
import hmac
import secrets
import os
import re
import json
import uuid
import logging
from typing import Optional, Dict, Any, List
import requests

logger = logging.getLogger("lewis.auth")

# Dedicated database directory for SQLite fallback
DB_DIR = os.path.join(os.path.dirname(__file__), "db")
try:
    os.makedirs(DB_DIR, exist_ok=True)
    DB_PATH = os.path.join(DB_DIR, "lewis_users.db")
except Exception as err:
    logger.warning("Could not create local DB directory (%s). Running in ephemeral mode.", err)
    DB_PATH = ":memory:"

# Environment Config
ANON_SALT = os.getenv("LEWIS_ANON_SALT", "LEWIS_SECURE_ANON_SALT_2026_V1")
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SECRET_KEY") or os.getenv("SUPABASE_KEY", "")

# Auto-detect Supabase URL from DATABASE_URL if not provided
if not SUPABASE_URL and DATABASE_URL:
    match = re.search(r'postgres\.([a-z0-9]+)@', DATABASE_URL)
    if match:
        project_ref = match.group(1)
        SUPABASE_URL = f"https://{project_ref}.supabase.co"
        logger.info("Auto-detected Supabase REST URL: %s", SUPABASE_URL)

# Attempt psycopg2 import for direct PostgreSQL connection
has_pg = False
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
    has_pg = True
except ImportError:
    has_pg = False

USE_SUPABASE_REST = bool(SUPABASE_URL and SUPABASE_KEY)
USE_POSTGRES = bool(DATABASE_URL and has_pg)

if USE_POSTGRES:
    logger.info("PostgreSQL Native Driver Active via DATABASE_URL")
elif USE_SUPABASE_REST:
    logger.info("Supabase REST API Active via %s", SUPABASE_URL)
else:
    logger.info("Local SQLite / Fallback Mode Active")

IN_MEMORY_USERS: Dict[str, Dict[str, Any]] = {}
IN_MEMORY_SESSIONS: Dict[str, Dict[str, Any]] = {}

def get_pg_conn():
    """Create a connection to PostgreSQL via DATABASE_URL."""
    if not has_pg or not DATABASE_URL:
        return None
    url = DATABASE_URL.replace("postgresql://", "postgres://", 1) if DATABASE_URL.startswith("postgresql://") else DATABASE_URL
    return psycopg2.connect(url, cursor_factory=RealDictCursor)

def get_supabase_headers() -> Dict[str, str]:
    return {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=representation"
    }

def init_db():
    """Ensure isolated lewis_ tables exist in local SQLite if active."""
    if (has_pg and DATABASE_URL) or USE_SUPABASE_REST:
        return  # Managed via Supabase cloud
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                name TEXT,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                source_portal TEXT DEFAULT 'lewis_app',
                role TEXT DEFAULT 'user',
                status TEXT DEFAULT 'active',
                last_login_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                ip_address TEXT,
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lewis_users (id) ON DELETE CASCADE
            )
        """)
        
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_user_report_vault (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                report_uuid TEXT UNIQUE NOT NULL,
                report_title TEXT,
                wellbeing_band TEXT,
                overall_score REAL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lewis_users (id) ON DELETE CASCADE
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_anonymized_insight_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_uuid TEXT UNIQUE NOT NULL,
                anonymous_code TEXT NOT NULL,
                wellbeing_band TEXT,
                overall_score REAL,
                deidentified_scores_json TEXT NOT NULL,
                deidentified_answers_json TEXT NOT NULL,
                deidentified_report_json TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        conn.commit()
        conn.close()
    except Exception as e:
        logger.warning("Local SQLite DB initialization bypassed (%s).", e)

init_db()

def generate_anonymous_user_code(user_id: int) -> str:
    """Generate a non-reversible anonymous subject ID (e.g. ANON-SUBJ-8F92A1D0)."""
    digest = hmac.new(ANON_SALT.encode('utf-8'), str(user_id).encode('utf-8'), hashlib.sha256).hexdigest()
    return f"ANON-SUBJ-{digest[:8].upper()}"

def generate_report_uuid() -> str:
    """Generate a unique identifier for an anonymized report."""
    return f"REP-{uuid.uuid4().hex[:12].upper()}"

def deidentify_data(data: Any) -> Any:
    """Recursively scrub personal identifiable information (PII, credentials, contacts, names)."""
    PII_KEYS = {"name", "email", "phone", "contact", "address", "password", "password_hash", "salt", "token", "credentials"}
    if isinstance(data, dict):
        cleaned = {}
        for k, v in data.items():
            k_lower = k.lower()
            if k_lower in PII_KEYS:
                if k_lower == "name":
                    cleaned[k] = "[ANONYMIZED_USER]"
                else:
                    continue
            else:
                cleaned[k] = deidentify_data(v)
        return cleaned
    elif isinstance(data, list):
        return [deidentify_data(item) for item in data]
    elif isinstance(data, str):
        clean_str = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[ANONYMIZED_EMAIL]', data)
        return clean_str
    return data

def _hash_password(password: str, salt: str) -> str:
    """Hash password with PBKDF2 SHA-256 (200,000 iterations for high security)."""
    return hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        200000
    ).hex()

def register_user(email: str, password: str, name: Optional[str] = None, source_portal: str = 'lewis_app') -> Dict[str, Any]:
    """Register a new user in isolated database tables (lewis_users & lewis_sessions)."""
    email_clean = email.strip().lower()
    if not email_clean or "@" not in email_clean or len(email_clean) > 254:
        raise ValueError("Invalid email address format")
    if len(password) < 8:
        raise ValueError("Security requirement: Password must be at least 8 characters long")

    salt = secrets.token_hex(32)
    pw_hash = _hash_password(password, salt)
    user_name = name.strip() if name else email_clean.split('@')[0].capitalize()
    token = secrets.token_hex(32)

    # 1. Native PostgreSQL via DATABASE_URL
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM lewis_users WHERE email = %s", (email_clean,))
            if cursor.fetchone():
                conn.close()
                raise ValueError("An account with this email already exists")

            cursor.execute(
                "INSERT INTO lewis_users (email, name, password_hash, salt, source_portal, last_login_at) VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING id",
                (email_clean, user_name, pw_hash, salt, source_portal)
            )
            user_id = cursor.fetchone()['id']
            cursor.execute("INSERT INTO lewis_sessions (token, user_id) VALUES (%s, %s)", (token, user_id))
            conn.commit()
            conn.close()
            return {
                "status": "success",
                "user": {"id": user_id, "email": email_clean, "name": user_name, "source_portal": source_portal},
                "token": token
            }
        except ValueError as ve:
            raise ve
        except Exception as exc:
            logger.error("PostgreSQL user registration error (%s). Falling back to REST/local.", exc)

    # 2. Supabase REST API
    if USE_SUPABASE_REST:
        try:
            res = requests.get(f"{SUPABASE_URL}/rest/v1/lewis_users?email=eq.{email_clean}", headers=get_supabase_headers())
            if res.status_code == 200 and len(res.json()) > 0:
                raise ValueError("An account with this email already exists")

            payload = {"email": email_clean, "name": user_name, "password_hash": pw_hash, "salt": salt, "source_portal": source_portal}
            create_res = requests.post(f"{SUPABASE_URL}/rest/v1/lewis_users", headers=get_supabase_headers(), json=payload)
            if create_res.status_code not in (200, 201):
                raise ValueError(f"Supabase user creation error: {create_res.text}")
            
            created_user = create_res.json()[0]
            user_id = created_user["id"]

            session_payload = {"token": token, "user_id": user_id}
            requests.post(f"{SUPABASE_URL}/rest/v1/lewis_sessions", headers=get_supabase_headers(), json=session_payload)

            return {
                "status": "success",
                "user": {"id": user_id, "email": email_clean, "name": user_name, "source_portal": source_portal},
                "token": token
            }
        except ValueError as ve:
            raise ve
        except Exception as exc:
            logger.error("Supabase REST registration failed (%s).", exc)

    # 3. Local SQLite Fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM lewis_users WHERE email = ?", (email_clean,))
        if cursor.fetchone():
            conn.close()
            raise ValueError("An account with this email already exists")

        cursor.execute(
            "INSERT INTO lewis_users (email, name, password_hash, salt, source_portal, last_login_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
            (email_clean, user_name, pw_hash, salt, source_portal)
        )
        user_id = cursor.lastrowid
        cursor.execute("INSERT INTO lewis_sessions (token, user_id) VALUES (?, ?)", (token, user_id))
        conn.commit()
        conn.close()
    except ValueError as ve:
        raise ve
    except Exception as exc:
        logger.warning("DB registration error (%s). Falling back to memory mode.", exc)
        user_id = len(IN_MEMORY_USERS) + 100
        user_entry = {"id": user_id, "email": email_clean, "name": user_name, "password_hash": pw_hash, "salt": salt, "source_portal": source_portal}
        IN_MEMORY_USERS[email_clean] = user_entry
        IN_MEMORY_SESSIONS[token] = user_entry

    return {
        "status": "success",
        "user": {"id": user_id, "email": email_clean, "name": user_name, "source_portal": source_portal},
        "token": token
    }

def login_user(email: str, password: str) -> Dict[str, Any]:
    """Authenticate existing user against isolated lewis_users table."""
    email_clean = email.strip().lower()

    # 1. Native PostgreSQL
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("SELECT id, name, password_hash, salt, source_portal FROM lewis_users WHERE email = %s", (email_clean,))
            row = cursor.fetchone()
            if row:
                user_id = row['id']
                name = row['name']
                pw_hash = row['password_hash']
                salt = row['salt']
                source_portal = row.get('source_portal', 'lewis_app')

                test_hash = _hash_password(password, salt)
                if test_hash != pw_hash:
                    conn.close()
                    raise ValueError("Invalid email or password")

                token = secrets.token_hex(32)
                cursor.execute("UPDATE lewis_users SET last_login_at = NOW() WHERE id = %s", (user_id,))
                cursor.execute("INSERT INTO lewis_sessions (token, user_id) VALUES (%s, %s)", (token, user_id))
                conn.commit()
                conn.close()

                return {
                    "status": "success",
                    "user": {"id": user_id, "email": email_clean, "name": name, "source_portal": source_portal},
                    "token": token
                }
            conn.close()
        except ValueError as ve:
            raise ve
        except Exception as exc:
            logger.error("PostgreSQL login error (%s).", exc)

    # 2. Supabase REST API
    if USE_SUPABASE_REST:
        try:
            res = requests.get(f"{SUPABASE_URL}/rest/v1/lewis_users?email=eq.{email_clean}", headers=get_supabase_headers())
            if res.status_code == 200 and len(res.json()) > 0:
                user = res.json()[0]
                user_id = user["id"]
                name = user.get("name")
                pw_hash = user["password_hash"]
                salt = user["salt"]
                source_portal = user.get("source_portal", "lewis_app")

                test_hash = _hash_password(password, salt)
                if test_hash != pw_hash:
                    raise ValueError("Invalid email or password")

                token = secrets.token_hex(32)
                session_payload = {"token": token, "user_id": user_id}
                requests.post(f"{SUPABASE_URL}/rest/v1/lewis_sessions", headers=get_supabase_headers(), json=session_payload)

                return {
                    "status": "success",
                    "user": {"id": user_id, "email": email_clean, "name": name, "source_portal": source_portal},
                    "token": token
                }
        except ValueError as ve:
            raise ve
        except Exception as exc:
            logger.error("Supabase REST login error (%s).", exc)

    # 3. Local SQLite Fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, password_hash, salt, source_portal FROM lewis_users WHERE email = ?", (email_clean,))
        row = cursor.fetchone()
        if row:
            user_id, name, pw_hash, salt, source_portal = row
            test_hash = _hash_password(password, salt)
            if test_hash != pw_hash:
                conn.close()
                raise ValueError("Invalid email or password")
                
            cursor.execute("UPDATE lewis_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", (user_id,))
            token = secrets.token_hex(32)
            cursor.execute("INSERT INTO lewis_sessions (token, user_id) VALUES (?, ?)", (token, user_id))
            conn.commit()
            conn.close()
            return {
                "status": "success",
                "user": {"id": user_id, "email": email_clean, "name": name, "source_portal": source_portal},
                "token": token
            }
        conn.close()
    except ValueError as ve:
        raise ve
    except Exception:
        pass

    # 4. Memory Fallback
    if email_clean in IN_MEMORY_USERS:
        user = IN_MEMORY_USERS[email_clean]
        test_hash = _hash_password(password, user["salt"])
        if test_hash == user["password_hash"]:
            token = secrets.token_hex(32)
            IN_MEMORY_SESSIONS[token] = user
            return {
                "status": "success",
                "user": {"id": user["id"], "email": user["email"], "name": user["name"], "source_portal": user["source_portal"]},
                "token": token
            }

    raise ValueError("Invalid email or password")

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify session token against isolated lewis_sessions table."""
    if not token:
        return None

    # 1. Native PostgreSQL
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT u.id, u.email, u.name, u.source_portal, u.role 
                FROM lewis_sessions s 
                JOIN lewis_users u ON s.user_id = u.id 
                WHERE s.token = %s
            """, (token,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return {"id": row['id'], "email": row['email'], "name": row['name'], "source_portal": row['source_portal'], "role": row['role']}
        except Exception:
            pass

    # 2. Supabase REST API
    if USE_SUPABASE_REST:
        try:
            res = requests.get(
                f"{SUPABASE_URL}/rest/v1/lewis_sessions?token=eq.{token}&select=user_id,lewis_users(id,email,name,source_portal,role)",
                headers=get_supabase_headers()
            )
            if res.status_code == 200 and len(res.json()) > 0:
                session_item = res.json()[0]
                user_obj = session_item.get("lewis_users", {})
                if user_obj:
                    return {
                        "id": user_obj.get("id"),
                        "email": user_obj.get("email"),
                        "name": user_obj.get("name"),
                        "source_portal": user_obj.get("source_portal", "lewis_app"),
                        "role": user_obj.get("role", "user")
                    }
        except Exception:
            pass

    # 3. SQLite Check
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT u.id, u.email, u.name, u.source_portal, u.role 
            FROM lewis_sessions s 
            JOIN lewis_users u ON s.user_id = u.id 
            WHERE s.token = ?
        """, (token,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {"id": row[0], "email": row[1], "name": row[2], "source_portal": row[3], "role": row[4]}
    except Exception:
        pass

    # 4. Memory Check
    if token in IN_MEMORY_SESSIONS:
        u = IN_MEMORY_SESSIONS[token]
        return {"id": u["id"], "email": u["email"], "name": u["name"], "source_portal": u.get("source_portal", "lewis_app"), "role": "user"}

    return None

def save_assessment_submission(user_id: int, user_email: str, assessment_data: Dict[str, Any]) -> str:
    """
    Save an anonymized insight report into lewis_anonymized_insight_reports with ZERO PII,
    and link its report_uuid to the user's personal vault in lewis_user_report_vault.
    """
    report_uuid = generate_report_uuid()
    anonymous_code = generate_anonymous_user_code(user_id)

    scores = assessment_data.get("scores", {})
    answers = assessment_data.get("answers", {})
    report_obj = assessment_data.get("insight_report", {})
    
    wellbeing_band = scores.get("who5", {}).get("wellbeing_band") or "Moderate"
    overall_score = scores.get("who5", {}).get("scaled_score", 0.0)

    clean_scores = deidentify_data(scores)
    clean_answers = deidentify_data(answers)
    clean_report = deidentify_data(report_obj)

    # 1. Native PostgreSQL
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO lewis_anonymized_insight_reports 
                (report_uuid, anonymous_code, wellbeing_band, overall_score, deidentified_scores_json, deidentified_answers_json, deidentified_report_json)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (
                report_uuid,
                anonymous_code,
                wellbeing_band,
                overall_score,
                json.dumps(clean_scores),
                json.dumps(clean_answers),
                json.dumps(clean_report)
            ))

            cursor.execute("""
                INSERT INTO lewis_user_report_vault 
                (user_id, report_uuid, report_title, wellbeing_band, overall_score)
                VALUES (%s, %s, %s, %s, %s)
            """, (
                user_id,
                report_uuid,
                f"LEWIS Insight Report ({report_uuid})",
                wellbeing_band,
                overall_score
            ))

            conn.commit()
            conn.close()
            logger.info("PostgreSQL: De-identified report %s saved under anonymous code %s", report_uuid, anonymous_code)
            return report_uuid
        except Exception as exc:
            logger.error("PostgreSQL assessment save error (%s).", exc)

    # 2. Supabase REST API
    if USE_SUPABASE_REST:
        try:
            anon_payload = {
                "report_uuid": report_uuid,
                "anonymous_code": anonymous_code,
                "wellbeing_band": wellbeing_band,
                "overall_score": overall_score,
                "deidentified_scores_json": clean_scores,
                "deidentified_answers_json": clean_answers,
                "deidentified_report_json": clean_report
            }
            requests.post(f"{SUPABASE_URL}/rest/v1/lewis_anonymized_insight_reports", headers=get_supabase_headers(), json=anon_payload)

            vault_payload = {
                "user_id": user_id,
                "report_uuid": report_uuid,
                "report_title": f"LEWIS Insight Report ({report_uuid})",
                "wellbeing_band": wellbeing_band,
                "overall_score": overall_score
            }
            requests.post(f"{SUPABASE_URL}/rest/v1/lewis_user_report_vault", headers=get_supabase_headers(), json=vault_payload)

            logger.info("Supabase REST: De-identified report %s saved under anonymous code %s", report_uuid, anonymous_code)
            return report_uuid
        except Exception as exc:
            logger.error("Supabase REST assessment save error (%s).", exc)

    # 3. Local SQLite Fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO lewis_anonymized_insight_reports 
            (report_uuid, anonymous_code, wellbeing_band, overall_score, deidentified_scores_json, deidentified_answers_json, deidentified_report_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            report_uuid,
            anonymous_code,
            wellbeing_band,
            overall_score,
            json.dumps(clean_scores),
            json.dumps(clean_answers),
            json.dumps(clean_report)
        ))

        cursor.execute("""
            INSERT INTO lewis_user_report_vault 
            (user_id, report_uuid, report_title, wellbeing_band, overall_score)
            VALUES (?, ?, ?, ?, ?)
        """, (
            user_id,
            report_uuid,
            f"LEWIS Insight Report ({report_uuid})",
            wellbeing_band,
            overall_score
        ))

        conn.commit()
        conn.close()
        logger.info("SQLite: De-identified report %s saved under anonymous code %s", report_uuid, anonymous_code)
    except Exception as exc:
        logger.warning("DB save bypassed (%s).", exc)

    return report_uuid

def get_user_assessments(user_id: int) -> List[Dict[str, Any]]:
    """Fetch user's report vault entries from isolated lewis_user_report_vault table."""
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("""
                SELECT report_uuid, report_title, wellbeing_band, overall_score, created_at
                FROM lewis_user_report_vault
                WHERE user_id = %s
                ORDER BY created_at DESC
            """, (user_id,))
            rows = cursor.fetchall()
            conn.close()
            return rows
        except Exception:
            pass

    if USE_SUPABASE_REST:
        try:
            res = requests.get(
                f"{SUPABASE_URL}/rest/v1/lewis_user_report_vault?user_id=eq.{user_id}&select=report_uuid,report_title,wellbeing_band,overall_score,created_at&order=created_at.desc",
                headers=get_supabase_headers()
            )
            if res.status_code == 200:
                return res.json()
        except Exception:
            pass

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT report_uuid, report_title, wellbeing_band, overall_score, created_at
            FROM lewis_user_report_vault
            WHERE user_id = ?
            ORDER BY created_at DESC
        """, (user_id,))
        rows = cursor.fetchall()
        conn.close()
        return [{
            "report_uuid": r[0],
            "report_title": r[1],
            "wellbeing_band": r[2],
            "overall_score": r[3],
            "created_at": r[4]
        } for r in rows]
    except Exception:
        return []

def get_onboarding_analytics_summary() -> Dict[str, Any]:
    """Fetch usage analytics for the Onboarding system without exposing user details."""
    if USE_SUPABASE_REST:
        try:
            res = requests.get(
                f"{SUPABASE_URL}/rest/v1/lewis_onboarding_analytics_summary",
                headers=get_supabase_headers()
            )
            if res.status_code == 200 and len(res.json()) > 0:
                return res.json()[0]
        except Exception:
            pass

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM lewis_onboarding_analytics_summary")
            row = cursor.fetchone()
            conn.close()
            if row:
                return dict(row)
        except Exception:
            pass

    return {
        "total_registered_lewis_users": len(IN_MEMORY_USERS),
        "total_active_subjects": 0,
        "total_assessments_completed": 0,
        "last_assessment_time": None
    }
