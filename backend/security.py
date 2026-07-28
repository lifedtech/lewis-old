# security.py — High-security guardrails, rate limiting, sanitization & data leak protection
import os
import time
import re
import html
import threading
import logging
from collections import deque
from typing import Any

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


def sanitize_input(value: Any) -> Any:
    """Sanitize strings against XSS and Script Injection."""
    if isinstance(value, str):
        # Escape HTML tags and script injections
        clean = html.escape(value.strip())
        # Remove dangerous JS protocols
        clean = re.sub(r'javascript:', '', clean, flags=re.IGNORECASE)
        return clean
    elif isinstance(value, dict):
        return {k: sanitize_input(v) for k, v in value.items()}
    elif isinstance(value, list):
        return [sanitize_input(v) for v in value]
    return value


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
