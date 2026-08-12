# LEWIS — Lifed Everyday Wellbeing Intelligence System (v1.4.1)

LEWIS is a non-clinical wellbeing reflection system built with a FastAPI backend, React + Vite frontend, Supabase Cloud PostgreSQL, zero-PII anonymization, and a fully redesigned 25-page Insight Report rendered as A4 paper pages directly in the browser and downloadable as PDF.

---

## 🚀 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND (React + Vite + Zustand + Framer Motion)        │
│    Hosted on: Cloudflare Pages                              │
│    URL: https://lewis.cold-forest-a8ec.workers.dev          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. BACKEND API ENGINE (FastAPI / Uvicorn / Python 3.13)     │
│    Hosted on: Railway / Render                              │
│    Pipeline: Scoring → Safety → Leverage → Patterns →       │
│              Similarity → Enrich → 25-page Report → Gate    │
└──────────────────────────────┬──────────────────────────────┘
                               │ PostgreSQL / REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CLOUD DATABASE (Supabase PostgreSQL)                     │
│    Tables: lewis_users, lewis_sessions, lewis_vault         │
│    Corpus: lewis_anonymized_insight_reports (Zero-PII)      │
│    Analytics: lewis_onboarding_analytics_summary View       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Deterministic-First Scoring & W-Matrix Leverage Engine
- Scores 9 life dimensions + PSS-10 calm overlay, normalized 0–100 into compassionate band words (**Running on empty / Under pressure / Steady / Strong**).
- W-matrix engine identifies the leverage point where small changes go furthest — always framed as a *connection*, never a cause.
- Validated against the 10,000-profile synthetic corpus: 10,000 / 10,000 rows reproduced.

### 2. 25-Page Redesigned Insight Report (v4.0 Rulebook)
- Full report generated deterministically from the enriched object — no LLM required.
- Rendered as interactive A4 paper pages in the browser (`frontend/src/report/InsightReport.jsx` + `report.css`).
- Downloadable as a pixel-perfect PDF via `@page { size: 210mm 297mm; }` print CSS.
- Six parts behind a cover and contents page: Orientation → Your Picture → How It Connects → A Closer Look → Your Plan → After This.
- Every block type (cards, columns, callouts, petals wheel SVG, day-rhythm SVG, body-map SVG, reach bars, 7-day table, supports, program cards, colophon) is CSS-styled — no inline styles.
- Self-check gate (`report_gate.py`) runs before every response: no em/en dashes, no instrument names, no score digits, no clinical vocabulary, required structural blocks verified.

### 3. Consolidated InstrumentScreen
- All psychometric scales (GSE, PROMIS, CFPB-5, Diener, INS, SWLS) render through a single `InstrumentScreen.jsx` — one file instead of six separate screens.
- Shared Likert logic, neomorphic slider styling, and answer persistence.

### 4. Supabase PostgreSQL & Onboarding Analytics Isolation
- All LEWIS data under the `lewis_` table namespace (`lewis_users`, `lewis_sessions`, `lewis_user_report_vault`, `lewis_anonymized_insight_reports`).
- Onboarding system queries aggregate metrics via `lewis_onboarding_analytics_summary` View or `GET /analytics/onboarding` without mixing user databases.

### 5. Zero-PII De-Identification & Cryptonym Engine
- Recursive PII scrubbing before storing report datasets.
- Non-reversible cryptonym codes (`ANON-SUBJ-8F92A1D0`) via HMAC-SHA256.

### 6. Enterprise Security & Log Masking
- Rate limiting: 5 auth/min, 12 heavy scoring/min per IP.
- Automatic log redaction for passwords, bearer tokens, API keys, and PostgreSQL URIs.
- Defense-in-depth security headers.

### 7. Redesigned Marketing Landing Page
- `LandingScreen.jsx` rebuilt from the "LEWIS Homepage v2" reference spec (`LEWIS Homepage v2.dc.html`).
- Nine-area taxonomy corrected to match what the engine actually scores — no more placeholder domains or fabricated demo numbers.
- Hero, "What is LEWIS" explainer, nine-area grid, research section, 8-question FAQ, and a single CTA path into the journey; old contact form and decorative marquee/orbs removed.
- Typography unified app-wide: `IBM Plex Mono` retired in favor of `Nunito` across the journey, report, and landing page.

---

## 🗂️ Repository Layout

```
lifed-LEWIS/
├── backend/
│   ├── main.py               ← Core API endpoints & pipeline order
│   ├── auth.py               ← Auth, session tokens, zero-PII, Supabase REST/SQL
│   ├── scoring.py            ← 9D scoring & W-matrix leverage engine
│   ├── enrich.py             ← Builds the §3 enriched object (rulebook contract)
│   ├── insight_report.py     ← 25-page deterministic report generator
│   ├── report_gate.py        ← §17 self-check gate (run before every response)
│   ├── pattern.py            ← Layer-4 pattern engine (LWI, portrait, texture)
│   ├── corpus.py             ← State-only k-NN vs 10k synthetic corpus
│   ├── narrative.py          ← Road A deterministic narrative (legacy field)
│   ├── llm.py                ← Road B AI re-voicing via NVIDIA NIM (fail-closed)
│   ├── validator.py          ← Fail-closed language validator
│   ├── safety.py             ← Safety lattice & gentle mode overrides
│   ├── security.py           ← Rate limiting, log masking, security headers
│   ├── content.py            ← SMALL-habit catalog + routing
│   ├── db/
│   │   ├── supabase_schema.sql ← PostgreSQL schema + onboarding analytics view
│   │   └── lewis_users.db    ← Local SQLite fallback
│   ├── data/
│   │   └── lewis_10000_scores.csv ← 10k synthetic seed corpus (canonical)
│   ├── tests/                ← pytest suite (95 tests)
│   ├── Procfile / railway.json ← Railway production deployment config
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx           ← State machine router (SCREENS map + SCREEN_ORDER, 53 entries)
│   │   ├── screens/          ← 53 screens: LandingScreen → Stage0 → Stage10 → MirrorScreen
│   │   │   ├── LandingScreen.jsx ← Marketing homepage (v2 redesign)
│   │   │   └── InstrumentScreen.jsx ← Unified psychometric scale screen
│   │   ├── report/
│   │   │   ├── InsightReport.jsx ← 25-page A4 report renderer
│   │   │   ├── report.css    ← Full report design system (2300+ lines)
│   │   │   └── icons.jsx     ← Consistent line-icon set (SVG components)
│   │   ├── constants/
│   │   │   ├── instruments.js ← Instrument definitions for InstrumentScreen
│   │   │   └── instruments.check.js ← Completion checkers
│   │   ├── store/useLewisStore.js ← Zustand global state (full reset & auth)
│   │   └── lib/payload.js    ← buildFullAssessmentPayload → API schema
│   └── public/report/        ← Report imagery assets (programs, logo)
│
├── doc/                      ← Locked product specs & 10k dataset
│   ├── LEWIS_Insight_Report_Generation_Rulebook_v4.0_FINAL.md ← Active rulebook
│   ├── insight-report-redesign/ ← Reference HTML design + support assets
│   └── _sample_report.json   ← Sample enriched report JSON
│
├── NEW_UPDATES.md            ← Versioned changelog (v1.1.0 → v1.4.1)
├── learning_doc.md           ← Developer onboarding guide
├── lewis doc.md              ← Full project documentation
├── README.md                 ← This file
└── LEWIS Homepage v2.dc.html ← Landing page design reference (marketing spec)
```

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
# Windows (repo-root venv):
..\\.venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
python -m pytest tests -q        # 95 tests must stay green
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev                      # localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables

Create `backend/.env`:
```env
# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres.XXXX:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://XXXX.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Security & CORS
LEWIS_ANON_SALT=LEWIS_SECURE_ANON_SALT_2026_V1
FRONTEND_URL=http://localhost:5173,https://lewis.cold-forest-a8ec.workers.dev

# Optional: AI, Corpus, LLM tuning
NVIDIA_API_KEY=your_nvidia_nim_key   # omit → Road A only
LEWIS_ENABLE_LLM=false
LEWIS_LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
LEWIS_LLM_REPORT_MAX_TOKENS=8000
LEWIS_SIM_K=40
LEWIS_SIM_K_MIN=30
LEWIS_SIM_FLOOR=0.50
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```

---

## ☁️ Cloud Deployment Stack

| Layer | Service | URL |
|---|---|---|
| Frontend | Cloudflare Pages | `https://lewis.cold-forest-a8ec.workers.dev` |
| Backend API | Railway (`uvicorn main:app --host 0.0.0.0 --port $PORT`) | Railway dashboard |
| Database | Supabase Cloud PostgreSQL (`lewis_` namespace) | Supabase dashboard |

---

## 📋 Version History

| Version | Date | Key Changes |
|---|---|---|
| **v1.4.1** | 12 Aug 2026 | Landing page redesign (v2 spec, real 9-area taxonomy), app-wide Nunito typography unification, simplified progress indicator |
| v1.4.0 | 1 Aug 2026 | 25-page Insight Report redesign (v4.0 rulebook), InstrumentScreen consolidation, full report CSS system, UI standardisation |
| v1.3.0 | 19 Jul 2026 | 16-page Insight Report, `enrich.py`, `insight_report.py`, `report_gate.py`, `InsightReport.jsx`, Supabase integration, onboarding analytics |
| v1.2.0 | 14 Jul 2026 | Spec-exact W-matrix, 10k corpus engine, similarity block, pattern engine, band vocabulary locked |
| v1.1.1 | 14 Jul 2026 | Frontend connected to API, GSE fix, Road B fixed (token budget), store reset |
| v1.1.0 | 10 Jul 2026 | Safety lattice, scoring formulas, 9 dimensions wired, leverage engine |
