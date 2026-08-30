# auth.py — Anonymized Insight Report Engine & Multi-Mode DB (Supabase PostgreSQL / REST + SQLite Fallback)
import sqlite3
import hashlib
import hmac
import secrets
import os
import re
import json
import time
import uuid
import logging
from datetime import datetime, timedelta, timezone
from urllib.parse import quote
from typing import Optional, Dict, Any, List
import requests
from dotenv import load_dotenv
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, InvalidHash
from crypto_vault import encrypt_pii, decrypt_pii, blind_index_email

load_dotenv()
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
IN_MEMORY_ORDERS: Dict[str, Dict[str, Any]] = {}

def get_pg_conn():
    """Create a connection to PostgreSQL via DATABASE_URL."""
    if not has_pg or not DATABASE_URL:
        return None
    url = DATABASE_URL
    if "?pgbouncer=true" in url:
        url = url.replace("?pgbouncer=true", "")
    elif "&pgbouncer=true" in url:
        url = url.replace("&pgbouncer=true", "")
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgres://", 1)
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
    """Ensure isolated lewis_ tables exist in PostgreSQL or local SQLite."""
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cursor:
                    cursor.execute("""
                        CREATE TABLE IF NOT EXISTS lewis_users (
                            id SERIAL PRIMARY KEY,
                            email TEXT UNIQUE NOT NULL,
                            name TEXT,
                            password_hash TEXT NOT NULL,
                            salt TEXT NOT NULL,
                            source_portal TEXT DEFAULT 'lewis_app',
                            role TEXT DEFAULT 'user',
                            status TEXT DEFAULT 'active',
                            last_login_at TIMESTAMP WITH TIME ZONE,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                        CREATE TABLE IF NOT EXISTS lewis_sessions (
                            token TEXT PRIMARY KEY,
                            user_id INTEGER NOT NULL REFERENCES lewis_users (id) ON DELETE CASCADE,
                            ip_address TEXT,
                            user_agent TEXT,
                            expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                            revoked_at TIMESTAMP WITH TIME ZONE,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                        CREATE TABLE IF NOT EXISTS lewis_support_queries (
                            id SERIAL PRIMARY KEY,
                            query_id TEXT UNIQUE NOT NULL,
                            name TEXT NOT NULL,
                            email TEXT NOT NULL,
                            query TEXT NOT NULL,
                            status TEXT DEFAULT 'pending',
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                        CREATE TABLE IF NOT EXISTS lewis_assessment_records (
                            id SERIAL PRIMARY KEY,
                            report_uuid TEXT UNIQUE NOT NULL,
                            user_name_encrypted TEXT,
                            user_email_encrypted TEXT,
                            user_email_hash TEXT,
                            age_category TEXT,
                            gender TEXT,
                            wellbeing_band TEXT,
                            overall_score REAL,
                            report_json TEXT NOT NULL,
                            started_at TIMESTAMP WITH TIME ZONE,
                            completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            duration_seconds INTEGER
                        );
                        CREATE INDEX IF NOT EXISTS idx_assessment_email_hash ON lewis_assessment_records (user_email_hash);

                        CREATE TABLE IF NOT EXISTS lewis_journey_sessions (
                            session_id TEXT PRIMARY KEY,
                            user_name_encrypted TEXT,
                            user_email_encrypted TEXT,
                            user_email_hash TEXT,
                            age_category TEXT,
                            gender TEXT,
                            current_stage INTEGER DEFAULT 0,
                            current_screen TEXT DEFAULT 'landing',
                            progress_percent REAL DEFAULT 0.0,
                            started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            last_active_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            completed_at TIMESTAMP WITH TIME ZONE,
                            duration_seconds INTEGER DEFAULT 0,
                            status TEXT DEFAULT 'in_progress',
                            reached_50_pct BOOLEAN DEFAULT FALSE,
                            reminder_status TEXT DEFAULT 'none',
                            reminder_sent_at TIMESTAMP WITH TIME ZONE
                        );
                        CREATE INDEX IF NOT EXISTS idx_journey_status_active ON lewis_journey_sessions (status, last_active_at);

                        CREATE TABLE IF NOT EXISTS lewis_system_counters (
                            counter_name TEXT PRIMARY KEY,
                            current_val BIGINT NOT NULL
                        );
                        INSERT INTO lewis_system_counters (counter_name, current_val) VALUES ('order_seq', 99) ON CONFLICT DO NOTHING;
                        INSERT INTO lewis_system_counters (counter_name, current_val) VALUES ('report_seq', 199) ON CONFLICT DO NOTHING;

                        CREATE TABLE IF NOT EXISTS lewis_payment_orders (
                            id SERIAL PRIMARY KEY,
                            order_id TEXT UNIQUE NOT NULL,
                            report_uuid TEXT NOT NULL,
                            payment_id TEXT,
                            payment_transaction_id TEXT,
                            razorpay_order_id TEXT,
                            plan_id TEXT NOT NULL,
                            amount INTEGER NOT NULL,
                            currency TEXT DEFAULT 'INR',
                            status TEXT DEFAULT 'created',
                            signature TEXT,
                            user_email TEXT,
                            user_name TEXT,
                            user_phone TEXT,
                            billing_details_json TEXT,
                            confirmation_mail_sent BOOLEAN DEFAULT FALSE,
                            confirmation_mail_sent_at TIMESTAMP WITH TIME ZONE,
                            report_mail_sent BOOLEAN DEFAULT FALSE,
                            report_mail_sent_at TIMESTAMP WITH TIME ZONE,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                            paid_at TIMESTAMP WITH TIME ZONE
                        );
                        CREATE INDEX IF NOT EXISTS idx_payment_order_report ON lewis_payment_orders (report_uuid);
                        CREATE INDEX IF NOT EXISTS idx_payment_order_id ON lewis_payment_orders (order_id);
                        CREATE INDEX IF NOT EXISTS idx_payment_order_payment_id ON lewis_payment_orders (payment_id);

                        -- Ensure columns exist if table was created previously
                        DO $$
                        BEGIN
                            IF NOT EXISTS (
                                SELECT 1 FROM information_schema.columns 
                                WHERE table_name='lewis_payment_orders' AND column_name='user_name'
                            ) THEN
                                ALTER TABLE lewis_payment_orders ADD COLUMN user_name TEXT;
                            END IF;
                            IF NOT EXISTS (
                                SELECT 1 FROM information_schema.columns 
                                WHERE table_name='lewis_payment_orders' AND column_name='user_phone'
                            ) THEN
                                ALTER TABLE lewis_payment_orders ADD COLUMN user_phone TEXT;
                            END IF;
                            IF NOT EXISTS (
                                SELECT 1 FROM information_schema.columns 
                                WHERE table_name='lewis_payment_orders' AND column_name='billing_details_json'
                            ) THEN
                                ALTER TABLE lewis_payment_orders ADD COLUMN billing_details_json TEXT;
                            END IF;
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_payment_orders' AND column_name='payment_transaction_id') THEN
                                ALTER TABLE lewis_payment_orders ADD COLUMN payment_transaction_id TEXT;
                            END IF;
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_payment_orders' AND column_name='razorpay_order_id') THEN
                                ALTER TABLE lewis_payment_orders ADD COLUMN razorpay_order_id TEXT;
                            END IF;
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_payment_orders' AND column_name='confirmation_mail_sent') THEN
                                ALTER TABLE lewis_payment_orders ADD COLUMN confirmation_mail_sent BOOLEAN DEFAULT FALSE;
                                ALTER TABLE lewis_payment_orders ADD COLUMN confirmation_mail_sent_at TIMESTAMP WITH TIME ZONE;
                            END IF;
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_payment_orders' AND column_name='report_mail_sent') THEN
                                ALTER TABLE lewis_payment_orders ADD COLUMN report_mail_sent BOOLEAN DEFAULT FALSE;
                                ALTER TABLE lewis_payment_orders ADD COLUMN report_mail_sent_at TIMESTAMP WITH TIME ZONE;
                            END IF;

                            -- Age & Gender columns for journey sessions & assessment records
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_journey_sessions' AND column_name='age_category') THEN
                                ALTER TABLE lewis_journey_sessions ADD COLUMN age_category TEXT;
                            END IF;
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_journey_sessions' AND column_name='gender') THEN
                                ALTER TABLE lewis_journey_sessions ADD COLUMN gender TEXT;
                            END IF;
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_assessment_records' AND column_name='age_category') THEN
                                ALTER TABLE lewis_assessment_records ADD COLUMN age_category TEXT;
                            END IF;
                            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='lewis_assessment_records' AND column_name='gender') THEN
                                ALTER TABLE lewis_assessment_records ADD COLUMN gender TEXT;
                            END IF;
                        END $$;

                        -- Ensure is_unlocked exists on assessment records
                        DO $$
                        BEGIN
                            IF NOT EXISTS (
                                SELECT 1 FROM information_schema.columns 
                                WHERE table_name='lewis_assessment_records' AND column_name='is_unlocked'
                            ) THEN
                                ALTER TABLE lewis_assessment_records ADD COLUMN is_unlocked BOOLEAN DEFAULT FALSE;
                                ALTER TABLE lewis_assessment_records ADD COLUMN unlocked_at TIMESTAMP WITH TIME ZONE;
                                ALTER TABLE lewis_assessment_records ADD COLUMN paid_plan TEXT;
                            END IF;
                        END $$;

                        CREATE TABLE IF NOT EXISTS lewis_report_reviews (
                            id SERIAL PRIMARY KEY,
                            review_id TEXT UNIQUE NOT NULL,
                            report_id TEXT,
                            order_id TEXT,
                            user_email TEXT NOT NULL,
                            user_name TEXT,
                            rating INTEGER NOT NULL,
                            depth_resonance TEXT,
                            clarity_actionability TEXT,
                            relief_impact TEXT,
                            feedback_comments TEXT,
                            metadata_json TEXT,
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                        );
                        CREATE INDEX IF NOT EXISTS idx_report_review_email ON lewis_report_reviews (user_email);
                        CREATE INDEX IF NOT EXISTS idx_report_review_id ON lewis_report_reviews (review_id);

                        -- All access to these tables goes through this backend's own
                        -- privileged connection (DATABASE_URL) or the Supabase service
                        -- key, both of which bypass RLS. Enabling it with no anon/
                        -- authenticated policies closes public PostgREST access without
                        -- touching how this app talks to Postgres.
                        ALTER TABLE lewis_users ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE lewis_sessions ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE lewis_support_queries ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE lewis_assessment_records ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE lewis_journey_sessions ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE lewis_payment_orders ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE lewis_system_counters ENABLE ROW LEVEL SECURITY;
                        ALTER TABLE lewis_report_reviews ENABLE ROW LEVEL SECURITY;
                    """)
                    conn.commit()
                conn.close()
                logger.info("Supabase PostgreSQL tables initialized & ready.")
                return
        except Exception as e:
            logger.warning("PostgreSQL table init encountered error (%s), using fallback.", e)

    if USE_SUPABASE_REST:
        return

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
            CREATE TABLE IF NOT EXISTS lewis_support_queries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                query TEXT NOT NULL,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_assessment_records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                report_uuid TEXT UNIQUE NOT NULL,
                user_name_encrypted TEXT,
                user_email_encrypted TEXT,
                user_email_hash TEXT,
                age_category TEXT,
                gender TEXT,
                wellbeing_band TEXT,
                overall_score REAL,
                report_json TEXT NOT NULL,
                started_at TIMESTAMP,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                duration_seconds INTEGER,
                is_unlocked BOOLEAN DEFAULT 0,
                unlocked_at TIMESTAMP,
                paid_plan TEXT
            )
        """)

        for col_stmt in (
            "ALTER TABLE lewis_assessment_records ADD COLUMN is_unlocked BOOLEAN DEFAULT 0",
            "ALTER TABLE lewis_assessment_records ADD COLUMN unlocked_at TIMESTAMP",
            "ALTER TABLE lewis_assessment_records ADD COLUMN paid_plan TEXT",
            "ALTER TABLE lewis_assessment_records ADD COLUMN age_category TEXT",
            "ALTER TABLE lewis_assessment_records ADD COLUMN gender TEXT",
            "ALTER TABLE lewis_journey_sessions ADD COLUMN age_category TEXT",
            "ALTER TABLE lewis_journey_sessions ADD COLUMN gender TEXT",
        ):
            try:
                cursor.execute(col_stmt)
            except sqlite3.OperationalError:
                pass

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_journey_sessions (
                session_id TEXT PRIMARY KEY,
                user_name_encrypted TEXT,
                user_email_encrypted TEXT,
                user_email_hash TEXT,
                age_category TEXT,
                gender TEXT,
                current_stage INTEGER DEFAULT 0,
                current_screen TEXT DEFAULT 'landing',
                progress_percent REAL DEFAULT 0.0,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                duration_seconds INTEGER DEFAULT 0,
                status TEXT DEFAULT 'in_progress',
                reached_50_pct BOOLEAN DEFAULT 0,
                reminder_status TEXT DEFAULT 'none',
                reminder_sent_at TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_system_counters (
                counter_name TEXT PRIMARY KEY,
                current_val INTEGER NOT NULL
            )
        """)
        cursor.execute("INSERT OR IGNORE INTO lewis_system_counters (counter_name, current_val) VALUES ('order_seq', 99)")
        cursor.execute("INSERT OR IGNORE INTO lewis_system_counters (counter_name, current_val) VALUES ('report_seq', 199)")

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_payment_orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                order_id TEXT UNIQUE NOT NULL,
                report_uuid TEXT NOT NULL,
                payment_id TEXT,
                payment_transaction_id TEXT,
                razorpay_order_id TEXT,
                plan_id TEXT NOT NULL,
                amount INTEGER NOT NULL,
                currency TEXT DEFAULT 'INR',
                status TEXT DEFAULT 'created',
                signature TEXT,
                user_email TEXT,
                user_name TEXT,
                user_phone TEXT,
                billing_details_json TEXT,
                confirmation_mail_sent INTEGER DEFAULT 0,
                confirmation_mail_sent_at TIMESTAMP,
                report_mail_sent INTEGER DEFAULT 0,
                report_mail_sent_at TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                paid_at TIMESTAMP
            )
        """)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_report_reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                review_id TEXT UNIQUE NOT NULL,
                report_id TEXT,
                order_id TEXT,
                user_email TEXT NOT NULL,
                user_name TEXT,
                rating INTEGER NOT NULL,
                depth_resonance TEXT,
                clarity_actionability TEXT,
                relief_impact TEXT,
                feedback_comments TEXT,
                metadata_json TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        for col_stmt in (
            "ALTER TABLE lewis_payment_orders ADD COLUMN user_name TEXT",
            "ALTER TABLE lewis_payment_orders ADD COLUMN user_phone TEXT",
            "ALTER TABLE lewis_payment_orders ADD COLUMN billing_details_json TEXT",
            "ALTER TABLE lewis_payment_orders ADD COLUMN payment_transaction_id TEXT",
            "ALTER TABLE lewis_payment_orders ADD COLUMN razorpay_order_id TEXT",
            "ALTER TABLE lewis_payment_orders ADD COLUMN confirmation_mail_sent INTEGER DEFAULT 0",
            "ALTER TABLE lewis_payment_orders ADD COLUMN confirmation_mail_sent_at TIMESTAMP",
            "ALTER TABLE lewis_payment_orders ADD COLUMN report_mail_sent INTEGER DEFAULT 0",
            "ALTER TABLE lewis_payment_orders ADD COLUMN report_mail_sent_at TIMESTAMP",
        ):
            try:
                cursor.execute(col_stmt)
            except sqlite3.OperationalError:
                pass

        conn.commit()
        conn.close()
    except Exception as e:
        logger.warning("Local SQLite DB initialization bypassed (%s).", e)

init_db()

_in_mem_counters: Dict[str, int] = {"order_seq": 99, "report_seq": 199}

def _get_next_counter_val(counter_name: str, initial: int = 0) -> int:
    """Atomically increment and return the next counter integer."""
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO lewis_system_counters (counter_name, current_val)
                        VALUES (%s, %s + 1)
                        ON CONFLICT (counter_name)
                        DO UPDATE SET current_val = lewis_system_counters.current_val + 1
                        RETURNING current_val;
                    """, (counter_name, initial))
                    res = cur.fetchone()
                    conn.commit()
                conn.close()
                if res and res[0] is not None:
                    return int(res[0])
        except Exception as e:
            logger.warning("Postgres counter increment error (%s), using local fallback", e)

    # SQLite fallback
    try:
        conn = sqlite3.connect(DB_PATH, timeout=10)
        cur = conn.cursor()
        cur.execute("CREATE TABLE IF NOT EXISTS lewis_system_counters (counter_name TEXT PRIMARY KEY, current_val INTEGER NOT NULL)")
        cur.execute("INSERT OR IGNORE INTO lewis_system_counters (counter_name, current_val) VALUES (?, ?)", (counter_name, initial))
        cur.execute("UPDATE lewis_system_counters SET current_val = current_val + 1 WHERE counter_name = ?", (counter_name,))
        cur.execute("SELECT current_val FROM lewis_system_counters WHERE counter_name = ?", (counter_name,))
        row = cur.fetchone()
        conn.commit()
        conn.close()
        if row and row[0] is not None:
            return int(row[0])
    except Exception as e:
        logger.warning("SQLite counter increment error (%s), using memory", e)

    # In-memory fallback
    _in_mem_counters[counter_name] = _in_mem_counters.get(counter_name, initial) + 1
    return _in_mem_counters[counter_name]


def get_next_order_id() -> str:
    """Generate sequential Order ID starting from LS20260100."""
    val = _get_next_counter_val('order_seq', initial=99)
    return f"LS2026{str(val).zfill(4)}"


def get_next_report_id() -> str:
    """Generate sequential Report ID starting from LSR20260200."""
    val = _get_next_counter_val('report_seq', initial=199)
    return f"LSR2026{str(val).zfill(4)}"


def generate_anonymous_user_code(user_id: int) -> str:
    """Generate a non-reversible anonymous subject ID (e.g. ANON-SUBJ-8F92A1D0)."""
    digest = hmac.new(ANON_SALT.encode('utf-8'), str(user_id).encode('utf-8'), hashlib.sha256).hexdigest()
    return f"ANON-SUBJ-{digest[:8].upper()}"

def generate_report_uuid() -> str:
    """Generate a sequential unique identifier for a report starting from LSR20260200."""
    return get_next_report_id()

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


def save_support_query(name: str, email: str, query: str, screen: Optional[str] = None) -> dict:
    """Save user support query to PostgreSQL / Supabase and local SQLite with fallback."""
    query_id = f"TICK-{str(uuid.uuid4())[:8].upper()}"
    screen_val = screen or "general"

    # Forward to Lifed Operations System Webhook if configured
    lifed_ops_webhook = os.getenv("LIFED_OPERATIONS_WEBHOOK_URL")
    if lifed_ops_webhook:
        try:
            _request("POST", lifed_ops_webhook, json={
                "source": "lewis_system",
                "query_id": query_id,
                "name": name,
                "email": email,
                "query": query,
                "screen": screen_val,
                "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            })
            logger.info("Forwarded support query %s to Lifed Operations System", query_id)
        except Exception as exc:
            logger.warning("Failed to forward query to Lifed Operations webhook: %s", exc)

    # 1. PostgreSQL Native Driver / Supabase
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        CREATE TABLE IF NOT EXISTS lewis_support_queries (
                            id SERIAL PRIMARY KEY,
                            query_id TEXT UNIQUE NOT NULL,
                            name TEXT NOT NULL,
                            email TEXT NOT NULL,
                            query TEXT NOT NULL,
                            screen TEXT,
                            status TEXT DEFAULT 'pending',
                            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                        );
                    """)
                    # Check column screen
                    cur.execute("""
                        DO $$
                        BEGIN
                            IF NOT EXISTS (
                                SELECT 1 FROM information_schema.columns 
                                WHERE table_name='lewis_support_queries' AND column_name='screen'
                            ) THEN
                                ALTER TABLE lewis_support_queries ADD COLUMN screen TEXT;
                            END IF;
                        END $$;
                    """)
                    cur.execute("""
                        INSERT INTO lewis_support_queries (query_id, name, email, query, screen)
                        VALUES (%s, %s, %s, %s, %s)
                    """, (query_id, name, email, query, screen_val))
                    conn.commit()
                conn.close()
                logger.info("Saved support query %s for %s to PostgreSQL", query_id, email)
                return {"query_id": query_id, "status": "saved"}
        except Exception as exc:
            logger.error("PostgreSQL support query save error (%s).", exc)

    # 2. Local SQLite Fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS lewis_support_queries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                query_id TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                query TEXT NOT NULL,
                screen TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cursor.execute("""
            INSERT INTO lewis_support_queries (query_id, name, email, query, screen)
            VALUES (?, ?, ?, ?, ?)
        """, (query_id, name, email, query, screen_val))
        conn.commit()
        conn.close()
        logger.info("Saved support query %s for %s to SQLite", query_id, email)
        return {"query_id": query_id, "status": "saved"}
    except Exception as exc:
        logger.warning("Local SQLite support query save error (%s).", exc)
        return {"query_id": query_id, "status": "fallback"}


def save_report_review(
    user_email: str,
    rating: int,
    depth_resonance: Optional[str] = None,
    clarity_actionability: Optional[str] = None,
    relief_impact: Optional[str] = None,
    feedback_comments: Optional[str] = None,
    user_name: Optional[str] = None,
    report_id: Optional[str] = None,
    order_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> dict:
    """Save user insight report review to PostgreSQL / Supabase and local SQLite with fallback."""
    review_id = f"REV-{str(uuid.uuid4())[:8].upper()}"
    metadata_json = json.dumps(metadata) if metadata else None

    # 1. PostgreSQL Native Driver / Supabase
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO lewis_report_reviews (
                            review_id, report_id, order_id, user_email, user_name,
                            rating, depth_resonance, clarity_actionability, relief_impact,
                            feedback_comments, metadata_json
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (
                        review_id, report_id, order_id, user_email, user_name,
                        rating, depth_resonance, clarity_actionability, relief_impact,
                        feedback_comments, metadata_json
                    ))
                    conn.commit()
                conn.close()
                logger.info("Saved report review %s for %s to PostgreSQL", review_id, user_email)
                return {"review_id": review_id, "status": "saved"}
        except Exception as exc:
            logger.error("PostgreSQL report review save error (%s).", exc)

    # 2. Local SQLite Fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO lewis_report_reviews (
                review_id, report_id, order_id, user_email, user_name,
                rating, depth_resonance, clarity_actionability, relief_impact,
                feedback_comments, metadata_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            review_id, report_id, order_id, user_email, user_name,
            rating, depth_resonance, clarity_actionability, relief_impact,
            feedback_comments, metadata_json
        ))
        conn.commit()
        conn.close()
        logger.info("Saved report review %s for %s to SQLite", review_id, user_email)
        return {"review_id": review_id, "status": "saved"}
    except Exception as exc:
        logger.warning("Local SQLite report review save error (%s).", exc)
        return {"review_id": review_id, "status": "fallback"}



# --- Encrypted Assessment Records & Journey Dropout Telemetry -----------------

def save_encrypted_assessment_record(
    user_name: Optional[str],
    user_email: Optional[str],
    report_data: Dict[str, Any],
    started_at_iso: Optional[str] = None,
    duration_seconds: Optional[int] = None,
    age_category: Optional[str] = None,
    gender: Optional[str] = None
) -> str:
    """
    Store the user's name, email, age group, gender, and full generated report in the database.
    User name and email ID are encrypted at rest using AES-Fernet.
    """
    report_uuid = generate_report_uuid()
    name_enc = encrypt_pii(user_name) if user_name else None
    email_enc = encrypt_pii(user_email) if user_email else None
    email_hash = blind_index_email(user_email) if user_email else None

    scores = report_data.get("dimensions") or report_data.get("scores") or {}
    wellbeing_band = scores.get("who5", {}).get("wellbeing_band") or "Moderate"
    overall_score = scores.get("who5", {}).get("scaled_score", 0.0)
    report_json_str = json.dumps(report_data, default=str)

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO lewis_assessment_records
                        (report_uuid, user_name_encrypted, user_email_encrypted, user_email_hash, age_category, gender, wellbeing_band, overall_score, report_json, started_at, duration_seconds)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    """, (report_uuid, name_enc, email_enc, email_hash, age_category, gender, wellbeing_band, overall_score, report_json_str, started_at_iso, duration_seconds))
                    conn.commit()
                conn.close()
                logger.info("Saved encrypted assessment record %s to PostgreSQL", report_uuid)
                return report_uuid
        except Exception as e:
            logger.error("PostgreSQL error saving encrypted assessment record: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO lewis_assessment_records
            (report_uuid, user_name_encrypted, user_email_encrypted, user_email_hash, age_category, gender, wellbeing_band, overall_score, report_json, started_at, duration_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (report_uuid, name_enc, email_enc, email_hash, age_category, gender, wellbeing_band, overall_score, report_json_str, started_at_iso, duration_seconds))
        conn.commit()
        conn.close()
        logger.info("Saved encrypted assessment record %s to SQLite", report_uuid)
    except Exception as e:
        logger.warning("SQLite error saving encrypted assessment record: %s", e)

    return report_uuid


def record_journey_ping(
    session_id: str,
    user_name: Optional[str] = None,
    user_email: Optional[str] = None,
    age_category: Optional[str] = None,
    gender: Optional[str] = None,
    current_stage: int = 0,
    current_screen: str = 'landing',
    progress_percent: float = 0.0,
    duration_seconds: int = 0
) -> Dict[str, Any]:
    """
    Heartbeat and telemetry recording for tracking journey progression, name, age, and dropouts.
    Encrypts user name and email if present.
    """
    if not session_id:
        session_id = str(uuid.uuid4())

    name_enc = encrypt_pii(user_name) if user_name else None
    email_enc = encrypt_pii(user_email) if user_email else None
    email_hash = blind_index_email(user_email) if user_email else None
    reached_50 = bool(progress_percent >= 50.0)

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO lewis_journey_sessions
                        (session_id, user_name_encrypted, user_email_encrypted, user_email_hash, age_category, gender, current_stage, current_screen, progress_percent, duration_seconds, reached_50_pct, last_active_at, status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), 'in_progress')
                        ON CONFLICT (session_id) DO UPDATE SET
                            user_name_encrypted = COALESCE(EXCLUDED.user_name_encrypted, lewis_journey_sessions.user_name_encrypted),
                            user_email_encrypted = COALESCE(EXCLUDED.user_email_encrypted, lewis_journey_sessions.user_email_encrypted),
                            user_email_hash = COALESCE(EXCLUDED.user_email_hash, lewis_journey_sessions.user_email_hash),
                            age_category = COALESCE(EXCLUDED.age_category, lewis_journey_sessions.age_category),
                            gender = COALESCE(EXCLUDED.gender, lewis_journey_sessions.gender),
                            current_stage = EXCLUDED.current_stage,
                            current_screen = EXCLUDED.current_screen,
                            progress_percent = GREATEST(lewis_journey_sessions.progress_percent, EXCLUDED.progress_percent),
                            duration_seconds = EXCLUDED.duration_seconds,
                            reached_50_pct = (lewis_journey_sessions.reached_50_pct OR EXCLUDED.reached_50_pct),
                            last_active_at = NOW()
                        WHERE lewis_journey_sessions.status != 'completed';
                    """, (session_id, name_enc, email_enc, email_hash, age_category, gender, current_stage, current_screen, progress_percent, duration_seconds, reached_50))
                    conn.commit()
                conn.close()
                return {"status": "success", "session_id": session_id}
        except Exception as e:
            logger.error("Postgres error recording journey ping: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS lewis_journey_sessions (
                session_id TEXT PRIMARY KEY,
                user_name_encrypted TEXT,
                user_email_encrypted TEXT,
                user_email_hash TEXT,
                age_category TEXT,
                gender TEXT,
                current_stage INTEGER DEFAULT 0,
                current_screen TEXT DEFAULT 'landing',
                progress_percent REAL DEFAULT 0.0,
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP,
                duration_seconds INTEGER DEFAULT 0,
                status TEXT DEFAULT 'in_progress',
                reached_50_pct BOOLEAN DEFAULT 0,
                reminder_status TEXT DEFAULT 'none',
                reminder_sent_at TIMESTAMP
            )
        """)
        cur.execute("""
            INSERT INTO lewis_journey_sessions
            (session_id, user_name_encrypted, user_email_encrypted, user_email_hash, age_category, gender, current_stage, current_screen, progress_percent, duration_seconds, reached_50_pct, last_active_at, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, 'in_progress')
            ON CONFLICT (session_id) DO UPDATE SET
                user_name_encrypted = COALESCE(excluded.user_name_encrypted, lewis_journey_sessions.user_name_encrypted),
                user_email_encrypted = COALESCE(excluded.user_email_encrypted, lewis_journey_sessions.user_email_encrypted),
                user_email_hash = COALESCE(excluded.user_email_hash, lewis_journey_sessions.user_email_hash),
                age_category = COALESCE(excluded.age_category, lewis_journey_sessions.age_category),
                gender = COALESCE(excluded.gender, lewis_journey_sessions.gender),
                current_stage = excluded.current_stage,
                current_screen = excluded.current_screen,
                progress_percent = MAX(lewis_journey_sessions.progress_percent, excluded.progress_percent),
                duration_seconds = excluded.duration_seconds,
                reached_50_pct = (lewis_journey_sessions.reached_50_pct OR excluded.reached_50_pct),
                last_active_at = CURRENT_TIMESTAMP
            WHERE lewis_journey_sessions.status != 'completed';
        """, (session_id, name_enc, email_enc, email_hash, age_category, gender, current_stage, current_screen, progress_percent, duration_seconds, reached_50))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.warning("SQLite error recording journey ping: %s", e)

    return {"status": "success", "session_id": session_id}


def mark_journey_completed(session_id: str, duration_seconds: Optional[int] = None) -> bool:
    """Mark a journey as fully completed."""
    if not session_id:
        return False
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        UPDATE lewis_journey_sessions
                        SET status = 'completed',
                            progress_percent = 100.0,
                            completed_at = NOW(),
                            duration_seconds = COALESCE(%s, duration_seconds)
                        WHERE session_id = %s
                    """, (duration_seconds, session_id))
                    conn.commit()
                conn.close()
                return True
        except Exception as e:
            logger.error("Postgres error marking journey completed: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            UPDATE lewis_journey_sessions
            SET status = 'completed',
                progress_percent = 100.0,
                completed_at = CURRENT_TIMESTAMP,
                duration_seconds = COALESCE(?, duration_seconds)
            WHERE session_id = ?
        """, (duration_seconds, session_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.warning("SQLite error marking journey completed: %s", e)
        return False


def get_journey_analytics_overview() -> Dict[str, Any]:
    """Return overview metrics: completion time, total completed, midway dropouts (<50% and >=50%), and 10-min reminder pending count."""
    stats = {
        "total_started": 0,
        "total_completed": 0,
        "avg_completion_time_seconds": 0,
        "avg_completion_time_formatted": "0m 0s",
        "total_midway_dropouts": 0,
        "dropouts_before_50_pct": 0,
        "dropouts_after_50_pct": 0,
        "pending_10min_reminders_count": 0,
    }

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT
                            COUNT(*) AS total_started,
                            COUNT(*) FILTER (WHERE status = 'completed') AS total_completed,
                            COALESCE(AVG(duration_seconds) FILTER (WHERE status = 'completed' AND duration_seconds > 0), 0) AS avg_duration,
                            COUNT(*) FILTER (WHERE status != 'completed' AND last_active_at < NOW() - INTERVAL '10 minutes') AS total_abandoned,
                            COUNT(*) FILTER (WHERE status != 'completed' AND reached_50_pct = FALSE AND last_active_at < NOW() - INTERVAL '10 minutes') AS dropouts_before_50,
                            COUNT(*) FILTER (WHERE status != 'completed' AND reached_50_pct = TRUE AND last_active_at < NOW() - INTERVAL '10 minutes') AS dropouts_after_50,
                            COUNT(*) FILTER (WHERE status != 'completed' AND reached_50_pct = TRUE AND last_active_at < NOW() - INTERVAL '10 minutes' AND reminder_status != 'sent') AS pending_reminders
                        FROM lewis_journey_sessions;
                    """)
                    row = cur.fetchone()
                    if row:
                        avg_sec = int(row['avg_duration'])
                        stats["total_started"] = row['total_started']
                        stats["total_completed"] = row['total_completed']
                        stats["avg_completion_time_seconds"] = avg_sec
                        stats["avg_completion_time_formatted"] = f"{avg_sec // 60}m {avg_sec % 60}s"
                        stats["total_midway_dropouts"] = row['total_abandoned']
                        stats["dropouts_before_50_pct"] = row['dropouts_before_50']
                        stats["dropouts_after_50_pct"] = row['dropouts_after_50']
                        stats["pending_10min_reminders_count"] = row['pending_reminders']
                conn.close()
                return stats
        except Exception as e:
            logger.error("Postgres error fetching journey analytics: %s", e)

    # SQLite fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            SELECT
                COUNT(*),
                SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END),
                AVG(CASE WHEN status = 'completed' AND duration_seconds > 0 THEN duration_seconds ELSE NULL END),
                SUM(CASE WHEN status != 'completed' AND last_active_at < datetime('now', '-10 minutes') THEN 1 ELSE 0 END),
                SUM(CASE WHEN status != 'completed' AND reached_50_pct = 0 AND last_active_at < datetime('now', '-10 minutes') THEN 1 ELSE 0 END),
                SUM(CASE WHEN status != 'completed' AND reached_50_pct = 1 AND last_active_at < datetime('now', '-10 minutes') THEN 1 ELSE 0 END),
                SUM(CASE WHEN status != 'completed' AND reached_50_pct = 1 AND last_active_at < datetime('now', '-10 minutes') AND reminder_status != 'sent' THEN 1 ELSE 0 END)
            FROM lewis_journey_sessions;
        """)
        row = cur.fetchone()
        if row:
            stats["total_started"] = row[0] or 0
            stats["total_completed"] = row[1] or 0
            avg_sec = int(row[2] or 0)
            stats["avg_completion_time_seconds"] = avg_sec
            stats["avg_completion_time_formatted"] = f"{avg_sec // 60}m {avg_sec % 60}s"
            stats["total_midway_dropouts"] = row[3] or 0
            stats["dropouts_before_50_pct"] = row[4] or 0
            stats["dropouts_after_50_pct"] = row[5] or 0
            stats["pending_10min_reminders_count"] = row[6] or 0
        conn.close()
    except Exception as e:
        logger.warning("SQLite error fetching journey analytics: %s", e)

    return stats


def get_abandoned_users_list(inactive_minutes: int = 10) -> List[Dict[str, Any]]:
    """Return the list of users who left midway (inactive for > inactive_minutes), with decrypted name & email."""
    abandoned_list = []
    
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute(f"""
                        SELECT
                            session_id,
                            user_name_encrypted,
                            user_email_encrypted,
                            age_category,
                            gender,
                            current_stage,
                            current_screen,
                            progress_percent,
                            duration_seconds,
                            started_at,
                            last_active_at,
                            reached_50_pct,
                            reminder_status,
                            reminder_sent_at,
                            EXTRACT(EPOCH FROM (NOW() - last_active_at)) / 60 AS inactive_mins
                        FROM lewis_journey_sessions
                        WHERE status != 'completed'
                          AND last_active_at < NOW() - INTERVAL '{int(inactive_minutes)} minutes'
                        ORDER BY last_active_at DESC;
                    """)
                    rows = cur.fetchall()
                    for r in rows:
                        name = decrypt_pii(r['user_name_encrypted']) if r['user_name_encrypted'] else None
                        email = decrypt_pii(r['user_email_encrypted']) if r['user_email_encrypted'] else None
                        inact = round(float(r['inactive_mins']), 1)
                        is_50 = bool(r['reached_50_pct'])
                        eligible = bool(is_50 and inact >= 10.0 and r['reminder_status'] != 'sent' and email)
                        
                        abandoned_list.append({
                            "session_id": r['session_id'],
                            "name": name or "Guest / Anonymous",
                            "email": email or "Not captured (exited before 50%)",
                            "age_category": r.get('age_category') or None,
                            "gender": r.get('gender') or None,
                            "current_stage": r['current_stage'],
                            "last_screen": r['current_screen'],
                            "progress_percent": float(r['progress_percent']),
                            "time_spent_seconds": r['duration_seconds'],
                            "started_at": str(r['started_at']),
                            "last_active_at": str(r['last_active_at']),
                            "inactive_minutes": inact,
                            "reached_50_pct": is_50,
                            "reminder_status": r['reminder_status'] or 'none',
                            "reminder_sent_at": str(r['reminder_sent_at']) if r['reminder_sent_at'] else None,
                            "eligible_for_10min_reminder": eligible,
                            "restart_url": "/"
                        })
                conn.close()
                return abandoned_list
        except Exception as e:
            logger.error("Postgres error fetching abandoned users: %s", e)

    # SQLite fallback
    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(f"""
            SELECT
                session_id,
                user_name_encrypted,
                user_email_encrypted,
                age_category,
                gender,
                current_stage,
                current_screen,
                progress_percent,
                duration_seconds,
                started_at,
                last_active_at,
                reached_50_pct,
                reminder_status,
                reminder_sent_at,
                (strftime('%s', 'now') - strftime('%s', last_active_at)) / 60.0 AS inactive_mins
            FROM lewis_journey_sessions
            WHERE status != 'completed'
              AND last_active_at < datetime('now', '-{int(inactive_minutes)} minutes')
            ORDER BY last_active_at DESC;
        """)
        rows = cur.fetchall()
        for r in rows:
            name = decrypt_pii(r[1]) if r[1] else None
            email = decrypt_pii(r[2]) if r[2] else None
            inact = round(float(r[14] or 0), 1)
            is_50 = bool(r[11])
            eligible = bool(is_50 and inact >= 10.0 and r[12] != 'sent' and email)
            
            abandoned_list.append({
                "session_id": r[0],
                "name": name or "Guest / Anonymous",
                "email": email or "Not captured (exited before 50%)",
                "age_category": r[3] or None,
                "gender": r[4] or None,
                "current_stage": r[5],
                "last_screen": r[6],
                "progress_percent": float(r[7] or 0),
                "time_spent_seconds": r[8] or 0,
                "started_at": str(r[9]),
                "last_active_at": str(r[10]),
                "inactive_minutes": inact,
                "reached_50_pct": is_50,
                "reminder_status": r[12] or 'none',
                "reminder_sent_at": str(r[13]) if r[13] else None,
                "eligible_for_10min_reminder": eligible,
                "restart_url": "/"
            })
        conn.close()
    except Exception as e:
        logger.warning("SQLite error fetching abandoned users: %s", e)

    return abandoned_list


def mark_reminders_sent(session_ids: List[str]) -> int:
    """Mark reminder status as 'sent' for given session IDs."""
    if not session_ids:
        return 0
    updated_count = 0
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        UPDATE lewis_journey_sessions
                        SET reminder_status = 'sent',
                            reminder_sent_at = NOW()
                        WHERE session_id = ANY(%s)
                    """, (session_ids,))
                    updated_count = cur.rowcount
                    conn.commit()
                conn.close()
                return updated_count
        except Exception as e:
            logger.error("Postgres error marking reminders sent: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        placeholders = ",".join(["?"] * len(session_ids))
        cur.execute(f"""
            UPDATE lewis_journey_sessions
            SET reminder_status = 'sent',
                reminder_sent_at = CURRENT_TIMESTAMP
            WHERE session_id IN ({placeholders})
        """, session_ids)
        updated_count = cur.rowcount
        conn.commit()
        conn.close()
    except Exception as e:
        logger.warning("SQLite error marking reminders sent: %s", e)

    return updated_count


# --- Payment Orders & Report Entitlement Management ---------------------------

def save_payment_order(
    order_id: str,
    report_uuid: str,
    plan_id: str,
    amount: int,
    currency: str = "INR",
    user_email: Optional[str] = None,
    user_name: Optional[str] = None,
    user_phone: Optional[str] = None,
    billing_details: Optional[Dict[str, Any]] = None,
    razorpay_order_id: Optional[str] = None
) -> Dict[str, Any]:
    """
    Save or initialize a pending payment order record with full customer billing details and Razorpay Order ID.
    """
    billing_json = json.dumps(billing_details) if billing_details else None

    IN_MEMORY_ORDERS[order_id] = {
        "order_id": order_id,
        "razorpay_order_id": razorpay_order_id,
        "report_uuid": report_uuid,
        "plan_id": plan_id,
        "amount": amount,
        "currency": currency,
        "status": "created",
        "user_email": user_email,
        "user_name": user_name,
        "user_phone": user_phone,
        "billing_details_json": billing_json,
        "payment_id": None,
        "signature": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "paid_at": None,
    }

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO lewis_payment_orders
                        (order_id, razorpay_order_id, report_uuid, plan_id, amount, currency, status, user_email, user_name, user_phone, billing_details_json, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s, %s, 'created', %s, %s, %s, %s, NOW(), NOW())
                        ON CONFLICT (order_id) DO UPDATE SET
                            razorpay_order_id = COALESCE(EXCLUDED.razorpay_order_id, lewis_payment_orders.razorpay_order_id),
                            report_uuid = EXCLUDED.report_uuid,
                            plan_id = EXCLUDED.plan_id,
                            amount = EXCLUDED.amount,
                            currency = EXCLUDED.currency,
                            user_email = COALESCE(EXCLUDED.user_email, lewis_payment_orders.user_email),
                            user_name = COALESCE(EXCLUDED.user_name, lewis_payment_orders.user_name),
                            user_phone = COALESCE(EXCLUDED.user_phone, lewis_payment_orders.user_phone),
                            billing_details_json = COALESCE(EXCLUDED.billing_details_json, lewis_payment_orders.billing_details_json),
                            updated_at = NOW();
                    """, (order_id, razorpay_order_id, report_uuid, plan_id, amount, currency, user_email, user_name, user_phone, billing_json))
                    conn.commit()
                conn.close()
                return IN_MEMORY_ORDERS[order_id]
        except Exception as e:
            logger.error("PostgreSQL error saving payment order: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO lewis_payment_orders
            (order_id, razorpay_order_id, report_uuid, plan_id, amount, currency, status, user_email, user_name, user_phone, billing_details_json, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, 'created', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ON CONFLICT (order_id) DO UPDATE SET
                razorpay_order_id = COALESCE(excluded.razorpay_order_id, lewis_payment_orders.razorpay_order_id),
                report_uuid = excluded.report_uuid,
                plan_id = excluded.plan_id,
                amount = excluded.amount,
                currency = excluded.currency,
                user_email = COALESCE(excluded.user_email, lewis_payment_orders.user_email),
                user_name = COALESCE(excluded.user_name, lewis_payment_orders.user_name),
                user_phone = COALESCE(excluded.user_phone, lewis_payment_orders.user_phone),
                billing_details_json = COALESCE(excluded.billing_details_json, lewis_payment_orders.billing_details_json),
                updated_at = CURRENT_TIMESTAMP
        """, (order_id, razorpay_order_id, report_uuid, plan_id, amount, currency, user_email, user_name, user_phone, billing_json))
        conn.commit()
        conn.close()
    except Exception as e:
        logger.warning("SQLite error saving payment order: %s", e)

    return IN_MEMORY_ORDERS[order_id]


def get_payment_order(order_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve payment order by Order ID or Razorpay Order ID."""
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM lewis_payment_orders WHERE order_id = %s OR razorpay_order_id = %s LIMIT 1", (order_id, order_id))
                    row = cur.fetchone()
                conn.close()
                if row:
                    return dict(row)
        except Exception as e:
            logger.error("PostgreSQL error fetching payment order: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM lewis_payment_orders WHERE order_id = ? OR razorpay_order_id = ? LIMIT 1", (order_id, order_id))
        row = cur.fetchone()
        conn.close()
        if row:
            return dict(row)
    except Exception as e:
        logger.warning("SQLite error fetching payment order: %s", e)

    return IN_MEMORY_ORDERS.get(order_id)


def record_successful_payment(
    order_id: str,
    payment_id: str,
    signature: Optional[str] = None,
    report_uuid: Optional[str] = None,
    user_email: Optional[str] = None,
    user_name: Optional[str] = None,
    user_phone: Optional[str] = None
) -> Dict[str, Any]:
    """
    Idempotently record a successful payment, update order status to 'paid',
    save transaction ID (payment_id), and unlock the corresponding assessment report.
    """
    existing = get_payment_order(order_id)
    target_report_uuid = report_uuid or (existing.get("report_uuid") if existing else None)
    plan_id = existing.get("plan_id") if existing else "personal_report"

    # Update in-memory cache
    if order_id in IN_MEMORY_ORDERS:
        IN_MEMORY_ORDERS[order_id].update({
            "payment_id": payment_id,
            "payment_transaction_id": payment_id,
            "signature": signature,
            "status": "paid",
            "user_email": user_email or IN_MEMORY_ORDERS[order_id].get("user_email"),
            "user_name": user_name or IN_MEMORY_ORDERS[order_id].get("user_name"),
            "user_phone": user_phone or IN_MEMORY_ORDERS[order_id].get("user_phone"),
            "paid_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        })

    # If already paid in DB, return existing record idempotently
    if existing and existing.get("status") == "paid":
        logger.info("Order %s was already marked paid (idempotent return)", order_id)
        return existing

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        UPDATE lewis_payment_orders
                        SET payment_id = %s,
                            payment_transaction_id = %s,
                            signature = %s,
                            status = 'paid',
                            user_email = COALESCE(%s, user_email),
                            user_name = COALESCE(%s, user_name),
                            user_phone = COALESCE(%s, user_phone),
                            paid_at = NOW(),
                            updated_at = NOW()
                        WHERE order_id = %s OR razorpay_order_id = %s;
                    """, (payment_id, payment_id, signature, user_email, user_name, user_phone, order_id, order_id))

                    if target_report_uuid:
                        cur.execute("""
                            UPDATE lewis_assessment_records
                            SET is_unlocked = TRUE,
                                unlocked_at = NOW(),
                                paid_plan = %s
                            WHERE report_uuid = %s;
                        """, (plan_id, target_report_uuid))
                    conn.commit()
                conn.close()
                logger.info("Recorded payment success in PostgreSQL for order %s (txn: %s, report: %s)", order_id, payment_id, target_report_uuid)
                return get_payment_order(order_id) or {"order_id": order_id, "payment_id": payment_id, "status": "paid"}
        except Exception as e:
            logger.error("PostgreSQL error recording payment success: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("""
            UPDATE lewis_payment_orders
            SET payment_id = ?,
                payment_transaction_id = ?,
                signature = ?,
                status = 'paid',
                user_email = COALESCE(?, user_email),
                user_name = COALESCE(?, user_name),
                user_phone = COALESCE(?, user_phone),
                paid_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ? OR razorpay_order_id = ?
        """, (payment_id, payment_id, signature, user_email, user_name, user_phone, order_id, order_id))

        if target_report_uuid:
            cur.execute("""
                UPDATE lewis_assessment_records
                SET is_unlocked = 1,
                    unlocked_at = CURRENT_TIMESTAMP,
                    paid_plan = ?
                WHERE report_uuid = ?
            """, (plan_id, target_report_uuid))
        conn.commit()
        conn.close()
        logger.info("Recorded payment success in SQLite for order %s (txn: %s, report: %s)", order_id, payment_id, target_report_uuid)
    except Exception as e:
        logger.warning("SQLite error recording payment success: %s", e)

    return get_payment_order(order_id) or {"order_id": order_id, "payment_id": payment_id, "status": "paid", "report_uuid": target_report_uuid}


def update_order_email_status(order_id: str, email_type: str = "confirmation", status: bool = True) -> bool:
    """
    Record in database whether confirmation email or report delivery email has been sent.
    """
    col_flag = "confirmation_mail_sent" if email_type == "confirmation" else "report_mail_sent"
    col_time = "confirmation_mail_sent_at" if email_type == "confirmation" else "report_mail_sent_at"

    if order_id in IN_MEMORY_ORDERS:
        IN_MEMORY_ORDERS[order_id][col_flag] = status
        IN_MEMORY_ORDERS[order_id][col_time] = datetime.now(timezone.utc).isoformat()

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute(f"""
                        UPDATE lewis_payment_orders
                        SET {col_flag} = %s,
                            {col_time} = NOW(),
                            updated_at = NOW()
                        WHERE order_id = %s OR razorpay_order_id = %s;
                    """, (status, order_id, order_id))
                    conn.commit()
                conn.close()
                return True
        except Exception as e:
            logger.error("PostgreSQL error updating order email status: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute(f"""
            UPDATE lewis_payment_orders
            SET {col_flag} = ?,
                {col_time} = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ? OR razorpay_order_id = ?
        """, (1 if status else 0, order_id, order_id))
        conn.commit()
        conn.close()
        return True
    except Exception as e:
        logger.warning("SQLite error updating order email status: %s", e)

    return False


def get_pending_report_deliveries(min_age_seconds: int = 300) -> list:
    """
    Retrieve paid orders that were paid at least min_age_seconds ago whose report email has not yet been sent.
    Provides guaranteed recovery even across server restarts or worker crashes.
    """
    pending = []
    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT order_id, report_uuid, user_email, user_name, paid_at
                        FROM lewis_payment_orders
                        WHERE status = 'paid'
                          AND user_email IS NOT NULL
                          AND (report_mail_sent IS FALSE OR report_mail_sent IS NULL)
                          AND paid_at <= NOW() - (%s || ' seconds')::interval
                        ORDER BY paid_at ASC
                        LIMIT 20;
                    """, (str(min_age_seconds),))
                    rows = cur.fetchall()
                    for r in rows:
                        pending.append(dict(r))
                conn.close()
                # Only short-circuit on an actual match. Every other lookup in
                # this file (get_payment_order, etc.) falls through to SQLite
                # when Postgres legitimately finds nothing — this one returned
                # unconditionally, so if an order's data actually lives in the
                # SQLite fallback (Postgres unreachable/unconfigured at write
                # time), this reconciliation safety net silently never found
                # it, for any order, ever.
                if pending:
                    return pending
        except Exception as e:
            logger.warning("PostgreSQL pending report deliveries query error: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("""
            SELECT order_id, report_uuid, user_email, user_name, paid_at
            FROM lewis_payment_orders
            WHERE status = 'paid'
              AND user_email IS NOT NULL
              AND (report_mail_sent = 0 OR report_mail_sent IS NULL)
              AND datetime(paid_at) <= datetime('now', '-' || ? || ' seconds')
            ORDER BY paid_at ASC
            LIMIT 20;
        """, (min_age_seconds,))
        for r in cur.fetchall():
            pending.append(dict(r))
        conn.close()
    except Exception as e:
        logger.warning("SQLite pending report deliveries query error: %s", e)

    # In-memory fallback tier (same pattern as get_payment_order/is_report_unlocked):
    # if a write to Postgres/SQLite silently failed, IN_MEMORY_ORDERS is still
    # the one place that order definitely exists. Without this, an order that
    # only ever landed in memory could never be found by reconciliation,
    # while get_payment_order (which does check IN_MEMORY_ORDERS) would find
    # it fine — exactly the "resend works, pending-list never shows it" gap.
    seen = {p["order_id"] for p in pending}
    cutoff = datetime.now(timezone.utc) - timedelta(seconds=min_age_seconds)
    for order_id, order in IN_MEMORY_ORDERS.items():
        if order_id in seen:
            continue
        if order.get("status") != "paid" or not order.get("user_email"):
            continue
        if order.get("report_mail_sent"):
            continue
        paid_at = order.get("paid_at")
        if not paid_at:
            continue
        try:
            paid_at_dt = datetime.fromisoformat(paid_at)
        except ValueError:
            continue
        if paid_at_dt <= cutoff:
            pending.append({
                "order_id": order_id,
                "report_uuid": order.get("report_uuid"),
                "user_email": order.get("user_email"),
                "user_name": order.get("user_name"),
                "paid_at": paid_at,
            })

    return pending


def is_report_unlocked(report_uuid: str) -> bool:
    """Check if a report is unlocked via paid entitlement."""
    if not report_uuid:
        return False

    # Check in-memory orders
    for order in IN_MEMORY_ORDERS.values():
        if order.get("report_uuid") == report_uuid and order.get("status") == "paid":
            return True

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("""
                        SELECT is_unlocked FROM lewis_assessment_records 
                        WHERE report_uuid = %s LIMIT 1;
                    """, (report_uuid,))
                    row = cur.fetchone()
                    if row and row.get("is_unlocked"):
                        conn.close()
                        return True

                    # Fallback check against payment orders table
                    cur.execute("""
                        SELECT id FROM lewis_payment_orders
                        WHERE report_uuid = %s AND status = 'paid' LIMIT 1;
                    """, (report_uuid,))
                    order_row = cur.fetchone()
                    if order_row:
                        conn.close()
                        return True
                conn.close()
        except Exception as e:
            logger.error("PostgreSQL error checking report unlock status: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        cur.execute("SELECT is_unlocked FROM lewis_assessment_records WHERE report_uuid = ? LIMIT 1", (report_uuid,))
        row = cur.fetchone()
        if row and (row[0] == 1 or row[0] is True):
            conn.close()
            return True

        cur.execute("SELECT id FROM lewis_payment_orders WHERE report_uuid = ? AND status = 'paid' LIMIT 1", (report_uuid,))
        order_row = cur.fetchone()
        conn.close()
        if order_row:
            return True
    except Exception as e:
        logger.warning("SQLite error checking report unlock status: %s", e)

    return False


def get_report_by_uuid(report_uuid: str) -> Optional[Dict[str, Any]]:
    """Retrieve full assessment record by report UUID."""
    if not report_uuid:
        return None

    if has_pg and DATABASE_URL:
        try:
            conn = get_pg_conn()
            if conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM lewis_assessment_records WHERE report_uuid = %s LIMIT 1", (report_uuid,))
                    row = cur.fetchone()
                conn.close()
                if row:
                    res = dict(row)
                    if isinstance(res.get("report_json"), str):
                        res["report_json"] = json.loads(res["report_json"])
                    return res
        except Exception as e:
            logger.error("PostgreSQL error fetching report by UUID: %s", e)

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cur = conn.cursor()
        cur.execute("SELECT * FROM lewis_assessment_records WHERE report_uuid = ? LIMIT 1", (report_uuid,))
        row = cur.fetchone()
        conn.close()
        if row:
            res = dict(row)
            if isinstance(res.get("report_json"), str):
                res["report_json"] = json.loads(res["report_json"])
            return res
    except Exception as e:
        logger.warning("SQLite error fetching report by UUID: %s", e)

    return None


