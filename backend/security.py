# security.py — High-security guardrails, rate limiting & data leak protection
import os
import time
import re
import threading
import logging
from collections import deque

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse

logger = logging.getLogger("lewis.security")

MAX_BODY_BYTES = int(os.getenv("LEWIS_MAX_BODY_BYTES", "262144"))  # 256 KB
DEFAULT_LIMIT_PER_MIN = int(os.getenv("LEWIS_RATE_LIMIT", "60"))
HEAVY_LIMIT_PER_MIN = int(os.getenv("LEWIS_RATE_LIMIT_HEAVY", "12"))
AUTH_LIMIT_PER_MIN = int(os.getenv("LEWIS_RATE_LIMIT_AUTH", "5")) # Max 5 auth attempts per min per IP

HEAVY_PATHS = {"/assessment/full", "/pulse/calculate"}
AUTH_PATHS = {"/auth/login", "/auth/register"}

SECURITY_HEADERS = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
    "Pragma": "no-cache",
    "Content-Security-Policy": "default-src 'self'; frame-ancestors 'none'; object-src 'none'",
}

# --- Log Masking Filter to prevent PII / Auth Token data leaks in log files ---
class SensitiveDataFilter(logging.Filter):
    """Redact passwords, tokens, API keys, and PII from application logs."""
    SENSITIVE_PATTERNS = [
        (re.compile(r'("password"|"token"|"bearer"|"authorization"|"secret"|"apikey"|"service_key")\s*[:=]\s*["\'][^"\']+["\']', re.IGNORECASE), r'\1: "***REDACTED***"'),
        (re.compile(r'Bearer\s+[A-Za-z0-9\._\-]+', re.IGNORECASE), r'Bearer ***REDACTED***'),
        (re.compile(r'postgres(ql)?://([^:]+):([^@]+)@', re.IGNORECASE), r'postgresql://\2:***REDACTED_PASSWORD***@')
    ]

    def filter(self, record):
        if isinstance(record.msg, str):
            for pattern, replacement in self.SENSITIVE_PATTERNS:
                record.msg = pattern.sub(replacement, record.msg)
        if record.args:
            new_args = []
            for arg in record.args:
                if isinstance(arg, str):
                    for pattern, replacement in self.SENSITIVE_PATTERNS:
                        arg = pattern.sub(replacement, arg)
                new_args.append(arg)
            record.args = tuple(new_args)
        return True


# Install Log Filter globally
root_logger = logging.getLogger()
root_logger.addFilter(SensitiveDataFilter())


# --- Sliding Window Rate Limiter ---
# In-memory, per-process state. Correct for a single Uvicorn worker (current
# deployment: Procfile runs one process, no --workers flag). If this app
# ever runs multiple workers or multiple horizontally-scaled instances, this
# state is NOT shared between them and the effective limit multiplies by
# instance count. At that point, swap the limiter backing this class's
# allow(key, limit) -> bool with a Redis-backed implementation (e.g. a
# sliding-window counter via Redis sorted sets or INCR+EXPIRE) behind the
# same allow() signature — GuardrailMiddleware only calls self._limiter.allow(),
# so no other code needs to change. Not introducing Redis now: a single
# instance doesn't need it, and adding infrastructure ahead of an actual
# scaling need is its own risk.
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
            if len(self._hits) > 10_000:
                for k in [k for k, b in self._hits.items() if not b or b[-1] < cutoff]:
                    del self._hits[k]
            return True


# SEC-006: an input-side HTML-escaping sanitizer (sanitize_input) used to
# live here but was never actually called anywhere in the app (dead code —
# it looked like active protection but wasn't wired to anything). It was
# removed rather than wired in, because it was also the wrong control for
# this architecture: the frontend is React, which HTML-escapes all text
# content by default at render time (contextual output encoding) — there is
# no `dangerouslySetInnerHTML` anywhere in the frontend (verified). Escaping
# on the way IN, instead, would have double-escaped legitimate punctuation
# on render, and would have corrupted the same free-text answers before
# they reach the de-identified analytics corpus, where HTML entities are
# not meaningful. If a future consumer of this data (an admin dashboard, a
# non-React client) ever renders it as raw HTML, escape it there, at the
# point where the HTML actually gets built — that is the correct trust
# boundary for this data, not the API input layer.


class GuardrailMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self._limiter = SlidingWindowLimiter()

    async def dispatch(self, request, call_next):
        # Bypass rate limits for CORS OPTIONS preflight requests
        if request.method == "OPTIONS":
            response = await call_next(request)
            for header, val in SECURITY_HEADERS.items():
                response.headers[header] = val
            return response
        # 1. Payload size check
        content_length = request.headers.get("content-length")
        if content_length is not None:
            try:
                if int(content_length) > MAX_BODY_BYTES:
                    return JSONResponse(
                        status_code=413, 
                        content={"detail": "Request body too large. Max allowed size is 256KB."},
                        headers=SECURITY_HEADERS
                    )
            except ValueError:
                return JSONResponse(
                    status_code=400, 
                    content={"detail": "Invalid Content-Length."},
                    headers=SECURITY_HEADERS
                )

        # 2. Strict Rate Limiting (Auth vs Heavy vs Normal)
        #
        # request.client.host is only the real end-user IP if uvicorn is
        # launched with --proxy-headers --forwarded-allow-ips=<trusted proxy
        # IPs> (see Procfile / railway.json) AND that env var
        # (LEWIS_TRUSTED_PROXY_IPS) is actually set to the deploying
        # platform's real edge/proxy IP range (SEC-004). Left unset, uvicorn
        # does not trust X-Forwarded-For at all and this falls back to the
        # raw TCP peer, which on Railway/Render is very likely the
        # platform's own proxy for every request — i.e. every user shares
        # one bucket. That is the safe-but-degraded default: it never
        # trusts an attacker-supplied X-Forwarded-For (which is spoofable
        # the moment you tell uvicorn to trust '*'), it just doesn't fix
        # the shared-bucket problem until the operator supplies the real
        # trusted proxy range. Determine that value by checking what
        # request.client.host actually resolves to once deployed (e.g. via
        # the 429 log line below, or a temporary debug log) and set
        # LEWIS_TRUSTED_PROXY_IPS accordingly — never set it to '*' unless
        # the app is verified to be genuinely unreachable except through
        # that proxy.
        client_ip = request.client.host if request.client else "unknown"
        path = request.url.path

        if path in AUTH_PATHS:
            limit = AUTH_LIMIT_PER_MIN
            key = f"{client_ip}:auth"
        elif path in HEAVY_PATHS:
            limit = HEAVY_LIMIT_PER_MIN
            key = f"{client_ip}:heavy"
        else:
            limit = DEFAULT_LIMIT_PER_MIN
            key = f"{client_ip}:def"

        if not self._limiter.allow(key, limit):
            logger.warning("Rate limit exceeded for IP %s on path %s", client_ip, path)
            return JSONResponse(
                status_code=429,
                content={"detail": "Security Throttle: Too many requests. Please wait a minute before retrying."},
                headers={"Retry-After": "60", **SECURITY_HEADERS},
            )

        # 3. Process Request
        response = await call_next(request)

        # 4. Inject High-Security Response Headers
        for header, val in SECURITY_HEADERS.items():
            response.headers[header] = val

        return response
