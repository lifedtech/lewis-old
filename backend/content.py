# content.py — the SMALL Habit catalog.
#
# Habits are routed by dimension key (see scoring.DIMENSION_DEFS), never
# by narrative sentence strings, so wording changes can never silently
# break routing. In gentle mode (any safety flag) the grounding habit is
# always returned: care before optimization.

CONTENT_CATALOG = [
    {"id": "h1", "dimension": "calm", "title": "Box Breathing Reset", "time_required_min": 1, "environment": "Anywhere",
     "action": "Inhale for 4s, hold for 4s, exhale for 4s, hold for 4s. Repeat 3 times."},
    {"id": "h2", "dimension": "relationships", "title": "The One-Text Pulse", "time_required_min": 1, "environment": "Anywhere",
     "action": "Send a simple message to an old friend: 'Hey, just saw something that reminded me of you!'"},
    {"id": "h3", "dimension": "emotional", "title": "The Wins Audit", "time_required_min": 3, "environment": "Desk",
     "action": "Write down exactly 3 micro-wins that went well today."},
    {"id": "h4", "dimension": "physical", "title": "The One-Exhale Anchor", "time_required_min": 1, "environment": "Anywhere",
     "action": "Once in bed tonight, take one long, slow exhale — just one. That's the whole thing."},
    {"id": "h5", "dimension": "energy", "title": "The Evening Wind-Down", "time_required_min": 2, "environment": "Anywhere",
     "action": "After dinner, take a two-minute slow wind-down: no screen, one slow breath, shoulders down."},
    {"id": "h6", "dimension": "financial", "title": "The Micro-Budget Check", "time_required_min": 5, "environment": "Desk",
     "action": "Log into your primary account. Check the balance. Write down exactly one expense you can delay until next week."},
    {"id": "h7", "dimension": "meaning", "title": "The 'Why' Anchor", "time_required_min": 2, "environment": "Anywhere",
     "action": "Write down the name of one person who benefits from the work you do. Keep it visible."},
    {"id": "h8", "dimension": "accomplishment", "title": "The One-Thing Rule", "time_required_min": 1, "environment": "Anywhere",
     "action": "Write down one single task you have full control over today. Complete it before noon."},
    {"id": "h9", "dimension": "growth", "title": "The One-Idea Minute", "time_required_min": 2, "environment": "Anywhere",
     "action": "Read or listen to exactly one new idea today, and tell one person about it."},
    {"id": "h10", "dimension": "environment", "title": "Two Minutes of Daylight", "time_required_min": 2, "environment": "Anywhere",
     "action": "Step outside, or to a window, for two minutes. Notice one natural thing you can see or hear."},
]

GROUNDING_HABIT = {
    "id": "h0",
    "dimension": None,
    "title": "Universal Grounding Sequence",
    "action": "Take 3 slow, deep diaphragmatic breaths. That is enough for today.",
    "time_required_min": 1,
    "environment": "Anywhere",
}

MAINTENANCE_HABIT = {
    "id": "h11",
    "dimension": None,
    "title": "The Anchor Walk",
    "action": "Take a 5-minute walk and name three things you notice along the way. Keep what works, working.",
    "time_required_min": 5,
    "environment": "Anywhere",
}


def route_content(dimension_key: str | None, max_time: int, environment: str,
                  gentle: bool = False) -> dict:
    if gentle:
        return GROUNDING_HABIT
    if dimension_key is None:
        return MAINTENANCE_HABIT

    candidates = [h for h in CONTENT_CATALOG if h["dimension"] == dimension_key]
    candidates = [h for h in candidates if h["time_required_min"] <= max_time]
    if environment != "Anywhere":
        specific = [h for h in candidates if h["environment"] in (environment, "Anywhere")]
        if specific:
            candidates = specific
    if candidates:
        return candidates[0]
    return GROUNDING_HABIT
