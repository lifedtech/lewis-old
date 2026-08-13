# safety.py — LEWIS safety flag engine.
#
# Safety overrides everything else in the pipeline (INV-06). When a flag
# fires, the response enters "gentle mode": the leverage engine is
# suppressed (no optimization talk over someone who is depleted), the
# prescribed habit falls back to grounding, the LLM voicing path is
# skipped entirely (deterministic Road A only), and a care note is
# attached for the frontend to render prominently.
#
# LEWIS is non-clinical: flags describe depletion patterns in the
# person's own answers. They never diagnose or screen.

import os

# WHO-5 scaled score at or below this signals deep depletion.
SEVERE_DEPLETION_THRESHOLD = 28

# A dimension below this is in the "Depleted" band.
LOW_BAND_THRESHOLD = 40

SUPPORT_POINTER = os.getenv("LEWIS_SUPPORT_URL", "findahelpline.com")

CARE_NOTE = (
    "A lot in your answers is asking for care right now. That is not a "
    "failure — it is information, and it deserves kindness. Almost everyone "
    "has seasons like this. Lewis is a reflective tool, not a substitute for "
    "human support: if things feel heavy, consider sharing how you are doing "
    "with someone you trust. If you would like someone to talk to, free and "
    f"confidential support lines for most countries are listed at {SUPPORT_POINTER}."
)


def evaluate_safety(who5_scaled: float, dimensions: dict) -> dict:
    flags = []

    if who5_scaled <= SEVERE_DEPLETION_THRESHOLD:
        flags.append("severe_depletion")

    scored = [d["score"] for d in dimensions.values() if d["score"] is not None]
    if scored and all(s < LOW_BAND_THRESHOLD for s in scored):
        flags.append("all_low")

    gentle = bool(flags)
    return {
        "flags": flags,
        "care_note": CARE_NOTE if gentle else None,
        "gentle_mode": gentle,
    }
