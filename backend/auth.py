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
from datetime import datetime, timedelta, timezone
from urllib.parse import quote
from typing import Optional, Dict, Any, List
import requests
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash

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
#
# ENVIRONMENT is the single explicit signal for "this is a real deployment,
# fail fast rather than silently degrade" (SEC-005). Deliberately NOT tied
# to a platform-specific auto-var like RAILWAY_ENVIRONMENT — this app can
# deploy to Railway, Render, or anywhere else, and a check that only fires
# on one platform's own env var silently does nothing on the others. Set
# ENVIRONMENT=production explicitly wherever this actually runs in prod.
ENVIRONMENT = os.getenv("ENVIRONMENT", "development").strip().lower()
IS_PRODUCTION = ENVIRONMENT == "production"

ANON_SALT = os.getenv("LEWIS_ANON_SALT")
if not ANON_SALT:
    if IS_PRODUCTION or os.getenv("LEWIS_REQUIRE_SECRET_CONFIG", "false").lower() == "true":
        raise RuntimeError(
            "LEWIS_ANON_SALT must be set when ENVIRONMENT=production (or "
            "LEWIS_REQUIRE_SECRET_CONFIG=true). Refusing to start with a "
            "random ephemeral salt in production: it would silently change "
            "the anonymous-code mapping on every restart/redeploy."
        )
    ANON_SALT = secrets.token_hex(32)
    logger.warning(
        "LEWIS_ANON_SALT is not set; using a process-local DEVELOPMENT-ONLY "
        "salt. Set ENVIRONMENT=production with LEWIS_ANON_SALT configured "
        "before deploying, or this value resets on every restart."
    )
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()
SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SECRET_KEY") or ""
SUPABASE_TIMEOUT_SECONDS = float(os.getenv("LEWIS_SUPABASE_TIMEOUT_SECONDS", "5"))
SESSION_TTL_SECONDS = int(os.getenv("LEWIS_SESSION_TTL_SECONDS", "604800"))

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
elif IS_PRODUCTION:
    # Same fail-fast principle as LEWIS_ANON_SALT above (SEC-005): a
    # production deploy silently falling back to local SQLite/in-memory
    # storage means user accounts and sessions vanish on every
    # restart/redeploy, with no error to signal it happened.
    raise RuntimeError(
        "No production database backend is configured (need DATABASE_URL, "
        "or SUPABASE_URL + SUPABASE_SERVICE_KEY). Refusing to start in "
        "production against the local SQLite fallback."
    )
else:
    logger.info("Local SQLite / Fallback Mode Active (development only)")

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


def _request(method: str, url: str, **kwargs):
    return requests.request(method, url, timeout=SUPABASE_TIMEOUT_SECONDS, **kwargs)


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _session_expires_at() -> datetime:
    return _utcnow() + timedelta(seconds=SESSION_TTL_SECONDS)


def _iso(dt: datetime) -> str:
    return dt.astimezone(timezone.utc).isoformat()


def _token_digest(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _public_user(user: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": user.get("id"),
        "email": user.get("email"),
        "name": user.get("name"),
        "source_portal": user.get("source_portal", "lewis_app"),
        "role": user.get("role", "user"),
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
                expires_at TIMESTAMP NOT NULL,
                revoked_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES lewis_users (id) ON DELETE CASCADE
            )
        """)
        
        for statement in (
            "ALTER TABLE lewis_sessions ADD COLUMN expires_at TIMESTAMP",
            "ALTER TABLE lewis_sessions ADD COLUMN revoked_at TIMESTAMP",
        ):
            try:
                cursor.execute(statement)
            except sqlite3.OperationalError:
                pass
        cursor.execute(
            "UPDATE lewis_sessions SET expires_at = datetime(created_at, '+' || ? || ' seconds') WHERE expires_at IS NULL",
            (SESSION_TTL_SECONDS,),
        )

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

_EMAIL_RE = re.compile(r'[\w\.-]+@[\w\.-]+\.\w+')
_URL_RE = re.compile(r'\b(?:https?://|www\.)\S+', re.IGNORECASE)
# Conservative phone-number matcher: 7+ digits joined by phone-typical
# punctuation (+, spaces, dashes, dots, parens). Deliberately errs toward
# over-matching (redacting a benign digit sequence in free text) rather
# than under-matching (leaking a real phone number) — see deidentify_data's
# docstring for what this function does and does not guarantee.
_PHONE_RE = re.compile(r'(?<!\w)(\+?\d[\d\-.\s()]{6,14}\d)(?!\w)')


def deidentify_data(data: Any) -> Any:
    """Best-effort PII scrubbing (SEC-011): strips known-PII dict keys, and
    pattern-matches emails / URLs / phone-shaped digit sequences embedded
    in free text.

    IMPORTANT — this is PATTERN-BASED redaction, not identity detection.
    It reliably removes PII that matches one of the patterns above. It
    CANNOT reliably catch a name written in prose ("my manager Sarah told
    me..."), a street address, an employer name, or any other identifying
    detail that isn't email/URL/phone-shaped — that needs named-entity
    recognition, which this function does not attempt. Treat data that has
    passed through this function as "known PII patterns removed", never as
    a guarantee of anonymity — the free-text assessment fields in
    particular (body_awareness, priorAttempts, aspirationLandscape, etc.)
    may still contain identifying content this function cannot detect.
    """
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
        clean_str = _EMAIL_RE.sub('[ANONYMIZED_EMAIL]', data)
        clean_str = _URL_RE.sub('[ANONYMIZED_URL]', clean_str)
        clean_str = _PHONE_RE.sub('[ANONYMIZED_PHONE]', clean_str)
        return clean_str
    return data

def _hash_password(password: str, salt: str) -> str:
    """Legacy PBKDF2-SHA256 hash (200,000 iterations). Kept only to verify
    existing accounts created before the Argon2id migration (SEC-015) — new
    passwords are never hashed with this anymore, see _hash_password_argon2."""
    return hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        200000
    ).hex()

# --- SEC-015: Argon2id password hashing, with transparent migration ---
#
# Argon2id's encoded hash string is self-contained (embeds its own salt and
# parameters), so the separate `salt` column has nothing left to store for
# an Argon2-hashed row. It stays NOT NULL in the schema for compatibility
# with existing rows, so Argon2-hashed rows get this placeholder instead of
# a real per-row salt — _hash_password_argon2/_verify_password never read
# it for Argon2 hashes, only for legacy PBKDF2 ones.
ARGON2_SALT_PLACEHOLDER = "argon2id-embedded"

_argon2_hasher = PasswordHasher()


def _hash_password_argon2(password: str) -> str:
    """Hash a new password with Argon2id. Returns a self-contained encoded
    hash string (algorithm + parameters + salt + digest, all embedded)."""
    return _argon2_hasher.hash(password)


def _is_argon2_hash(pw_hash: str) -> bool:
    return isinstance(pw_hash, str) and pw_hash.startswith("$argon2")


def _verify_password(password: str, pw_hash: str, salt: str) -> bool:
    """Verify a password against either an Argon2id hash or a legacy
    PBKDF2 hash, auto-detected by format. Callers that get True back from
    this AND get False from _is_argon2_hash(pw_hash) should transparently
    rehash and persist the new Argon2id hash (see login_user)."""
    if _is_argon2_hash(pw_hash):
        try:
            return _argon2_hasher.verify(pw_hash, password)
        except (VerifyMismatchError, InvalidHash):
            return False
    # Legacy path: constant-time compare (SEC-015 also tightens this from a
    # plain == which was a theoretical timing side-channel, low severity
    # given PBKDF2's own cost dominates timing, but free to fix while here).
    return hmac.compare_digest(_hash_password(password, salt), pw_hash)


def register_user(email: str, password: str, name: Optional[str] = None, source_portal: str = 'lewis_app') -> Dict[str, Any]:
    """Register a new user in isolated database tables (lewis_users & lewis_sessions)."""
    email_clean = email.strip().lower()
    if not email_clean or "@" not in email_clean or len(email_clean) > 254:
        raise ValueError("Invalid email address format")
    if len(password) < 8:
        raise ValueError("Security requirement: Password must be at least 8 characters long")

    salt = ARGON2_SALT_PLACEHOLDER  # new accounts always start on Argon2id (SEC-015)
    pw_hash = _hash_password_argon2(password)
    user_name = name.strip() if name else email_clean.split('@')[0].capitalize()
    token = secrets.token_hex(32)
    token_hash = _token_digest(token)
    expires_at = _session_expires_at()

    # 1. Native PostgreSQL via DATABASE_URL
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM lewis_users WHERE email = %s", (email_clean,))
            if cursor.fetchone():
                conn.close()
                raise ValueError("Could not complete registration with the details provided.")

            cursor.execute(
                "INSERT INTO lewis_users (email, name, password_hash, salt, source_portal, last_login_at) VALUES (%s, %s, %s, %s, %s, NOW()) RETURNING id",
                (email_clean, user_name, pw_hash, salt, source_portal)
            )
            user_id = cursor.fetchone()['id']
            cursor.execute("INSERT INTO lewis_sessions (token, user_id, expires_at) VALUES (%s, %s, %s)", (token_hash, user_id, expires_at))
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
            res = _request("GET", f"{SUPABASE_URL}/rest/v1/lewis_users?email=eq.{quote(email_clean, safe='')}", headers=get_supabase_headers())
            if res.status_code == 200 and len(res.json()) > 0:
                raise ValueError("Could not complete registration with the details provided.")

            payload = {"email": email_clean, "name": user_name, "password_hash": pw_hash, "salt": salt, "source_portal": source_portal}
            create_res = _request("POST", f"{SUPABASE_URL}/rest/v1/lewis_users", headers=get_supabase_headers(), json=payload)
            if create_res.status_code not in (200, 201):
                raise ValueError(f"Supabase user creation error: {create_res.text}")
            
            created_user = create_res.json()[0]
            user_id = created_user["id"]

            session_payload = {"token": token_hash, "user_id": user_id, "expires_at": _iso(expires_at)}
            _request("POST", f"{SUPABASE_URL}/rest/v1/lewis_sessions", headers=get_supabase_headers(), json=session_payload)

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
            raise ValueError("Could not complete registration with the details provided.")

        cursor.execute(
            "INSERT INTO lewis_users (email, name, password_hash, salt, source_portal, last_login_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)",
            (email_clean, user_name, pw_hash, salt, source_portal)
        )
        user_id = cursor.lastrowid
        cursor.execute("INSERT INTO lewis_sessions (token, user_id, expires_at) VALUES (?, ?, ?)", (token_hash, user_id, _iso(expires_at)))
        conn.commit()
        conn.close()
    except ValueError as ve:
        raise ve
    except Exception as exc:
        logger.warning("DB registration error (%s). Falling back to memory mode.", exc)
        user_id = len(IN_MEMORY_USERS) + 100
        user_entry = {"id": user_id, "email": email_clean, "name": user_name, "password_hash": pw_hash, "salt": salt, "source_portal": source_portal}
        IN_MEMORY_USERS[email_clean] = user_entry
        IN_MEMORY_SESSIONS[token_hash] = {"user": user_entry, "expires_at": expires_at, "revoked_at": None}

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

                if not _verify_password(password, pw_hash, salt):
                    conn.close()
                    raise ValueError("Invalid email or password")

                token = secrets.token_hex(32)
                token_hash = _token_digest(token)
                expires_at = _session_expires_at()
                cursor.execute("UPDATE lewis_users SET last_login_at = NOW() WHERE id = %s", (user_id,))
                if not _is_argon2_hash(pw_hash):
                    # SEC-015: transparent migration — verified fine above
                    # against the legacy PBKDF2 hash, now upgrade it.
                    cursor.execute(
                        "UPDATE lewis_users SET password_hash = %s, salt = %s WHERE id = %s",
                        (_hash_password_argon2(password), ARGON2_SALT_PLACEHOLDER, user_id)
                    )
                cursor.execute("INSERT INTO lewis_sessions (token, user_id, expires_at) VALUES (%s, %s, %s)", (token_hash, user_id, expires_at))
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
            res = _request("GET", f"{SUPABASE_URL}/rest/v1/lewis_users?email=eq.{quote(email_clean, safe='')}", headers=get_supabase_headers())
            if res.status_code == 200 and len(res.json()) > 0:
                user = res.json()[0]
                user_id = user["id"]
                name = user.get("name")
                pw_hash = user["password_hash"]
                salt = user["salt"]
                source_portal = user.get("source_portal", "lewis_app")

                if not _verify_password(password, pw_hash, salt):
                    raise ValueError("Invalid email or password")

                if not _is_argon2_hash(pw_hash):
                    # SEC-015: transparent migration.
                    _request(
                        "PATCH", f"{SUPABASE_URL}/rest/v1/lewis_users?id=eq.{user_id}",
                        headers=get_supabase_headers(),
                        json={"password_hash": _hash_password_argon2(password), "salt": ARGON2_SALT_PLACEHOLDER}
                    )

                token = secrets.token_hex(32)
                token_hash = _token_digest(token)
                expires_at = _session_expires_at()
                session_payload = {"token": token_hash, "user_id": user_id, "expires_at": _iso(expires_at)}
                _request("POST", f"{SUPABASE_URL}/rest/v1/lewis_sessions", headers=get_supabase_headers(), json=session_payload)

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
            if not _verify_password(password, pw_hash, salt):
                conn.close()
                raise ValueError("Invalid email or password")

            cursor.execute("UPDATE lewis_users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?", (user_id,))
            if not _is_argon2_hash(pw_hash):
                # SEC-015: transparent migration.
                cursor.execute(
                    "UPDATE lewis_users SET password_hash = ?, salt = ? WHERE id = ?",
                    (_hash_password_argon2(password), ARGON2_SALT_PLACEHOLDER, user_id)
                )
            token = secrets.token_hex(32)
            token_hash = _token_digest(token)
            expires_at = _session_expires_at()
            cursor.execute("INSERT INTO lewis_sessions (token, user_id, expires_at) VALUES (?, ?, ?)", (token_hash, user_id, _iso(expires_at)))
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
        if _verify_password(password, user["password_hash"], user["salt"]):
            token = secrets.token_hex(32)
            token_hash = _token_digest(token)
            IN_MEMORY_SESSIONS[token_hash] = {"user": user, "expires_at": _session_expires_at(), "revoked_at": None}
            return {
                "status": "success",
                "user": {"id": user["id"], "email": user["email"], "name": user["name"], "source_portal": user["source_portal"]},
                "token": token
            }

    raise ValueError("Invalid email or password")

def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """Verify a live, non-revoked session token."""
    if not token:
        return None

    token_hash = _token_digest(token)
    now = _utcnow()

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
                  AND s.revoked_at IS NULL
                  AND s.expires_at > NOW()
                  AND u.status = 'active'
            """, (token_hash,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return _public_user(row)
        except Exception:
            pass

    # 2. Supabase REST API
    if USE_SUPABASE_REST:
        try:
            session_url = (
                f"{SUPABASE_URL}/rest/v1/lewis_sessions"
                f"?token=eq.{token_hash}"
                f"&revoked_at=is.null"
                f"&expires_at=gt.{quote(_iso(now), safe='')}"
                "&select=user_id,lewis_users(id,email,name,source_portal,role,status)"
            )
            res = _request("GET", session_url, headers=get_supabase_headers())
            if res.status_code == 200 and len(res.json()) > 0:
                session_item = res.json()[0]
                user_obj = session_item.get("lewis_users", {})
                if user_obj and user_obj.get("status", "active") == "active":
                    return _public_user(user_obj)
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
              AND s.revoked_at IS NULL
              AND s.expires_at > CURRENT_TIMESTAMP
              AND u.status = 'active'
        """, (token_hash,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {"id": row[0], "email": row[1], "name": row[2], "source_portal": row[3], "role": row[4]}
    except Exception:
        pass

    # 4. Memory Check
    session = IN_MEMORY_SESSIONS.get(token_hash)
    if session and not session.get("revoked_at") and session.get("expires_at") and session["expires_at"] > now:
        return _public_user(session["user"])

    return None


def revoke_session(token: str) -> bool:
    """Revoke a single session token immediately."""
    if not token:
        return False

    token_hash = _token_digest(token)
    revoked_at = _iso(_utcnow())
    revoked = False

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("UPDATE lewis_sessions SET revoked_at = NOW() WHERE token = %s AND revoked_at IS NULL", (token_hash,))
            revoked = cursor.rowcount > 0
            conn.commit()
            conn.close()
        except Exception:
            pass

    if USE_SUPABASE_REST:
        try:
            res = _request(
                "PATCH",
                f"{SUPABASE_URL}/rest/v1/lewis_sessions?token=eq.{token_hash}&revoked_at=is.null",
                headers=get_supabase_headers(),
                json={"revoked_at": revoked_at},
            )
            revoked = revoked or res.status_code in (200, 204)
        except Exception:
            pass

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE lewis_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE token = ? AND revoked_at IS NULL", (token_hash,))
        revoked = revoked or cursor.rowcount > 0
        conn.commit()
        conn.close()
    except Exception:
        pass

    session = IN_MEMORY_SESSIONS.get(token_hash)
    if session and not session.get("revoked_at"):
        session["revoked_at"] = _utcnow()
        revoked = True

    return revoked


def revoke_user_sessions(user_id: int) -> bool:
    """Revoke every live session for a user."""
    revoked = False

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            cursor = conn.cursor()
            cursor.execute("UPDATE lewis_sessions SET revoked_at = NOW() WHERE user_id = %s AND revoked_at IS NULL", (user_id,))
            revoked = cursor.rowcount > 0
            conn.commit()
            conn.close()
        except Exception:
            pass

    if USE_SUPABASE_REST:
        try:
            res = _request(
                "PATCH",
                f"{SUPABASE_URL}/rest/v1/lewis_sessions?user_id=eq.{user_id}&revoked_at=is.null",
                headers=get_supabase_headers(),
                json={"revoked_at": _iso(_utcnow())},
            )
            revoked = revoked or res.status_code in (200, 204)
        except Exception:
            pass

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE lewis_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE user_id = ? AND revoked_at IS NULL", (user_id,))
        revoked = revoked or cursor.rowcount > 0
        conn.commit()
        conn.close()
    except Exception:
        pass

    for session in IN_MEMORY_SESSIONS.values():
        if session.get("user", {}).get("id") == user_id and not session.get("revoked_at"):
            session["revoked_at"] = _utcnow()
            revoked = True

    return revoked


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
                f"Lewis Insight Report ({report_uuid})",
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
            _request("POST", f"{SUPABASE_URL}/rest/v1/lewis_anonymized_insight_reports", headers=get_supabase_headers(), json=anon_payload)

            vault_payload = {
                "user_id": user_id,
                "report_uuid": report_uuid,
                "report_title": f"Lewis Insight Report ({report_uuid})",
                "wellbeing_band": wellbeing_band,
                "overall_score": overall_score
            }
            _request("POST", f"{SUPABASE_URL}/rest/v1/lewis_user_report_vault", headers=get_supabase_headers(), json=vault_payload)

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
            f"Lewis Insight Report ({report_uuid})",
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
            res = _request(
                "GET",
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
