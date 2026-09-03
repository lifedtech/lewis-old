# LEWIS Suggestion Library v1
## Companion 5. What LEWIS is allowed to suggest, and on what basis

This is the content layer behind Gate 2, Gate 3 and Gate 4 of the suggestion engine. Nothing may be suggested to a person that is not an entry in this file.

**The governing rule of this whole document:** an entry without a named evidence family, a tier, and a source link is a build failure, not a content gap. If a suggestion is good but unevidenced, it ships as Practice-based and says so. It does not ship unlabelled.

---

# Part 1. Design principles

## 1.1 Form is the intervention, not just the content

The single best-evidenced thing in this entire library is not any particular activity. It is the **shape** the activity is delivered in.

Implementation intentions, if-then plans that specify when, where and how, produced <cite index="46-1">a medium-to-large effect on goal attainment (d = 0.65) across 94 independent tests</cite>, and <cite index="48-1">an effect of similar magnitude on preventing derailment of goal striving (d = 0.77)</cite>.

That effect is larger than most of the content interventions in this library. So every entry ships in if-then form, always, and the report says why.

**RULE.** No suggestion renders as a bare instruction. Every one renders as `{existing cue}, {specific action}`. "Go for a walk" is not a suggestion. "After you put your phone on charge, step outside for five minutes" is.

## 1.2 Smaller than the evidence, on purpose

Most of the evidence in this library comes from trials with doses no ordinary person will replicate unprompted. Exercise trials use structured programmes. Nature studies use around ten minutes. CBT-I uses a multi-week protocol.

LEWIS delivers fragments of these at a fraction of the dose, to people at capacity floor. That is the correct product decision and a real evidential compromise, and the honest response is to state it every time rather than borrow the full-dose evidence for a partial-dose ask.

**RULE.** Every entry carries a `researched_dose` and a `delivered_dose`. Where they differ, the report renders the dose honesty block from the copy layer, S9 block 2.

## 1.3 The library does not have to have an answer

Some dimensions have very little intervention evidence behind them. Money is the clearest case: the literature on financial strain and mental health is substantial, and the literature on what an individual can do about it in a week is close to absent. The library reflects that by being thin there and saying so, rather than by inventing content to fill the shape.

---

# Part 2. Entry schema

```yaml
id: EM-S0-004
dimension: EM
title: "Name the loop out loud"          # internal only, never rendered
cue_slot: "evening_transition"            # binds to a cue the person already reported
action: "say the thought out loud once, then name it as a thought"
size_tier: S0
friction_fit: [energy, mindset, time]
evidence_family: EF-10
evidence_tier: practice-based
researched_dose: null
delivered_dose: "one occurrence"
suppress_if: [compassion_3, fragile]
support_fit: [alone, gentle]
lifed_link: false
```

**Field rules**

| Field | Constraint |
|---|---|
| `cue_slot` | Must resolve to something the person actually told us: `evening_transition`, `morning_first_hour`, `after_last_meal`, `commute_end`, `phone_on_charge`, `before_screen`, `after_waking`. Never invent a cue |
| `size_tier` | S0 under 60 seconds. S1 one to five minutes. S2 five to fifteen. S3 fifteen plus, or a structural change |
| `friction_fit` | At least one of: time, energy, environment, mindset, priorities, money, access, none_obvious |
| `evidence_tier` | established, supported, emerging, practice-based. No other values |
| `researched_dose` | Null only when `evidence_tier` is practice-based |
| `suppress_if` | Safety flags from Gate 1 |
| `lifed_link` | If true, the disclosure line renders. No exceptions |

---

# Part 3. Size tiers and capacity mapping

| Tier | Definition | Example |
|---|---|---|
| **S0 Micro** | Under 60 seconds, one occurrence per day | Step outside the front door and stand there |
| **S1 Small** | One to five minutes | Five minutes outdoors after the evening meal |
| **S2 Moderate** | Five to fifteen minutes | A fifteen-minute walk, three times this week |
| **S3 Substantial** | Fifteen minutes plus, or a structural change | A fixed wake time, seven days running |

**Capacity ceiling, computed at Gate 3**

```
base_ceiling = { "7-day plan": S3, "one thing": S2, "too overwhelmed": S0 }

modifiers (each drops one tier, cumulative, floor S0):
  prior_attempts == "didn't stick"        -> −1
  cumulative_load >= 60%                  -> −1
  support_preference == "fragile"         -> hard set to S0
  compassion_level == 3                   -> hard set to S0
  bright_spot_tier == 3                   -> hard set to S0

modifier (raises one tier, ceiling S3):
  support_preference == "want to be challenged"
  AND cumulative_load < 40%
  AND prior_attempts == "yes, and it helped"   -> +1
```

**RULE.** The raise modifier can never override a hard set. A person who says they want to be challenged and also says they are fragile gets S0.

---

# Part 4. Evidence families

Every entry points at one of these. The tier is set here, once, and inherited. No entry may claim a tier higher than its family.

## EF-01. Physical activity. **Established**
<cite index="32-1">Umbrella review of systematic reviews found medium effects on depression (median ES −0.43, IQR −0.66 to −0.27), anxiety (−0.42) and psychological distress (−0.60, 95% CI −0.78 to −0.42) versus usual care.</cite>
Singh et al. (2023), *BJSM*, doi:10.1136/bjsports-2022-106195
**Researched dose:** structured programmes, typically 150 min per week over 8 to 12 weeks.
**Limitation to state:** blinding is impossible in exercise trials, and <cite index="38-1">some analyses restricted to low-risk-of-bias randomised trials have found no significant antidepressant effect</cite>.

## EF-02. Behavioural activation. **Established**
<cite index="39-1">Random-effects meta-analysis found behavioural activation superior to controls, SMD −0.74 (95% CI −0.91 to −0.56, k = 25, N = 1,088).</cite> <cite index="38-1">The largest recent meta-analysis, 28 trials, found pooled Hedges' g of 0.83 on depression, 0.37 on anxiety and 0.64 on activation.</cite>
Ekers et al. (2014), *PLOS ONE*; Stein et al. (2021)
**Researched dose:** 8 to 12 structured sessions.
**Limitation to state:** <cite index="42-1">in primary care, effects against inactive controls are modest (g = 0.44) and no better than active comparators (g = −0.06)</cite>, and <cite index="41-1">most studies are rated at high risk of bias, predominantly due to patient-rated outcomes in non-blinded studies</cite>.

## EF-03. Slow-paced breathing. **Supported**
<cite index="21-1">Meta-analysis of 12 randomised controlled trials, 785 adults, found a small-to-medium effect on self-reported stress, g = −0.35 (95% CI −0.55 to −0.14).</cite> <cite index="24-1">Secondary outcomes showed g = −0.32 for anxiety (k = 20) and g = −0.40 for depressive symptoms (k = 18).</cite>
Fincham et al. (2023), *Scientific Reports*: https://www.nature.com/articles/s41598-022-27247-y
**Researched dose:** roughly 5 to 6 breaths per minute, sessions of at least 5 minutes.
**Limitation to state:** the authors' own conclusion. <cite index="24-1">They urge caution and advocate for low risk-of-bias designs to avoid a miscalibration between hype and evidence.</cite> That sentence should be pinned above the desk of whoever writes this content.
**RULE.** No entry in this family may reference vagal tone, heart rate variability, or the autonomic nervous system, regardless of what the source papers discuss.

## EF-04. Sleep, CBT-I components. **Supported at component level**
The full protocol is well evidenced. <cite index="17-1">Internet-delivered CBT-I improved insomnia severity, sleep efficiency, subjective sleep quality, wake after sleep onset and sleep onset latency, with Hedges' g from 0.21 to 1.09, comparable to face-to-face delivery.</cite> <cite index="11-1">Against inactive controls, sleep onset latency decreased by 15.53 minutes, sleep efficiency improved by 7.91 percent, and wake after sleep onset reduced by 15.61 minutes.</cite>
Zachariae et al. (2016): https://pubmed.ncbi.nlm.nih.gov/26615572/
**The honesty problem, and it is the sharpest one in this library.** LEWIS delivers single components (a consistent wake time, getting out of bed when not sleeping, a wind-down) outside the protocol they were tested in. **Protocol-level evidence is not component-level evidence.** Entries in this family are therefore capped at **Supported** and must render: *"This comes from a well-tested sleep programme. On its own, outside that programme, it has less behind it."*
**RULE.** No LEWIS entry may implement sleep restriction. It requires clinical supervision and can be harmful unsupervised.

## EF-05. Nature contact. **Supported**
<cite index="29-1">Meta-analysis of randomised trials found green space exposure decreased fatigue (−0.84, 95% CI −1.15 to −0.54) and increased vitality (0.85, 95% CI 0.52 to 1.18).</cite> <cite index="27-1">Shorter exposures delivered in intervals showed positive significant effects, with as little as ten minutes outside, including urban nature, improving adults' mental health.</cite>
Song et al. (2022): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9658851/; Bettmann et al. (2025)
**Researched dose:** around 10 minutes, repeated.
**Limitation to state:** <cite index="25-1">a major source of variability is how exposure and outcome are operationalised, and more stringent methods produce more conservative estimates</cite>.

## EF-06. Implementation intentions. **Established**
<cite index="46-1">94 independent tests, medium-to-large effect on goal attainment, d = 0.65.</cite> <cite index="48-1">Effect of similar magnitude on preventing derailment, d = 0.77.</cite>
Gollwitzer & Sheeran (2006), doi:10.1016/S0065-2601(06)38002-1
**This is the delivery form for every entry in the library, not a standalone entry.**

## EF-07. Gratitude practices. **Emerging**
This one matters, because gratitude journaling is the most-suggested wellbeing intervention in the industry and the evidence does not support the confidence with which it is offered.

A preregistered meta-analysis using <cite index="33-1">145 papers, 163 samples, 727 effect sizes and 24,804 participants across 28 countries found small overall increases in wellbeing, Hedges' g = 0.19 (95% CI 0.15 to 0.22), with significant between-country differences</cite>. Critically, <cite index="31-1">the 95 percent prediction interval was [−0.21, 0.59]</cite>, which includes zero. A separate meta-analysis of 25 RCTs and 6,745 participants found <cite index="32-1">g = 0.22, with 63 percent of observed variability due to true heterogeneity rather than sampling error</cite>.
Cross-cultural meta-analysis (2025), *PNAS*: https://www.pnas.org/doi/10.1073/pnas.2425193122

**What this means for LEWIS.** A prediction interval crossing zero means that in a new setting, the expected effect could plausibly be negative. Combined with documented between-country variation and an India-first user base, gratitude entries are capped at **Emerging**, are never the primary suggestion, and carry: *"This one is popular and the evidence for it is genuinely mixed. Worth trying, not worth relying on."*

## EF-08. Loneliness and social cognition. **Emerging**
<cite index="3-1">A widely cited meta-analysis reported a small but statistically significant overall effect of −0.198, which the authors noted falls within the lower 15th percentile of efficacy for social and behavioural interventions.</cite> <cite index="3-1">Interventions targeting maladaptive social cognition were significantly more effective, at −0.598.</cite> But <cite index="4-1">the social cognitive training estimate was −1.58 (n = 3, 95% CI −3.18 to 0.02, p = .053)</cite>, a confidence interval crossing zero on three studies, and <cite index="10-1">the finding was not replicated in a more recent systematic review and meta-analysis</cite>.
Masi et al. (2011), *Personality and Social Psychology Review*: https://journals.sagepub.com/doi/10.1177/1088868310377394

**What this means for LEWIS.** Two things, and both cut against industry habit.
1. **"Join a club" is the weakest arm of this literature**, not the strongest. Social contact and social support interventions underperformed social cognition work. LEWIS should not default to contact suggestions.
2. **The social cognition finding is not solid enough to build on either.** Three studies, interval crossing zero, failed replication. Capped at Emerging.

## EF-09. Financial behaviour change. **Practice-based**
Searched and not found: any meta-analytic evidence that an individual behaviour change delivered in a week measurably improves financial wellbeing. The literature linking financial strain to distress is strong. The literature on what a person can do about it alone, quickly, is not.

**RULE.** Every money entry is Practice-based, zero-cost, and non-shaming. No money entry may be the primary suggestion when `friction == money`, because the barrier is the thing itself. LEWIS says so rather than suggesting harder.

## EF-10. LEWIS practice-based. **Practice-based**
Sensible, widely used, no consolidated evidence base. Fully permitted, always labelled.

---

# Part 5. Three gold-standard entries

Fully worked, to show the schema in use. Everything in Part 6 follows this pattern.

```yaml
id: PH-S1-002
dimension: PH
title: "Five minutes out after the meal"
cue_slot: after_last_meal
action: "step outside and walk for five minutes before you sit back down"
size_tier: S1
friction_fit: [time, energy, mindset]
evidence_family: [EF-01, EF-05]
evidence_tier: established          # inherits the lower-risk of the two: EF-01
researched_dose: "150 min/week structured; nature findings use ~10 min"
delivered_dose: "5 min, once daily"
dose_honesty: true
suppress_if: [access_barrier, unsafe_environment_flag]
support_fit: [structure, alone, gentle]
lifed_link: false
```

```yaml
id: EM-S0-001
dimension: EM
title: "Six slow breaths at the transition"
cue_slot: commute_end
action: "take six slow breaths before you go inside"
size_tier: S0
friction_fit: [time, energy, priorities, none_obvious]
evidence_family: EF-03
evidence_tier: supported
researched_dose: "5-6 breaths/min, sessions of 5+ minutes"
delivered_dose: "six breaths, roughly 60 seconds"
dose_honesty: true
suppress_if: [breath_tension_rose]     # if the breathing minute made them worse
support_fit: [alone, gentle, structure]
lifed_link: false
```

```yaml
id: RS-S1-003
dimension: RS
title: "One specific message"
cue_slot: evening_transition
action: "send one person a message about something specific you remember, not a check-in"
size_tier: S1
friction_fit: [energy, mindset, time]
evidence_family: EF-08
evidence_tier: emerging
researched_dose: null
delivered_dose: "one message"
dose_honesty: false
evidence_note: "required"              # renders the EF-08 caution
suppress_if: [relationship_strain_flag, compassion_3]
support_fit: [gentle, alone]
lifed_link: false
```

---

# Part 6. The library

Compact form. Each row is a full entry; the omitted fields take the family defaults.

## PH. Body and recovery

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| PH-S0-001 | after_waking | open the curtains and stand at the window for thirty seconds | S0 | time, energy | EF-04 | supported |
| PH-S0-002 | phone_on_charge | put the phone on charge in a different room from where you sleep | S0 | time, mindset | EF-04 | supported |
| PH-S0-003 | after_last_meal | step outside the front door and stand there for a minute | S0 | time, energy | EF-01, EF-05 | established |
| PH-S1-001 | before_screen | set one fixed time you stop looking at screens, and let bedtime fall where it falls | S1 | mindset, priorities | EF-04 | supported |
| PH-S1-002 | after_last_meal | step outside and walk for five minutes before you sit back down | S1 | time, energy, mindset | EF-01, EF-05 | established |
| PH-S1-003 | morning_first_hour | set the same wake time every day this week, including the weekend | S1 | mindset, priorities | EF-04 | supported |
| PH-S2-001 | commute_end | walk for fifteen minutes before you go inside, three times this week | S2 | time, priorities | EF-01 | established |
| PH-S3-001 | any | move any two sedentary hours this week into something that involves standing or walking | S3 | priorities, environment | EF-01 | established |

**Suppression across all PH entries:** any disordered eating signal suppresses every nutrition-adjacent entry. No PH entry implements sleep restriction.

## EM. Emotional calm

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| EM-S0-001 | commute_end | take six slow breaths before you go inside | S0 | time, energy, priorities | EF-03 | supported |
| EM-S0-002 | evening_transition | write down the one thing you are carrying, on paper, and leave it there | S0 | mindset, energy | EF-10 | practice-based |
| EM-S0-003 | before_screen | name out loud what you are about to do, before you pick up the phone | S0 | mindset | EF-10 | practice-based |
| EM-S1-001 | evening_transition | five minutes of slow breathing, roughly six breaths a minute | S1 | time, energy | EF-03 | supported |
| EM-S1-002 | morning_first_hour | write the three things that will actually matter today, and stop at three | S1 | priorities, mindset | EF-10 | practice-based |
| EM-S2-001 | evening_transition | fifteen minutes where nothing is scheduled and nothing is being consumed | S2 | time, priorities | EF-10 | practice-based |

**Suppression:** `breath_tension_rose` suppresses all EF-03 entries and routes to EM-S0-002 or a physical down-regulation entry instead.

## EN. Energy and drive

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| EN-S0-001 | morning_first_hour | do the smallest version of one thing you have been putting off, for sixty seconds | S0 | energy, mindset | EF-02 | established |
| EN-S1-001 | any | pick one thing you used to enjoy and do ten minutes of it this week | S1 | energy, mindset, priorities | EF-02 | established |
| EN-S1-002 | morning_first_hour | put the one thing that matters most into your highest-energy hour | S1 | priorities, time | EF-10 | practice-based |
| EN-S2-001 | any | schedule two specific activities this week, by name, day and time | S2 | priorities, mindset | EF-02 | established |
| EN-S3-001 | any | plan one activity a day for seven days, chosen for meaning rather than for pleasure | S3 | priorities | EF-02 | established |

**Note on EF-02.** Behavioural activation is a structured therapeutic protocol. LEWIS is delivering its central mechanism, scheduling valued activity, without the structure. Dose honesty renders on every EF-02 entry.

## RS. Relationships

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| RS-S0-001 | evening_transition | reply to the message you have been leaving unanswered | S0 | energy, time | EF-10 | practice-based |
| RS-S1-001 | evening_transition | ask one person a question you do not know the answer to | S1 | mindset, energy | EF-08 | emerging |
| RS-S1-003 | evening_transition | send one person a message about something specific you remember, not a check-in | S1 | energy, mindset, time | EF-08 | emerging |
| RS-S1-004 | any | notice once this week when you assume someone is not interested, and check whether you know that | S1 | mindset | EF-08 | emerging |
| RS-S2-001 | any | put one twenty-minute conversation in the calendar, with a name on it | S2 | time, priorities | EF-08 | emerging |

**RULE for this dimension.** Every RS entry above Emerging tier does not exist, because the evidence does not support one. Every RS suggestion renders the EF-08 caution. **LEWIS does not tell lonely people to join things.** That is the arm of the literature that performed worst, and it is also the suggestion most likely to land as a rebuke.

## MS. Meaning and purpose

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| MS-S0-001 | evening_transition | name one thing you did today that you would do again | S0 | energy, mindset | EF-10 | practice-based |
| MS-S1-001 | any | write down what you would want to be true in a year, in one sentence, then stop | S1 | mindset | EF-10 | practice-based |
| MS-S1-002 | any | do one thing this week purely because it matters to you, not because it is useful | S1 | priorities, time | EF-02 | established |
| MS-S2-001 | any | spend fifteen minutes on something you would do for free | S2 | time, priorities | EF-02 | established |

**Hard suppression.** `transcendent_connection == "painful right now"` suppresses this entire dimension's library. Nothing is suggested. The report says so.

## AC. Progress and agency

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| AC-S0-001 | morning_first_hour | write down the one thing you will finish today, and make it small enough to finish | S0 | mindset, energy | EF-06 | established |
| AC-S1-001 | evening_transition | write down one thing that went right and what you did that made it go right | S1 | mindset | EF-10 | practice-based |
| AC-S1-002 | any | take the thing you are stuck on and name the first physical action it needs | S1 | mindset, priorities | EF-06 | established |
| AC-S2-001 | any | pick one stalled thing, write an if-then plan for it, and put it where you will see it | S2 | mindset, priorities | EF-06 | established |

## FW. Money and security

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| FW-S0-001 | morning_first_hour | look at your balance once, on purpose, without doing anything about it | S0 | mindset | EF-09 | practice-based |
| FW-S1-001 | any | write down the one number you have been avoiding knowing | S1 | mindset | EF-09 | practice-based |
| FW-S1-002 | any | pick one recurring cost and find out exactly what it is | S1 | mindset, time | EF-09 | practice-based |
| FW-S2-001 | any | list what comes in and what goes out for one month, on one page | S2 | time, mindset | EF-09 | practice-based |

**RULE.** No FW entry may be the primary suggestion when `friction == money`. The copy layer's "what this report is not asking of you" block renders instead. LEWIS does not respond to a money barrier by asking for money-related effort.

**RULE.** No FW entry may reference saving, investing, budgeting products, or any Lifed financial offer. LEWIS is not a financial adviser and will not be mistaken for one.

## IG. Curiosity and learning

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| IG-S0-001 | commute_end | look up the one thing you wondered about today and did not look up | S0 | time, energy | EF-10 | practice-based |
| IG-S1-001 | any | spend ten minutes on something you are bad at, on purpose | S1 | energy, mindset | EF-10 | practice-based |
| IG-S1-002 | before_screen | read four pages of something that is not for work | S1 | time, energy | EF-10 | practice-based |
| IG-S2-001 | any | pick one thing you have wanted to learn and find out what the first step actually is | S2 | priorities, mindset | EF-06 | established |

**Routing note.** `intellectual_recency == "I don't have space for that right now"` is depletion, not drift. It routes **away** from this library entirely and into PH or EM. Suggesting curiosity to a depleted person is how a report loses someone.

## EC. Surroundings and belonging

| id | Cue | Action | Tier | Friction fit | Family | Evidence |
|---|---|---|---|---|---|---|
| EC-S0-001 | after_waking | open one window and stand near it for a minute | S0 | time, energy | EF-05 | supported |
| EC-S0-002 | evening_transition | clear one surface, not the room | S0 | energy, environment | EF-10 | practice-based |
| EC-S1-001 | after_last_meal | ten minutes outside, anywhere with sky and something growing | S1 | time, energy | EF-05 | supported |
| EC-S2-001 | any | change one thing about where you spend the most time, once | S2 | environment, money | EF-10 | practice-based |

**Suppression.** `cultural_belonging == "real pain for me"` suppresses all belonging-related entries. Environmental entries remain available.

---

# Part 7. Selection algorithm

```
1. candidates = library.filter(dimension == root_driver)

2. GATE 1, safety
   candidates = candidates.reject(any suppress_if flag is active)
   if compassion_level == 3: candidates = candidates.filter(size_tier == S0)
   if candidates.empty: return NO_SUGGESTION_STATE

3. GATE 2, friction
   candidates = candidates.filter(friction_fit contains person.friction)
   if candidates.empty AND person.friction == "money":
       return DELIBERATE_EXCLUSION_STATE   # copy layer S9 block 4
   if candidates.empty:
       candidates = library.filter(dimension == second_highest_leverage)
       repeat from step 2

4. GATE 3, capacity
   candidates = candidates.filter(size_tier <= capacity_ceiling)
   if candidates.empty: candidates = candidates.filter(size_tier == S0)

5. GATE 4, evidence
   sort candidates by evidence_tier: established > supported > emerging > practice-based
   tiebreak 1: support_fit contains person.support_preference
   tiebreak 2: cue_slot matches a cue the person actually reported
   tiebreak 3: lower delivered_dose wins

6. select candidates[0]
   render dose_honesty if researched_dose != delivered_dose
   render evidence_note if evidence_tier in [emerging]
   render lifed_disclosure if lifed_link
```

**RULE on step 3's fallback.** When the root driver has no viable candidate, the engine moves to the next dimension by leverage. It does **not** relax the friction filter to keep the root driver. A suggestion that does not fit the barrier is worse than a suggestion for a different area.

**RULE on step 5.** Evidence tier sorts before personal fit. A well-evidenced suggestion that fits a person moderately beats a practice-based one that fits perfectly. This is the whole point of Gate 4 and it should feel slightly uncomfortable, because it means the library sometimes outranks the personalisation.

---

# Part 8. What is deliberately not in this library

Naming these is as important as the entries, because their absence will otherwise look like an oversight.

| Excluded | Why |
|---|---|
| Cold exposure, ice baths, cold showers | Frequently suggested for mood. LEWIS's own wellbeing rules prohibit physical discomfort as a coping strategy, and the mood evidence is thin |
| Supplements of any kind | Outside scope. LEWIS is not a health product |
| Sleep restriction | Effective within CBT-I under supervision. Potentially harmful unsupervised |
| Calorie, macro or weight targets | Suppressed entirely, and doubly so on any disordered eating signal |
| Journaling as a general instruction | Too vague to be an if-then. Specific written actions appear; "keep a journal" does not |
| "Join a club", "make new friends", "put yourself out there" | The weakest arm of the loneliness literature, and the most likely to read as a rebuke |
| Anything referencing cortisol, HRV, vagal tone or nervous system regulation | Banned lexicon. The source papers may discuss these; LEWIS may not |
| Gratitude as a primary suggestion | Capped at Emerging. Available as a secondary, never as the one thing |

---

# Part 9. Governance and QA

**Owner.** Named, and the same person who owns the prior link set, so that the evidence tiering stays consistent between the connection map and the suggestion library.

**Versioning.** `suggestion_library_version` stored on every generated report alongside `link_set_version` and `copy_layer_version`.

**Entry admission checklist.** No entry enters without all of: an if-then form with a real cue slot, a size tier, at least one friction fit, an evidence family, a researched and delivered dose (or a practice-based label), and suppression flags reviewed against Gate 1.

**Automated tests**
| Test | Assertion |
|---|---|
| Tier inheritance | No entry claims a tier above its family |
| Dose honesty | Every entry where doses differ renders the honesty block |
| Emerging caution | Every emerging-tier selection renders its family's caution |
| Lifed disclosure | Every `lifed_link: true` selection renders the disclosure |
| Banned lexicon | Regex across all rendered suggestion text |
| Compassion 3 | Fixture asserts only S0 entries can be selected |
| Money friction | Fixture asserts the deliberate exclusion state renders and no FW entry is selected |
| Depletion routing | Fixture asserts "no space for that" routes out of IG |
| Empty library | Fixture asserts NO_SUGGESTION_STATE renders its copy rather than failing |

**Review cadence.** Annually, and immediately on publication of any umbrella review touching a listed family. EF-07 and EF-08 are the two most likely to move, in either direction.

---

# Part 10. Open items

1. **Library size.** This is roughly 45 entries. It is enough to ship and it will feel repetitive at scale, because a person retaking LEWIS in three months may see the same suggestion. Target for v2 is roughly 120, which means three to four times the entries at the same evidential standard. That is the constraint, not the count.

2. **Three families need a proper search I have not run.** Self-compassion interventions, mindfulness delivered in brief self-help form, and savouring. All three are plausibly Supported and are currently absent rather than tiered, which is the honest state but a gap.

3. **EF-09 is the real hole.** Money is one of your nine dimensions, it will frequently be a person's lowest reading, and LEWIS currently has nothing evidenced to offer there. Two responses are available: commission a proper search on financial capability interventions, or accept that the honest answer is that LEWIS names the problem and does not pretend to solve it. I lean toward the second, said explicitly in the report, because it is true and because a wellbeing tool quietly becoming a financial advice tool is a regulatory problem as well as an epistemic one.

4. **Cross-cultural fit.** EF-07 has documented between-country variation in effect. Nothing else in this library has been checked for it, and the base rate in this literature is that Western samples dominate. This should be a line in the report's methodology note and a research priority, not a footnote.

5. **The retake problem.** Nothing in this library handles the second visit. A person who took the same suggestion and it worked, or took it and it did not, needs different treatment on retake, and the engine currently has no memory of what it suggested. That is a schema addition, not a content one, and it should be designed before launch rather than retrofitted.
