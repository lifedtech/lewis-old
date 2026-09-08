# LEWIS — Lifed Everyday Wellbeing Intelligence System (v1.5.0)

LEWIS is a non-clinical wellbeing reflection and intelligence platform built with a **FastAPI** backend, **React + Vite** frontend, **Supabase Cloud PostgreSQL** (with automatic local SQLite fallback), zero-PII anonymization, and dual-track assessment architectures (Classic 53-Screen & Streamlined Flow). It produces deterministic 25-page Insight Reports rendered directly in-browser as interactive A4 pages and downloadable as pixel-perfect PDFs, backed by automated background email delivery, multi-currency payments, live journey telemetry, and Lewis OS error triage.

---

## 🚀 System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│ 1. FRONTEND (React 18 + Vite + Zustand + Framer Motion)                 │
│    • Layouts: Adaptive Desktop (`DesktopApp.jsx`) & Mobile (`MobileApp.jsx`) │
│    • Themes: Persisted Dark & Light Modes                               │
│    • Hosted on: Cloudflare Pages (https://lewiswellbeing.com)            │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTPS REST & Telemetry Ping
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ 2. BACKEND API & WORKER ENGINE (FastAPI / Python 3.13)                  │
│    • Scoring: 9D W-Matrix Leverage + Streamlined Act Engines             │
│    • Reports: 25-Page v4.0 Full Report + Streamlined Report Generators   │
│    • Voicing: Road A Deterministic Narrative + Road B LLM (NVIDIA NIM)  │
│    • PDF Engine: Playwright / Chromium Headless PDF Renderer            │
│    • Mail Queue: Asynchronous Background Worker with Exponential Retry │
│    • Observability: Error Tracker, Lewis OS Triage, & Live Telemetry    │
│    • Hosted on: Railway / Render                                        │
└───────────────────┬─────────────────────────────────┬───────────────────┘
                    │                                 │
                    ▼                                 ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────┐
│ 3. CLOUD DATABASE (Supabase Postgre) │  │ 4. EXTERNAL INTEGRATIONS      │
│    • Tables: `lewis_users`, sessions │  │    • Payments: Razorpay/Stripe│
│    • Vault: Encrypted Records & PDF  │  │    • Emails: Resend / SMTP    │
│    • Corpus: 10k Zero-PII Dataset    │  │    • AI: NVIDIA NIM Nemotron  │
│    • Analytics & Error Triage Tables │  │    • Lewis OS: QA & Telemetry │
└──────────────────────────────────────┘  └───────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Dual Assessment Architecture (Streamlined & Classic Flows)
- **Streamlined Assessment Flow**: A modernized, fast-paced assessment journey (`frontend/src/screens/streamlined/`) featuring multi-act transitions, interactive breathing guides, dynamic body mapping, affect grid selection, and live state computation.
- **Classic 53-Screen Psychometric Journey**: Full-depth psychometric evaluation utilizing consolidated `InstrumentScreen.jsx` for GSE, PROMIS, CFPB-5, Diener, INS, SWLS, WHO-5, and PSS-10.
- **Adaptive Screen Brain**: Responsive architecture providing dedicated, touch-optimized experiences on mobile (`MobileApp.jsx`) and spacious ergonomics on desktop (`DesktopApp.jsx`).

### 2. Comprehensive Insight Report Generation
- **25-Page Interactive A4 Report (v4.0 Rulebook)**: Six core parts generated deterministically from the enriched object: *Orientation → Your Picture → How It Connects → A Closer Look → Your Plan → After This*.
- **Streamlined Report System**: High-impact, responsive summary report (`StreamlinedInsightReport.jsx`, `report_streamlined_html.py`) for quick executive reviews.
- **Pixel-Perfect PDF Generation**: Automated PDF compilation via headless Chromium (`pdf_generator.py`) and browser print CSS (`@page { size: 210mm 297mm; }`).
- **Strict Self-Check Gate (`report_gate.py`)**: Automated verification ensuring zero clinical diagnostic jargon, no digit leaks, correct band vocabularies, and mandated structural blocks before delivery.

### 3. Deterministic-First Scoring & W-Matrix Leverage Engine
- Evaluates 9 life dimensions + PSS-10 calm overlay, normalized 0–100 into compassionate band categories (**Running on empty / Under pressure / Steady / Strong**).
- W-matrix influence network computes leverage points where small interventions produce outsized systemic stability.
- Validated against the 10,000-profile synthetic corpus (`backend/data/lewis_10000_scores.csv`): 10,000 / 10,000 rows reproduced.

### 4. Asynchronous Background Mail Queue & Delivery
- Resilient background task worker (`mail_queue.py`, `mailer.py`) managing email dispatch with exponential backoff and retry mechanisms.
- Automated sending of transactional order receipts, assessment completion notifications, abandoned-journey recovery reminders, and PDF report delivery.
- Supports both **Resend API** and standard **SMTP** configurations.

### 5. Multi-Currency Billing & Payment Gateway Integration
- Dynamic geo-currency detection (`geoCurrency.js`) supporting INR, USD, EUR, and GBP.
- Seamless dual-gateway integration: **Razorpay** (primary for INR/India) and **Stripe** (global cards/international).
- Secure webhook signature verification, dynamic discount coupon validation, and instant post-payment report unlocking.

### 6. Observability, Live Telemetry & Lewis OS Triage
- **Error Tracking System (`error_tracker.py`)**: Catches backend exceptions, intercepts frontend runtime errors, logs client context/IP/stack traces, and provides triage APIs (`/errors`, `/errors/stats`, `/errors/bulk-status`).
- **Journey Telemetry Heartbeat**: Tracks active assessment progress (`/journey/ping`, `/journey/complete`) and drop-off rates for funnel optimization.
- **Lewis OS & QA Integration**: Ingestion endpoints for system sync, aggregate onboarding views, and curated QA test datasets (`qa_dataset.py`).

### 7. Enterprise Security & Zero-PII Vault
- Recursive PII scrubbing engine (`deidentify_data`) stripping names, emails, and sensitive identifiers prior to data storage.
- Non-reversible cryptonym codes (`ANON-SUBJ-8F92A1D0`) via HMAC-SHA256.
- AES-256-GCM encrypted database vault (`crypto_vault.py`) for secure recovery of user assessment records.
- Rate limiting (auth, scoring, payments), automatic log redaction of secrets/passwords (`SensitiveDataFilter`), and defensive HTTP security headers.

---

## 🗂️ Repository Layout

```
lifed-LEWIS/
├── backend/
│   ├── main.py                     ← Core FastAPI application, router & middleware
│   ├── auth.py                     ← User auth, session tokens, vault, Supabase REST/SQL
│   ├── scoring.py                  ← 9D psychometric scoring & W-matrix leverage engine
│   ├── scoring_streamlined.py      ← Streamlined assessment scoring & state calculator
│   ├── enrich.py                   ← Builds v4.0 enriched object from scoring outputs
│   ├── insight_report.py           ← 25-page deterministic report JSON generator
│   ├── report_gate.py              ← §17 self-check gate validator
│   ├── report_full_html.py         ← Standalone full report HTML builder
│   ├── report_streamlined_html.py  ← Streamlined report HTML generation template
│   ├── pdf_generator.py            ← Headless Chromium PDF compilation service
│   ├── mail_queue.py               ← Asynchronous mail worker & retry queue
│   ├── mailer.py                   ← Email templates & delivery (Resend / SMTP)
│   ├── payment.py                  ← Razorpay / Stripe checkout, webhooks & coupons
│   ├── error_tracker.py            ← Error ingestion, DB logging & triage APIs
│   ├── crypto_vault.py             ← Encrypted payload storage & retrieval
│   ├── corpus.py                   ← State-only k-NN against 10k synthetic corpus
│   ├── pattern.py                  ← Layer-4 pattern engine (LWI, portrait, texture)
│   ├── narrative.py                ← Road A deterministic narrative templates
│   ├── llm.py                      ← Road B AI re-voicing via NVIDIA NIM (fail-closed)
│   ├── validator.py                ← Fail-closed language validator
│   ├── safety.py                   ← Safety lattice & gentle mode overrides
│   ├── security.py                 ← Rate limiting, log masking & security headers
│   ├── content.py                  ← Habit catalog & intervention routing
│   ├── qa_dataset.py               ← QA test suites & synthetic validation datasets
│   ├── db/
│   │   ├── supabase_schema.sql     ← PostgreSQL schema, indexes & views
│   │   └── migration_*.sql         ← Database migration scripts
│   ├── data/
│   │   └── lewis_10000_scores.csv  ← 10k synthetic seed corpus (canonical)
│   ├── tests/                      ← Comprehensive pytest suite
│   ├── nixpacks.toml / Procfile    ← Cloud deployment configurations
│   └── requirements.txt            ← Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 ← Root component with responsive router & telemetry
│   │   ├── main.jsx                ← Frontend entrypoint & error listeners
│   │   ├── desktop/                ← Desktop application shell (`DesktopApp.jsx`)
│   │   ├── mobile/                 ← Mobile application shell (`MobileApp.jsx`)
│   │   ├── screens/
│   │   │   ├── LandingScreen.jsx   ← Marketing homepage (v2 spec)
│   │   │   ├── BillingScreen.jsx   ← Multi-currency checkout & promo screen
│   │   │   ├── PaymentConfirmScreen.jsx ← Receipt confirmation & report trigger
│   │   │   ├── InstrumentScreen.jsx← Consolidated psychometric scale screen
│   │   │   └── streamlined/        ← Streamlined journey screens (Acts 1–4)
│   │   ├── report/
│   │   │   ├── InsightReport.jsx   ← 25-page A4 report renderer
│   │   │   ├── StreamlinedInsightReport.jsx ← Streamlined interactive report
│   │   │   ├── report.css          ← Comprehensive report styling system
│   │   │   └── icons.jsx           ← SVG line icon components
│   │   ├── components/             ← Shared UI (SupportWidget, ReviewModal, etc.)
│   │   ├── store/useLewisStore.js  ← Zustand state store (auth, theme, answers, reset)
│   │   ├── lib/
│   │   │   ├── api.js              ← API client & network request handling
│   │   │   ├── geoCurrency.js      ← Geo-IP location & currency formatting
│   │   │   └── payload.js          ← Assessment payload transformers
│   │   └── index.css               ← App design tokens, theme vars & utilities
│   ├── public/                     ← Static assets, images & sample PDFs
│   └── package.json                ← Frontend scripts & dependencies
│
├── doc/                            ← Product specs, rulebooks & design assets
│   ├── LEWIS_Insight_Report_Generation_Rulebook_v4.0_FINAL.md
│   └── insight-report-redesign/
│
├── NEW_UPDATES.md                  ← Versioned changelog
├── learning_doc.md                 ← Developer onboarding & engineering guide
├── lewis doc.md                    ← In-depth architectural documentation
├── memory.md                       ← Project context & state memory
└── README.md                       ← This file
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Python 3.11+** (Python 3.13 recommended)
- **Node.js 18+** & npm
- *(Optional)* Chromium / Playwright for local headless PDF rendering

### 1. Backend Setup
```bash
cd backend

# Create & activate virtual environment (Windows):
python -m venv ..\.venv
..\.venv\Scripts\activate

# Install dependencies:
pip install -r requirements.txt

# Run FastAPI with background mail queue worker:
uvicorn main:app --reload --port 8000
```
API documentation available at `http://127.0.0.1:8000/docs` in development mode.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Running Automated Tests
```bash
cd backend
python -m pytest tests -v
```

---

## 🔑 Environment Configuration

### Backend (`backend/.env`)
```env
# Server & Environment
ENVIRONMENT=development             # 'production' or 'development'
PORT=8000
FRONTEND_URL=http://localhost:5173,https://lewiswellbeing.com
LEWIS_ADMIN_KEY=your_secret_admin_key

# Supabase Cloud PostgreSQL
DATABASE_URL=postgresql://postgres.XXXX:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://XXXX.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Security & Encryption
LEWIS_ANON_SALT=LEWIS_SECURE_ANON_SALT_2026_V1
VAULT_MASTER_KEY=your_32_byte_base64_encryption_key

# Payment Gateways (Razorpay & Stripe)
RAZORPAY_KEY_ID=rzp_test_XXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

STRIPE_SECRET_KEY=sk_test_XXXX
STRIPE_PUBLISHABLE_KEY=pk_test_XXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXX

# Email Service (Resend or SMTP)
RESEND_API_KEY=re_XXXX
MAIL_FROM=support@lewiswellbeing.com
# SMTP_HOST=smtp.resend.com
# SMTP_PORT=587
# SMTP_USER=resend
# SMTP_PASS=re_XXXX

# AI Narrative (NVIDIA NIM)
NVIDIA_API_KEY=your_nvidia_nim_key
LEWIS_ENABLE_LLM=false
LEWIS_LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
LEWIS_LLM_REPORT_MAX_TOKENS=8000
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=rzp_test_XXXX
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_XXXX
```

---

## 📡 Key API Endpoints

| Category | Method | Path | Auth / Gate | Description |
|---|---|---|---|---|
| **Health & Meta** | `GET` | `/` | None | API health status & version |
| **Assessments** | `POST` | `/assessment/full` | Optional Bearer | Full 9D scoring, leverage, and 25-page report |
| | `POST` | `/assessment/streamlined` | Optional Bearer | Streamlined assessment scoring & RRO generation |
| | `POST` | `/pulse/calculate` | None | Rapid WHO-5 pulse check |
| **Auth & Vault** | `POST` | `/auth/register` | None | User registration with encrypted credentials |
| | `POST` | `/auth/login` | None | User authentication & token issuance |
| | `POST` | `/auth/logout` | Bearer | Server-side session revocation |
| | `GET` | `/auth/me` | Bearer | Current user session & profile |
| | `GET` | `/auth/assessments` | Bearer | User's encrypted report vault |
| **Telemetry** | `POST` | `/journey/ping` | None | Real-time journey progress heartbeat |
| | `POST` | `/journey/complete` | None | Marks journey completion & duration |
| | `GET` | `/analytics/journey` | `X-Admin-Key` | Comprehensive journey conversion analytics |
| **Billing & Pay**| `GET` | `/payment/config` | None | Public payment gateway configurations |
| | `POST` | `/payment/create-order` | None | Initializes Razorpay / Stripe checkout order |
| | `POST` | `/payment/verify` | None | Verifies payment signatures & unlocks report |
| | `POST` | `/payment/webhook` | Webhook Sig | Asynchronous payment event webhook handler |
| | `POST` | `/payment/validate-coupon` | None | Validates discount promo codes |
| **PDF & Reports**| `GET` | `/report/pdf/:uuid` | Unlocked/Key | Downloads generated PDF report |
| | `POST` | `/report/email-pdf` | None | Triggers background PDF delivery to email |
| **Observability**| `POST` | `/errors/log` | None | Ingests frontend & client error reports |
| | `GET` | `/errors` | `X-Admin-Key` | Queries error log entries with filters |
| | `GET` | `/errors/stats` | `X-Admin-Key` | Aggregated error counts, levels & trends |
| | `PATCH`| `/errors/bulk-status` | `X-Admin-Key` | Bulk triage error management (resolve/ignore) |

---

## ☁️ Production Deployment

| Layer | Platform | Configuration |
|---|---|---|
| **Frontend** | Cloudflare Pages | Connected to root domain `https://lewiswellbeing.com` via SPA redirect rules (`wrangler.jsonc`) |
| **Backend API** | Railway / Render | `uvicorn main:app --host 0.0.0.0 --port $PORT` (managed via `nixpacks.toml` / `Procfile`) |
| **Database** | Supabase PostgreSQL | `lewis_` table namespace with connection pooling (`pgbouncer=true`) |
| **Worker** | FastAPI Lifespan | Mail queue background thread automatically starts on server boot |

---

## 📋 Version History

| Version | Date | Key Changes |
|---|---|---|
| **v1.5.0** | 8 Sep 2026 | Streamlined assessment flow & RRO scoring engine, dedicated mobile/desktop UI shells, background mail queue worker with retries, automated PDF generator, Lewis OS error tracking & triage APIs, multi-currency payment integration (Razorpay/Stripe), dark mode |
| **v1.4.1** | 12 Aug 2026 | Marketing landing page redesign (v2 spec, real 9-area taxonomy), app-wide Nunito typography unification, simplified progress indicator |
| **v1.4.0** | 1 Aug 2026 | 25-page Insight Report redesign (v4.0 rulebook), InstrumentScreen consolidation, full report CSS system, UI standardisation |
| **v1.3.0** | 19 Jul 2026 | 16-page Insight Report, `enrich.py`, `insight_report.py`, `report_gate.py`, `InsightReport.jsx`, Supabase integration, onboarding analytics |
| **v1.2.0** | 14 Jul 2026 | Spec-exact W-matrix, 10k corpus engine, similarity block, pattern engine, band vocabulary locked |
| **v1.1.1** | 14 Jul 2026 | Frontend connected to API, GSE offset fix, Road B token budget adjustment, store hygiene |
| **v1.1.0** | 10 Jul 2026 | Safety lattice, scoring formulas, 9 dimensions wired, leverage engine |
