# validator.py — fail-closed validation for LLM-voiced narratives (Road B).
#
# Road B output is never shown to a person unless it passes every check
# here. On any failure the caller falls back to the deterministic Road A
# report. False positives are acceptable by design: the cost of a wrongly
# rejected narrative is a templated report; the cost of a wrongly accepted
# one is an off-policy message shown to someone who may be struggling.

import re

MIN_LENGTH = 150
MAX_LENGTH = 12000

# Non-clinical line: LEWIS reflects, it never diagnoses.
_BANNED_CLINICAL = [
    r"diagnos\w*", r"\bdisorder\w*", r"depress\w*", r"anxiet\w*",
    r"\bclinical\w*", r"\bpatients?\b", r"symptom\w*", r"\btreatments?\b",
    r"cortisol", r"hormon\w*", r"vagal", r"\bburnout\b", r"medicat\w*",
    r"\bprescri(be|bed|ption)\w*", r"\billness\w*", r"\btherap(y|ist|ists)\b",
]

# Agentless register: never first person, never an "AI" persona.
_BANNED_VOICE = [
    r"\bI\b", r"\bI'm\b", r"\bI've\b", r"\bwe\b", r"\bwe're\b", r"\bour\b",
    r"as an ai", r"language model", r"\bchatbot\b",
]

# LEWIS is described with process verbs only — never mental-state verbs.
_BANNED_MENTAL_STATE = [
    r"\bLEWIS\s+(notices|thinks|feels|believes|remembers|knows)\b",
    r"\b(he|she)\s+(notices|thinks|feels|believes|remembers|knows)\b",
]

# Instrument names must never surface to the person (INV-13).
_BANNED_INSTRUMENTS = [
    r"WHO[-\s]?5", r"PSS[-\s]?10", r"\bUCLA\b", r"\bGSE\b",
    r"\bPROMIS\b", r"\bCFPB\b", r"\bSWLS\b", r"\bDiener\b",
]

# Prompt-injection echoes and markup that should never appear.
_BANNED_ARTIFACTS = [
    r"system prompt", r"ignore\s+(all\s+|any\s+)?(previous|prior)\s+instructions",
    r"</?script", r"\bjson payload\b", r"\bcite:\s*\d",
]

_CHECKS = [
    ("clinical language", _BANNED_CLINICAL),
    ("first-person voice", _BANNED_VOICE),
    ("mental-state verb for LEWIS", _BANNED_MENTAL_STATE),
    ("instrument name leaked", _BANNED_INSTRUMENTS),
    ("prompt artifact", _BANNED_ARTIFACTS),
]

# The one place "diagnose" is allowed — the mandated non-clinical
# disclaimer, always in negated form. Stripped before scanning.
_ALLOWED_PHRASES = [
    r"(it\s+)?never\s+diagnos\w*",
    r"(does|do)\s+not\s+diagnos\w*",
]


def validate_narrative(text: str) -> tuple[bool, list[str]]:
    """Returns (ok, reasons). ok is True only if every check passes."""
    reasons = []

    if not text or not text.strip():
        return False, ["empty narrative"]

    stripped = text.strip()
    if len(stripped) < MIN_LENGTH:
        reasons.append(f"too short ({len(stripped)} chars)")
    if len(stripped) > MAX_LENGTH:
        reasons.append(f"too long ({len(stripped)} chars)")

    for allowed in _ALLOWED_PHRASES:
        stripped = re.sub(allowed, "", stripped, flags=re.IGNORECASE)

    for reason_label, patterns in _CHECKS:
        for pattern in patterns:
            match = re.search(pattern, stripped, re.IGNORECASE if pattern != r"\bI\b" else 0)
            if match:
                reasons.append(f"{reason_label}: '{match.group(0)}'")
                break  # one hit per category is enough

    return (len(reasons) == 0), reasons
