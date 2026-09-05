# report_gate.py — the §17 self-check gate and §24 design gate for the
# Insight Report.
#
# Runs mechanically over the built document before the API returns it.
# The deterministic generator should always pass; the gate exists so that
# any future change (template edits, LLM voicing) that breaks the
# contract is caught before a reader ever sees it. Any failure is a bug.
#
# Checks implemented (Rulebook v4.0 §17 and §24):
#   Vocabulary firewall  — no instrument name, citation, internal label,
#                          score vocabulary or draft language in the body,
#                          which in v4.0 is pages 1 to 22. Research lives
#                          only on pages 23 and 24.
#   Punctuation          — zero em-dashes and en-dashes in the whole document.
#   Bands                — only the four band words (plus "Not read").
#   Required content     — season framing (p5), single-sitting limit (p10),
#                          why-the-plan-is-small (p16), lapse guidance
#                          (p17 and p21), privacy statement (p22),
#                          non-clinical line (p1), how-to-read note (p24).
#   Structure and design — 24 pages in six parts behind cover and contents,
#                          "N of M" eyebrows, running forward lines, the
#                          required data graphics, placeholder chips.

import re

EM_DASH = "—"
EN_DASH = "–"

PAGE_COUNT = 24
BODY_PAGES = 22          # pages 1 to 22 carry no research
APPENDIX_PAGES = (23, 24)

ALLOWED_BANDS = {"Running on empty", "Under pressure", "Steady", "Strong", "Not read"}

PARTS = [
    "Part one · Orientation",
    "Part two · Your picture",
    "Part three · How it connects",
    "Part four · A closer look",
    "Part five · Your plan",
    "Part six · After this",
]

# Which pages belong to which part, and the eyebrow each must carry when
# its part spans more than one page (§7).
PART_OF_PAGE = {}
for _n in (3, 4):
    PART_OF_PAGE[_n] = PARTS[0]
for _n in (5, 6, 7, 8):
    PART_OF_PAGE[_n] = PARTS[1]
for _n in (9, 10, 11, 12):
    PART_OF_PAGE[_n] = PARTS[2]
for _n in (13, 14, 15):
    PART_OF_PAGE[_n] = PARTS[3]
for _n in (16, 17, 18, 19, 20):
    PART_OF_PAGE[_n] = PARTS[4]
for _n in (21, 22, 23, 24):
    PART_OF_PAGE[_n] = PARTS[5]

NUMBERED_EYEBROWS = {
    13: "A closer look · 1 of 3", 14: "A closer look · 2 of 3", 15: "A closer look · 3 of 3",
    16: "Your plan · 1 of 5", 17: "Your plan · 2 of 5", 18: "Your plan · 3 of 5",
    19: "Your plan · 4 of 5", 20: "Your plan · 5 of 5",
    23: "Appendix · 1 of 2", 24: "Appendix · 2 of 2",
}

# Case-sensitive firewall terms: instrument names and acronyms that must
# never appear in the body. Word-boundary matched.
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
    "evidence layer", "outcome-trained", "consented attendee",
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


def _block_types(page):
    return {b.get("type") for b in page.get("blocks", []) if isinstance(b, dict)}


def _all_blocks(page):
    """Every block on a page, including those nested inside a row."""
    for block in page.get("blocks", []):
        if not isinstance(block, dict):
            continue
        yield block
        for inner in block.get("blocks") or []:
            if isinstance(inner, dict):
                yield inner


def _bands_in(node, out):
    if isinstance(node, dict):
        if isinstance(node.get("band"), str):
            out.append(node["band"])
        for v in node.values():
            _bands_in(v, out)
    elif isinstance(node, (list, tuple)):
        for v in node:
            _bands_in(v, out)


def check_report(report: dict) -> list[str]:
    """Return a list of issues; empty means the document passes the gate."""
    issues = []
    pages = report.get("pages") or []
    if len(pages) != PAGE_COUNT:
        issues.append(f"expected {PAGE_COUNT} pages, got {len(pages)}")
        return issues

    by_number = {p.get("number"): p for p in pages}
    if sorted(by_number) != list(range(1, PAGE_COUNT + 1)):
        issues.append(f"pages are not numbered 1 to {PAGE_COUNT} exactly once")
        return issues

    full_text = _page_text(report)
    if EM_DASH in full_text:
        issues.append("em-dash found in document")
    if EN_DASH in full_text:
        issues.append("en-dash found in document")

    # ---- Vocabulary firewall, pages 1 to 22 -------------------------------
    body_text = "\n".join(_page_text(by_number[n]) for n in range(1, BODY_PAGES + 1))

    for pattern in INSTRUMENT_PATTERNS:
        if re.search(pattern, body_text):
            issues.append(f"instrument name in pages 1-{BODY_PAGES}: {pattern}")
    for pattern in CITATION_PATTERNS:
        if re.search(pattern, body_text):
            issues.append(f"citation in pages 1-{BODY_PAGES}: {pattern}")

    lower_body = body_text.lower()
    for term in INTERNAL_TERMS:
        if term in lower_body:
            issues.append(f"internal label in pages 1-{BODY_PAGES}: {term}")
    for term in SCORE_TERMS:
        if term.lower() in lower_body:
            issues.append(f"score vocabulary in pages 1-{BODY_PAGES}: {term}")
    clinical_scan = lower_body
    for phrase in MANDATED_PHRASES:
        clinical_scan = clinical_scan.replace(phrase, "")
    for pattern in CLINICAL_PATTERNS:
        if re.search(pattern, clinical_scan):
            issues.append(f"clinical language in pages 1-{BODY_PAGES}: {pattern}")

    # ---- Bands -------------------------------------------------------------
    found_bands = []
    _bands_in(pages, found_bands)
    for band in set(found_bands):
        if band not in ALLOWED_BANDS:
            issues.append(f"non-contract band word: {band!r}")

    # ---- Required content --------------------------------------------------
    def page_has(number, *needles):
        text = _page_text(by_number[number]).lower()
        return any(n in text for n in needles)

    if not page_has(1, "non-clinical"):
        issues.append("non-clinical line missing from the cover")
    if not page_has(5, "season"):
        issues.append("season-not-type framing missing from page 5")
    if not page_has(10, "single sitting", "one sitting"):
        issues.append("single-sitting limitation missing from page 10")
    if not page_has(16, "sized correctly", "almost too easy"):
        issues.append("why-the-plan-is-small box missing from page 16")
    if not page_has(17, "missing a day", "missing a night", "nothing to catch up on"):
        issues.append("lapse guidance missing from page 17")
    if not page_has(21, "miss days", "missed day"):
        issues.append("lapse guidance missing from page 21")
    if not page_has(22, "never shared with an employer"):
        issues.append("privacy statement missing from page 22")
    if not page_has(24, "how to read any of this"):
        issues.append("how-to-read note missing from the appendix")

    # ---- The free anchor is the plan (invariant 6) --------------------------
    if "practice" not in _block_types(by_number[17]):
        issues.append("the free anchor practice is missing from page 17")
    if "sevendays" not in _block_types(by_number[18]):
        issues.append("the seven day table is missing from page 18")

    # ---- Structure and the design gate (§24) ------------------------------
    for number, page in sorted(by_number.items()):
        if not page.get("title"):
            issues.append(f"page {number} has no title")
        if not page.get("eyebrow"):
            issues.append(f"page {number} has no eyebrow")
        expected_part = PART_OF_PAGE.get(number)
        if page.get("part") != expected_part:
            issues.append(f"page {number} is in part {page.get('part')!r}, expected {expected_part!r}")
        expected_eyebrow = NUMBERED_EYEBROWS.get(number)
        if expected_eyebrow and page.get("eyebrow") != expected_eyebrow:
            issues.append(f"page {number} eyebrow is {page.get('eyebrow')!r}, expected {expected_eyebrow!r}")
        wants_next = 3 <= number <= PAGE_COUNT - 1
        if wants_next and not page.get("next"):
            issues.append(f"page {number} has no forward line")
        if not wants_next and page.get("next"):
            issues.append(f"page {number} should not carry a forward line")

    if "petals" not in _block_types(by_number[1]):
        issues.append("the nine-petal picture is missing from the cover")
    if "petals" not in _block_types(by_number[7]) and \
            not any(b.get("type") == "petals" for b in _all_blocks(by_number[7])):
        issues.append("the nine-petal wheel is missing from page 7")
    if "contents" not in _block_types(by_number[2]):
        issues.append("the contents listing is missing from page 2")
    if "map" not in _block_types(by_number[5]):
        issues.append("the where-you-are map is missing from page 5")
    if "connections" not in _block_types(by_number[9]):
        issues.append("the connections diagram is missing from page 9")
    if "colophon" not in _block_types(by_number[PAGE_COUNT]):
        issues.append(f"the colophon is missing from page {PAGE_COUNT}")

    contents = next((b for b in _all_blocks(by_number[2]) if b.get("type") == "contents"), None)
    if contents:
        listed = {item["page"]: item["title"]
                  for part in contents["parts"] for item in part["items"]}
        if sorted(listed) != list(range(3, PAGE_COUNT + 1)):
            issues.append(f"the contents page does not list pages 3 to {PAGE_COUNT} exactly once")
        for number, title in listed.items():
            if by_number[number]["title"] != title:
                issues.append(f"contents entry for page {number} does not match its page title")

    return issues
