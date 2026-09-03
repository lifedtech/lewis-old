# LEWIS Scoring, Inference and Report Generation v1
## Companion 2 to the Live Walkthrough v5

This document defines every number LEWIS produces, how it produces it, what it is allowed to say about it, and where it must say nothing.

It is written against the 37 screen flow in `LEWIS_Live_Walkthrough_v5_UX_Build.md` and the 39 scored items in it. If the flow changes, this changes.

**Reading guide.** Sections marked **FACT** are arithmetic or published instrument scoring. Sections marked **DESIGN** are LEWIS decisions that are defensible but not derived from evidence. Sections marked **RULE** are constraints that exist to keep the product honest and must not be relaxed for product reasons.

---

# Part 0. Three things that must be settled before any formula

## 0.1 LEWIS does not have norms, and should not pretend to

Every score in LEWIS is a **position within an instrument's own range**, not a comparison against other people. There is no LEWIS reference sample yet, and borrowing US or European norm tables into an India-first product that is now also serving international users at $29 would produce comparisons that are wrong in an invisible way.

**DESIGN decision:** every dimension uses a transparent linear rescale of its instrument's raw range to 0 to 100. No percentiles, no T scores, no IRT tables, no "better than X% of people" anywhere in the product.

This is already your instinct: the charter retired the CFPB US IRT table in favour of a LEWIS rescale. Extend that decision universally.

**RULE.** The report never says "average", "above average", "typical", "most people", or "normal". It says "for you, right now".

**Upside worth naming.** A norm-free scale is the only scale that travels across markets without new validation work. This turns a limitation into your international expansion story.

## 0.2 The nine scores are not on a common metric

A 62 in Emotional and a 62 in Financial do not mean the same thing. They come from different instruments with different item counts, different reliability, and different response distributions. A radar chart implies they are comparable, and that implication is the largest single interpretive risk in the product.

**RULE.** The radar and the nine petal diagram are presented as **the shape of one person's profile**, never as a ranking of areas against each other in absolute terms. The framing line, fixed:

> This shows how the nine areas sit relative to each other **in your own answers**. It is not a league table, and a 60 in one area does not mean the same thing as a 60 in another.

**RULE.** Numeric scores are never the headline. Bands are the headline. Numbers appear only in the detail view, as integers, never with decimals.

## 0.3 A single session cannot show what moves together

The site currently promises "Lewis sees which areas are moving together". Covariation requires repeated measurement. With one administration you have n equals 1 at a single time point, and no correlation is computable from it.

**RULE.** The connection map is built from three honest sources only: known relationships in the literature, co-occurrence of low scores in this person, and the person's own naming of the link through pressures, flags and friction. It is never presented as a statistical finding about this person.

**Approved language:** "travel together", "commonly arrive together", "showing up in", "where your answers point".
**Banned language:** "causes", "because of", "due to", "driving", "leads to", "is responsible for", "correlated with".

Your existing string "Lewis sees which areas are moving together and where a small effort reaches furthest. Leverage, never a claim about cause" gets the framing right. Section 4 makes the algorithm match the sentence.

---

# Part 1. Item scoring

## 1.1 Response coding **FACT**

| Instrument | Per item | Raw range | Direction |
|---|---|---|---|
| WHO-5 | 0 to 5 (`At no time` = 0, `All of the time` = 5) | 0 to 25 | Higher is better |
| PSS-10 | 0 to 4 (`Never` = 0, `Very often` = 4) | 0 to 40 | Higher is worse |
| PSS-10 reverse items | Items **4, 5, 7, 8** reverse coded before summing | | |
| UCLA-3 | 1 to 3 (`Hardly ever` = 1, `Often` = 3) | 3 to 9 | Higher is worse |
| GSE-6 | 1 to 4 (`Not at all true` = 1, `Exactly true` = 4) | 6 to 24 | Higher is better |
| Purpose module | 0 to 4 (`Not at all` = 0, `Very much` = 4) | 0 to 16 | Higher is better |
| CFPB-5 | 0 to 4 after orientation | 0 to 20 | Higher is better |
| CFPB reverse | Items **1, 2, 3, 5** reverse coded | | |
| INS | 1 to 7 | 1 to 7 | Higher is better |
| LEWIS Growth | 1 to 5 | 3 to 15 | Higher is better |

**RULE.** Every reverse coded item ships with a fixture test that fails the build if the inversion is wrong. Reverse scoring errors are the most common and most invisible failure in applied psychometrics, and a silently inverted PSS item 7 would flip a person's Emotional reading without any other symptom.

## 1.2 The standard rescale **FACT**

```
pct(raw, min, max) = 100 * (raw - min) / (max - min)
```

For instruments where higher is worse:
```
pct_wellbeing = 100 - pct(raw, min, max)
```

## 1.3 Categorical item mapping **DESIGN**

| Item | Mapping to 0 to 100 |
|---|---|
| `sleep_quality` | Consistently good 100, Variable 55, Generally poor 20, Not tracking `null` |
| `activity_level` | Very active 100, Moderately active 70, Mostly sedentary 30, Dropped recently 25 |
| `nature_access` | Yes regularly 100, Sometimes 65, Rarely 30, No 0 |
| `cultural_belonging_1` | Strongly 100, Somewhat 75, Partially 50, Not much 25, Real pain 0 + flag |
| `transcendent_connection` | Deeply 100, Somewhat 75, A little 50, Not at all 25, Painful 0 + flag |
| `intellectual_recency` | This week 100, Past month 75, Few months 45, Can't remember 25, No space 20 + `depletion_type` flag |

**Note on `intellectual_recency`.** "I don't have space for that right now" and "I honestly can't remember" score similarly but mean different things. The first is depletion, the second is drift. They score close and route differently: depletion routes to recovery first, drift routes to a curiosity re-entry point.

## 1.4 Missing data **RULE**

- Instrument items are answerable but skippable. Forcing an answer produces a false answer.
- Blocks of five or more items: if exactly one item is missing, substitute the person's mean for that block (prorating). If two or more are missing, the dimension returns `Not enough to say`.
- Blocks of four or fewer items: any missing item returns `Not enough to say` for that component.
- `Not enough to say` is a first class state in the report, with its own copy. It is never rendered as zero, never imputed to a midpoint, and never hidden.
- `sleep_quality = null` ("I haven't been tracking it") redistributes its weight proportionally across the other Physical components and drops Physical confidence by one step.

---

# Part 2. The nine dimension formulas

All outputs are 0 to 100, integers, higher is better.

## PH. Physical and Regeneration **DESIGN**

```
who5_rested   = 100 * who5[4] / 5
who5_vigour   = 100 * who5[3] / 5

PH_base = 0.35*who5_rested + 0.25*who5_vigour + 0.22*sleep_quality + 0.18*activity_level
PH      = clamp(PH_base + nudge_PH, 0, 100)
```

`nudge_PH` comes from the body map, bounded per Part 3.

**Confidence: Tier C, Indicative.** No short, free, validated physical wellbeing questionnaire exists, so this is an honest composite. It is the weakest dimension by design and the report says so.

## EM. Emotional and Mental **DESIGN, charter locked**

```
pss_raw       = sum(pss10 with items 4,5,7,8 reversed)     // 0 to 40
pss_wellbeing = 100 * (40 - pss_raw) / 40
who5_mood     = 100 * (who5[1] + who5[2]) / 10

EM = clamp(0.80*pss_wellbeing + 0.20*who5_mood + nudge_EM, 0, 100)
```

**Confidence: Tier A, High.** PSS-10 internal consistency typically 0.78 to 0.91 across validations, with a Hindi validation available.

## EN. Engagement and Energy **DESIGN, charter locked**

```
EN = clamp(100 * (who5[3] + who5[5]) / 10 + nudge_EN, 0, 100)
```

**Confidence: Tier B, Moderate.** Two items from a validated instrument. Adequate as a signal, thin as a score. No new items are asked, which is the right trade.

## RS. Relationships and Social **FACT plus rescale**

```
ucla_raw = sum(ucla3)          // 3 to 9
RS       = 100 * (9 - ucla_raw) / 6
```

**Confidence: Tier B, Moderate.**

**Critical implementation note.** UCLA-3 has only seven possible raw values, so RS can only take seven values: 0, 17, 33, 50, 67, 83, 100. One item moving one step shifts RS by 17 points, which can cross two band boundaries.

**RULE.** RS is never displayed as a number, only as a band. RS is excluded from any "which area moved most" comparison. The report must not imply RS has resolution it does not have.

**RULE.** `relational_context` never enters the RS score. It shapes narrative and routing only: family-woven-as-support routes toward deepening, family-woven-as-pressure routes toward boundaries, and a high RS score alongside "I have people around me, but feel unseen" produces a specific reflection rather than a contradiction.

## MS. Meaning and Spiritual **DESIGN**

```
purpose_pct = 100 * sum(purpose[1..4]) / 16
MS          = 0.80*purpose_pct + 0.20*transcendent_connection
```

**Confidence: Tier B, Moderate, conditional.** If the verbatim PROMIS swap has not shipped, MS drops to **Tier C** and the report must not name PROMIS.

## AC. Accomplishment and Agency **FACT plus rescale**

```
gse_raw = sum(gse6)            // 6 to 24
AC      = 100 * (gse_raw - 6) / 18
```

**Confidence: Tier A, High.** GSE-6 alpha around 0.79 to 0.85, unidimensional, no reverse items, so no inversion risk.

## FW. Financial Wellness **FACT plus LEWIS rescale**

```
cfpb_raw = sum(cfpb5 with items 1,2,3,5 reversed)    // 0 to 20
FW       = 100 * cfpb_raw / 20
```

**Confidence: Tier B, Moderate.**

**RULE.** `financial_stress` and `income_regularity` do not enter the score. They gate the deep dive, shape the narrative, and set the tone of financial suggestions. A person can have a workable CFPB score and high financial anxiety, and that gap is itself the finding.

**RULE.** "Not relevant to me right now" on `financial_stress` suppresses the financial narrative but does not suppress the FW score.

**Pilot study attached.** Dual compute the original CFPB IRT score silently and log the divergence from `FW`. Only `FW` reaches the user. After roughly 1,000 completions you will know whether the linear rescale distorts the tails, which is the only place it plausibly could.

## IG. Intellectual and Growth **DESIGN, bespoke**

```
growth_pct = 100 * (sum(growth[1..3]) - 3) / 12
IG         = 0.70*growth_pct + 0.30*intellectual_recency
```

**Confidence: Tier C, Indicative.** Purpose built, unvalidated, scored conservatively. Same treatment as the cultural module.

**RULE.** The report labels IG explicitly: "This area is measured with LEWIS's own questions rather than a published questionnaire, so we hold it more loosely than the others."

## EC. Environmental and Cultural **DESIGN**

```
ins_pct = 100 * (ins - 1) / 6
cult2   = 100 * (cultural_2 - 1) / 4

EC = 0.30*ins_pct + 0.30*cultural_belonging_1 + 0.20*cult2 + 0.20*nature_access
```

**Confidence: Tier C, Indicative.** A validated single item (INS test-retest around 0.84) combined with a bespoke two item module. Defensible as a reading, not as a measurement.

---

# Part 3. The nudge layer

This is where LEWIS honours its own promise: "Tasks and activities only nudge. They can shade a reading within a tight bound when they agree with it, and can never create a problem on their own."

## 3.1 The four nudge rules **RULE**

1. **Magnitude.** A nudge may move a dimension by at most **±4 points**.
2. **Agreement only.** A nudge fires only when its direction matches the direction the self-report already points. If the self-report says Physical is fine and the body map is loaded, the nudge does **not** fire. Instead a reflection is generated (Part 5.3).
3. **No band crossing.** If applying a nudge would move a score across a band boundary, the nudge is truncated at the boundary minus one point. A task may never change what band a person is told they are in.
4. **Never creates.** A nudge can never move a score downward into Depleted, and can never move a score upward into Strength.

## 3.2 Nudge sources **DESIGN**

| Source | Target | Trigger | Value |
|---|---|---|---|
| `somatic.load_index` (body map taps, 0 to 5) | PH | 3 or more zones tapped **and** PH_base below 55 | −4 |
| `somatic.load_index` = 0 with "nothing feels tense" | PH | PH_base at or above 55 | +2 |
| `affect.valence` low **and** `affect.arousal` high | EM | EM below 55 | −3 |
| `affect.valence` high **and** `affect.arousal` mid | EM | EM at or above 55 | +2 |
| `enrich.irregularity` high (no stable energy pattern) | EN | EN below 55 | −3 |
| `breath.settle_change` | none | never scores | narrative only |

**RULE.** `breath.settle_change` never enters any score. It informs the recovery narrative and, when tension rises after the breath, routes toward down-regulation. It is never described as vagal tone, autonomic state, or a physiological reading. The approved surfacing line is fixed: "This is about how your body settled with the breath. A small experiment, not a medical reading."

---

# Part 4. Bands, confidence and cross-checks

## 4.1 Bands **DESIGN**

Four bands. Boundaries are LEWIS decisions, not clinically derived thresholds, and the report says so once.

| Band | Range | Label | Descriptor (already in your build) |
|---|---|---|---|
| 1 | 0 to 39 | Running on empty | This area needs the gentlest care right now. Reserve is thin, and effort here costs more than it should. |
| 2 | 40 to 54 | Stretched | Stretched, and asking for attention. Still functioning, but with less give than it used to have. |
| 3 | 55 to 69 | Holding | Holding reliably, without strain. Not remarkable, and not asking anything of you this month. |
| 4 | 70 to 100 | A real strength | A real strength, and a place to stand. Something to spend deliberately, not simply admire. |

These four descriptors are strong writing and should be kept verbatim.

**RULE.** The deep dive gate (Part 6) and the Bright Spot tiers both key off these boundaries. Band 1 and Band 2 together are "below Steady", which is the under-55 gate already in the charter.

## 4.2 Confidence **DESIGN**

Each dimension starts at a base tier:

| Tier | Dimensions | Report label |
|---|---|---|
| A | EM, AC | Well supported |
| B | EN, RS, MS, FW | Reasonably supported |
| C | PH, IG, EC | Held loosely |

Deductions, applied per dimension, each dropping one tier:

- One item prorated in that dimension's block
- Gestalt divergence greater than 20 points for that dimension (Part 4.3)
- `sleep_quality` null, for PH only
- MS when the PROMIS verbatim swap has not shipped

Global confidence caution, shown once at the top of the report, triggers on any of:

- Four or more dimensions showing gestalt divergence
- Straight lining: the same response option selected for eight or more consecutive items across the Act 3 blocks
- Total session time below the 10th percentile of the observed distribution, once you have one

**RULE.** Confidence is shown to the person, area by area. Your build already has the section ("How confident this report is, area by area"). Never hide low confidence to make the report feel stronger. A person who finds one area obviously wrong and sees it was already marked as held loosely trusts the other eight more, not less.

## 4.3 Gestalt divergence **DESIGN**

The nine card sort in Act 4 is a felt-sense read. It is not the measurement, and it is not a validation check. It is a second opinion from the same person.

```
zone_midpoint = { Depleted: 25, Doing okay: 55, A real strength: 85 }
divergence[d] = score[d] - zone_midpoint[sort_zone[d]]
flagged if |divergence[d]| > 20
```

**Report language when flagged, direction sensitive:**

- Score higher than the sort: "You placed [area] in the depleted zone, and the questions point somewhere a little steadier. That gap is worth noticing. Sometimes an area is doing better than it feels."
- Score lower than the sort: "You placed [area] among your strengths, and the questions point somewhere more stretched. Both readings are yours, and the gap is often where something is being carried quietly."

**RULE.** Neither reading is called correct. LEWIS reports the gap, not a verdict on it.

## 4.4 Structural shared variance **RULE**

Three dimension pairs share items by construction and must be excluded from all connection, divergence-comparison and "these move together" logic:

| Pair | Shared source |
|---|---|
| PH and EN | WHO-5 item 3, "active and vigorous", feeds both |
| EM and EN | WHO-5 items feed both blends |
| EM and PH | WHO-5 items feed both blends |

Drawing a link between PH and EN would report back to the person, as a discovery, a correlation you built into the arithmetic. This exclusion list is not optional.

---

# Part 5. Inference

## 5.1 The connection map **DESIGN**

**Step 1. Prior link set.** A fixed directed graph of dimension pairs with literature support, each carrying a weight. This is authored once, reviewed by the research team, and versioned. Illustrative structure, to be finalised with source citations per edge:

| From | To | Weight | Basis |
|---|---|---|---|
| PH | EM | Strong | Sleep and emotional regulation |
| FW | EM | Strong | Financial strain and psychological distress |
| EM | EN | Strong | Excluded by 4.4, narrative only |
| RS | MS | Moderate | Social connection and sense of purpose |
| EM | RS | Moderate | Strain and withdrawal |
| PH | EN | Strong | Excluded by 4.4, narrative only |
| EC | PH | Moderate | Environment and restoration |
| AC | MS | Moderate | Agency and direction |
| FW | RS | Moderate | Money as household tension |
| EM | IG | Moderate | Depletion and curiosity |

**Step 2. Activation.** An edge is drawn only if **all** of the following hold:
- Both endpoints score below 55
- The pair is not on the 4.4 exclusion list
- At least one **person-level confirmation** exists naming the source side: a selected pressure at screen 05, a texture flag in that dimension's deep dive, a friction answer, or a worsening trajectory

**Step 3. Ranking and cap.** Rank active edges by `prior_weight × confirmation_count × depletion_depth(source)`. Draw at most **five**.

**Step 4. Rendering.** Your existing string is correct: "Only the active links are drawn, and the size of each shape follows its reading."

**RULE.** If fewer than two edges activate, the report says so plainly rather than manufacturing a network: "Your areas are not clustering into a single pattern right now. Each one is largely standing on its own, which is its own kind of information."

## 5.2 The root driver **DESIGN**

```
leverage(d) =
    0.35 * weighted_out_degree(d)          // how many active edges leave d
  + 0.25 * depletion(d)                    // max(0, 55 - score[d]) / 55
  + 0.15 * priority_flag(d)                // 1 if d in top three, else 0
  + 0.15 * trajectory_worsening(d)         // 1 if "getting worse", 0.5 if "varies"
  + 0.10 * friction_actionability(d)       // Time 1.0, Energy 0.8, Mindset 0.8,
                                           // Environment 0.6, Priorities 0.6,
                                           // Money 0.3, Access 0.3, Nothing obvious 0.5
```

Select `argmax(leverage)`.

**Two constraints:**
1. The root driver must have confidence Tier A or B. If the top candidate is Tier C, select the highest-leverage Tier A or B candidate instead, and add: "The area we are pointing at is one we can read with reasonable confidence."
2. The root driver is deliberately allowed to differ from the lowest scoring area. That is the entire point of the section, and your existing headline is right: "The area quietly driving the rest, not the loudest one."

**RULE, wording.** That headline uses "driving", which is causal. Change to: **"The area where one change reaches furthest"**. Sub: "Not the one that hurts most. The one most connected to the rest."

## 5.3 Contradiction reflections **DESIGN**

When self-report and a bounded signal disagree, LEWIS does not resolve it. It asks. Maximum **two** of these per report, chosen by strength.

| Contradiction | Reflection |
|---|---|
| PH at or above 55 **and** body map shows 3+ zones | "You described your body as doing reasonably well, and you marked tension in several places. Sometimes the body is carrying something before we have words for it. Worth a look." |
| EN at or above 55 **and** energy arc highly irregular | "Your energy reads as reasonably steady, and the shape you drew across the day is anything but. Steady on average is not the same as steady to live in." |
| RS at or above 67 **and** `relational_context` = "people around me, but feel unseen" | "By the questions, connection is not scarce for you. By your own description, it is not quite landing either. Those two things sit together more often than people expect." |
| `breath.settle_change` negative (more tension after) | "Stopping made you more tense, not less. That is common in people running hot, and it is a reason to start with settling rather than doing." |

**RULE.** Every contradiction reflection ends in an open question or an observation. Never a verdict, never a diagnosis, never a "this means".

## 5.4 Priority tension, the purpose-in-pain engine **DESIGN**

```
tension(d) = in_top_three(d) * max(0, 55 - score[d]) / 55
```

Select `argmax(tension)` where the value exceeds 0. This is the dimension surfaced at screen 22 for confirmation.

Handling of `context.tension_confirmed`:

- **Yes** → this becomes the report's opening frame and the primary plan anchor
- **Partly** → included as a section, softened, not the opening frame
- **Not quite** → suppressed from the report headline entirely, retained in the plan weighting at half strength

**RULE.** A person's "not quite" overrides the algorithm. That is what makes screen 22 a recognition moment rather than an assertion.

---

# Part 6. The suggestion engine, four gates

Suggestions pass through four gates in order. Failing any gate removes the suggestion.

## Gate 1. Safety **RULE, non-negotiable**

| Trigger | Effect |
|---|---|
| WHO-5 percentage at or below 50 | Compassion level 2, support resources surfaced |
| WHO-5 percentage at or below 28 | Compassion level 3, support surfaced prominently, plan reduced to one gentle step |
| All nine dimensions below 40 | Bright Spot tier 3, support prominent, no "do more" content anywhere |
| `support_preference` = "fragile right now" | Gentlest mode across the entire report |
| `transcendent_connection` = "painful right now" | All meaning-finding exercises suppressed |
| `cultural_belonging_1` = "real pain for me" | Cultural safety framing across all belonging and social content |
| Any disordered eating signal | **All** nutrition content suppressed, supportive resources offered instead |
| `recovery_responsiveness` = "more anxious when I stop" | Down-regulation before any activation suggestion |

**RULE.** No WHO-5 threshold, number, or the words "screening", "cut-off", "clinical" or "depression" ever appear in the interface or the report. The threshold governs tone and routing. It is never a finding shown to the person.

## Gate 2. Fit to friction **DESIGN**

The friction answer is the highest-value single input in the flow. The same low score with a Time barrier needs a completely different suggestion from one with a Mindset or Money barrier.

| Friction | Suggestion shape |
|---|---|
| Time | A habit of 30 seconds to 2 minutes, attached to something already happening |
| Energy | Down-regulation or subtraction first. Never an addition |
| My surroundings | A one-time environmental change, not a repeated behaviour |
| How I am thinking about it | A reframe delivered before any behaviour is proposed |
| Competing priorities | An explicit trade, naming what gets smaller |
| Money | Zero cost only. No paid programme may be suggested |
| Access to what I need | Offline and solo options only |
| Honestly, nothing obvious | Default to smallest-viable with an experiment framing |

## Gate 3. Capacity sizing **DESIGN**

```
capacity = f(planner_readiness, prior_attempts, cumulative_load, support_preference)
```

| Signal | Effect on size |
|---|---|
| `planner_readiness` = "too overwhelmed for a plan" | One step only. No 7-day plan is offered |
| `prior_attempts` = "didn't stick" | Habit size reduced by one tier, plus mandatory "why this one is different" framing |
| `cumulative_load` = heavy | Habit size reduced by one tier |
| `support_preference` = "fragile right now" | Smallest tier, always |
| `support_preference` = "want to be challenged" | May move up one tier, but never past what Gate 1 allows |

Your existing string is the right destination: "What comes back begins with one habit small enough to actually do. Support always comes before anything else."

## Gate 4. Evidence tier **RULE**

Every suggestion in the library carries a tier, and the tier is visible in the report.

| Tier | Meaning | Example |
|---|---|---|
| Established | Supported by systematic review or multiple RCTs | Regular physical activity for mood |
| Emerging | Promising primary evidence, not yet consolidated | Specific nature dose recommendations |
| Practice-based | Widely used, sensible, without a strong evidence base | Most environmental tidying suggestions |

**RULE.** No suggestion may enter the library without a tier and a source. Untiered content is a build failure, not a content gap.

**RULE, conflict of interest.** If a suggestion maps to a Lifed product, it is labelled as such at the point of suggestion. Fixed disclosure line: "Some of what LEWIS suggests comes from Lifed's own programmes. We tell you which, every time."

---

# Part 7. Report generation

## 7.1 Structure

Mapping to sections that already exist in your build:

| # | Section | Driven by |
|---|---|---|
| 1 | Opening frame | `arrival_word`, tension confirmation, compassion level |
| 2 | The Shape of Your Wellbeing | Nine petal diagram, bands, with the 0.2 framing line |
| 3 | What Each Area Asks of You | Band descriptor plus one personalised line per dimension |
| 4 | Where Tension Settles in Your Body | Body map, stress cluster, recovery responsiveness |
| 5 | Your Day, As You Described It | Energy arc, evening stress |
| 6 | How Strain in One Area Is Arriving in the Next | Connection map, max five edges |
| 7 | Where One Change Reaches Furthest | Root driver |
| 8 | Ground You Can Rely On | Bright Spot plus the highest banded areas |
| 9 | The One Thing | Single suggestion through all four gates |
| 10 | How Confident This Report Is, Area by Area | Confidence tiers |
| 11 | What We Used | Every instrument named, with citation |

## 7.2 The opening frame **RULE**

The first sentence uses the person's own arrival word where given. Three variants by compassion level:

- **Level 1:** "You arrived here describing yourself as [word]. Here is what your answers say sits underneath that."
- **Level 2:** "You arrived here describing yourself as [word]. Some of what follows is hard, and none of it is a verdict on you."
- **Level 3:** "You arrived here describing yourself as [word]. Before anything else: what you described is a heavy load to be carrying, and it deserves more support than a report can give."

**RULE.** Every report contains this sentence, unchanged, in the first section: **"This describes the season you are in, not the kind of person you are."** It is already in your build and it is the single most important line in the product.

## 7.3 Absolute copy prohibitions in the report **RULE**

Banned: diagnosis, disorder, symptom, condition, clinical, screening, cut-off, deficiency, dysfunction, cortisol, hormone, vagal, autonomic, neural, brain state, cognitive capacity, resilience index, baseline metrics, above average, below average, normal range, healthy range, percentile.

Also to be removed from the current build: "Your assessment metrics demonstrate strong baseline resilience with focused opportunities for nervous system regulation and restorative recovery practices." That sentence appears to be static, is written in a clinical register, and would be the first thing a reviewer quoted.

## 7.4 The `Not enough to say` state **RULE**

When a dimension returns `Not enough to say`:

> **[Area]**: you skipped part of this section, so we are not going to guess. This area is left open rather than filled in.

It renders as an unfilled petal on the diagram, visibly distinct from a low score. It is excluded from the connection map, root driver selection and Bright Spot selection.

---

# Part 8. Worked example

Meera, 34, professional and primary caregiver. Life stability "Unsettled". Pressures: Workload, Financial pressure, Sleep depletion.

| Dimension | Score | Band | Confidence |
|---|---|---|---|
| PH | 34 | Running on empty | Held loosely |
| EM | 38 | Running on empty | Well supported |
| EN | 40 | Stretched | Reasonably supported |
| RS | 67 | Holding | Reasonably supported |
| MS | 58 | Holding | Reasonably supported |
| AC | 72 | A real strength | Well supported |
| FW | 35 | Running on empty | Reasonably supported |
| IG | 45 | Stretched | Held loosely |
| EC | 61 | Holding | Held loosely |

**Sort divergence:** she placed Money in "Doing okay" (midpoint 55) against a score of 35. Divergence of −20, not flagged, sits right at the boundary. Financial confidence unchanged.

**Deep dives fired:** PH, FW, EM (three lowest, all under 55). She never sees the other six.
- PH: "Sleep isn't restoring me" + "There's no time to rest or recover", same, friction **Time**
- FW: "Money worry sits with me most days", varies, friction **Money**
- EM: "My mind feels constantly busy or racing" + "It's hard to switch off", **worsening**, friction **Energy**

**Nudges:** body map shows 4 zones, PH already below 55, so `nudge_PH = −4`. PH_base was 38, PH lands at 34. Band unchanged, so the nudge stands.

**Connection map:** three edges activate.
- PH → EM (both under 55, confirmed by the Sleep depletion pressure and the "sleep isn't restoring me" flag)
- FW → EM (both under 55, confirmed by the Financial pressure pressure and the money worry flag)
- EM → IG (both under 55, confirmed by the "too drained to feel curious" pattern)

PH → EN is on the exclusion list and is not drawn.

**Root driver:** PH. Weighted out-degree 1, depletion 0.38, priority flag 0 (her top three were Emotional calm, Money, Meaning), trajectory same, friction Time at 1.0. FW competes but its friction is Money at 0.3 and its out-degree is also 1. PH wins on actionability. PH is Tier C confidence, so constraint 1 fires and the engine checks the next Tier A or B candidate: **EM**, which has out-degree 1, deeper depletion, priority flag 1, and worsening trajectory. **EM is named**, with the added line about reading it with reasonable confidence.

**Priority tension:** Emotional calm is in her top three and scores 38. `tension = 1 × (55 − 38)/55 = 0.31`. Money is also in her top three at 35, `tension = 0.36`. Money wins and is surfaced at screen 22. She answers **Yes**, so Money opens the report.

**The One Thing:** Gate 1 passes with compassion level 2 (WHO-5 percentage 44). Gate 2 reads friction Energy for EM, so down-regulation before activation. Gate 3 reads `prior_attempts` "didn't stick" and heavy cumulative load, so two tiers down to the smallest viable. Gate 4 requires an Established tier suggestion. Output: a 60 second wind-down anchored to an event that already happens every evening, with "why this one is different" framing, and no financial task in week one despite Money opening the report, because her friction there is Money itself and her capacity is at floor.

That last outcome is the engine working correctly. The report opens where it hurts and starts where it can move.

---

# Part 9. What to validate, and in what order

| Priority | Study | Question | Sample |
|---|---|---|---|
| 1 | Internal consistency | Do the borrowed instruments hold their published alphas in your actual population? | 300 completions |
| 2 | Structural correlation audit | Do the nine dimensions correlate the way the prior link set assumes, or is anything correlating because of shared items? | 500 completions |
| 3 | CFPB rescale divergence | Does the LEWIS linear rescale distort the tails against the original IRT scoring? | 1,000 completions |
| 4 | Gestalt divergence rate | How often do sort and score disagree, and does divergence predict anything? | 500 completions |
| 5 | Nudge contribution | Do the bounded nudges add any variance the self-report does not already carry? | 500 completions |
| 6 | Test-retest | How stable are the nine scores over two weeks in people reporting no life change? | 150, two administrations |
| 7 | Perceived accuracy | Does the report feel true, and does perceived accuracy track measured confidence? | 200, post-report survey |

**RULE.** Until study 1 completes, the phrase "validated" may not appear anywhere in LEWIS marketing. The instruments are validated. The composite is not, and the distinction is exactly the kind a regulator or a journalist would find.

---

# Part 10. Open decisions this document needs

1. **Prior link set.** I have given the structure and an illustrative table. The final edge list needs a source citation per edge and a research review. This is the next piece of work and it is roughly a week.
2. **Weights in `leverage()`.** The five coefficients are a first authored guess. They should be tuned against perceived-accuracy data from study 7, not left as permanent.
3. **Band boundaries.** 39 / 54 / 69 are LEWIS decisions. Once you have 1,000 completions, check the resulting band distribution. If 70 percent of people land in one band, the boundaries need moving.
4. **`intellectual_recency` weighting at 0.30.** A single recency item carrying 30 percent of a dimension is a lot. Reduce to 0.20 if the growth items hold together in study 1.
5. **Whether the connection map ships in v1 at all.** It is the most attackable section in the report and the most valuable. My recommendation is that it ships, gated at a minimum of two active edges, with the "not clustering" fallback copy, and never with causal language.
