# LEWIS Backend

FastAPI server — exposes the LEWIS 9D scoring engine and AI narrative generation.

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

API docs available at http://127.0.0.1:8000/docs

## Endpoints

| Method | Path                     | Auth              | Description                        |
|--------|--------------------------|-------------------|-------------------------------------|
| GET    | `/`                      | none              | Health check                       |
| POST   | `/assessment/full`       | optional (Bearer) | Full 9D score + AI narrative; persists a de-identified copy if authenticated |
| POST   | `/pulse/calculate`       | none              | Quick WHO-5 pulse check            |
| POST   | `/auth/register`         | none              | Create account, returns session token |
| POST   | `/auth/login`            | none              | Returns session token              |
| POST   | `/auth/logout`           | Bearer            | Revokes the caller's session server-side |
| GET    | `/auth/me`               | Bearer            | Caller's own profile               |
| GET    | `/auth/assessments`      | Bearer            | Caller's own report vault          |
| GET    | `/analytics/onboarding`  | `X-Internal-Key`  | Aggregate usage metrics for the Onboarding system integration only |

## Required production configuration

See `.env.example` for the full list. In production (`ENVIRONMENT=production`) the app **refuses to start** without: `LEWIS_ANON_SALT`, and a real database backend (`DATABASE_URL`, or `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`) — it will not silently fall back to the local SQLite dev store. `/docs`, `/redoc`, and `/openapi.json` are also disabled in production.

## Security notes

- Sessions are Bearer tokens stored client-side in `localStorage` and revocable via `POST /auth/logout` (server-side revocation; the client always clears its own local state too, even if that request fails). This is an **immediate fix**, not a full hardening — `localStorage` is still readable by any JS running on the page, so if an XSS vulnerability is ever introduced anywhere on the frontend, a token can still be exfiltrated (there just isn't a known XSS sink today). The **architectural** fix — `HttpOnly`/`Secure`/`SameSite` cookies plus CSRF protection — is a larger, deliberate follow-up: it touches every authenticated fetch call in the frontend, `CORSMiddleware`'s `allow_credentials` setting, and requires a CSRF token issuance/verification flow, and was intentionally not bundled into this pass to keep it reviewable and testable on its own.
- Rate limiting is per-IP and in-memory (single process only — see `security.py`'s comments on the Redis migration path if this ever needs to scale to multiple instances/workers). The real client IP behind Railway/Render requires `LEWIS_TRUSTED_PROXY_IPS` to be set correctly — see `.env.example`.

## Files

| File          | Role                                              |
|---------------|---------------------------------------------------|
| `main.py`     | FastAPI app, route handlers, request/response models |
| `scoring.py`  | WHO-5, PSS-10, UCLA-3, SQI, and 9D cascade engine |
| `content.py`  | Habit prescription catalog and routing logic     |
| `llm.py`      | Groq/OpenAI client — generates the AI narrative  |
