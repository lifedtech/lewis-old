# LEWIS Core Engine — Project Documentation (v1.4.0)

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
12. [Insight Report System (v4.0)](#insight-report-system-v40)
13. [Data Models](#data-models)
14. [Installation & Setup](#installation--setup)
15. [Usage Example](#usage-example)

---

## Overview

**LEWIS Core Engine** (The Lifed Everyday Wellbeing Intelligence System) is a FastAPI backend + React frontend that delivers a **non-clinical wellbeing reflection** across nine life dimensions. A deterministic scoring spine (validated psychological instruments → 0–100 scores → band words) feeds a W-matrix **leverage engine**, a **pattern engine**, a **similarity corpus**, and a two-road narrative system: a deterministic report (Road A) always complete, optionally re-voiced by an LLM (Road B, Nemotron via NVIDIA NIM) behind a fail-closed validator.

The centrepiece output is the **25-page Insight Report** (v4.0 Generation Rulebook), rendered in the browser as interactive A4 paper pages and downloadable as PDF. The report is generated deterministically from the enriched object — no LLM required for the report itself.

The locked product specifications live in `doc/` (Scoring Constitution, Layer 3–6 specs, Insight Report Generation Rulebook v4.0, Narrative Generation System, Safety & Guardrails, Similarity Mapping, Open Items Resolutions, and the 10,000-profile Dataset Summary). This file is a code-level companion; the specs are the source of truth.

---

## Project Purpose

LEWIS helps users understand and care for their wellbeing by:

1. **Multi-dimensional reflection** — nine dimensions plus a stress/calm overlay, all in wellbeing polarity (higher is better), spoken to users only as compassionate band words.
2. **Leverage, not root cause** — a 9×9 influence matrix identifies where a small change goes furthest, always framed as a *connection*, never a cause or diagnosis.
3. **Deterministic-first narratives** — every user gets a complete 25-page report with the LLM switched off; the LLM only adds voice to the legacy narrative field.
4. **Small-habit prescriptions** — one free micro-habit matched to the leverage point, time available, and environment; a grounding habit whenever safety fires.
5. **Similarity context** — each completion is mapped against a 10k synthetic seed corpus (state-only) for coarse-position context.
6. **Designed for download** — the report renders as print-perfect A4 PDF, styled with the LIFED visual system (Nunito + IBM Plex Mono, teal/sage palette, line icons, rounded cards).

LEWIS is **not** a diagnostic, screening, or risk-scoring tool, and its language rules enforce that at every layer.

---

## Project Structure

```
lifed-LEWIS/
├── backend/
│   ├── main.py              # FastAPI app: endpoints, Pydantic models, pipeline order
│   ├── auth.py              # Auth, session tokens, zero-PII de-identification, Supabase
│   ├── scoring.py           # Instrument scoring, bands, bright spot, W-matrix leverage
│   ├── enrich.py            # Rulebook §3 enriched object builder
│   ├── insight_report.py    # 25-page deterministic report generator (v4.0 rulebook)
│   ├── report_gate.py       # §17 self-check gate (run before every response)
│   ├── corpus.py            # Similarity engine over the 10k seed corpus (state-only k-NN)
│   ├── pattern.py           # Layer-4 pattern engine (LWI, texture patterns, portraits)
│   ├── narrative.py         # Road A: deterministic legacy narrative renderer
│   ├── llm.py               # Road B: LLM voicing via NVIDIA NIM (fail-open to Road A)
│   ├── validator.py         # Fail-closed language validator for Road B output
│   ├── safety.py            # Distress flags + gentle mode
│   ├── security.py          # GuardrailMiddleware: rate limiting, body cap, log masking
│   ├── content.py           # SMALL-habit catalog + routing by leverage dimension
│   ├── db/
│   │   ├── supabase_schema.sql # PostgreSQL schema (lewis_ namespace) + analytics view
│   │   └── lewis_users.db   # Local SQLite fallback database
│   ├── Procfile / railway.json # Railway production deployment configuration
│   ├── data/
│   │   └── lewis_10000_scores.csv # canonical 10k synthetic seed corpus
│   ├── tests/               # pytest suite (95 tests incl. insight report gate tests)
│   ├── .env                 # DATABASE_URL, SUPABASE_URL, SUPABASE_SECRET_KEY, etc.
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # SCREENS map + SCREEN_ORDER — the only routing truth
│   │   ├── index.css        # Journey UI design system
│   │   ├── screens/         # 50 screens: PreStage0Age … Stage10 → MirrorScreen
│   │   │   └── InstrumentScreen.jsx  # Unified screen for all psychometric instruments
│   │   ├── report/
│   │   │   ├── InsightReport.jsx  # 25-page A4 report renderer (block dispatch)
│   │   │   ├── report.css   # Full report design system (2300+ lines, A4 layout, print)
│   │   │   └── icons.jsx    # SVG line icon components
│   │   ├── constants/
│   │   │   ├── instruments.js       # Instrument definitions for InstrumentScreen
│   │   │   └── instruments.check.js # Completion validators
│   │   ├── lib/payload.js   # buildFullAssessmentPayload → API schema
│   │   └── store/useLewisStore.js   # Zustand store (full reset & auth state)
│   ├── public/report/       # Report static assets (program imagery, LIFED logo)
│   └── package.json / vite.config.js
│
├── doc/                     # Locked product specs + 10k dataset (source of truth)
│   ├── LEWIS_Insight_Report_Generation_Rulebook_v4.0_FINAL.md
│   ├── insight-report-redesign/ # Reference HTML design
│   └── _sample_report.json  # Sample enriched report JSON
│
├── NEW_UPDATES.md           # Versioned changelog (v1.1.0 → v1.4.0)
├── learning_doc.md          # Developer onboarding guide
├── lewis doc.md             # This file
└── README.md                # Project overview + quick start
```

---

## Architecture

### Technology Stack

| Layer | Technology |
|---|---|
| **Backend** | FastAPI, Pydantic, Uvicorn, Python 3.13 |
| **AI Engine** | `nvidia/nemotron-3-super-120b-a12b` via NVIDIA NIM (OpenAI-compatible SDK) |
| **Frontend** | React + Vite, Zustand, Framer Motion, Vanilla CSS |
| **Report Rendering** | `InsightReport.jsx` + `report.css` — interactive A4 pages + PDF print |
| **Database** | Supabase Cloud PostgreSQL (`lewis_` namespace) with SQLite local fallback |
| **Corpus** | Stdlib-only k-NN over 10k synthetic CSV (~90ms warm) |

### System Flow

```
React client (50 screens → MirrorScreen)
  └─ POST /assessment/full  (is_over_18 required — 403 otherwise)
       │
       ▼
Scoring (scoring.py)           WHO-5, PSS-10*, UCLA-3*, GSE, PROMIS,
  instruments → 0–100          CFPB-5*, Diener, INS, SWLS (*inverted at
  wellbeing polarity           source) + PH/EN composites → bands
       │
       ▼
Safety (safety.py)             severe depletion → GENTLE MODE:
  overrides everything         no leverage, no Road B, grounding habit
       │
       ▼
Leverage (scoring.py)          W-matrix: L(i)·(out − 0.7·in)·bonus
  connection, never cause      gates: score ≤ 55, 25% separation → pair
       │
       ▼
Patterns (pattern.py)          LWI, texture patterns, portrait
Similarity (corpus.py)         state-only k-NN vs 10k corpus → coarse positions
       │
       ▼
Enrich (enrich.py)             Builds the v4.0 rulebook enriched object:
  the contract                 nine areas, v4.0 band words, read_type,
                               connections, distress tier, commerce cap,
                               handoff (lead-with / focus / habit sizing)
       │
       ▼
Report (insight_report.py)     25-page deterministic JSON generator
Gate (report_gate.py)          §17 self-check: no dashes, no instruments,
                               no digits, required blocks verified
       │
       ▼
Road A (narrative.py)          legacy narrative field — always built
Road B (llm.py) → validator    optional voicing of legacy narrative only
       │
       ▼
JSON response:
  insight_report: { pages: [...] }   ← 25-page structured JSON
  dimensions (+position)             ← 10 dimensions with coarse positions
  leverage, bright_spot, safety      ← pipeline outputs
  prescription, narrative (+source)  ← legacy narrative (Road A or B)
  similarity, patterns, portrait     ← corpus & pattern engine outputs
```

### Frontend Report Rendering

```
MirrorScreen receives JSON
  └─ <InsightReport pages={report.pages} />
       └─ pages.map(page =>
            <ReportPage page={page}>
              {page.blocks.map(block =>
                <Block block={block} />)}
            </ReportPage>)
```

`<Block>` dispatches to a pure presentational component per `block.type`:

| Block type | Component | What it renders |
|---|---|---|
| `cards` | Cards | 1–3 icon + label + body cards in a row |
| `columns` | Columns | 2-column tinted comparison layout |
| `checklist` | Checklist | Bullet list with icon leading each item |
| `callout` | Callout | Bordered highlight box (info/warn/tip) |
| `table` | Table | Area icon + band + certainty grid |
| `certainty` | Certainty | 2-column confidence cards |
| `petals` | Petals | Nine-petal SVG wheel (four discrete band levels) |
| `map` | Map | Systemic map (3-node SVG grid with hub) |
| `connections` | Connections | Node diagram (2-column pill badges + legend) |
| `bandladder` | BandLadder | Ranked band list with step-meter bars |
| `bandcards` | BandCards | Grid of area band cards |
| `bands` | Bands | Strength-first band list with meter bars |
| `reach` | Reach | Progress bar rows (area name → fill bar → label) |
| `rhythm` | DayRhythm | SVG day-curve chart with axis labels |
| `timeline` | Timeline | Horizontal coloured day-segment bar |
| `loadbar` | LoadBar | 3-step stress load indicator |
| `bodymap` | BodyMap | SVG body contour with zone markers |
| `flow` | Flow | 3-step arrow flow diagram |
| `area` | AreaBlock | Deep-dive area with icon tile, band chip, paragraphs |
| `practice` | Practice | 3-column experiment box with tag badge |
| `steps` | Steps | Numbered step sequence with arrows |
| `sevendays` | SevenDays | 7-row day-by-day guide table |
| `supports` | Supports | Support recommendation cards |
| `programcase` | ProgramCase | Bulleted program case item |
| `program` | Program | Program card with image, chips, rationale |
| `cta` | Cta | Green gradient call-to-action banner |
| `contents` | Contents | Contents page with section/page map |
| `profile` | Profile | Avatar + name + status chip |
| `colophon` | Colophon | Final signoff with LIFED logo |
| `row` | Row | Horizontal flex container of sub-blocks |

All visual design — layout, spacing, typography, colour, print rules — lives in `report.css`.

---

## Assessment Instruments

All scores are normalized to 0–100 **wellbeing polarity** (higher = better). Distress instruments are inverted at the source.

### Core (required)
1. **WHO-5** — emotional wellbeing. 5 items, 0–5. `raw × 4`.
2. **PSS-10** — stress → **Calm** overlay. 10 items, 0–4. `100 − (raw/40 × 100)` (inverted).
3. **UCLA-3** — loneliness → **Relationships**. 3 items, 0–2. `100 − (raw/6 × 100)` (inverted).
4. **GSE** — agency. 10 items on the **published 1–4 anchors**. `((raw − 10) / 30) × 100`.
5. **PROMIS Meaning & Purpose (4a)** — 4 items, 0–4. `(raw/16) × 100`.
6. **CFPB-5** — financial wellbeing. 5 items, 0–4. `100 − (raw/20 × 100)` (inverted).

### Optional
7. **Diener Flourishing** — growth. 8 items, 1–7. `((raw − 8) / 48) × 100`.
8. **INS** — nature connectedness. 1 item, 1–7. `((raw − 1) / 6) × 100`.
9. **SWLS** — life satisfaction. 5 items, 1–7. `((raw − 5) / 30) × 100`. External-validity check only — not a W dimension.

### Composites (no dedicated instrument)
- **PH (Physical Ease)** — weighted mean: sleep quality (0.35), body movement (0.30), WHO-5 "rested" (0.20), WHO-5 "vigour" (0.15); weights renormalize when a component is skipped.
- **EN (Energy & Engagement)** — mean of WHO-5 items 3 and 5, scaled to 0–100.

### Unified InstrumentScreen
All optional instruments (GSE, PROMIS, CFPB-5, Diener, INS, SWLS) render through `InstrumentScreen.jsx`. The instrument definition in `constants/instruments.js` specifies the questions, Likert anchors, and scoring hints. The screen handles neomorphic slider styling, answer persistence, and completion detection.

---

## Dimensions & Bands

### Pipeline Bands (internal)

| Key | Spec code | Label | Source | Band thresholds |
|---|---|---|---|---|
| `emotional` | EM | Emotional Wellbeing | WHO-5 | ≥70 Thriving · 55–69 Steady · 40–54 Strained · <40 Depleted |
| `calm` | — | Stress & Calm | PSS-10 (overlay) | — |
| `relationships` | RS | Relationships | UCLA-3 | same |
| `accomplishment` | AC | Agency | GSE | same |
| `meaning` | MS | Meaning & Purpose | PROMIS | same |
| `financial` | FW | Financial Peace | CFPB-5 | same |
| `growth` | IG | Growth & Flourishing | Diener FS | same |
| `environment` | EC | Nature & Environment | INS | same |
| `physical` | PH | Physical Ease | Composite | same |
| `energy` | EN | Energy & Engagement | Composite | same |

### Report Band Words (v4.0 Rulebook, mapped by `enrich.py`)

| Internal band | Report band word |
|---|---|
| Thriving (≥70) | **Strong** |
| Steady (55–69) | **Steady** |
| Strained (40–54) | **Under pressure** |
| Depleted (<40) | **Running on empty** |

Users are never shown a number — only band words and coarse-position words (`lower / middle / higher`).

---

## API Endpoints

### 1. Health Check — `GET /`
```json
{"status": "success", "message": "LEWIS Core Engine is online"}
```

### 2. Quick Pulse — `POST /pulse/calculate`
WHO-5-based check-in with optional LLM-voiced reflection.
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
Requires `is_over_18: true` (403 otherwise). Key response fields:

```json
{
  "status": "success",
  "schema_version": "1.1",
  "insight_report": {
    "pages": [
      {
        "number": 1,
        "part": "Cover",
        "eyebrow": "LIFED / YOUR LEWIS REFLECTION",
        "title": "Your Lewis Reflection",
        "subtitle": "…",
        "blocks": [{ "type": "cards", "items": [...] }]
      }
    ]
  },
  "dimensions": {
    "emotional": {"label": "Emotional Wellbeing", "score": 48.0, "band": "Strained", "position": "lower"},
    "…": "… all 10 keys …"
  },
  "leverage": {
    "dimension": "financial",
    "label": "Financial Peace",
    "headline": "Financial pressure is the area most closely linked…"
  },
  "bright_spot": {"dimension": "meaning", "label": "Meaning & Purpose"},
  "safety": {"flags": [], "care_note": null},
  "prescription": {"habit_title": "The Micro-Budget Check", "micro_action": "…"},
  "narrative": "… legacy Road A narrative …",
  "narrative_source": "road_a",
  "similarity": {
    "corpus_version": "synthetic_seed_v1",
    "corpus_is_synthetic": true,
    "matched": true
  },
  "patterns": ["…"],
  "portrait": {"id": "…", "label": "…"}
}
```

### 4. Auth — `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /auth/logout`
Standard JWT-based auth against Supabase PostgreSQL / SQLite fallback.

### 5. Onboarding Analytics — `GET /analytics/onboarding`
Aggregate LEWIS activity metrics for the Onboarding system, via the `lewis_onboarding_analytics_summary` PostgreSQL view.

---

## Scoring & Analysis Logic

### Bright Spot
The highest-scoring scored dimension — always named first in the report (strength before struggle).

### The W-Matrix Leverage Engine

```
L(i)        = (100 − score(i)) / 100
Leverage(i) = L(i) · (Σⱼ W[i][j]·L(j) − 0.7·Σⱼ W[j][i]·L(j)) · PressureBonus(i)
```

- **Lowness gate**: only dimensions with score ≤ 55 can be named; a balanced profile gets no leverage point.
- **Separation gate**: if the top two are within 25%, both are named as a pair.
- **Pressure bonus**: ×1.25 when a named active pressure corroborates the dimension.
- `calm` is not a leverage candidate.
- **Validated**: the engine reproduces all 10,000 corpus rows; a 500-row regression test guards this permanently.

### Pattern Engine
`pattern.py` computes the LWI (overall reading + shape), texture patterns (stress load, recovery), and selects a state **portrait**; results feed `enrich.py` and appear in the report.

### Enrichment (`enrich.py`)
Maps pipeline outputs to the rulebook enriched object:
- Nine report areas → v4.0 band words
- `read_type` per dimension (clear / supported / early) → firmness of voice
- Licensed connections from `patterns[].connects`
- Distress tier from `safety.distress`
- Commerce cap from financial strain / safety flags
- Handoff: `lead_with` (down-regulation / normalisation / activation), `primary_focus`, `habit_sizing`

---

## Safety & Guardrails

- **Age gate**: frontend hard-stops self-identified minors; API independently rejects `is_over_18 != true` with 403.
- **Gentle mode** (`safety.py`): severe depletion suppresses leverage, Road B, and the programs page; routes grounding habit; returns `care_note` rendered above all content.
- **Report gate** (`report_gate.py`): runs the §17 self-check on every report before response — no em/en dashes, no instrument names, no score digits, no clinical vocabulary, required blocks verified.
- **Language validator** (`validator.py`): every Road B output is scanned and discarded on any failure.
- **Transport guardrails** (`security.py`): per-IP rate limiting, request body cap, security headers; CORS wildcard origins are rejected.
- **No persistence**: journey answers are never stored server-side. Only de-identified report data is stored (via `auth.py`).

---

## Similarity Corpus Engine

`corpus.py` implements V1 (rule-based) over the 10,000-profile synthetic seed corpus:

- **State-only vector**: 9 dimension scores + leverage + nervous-system state + readiness + support preference. **Demographics and safety flags raise `ValueError` if they ever reach the vector** (enforced by tests).
- **Similarity**: `0.50·score_sim + 0.20·state_sim + 0.15·friction_sim + 0.15·pref_sim`.
- **k-NN**: k = 40, k_min = 30, similarity floor 0.50 (all env-tunable).
- **Neutral priors**: every corpus row is `is_synthetic` — no outcome claim is ever drawn.
- **Coarse positions**: per-dimension corpus terciles produce `lower / middle / higher` words only.

---

## Narrative System (Road A / Road B)

**Road A** (`narrative.py`) — the deterministic legacy narrative, always rendered in the `narrative` field.

**Road B** (`llm.py`) — optional voicing of the legacy narrative by Nemotron via NVIDIA NIM. Every failure path falls back to Road A. `narrative_source` in the response tells you which shipped.

> ⚠️ The **25-page Insight Report** (`insight_report`) is generated by `insight_report.py` — not by Road A/B. The LLM plays no role in report generation.

### Voice & Language Charter (validator + report gate)
- Second person ("you"); LEWIS in third person; never "I"/"we".
- Non-clinical: no diagnosis/screening/risk words.
- **No numbers, scores, percentages, or instrument names** in report body (pages 1–23).
- Coarse positions voiced as words only.
- Report band words only: Running on empty / Under pressure / Steady / Strong.

---

## Insight Report System (v4.0)

### Generation Contract (v4.0 Rulebook — `doc/LEWIS_Insight_Report_Generation_Rulebook_v4.0_FINAL.md`)

The report is **twenty-five pages in six parts**, behind a cover and contents page:

| Part | Pages | Contents |
|---|---|---|
| Front matter | 1–2 | Cover (name, date, nine-petal picture) + Contents |
| Part 1 · Orientation | 3–4 | How to read + The four band words |
| Part 2 · Your picture | 5–8 | Where you are + What it's telling you + Nine-petal wheel + Area table |
| Part 3 · How it connects | 9–12 | Connections diagram + Reading + Stress + Tension |
| Part 4 · A closer look | 13–15 | Three closer-look pages (by leverage relationship) |
| Part 5 · Your plan | 16–21 | Pathway + Anchor practice + 7 days + Supports + Choosing + Programs |
| Part 6 · After this | 22–25 | 30-day experiment + What stands behind + Appendix (×2) |

### Report CSS System (`report.css`)

The report design system is entirely in CSS. Key elements:

| Class | Purpose |
|---|---|
| `.ir-root` | CSS variable scope (palette, fonts, print overrides) |
| `.ir-page` | A4 page frame: `aspect-ratio: 210/297`, `max-width: 840px` (screen); `210mm × 297mm` (print) |
| `.ir-page-head` / `.ir-page-foot` | Running header + footer with page number |
| `.ir-eyebrow` | Teal uppercase label (part name, page-of-N) |
| `.ir-title` / `.ir-subtitle` | Page title typography |
| `.ir-card` / `.ir-callout` | Card and callout containers |
| `.ir-columns` | 2-column green/amber tinted comparison layout |
| `.ir-petals` | SVG petal wheel container |
| `.ir-reach-row` | 3-column progress bar row (name → bar → label) |
| `.ir-band-row` | 3-column band list row with step-meter bars |
| `.ir-practice` | 3-column practice experiment box |
| `.ir-sevendays` / `.ir-day` | 7-day guide grid |
| `.ir-program-card` | 2-column program card (image + body) |
| `.ir-cta` | Green gradient call-to-action banner |
| `.ir-colophon` | Final signoff block |

Print CSS: `@page { size: 210mm 297mm; }` + `break-inside: avoid !important` on all block containers.

### Self-Check Gate (`report_gate.py`)

Runs before every response. Failures return a gate error rather than an unchecked report:

- Zero em-dashes and en-dashes in the entire document
- No instrument names, author-year citations, or internal labels (pages 1–23)
- No score digits, confidence values, or percentile numbers
- Only the four permitted band words
- Required structural blocks present: season-not-type (p3/p5), single-sitting caveat (p10), why-the-plan-is-small (p16), lapse guidance (p17 + p22), privacy statement (p23), free-path-first (before p21), how-to-read appendix (p24/p25)
- Commerce cap honoured (programs page suppressed or softened per `commerce.cap`)

---

## Data Models

### FullAssessmentInput (key fields)
```json
{
  "is_over_18": true,
  "name": "Meera Nair",
  "location": "Mumbai",

  "who5":   [4, 3, 5, 2, 3],
  "pss10":  [2, 1, 3, 2, 1, 2, 3, 2, 1, 2],
  "ucla3":  [1, 2, 0],
  "gse":    [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
  "promis": [4, 3, 4, 3],
  "cfpb5":  [2, 1, 3, 2, 1],

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
  "current_environment": "Anywhere",
  "flags": []
}
```

Notes:
- `is_over_18` is **required** (403 otherwise).
- `name` and `location` are optional context — used in the cover page, never in scoring.
- `diener` / `swls` are **arrays** (1–7 anchors).
- `gse` uses the published **1–4 anchors**.
- `flags` is the friction taxonomy array from `Stage7_8FrictionScreen`.
- Context fields shape tone and suggestions only — they can never move a score.

---

## Installation & Setup

### Backend
```bash
cd backend
python -m venv ..\\.venv && ..\\.venv\\Scripts\\activate   # Windows
pip install -r requirements.txt
```

Create `backend/.env`:
```env
# Supabase PostgreSQL
DATABASE_URL=postgresql://postgres.XXXX:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_URL=https://XXXX.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Security
LEWIS_ANON_SALT=LEWIS_SECURE_ANON_SALT_2026_V1
FRONTEND_URL=http://localhost:5173,https://lewis.cold-forest-a8ec.workers.dev

# Optional AI / corpus switches
NVIDIA_API_KEY=your_nvidia_nim_key      # omit → Road A only
LEWIS_ENABLE_LLM=false
LEWIS_LLM_MODEL=nvidia/nemotron-3-super-120b-a12b
LEWIS_LLM_REPORT_MAX_TOKENS=8000
LEWIS_LLM_PULSE_MAX_TOKENS=3000
LEWIS_SIM_K=40
LEWIS_SIM_K_MIN=30
LEWIS_SIM_FLOOR=0.50
```

Run and test:
```bash
uvicorn main:app --reload --port 8000   # Swagger at /docs
python -m pytest tests -q              # 95 tests
```

### Frontend
```bash
cd frontend
npm install
# frontend/.env → VITE_API_URL=http://localhost:8000
npm run dev                            # localhost:5173
```

---

## Usage Example

```bash
curl -X POST "http://localhost:8000/assessment/full" \
  -H "Content-Type: application/json" \
  -d '{
    "is_over_18": true,
    "name": "Test User",
    "who5": [4, 3, 5, 2, 3],
    "pss10": [2, 1, 3, 2, 1, 2, 3, 2, 1, 2],
    "ucla3": [1, 2, 0],
    "gse": [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
    "promis": [4, 3, 4, 3],
    "cfpb5": [2, 1, 3, 2, 1],
    "max_time_available": 5,
    "current_environment": "Desk",
    "flags": []
  }'
```

The response will include `insight_report.pages` — 25 pages of structured block JSON ready for the `<InsightReport>` component.

---

**Last Updated**: 1 August 2026 (v1.4.0)
**Status**: Active development — pilot-readiness gates tracked in `NEW_UPDATES.md`
