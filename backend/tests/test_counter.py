# test_counter.py — regression guard for the order/report ID counter bug:
# get_pg_conn() always uses RealDictCursor, so a Postgres row is dict-like
# (supports .get("col")) and does NOT support tuple-style row[0] indexing.
# _get_next_counter_val() used row[0], which raised KeyError on every real
# Postgres call, silently caught, always falling back to the in-memory
# counter — meaning IDs could collide with real historical rows and
# overwrite them via ON CONFLICT DO UPDATE.
import os
import sys

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import auth


class FakeRealDictRow(dict):
    """Mimics psycopg2.extras.RealDictRow: dict-like, no integer indexing."""
    def __getitem__(self, key):
        if isinstance(key, int):
            raise KeyError(key)
        return super().__getitem__(key)


class FakeCursor:
    def __init__(self, row):
        self._row = row
    def execute(self, *a, **k):
        pass
    def fetchone(self):
        return self._row
    def __enter__(self):
        return self
    def __exit__(self, *a):
        return False


class FakeConn:
    def __init__(self, row):
        self._row = row
    def cursor(self):
        return FakeCursor(self._row)
    def commit(self):
        pass
    def close(self):
        pass


def test_counter_reads_realdictrow_not_tuple_index(monkeypatch):
    monkeypatch.setattr(auth, "has_pg", True)
    monkeypatch.setattr(auth, "DATABASE_URL", "postgres://fake")
    monkeypatch.setattr(auth, "get_pg_conn", lambda: FakeConn(FakeRealDictRow({"current_val": 42})))

    val = auth._get_next_counter_val("some_counter", initial=0)

    assert val == 42  # not the SQLite/in-memory fallback value
