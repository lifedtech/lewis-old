# LEWIS Live Walkthrough v5
## The refined flow, screen by screen, as a person experiences it

Build reference for UI and UX. Every screen below carries: route ID, act, input type, exact copy, exact options, interaction notes, the variable it produces, and any rule that governs it.

**Scope of this version:** 37 screens from age gate to report generation. Modelled completion time 11.5 to 13 minutes. Down from 52 screens and roughly 22 to 28 minutes in the current live build.

**Status of copy in this document:** every string here is final unless marked `PENDING`. Strings marked `VERBATIM` are validated instrument items and must not be edited by anyone, in any language, for any reason.

---

# Part 0. Global UI rules

These apply to every screen and should be built once.

### Layout
- **One question per screen.** The only exceptions are explicitly marked as grouped screens.
- **No screen scrolls on a 390px viewport.** If content does not fit, it is two screens, not one scroll.
- Question sits in the upper third. Options fill the middle. Primary action in the bottom thumb zone.
- Instrument items (WHO-5, PSS-10, GSE-6, CFPB-5) are the exception: those present one item at a time with the scale as stacked full width buttons, and advance automatically on tap.

### Progress
- **Act level only.** A small persistent label reading `Act 3 of 6 · The measured core`.
- Beneath it, a row of six dots, the current one filled.
- **No percentage bar and no "question 14 of 37".** Numeric progress increases abandonment when a person can see how much remains.

### Navigation
- A back control is present on every screen, labelled for screen readers as "Go back to previous question".
- Going back never clears a stored answer.
- No forward skip. Optional screens carry their own "Skip this" affordance.

### Act transitions
Four full screen transition cards, roughly 2.5 seconds each, dismissible by tap. These replace the old `1_14SensoryPause` route. Each carries the act name and one line of purpose. Copy is given in place below.

### Scales
Never render a Likert scale as a horizontal row of numbers on mobile. Always vertical stacked buttons carrying the full anchor label. A person should never have to remember what "3" means.

### Accessibility
- Every non-text interaction (affect canvas, body map, INS pictorial, card sort) has a labelled equivalent control path.
- The INS pictorial requires alt text per option describing the degree of overlap.
- The body map silhouette requires named tap zones announced to screen readers.
- Colour is never the only carrier of meaning, including in the nine card sort.

### Autosave
Nothing is persisted before the email screen in Act 4. Copy on the age gate stop screen and the landing must reflect this accurately.

### Voice rules enforced at string level
Banned everywhere in the interface: `assessment`, `test`, `score`, `screening`, `metrics`, `diagnosis`, `symptom`, `normal`, `baseline` (in the physiological sense), `autonomic`, `neural`, `cognitive presence`, `somatic map`, `resilience index`.

Permitted: reflection, reading, picture, pattern, area, where things sit, what you told us.

---

# Part 1. The flow

## Screen 00. Age gate
**Route** `gate` · **Type** single select, blocking · **Time** 5 sec

> **Before we begin, are you 18 or older?**
>
> LEWIS is built and tested for adults.

- Yes, I am 18 or older
- No, I am under 18

**UI notes.** Full screen, no branding chrome, no back control. This is a door, not a question.

**Produces** `gate.age_confirmed`

### Screen 00a. Stop screen (under 18 only)
**Route** `gate_stop` · terminal

> **Thank you for your honesty**
>
> **LEWIS is designed for adults**
>
> The reflections here are built and tested for people 18 and older, so the journey stops here for now. Nothing you have entered has been saved. You will be very welcome back when you are 18.
>
> Caring about your own wellbeing at your age is a genuine strength. If things ever feel heavy, please talk to someone you trust: a parent, a teacher, a school counsellor, or another adult in your corner. You deserve support from people around you, not just from a screen.

**UI notes.** No CTA back into the flow. One link out to the LEWIS homepage only. This copy is already excellent in the live build and is retained almost unchanged.

---

## Screen 01. Welcome
**Route** `welcome` · **Type** transition with CTA · **Time** 15 sec

**Rotation rule.** V1 is fixed on a person's first ever arrival. From the second session onward, one variant is drawn at random with a no immediate repeat rule. All four ship as keyed, versioned strings.

**V1, reflective invitation, default on first arrival**
> **Let's take an honest look at how life feels for you right now.**
> *No right answers. Just your reflection, gently guided.*

**V2, permission to arrive**
> **However you're arriving today is okay. Let's begin where you are.**
> *A few honest minutes, just for you.*

**V3, quiet and inward**
> **Before anything else, let's notice how things really feel underneath.**
> *Answer just for yourself. Nothing here is judged.*

**V4, spacious and calm**
> **Take a breath. There's nothing to get right here, only what's true for you.**
> *A quiet space to see how you really are.*

**Fixed beneath every variant, four trust signals as small pills:**
`Private` · `Adaptive` · `Research-based` · `Not a diagnosis`

**Fixed expectation line, directly above the CTA:**
> This takes about 12 minutes. It is longer than a quiz because it is not one. Give it the time and you get something worth reading.

**CTA:** `Begin`

**UI notes.** Never use the words "quick", "brief", or "just a few questions" anywhere in the product. The stated time must match the observed median from pilot before launch, and must match the FAQ, the hero, and the intro paragraph exactly.

---

### Act transition A
> **Act 1 of 6**
> **Arrival**
> *A little about you, so the rest fits.*

---

## Screen 02. About you
**Route** `1_0About` · **Type** grouped, three fields on one flow · **Time** 30 sec

**Framing line, shown once at the top:**
> Just a couple of quick details, so this feels made for you. Your answers stay private, and you can skip any of them.

**Field A, optional**
> **What would you like to be called?**
> *A first name or nickname is perfect, whatever feels right to you.*

Free text, single line, max 40 characters. `Skip this` affordance beneath.
**Produces** `context.name`

**Field B, optional**
> **Which age group are you in?**
> *This shapes your reflections. Wellbeing support works differently at different stages of life.*

- 18 to 24
- 25 to 34
- 35 to 44
- 45 to 54
- 55 to 64
- 65 or older
- Prefer not to say

**Produces** `context.age_band`

> **Build note.** Remove "Under 18" from this list. It is unreachable past the gate and its presence invites a person to test the door.

**Field C, optional. REWRITTEN**
> **Was your sex recorded as female or male at birth?**
> *Some wellbeing patterns, like sleep, hormones and recovery rhythm, differ. This only shapes those parts.*

- Female
- Male
- Another answer
- Prefer not to say

**Produces** `context.sex_at_birth`

> **Build note.** The live build asks "What is your sex?" with an Intersex option. If the purpose is physiological tailoring, ask for sex recorded at birth and say why. If the purpose is identity, that is a different question with different options. Do not merge the two.

**UI notes.** Three fields, one screen, progressive reveal. Each field's skip is visible without scrolling.

---

## Screen 03. Identity and life roles
**Route** `1_1Identity` · **Type** multi-select tiles · **Time** 20 sec

> **Which of these describes you right now?**
> *Select as many as fit.*

- Student
- Professional
- Entrepreneur or self-employed
- Primary caregiver
- Homemaker
- Retired
- Between jobs or job-seeking
- In transition
- Taking time out
- Living with a health condition
- Wearing many hats

**Produces** `context.roles[]`

> **Build note.** The live build ships this as "Select one." That is a regression. Role overload independently predicts strain, and "wearing many hats" only means anything if a person can also select the hats. Change to multi-select.

**UI notes.** Illustrated tiles, two per row on mobile. Selected state must be visible without colour alone.

---

## Screen 04. Life stability
**Route** `1_2Stability` · **Type** slider, five stops · **Time** 12 sec

> **How would you describe where life feels right now?**
> *One drag. There is no better or worse end of this.*

`Very turbulent` → `Unsettled` → `Mixed` → `Mostly steady` → `Very steady`

**UI notes.** A landscape illustration that shifts from turbulent to calm as the handle moves. Handle starts at centre, unset, and the CTA stays disabled until the person moves it, so a default is never mistaken for an answer. Discrete stops with haptic feedback, not continuous.

**Produces** `context.life_stability`

---

## Screen 05. Active life pressures
**Route** `1_3Pressures` · **Type** multi-select · **Time** 20 sec

> **What's pressing on you most right now?**
> *Select all that apply.*

- Workload
- Financial pressure
- Relationship strain
- Health concerns
- Life change or transition
- Mental load
- Digital overwhelm
- Feeling lost or without direction
- Sleep depletion
- Nothing major right now

**Produces** `context.pressures[]`

**UI notes.** "Nothing major right now" is mutually exclusive: selecting it clears all others and vice versa.

---

### Act transition B
> **Act 2 of 6**
> **How life feels**
> *Some of this is words. Some of it is not.*

---

## Screen 06. Arrival state
**Route** `1_8Arrival` · **Type** gesture plus optional free text · **Time** 20 sec

> **Before we go deeper, how would you describe arriving here today?**
> *One word, if you like.*

A mood landscape that shifts from stormy to clear with a horizontal gesture, plus an optional single word text field beneath.

**Produces** `context.arrival_word`, `context.arrival_mood`

**UI notes.** The word is optional and clearly marked so. It opens the first sentence of the report in the person's own language, which makes it worth asking for but never worth demanding.

---

## Screen 07. Overall wellbeing anchor, WHO-5
**Route** `1_5Who5` · **Type** instrument, 5 items, one per screen · **Time** 45 sec

**Block intro, shown once:**
> **Over the last two weeks...**
> *Choose how often each has been true.*

**Scale, all five items. `VERBATIM`**
`At no time` · `Some of the time` · `Less than half the time` · `More than half the time` · `Most of the time` · `All of the time`

**Items. `VERBATIM`**
1. I have felt cheerful and in good spirits
2. I have felt calm and relaxed
3. I have felt active and vigorous
4. I woke up feeling fresh and rested
5. My daily life has been filled with things that interest me

**Produces** `spine.who5[1..5]`

> **Compliance note.** WHO-5 copyright was assigned to WHO in 2024. Confirm commercial terms with WHO in writing before launch. This is a launch gate, not a nice to have.

**Safety hook.** WHO-5 at or below 50 on the 0 to 100 scale routes the compassion level and the support surfacing internally. It is never shown to the person as a finding, a threshold, or a number.

---

## Screen 08. Affect canvas
**Route** `3_1Affect` · **Type** two dimensional canvas, one tap · **Time** 15 sec

> **Place a dot where you feel right now.**
> *One tap. Move it if it isn't quite right.*

Axis labels, always visible:
- Horizontal: `Unpleasant` to `Pleasant`
- Vertical: `Calm` to `Activated`

**Produces** `affect.valence`, `affect.arousal`

**UI notes.** Live copy currently reads "Where is your mind sitting right now?" with "Tap anywhere on the grid to reflect your current energy and mood." Both are fine. Do not label the axes with technical terms. Screen reader path: two sliders, one per axis, with the same labels.

---

## Screen 09. Body map
**Route** `3_2BodyMap` · **Type** illustrated silhouette, multi-tap · **Time** 20 sec

> **Tap anywhere in your body that feels tense, heavy, or uncomfortable right now.**
> *Tap as many places as you need. Tap again to clear one.*

Five named zones: `Head and neck` · `Chest` · `Stomach` · `Shoulders and back` · `Limbs`

Beneath, a low-emphasis control: `Nothing feels tense right now`

**Produces** `somatic.tension_map`, `somatic.load_index`

**UI notes.** The "nothing feels tense" option matters. Without it, a person with no tension has no way to proceed except by tapping something untrue, which corrupts the variable.

---

## Screen 10. Inner state
**Route** `3_5NsState` · **Type** three cards, single select · **Time** 15 sec · **REWRITTEN**

> **Which of these feels closest to your inner state right now?**
> *There is no better card here.*

- **Grounded.** Present, connected, and open to what is around you.
- **Activated.** Wired, alert, on edge. Mind racing, body tense.
- **Collapsed.** Flat, withdrawn, checked out. Moving feels like pulling weights.

**Produces** `ans.portrait`

> **Build note.** The live hint reads "Select the autonomic baseline that feels most true to your experience right now." Remove it. "Autonomic baseline" is a physiological measurement claim and it contradicts the FAQ promise that LEWIS makes no claim about brain states. Replace with the line above.

---

## Screen 11. Body awareness
**Route** `3_6BodyAwareness` · **Type** single select · **Time** 12 sec · **REWRITTEN**

> **How tuned in to your body do you feel right now?**
> *Its tension, hunger, tiredness, comfort.*

- Very tuned in
- Somewhat
- Not very
- I rarely notice these signals

**Produces** `enrich.body_awareness_confidence`

> **Build note.** The live option text reads "You feel highly connected to somatic sensations, heartbeats, and tension shifts." Remove the reference to heartbeats. It is a leftover from the heartbeat tapping mechanic the charter already retired, and it implies a physiological reading that is not happening.

---

### Act transition C
> **Act 3 of 6**
> **The measured core**
> *The most researched part of LEWIS. Plainer on purpose.*

**Block preamble, shown on the first screen of Act 3:**
> These next few minutes are the most researched part of LEWIS. The questions are plainer and more repetitive than what came before, and that is deliberate. They come from questionnaires used in published wellbeing research, worded exactly as they were validated. Answer for the last two weeks, not for your best week.

---

## Screen 12. Body and movement
**Route** `1_4Body` · **Type** grouped, two single selects · **Time** 20 sec

> **How active has your body been lately?**

- Very active, daily movement
- Moderately active, a few times a week
- Mostly sedentary, desk or screen most of the day
- My movement has dropped recently

> **How has your sleep been?**

- Consistently good
- Variable, some good and some bad
- Generally poor, difficulty falling or staying asleep
- I haven't been tracking it

**Produces** `context.activity_level`, `context.sleep_quality`

---

## Screen 13. Emotional and mental, PSS-10
**Route** `5_2Pss10` · **Type** instrument, 10 items, one per screen · **Time** 65 sec

**Block intro:**
> **In the last month, how often have you...**

**Scale, all ten items. `VERBATIM`**
`Never` · `Almost never` · `Sometimes` · `Fairly often` · `Very often`

**Items. `VERBATIM`**
1. Been upset because of something that happened unexpectedly?
2. Felt that you were unable to control the important things in your life?
3. Felt nervous and stressed?
4. Felt confident about your ability to handle your personal problems? `reverse`
5. Felt that things were going your way? `reverse`
6. Found that you could not cope with all the things that you had to do?
7. Been able to control irritations in your life? `reverse`
8. Felt that you were on top of things? `reverse`
9. Been angered because of things that were outside of your control?
10. Felt difficulties were piling up so high that you could not overcome them?

**Produces** `spine.pss10[1..10]`

**Verification note.** I checked these ten against the live build item by item. They are correct and complete. Every reverse scored item must be unit tested against the published key with a fixture test that fails the build if inverted.

---

## Screen 14. Relationships
**Route** `5_2Ucla3` · **Type** grouped, context card plus 3 instrument items · **Time** 35 sec

**Part 1, context**
> **How does your social world feel right now?**

- Genuinely connected, I feel seen and supported
- I have people around me, but feel unseen
- Quite isolated, more alone than I'd like
- My relationships are a source of tension
- My life is closely woven with family, mostly a source of support
- My life is closely woven with family, mostly a source of pressure
- My connections are growing
- It's complicated

**Produces** `context.relational_context`

**Part 2, instrument**
> **How often do you feel...**

**Scale. `VERBATIM`** `Hardly ever` · `Some of the time` · `Often`

**Items. `VERBATIM`**
1. That you lack companionship?
2. Left out?
3. Isolated from others?

**Produces** `spine.ucla3[1..3]`

> **Build note.** Folding the context card onto the same flow as UCLA-3 removes a route and gives the loneliness score its cultural context immediately. The family woven options carry what an individual centric loneliness score cannot.

---

## Screen 15. Progress and agency, GSE-6
**Route** `5_2Gse` · **Type** instrument, 6 items, one per screen · **Time** 40 sec · **CHANGED FROM 10 ITEMS**

**Block intro:**
> **How true is each of these for you?**

**Scale. `VERBATIM`** `Not at all true` · `Hardly true` · `Moderately true` · `Exactly true`

**Items** `PENDING`
> **Do not select these six yourself.** Take the exact six items from the GSE-6 item table in Romppel et al. (2013), *GMS Psycho-Social-Medicine*, and transcribe them verbatim. Selecting your own six from the ten produces an unvalidated instrument that looks validated, which is worse than either alternative.

**Produces** `spine.gse6[1..6]`

> **Compliance note.** GSE-6 solves the length problem, not the licensing problem. Both derive from the same copyrighted item pool. Written commercial permission from Schwarzer and Jerusalem remains a launch gate.

---

## Screen 16. Meaning and purpose
**Route** `5_2Promis` · **Type** instrument, 4 items plus 1 context item · **Time** 35 sec

**Block intro:**
> **Thinking about the past 7 days, how much do you agree with each?**

**Scale.** `Not at all` · `A little bit` · `Somewhat` · `Quite a bit` · `Very much`

**Items** `PENDING`
> **Blocking issue.** The four items currently live ("My life has meaning", "I have a sense of direction in my life", "My life has purpose", "The things I do in my life are worthwhile") are **not** the published PROMIS Meaning and Purpose adult short form items. Meanwhile the LEWIS FAQ states that item wording "is never altered, in any language". These two facts cannot both stand.
>
> **Two ways to close this, pick one before launch:**
> 1. **Preferred.** Transcribe the adult Meaning and Purpose short form verbatim from HealthMeasures, and score with their conversion tables rather than a raw sum.
> 2. **Interim.** Keep the current four items, remove every occurrence of the word "PROMIS" from product, report and marketing, and label this internally and externally as the LEWIS Purpose module, scored on a LEWIS rescale with lower stated confidence.

**Context item, retained from 7.7B**
> **How connected do you feel to something larger than yourself?**
> *Community, nature, beliefs, or purpose. Whichever of those fits.*

- Deeply connected
- Somewhat
- A little
- Not at all
- This feels painful right now

**Produces** `spine.purpose[1..4]`, `context.transcendent_connection`

**Safety hook.** "This feels painful right now" activates gentler framing across the meaning sections of the report and suppresses any purpose-finding exercise in the plan.

---

## Screen 17. Money
**Route** `5_2Cfpb5` · **Type** grouped, 2 context items plus 5 instrument items · **Time** 55 sec

**Mandatory normalising lead. Never removed, never shortened:**
> Money and finances affect wellbeing significantly, for almost everyone. A few brief, private questions.

**Part 1, context, trimmed from four items to two**
> **How does thinking about your finances feel right now?**
- Calm and in control
- Some pressure, but manageable
- High anxiety, it's affecting my daily life
- I've been avoiding thinking about it
- Not relevant to me right now

> **How steady is your income, month to month?**
- Very steady
- Mostly steady
- It varies a lot
- Irregular or seasonal
- No personal income right now

**Produces** `context.financial_stress`, `context.income_regularity`

**Part 2, instrument. `VERBATIM`**

*First three, scale:* `Describes me completely` · `Very well` · `Somewhat` · `Very little` · `Not at all`
1. Because of my money situation, I feel like I will never have the things I want in life. `reverse`
2. I am just getting by financially. `reverse`
3. I am concerned that the money I have or will save won't last. `reverse`

*Last two, scale:* `Always` · `Often` · `Sometimes` · `Rarely` · `Never`
4. I have money left over at the end of the month. `forward`
5. My finances control my life. `reverse`

**Produces** `spine.cfpb5[1..5]`

> **Build note.** The live build replaced these context items with four different ones (heaviness, buffer, spending control, long-term confidence). Those four overlap heavily with the CFPB items that follow immediately, which means a person answers the same thing twice within thirty seconds. Use the two above instead: they capture what CFPB does not, which is affect and income volatility.

---

## Screen 18. Surroundings and belonging
**Route** `5_2Ins` · **Type** grouped, pictorial plus 3 items · **Time** 40 sec

**Normalising lead:**
> Sense of belonging and cultural identity matter to wellbeing in ways that are rarely talked about.

**Part 1, INS pictorial. `VERBATIM` construct**
> **Choose the picture that best describes your relationship with the natural environment right now.**

Seven pairs of overlapping circles labelled `Self` and `Nature`, from fully separate to almost fully overlapping. One tap, overlap maps 1 to 7. **Each option requires alt text describing the degree of overlap in words.**

**Produces** `spine.ins`

**Part 2, nature access**
> **Do you have regular access to nature or green spaces?**
- Yes, regularly
- Sometimes
- Rarely
- No

**Produces** `context.nature_access`

**Part 3, cultural belonging, bespoke module**
> **How much do you feel you belong to a community or culture that feels like home?**
- Strongly, I feel deeply at home
- Somewhat, it mostly fits
- Partially, parts of it feel right
- Not much, I feel like an outsider
- This is an area of real pain for me

> **There are traditions, practices, or shared ways of living that I feel part of.**
Scale: `Not at all` to `Very much`, 1 to 5

**Produces** `context.cultural_belonging[1..2]`

**Safety hook.** "This is an area of real pain for me" activates cultural safety framing across all later social and belonging content.

---

## Screen 19. Curiosity and growth
**Route** `5_2Growth` · **Type** grouped, 3 items plus 1 recency item · **Time** 30 sec · **NEW, REPLACES DIENER**

**Block intro:**
> **How much do you agree with each, thinking about recent weeks?**

Scale: `Strongly disagree` · `Disagree` · `Neither` · `Agree` · `Strongly agree`

1. Lately I have had the chance to learn or get better at something.
2. My days give me something that stretches me in a good way.
3. I have the space and appetite to be curious right now.

**Recency item**
> **When did you last do something that genuinely stretched your mind or sparked your curiosity?**
- This week
- In the past month
- A few months ago
- I honestly can't remember
- I don't have space for that right now

**Produces** `lewis.growth[1..3]`, `context.intellectual_last_engagement`

> **Why this replaced the Flourishing Scale.** Diener's Flourishing Scale is a unidimensional general wellbeing measure covering purpose, relationships, competence and optimism. Not one of its eight items is about learning or curiosity, and three of them structurally duplicate the purpose, loneliness and self-efficacy items already answered on screens 14, 15 and 16. Using it as the Intellectual and Growth anchor would have manufactured correlations between four dimensions and then reported them back to the person as a discovered connection.
>
> **Label this module honestly.** It is bespoke, it is scored conservatively, and Intellectual and Growth carries lower stated confidence in the report as a result. This is the same treatment already given to the cultural belonging module.

**Also cut here:** the Satisfaction With Life Scale (`5_2Swls`, 5 items). It is an optional cross check, not a dimension. Reintroduce in a research build to calibrate confidence, not in v1.

---

### Act transition D
> **Act 4 of 6**
> **The shape of your life**
> *Now the part that is yours to arrange.*

---

## Screen 20. Life landscape sort
**Route** `5_1Landscape` · **Type** drag to three zones, 9 cards · **Time** 50 sec

> **Sort each card into the zone that fits your life right now.**
> *There's no right arrangement. Go with your gut.*

**Nine cards, icon plus warm label:**
`Body & recovery` · `Emotional calm` · `Energy & drive` · `Relationships` · `Meaning & purpose` · `Progress & agency` · `Money & security` · `Curiosity & learning` · `Surroundings & belonging`

**Three drop zones:**
- `Depleted right now`
- `Doing okay`
- `A real strength`

**UI notes.** Drag with a tap-card-then-tap-zone fallback on small screens. Unplaced cards remain visible in the deck. The CTA stays disabled until all nine are placed. Zones are distinguished by position and label, never by colour alone.

**Produces** `gestalt.domain_sort{9}`

---

## Screen 21. What matters most
**Route** `5_1Priority` · **Type** pick three from the same nine cards · **Time** 25 sec · **REPLACES THE 9-CARD RANKING**

> **Of these nine, which three matter most to you right now?**
> *Not which are going well. Which you care about most.*

The same nine cards, now in a single row grid, tap to select up to three. A small counter shows `2 of 3 chosen`.

**Produces** `context.priority_top3[]`

> **Build note.** This replaces the nine card drag ranking at `1_7Priority`, which was flagged High cognitive load in the charter and is the single slowest interaction in the current build. The purpose-in-pain engine only needs top priorities against bottom scores, and top three preserves that. Presenting the same nine cards a person has just sorted also makes the second pass fast, because the semantics are already loaded.

---

## Screen 22. Priority tension check
**Route** `5_5PriorityTension` · **Type** single select, conditional · **Time** 12 sec

**Fires only when a top three priority is also a bottom scoring dimension.**

> **You said [Meaning & purpose] is one of the things that matters most to you right now. Your answers suggest it's also where you feel most depleted. Does that feel right?**

- Yes
- Partly
- Not quite

**Produces** `context.tension_confirmed`

**UI notes.** This is the recognition moment. Give it space, slow the transition into it slightly, and do not stack it visually with the screens either side.

---

## Screen 23. Bright spot
**Route** `5_4BrightSpot` · **Type** conditional, three tiers · **Time** 25 sec

LEWIS picks the dimension automatically from the scores. Three gated variants:

**Tier 1, top dimension scores 55 or above**
> **Of everything we looked at, your [dimension] stands out as a real strength right now. What's working here?**
*Optional short free text.*

**Tier 2, top dimension scores 40 to 54**
> **Nothing is sitting in the bright zone right now, and that's worth being honest about. But your [dimension] is the steadiest ground you have at the moment, and it's a place we can start from.**

**Tier 3, all dimensions below 40**
> **Right now, things feel depleted across the board. That's genuinely hard, and naming it honestly is the first real step. We'll start gently, with the smallest possible next move.**
*No free text is requested in this tier.*

**Produces** `context.bright_spot`

**Safety hook.** Tier 3 reinforces the support routing and sets the gentlest compassion level for the entire report.

---

## Screen 24. Save your reflection
**Route** `5_0Email` · **Type** email capture · **Time** 20 sec · **MOVED**

> **Save what you have built so far.**
> Add your email and this is held safely, so you can step away and come back to exactly this point. Your reading will be sent here when you finish.

Email field. Optional checkbox: `Send me occasional wellbeing research from LEWIS. About once a month, unsubscribe any time.`

Beneath: `Your data is encrypted and private. LEWIS never sells or shares your reflections.`

**Produces** `context.email`, `context.marketing_optin`

> **Placement change, and why it matters as much as any cut.** In the live build this sits at screen 26 of 52, immediately before the 34 item validated block. You are asking for commitment at the exact moment the effort curve spikes. Here it sits directly after the Bright Spot, where the person has just been shown their strength and is at the emotional high point of the flow. Same field, same copy, completely different motivational state. Worth A/B testing, but the current position is the worst available one.

---

### Act transition E
> **Act 5 of 6**
> **What's in the way**
> *A few short questions about the areas that felt hardest.*

---

## Screens 25 to 27. Adaptive deep dives
**Route** `5_3DeepDives` · **Type** adaptive, up to 3 dimensions · **Time** 25 sec each

**Firing rule.** Deep dives fire only for the lowest scoring dimensions, **capped at three**, and only those genuinely below the Steady band (score under 55). A flourishing person may get one deep dive, or none. Never manufacture a problem.

**Each qualifying dimension gets one screen carrying all three parts:**

**Part 1, texture flags** (multi-select, dimension specific, prompts below)
**Part 2, trajectory** (single select, identical for every dimension)
> **Is this getting better, worse, the same, or does it vary?**
`Getting better` · `Getting worse` · `About the same` · `It varies a lot`

**Part 3, friction** (single select, identical for every dimension)
> **What's most in the way right now?**
`Time` · `Energy` · `My surroundings` · `How I am thinking about it` · `Competing priorities` · `Money` · `Access to what I need` · `Honestly, nothing obvious`

> **Build note.** The final option is new and it matters. Friction is the single most important input to the suggestion engine. Forcing a person who recognises none of the options to pick one anyway puts noise into your most load-bearing variable.

### The nine texture flag sets

**Body & recovery (PH)** > *What's been hardest for your body lately?*
Sleep isn't restoring me · There's no time to rest or recover · Movement feels like a chore right now · I'm not eating in a way that nourishes me · My body holds a lot of tension or pain · I'm running on empty whatever I do

**Emotional calm (EM)** > *What does the strain feel like most?*
My mind feels constantly busy or racing · I'm carrying more stress than I can hold · I feel low or flat more often than not · Small things overwhelm me easily · It's hard to switch off or settle · I've been hard on myself

**Energy & drive (EN)** > *What fits how your energy feels?*
Most days feel like going through the motions · I've lost interest in things I used to enjoy · My energy runs out long before the day does · Nothing feels genuinely exciting right now · I'm doing a lot, but none of it lights me up · It's hard to get started on anything

**Relationships (RS)** > *What's true about your connections right now?*
I feel more alone than I'd like · I have people around, but don't feel truly seen · My relationships feel like hard work right now · I find it hard to reach out or open up · I don't have time for the people who matter · A relationship is causing me real strain

**Meaning & purpose (MS)** > *What's closest to how meaning feels right now?*
I'm not sure what really matters to me right now · Day-to-day life feels a bit empty or aimless · I've drifted from what gives me purpose · I'm questioning my direction · I feel disconnected from something larger than myself · I've lost touch with practices that grounded me

**Progress & agency (AC)** > *What's getting in the way of feeling capable?*
I don't feel in control of how things are going · I'm not making progress on what matters to me · I doubt my ability to handle what's ahead · I start things but struggle to follow through · I feel stuck, like nothing I do shifts things · I rarely get that "I did it" feeling

**Money & security (FW)** > *What's weighing on you about money?*
*Carries the same normalising care as screen 17. Gentle, never shaming.*
Money worry sits with me most days · I'm living without much of a buffer · I tend to avoid looking at my finances · My income feels unpredictable · I feel behind where I want to be · Money is a source of tension at home

**Curiosity & learning (IG)** > *What fits how your mind feels lately?*
I haven't learned anything new in a long while · My days don't really stretch my mind · I'm too drained to feel curious · I miss feeling challenged in a good way · I've stopped making time for growth · I feel like I'm standing still

**Surroundings & belonging (EC)** > *What's true about your space and sense of belonging?*
My space drains me more than it restores me · I rarely get out into nature · I have little control over my surroundings · I don't feel a strong sense of belonging anywhere · I feel out of place in my community or culture · My environment feels cluttered or chaotic

**Produces** `deepdive.flags`, `deepdive.trajectory`, `deepdive.friction` per qualifying dimension

**What a person actually experiences.** If Meera's three lowest are Emotional calm, Body & recovery and Money, all below Steady, she sees exactly three short screens and never sees the other six. She never learns the other six exist.

---

### Act transition F
> **Act 6 of 6**
> **How to help you**
> *Last few. Then one small thing, just for you.*

---

## Screen 28. Support preference
**Route** `7_4Support` · **Type** grouped, 2 single selects · **Time** 25 sec

> **When it comes to support and guidance, what works best for you?**
- I prefer to work through things alone
- I like structure and clear steps
- I learn best through stories and ideas
- I need something gentle, I'm fragile right now
- I want to be challenged

> **And how do you prefer to take things in?**
- Reading
- Watching short video
- Listening
- A mix

**Produces** `context.support_preference`, `context.content_preference`

**Safety hook.** "I'm fragile right now" triggers the gentlest possible mode across the entire report and plan.

> **Build note.** Content preference is a tie breaker for modality only. It is explicitly not the discredited learning styles theory, and no copy anywhere should imply that it is.

---

## Screen 29. What you've tried
**Route** `7_2Prior` · **Type** single select · **Time** 12 sec

> **Have you tried to improve your wellbeing recently?**
- Yes, and it helped
- Yes, but it didn't stick
- Yes, but I'm not sure
- No, not yet

**Produces** `context.prior_attempts`, `context.prior_effectiveness`

> **Why this is worth its 12 seconds.** This is the single most important variable for sizing the first habit. "Didn't stick" makes the next suggestion dramatically smaller and adds a "why this one is different" framing.

---

## Screen 30. Planner readiness
**Route** `7_5Planner` · **Type** single select · **Time** 12 sec

> **How do you feel about planning right now?**
- I'd love a clear 7-day plan
- Give me one thing to focus on
- I'm too overwhelmed for a plan right now

**Produces** `context.planner_readiness`

---

## Screen 31. Your day's rhythm
**Route** `8_1EnergyArc` · **Type** grouped, 4 taps plus 2 single selects · **Time** 30 sec · **MERGED FROM THREE SCREENS**

> **Where's your energy, typically?**
> *Four quick taps.*

Four zones, each `High` / `Medium` / `Low`: `Morning` · `Afternoon` · `Evening` · `Night`
A small visual fills as taps land, showing the day's shape.

> **How easily do you fall asleep?**
- Easily
- It takes time
- Difficult
- Very disrupted

> **When stress hits, what happens?**
- I get activated and wired
- I go flat and exhausted
- A mix of both
- I shut down

**Produces** `enrich.energy_arc_pattern`, `enrich.irregularity`, `enrich.sleep_onset`, `enrich.stress_response_style`

> **Build note.** This one screen replaces three: `1_13BodyRhythm`, `3_3DayRhythm` and `8_1EnergyArc`. In the current build a person is asked about their daily energy rhythm three separate times, at screens 15, 20 and 47. They will notice, and repetition reads as either sloppiness or as an attempt to catch them out. Both damage disclosure.

---

## Screen 32. Recovery
**Route** `8_3Recovery` · **Type** single select · **Time** 12 sec

> **When you rest or take time out, how do you feel?**
- Genuinely recovered, I come back refreshed
- Somewhat better, but not fully recharged
- Still tired even after rest
- More anxious when I stop, I can't switch off

**Produces** `enrich.recovery_responsiveness`

**Routing hook.** The last option routes toward down-regulation first, because telling a wired person to relax rarely works.

---

## Screen 33. How stress shows up
**Route** `8_2StressPattern` · **Type** multi-select tile groups · **Time** 30 sec

> **Select any that feel true for you lately.**
> *These are patterns in how stress can show up. A reflection to help you notice what's happening, not a test of anything.*

**The Surge**, wired and hard to switch off: racing thoughts · difficulty switching off · jaw tension · wired but exhausted · light sleep

**The Flatline**, depleted and flat: persistent fatigue · low motivation · flat affect · long recovery times · reduced appetite

**The Fog**, foggy and scattered: brain fog · poor short-term memory · midday crashes · difficulty concentrating · feeling disconnected

**The Cycle**, rhythm linked, opt-in with a clear opt-out: mood tied to cycle · energy fluctuations · cycle-related symptoms · sleep shifts around cycle

**Produces** `enrich.stress_cluster`

**Framing rule.** These are heuristic, experiential labels. They are explicitly not validated cortisol phenotypes and no copy may imply a hormone reading.

---

## Screen 34. Cumulative load
**Route** `8_4Cumulative` · **Type** instrument style, 5 items · **Time** 30 sec · **CUT FROM 10 ITEMS**

**De-medicalising frame, shown first:**
> One last gentle look back. Over the past few months, life leaves marks on the body and mind. This is just a way to notice what yours might be carrying. Not a health check, just a reflection.

> **Over the past three months, how often have you noticed each of these?**

Scale: `Not at all` · `Occasionally` · `Often` · `Almost always`

1. Feeling tired even after a full night's sleep
2. Finding it hard to wind down or switch off
3. Tension showing up in your body, in your jaw, shoulders, neck or gut
4. Getting sick more easily, or taking longer to bounce back
5. A sense of running on empty, even on quieter days

**Produces** `enrich.cumulative_load_inventory`

> **Build note.** Cut from ten items to five. Ten four-point items at the very end of a long flow is exactly where satisficing shows up. The five retained are the ones with the least overlap with WHO-5, PSS-10 and the body map. The five cut (irritability, appetite, concentration, broken sleep, emotional flatness) are all already carried elsewhere.

**Rolls into** a coarse low / moderate / heavy reading used only to set the report's compassion level and inform recovery suggestions. Never a measurement of any condition.

---

## Screen 35. One minute of breathing
**Route** `3_4Breathing` · **Type** guided intervention plus 2 ratings · **Time** 75 sec · **MOVED TO THE END**

> **That's everything. Before your reading, take a minute for yourself.**

**Step 1, before rating**
> **How much tension are you carrying right now?**
Slider, `None at all` to `A great deal`

**Step 2, the breath**
> **Follow the light as it expands and contracts. Breathe with it.**
60 seconds. Inhale, brief hold, long exhale, guided by an expanding and contracting visual. A visible `Skip` control from second 10 onward.

**Step 3, after rating**
> **And now?**
Same slider.

**Produces** `breath.tension_before`, `breath.tension_after`, `breath.settle_change`

**Honest framing, if this is ever surfaced in the report:**
> This is about how your body settled with the breath. A small experiment, not a medical reading.

> **Why this moved here.** In the current build the breathing minute sits at screen 21 of 52, buried in the middle. Moved to the end it does three things at once: it is a genuine intervention rather than another question, it turns the last thing LEWIS asks of a person into the first thing LEWIS gives them, and it is the moment the experience will be remembered by. Feeling more anxious on stopping is noted gently as a possible sign of difficulty switching off, and routes toward down-regulation.

---

## Screen 36. The generating moment
**Route** `10Generating` · **Type** transition · **Time** 15 sec · **COPY RESTORED**

Full screen sequence with soft ascending tones, one line at a time:

> Reading your reflections...
> Mapping your nine areas of wellbeing...
> Reading how you described your inner state...
> Noticing your stress and recovery pattern...
> Cross-checking what you said with what you showed...
> Seeing how your areas connect...
> Building your reading...

**Produces** `state.report_ready`

> **Blocking issue in the live build.** The shipped sequence currently reads "Normalizing perceived stress load & baseline resilience indices...", "Running neural cascade matrix & priority tension mapping...", "Synthesizing personalized growth & micro-resolution pathways...", "Preparing your complete 25-Page Lewis Insight Mirror...".
>
> "Neural cascade matrix" is a direct claim about neural processes, appearing on the screen immediately before the paid report, in a product whose own FAQ states it "makes no claim about hormones, brain states or heart rhythms". "Baseline resilience indices" implies norm tables that do not exist. Replace all four with the lines above, which are the charter's own.

---

# Part 2. Time budget

| Act | Screens | Modelled time |
|---|---|---|
| Gate and welcome | 2 | 0.4 min |
| Act 1, Arrival | 4 | 1.4 min |
| Act 2, How life feels | 6 | 2.1 min |
| Act 3, The measured core | 8 | 4.5 min |
| Act 4, The shape of your life | 5 | 2.2 min |
| Act 5, What's in the way | up to 3 | 1.3 min |
| Act 6, How to help you | 8 | 2.7 min |
| Generating | 1 | 0.25 min |
| **Total** | **37** | **12.4 min** |

**Scored items: 39.** Down from 60 in the live build.

Range across users, allowing for reading speed and deep dive count: **11.5 to 13.5 minutes**.

**These are modelled estimates, not measured.** Instrument the build to record per-screen dwell time and drop-off from day one of the pilot, and replace every stated time in the product with the observed median before launch.

---

# Part 3. Full cut list against the live build

| Route removed | Reason |
|---|---|
| `2Attention` | Go/No-Go butterfly task. Introduces pass and fail into a wellbeing reflection, plus a capability testing frame ("calibrates your cognitive presence"). Roughly 60 sec |
| `4Maze` | Unvalidated, low weight, roughly 75 sec |
| `9Sensory` | Soundscape preference. You confirmed Stage 9 as cut. It is still live. Roughly 45 sec |
| `6Sharing` | Five rounds, one low weight flag. The Recognition round assumes employment, which excludes five of your eleven roles. Roughly 50 sec |
| `5_2Diener` | Construct mismatch and structural duplication of three other instruments. Roughly 55 sec |
| `5_2Swls` | Optional cross check, not a dimension. Roughly 40 sec |
| `1_7Priority` | Merged into screen 21. Roughly 30 sec saved |
| `1_13BodyRhythm`, `3_3DayRhythm` | Merged into screen 31. Roughly 90 sec saved |
| `1_14SensoryPause` | Becomes an act transition, not a route |
| `1_10Environment` | Nature access folds into screen 18, environment quality moves into the EC deep dive |
| `7_1External` | Ambient versus personal load. Interesting, not decision-changing. Roughly 12 sec |
| `7_3Aspiration` | Aspiration slider. The gap it measures is available from the sort and the priorities. Roughly 15 sec |
| `7_6Values` | Values multi-select. One connection item retained on screen 16. Roughly 25 sec |
| `7_7FinancialAsp` | Moves to after the reveal, where a free text field is a gift rather than a tax |
| `7_8Friction` | Folded into the deep dive screens where it belongs |
| GSE items 7 to 10 | GSE-6 short form. Roughly 25 sec |
| Cumulative load items 6 to 10 | Roughly 30 sec |
| Financial pulse items 3 and 4 | Duplicated the CFPB items arriving 20 seconds later |

---

# Part 4. Open items before build

**Blocking**
1. Meaning module: verbatim PROMIS swap, or drop the PROMIS name. Pick one.
2. GSE-6: obtain the exact six items from Romppel et al. (2013). Do not select them yourself.
3. WHO-5: confirm commercial licence terms with WHO in writing.
4. GSE: written commercial permission from the authors.
5. Reconcile the three stated times (12 / 12 to 15), three page counts (16 / 20 / 25) and two prices (₹399 / ₹749) currently live simultaneously. A person who reads ₹399 and hits ₹749 after twelve minutes of honest self-disclosure will not experience that as a pricing inconsistency.
6. Remove the seven claim-breaking strings identified on screens 10, 11 and 36, and in the report preview.
7. Disclose the Lifed catalogue relationship if recommendations map to commercial Lifed products. Suggested line: "Some of what LEWIS suggests comes from Lifed's own programmes. We tell you which, every time."

**Non-blocking, needs a decision**
8. Email screen placement: A/B test screen 24 against the current mid-flow position.
9. Welcome expectation line: A/B test the stated time against a vaguer framing, with **completion rate** as the primary metric, not start rate.
10. Whether the four cut interactive tasks go into a research build to test whether they add any variance the self report does not already carry.

---

# Part 5. What is not in this document

The scoring architecture, the nine dimension formulas, confidence weighting by dimension, the cascade and root driver logic, and the report generation rules. Those follow once this flow is signed off, because several of them change depending on the decisions in Part 4.
