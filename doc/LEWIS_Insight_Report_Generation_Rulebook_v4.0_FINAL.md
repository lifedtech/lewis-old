# LEWIS Insight Report: Generation Rulebook

**Version 4.0 · Final.** The authoritative contract for generating a complete LEWIS Insight Report, in the redesigned twenty-five page format, for any user who finishes the full journey.

This version supersedes v3.2. The words are unchanged: v4.0 carries the exact v3.2 content, voice, safety rules, distinctiveness requirements and appendix binding. What changed is the container. The report is redesigned from sixteen dense pages into **twenty-five pages that breathe**, grouped into six parts behind a contents page, and rendered in a new visual system: a single Nunito typeface, a deep-teal and green palette, a consistent line-icon set, rounded cards, redrawn data graphics, and photographic program imagery. Every page-by-page spec below is renumbered to the twenty-five page structure, and **Part C is new**, carrying the full visual system so any user's report renders like the approved redesign. A report generated to this rulebook should be indistinguishable in look and structure from that redesign.

---

## 0 · How to use this document

Three parts, two readers.

- **Part A, engineering context (§1 to §4).** Where generation sits in the pipeline, the data contract it consumes, and the invariants nothing downstream may break. Read once.
- **Part B, the generation contract (§5 to §19).** The prescriptive spec the generation model follows, page by page. This is what gets compiled into the generation system prompt.
- **Part C, the visual system (§20 to §24).** New in v4.0. How the report looks: typeface, palette, page furniture, components, data graphics and imagery, plus a design self-check. Read alongside Part B so the words land in the redesign, not a plain page.

**The golden rule.** The enriched object decides; the model narrates. Every band, connection, starting point, safety flag and suggestion is fixed before a word is written. The model's job is warmth, clarity and usefulness to one specific person. It never decides what is true about that person.

**What changed across versions, and why.** The through line, from v3.0 onward, is one principle: the report belongs to the reader, not to the system that produced it. v3.2 added one commercial intent, to help the reader take the program step that fits them. v4.0 changes only the container: the same words, in a redesigned twenty-five page format that gives each idea room to land.

| Changed | From | To |
|---|---|---|
| Research placement | A "grounded in research" strip on nearly every page | One appendix at the end. No citations in the body at all |
| System vocabulary | Evidence architecture table, read-type labels, data-quality box, matching gates, ranking weights, learning-status disclosure | All removed. Replaced with content that helps the reader understand themselves |
| Suggestions | Three pages | Four pages, with the anchor practice given a full page and every optional support carrying a personalised rationale |
| Distinctiveness (v3.1) | Not addressed | §19 targets rhetorical skeleton repetition, the actual cause of low uniqueness scores |
| Programs page (v3.2) | Optional and second, free-path-first, hedged with what-would-not-suit, host questions, a one-question test and an honest-word-about-fit box | A confident lead-to-programs page: the research-backed case for attending, two best-fit programs, a call to action. The caveat boxes are removed |
| Voice (v3.2) | Unhurried | Tightened by about ten percent for pace, with identical conclusions and warmth |
| Structure (v4.0) | Sixteen dense pages | Twenty-five pages that breathe, in six parts behind a contents page. Each crowded page is given room across two |
| Visual system (v4.0) | Two typefaces, tight cards, one wheel graphic | One Nunito typeface, a deep-teal and green palette, a consistent line-icon set, rounded cards, redrawn data graphics, and photographic program imagery. Documented in Part C |

---

# PART A: ENGINEERING CONTEXT

## 1 · Where generation sits

```
 RAW INPUTS            SCORING              INFERENCE                 GENERATION            RENDER
┌──────────┐   ┌───────────────────┐  ┌────────────────────┐   ┌──────────────────┐   ┌─────────┐
│ Answers  │   │ L1 input variable │  │ L4 patterns,       │   │ L5 Insight Report│   │ HTML to │
│ Signals  │──▶│ L2 dimension score│─▶│    state portrait, │──▶│  Spine: fixed    │──▶│  PDF    │
│ Context  │   │ L3 band, conf,    │  │    leverage,       │   │  Voice: warmth   │   │  25 pp  │
│ Priority │   │    composites     │  │    disclosure      │   │  Appendix bind   │   │         │
└──────────┘   └───────────────────┘  └────────────────────┘   └──────────────────┘   └─────────┘
                                              │                          ▲
                                              └──── ENRICHED OBJECT ──────┘
                                                    (the only input to generation)
```

Generation reads exactly one thing: the enriched object. It never sees raw answers, never recomputes a score, never re-reads a signal. This boundary is what makes every report reproducible and auditable. Two identical objects produce identical conclusions. An auditor can trace any sentence back to a field.

## 2 · The two roads

| | **The spine (deterministic)** | **The voice (generative)** |
|---|---|---|
| Produced by | Code, before the model is called | The generation model |
| Contains | Which sections appear, each band word, each connection, the starting point, the disclosure register, safety inserts, the licensed appendix entries | The prose a person actually reads |
| May change at generation time | Nothing | Wording, emphasis, length within a section |
| Fails safe by | Being computed first | Being constrained to restate the spine only |

When the spine and the model's instinct disagree, the spine wins. When saying less would be safer, say less.

## 3 · The enriched object

The complete data contract. Field names are normative.

```json
{
  "completion":  { "mode": "full" },
  "lwi": {
    "mean": 66.8, "band": "Steady", "shape": "uneven",
    "spread": { "min": 21, "max": 84, "sd": 18 },
    "sanity_flag": false
  },
  "dimensions": {
    "PH": { "score":21, "band":"Running on empty", "confidence":0.67,
            "read_type":"supported",
            "position": { "bucket":"lower range", "shown":true },
            "instrument":"composite:sleep+activity+WHO5_rest_vigour",
            "skipped_items": 0 },
    "EM": { "score":72, "band":"Under pressure", "confidence":0.86,
            "read_type":"clear",
            "position": { "bucket":"around the middle", "shown":true },
            "instrument":"PSS10+WHO5_mood", "skipped_items": 0 }
  },
  "patterns": [
    { "id":"recovery_load",       "label":"Carrying a lot",             "confidence":"reflection", "connects":["PH","EM"] },
    { "id":"stress_load_pattern", "label":"Wired and hard to switch off","confidence":"reflection" },
    { "id":"energy_rhythm",       "label":"Evening riser",              "confidence":"reflection" },
    { "id":"bright_spot",         "dimension":"MS", "tier":"genuine",   "confidence":"measurement" }
  ],
  "portrait": {
    "id":"resourced_stretched", "label":"Resourced and stretched",
    "is_state_not_type": true,
    "traceable_to": ["LWI>=Steady","shape=uneven","PH<55"]
  },
  "leverage": { "primary":"PH", "downstream":["EN"], "coherence":"offer", "is_pair":false },
  "disclosure_plan": {
    "PH":"offer", "EM":"assert", "leverage":"offer",
    "stress_load_pattern":"gentle_reflection", "distress":"none"
  },
  "norms": { "cell_used":"25-34|female|south-metro", "cell_confidence":"stable" },
  "safety": {
    "minor": false,
    "cultural_safety": { "fired": false },
    "distress": { "tier":"none" },
    "disordered_eating": { "fired": false }
  },
  "commerce": { "cap":"none", "reason":null },
  "handoff": { "lead_with":"down-regulation", "primary_focus":"PH", "habit_sizing":"tiny" }
}
```

### 3.1 · What each field obliges

| Field | Obligation on generation |
|---|---|
| `completion.mode` | `full` selects the 25-page set. `pulse` selects the 2-page short form. Conclusions identical, depth differs |
| `lwi.band`, `lwi.shape` | Sets the overall-shape sentence on page 7. `uneven` requires strengths to be named before stretched areas |
| `dimensions[d].band` | The only band word permitted for that area. Never soften, never upgrade |
| `dimensions[d].read_type` | Sets firmness of voice per §8. Never printed as a label |
| `dimensions[d].confidence` | Never printed, never referenced. Drives `read_type` upstream only |
| `dimensions[d].instrument` | Selects the appendix row for that area. Never appears in the body |
| `dimensions[d].skipped_items` | If above zero, the honest thinness language is required for that area |
| `dimensions[d].position.shown` | If `false`, no comparative language anywhere for that area |
| `patterns[].confidence` | `reflection` patterns must read as reflections of the person's own description |
| `patterns[].connects` | The only connections that may be drawn on pages 9 and 10 |
| `portrait.is_state_not_type` | The season-not-type framing is required on page 5 |
| `leverage.primary` | The starting point. May differ from the lowest area. Never corrected |
| `leverage.coherence` | Firmness of the starting-point claim |
| `disclosure_plan[key]` | Per-section register. May be lowered, never raised |
| `safety.*` | Triggers mandatory behaviour per §16. Outranks everything |
| `commerce.cap` | Gates the programs page (page 21) per §13.3 |
| `handoff.*` | Seeds the pathway lead, focus and habit size |

## 4 · Invariants

Hold across every report, every user, every variant.

1. **A season, not a type.** The report describes an arrangement right now. Never a personality, a diagnosis, or a verdict.
2. **Four words, not scores.** No numeric score, confidence value, or percentile digit reaches the page.
3. **Company, not cause.** Connections describe areas that move together. Cause language is forbidden.
4. **Answers carry the reading; exercises add texture.** The short interactive moments may deepen or question what the answers suggested. They may never raise a concern alone.
5. **Circumstances shape words and suggestions, never magnitude.** What a person tells the reflection about their life changes what is said and offered. It never changes how an area was read.
6. **The free anchor comes first.** The reader always meets their free anchor practice earlier in the report, before the programs page. The programs page may then lead confidently toward paid support.
7. **Care before commerce.** When money is strained or safety fires, suggestion scope narrows automatically, and the persuasive framing of the programs page (page 21) softens or is suppressed per §13.3. This outranks the commercial intent.
8. **Evidence, never a personal prediction.** Programs may be recommended, and recommended persuasively, using what research has found across groups of people. No specific outcome is ever promised to this reader.
9. **Absent stays absent.** A skipped question, an unavailable signal, or a thin comparison group is named as missing or omitted entirely. Never imputed, never simulated.
10. **Privacy by architecture.** No route exists for individual data to reach an employer. Identifiers stay out of any learned pattern.
11. **Same object, same conclusions.** Warmth may vary between runs. Conclusions may not.
12. **Safety outranks everything.** Tone, length, engagement, and commercial considerations all yield.
13. **No system vocabulary in the body.** The reader never encounters the machinery that produced their report. See §6.
14. **Research lives in the appendix.** No citation, study name, or instrument name appears in pages 1 through 23. The two appendix pages (24 and 25) are the only place any of it appears.
15. **One typeface, one system.** Every page is set in Nunito and uses the Part C palette, icon set and components. The visual system is part of the contract, not decoration.

---

# PART B: THE GENERATION CONTRACT

Everything below is written to the generation model. Where it says *must*, the self-check gate (§17) enforces it.

## 5 · Your role

You receive an enriched object and a per-section spine. You produce warm, clear, specific prose that restates what the spine licenses, in language written for one person reading about their own life. You never decide what is true about them. That is already decided.

Three habits define good output here:

- **Specific over general.** "Your tension clustered around the jaw, shoulders and upper back" beats "you carry tension." The reader should recognise themselves on every page.
- **Useful over impressive.** Every paragraph should leave the reader knowing something they can act on or notice. Cut anything that only demonstrates thoroughness.
- **Kind without softening.** Say the difficult thing plainly, then say what it means and what to do. Warmth is in the framing, not in the hedging.

## 6 · The vocabulary firewall

The reader must never encounter the system that produced their report. This is not cosmetic. A report that narrates its own machinery reads as a system output rather than a reflection, and it invites the reader to evaluate the tool instead of understanding themselves.

**Never appears anywhere in pages 1 to 23 (the body):**

| Forbidden | Why | Say instead |
|---|---|---|
| Instrument names (WHO-5, PSS-10, UCLA, PROMIS, CFPB, Flourishing Scale) | System vocabulary | Nothing in the body. The appendix names them |
| Any citation or author-year | Belongs in the appendix | Nothing in the body |
| "clear read", "supported read", "early read" | Internal labels | Express through wording firmness instead |
| "evidence layers", "core", "texture", "context", "voice" as named layers | Architecture description | Describe what the reflection did, plainly |
| "data quality", "coherence", "confidence score" | System diagnostics | "Where this report is most and least certain" |
| "the engine", "the algorithm", "the model", "matching gates", "ranking weights" | Machinery | "This report", "your reflection" |
| "leverage point", "disclosure", "enriched object" | Internal terms | "Where to begin", "your starting point" |
| "learning status", "outcome-trained matching", "consented attendees" | Roadmap detail | Nothing. Express the limit as "fit, not prediction" |
| "fictional demonstration", "illustrative", "prototype" | Draft artefacts | Nothing in a real user report |
| Percentile digits, score numbers, confidence values | False precision | The four band words |

**The test.** Read any paragraph and ask: would a thoughtful person reading about their own wellbeing find this useful, or does it explain how the tool works? If the latter, cut it or replace it with something about them.

## 7 · Structure: the 25 pages

Six parts behind two pages of front matter. Each part answers the question the part before it raises. Where v3.0 crowded a topic onto one page, v4.0 gives it two, so nothing has to be shrunk to fit.

**Front matter**

| Page | Section | What it does for the reader |
|---|---|---|
| 1 | Cover | Name, date, the nine-petal picture, what this report is, how it was built, the non-clinical line |
| 2 | Contents | The six parts, page by page, plus an "if you read only three pages" shortcut |

**Part one · Orientation**

| Page | Section | What it does for the reader |
|---|---|---|
| 3 | How to read this reflection | The central idea, the four movements, what it can and cannot say, why there is no comparison |
| 4 | The four words this report uses | The four band words with a plain gloss, why words rather than a score, how to hold them |

**Part two · Your picture**

| Page | Section | What it does for the reader |
|---|---|---|
| 5 | Where you are right now | The whole-person opening, the map, and what they said matters most |
| 6 | What your picture is telling you | Holding-up versus thin-underneath, the day timeline, the "it minimises" line, the three constraints |
| 7 | The shape of your wellbeing | The nine-petal wheel, the nine bands strength-first, the overall-shape note |
| 8 | What each area is asking about | The plain-language table of what each area covers, and where certainty varies |

**Part three · How it connects**

| Page | Section | What it does for the reader |
|---|---|---|
| 9 | What seems to move together | The connections diagram, company not cause |
| 10 | Reading the connections | The links named, the protective ground, where to begin, the single-sitting caveat |
| 11 | How stress is showing up | Day rhythm, stress pattern, breathing minute, recovery, what the two lines say |
| 12 | Where the tension settles | The load indicator, the body map, the good news, why this shapes the sequence |

**Part four · A closer look**

| Page | Section | What it does for the reader |
|---|---|---|
| 13 | A closer look 1 of 3 | The three areas nearest the starting point |
| 14 | A closer look 2 of 3 | The strengths, and how to spend them |
| 15 | A closer look 3 of 3 | The areas that set what is realistic |

**Part five · Your plan**

| Page | Section | What it does for the reader |
|---|---|---|
| 16 | Your improvement pathway | The three-step flow, priorities, markers, why the plan is small |
| 17 | Your anchor practice | One practice in full: setup, feel, permissions, recovery from lapses |
| 18 | Your next seven days | The seven-day table, what a good week is, why an ending rather than a bedtime routine |
| 19 | Your optional supports | Four additions, each with a personalised rationale |
| 20 | Choosing, and small adjustments | The choosing table and the pattern adjustments |
| 21 | The programs made for where you are | The case for guided support, two best-fit programs with imagery, a call to book |

**Part six · After this**

| Page | Section | What it does for the reader |
|---|---|---|
| 22 | A thirty day experiment | Four weeks, four things to notice, questions to carry, lapse guidance |
| 23 | What stands behind this report | How the reading was formed, privacy, limits, the closing line |
| 24 | Appendix · the measures used | The nine measures, and the connections research |
| 25 | Appendix · the research behind it | Practice research, program research, how to read any of it, the colophon |

**The v4.0 splits.** Every place v3.0 asked one page to carry two jobs, v4.0 gives each job its own page: orientation becomes how-to-read (3) plus the four words (4); the opening becomes where-you-are (5) plus what-it-tells-you (6); the shape becomes the wheel (7) plus what-each-area-asks (8); the connections become the diagram (9) plus the reading (10); stress becomes the rhythm (11) plus where-tension-settles (12); the anchor becomes the practice (17) plus the seven days (18); the supports become the four supports (19) plus choosing-and-adjustments (20); the appendix becomes measures (24) plus research (25). The words within are unchanged from v3.2; they simply have room now.

**Eyebrow numbering.** Inside a multi-page part, the eyebrow carries its position: "A closer look · 1 of 3", "Your plan · 1 of 6" through "6 of 6", "Appendix · 1 of 2". Front matter and single-page parts use a plain eyebrow.

### 7.1 · Pulse variant

Two pages when `completion.mode = "pulse"`: the short read (one-sentence portrait, nine bands, the single connection that matters, the anchor, one program fit, retake rhythm) and an honesty page (what the snapshot omits, plus the variant law).

**The variant law.** Length variants differ in depth and wording only, never in conclusions, recommendations, or safety. The Pulse bands, starting point, anchor and program fit are identical in meaning to the full report's. The pulse uses the same Part C visual system: the nine-petal wheel, the band colours, and the header and footer furniture.

## 8 · Voice

### 8.1 · Register
Warm, plain, adult, unhurried. Second person. Short sentences over clever ones. No hype, no diagnostic vocabulary, no productivity-guru cadence. The target feel is a thoughtful letter from someone who paid attention.

### 8.2 · Punctuation
**No em-dashes and no en-dashes anywhere in the document.** Use commas, full stops, or a restructured sentence. This is a hard rule, checked mechanically before release.

### 8.3 · Firmness, expressed through wording rather than labels

| Object value | How it sounds on the page |
|---|---|
| `read_type: clear` / `assert` | Plain statement. "Your emotional world is not collapsing. It is carrying more activation than ease." |
| `read_type: supported` / `offer` | Invitation to test. "If this reads as true to you, your body currently holds less reserve than your responsibilities are assuming." |
| `read_type: early` / `soften` / `skipped_items > 0` | Named thinness. "This rests on fewer questions than the others, so hold it lightly and see whether it fits." |
| pattern `reflection` | Owned by the reader. "Drawn from how you described your own day." |

**Firmness may be lowered, never raised.** A supported reading may not become plain. The header line under a section title may indicate stance in reader language ("Offered as a reading to test against your experience"), never as a system label.

### 8.4 · Numbers
No dimension score, no confidence value, no percentile. Four band words and four-step visuals only. Where a reader might expect a number, explain why there is not one: a single sitting places someone honestly within a broad range, and a number would invite self-grading rather than understanding.

## 9 · Pages 1 to 12: front matter, orientation, picture, connections

**Page 1, Cover.** Name, date, location. The nine-petal picture of all nine areas, each petal reaching further the steadier that area. What this report is and how it was built, in two short cards. The non-clinical line at the foot. No draft or demonstration language.

**Page 2, Contents.** The six parts, each page listed with its number under its part heading. Close with a short "if you read only three pages" pointer to the whole picture, the shape, and the anchor. This page carries no findings; it is a map.

**Page 3, How to read this reflection.** Who it was prepared for, the central idea (a season, not a type), the four movements of the report, then two boxes v2.0 lacked: **what this report can and cannot say**, and **a note on comparison** explaining the reader is compared only to themselves.

**Page 4, The four words this report uses.** The four band words with a plain gloss each, in band order. A short note on **why four words instead of a score**, and a short note on **how to hold them**. This page teaches the reader the language every later page speaks.

**Page 5, Where you are right now.** Open on the reader's own word if they gave one, and agree-and-refine from there. When `shape = uneven`, strengths are named before the stretched area. The map shows the ground, the area asking for care, what sits downstream, and the first step. Close with what they said matters most and whether they confirmed it. The season-not-type framing is required.

**Page 6, What your picture is telling you.** Turn the opening into plain language: two columns, **what is holding you up** and **what is thin underneath**. A single pull-quote naming the crux of their pattern. A simple timeline of their day. Then three small cards naming the constraints that sized the plan. Circumstances shape the words, never the magnitude.

**Page 7, The shape of your wellbeing.** The nine-petal wheel, each petal reaching further the steadier that area. The nine areas strength-first, each with its band word. Close with the overall-shape note: what the whole field reads as, and that strong areas may be quietly subsidising stretched ones.

**Page 8, What each area is asking about.** A three-column table: area, their reading, and **what this area is asking about** in plain terms. Never instrument names. Close with a plain-language note on where the report is most and least certain: which areas rest on a full set of questions and which rest on fewer, and what that means for how firmly they are described.

**Page 9, What seems to move together.** The connections diagram, drawing only the links in `patterns[].connects`. Every line is company, not cause. A one-sentence synthesis. Keep the reading itself for the next page.

**Page 10, Reading the connections.** Name each link in reader language: the clearest link, the second link, the protective ground (a practical resource, not pleasant context), and where to begin. If the starting point is not the lowest area, say why plainly. Close with the single-sitting limitation.

**Page 11, How stress is showing up.** Day rhythm as the reader described it (energy and stress across the day), the stress pattern, the breathing minute, and recovery, all drawn from what the person told the reflection. Close with what the two lines together are saying. Not a sleep study, not a measurement of the body.

**Page 12, Where the tension settles.** The load indicator (how much they have been carrying) and the body map of where tension gathered, then the interpretation: the good news in it (they can still hear their body), the part to respect, and why this shapes the sequence that follows. Downshift first, build later.

## 10 · Pages 13 to 15: the closer look

Three pages, clustered by relationship to the starting point.

- **Page 13** covers the areas nearest the starting point.
- **Page 14** covers the strengths, framed as resources to spend rather than context to admire.
- **Page 15** covers the areas that set what is realistic: money, growth, environment.

Each area is a row: a coloured icon tile and band chip, a reader-facing stance line, then three short paragraphs, **what this means**, **what is distinctive or what supports it**, and **what to protect, watch for, or test**. No citations, no instrument names.

Each page closes with a synthesis box that connects the three areas to what comes next. Page 14's box must make the case that strengths are the plan rather than the background. Page 15's box must state how these areas bound the suggestions that follow.

## 11 · Page 16: the pathway

The three-step flow from `leverage` and `handoff`: start, may ripple to, then supports. The first move stated in one sentence. A framing box explaining the shape of the recommendation. Four cards: three priorities and the pacing. Four markers of improvement, framed as things to observe rather than outcomes promised.

**Required:** a closing box explaining **why the plan is smaller than the reader might expect.** Name their specific constraints, explain that a large plan under those conditions tends to fail in the first crowded week, and tell them that if it feels almost too easy it has been sized correctly. This preempts the most common misreading of a deliberately small plan.

## 12 · Pages 17 and 18: the anchor practice and the seven days

The single item most likely to survive gets two pages: the practice in full (17), then the week that carries it (18).

**Page 17, Your anchor practice.** Required blocks:

1. **The practice itself** in three columns: when (the cue), what you do, and why it is this small. A small "ten seconds, in three movements" visual is welcome.
2. **How to set it up tonight.** A concrete physical step the reader takes before the practice ever runs. Anchor to an object rather than to memory or motivation, and say why.
3. **What it should feel like.** Name the expected reaction, usually that it feels too small, and explain that this is the design working.
4. **Permissions.** Explicit permission to modify or skip parts. Remove any implication that there is a correct way to do it.
5. **If you forget, which you will.** Normalise lapses before they happen. A mistimed practice beats a skipped one; missing a day changes nothing while concluding they have failed changes everything.

**Page 18, Your next seven days.** One action per day, nothing more, as a seven-row table. Then **what counts as a good week** and **what would be too much**, and a closing box answering the obvious question the reader will have about why this practice rather than the one they expected.

## 13 · Pages 19 to 21: supports, choosing, and programs

### 13.1 · Optional supports (page 19)
Four items maximum, each with a category tag, a short description, and a **"why this, for you"** paragraph tied to a specific finding from their own reflection. Generic rationale is a failure here. If the item cannot be justified from their data, it does not belong on the page.

### 13.1a · Choosing, and small adjustments (page 20)
Two required tables:
- **How to choose between them.** Situation, which to try, and why. Include a row for "you are already at capacity" whose answer is none of them, stating that the anchor alone is a complete plan.
- **Small adjustments for your specific pattern.** Four short cards addressing their particular rhythm, friction, and load.

### 13.2 · Programs (page 21)
Page 21 is written to lead the reader toward the programs that fit them. The voice is confident and inviting, never tentative. A program is never framed as optional, and never positioned as a lesser second choice to the free path. The reader has already met their free anchor on pages 17 and 18, so this page is free to make the case for going further.

Open with the case for guided support: a short box naming what a program gives that solo practice cannot, such as skilled facilitation, a protected setting and a set time, and the pull of showing up alongside others. Back each advantage with a plain-language research finding, expressed as what studies have found across groups of people (for example, that a structured recovery course improved participants' recovery, sleep and sense of wellbeing in a controlled trial). Never an author-year citation in the body, and never a promise to this reader.

Then at most two programs, each presented as made for this reader, each on a card with a **cover photograph** (per §23), with:
- what it is, concretely: format, duration, size, setting
- the practical details as **placeholder chips** (host, venue, dates, places, all-in price) for the operator to fill
- **why this is the one for you**, reasoning from their findings
- **what you walk away with**, the tangible takeaway plus the group-level research advantage behind it

A second program is a complementary recommendation ("also made for you", or a deeper reset), never a "worth considering later" deferral. A genuinely off-pattern option may be named in one positive line as available for when circumstances change, never as a parked or de-recommended item.

Close with a **call to action** that invites the reader to reserve a place and bring the practice they have already started. Small-group scarcity and timeliness are fair to mention when true.

**Do not include on this page:** an optional or free-path-first framing, a "what would not suit you right now" box, host-vetting question lists, a one-question test, or an honest-word-about-fit caveat. The persuasive case is carried in prose the reader can evaluate, grounded in real findings.

**Never on this page:** matching gates, ranking weights, trace tables, learning-status disclosures, author-year citations, or any promise of a specific outcome to this reader. Persuasion draws on group-level evidence, never on a personal guarantee.

### 13.3 · Commerce gating

The lead-to-programs voice of §13.2 applies only when `commerce.cap` is `none` and no safety flag has fired. Otherwise this table governs, and it outranks the commercial intent.

| `commerce.cap` | Behaviour |
|---|---|
| `none` | Page 21 leads confidently toward the programs, as recommended next steps, after the reader has met their free anchor earlier in the report |
| `free_low_cost_only` | No paid program may lead. The persuasive framing is dropped. Paid options appear only as a clearly labelled later-if-it-fits note, with the reason given in plain terms |
| `suppressed` | No programs page beyond one line pointing back to the free path |

A commission may never raise a suggestion's prominence. Price sensitivity may only ever lower it. Any program shown must be justifiable from the reader's own findings, and any advantage cited must be a real group-level finding, never an individual promise.

## 14 · Pages 22 and 23: integration and what stands behind it

**Page 22, A thirty day experiment.** Four weeks with a distinct purpose each: build the cue, protect a boundary, add one support, retake and choose. A four-row table of moments to notice, each a single question with three options. Questions to carry, requiring no answers. Then a required closing box **on the days it does not go well**, stating that missed days are expected and built into the design, that the right response is to make the practice smaller rather than to try harder, and that the plan should shrink before self-judgement grows.

**Page 23, What stands behind this report.** Four cards in reader language: how the reading was formed, what the short exercises added, how their circumstances shaped the suggestions, and where the report speaks carefully. Then the privacy statement, four limits of a single reflection, and the closing line.

The privacy statement is not optional and not abbreviated. It must state that the report belongs to the reader, that individual answers never reach an employer and no route exists for that, that anything organisational is aggregated with small groups withheld, that identifiers stay out of any learned pattern, and that nothing is collected which the reflection does not need.

## 15 · Pages 24 and 25: the appendix

The only two pages where research appears. Page 24 opens by telling the reader that nothing here is required in order to use their reflection and none of it changes what the report says.

**Page 24, the measures used.**

1. **The measures behind each of the nine areas.** A table: area, the established measure with author and year, and what it is designed to capture in plain terms. Follow with a short note on why these measures were chosen (published, widely used, freely available, asking about wellbeing rather than screening for illness), that their wording is never altered, and that research practice treats short measures as indicating a broad range, which is why the report speaks in four words.
2. **The research behind the connections described.** Prose, not a table. Cover effort and recovery, resource spillover, difficulty switching off, and why the short exercises are treated as texture.

**Page 25, the research behind it.**

3. **The research behind the suggested practices.** Prose. Cover cue-anchored practices, habit formation and missed days, work-home boundaries, light progress noticing, and each practice actually suggested to this reader.
4. **The research behind the programs suggested.** Prose. Cover the design of each program type actually recommended.

**Close with "how to read any of this":** every study describes patterns across groups of people, which is the honest currency of wellbeing research. They are good reasons to expect a practice or design is worth someone's time, not predictions about the reader specifically, and no finding promises a result. Page 25 then ends with the colophon: report title, prepared-for line, the non-clinical line, and the Lifed logo.

**Only include what was used.** The appendix covers the nine areas plus the connections, practices, and programs that actually appear in this reader's report. Do not pad with unused sources. Do not omit one that was relied on.

## 16 · Safety

Safety flags trigger mandatory behaviour that outranks tone, length, engagement, and commerce.

### 16.1 · Distress

| `safety.distress.tier` | Required behaviour |
|---|---|
| `none` | Normal report |
| `note` | A gentle note on page 22. Normalise, state it is worth taking seriously, signpost to a trusted person or professional. No diagnostic language, no alarm, no amplification |
| `signpost` | The gentle note plus a clearer signpost earlier in the report. Suggestion intensity lowered. No high-commitment programs |
| `urgent` | Suppress most of the body. Lead with a calm, direct signpost to immediate human support. No programs, no commerce, no engagement asks |

Never ask assessment questions, never name methods, never reflect distress back in a way that intensifies it. When distress fires the report becomes gentler and shorter, never more analytical.

### 16.2 · Other flags

- **`minor: true`.** Age-appropriate throughout. No romantic or sexual framing. No commerce targeting a minor. Nothing about appearance, styling, posing, secrecy, or isolation. A refusal is never reversed under emotional pressure later.
- **`disordered_eating.fired: true`.** No numeric diet, exercise, weight, calorie, or macro guidance anywhere, even framed as healthy. Body and energy suggestions stay qualitative and gentle.
- **`cultural_safety.fired: true`.** Suppress the flagged area from any comparative display. Band word alone. Culturally neutral, non-judgemental language.

## 17 · The self-check gate

Run before emitting. Any failure means fix or remove.

**Vocabulary firewall**
- [ ] No instrument name, citation, or author-year appears in pages 1 to 23
- [ ] No internal label (clear read, supported read, early read, leverage, disclosure, engine, algorithm, data quality, learning status) appears anywhere
- [ ] No draft or demonstration language appears
- [ ] No score, confidence value, or percentile digit appears

**Punctuation**
- [ ] Zero em-dashes and zero en-dashes in the entire document

**Bands and readings**
- [ ] Every area uses only its object band word
- [ ] Supported readings are phrased as invitations to test; clear readings are not over-hedged
- [ ] Areas with skipped questions have their thinness named in reader language
- [ ] No comparative language where `position.shown` is false

**Connections and starting point**
- [ ] Every connection drawn exists in `patterns[].connects`
- [ ] No cause language anywhere
- [ ] The starting point matches `leverage.primary`, and if it is not the lowest area, the reason is stated
- [ ] The single-sitting limitation appears on page 10

**Suggestions**
- [ ] The free anchor precedes the programs page
- [ ] The commerce cap is honoured, and the §13.2 lead-to-programs voice is used only when the cap is `none` and no safety flag fired
- [ ] Every optional support has a rationale tied to a specific finding from this reader
- [ ] Every program has fit reasoning and a "what you walk away with" takeaway, with any advantage framed as a group-level research finding, never a personal promise
- [ ] Page 21 leads toward the programs, carries no optional framing, and includes none of the removed caveat boxes (what-would-not-suit, host questions, one-question test, honest-word-about-fit)
- [ ] The why-the-plan-is-small box appears on page 16
- [ ] The lapse guidance appears on pages 17 and 22

**Appendix**
- [ ] All research is on pages 24 and 25 and nowhere else
- [ ] Every measure listed corresponds to an area actually used
- [ ] Every claim is an association, average, or design rationale, never a promise
- [ ] The how-to-read-any-of-this note is present

**Safety and framing**
- [ ] Distress tier behaviour applied exactly
- [ ] Minor, disordered-eating and cultural-safety rules applied where flagged
- [ ] Season-not-type framing present on page 5
- [ ] Privacy statement present and complete on page 23
- [ ] Non-clinical line on the cover and in the running footer
- [ ] No employer-facing framing anywhere

**Structure and visual system (v4.0)**
- [ ] All 25 pages present, in the six-part order, behind cover and contents
- [ ] Each multi-page part carries its "N of M" eyebrow; every page has the running header, footer and page number
- [ ] Nunito throughout, Part C palette and band colours, the line-icon set, rounded cards; run the §24 design gate

## 18 · Measures and what each may claim

The appendix binding table. A measure may only be cited for the area it belongs to, and only for the kind of claim listed.

| Area | Established measure | Cite as | Kind of claim permitted |
|---|---|---|---|
| Meaning and direction | PROMIS Meaning and Purpose short form | Salsman et al., 2020 | Sense of purpose and direction in daily life |
| Relationships and support | Three item loneliness scale, read toward connection | Hughes et al., 2004 | Felt closeness and availability of trusted others |
| Environment and belonging | Connection to nature measure with belonging questions | Schultz, 2002 | Sense of place, grounding, cultural belonging |
| Curiosity and growth | Flourishing Scale | Diener et al., 2010 | Engagement, learning, sense of growth |
| Agency and work | General Self Efficacy Scale | Schwarzer and Jerusalem, 1995 | Belief that actions achieve intended results |
| Financial steadiness | Financial Well Being Scale | Consumer Financial Protection Bureau, 2017 | How money feels to live with, beyond income |
| Emotional calm | Perceived Stress Scale with wellbeing mood questions | Cohen et al., 1983 | How far demands have felt beyond capacity to respond |
| Body and recovery | Rest and vigour questions with sleep and activity questions | Topp et al., 2015 | Whether rest restores, whether reserve is present |
| Usable energy | Vigour and interest questions | Topp et al., 2015 | Availability of energy and engagement across the day |

### 18.1 · Connections research

| Used for | Cite as | Claim permitted |
|---|---|---|
| Effort carries cost into the next day without recovery | Meijman and Mulder, 1998 | Association, framed as how recovery works generally |
| Strain spreads to neighbouring areas; strengths slow it | Hobfoll, 1989 | Association about personal resources |
| Difficulty switching off relates to poorer rest and lower next-morning energy | Sonnentag and Fritz, 2007; 2015 | Consistent association across many studies |
| Why brief exercises are texture rather than evidence | Hedge, Powell and Sumner, 2018 | Single-session tasks are unreliable for individuals |

### 18.2 · Practice research

| Practice | Cite as | Claim permitted |
|---|---|---|
| Cue-anchored practices | Gollwitzer, 1999; Gollwitzer and Sheeran, 2006 | More likely to be carried out than intentions alone |
| Habit formation, missed days | Lally et al., 2010 | Repetition in a stable setting; one missed day made no measurable difference |
| Work-home boundaries | Ashforth et al., 2000; Kreiner et al., 2009 | Associated with easier evening disengagement |
| Writing tomorrow's tasks before bed | Scullin et al., 2018 | People settled faster in a controlled study |
| Light progress noticing | Harkin et al., 2016 | Associated with better follow through |
| Slow comfortable breathing | Zaccaro et al., 2018 | Greater self-reported calm |
| Calm listening | de Witte et al., 2020 | Lower self-reported stress |
| Brief green views | Lee et al., 2015; Kaplan, 1995 | Restored attention |
| Brief drawing | Drake and Winner, 2012 | Short-term mood lift, as distraction |
| Self-kindness after lapses | Neff, 2003 | Predicts returning to a practice sooner |
| Values writing, re-engagement | Cohen and Sherman, 2014 | Associated with re-engagement |
| Small valued activity for low mood | Mazzucchelli et al., 2010 | Lifts low mood |

### 18.3 · Program research

| Program type | Cite as | Claim permitted |
|---|---|---|
| Recovery skills course | Hahn et al., 2011 | In a randomised trial, improved recovery experiences, reported sleep quality, and sense of wellbeing |
| Low intensity movement | Puetz et al., 2008 | In a randomised trial with low-energy adults, increased energy and reduced fatigue |
| Gentle breath-led movement | Sharma, 2014 | Reviews report lower perceived stress |
| Small group formats | Cohen and Wills, 1985 | Supportive presence buffers the felt weight of strain |
| Nature contact | White et al., 2019 | Around two hours weekly associated with good self-reported health and wellbeing |
| Structured writing programs | Pennebaker and Chung, 2011 | Associated with clearer self-understanding over time |
| Connection generally | Holt-Lunstad et al., 2010 | Consistently associated with wellbeing |
| Financial strain | Netemeyer et al., 2018 | Perceived strain correlates with wellbeing beyond income |
| Purpose as a pillar | Ryff, 1989; Steger et al., 2006 | Purpose as a wellbeing pillar; searching as an active state |
| Self-efficacy | Bandura, 1997 | Shapes whether effort begins under strain |
| Job crafting | Wrzesniewski and Dutton, 2001 | Small self-directed task change associated with engagement |

---

## 19 · Narrative distinctiveness

Two reports built from different lives must read like two different documents, not one template with the nouns swapped. This section is the requirement and the method.

### 19.1 · What the measurement is actually telling you

If distinctiveness is scoring in the low seventies while the prose looks varied, the repetition is almost never in the vocabulary. Measure it and the picture separates cleanly into three layers.

| Layer | Example | Should it vary? |
|---|---|---|
| **Fixed frame** | Page titles, the four band words, table column stubs, the privacy statement, the non-clinical line, footers | **No.** This is the product's spine. Varying it would make reports inconsistent and harder to trust. It sets a permanent ceiling on any whole-document similarity score |
| **Rhetorical skeleton** | Every area explained as "what this means, what is distinctive, what to protect". Every support justified as "why this, for you". Every program closed with "what you walk away with" | **Yes, and this is where the loss is.** Word choice differs while the shape of the argument is identical, so reports feel interchangeable even when no sentence repeats |
| **Prose** | The actual sentences describing this person | **Yes, and it usually already does.** Sentence-level repetition between well-generated reports typically runs under two percent |

**The practical consequence.** Rewriting sentences harder will not move the number, because the sentences were never the problem. Distinctiveness is won by varying the **shape** of the explanation, not its wording. The rules below target shape.

**Measure it correctly.** Score distinctiveness on the generated prose only, with the fixed frame excluded, and compare reports from users with *similar* profiles rather than deliberately opposite ones. Two people who both read low on body and energy are the honest test. Two people with nothing in common will always look distinct and will flatter the number.

### 19.2 · Open from the person, never from the template

The first sentence of every prose block is where sameness is most visible and most fixable.

- **Lead with something only this reader could have produced.** Their own word for how they feel, the specific thing they ranked first, the hour their energy turns, where their tension settled, what they already tried and abandoned.
- **Never open two consecutive blocks with the same construction.** If one begins "Your reflection has...", the next must not begin "Your pattern has...".
- **Ban the throat-clearing opener.** "This area is about...", "It is worth noting that...", "Many people find that..." all delay the reader and could open anyone's report.

The test: cover the name and the band words. If a stranger could not tell which of two reports they were holding from the first sentence of each section, the opening has failed.

### 19.3 · Vary the shape of explanation

Each closer-look area must not use the same internal structure as the one before it. Rotate deliberately among these shapes, choosing whichever genuinely fits the finding rather than the next one in the list.

| Shape | Works well when | Runs roughly |
|---|---|---|
| **Observation to meaning** | The reading is clear and the implication is not obvious | Here is what shows, here is what it means for you, here is what to do with it |
| **Tension** | Something looks like a strength and carries a cost, or vice versa | This is genuinely working, and here is the price it is quietly charging |
| **Correction** | The reader probably holds a wrong theory about themselves | You might expect this to be about X, your pattern says otherwise, here is why |
| **Mechanism** | The reader will act better if they understand the how | This connects to that, in this specific way, which is why the small thing works |
| **Question** | The area is genuinely uncertain or the reader must decide | Here is what shows, here is what it might mean, here is how to find out |
| **Contrast** | Two of the reader's areas illuminate each other | This area behaves one way, that one the other, and the difference is the point |

**Hard rule.** Within any three consecutive areas, at least two different shapes must appear. Within the three closer-look pages taken together, at least four of the six shapes must appear.

### 19.4 · Let the findings set the emphasis

A template gives every area equal space. A reflection does not.

- **Length follows importance.** The area at the starting point earns the most room. A steady area with nothing pressing may take three sentences and stop. Padding a quiet area to match the others is the single clearest signal of a template.
- **The synthesis boxes must differ in kind, not just content.** One page might close by connecting three areas, another by correcting a likely misreading, another by naming what the reader should stop worrying about. Same slot, different job.
- **Some areas deserve an unexpected framing.** If a reading is genuinely surprising, say so and spend the space explaining it. If it is ordinary, treat it briefly and move on. Uniform treatment tells the reader that nothing here was actually noticed.

### 19.5 · Rotate the fixed slots

Certain blocks appear in every report by design. They must not appear in identical form.

| Slot | What must vary between reports |
|---|---|
| Page 8 certainty note | Whether it leads with what is firm or what is thin, and how it explains the difference |
| Page 10 uncertainty note | Which limitation is emphasised, and how it connects to that reader's specific pattern |
| Page 16 why-the-plan-is-small box | The specific constraints named, and the argument for smallness drawn from them |
| Page 18 closing question box | The actual question this reader is most likely to be asking about their anchor |
| Page 19 rationale paragraphs | The finding each support is justified from, never a general benefit statement |
| Page 21 case for attending | The research-backed advantages that most fit this reader's pattern, and the takeaway each recommended program offers |
| Page 22 lapse guidance | Framed toward this reader's likely failure mode, whether that is perfectionism, forgetting, or overload |

Same purpose in every report, different argument in every report. If one of these boxes could be lifted intact into another user's report, it has been written generically and must be rewritten from the findings.

### 19.6 · Metaphor and image discipline

- **At most one extended metaphor per report.** More than one produces a written-up feel rather than an observed one.
- **The metaphor must come from this reader's material**, such as their work, their described rhythm, their environment. A metaphor that would suit anyone suits no one.
- **Never reuse a signature image across reports.** A phrase like "the way a door learns its own click" belongs to exactly one report. Keep a suppression list of previously used signature phrases and treat a match as a defect.

### 19.7 · The banned-construction list

These phrasings are the fingerprints of template output. None may appear in any report.

- "It is worth noting that", "It is important to remember", "As mentioned earlier"
- "Many people find", "Most people in your situation", "It is common to"
- "This area is about", "This section covers", "Here we look at"
- "Your journey", "your wellness journey", "on this path"
- Any sentence that would be equally true of a reader with the opposite reading
- Any paragraph that could be deleted without the reader losing information about themselves

### 19.8 · The distinctiveness gate

Run alongside the §17 self-check. Any failure means rewrite, not adjust.

- [ ] No two consecutive prose blocks open with the same grammatical construction
- [ ] At least four of the six explanation shapes appear across the closer-look pages
- [ ] At least two different shapes appear within any three consecutive areas
- [ ] Section lengths vary in proportion to what the findings actually warrant
- [ ] Every rotating slot in §19.5 argues from this reader's specific findings
- [ ] At most one extended metaphor, and it derives from this reader's material
- [ ] No signature phrase from the suppression list is reused
- [ ] No banned construction from §19.7 appears
- [ ] **The lift test:** no paragraph could be moved into a different user's report and still make sense
- [ ] **The cover test:** with names and band words hidden, the opening sentence of each section identifies which report it belongs to

### 19.9 · What must never vary

Distinctiveness is a property of the writing, never of the findings. The following are identical in structure across every report and must stay that way.

- The twenty-five page sequence, the six-part grouping, and every page title
- The four band words and their meanings
- The privacy statement, the limits, and the non-clinical line
- Every safety insert and its wording discipline
- The free-path-first rule and the fit-not-prediction framing
- The appendix structure and the claims each measure licenses

Two people with identical enriched objects must still receive identical conclusions. Variation belongs in how the truth is told, never in what the truth is.

---

# PART C: THE VISUAL SYSTEM

New in v4.0. This is how the report looks, so a report generated for any user is visually the same document as the approved redesign. The words come from Part B; the look comes from here. Reference implementation: the redesigned `LEWIS Insight Report` (design-canvas HTML, with an `assets/` folder for imagery and the logo).

## 20 · Foundations

### 20.1 · Canvas
Each page is a fixed A4 sheet, **794 x 1123 px** portrait, `box-sizing: border-box`, `position: relative`. Content pages use padding **28px 54px 54px**; the cover uses **64px 62px 46px** on a full-bleed dark panel. One `<section class="page">` per page, in order, twenty-five in total. Backgrounds are white for content pages, deep teal for the cover.

### 20.2 · Typeface
**Nunito, and only Nunito** (Google Fonts; weights 400, 500, 600, 700, 800, plus italic 400 and 600). No second family. System fallback: `-apple-system, "Segoe UI", system-ui, sans-serif`. Base body is `400 12.5px/1.62`.

### 20.3 · Palette
Deep teal is the brand, green is the positive note, and the four bands own four fixed hues.

| Token | Hex | Used for |
|---|---|---|
| Teal 900 | `#013e39` | Cover panel, all headings, strong emphasis |
| Teal 800 | `#015c54` | Table header fill, part labels |
| Teal 700 | `#017a6f` | Running brand, small-caps labels, link hover |
| Teal 600 | `#019386` | Page numbers, icon strokes, section labels |
| Teal 500 | `#01ad9c` | Primary accent, eyebrows, links, best-fit border |
| Teal 300 | `#6dc6ba` | Cover accents |
| Teal 200 | `#a7dcd4` | Dotted rules, soft strokes |
| Mint line | `#d6edea` | Card borders on mint fills |
| Mint fill | `#eaf7f5` | Info boxes, soft cards |
| Ink | `#252626` | Default text colour |
| Body | `#414242` / `#585858` | Paragraph text |
| Muted | `#757676` | Captions, secondary text |
| Faint | `#a4a5a5` | Footer, header-right, hairline captions |
| Rule | `#ededed` | Card borders, header and row rules |
| Warm fill | `#faf8f4` / `#f6f6f6` | Neutral card fills, zebra rows |

**Band colours (fixed, one hue per word):**

| Band word | Ink | Chip fill | Chip text |
|---|---|---|---|
| Strong | `#5fba46` (dark `#4ea038` / `#3d7f2c`) | `#eef7ea` / `#dcefd3` | `#3d7f2c` |
| Steady | `#01ad9c` (`#019386`) | `#eaf7f5` | `#017a6f` |
| Under pressure | `#e0a03a` (`#c08420`) | `#fbf0dc` (line `#f0ddc0`) | `#a8761f` |
| Running on empty | `#d0574f` (`#b04740`) | `#f9e5e3` (line `#f2cdc9`) | `#b04740` |

The **amber "attention"** callout uses `#fbf0dc` fill, `#f0ddc0` border, `#a8761f` label, `#c08420` icon. The **mint "information"** callout uses `#eaf7f5` fill, `#d6edea` border, `#017a6f` label, `#019386` icon.

### 20.4 · Shape and rhythm
Corners are generously rounded: **cards 14 to 18px**, chips and pills **999px**, small icon tiles **8 to 16px**. Borders are hairline (1px, occasionally 1.6px for an emphasised card). Pages are vertical flex columns with a `row-gap` of roughly 18 to 26px between blocks. Nothing is cramped; the white space is the point of the redesign.

## 21 · Page furniture

Every content page (3 to 25) shares the same frame:

- **Running header.** Left: `LIFED / Your LEWIS reflection`, `700 10px`, `.14em`, uppercase, teal 700 (the slash portion faint grey). Right: reader name and date, `600 9px`, uppercase, faint. A 1px `#ededed` rule underneath.
- **Eyebrow.** `700 9.5px`, `.2em`, uppercase, teal 500. Inside a multi-page part it carries the position ("A closer look · 1 of 3", "Your plan · 3 of 6", "Appendix · 1 of 2").
- **H1.** `800 24px/1.1`, `-.015em`, teal 900.
- **Deck.** `400 12.6px/1.45`, body grey, max-width ~600 to 640px, directly under the H1.
- **Section labels.** The small caps titling a block: `700 9px`, `.16em`, uppercase, teal 600 or 700.
- **Forward line ("Next").** Absolutely positioned, bottom 48px: a 1px dotted teal-200 rule, then `NEXT` (teal 500, `.16em`) and one sentence pointing to the next page, in teal 700.
- **Footer.** Absolutely positioned, bottom 26px: left, `Private to you · a non-clinical wellbeing reflection`, faint; right, the page number, `800`, teal 600, `.1em`.

The **cover** breaks the frame: a full deep-teal panel, the inverted white logo, a "Full reflection" pill, the 46px title with a short green underline rule, the prepared-for block, the nine-petal diagram, a band legend, the two intro cards, and the non-clinical line, all in white and translucent white.

## 22 · Components

- **Card.** Rounded 14 to 16px, 1px `#ededed`, optional warm or mint fill. Usually an icon and small-caps label, then a title (`800 12 to 13px`, teal 900), then body.
- **Callout box.** A card with an icon on the left and content on the right. Mint for information and grounding, amber for "pay attention", warm neutral for asides. The closing synthesis box on each closer-look page is a mint callout.
- **Band chip.** A 999px pill in the band's chip fill and chip text colour, `700 10px`. Always the object band word, never anything else.
- **Icons.** One family of thin line icons (lucide style: `stroke-width 1.7`, round caps and joins, `fill:none`, `currentColor`), 14 to 22px, coloured to context. Section markers, card and box icons, map and area markers. Never clip-art, never filled illustrations.
- **Table.** Header row filled teal 800, white `700 9.5px` uppercase text, end header cells rounded. Body rows `400 11px`, 1px `#ededed` separators, zebra fill `#faf8f4`, first column bold teal 900.
- **Pull-quote.** A single strong line, `800 22px`, teal 900, with a 3px teal-500 left border. At most one per opening page.
- **Placeholder chips (programs).** Operator-fillable fields render as dashed monospace chips: light fill, 1px dashed `#dcdcdc`, `10px ui-monospace`, muted text, reading `[ host name ]`, `[ venue ]`, `[ dates ]`, `[ places ]`, `[ all-in price ]`. These replace the old `{{merge}}` tokens and must read as human placeholders.

## 23 · Data graphics and imagery

All charts are hand-built inline SVG in the palette above. They are pictures of this reader's data, never stock decoration, and they carry no numbers (the four-words rule holds inside graphics too).

- **The nine-petal wheel (cover and page 7).** Nine petals around a labelled hub, each petal reaching further out the steadier that area, each filled and stroked in its band colour. The hub reads the overall shape ("Steady", "but uneven"). A legend counts the bands.
- **The "where you are" map (page 5).** Nodes for the ground ("a place to stand", green), the "you are here" centre, the area asking for care (red), and downstream areas (dashed), joined by coloured arrows, with the first-step callout at the foot and a one-sentence read.
- **The day timeline (page 6).** One horizontal bar split into work-at-full-weight, work-minimised, and light-rest segments, marked where the laptop closes.
- **The connections diagram (page 9).** Only the licensed links, each sized to its area's reading, company not cause.
- **The stress lines and body map (pages 11 to 12).** Two lines for energy and stress across the day; a simple body outline marking where tension gathered.

**Program imagery (page 21).** Each program card carries a calm, daylit, non-clinical **cover photograph** (~98px tall, full width, `object-fit: cover`) from the `assets/imagery/` library (evening practice, restful outdoor session, and similar). Choose an image matching the program's real feel; never a stock image implying a medical setting or a guaranteed transformation. The **Lifed logo** (`assets/logo-lifed.png`) appears white-inverted on the cover and full-colour in the page 25 colophon.

## 24 · The design self-check gate

Run alongside §17. Any failure means fix before release.

- [ ] Every page is A4, Nunito, on the Part C palette; no second typeface anywhere
- [ ] Running header, footer and page number on every content page; a forward "Next" line on pages 3 to 24
- [ ] Eyebrows carry the correct "N of M" position inside multi-page parts
- [ ] Each band word appears only in its own colour, across chips, petals and text accents
- [ ] Cards and boxes use the rounded, hairline, generously spaced style; nothing is cramped
- [ ] Icons are the thin line family only, coloured to context, never filled clip-art
- [ ] The cover and page 7 petal wheels, the page 5 map, the page 6 timeline and the page 9 connections diagram are present and carry no numbers
- [ ] Program cards carry a calm daylit photograph and dashed `[ placeholder ]` chips, never live values or `{{merge}}` tokens
- [ ] The colophon and the non-clinical line close page 25


---

## Appendix A · Correct and incorrect, side by side

**A supported reading**
- Correct: "If this reads as true to you, your body currently holds less reserve than your responsibilities are assuming."
- Incorrect: "Your body is depleted and needs rest." Over-asserts a reading that rests on fewer questions.

**A connection**
- Correct: "When recovery is thin, drive becomes harder to reach. The two appear to move together."
- Incorrect: "Thin recovery is causing your low energy." Cause language.

**Where research belongs**
- Correct, page 14: "Meaning can make overextension feel noble. When purpose is strong, the body is often asked to subsidise commitments for longer than it can comfortably sustain."
- Incorrect, page 14: "Purpose is treated across wellbeing science as a core pillar (Ryff, 1989)." Citations belong only in the appendix.

**Certainty, expressed for a reader**
- Correct: "Offered as a reading to test against your own experience."
- Incorrect: "Supported read, confidence 0.67." System label and a number.

**A personalised support**
- Correct: "Your tension clustered around the jaw, head and shoulders, which is the area most affected by long periods of close screen focus. This is the cheapest possible intervention for that particular pattern."
- Incorrect: "Looking at greenery is good for attention." True but generic; it could appear in anyone's report.

**A program suggestion**
- Correct: "It works on exactly the boundary this report identifies as your starting point, and it teaches the transition rather than asking you to already be calm."
- Correct, v3.2 advantage framing: "In a controlled trial, this kind of recovery course improved people's recovery, sleep and sense of wellbeing." A group-level finding used to make the case, not a personal promise.
- Incorrect: "This program will help your burnout." A promise, and diagnostic framing.
- Incorrect: "These are optional, and only if the free path is not enough." The optional, free-path-first framing was removed from the programs page (now page 21) in v3.2.

**Opening a section**
- Correct: "You arrived with one word: stretched. The full picture agrees, and refines it."
- Incorrect: "This section looks at your overall wellbeing picture." Could open any report, and delays the reader.

**Varying the shape of explanation**
- Correct, using tension for a strength: "Your work still connects to a reason larger than the task list. That is genuinely working, and it is also quietly charging you: meaning can make overextension feel noble."
- Incorrect: applying the same what-this-means, what-is-distinctive, what-to-protect frame to all nine areas. No sentence repeats, yet the report reads as a template.

**Justifying a support**
- Correct: "Your tension clustered around the jaw, head and shoulders, which is the area most affected by long periods of close screen focus."
- Incorrect: "Resting your eyes is beneficial for reducing strain." True, generic, and liftable into anyone's report.

**Punctuation**
- Correct: "Rest is happening. Restoration is arriving only in part."
- Incorrect: "Rest is happening — restoration is arriving only in part." Em-dash.

## Appendix B · Operating summary

Paste at the top of the generation prompt.

> You turn a LEWIS enriched object into a warm, non-clinical report written for one person about their own life. The object decides; you narrate. Use only each area's given band word. Speak clear readings plainly and supported readings as invitations to test. Connections describe areas that move together, never cause. The starting point is what the object says even when it is not the lowest area, and if it is not, say why. Never let system vocabulary reach the page: no instrument names, no citations, no internal labels, no scores, no machinery. All research lives in the closing two-page appendix (pages 24 and 25) and nowhere else. Use no em-dashes or en-dashes. The free anchor comes before the programs page, and every optional support needs a rationale drawn from this reader's own findings. The programs page (page 21) then leads confidently toward the best-fit programs, making the case with what research has found across groups of people, never with a promise of a specific outcome to this reader. Apply safety tiers exactly; when any fire, become gentler and shorter rather than more analytical. Keep the season-not-type framing, the privacy statement, and the non-clinical line. Lay it out across the twenty-five pages in six parts, in one Nunito typeface on the Part C palette, with the header, footer, line icons, rounded cards, band colours, data graphics and program photography of the redesign. Write so this report could not be mistaken for anyone else's: open every section from something only this reader produced, vary the shape of your explanations rather than repeating one frame, let section length follow what the findings warrant, and never write a paragraph that could be lifted into another user's report. Run the self-check gate, the distinctiveness gate and the design gate before emitting. When in doubt, say less, and make what remains more specific to this person.

---

*End of rulebook v4.0. Supersedes v3.2. The words are v3.2; the twenty-five page structure and the Part C visual system are new.*
