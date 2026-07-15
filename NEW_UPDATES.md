# LEWIS Core Engine - Updates (Version 1.2.0 - 14 July 2026)

The 10,000-profile synthetic seed corpus (`doc/lewis_10000_scores.xlsx`, new spec set of 14 July) is now wired into the engine. Full analysis + plan: artifact "The 10,000-Profile Corpus: Analysis & Implementation Plan".

## 1. Spec-exact W-matrix leverage engine (`backend/scoring.py`)
- The flat 6-dimension weight table is replaced by the locked Layer-3 §9 engine over the full v1 influence matrix W (Resolutions C1): `Leverage(i) = L(i)·(Σ W[i][j]·L(j) − 0.7·Σ W[j][i]·L(j)) · PressureBonus(i)`, lowness gate L ≥ 0.45 (score ≤ 55, now inclusive — matching the corpus), separation gate (top-two within 25% → named as a pair via new `secondary`/`secondary_label` fields), ×1.25 pressure bonus from `active_pressures` (conservative keyword map; workload deliberately unmapped per the spec's worked trace).
- Physical, Energy, Growth and Environment can now win leverage (previously impossible; the corpus says PH wins 25.4% of the time). `calm` (PSS-10) is no longer a leverage candidate — in the locked spec stress feeds the EM composite rather than standing alone.
- **Validated against the corpus generator: 10,000/10,000 rows reproduced** (97.3% exact; the remaining 2.7% are exactly the rows where the generator's unrecorded pressure bonus fired — verified case-by-case). A 500-row regression test now guards this.
- `content.py` gains SMALL habits for the newly reachable `physical` (h4) and `energy` (h5) leverage dimensions.

## 2. Similarity corpus engine, V1 rule-based (`backend/corpus.py`, new)
- Loads `backend/data/lewis_10000_scores.csv` (canonical CSV generated from the xlsx; the byte-different but content-identical `doc/lewis_10000_scores(1).xlsx` duplicate was removed). Stdlib-only, ~90 ms warm per request including the 10k k-NN.
- Implements the locked V1 spec: state-only vector, block similarity `0.50·score + 0.20·state + 0.15·friction + 0.15·pref` (weights renormalise over the blocks a live user can populate), k-NN k=40, k_min=30 floor, SIM_FLOOR 0.50 (all env-tunable), fallback to archetype-level context below the floor.
- **Hard invariants enforced in code + tests**: demographics and safety flags raise `ValueError` if they ever reach the vector; effectiveness priors are neutral (`{}`) because every corpus row is `is_synthetic` — no outcome claim is ever drawn from synthetic rows. The engine is read-only over scores/bands/leverage/safety.
- Coarse-position service: per-dimension corpus terciles → `lower/middle/higher` words only.

## 3. Report wiring (`main.py`, `llm.py`)
- Every scored W dimension in the response now carries a `position` word; the response gains a `similarity` block (corpus version, synthetic flag, matched/neighbour count, neutral priors + note).
- Road-B voicing receives `coarse_positions` and a new prompt rule: positions may be voiced only as words ("in the lower/middle/higher part of the range seen across many check-ins"), never a number/rank/percentile. Road A is untouched and remains complete without the LLM.
- Verified live: Road A path 200 in ~90 ms warm; Road B path returns `narrative_source: road_b`, digit-free, using the allowed range wording. All 66 backend tests pass (17 new in `tests/test_corpus.py` + leverage W-matrix tests).

## 4. Band vocabulary aligned to the locked spec (F3 — decided)
- `band_for` now returns **Thriving / Steady / Strained / Depleted** (thresholds unchanged: 70/55/40), matching the corpus and the Layer-3 spec. All consumers updated together: `narrative.py` BAND_PHRASES/BRIGHT_SPOT_LINES, the Road-B prompt band words in `llm.py`, and the band boundary tests.

## 5. Pattern engine, first cut (`backend/pattern.py`, new)
- Initial implementation of the Layer-4 pattern engine (LWI, texture patterns, portrait selection) wired into `/assessment/full`; the response now carries `patterns` and the selected portrait feeds the similarity state (portrait/stress_pattern keys are accepted but not yet used by the vector — vocab alignment with the corpus labels is the next step).
- Frontend gains `Stage7_8FrictionScreen` in the journey (start of the friction-taxonomy intake, gap F4).

## 6. UI & docs
- **Breathing orb centered** (`Stage3_4BreathingScreen.jsx`): the `.orb` CSS keyframe animation was overriding framer-motion's inline `translate(-50%,-50%)` every frame, pinning the orb's corner at the ring's center. Now centered via `inset: 0; margin: auto` (transform-free, size-independent) with the CSS animation disabled so the phase-synced framer scale drives the breathe pulse.
- **`learning_doc.md` and `lewis doc.md` rewritten for v1.2.0**: both still described the pre-v1.1.0 system (Llama 3.1 via Hugging Face, "Cascade Matrix"/"root driver", old payload/response shapes). They now document the actual engine: Road A/B + validator, W-matrix leverage, safety lattice, similarity corpus, pattern engine, current API schema and env vars.

## Known decisions deliberately NOT made silently (need product sign-off)
- EM composite: locked spec defines EM = 0.80·invPSS10 + 0.20·WHO5-mood (stress inside EM, no standalone "calm"); backend keeps emotional=WHO-5 + calm=PSS-10 as separate dimensions.
- Missing corpus companions: `lewis_10000_profiles.jsonl` / `lewis_10000_reports.jsonl` are named in the Dataset Summary but absent from `doc/` — needed for report-QA benchmarking.
- No fine-tuning on the corpus: circular synthetic data; the constitution restricts learning to soft priors and wording.

---

# LEWIS Core Engine - Updates (Version 1.1.1 - 14 July 2026)

Follow-up pass completing the frontend integration that v1.1.0 left unwired:

## 1. Frontend actually connected to the new API
- **`MirrorScreen.jsx` now uses `buildFullAssessmentPayload`** (`frontend/src/lib/payload.js`) instead of its old inline mapper. The old mapper omitted the now-required `is_over_18`, sent `diener`/`swls` as objects where the API expects arrays, and looked up wrong item keys (`w1`/`p1`/`u1` vs. the screens' actual `q0…`), silently zeroing WHO-5, PSS-10 and UCLA-3 — every submission 422'd. Verified end-to-end: payload.js output → `/assessment/full` → 200 with all 10 dimensions scored.
- **Missing-answer handling**: if any instrument is incomplete, the Mirror screen now shows which check-ins still need answers with buttons back to those screens, instead of submitting corrupt data.
- **GSE offset fixed in `payload.js`**: GSE is the one instrument the API takes on its published 1-4 anchors; payload.js was sending 0-based indices (a "Not at all true" answer would 422, all others were shifted down one step).

## 2. Safety care note rendered
- `MirrorScreen.jsx` now renders `safety.care_note` (the gentle-mode support pointer) in a dedicated card above everything else. Previously the API returned it and the UI never showed it.

## 3. AI narrative (Road B) actually generating
- **Frontend was calling the stale Render deployment**: `frontend/.env` pointed `VITE_API_URL` at `https://lewis-6xba.onrender.com` (pre-v1.1.0 code), so every assessment call failed. Now points at the local backend; redeploy Render before pointing back.
- **Token budget fix in `llm.py`**: Nemotron is a reasoning model; the old caps (1800 report / 200 pulse) truncated it mid-reasoning, chain-of-thought leaked into `content`, and the validator rejected every Road B attempt — users always got the Road A template. Budgets raised (8000/3000, env-tunable via `LEWIS_LLM_REPORT_MAX_TOKENS` / `LEWIS_LLM_PULSE_MAX_TOKENS`), truncated responses (`finish_reason=length`) are now discarded fail-closed, and inline `<think>` blocks are stripped defensively. Verified live: `/assessment/full` returns `narrative_source: road_b`.

## 4. Store hygiene
- **`reset()` completed** in `useLewisStore.js` — it previously reset only `currentScreen` and `isOver18` (with a literal "reset rest to initial..." placeholder); it now restores every journey field, so the AgeStop screen's "Return to the start" and any future retake genuinely wipe state.
- **Orphans deleted**: `screens/AgeGateScreen.jsx` (unrouted duplicate age gate that navigated to a nonexistent `'profile'` screen) and the entire legacy `pages/` flow (Landing/Phase1-6/NavButtons + css modules), none of which were imported anywhere.

---

# LEWIS Core Engine - Updates (Version 1.1.0 - 10 July 2026)

The following changes were made today to align the codebase with the official LEWIS Master and Engineering Build Documents:

## 1. Safety & Eligibility Gates
- **Minor Age Gate Fix**: Corrected the branching logic in `frontend/src/screens/PreStage0AgeScreen.jsx`. Self-identified minors (under 18) are now correctly hard-stopped and routed to the `ageStop` screen without advancing to data collection or retaining any state.
- **Removed Orphaned Result Screens**: Permanently deleted the unused `frontend/src/pages/Results.jsx` and `Results.module.css` files, which contained permanently-fake dimensions and posed a risk of accidental reconnection.

## 2. Scoring & Formulas
- **UCLA-3 Polarity Inversion**: Fixed `calculate_ucla3` in `backend/scoring.py` to invert the score at the source (`100 - loneliness`). All dimensions are now passed to the frontend in a standardized "wellbeing polarity" (higher is better).
- **GSE Scale Correction**: Updated the GSE normalizer in `scoring.py` to use the standard, validated 1-4 scale `(100 * (raw - 10) / 30)`. The `main.py` Pydantic schema and the frontend mapper in `MirrorScreen.jsx` were also updated to securely handle and validate the 1-4 response indices. The `test_scoring.py` unit tests were updated to cover these bounds.
- **Physical (PH) and Energy (EN) Composites**: Built out the missing composite formulas directly from the Engineering Build Document (Section 7). 
  - `calculate_ph` now synthesizes `sleepQuality`, `bodyMovement`, WHO-5 item 4 (rested), and WHO-5 item 3 (vigour) with explicit weights.
  - `calculate_en` derives energy accurately using WHO-5 items 3 and 5.

## 3. Dimension & Narrative Delivery
- **9 Dimensions Wired**: The `build_dimensions` engine in `backend/main.py` was updated to accurately map all 10 keys (including the 9 core dimensions). It now passes the fully-scored `PH` and `EN` composites to the frontend rather than leaving them unscored.
- **Leverage Engine / Root Driver framing**: Renamed the "root driver" fields to "leverage" internally, ensuring all generated copy treats it as a connection area rather than a causal driver. Implemented a `LEVERAGE_GATE = 55` threshold so that thriving users are no longer assigned a false focus area.
- **Frontend Presentation Sync**: Modified `frontend/src/screens/MirrorScreen.jsx` to map directly to the newly corrected dimension keys (e.g., `emotional`, `calm`, `financial`). Removed all legacy frontend `100 - x` score inversions. Corrected the LLM insight report field to safely render the deterministic Road A fallback (`analysis?.narrative`) instead of the unvalidated `ai_narrative`.
