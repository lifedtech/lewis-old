import os
import sys
import tempfile

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest


@pytest.fixture(autouse=True, scope="session")
def _isolate_database():
    """
    Root cause of a real incident: nothing here mocked or isolated the
    database, so every local `pytest` run wrote real rows (fake orders,
    fake "coupon@example.com"/"test@example.com" reports) straight into
    the live Supabase Postgres pointed to by backend/.env's DATABASE_URL.
    Those rows then looked like real paid-but-undelivered orders to
    mail_queue's reconciliation loop, which retried them forever and
    spammed the server log (see incident notes near build_report_pdf_for_plan).

    auth.py/qa_dataset.py resolve DATABASE_URL/DB_PATH/USE_SUPABASE_REST
    from auth's module globals at call time (fresh `from auth import ...`
    or bare-name lookups inside their functions), not at import time — so
    overwriting those attributes here, once per test session before any
    test body runs, is enough to redirect every DB write the whole test
    suite can make to a throwaway SQLite file, regardless of what's
    configured in .env.
    """
    import auth

    tmp_dir = tempfile.mkdtemp(prefix="lewis_test_db_")
    auth.DATABASE_URL = ""
    auth.USE_POSTGRES = False
    auth.USE_SUPABASE_REST = False
    auth.DB_PATH = os.path.join(tmp_dir, "test.db")
    auth.init_db()  # fresh file has no schema yet — create it (sqlite branch)
