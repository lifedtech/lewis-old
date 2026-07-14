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
