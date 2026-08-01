# LEWIS - Developer Learning Guide (v1.4.0)

Welcome to the **LEWIS Core Engine**! This guide helps you understand the project architecture, tech stack, and how the pieces fit together so you can start contributing effectively.

> The authoritative product specs live in `doc/` (Scoring Constitution, Layer 3–6 specs, Insight Report Generation Rulebook v4.0, Narrative System, Safety & Guardrails, Similarity Mapping). When this guide and a locked spec disagree, the spec wins — raise it rather than coding around it.

---

## 🌟 1. High-Level Overview

LEWIS (The Lifed Everyday Wellbeing Intelligence System) is a full-stack, **non-clinical wellbeing reflection** tool.

- It scores users across **9 life dimensions** (PH physical, EM emotional, EN energy, RS relationships, MS meaning, AC agency, FW financial, IG growth, EC environment) plus a stress/calm overlay (PSS-10), each normalized 0–100 and banded as **Running on empty / Under pressure / Steady / Strong** (the v4.0 report band words).
- A **W-matrix leverage engine** finds the *connection point* where a small change goes furthest — explicitly a connection, never a "root cause" (validated against the 10,000-profile synthetic corpus: 10,000/10,000 reproduced).
- Reports are **deterministic first**: the backend generates a complete 25-page enriched JSON report from `insight_report.py` with no LLM. Road B (Nemotron via NVIDIA NIM) only *re-voices* the legacy `narrative` field, and its output is discarded by a fail-closed validator on any rule violation.
- A **similarity corpus engine** maps each completion against a 10k synthetic seed corpus (state-only, never demographics) to add coarse-position context; effectiveness priors stay neutral until real consenting users exist.
- A **safety lattice** overrides everything: minors are hard-stopped, severe depletion triggers gentle mode (no leverage, no Road B, grounding habit, care note).
- A fully redesigned **25-page A4 Insight Report** is rendered in the browser as paper-style pages (`InsightReport.jsx` + `report.css`) and downloadable as PDF.

---

## 🛠️ 2. Tech Stack

**Frontend:**
- **React + Vite** — screens rendered by a state machine, not a URL router.
- **Framer Motion** — calming enter/exit and breathing animations. ⚠️ Gotcha: CSS keyframe animations override framer-motion's inline transforms — never rely on `translate` centering on an element that also has a CSS `animation` (see the breathing-orb fix in `Stage3_4BreathingScreen.jsx`).
- **Zustand** (`useLewisStore.js`) — holds every answer across the ~50 stage screens; `reset()` restores the full initial state.
- **Vanilla CSS** (`index.css` for journey UI, `report.css` for the Insight Report).
- **`InsightReport.jsx` + `report.css`** — the 25-page A4 report renderer. Every block type has a CSS class; no inline styles in JSX. Block types: `cards`, `columns`, `checklist`, `callout`, `table`, `certainty`, `petals` (SVG), `map` (SVG), `connections` (SVG nodes), `bandladder`, `reach`, `rhythm` (SVG), `timeline`, `loadbar`, `bodymap` (SVG), `flow`, `area`, `practice`, `steps`, `sevendays`, `supports`, `program`, `cta`, `colophon`, `row`.
- **`icons.jsx`** — a consistent set of SVG line icons used throughout the report (compass, check, info, clock, leaf, etc.).
- **`InstrumentScreen.jsx`** — unified screen for all psychometric instruments (GSE, PROMIS, CFPB-5, Diener, INS, SWLS), replacing six separate files.
- **`constants/instruments.js`** — instrument definitions (questions, labels, scoring hints) consumed by `InstrumentScreen`.

**Backend:**
- **FastAPI + Pydantic + Uvicorn** — strict input validation and pipeline processing.
- **Supabase Cloud + Local SQLite Fallback (`auth.py`)** — dual-mode database engine. Uses PostgreSQL (`lewis_` table namespace) when `DATABASE_URL`/`SUPABASE_URL` are present, with fallback to SQLite (`lewis_users.db`) / memory mode.
- **OpenAI SDK pointed at NVIDIA NIM** (`llm.py`) — model `nvidia/nemotron-3-super-120b-a12b`, a *reasoning* model: token budgets must cover thinking + answer, and truncated responses are discarded.
- **Stdlib-only corpus engine** (`corpus.py`) — csv/math/heapq; no pandas at runtime.

---

## 📂 3. Codebase Structure Walkthrough

### Frontend (`/frontend/src`)

- **`App.jsx`** — the single source of truth for routing: the `SCREENS` map and `SCREEN_ORDER` array. *A screen file that isn't registered here is dead code.*
- **`screens/`** — the journey (~50 screens): `PreStage0Age` (minor hard-stop → `AgeStopScreen`) → Stages 1–10 → `MirrorScreen` (results + report).
  - `InstrumentScreen.jsx` — unified Likert/slider screen for GSE, PROMIS, CFPB-5, Diener FS, INS, SWLS.
  - `Stage3_6BodyAwarenessScreen.jsx` — body awareness / load indicator.
  - `Stage9QuickChoicesScreen.jsx` — friction and support preference intake.
- **`report/InsightReport.jsx`** — renders the `insight_report` JSON as interactive A4 paper pages. Block dispatch via `<Block block={b} />` switch. Each block component (Cards, Columns, Checklist, Callout, Petals, DayRhythm, Reach, etc.) is a pure presentational component.
- **`report/report.css`** — the entire report design system: CSS variables (LIFED teal/sage palette, Nunito + IBM Plex Mono), `.ir-page` A4 layout (screen: `aspect-ratio: 210/297`, print: `210mm × 297mm`), toolbar, cover, all block styles, and `@media print` rules.
- **`report/icons.jsx`** — SVG icon components. Every icon size is passed as a `size` prop.
- **`constants/instruments.js`** — instrument definitions for `InstrumentScreen`.
- **`lib/payload.js`** — `buildFullAssessmentPayload` maps the store to the API schema. If you add an intake screen, wire its field here or the backend never sees it.
- **`store/useLewisStore.js`** — global state. `reset()` wipes all journey fields.

### Backend (`/backend`)

- **`main.py`** — the API endpoints and pipeline order:
  `validate → age gate → score → dimensions → safety → leverage → patterns/portrait → similarity → habit → enrich → 25-page report → gate → Road A narrative → optional Road B → validator → response`.
- **`enrich.py`** — builds the §3 enriched object (the rulebook contract input). Maps pipeline outputs to: nine report areas, v4.0 band words, read_type per dimension, licensed connections, distress tier, commerce cap, handoff (lead-with / focus / habit sizing).
- **`insight_report.py`** — the 25-page deterministic generator. Covers all six parts: cover → contents → orientation → picture → connections → closer-look → plan → after-this → appendix. Produces structured JSON blocks; the frontend renders them.
- **`report_gate.py`** — the §17 self-check gate. Run on every report response: zero em/en dashes, no instrument names, no score digits, no clinical vocabulary, required structural blocks verified (season framing, single-sitting, why-small, lapse guidance, privacy statement, free-path-first).
- **`auth.py`** — User registration/login, session tokens, zero-PII report de-identification (`ANON-SUBJ-...`), Supabase PostgreSQL / REST API integration.
- **`scoring.py`** — instrument normalization (all wellbeing-polarity: PSS-10/UCLA-3/CFPB-5 inverted at source), PH/EN composites, `band_for`, bright spot, and the **W-matrix leverage engine**.
- **`corpus.py`** — the similarity engine over `data/lewis_10000_scores.csv`: state-only k-NN (k=40, k_min=30), demographics/safety **raise ValueError** if they ever reach a vector, coarse-position terciles.
- **`pattern.py`** — Layer-4 pattern engine (LWI, texture patterns, portrait selection).
- **`narrative.py`** — Road A legacy narrative (still in the response as `narrative` field; the new report lives in `insight_report`).
- **`llm.py`** — Road B voicing of the legacy narrative; every failure path returns `None` so callers fall back to Road A.
- **`validator.py`** — fail-closed regex gate every Road B output must pass.
- **`safety.py`** — distress flags and gentle mode.
- **`security.py`** — `GuardrailMiddleware`: rate limiting, body-size cap, security headers, global `SensitiveDataFilter` log masking.
- **`content.py`** — the SMALL-habit catalog, routed by leverage dimension key.
- **`data/`** — the 10k synthetic seed corpus (canonical CSV).
- **`tests/`** — pytest suite (95 tests), including insight report gate tests across five profile shapes.

---

## 🧠 4. Core Mechanics: How an Assessment Works

1. **Collection**: screens save to Zustand; the Mirror screen calls `buildFullAssessmentPayload` and blocks submission listing any incomplete instruments.
2. **Gate**: `is_over_18` must be `true` or the API returns 403.
3. **Scoring**: instruments → 0–100 wellbeing-polarity scores → 10 dimension entries with band words.
4. **Safety first**: `evaluate_safety` may set gentle mode — leverage is suppressed, Road B skipped, grounding habit returned, care note rendered above everything in the UI.
5. **Leverage**: the W-matrix engine names the connection point (or a pair, or nothing for a balanced profile).
6. **Patterns & similarity**: the pattern engine adds texture + portrait; the corpus engine adds per-dimension `position` words.
7. **Enrichment**: `enrich.py` builds the v4.0 enriched object — the rulebook contract.
8. **Report**: `insight_report.py` generates the 25-page JSON deterministically. `report_gate.py` self-checks it. The frontend renders it as A4 pages.
9. **Legacy narrative**: Road A is still built as `narrative`; Road B re-voices it only if enabled, un-truncated, and validator-approved.

### How the Report Renders (Frontend)

```
MirrorScreen (receives JSON)
  └─ <InsightReport pages={report.pages} />
       └─ {pages.map(page => <ReportPage page={page} />)}
            └─ {page.blocks.map(block => <Block block={block} />)}
                 └─ switch(block.type) → Cards | Columns | Petals | Reach | ...
```

Each block component is stateless. All visual design is in `report.css`. Print CSS (`@media print`) sets exact A4 dimensions and `break-inside: avoid` on every block.

---

## 🚀 5. Getting Started Locally

**Backend:**
```bash
cd backend
..\\.venv\\Scripts\\activate        # Windows (repo-root venv)
pip install -r requirements.txt
# .env: NVIDIA_API_KEY=...  FRONTEND_URL=http://localhost:5173
uvicorn main:app --reload --port 8000
python -m pytest tests -q        # 95 tests must stay green
```

Useful env switches: `LEWIS_ENABLE_LLM=false` (Road A only), `LEWIS_LLM_REPORT_MAX_TOKENS`, `LEWIS_SIM_K` / `LEWIS_SIM_K_MIN` / `LEWIS_SIM_FLOOR`.

**Frontend:**
```bash
cd frontend
npm install
npm run dev                      # localhost:5173
```

`frontend/.env` → `VITE_API_URL` must point at your local backend.

---

## 💡 6. Key Development Rules to Remember

- **Never diagnose.** No condition words, no numbers/percentiles in any user-facing narrative — band words and coarse-position words only. The validator and report gate enforce this; don't weaken them.
- **Connection, not causation.** It's a "leverage point", never a "root driver/cause". Copy must disclaim causation.
- **Safety overrides everything.** Gentle mode suppresses leverage and Road B — never route around it.
- **The LLM is a voice, not a source of truth.** It receives bands and context only (raw scores never), and any doubt falls back to Road A.
- **Similarity matches on state, never on who someone is.** Demographics and safety flags must never enter a vector; the code raises if they do.
- **Check `App.jsx` before trusting a screen file**, and wire new intake fields through `payload.js`.
- **Every report block needs a CSS class in `report.css`.** The JSX block components are presentational — layout, spacing, typography, and colour all live in CSS.
- **Icons use `<Icon name="..." size={N} />` from `icons.jsx`.** Don't embed raw SVG in block components.
- **InstrumentScreen is the single source for Likert scales.** Adding a new instrument means adding to `constants/instruments.js` and routing it in `App.jsx` — not creating a new screen file.
- **Agentless AI:** LEWIS speaks to "you", refers to itself in third person, never "I"/"we".
- **Report band words are fixed by the v4.0 rulebook:** Running on empty / Under pressure / Steady / Strong. The internal pipeline still uses Thriving / Steady / Strained / Depleted — `enrich.py` maps them at the boundary.
