# narrative.py — Road A: the deterministic LEWIS insight report.
#
# This report is built entirely from templates and the person's own
# banded results. No LLM is involved, so it can never go off-policy.
# It is ALWAYS generated: it is the report of record, and the optional
# LLM voicing (Road B) may replace it only after passing the validator.
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


def _mirror_section(context: dict) -> str:
    arrival = (context.get("arrival_word") or "").strip()
    if arrival:
        opening = f'You arrived here feeling "{arrival}". That word matters — it is where this reflection starts.'
    else:
        opening = "You arrived here, and taking the time to look honestly at your own picture is itself a step worth acknowledging."
    return (
        "## The Mirror\n\n"
        f"{opening}\n\n"
        "Everything below draws only on what you shared today. It describes "
        "patterns, not verdicts — LEWIS reflects, it never diagnoses.\n"
    )


def _bright_spot_section(dimensions: dict, bright_key: str | None) -> str:
    if not bright_key:
        return ""
    entry = dimensions[bright_key]
    line = BRIGHT_SPOT_LINES.get(entry["band"], BRIGHT_SPOT_LINES["Steady"])
    return (
        "## Your Bright Spot\n\n"
        f"**{entry['label']}** {line}\n"
    )


def _landscape_section(dimensions: dict) -> str:
    scored = [(k, d) for k, d in dimensions.items() if d["score"] is not None]
    unscored = [d for d in dimensions.values() if d["score"] is None]
    lines = ["## Your Wellbeing Landscape\n"]
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


def _body_section(context: dict) -> str:
    parts = []
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
    return "## Your Body & Energy\n\n" + " ".join(parts) + "\n"


def _connections_section(leverage: dict | None, gentle: bool) -> str:
    if gentle:
        return (
            "## The Connections\n\n"
            "When several areas are asking for care at once, the most useful "
            "next step is rarely a plan — it is support, rest, and lowering "
            "the bar. The connections between areas can wait; you come first.\n"
        )
    if leverage:
        return (
            "## The Connections\n\n"
            f"{leverage['headline']}\n\n"
            f"*{leverage['framing']}*\n"
        )
    return (
        "## The Connections\n\n"
        "No single area stands out as pulling on the others — your picture "
        "is fairly balanced right now. The invitation is maintenance, not "
        "repair: keep doing what already works.\n"
    )


def _patterns_section(context: dict) -> str:
    parts = []
    priorities = context.get("priority_rank") or []
    if priorities:
        parts.append(f"You named **{priorities[0]}** as what matters most to you right now.")
    pressures = context.get("active_pressures") or []
    if pressures:
        parts.append(
            "At the same time you are carrying: " + ", ".join(str(p) for p in pressures[:6]) + "."
        )
    if len(parts) < 1:
        return ""
    if len(parts) == 2:
        parts.append(
            "Holding a priority while carrying pressure is not a contradiction — "
            "it is usually the exact place where a small, kind step lands best."
        )
    return "## Patterns Worth Noticing\n\n" + " ".join(parts) + "\n"


def _path_forward_section(habit: dict, gentle: bool) -> str:
    lead = (
        "For now, the invitation is deliberately small and gentle:"
        if gentle
        else "One small habit, chosen for where your picture is today:"
    )
    return (
        "## Your Path Forward\n\n"
        f"{lead}\n\n"
        f"**{habit['title']}** — {habit['action']}\n\n"
        "Small, repeatable actions beat grand plans. Start smaller than "
        "feels impressive, and let it count.\n"
    )


def build_road_a(dimensions: dict, leverage: dict | None, bright_key: str | None,
                 safety: dict, context: dict, habit: dict) -> str:
    """Assemble the deterministic report. Same inputs always produce the
    same text."""
    gentle = safety.get("gentle_mode", False)
    sections = [
        _mirror_section(context),
        _bright_spot_section(dimensions, bright_key),
        _landscape_section(dimensions),
        _body_section(context),
        _connections_section(None if gentle else leverage, gentle),
        _patterns_section(context),
        _path_forward_section(habit, gentle),
    ]
    return "\n".join(s for s in sections if s)
