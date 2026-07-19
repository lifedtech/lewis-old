# insight_report.py — the deterministic 16-page LEWIS Insight Report.
#
# Implements Part B of the Insight Report Generation Rulebook v3.0.
# Input: the enriched object (enrich.build_enriched_object). Output: a
# structured JSON document of 16 pages of typed blocks that the frontend
# renders in the approved report style and prints to PDF.
#
# Contract highlights enforced here by construction:
#   - Four band words only; no numeric score, percentile or internal label
#     ever reaches a page (rulebook §6, §8.4).
#   - No em-dashes or en-dashes anywhere in the document (§8.2).
#   - Strengths are named before stretched areas when the shape is uneven.
#   - Connections describe company, never cause (§9 p5).
#   - The free anchor precedes any paid suggestion; commerce is gated (§13).
#   - Research appears only on page 16, bound to §18.
#   - Safety tiers make the report gentler and shorter, never more
#     analytical (§16).
#
# The report_gate module re-checks all of this mechanically before the
# API returns the document (§17: the self-check gate).

from enrich import AREA_CODE_TO_NAME, BAND_STEP

FOOTER = "Private to you · a non-clinical wellbeing reflection"
NON_CLINICAL_LINE = (
    "LEWIS is a private, non-clinical reflection. It reads how life feels across "
    "nine areas and suggests what may fit. It does not diagnose, grade, or replace "
    "professional care."
)

BAND_GLOSS = {
    "Running on empty": "This area needs the gentlest care right now.",
    "Under pressure": "Stretched, and asking for attention.",
    "Steady": "Holding reliably, without strain.",
    "Strong": "A real strength, and a place to stand.",
}

LOW_BANDS = ("Under pressure", "Running on empty")

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
# Programs (page 13), with commerce gating (§13.3).
# ---------------------------------------------------------------------------

PROGRAMS = {
    "evening_winddown": {
        "tag": "BEST FIT FOR YOU",
        "title": "Evening wind down practice series",
        "what": "Four small group, in person sessions of forty five minutes each, in the early evening. Gentle settling, body release, and a repeatable closing ritual that you keep afterwards. No performance tracking of any kind.",
        "why": "It works on exactly the boundary this report identifies as your starting point, and it teaches the transition rather than asking you to already be calm. The sessions are short, and the early evening timing means you practise the skill at the hour you actually need it.",
        "check": "Ask whether the sessions build on each other, and whether you keep the practice afterwards. A series that leaves you with a portable habit is worth more than four pleasant evenings.",
        "research_key": "recovery_course",
    },
    "restorative_day": {
        "tag": "WORTH CONSIDERING LATER",
        "title": "Restorative movement and deep rest day",
        "what": "A half day experience with unhurried mobility, guided rest, and quiet breaks. No intensive physical demand, and no overnight commitment.",
        "why": "It is gentle rather than challenging, which matters while stopping is not yet fully restorative for you. It gives your body a longer experience of genuine rest without asking you to perform. Consider it after your first seven days, once you have some sense of whether recovery is starting to arrive.",
        "check": "Ask what the pacing looks like and what can be skipped. A day that packs its timetable will leave you more activated than when you arrived, which would be the opposite of the point.",
        "research_key": "gentle_movement",
    },
    "gentle_movement": {
        "tag": "BEST FIT FOR YOU",
        "title": "Gentle movement series for low energy seasons",
        "what": "Short, low intensity group sessions of unhurried, breath led movement, designed for people whose energy is currently thin. No fitness goals, no measurements, no intensity progression.",
        "why": "Demanding exercise asks your body for reserves it does not currently have. Low intensity movement is the version research supports for a season like yours: it adds energy rather than spending it, and the group setting supplies gentle accountability without pressure.",
        "check": "Ask whether sessions can be scaled down on a tired day, and whether resting during a session is explicitly welcome. The answer tells you whether the design matches its description.",
        "research_key": "low_intensity_movement",
    },
    "connection_circle": {
        "tag": "BEST FIT FOR YOU",
        "title": "Small guided connection circle",
        "what": "A small, facilitated group that meets a few times to practise unhurried conversation. No sharing requirements, no performance, and a facilitator whose job is to keep it safe and light.",
        "why": "Your reflection points to connection as the place where a little structure would help most. A small guided format lowers the cost of reaching out by making the first move for you: the time is set, the people arrive, and the conversation is held.",
        "check": "Ask how large the group is and what happens if you prefer to mostly listen at first. A good host will treat listening as full participation.",
        "research_key": "small_group",
    },
    "nature_mornings": {
        "tag": "A GOOD FIT",
        "title": "Nature immersion morning walks",
        "what": "Guided, unhurried group walks in green surroundings, early in the day. More noticing than exercising, with no pace requirements.",
        "why": "Time in green surroundings is one of the most reliably supportive habits in wellbeing research, and a scheduled group walk protects the time in a way good intentions rarely do.",
        "check": "Ask about the pace and whether the walk includes quiet time. A walk that is really a workout serves a different purpose than this one.",
        "research_key": "nature_contact",
    },
}


def _pick_programs(enriched):
    lead = enriched["handoff"]["lead_with"]
    focus = enriched["handoff"]["primary_focus"]
    recovery = (enriched["patterns"]["recovery_load"] or {}).get("label", "")
    ctx_recovery = enriched["context"].get("recovery")

    if lead == "down-regulation" or focus in ("PH", "EM"):
        primary = "evening_winddown"
    elif lead == "gentle activation" or focus == "EN":
        primary = "gentle_movement"
    elif focus == "RS":
        primary = "connection_circle"
    else:
        primary = "nature_mornings"

    secondary = None
    if recovery == "Carrying a lot" or ctx_recovery in ("still_tired", "anxious_at_rest"):
        secondary = "restorative_day" if primary != "restorative_day" else None
    if secondary is None and primary != "nature_mornings":
        secondary = None  # a second program must earn its place; none forced

    saved = "nature_mornings" if primary != "nature_mornings" and lead == "down-regulation" else None
    return primary, secondary, saved


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

def _page(number, eyebrow, title, subtitle, blocks):
    return {
        "number": number,
        "eyebrow": eyebrow,
        "title": title,
        "subtitle": subtitle,
        "blocks": [b for b in blocks if b],
    }


def _para(text, lead=None):
    return {"type": "paragraph", "text": text, "lead": lead}


def _callout(label, body, variant="info", title=None):
    return {"type": "callout", "label": label, "title": title, "body": body, "variant": variant}


def _cards(items, columns=2):
    return {"type": "cards", "columns": columns,
            "items": [{"label": l, "title": t, "body": b} for (l, t, b) in items]}


def _sorted_areas(enriched, strengths_first=True):
    areas = [a for a in enriched["areas"].values() if a["band"] is not None]
    return sorted(areas, key=lambda a: a["score"], reverse=strengths_first)


def _area_name(enriched, code):
    return enriched["areas"][code]["name"] if code and code in enriched["areas"] else None


# ---------------------------------------------------------------------------
# Pages 1 to 6: the reading
# ---------------------------------------------------------------------------

def _p1_cover(enriched):
    meta = enriched["meta"]
    prepared = " / ".join(x for x in [
        f"Prepared for {meta['name']}" if meta["name"] else "Prepared for you",
        meta["date"], meta["location"],
    ] if x)
    return _page(1, "LIFED · LEWIS · FULL REFLECTION", "Your LEWIS Insight Report",
                 "A whole-person reading of what is holding you, what is stretched, how the pieces move together, and where a small change may travel furthest.", [
        _para(prepared, lead="YOUR COMPLETE WELLBEING REFLECTION"),
        _para("A private reflection, prepared from your full journey."),
        _cards([
            ("WHAT THIS REPORT IS", None,
             "A reflection of how your wellbeing is arranged right now, across nine areas of life, written to be read slowly and returned to."),
            ("HOW IT WAS BUILT", None,
             "Your answers were read using established wellbeing measures used in published research. The studies behind each area are listed in the appendix."),
        ], columns=2),
        _callout(None, NON_CLINICAL_LINE, variant="footer"),
    ])


def _p2_orientation(enriched):
    meta = enriched["meta"]
    who = meta["name"] or "you"
    return _page(2, "ORIENTATION", "How to read this reflection",
                 "This report is built to be read slowly. It begins with what is already supporting you, names what is stretched, shows how the two connect, and only then suggests what to try.", [
        _callout("THE CENTRAL IDEA",
                 "This is a picture of how your wellbeing is arranged right now. It is a season, not a personality type, and not a verdict. A future reflection may look different, because your life can look different.",
                 variant="info"),
        _cards([
            ("FIRST", "Your whole picture",
             "Nine areas of life are read together, so a strong part of your life is never erased by one difficult stretch, and a difficult stretch is never hidden behind a capable exterior."),
            ("SECOND", "What moves together",
             "Some areas rise and fall alongside each other. Noticing which ones travel together helps you find the place where a small effort is likely to reach furthest."),
            ("THIRD", "The texture of your days",
             "Your rhythm, your stress pattern, where tension settles in your body, and how the short exercises felt all add colour to the picture."),
            ("FOURTH", "A right-sized next step",
             "Suggestions are matched to the area asking for care, what gets in your way, the kind of support you prefer, and how much plan genuinely fits your life this month."),
        ], columns=2),
        {"type": "bandwords", "items": [
            {"band": b, "gloss": BAND_GLOSS[b]}
            for b in ("Running on empty", "Under pressure", "Steady", "Strong")
        ]},
        _para("These four words are used instead of scores on purpose. A single sitting can place you honestly within a broad range, and a broad range is what this report gives you. A number would suggest a precision that no short reflection can carry, and it would invite you to grade yourself rather than understand yourself."),
        _callout("WHAT THIS REPORT CAN SAY, AND WHAT IT CANNOT",
                 "It can say how your wellbeing feels arranged today, which areas seem to travel together, and which small change is most likely to be worth your effort. It cannot say what caused what, how you will feel next month, or anything about your health in a medical sense. Where this report is confident, it speaks plainly. Where it is less certain, it says so rather than pretending."),
        _callout("A NOTE ON COMPARISON",
                 "You will not find yourself ranked against other people here. Comparison tends to produce anxiety rather than insight, and the honest answer to how do I compare usually needs far more information than one reflection can gather. This report compares you only to yourself, and invites you to do the same when you retake it."),
    ])


def _p3_where_you_are(enriched):
    ctx = enriched["context"]
    portrait = enriched["portrait"] or {}
    headline = PORTRAIT_HEADLINE.get(portrait.get("id"), "Where you are right now")
    refine = PORTRAIT_REFINE.get(portrait.get("id"), "The full picture is described in the pages that follow.")

    arrival = ctx["arrival_word"]
    if arrival:
        opening = f'You arrived with one word: "{arrival}". {refine}'
    else:
        opening = f"However you arrived today, you are here, and that counts. {refine}"

    bright = _area_name(enriched, enriched["bright_code"])
    primary = _area_name(enriched, enriched["leverage"]["primary"])
    downstream = [_area_name(enriched, c) for c in enriched["leverage"]["downstream"]]
    anchor = _pick_anchor(enriched)

    map_cards = []
    strengths = [_area_name(enriched, c) for c in enriched["strength_codes"][:3]]
    if strengths:
        map_cards.append(("A PLACE TO STAND", " · ".join(s for s in strengths if s),
                          "Your ground, doing real work. It holds you up."))
    if primary:
        star = " ★ Also what you said matters most" if _tension_matches_primary(enriched) else ""
        map_cards.append(("ASKING FOR CARE", primary,
                          f"Where effort may travel furthest right now.{star}"))
    if downstream:
        map_cards.append(("SITS DOWNSTREAM", " · ".join(d for d in downstream if d),
                          "Often eases as the starting point eases."))
    map_cards.append(("YOUR FIRST STEP", anchor["title"],
                      "Small enough to survive a crowded day."))

    blocks = [
        _para(f"{headline}. This describes your current season, not the kind of person you are.", lead="YOUR REFLECTION"),
        _para(opening),
    ]

    if enriched["safety"]["tier"] != "none":
        blocks.append(_callout("A NOTE OF CARE, FIRST",
            "A lot in your answers is asking for care right now. That is not a failure. It is information, and it deserves kindness. This report stays deliberately small and gentle because of it, and if things feel heavy, sharing how you are doing with someone you trust, or a qualified professional, is a real and worthwhile step.",
            variant="care"))

    blocks.append(_cards(map_cards, columns=2))

    shape = enriched["lwi"]["shape"]
    strengths_names = [s for s in strengths if s]
    stretched_names = [_area_name(enriched, c) for c in enriched["stretched_codes"][:3]]
    if shape == "uneven" and strengths_names:
        blocks.append(_para(
            f"Your reflection has a distinctly uneven shape, and that unevenness is worth understanding. "
            f"{', '.join(strengths_names)}: these are not merely intact. They are doing real, load bearing work, and they are exactly why you keep functioning even when reserves run thin. They are also why the thinness can stay invisible to everyone around you."
        ))
        if stretched_names:
            blocks.append(_para(
                f"Underneath that, the pattern in {_join_names([_prose(n) for n in stretched_names])} reads stretched. Responsibility has been arriving on schedule. Recovery has not. The result is not simply feeling tired. It is having less usable reserve at the moment you want to begin something, and carrying the day further into the evening than you would choose."
            ))
    else:
        blocks.append(_para(
            "Your picture is fairly even across its areas. That evenness is itself useful information: no single part of life is dragging the rest, and the invitation is closer to maintenance than repair."
        ))

    if primary:
        blocks.append(_para(
            f"This is why the most useful starting point for you is not motivation, and it is not a bigger routine. It is one small, repeatable practice aimed at your {_prose(primary)}. If that reads as true to you, caring for it first may let the nearby areas ease on their own."
        ))

    tension = enriched["patterns"]["priority_tension"]
    top_priority = ctx["top_priority"]
    if top_priority:
        confirmed = tension is not None and tension.get("firmness") == "plain"
        if confirmed:
            matters = (
                f"When asked what matters most right now, you placed {_prose(str(top_priority))} at the top. It is also an area under real strain, and when that was reflected back to you, you confirmed it fits. That agreement is why this report speaks about it plainly rather than tentatively. The starting point is one you already recognise as yours."
            )
        else:
            matters = (
                f"When asked what matters most right now, you placed {_prose(str(top_priority))} at the top. This report keeps that priority in view throughout: what is suggested is chosen to protect what you said matters, not to compete with it."
            )
        blocks.append(_callout("WHAT MATTERS MOST TO YOU", matters))

    return _page(3, "YOUR REFLECTION", "Where you are right now",
                 f"{headline}. A season, not a type.", blocks)


def _tension_matches_primary(enriched):
    tension = enriched["patterns"]["priority_tension"]
    if not tension:
        return False
    from scoring import KEY_TO_SPEC_CODE
    return KEY_TO_SPEC_CODE.get(tension.get("dimension")) == enriched["leverage"]["primary"]


def _p4_shape(enriched):
    areas_sorted = _sorted_areas(enriched)
    overall = enriched["lwi"]["band"] or "Steady"
    shape = enriched["lwi"]["shape"]

    wheel_items = [{"name": a["name"], "band": a["band"], "step": a["step"]}
                   for a in areas_sorted]
    unread = [a["name"] for a in enriched["areas"].values() if a["band"] is None]

    if shape == "uneven":
        shape_note = (
            f"{overall} overall, but uneven. The overall word describes the whole field. It does not cancel the genuine "
            "stretch in the areas asking for care. A shape like this usually means your strengths are quietly subsidising "
            "the areas that are stretched, which works for a while and is worth noticing before it stops working."
        )
    else:
        shape_note = (
            f"{overall} overall, and fairly even. No single area is carrying the others, and no single area is dragging them. "
            "The most useful move in an even season is usually protecting what already works."
        )

    table_rows = [[a["name"], a["band"], a["asking_about"]] for a in areas_sorted]
    for name in unread:
        area = next(x for x in enriched["areas"].values() if x["name"] == name)
        table_rows.append([name, "Not read", area["asking_about"]])

    supported = [a["name"] for a in enriched["areas"].values()
                 if a["read_type"] == "supported" and a["band"] is not None]
    clear_count = sum(1 for a in enriched["areas"].values() if a["read_type"] == "clear")
    certainty = (
        f"Most of your areas can be spoken about plainly, because your answers were clear and consistent. "
        + (f"{_join_names(supported)} are described a little more carefully. They rest on a smaller, more indirect set of questions, so this report offers them as a reading you are invited to test against your own experience rather than as a settled conclusion. You will notice the wording shift accordingly when you reach them."
           if supported else
           "Where any area rests on fewer questions, the wording softens accordingly, and you can trust that shift when you read it.")
        + (f" {_join_names(unread)} were left unread rather than guessed." if unread else "")
    )

    return _page(4, "THE NINE AREAS", "The shape of your wellbeing",
                 "Nine areas of life, read together. The shape matters more than any single area, because it shows you where your strength is and where your effort is most needed.", [
        {"type": "wheel", "overall": overall, "items": wheel_items,
         "note": "Each area grows in four steps only, matching the four words on the previous page."},
        {"type": "bands", "title": "YOUR AREAS, STRENGTHS FIRST",
         "items": wheel_items},
        _callout("THE OVERALL SHAPE", shape_note),
        {"type": "table", "title": "WHAT EACH AREA COVERS",
         "columns": ["Area", "Your reading", "What this area is asking about"],
         "rows": table_rows},
        _callout("WHERE THIS REPORT IS MOST AND LEAST CERTAIN", certainty),
    ])


def _join_names(names):
    names = [n for n in names if n]
    if not names:
        return ""
    if len(names) == 1:
        return names[0]
    return ", ".join(names[:-1]) + " and " + names[-1]


def _prose(name):
    """An area name as it should appear inside a sentence."""
    return name.lower().replace(" & ", " and ") if name else name


def _p5_connections(enriched):
    primary = enriched["leverage"]["primary"]
    primary_name = _area_name(enriched, primary)
    connections = enriched["connections"]
    blocks = []

    link_cards = []
    for i, link in enumerate(connections):
        a_name = _area_name(enriched, link["a"])
        b_name = _area_name(enriched, link["b"])
        if not a_name or not b_name:
            continue
        label = "THE CLEAREST LINK" if link["rank"] == "clearest" else "THE SECOND LINK"
        body = (
            f"When {_prose(a_name)} is stretched, {_prose(b_name)} tends to feel it too. The two appear to move together in your reflection. This is company, not cause: it says where a single change is likely to reach more than one place, and nothing more."
        )
        link_cards.append((label, f"{a_name} and {_prose(b_name)}", body))

    strengths = [_area_name(enriched, c) for c in enriched["strength_codes"][:3]]
    strengths = [s for s in strengths if s]
    if strengths:
        link_cards.append((
            "YOUR PROTECTIVE GROUND", _join_names(strengths),
            "These are genuinely holding, and they are practical resources rather than pleasant extras. They can protect your time, hold you gently accountable, and supply patience with yourself while the rest steadies."
        ))

    if primary_name:
        if enriched["leverage"]["is_lowest"]:
            begin_body = (
                f"Your {_prose(primary_name)} is both the area under the most strain and the one with the clearest links outward, which makes it the natural place to begin. A small change there is likely to travel further than effort spent anywhere else."
            )
        else:
            lowest_name = _area_name(enriched, enriched["leverage"]["lowest"])
            begin_body = (
                f"The most stretched area is not automatically the best place to start. Here, your {_prose(primary_name)} has the clearest links outward to what else is low"
                + (f", including your {_prose(lowest_name)}" if lowest_name and lowest_name != primary_name else "")
                + ", which means a small change there is likely to travel further than pushing directly at the lowest point."
            )
        link_cards.append(("WHERE TO BEGIN", primary_name, begin_body))

    if link_cards:
        blocks.append(_cards(link_cards, columns=2))
    else:
        blocks.append(_para(
            "No area in your reflection stands out as pulling on the others. Your picture is balanced enough that no connection line would be honest, so none is drawn. The invitation is maintenance: keep doing what already works."
        ))

    summary_bits = []
    if primary_name:
        summary_bits.append(f"your {_prose(primary_name)} is the clearest place to begin")
    downstream_names = [_area_name(enriched, c) for c in enriched["leverage"]["downstream"]]
    downstream_names = [d for d in downstream_names if d]
    if downstream_names:
        summary_bits.append(f"{_join_names([_prose(d) for d in downstream_names])} {'sits' if len(downstream_names) == 1 else 'sit'} close alongside it")
    if strengths:
        summary_bits.append("your strong areas stand apart as ground you can rely on while the rest steadies")
    if summary_bits:
        blocks.insert(0, _para("In short: " + ", ".join(summary_bits) + ".", lead="READ AS ONE SENTENCE"))

    blocks.append(_callout("WORTH HOLDING LIGHTLY",
        "This reflection comes from a single sitting, on a particular day. It can point you toward a useful place to start, but it cannot tell you what caused what. The honest test is whether this pattern shifts when your life shifts, which is exactly what the thirty day experiment later in this report is designed to help you notice."))

    return _page(5, "HOW IT CONNECTS", "What seems to move together",
                 "These are areas that appear to rise and fall alongside each other in your reflection. They describe company, not cause. Knowing which areas travel together tells you where a single change is likely to reach more than one place.", blocks)


def _p6_stress(enriched):
    ctx = enriched["context"]
    stress = enriched["patterns"]["stress"] or {}
    load = enriched["patterns"]["recovery_load"] or {}
    blocks = []

    arc = ctx.get("energy_arc") or {}
    if arc:
        blocks.append({
            "type": "daycurve",
            "points": [{"slot": s.title(), "level": arc.get(s)} for s in ("morning", "afternoon", "evening", "night") if arc.get(s)],
            "note": "Drawn from how you described your own day. A pattern to notice, not a measurement.",
        })

    load_label = load.get("label")
    if load_label:
        level = {"Light load": 1, "Moderate load": 2, "Carrying a lot": 3}.get(load_label, 2)
        blocks.append({
            "type": "loadbar", "level": level, "label": load_label,
            "note": "Your accumulated demands, weighed against how well rest has been restoring you.",
        })

    texture_cards = []
    stress_label = stress.get("label")
    if stress_label and stress_label != "Settled":
        texture_cards.append(("YOUR STRESS PATTERN", stress_label.replace("&", "and"),
                              "Drawn from your own description of how pressure has been showing up lately."))
    elif stress_label == "Settled":
        texture_cards.append(("YOUR STRESS PATTERN", "Mostly settled",
                              "Pressure is present, as it is for everyone, and it has not been running the day."))

    before, after = ctx.get("breathing_before"), ctx.get("breathing_after")
    if before or after:
        if before and after and before != after:
            b_body = "A small shift appeared between the start and the end of your breathing minute, when nothing was forced. That is genuinely useful information: gentle settling is available to you when the practice is unforced."
            b_title = "A little easier by the end"
        else:
            b_body = "Your minute of quiet breathing stayed roughly where it began. That is information too: settling may need a slightly longer runway, which is why nothing in your plan relies on instant calm."
            b_title = "Steady through the minute"
        texture_cards.append(("YOUR BREATHING MINUTE", b_title, b_body))

    recovery_line = RECOVERY_LINES.get(ctx.get("recovery") or "")
    if recovery_line:
        rec_title = {
            "recovered": "Stopping restores you",
            "somewhat": "Stopping is not yet fully restorative",
            "still_tired": "Stopping is not yet fully restorative",
            "anxious_at_rest": "Stopping has felt uneasy",
        }.get(ctx.get("recovery"), "Your recovery")
        texture_cards.append(("YOUR RECOVERY", rec_title, recovery_line))

    if texture_cards:
        blocks.append(_cards(texture_cards, columns=3 if len(texture_cards) >= 3 else 2))

    zones = [BODY_ZONE_WORDS[z] for z in ctx["body_zones"] if z in BODY_ZONE_WORDS]
    if zones:
        blocks.append({"type": "bodymap", "zones": zones,
                       "note": "Where you noticed tension."})

    interp = []
    if arc:
        highs = [s for s in ("morning", "afternoon", "evening", "night") if arc.get(s) == "High"]
        if "evening" in highs or "night" in highs:
            interp.append("Your energy is not uniformly low. It moves through the day and lifts again late, and your pressure tends to lift alongside it. That combination is what makes stopping feel strangely effortful: the body is tired, but the day has not fully released you. Evenings then risk becoming a second working day in disguise, filled with planning, scrolling, or problem solving, when what you actually need is a softer landing.")
        elif "morning" in highs:
            interp.append("Your day leads with its best energy and spends down from there. That shape rewards putting what matters earliest, and it means the later day should be planned as descent rather than pushed as a second climb.")
        else:
            interp.append("Your energy moves through the day in a shape worth knowing. Working with that shape, rather than overriding it, is the cheapest improvement available to you.")
    if before or after:
        interp.append("Your minute of quiet breathing is part of why your plan is sized the way it is. A modest shift, or none, points to a brief transition rather than a long routine. Small and repeatable will serve you better than ambitious and occasional.")
    if zones:
        interp.append(f"Tension clustered around your {_join_names(zones)}, and you noticed it yourself. That matters. It means you are not disconnected from your body. You are carrying a lot in a body you can still hear, which is good news for how quickly small practices tend to land.")
    for text in interp:
        blocks.append(_para(text))
    if not blocks:
        blocks.append(_para("You chose to skip most of the short exercises, so this page stays honest and short. Nothing about your rhythm or your body is guessed in their absence."))

    lead = enriched["handoff"]["lead_with"]
    why_next = {
        "down-regulation": "Because stopping is not yet fully restorative for you, intensive challenges and high commitment programs are not the right first move, even where they look appealing. The sequence that fits your current pattern is to downshift first, and build later.",
        "gentle activation": "Because energy is the scarce resource right now, everything that follows is sized to add energy rather than spend it. Gentle beats ambitious in this season, and the plan is built accordingly.",
        "simplification": "Because your days are carrying many open loops, the suggestions that follow simplify before they add. One clear seam in the day comes first; everything else stays optional.",
        "gentleness": "Because your answers are asking for care, everything that follows is deliberately small, free, and optional. Nothing in this report asks you to push.",
        "steadiness": "Because your pattern is broadly holding, the suggestions that follow are about protecting what works and reinforcing it gently, rather than repairing anything.",
    }.get(lead, "The pattern on this page is what shapes the sequence of suggestions that follows.")
    blocks.append(_callout("WHY THIS SHAPES WHAT COMES NEXT", why_next))

    return _page(6, "YOUR RHYTHM", "How stress is showing up",
                 "This is a picture of your lived pattern, drawn from your own words and choices. It is not a sleep study or a measurement of anything happening inside your body.", blocks)


# ---------------------------------------------------------------------------
# Pages 7 to 9: the closer look
# ---------------------------------------------------------------------------

REALISM_CODES = ("FW", "IG", "EC")


def _cluster_areas(enriched):
    """Page 7: the three areas nearest the starting point. Page 8: the
    strengths. Page 9: money, growth, environment (what sets what is
    realistic). Unread areas join their natural page."""
    inner = [c for c in ("MD", "RS", "AC", "EM", "PH", "EN")]
    primary = enriched["leverage"]["primary"]

    def sort_key(code):
        a = enriched["areas"][code]
        if a["score"] is None:
            return 999
        return a["score"]

    inner_sorted = sorted(inner, key=sort_key)
    if primary in inner_sorted:
        inner_sorted.remove(primary)
        inner_sorted.insert(0, primary)
    p7 = inner_sorted[:3]
    p8 = sorted(inner_sorted[3:], key=sort_key, reverse=True)
    p9 = list(REALISM_CODES)
    return p7, p8, p9


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
        "band": band_word,
        "stance": _stance_for(area),
        "paras": [{"label": l, "text": t} for (l, t) in paras],
    }


def _p7_closer_one(enriched):
    p7, _, _ = _cluster_areas(enriched)
    names = _join_names([_area_name(enriched, c) for c in p7])
    blocks = [_area_block(enriched, c) for c in p7]

    supported = [enriched["areas"][c]["name"] for c in p7
                 if enriched["areas"][c]["read_type"] == "supported" and enriched["areas"][c]["band"]]
    clear = [enriched["areas"][c]["name"] for c in p7
             if enriched["areas"][c]["read_type"] == "clear" and enriched["areas"][c]["band"]]
    synth = ""
    if clear:
        synth += f"{_join_names(clear)} can be described plainly because your answers there were clear and consistent. "
    if supported:
        synth += f"{_join_names(supported)} are offered a little more carefully, because they rest on a smaller set of questions. "
    synth += "This is deliberate. Where the picture is firm, this report says so. Where it is thinner, it says that too, and invites you to be the one who decides whether it fits."
    blocks.append(_callout("READING THESE TOGETHER", synth, variant="synthesis"))

    return _page(7, "A CLOSER LOOK · 1 OF 3", names,
                 "The three areas closest to where you are being asked to begin. They are described together because, in this season, they are moving together.", blocks)


def _p8_closer_two(enriched):
    _, p8, _ = _cluster_areas(enriched)
    names = _join_names([_area_name(enriched, c) for c in p8])
    blocks = [_area_block(enriched, c) for c in p8]
    blocks.append(_callout(
        "YOUR STRENGTHS ARE THE PLAN, NOT THE BACKGROUND",
        "It would be easy to read the stronger areas of this report as pleasant context and skip to the problems. That would be a mistake in your case. These are the resources that make any plan survivable. They protect your time, hold you accountable without shame, and supply the patience you will need on the days the plan does not go well. The suggestions ahead deliberately spend these strengths rather than leaving them idle.",
        variant="synthesis"))
    return _page(8, "A CLOSER LOOK · 2 OF 3", names,
                 "The steadier areas carrying you through this season, and how to turn each one from comfort into structure.", blocks)


def _p9_closer_three(enriched):
    _, _, p9 = _cluster_areas(enriched)
    names = _join_names([_area_name(enriched, c) for c in p9])
    blocks = [_area_block(enriched, c) for c in p9]

    fw_band = enriched["areas"]["FW"]["band"]
    ig_band = enriched["areas"]["IG"]["band"]
    ec_band = enriched["areas"]["EC"]["band"]
    bits = []
    if fw_band in ("Steady", "Strong"):
        bits.append("Your money says a paid option is possible but never necessary.")
    elif fw_band:
        bits.append("Your money says the free path is the right path, and every suggestion here respects that.")
    if ig_band in LOW_BANDS:
        bits.append("Your curiosity says keep any reading very short.")
    elif ig_band:
        bits.append("Your curiosity says keep the reading short and honestly interesting.")
    if ec_band in ("Steady", "Strong"):
        bits.append("Your belonging says stay close to familiar settings and small groups.")
    elif ec_band:
        bits.append("Your surroundings say choose settings that ask little adaptation of you.")
    synth = ("These areas do not need fixing first. What they do is set the boundaries of what is realistic for you. "
             + " ".join(bits) + " Every suggestion in the next pages sits inside those boundaries.")
    blocks.append(_callout("HOW THESE SHAPE YOUR PLAN", synth, variant="synthesis"))
    return _page(9, "A CLOSER LOOK · 3 OF 3", names,
                 "The areas that quietly shape what is realistic for you, and what kind of support is likely to fit.", blocks)


# ---------------------------------------------------------------------------
# Pages 10 to 13: the suggestions
# ---------------------------------------------------------------------------

def _p10_pathway(enriched):
    anchor = _pick_anchor(enriched)
    primary = _area_name(enriched, enriched["leverage"]["primary"])
    downstream = [_area_name(enriched, c) for c in enriched["leverage"]["downstream"]]
    downstream = [d for d in downstream if d]
    ctx = enriched["context"]
    sizing = enriched["handoff"]["habit_sizing"]

    steps = []
    if primary:
        steps.append({"tag": "START HERE", "area": primary,
                      "text": "Begin where a small change is most likely to travel. Give this area one reliable, repeatable act of care."})
    if downstream:
        steps.append({"tag": "MAY RIPPLE TO", "area": downstream[0],
                      "text": "Often eases as the starting point eases, without being worked on directly."})
    if len(downstream) > 1:
        steps.append({"tag": "THEN SUPPORTS", "area": downstream[1],
                      "text": "Sits in the same loop, and tends to follow once the first two steady."})
    if not steps:
        steps.append({"tag": "PROTECT", "area": "What already works",
                      "text": "Your picture is balanced, so the plan protects rather than repairs."})

    friction = (ctx.get("friction") or "").strip()
    friction_line = friction if friction else "your current load"

    priorities = [
        ("YOUR FIRST PRIORITY", "Create one reliable seam",
         "Give your day one repeatable cue it can learn to trust. The aim is not instant change. It is a recognisable transition your body can learn to expect, the way a door learns its own click."),
        ("YOUR SECOND PRIORITY", "Watch one honest signal",
         "Track only whether the thing this plan is aimed at feels slightly easier. That is more meaningful than chasing a dramatic difference, and considerably harder to fake."),
        ("YOUR THIRD PRIORITY", "Use your strengths as structure",
         "Let what is strong in your life decide what can wait, and let one trusted person witness the experiment. Your strengths become the conditions for change, rather than reasons to keep overextending."),
        ("YOUR PACING", "Focused, not full",
         f"Your current picture caps how much plan is wise. One anchor plus one optional support is enough. Everything else stays a saved option rather than an obligation."),
    ]

    markers = (
        "The seam you chose feels more distinct from the rest of your day. The thing you are caring for costs slightly less effort than it did. "
        "Beginning is a little easier at the moment you choose to begin. You can miss a day without the whole experiment turning into failure. "
        "These are things to observe rather than outcomes you are being promised. If the pattern does not move over the next month, that is useful information, and your next reflection should revise the starting point rather than asking you to try harder at the same one."
    )

    why_small = (
        f"You told this reflection that {friction_line} is real, and your readings show a season with limited spare capacity. "
        "A large plan under those conditions tends to fail in the first crowded week and leave you feeling worse than when you started. "
        "A very small plan that survives contact with a real week is worth considerably more than an impressive one you abandon. "
        "If it feels almost too easy, it has been sized correctly."
    )

    return _page(10, "YOUR SUGGESTIONS · 1 OF 4", "Your improvement pathway",
                 "A focused plan, deliberately reduced to fit this particular season. Lower intensity is not lower ambition. It is the fit for right now.", [
        {"type": "flow", "steps": steps, "first_move": f"Your first move: {anchor['first_move']}"},
        _callout("THE SHAPE OF THE RECOMMENDATION",
                 ("Downshift before building. " if enriched["handoff"]["lead_with"] == "down-regulation" else "")
                 + "Begin at the one place where your pressures, your pattern, and your day all meet. Keep the action small enough that a crowded day cannot defeat it. This plan is designed to survive your hardest ordinary day, not to impress your easiest one."),
        _cards(priorities, columns=2),
        _callout("WHAT IMPROVEMENT WOULD LOOK LIKE FOR YOU", markers),
        _callout("WHY THIS PLAN IS SMALLER THAN YOU MIGHT EXPECT", why_small, variant="synthesis"),
    ])


def _p11_anchor(enriched):
    anchor = _pick_anchor(enriched)
    return _page(11, "YOUR SUGGESTIONS · 2 OF 4", "Your anchor practice",
                 "One practice, described properly. This is the single thing this report would ask you to keep if you kept nothing else.", [
        {"type": "practice", "tag": anchor["tag"], "title": anchor["title"], "cols": [
            {"label": "WHEN", "text": anchor["when"]},
            {"label": "WHAT YOU DO", "text": anchor["what"]},
            {"label": "WHY IT IS THIS SMALL", "text": anchor["why_small"]},
        ]},
        _cards([
            ("HOW TO SET IT UP TONIGHT", None, anchor["setup"]),
            ("WHAT IT SHOULD FEEL LIKE", None, anchor["feel"]),
            ("PERMISSIONS, SO THIS STAYS GENTLE", None, anchor["permissions"]),
            ("IF YOU FORGET, WHICH YOU WILL", None, anchor["forget"]),
        ], columns=2),
        {"type": "sevendays", "title": "YOUR NEXT SEVEN DAYS",
         "rows": [{"day": d, "focus": f, "action": a} for (d, f, a) in anchor["seven_days"]]},
        _callout(anchor["why_this"][0], anchor["why_this"][1], variant="synthesis"),
    ])


def _p12_supports(enriched):
    supports = _build_supports(enriched)
    choose_rows = [list(CHOOSE_ROWS[s["id"]]) for s in supports if s["id"] in CHOOSE_ROWS]
    choose_rows.append(["You are already at capacity", "None of them",
                        "The anchor alone is a complete plan. Additions are genuinely optional"])
    adjustments = _adjustment_cards(enriched)
    return _page(12, "YOUR SUGGESTIONS · 3 OF 4", "Your optional supports",
                 "Small additions, chosen for your specific pattern. Take one at a time, and only after the anchor is steady. This is a shelf to choose from, not a list to complete.", [
        {"type": "supports", "items": [
            {"tag": s["tag"], "title": s["title"], "body": s["body"], "why": s["why"]}
            for s in supports
        ]},
        {"type": "table", "title": "HOW TO CHOOSE BETWEEN THEM",
         "columns": ["If this is your situation", "Try this one", "Because"],
         "rows": choose_rows},
        _cards([(label, None, body) for (label, body) in adjustments], columns=2,),
    ])


def _p13_programs(enriched):
    cap = enriched["commerce"]["cap"]

    # Suppressed cap (§13.3): nothing beyond one line pointing back to the
    # free path. No booking language, no program cards.
    if cap == "suppressed":
        return _page(13, "YOUR SUGGESTIONS · 4 OF 4", "The free path is the plan",
                     "Programs are optional at the best of times. Right now, the kindest and most effective plan is the free one.", [
            _callout("THE FREE PATH IS THE WHOLE RECOMMENDATION",
                     "No programs are suggested right now, and nothing about that is a limitation: the anchor practice and the optional supports are a complete plan. A future reflection can revisit guided options when more reserve is available.",
                     variant="free"),
        ])

    blocks = [
        _callout("USE THE FREE PATH FIRST",
                 "Give the seven day anchor a proper try before booking anything. A program should earn its place by offering what your own practice cannot: protected time, skilled facilitation, a suitable setting, or the accountability of showing up alongside other people.",
                 variant="free"),
    ]

    primary_id, secondary_id, saved_id = _pick_programs(enriched)
    later_note = cap == "free_low_cost_only"

    def program_block(pid, force_tag=None):
        p = PROGRAMS[pid]
        return {"type": "program", "tag": force_tag or p["tag"], "title": p["title"],
                "what": p["what"], "why": p["why"], "check": p["check"]}

    if later_note:
        reason = enriched["commerce"]["reason"] or "money is asking for care right now"
        blocks.append(_callout("A CLEARLY LABELLED LATER, IF IT FITS",
            f"Because {reason}, no paid program leads your plan. The options below are noted for later, if circumstances ease and only if they genuinely fit. Nothing in this report asks you to spend.",
            variant="care"))
        blocks.append(program_block(primary_id, force_tag="LATER, IF IT FITS"))
    else:
        blocks.append(program_block(primary_id))
        if secondary_id:
            blocks.append(program_block(secondary_id))

    if saved_id and not later_note:
        saved = PROGRAMS[saved_id]
        blocks.append(_callout("SAVED FOR LATER",
            f"{saved['title']}. A good fit for you in principle, and worth revisiting if your rhythm shifts. Parked rather than recommended, because your current pattern points elsewhere first."))

    blocks.append(_callout("WHAT WOULD NOT SUIT YOU RIGHT NOW",
        "An intensive residential reset, a high demand challenge, or a tightly scheduled multi day retreat. Your current pattern calls for less activation and lower commitment first. This is not about capability. It is that a demanding program asks for reserves that are better spent steadying the basics, and the most likely result is a good experience followed by a harder week afterwards."))

    blocks.append(_cards([
        ("QUESTIONS WORTH ASKING ANY HOST", None,
         "Can you explain the full flow, the intensity, and what can be skipped? Does the timetable protect quiet transitions, or does it fill every minute? Are facilitator credentials, safety boundaries, cancellation terms, and accessibility all clear before you pay?"),
        ("THE ONE QUESTION TEST", None,
         "Would you still choose it if the program promised you no transformation at all, only a well held experience? If yes, it is probably a good fit. If no, keep your money and keep your anchor."),
    ], columns=2))

    blocks.append(_callout("AN HONEST WORD ABOUT FIT",
        "These suggestions describe how well a program matches your pattern. They are not predictions about how you will feel afterwards. A good match makes a good outcome more likely, and no more than that. If a program ever promises you a specific result, treat that promise as a reason for caution rather than confidence."))

    return _page(13, "YOUR SUGGESTIONS · 4 OF 4", "If you would like guided support",
                 "Programs are optional, and they come second. Anything suggested here is suggested because it matches your pattern, not because you need it.", blocks)


# ---------------------------------------------------------------------------
# Pages 14 to 16
# ---------------------------------------------------------------------------

def _p14_thirty_days(enriched):
    gentle = enriched["safety"]["tier"] != "none"
    weeks = [
        ("WEEK ONE", "Build the cue",
         "Use your anchor on at least three days. Record only whether it felt easier, the same, or harder. Three honest days are worth more than seven forced ones."),
        ("WEEK TWO", "Protect one boundary",
         "Choose one boundary that serves the anchor and let a trusted person know. Keep the cue even when the boundary slips. The cue is the experiment. The rest is just weather."),
        ("WEEK THREE", "Add one gentle support" if not gentle else "Only if it feels kind",
         "Choose one optional support, whichever made things simpler in week one. Add only that one. Subtraction is always allowed." if not gentle else
         "If, and only if, the anchor has felt kind, you may add one optional support. Not adding anything is an equally good outcome this week."),
        ("WEEK FOUR", "Retake and choose",
         "Repeat the reflection. Continue the free supports, consider a suitable program, or revise the starting point if the pattern did not move. All of these are useful outcomes."),
    ]
    notice_rows = [
        ["After the anchor", "How did it feel?", "Easier, same, or harder", "Tests the core idea directly"],
        ["Next morning", "How restored do you feel?", "More, unchanged, or less", "Tracks recovery rather than perfection"],
        ["First demanding task", "How hard was it to begin?", "Easier, same, or harder", "Tracks usable energy where it counts"],
        ["End of the week", "Did the plan fit real life?", "Fit, partly, or did not fit", "Separates whether it works from whether it is doable"],
    ]
    blocks = [
        _cards([(w, t, b) for (w, t, b) in weeks], columns=2),
        {"type": "table", "title": "WHAT TO NOTICE, IN FOUR MOMENTS",
         "columns": ["Moment", "The question", "Your options", "Why it is worth noticing"],
         "rows": notice_rows},
        _callout("WHEN TO REFLECT AGAIN",
                 "A short check after seven days, and the complete reflection after thirty days or after a program. When you compare, look at direction and lived experience rather than small differences. What you are looking for is a repeatable pattern that also feels true to you. Your before and after pair is what turns this report from a snapshot into a story about your own year."),
        _cards([
            ("QUESTIONS WORTH CARRYING", None,
             "What changes when your day has a clear seam in it, even if the workload does not? Which of your strengths best protects this experiment without becoming another demand? What is the smallest form of enough you can recognise in a real week?"),
        ], columns=1),
    ]
    if gentle:
        blocks.append(_callout("A GENTLE NOTE, WORTH TAKING SERIOUSLY",
            "Some of what you shared points to a heavier stretch right now. Feeling this way is more common than it looks from the inside, and it is worth taking seriously rather than pushing through. Sharing how you are doing with someone you trust, or with a qualified professional, is a real and worthwhile step, and it can sit alongside everything in this plan.",
            variant="care"))
    blocks.append(_callout("ON THE DAYS IT DOES NOT GO WELL",
        "You will miss days. That is expected, and it is built into the design of this plan rather than being a failure of it. A missed day tells you something about fit, which is genuinely useful information. If several days slip, the right response is to make the practice smaller rather than to try harder, and certainly rather than to think less of yourself. The plan should shrink before self judgement grows.",
        variant="synthesis"))
    return _page(14, "YOUR NEXT MONTH", "A thirty day experiment",
                 "The purpose is to learn something about your own life, not to complete a perfect routine. One repeated cue becomes the spine. Everything else stays optional.", blocks)


def _p15_behind(enriched):
    supported = [a["name"] for a in enriched["areas"].values()
                 if a["read_type"] == "supported" and a["band"] is not None]
    unread = [a["name"] for a in enriched["areas"].values() if a["band"] is None]
    careful = (
        (f"{_join_names(supported)} rest on fewer questions, so they are offered for you to test rather than asserted. " if supported else "")
        + (f"{_join_names(unread)} were left unread rather than guessed. " if unread else "")
        + "That difference in wording is deliberate, and it is worth trusting when you read it."
    )
    return _page(15, "ABOUT THIS REFLECTION", "What stands behind this report",
                 "A report that asks for your trust should be equally clear about where it is confident, where it is not, and what happens to what you shared.", [
        _cards([
            ("HOW YOUR READING WAS FORMED", None,
             "Each of the nine areas is read using established wellbeing questionnaires that have been tested and used in published research. They ask about how life feels rather than screening for any condition, and your answers were translated into the four broad words used throughout this report. The specific measures behind each area are listed in the appendix."),
            ("WHAT THE SHORT EXERCISES ADDED", None,
             "The brief interactive moments, such as the breathing minute and the body map, add texture to the picture. They are sensitive to the kind of day you were having, so they are used to deepen or question what your answers already suggested. They are never used on their own to raise a concern."),
            ("HOW YOUR LIFE SHAPED THE SUGGESTIONS", None,
             "What you told this reflection about your roles, your priorities, what gets in your way, and what you have already tried shaped the words in this report and the suggestions in it. Your circumstances change what is recommended to you. They never change how any area was read."),
            ("WHERE THIS REPORT SPEAKS CAREFULLY", None,
             "Most of your areas rest on a full set of questions and are described plainly. " + careful),
        ], columns=2),
        _callout("YOUR PRIVACY",
                 "This report belongs to you. Your individual answers, your readings, and your suggestions are never shared with an employer, and there is no route in the system for that to happen. Where organisations receive anything at all, it is combined across many people, with small groups withheld entirely so that no individual can be identified. Your name and identifying details are kept out of any pattern the system learns from. Nothing is collected that this reflection does not need.",
                 variant="info"),
        _cards([
            ("ONE SITTING REFLECTS ONE DAY", None,
             "This report describes how things feel now. It cannot establish what caused what, and a different week might read differently."),
            ("THE SHORT EXERCISES ARE NOT TESTS", None,
             "They are not measures of ability, intelligence, or health, and nothing in them is a medical reading."),
            ("PROGRAM SUGGESTIONS DESCRIBE FIT", None,
             "They match your pattern to a design. They are not predictions of benefit, and no outcome is promised anywhere in this report."),
            ("THIS IS NOT CARE", None,
             "If something feels persistently heavy, unsafe, painful, or hard to manage, speaking with someone you trust or a qualified professional is a real and worthwhile step."),
        ], columns=2),
        _para("The point of this report is not to explain you completely. It is to give you a truer place to begin.", lead="THE CLOSING LINE"),
    ])


def _p16_appendix(enriched):
    scored_codes = {c for c, a in enriched["areas"].items() if a["band"] is not None}
    order = ["MD", "RS", "EC", "IG", "AC", "FW", "EM", "PH", "EN"]
    ordered = [c for c in order if c in scored_codes]
    measure_rows = [[AREA_CODE_TO_NAME[c], MEASURE_ROWS[c][0], MEASURE_ROWS[c][1]] for c in ordered]

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
        primary_id, secondary_id, saved_id = _pick_programs(enriched)
        keys, seenp = [], set()
        for pid in [primary_id, secondary_id, saved_id]:
            if pid and PROGRAMS[pid]["research_key"] not in seenp:
                seenp.add(PROGRAMS[pid]["research_key"])
                keys.append(PROGRAMS[pid]["research_key"])
        program_prose = " ".join(PROGRAM_RESEARCH[k] for k in keys if k in PROGRAM_RESEARCH)

    blocks = [
        _para("For readers who would like to know what stands behind each part of this report. Nothing here is required in order to use your reflection, and none of it changes what your report says."),
        {"type": "table", "title": "THE MEASURES BEHIND EACH OF THE NINE AREAS",
         "columns": ["Area", "Established measure used", "What it is designed to capture"],
         "rows": measure_rows},
        _para("These measures were chosen because they are published, widely used, and freely available, and because they ask about wellbeing rather than screening for illness. Their wording is never altered. Research practice treats short measures like these as indicating a broad range rather than a precise value, which is why this report speaks in four broad words rather than scores."),
        _callout("THE RESEARCH BEHIND THE CONNECTIONS DESCRIBED IN YOUR REPORT",
                 "The idea that effort carries a cost into the next day unless recovery follows it comes from research on work and recovery (Meijman and Mulder, 1998). The observation that strain in one area of life tends to spread into neighbouring areas, while intact strengths slow that spread, comes from work on personal resources (Hobfoll, 1989). Difficulty mentally switching off is one of the most consistently studied patterns in this field, and is associated with poorer rest and lower next morning energy across many studies (Sonnentag and Fritz, 2007; 2015). The reason your report treats the short interactive exercises as texture rather than evidence is that single session tasks are known to be informative about a day and unreliable about a person (Hedge, Powell and Sumner, 2018)."),
        _callout("THE RESEARCH BEHIND YOUR SUGGESTED PRACTICES", practices_prose),
    ]
    if program_prose:
        blocks.append(_callout("THE RESEARCH BEHIND THE PROGRAMS SUGGESTED TO YOU", program_prose))
    blocks.append(_callout("HOW TO READ ANY OF THIS",
        "Every study named here describes patterns across groups of people, which is the honest currency of wellbeing research. They are good reasons to expect that a practice or a program design is worth your time. They are not predictions about you specifically, and no finding here promises you a result. That distinction is the difference between evidence and marketing, and this report tries to stay firmly on the evidence side of it."))
    meta = enriched["meta"]
    closing = " · ".join(x for x in [
        f"Prepared for {meta['name']}" if meta["name"] else "Prepared for you",
        meta["date"], meta["location"], "A private, non-clinical wellbeing reflection",
    ] if x)
    blocks.append(_callout(None, closing + "  ·  LIFED", variant="footer"))
    return _page(16, "APPENDIX", "The science behind your reading",
                 "For readers who would like to know what stands behind each part of this report.", blocks)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def build_insight_report(enriched: dict) -> dict:
    pages = [
        _p1_cover(enriched),
        _p2_orientation(enriched),
        _p3_where_you_are(enriched),
        _p4_shape(enriched),
        _p5_connections(enriched),
        _p6_stress(enriched),
        _p7_closer_one(enriched),
        _p8_closer_two(enriched),
        _p9_closer_three(enriched),
        _p10_pathway(enriched),
        _p11_anchor(enriched),
        _p12_supports(enriched),
        _p13_programs(enriched),
        _p14_thirty_days(enriched),
        _p15_behind(enriched),
        _p16_appendix(enriched),
    ]
    return {
        "version": "3.0",
        "meta": {
            "name": enriched["meta"]["name"],
            "date": enriched["meta"]["date"],
            "location": enriched["meta"]["location"],
            "footer": FOOTER,
            "non_clinical_line": NON_CLINICAL_LINE,
        },
        "pages": pages,
    }
