# LEWIS — Lifed Everyday Wellbeing Intelligence System (v1.3.0)

LEWIS is a non-clinical wellbeing reflection system built with a FastAPI backend engine, React frontend, Supabase Cloud PostgreSQL integration, zero-PII dataset anonymization, and enterprise security guardrails.

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
│    Engine: Scoring Spine + W-Matrix Leverage + Safety       │
└──────────────────────────────┬──────────────────────────────┘
                               │ PostgreSQL / REST API
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. CLOUD DATABASE (Supabase PostgreSQL)                     │
│    Tables: lewis_users, lewis_sessions, lewis_vault         │
│    Corpus: lewis_anonymized_insight_reports (Zero-PII)     │
│    Analytics: lewis_onboarding_analytics_summary View       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

1. **Deterministic-First Scoring & W-Matrix Leverage Engine**:
   - Scores 9 life dimensions + PSS-10 calm overlay normalized 0–100 into compassionate band words (**Thriving / Steady / Strained / Depleted**).
   - Identifies the leverage point where small changes go furthest without diagnosing root causes.

2. **Supabase PostgreSQL & Onboarding System Isolation**:
   - All LEWIS data operates under an isolated `lewis_` table namespace (`lewis_users`, `lewis_sessions`, `lewis_user_report_vault`, `lewis_anonymized_insight_reports`).
   - Onboarding system queries aggregate activity metrics (`total_registered_lewis_users`, `total_assessments_completed`) via PostgreSQL View `lewis_onboarding_analytics_summary` or `GET /analytics/onboarding` without mixing user databases.

3. **Zero-PII De-Identification & Cryptonym Engine**:
   - Recursively scrubs names, email addresses, phone numbers, contact info, and passwords before storing report datasets.
   - Generates non-reversible cryptonym codes (`ANON-SUBJ-8F92A1D0`) for machine learning and system enhancement.

4. **Enterprise Security & Log Masking**:
   - Rate limiting (5 auth/min, 12 heavy scoring/min per IP).
   - Automatic log redaction for passwords, bearer tokens, API keys, and PostgreSQL URIs (`postgresql://user:***REDACTED_PASSWORD***@host`).
   - Defense-in-depth security response headers (`Cache-Control: no-store`, `X-Content-Type-Options`, `X-Frame-Options`, `CSP`).

---

## 🛠️ Repository Layout

```
lifed-LEWIS/
├── backend/                  ← FastAPI server (Python 3.13)
│   ├── main.py               ← Core API endpoints & pipeline order
│   ├── auth.py               ← Auth, session tokens, zero-PII de-identification, Supabase REST/SQL
│   ├── scoring.py            ← 9D scoring & W-matrix leverage engine
│   ├── security.py           ← Rate limiting, log credential masking, security headers
│   ├── safety.py             ← Safety lattice & gentle mode overrides
│   ├── narrative.py          ← Road A deterministic report generator
│   ├── llm.py                ← Road B AI re-voicing (fail-closed to Road A)
│   ├── validator.py          ← Fail-closed language validator
│   ├── db/
│   │   ├── supabase_schema.sql  ← Isolated PostgreSQL schema & Onboarding analytics view
│   │   └── lewis_users.db   ← Local SQLite fallback database
│   ├── Procfile / railway.json ← Railway production deployment config
│   └── requirements.txt
│
└── frontend/                 ← React + Vite app
    ├── src/
    │   ├── App.jsx           ← State machine router (SCREENS map + SCREEN_ORDER)
    │   ├── screens/          ← Stage0 to Stage10 + MirrorScreen (Insight Report)
    │   ├── store/            ← Zustand global state (useLewisStore)
    │   └── lib/payload.js    ← API payload builder
    └── package.json
```

---

## ⚡ Quick Start (Local Development)

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate | Linux/macOS: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔑 Environment Variables Setup

Create `.env` in `backend/`:
```env
# Supabase PostgreSQL Connection
DATABASE_URL=postgresql://postgres.vocgdpjvptroglmcuzoa:YOUR_DB_PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://vocgdpjvptroglmcuzoa.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Security & CORS
LEWIS_ANON_SALT=LEWIS_SECURE_ANON_SALT_2026_V1
FRONTEND_URL=http://localhost:5173,https://lewis.cold-forest-a8ec.workers.dev
```

Create `.env` in `frontend/`:
```env
VITE_API_URL=https://lewis.cold-forest-a8ec.workers.dev
```

---

## ☁️ Cloud Deployment Stack

- **Frontend**: Cloudflare Pages (`https://lewis.cold-forest-a8ec.workers.dev`)
- **Backend API**: Railway / Render (`uvicorn main:app --host 0.0.0.0 --port $PORT`)
- **Database**: Supabase Cloud PostgreSQL (`lewis_` table namespace)
