# insight_report.py — the deterministic 25-page LEWIS Insight Report.
#
# Implements Part B and Part C of the Insight Report Generation Rulebook
# v4.0. Input: the enriched object (enrich.build_enriched_object).
# Output: a structured JSON document of 25 pages of typed blocks, grouped
# into six parts behind a cover and a contents page, that the frontend
# renders in the approved redesign and prints to PDF.
#
# Contract highlights enforced here by construction:
#   - Four band words only; no numeric score, percentile or internal label
#     ever reaches a page (rulebook §6, §8.4).
#   - No em-dashes or en-dashes anywhere in the document (§8.2).
#   - Strengths are named before stretched areas when the shape is uneven.
#   - Connections describe company, never cause (§9 p9, p10).
#   - The free anchor (pages 17 and 18) precedes the programs page (21),
#     which then leads confidently toward the best-fit programs unless
#     commerce is capped or safety has fired (§13).
#   - Research appears only on pages 24 and 25, bound to §18.
#   - Safety tiers make the report gentler and shorter, never more
#     analytical (§16).
#
# The report_gate module re-checks all of this mechanically before the
# API returns the document (§17 self-check gate, §24 design gate).

from enrich import AREA_CODE_TO_NAME, BAND_STEP

FOOTER = "Private to you · a non-clinical wellbeing reflection"
NON_CLINICAL_LINE = (
    "Lewis is a private, non-clinical reflection. It reads how life feels across "
    "nine areas and suggests what may fit. It does not diagnose, grade, or replace "
    "professional care."
)

BAND_GLOSS = {
    "Running on empty": "This area needs the gentlest care right now. Reserve is thin, and effort here costs more than it should.",
    "Under pressure": "Stretched, and asking for attention. Still functioning, but with less give than it used to have.",
    "Steady": "Holding reliably, without strain. Not remarkable, and not asking anything of you this month.",
    "Strong": "A real strength, and a place to stand. Something to spend deliberately, not simply admire.",
}

BAND_ORDER = ("Running on empty", "Under pressure", "Steady", "Strong")

LOW_BANDS = ("Under pressure", "Running on empty")

# Spec-code order, as the areas are defined in enrich.AREA_DEFS.
AREA_ORDER = ("MD", "RS", "EC", "IG", "AC", "FW", "EM", "PH", "EN")

# One line icon per area (Part C §22). The frontend maps these keys onto
# the single thin line icon family; it never substitutes an illustration.
AREA_ICONS = {
    "MD": "compass", "RS": "users", "EC": "home", "IG": "sparkles",
    "AC": "target", "FW": "wallet", "EM": "waves", "PH": "heart", "EN": "zap",
}

# The short form of each area name, used in page titles inside part four.
AREA_SHORT = {
    "MD": "meaning", "RS": "relationships", "EC": "surroundings",
    "IG": "growth", "AC": "agency", "FW": "money", "EM": "calm",
    "PH": "body", "EN": "energy",
}

# The six parts (§7). Front matter (pages 1 and 2) sits outside them.
PART_ONE = "Part one · Orientation"
PART_TWO = "Part two · Your picture"
PART_THREE = "Part three · How it connects"
PART_FOUR = "Part four · A closer look"
PART_FIVE = "Part five · Your plan"
PART_SIX = "Part six · After this"

PART_ICONS = {
    PART_ONE: "sparkles", PART_TWO: "grid", PART_THREE: "refresh",
    PART_FOUR: "eye", PART_FIVE: "target", PART_SIX: "calendar",
}

# The crux of the reader's pattern, said once, as the page 6 pull-quote.
# One line per handoff lead, so two readers with different patterns never
# receive the same sentence (§19.5).
PULL_QUOTES = {
    "down-regulation": "Your working day does not end. It quietens, and then follows you into the evening.",
    "gentle activation": "Energy is not missing from your days. It arrives at the hours you have already spent.",
    "simplification": "Your mind is not disorganised. It is holding too many open loops to put any of them down.",
    "gentleness": "This is not a season that needs pushing. It is a season that needs carrying, a little.",
    "steadiness": "Nothing here is broken. The work in front of you is protecting what already holds.",
}

STANCE = {
    "clear_low": "Spoken plainly, because your answers were consistent",
    "supported": "Offered as a reading to test against your experience",
    "steady": "Holding, and worth protecting",
    "strong": "A genuine strength",
    "absent": "Left unread, because nothing is ever guessed",
}

RECOVERY_LINES = {
    "recovered": "Rest has been restoring you.",
    "somewhat": "Rest is happening. Restoration is arriving only in part.",
    "still_tired": "Rest is happening, but it has not been fully restoring you.",
    "anxious_at_rest": "Stopping has been feeling more anxious than restful.",
}

BODY_ZONE_WORDS = {
    "head": "jaw and head",
    "neck": "neck and shoulders",
    "chest": "chest",
    "back": "upper back",
    "gut": "mid body",
    "limbs": "arms and legs",
}

PORTRAIT_REFINE = {
    "steady_ground": "The full picture agrees, and steadies it. Most of your life is holding, and the areas that ask for care are asking quietly rather than urgently.",
    "resourced_stretched": "The full picture agrees, and refines it. You are not falling apart. You are carrying a meaningful, well connected life on top of reserves that have been given too little room to refill.",
    "low_tank": "The full picture agrees, and locates it. Much of your life is standing on steadier ground than it may feel from the inside. What is asking for care sits underneath: your body, and the energy that runs on it.",
    "carrying_a_lot": "The full picture agrees, and takes it seriously. You have been carrying a lot, and it shows in your answers. This report stays deliberately gentle because of that.",
    "connected_at_distance": "The full picture agrees, and adds one tender note. A lot is working, and yet connection feels further away than you would like right now. Naming that is not a complaint. It is information.",
    "crossroads": "The full picture agrees, and sharpens it. What matters most to you is also where things feel hardest right now, and that meeting point deserves gentleness rather than force.",
    "holding_together": "The full picture agrees, and reads underneath it. From the outside a lot looks fine, and some of it genuinely is. A few of your answers quietly say you have been holding it together more than feeling it.",
    "depleted_field": "The full picture takes it seriously. Right now, things feel stretched across the board, and naming that honestly is a real first step. The smallest possible next move is enough.",
}

PORTRAIT_HEADLINE = {
    "steady_ground": "Steady ground",
    "resourced_stretched": "Resourced and stretched",
    "low_tank": "Running on a low tank",
    "carrying_a_lot": "Carrying a lot right now",
    "connected_at_distance": "Connected, at a distance",
    "crossroads": "At a crossroads",
    "holding_together": "Holding it together",
    "depleted_field": "A depleted season",
}


# ---------------------------------------------------------------------------
# Closer-look content: nine areas, four tiers each.
# Labels follow the approved report: meaning, distinctiveness or support,
# and what to protect, watch for, or test. Three short paragraphs per area.
# ---------------------------------------------------------------------------

AREA_LOOKS = {
    "PH": {
        "empty": [
            ("What this means.", "If this reads as true to you, your body currently holds less reserve than your responsibilities are assuming. Rest has not been reliably producing a sense of restoration, and stopping does not yet feel like arriving anywhere. None of this is a verdict on your discipline. It is the ordinary arithmetic of output arriving on schedule while recovery does not."),
            ("What supports this reading.", "The way you described your days, where tension has been settling, and how your energy moved across the day all point in the same direction as your answers. Together they make this reading believable, even though none of them alone would be enough to say it."),
            ("What to protect.", "Be careful not to turn recovery into another performance project. The useful unit for you is a transition you can repeat even on crowded days, not a perfect routine that collapses the first time the day runs long."),
        ],
        "pressure": [
            ("What this means.", "Your body is holding, but with less margin than it deserves. Rest is happening, and it is only partly doing its job, so reserve is being spent slightly faster than it is being refilled."),
            ("What is distinctive.", "This is the stage where small changes still land quickly. The pattern has not hardened. A modest, repeatable act of recovery tends to be felt within days rather than weeks."),
            ("What to watch for.", "Notice the weeks when rest keeps getting traded away for one more useful thing. That trade always looks reasonable in the moment, and it is the main way this area drifts lower."),
        ],
        "steady": [
            ("What is working.", "Rest has been broadly doing its job. Your body has enough reserve behind its responsibilities that ordinary demands are not eating into you."),
            ("How to keep it.", "Protect the routines that are quietly producing this steadiness, especially around sleep and movement. Steady is not a finish line. It is a practice that is currently working."),
            ("What to watch for.", "Busy seasons tend to borrow from the body first. If stopping starts to feel less restorative than it does now, treat that as an early signal rather than a personal failing."),
        ],
        "strong": [
            ("What is working.", "Your body is genuinely resourced right now. Rest restores you, and there is reserve available when the day asks for more."),
            ("How to spend it.", "Physical reserve is a resource the rest of your life can draw on. It is what makes harder conversations, bigger projects, and generous patience affordable."),
            ("What to protect.", "Strength here is easy to take for granted. Keep the habits that built it visible, so a demanding stretch does not quietly dismantle them."),
        ],
    },
    "EM": {
        "empty": [
            ("What this means.", "Your emotional world has been asking for real care. More of life has felt beyond your capacity to respond than feels fair, and the mind has had little room to settle once the day is done."),
            ("What is distinctive.", "Feeling this way is a state, not a character trait. It says a great deal about the load you have been under and very little about who you are."),
            ("What to protect.", "Lower the bar deliberately. In a season like this the kindest structure is a smaller one, and support from people you trust counts as a practice, not a luxury."),
        ],
        "pressure": [
            ("What this means.", "Your emotional world is not collapsing. It is carrying more activation than ease. Thoughts tend to stay in motion after the practical demands of the day have ended, so your mind keeps working a shift that your calendar says is already over."),
            ("What is distinctive about your pattern.", "It reads more wired than flat. You can still connect, care, and find meaning in your days. The difficulty is releasing momentum rather than generating it. That distinction matters, because it means gentleness will serve you better than force."),
            ("What to watch for.", "Notice whether your evenings quietly become a second working day. Planning, scrolling, and solving all feel productive, but when the real need is a softer landing they extend the day rather than closing it."),
        ],
        "steady": [
            ("What is working.", "Most of life has felt manageable. Demands arrive, and your capacity to respond has been broadly keeping pace with them."),
            ("How to keep it.", "Keep the pressure valves that already work for you, whatever they are. Calm that is maintained is far cheaper than calm that has to be rebuilt."),
            ("What to watch for.", "Watch the tail end of the day. The first sign of this area tipping is usually an evening mind that will not quite put the day down."),
        ],
        "strong": [
            ("What is working.", "Life has felt genuinely manageable, and your mind has been settling well once the day is done. That is a real form of wealth."),
            ("How to spend it.", "Emotional steadiness makes you a safe harbour, for yourself and for the people around you. It is a strength worth using deliberately rather than just enjoying."),
            ("What to protect.", "Calm rests on the conditions that produce it. When routines change, rebuild the settling habits early rather than assuming the calm will carry itself."),
        ],
    },
    "EN": {
        "empty": [
            ("What this means.", "Energy exists for you, but access to it is unreliable. The issue is less about total absence and more about timing. There is a dip exactly when sustained focus is required, and any later lift does not restore you. That mismatch is why advice about willpower tends to miss the point."),
            ("How it connects to the rest.", "In this reflection, your usable energy sits close to your physical recovery. Pushing output directly may buy short bursts while deepening the very pattern that thinned the reserve in the first place."),
            ("A better way to measure progress.", "Watch whether beginning becomes easier after a week of reliable transitions. The goal is not to feel energetic all day. It is to recover a little more choice about when your energy is available to you."),
        ],
        "pressure": [
            ("What this means.", "Energy has been present but stretched. Starting takes more than it should, and the day spends you a little faster than it refills you."),
            ("What is distinctive.", "The pattern reads like timing more than absence. Energy shows up, just not always at the moments you actually need it, which is a far more workable problem."),
            ("What to test.", "Try placing your most demanding task where your energy naturally rises, and watch whether beginning gets easier. Working with your rhythm is cheaper than overriding it."),
        ],
        "steady": [
            ("What is working.", "Energy has been broadly available when you need it. Beginning things does not cost you more than it should, and the day's demands are being met without constant borrowing."),
            ("How to keep it.", "Notice what reliably refills you, and defend a little of it each week. Steady energy is usually the product of small, boring, protected routines."),
            ("What to watch for.", "The first sign of drift here is usually the gap between intending and starting. If that gap widens, look at recovery before looking at motivation."),
        ],
        "strong": [
            ("What is working.", "Energy is genuinely available to you, at the times you need it. That availability is doing quiet work across every other area of your life."),
            ("How to spend it.", "Strong energy is a chance to invest rather than just cope. It is the season for the meaningful project, the deeper connection, the thing you have been deferring."),
            ("What to protect.", "Keep respecting the recovery that funds this. Energy feels infinite until the week it is not, and the habits behind it deserve to survive your busiest month."),
        ],
    },
    "RS": {
        "empty": [
            ("What this means.", "Connection has felt further away than you would like. Trusted company, the kind where openness feels possible, has been thin on the ground lately, and that thinness is felt."),
            ("What is worth knowing.", "Loneliness is information, not a verdict on your likeability. It usually says more about logistics, seasons, and circumstance than about you."),
            ("What to test.", "One honest reach toward one person is worth more than a resolution about people in general. Small, real contact is how this area moves."),
        ],
        "pressure": [
            ("What this means.", "You have people, and the connection is under strain or slightly out of reach. It has been more dutiful than nourishing lately, or harder to access than you would like."),
            ("What is distinctive.", "The structure of connection is present, which matters. What is asking for care is the quality of contact, not the existence of it."),
            ("What to test.", "Choose depth over frequency once this week. One unhurried conversation tends to do more here than many maintenance messages."),
        ],
        "steady": [
            ("What is working.", "You have people you can be open with, and connection has been broadly holding. It may not be effortless, but it is real."),
            ("How to keep it.", "Keep making the small deposits, the check-ins and the honest answers to how are you. Steady connection is maintained in minutes, not grand gestures."),
            ("What to watch for.", "Watch for busy seasons quietly turning connection into logistics. Warmth needs a little unstructured time to survive."),
        ],
        "strong": [
            ("What is working.", "You have trusted people with whom openness feels possible, and the way you described sharing agreed with that picture. Connection here reads as emotionally real rather than merely social on paper, which is a meaningful difference."),
            ("How to use this strength.", "Ask your connections to protect what you are working on, not only to provide comfort afterwards. A simple boundary witnessed by someone close turns support into practical shelter."),
            ("What not to assume.", "Strong relationships do not mean unlimited availability, yours or theirs. Protecting one evening from obligation can honour your connections better than staying reachable while exhausted."),
        ],
    },
    "MD": {
        "empty": [
            ("What this means.", "Your days have been feeling disconnected from anything larger. Effort has been arriving without much sense of why, and that absence is genuinely tiring in its own right."),
            ("What is worth knowing.", "Meaning that has gone quiet is usually crowded out rather than lost. Depleted seasons mute it first, and it tends to return as the load lifts."),
            ("What to test.", "Look for the smallest thing that still feels worth doing, and do slightly more of it. Meaning rebuilds from specifics, not from searching for a grand answer."),
        ],
        "pressure": [
            ("What this means.", "The thread between your days and what matters to you has been fraying. The work continues, but the sense of why has been harder to reach."),
            ("What is distinctive.", "Questioning meaning is often a sign of growth pressing against an old container, not of something being wrong with you."),
            ("What to test.", "Name one person who benefits from what you do, concretely. Purpose usually reattaches through people before it reattaches through ideas."),
        ],
        "steady": [
            ("What is working.", "Your days still connect to something that matters. The sense of purpose is not loud, but it is present and load bearing."),
            ("How to keep it.", "Revisit what the effort is for at a natural rhythm, not only in crisis. Meaning stays healthy when it is checked while things are fine."),
            ("What to watch for.", "Watch for drift between what you value and where the hours actually go. Small course corrections here are cheap; large ones are not."),
        ],
        "strong": [
            ("What is working.", "Your work and your care for the people around you still connect to a reason larger than the task list. That coherence is why difficult days feel like part of something for you, rather than merely repetitive."),
            ("The hidden cost.", "Meaning can make overextension feel noble. When purpose is strong, the body is often asked to subsidise commitments for longer than it can comfortably sustain. That is worth naming plainly, because it is the part most likely to go unnoticed."),
            ("How to use this strength.", "Let your sense of meaning justify recovery as part of your contribution, rather than as time stolen from it. The question is not whether rest is deserved. It is which form of recovery protects the life you actually value."),
        ],
    },
    "AC": {
        "empty": [
            ("What this means.", "The distance between intending and doing has felt wide. Actions have not been feeling like they change much, and that feeling drains motivation faster than any workload."),
            ("What is worth knowing.", "A depleted sense of agency is usually downstream of depleted reserves, not evidence of weak will. It deserves smaller experiments, not bigger resolutions."),
            ("What to test.", "Choose one task you fully control and finish it completely. Agency rebuilds through completed loops, however small."),
        ],
        "pressure": [
            ("What this means.", "Your sense that actions matter is being tested. Things get done, but the doing costs more than it should, and follow through has felt less reliable than you would like."),
            ("What is distinctive.", "The strain shows most in transitions and restarts rather than in the work itself. That is a timing problem more than a competence problem, which is genuinely good news, because timing is far easier to change."),
            ("What to test.", "Put one visible cue at the moment your day usually loses its shape, and watch whether follow through eases. Structure at the seams beats effort in the middle."),
        ],
        "steady": [
            ("What is working.", "You retain a workable sense that your actions matter. Tasks get completed, decisions still get made, and the distance between intending and doing is present but not overwhelming."),
            ("Where the strain shows.", "Transitions cost more than the work itself. Ending, switching roles, and restarting after fatigue read as harder than knowing what to do."),
            ("What to test.", "Put a visible end of day cue in place before reaching for any productivity technique. If your sense of agency eases as your recovery eases, this report's reading gains support."),
        ],
        "strong": [
            ("What is working.", "Your actions have been landing. Intention travels to done with unusually little friction, and that reliability is a genuine asset."),
            ("How to spend it.", "Strong agency can carry more than task lists. It is the muscle that protects boundaries, starts hard conversations, and changes systems rather than just surviving them."),
            ("What to protect.", "Capability attracts load. The stronger this area, the more deliberately you need to choose what deserves it, or the strength becomes the reason for depletion elsewhere."),
        ],
    },
    "FW": {
        "empty": [
            ("What this means.", "Money has been a real strain, and its weight has been reaching into the rest of life. That weight is about how money feels to live with, which is real regardless of the numbers behind it."),
            ("What is worth knowing.", "Financial strain narrows attention all by itself. If other areas feel harder than they should, this weight is part of why, and that is the pattern speaking, not a personal failing."),
            ("What to protect.", "Everything suggested in this report is free. Care should never cost money you do not comfortably have, and the one useful money step is usually clarity over calculation: one small look, with kindness, at one piece of the picture."),
        ],
        "pressure": [
            ("What this means.", "Money is present as a source of pressure. It is being managed, and the managing is taking real attention and some peace."),
            ("What is worth knowing.", "The free practices in this report come first, always. Nothing suggested here asks you to spend as a condition of feeling better."),
            ("What to protect.", "Guard against money worry doing its background hum during rest. A single contained moment for money attention each week tends to quiet the hum more than constant vigilance does."),
        ],
        "steady": [
            ("What this means.", "Money is present in your life as a practical consideration rather than the central emotional weight of this season. There is enough perceived control that you could consider paid support if it genuinely helped, without cost becoming its own strain."),
            ("How to think about spending here.", "The free practices in this report come first, always. A paid program is only worth your money if it removes a friction the free path cannot: skilled facilitation, a protected setting, or accountable repetition with other people."),
            ("What to protect.", "Do not buy intensity. Buy fit. A clear format, gentle pacing, transparent cancellation, and a host who can explain exactly what happens without promising you an outcome."),
        ],
        "strong": [
            ("What is working.", "Money has been feeling steady to live with. Control is present, worry is low, and finances are funding life rather than dominating it."),
            ("How to use this strength.", "Financial ease buys options: the unhurried decision, the genuinely restful break, the help that fits. Spend some of it on recovery without guilt."),
            ("What to protect.", "Keep the habits that produced this ease boring and regular. Financial peace is quiet, and quiet things are easiest to stop tending."),
        ],
    },
    "IG": {
        "empty": [
            ("What this means.", "There has been no real space for curiosity lately. Learning and exploring have been crowded out, and their absence tends to make weeks feel flat and identical."),
            ("What is worth knowing.", "If your curiosity returns quickly once your load lightens, it was crowded rather than lost. That prevents you from mislabelling depletion as disinterest, which is a common and discouraging mistake."),
            ("What to protect.", "Do not assign yourself a curriculum. One four minute piece on something that genuinely interests you is the right dose for this season."),
        ],
        "pressure": [
            ("What this means.", "Your appetite for learning is present but squeezed. Interest arrives, and the space to follow it mostly does not."),
            ("How to support it.", "Choose short reading and listening that answer the question you are actually living right now. A four minute piece will fit your month far better than a course you will feel guilty about abandoning."),
            ("What to watch for.", "Watch whether curiosity gets deferred to an imagined quieter month. That month rarely arrives on its own; small doses now beat big plans later."),
        ],
        "steady": [
            ("What is working.", "Your curiosity has not disappeared. It simply has less open space than it deserves. You still respond to useful ideas, and sustained exploration is competing with the practical load of your week."),
            ("How to support it.", "Keep the inputs small and honest: one idea at a time, followed because it interests you rather than because it should. Curiosity fed lightly stays alive."),
            ("What to watch for.", "If exploring starts to feel like another obligation, shrink it rather than dropping it. The habit of following interest matters more than the volume."),
        ],
        "strong": [
            ("What is working.", "Learning and growth are alive for you right now. New ideas are getting through, and you have been finding space to follow them."),
            ("How to spend it.", "Curiosity this available is worth aiming at something. Let one thread of interest deepen rather than staying wide, and it will start paying the rest of your life back."),
            ("What to protect.", "Protect the open space that makes this possible. Exploration is usually the first thing a crowded season deletes, and the deletion is rarely announced."),
        ],
    },
    "EC": {
        "empty": [
            ("What this means.", "Your surroundings have been draining more than restoring. Feeling out of place, in your space or your context, is a quiet and constant tax."),
            ("What is worth knowing.", "Belonging is a need, not a preference. When surroundings do not ground you, everything else costs slightly more, and that cost is usually invisible until it is named."),
            ("What to test.", "Claim one small corner and make it yours: one chair, one shelf, one view. A single reliable anchor point changes how a whole space feels."),
        ],
        "pressure": [
            ("What this means.", "Your surroundings are doing some grounding work, and not enough. Parts of your environment restore you, while others quietly wear at you."),
            ("What is distinctive.", "The mixture matters. Knowing which rooms, places, or contexts drain you is directly useful, because environments can be edited in a way moods cannot."),
            ("What to test.", "Move one regular activity into the setting where you feel most yourself, and notice the difference. Let the environment do some of the work."),
        ],
        "steady": [
            ("What is working.", "Your surroundings are broadly on your side. There is a workable sense of place, and your environment has been more neutral than costly."),
            ("How to keep it.", "Tend the corners that restore you and visit them on purpose. Steady belonging deepens through small rituals of place."),
            ("What to watch for.", "Watch for your restorative places quietly becoming working places. A space that never changes mode stops offering a change of state."),
        ],
        "strong": [
            ("What is working.", "Home and a familiar context give you genuine grounding. Your surroundings are not uniformly restorative, and the ground they give you is real and worth counting."),
            ("How to use this strength.", "Place your first habit exactly at the boundary between your more demanding environment and your restorative one. The setting itself then becomes part of the cue, and you have to remember less."),
            ("What this means for programs.", "Nearby, small group, culturally comfortable formats will suit you better than anonymous, high intensity experiences. Belonging should reduce the effort a program asks of you, never become another thing to adapt to."),
        ],
    },
}

ABSENT_LOOK = [
    ("What this means.", "You chose not to answer the questions behind this area, or not enough of them, so it is left unread. Nothing here is guessed or filled in on your behalf."),
    ("What it does not mean.", "An unread area is not a low area. It is simply a part of the picture this reflection cannot honestly speak about today."),
    ("If you want it read.", "A future reflection that includes these questions will read this area alongside the rest. Until then, it stays honestly blank."),
]


def _tier(band):
    return {
        "Running on empty": "empty",
        "Under pressure": "pressure",
        "Steady": "steady",
        "Strong": "strong",
    }.get(band)


def _stance_for(area):
    if area["band"] is None:
        return STANCE["absent"]
    if area["read_type"] == "supported":
        return STANCE["supported"]
    if area["band"] in LOW_BANDS:
        return STANCE["clear_low"]
    return STANCE["strong"] if area["band"] == "Strong" else STANCE["steady"]


# ---------------------------------------------------------------------------
# Anchor practices (page 11). One free practice, chosen by the handoff.
# Every anchor carries the full required block set (§12).
# ---------------------------------------------------------------------------

ANCHORS = {
    "close_laptop_pause": {
        "title": "The close laptop pause",
        "tag": "YOUR ANCHOR · FREE · ALWAYS FIRST",
        "when": "The moment your working day ends and you close the laptop or set the work down. This is the exact seam where your work world ends and your home world begins.",
        "what": "Both feet supported on the floor. Two comfortable breaths. Nothing else, and then you carry on with your evening.",
        "why_small": "It matches your time pressure, sits precisely where your day has trouble ending, and cannot be defeated by a day that ran long.",
        "first_move": "After closing the laptop, pause with both feet supported and take two comfortable breaths, before anything else.",
        "setup": "Place one small object beside your laptop or workspace before you start tomorrow. A cup, a stone, a folded card. Its only job is to catch your eye at closing time. You are not relying on memory or motivation, which are both in short supply at the end of a demanding day. The object matters more than the intention. Intentions are quiet at six in the evening. Objects are not.",
        "feel": "Almost disappointingly small. Two breaths take about ten seconds. You should finish thinking that surely something more is required. That feeling is the design working. A practice you can complete on your most crowded evening is the only kind that will still be there in three weeks.",
        "permissions": "Keep your eyes open if that feels better. Do not force the breath or aim for a particular sensation. If breathing attention feels uncomfortable, skip the breath entirely and simply sit with both feet supported for a moment. That still counts. This is a transition, not a meditation practice. Nothing about it needs to be done correctly.",
        "forget": "Do it late. Do it in the kitchen. Do it after dinner when you remember. A pause that happens at the wrong time is worth far more than one that did not happen because the right moment passed. Missing a day changes nothing. Missing a day and deciding you have failed changes everything, so decline that second part.",
        "seven_days": [
            ("1", "Make it visible", "Place your cue object beside your workspace. Do the two breath pause once."),
            ("2", "Repeat", "Same cue, same tiny action. Deliberately add nothing."),
            ("3", "Understand it", "Read the short piece on transitions, after the pause rather than instead of it."),
            ("4", "Choose one support", "Try one of the optional supports from the next pages. One, not two."),
            ("5", "Protect the boundary", "Tell one trusted person the closing time you are testing this week."),
            ("6", "Use what worked", "Repeat whichever version felt lightest. Ease is the signal, not laziness."),
            ("7", "Notice", "Ask one question: after the pause, did stopping feel easier, the same, or harder?"),
        ],
        "why_this": ("WHY AN ENDING, RATHER THAN A BEDTIME ROUTINE",
                     "You might reasonably expect a plan about recovery to focus on sleep. Yours does not, and the reason is specific to your pattern. The difficulty is not the late hour itself. It is that your working day never formally ends, so the whole evening carries it. Give the day a real ending and the evening changes shape on its own. Start at bedtime and you are trying to close a day that has already been carried for hours."),
        "movements": [
            ("The laptop closes", "Your cue object catches your eye"),
            ("Both feet supported", "Sitting or standing, either is fine"),
            ("Two comfortable breaths", "Then carry on with your evening"),
        ],
        "movements_title": "Ten seconds, in three movements",
        "good_week": "Three honest evenings, not seven forced ones. The pattern is what you are building, and a pattern survives gaps.",
        "too_much": "Adding a second practice before day four, or turning the pause into a longer routine because it felt good once.",
        "practice_keys": ["cue_anchored", "breathing", "boundaries"],
    },
    "one_small_start": {
        "title": "The one small start",
        "tag": "YOUR ANCHOR · FREE · ALWAYS FIRST",
        "when": "Right after your first drink of the morning, tea, coffee, or water, while you are still holding the cup.",
        "what": "Name one thing you will do today that is fully yours to finish, and make it small enough to complete before noon. Say it once, out loud or silently.",
        "why_small": "It asks nothing of your energy reserves, borrows a cue that already happens every morning, and gives the day one guaranteed completed loop.",
        "first_move": "Tomorrow morning, while holding your first drink, name one small thing that is fully yours to finish today.",
        "setup": "Tonight, put a sticky note or a small card next to where your first drink happens. It needs no words on it. Its only job is to remind you that the morning has a first move now. You are anchoring to an object and a routine that already exist, rather than to memory or motivation.",
        "feel": "Trivially easy, and slightly pointless for the first few days. That is the design working. The point is not the task named. It is rebuilding the experience of choosing something and having it happen, which is the foundation everything larger stands on.",
        "permissions": "The thing you name can be tiny. Sending one message counts. If a day is genuinely too much, name the smallest possible version or skip the naming entirely. There is no correct task and no minimum size.",
        "forget": "If you remember at lunch, name an afternoon thing. A late start is worth far more than a missed one. Missing a day changes nothing about the pattern you are building. Deciding it proves something about you is the only real setback on offer, so decline it.",
        "seven_days": [
            ("1", "Set the cue", "Place the card by your morning drink spot. Name one small thing."),
            ("2", "Repeat", "Same cue, same single naming. Nothing added."),
            ("3", "Notice the loop", "At day's end, notice whether the named thing happened. No judgement, just noticing."),
            ("4", "Choose one support", "Try one optional support from the next pages, if it appeals."),
            ("5", "Tell someone", "Mention the experiment to one trusted person."),
            ("6", "Use what worked", "Keep whichever version felt lightest."),
            ("7", "Notice", "Ask one question: is beginning things slightly easier, the same, or harder?"),
        ],
        "why_this": ("WHY A MORNING START, RATHER THAN A BIGGER PLAN",
                     "You might expect a season of low energy to call for an energy plan: exercise, routines, targets. Yours starts smaller, and deliberately. When reserves are thin, every added demand competes with recovery. One tiny completed loop each day rebuilds traction without spending reserve you do not have. The bigger plan becomes available precisely because you did not start with it."),
        "movements": [
            ("The first drink is in your hand", "The cue already happens every morning"),
            ("Name one small thing", "Fully yours, finished before noon"),
            ("Say it once", "Out loud or silently, then get on with the day"),
        ],
        "movements_title": "Ten seconds, in three movements",
        "good_week": "Four named mornings, not seven completed lists. What you are rebuilding is the experience of choosing something and having it happen.",
        "too_much": "Naming three things instead of one, or quietly turning the small thing into the hardest thing on your list.",
        "practice_keys": ["cue_anchored", "progress_noticing", "small_valued_activity"],
    },
    "single_list_moment": {
        "title": "The single list moment",
        "tag": "YOUR ANCHOR · FREE · ALWAYS FIRST",
        "when": "The last five minutes before you stop work, or before the evening's main task begins.",
        "what": "Write tomorrow's open tasks on one small piece of paper, then put it where tomorrow will find it. Close the notebook or the app afterwards.",
        "why_small": "It takes minutes, uses paper you already have, and moves the mental juggling out of your head and onto a page that will hold it overnight.",
        "first_move": "Before stopping today, write tomorrow's open tasks on one small piece of paper and leave it where tomorrow will find it.",
        "setup": "Put a pen and a small pad in the exact place your working day usually ends. Not a beautiful notebook, a working pad. Its only job is to be there when the day closes, so the practice never depends on finding materials.",
        "feel": "Mildly relieving, and slightly mundane. The relief is the point: an open loop written down is a loop your mind no longer needs to rehearse. If it feels almost too simple to matter, it has been sized correctly.",
        "permissions": "The list does not need to be complete, ordered, or realistic. Three lines are plenty. If a day ends in chaos, one word on the page still counts. There is no correct format.",
        "forget": "Write it whenever you remember, even from bed. A late list still catches the loops. Missing a night changes nothing, and the list will be there for you the next evening either way.",
        "seven_days": [
            ("1", "Place the pad", "Put pen and pad where your day ends. Write tomorrow's list once."),
            ("2", "Repeat", "Same time, same pad. Keep it under five lines."),
            ("3", "Notice", "Notice whether the evening mind is slightly quieter. Just notice."),
            ("4", "Choose one support", "Try one optional support from the next pages."),
            ("5", "Protect the moment", "Tell one person this is your closing ritual this week."),
            ("6", "Use what worked", "Keep whichever version of the list felt lightest."),
            ("7", "Notice", "Ask one question: is the day easier to put down, the same, or harder?"),
        ],
        "why_this": ("WHY A LIST, RATHER THAN A RELAXATION PRACTICE",
                     "A scattered, foggy season seems to call for calm, and calm helps. But a mind juggling open loops cannot relax on command, because the juggling is doing a job: making sure nothing is dropped. Give the loops a page to live on and the mind can stand down honestly. The relaxation arrives as a consequence rather than a demand."),
        "movements": [
            ("The day is about to close", "The pad is already where you stop"),
            ("Write tomorrow's open loops", "Three lines is plenty"),
            ("Leave it where tomorrow finds it", "Then close the notebook"),
        ],
        "movements_title": "Two minutes, in three movements",
        "good_week": "Four evenings with the loops on paper rather than in your head. An incomplete list still does the whole job.",
        "too_much": "Turning the list into a planning system, or ranking and re-ranking it until it becomes the evening's work.",
        "practice_keys": ["cue_anchored", "task_writing", "boundaries"],
    },
    "grounding_breath": {
        "title": "The three breath ground",
        "tag": "YOUR ANCHOR · FREE · ALWAYS FIRST",
        "when": "Once a day, at any moment you choose. After waking, before a meal, or in bed. The moment matters less than the returning.",
        "what": "Three slow, comfortable breaths, with both feet or your back supported. That is the whole practice.",
        "why_small": "In a heavy season, the kindest plan is the smallest one. This asks for under a minute, no equipment, no performance, and no tracking.",
        "first_move": "At one moment of your choosing today, take three slow comfortable breaths with your feet or back supported.",
        "setup": "Choose the moment tonight, and tie it loosely to something that already happens: the kettle, the pillow, the front door. Loosely is the word. This is an invitation that repeats daily, not an appointment you can fail.",
        "feel": "Small, quiet, and possibly like nothing at all. That is fine. The practice is not trying to produce a feeling. It is a way of returning to yourself once a day, and the returning is the whole point.",
        "permissions": "Any pace of breath is right. Eyes open or closed. If breathing attention feels uncomfortable, simply sit with support for a few seconds instead. Skip any day without explanation. It will be here when you come back.",
        "forget": "There is nothing to catch up on and nothing lost. This practice has no streak and keeps no ledger. Whenever you remember it, that moment is exactly on time.",
        "seven_days": [
            ("1", "Once", "Three comfortable breaths, at any moment you choose."),
            ("2", "Once", "The same. Nothing added, nothing tracked."),
            ("3", "Once", "If it helps, keep the same moment. If not, any moment."),
            ("4", "Once", "Three breaths. Enough is enough."),
            ("5", "Once", "If a trusted person feels safe to tell, tell them. Optional."),
            ("6", "Once", "The same small practice. It is meant to be this small."),
            ("7", "Notice", "One question, gently: were any of the moments kind? That is all."),
        ],
        "why_this": ("WHY THIS IS THE WHOLE PLAN",
                     "In a season that is asking a lot of you, a plan should give rather than take. Anything larger than this would quietly become one more demand on reserves that deserve protecting. One small returning each day is a complete practice, and if a day comes when you want more, more will be there. Nothing needs to happen first."),
        "movements": [
            ("You find a moment", "Any moment. The hour does not matter"),
            ("Feet or back supported", "Let something else hold you for a second"),
            ("Three slow breaths", "Then the practice is finished"),
        ],
        "movements_title": "Under a minute, in three movements",
        "good_week": "Any week in which you returned to yourself once or twice. There is no target here, and nothing to catch up on.",
        "too_much": "Adding anything at all to this. In this season the practice is complete exactly as it stands.",
        "practice_keys": ["breathing", "self_kindness"],
    },
}


def _pick_anchor(enriched):
    tier = enriched["safety"]["tier"]
    if tier != "none":
        return ANCHORS["grounding_breath"]
    lead = enriched["handoff"]["lead_with"]
    if lead == "down-regulation":
        return ANCHORS["close_laptop_pause"]
    if lead == "gentle activation":
        return ANCHORS["one_small_start"]
    if lead == "simplification":
        return ANCHORS["single_list_moment"]
    focus = enriched["handoff"]["primary_focus"]
    if focus in ("PH", "EM", "EN"):
        return ANCHORS["close_laptop_pause"]
    if focus in ("AC", "MD", "IG"):
        return ANCHORS["one_small_start"]
    return ANCHORS["single_list_moment"]


# ---------------------------------------------------------------------------
# Optional supports (page 12). Four items, each with a personalised
# rationale drawn from this reader's own findings (§13.1).
# ---------------------------------------------------------------------------

def _build_supports(enriched):
    ctx = enriched["context"]
    zones = [BODY_ZONE_WORDS[z] for z in ctx["body_zones"] if z in BODY_ZONE_WORDS]
    stress = (enriched["patterns"]["stress"] or {}).get("label", "")
    wired = stress.startswith("Wired")
    ig_band = enriched["areas"]["IG"]["band"]
    ec_strong = enriched["areas"]["EC"]["band"] == "Strong"
    supports = []

    supports.append({
        "id": "read_transitions",
        "tag": "READ · 4 MINUTES · FREE",
        "title": "Why transitions work better than commands",
        "body": "A short piece on why creating a boundary between effort and rest tends to work better than instructing yourself to relax.",
        "why": (
            "Why this, for you. "
            + ("Your curiosity is available but your time is not, so this is deliberately four minutes rather than a course. "
               if ig_band in ("Steady", "Strong") else
               "It is deliberately four minutes, because this season has little spare room and a course would become a burden. ")
            + "Save it for day three, once the anchor itself is established. Understanding a practice after you have felt it tends to make it stick better than reading about it first."
        ),
        "practice_keys": ["boundaries"],
    })

    if wired or ctx.get("sound_preference"):
        supports.append({
            "id": "evening_soundscape",
            "tag": "LISTEN · 8 MINUTES · FREE",
            "title": "A soft layered evening soundscape",
            "body": "Quiet, undemanding audio to sit alongside your anchor rather than replace it. Headphones optional.",
            "why": (
                "Why this, for you. "
                + ("You described a mind that stays in motion after the day ends, " if wired
                   else "Your evenings have been carrying more activation than ease, ")
                + "and for some people a low, undemanding sound gives that motion something to settle against. Use it only if silence keeps your mind busy. If silence already works for you, skip this entirely."
            ),
            "practice_keys": ["calm_listening"],
        })

    if zones:
        supports.append({
            "id": "gaze_reset",
            "tag": "LOOK · 60 SECONDS · OPTIONAL",
            "title": "A soft gaze reset",
            "body": "Let your eyes rest on a broad, still view, such as greenery, sky, or water, rather than a close screen. No flashing or patterned motion.",
            "why": (
                f"Why this, for you. Your tension clustered around your {', '.join(zones[:3])}, "
                "which is the area most affected by long periods of close focus. This is the cheapest possible intervention for that particular pattern, and it works well after a long screen block rather than at a fixed time."
            ),
            "practice_keys": ["green_views"],
        })

    supports.append({
        "id": "two_lines_sketch",
        "tag": "CREATE · 5 MINUTES · OPTIONAL",
        "title": "Draw effort and ease as two lines",
        "body": "No artistic skill required. Sketch how each moved across your day, then circle one moment where the distance between them narrowed.",
        "why": (
            "Why this, for you. Once this week is plenty. "
            + ("Your energy and your pressure climb together late in the day, and seeing that on paper often makes the pattern easier to work with than reading about it. "
               if wired else
               "Your day has a shape worth seeing from the outside, and putting it on paper often makes it easier to work with than thinking about it. ")
            + "Treat it as noticing, not journalling."
        ),
        "practice_keys": ["drawing"],
    })

    if len(supports) < 4:
        supports.append({
            "id": "micro_walk",
            "tag": "MOVE · 10 MINUTES · FREE",
            "title": "A short unhurried walk",
            "body": "Ten minutes, no destination, no pace target. Outside if possible, near anything green if available.",
            "why": (
                "Why this, for you. "
                + ("Your surroundings genuinely restore you, so this support borrows a strength you already have. "
                   if ec_strong else
                   "Gentle movement asks almost nothing of your reserves while giving your day one clean seam. ")
                + "It pairs well with the anchor on days when sitting still feels wrong."
            ),
            "practice_keys": ["gentle_walk", "green_views"],
        })

    return supports[:4]


CHOOSE_ROWS = {
    "read_transitions": ("You want to understand the why", "The four minute read", "Answers the question you are actually living, briefly"),
    "evening_soundscape": ("Your mind stays busy in the quiet", "The evening soundscape", "Gives restless attention something undemanding to rest on"),
    "gaze_reset": ("Your head and shoulders feel tight by evening", "The soft gaze reset", "Directly addresses the area where your tension collected"),
    "two_lines_sketch": ("You want to see your own pattern", "The two lines sketch", "Makes your day's shape visible rather than theoretical"),
    "micro_walk": ("Sitting still feels wrong today", "The short walk", "Moves the same settling into your body instead"),
}


def _adjustment_cards(enriched):
    ctx = enriched["context"]
    stress = (enriched["patterns"]["stress"] or {}).get("label", "")
    cards = []
    if stress.startswith("Wired") or (ctx.get("energy_arc") or {}).get("evening") == "High":
        cards.append(("FOR THE EVENING CLIMB",
                      "If you must work late, decide the stopping time before you begin rather than during. Deciding while tired reliably produces a later answer than deciding while fresh."))
    if (ctx.get("energy_arc") or {}).get("afternoon") == "Low" or True:
        cards.append(("FOR THE DIP IN YOUR DAY",
                      "Place your most demanding task where your energy naturally sits higher. Scheduling around your own rhythm costs nothing and saves real effort."))
    cards.append(("FOR THE ROLE SWITCH",
                  "Change one physical thing when one part of your day ends. Shoes off, a different chair, a window opened. Transitions respond better to physical markers than to intentions."))
    cards.append(("FOR CROWDED WEEKS",
                  "Shrink rather than skip. The smallest version of the practice, on the way to the door if needed. The pattern is what you are protecting, not the duration."))
    return cards[:4]


# ---------------------------------------------------------------------------
# Programs (page 21), with commerce gating (§13.3).
#
# Each program carries a cover photograph from the imagery library (§23),
# a concrete description, fit reasoning drawn from this reader's findings,
# and the tangible takeaway plus the group-level research advantage behind
# it. Operator-fillable details render as dashed placeholder chips.
# ---------------------------------------------------------------------------

PROGRAM_CHIPS = ["[ host name ]", "[ venue ]", "[ dates ]", "[ places ]", "[ all-in price ]"]

PROGRAMS = {
    "evening_winddown": {
        "title": "Evening wind down practice series",
        "image": "program-rejuvenation",
        "what": "Four small group, in person sessions of forty five minutes each, in the early evening. Gentle settling, body release, and a repeatable closing ritual you keep for good. No performance tracking of any kind.",
        "why": "It works on exactly the boundary this report identifies as your starting point, and it teaches the transition rather than asking you to already be calm. The sessions are short, so they respect your time, and the early evening timing means you practise the skill at the very hour you need it.",
        "walkaway": "A closing ritual you own, that keeps working long after the four sessions end. In a controlled trial, a structured recovery course improved people's recovery, their reported sleep and their sense of wellbeing.",
        "research_key": "recovery_course",
    },
    "restorative_day": {
        "title": "Restorative movement and deep rest day",
        "image": "program-onsen",
        "what": "A half day experience with unhurried mobility, guided rest, and quiet breaks. No intensive physical demand, and no overnight commitment.",
        "why": "It is gentle rather than challenging, which is exactly right while stopping is not yet fully restorative for you. It gives your body a longer experience of genuine rest without asking you to perform. Pair it with the series, or take it as your reset.",
        "walkaway": "A full day where rest is the whole point, of the kind that in trials with adults running low increased energy and reduced fatigue.",
        "research_key": "gentle_movement",
    },
    "gentle_movement": {
        "title": "Gentle movement series for low energy seasons",
        "image": "program-panchakarma",
        "what": "Short, low intensity group sessions of unhurried, breath led movement, designed for people whose energy is currently thin. No fitness goals, no measurements, no intensity progression.",
        "why": "Demanding exercise asks your body for reserves it does not currently have. Low intensity movement is the version built for a season like yours: it adds energy rather than spending it, and the group supplies gentle accountability without pressure.",
        "walkaway": "A way of moving that gives energy back rather than spending it. In a randomised trial with adults running low, low intensity activity increased energy and reduced fatigue, outperforming more demanding exercise.",
        "research_key": "low_intensity_movement",
    },
    "connection_circle": {
        "title": "Small guided connection circle",
        "image": "program-scalp-massage",
        "what": "A small, facilitated group that meets a few times to practise unhurried conversation. No sharing requirements, no performance, and a facilitator whose job is to keep it safe and light.",
        "why": "Your reflection points to connection as the place where a little structure would help most. A small guided format lowers the cost of reaching out by making the first move for you: the time is set, the people arrive, and the conversation is held.",
        "walkaway": "A handful of people who already know where you are starting from. Supportive presence alongside others has long been found to lighten the felt weight of a demanding season.",
        "research_key": "small_group",
    },
    "nature_mornings": {
        "title": "Nature immersion morning walks",
        "image": "hero-breath",
        "what": "Guided, unhurried group walks in green surroundings, early in the day. More noticing than exercising, with no pace requirements.",
        "why": "Green surroundings are among the most reliably supportive settings there are, and a scheduled group walk protects the time in a way good intentions rarely do. It suits a pattern that responds to place rather than to effort.",
        "walkaway": "A standing morning that belongs to you. Spending around two hours a week in nature is associated with good self reported health and wellbeing.",
        "research_key": "nature_contact",
    },
}

# The case for guided support (§13.2). Each advantage is backed by a
# group-level finding, expressed in plain language with no citation and no
# promise to this reader. The three shown are chosen from this reader's
# own pattern, so the box differs between reports (§19.5).
PROGRAM_ADVANTAGES = {
    "facilitation": ("Skilled facilitation",
                     "In a controlled trial, people who took a structured recovery course reported better recovery, improved sleep and a stronger sense of wellbeing.",
                     "users"),
    "protected_time": ("A protected room and a set time",
                       "Gentle, breath led movement is linked across review after review to lower perceived stress.",
                       "clock"),
    "company": ("People beside you",
                "Showing up alongside others has long been found to lighten the felt weight of a demanding season.",
                "heart"),
    "movement": ("Movement sized for a low season",
                 "In a randomised trial with adults running low on energy, low intensity activity increased energy and reduced fatigue.",
                 "zap"),
    "setting": ("A setting that does some of the work",
                "Spending around two hours a week in green surroundings is associated with good self reported health and wellbeing.",
                "home"),
}


def _advantage_keys(enriched):
    """Three advantages for the page 21 case, chosen from this reader's
    pattern rather than from a fixed list."""
    lead = enriched["handoff"]["lead_with"]
    focus = enriched["handoff"]["primary_focus"]
    keys = []
    if lead == "down-regulation" or focus in ("PH", "EM"):
        keys.append("facilitation")
    if lead == "gentle activation" or focus == "EN":
        keys.append("movement")
    if enriched["areas"]["EC"]["band"] in ("Steady", "Strong") or focus == "EC":
        keys.append("setting")
    keys.append("protected_time")
    if enriched["areas"]["RS"]["band"] in ("Steady", "Strong") or focus == "RS" \
            or enriched["context"].get("support_preference") == "structured":
        keys.append("company")
    keys.append("facilitation")
    ordered, seen = [], set()
    for key in keys:
        if key not in seen:
            seen.add(key)
            ordered.append(key)
    return ordered[:3]


def _pick_programs(enriched):
    """The best fit, a complementary second, and one off-pattern option
    that may be named in a single positive line (§13.2). A second program
    is a companion recommendation, never a deferral."""
    lead = enriched["handoff"]["lead_with"]
    focus = enriched["handoff"]["primary_focus"]
    recovery = (enriched["patterns"]["recovery_load"] or {}).get("label", "")
    ctx_recovery = enriched["context"].get("recovery")
    thin_recovery = recovery == "Carrying a lot" or ctx_recovery in ("still_tired", "anxious_at_rest")

    if lead == "down-regulation" or focus in ("PH", "EM"):
        primary = "evening_winddown"
    elif lead == "gentle activation" or focus == "EN":
        primary = "gentle_movement"
    elif focus == "RS":
        primary = "connection_circle"
    else:
        primary = "nature_mornings"

    if thin_recovery:
        order = ["restorative_day", "gentle_movement", "nature_mornings", "connection_circle"]
    elif focus == "EN" or enriched["areas"]["EN"]["band"] in LOW_BANDS:
        order = ["gentle_movement", "restorative_day", "nature_mornings", "connection_circle"]
    elif enriched["areas"]["RS"]["band"] in LOW_BANDS:
        order = ["connection_circle", "nature_mornings", "restorative_day", "gentle_movement"]
    else:
        order = ["nature_mornings", "restorative_day", "connection_circle", "gentle_movement"]
    secondary = next((p for p in order if p != primary), None)

    mention = next((p for p in ("nature_mornings", "connection_circle", "gentle_movement")
                    if p not in (primary, secondary)), None)
    return primary, secondary, mention


# ---------------------------------------------------------------------------
# Appendix bindings (§18). A measure may only be cited for its own area.
# ---------------------------------------------------------------------------

MEASURE_ROWS = {
    "MD": ("PROMIS Meaning and Purpose short form (Salsman et al., 2020)",
           "Sense of purpose and direction in daily life"),
    "RS": ("Three item loneliness scale (Hughes et al., 2004), read toward connection",
           "Felt closeness and availability of trusted others"),
    "EC": ("Connection to nature measure (Schultz, 2002) with belonging questions",
           "Sense of place, grounding, and cultural belonging"),
    "IG": ("Flourishing Scale (Diener et al., 2010)",
           "Engagement, learning, and a sense of growth"),
    "AC": ("General Self Efficacy Scale (Schwarzer and Jerusalem, 1995)",
           "Belief that one's actions can achieve intended results"),
    "FW": ("Financial Well Being Scale (Consumer Financial Protection Bureau, 2017)",
           "How money feels to live with, beyond income alone"),
    "EM": ("Wellbeing mood questions (Topp et al., 2015) with the Perceived Stress Scale (Cohen et al., 1983)",
           "How far demands have felt beyond one's capacity to respond"),
    "PH": ("Rest and vigour questions from the WHO-5 (Topp et al., 2015) with sleep and activity questions",
           "Whether rest restores, and whether reserve is present"),
    "EN": ("Vigour and interest questions from the WHO-5 (Topp et al., 2015)",
           "Availability of energy and engagement across the day"),
}

PRACTICE_RESEARCH = {
    "cue_anchored": "Practices tied to a specific cue, in the form of after one thing I do another, are consistently more likely to be carried out than intentions alone (Gollwitzer, 1999; Gollwitzer and Sheeran, 2006). Habits form through repetition in a stable setting, and in the best known field study a single missed day made no measurable difference to that process (Lally et al., 2010), which is why this report treats missed days as ordinary.",
    "boundaries": "Deliberate boundaries between work and home are associated with easier evening disengagement (Ashforth et al., 2000; Kreiner et al., 2009).",
    "task_writing": "Briefly writing down tomorrow's open tasks before bed helped people settle faster in a controlled study (Scullin et al., 2018).",
    "progress_noticing": "Simply noticing progress, even very lightly, is associated with better follow through (Harkin et al., 2016).",
    "breathing": "Slow, comfortable breathing is associated with greater self reported calm in reviews of breathing research (Zaccaro et al., 2018).",
    "calm_listening": "Calm listening is associated with lower self reported stress (de Witte et al., 2020).",
    "green_views": "Brief views of greenery are associated with restored attention (Lee et al., 2015; Kaplan, 1995).",
    "drawing": "Brief drawing offers a short term mood lift, working as gentle distraction (Drake and Winner, 2012).",
    "self_kindness": "Responding to lapses with self kindness rather than self criticism predicts returning to a practice sooner (Neff, 2003).",
    "small_valued_activity": "Doing one small valued activity is a well supported way of lifting low mood (Mazzucchelli et al., 2010).",
    "gentle_walk": "Gentle movement and time outdoors are associated with increased feelings of energy (Puetz et al., 2008) and restored attention (Kaplan, 1995).",
}

PROGRAM_RESEARCH = {
    "recovery_course": "Courses that teach recovery skills have been tested directly. In a randomised trial, a recovery training program improved participants' recovery experiences, their reported sleep quality, and their sense of wellbeing (Hahn et al., 2011).",
    "low_intensity_movement": "In a randomised trial with adults reporting low energy, low intensity activity increased feelings of energy and reduced fatigue, performing better than more demanding exercise (Puetz et al., 2008).",
    "gentle_movement": "Reviews of gentle, breath led movement report lower perceived stress across studies (Sharma, 2014). For low energy seasons, a randomised trial found low intensity activity increased energy and reduced fatigue (Puetz et al., 2008).",
    "small_group": "Small group formats add the supportive presence of others, which is associated with buffering the felt weight of strain (Cohen and Wills, 1985), and social connection is consistently associated with wellbeing (Holt-Lunstad et al., 2010).",
    "nature_contact": "Spending around two hours a week in nature is associated with good self reported health and wellbeing (White et al., 2019).",
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _page(number, part, eyebrow, title, deck, blocks, next_line=None):
    return {
        "number": number,
        "part": part,
        "eyebrow": eyebrow,
        "title": title,
        "deck": deck,
        "blocks": [b for b in blocks if b],
        "next": next_line,
    }


def _para(text, lead=None):
    return {"type": "paragraph", "text": text, "lead": lead}


def _callout(label, body, variant="info", title=None, icon=None):
    return {"type": "callout", "label": label, "title": title, "body": body,
            "variant": variant, "icon": icon}


def _cards(items, columns=2, tone=None):
    """Each item is (label, title, body) with optional icon and tone as a
    fourth and fifth element."""
    built = []
    for item in items:
        label, title, body = item[0], item[1], item[2]
        built.append({
            "label": label, "title": title, "body": body,
            "icon": item[3] if len(item) > 3 else None,
            "tone": item[4] if len(item) > 4 else tone,
        })
    return {"type": "cards", "columns": columns, "items": built}


def _numbered_cards(items, columns=4):
    """The four movements of the report (page 3): a numbered badge, an
    icon, a title and a line of body."""
    return {"type": "cards", "columns": columns, "numbered": True, "items": [
        {"n": str(i + 1), "label": None, "title": t, "body": b, "icon": ic,
         "tone": tone}
        for i, (t, b, ic, tone) in enumerate(items)
    ]}


def _list(label, items, icon="check"):
    return {"type": "list", "label": label,
            "items": [{"text": t, "icon": icon} for t in items]}


def _row(blocks):
    """Two blocks side by side, in the proportions the page asks for."""
    return {"type": "row", "blocks": [b for b in blocks if b]}


def _sorted_areas(enriched, strengths_first=True):
    areas = [a for a in enriched["areas"].values() if a["band"] is not None]
    return sorted(areas, key=lambda a: a["score"], reverse=strengths_first)


def _area(enriched, code):
    """The nine report areas only. Scoring carries dimensions the report
    does not describe, so any code is looked up rather than indexed."""
    return enriched["areas"].get(code) if code else None


def _area_name(enriched, code):
    area = _area(enriched, code)
    return area["name"] if area else None


def _area_band(enriched, code):
    area = _area(enriched, code)
    return area["band"] if area else None


def _join_names(names):
    names = [n for n in names if n]
    if not names:
        return ""
    if len(names) == 1:
        return names[0]
    if len(names) == 2:
        return names[0] + " and " + names[1]
    # Several area names already contain "and", so the final separator
    # keeps its comma to stop the list reading as one long clause.
    return ", ".join(names[:-1]) + ", and " + names[-1]


def _prose(name):
    """An area name as it should appear inside a sentence."""
    return name.lower().replace(" & ", " and ") if name else name


def _band_legend(enriched):
    """The band counts under the petal wheel, in band order."""
    counts = {b: 0 for b in BAND_ORDER}
    for area in enriched["areas"].values():
        if area["band"]:
            counts[area["band"]] += 1
    return [{"band": b, "count": counts[b]} for b in reversed(BAND_ORDER) if counts[b]]


def _petals(enriched, variant):
    """The nine-petal picture. Each petal reaches further the steadier that
    area, in four discrete steps only. No number appears inside it."""
    ordered = [enriched["areas"][c] for c in AREA_ORDER]
    overall = enriched["lwi"]["band"] or "Steady"
    shape = "but uneven" if enriched["lwi"]["shape"] == "uneven" else "and even"
    return {
        "type": "petals",
        "variant": variant,
        "overall": overall,
        "shape": shape,
        "items": [{"name": a["name"], "band": a["band"], "step": a["step"],
                   "icon": AREA_ICONS[code]}
                  for code, a in zip(AREA_ORDER, ordered)],
        "legend": _band_legend(enriched),
        "legend_label": "The further a petal reaches, the steadier that area",
    }


def _tension_matches_primary(enriched):
    tension = enriched["patterns"]["priority_tension"]
    if not tension:
        return False
    from scoring import KEY_TO_SPEC_CODE
    return KEY_TO_SPEC_CODE.get(tension.get("dimension")) == enriched["leverage"]["primary"]


# ---------------------------------------------------------------------------
# Front matter: pages 1 and 2
# ---------------------------------------------------------------------------

def _p01_cover(enriched):
    meta = enriched["meta"]
    return _page(1, None, "Your complete wellbeing reflection", "Your Lewis Insight Report",
                 "Nine areas of your life, read together: what is holding you up, what is stretched, and where one small change travels furthest.", [
        {"type": "prepared", "name": meta["name"], "date": meta["date"],
         "location": meta["location"],
         "note": "A private reflection, written to be read slowly and returned to."},
        _petals(enriched, "cover"),
        _cards([
            ("WHAT THIS REPORT IS", None,
             "A reading of how your wellbeing is arranged right now, across nine areas of life. It describes the season you are in, not the kind of person you are.",
             "sparkles"),
            ("HOW IT WAS BUILT", None,
             "Your answers were read using wellbeing questionnaires tested and used in published research. The short exercises added texture. Every study is named at the end.",
             "flask"),
        ], columns=2),
        _callout(None, NON_CLINICAL_LINE, variant="footer", icon="shield"),
    ])


def _p02_contents(enriched, pages):
    """Built last, from the titles of the pages that were actually
    produced, so the contents can never drift from the document."""
    parts = []
    for part_name in (PART_ONE, PART_TWO, PART_THREE, PART_FOUR, PART_FIVE, PART_SIX):
        items = [{"title": p["title"], "page": p["number"]}
                 for p in pages if p["part"] == part_name]
        if items:
            parts.append({"name": part_name, "icon": PART_ICONS[part_name], "items": items})
    return _page(2, None, "Contents", "What is inside your report",
                 "Six movements, read in order. Each part answers the question the part before it raises, so the report builds rather than lists.", [
        {"type": "contents", "parts": parts},
        _callout("IF YOU READ ONLY THREE PAGES",
                 "Start with page 05 for the whole picture in one view, page 07 for the shape of your nine areas, and page 17 for the single practice this report would keep if it could keep only one. Everything else explains those three.",
                 icon="book"),
    ])


# ---------------------------------------------------------------------------
# Part one: orientation, pages 3 and 4
# ---------------------------------------------------------------------------

def _p03_how_to_read(enriched):
    meta = enriched["meta"]
    return _page(3, PART_ONE, "Orientation", "How to read this reflection",
                 "Built to be read slowly. It begins with what already supports you, names what is stretched, shows how the two connect, and only then suggests what to try.", [
        _row([
            {"type": "profile", "label": "PREPARED FOR", "name": meta["name"] or "User",
             "meta": " · ".join(x for x in [meta["location"]] if x) or None,
             "status": "Full reflection completed"},
            _callout("THE CENTRAL IDEA",
                     "This is a picture of how your wellbeing is arranged right now. It is a season, not a personality type, and not a verdict. A future reflection may read differently, because your life can.",
                     icon="sun"),
        ]),
        _numbered_cards([
            ("Your whole picture",
             "Nine areas are read together, so one strong part of your life never erases a difficult stretch, and a difficult stretch never hides behind a capable exterior.",
             "grid", None),
            ("What moves together",
             "Some areas rise and fall in each other's company. Noticing which travel together shows where a small effort reaches furthest.",
             "refresh", None),
            ("The texture of your days",
             "Your rhythm, your stress pattern, where tension settles, and how the short exercises felt all add colour to the picture.",
             "waves", None),
            ("A right sized next step",
             "Suggestions are matched to the area asking for care, what gets in your way, the support you prefer, and how much plan fits your life this month.",
             "target", "green"),
        ]),
        _cards([
            ("WHAT IT CAN SAY, AND WHAT IT CANNOT", None,
             "It can say how your wellbeing feels arranged today, which areas appear to travel together, and which small change is most likely to be worth your effort. It cannot say what caused what, how you will feel next month, or anything medical. Where it is confident, it speaks plainly. Where it is less certain, it says so rather than pretending.",
             "scale", "neutral"),
            ("A NOTE ON COMPARISON", None,
             "You will not find yourself ranked against other people here. Comparison tends to produce anxiety rather than insight, and the honest answer to how do I compare needs far more than one reflection can gather. This report compares you only to yourself, and invites you to do the same when you retake it.",
             "users", "neutral"),
        ], columns=2),
    ], next_line="The four words this report uses instead of scores, and why.")


def _p04_four_words(enriched):
    return _page(4, PART_ONE, "The language of this report", "The four words this report uses",
                 "Every area of your life is described with one of four words. They are deliberately broad, and they are the same four words wherever they appear in this report.", [
        {"type": "bandladder",
         "items": [{"band": b, "step": BAND_STEP[b]} for b in BAND_ORDER],
         "left": "Needs the gentlest care", "right": "A place to stand"},
        {"type": "bandcards",
         "items": [{"band": b, "gloss": BAND_GLOSS[b]} for b in BAND_ORDER]},
        _row([
            _callout("WHY FOUR WORDS INSTEAD OF A SCORE",
                     "One sitting places you honestly inside a broad range, and that is what this report can give you truthfully. A number would suggest a precision no single reflection carries, and it would invite you to grade yourself rather than understand yourself. Words also travel better. Running on empty tells you what to do next. A number does not.",
                     icon="scale"),
            {"type": "checklist", "label": "HOW TO HOLD THEM", "items": [
                {"text": "As a description of this season", "tone": "yes"},
                {"text": "As a pointer to where effort is worth spending", "tone": "yes"},
                {"text": "Never as a grade, a verdict, or a fixed trait", "tone": "no"},
            ]},
        ]),
    ], next_line="Your whole picture in one page, beginning with your own word for it.")


# ---------------------------------------------------------------------------
# Part two: your picture, pages 5 to 8
# ---------------------------------------------------------------------------

def _p05_where_you_are(enriched):
    ctx = enriched["context"]
    portrait = enriched["portrait"] or {}
    headline = PORTRAIT_HEADLINE.get(portrait.get("id"), "Where you are right now")
    refine = PORTRAIT_REFINE.get(portrait.get("id"), "The full picture is described in the pages that follow.")

    arrival = ctx["arrival_word"]
    if arrival:
        opening = 'You arrived with one word: "' + str(arrival) + '." ' + refine
    else:
        opening = "However you arrived today, you are here, and that counts. " + refine

    primary = _area_name(enriched, enriched["leverage"]["primary"])
    downstream_codes = enriched["leverage"]["downstream"]
    strengths = [_area_name(enriched, c) for c in enriched["strength_codes"][:3]]
    strengths = [s for s in strengths if s]
    anchor = _pick_anchor(enriched)

    downstream = []
    for i, code in enumerate(downstream_codes):
        name = _area_name(enriched, code)
        if not name:
            continue
        downstream.append({
            "name": name,
            "band": _area_band(enriched, code),
            "note": "often eases as the starting point eases" if i == 0 else "sits in the same loop",
        })

    read_bits = []
    if strengths:
        read_bits.append(_prose(strengths[0]) + " is holding you up")
    if primary:
        read_bits.append("your " + _prose(primary) + " is asking for care")
    friction = (ctx.get("friction") or "").strip()
    if friction:
        read_bits.append(friction + " is in the way")
    read_bits.append("one small practice is the gentlest way in")

    blocks = [{"type": "pullquote", "variant": "opening", "text": opening, "icon": "quote"}]

    if enriched["safety"]["tier"] != "none":
        blocks.append(_callout("A NOTE OF CARE, FIRST",
            "A lot in your answers is asking for care right now. That is not a failure. It is information, and it deserves kindness. This report stays deliberately small and gentle because of it, and if things feel heavy, sharing how you are doing with someone you trust, or a qualified professional, is a real and worthwhile step.",
            variant="care", icon="heart"))

    blocks.append({
        "type": "map",
        "ground": {"label": "A PLACE TO STAND", "names": strengths,
                   "note": "Your ground, doing real work"},
        "here": {"label": "YOU ARE HERE",
                 "title": (enriched["lwi"]["band"] or "Steady"),
                 "shape": "but uneven" if enriched["lwi"]["shape"] == "uneven" else "and even",
                 "up": "holds you up", "down": "is straining"},
        "care": ({"label": "ASKING FOR CARE", "name": primary,
                  "band": _area_band(enriched, enriched["leverage"]["primary"]),
                  "star": _tension_matches_primary(enriched)} if primary else None),
        "downstream": downstream,
        "first_step": {"label": "YOUR FIRST STEP", "title": anchor["title"],
                       "note": "small enough to survive a crowded day"},
        "read": "Read as one sentence. " + _join_names(read_bits).capitalize() + ".",
    })

    top_priority = ctx["top_priority"]
    if top_priority:
        tension = enriched["patterns"]["priority_tension"]
        confirmed = tension is not None and tension.get("firmness") == "plain"
        if confirmed:
            matters = ("When asked what matters most right now, you placed " + _prose(str(top_priority))
                       + " at the top. It is also an area under real strain, and you confirmed the fit when it was reflected back to you. That agreement is why this report speaks about it plainly rather than tentatively, from a starting point you already recognise as yours.")
        else:
            matters = ("When asked what matters most right now, you placed " + _prose(str(top_priority))
                       + " at the top. This report keeps that priority in view throughout: what is suggested is chosen to protect what you said matters, not to compete with it.")
        blocks.append(_callout("WHAT MATTERS MOST TO YOU", matters, icon="star"))

    return _page(5, PART_TWO, "Your reflection", "Where you are right now",
                 headline + ". This describes your current season, not the kind of person you are.",
                 blocks, next_line="What that picture is telling you, in plain language.")


def _p06_what_it_tells_you(enriched):
    ctx = enriched["context"]
    shape = enriched["lwi"]["shape"]
    strengths = [_area_name(enriched, c) for c in enriched["strength_codes"][:3]]
    strengths = [s for s in strengths if s]
    stretched = [_area_name(enriched, c) for c in enriched["stretched_codes"][:3]]
    stretched = [s for s in stretched if s]
    primary = _area_name(enriched, enriched["leverage"]["primary"])

    if shape == "uneven" and strengths:
        deck = "Your reflection has an uneven shape, and the unevenness is the most useful thing in it."
        holding = [
            _join_names(strengths) + ": these are not merely intact. They are doing real, load bearing work, and they are exactly why you keep functioning even when reserves run thin.",
            "Those same strengths are why the thinness underneath can stay invisible. You keep functioning well, so nothing looks wrong from outside, and little from inside either, until you try to begin something.",
        ]
    else:
        deck = "Your reflection has a fairly even shape, and that evenness is itself the useful information in it."
        holding = [
            (_join_names(strengths) + ": these are carrying their share, quietly and without drama." if strengths
             else "No single area is carrying the others, which is its own kind of steadiness."),
            "An even picture means the invitation is closer to maintenance than repair. What already works is worth protecting before anything new is added.",
        ]

    if stretched:
        thin = [
            "The pattern in " + _join_names([_prose(n) for n in stretched]) + " reads stretched. Responsibility has been arriving on schedule. Recovery has not. The result is not simply feeling tired. It is having less usable reserve at the moment you want to begin something, and carrying the day further into the evening than you would choose.",
        ]
    else:
        thin = [
            "Nothing in your picture reads as stretched right now. That is worth naming plainly rather than hurrying past, because it is the condition under which small, protective habits are cheapest to build.",
        ]
    if primary:
        thin.append("This is why your most useful starting point is not motivation, and it is not a bigger routine. It is one small, repeatable act of care aimed at your " + _prose(primary) + ".")

    arc = ctx.get("energy_arc") or {}
    slots = [s for s in ("morning", "afternoon", "evening", "night") if arc.get(s)]
    timeline = None
    if slots:
        timeline = {
            "type": "timeline",
            "title": "THE SHAPE OF YOUR DAY, AS YOU DESCRIBED IT",
            "segments": [{"label": s.title(), "level": arc[s]} for s in slots],
            "note": "Drawn from how you described your own day. A pattern to notice, not a measurement.",
        }

    friction = (ctx.get("friction") or "").strip()
    constraints = []
    if friction:
        constraints.append((None, friction.capitalize() + " is the friction",
                            "Not willingness. Any plan that needs a clear half hour will lose to a crowded week, so this one does not ask for that.",
                            "clock"))
    if enriched["areas"]["AC"]["band"] in LOW_BANDS or enriched["handoff"]["lead_with"] == "down-regulation":
        constraints.append((None, "Transitions cost most",
                            "Ending, switching roles and restarting read as harder than the work itself. That is a timing problem, and timing is changeable.",
                            "refresh"))
    else:
        constraints.append((None, "Reserve is the limit, not intent",
                            "What is scarce in this season is the reserve behind a decision, rather than the willingness to make it. A plan has to fit the reserve you actually have.",
                            "battery"))
    sizing = enriched["handoff"]["habit_sizing"]
    constraints.append((None, "So the start point is small",
                        "One repeatable cue at the seam of your day, rather than a routine that assumes the evening is already yours."
                        if sizing != "moderate" else
                        "One repeatable cue, with room to grow only once it has proved it survives an ordinary week.",
                        "target"))

    return _page(6, PART_TWO, "Your reflection", "What your picture is telling you", deck, [
        {"type": "columns", "items": [
            {"label": "WHAT IS HOLDING YOU UP", "icon": "shield", "tone": "green", "paras": holding},
            {"label": "WHAT IS THIN UNDERNEATH", "icon": "alert", "tone": "amber", "paras": thin},
        ]},
        {"type": "pullquote", "variant": "crux",
         "text": PULL_QUOTES.get(enriched["handoff"]["lead_with"], PULL_QUOTES["steadiness"])},
        timeline,
        _cards(constraints[:3], columns=3),
    ], next_line="All nine areas together, and the ones this report is least sure about.")


def _p07_the_shape(enriched):
    areas_sorted = _sorted_areas(enriched)
    overall = enriched["lwi"]["band"] or "Steady"
    shape = enriched["lwi"]["shape"]
    unread = [a["name"] for a in enriched["areas"].values() if a["band"] is None]

    if shape == "uneven":
        shape_note = (
            overall + " overall, but uneven. The overall word describes the whole field. It does not cancel the genuine "
            "stretch in the areas asking for care. A shape like this usually means your strengths are quietly subsidising "
            "the areas that are stretched. That works for a while, and it is worth noticing before it stops working."
        )
    else:
        shape_note = (
            overall + " overall, and fairly even. No single area is carrying the others, and no single area is dragging them. "
            "The most useful move in an even season is usually protecting what already works."
        )
    if unread:
        shape_note += " " + _join_names(unread) + " stayed out of this picture rather than being guessed at."

    return _page(7, PART_TWO, "The nine areas", "The shape of your wellbeing",
                 "Nine areas of life, read together. The shape matters more than any single area: it shows where your strength is, and where your effort is most needed.", [
        _row([
            _petals(enriched, "page"),
            {"type": "bands", "title": "YOUR AREAS, STRENGTHS FIRST",
             "items": [{"name": a["name"], "band": a["band"], "step": a["step"]}
                       for a in areas_sorted]},
        ]),
        _callout("THE OVERALL SHAPE", shape_note, icon="compass"),
    ], next_line="What each of the nine areas is actually asking about.")


def _p08_what_each_area_asks(enriched):
    rows = []
    for code in AREA_ORDER:
        area = enriched["areas"][code]
        rows.append([
            {"text": area["name"], "icon": AREA_ICONS[code]},
            {"text": area["band"] or "Not read", "band": area["band"] or "Not read"},
            area["asking_about"],
        ])

    scored = [a for a in enriched["areas"].values() if a["band"] is not None]
    total = len(enriched["areas"])
    plain = [a["name"] for a in scored if a["read_type"] == "clear"]
    offered = [a["name"] for a in scored if a["read_type"] == "supported"]
    unread = [a["name"] for a in enriched["areas"].values() if a["band"] is None]

    primary_name = _area_name(enriched, enriched["leverage"]["primary"])
    if primary_name and primary_name in offered:
        note = ("The areas held most carefully here are also the ones you most want answers about. "
                "That is uncomfortable, and worth saying out loud rather than hiding behind confident language.")
    elif unread:
        note = ("Start with what is missing rather than what is firm. " + _join_names(unread)
                + " stayed unread because the questions behind them were skipped, and nothing is filled in on your behalf. "
                "Everything else here rests on answers you actually gave.")
    else:
        note = ("Most of this picture can be spoken about directly, and that is the useful headline. "
                "Where the wording softens later in this report, the softening is deliberate and worth trusting.")

    certainty = {
        "type": "certainty",
        "total": total,
        "plain": {"label": "DESCRIBED PLAINLY", "count": len(plain),
                  "body": ("A full set of clear, consistent answers stands behind these, so the report speaks about them directly."
                           if plain else "No area in this reflection rests on a full set of answers.")},
        "offered": {"label": "OFFERED TO TEST", "count": len(offered),
                    "body": ((_join_names([_prose(n) for n in offered]).capitalize()
                              + " rest on fewer questions. They are offered as a reading to test against your own experience.")
                             if offered else "Every area read here rests on a full set of questions.")},
        "unread": ({"label": "LEFT UNREAD", "count": len(unread),
                    "body": _join_names(unread) + " were left unread rather than guessed."} if unread else None),
        "note": note,
    }

    return _page(8, PART_TWO, "The nine areas", "What each area is asking about",
                 "Each area asks about how a part of life feels to live in, not how well you are performing in it.", [
        {"type": "table", "title": None, "icons": True,
         "columns": ["Area", "Your reading", "What this area is asking about"],
         "rows": rows},
        certainty,
    ], next_line="Which of these nine areas appear to move in each other's company.")


# ---------------------------------------------------------------------------
# Part three: how it connects, pages 9 to 12
# ---------------------------------------------------------------------------

def _one_sentence(enriched):
    primary_name = _area_name(enriched, enriched["leverage"]["primary"])
    downstream_names = [_area_name(enriched, c) for c in enriched["leverage"]["downstream"]]
    downstream_names = [d for d in downstream_names if d]
    strengths = [_area_name(enriched, c) for c in enriched["strength_codes"][:3]]
    strengths = [s for s in strengths if s]

    bits = []
    if primary_name:
        bits.append("your " + _prose(primary_name) + " is the clearest place to begin")
    if downstream_names:
        verb = "sits" if len(downstream_names) == 1 else "sit"
        bits.append(_join_names([_prose(d) for d in downstream_names]) + " " + verb + " close alongside it")
    if strengths:
        bits.append("your strong areas stand apart as ground you can rely on while the rest steadies")
    if not bits:
        return "In short: no single area is pulling on the others, and the invitation is to protect what already works."
    return "In short: " + ", ".join(bits) + "."


def _p09_moves_together(enriched):
    primary = enriched["leverage"]["primary"]
    strain, links = [], []
    if _area_name(enriched, primary):
        strain.append({"name": _area_name(enriched, primary),
                       "band": _area_band(enriched, primary), "role": "start"})
    for link in enriched["connections"]:
        name = _area_name(enriched, link["b"])
        from_name = _area_name(enriched, link["a"])
        if not name or not from_name:
            continue
        strain.append({"name": name, "band": _area_band(enriched, link["b"]),
                       "role": "linked" if link["rank"] == "clearest" else "loop"})
        links.append({"from": from_name, "to": name,
                      "style": "solid" if link["rank"] == "clearest" else "dashed"})
    for code in enriched["stretched_codes"]:
        name = _area_name(enriched, code)
        if name and not any(s["name"] == name for s in strain):
            strain.append({"name": name, "band": _area_band(enriched, code), "role": "loose"})

    ground = [{"name": _area_name(enriched, c), "band": _area_band(enriched, c)}
              for c in enriched["strength_codes"][:4]]
    ground = [g for g in ground if g["name"]]

    blocks = [{
        "type": "connections",
        "strain_label": "Where the strain sits",
        "ground_label": "Ground you can rely on",
        "start_label": "Start here",
        "strain": strain,
        "ground": ground,
        "links": links,
        "ground_note": ("These stand apart from the strained loop. That is what makes them useful."
                        if ground else None),
        "caption": "Only the active links are drawn, and the size of each shape follows its reading.",
        "legend": [
            {"style": "solid", "text": "A solid line means the two areas appear to travel together closely."},
            {"style": "dashed", "text": "A dashed line means they sit in the same loop, more loosely."},
            {"style": "none", "text": "No line means the area is holding independently of the strain."},
        ],
    }]
    if not links:
        blocks.append(_para(
            "No area in your reflection stands out as pulling on the others. Your picture is balanced enough that no connection line would be honest, so none is drawn. The invitation is maintenance: keep doing what already works."))
    blocks.append(_para(_one_sentence(enriched), lead="READ AS ONE SENTENCE"))

    return _page(9, PART_THREE, "How it connects", "What seems to move together",
                 "These links show areas that appear to rise and fall alongside each other in your reflection. They describe company, not cause. Knowing which travel together tells you where a single change is likely to reach more than one place.",
                 blocks, next_line="What those links mean, and why they decide where you start.")


def _p10_reading_connections(enriched):
    primary = enriched["leverage"]["primary"]
    primary_name = _area_name(enriched, primary)
    blocks = [_para(_one_sentence(enriched))]

    link_cards = []
    for link in enriched["connections"]:
        a_name = _area_name(enriched, link["a"])
        b_name = _area_name(enriched, link["b"])
        if not a_name or not b_name:
            continue
        label = "THE CLEAREST LINK" if link["rank"] == "clearest" else "THE SECOND LINK"
        body = ("When " + _prose(a_name) + " is stretched, " + _prose(b_name)
                + " tends to feel it too. The two appear to move together in your reflection. This is company, not cause: it says where a single change is likely to reach more than one place, and nothing more.")
        link_cards.append((label, a_name + " and " + _prose(b_name), body, "refresh"))

    strengths = [_area_name(enriched, c) for c in enriched["strength_codes"][:2]]
    strengths = [s for s in strengths if s]
    if strengths:
        link_cards.append((
            "YOUR PROTECTIVE GROUND", _join_names(strengths),
            "These are genuinely holding, and they are practical resources rather than pleasant extras. They can protect your time, hold you gently accountable, and supply patience with yourself while the rest steadies.",
            "shield"))

    if primary_name:
        if enriched["leverage"]["is_lowest"]:
            begin_body = ("Your " + _prose(primary_name)
                          + " is both the area under the most strain and the one with the clearest links outward, which makes it the natural place to begin. A small change there is likely to travel further than effort spent anywhere else.")
        else:
            lowest_name = _area_name(enriched, enriched["leverage"]["lowest"])
            begin_body = ("The most stretched area is not automatically the best place to start. Here, your "
                          + _prose(primary_name) + " has the clearest links outward to what else is low"
                          + ((", including your " + _prose(lowest_name))
                             if lowest_name and lowest_name != primary_name else "")
                          + ", which means a small change there is likely to travel further than pushing directly at the lowest point.")
        link_cards.append(("WHERE TO BEGIN", primary_name, begin_body, "target"))

    if link_cards:
        blocks.append(_cards(link_cards, columns=2))

    reach_items = []
    if primary_name:
        n = len(enriched["leverage"]["downstream"])
        reach_items.append({"name": primary_name, "level": max(n, 1),
                            "label": "Reaches two areas" if n >= 2 else
                                     "Reaches one area" if n == 1 else "The place to begin"})
    for code in enriched["leverage"]["downstream"]:
        name = _area_name(enriched, code)
        if name:
            reach_items.append({"name": name, "level": 1, "label": "Sits downstream"})
    if reach_items:
        blocks.append({"type": "reach", "title": "HOW FAR A CHANGE IN EACH AREA IS LIKELY TO TRAVEL",
                       "items": reach_items,
                       "note": "Reach is drawn from the links in your own reflection, not from a general model. It is a reason to start somewhere, not a promise about the result."})

    blocks.append(_callout("WORTH HOLDING LIGHTLY",
        "Everything here comes from a single sitting, on one particular day. It can point you toward a useful place to start. It cannot tell you what caused what. The real test is whether this pattern shifts when your life shifts, which is exactly what the thirty day experiment later in this report is built to help you notice.",
        icon="info"))

    return _page(10, PART_THREE, "How it connects", "Reading the connections",
                 "The links named in reader language, and what they mean for where you begin.",
                 blocks, next_line="What your own description of a normal day says about how stress is arriving.")


def _p11_how_stress_shows_up(enriched):
    ctx = enriched["context"]
    stress = enriched["patterns"]["stress"] or {}
    blocks = []

    arc = ctx.get("energy_arc") or {}
    slots = [s for s in ("morning", "afternoon", "evening", "night") if arc.get(s)]
    if slots:
        blocks.append({
            "type": "dayrhythm",
            "title": "YOUR DAY, AS YOU DESCRIBED IT",
            "slots": [s.title() for s in slots],
            "series": [{"label": "Your energy", "tone": "teal",
                        "points": [arc[s] for s in slots]}],
            "note": "Drawn from how you described your own day. A pattern to notice, not a measurement.",
        })

    texture_cards = []
    stress_label = stress.get("label")
    if stress_label and stress_label != "Settled":
        texture_cards.append(("YOUR STRESS PATTERN", stress_label.replace("&", "and"),
                              "Drawn from your own description of how pressure has been showing up lately.",
                              "waves"))
    elif stress_label == "Settled":
        texture_cards.append(("YOUR STRESS PATTERN", "Mostly settled",
                              "Pressure is present, as it is for everyone, and it has not been running the day.",
                              "waves"))

    before, after = ctx.get("breathing_before"), ctx.get("breathing_after")
    if before or after:
        if before and after and before != after:
            b_title = "A little easier by the end"
            b_body = "A small shift toward ease appeared when nothing was forced. Gentle settling is available to you."
        else:
            b_title = "Steady through the minute"
            b_body = "Your minute of quiet breathing stayed roughly where it began. Settling may need a slightly longer runway, which is why nothing in your plan relies on instant calm."
        texture_cards.append(("YOUR BREATHING MINUTE", b_title, b_body, "wind"))

    recovery_line = RECOVERY_LINES.get(ctx.get("recovery") or "")
    if recovery_line:
        rec_title = {
            "recovered": "Stopping restores you",
            "somewhat": "Stopping is not yet fully restorative",
            "still_tired": "Stopping is not yet fully restorative",
            "anxious_at_rest": "Stopping has felt uneasy",
        }.get(ctx.get("recovery"), "Your recovery")
        texture_cards.append(("YOUR RECOVERY", rec_title, recovery_line, "moon"))

    if texture_cards:
        blocks.append(_cards(texture_cards, columns=3 if len(texture_cards) >= 3 else 2))

    highs = [s for s in ("morning", "afternoon", "evening", "night") if arc.get(s) == "High"]
    if "evening" in highs or "night" in highs:
        reading = "Your energy is not uniformly low. It moves through the day and lifts again late, and your pressure tends to lift alongside it. That combination is what makes stopping feel strangely effortful: the body is tired, and the day has not fully released you. Evenings then risk becoming a second working day of planning, scrolling or problem solving, at the hour you most need a softer landing."
    elif "morning" in highs:
        reading = "Your day leads with its best energy and spends down from there. That shape rewards putting what matters earliest, and it means the later day should be planned as a descent rather than pushed as a second climb."
    elif slots:
        reading = "Your energy moves through the day in a shape worth knowing. Working with that shape, rather than overriding it, is the cheapest improvement available to you."
    else:
        reading = "You chose to skip most of the short exercises, so this page stays honest and short. Nothing about your rhythm is guessed in their absence."

    if not blocks:
        blocks.append(_para("You chose to skip the short exercises behind this page, so it stays honest and short. Nothing about your rhythm or your body is guessed in their absence."))

    blocks.append(_callout("WHAT YOUR RHYTHM AND YOUR PRESSURE TOGETHER ARE SAYING", reading, icon="waves"))

    return _page(11, PART_THREE, "Your rhythm", "How stress is showing up",
                 "A picture of your lived pattern, drawn from your own words and choices. It is not a sleep study, and not a measurement of anything happening inside your body.",
                 blocks, next_line="How much you have been carrying, and where it settles in your body.")


def _p12_where_tension_settles(enriched):
    ctx = enriched["context"]
    load = enriched["patterns"]["recovery_load"] or {}
    zones = [BODY_ZONE_WORDS[z] for z in ctx["body_zones"] if z in BODY_ZONE_WORDS]
    blocks = []

    load_label = load.get("label")
    if load_label:
        level = {"Light load": 1, "Moderate load": 2, "Carrying a lot": 3}.get(load_label, 2)
        blocks.append({
            "type": "loadbar", "level": level, "label": load_label,
            "title": "HOW MUCH YOU HAVE BEEN CARRYING",
            "steps": ["Light", "Moderate", "Carrying a lot"],
            "note": "Your accumulated demands, weighed against how well rest has been restoring you.",
        })
    if zones:
        blocks.append({"type": "bodymap", "title": "WHERE YOU NOTICED TENSION",
                       "zones": ctx["body_zones"], "words": zones,
                       "note": "Marked from where you told this reflection tension had been gathering."})

    interp = []
    if load_label == "Carrying a lot":
        interp.append("You are carrying a lot, and the weight is not evenly spread. What you described is a load that has been arriving steadily while the recovery that should follow it has not, so each day starts a little further behind the last.")
    elif load_label:
        interp.append("The load you described is real without being overwhelming, which is the stage where small changes still land quickly. The pattern has not hardened.")
    before, after = ctx.get("breathing_before"), ctx.get("breathing_after")
    if before or after:
        interp.append("Your minute of quiet breathing is part of why your plan is sized the way it is. A modest shift, or none, points to a brief transition rather than a long routine. Small and repeatable will serve you better than ambitious and occasional.")
    if zones:
        interp.append("Tension gathered around your " + _join_names(zones) + ", and you noticed it yourself. That matters. It means you are not disconnected from your body. You are carrying a lot in a body you can still hear, which bodes well for how quickly small practices tend to land.")
    for text in interp:
        blocks.append(_para(text))

    if zones:
        upper = any(z in ("head", "neck", "back") for z in ctx["body_zones"])
        blocks.append(_cards([
            ("THE GOOD NEWS IN THIS", None,
             "You can feel where your tension sits. Practices that ask you to notice will land quickly for you.", "check"),
            ("THE PART TO RESPECT", None,
             ("Most of the tension clusters above the shoulders, the area a long screen day loads most."
              if upper else
              "The tension you marked sits deep rather than surface level, and it responds to time and gentleness rather than to effort."),
             "alert"),
        ], columns=2))

    if not blocks:
        blocks.append(_para("You chose to skip the body map and the load questions, so this page stays honest and short. Nothing about where you carry tension is guessed in their absence."))

    lead = enriched["handoff"]["lead_with"]
    why_next = {
        "down-regulation": "Because stopping is not yet fully restorative for you, intensive challenges and high commitment programs are not the right first move, however appealing they look. The sequence that fits your current pattern is to downshift first, and build later.",
        "gentle activation": "Because energy is the scarce resource right now, everything that follows is sized to add energy rather than spend it. Gentle beats ambitious in this season, and the plan is built accordingly.",
        "simplification": "Because your days are carrying many open loops, the suggestions that follow simplify before they add. One clear seam in the day comes first, and everything else stays optional.",
        "gentleness": "Because your answers are asking for care, everything that follows is deliberately small, free, and optional. Nothing in this report asks you to push.",
        "steadiness": "Because your pattern is broadly holding, the suggestions that follow are about protecting what works and reinforcing it gently, rather than repairing anything.",
    }.get(lead, "The pattern on this page is what shapes the sequence of suggestions that follows.")
    blocks.append(_callout("WHY THIS SHAPES WHAT COMES NEXT", why_next, variant="synthesis", icon="arrow"))

    return _page(12, PART_THREE, "Your rhythm", "Where the tension settles",
                 "How much you have been carrying, weighed against how well rest has been restoring you, and where in your body you noticed it.",
                 blocks, next_line="A closer look at the three areas nearest your starting point.")


# ---------------------------------------------------------------------------
# Part four: a closer look, pages 13 to 15
# ---------------------------------------------------------------------------

REALISM_CODES = ("FW", "IG", "EC")


def _cluster_areas(enriched):
    """Page 13: the three areas nearest the starting point. Page 14: the
    strengths. Page 15: money, growth, environment (what sets what is
    realistic). Unread areas join their natural page."""
    inner = ["MD", "RS", "AC", "EM", "PH", "EN"]
    primary = enriched["leverage"]["primary"]

    def sort_key(code):
        score = enriched["areas"][code]["score"]
        return 999 if score is None else score

    inner_sorted = sorted(inner, key=sort_key)
    if primary in inner_sorted:
        inner_sorted.remove(primary)
        inner_sorted.insert(0, primary)

    near = inner_sorted[:3]
    # Within the page, the starting point leads and the rest follow the
    # order the nine areas are defined in, so the page reads consistently.
    near = ([primary] if primary in near else []) + [c for c in AREA_ORDER if c in near and c != primary]
    rest = sorted(inner_sorted[3:], key=sort_key, reverse=True)
    return near, rest, list(REALISM_CODES)


def _closer_title(enriched, codes):
    return "Your " + _join_names([AREA_SHORT[c] for c in codes])


def _area_block(enriched, code):
    area = enriched["areas"][code]
    band = area["band"]
    if band is None:
        paras = ABSENT_LOOK
        band_word = "Not read"
    else:
        paras = AREA_LOOKS[code][_tier(band)]
        band_word = band
    return {
        "type": "area",
        "name": area["name"],
        "icon": AREA_ICONS[code],
        "band": band_word,
        "stance": _stance_for(area),
        "paras": [{"label": l, "text": t} for (l, t) in paras],
    }


def _p13_closer_one(enriched):
    near, _, _ = _cluster_areas(enriched)
    blocks = [_area_block(enriched, c) for c in near]

    supported = [enriched["areas"][c]["name"] for c in near
                 if enriched["areas"][c]["read_type"] == "supported" and enriched["areas"][c]["band"]]
    clear = [enriched["areas"][c]["name"] for c in near
             if enriched["areas"][c]["read_type"] == "clear" and enriched["areas"][c]["band"]]
    synth = ""
    if clear:
        synth += _join_names(clear) + " can be described plainly because your answers there were clear and consistent. "
    if supported:
        synth += _join_names(supported) + " are offered a little more carefully, because they rest on a smaller set of questions. "
    synth += "Where the picture is firm, this report says so. Where it is thinner, it says that too, and leaves you to decide whether it fits."
    blocks.append(_callout("READING THESE THREE TOGETHER", synth, variant="synthesis", icon="eye"))

    return _page(13, PART_FOUR, "A closer look · 1 of 3", _closer_title(enriched, near),
                 "The three areas closest to where you are being asked to begin, described together because, in this season, they move together.",
                 blocks, next_line="The areas carrying you through this, and what they cost you.")


def _p14_closer_two(enriched):
    _, rest, _ = _cluster_areas(enriched)
    blocks = [_area_block(enriched, c) for c in rest]
    names = _join_names([_area_name(enriched, c) for c in rest])
    blocks.append(_callout(
        "YOUR STRENGTHS ARE THE PLAN, NOT THE BACKGROUND",
        "It would be easy to read the stronger areas of this report as pleasant context and skip to the problems. That would be a mistake in your case. "
        + (names + " are the resources that make any plan survivable. " if names else "")
        + "They protect your time, hold you accountable without shame, and supply the patience you will need on the days the plan does not go well. The suggestions ahead deliberately spend these strengths rather than leaving them idle.",
        variant="synthesis", icon="shield"))
    return _page(14, PART_FOUR, "A closer look · 2 of 3", _closer_title(enriched, rest),
                 "The steadier areas carrying you through this season, and how to turn each one from comfort into structure.",
                 blocks, next_line="The quieter areas that decide what is realistic for you this month.")


def _p15_closer_three(enriched):
    _, _, realism = _cluster_areas(enriched)
    blocks = [_area_block(enriched, c) for c in realism]

    fw_band = enriched["areas"]["FW"]["band"]
    ig_band = enriched["areas"]["IG"]["band"]
    ec_band = enriched["areas"]["EC"]["band"]
    bounds = []
    if fw_band in ("Steady", "Strong"):
        bounds.append("Money says a paid option is possible, and never necessary.")
    elif fw_band:
        bounds.append("Money says the free path is the right path, and every suggestion here respects that.")
    if ig_band in LOW_BANDS:
        bounds.append("Curiosity says keep any reading very short.")
    elif ig_band:
        bounds.append("Curiosity says keep the reading short and honestly interesting.")
    if ec_band in ("Steady", "Strong"):
        bounds.append("Belonging says stay close to familiar settings, in small groups.")
    elif ec_band:
        bounds.append("Surroundings say choose settings that ask little adaptation of you.")

    blocks.append({"type": "list", "label": "HOW THESE THREE SET THE BOUNDARIES OF YOUR PLAN",
                   "variant": "synthesis",
                   "items": [{"text": t, "icon": "check"} for t in bounds] or
                            [{"text": "These areas set no additional limit on what is suggested next.", "icon": "check"}]})

    return _page(15, PART_FOUR, "A closer look · 3 of 3", _closer_title(enriched, realism),
                 "Three quieter areas that shape what is realistic for you, and what kind of support is likely to fit.",
                 blocks, next_line="The plan itself, and why it is deliberately smaller than you are expecting.")


# ---------------------------------------------------------------------------
# Part five: your plan, pages 16 to 21
# ---------------------------------------------------------------------------

def _p16_pathway(enriched):
    anchor = _pick_anchor(enriched)
    primary = _area_name(enriched, enriched["leverage"]["primary"])
    downstream = [_area_name(enriched, c) for c in enriched["leverage"]["downstream"]]
    downstream = [d for d in downstream if d]
    ctx = enriched["context"]

    steps = []
    if primary:
        steps.append({"tag": "START HERE", "area": primary, "icon": "target",
                      "text": "Begin where a small change is most likely to travel. Give this area one reliable, repeatable act of care."})
    if downstream:
        steps.append({"tag": "MAY RIPPLE TO", "area": downstream[0], "icon": "refresh",
                      "text": "Often eases as the starting point eases, without being worked on directly."})
    if len(downstream) > 1:
        steps.append({"tag": "THEN SUPPORTS", "area": downstream[1], "icon": "waves",
                      "text": "Sits in the same loop, and tends to follow once the first two steady."})
    if not steps:
        steps.append({"tag": "PROTECT", "area": "What already works", "icon": "shield",
                      "text": "Your picture is balanced, so the plan protects rather than repairs."})

    friction = (ctx.get("friction") or "").strip()
    friction_line = friction if friction else "your current load"

    priorities = [
        ("FIRST PRIORITY", "Create one reliable seam",
         "Give your day one repeatable cue it can learn to trust. The aim is not instant change. It is a recognisable transition your body can learn to expect.", "clock"),
        ("SECOND PRIORITY", "Watch one honest signal",
         "Track only whether the thing this plan is aimed at feels slightly easier. That matters more than chasing a dramatic difference, and it is considerably harder to fake.", "eye"),
        ("THIRD PRIORITY", "Spend your strengths",
         "Let what is strong in your life decide what can wait, and let one trusted person witness the experiment. Your strengths become the conditions for change rather than reasons to keep overextending.", "shield"),
        ("YOUR PACING", "Focused, not full",
         "One anchor plus one optional support is enough. Everything else stays a saved option rather than an obligation.", "target"),
    ]

    markers = [
        "The seam you chose feels more distinct from the rest of your day.",
        "The thing you are caring for costs slightly less effort than it did.",
        "Beginning is a little easier at the moment you choose to begin.",
        "You can miss a day without the whole experiment turning into failure.",
    ]

    why_small = (
        "Two things you told this reflection decided the size of this plan. " + friction_line.capitalize()
        + " is real, and your readings show a season with limited spare capacity. Under those conditions a large plan tends to fail in the first crowded week and leave you feeling worse than when you started, because now there is evidence. A small plan that survives contact with a real week is worth considerably more than an impressive one you abandon. If it feels almost too easy, it has been sized correctly."
    )

    return _page(16, PART_FIVE, "Your plan · 1 of 5", "Your improvement pathway",
                 "A focused plan, deliberately reduced to fit this particular season. Lower intensity is not lower ambition. It is the fit for right now.", [
        {"type": "flow", "steps": steps,
         "first_move_label": "YOUR FIRST MOVE", "first_move": anchor["first_move"]},
        _callout("THE SHAPE OF THE RECOMMENDATION",
                 ("Downshift before building. " if enriched["handoff"]["lead_with"] == "down-regulation" else "")
                 + "Begin at the one place where your pressures, your pattern, and your day all meet. Keep the action small enough that a crowded day cannot defeat it. This plan is designed to survive your hardest ordinary day, not to impress your easiest one.",
                 icon="compass"),
        _cards(priorities, columns=4),
        _list("WHAT IMPROVEMENT WOULD LOOK LIKE FOR YOU", markers),
        _para("These are things to observe rather than outcomes you are being promised. If the pattern does not move over the next month, that is useful information, and your next reflection should revise the starting point rather than asking you to try harder at the same one."),
        _callout("WHY THIS PLAN IS SMALLER THAN YOU MIGHT EXPECT", why_small,
                 variant="synthesis", icon="scale"),
    ], next_line="The one practice this report would keep if it could keep only one.")


def _p17_anchor(enriched):
    anchor = _pick_anchor(enriched)
    return _page(17, PART_FIVE, "Your plan · 2 of 5", "Your anchor practice",
                 "One practice, described properly. This is the single thing this report would ask you to keep if you kept nothing else.", [
        {"type": "practice", "tag": anchor["tag"], "title": anchor["title"], "cols": [
            {"label": "WHEN", "text": anchor["when"], "icon": "clock"},
            {"label": "WHAT YOU DO", "text": anchor["what"], "icon": "wind"},
            {"label": "WHY IT IS THIS SMALL", "text": anchor["why_small"], "icon": "scale"},
        ]},
        {"type": "steps", "title": anchor["movements_title"].upper(),
         "items": [{"title": t, "note": n} for (t, n) in anchor["movements"]]},
        _cards([
            ("HOW TO SET IT UP TONIGHT", None, anchor["setup"], "pin"),
            ("WHAT IT SHOULD FEEL LIKE", None, anchor["feel"], "sun"),
            ("PERMISSIONS, SO THIS STAYS GENTLE", None, anchor["permissions"], "heart"),
            ("IF YOU FORGET, WHICH YOU WILL", None, anchor["forget"], "refresh"),
        ], columns=2),
    ], next_line="Seven days, one small action each, and nothing more.")


def _p18_seven_days(enriched):
    anchor = _pick_anchor(enriched)
    return _page(18, PART_FIVE, "Your plan · 3 of 5", "Your next seven days",
                 "One action a day, and deliberately nothing more. If a day is missed, the week is not.", [
        {"type": "sevendays", "title": None,
         "rows": [{"day": d, "focus": f, "action": a} for (d, f, a) in anchor["seven_days"]]},
        _cards([
            ("WHAT COUNTS AS A GOOD WEEK", None, anchor["good_week"], "check"),
            ("WHAT WOULD BE TOO MUCH", None, anchor["too_much"], "alert"),
        ], columns=2),
        _callout(anchor["why_this"][0], anchor["why_this"][1], variant="synthesis", icon="compass"),
    ], next_line="Four small additions, and permission to take none of them.")


def _p19_supports(enriched):
    supports = _build_supports(enriched)
    return _page(19, PART_FIVE, "Your plan · 4 of 5", "Your optional supports",
                 "Small additions, chosen for your specific pattern. Take one at a time, and only after the anchor is steady. This is a shelf to choose from, not a list to complete.", [
        {"type": "supports", "items": [
            {"tag": s["tag"], "title": s["title"], "body": s["body"], "why": s["why"]}
            for s in supports
        ]},
        _callout(None,
                 "The anchor alone is a complete plan. Every one of these is optional, and choosing none of them this month is a legitimate answer rather than a compromise.",
                 variant="free", icon="check"),
    ], next_line="How to choose between them, and small adjustments for your pattern.")


def _p20_choosing(enriched):
    supports = _build_supports(enriched)
    choose_rows = [list(CHOOSE_ROWS[s["id"]]) for s in supports if s["id"] in CHOOSE_ROWS]
    choose_rows.append(["You are already at capacity", "None of them",
                        "The anchor alone is a complete plan. Additions are genuinely optional"])
    adjustments = _adjustment_cards(enriched)
    return _page(20, PART_FIVE, "Your plan · 5 of 5", "Choosing, and small adjustments",
                 "Match the support to the situation you are actually in this week, then make the small changes that cost nothing.", [
        {"type": "table", "title": "HOW TO CHOOSE BETWEEN THEM",
         "columns": ["If this is your situation", "Try this one", "Because"],
         "rows": choose_rows},
        _cards([(None, label.title(), body, "arrow") for (label, body) in adjustments], columns=2),
        _callout(None,
                 "Everything on this page is designed to cost you nothing extra. Not one of these adjustments asks for more time, only for a decision made earlier, or a small physical change at a moment that is already happening.",
                 variant="neutral", icon="info"),
    ], next_line="How to find out whether any of this is true for you, over thirty days.")


def _p21_programs(enriched):
    cap = enriched["commerce"]["cap"]
    location = enriched["meta"]["location"]

    # Suppressed cap (§13.3): nothing beyond one line pointing back to the
    # free path. No persuasion, no program cards, no booking language.
    if cap == "suppressed":
        return _page(21, PART_FIVE, "Your plan · 6 of 6", "The free path is the plan",
                     "Programs are optional at the best of times. Right now, the kindest and most effective plan is the free one.", [
            _callout("THE FREE PATH IS THE WHOLE RECOMMENDATION",
                     "No programs are suggested right now, and nothing about that is a limitation: the anchor practice and the optional supports are a complete plan. A future reflection can revisit guided options when more reserve is available.",
                     variant="free", icon="check"),
        ], next_line="How to find out whether any of this is true for you, over thirty days.")

    primary_id, secondary_id, mention_id = _pick_programs(enriched)

    def program_block(pid, tag):
        p = PROGRAMS[pid]
        return {"type": "program", "tag": tag, "title": p["title"], "image": p["image"],
                "what": p["what"], "chips": list(PROGRAM_CHIPS), "why": p["why"],
                "walkaway": p["walkaway"]}

    # Money is asking for care: no paid program may lead, and the
    # persuasive framing is dropped entirely (§13.3).
    if cap == "free_low_cost_only":
        reason = enriched["commerce"]["reason"] or "money is asking for care right now"
        return _page(21, PART_FIVE, "Your plan · 6 of 6", "Guided support, noted for later",
                     "The free path is your plan this month. What follows is noted for later, in case circumstances ease.", [
            _callout("A CLEARLY LABELLED LATER, IF IT FITS",
                     "Because " + reason + ", no paid program leads your plan. The option below is noted for later, if circumstances ease and only if it genuinely fits. Nothing in this report asks you to spend, and the anchor practice remains the whole recommendation.",
                     variant="care", icon="heart"),
            program_block(primary_id, "LATER, IF IT FITS"),
        ], next_line="How to find out whether any of this is true for you, over thirty days.")

    advantages = [PROGRAM_ADVANTAGES[k] for k in _advantage_keys(enriched)]
    blocks = [
        {"type": "programcase", "label": "WHY A GUIDED PROGRAM TAKES YOU FURTHER",
         "items": [{"title": t, "body": b, "icon": ic} for (t, b, ic) in advantages]},
        program_block(primary_id, "YOUR BEST FIT" + (" · " + location if location else "")),
    ]
    if secondary_id:
        blocks.append(program_block(secondary_id, "ALSO MADE FOR YOU"))

    good_to_know = []
    if enriched["areas"]["EC"]["band"] in ("Steady", "Strong"):
        good_to_know.append("close to home, in small culturally comfortable groups")
    if enriched["handoff"]["lead_with"] in ("down-regulation", "gentleness"):
        good_to_know.append("gently paced rather than intensive")
    if good_to_know:
        note = "Both programs are " + _join_names(good_to_know) + ", the format this report shows fits you best."
    else:
        note = "Both programs match the format this report shows fits you best."
    if mention_id:
        note += " " + PROGRAMS[mention_id]["title"] + " joins the same shelf whenever your circumstances open it up."
    blocks.append(_callout("GOOD TO KNOW", note, icon="info"))

    cta_body = ("These programs are the closest match"
                + (" in " + location if location else "")
                + " to the pattern this reflection found, chosen for your time, your setting and the exact thing you are working on. Small group places fill quickly, and the sooner you begin, the sooner your pattern can begin to change. Reserve your place, bring the practice you have already started, and let the room do the rest.")
    blocks.append({"type": "cta", "label": "TAKE YOUR PLACE", "body": cta_body})

    return _page(21, PART_FIVE, "Your plan · 6 of 6", "The programs made for where you are",
                 "Chosen for exactly the pattern this reflection found. This is where the work you have begun becomes something you do with expert guidance, in a room built for it.",
                 blocks, next_line="How to find out whether any of this is true for you, over thirty days.")


# ---------------------------------------------------------------------------
# Part six: after this, pages 22 to 25
# ---------------------------------------------------------------------------

def _p22_thirty_days(enriched):
    gentle = enriched["safety"]["tier"] != "none"
    weeks = [
        ("WEEK ONE", "Build the cue",
         "Use your anchor on at least three days. Record only whether it felt easier, the same, or harder. Three honest days are worth more than seven forced ones.", "target"),
        ("WEEK TWO", "Protect one boundary",
         "Choose one boundary that serves the anchor and let a trusted person know. Keep the cue even when the boundary slips. The cue is the experiment. The rest is just weather.", "shield"),
        ("WEEK THREE", "Add one gentle support" if not gentle else "Only if it feels kind",
         "Choose one optional support, whichever made things simpler in week one. Add only that one. Subtraction is always allowed." if not gentle else
         "If, and only if, the anchor has felt kind, you may add one optional support. Not adding anything is an equally good outcome this week.", "sparkles"),
        ("WEEK FOUR", "Retake and choose",
         "Repeat the reflection. Continue the free supports, consider a suitable program, or revise the starting point if the pattern did not move. All of these are useful outcomes.", "refresh"),
    ]
    notice_rows = [
        ["After the anchor", "How did it feel?", "Easier, same, or harder", "Tests the core idea directly"],
        ["Next morning", "How restored do you feel?", "More, unchanged, or less", "Tracks recovery rather than perfection"],
        ["First demanding task", "How hard was it to begin?", "Easier, same, or harder", "Tracks usable energy where it counts"],
        ["End of the week", "Did the plan fit real life?", "Fit, partly, or did not fit", "Separates whether it works from whether it is doable"],
    ]
    blocks = [
        _cards(weeks, columns=4),
        {"type": "table", "title": "WHAT TO NOTICE, IN FOUR MOMENTS",
         "columns": ["Moment", "The question", "Your options", "Why it is worth noticing"],
         "rows": notice_rows},
        _row([
            _callout("WHEN TO REFLECT AGAIN",
                     "A short check after seven days, and the complete reflection after thirty days or after a program. When you compare, look at direction and lived experience rather than small differences. Your before and after pair is what turns this report from a snapshot into a story about your own year.",
                     icon="calendar"),
            {"type": "list", "label": "QUESTIONS WORTH CARRYING", "icon": "arrow", "items": [
                {"text": "What changes when your day has a clear seam in it, even if the workload does not?", "icon": "arrow"},
                {"text": "Which of your strengths best protects this experiment without becoming another demand?", "icon": "arrow"},
                {"text": "What is the smallest form of enough you can recognise in a real week?", "icon": "arrow"},
            ]},
        ]),
    ]
    if gentle:
        blocks.append(_callout("A GENTLE NOTE, WORTH TAKING SERIOUSLY",
            "Some of what you shared points to a heavier stretch right now. Feeling this way is more common than it looks from the inside, and it is worth taking seriously rather than pushing through. Sharing how you are doing with someone you trust, or with a qualified professional, is a real and worthwhile step, and it can sit alongside everything in this plan.",
            variant="care", icon="heart"))
    blocks.append(_callout("ON THE DAYS IT DOES NOT GO WELL",
        "You will miss days. That is expected, and it is built into the design of this plan rather than being a failure of it. A missed day tells you something about fit, which is genuinely useful information. If several days slip, the right response is to make the practice smaller rather than to try harder, and certainly rather than to think less of yourself. The plan should shrink before self judgement grows.",
        variant="synthesis", icon="heart"))
    return _page(21, PART_SIX, "Your next month", "A thirty day experiment",
                 "The purpose is to learn something about your own life, not to complete a perfect routine. One repeated cue becomes the spine. Everything else stays optional.",
                 blocks, next_line="What stands behind everything you have just read.")


def _p23_what_stands_behind(enriched):
    supported = [a["name"] for a in enriched["areas"].values()
                 if a["read_type"] == "supported" and a["band"] is not None]
    unread = [a["name"] for a in enriched["areas"].values() if a["band"] is None]
    careful = (
        (_join_names(supported) + " rest on fewer questions, so they are offered for you to test rather than asserted. " if supported else "")
        + (_join_names(unread) + " were left unread rather than guessed. " if unread else "")
        + "That difference in wording is deliberate, and it is worth trusting when you read it."
    )
    return _page(22, PART_SIX, "About this reflection", "What stands behind this report",
                 "A report that asks for your trust should be equally clear about where it is confident, where it is not, and what happens to what you shared.", [
        _cards([
            ("HOW YOUR READING WAS FORMED", None,
             "Each of the nine areas is read using established wellbeing questionnaires that have been tested and used in published research. They ask about how life feels rather than screening for any condition, and your answers were translated into the four broad words used throughout this report. The specific measures behind each area are listed in the appendix.",
             "flask"),
            ("WHAT THE SHORT EXERCISES ADDED", None,
             "The brief interactive moments, such as the breathing minute and the body map, add texture to the picture. They are sensitive to the kind of day you were having, so they are used to deepen or question what your answers already suggested. They are never used on their own to raise a concern.",
             "waves"),
            ("HOW YOUR LIFE SHAPED THE SUGGESTIONS", None,
             "What you told this reflection about your roles, your priorities, what gets in your way, and what you have already tried shaped the words in this report and the suggestions in it. Your circumstances change what is recommended to you. They never change how any area was read.",
             "home"),
            ("WHERE THIS REPORT SPEAKS CAREFULLY", None,
             "Most of your areas rest on a full set of questions and are described plainly. " + careful,
             "scale"),
        ], columns=2),
        _callout("YOUR PRIVACY",
                 "This report belongs to you. Your individual answers, your readings, and your suggestions are never shared with an employer, and there is no route in the system for that to happen. Where organisations receive anything at all, it is combined across many people, with small groups withheld entirely so that no individual can be identified. Your name and identifying details are kept out of any pattern the system learns from. Nothing is collected that this reflection does not need.",
                 icon="lock"),
        {"type": "list", "label": "THE LIMITS OF A SINGLE REFLECTION", "items": [
            {"text": "One sitting reflects one day. This report describes how things feel now. It cannot establish what caused what, and a different week might read differently.", "icon": "info"},
            {"text": "The short exercises are not tests. They are not measures of ability, intelligence, or health, and nothing in them is a medical reading.", "icon": "info"},
            {"text": "Program suggestions describe fit. They match your pattern to a design. They are not predictions of benefit, and no outcome is promised anywhere in this report.", "icon": "info"},
            {"text": "This is not care. If something feels persistently heavy, unsafe, painful, or hard to manage, speaking with someone you trust or a qualified professional is a real and worthwhile step.", "icon": "info"},
        ]},
        _para("The point of this report is not to explain you completely. It is to give you a truer place to begin.",
              lead="THE CLOSING LINE"),
    ], next_line="The appendix: every measure and study named in full.")


def _p24_appendix_measures(enriched):
    scored_codes = {c for c, a in enriched["areas"].items() if a["band"] is not None}
    ordered = [c for c in AREA_ORDER if c in scored_codes]
    measure_rows = [[AREA_CODE_TO_NAME[c], MEASURE_ROWS[c][0], MEASURE_ROWS[c][1]] for c in ordered]

    return _page(23, PART_SIX, "Appendix · 1 of 2", "The measures behind your reading",
                 "For readers who would like to know what stands behind each part of this report. Nothing here is required in order to use your reflection, and none of it changes what your report says.", [
        {"type": "table", "title": "THE MEASURES BEHIND EACH OF THE NINE AREAS",
         "columns": ["Area", "Established measure used", "What it is designed to capture"],
         "rows": measure_rows},
        _para("These measures were chosen because they are published, widely used, and freely available, and because they ask about wellbeing rather than screening for illness. Their wording is never altered. Research practice treats short measures like these as indicating a broad range rather than a precise value, which is why this report speaks in four broad words rather than scores."),
        _callout("THE RESEARCH BEHIND THE CONNECTIONS DESCRIBED IN YOUR REPORT",
                 "The idea that effort carries a cost into the next day unless recovery follows it comes from research on work and recovery (Meijman and Mulder, 1998). The observation that strain in one area of life tends to spread into neighbouring areas, while intact strengths slow that spread, comes from work on personal resources (Hobfoll, 1989). Difficulty mentally switching off is one of the most consistently studied patterns in this field, and is associated with poorer rest and lower next morning energy across many studies (Sonnentag and Fritz, 2007; 2015). The reason your report treats the short interactive exercises as texture rather than evidence is that single session tasks are known to be informative about a day and unreliable about a person (Hedge, Powell and Sumner, 2018).",
                 icon="book"),
    ], next_line="The research behind your practices and the programs suggested to you.")


def _p25_appendix_research(enriched):
    anchor = _pick_anchor(enriched)
    supports = _build_supports(enriched)
    practice_keys, seen = [], set()
    for key in anchor["practice_keys"] + ["self_kindness"] + [k for s in supports for k in s["practice_keys"]]:
        if key not in seen:
            seen.add(key)
            practice_keys.append(key)
    practices_prose = " ".join(PRACTICE_RESEARCH[k] for k in practice_keys if k in PRACTICE_RESEARCH)

    cap = enriched["commerce"]["cap"]
    program_prose = ""
    if cap != "suppressed":
        primary_id, secondary_id, mention_id = _pick_programs(enriched)
        shown = [primary_id, mention_id] if cap == "free_low_cost_only" else [primary_id, secondary_id, mention_id]
        keys, seen_p = [], set()
        for pid in shown:
            if pid and PROGRAMS[pid]["research_key"] not in seen_p:
                seen_p.add(PROGRAMS[pid]["research_key"])
                keys.append(PROGRAMS[pid]["research_key"])
        program_prose = " ".join(PROGRAM_RESEARCH[k] for k in keys if k in PROGRAM_RESEARCH)

    meta = enriched["meta"]
    prepared = " · ".join(x for x in [
        "Prepared for " + meta["name"] if meta["name"] else "Prepared for User",
        meta["date"], meta["location"], "A private, non-clinical wellbeing reflection",
    ] if x)

    blocks = [
        _callout("BEHIND YOUR SUGGESTED PRACTICES", practices_prose, icon="book"),
    ]
    if program_prose:
        blocks.append(_callout("BEHIND THE PROGRAMS SUGGESTED TO YOU", program_prose, icon="book"))
    blocks.append(_callout("HOW TO READ ANY OF THIS",
        "Every study named here describes patterns across groups of people, which is the honest currency of wellbeing research. They are good reasons to expect that a practice or a program design is worth your time. They are not predictions about you specifically, and no finding here promises you a result. That distinction is the difference between evidence and marketing, and this report stays firmly on the evidence side of it.",
        variant="synthesis", icon="scale"))
    blocks.append({"type": "colophon", "title": "Your Lewis Insight Report",
                   "prepared": prepared, "line": NON_CLINICAL_LINE})

    return _page(24, PART_SIX, "Appendix · 2 of 2", "The research behind what was suggested",
                 "Every practice and program in this report was chosen for a reason that can be named and checked. Here are those reasons in full.",
                 blocks)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def build_insight_report(enriched: dict) -> dict:
    body = [
        _p03_how_to_read(enriched),
        _p04_four_words(enriched),
        _p05_where_you_are(enriched),
        _p06_what_it_tells_you(enriched),
        _p07_the_shape(enriched),
        _p08_what_each_area_asks(enriched),
        _p09_moves_together(enriched),
        _p10_reading_connections(enriched),
        _p11_how_stress_shows_up(enriched),
        _p12_where_tension_settles(enriched),
        _p13_closer_one(enriched),
        _p14_closer_two(enriched),
        _p15_closer_three(enriched),
        _p16_pathway(enriched),
        _p17_anchor(enriched),
        _p18_seven_days(enriched),
        _p19_supports(enriched),
        _p20_choosing(enriched),
        _p22_thirty_days(enriched),
        _p23_what_stands_behind(enriched),
        _p24_appendix_measures(enriched),
        _p25_appendix_research(enriched),
    ]
    pages = [_p01_cover(enriched), _p02_contents(enriched, body)] + body

    return {
        "version": "4.0",
        "meta": {
            "name": enriched["meta"]["name"],
            "date": enriched["meta"]["date"],
            "location": enriched["meta"]["location"],
            "footer": FOOTER,
            "non_clinical_line": NON_CLINICAL_LINE,
            "appendix_header": "Appendix · the research behind this report",
        },
        "pages": pages,
    }
