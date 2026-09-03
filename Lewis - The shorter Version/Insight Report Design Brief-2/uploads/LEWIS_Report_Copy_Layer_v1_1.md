# LEWIS Report Copy Layer v1
## Companion 4. Every string the report can render

Built against the worked example for Devaraj K. The example exposed three problems that this document solves: section 3 repetition, missing fallback states, and the absence of a rule for turning a person's own selections back into readable prose.

**Design principle for this whole layer:** write as few strings as possible and generate the rest from what the person already told us, in their own words. A report that quotes a person back to themselves is more accurate and more moving than one that describes them. It is also cheaper to maintain and impossible to make generic.

---

# Part 1. Voice

## 1.1 The seven rules

1. **Second person, present tense.** "Your sleep is not restoring you", not "Devaraj's sleep quality is low".
2. **Observation before interpretation, always.** Say what he told us, then say what it might mean. Never the reverse.
3. **Short sentences carry hard news.** When a reading is low, sentences get shorter. Long sentences read as hedging exactly where the reader needs steadiness.
4. **Name the limit in the same breath as the claim.** Not in a footnote, not in a disclaimer block. Inside the sentence that makes the claim.
5. **No sentence may be true of everyone.** If a line would read identically for a person scoring 20 and a person scoring 80, it is filler and it is cut.
6. **Never console before describing.** "That sounds hard" before the description is empty. After it, it is earned.
7. **Every section can be empty.** Every section therefore has fallback copy. There is no such thing as an optional fallback.

## 1.2 Banned lexicon, enforced at string level

Build fails if any of these appear in a rendered report:

`diagnosis` · `disorder` · `symptom` · `condition` · `clinical` · `screening` · `cut-off` · `deficiency` · `dysfunction` · `assessment` · `test` · `metrics` · `index` · `cortisol` · `hormone` · `vagal` · `autonomic` · `neural` · `brain state` · `cognitive capacity` · `resilience index` · `somatic map` · `baseline` (physiological sense) · `above average` · `below average` · `normal range` · `healthy range` · `percentile` · `causes` · `because of` · `due to` · `leads to` · `driving` · `correlated with`

## 1.3 Permitted register

reading · picture · pattern · shape · area · where things sit · what you told us · travel together · showing up in · arriving in · worth noticing · held loosely · well supported · the season you are in

---

# Part 2. String architecture

## 2.1 Key format

```
report.<section>.<block>.<variant>
```

Example: `report.s7.rootdriver.tierC_override`

## 2.2 Variables available to every string

| Variable | Source | Fallback if absent |
|---|---|---|
| `{name}` | `context.name` | Omit the whole clause, never render "there" or "friend" |
| `{arrival_word}` | screen 06, optional | Switch to the no-word variant |
| `{dimension}` | engine | n/a, always present |
| `{band_label}` | engine | n/a |
| `{flag_report_form}` | Part 4 lookup | Omit clause |
| `{bright_spot_text}` | screen 23, optional | Switch to the no-text variant |

**RULE.** No string may contain a variable that has no defined fallback. Every optional variable has a variant of its parent string that does not use it.

## 2.3 Versioning

Every rendered report stores `copy_layer_version` alongside `link_set_version`. Any historic report can be regenerated identically.

---

# Part 3. The section 3 fix

The worked example produced nine paragraphs of identical shape. The band descriptors are strong; the repetition of structure is what fails. The fix is structural, not lexical.

**Render section 3 in three registers, by band:**

| Band | Treatment | Length |
|---|---|---|
| 1, Running on empty | Own heading. Band descriptor, then a personalised line built from the person's flags, then the trajectory clause | 3 sentences |
| 2, Stretched | Own heading. Band descriptor only, plus one context clause if a relevant context item is non-default | 1 to 2 sentences |
| 3 and 4, Holding and A real strength | **Grouped into a single paragraph** naming all of them together. No individual headings | 2 to 3 sentences total |

This turns nine paragraphs into roughly four to six blocks, puts the weight where the reader needs it, and makes the strong areas read as ground rather than as a list.

**Grouped strength paragraph, three variants by count:**

- 3 or more in Bands 3 and 4: *"{list} are all holding steady. In a season with {n} areas running on empty, that is not incidental. It is the ground the rest of this stands on."*
- 2: *"{a} and {b} are holding. Two steady things in a hard season is worth naming."*
- 1: *"{a} is holding. It is the one area not currently asking anything of you."*
- 0: *"Nothing is currently sitting in the steady range. That is genuinely hard, and it changes what this report asks of you: less, and gentler."*

---

# Part 4. Flag report forms

Every deep dive flag exists in two forms: the **input form** the person selects (first person, plain), and the **report form** that renders inside the sentence *"You told us [report form]."* Without this table, quoting a person back to themselves produces broken grammar.

**Joining rule.** Two flags: *"You told us {a}, and {b}."* Three or more: use the two with the highest engine weight and append *", among other things."*

## Body and recovery
| Input form | Report form |
|---|---|
| Sleep isn't restoring me | sleep isn't restoring you |
| There's no time to rest or recover | there's no time to rest or recover |
| Movement feels like a chore right now | movement feels like a chore right now |
| I'm not eating in a way that nourishes me | you're not eating in a way that nourishes you |
| My body holds a lot of tension or pain | your body holds a lot of tension |
| I'm running on empty whatever I do | you're running on empty whatever you do |

## Emotional calm
| Input form | Report form |
|---|---|
| My mind feels constantly busy or racing | your mind feels constantly busy |
| I'm carrying more stress than I can hold | you're carrying more stress than you can hold |
| I feel low or flat more often than not | you feel low or flat more often than not |
| Small things overwhelm me easily | small things overwhelm you easily |
| It's hard to switch off or settle | it's hard to switch off or settle |
| I've been hard on myself | you've been hard on yourself |

## Energy and drive
| Input form | Report form |
|---|---|
| Most days feel like going through the motions | most days feel like going through the motions |
| I've lost interest in things I used to enjoy | you've lost interest in things you used to enjoy |
| My energy runs out long before the day does | your energy runs out long before the day does |
| Nothing feels genuinely exciting right now | nothing feels genuinely exciting right now |
| I'm doing a lot, but none of it lights me up | you're doing a lot, but none of it lights you up |
| It's hard to get started on anything | it's hard to get started on anything |

## Relationships
| Input form | Report form |
|---|---|
| I feel more alone than I'd like | you feel more alone than you'd like |
| I have people around, but don't feel truly seen | you have people around, but don't feel truly seen |
| My relationships feel like hard work right now | your relationships feel like hard work right now |
| I find it hard to reach out or open up | you find it hard to reach out |
| I don't have time for the people who matter | there's no time for the people who matter |
| A relationship is causing me real strain | a relationship is causing you real strain |

## Meaning and purpose
| Input form | Report form |
|---|---|
| I'm not sure what really matters to me right now | you're not sure what really matters right now |
| Day-to-day life feels a bit empty or aimless | day-to-day life feels a bit aimless |
| I've drifted from what gives me purpose | you've drifted from what gives you purpose |
| I'm questioning my direction | you're questioning your direction |
| I feel disconnected from something larger than myself | you feel disconnected from something larger than yourself |
| I've lost touch with practices that grounded me | you've lost touch with practices that grounded you |

## Progress and agency
| Input form | Report form |
|---|---|
| I don't feel in control of how things are going | you don't feel in control of how things are going |
| I'm not making progress on what matters to me | you're not making progress on what matters to you |
| I doubt my ability to handle what's ahead | you doubt your ability to handle what's ahead |
| I start things but struggle to follow through | you start things but struggle to follow through |
| I feel stuck, like nothing I do shifts things | you feel stuck, like nothing you do shifts things |
| I rarely get that "I did it" feeling | you rarely get that "I did it" feeling |

## Money and security
| Input form | Report form |
|---|---|
| Money worry sits with me most days | money worry sits with you most days |
| I'm living without much of a buffer | you're living without much of a buffer |
| I tend to avoid looking at my finances | you tend to avoid looking at your finances |
| My income feels unpredictable | your income feels unpredictable |
| I feel behind where I want to be | you feel behind where you want to be |
| Money is a source of tension at home | money is a source of tension at home |

## Curiosity and learning
| Input form | Report form |
|---|---|
| I haven't learned anything new in a long while | you haven't learned anything new in a long while |
| My days don't really stretch my mind | your days don't really stretch your mind |
| I'm too drained to feel curious | you're too drained to feel curious |
| I miss feeling challenged in a good way | you miss feeling challenged in a good way |
| I've stopped making time for growth | you've stopped making time for growth |
| I feel like I'm standing still | you feel like you're standing still |

## Surroundings and belonging
| Input form | Report form |
|---|---|
| My space drains me more than it restores me | your space drains you more than it restores you |
| I rarely get out into nature | you rarely get out into nature |
| I have little control over my surroundings | you have little control over your surroundings |
| I don't feel a strong sense of belonging anywhere | you don't feel a strong sense of belonging anywhere |
| I feel out of place in my community or culture | you feel out of place in your community |
| My environment feels cluttered or chaotic | your environment feels cluttered or chaotic |

**Trajectory clause, appended to Band 1 blocks:**

| Trajectory | Clause |
|---|---|
| Getting worse | *"And this is moving in the wrong direction, not holding steady."* |
| Getting better | *"You also told us this is improving, which matters and should be said."* |
| About the same | *"This one is not getting worse. It is holding at a difficult level."* |
| It varies a lot | *"This one moves around. Which is its own kind of tiring."* |

---

# Part 5. Section string library

## S1. Opening frame

**With arrival word, by compassion level**
| Level | String |
|---|---|
| 1 | You arrived here describing yourself as **{arrival_word}**. Here is what your answers say sits underneath that. |
| 2 | You arrived here describing yourself as **{arrival_word}**. Some of what follows is hard, and none of it is a verdict on you. |
| 3 | You arrived here describing yourself as **{arrival_word}**. Before anything else: what you described is a heavy load to be carrying, and it deserves more support than a report can give. |

**Without arrival word**
| Level | String |
|---|---|
| 1 | Here is what your answers point to. |
| 2 | Some of what follows is hard, and none of it is a verdict on you. |
| 3 | Before anything else: what you described is a heavy load to be carrying, and it deserves more support than a report can give. |

**Fixed line, every report, no exceptions:**
> **This describes the season you are in, not the kind of person you are.**

**Priority tension frame**
| `tension_confirmed` | String |
|---|---|
| Yes | When we asked which three areas matter most to you right now, you chose {top3}. Your answers point to {tension_dim} as the one furthest from where you want it. We asked whether that felt right, and you said yes. So that is where this report begins. Not because it is the loudest thing, but because you told us it is both what you care about and what is thinnest. |
| Partly | You chose {top3} as what matters most. {tension_dim} is also where your answers sit lowest. You said that felt partly right, so we have kept it in view without building everything around it. |
| Not quite | You chose {top3} as what matters most. We asked whether one of them was also where you felt most depleted, and you said not quite. We have taken you at your word, and this report opens somewhere else. |
| No tension detected | The three areas you said matter most are not the areas sitting lowest. That is worth naming, because it means what you care about is not currently what is costing you. |

## S2. The shape

**Fixed framing line, every report:**
> This shows how the nine areas sit relative to each other **in your own answers**. It is not a league table, and a 60 in one area does not mean the same thing as a 60 in another.

**Distribution comment, by count in Band 1**
| Count | String |
|---|---|
| 0 | Nothing is sitting in the lowest band. That is not the same as nothing needing attention, but it is worth registering before you read on. |
| 1 | One area is sitting in the lowest band. The rest of your profile has more give in it than that one area suggests on its own. |
| 2 to 3 | {n} areas in the lowest band, alongside {m} that are holding. Both halves of that are true. |
| 4 to 6 | {n} areas in the lowest band is a lot to be carrying at once. {m} areas standing in the highest band, at the same time, is also true and also worth saying. |
| 7 to 9 | Almost everything is sitting low right now. This report is going to ask very little of you, because that is the honest response to what you described. |

## S3. What each area asks of you

Four band descriptors, used across all nine dimensions. **These four strings ship verbatim and are not edited.**

| Band | Descriptor |
|---|---|
| 1 | This area needs the gentlest care right now. Reserve is thin, and effort here costs more than it should. |
| 2 | Stretched, and asking for attention. Still functioning, but with less give than it used to have. |
| 3 | Holding reliably, without strain. Not remarkable, and not asking anything of you this month. |
| 4 | A real strength, and a place to stand. Something to spend deliberately, not simply admire. |

Assembly, per Part 3 registers, using Part 4 flag report forms.

**Tier C confidence rider, appended once to the first Tier C dimension only:**
> This area is measured with our own questions rather than a published questionnaire, so we hold it more loosely than the others.

## S4. Where tension settles

| Condition | String |
|---|---|
| 1 to 2 zones | You marked {zones}. |
| 3 or more zones | You marked {n} places: {zones}. |
| 0 zones | You told us nothing felt tense right now. That is worth registering rather than skipping past. |

**Inner state, by portrait**
| Portrait | String |
|---|---|
| Grounded | You described your inner state as **grounded**: present, connected, open to what is around you. |
| Activated | You described your inner state as **activated**: wired, alert, on edge. |
| Collapsed | You described your inner state as **collapsed**: flat, withdrawn, checked out. |

**Convergence line, fires when portrait, stress cluster, body map and recovery all point the same way:**
> That combination is consistent. It is not a medical finding and this report cannot tell you what is happening physiologically. What it can say is that everything you reported points the same direction.

**Divergence line, fires when they conflict:**
> These do not all point the same way, and that is information too. Sometimes the body and the mind are in different places in the same week.

**Breathing block**
| Condition | String |
|---|---|
| Tension fell | Before this report, you rated your tension at {before} out of 10. After sixty seconds of breathing, you rated it at {after}. This is about how your body settled with the breath. A small experiment, not a medical reading. But it is evidence, from you, that your body can come down when given a chance to. |
| Tension unchanged | Your tension reading was the same before and after the breathing minute. One minute is a short time and this tells you very little on its own. |
| Tension rose | Your tension went up during the breathing minute, from {before} to {after}. That is common in people running hot. Stopping can be the hardest part. It is a reason to start with settling rather than with doing. |
| Skipped | You skipped the breathing minute, which is entirely fine. It is still there if you want it. |

## S5. Your day

| Condition | String |
|---|---|
| Clear peak and trough | {peak} **high**. {trough} **low**. Your energy has a real {peak}, and then it does not come back in the same way. |
| Flat, all similar | Your energy reads similar across the whole day. Steady, or possibly flat. Only you can tell which. |
| Erratic, no pattern | Your energy does not follow a shape across the day. It moves around, and that is more tiring than a low day with a pattern. |
| Not completed | You did not map your day, so this section is short. |

**Redirect line, fires when the trough is the afternoon:**
> Most people try to fix the afternoon. Your report does not, because your afternoon is not where the problem starts.

## S6. Connections

Edge strings are defined in `LEWIS_Prior_Link_Set_v1.md` Part 3 and are not duplicated here. Two additions the worked example proved necessary:

**Merged edge header, when two edges share source and target:**
> {source} and {target} are showing up together, through more than one route.

**"What we did not draw" block, fires when at least one prior edge exists whose endpoints are not both low:**
> {area_a} and {area_b} are both holding, so no link was drawn between them even though the research connects them. Links are only drawn where both areas are low and where something in your own answers named the connection.

**Fallback, fewer than two edges active:**
> Your areas are not clustering into a single pattern right now. Each one is largely standing on its own, which is its own kind of information. It means there is no single thread to pull, and it also means no one area is dragging the others down with it.

**Evidence tier label, appended to every drawn edge:**
`Evidence: established.` or `Evidence: supported.`

## S7. Where one change reaches furthest

**Fixed subhead, every report:**
> Not the one that hurts most. The one most connected to the rest.

**Body, assembled from three clauses:**
1. Why not the lowest area: *"{lowest} is the sharpest reading in this report. But it sits downstream of {driver_evidence}."*
2. Why not the runner-up: *"{runner_up} sits alongside rather than upstream, and the barrier you named there was {friction}, which is not something a next step can move this month."*
3. Why this one: *"{driver} is the one place where the barrier you named was {friction}. {friction} is the barrier a small enough action can get underneath."*

**Tier C override rider, fires when the amended constraint is used:**
> **One honesty note.** Your {driver} reading is one we hold more loosely than the others, because there is no single well-tested questionnaire for it and we built this reading from several inputs. We are pointing here anyway, because {edge_claim} is one of the better evidenced things in this whole report, and because {n} separate answers of yours pointed at it.

**Fallback, no root driver identifiable:**
> No single area stands out as the one that reaches furthest. That usually means your areas are operating fairly independently right now, and the useful move is to pick the one you most want to move rather than the one the pattern selects.

## S8. Ground you can rely on

**Bright spot, three tiers**
| Tier | String |
|---|---|
| 1, with text | Of everything we looked at, **{dimension} stands out as a real strength right now**. You told us what is working: *"{bright_spot_text}"* |
| 1, no text | Of everything we looked at, **{dimension} stands out as a real strength right now**. |
| 2 | Nothing is sitting in the bright zone right now, and that is worth being honest about. But {dimension} is the steadiest ground you have at the moment, and it is a place we can start from. |
| 3 | Right now, things feel depleted across the board. That is genuinely hard, and naming it honestly is the first real step. We will start gently, with the smallest possible next move. |

**Contradiction reflections**, maximum two per report, from `LEWIS_Scoring_Inference_Report_v1.md` Part 5.3, each opened with:
> **One thing worth sitting with.**

**Gestalt divergence**, direction sensitive, opened with:
> **And one where your instinct and your answers differ.**

| Direction | String |
|---|---|
| Score higher than sort | You placed {dimension} in the {zone} zone. The questions put it somewhat steadier than that. Sometimes an area is doing better than it feels, especially when everything around it is thin. Both readings are yours. The gap is worth noticing. |
| Score lower than sort | You placed {dimension} among your strengths, and the questions point somewhere more stretched. Both readings are yours, and the gap is often where something is being carried quietly. |

## S9. The one thing

**Fixed lead, by planner readiness**
| Readiness | String |
|---|---|
| 7-day plan | You told us you would like a clear plan. Here is where it starts. Everything else follows from this one. |
| One thing | You told us you want one thing to focus on, not a plan. So this is one thing. |
| Too overwhelmed | You told us you are too overwhelmed for a plan right now. So there is no plan. There is one thing, and it is very small. |

**The suggestion**, rendered as a pull quote in if-then form:
> **{cue}, {action}.**

**Four mandatory blocks after it:**

1. **Why this one.** *"{driver} is where one change reaches furthest. The barrier you named there was {friction}, so this is {size}."* Plus, if `prior_attempts` = didn't stick: *"You told us you have tried before and it did not stick, so this is smaller than what you probably tried last time, and it is attached to something you already do rather than to an intention to remember."*

2. **What the evidence says, and where it does not.** Composed from the suggestion's evidence tiers. **RULE:** where the suggestion is delivered below the researched dose, say so explicitly and say why. Template: *"The studies that found this typically used {researched_dose} rather than {given_dose}. We are starting you below the researched dose on purpose, because a {given_dose} thing you actually do beats a {researched_dose} thing you do not."*

3. **The form note**, fixed: *"The specific form, 'after X, I will do Y', is not a stylistic choice. Attaching a new action to an existing cue has meta-analytic support in its own right, independent of what the action is."*

4. **What this report is not asking of you.** Fires whenever a Band 1 dimension is deliberately excluded from the plan. *"Nothing about {excluded} this month. Your {excluded} reading is one of the hardest in this report and you named {friction} as the barrier, which no next step can move in a week. It is in the report because it is true, not because it is this month's work."*

**Lifed disclosure**, fires whenever the suggestion maps to a Lifed product:
> Some of what LEWIS suggests comes from Lifed's own programmes. We tell you which, every time. This one does.

**Support block**, by compassion level
| Level | Treatment |
|---|---|
| 1 | Not shown |
| 2 | Shown after the suggestion, quiet, one line plus resources |
| 3 | Shown **before** the suggestion, prominent, and the suggestion is reduced to a single gentle step |

## S10. Confidence

**Fixed closing line:**
> Where we are less confident, we have said so rather than making the report feel stronger than it is.

**Global caution block**, fires on four or more divergences, straight-lining, or sub-10th-percentile completion time:
> A note on this whole report. {reason}. That does not make what follows useless, but it does mean you should hold all of it more loosely than usual, and it may be worth doing this again on a day with more room in it.

| Trigger | `{reason}` |
|---|---|
| 4+ divergences | Several of your readings came out differently from how you sorted the same areas yourself |
| Straight-lining | Your answers followed a very consistent pattern through the middle section |
| Fast completion | You moved through this quickly |

## S11. What we used

Fixed block. Instrument list is generated from the shipped instrument registry, so it can never drift from what actually ran.

**Fixed closing, every report:**
> **What this is not.** LEWIS is a reflection tool. It does not diagnose anything, it makes no claim about hormones, brain states or heart rhythms, and it is not a substitute for talking to a doctor or a therapist. The research behind it describes what tends to be true across many people. It cannot tell you what is true for you, only what is worth looking at.
>
> **A limitation we want you to see.** Almost all of the research above was conducted in Europe, the United Kingdom and the United States. LEWIS is built for people in India and elsewhere. We think these findings travel, and we do not have evidence that they travel perfectly.

---

# Part 6. Degraded states

Every one of these needs copy before launch. None is optional.

| State | Copy |
|---|---|
| Dimension = `Not enough to say` | **{dimension}**: you skipped part of this section, so we are not going to guess. This area is left open rather than filled in. |
| No deep dives fired | Nothing scored low enough to need a closer look. That is a real result and not an empty one. |
| No bright spot at any tier | Handled by bright spot tier 3 |
| No connections | Handled by S6 fallback |
| No root driver | Handled by S7 fallback |
| Every gate blocked the suggestion library | We are not going to suggest anything this month. What you described needs more than a habit, and pretending otherwise would waste your time. What follows is support, not a task. |
| Report generated during an incident or partial data | Part of this report could not be built. Here is what we do have, and here is what is missing. |

---

# Part 7. QA before any report ships

| Check | Method |
|---|---|
| Banned lexicon | Automated regex against the rendered output. Build fails on any hit |
| Variable with no fallback | Static analysis of the string table |
| Every section has fallback copy | Fixture test rendering a maximally sparse person |
| Flag report forms grammatical | Fixture test rendering all 54 flags inside the parent sentence |
| Compassion level 3 path | Fixture test asserting support appears before the suggestion, and that only one step is given |
| Dose honesty | Assert that any suggestion delivered below its researched dose renders block 2 of S9 |
| Tier C override | Assert the honesty rider appears whenever the amended root driver constraint fires |
| No two consecutive sections share sentence shape | Human read, every copy release |
| Read aloud | A person reads a generated report aloud, end to end, before each release. Anything that catches in the mouth gets rewritten. This is not optional and it is not automatable |

---

# Part 8. Open items

1. **The root driver Tier C amendment** from the worked example. This copy layer assumes it is accepted, because S7 contains the honesty rider it requires. If you reject it, S7 needs rewriting.
2. **Suggestion library strings** are not in this document. They are a separate library of several hundred entries, each with cue, action, size tier, friction fit, evidence tier and source. That is the next build, and it is the largest remaining piece.
3. **Translation.** Every string here is English. Validated instrument items must use published translations where they exist and must not be translated in-house. LEWIS's own strings can be translated freely, but the flag report forms in Part 4 will not survive machine translation, because their whole function is grammatical fit. Each target language needs its own Part 4 authored by a native speaker.
4. **Reading level.** Nothing in this document has been checked for reading level. Worth doing once, then setting a ceiling.
