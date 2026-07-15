# corpus.py — the LEWIS similarity corpus & mapping engine (V1, rule-based).
#
# Implements the locked V1 of the "10,000-User Dataset & Similarity-Mapping
# Engine" spec: a state-only k-NN over the seed corpus with a k_min floor,
# the deterministic weighted similarity formula, and neutral effectiveness
# priors. Two invariants are enforced in code, not by convention:
#
#   1. Similarity matches on STATE, never on demographics. Age, sex, region,
#      metro and safety flags can never enter the vector (`FORBIDDEN_FEATURES`
#      raises if they are ever passed in).
#   2. Matches tune only soft priors and phrasing. This module is read-only
#      over the assessment: it can never change a score, a band, the leverage
#      point, or a safety flag.
#
# The seed corpus is synthetic (is_synthetic=True). Per the spec, no outcome
# claim is ever drawn from synthetic rows, so effectiveness priors stay
# neutral until real, consenting profiles accrue. What the corpus *does*
# provide today is coarse-position context — "lower / middle / higher range"
# words for the report. Numbers never leave the backend.

import csv
import heapq
import logging
import math
import os
import threading

logger = logging.getLogger("lewis.corpus")

CORPUS_PATH = os.path.join(os.path.dirname(__file__), "data", "lewis_10000_scores.csv")
CORPUS_VERSION = "synthetic_seed_v1"

SPEC_CODES = ("PH", "EM", "EN", "RS", "MS", "AC", "FW", "IG", "EC")

# Similarity formula (spec Output 3) — block weights sum to 1.00. Blocks a
# live user cannot populate yet (no portrait engine, no friction taxonomy in
# the intake) renormalise away rather than fake a match.
BLOCK_WEIGHTS = {"score": 0.50, "state": 0.20, "friction": 0.15, "pref": 0.15}

K_NEIGHBOURS = int(os.getenv("LEWIS_SIM_K", "40"))
K_MIN = int(os.getenv("LEWIS_SIM_K_MIN", "30"))
SIM_FLOOR = float(os.getenv("LEWIS_SIM_FLOOR", "0.50"))
MIN_SHARED_DIMS = 6  # below this the score block is too thin to match on

# The never-match list: none of these may ever appear in a state vector.
FORBIDDEN_FEATURES = {
    "age", "age_band", "sex", "gender", "region", "location", "metro",
    "distress_tier", "disordered_eating", "cultural_safety", "safety",
    "price_tier", "income",
}

# Live payload vocab -> corpus vocab.
NERVOUS_SYSTEM_MAP = {
    "ventral": "grounded", "sympathetic": "activated", "dorsal": "collapsed",
    "grounded": "grounded", "activated": "activated", "collapsed": "collapsed",
}
READINESS_VALUES = {"focused", "full", "one_thing", "overwhelmed", "committed"}
READINESS_ALIASES = {"7day": "full", "7-day": "full", "one thing": "one_thing"}
SUPPORT_VALUES = {"structure", "gentle", "challenge", "stories", "alone", "fragile"}
RECOVERY_VALUES = {"recovered", "somewhat", "still_tired", "anxious_at_rest"}

# The 8 state portraits: pattern.py speaks ids; the corpus CSV stores the
# display labels (id<->label mapping confirmed against lewis_10000_profiles.jsonl).
PORTRAIT_LABEL_TO_ID = {
    "steady ground": "steady_ground",
    "carrying a lot right now": "carrying_a_lot",
    "resourced and stretched": "resourced_stretched",
    "connected at a distance": "connected_at_distance",
    "running on a low tank": "low_tank",
    "at a crossroads": "crossroads",
    "depleted across the board": "depleted_field",
    "holding it together": "holding_together",
}
PORTRAIT_IDS = set(PORTRAIT_LABEL_TO_ID.values())

# stress_load_pattern reflective labels -> corpus stress_pattern ids.
STRESS_LABEL_TO_ID = {
    "wired & hard to switch off": "wired",
    "flat & depleted": "flat",
    "foggy & scattered": "foggy",
    "rhythm-linked": "cycle",
    "settled": "settled",
}
STRESS_VALUES = set(STRESS_LABEL_TO_ID.values())

_lock = threading.Lock()
_corpus = None  # list of row dicts, or [] when the CSV is unavailable
_tercile_cuts = None  # {code: (p33, p67)}


def _normalise(value: str | None, vocab: set, aliases: dict | None = None) -> str | None:
    if not value:
        return None
    v = str(value).strip().lower().replace("-", "_").replace(" ", "_")
    if aliases:
        v = aliases.get(v, v)
    return v if v in vocab else None


def _normalise_labelled(value: str | None, label_map: dict, vocab: set) -> str | None:
    """Accept either the internal id ('wired') or the reflective display
    label ('Wired & hard to switch off'); anything else is skipped."""
    if not value:
        return None
    v = str(value).strip().lower()
    return label_map.get(v) or (v.replace("-", "_").replace(" ", "_")
                                if v.replace("-", "_").replace(" ", "_") in vocab else None)


def _load() -> list:
    """Parse the corpus once; every row is tagged synthetic."""
    global _corpus, _tercile_cuts
    if _corpus is not None:
        return _corpus
    with _lock:
        if _corpus is not None:
            return _corpus
        try:
            with open(CORPUS_PATH, encoding="utf-8") as f:
                raw = list(csv.DictReader(f))
        except OSError:
            logger.warning("Similarity corpus not found at %s; corpus features disabled.", CORPUS_PATH)
            _corpus, _tercile_cuts = [], {}
            return _corpus

        rows = []
        for r in raw:
            try:
                scores = {c: float(r[c]) for c in SPEC_CODES}
            except (KeyError, ValueError):
                continue
            rows.append({
                "scores": scores,
                "leverage": r.get("leverage_primary") or None,
                "portrait": r.get("portrait") or None,
                "portrait_id": PORTRAIT_LABEL_TO_ID.get((r.get("portrait") or "").strip().lower()),
                "stress_pattern": r.get("stress_pattern") or None,
                "recovery": r.get("recovery") or None,
                "nervous_system_state": r.get("nervous_system_state") or None,
                "readiness": r.get("readiness") or None,
                "support_preference": r.get("support_preference") or None,
                "is_synthetic": True,
            })

        cuts = {}
        for c in SPEC_CODES:
            ordered = sorted(row["scores"][c] for row in rows)
            n = len(ordered)
            cuts[c] = (ordered[n // 3], ordered[(2 * n) // 3]) if n else (0.0, 0.0)

        _tercile_cuts = cuts
        _corpus = rows
        logger.info("Similarity corpus loaded: %d synthetic rows (%s).", len(rows), CORPUS_VERSION)
        return _corpus


def coarse_position(code: str, score: float) -> str | None:
    """Tercile position of a score against the corpus distribution — the
    Narrative spec's allowed 'coarse position' language, words only."""
    _load()
    cuts = _tercile_cuts.get(code)
    if not cuts:
        return None
    p33, p67 = cuts
    if score < p33:
        return "lower"
    if score < p67:
        return "middle"
    return "higher"


def positions_for(dim_scores: dict) -> dict:
    """dim_scores maps spec code -> score. Returns code -> position word."""
    return {
        code: pos
        for code, score in dim_scores.items()
        if score is not None and (pos := coarse_position(code, score)) is not None
    }


def _score_similarity(user_scores: dict, row_scores: dict) -> float | None:
    shared = [c for c, s in user_scores.items() if s is not None]
    if len(shared) < MIN_SHARED_DIMS:
        return None
    dist = math.sqrt(sum(((user_scores[c] - row_scores[c]) / 100.0) ** 2 for c in shared))
    return 1.0 - dist / math.sqrt(len(shared))


def _match_block(pairs: list) -> float | None:
    """pairs of (user_value, row_value); features the user lacks are skipped.
    Returns the mean exact-match rate, or None when nothing was comparable."""
    comparable = [(u, r) for u, r in pairs if u is not None]
    if not comparable:
        return None
    return sum(1.0 for u, r in comparable if u == r) / len(comparable)


def build_state_vector(dim_scores: dict, state: dict) -> dict:
    """Assemble the state-only similarity input. `dim_scores` maps spec code
    -> score (None allowed); `state` may carry leverage (spec code or None),
    nervous_system_state, readiness, support_preference. Demographics or
    safety fields raise — the hard invariant, not a convention."""
    leaked = set(state) & FORBIDDEN_FEATURES
    if leaked:
        raise ValueError(f"Demographic/safety features can never enter similarity: {sorted(leaked)}")
    return {
        "scores": {c: dim_scores.get(c) for c in SPEC_CODES},
        "leverage": state.get("leverage"),
        "portrait": _normalise_labelled(state.get("portrait"), PORTRAIT_LABEL_TO_ID, PORTRAIT_IDS),
        "stress_pattern": _normalise_labelled(state.get("stress_pattern"), STRESS_LABEL_TO_ID, STRESS_VALUES),
        "recovery": _normalise(state.get("recovery"), RECOVERY_VALUES),
        "nervous_system_state": _normalise(state.get("nervous_system_state"),
                                           set(NERVOUS_SYSTEM_MAP.values()), NERVOUS_SYSTEM_MAP),
        "readiness": _normalise(state.get("readiness"), READINESS_VALUES, READINESS_ALIASES),
        "support_preference": _normalise(state.get("support_preference"), SUPPORT_VALUES),
    }


def _similarity(vec: dict, row: dict) -> float | None:
    blocks = {}
    blocks["score"] = _score_similarity(vec["scores"], row["scores"])
    if blocks["score"] is None:
        return None  # too few scored dimensions to claim similarity at all
    # The spec's state_sim set: portrait, leverage, stress pattern, recovery.
    # `leverage` may legitimately be None on both sides (a steady profile),
    # so it is compared through a sentinel rather than skipped as missing.
    blocks["state"] = _match_block([
        (vec["leverage"] or "(none)", row["leverage"] or "(none)"),
        (vec["portrait"], row["portrait_id"]),
        (vec["stress_pattern"], row["stress_pattern"]),
        (vec["recovery"], row["recovery"]),
    ])
    blocks["friction"] = _match_block([(vec["nervous_system_state"], row["nervous_system_state"])])
    blocks["pref"] = _match_block([
        (vec["readiness"], row["readiness"]),
        (vec["support_preference"], row["support_preference"]),
    ])

    total_weight = sum(BLOCK_WEIGHTS[b] for b, v in blocks.items() if v is not None)
    if total_weight <= 0:
        return None
    return sum(BLOCK_WEIGHTS[b] * v for b, v in blocks.items() if v is not None) / total_weight


def map_to_corpus(dim_scores: dict, state: dict) -> dict:
    """The engine's single entry point. Read-only over the assessment;
    returns neighbour context, neutral priors, and coarse positions."""
    positions = positions_for(dim_scores)
    result = {
        "corpus_version": CORPUS_VERSION,
        "corpus_is_synthetic": True,
        "matched": False,
        "neighbours": 0,
        "positions": positions,
        # Synthetic rows may never produce outcome claims (spec, never-infer
        # list): priors stay neutral until real consenting profiles accrue.
        "effectiveness_priors": {},
        "priors_note": "neutral — synthetic seed corpus carries no real outcomes",
        "neighbour_summary": None,
    }

    rows = _load()
    if not rows:
        return result

    vec = build_state_vector(dim_scores, state)
    scored = []
    for row in rows:
        sim = _similarity(vec, row)
        if sim is not None and sim >= SIM_FLOOR:
            scored.append((sim, row))
    neighbours = heapq.nlargest(K_NEIGHBOURS, scored, key=lambda t: t[0])

    if len(neighbours) < K_MIN:
        # k_min floor: never thin-match individuals; archetype-level context
        # only (which, pre-pilot, is simply the coarse positions above).
        return result

    portraits = {}
    for _, row in neighbours:
        if row["portrait"]:
            portraits[row["portrait"]] = portraits.get(row["portrait"], 0) + 1

    result["matched"] = True
    result["neighbours"] = len(neighbours)
    # QA/telemetry texture only — never rendered as a claim about the user.
    result["neighbour_summary"] = {
        "mean_similarity": round(sum(s for s, _ in neighbours) / len(neighbours), 3),
        "portrait_mix": dict(sorted(portraits.items(), key=lambda kv: -kv[1])[:3]),
    }
    return result
