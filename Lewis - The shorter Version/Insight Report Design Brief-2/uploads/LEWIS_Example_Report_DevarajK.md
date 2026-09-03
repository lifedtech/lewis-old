# LEWIS Insight Report, Worked Example
## Fixture: Devaraj K, reflection date 23 August 2026

Run on the v5 flow (37 screens, 39 scored items), the v1 scoring engine, and the v1 prior link set.

This document has two parts. **Part A** is the engine trace: every input, every calculation, every gate, shown so an engineer can assert against it and a reviewer can check it. **Part B** is the report exactly as Devaraj reads it.

**All input data below is synthetic fixture data.** Devaraj K is not a person.

---

# PART A. Engine trace

## A1. Inputs

**Context**
| Field | Value |
|---|---|
| `name` | Devaraj |
| `age_band` | 35 to 44 |
| `sex_at_birth` | Male |
| `roles[]` | Professional, Primary caregiver, Wearing many hats |
| `life_stability` | Unsettled (2 of 5) |
| `pressures[]` | Workload, Mental load, Sleep depletion, Health concerns |
| `arrival_word` | "Stretched" |
| `arrival_mood` | 2 of 5, toward stormy |
| `activity_level` | Mostly sedentary |
| `sleep_quality` | Generally poor |
| `relational_context` | I have people around me, but feel unseen |
| `financial_stress` | High anxiety, it's affecting my daily life |
| `income_regularity` | Mostly steady |
| `nature_access` | Rarely |
| `transcendent_connection` | A little |
| `intellectual_recency` | A few months ago |
| `support_preference` | I like structure and clear steps |
| `content_preference` | Reading |
| `prior_attempts` | Yes, but it didn't stick |
| `planner_readiness` | Give me one thing to focus on |
| `recovery_responsiveness` | Still tired even after rest |
| `sleep_onset` | It takes time |
| `stress_response_style` | I get activated and wired |
| `stress_cluster` | The Surge |

**Instrument raw responses**

| Instrument | Item responses | Raw |
|---|---|---|
| WHO-5 (0 to 5) | 2, 1, 2, 1, 3 | 9 of 25 |
| PSS-10 (0 to 4, after reversing 4, 5, 7, 8) | 3, 3, 4, 2, 3, 3, 2, 3, 2, 3 | 28 of 40 |
| UCLA-3 (1 to 3) | 2, 1, 2 | 5 of 9 |
| GSE-6 (1 to 4) | 3, 3, 2, 3, 3, 2 | 16 of 24 |
| Purpose (0 to 4) | 3, 2, 3, 3 | 11 of 16 |
| CFPB-5 (0 to 4, after orientation) | 2, 1, 0, 1, 1 | 5 of 20 |
| INS (1 to 7) | 2 | 2 of 7 |
| Cultural belonging | "Somewhat, it mostly fits"; item 2 = 3 of 5 | |
| LEWIS Growth (1 to 5) | 2, 2, 3 | 7 of 15 |
| Cumulative load (0 to 3) | 3, 3, 2, 1, 2 | 11 of 15 |

**Interactives**
| Signal | Value |
|---|---|
| `affect.valence` | Low (unpleasant) |
| `affect.arousal` | High (activated) |
| `somatic.tension_map` | 4 zones: head and neck, chest, shoulders and back, stomach |
| `ans.portrait` | Activated |
| `body_awareness` | Somewhat |
| `energy_arc` | Morning High, Afternoon Low, Evening Medium, Night Low |
| `breath.tension_before` | 8 of 10 |
| `breath.tension_after` | 5 of 10 |

## A2. Dimension arithmetic

**WHO-5 percentage.** 9 / 25 × 100 = **36**. Below 50, so compassion level 2 is set. Never shown.

**EM.** PSS raw 28. `pss_wellbeing` = 100 × (40 − 28) / 40 = 30. `who5_mood` = 100 × (2 + 1) / 10 = 30.
`EM_base` = 0.80 × 30 + 0.20 × 30 = **30**.
Nudge: valence low and arousal high, EM below 55, so `nudge_EM` = −3. Band check: 30 and 27 are both in Band 1, no crossing. **EM = 27**.

**PH.** `who5_rested` = 20. `who5_vigour` = 40. `sleep_quality` = 20. `activity_level` = 30.
`PH_base` = 0.35 × 20 + 0.25 × 40 + 0.22 × 20 + 0.18 × 30 = 7 + 10 + 4.4 + 5.4 = **26.8**.
Nudge: 4 body map zones, PH below 55, so −4. Band check: both in Band 1. **PH = 23**.

**EN.** 100 × (2 + 3) / 10 = **50**. Energy arc irregularity is moderate, not high, so no nudge fires. **EN = 50**.

**RS.** 100 × (9 − 5) / 6 = 66.67. **RS = 67**. One of only seven possible values. Displayed as a band only.

**MS.** `purpose_pct` = 100 × 11 / 16 = 68.75. `transcendent_connection` "A little" = 50.
MS = 0.80 × 68.75 + 0.20 × 50 = **65**.

**AC.** 100 × (16 − 6) / 18 = 55.6. **AC = 56**.

**FW.** 100 × 5 / 20 = **25**.

**IG.** `growth_pct` = 100 × (7 − 3) / 12 = 33.33. `intellectual_recency` "A few months ago" = 45.
IG = 0.70 × 33.33 + 0.30 × 45 = **37**.

**EC.** `ins_pct` = 100 × (2 − 1) / 6 = 16.67. `cultural_1` = 75. `cult2` = 100 × (3 − 1) / 4 = 50. `nature_access` = 30.
EC = 0.30 × 16.67 + 0.30 × 75 + 0.20 × 50 + 0.20 × 30 = 5.0 + 22.5 + 10 + 6 = **44**.

## A3. Bands and confidence

| Dimension | Score | Band | Confidence |
|---|---|---|---|
| PH Body and recovery | 23 | 1, Running on empty | C, Held loosely |
| EM Emotional calm | 27 | 1, Running on empty | A, Well supported |
| FW Money and security | 25 | 1, Running on empty | B, Reasonably supported |
| IG Curiosity and learning | 37 | 1, Running on empty | C, Held loosely |
| EC Surroundings and belonging | 44 | 2, Stretched | C, Held loosely |
| EN Energy and drive | 50 | 2, Stretched | B dropped to **C** by divergence |
| AC Progress and agency | 56 | 3, Holding | A, Well supported |
| MS Meaning and purpose | 65 | 3, Holding | B, Reasonably supported |
| RS Relationships | 67 | 3, Holding | B, Reasonably supported |

**MS confidence assumes the verbatim PROMIS swap has shipped.** If it has not, MS drops to C and every occurrence of "PROMIS" must be removed from this report.

## A4. Gestalt divergence

Devaraj's sort: **Depleted** = Body, Emotional calm, Money, Energy. **Doing okay** = Curiosity, Surroundings. **A real strength** = Relationships, Meaning, Progress.

| Dimension | Score | Zone midpoint | Divergence | Flagged |
|---|---|---|---|---|
| EN | 50 | 25 (Depleted) | **+25** | **Yes** |
| IG | 37 | 55 (Doing okay) | −18 | No, under threshold |
| All others | | | within 20 | No |

One flag. Global confidence caution requires four or more, so no global caution. EN confidence drops one tier.

## A5. Connection map

| Candidate | Both below 55 | Confirmations | Structural check | Fires |
|---|---|---|---|---|
| PH to EM (sleep) | Yes, 23 and 27 | Sleep depletion pressure, "Sleep isn't restoring me" flag, `sleep_quality` poor | Shadow PH excluding WHO-5 = (0.22×20 + 0.18×30) / 0.40 = **24.5**, below 55 | **Yes, directional** |
| PH to EM (activity) | Yes | `activity_level` sedentary | Same shadow score | **Yes, merges with above** |
| FW and EM | Yes, 25 and 27 | `financial_stress` high anxiety, two FW flags | n/a | **Yes, undirected** |
| EC and EM | Yes, 44 and 27 | `nature_access` rarely | n/a | **Yes, undirected** |
| EC and PH | Yes, 44 and 23 | `nature_access` rarely | n/a | **Yes, undirected** |
| RS and MS | No, 67 and 65 | | | No |

**Ranking** by `prior_weight × confirmations × depletion(source)`:

| Edge | Calculation | Weight |
|---|---|---|
| PH to EM | 1.0 × 3 × 0.582 | **1.75** |
| FW and EM | 0.7 × 2 × 0.545 | **0.76** |
| EC and EM | 0.7 × 1 × 0.200 | **0.14** |
| EC and PH | 0.7 × 1 × 0.200 | **0.14** |

Four edges, under the cap of five. All render, with visual weight scaled to the ranking, so the sleep link is dominant and the environment links are faint.

> **Engine amendment discovered by this run.** Edges 1 and 2 are both PH to EM and both fired. Two identical arrows would have rendered. **Rule added: edges sharing a source and target merge into one link that names both mechanisms.** The merged confirmation count is the union, not the sum.

## A6. Root driver

`leverage(d) = 0.35·out_degree + 0.25·depletion + 0.15·priority + 0.15·worsening + 0.10·friction`

Out-degree, per the v1 link set revision (directional leaving = 1.0, undirected touching = 0.5), normalised to the maximum:

| Dimension | Raw out-degree | Normalised |
|---|---|---|
| PH | 1.0 (directional to EM) + 0.5 (EC edge) = 1.5 | 1.00 |
| EM | 0.5 + 0.5 = 1.0 | 0.67 |
| EC | 0.5 + 0.5 = 1.0 | 0.67 |
| FW | 0.5 | 0.33 |

| Dimension | 0.35·out | 0.25·depl | 0.15·pri | 0.15·wors | 0.10·fric | **Total** |
|---|---|---|---|---|---|---|
| **PH** | 0.350 | 0.146 | 0.150 | 0.150 | 0.100 (Time) | **0.896** |
| EM | 0.234 | 0.127 | 0.150 | 0.150 | 0.080 (Energy) | 0.741 |
| FW | 0.116 | 0.136 | 0.150 | 0.000 | 0.030 (Money) | 0.432 |
| EC | 0.234 | 0.050 | 0.000 | 0.000 | 0.060 | 0.344 |

**PH wins at 0.896.** But PH sits at confidence Tier C, and constraint 1 in the scoring document says a Tier C dimension may not be named as root driver. Under the rule as written, the engine would fall through to **EM**.

> **Decision needed, and I recommend overriding the constraint.** The confidence tier reflects how well LEWIS reads the *dimension*. It does not reflect how well the *edge* is evidenced, and here the edge is Tier 1 with experimental backing, confirmed by three separate person-level inputs. Naming EM instead would point Devaraj at the consequence rather than the mechanism.
>
> **Proposed amendment to constraint 1:** a Tier C dimension may be named as root driver if it is the source of an active Tier 1 directional edge **and** carries at least two person-level confirmations. PH meets both.
>
> **This trace runs with the amendment applied. Root driver = PH.** If you reject the amendment, the report below changes materially and I will regenerate it.

## A7. Priority tension

Top three: Emotional calm, Body and recovery, Money and security.

| Dimension | (55 − score) / 55 | Tension |
|---|---|---|
| **PH** | (55 − 23) / 55 | **0.582** |
| FW | (55 − 25) / 55 | 0.545 |
| EM | (55 − 27) / 55 | 0.509 |

PH surfaced at screen 22. Devaraj answered **Yes**. Body and recovery becomes the opening frame.

## A8. Contradiction reflections

| Check | Result |
|---|---|
| RS at or above 55 and "people around, but feel unseen" | **Fires** |
| PH at or above 55 with loaded body map | No, PH is low, so the body map agrees rather than contradicts |
| EN at or above 55 with irregular arc | No, arc is moderate |
| `breath.settle_change` negative | No, tension fell from 8 to 5 |

One reflection, under the cap of two.

## A9. The One Thing, four gates

**Gate 1, Safety.** WHO-5 36, at or below 50, so compassion level 2 and support surfaced. Not at or below 28. No fragility flag, no painful-meaning flag, no cultural pain flag, no eating signals. `recovery_responsiveness` = "Still tired even after rest", which is not the anxious-on-stopping route. **Pass.**

**Gate 2, Fit to friction.** Root driver PH, friction **Time**. Required shape: 30 seconds to 2 minutes, attached to something already happening.

**Gate 3, Capacity.**
- `prior_attempts` = didn't stick → down one tier, plus mandatory "why this one is different"
- `cumulative_load` 11 of 15 = 73 percent, **heavy** → down one more tier
- `planner_readiness` = one thing to focus on → no 7-day plan
- `support_preference` = structure and clear steps → the step is specified exactly, not offered as a range

**Gate 4, Evidence.** Established tier required.

**Selected:** a fixed five-minute walk outside, anchored to an existing evening event, formed as an if-then intention.

| Component | Tier | Basis |
|---|---|---|
| Physical activity for mood and distress | **Established** | Umbrella review, median ES −0.43 depression, −0.60 distress (Singh et al., 2023, BJSM) |
| Outdoor rather than indoor | **Emerging** | Dose reviews find effects from about ten minutes; five is deliberately below that |
| The if-then form itself | **Established** | Implementation intentions meta-analysis, g = 0.336 (Wang et al., 2021) |

The dose honesty matters. The evidence uses ten minutes and Devaraj is being given five, because his capacity is at floor and his last attempt did not stick. The report says so rather than borrowing the ten-minute evidence for a five-minute ask.

---

# PART B. The report as Devaraj reads it

---

## Your reflection
### 23 August 2026

---

### 1. Where this starts

You arrived here describing yourself as **stretched**. Some of what follows is hard, and none of it is a verdict on you.

**This describes the season you are in, not the kind of person you are.**

When we asked which three areas of life matter most to you right now, you chose emotional calm, your body, and money. Your answers point to your body as the one that is furthest from where you want it. We asked whether that felt right, and you said yes.

So that is where this report begins. Not because it is the loudest thing, but because you told us it is both what you care about and what is thinnest.

---

### 2. The shape of your wellbeing

*[Nine petal diagram]*

This shows how the nine areas sit relative to each other **in your own answers**. It is not a league table, and a 60 in one area does not mean the same thing as a 60 in another.

| | |
|---|---|
| **A real strength** | Relationships · Meaning and purpose · Progress and agency |
| **Holding** | |
| **Stretched** | Energy and drive · Surroundings and belonging |
| **Running on empty** | Body and recovery · Emotional calm · Money and security · Curiosity and learning |

Four areas in the lowest band is a lot to be carrying at once. Three areas standing in the highest band, at the same time, is also true and also worth saying.

---

### 3. What each area asks of you

**Body and recovery.** This area needs the gentlest care right now. Reserve is thin, and effort here costs more than it should. You told us sleep is not restoring you and that there is no time to rest or recover, and that this is getting worse rather than holding steady.

**Emotional calm.** This area needs the gentlest care right now. You described a mind that is constantly busy, and difficulty settling. This is also moving in the wrong direction.

**Money and security.** This area needs the gentlest care right now. Money worry sits with you most days and there is not much of a buffer. Unlike the two above, this one is not getting worse. It is holding at a difficult level.

**Curiosity and learning.** This area needs the gentlest care right now. The last thing that genuinely stretched you was a few months ago. This area is measured with our own questions rather than a published questionnaire, so we hold it more loosely than the others.

**Energy and drive.** Stretched, and asking for attention. Still functioning, but with less give than it used to have.

**Surroundings and belonging.** Stretched, and asking for attention. You rarely get out into nature, and you feel more separate from the natural world than most people describing themselves as stretched.

**Progress and agency.** Holding reliably, without strain. Not remarkable, and not asking anything of you this month. In a season this hard, that is not nothing.

**Meaning and purpose.** Holding reliably, without strain. Your sense of direction is intact even while other things are not.

**Relationships.** Holding reliably, without strain. See section 8, because there is something here worth looking at.

---

### 4. Where tension settles in your body

You marked four places: head and neck, chest, shoulders and back, and stomach.

You described your inner state as **activated**: wired, alert, on edge. Your stress pattern most closely matched **the Surge**, the wired-and-hard-to-switch-off shape, and you told us that when stress hits, you get activated rather than flat.

When you rest, you told us you are still tired afterwards.

That combination, tension held in four places, a wired inner state, and rest that does not restore, is consistent. It is not a medical finding and this report cannot tell you what is happening physiologically. What it can say is that everything you reported points the same direction, and that direction is a body that is not getting the chance to come down.

**One minute of breathing.** Before this report, you rated your tension at 8 out of 10. After sixty seconds of breathing, you rated it at 5. This is about how your body settled with the breath. A small experiment, not a medical reading. But it is evidence, from you, that your body can come down when given a chance to.

---

### 5. Your day, as you described it

Morning **high**. Afternoon **low**. Evening **medium**. Night **low**.

You fall asleep slowly. Your energy has a real morning, and then it does not come back in the same way.

Most people try to fix the afternoon. Your report does not, because your afternoon is not where the problem starts.

---

### 6. How strain in one area is arriving in the next

*[Connection map, four links, scaled by weight]*

**Your sleep and your emotional load →** *(strongest link, directional)*

Your sleep and your emotional load are showing up together. In research, short or broken sleep reliably makes it harder to regulate mood the next day. You also told us your movement has been minimal, and across randomised trials regular activity has a consistent effect on low mood and distress.

That does not mean sleep and movement are the whole story here, but they are the thread worth pulling first.
*Evidence: established.*

**Money and emotional load** *(second link, no direction)*

Money and emotional load are sitting together in your answers. Research finds these two travel together consistently, and that each can feed the other. Which came first is not something this reflection can tell you, and it may not be the useful question.
*Evidence: supported.*

**Surroundings, and both your body and your mood** *(two faint links, no direction)*

You rarely get outdoors. The clearest finding in this area is small and practical: short, repeated time outside, even ten minutes, even in a city, moves fatigue and vitality measurably. The wider link between environment and wellbeing is real but much messier.
*Evidence: supported.*

**What we did not draw.** Your relationships and your sense of meaning are both holding, so no link was drawn between them even though the research connects them. Links are only drawn where both areas are low and where something in your own answers named the connection.

---

### 7. Where one change reaches furthest

**Body and recovery.**

Not the one that hurts most. The one most connected to the rest.

Your emotional load is the sharpest reading in this report. But it sits downstream of two things you told us about directly: sleep that is not restoring you, and movement that has dropped away. Money sits alongside your emotional load rather than upstream of it, and the barrier you named there was money itself, which is not something a next step can move this month.

Your body is the one place where the barrier you named was **time**. Time is the barrier a small enough action can get underneath.

**One honesty note.** Your body reading is one we hold more loosely than the others, because there is no single well-tested questionnaire for it and we built this reading from several inputs. We are pointing here anyway, because the link between sleep, movement and mood is one of the better evidenced things in this whole report, and because three separate answers of yours pointed at it.

---

### 8. Ground you can rely on

Of everything we looked at, **your relationships stand out as a real strength right now**. You told us what is working: *"My daughter still tells me everything."*

Two other areas are holding steady while much else is not. Your sense of direction is intact. Your sense that you can handle what is in front of you is intact. In a season with four areas running on empty, those three are not incidental. They are the ground the rest of this stands on.

**One thing worth sitting with.** By the questions, connection is not scarce for you. By your own description, you have people around you but do not feel truly seen. Those two things sit together more often than people expect. It is not a contradiction in your answers. It may be the more accurate reading of both.

**And one where your instinct and your answers differ.** You placed energy and drive in the depleted zone. The questions put it somewhat steadier than that. Sometimes an area is doing better than it feels, especially when everything around it is thin. Both readings are yours. The gap is worth noticing.

---

### 9. The one thing

You told us you want one thing to focus on, not a plan. So this is one thing.

> **Tonight, after you put your phone on charge, step outside for five minutes before you sit back down.**

**Why this one.** Your body is where one change reaches furthest. The barrier you named there was time, so this is five minutes. You told us you have tried before and it did not stick, so this is smaller than what you probably tried last time, and it is attached to something you already do every night rather than to an intention to remember.

**What the evidence says, and where it does not.** Regular physical activity has a consistent, well-replicated effect on low mood and distress across randomised trials. Doing it outdoors has additional support, though the studies that found it typically used around ten minutes rather than five. We are starting you below the researched dose on purpose, because a five-minute thing you actually do beats a ten-minute thing you do not. If it holds for a week, ten is the next step.

The specific form, "after X, I will do Y", is not a stylistic choice. Attaching a new action to an existing cue has meta-analytic support in its own right, independent of what the action is.

**What this report is not asking of you.** Nothing about money this month. Your money reading is one of the hardest in this report and you named money itself as the barrier, which no next step can move in a week. It is in the report because it is true, not because it is this month's work.

---

### 10. How confident this report is, area by area

| Area | Confidence | Why |
|---|---|---|
| Emotional calm | **Well supported** | Ten-item published stress questionnaire, plus mood items |
| Progress and agency | **Well supported** | Six-item published self-efficacy questionnaire |
| Relationships | Reasonably supported | Three-item published loneliness questionnaire. Short, so we read it as a band rather than a number |
| Meaning and purpose | Reasonably supported | Four published items, plus one of ours |
| Money and security | Reasonably supported | Five published items, rescaled by us rather than using US scoring tables |
| Energy and drive | **Held loosely** | Two items only, and your own sorting put this area lower than the questions did |
| Body and recovery | **Held loosely** | Built from several inputs, because no short, well-tested questionnaire exists for this |
| Curiosity and learning | **Held loosely** | Our own questions, not a published questionnaire |
| Surroundings and belonging | **Held loosely** | One published item plus two of ours |

Where we are less confident, we have said so rather than making the report feel stronger than it is.

---

### 11. What we used

**Questionnaires**, used with their original wording unchanged:
- WHO-5 Well-Being Index, World Health Organization
- Perceived Stress Scale, 10-item, Cohen et al.
- UCLA Loneliness Scale, 3-item version, Hughes et al.
- General Self-Efficacy Scale, 6-item short form, Romppel et al. (2013)
- Financial Well-Being Scale, 5-item, US Consumer Financial Protection Bureau
- Inclusion of Nature in Self, Schultz

**LEWIS's own questions**, which are not from published research and are scored conservatively: the curiosity and growth items, the cultural belonging items, and parts of the body and recovery reading.

**Research behind the connections in section 6:**
- Sleep and emotion: Palmer et al. (2024), *Psychological Bulletin*, 154 experimental studies
- Physical activity and mood: Singh et al. (2023), *British Journal of Sports Medicine*, umbrella review
- Money and mental health: Guan et al. (2022), *PLOS ONE*; Richardson et al. (2013), *Clinical Psychology Review*
- Outdoor time and restoration: Song et al. (2022), randomised trial meta-analysis

**What this is not.** LEWIS is a reflection tool. It does not diagnose anything, it makes no claim about hormones, brain states or heart rhythms, and it is not a substitute for talking to a doctor or a therapist. The research behind it describes what tends to be true across many people. It cannot tell you what is true for you, only what is worth looking at.

**A limitation we want you to see.** Almost all of the research above was conducted in Europe, the United Kingdom and the United States. LEWIS is built for people in India and elsewhere. We think these findings travel, and we do not have evidence that they travel perfectly.

---

# PART C. What this run surfaced

Three things came out of building this that were not visible in the specification.

**1. Duplicate edges.** Edges 1 and 2 are both PH to EM and both fired, which would have drawn two identical arrows. Rule added: edges sharing a source and target merge, with the union of confirmations.

**2. The root driver confidence constraint is wrong as written.** It blocked the correct answer. See A6. This needs your decision before the engine is built, because it is the difference between pointing Devaraj at his sleep and pointing him at his stress.

**3. Section 3 is the weakest writing in the report.** Nine band descriptors plus one personalised line each produces a list that reads like nine paragraphs of the same shape. The band descriptors themselves are excellent. The problem is repetition of structure, not of words. Two options: cut section 3 to the four lowest and three highest and let the diagram carry the rest, or vary the sentence shape systematically by band. I lean toward the first. This is the first thing the copy layer has to solve.
