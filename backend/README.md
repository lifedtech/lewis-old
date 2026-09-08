# LEWIS Backend API & Worker Engine

FastAPI server providing psychometric scoring, deterministic & AI narrative generation, PDF rendering, asynchronous mail queue dispatch, payment gateway handling, live journey telemetry, and Lewis OS error triage.

## Setup & Local Run

```bash
cd backend
python -m venv ..\.venv
..\.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

API interactive documentation is available at `http://127.0.0.1:8000/docs` in development mode.

## Key Endpoints

| Category | Method | Path | Auth | Description |
|---|---|---|---|---|
| **Health** | `GET` | `/` | None | Health check & engine status |
| **Assessments** | `POST` | `/assessment/full` | Optional Bearer | Full 9D score, W-matrix leverage & 25-page report |
| | `POST` | `/assessment/streamlined` | Optional Bearer | Fast-track assessment scoring & RRO report |
| | `POST` | `/pulse/calculate` | None | Rapid WHO-5 pulse calculation |
| **Auth & Vault** | `POST` | `/auth/register` | None | Creates user account & session token |
| | `POST` | `/auth/login` | None | Authenticates user & returns token |
| | `POST` | `/auth/logout` | Bearer | Server-side session revocation |
| | `GET` | `/auth/me` | Bearer | Caller's user profile |
| | `GET` | `/auth/assessments` | Bearer | User's encrypted report vault |
| **Payments** | `GET` | `/payment/config` | None | Public Razorpay / Stripe gateway settings |
| | `POST` | `/payment/create-order` | None | Creates gateway checkout order |
| | `POST` | `/payment/verify` | None | Verifies signature & unlocks report |
| | `POST` | `/payment/webhook` | Webhook Sig | Gateway event webhook processor |
| **Telemetry** | `POST` | `/journey/ping` | None | Live journey heartbeat & stage progress |
| | `POST` | `/journey/complete` | None | Records completed assessment duration |
| **PDF & Mail** | `GET` | `/report/pdf/:uuid` | Unlocked/Key | Serves compiled PDF report |
| | `POST` | `/report/email-pdf` | None | Enqueues background email delivery of report |
| **Observability**| `POST` | `/errors/log` | None | Ingests frontend & client error reports |
| | `GET` | `/errors` | `X-Admin-Key` | Queries error log entries with filters |
| | `GET` | `/errors/stats` | `X-Admin-Key` | Aggregated error counts, levels & trends |

## Key Modules

| Module | Description |
|---|---|
| `main.py` | FastAPI application, middleware routing, and exception handlers |
| `scoring.py` | 9D scoring engine and W-matrix leverage resolution |
| `scoring_streamlined.py` | Streamlined assessment state and RRO generator |
| `insight_report.py` | Deterministic 25-page report JSON generator (v4.0 rulebook) |
| `pdf_generator.py` | Headless Chromium / print-CSS PDF generation service |
| `mail_queue.py` / `mailer.py` | Async background worker and email dispatch system |
| `payment.py` | Multi-gateway payment handling (Razorpay & Stripe) |
| `error_tracker.py` | Error logging, DB persistence, and triage management |
| `crypto_vault.py` | AES-256-GCM encrypted storage for sensitive records |
| `auth.py` | Session management, Supabase/SQLite dual database layer |
