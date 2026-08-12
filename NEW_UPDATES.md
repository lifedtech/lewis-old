# LEWIS Core Engine - Updates (Version 1.4.1 - 12 August 2026)

Frontend-only release: the marketing landing page is rebuilt end-to-end from a new reference spec, typography is unified app-wide, and the assessment progress indicator is simplified.

## 1. Landing Page Redesign (`frontend/src/screens/LandingScreen.jsx`, `landing.css`)
- Rebuilt from the new **"LEWIS Homepage v2"** marketing spec, added to the repo root as `LEWIS Homepage v2.dc.html` (the design reference — not part of the running app).
- **Domain taxonomy corrected**: the old landing page advertised nine placeholder domains (Sleep & Recovery, Nutrition, Movement, Stress & Resilience, Emotional Balance, Cognitive Health, Social Connection, Purpose & Meaning, Environment) with fabricated demo scores (62, 74, 81…) that never matched what the engine actually scores. Replaced with the real nine areas (`Physical & Regeneration`, `Emotional & Mental`, `Engagement & Energy`, `Relationships & Social`, `Meaning & Spiritual`, `Accomplishment & Agency`, `Financial Wellness`, `Intellectual & Growth`, `Environmental & Cultural`) — matching `useLewisStore` priorities / the Stage 5 Landscape screen. No scores shown pre-assessment.
- New page structure: sticky nav → hero with four pill callouts (12–15 min · nine areas · non-clinical, no diagnosis · adults 18+) → "What is LEWIS" three-card explainer → nine-area grid → "science and research" section → FAQ accordion (8 questions) → final CTA → footer.
- Removed: the old inline contact form (name/email/message state and a fake `setTimeout` submit handler), ambient background orbs, and the marquee ticker — none were in the new spec.
- Pricing stated inline on the page: free to start, ₹399 for the complete (~20-page) report.

## 2. App-Wide Typography Unification
- `IBM Plex Mono` retired everywhere in the frontend — eyebrows, stage labels, report micro-labels — in favour of `Nunito`, now the single typeface across the journey, the report, and the landing page. Touched `index.css`, ~45 journey screen files, and `report/InsightReport.jsx` / `report/report.css`.

## 3. Assessment Progress Indicator Simplified (`App.jsx`)
- The stage header no longer shows the raw `current / 53` screen-count fraction — just the stage name on the left and a `Z%` completion figure on the right, above the progress bar.

## 4. Documentation
- `README.md`, `lewis doc.md` updated to v1.4.1: version bumps, landing page redesign entry, typography note.

---

# LEWIS Core Engine - Updates (Version 1.4.0 - 1 August 2026)

This release delivers the **25-page Insight Report v4.0 redesign**, a **unified InstrumentScreen**, a full **report CSS design system**, and comprehensive **UI standardisation** across all 50 journey screens.

## 1. 25-Page Insight Report — v4.0 Rulebook Complete (`backend/insight_report.py`, `backend/enrich.py`)

The Insight Report is upgraded from 16 pages to the full **25-page format** specified in `doc/LEWIS_Insight_Report_Generation_Rulebook_v4.0_FINAL.md`:

- **Six parts** behind a cover and contents page: Orientation → Your Picture → How It Connects → A Closer Look → Your Plan → After This.
- Every v3.0 crowded page is split into two dedicated pages (e.g., orientation → "How to read" + "The four band words"; connections → "What moves together" + "Reading the connections").
- `enrich.py` upgraded to map all pipeline outputs to the v4.0 enriched object: nine areas with v4.0 band words (Running on empty / Under pressure / Steady / Strong), `read_type` per dimension, licensed connections, distress tier, commerce cap, handoff.
- `insight_report.py` generates all 25 pages as structured JSON blocks: cover, contents, orientation, picture (opening, picture-telling, nine-petal wheel, area table), connections (diagram, reading, stress, tension), closer-look (3 pages), plan (pathway, anchor, 7-days, supports, choosing, programs), after-this (30-day experiment, what-stands-behind, appendix ×2).
- `report_gate.py` updated to verify all new required blocks (season-not-type p3/p5, single-sitting p10, why-small p16, lapse p17+p22, privacy p23, free-path-first before p21).

## 2. Full Report CSS Design System (`frontend/src/report/report.css`)

Complete CSS system for all 25+ block types — 2,300+ lines, zero inline styles in JSX:

- **A4 page layout**: `.ir-page` with `aspect-ratio: 210/297` (screen) and `@page { size: 210mm 297mm; }` (print). `max-width: 840px`, `min-height: 1120px`.
- **Block styles added**: `.ir-reach` (3-column progress bar rows), `.ir-rhythm` (day-curve SVG container with axis labels), `.ir-timeline` (horizontal day segment bar), `.ir-load` (3-step load indicator), `.ir-bodymap` (body contour SVG + word pills), `.ir-flow` (3-step arrow flow diagram), `.ir-area` (deep-dive area with icon tile + band chip), `.ir-practice` (3-column experiment box with tag badge), `.ir-steps` (numbered step sequence), `.ir-sevendays` / `.ir-day` (7-row guide table), `.ir-supports` / `.ir-support` (recommendation cards), `.ir-program-card` (2-column program card with image), `.ir-cta` (green gradient call-to-action banner), `.ir-colophon` (signoff block with LIFED logo).
- **Print rules**: `break-inside: avoid !important` on all block containers. `-webkit-print-color-adjust: exact` on all coloured elements.
- **Badge fixes**: `.ir-conn-start` (START HERE pill) uses `display: inline-flex; align-items: center; justify-content: center; line-height: 1` for pixel-perfect vertical centering.

## 3. Consolidated InstrumentScreen (`frontend/src/screens/InstrumentScreen.jsx`)

Six separate psychometric scale screens (Stage5_2SwlsScreen, Stage5_2GseScreen, Stage5_2PromisScreen, Stage5_2Cfpb5Screen, Stage5_2DienerScreen, Stage5_2Ucla3Screen) replaced by a single unified `InstrumentScreen.jsx`:

- Drives from `constants/instruments.js` — question text, anchors, and scoring metadata in one place.
- Shared neomorphic slider styling, answer persistence, completion detection.
- `constants/instruments.check.js` — completion validators for each instrument.
- Deleted: `Stage5_2SwlsScreen.jsx`, `Stage5_2GseScreen.jsx`, `Stage5_2PromisScreen.jsx`, `Stage5_2Cfpb5Screen.jsx`, `Stage5_2DienerScreen.jsx`, `Stage5_2Ucla3Screen.jsx`.

## 4. Icons System (`frontend/src/report/icons.jsx`)

Dedicated SVG line icon component library for the report:

- Consistent `<Icon name="..." size={N} />` interface.
- Icons: compass, check, info, clock, leaf, zap, shield, link, arrow, target, chart, calendar, heart, star, moon, sun, and more.
- Used throughout all block components — no raw SVG in JSX.

## 5. UI Standardisation & Screen Corrections

Across all 50 journey screens and the report:

- **Page 05 Systemic Map**: `.ir-map-grid` 3-column node grid with connective arrows; `.ir-map-hub` highlighted centre card; `.ir-map-step` action banner callout.
- **Page 06 Columns**: `.ir-columns` side-by-side green & amber tinted cards; `.ir-column-head` flex gap separating icons from titles.
- **Page 07 Petal Wheel**: SVG `viewBox` expanded to `0 0 660 470`, `cx = 330`; `tspan dy="16"` vertical offset corrected; `.ir-band-row` 3-column grid with `.ir-meter` step bars.
- **Page 08 Area Table**: `.ir-table-area` (`display: inline-flex` with 10px gap); `.ir-certainty-cards` 2-column confidence card grid.
- **Page 09 Connections Nodes**: `.ir-conn-cols` 2-column side-by-side grid (`minmax(320px, 1fr)`); `.ir-conn-node` (`justify-content: space-between`, `12px` gap); `white-space: nowrap` on `.ir-conn-name`; `.ir-conn-legend` 3-row legend with line samples.
- **Page 10 Reach Bars**: `.ir-reach-row` 3-column grid (`180px 1fr 140px`) — name, gradient fill bar, right-aligned label.
- **All pages**: removed `page.next` teaser footer block from `ReportPage` component.

## 6. AI Model Update

- Model selection updated to Claude Sonnet 4.6 (Thinking) for agent-assisted development sessions (no change to the LEWIS pipeline model — Nemotron is unchanged).

## 7. Documentation Updates

- `README.md` — rewritten for v1.4.0 with full architecture diagram, feature list, repo layout, version history table.
- `learning_doc.md` — updated for v1.4.0: InstrumentScreen consolidation, report rendering pipeline explanation, icons.jsx, report.css architecture, updated development rules.
- `lewis doc.md` — updated for v1.4.0: new Insight Report System section (25-page structure, block type table, CSS system table, gate checklist), updated data model (name/location/flags), enrichment pipeline, band word mapping table.

## 8. Git Branch Merge

- Merged `ui/complete-assessment-redesign` into `main` (74 files, 12,180 insertions) and deleted the feature branch. Development continues directly on `main`.

---



This release lands **Supabase PostgreSQL cloud database integration**, complete **onboarding database isolation**, **de-identified dataset anonymization**, **enterprise security guardrails**, and **Cloudflare/Railway cloud deployment**.

## 1. Supabase Database Isolation & Schema (`backend/db/supabase_schema.sql`)
- Created an isolated PostgreSQL database schema using the `lewis_` table namespace: `lewis_users`, `lewis_sessions`, `lewis_user_report_vault`, and `lewis_anonymized_insight_reports`.
- **Zero Onboarding Collision**: LEWIS user accounts and session data are strictly isolated from any Onboarding system database tables.

## 2. Onboarding Analytics View (`backend/auth.py`, `backend/main.py`)
- Created PostgreSQL View `public.lewis_onboarding_analytics_summary` and API endpoint `GET /analytics/onboarding`.
- Allows the Onboarding system to query aggregate LEWIS activity metrics (`total_registered_lewis_users`, `total_active_subjects`, `total_assessments_completed`, `last_assessment_time`) without ever accessing user profiles or mixing user accounts.

## 3. Zero-PII De-Identification & Anonymization Engine (`backend/auth.py`)
- Built recursive PII scrubbing engine (`deidentify_data`) that strips names, emails, phone numbers, contact info, and passwords from all answers, scores, and report structures before storing them in system learning tables.
- Generates non-reversible cryptographic subject IDs (`ANON-SUBJ-8F92A1D0`) via `HMAC-SHA256(user_id, ANON_SALT)`.

## 4. Enterprise Security System & Log Masking (`backend/security.py`)
- **Strict Auth Rate Limiter**: Throttles `/auth/login` and `/auth/register` to 5 requests/min per IP.
- **Log Credential Redaction**: Global `SensitiveDataFilter` automatically masks passwords, tokens, API keys, and PostgreSQL connection string passwords (`postgresql://user:***REDACTED_PASSWORD***@host`) from all application logs and tracebacks.
- **Security Response Headers**: Injects `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`, and `Content-Security-Policy`.

## 5. Cloud Deployment Configuration (Railway & Cloudflare)
- **Frontend**: Deployed to Cloudflare Pages (`https://lewis.cold-forest-a8ec.workers.dev`).
- **Backend**: Configured for Railway deployment via `backend/Procfile` & `backend/railway.json` (`uvicorn main:app --host 0.0.0.0 --port $PORT`).
- **Dual-Mode Engine**: Automatically connects to Supabase Cloud when `DATABASE_URL` / `SUPABASE_URL` environment variables are present, with graceful fallback to local SQLite (`lewis_users.db`) / memory mode.

---

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

## 7. Corpus companion files landed & similarity state block completed (F5 — resolved, 15 July)
- `doc/lewis_10000_profiles.jsonl` (enriched objects) and `doc/lewis_10000_reports.jsonl` (Road-A reports) added and fully cross-validated: 10,000 rows each, ids/scores/leverage/portraits/distress 100% consistent with the scores table, all rows `is_synthetic`, zero minor-flagged rows. Only QA nit: 885 reports contain a digit — all from one program name ("7-session Sleep & Recovery Reset"), a duration, not a score.
- The profiles file confirmed the portrait id↔label map (`low_tank` ↔ "Running on a low tank"), unblocking the similarity **state block**: `corpus.py` now matches on the spec's full state_sim set — portrait + leverage + stress pattern + recovery — with pattern.py's reflective labels normalised to corpus vocab. Fixed `main.py` passing the constant `"stress_load_pattern"` instead of the classified label; `recoveryResponsiveness` now feeds the vector. 68 tests pass.

## 8. Report generation reworked to the Narrative System spec (15 July)
- **Road A restructured** (`narrative.py`) to the spec's section skeleton, matching the 10k reference reports: portrait-led opening → What's working → landscape → How it connects (with pair-naming support) → What you care about vs how it feels (priority tension, firmness-gated) → How stress is showing up (stress pattern + recovery phrase + "a reflection to notice, not a test") → Where to start ("almost too small to fail" when prior attempts didn't stick) → Your next seven days (sized by readiness stack) → One gentle note → To sit with (per-leverage open question). The reference corpus speaks as "we"; all templates re-voiced into the agentless register the validator enforces.
- **Pattern engine now reaches the report**: portrait, stress_load, priority_tension, and suggestion_readiness were computed but never rendered — now woven into Road A and passed to Road B's voicing payload (portrait, stress_reflection, priority_tension, plan_size, keep-it-tiny flag).
- **Road B prompt updated** to the same section order plus style rules (full sentences, portrait as a season never a label, landscape grouped by band). Verified live: `road_b`, validator-passing, digit-free, coarse positions voiced correctly.
- **Vocab fix in `pattern.py`**: stress/readiness rules compared `nervousSystemState` against `activated/collapsed` but the intake sends `sympathetic/dorsal/ventral` — the stress pattern could never fire. Mapped at the engine boundary.
- **Habit catalog digits spelled out** (`content.py`): "5-minute" → "five-minute" etc., so no digit can reach a report; a new test enforces zero digits in Road A. 77 tests pass (9 new).

## Known decisions deliberately NOT made silently (need product sign-off)
- EM composite: locked spec defines EM = 0.80·invPSS10 + 0.20·WHO5-mood (stress inside EM, no standalone "calm"); backend keeps emotional=WHO-5 + calm=PSS-10 as separate dimensions.
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

---

# LEWIS Core Engine - Updates (Version 1.3.0 - 19 July 2026)

## 9. The 16-page Insight Report, per the Generation Rulebook v3.0 (19 July)

The report a user receives after the full journey is no longer the single markdown narrative: it is now the complete 16-page LEWIS Insight Report specified in `doc/LEWIS_Insight_Report_Generation_Rulebook_v3_FINAL.md.pdf`, styled after `doc/LEWIS_Insight_Report_FINAL.pdf`, and downloadable as a PDF. The journey UI is unchanged.

- **`backend/enrich.py` (new)** - builds the rulebook §3 enriched object from the existing pipeline (dimensions, patterns, portrait, leverage, safety, habit, context). Fixes every conclusion before a word is written: the nine report areas (the 9 spec-coded W dimensions), band-word mapping (Thriving→Strong, Steady→Steady, Strained→Under pressure, Depleted→Running on empty), read_type (PH/EN composites are "supported" → offered wording, never asserted), licensed connections (leverage primary → W-matrix downstream, company-not-cause), distress tier (gentle_mode → signpost), commerce cap (money strain → free_low_cost_only; safety → suppressed), and the handoff (lead-with, focus, habit sizing).
- **`backend/insight_report.py` (new)** - the deterministic 16-page generator (the spine IS the voice in v1; same object → same document). Cover, orientation with the four band words, "Where you are right now" (portrait-led, arrival-word agree-and-refine, strengths named before stretched areas when the shape is uneven, season-not-type), the nine-area wheel + strengths-first list + certainty note, connections page with the single-sitting limitation, stress page (day rhythm, load, breathing minute, body map, three interpretation paragraphs), three closer-look pages (36 area×tier template blocks; unread areas honestly blank), the pathway with the mandatory why-the-plan-is-small box, a full anchor-practice page (4 anchors routed by handoff: close-laptop pause, one small start, single list moment, three breath ground - each with setup/feel/permissions/lapse/7-days), four optional supports each with a personalised "Why this, for you" tied to the reader's own data, the programs page with fit reasoning + commerce gating (suppressed = one line back to the free path), the thirty-day experiment with lapse guidance (plus the distress note when the tier fires), the what-stands-behind page with the full privacy statement, and the appendix bound to §18 (only measures/practices/programs actually used are cited).
- **`backend/report_gate.py` (new)** - the §17 self-check gate, run on every response: zero em/en dashes in the whole document; no instrument names, citations, internal labels, score vocabulary or clinical language in pages 1-15 (word-boundary matched; the mandated non-clinical line whitelisted); only the four band words; required blocks verified (season framing p3, single-sitting p5, why-small p10, lapse p11+p14, privacy p15, free-path-first p13, how-to-read p16).
- **`main.py`** - accepts optional `name`/`location` (context only), builds the enriched object + report after the existing pipeline, gate-checks it, returns it as `insight_report` alongside the unchanged v1.2 response. `payload.js` now sends `name` and the Stage 7.8 friction flags (previously dropped: `flags: []` was hardcoded).
- **Frontend `src/report/`** (new: `InsightReport.jsx`, `report.css`) - renders the JSON as A4 paper pages in the approved style (serif/sans, hairlines, callouts, cards, SVG nine-area wheel in four discrete steps, day-rhythm curve, load bar, body-map chips). The band palette (#B0492F / #D89C4A / #3F6FB0 / #2F7D3F) passed the dataviz six-checks validator on the paper surface; every color mark always carries its band word as text. "Download as PDF" prints exactly the 16 report pages via `@page A4` print CSS (vector, not raster). MirrorScreen keeps its existing cards and swaps the markdown narrative for the report (legacy narrative remains as fallback).
- **Tests**: 18 new in `tests/test_insight_report.py` - the gate passes across five profile shapes (uneven, even-high, all-low/gentle, money-strained, partial with unread areas), 16 pages always, gentle mode suppresses programs + adds the care note + grounding anchor, money strain gates paid programs to a labelled later-note, free path precedes programs, strengths-before-stretched ordering, starting-point-not-lowest explanation, personalised support rationales, capacity row, determinism (same object → byte-identical document). Suite: 95 passing.
- **Note**: LLM voicing of the new report is deliberately deferred - the deterministic spine is fully rulebook-compliant ("the object decides; warmth may vary, conclusions may not"), and a gated per-section voicing pass can be layered once the output is reviewed. Road B still voices the legacy `narrative` field unchanged.
