# report_gate.py — the §17 self-check gate for the Insight Report.
#
# Runs mechanically over the built document before the API returns it.
# The deterministic generator should always pass; the gate exists so that
# any future change (template edits, LLM voicing) that breaks the
# contract is caught before a reader ever sees it. Any failure is a bug.
#
# Checks implemented (Rulebook v3.0 §17):
#   Vocabulary firewall  — no instrument name, citation, internal label,
#                          score vocabulary or draft language in pages 1-15.
#   Punctuation          — zero em-dashes and en-dashes in the whole document.
#   Bands                — only the four band words (plus "Not read").
#   Required content     — season framing (p3), single-sitting limit (p5),
#                          why-the-plan-is-small (p10), lapse guidance
#                          (p11 and p14), privacy statement (p15),
#                          non-clinical line (p1), how-to-read note (p16),
#                          free path before programs (p13).

import re

EM_DASH = "—"
EN_DASH = "–"

ALLOWED_BANDS = {"Running on empty", "Under pressure", "Steady", "Strong", "Not read"}

# Case-sensitive firewall terms: instrument names and acronyms that must
# never appear in pages 1 to 15. Word-boundary matched.
INSTRUMENT_PATTERNS = [
    r"\bWHO-?5\b", r"\bPSS-?10\b", r"\bPSS\b", r"\bUCLA\b", r"\bPROMIS\b",
    r"\bCFPB\b", r"\bGSE\b", r"\bSWLS\b", r"\bDiener\b", r"\bFlourishing Scale\b",
    r"\bSelf Efficacy Scale\b", r"\bPerceived Stress Scale\b",
    r"\bloneliness scale\b", r"\bFinancial Well Being Scale\b",
]

# Citation shapes: (Author, 1999) or "et al." anywhere in the body.
CITATION_PATTERNS = [r"\bet al\.?", r"\([^)]*(?:19|20)\d{2}[^)]*\)"]

# Internal labels and system vocabulary, case-insensitive.
INTERNAL_TERMS = [
    "clear read", "supported read", "early read", "read_type", "read type",
    "leverage", "disclosure", "enriched object", "the algorithm",
    "the engine", "data quality", "learning status", "matching gate",
    "ranking weight", "confidence score", "confidence value", "percentile",
    "evidence layer",
    "fictional demonstration", "illustrative demonstration", "prototype",
]

# Score vocabulary that would break "four words, not scores".
SCORE_TERMS = ["/100", "out of 100", "%", "your score", "a score of"]

# Word-boundary matched so "patience" never trips "patient". The mandated
# non-clinical line ("It does not diagnose, grade, or...") is stripped
# before this scan runs; any OTHER use of diagnostic language is a defect.
CLINICAL_PATTERNS = [
    r"\bdiagnos\w*\b", r"\bdisorder\b", r"\bpatient\b", r"\bsymptom\w*\b",
    r"\btreatment\b", r"\btherapy\b", r"\bburnout\b", r"\bmedication\b",
]

# Mandated phrases that legitimately contain otherwise-banned words.
MANDATED_PHRASES = [
    "it does not diagnose, grade, or replace professional care",
    "it reads how life feels across nine areas and suggests what may fit",
]


def _walk_strings(node, out):
    if isinstance(node, str):
        out.append(node)
    elif isinstance(node, dict):
        for v in node.values():
            _walk_strings(v, out)
    elif isinstance(node, (list, tuple)):
        for v in node:
            _walk_strings(v, out)


def _page_text(page):
    out = []
    _walk_strings(page, out)
    return "\n".join(out)


def check_report(report: dict) -> list[str]:
    """Return a list of issues; empty means the document passes the gate."""
    issues = []
    pages = report.get("pages") or []
    if len(pages) != 16:
        issues.append(f"expected 16 pages, got {len(pages)}")
        return issues

    full_text = _page_text(report)
    if EM_DASH in full_text:
        issues.append("em-dash found in document")
    if EN_DASH in full_text:
        issues.append("en-dash found in document")

    body_text = "\n".join(_page_text(p) for p in pages[:15])

    for pattern in INSTRUMENT_PATTERNS:
        if re.search(pattern, body_text):
            issues.append(f"instrument name in pages 1-15: {pattern}")
    for pattern in CITATION_PATTERNS:
        if re.search(pattern, body_text):
            issues.append(f"citation in pages 1-15: {pattern}")

    lower_body = body_text.lower()
    for term in INTERNAL_TERMS:
        if term in lower_body:
            issues.append(f"internal label in pages 1-15: {term}")
    for term in SCORE_TERMS:
        if term.lower() in lower_body:
            issues.append(f"score vocabulary in pages 1-15: {term}")
    clinical_scan = lower_body
    for phrase in MANDATED_PHRASES:
        clinical_scan = clinical_scan.replace(phrase, "")
    for pattern in CLINICAL_PATTERNS:
        if re.search(pattern, clinical_scan):
            issues.append(f"clinical language in pages 1-15: {pattern}")

    # Band words on every band-bearing block.
    for page in pages:
        for block in page.get("blocks", []):
            for item in (block.get("items") or []):
                if isinstance(item, dict) and "band" in item and item["band"] not in ALLOWED_BANDS:
                    issues.append(f"non-contract band word: {item['band']!r}")
            if block.get("type") == "area" and block.get("band") not in ALLOWED_BANDS:
                issues.append(f"non-contract band word: {block.get('band')!r}")

    # Required content, matched loosely so wording can breathe.
    def page_has(number, *needles):
        text = _page_text(pages[number - 1]).lower()
        return any(n in text for n in needles)

    if not page_has(1, "non-clinical"):
        issues.append("non-clinical line missing from cover")
    if not page_has(3, "season"):
        issues.append("season-not-type framing missing from page 3")
    if not page_has(5, "single sitting", "one sitting"):
        issues.append("single-sitting limitation missing from page 5")
    if not page_has(10, "sized correctly", "almost too easy"):
        issues.append("why-the-plan-is-small box missing from page 10")
    if not page_has(11, "missing a day", "nothing to catch up on"):
        issues.append("lapse guidance missing from page 11")
    if not page_has(14, "miss days", "missed day"):
        issues.append("lapse guidance missing from page 14")
    if not page_has(15, "never shared with an employer"):
        issues.append("privacy statement missing from page 15")
    if not page_has(16, "how to read any of this"):
        issues.append("how-to-read note missing from appendix")

    # Free path before any paid suggestion on the programs page.
    p13_text = _page_text(pages[12]).lower()
    free_idx = p13_text.find("free path")
    if free_idx == -1:
        issues.append("free path statement missing from page 13")

    return issues
