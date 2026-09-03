# LEWIS Report Engineering Specification v1
## Companion 6. How the report is built, and what must be true of it

Read alongside `LEWIS_Insight_Report_Devaraj_K.html`, which is the reference implementation of the render target described here.

**The single architectural commitment in this document:** the renderer does not think. It does not compute a score, choose a band, pick a suggestion, or decide what to say. Every one of those decisions is made upstream and lands in the Report Render Object. The renderer draws the RRO and nothing else.

This is not stylistic. It is what makes the report auditable, reproducible, testable and legally defensible. If a person asks in eighteen months why LEWIS told them something, the answer must be reconstructible from stored artefacts, not re-derived from a model that has since changed.

---

# Part 1. Pipeline

```
Session (37 screens)
      │
      ▼
[1] INGEST ──────────► Raw Response Record (RRR)      immutable, append-only
      │
      ▼
[2] VALIDATE ────────► rejects, prorations, missingness map
      │
      ▼
[3] SCORE ───────────► Dimension Set                  9 scores, bands, confidence
      │
      ▼
[4] ENRICH ──────────► nudges, divergence, contradictions
      │
      ▼
[5] INFER ───────────► link graph, root driver, priority tension
      │
      ▼
[6] SELECT ──────────► suggestion, through four gates
      │
      ▼
[7] COMPOSE ─────────► Report Render Object (RRO)     the frozen artefact
      │
      ▼
[8] RENDER ──────────► HTML  ──► PDF
```

**Stages 1 to 7 are pure functions.** Same input, same versions, same output, byte for byte. Stage 8 is the only stage with side effects.

## 1.1 The determinism requirement

Two roads exist through the system and both must agree:

- **Road A**, live generation: session ends, pipeline runs, report served.
- **Road B**, reconstruction: given a stored RRR and the four version pins, the pipeline reruns and produces a byte-identical RRO.

**INV-01.** `hash(RRO_roadA) == hash(RRO_roadB)` for every report ever generated. A nightly job samples 100 historic reports, reruns Road B, and alerts on any divergence.

This forbids, everywhere in stages 1 to 7: `Math.random()`, `Date.now()`, unordered map iteration, floating-point accumulation order that varies, any LLM call, any network fetch, any locale-dependent sort or number format.

## 1.2 Version pins

Every RRO carries four pins and cannot be produced without all four:

```json
"versions": {
  "scoring_engine": "1.0.0",
  "link_set": "1.0",
  "copy_layer": "1.0",
  "suggestion_library": "1.0"
}
```

**INV-02.** A stored RRO is never regenerated under different pins. If the copy layer changes, historic reports keep their original copy. Retroactively rewriting what a person was told is an integrity failure, not a bug fix.

---

# Part 2. Data contracts

## 2.1 Raw Response Record

Immutable, append-only, one row per input event.

```json
{
  "session_id": "uuid",
  "person_id": "uuid",
  "screen": "5_2Pss10",
  "item": "pss10_07",
  "raw_value": 2,
  "answered_at": "2026-08-23T19:14:02.113Z",
  "dwell_ms": 4820,
  "revisions": 1
}
```

**RULE.** `raw_value` stores the response option index, never a scored or reversed value. Reversal happens in stage 3 and only there. Storing pre-reversed values is how reverse-scoring bugs become invisible and permanent.

`dwell_ms` and `revisions` are not scored. They feed the response-quality checks in stage 2 and the pilot instrumentation.

## 2.2 Report Render Object

The complete contract. The reference HTML consumes exactly this shape.

```typescript
interface RRO {
  meta: {
    rro_id: string;
    session_id: string;
    generated_at: string;          // display only, never used in stages 1-7
    name: string | null;
    date_display: string;
    arrival_word: string | null;
    versions: Versions;
    rrr_hash: string;              // hash of the inputs this was built from
  };

  compassion_level: 1 | 2 | 3;

  dimensions: Array<{
    key: "PH"|"EM"|"EN"|"RS"|"MS"|"AC"|"FW"|"IG"|"EC";
    label: string;
    score: number | null;          // null == Not enough to say
    band: 1 | 2 | 3 | 4 | null;
    confidence: "A" | "B" | "C";
    ci: number;                    // interval half-width, from confidence
    display_as_band_only: boolean; // true for RS, see INV-08
    flags: string[];               // report forms, already resolved
    trajectory: "worse"|"better"|"same"|"varies"|null;
    context_line: string | null;
    rider: boolean;                // bespoke-instrument rider
  }>;

  gestalt: {
    sort: Record<string, 1|2|3>;
    divergences: Array<{ key: string; delta: number; direction: "higher"|"lower" }>;
    global_caution: string | null;
  };

  somatic: { zones: string[]; portrait: string; cluster: string; recovery: string };
  breath:  { before: number; after: number; delta: number } | null;
  day:     Array<{ k: string; v: 1|2|3 }> | null;

  links: Array<{
    source: string; target: string;
    weight: number; directional: boolean;
    tier: "Established"|"Supported";
    title: string; body: string;
  }>;
  links_not_drawn: string | null;

  root_driver: {
    key: string; label: string;
    leverage: number;
    override_applied: boolean;     // Tier C override, see INV-12
    why_not_lowest: string;
    why_not_runner_up: string;
    why_this: string;
    honesty_rider: string | null;
  } | null;

  priority: {
    top3: string[];
    tension_key: string | null;
    tension_confirmed: "yes"|"partly"|"not_quite"|null;
  };

  bright_spot: { tier: 1|2|3; key: string|null; text: string|null };
  reflections: string[];           // max 2

  suggestion: {
    id: string; cue: string; action: string;
    size_tier: "S0"|"S1"|"S2"|"S3";
    evidence_tier: string;
    dose_honesty: string | null;
    evidence_note: string | null;
    lifed_disclosure: boolean;
    why_this: string;
    excluded_dimension_note: string | null;
  } | null;
  suggestion_state: "normal"|"no_suggestion"|"deliberate_exclusion";

  confidence_table: Array<[string, "A"|"B"|"C", string]>;
  sources: { instruments: Source[]; link_evidence: Source[] };
  support_block: { position: "none"|"after"|"before"; resources: Resource[] };
}
```

**INV-03.** The RRO contains no raw scores that are not displayed, no intermediate calculations, and no template variables. Everything is fully resolved. The renderer performs no string interpolation of person data.

**INV-04.** The RRO is serialised with sorted keys and stored. It is the record of what the person was told.

---

# Part 3. Stage specifications

## Stage 2. Validate

| Check | Action |
|---|---|
| Block of 5+ items, exactly 1 missing | Prorate with block mean, set `prorated[dim] = true` |
| Block of 5+ items, 2+ missing | `score = null`, `band = null` |
| Block of 4 or fewer, any missing | `score = null` for that component |
| `sleep_quality == null` | Redistribute PH weights proportionally, drop PH confidence one step |
| Same response option for 8+ consecutive Act 3 items | `straight_lining = true` |
| Session duration below p10 of observed distribution | `fast_completion = true` |

**INV-05.** A null score is never rendered as zero, never imputed to a midpoint, and never hidden. It renders the `Not enough to say` block and is excluded from links, root driver and bright spot selection.

## Stage 3. Score

Implements the formulas in `LEWIS_Scoring_Inference_Report_v1.md` Part 2.

**INV-06.** Every reverse-scored item has a fixture test asserting the inversion. PSS-10 items 4, 5, 7, 8 and CFPB items 1, 2, 3, 5. The build fails if any assertion fails. A silently inverted PSS item 7 flips a person's Emotional reading with no other visible symptom, and no amount of downstream QA will catch it.

**INV-07.** Rounding happens once, at the end of each dimension formula, using round-half-up. Not per component. Rounding twice produces off-by-one drift that will show up as Road A and Road B disagreement.

**INV-08.** `RS.display_as_band_only = true`, always. UCLA-3 has seven possible raw values, so RS can only take the values 0, 17, 33, 50, 67, 83, 100. One item moving one step shifts RS by 17 points and can cross two band boundaries. The renderer must not print an RS number.

## Stage 4. Enrich

**INV-09.** A nudge may move a score by at most 4 points, may not cross a band boundary, and fires only when its direction agrees with the self-report. Implement as:

```
apply_nudge(score, delta):
  if sign(delta) != direction_of_selfreport: return score
  proposed = clamp(score + clamp(delta, -4, 4), 0, 100)
  if band(proposed) != band(score):
      proposed = boundary_of(band(score)) offset by 1 toward score
  return proposed
```

**INV-10.** `breath.settle_change` never enters any score. It is narrative only. Enforce with a test asserting the breath fields are absent from every scoring function's input signature.

## Stage 5. Infer

Implements `LEWIS_Prior_Link_Set_v1.md`.

**INV-11.** The structural exclusion list is enforced before any other link logic. PH–EN, EM–EN and EM–PH may never be drawn. For the PH to EM edge specifically, a shadow PH score excluding WHO-5 items is computed solely to test edge activation. If the shadow score is at or above 55, the edge does not fire.

**INV-12.** Edges sharing a source and target merge into one link, with the union of confirmations, not the sum.

**INV-13.** The root driver Tier C override, if accepted, is recorded as `override_applied: true` and forces `honesty_rider` to be non-null. A Tier C root driver with a null rider is a build failure.

**INV-14.** If fewer than two links activate, `links` is empty and the fallback copy renders. The engine does not relax activation criteria to reach a minimum.

## Stage 6. Select

Implements `LEWIS_Suggestion_Library_v1.md` Part 7.

**INV-15.** Gate order is fixed: safety, friction, capacity, evidence. Gates are never reordered, and Gate 1 is never skipped. When Gate 2 empties the candidate set, the engine moves to the next dimension by leverage. It never relaxes the friction filter to keep the root driver.

**INV-16.** A suggestion whose `researched_dose` differs from its `delivered_dose` must carry a non-null `dose_honesty` string. A suggestion at `emerging` tier must carry a non-null `evidence_note`. A suggestion with `lifed_link` must set `lifed_disclosure`. All three are assertions, not conventions.

## Stage 7. Compose

Applies `LEWIS_Report_Copy_Layer_v1.md`. This is where all string resolution happens, including flag report forms.

**INV-17.** No rendered string may contain an unresolved template token. Assert with a regex for `{` across the serialised RRO.

**INV-18.** Banned lexicon regex runs against the serialised RRO before it is written. Any hit fails generation. The report is not produced; an incident is raised.

---

# Part 4. Render

## 4.1 Target

Single HTML file, twelve pages, print-ready via `@page` at A4. The reference implementation is `LEWIS_Insight_Report_Devaraj_K.html`.

**Page count is fixed at twelve.** Reconcile the three numbers currently live on the site (16, 20 and 25) to this before launch.

## 4.2 The signature element

The **nine lane spine** is the authoritative comparison graphic. Each lane carries:

- the dimension label
- a 0 to 100 track
- an interval bar whose width encodes confidence: Tier A is ±5, Tier B is ±9, Tier C is ±15
- a mark at the score, filled at the band's ink density
- the value, except for RS which shows band only

It appears in full on page 3 and as a single-lane ornament heading each dimension section, so the reader always knows which of the nine they are in.

**Encoding decisions worth defending.** Bands are one ink at four densities, not a red to green ramp. A traffic light would make a low reading read as a failure, which contradicts the report's central line. Less ink for less reserve is semantically correct and it removes judgement from the palette entirely. There is no red anywhere in this report.

**The nine petal wheel appears exactly once**, on the cover, as a shape-at-a-glance identity graphic. It is not the authoritative comparison and no number is read off it.

## 4.3 PDF

Headless Chromium, `printBackground: true`, A4, zero margin, fonts embedded not linked.

**INV-19.** Fonts are self-hosted and embedded in the PDF. A report that depends on a Google Fonts request at print time will silently render in a fallback face for some users. Ship WOFF2 with the bundle.

**INV-20.** PDF generation asserts exactly twelve pages. A thirteenth page means content overflowed and the report is rejected rather than shipped.

## 4.4 Overflow

The most likely visual failure is text overflow on pages 4, 7 and 9, where content length varies most with the person.

| Page | Bound | Behaviour on exceed |
|---|---|---|
| 4, areas | 4 low + 2 stretched blocks | Move stretched blocks to the grouped paragraph |
| 7, links | 5 links | Cap at 5, enforced in stage 5 |
| 9, ground | 2 reflections | Cap at 2, enforced in stage 4 |
| 12, sources | Fixed | n/a |

---

# Part 5. Storage and retention

| Artefact | Retention | Purpose |
|---|---|---|
| Raw Response Record | Per privacy policy | Road B reconstruction |
| Report Render Object | Life of account | The record of what was said |
| Rendered PDF | Life of account | What the person actually saw |
| Version manifests | Indefinite | Reconstruction of any historic report |

**RULE.** Deleting a person's account deletes the RRR, RRO and PDF. Version manifests contain no personal data and persist.

**RULE.** The RRO contains free-text the person wrote, including the bright spot text and the arrival word. It is personal data and is encrypted at rest with the same controls as the RRR.

---

# Part 6. Test suite

## 6.1 Fixture people

Nine fixtures, each targeting a specific engine path. All nine run on every build.

| Fixture | Exercises |
|---|---|
| **Devaraj K** | The reference path. Four low bands, three links, Tier C root driver override, dose honesty |
| **Flourishing** | All nine at band 3 or 4. Zero deep dives, zero links, bright spot tier 1, "not clustering" fallback |
| **Floor** | All nine below 40. Compassion 3, bright spot tier 3, S0 only, support before suggestion |
| **Sparse** | Half the optional fields skipped. Multiple `Not enough to say`, no name, no arrival word, no bright spot text |
| **Straight-liner** | Same option for 14 consecutive items. Global caution renders |
| **Money-blocked** | FW lowest, friction money. Deliberate exclusion state renders, no FW suggestion selected |
| **Depleted-curious** | IG lowest with "no space for that". Asserts routing out of IG |
| **Breath-worse** | Tension rose during breathing. Asserts EF-03 suppression and down-regulation routing |
| **All-safety** | Every Gate 1 flag active. Asserts `no_suggestion` state renders its copy rather than failing |

## 6.2 Property tests

| Property | Assertion |
|---|---|
| Determinism | Same RRR, same pins → identical RRO hash, 1,000 random RRRs |
| Nudge bounds | No nudge crosses a band boundary, across 10,000 random score and nudge pairs |
| Score range | Every dimension in [0, 100] or null, across 10,000 random RRRs |
| Structural exclusion | PH–EN, EM–EN, EM–PH never appear in `links`, across all fixtures |
| Link cap | `links.length <= 5` always |
| Gate order | Instrumented gate trace matches [safety, friction, capacity, evidence] on every fixture |
| Copy resolution | No `{` in serialised RRO |
| Lexicon | Banned regex finds nothing in serialised RRO |
| Page count | PDF is exactly 12 pages, all fixtures |

## 6.3 Human gate

**One person reads a generated report aloud, end to end, before every copy or library release.** Anything that catches in the mouth gets rewritten. This is not automatable and it is not optional. It is the only test that catches the failure mode where every string is individually correct and the whole thing reads like a machine.

---

# Part 7. Observability

| Metric | Alert |
|---|---|
| Generation failures by invariant | Any INV-18 or INV-20 failure pages on-call |
| Road B divergence rate | Any non-zero rate |
| Suggestion distribution | Any single suggestion exceeding 25 percent of selections |
| `no_suggestion` rate | Above 5 percent |
| Empty link map rate | Above 40 percent |
| Compassion level 3 rate | Tracked, never alerted on, reviewed weekly by a named person |
| p50 and p95 generation latency | p95 above 8 seconds |

**On the suggestion distribution alert.** If one suggestion is being given to a quarter of users, either the library is too thin or the gates are collapsing to a single path. Both are content problems that will look like a working system until someone checks.

---

# Part 8. Open engineering decisions

1. **Where stages 1 to 7 run.** They are pure and cheap. Running them server-side keeps the library and link set off the client, which matters because both are proprietary and both are the product.

2. **The retake schema.** The engine has no memory of what it previously suggested. A person retaking in three months gets the same suggestion whether the last one worked, failed, or was never attempted. This needs a `suggestion_history` table and a `previously_suggested` filter in stage 6, designed now rather than retrofitted after you have retake data.

3. **Slope graph for returning users.** Reserved in the design but not specified. It needs at least two RROs and a rule for what counts as a meaningful change, which is a psychometric question, not an engineering one, and it depends on the test-retest study.

4. **PDF versus interactive.** The reference implementation is print-first and works on screen. Whether the paid artefact is the PDF, the web view, or both changes the caching and delivery design.

5. **Fixture maintenance.** The nine fixtures must be updated whenever the flow changes. Assign an owner, or they will drift and start passing for the wrong reasons.
