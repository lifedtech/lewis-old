# LEWIS — Lifed Everyday Wellbeing Intelligence System (v1.3.0)

LEWIS is a non-clinical wellbeing intelligence system built with a FastAPI backend engine, React frontend, Supabase PostgreSQL database integration, and zero-PII dataset anonymization.

```
lifed-LEWIS/
├── backend/                  ← FastAPI server (Python 3.13)
│   ├── main.py               ← API routes (/pulse/calculate, /assessment/full, /auth/*, /analytics/*)
│   ├── auth.py               ← User authentication, zero-PII report de-identification, Supabase REST / SQL
│   ├── scoring.py            ← 9D wellbeing scoring & W-matrix leverage engine
│   ├── security.py           ← Rate limiting, log credential masking, and security headers
│   ├── db/
│   │   └── supabase_schema.sql  ← Isolated PostgreSQL schema (lewis_ namespace) + Onboarding analytics view
│   └── requirements.txt
│
└── frontend/                 ← React + Vite app
    ├── src/
    │   ├── App.jsx           ← Screen routing state machine
    │   ├── screens/          ← Stage0 to Stage10 + MirrorScreen (Insight Report)
    │   ├── store/            ← Zustand global state
    │   └── lib/payload.js    ← API payload builder
    └── package.json
```

## Quick Start (Local Development)

**1. Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**2. Frontend**
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`

## Production Deployment Stack

- **Frontend**: Cloudflare Pages (`https://lewis.cold-forest-a8ec.workers.dev`)
- **Backend**: Railway / Render (`uvicorn main:app --host 0.0.0.0 --port $PORT`)
- **Database**: Supabase Cloud PostgreSQL (`lewis_` table namespace)
