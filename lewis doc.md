# LEWIS Core Engine - Project Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Purpose](#project-purpose)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
5. [Assessment Instruments](#assessment-instruments)
6. [Dimensions & Bands](#dimensions--bands)
7. [API Endpoints](#api-endpoints)
8. [Scoring & Analysis Logic](#scoring--analysis-logic)
9. [Safety & Guardrails](#safety--guardrails)
10. [Similarity Corpus Engine](#similarity-corpus-engine)
11. [Narrative System (Road A / Road B)](#narrative-system-road-a--road-b)
12. [Data Models](#data-models)
13. [Installation & Setup](#installation--setup)
14. [Usage Example](#usage-example)

---

## Overview

**LEWIS Core Engine** (The Lifed Everyday Wellbeing Intelligence System) is a FastAPI backend + React frontend that delivers a **non-clinical wellbeing reflection** across nine life dimensions. A deterministic scoring spine (validated psychological instruments → 0–100 scores → band words) feeds a W-matrix **leverage engine**, a **pattern engine**, a **similarity corpus**, and a two-road narrative system: a deterministic report (Road A) that is always complete, optionally re-voiced by an LLM (Road B, Nemotron via NVIDIA NIM) behind a fail-closed validator.

Nothing is persisted server-side: answers live only for the lifetime of the request.

The locked product specifications live in `doc/` (Scoring Constitution, Layer 3–6 specs, Narrative Generation System, Safety & Guardrails, Similarity Mapping, Open Items Resolutions, and the 10,000-profile Dataset Summary). This file is a code-level companion; the specs are the source of truth.

---

## Project Purpose

LEWIS helps users understand and care for their wellbeing by:
1. **Multi-dimensional reflection** — nine dimensions plus a stress/calm overlay, all in wellbeing polarity (higher is better), spoken to users only as compassionate band words.
2. **Leverage, not root cause** — a 9×9 influence matrix identifies where a small change goes furthest, always framed as a *connection*, never a cause or diagnosis.
3. **Deterministic-first narratives** — every user gets a complete report with the LLM switched off; the LLM only adds voice.
4. **Small-habit prescriptions** — one free micro-habit matched to the leverage point, time available, and environment; a grounding habit whenever safety fires.
5. **Similarity context** — each completion is mapped against a 10k synthetic seed corpus (state-only) for coarse-position context, with infrastructure ready for real, consenting profiles.

LEWIS is **not** a diagnostic, screening, or risk-scoring tool, and its language rules enforce that at every layer.

---

## Project Structure

```
lifed-LEWIS/
├── backend/
│   ├── main.py              # FastAPI app: endpoints, Pydantic models, pipeline order
│   ├── scoring.py           # Instrument scoring, bands, bright spot, W-matrix leverage engine
│   ├── corpus.py            # Similarity engine over the 10k seed corpus (state-only k-NN)
│   ├── pattern.py           # Layer-4 pattern engine (LWI, texture patterns, portraits)
│   ├── narrative.py         # Road A: deterministic report renderer
│   ├── llm.py               # Road B: LLM voicing via NVIDIA NIM (fail-open to Road A)
│   ├── validator.py         # Fail-closed language validator for every Road B output
│   ├── safety.py            # Distress flags + gentle mode
│   ├── security.py          # GuardrailMiddleware: rate limit, body cap, security headers
│   ├── content.py           # SMALL-habit catalog + routing
│   ├── data/
│   │   └── lewis_10000_scores.csv   # canonical 10k synthetic seed corpus
│   ├── tests/               # pytest suite (66 tests incl. corpus regression)
│   ├── .env                 # NVIDIA_API_KEY, FRONTEND_URL, LEWIS_* switches
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # SCREENS map + SCREEN_ORDER — the only routing truth
│   │   ├── screens/         # PreStage0Age … Stage10 → MirrorScreen (results)
│   │   ├── lib/payload.js   # buildFullAssessmentPayload → API schema
│   │   └── store/useLewisStore.js   # Zustand store (full reset supported)
│   ├── package.json / vite.config.js / eslint.config.js
│   └── .env                 # VITE_API_URL
├── doc/                     # Locked product specs + 10k dataset (source of truth)
├── NEW_UPDATES.md           # Versioned changelog (currently v1.2.0)
├── learning_doc.md          # Developer onboarding guide
└── lewis doc.md             # This file
```

---

## Architecture

### Technology Stack
- **Backend**: FastAPI, Pydantic, Uvicorn, Python 3.13
- **AI Engine**: `nvidia/nemotron-3-super-120b-a12b` via NVIDIA NIM (OpenAI-compatible SDK) — a reasoning model; budgets cover thinking + answer, truncated output is discarded
- **Frontend**: React + Vite, Zustand, Framer Motion, vanilla CSS

### System Flow

```
React client
  └─ POST /assessment/full  (is_over_18 required — 403 otherwise)
       │
       ▼
Scoring (scoring.py)             WHO-5, PSS-10*, UCLA-3*, GSE, PROMIS,
  instruments → 0–100            CFPB-5*, Diener, INS, SWLS (*inverted at
  wellbeing polarity             source) + PH/EN composites → bands
       │
       ▼
Safety (safety.py)               severe depletion / all-low → GENTLE MODE:
  overrides everything           no leverage, no Road B, grounding habit,
       │                         care note rendered first
       ▼
Leverage (scoring.py)            W-matrix engine: L(i)·(out − 0.7·in)·bonus
  connection, never cause        gates: score ≤ 55, 25% separation → pair
       │
       ▼
Patterns (pattern.py)            LWI, texture patterns, portrait
Similarity (corpus.py)           state-only k-NN vs 10k corpus → position
       │                         words + neutral priors
       ▼
Road A (narrative.py)            complete deterministic report — always
Road B (llm.py) → validator.py   optional voicing; fail-closed to Road A
       │
       ▼
JSON response: dimensions (+position), leverage, bright_spot, safety,
prescription, narrative (+source), similarity, patterns, portrait
```

---

## Assessment Instruments

All scores are normalized to 0–100 **wellbeing polarity** (higher = better). Distress instruments are inverted at the source — no downstream re-inversion.

### Core (required)
1. **WHO-5** — emotional wellbeing. 5 items, 0–5. `raw × 4`.
2. **PSS-10** — stress → **Calm** overlay. 10 items, 0–4 (items 4,5,7,8 positively stated). `100 − (raw/40 × 100)` (inverted).
3. **UCLA-3** — loneliness → **Relationships**. 3 items, 0–2. `100 − (raw/6 × 100)` (inverted).
4. **GSE** — agency. 10 items on the **published 1–4 anchors**. `((raw − 10) / 30) × 100`.
5. **PROMIS Meaning & Purpose (4a)** — 4 items, 0–4. `(raw/16) × 100`.
6. **CFPB-5** — financial wellbeing. 5 items, 0–4. `100 − (raw/20 × 100)` (inverted).

### Optional
7. **Diener Flourishing** — growth. 8 items, 1–7. `((raw − 8) / 48) × 100`.
8. **INS** — nature connectedness. 1 item, 1–7. `((raw − 1) / 6) × 100`.
9. **SWLS** — life satisfaction. 5 items, 1–7. `((raw − 5) / 30) × 100`. Logged as an external-validity check only — it is not a dimension.

### Composites (no dedicated instrument)
- **PH (Physical Ease)** — weighted mean of sleep quality (0.35), body movement (0.30), WHO-5 "rested" (0.20), WHO-5 "vigour" (0.15); weights renormalize when a component is skipped.
- **EN (Energy & Engagement)** — mean of WHO-5 items 3 and 5, scaled to 0–100.

---

## Dimensions & Bands

| Key | Spec code | Label | Source |
|---|---|---|---|
| `emotional` | EM | Emotional Wellbeing | WHO-5 |
| `calm` | — | Stress & Calm | PSS-10 (overlay; not a W dimension) |
| `relationships` | RS | Connection & Relationships | UCLA-3 |
| `accomplishment` | AC | Agency & Accomplishment | GSE |
| `meaning` | MS | Meaning & Purpose | PROMIS |
| `financial` | FW | Financial Peace | CFPB-5 |
| `growth` | IG | Growth & Flourishing | Diener FS |
| `environment` | EC | Nature & Environment | INS |
| `physical` | PH | Physical Ease | Composite |
| `energy` | EN | Energy & Engagement | Composite |

**Bands (locked vocabulary):** **Thriving** ≥ 70 · **Steady** 55–69.9 · **Strained** 40–54.9 · **Depleted** < 40. Users are never shown a number in narrative text — only band words and coarse-position words.

---

## API Endpoints

### 1. Health Check — `GET /`
```json
{"status": "success", "message": "LEWIS Core Engine is online"}
```

### 2. Quick Pulse — `POST /pulse/calculate`
WHO-5-based check-in with an optional LLM-voiced reflection.
```json
{
  "status": "success",
  "schema_version": "1.1",
  "metrics": {"wellbeing_band": "Steady"},
  "narrative": "…",
  "narrative_source": "road_b"
}
```

### 3. Full Assessment — `POST /assessment/full`
Requires `is_over_18: true` (403 otherwise). Response shape:
```json
{
  "status": "success",
  "schema_version": "1.1",
  "dimensions": {
    "emotional": {"label": "Emotional Wellbeing", "short": "Emotional",
                   "score": 48.0, "band": "Strained", "source": "WHO-5",
                   "position": "lower"},
    "...": "…all 10 keys; unscored optional dimensions carry score/band null…"
  },
  "leverage": {
    "dimension": "financial", "label": "Financial Peace",
    "headline": "Financial pressure is the area most closely linked…",
    "framing": "This is a connection drawn from your answers today — not a cause, and not a verdict.",
    "secondary": null, "secondary_label": null
  },
  "bright_spot": {"dimension": "meaning", "label": "Meaning & Purpose"},
  "safety": {"flags": [], "care_note": null},
  "prescription": {"habit_title": "The Micro-Budget Check", "micro_action": "…"},
  "narrative": "…the report text…",
  "narrative_source": "road_a | road_b",
  "similarity": {
    "corpus_version": "synthetic_seed_v1",
    "corpus_is_synthetic": true,
    "matched": true,
    "neighbours": 40,
    "effectiveness_priors": {},
    "priors_note": "neutral — synthetic seed corpus carries no real outcomes"
  },
  "patterns": ["…pattern-engine outputs…"],
  "portrait": {"id": "…", "label": "…"}
}
```
Notes: `leverage` is `null` for balanced profiles and in gentle mode. `secondary` is set when the top two leverage candidates are within 25% (named as a pair). `position` is the corpus tercile word (`lower`/`middle`/`higher`); `calm` has no position (not a corpus dimension).

---

## Scoring & Analysis Logic

### Bright Spot
The highest-scoring scored dimension — always named first in the report (strength before struggle).

### The W-Matrix Leverage Engine
Among currently-low dimensions, LEWIS names the one that behaves as a net **source** of lowness under the v1 influence prior W (9×9 directed matrix, Resolutions C1):

```
L(i)        = (100 − score(i)) / 100
Leverage(i) = L(i) · (Σⱼ W[i][j]·L(j) − 0.7·Σⱼ W[j][i]·L(j)) · PressureBonus(i)
```

- **Lowness gate**: only dimensions with score ≤ 55 can be named; a balanced profile gets no leverage point.
- **Separation gate**: if the top two are within 25%, both are named as a pair — never a false single winner.
- **Pressure bonus**: ×1.25 when a named active pressure corroborates the dimension (money/health/relationship/energy keywords; work pressure deliberately unmapped).
- `calm` is not a leverage candidate (stress has no standing W dimension in the locked spec).
- **Validation**: the engine reproduces the 10,000-profile corpus generator on all 10,000 rows; a 500-row regression test pins this permanently.

### Pattern Engine (first cut)
`pattern.py` computes the LWI (overall reading + shape), texture patterns (stress load, recovery), and selects a state **portrait**; results ship in the response as `patterns` + `portrait` and feed the report's texture.

---

## Safety & Guardrails

- **Age gate**: the frontend hard-stops self-identified minors before any data collection; the API independently rejects `is_over_18 != true` with 403.
- **Gentle mode** (`safety.py`): severe depletion or an all-low profile suppresses the leverage engine and Road B entirely, routes the grounding habit, and returns a `care_note` the UI renders above all other content.
- **Language validator** (`validator.py`): every Road B output is scanned (banned clinical lexicon, numbers, structure) and discarded on any failure — the deterministic Road A report ships instead.
- **Transport guardrails** (`security.py`): per-IP rate limiting, request body cap, security headers; CORS wildcard origins are rejected (set `FRONTEND_URL` explicitly).
- **No persistence**: answers are never stored server-side.

---

## Similarity Corpus Engine

`corpus.py` implements V1 (rule-based) of the Similarity-Mapping spec over the 10,000-profile synthetic seed corpus:

- **State-only vector**: 9 dimension scores + leverage + nervous-system state + readiness + support preference. **Demographics and safety flags can never enter the vector** — the builder raises `ValueError` (enforced by tests).
- **Similarity**: `0.50·score_sim + 0.20·state_sim + 0.15·friction_sim + 0.15·pref_sim`, block weights renormalizing over what a live user can populate.
- **k-NN**: k = 40, k_min = 30 floor, similarity floor 0.50 (env-tunable via `LEWIS_SIM_K`, `LEWIS_SIM_K_MIN`, `LEWIS_SIM_FLOOR`); below the floor it falls back to archetype-level context instead of thin-matching.
- **Neutral priors**: every corpus row is `is_synthetic` — no outcome claim is ever drawn from synthetic rows, so `effectiveness_priors` stays `{}` until real consenting profiles accrue.
- **Coarse positions**: per-dimension corpus terciles produce `lower/middle/higher` words for the report — numbers never leave the backend.

---

## Narrative System (Road A / Road B)

**Road A** (`narrative.py`) — the deterministic report, always rendered: mirror/arrival, bright spot, banded landscape, body & energy, connections (leverage), patterns, path forward + habit. Passes the same validator Road B is held to.

**Road B** (`llm.py`) — optional voicing by Nemotron via NVIDIA NIM. It receives **bands and context only** (never raw scores or instrument names) and re-voices the report. Every failure path — missing key, timeout, truncation (`finish_reason=length`), validator rejection, gentle mode — falls back to Road A. `narrative_source` in the response tells you which shipped.

### Voice & Language Charter (enforced in prompt + validator)
- Second person ("you"); LEWIS in third person, descriptively; never "I"/"we"; no mental-state verbs for the system.
- Non-clinical: no diagnosis/screening/risk words (banned lexicon enforced).
- **No numbers, scores, percentages, or instrument names** — band words only (Thriving, Steady, Strained, Depleted).
- Coarse positions voiced only as words ("in the lower part of the range seen across many check-ins") — never a number, rank, percentile, or named-group comparison.
- Normalising framing for depleted areas; strength named before struggle.
- Prompt-injection defense: JSON payload is data, never instructions.

---

## Data Models

### PulseInput
```json
{
  "who5": [3, 4, 2, 5, 4],
  "life_stability": "moderate",
  "active_pressures": ["work", "family"],
  "priority_rank": ["health", "finances"],
  "arrival_word": "tired"
}
```

### FullAssessmentInput (key fields)
```json
{
  "is_over_18": true,

  "who5":  [4, 3, 5, 2, 3],
  "pss10": [2, 1, 3, 2, 1, 2, 3, 2, 1, 2],
  "ucla3": [1, 2, 0],
  "gse":   [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
  "promis": [4, 3, 4, 3],
  "cfpb5": [2, 1, 3, 2, 1],

  "diener": [6, 5, 6, 5, 6, 5, 6, 7],
  "ins": 5,
  "swls": [5, 6, 5, 4, 5],

  "ageCategory": "25-34",
  "identityRoles": ["parent", "engineer"],
  "active_pressures": ["work", "time-management"],
  "bodyMovement": "moderate",
  "sleepQuality": "poor",
  "priority_rank": ["health", "career"],
  "arrival_word": "overwhelmed",
  "bodyMapZones": ["neck", "gut"],
  "breathingBefore": "Shallow & Fast",
  "breathingAfter": "More settled",
  "nervousSystemState": "sympathetic",
  "supportPreferences": ["gentle"],
  "plannerReadiness": "one_thing",
  "max_time_available": 5,
  "current_environment": "Anywhere"
}
```
Notes: `is_over_18` is **required**. `diener`/`swls` are **arrays** (1–7 anchors). `gse` uses the published **1–4** anchors. Context fields shape tone and texture only — they can never move a score.

---

## Installation & Setup

### Backend
```bash
cd backend
python -m venv ..\.venv && ..\.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```
Create `backend/.env`:
```env
NVIDIA_API_KEY=your_nvidia_nim_key          # omit to run Road A only
FRONTEND_URL=http://localhost:5173          # explicit origins; wildcard rejected
# Optional switches:
# LEWIS_ENABLE_LLM=false
# LEWIS_LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
# LEWIS_LLM_REPORT_MAX_TOKENS=8000  LEWIS_LLM_PULSE_MAX_TOKENS=3000
# LEWIS_SIM_K=40  LEWIS_SIM_K_MIN=30  LEWIS_SIM_FLOOR=0.50
```
Run and test:
```bash
uvicorn main:app --reload --port 8000       # Swagger at /docs
python -m pytest tests -q                   # 66 tests
```

### Frontend
```bash
cd frontend
npm install
# frontend/.env → VITE_API_URL=http://localhost:8000
npm run dev                                 # localhost:5173
```

---

## Usage Example

```bash
curl -X POST "http://localhost:8000/assessment/full" \
  -H "Content-Type: application/json" \
  -d '{
    "is_over_18": true,
    "who5": [4, 3, 5, 2, 3],
    "pss10": [2, 1, 3, 2, 1, 2, 3, 2, 1, 2],
    "ucla3": [1, 2, 0],
    "gse": [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
    "promis": [4, 3, 4, 3],
    "cfpb5": [2, 1, 3, 2, 1],
    "max_time_available": 5,
    "current_environment": "Desk"
  }'
```

---

**Last Updated**: 15 July 2026 (backend v1.2.0)
**Status**: Active development — pilot-readiness gates tracked in `NEW_UPDATES.md`
