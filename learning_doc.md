# LEWIS - Developer Learning Guide

Welcome to the **LEWIS Core Engine**! This guide helps you understand the project architecture, tech stack, and how the pieces fit together so you can start contributing effectively.

> The authoritative product specs live in `doc/` (Scoring Constitution, Layer 3–6 specs, Narrative System, Safety & Guardrails, Similarity Mapping). When this guide and a locked spec disagree, the spec wins — raise it rather than coding around it.

## 🌟 1. High-Level Overview
LEWIS (The Lifed Everyday Wellbeing Intelligence System) is a full-stack, **non-clinical wellbeing reflection** tool.
- It scores users across **9 life dimensions** (PH physical, EM emotional, EN energy, RS relationships, MS meaning, AC agency, FW financial, IG growth, EC environment) plus a stress/calm overlay (PSS-10), each normalized 0–100 and banded **Thriving / Steady / Strained / Depleted**.
- A **W-matrix leverage engine** finds the *connection point* where a small change goes furthest — explicitly a connection, never a "root cause" (validated against the 10,000-profile synthetic corpus: 10,000/10,000 reproduced).
- Reports are **deterministic first**: Road A renders a complete report from templates with no LLM. Road B (Nemotron via NVIDIA NIM) only *re-voices* it, and its output is discarded by a fail-closed validator on any rule violation.
- A **similarity corpus engine** maps each completion against a 10k synthetic seed corpus (state-only, never demographics) to add coarse-position context; effectiveness priors stay neutral until real consenting users exist.
- A **safety lattice** overrides everything: minors are hard-stopped, severe depletion triggers gentle mode (no leverage, no Road B, grounding habit, care note).

## 🛠️ 2. Tech Stack
**Frontend:**
- **React + Vite** — screens rendered by a state machine, not a URL router.
- **Framer Motion** — calming enter/exit and breathing animations. ⚠️ Gotcha: CSS keyframe animations override framer-motion's inline transforms — never rely on `translate` centering on an element that also has a CSS `animation` (see the breathing-orb fix in `Stage3_4BreathingScreen.jsx`).
- **Zustand** (`useLewisStore.js`) — holds every answer across the ~50 stage screens; `reset()` restores the full initial state.
- **Vanilla CSS** (`index.css`).

**Backend:**
- **FastAPI + Pydantic + Uvicorn** — strict input validation and pipeline processing.
- **Supabase Cloud + Local SQLite Fallback (`auth.py`)** — dual-mode database engine. Uses PostgreSQL (`lewis_` table namespace) when `DATABASE_URL`/`SUPABASE_URL` are present, with fallback to SQLite (`lewis_users.db`) / memory mode.
- **OpenAI SDK pointed at NVIDIA NIM** (`llm.py`) — model `nvidia/nemotron-3-super-120b-a12b`, a *reasoning* model: token budgets must cover thinking + answer, and truncated responses are discarded.
- **Stdlib-only corpus engine** (`corpus.py`) — csv/math/heapq; no pandas at runtime.

## 📂 3. Codebase Structure Walkthrough

### Frontend (`/frontend`)
- **`src/App.jsx`** — the single source of truth for routing: the `SCREENS` map and `SCREEN_ORDER` array. *A screen file that isn't registered here is dead code.*
- **`src/screens/`** — the journey: `PreStage0Age` (minor hard-stop → `AgeStopScreen`) → Stages 1–10 → `MirrorScreen` (results).
- **`src/lib/payload.js`** — `buildFullAssessmentPayload` maps the store to the API schema (GSE on published 1–4 anchors, `is_over_18` required). If you add an intake screen, wire its field here or the backend never sees it.
- **`src/store/useLewisStore.js`** — global state.

### Backend (`/backend`)
- **`main.py`** — the API (`/pulse/calculate`, `/assessment/full`, `/auth/*`, `/analytics/onboarding`) and the pipeline order: validate → age gate → score → dimensions → safety → leverage → patterns/portrait → similarity → habit → Road A → optional Road B → validator → response.
- **`auth.py`** — User registration/login, session tokens, zero-PII report de-identification (`ANON-SUBJ-...`), and Supabase PostgreSQL / REST API database integration.
- **`db/supabase_schema.sql`** — Isolated PostgreSQL database schema (`lewis_users`, `lewis_sessions`, `lewis_user_report_vault`, `lewis_anonymized_insight_reports`) and `lewis_onboarding_analytics_summary` view for the Onboarding system.
- **`scoring.py`** — instrument normalization (all wellbeing-polarity: PSS-10/UCLA-3/CFPB-5 inverted at source), PH/EN composites, `band_for`, bright spot, and the **W-matrix leverage engine** (9×9 influence matrix, lowness gate score ≤ 55, 25% separation gate → pair naming, ×1.25 pressure bonus).
- **`corpus.py`** — the similarity engine over `data/lewis_10000_scores.csv`: state-only k-NN (k=40, k_min=30), demographics/safety **raise ValueError** if they ever reach a vector, coarse-position terciles ("lower/middle/higher" words only), neutral priors while the corpus is synthetic.
- **`pattern.py`** — Layer-4 pattern engine (LWI, texture patterns, portrait selection) — first cut.
- **`narrative.py`** — Road A: the deterministic, always-available report.
- **`llm.py`** — Road B voicing; every failure path returns `None` so callers fall back to Road A.
- **`validator.py`** — fail-closed regex gate every Road B output must pass before display.
- **`safety.py`** — distress flags and gentle mode.
- **`security.py`** — `GuardrailMiddleware`: rate limiting (5 auth/min, 12 heavy/min), body-size cap, security headers, global `SensitiveDataFilter` log masking for passwords and database URIs. CORS whitelist configured for Cloudflare deployment (`https://lewis.cold-forest-a8ec.workers.dev`).
- **`Procfile` & `railway.json`** — Production deployment settings for Railway hosting (`uvicorn main:app --host 0.0.0.0 --port $PORT`).
- **`content.py`** — the SMALL-habit catalog, routed by leverage dimension key.
- **`data/`** — the 10k synthetic seed corpus (canonical CSV).
- **`tests/`** — pytest suite (66 tests), including a 500-row corpus regression that pins the leverage engine to the generator.

## 🧠 4. Core Mechanics: How an Assessment Works
1. **Collection:** screens save to Zustand; the Mirror screen calls `buildFullAssessmentPayload` and blocks submission listing any incomplete instruments.
2. **Gate:** `is_over_18` must be `true` or the API returns 403.
3. **Scoring:** instruments → 0–100 wellbeing-polarity scores → 10 dimension entries with band words.
4. **Safety first:** `evaluate_safety` may set gentle mode — leverage is suppressed, Road B skipped, grounding habit returned, `safety.care_note` rendered above everything in the UI.
5. **Leverage:** the W-matrix engine names the connection point (or a pair, or nothing for a balanced profile).
6. **Patterns & similarity:** the pattern engine adds texture + portrait; the corpus engine adds per-dimension `position` words and the `similarity` response block.
7. **Report:** Road A is always built; Road B re-voices it only if enabled, un-truncated, and validator-approved (`narrative_source` tells you which shipped).

## 🚀 5. Getting Started Locally
**Backend:**
```bash
cd backend
..\.venv\Scripts\activate        # Windows (repo-root venv)
pip install -r requirements.txt
# .env: NVIDIA_API_KEY=...  FRONTEND_URL=http://localhost:5173
uvicorn main:app --reload --port 8000
python -m pytest tests -q        # 66 tests must stay green
```
Useful env switches: `LEWIS_ENABLE_LLM=false` (Road A only), `LEWIS_LLM_REPORT_MAX_TOKENS`, `LEWIS_SIM_K` / `LEWIS_SIM_K_MIN` / `LEWIS_SIM_FLOOR`.

**Frontend:**
```bash
cd frontend
npm install
npm run dev                      # localhost:5173
```
`frontend/.env` → `VITE_API_URL` must point at your local backend.

## 💡 6. Key Development Rules to Remember
- **Never diagnose.** No condition words, no numbers/percentiles in any user-facing narrative — band words and coarse-position words only. The validator enforces this; don't weaken it.
- **Connection, not causation.** It's a "leverage point", never a "root driver/cause". Copy must disclaim causation.
- **Safety overrides everything.** Gentle mode suppresses leverage and Road B — never route around it.
- **The LLM is a voice, not a source of truth.** It receives bands and context only (raw scores never), and any doubt falls back to Road A.
- **Similarity matches on state, never on who someone is.** Demographics and safety flags must never enter a vector; the code raises if they do. No outcome claims from the synthetic corpus.
- **Check `App.jsx` before trusting a screen file**, and wire new intake fields through `payload.js`.
- **Agentless AI:** LEWIS speaks to "you", refers to itself in third person, never "I"/"we".
