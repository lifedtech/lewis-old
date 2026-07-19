# narrative.py — Road A: the deterministic LEWIS insight report.
#
# This report is built entirely from templates and the person's own
# banded results. No LLM is involved, so it can never go off-policy.
# It is ALWAYS generated: it is the report of record, and the optional
# LLM voicing (Road B) may replace it only after passing the validator.
#
# Section skeleton follows the Narrative Generation System spec (and the
# 10k reference reports in doc/lewis_10000_reports.jsonl): portrait-led
# opening → strength first → connection → priority tension → stress
# reflection → the one small start → a seven-day frame sized to readiness
# → gentle note → an open question. The reference corpus speaks as "we";
# LEWIS's own validator forbids first person, so every template here is
# re-voiced into the agentless register.
#
# Register rules (mirrors the validator): the person is "you"; LEWIS is
# named in third person with process verbs only; no first person; no
# clinical language; no raw numbers; no instrument names.

BAND_PHRASES = {
    "Thriving": "is a genuine resource for you right now",
    "Steady": "is holding steady",
    "Strained": "is under real pressure and asking for a little attention",
    "Depleted": "is running close to empty and asking for real care at the moment",
}

BRIGHT_SPOT_LINES = {
    "Thriving": "It stands out as something that is genuinely working — a foundation the rest can lean on.",
    "Steady": "It is your most stable ground right now — a quiet strength worth protecting.",
    "Strained": "Even in a strained season, it is holding up better than the rest — that resilience counts.",
    "Depleted": "Even in a heavy season, it is holding more than the rest — and that is worth acknowledging.",
}

NERVOUS_SYSTEM_PHRASES = {
    "ventral": "a grounded, settled pattern — your system has been finding its way back to steady",
    "sympathetic": "an activated, revved-up pattern — your system has been running with the engine on",
    "dorsal": "a low-power, withdrawn pattern — your system has been conserving energy",
}

BODY_ZONE_LABELS = {
    "head": "head and jaw",
    "neck": "neck and shoulders",
    "chest": "chest and heart center",
    "back": "upper and lower back",
    "gut": "stomach and abdomen",
    "limbs": "arms and legs",
}

# Portrait-led openings, adapted from the reference corpus into the
# agentless register. {bright} is the bright-spot label, lowercased.
PORTRAIT_OPENINGS = {
    "steady_ground": "You're on fairly steady ground right now — things are reasonably even, with your {bright} as a clear strength to build on.",
    "resourced_stretched": "You're resourced and stretched at once — real strengths like your {bright}, alongside an area that's asking for attention. That's a workable place to be.",
    "low_tank": "Most of your life is standing on steadier ground than it may feel from the inside — your {bright} especially. What's asking for care sits underneath it: your body, and the energy that runs on it.",
    "carrying_a_lot": "You've been carrying a lot lately, and it shows in your answers. Your {bright} is still holding — and that matters — but the load is real, so this reflection stays kind.",
    "connected_at_distance": "A lot is working, and yet connection feels further away than you'd like right now. That's a tender thing to notice — and a real one.",
    "crossroads": "You're at a kind of crossroads — what matters most to you is also where things feel hardest right now. That's worth meeting gently.",
    "holding_together": "From the outside a lot looks fine — and some of it genuinely is. But a few of your answers quietly say you've been holding it together more than feeling it. You're allowed to not be fine.",
    "depleted_field": "Right now, things feel depleted across the board. That's genuinely hard — and naming it honestly is a real first step. The smallest possible next move is enough.",
}

# How rest has been landing (recovery_load / recovery_responsiveness).
RECOVERY_PHRASES = {
    "recovered": "rest has been restoring you",
    "somewhat": "rest has been partly restoring you",
    "still_tired": "rest hasn't been fully restoring you",
    "anxious_at_rest": "stopping can feel more anxious, not less",
}

# An open, calm question to carry — keyed by the leverage dimension.
SIT_WITH_QUESTIONS = {
    "financial": "what's one money worry that talking about would lighten?",
    "physical": "what would enough rest actually look like this week — not ideal, just enough?",
    "energy": "where does your energy go first on an ordinary day — and does it come back?",
    "relationships": "who would you reach toward, if reaching felt easy?",
    "accomplishment": "what's one small thing that would feel good to finish, fully?",
    "meaning": "what's one small thing that still feels worth it, even now?",
    "emotional": "what's one feeling that would be lighter for being named?",
    "growth": "what quietly interests you that's been waiting for a little space?",
    "environment": "what's one corner of your space that could feel calmer by the weekend?",
    "calm": "what's one thing that reliably helps you switch off, even briefly?",
}
SIT_WITH_DEFAULT = "what's already working that deserves to be protected this week?"
SIT_WITH_GENTLE = "what would being a little kinder to yourself look like today — just today?"


def _find_pattern(patterns: list | None, pattern_id: str) -> dict | None:
    for p in patterns or []:
        if p and p.get("id") == pattern_id:
            return p
    return None


def _opening_section(context: dict, portrait: dict | None, dimensions: dict,
                     bright_key: str | None) -> str:
    arrival = (context.get("arrival_word") or "").strip()
    if arrival:
        echo = f'You arrived feeling "{arrival}" — an honest place to begin.'
    else:
        echo = "However you arrived today, you're here — and that counts."

    bright_label = dimensions[bright_key]["label"].lower() if bright_key else "steadiest area"
    portrait_id = (portrait or {}).get("id")
    portrait_line = PORTRAIT_OPENINGS.get(portrait_id, "").format(bright=bright_label)

    body = f"{echo} {portrait_line}".strip()
    return (
        "## Where you are right now\n\n"
        f"{body}\n\n"
        "Everything below draws only on what you shared today. It describes "
        "patterns, not verdicts — LEWIS reflects, it never diagnoses.\n"
    )


def _whats_working_section(dimensions: dict, bright_key: str | None,
                           patterns: list | None) -> str:
    bright = _find_pattern(patterns, "bright_spot")
    if bright and bright.get("tier") == "none":
        return (
            "## What's working\n\n"
            "A single standout strength is hard to point to right now, honestly — "
            "and saying that plainly is more useful than pretending. What holds "
            "instead is this: you showed up and answered honestly. That counts.\n"
        )
    if not bright_key:
        return ""
    entry = dimensions[bright_key]
    line = BRIGHT_SPOT_LINES.get(entry["band"], BRIGHT_SPOT_LINES["Steady"])
    return (
        "## What's working\n\n"
        f"Before anything harder: **{entry['label']}**. {line}\n"
    )


def _landscape_section(dimensions: dict) -> str:
    scored = [(k, d) for k, d in dimensions.items() if d["score"] is not None]
    unscored = [d for d in dimensions.values() if d["score"] is None]
    lines = ["## Your wellbeing landscape\n"]
    for _, d in scored:
        lines.append(f"- **{d['label']}** {BAND_PHRASES[d['band']]}.")
    if any(d["band"] in ("Strained", "Depleted") for _, d in scored):
        lines.append(
            "\nAlmost everyone has areas that ask for care — that is the "
            "human norm, not a problem with you."
        )
    if unscored:
        names = " and ".join(d["label"].lower() for d in unscored)
        lines.append(
            f"\nLEWIS does not yet have enough signal to reflect {names}, "
            "so nothing is guessed there."
        )
    return "\n".join(lines) + "\n"


def _connections_section(leverage: dict | None, gentle: bool) -> str:
    if gentle:
        return (
            "## How it connects\n\n"
            "When several areas are asking for care at once, the most useful "
            "next step is rarely a plan — it is support, rest, and lowering "
            "the bar. The connections between areas can wait; you come first.\n"
        )
    if leverage:
        pair_note = ""
        if leverage.get("secondary"):
            pair_note = (
                " These two are close enough that caring for either one "
                "tends to ease both.\n"
            )
        return (
            "## How it connects\n\n"
            f"{leverage['headline']}{pair_note}\n\n"
            f"*{leverage['framing']}*\n"
        )
    return (
        "## How it connects\n\n"
        "No single area stands out as pulling on the others — your picture "
        "is fairly balanced right now. The invitation is maintenance, not "
        "repair: keep doing what already works.\n"
    )


def _priority_tension_section(patterns: list | None, dimensions: dict) -> str:
    tension = _find_pattern(patterns, "priority_tension")
    if not tension or not tension.get("surface") or tension.get("firmness") == "withhold":
        return ""
    dim_key = tension.get("dimension")
    entry = dimensions.get(dim_key)
    if not entry:
        return ""
    label = entry["label"].lower()
    if tension.get("firmness") == "soft":
        line = (
            f"It may be that your {label} — something you named as mattering "
            "most — is also where things feel most stretched. If that lands "
            "as true, it's worth meeting gently, not pushing through."
        )
    else:
        line = (
            f"You told LEWIS that your {label} matters most right now — and "
            "it's also where you feel most stretched. That's worth meeting "
            "gently, not pushing through."
        )
    return "## What you care about vs how it feels\n\n" + line + "\n"


def _stress_section(patterns: list | None, context: dict) -> str:
    parts = []
    stress = _find_pattern(patterns, "stress_load_pattern")
    recovery_key = (context.get("recoveryResponsiveness") or "").strip()
    recovery_phrase = RECOVERY_PHRASES.get(recovery_key)
    if stress and stress.get("label") and stress["label"] != "Settled":
        line = f"Stress tends to show up for you as {stress['label'].lower()}"
        parts.append(line + (f", and {recovery_phrase}." if recovery_phrase else "."))
    elif recovery_phrase:
        parts.append(f"Lately, {recovery_phrase}.")

    ns_state = context.get("nervousSystemState")
    if ns_state in NERVOUS_SYSTEM_PHRASES:
        parts.append(f"Your check-in points to {NERVOUS_SYSTEM_PHRASES[ns_state]}.")
    zones = [BODY_ZONE_LABELS[z] for z in (context.get("bodyMapZones") or []) if z in BODY_ZONE_LABELS]
    if zones:
        parts.append(f"Tension shows up most around your {', '.join(zones)}.")
    sleep = (context.get("sleepQuality") or "").strip()
    if sleep:
        parts.append(f'You described your recent sleep as "{sleep}".')

    if not parts:
        return ""
    parts.append("This is a reflection to notice, not a test of anything.")
    return "## How stress is showing up\n\n" + " ".join(parts) + "\n"


def _where_to_start_section(habit: dict, leverage: dict | None,
                            patterns: list | None, gentle: bool) -> str:
    readiness = _find_pattern(patterns, "suggestion_readiness") or {}
    why_different = (
        "Last time you tried something it didn't quite stick, so this one is "
        "almost too small to fail. "
        if readiness.get("shrink_with_why") else ""
    )
    if gentle:
        lead = "For now, the invitation is deliberately small and gentle:"
    elif leverage:
        lead = (
            "So here's where a small change goes furthest — and it's the "
            f"opposite of pushing harder. It starts with your "
            f"{leverage['label'].lower()}, gently."
        )
    else:
        lead = "One small habit, chosen for where your picture is today:"
    return (
        "## Where to start\n\n"
        f"{lead}\n\n"
        f"{why_different}Try this: **{habit['title']}** — {habit['action']}\n\n"
        "That's the whole thing. Start smaller than feels impressive, and "
        "let it count.\n"
    )


def _seven_days_section(patterns: list | None, gentle: bool) -> str:
    readiness = _find_pattern(patterns, "suggestion_readiness") or {}
    stack = 1 if gentle else readiness.get("stack_size", 2)
    if stack <= 1:
        body = (
            "This week, the only goal is gentleness. Just the one small "
            "thing, if and when it feels possible — nothing to add, nothing "
            "to track."
        )
    elif stack == 2:
        body = (
            "Keep it to that one small anchor, most days. Nothing to add and "
            "nothing to track — if it happens, that counts."
        )
    else:
        body = (
            "Keep the one small anchor most days, and if it settles in, add "
            "a second gentle practice when it feels natural — never before."
        )
    return "## Your next seven days\n\n" + body + "\n"


def _gentle_note_section(safety: dict) -> str:
    if not safety.get("flags"):
        return ""
    return (
        "## One gentle note\n\n"
        "Some of what you shared points to a heavier stretch right now. "
        "That's worth being kind to yourself about — and if it sits heavy, "
        "talking with someone you trust, or a qualified professional, is a "
        "real and worthwhile step. That's strength, not weakness.\n"
    )


def _sit_with_section(leverage: dict | None, gentle: bool) -> str:
    if gentle:
        question = SIT_WITH_GENTLE
    elif leverage:
        question = SIT_WITH_QUESTIONS.get(leverage["dimension"], SIT_WITH_DEFAULT)
    else:
        question = SIT_WITH_DEFAULT
    return "## To sit with\n\n" + f"A question to carry into the week: {question}\n"


def build_road_a(dimensions: dict, leverage: dict | None, bright_key: str | None,
                 safety: dict, context: dict, habit: dict,
                 patterns: list | None = None, portrait: dict | None = None) -> str:
    """Assemble the deterministic report. Same inputs always produce the
    same text."""
    gentle = safety.get("gentle_mode", False)
    lev = None if gentle else leverage
    sections = [
        _opening_section(context, portrait, dimensions, bright_key),
        _whats_working_section(dimensions, bright_key, patterns),
        _landscape_section(dimensions),
        _connections_section(lev, gentle),
        "" if gentle else _priority_tension_section(patterns, dimensions),
        _stress_section(patterns, context),
        _where_to_start_section(habit, lev, patterns, gentle),
        _seven_days_section(patterns, gentle),
        _gentle_note_section(safety),
        _sit_with_section(lev, gentle),
    ]
    return "\n".join(s for s in sections if s)
