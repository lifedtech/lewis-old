# security.py — request guardrails for the LEWIS API.
#
# One middleware provides three protections, in order:
#   1. Body-size cap — oversized payloads are rejected before parsing.
#   2. Per-IP sliding-window rate limiting — stricter on the endpoints
#      that trigger scoring/LLM work.
#   3. Security response headers — including Cache-Control: no-store,
#      because every response carries personal wellbeing data that must
#      never land in a shared cache.
#
# The limiter is in-memory and per-process: sufficient for a single
# uvicorn worker. If LEWIS moves to multiple workers/instances, replace
# it with a shared store (e.g. Redis) — the interface is one method.

import os
import time
import threading
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

MAX_BODY_BYTES = int(os.getenv("LEWIS_MAX_BODY_BYTES", "262144"))  # 256 KB
DEFAULT_LIMIT_PER_MIN = int(os.getenv("LEWIS_RATE_LIMIT", "60"))
HEAVY_LIMIT_PER_MIN = int(os.getenv("LEWIS_RATE_LIMIT_HEAVY", "6"))
HEAVY_PATHS = {"/assessment/full", "/pulse/calculate"}

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "no-referrer",
    "Cache-Control": "no-store",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
}


class SlidingWindowLimiter:
    def __init__(self, window_seconds: float = 60.0):
        self._window = window_seconds
        self._hits: dict[str, deque] = {}
        self._lock = threading.Lock()

    def allow(self, key: str, limit: int) -> bool:
        now = time.monotonic()
        cutoff = now - self._window
        with self._lock:
            bucket = self._hits.setdefault(key, deque())
            while bucket and bucket[0] < cutoff:
                bucket.popleft()
            if len(bucket) >= limit:
                return False
            bucket.append(now)
            # Opportunistic cleanup so idle clients don't accumulate forever.
            if len(self._hits) > 10_000:
                for k in [k for k, b in self._hits.items() if not b or b[-1] < cutoff]:
                    del self._hits[k]
            return True


class GuardrailMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self._limiter = SlidingWindowLimiter()

    async def dispatch(self, request, call_next):
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > MAX_BODY_BYTES:
                    return JSONResponse(status_code=413, content={"detail": "Request body too large."})
            except ValueError:
                return JSONResponse(status_code=400, content={"detail": "Invalid Content-Length."})

        client_ip = request.client.host if request.client else "unknown"
        heavy = request.url.path in HEAVY_PATHS
        limit = HEAVY_LIMIT_PER_MIN if heavy else DEFAULT_LIMIT_PER_MIN
        if not self._limiter.allow(f"{client_ip}:{'h' if heavy else 'd'}", limit):
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please wait a moment and try again."},
                headers={"Retry-After": "60", **SECURITY_HEADERS},
            )

        response = await call_next(request)
        for header, value in SECURITY_HEADERS.items():
            response.headers[header] = value
        return response
