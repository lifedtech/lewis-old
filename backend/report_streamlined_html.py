# report_streamlined_html.py — Authoritative 11-Section LEWIS Streamlined Insight Report HTML Generator
import os
import math
import html as html_escape
from typing import Dict, Any, Optional, List
from datetime import datetime, timezone
from narrative import extract_section

def calculate_petal_path(angle_deg: float, score: float) -> str:
    """Calculates SVG petal for radar chart."""
    rad = math.radians(angle_deg - 90)
    length = (score / 100.0) * 150.0
    
    # Perpendicular angle
    perp_rad = rad + math.pi / 2
    spread = length * 0.28
    
    c1_x = (length * 0.4) * math.cos(rad) + spread * math.cos(perp_rad)
    c1_y = (length * 0.4) * math.sin(rad) + spread * math.sin(perp_rad)
    
    tip_x = length * math.cos(rad)
    tip_y = length * math.sin(rad)
    
    c2_x = (length * 0.4) * math.cos(rad) - spread * math.cos(perp_rad)
    c2_y = (length * 0.4) * math.sin(rad) - spread * math.sin(perp_rad)
    
    return f"M0,0 C{c1_x:.1f},{c1_y:.1f} {tip_x + spread*0.1:.1f},{tip_y + spread*0.1:.1f} {tip_x:.1f},{tip_y:.1f} C{tip_x - spread*0.1:.1f},{tip_y - spread*0.1:.1f} {c2_x:.1f},{c2_y:.1f} 0,0"

def get_petal_color(score: float) -> tuple[str, str]:
    """Returns (fill_color, fill_opacity) based on score."""
    if score >= 60:
        return "#00ae9d", ".85"
    elif score >= 40:
        return "#d9a44a", ".85"
    return "#cf7f5e", ".85"

def render_streamlined_report_html(rro: Optional[Dict[str, Any]] = None) -> str:
    """
    Renders the complete 11-section LEWIS Insight Report HTML matching LEWIS Insight Report.dc.html.
    Self-contained, perfectly styled for browser view and single-continuous-page PDF printing
    (no page breaks — sections are divided by a hairline rule instead of a page turn, same
    treatment as the full report; see pdf_generator._generate_single_page_pdf_sync).
    """
    if not rro:
        rro = {}

    meta = rro.get("meta", {})
    user_name = meta.get("name") or "Client"
    if user_name == "Friend":
        user_name = "Client"
    
    date_display = meta.get("date_display", datetime.now(timezone.utc).strftime("%d %B %Y"))
    
    raw_dims = rro.get("dimensions", [])
    dim_map = {d.get("key", ""): d for d in raw_dims if isinstance(d, dict)}
    
    # C-tier dimensions are scored from LEWIS's own composite items rather
    # than a published instrument (matches DIMENSION_META in
    # scoring_streamlined.py) — section 03 holds these more loosely.
    DEFAULT_CONFIDENCE = {"PH": "C", "EM": "A", "EN": "B", "RS": "B", "MS": "B",
                          "AC": "A", "FW": "A", "IG": "C", "EC": "C"}

    def g_dim(key: str, default_label: str, default_score: int, default_band: int, default_why: str):
        if key in dim_map:
            d = dim_map[key]
            return {
                "key": key,
                "label": d.get("label", default_label),
                "score": int(d.get("score", default_score)),
                "band": int(d.get("band", default_band)),
                "why": d.get("why", default_why),
                "confidence": d.get("confidence") or DEFAULT_CONFIDENCE.get(key, "B"),
                "trajectory": d.get("trajectory") or "same",
            }
        return {
            "key": key,
            "label": default_label,
            "score": default_score,
            "band": default_band,
            "why": default_why,
            "confidence": DEFAULT_CONFIDENCE.get(key, "B"),
            "trajectory": "same",
        }

    dim_body = g_dim("PH", "Body and recovery", 23, 1, "Sleep is not restoring you and minimal movement.")
    dim_calm = g_dim("EM", "Emotional calm", 27, 1, "Mind is constantly busy, difficulty settling.")
    dim_energy = g_dim("EN", "Energy and drive", 50, 2, "Energy has a real morning, then drops off.")
    dim_rel = g_dim("RS", "Relationships", 67, 3, "Close connections hold strong.")
    dim_mean = g_dim("MS", "Meaning and purpose", 65, 3, "Sense of direction remains intact.")
    dim_prog = g_dim("AC", "Progress and agency", 56, 3, "Holding capability to handle what is in front of you.")
    dim_money = g_dim("FW", "Money and security", 25, 1, "Money worry sits with you most days.")
    dim_cur = g_dim("IG", "Curiosity and learning", 37, 1, "No mental space for new learning right now.")
    dim_surr = g_dim("EC", "Surroundings and belonging", 44, 2, "Rare outdoor time and feeling somewhat out of place.")

    all_dims = [dim_body, dim_calm, dim_energy, dim_rel, dim_mean, dim_prog, dim_money, dim_cur, dim_surr]

    # Real band grouping (was previously hardcoded per-name in sections 02,
    # 03 and 08 — always showing the same five dimensions in the same
    # buckets no matter what a given person's own bands actually were).
    BAND_META = {
        4: {"name": "A real strength", "dot": "#5fba46", "row_bg": "#eaf7f5", "chip_ink": "#2f7d3f"},
        3: {"name": "Holding", "dot": "#00ae9d", "row_bg": "#d6edea", "chip_ink": "#00786d"},
        2: {"name": "Stretched", "dot": "#d9a44a", "row_bg": "#faf0dc", "chip_ink": "#b07c22"},
        1: {"name": "Running on empty", "dot": "#cf7f5e", "row_bg": "#f7e8e0", "chip_ink": "#b45f38"},
    }
    dims_by_band: Dict[int, List[Dict[str, Any]]] = {4: [], 3: [], 2: [], 1: []}
    for _d in all_dims:
        dims_by_band[_d["band"]].append(_d)
    for _blist in dims_by_band.values():
        _blist.sort(key=lambda d: d["score"])

    def status_chip(d: Dict[str, Any]) -> Optional[str]:
        """Only bands 1-2 (Running on empty / Stretched) show a status
        chip in the reference design; Holding/Strong show none."""
        if d["band"] not in (1, 2):
            return None
        if d["confidence"] == "C":
            return "Held loosely"
        if d["trajectory"] in ("worse", "down"):
            return "↓ Getting worse"
        if d["trajectory"] in ("better", "up"):
            return "↑ Improving"
        return "→ Holding, at a difficult level"

    somatic = rro.get("somatic", {})
    t_before = somatic.get("tension_before", 8)
    t_after = somatic.get("tension_after", 5)
    inner_state = somatic.get("portrait", "Activated")
    cluster_name = somatic.get("cluster", "The Surge")

    # ---------------------------------------------------------------
    # Section 04 "Where tension settles" — was fixed to "four places:
    # head and neck, chest..."; now reads the person's own marked zones
    # (rro["somatic"]["zones"]) with a simple body-map illustration and
    # a paragraph that actually reflects how many places and how rest
    # has been landing for them.
    # ---------------------------------------------------------------
    ZONE_MARKERS = {
        "Head and neck": (100, 50), "Shoulders and back": (138, 98),
        "Chest": (100, 118), "Stomach": (100, 165), "Limbs": (158, 205),
    }
    zones = [z for z in (somatic.get("zones") or []) if z in ZONE_MARKERS]
    body_map_svg = ""
    if zones:
        pins = []
        labels = []
        label_y = 58
        for i, z in enumerate(zones, start=1):
            mx, my = ZONE_MARKERS[z]
            pins.append(
                f'<circle cx="{mx}" cy="{my}" r="9" fill="#cf7f5e"></circle>'
                f'<text x="{mx}" y="{my + 4}" text-anchor="middle" font-family="Nunito, sans-serif" '
                f'font-size="9.5" font-weight="800" fill="#ffffff">{i}</text>'
            )
            labels.append(
                f'<line x1="{mx + 12}" y1="{my}" x2="205" y2="{label_y}" stroke="#e5b8a4" '
                f'stroke-width="1" stroke-dasharray="2 3"></line>'
                f'<circle cx="205" cy="{label_y}" r="3.5" fill="#cf7f5e"></circle>'
                f'<text x="214" y="{label_y + 4}" font-family="Nunito, sans-serif" font-size="11.5" '
                f'font-weight="700" fill="#414242">{html_escape.escape(z)}</text>'
            )
            label_y += 26
        body_map_svg = f"""<svg viewBox="0 0 340 320" width="100%" style="max-width:320px;display:block" aria-label="Body zones you marked">
          <g fill="none" stroke="#c9cccb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="100" cy="38" r="22"></circle>
            <path d="M60 92 C60 68 78 60 100 60 C122 60 140 68 140 92 L140 190 L60 190 Z"></path>
            <path d="M60 100 L30 165"></path>
            <path d="M140 100 L170 165"></path>
            <path d="M78 190 L70 300"></path>
            <path d="M122 190 L130 300"></path>
          </g>
          {"".join(pins)}
          {"".join(labels)}
        </svg>"""

    zone_names_joined = (", ".join(zones[:-1]) + (" and " if len(zones) > 1 else "") + zones[-1]) if zones else ""
    zone_count_word = {1: "one place", 2: "two places", 3: "three places", 4: "four places", 5: "five places"}.get(len(zones), f"{len(zones)} places" if zones else "")

    RECOVERY_CLAUSE = {
        "Genuinely recovered, I come back refreshed": "rest that is genuinely restoring you",
        "Somewhat better, but not fully recharged": "rest that only partly restores you",
        "Still tired even after rest": "rest that is not yet restoring you",
        "More anxious when I stop, I can't switch off": "rest that brings its own unease rather than relief",
    }
    recovery_clause = RECOVERY_CLAUSE.get(somatic.get("recovery"), "rest that is still finding its footing")
    _article = "an" if inner_state[:1].lower() in "aeiou" else "a"

    if zones:
        tension_summary = (
            f"That combination, tension held in {zone_count_word}, "
            f"{_article} {html_escape.escape(inner_state.lower())} inner state, and {recovery_clause}, is consistent. "
            "It is not a medical finding and this report cannot tell you what is happening physiologically. "
            "What it can say is that everything you reported points the same direction, and that direction is "
            "a body that is not getting the chance to come down."
        )
        zones_intro = f"You marked {zone_count_word}: {html_escape.escape(zone_names_joined)}."
    else:
        tension_summary = (
            f"You did not mark a specific place tension settles, and that is its own kind of information. "
            f"{_article.capitalize()} {html_escape.escape(inner_state.lower())} inner state and {recovery_clause} are still worth naming on their own."
        )
        zones_intro = "You did not mark a specific place tension settles in your body."

    # A simple 0-10 number-line for the before/after breathing reading,
    # in place of a plain "8 -> 5" number pair.
    def _tension_x(v: float) -> float:
        return 24 + (max(0, min(10, v)) / 10.0) * 352
    bx, ax = _tension_x(t_before), _tension_x(t_after)
    arc_mid_x, arc_mid_y = (bx + ax) / 2, 18
    breathing_scale_svg = f"""<svg viewBox="0 0 400 70" width="100%" style="max-width:420px;display:block" aria-label="Tension before and after one minute of breathing">
      <line x1="24" y1="46" x2="376" y2="46" stroke="#ffffff" stroke-width="2"></line>
      <text x="24" y="64" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" fill="rgba(255,255,255,.75)">0</text>
      <text x="376" y="64" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" fill="rgba(255,255,255,.75)">10</text>
      <path d="M{bx},40 Q{arc_mid_x},{arc_mid_y} {ax},40" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="2 3"></path>
      <circle cx="{bx}" cy="46" r="13" fill="none" stroke="#ffffff" stroke-width="2"></circle>
      <text x="{bx}" y="50" text-anchor="middle" font-family="Nunito, sans-serif" font-size="11" font-weight="800" fill="#ffffff">{t_before}</text>
      <text x="{bx}" y="20" text-anchor="middle" font-family="Nunito, sans-serif" font-size="9.5" font-weight="700" fill="rgba(255,255,255,.85)">Before</text>
      <circle cx="{ax}" cy="46" r="13" fill="#ffffff"></circle>
      <text x="{ax}" y="50" text-anchor="middle" font-family="Nunito, sans-serif" font-size="11" font-weight="800" fill="#00786d">{t_after}</text>
      <text x="{ax}" y="20" text-anchor="middle" font-family="Nunito, sans-serif" font-size="9.5" font-weight="700" fill="rgba(255,255,255,.85)">After</text>
    </svg>"""

    suggestion = rro.get("suggestion", {})
    sug_cue = suggestion.get("cue", "Tonight, after you put your phone on charge")
    sug_action = suggestion.get("action", "step outside for five minutes before you sit back down")

    arrival_word = meta.get("arrival_word") or "ready"
    priority = rro.get("priority", {})
    top3 = priority.get("top3") or [dim_calm["label"], dim_body["label"], dim_money["label"]]
    top3 = (top3 + [dim_calm["label"], dim_body["label"], dim_money["label"]])[:3]
    tension_key = priority.get("tension_key")
    tension_dim = dim_map.get(tension_key) if tension_key else None
    if not tension_dim:
        # Fall back to whichever of the three named priorities scores lowest.
        named = [d for d in all_dims if d["label"] in top3]
        tension_dim = min(named, key=lambda d: d["score"]) if named else dim_body
    tension_confirmed = str(priority.get("tension_confirmed", "yes")).lower() == "yes"
    narration = rro.get("narration", {})
    opening_voice = (
        extract_section(narration.get("text"), "Where you are right now")
        if narration.get("source") == "road_b" else None
    )

    angles = [0, 40, 80, 120, 160, 200, 240, 280, 320]
    # Same wheel angle per dimension key, reused for section 06's
    # connection-map node layout so it stays visually consistent with
    # the cover/section-02 petal wheel.
    NODE_WHEEL_ANGLE = {d["key"]: a for a, d in zip(angles, all_dims)}
    petal_paths = []
    for angle, d in zip(angles, all_dims):
        path_d = calculate_petal_path(angle, d["score"])
        col, op = get_petal_color(d["score"])
        petal_paths.append(f'<path d="{path_d}" fill="{col}" fill-opacity="{op}"></path>')
    petals_svg_inner = "\\n        ".join(petal_paths)

    # Section 02's band rows — dynamically grouped (see BAND_META /
    # dims_by_band above), not hardcoded to specific dimension names.
    def _chip(d: Dict[str, Any], ink: str) -> str:
        return (
            f'<span style="display:inline-flex;align-items:center;gap:7px;height:28px;padding:0 12px;'
            f'border-radius:8px;background:#ffffff;font:600 12.5px \'Nunito\',sans-serif;color:#414242">'
            f'{html_escape.escape(d["label"])} <b style="color:{ink}">{d["score"]}</b></span>'
        )

    band_row_parts = []
    for _band in (4, 3, 2, 1):
        meta_b = BAND_META[_band]
        members = dims_by_band[_band]
        chips = (
            "".join(_chip(d, meta_b["chip_ink"]) for d in members)
            if members else
            '<span style="font:400 13px \'Nunito\',sans-serif;color:#a8a8a8;font-style:italic">None right now</span>'
        )
        band_row_parts.append(
            f'<div style="display:grid;grid-template-columns:150px 1fr;gap:16px;align-items:center;'
            f'padding:12px 18px;border-radius:14px;background:{meta_b["row_bg"]}">'
            f'<div style="display:flex;align-items:center;gap:9px">'
            f'<span style="width:9px;height:9px;border-radius:50%;background:{meta_b["dot"]};flex:none"></span>'
            f'<span style="font:700 13px/1.2 \'Nunito\',sans-serif;color:#414242">{meta_b["name"]}</span></div>'
            f'<div style="display:flex;flex-wrap:wrap;gap:7px">{chips}</div></div>'
        )
    band_rows_html = "".join(band_row_parts)

    def _plural(n: int) -> str:
        return "" if n == 1 else "s"

    _NUM_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

    def _num_word(n: int) -> str:
        return _NUM_WORDS[n] if 0 <= n < len(_NUM_WORDS) else str(n)

    n_low, n_high = len(dims_by_band[1]), len(dims_by_band[4])
    band_summary_line = (
        f"{_num_word(n_low).capitalize()} area{_plural(n_low)} in the lowest band is a lot to be carrying at once. "
        f"{_num_word(n_high).capitalize()} area{_plural(n_high)} standing in the highest band, at the same time, is also true and also worth saying."
        if n_low or n_high else
        "Most of what you told us sits in the middle bands right now — nothing at either extreme."
    )

    # Section 03's per-area cards — dynamically grouped, one group per
    # band that actually has members (was previously hardcoded to two
    # specific bands and five specific dimensions regardless of anyone's
    # actual scores).
    BAND_INTRO = {
        1: "This area needs the gentlest care right now. Reserve is thin, and effort here costs more than it should.",
        2: "Stretched, and asking for attention. Still functioning, but with less give than it used to have.",
        3: "Holding reliably, without strain. Not asking anything of you this month.",
        4: "A real strength right now — worth noticing and worth protecting.",
    }
    BAND_CARD_BG = {1: "#f7e8e0", 2: "#faf0dc", 3: "#d6edea", 4: "#eaf7f5"}

    def _card_with_bar(d: Dict[str, Any], ink: str) -> str:
        chip = status_chip(d)
        chip_html = (
            f'<span style="display:inline-flex;align-items:center;gap:6px;margin-top:12px;height:24px;'
            f'padding:0 10px;border-radius:8px;background:#ffffff;font:700 11px \'Nunito\',sans-serif;'
            f'color:{ink}">{chip}</span>'
            if chip else ""
        )
        return (
            f'<div style="padding:16px 18px;border-radius:16px;background:{BAND_CARD_BG[d["band"]]};break-inside:avoid">'
            f'<div style="display:flex;align-items:baseline;justify-content:space-between">'
            f'<span style="font:800 14.5px \'Nunito\',sans-serif;color:#414242">{html_escape.escape(d["label"])}</span>'
            f'<span style="font:800 19px \'Nunito\',sans-serif;color:{ink}">{d["score"]}</span></div>'
            f'<div style="height:5px;border-radius:3px;background:#ffffff;margin:10px 0 12px">'
            f'<span style="display:block;width:{d["score"]}%;height:5px;border-radius:3px;background:{ink}"></span></div>'
            f'<p style="margin:0;font:400 13px/1.65 \'Nunito\',sans-serif;color:#5f6060">{html_escape.escape(d["why"])}</p>'
            f'{chip_html}</div>'
        )

    def _card_compact(d: Dict[str, Any], ink: str) -> str:
        return (
            f'<div><div style="display:flex;justify-content:space-between">'
            f'<span style="font:800 14px \'Nunito\',sans-serif;color:#414242">{html_escape.escape(d["label"])}</span>'
            f'<span style="font:800 18px \'Nunito\',sans-serif;color:{ink}">{d["score"]}</span></div>'
            f'<div style="height:5px;border-radius:3px;background:#ffffff;margin:8px 0 10px">'
            f'<span style="display:block;width:{d["score"]}%;height:5px;border-radius:3px;background:{ink}"></span></div>'
            f'<p style="margin:0;font:400 12.5px/1.5 \'Nunito\',sans-serif;color:{ink}">{html_escape.escape(d["why"])}</p></div>'
        )

    band_asks_groups = []
    for _band in (1, 2, 3, 4):
        members = dims_by_band[_band]
        if not members:
            continue
        meta_b = BAND_META[_band]
        header = (
            f'<div style="display:flex;align-items:baseline;gap:12px;padding:0 0 10px">'
            f'<span style="font:800 15px/1.2 \'Nunito\',sans-serif;color:{meta_b["chip_ink"]}">{meta_b["name"]}</span>'
            f'<span style="font:400 13px/1.5 \'Nunito\',sans-serif;color:#808080">{BAND_INTRO[_band]}</span></div>'
        )
        if _band in (1, 2):
            cards = "".join(_card_with_bar(d, meta_b["chip_ink"]) for d in members)
            body = f'<div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:12px;margin-bottom:24px">{cards}</div>'
        else:
            cards = "".join(_card_compact(d, meta_b["chip_ink"]) for d in members)
            cols = min(len(members), 3)
            body = (
                f'<div style="display:grid;grid-template-columns:repeat({cols},1fr);gap:12px;padding:18px;'
                f'border-radius:16px;background:{BAND_CARD_BG[_band]};break-inside:avoid;margin-bottom:24px">{cards}</div>'
            )
        band_asks_groups.append(header + body)
    band_asks_html = "".join(band_asks_groups)

    # Section 08's "ground you can rely on" — the top three dims actually
    # in Holding/Strong (was hardcoded to Relationships/Meaning/Progress
    # regardless of anyone's real bands).
    ground_candidates = sorted(dims_by_band[3] + dims_by_band[4], key=lambda d: d["score"], reverse=True)[:3]
    if not ground_candidates:
        ground_candidates = sorted(all_dims, key=lambda d: d["score"], reverse=True)[:3]
    ground_count_word = {1: "one", 2: "two", 3: "three"}.get(len(ground_candidates), str(len(ground_candidates)))

    # A bar chart (matching the reference design) instead of plain tiles.
    _bar_w, _bar_gap, _baseline = 120, 32, 190
    _total_w = len(ground_candidates) * _bar_w + max(len(ground_candidates) - 1, 0) * _bar_gap
    _start_x = (500 - _total_w) / 2
    _bright_key = (rro.get("bright_spot") or {}).get("key")
    _bars = []
    for i, d in enumerate(ground_candidates):
        bx = _start_x + i * (_bar_w + _bar_gap)
        bh = max(30, (d["score"] / 100.0) * 140)
        by = _baseline - bh
        tag = "BRIGHT SPOT" if d["key"] == _bright_key else "HOLDING"
        _bars.append(f"""
          <text x="{bx + _bar_w / 2:.0f}" y="{by - 12:.0f}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10" font-weight="800" letter-spacing="0.08em" fill="#00786d">{tag}</text>
          <rect x="{bx:.0f}" y="{by:.0f}" width="{_bar_w}" height="{bh:.0f}" rx="10" fill="#d6edea" stroke="#00ae9d" stroke-width="1.5"></rect>
          <text x="{bx + _bar_w / 2:.0f}" y="{by + 34:.0f}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="22" font-weight="800" fill="#00786d">{d["score"]}</text>
          <text x="{bx + _bar_w / 2:.0f}" y="{_baseline + 22:.0f}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="12" font-weight="700" fill="#414242">{html_escape.escape(d["label"])}</text>
        """)
    ground_chart_svg = f"""<svg viewBox="0 0 500 230" width="100%" style="max-width:520px;display:block" aria-label="Areas you can rely on">
      <line x1="20" y1="{_baseline}" x2="480" y2="{_baseline}" stroke="#414242" stroke-width="1.5"></line>
      {"".join(_bars)}
    </svg>"""

    bright_spot = rro.get("bright_spot") or {}
    bright_dim = dim_map.get(_bright_key) or (ground_candidates[0] if ground_candidates else None)
    bright_quote_html = ""
    if bright_dim and bright_spot.get("text"):
        bright_quote_html = f"""<div style="margin-top:20px;padding:22px 24px;border-radius:16px;background:#d6edea;break-inside:avoid">
          <p style="margin:0;font:400 15px/1.6 'Nunito',sans-serif;color:#00786d">Of everything we looked at, your {html_escape.escape(bright_dim["label"].lower())} stand{"s" if not bright_dim["label"].lower().endswith("s") else ""} out as a real strength right now. You told us what is working:</p>
          <p style="margin:16px 0 0;font:800 24px/1.35 'Nunito',sans-serif;color:#00786d">&ldquo;{html_escape.escape(bright_spot["text"])}&rdquo;</p>
        </div>"""

    _others = [d for d in ground_candidates if d is not bright_dim]
    if _others:
        _other_names = ", ".join(d["label"] for d in _others[:-1]) + (" and " if len(_others) > 1 else "") + _others[-1]["label"]
        _n_others_word = _num_word(len(_others)).capitalize() if len(_others) != 1 else "One"
        _n_low_word = _num_word(len(dims_by_band[1]))
        ground_paragraph = (
            f"{_n_others_word} other area{'s are' if len(_others) != 1 else ' is'} holding steady while much else is not. "
            f"Your {_other_names.lower()} {'are' if len(_others) != 1 else 'is'} intact. "
            f"In a season with {_n_low_word} area{_plural(len(dims_by_band[1]))} running on empty, "
            f"{'those' if len(_others) != 1 else 'that'} {'are' if len(_others) != 1 else 'is'} not incidental. "
            f"{'They are' if len(_others) != 1 else 'It is'} the ground the rest of this stands on."
        )
    else:
        ground_paragraph = f"Right now this is the one place standing steady — worth protecting deliberately while the rest of this asks for care."

    sitting_with_html = ""
    if bright_dim:
        sitting_with_html = f"""<div style="padding:18px 20px;border-radius:14px;border:1px solid #ededed">
          <p style="margin:0;font:800 14px 'Nunito',sans-serif;color:#414242">One thing worth sitting with</p>
          <p style="margin:10px 0 0;font:400 13.5px/1.65 'Nunito',sans-serif;color:#5f6060">By your own answers, your {html_escape.escape(bright_dim["label"].lower())} is genuinely holding. That is real, and worth protecting on purpose rather than assuming it will simply keep going on its own.</p>
        </div>"""

    # "Where your instinct and your answers differ" — compares the
    # person's own self-sort (rro["gestalt"]["sort"]) against the
    # computed band, when they did that exercise.
    SELF_LEVEL = {"depleted": 1, "okay": 2, "strength": 3}
    COMPUTED_LEVEL = {1: 1, 2: 1, 3: 2, 4: 3}
    self_level_by_label: Dict[str, int] = {}
    for bucket, lvl in SELF_LEVEL.items():
        for name in (rro.get("gestalt", {}).get("sort") or {}).get(bucket) or []:
            self_level_by_label[name] = lvl
    _gaps = []
    for d in all_dims:
        self_lvl = self_level_by_label.get(d["label"])
        if self_lvl is not None:
            _gaps.append((abs(self_lvl - COMPUTED_LEVEL[d["band"]]), d, self_lvl))
    instinct_gap_html = ""
    if _gaps:
        _gaps.sort(key=lambda t: t[0], reverse=True)
        _diff, _gd, _self_lvl = _gaps[0]
        if _diff > 0:
            _you_said_pct = _self_lvl / 3.0 * 100
            _questions_pct = _gd["score"]
            _lower_higher = "lower" if COMPUTED_LEVEL[_gd["band"]] > _self_lvl else "steadier"
            instinct_gap_html = f"""<div style="padding:18px 20px;border-radius:14px;border:1px solid #ededed">
              <p style="margin:0 0 10px;font:800 14px 'Nunito',sans-serif;color:#414242">And one where your instinct and your answers differ</p>
              <div style="display:grid;gap:6px;margin-bottom:10px">
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="width:62px;font:600 10.5px 'Nunito',sans-serif;color:#a8a8a8">You said</span>
                  <div style="flex:1;height:7px;border-radius:4px;background:#f4f4f4"><span style="display:block;width:{_you_said_pct:.0f}%;height:7px;border-radius:4px;background:#cf7f5e"></span></div>
                </div>
                <div style="display:flex;align-items:center;gap:8px">
                  <span style="width:62px;font:600 10.5px 'Nunito',sans-serif;color:#a8a8a8">Questions</span>
                  <div style="flex:1;height:7px;border-radius:4px;background:#f4f4f4"><span style="display:block;width:{_questions_pct:.0f}%;height:7px;border-radius:4px;background:#d9a44a"></span></div>
                </div>
              </div>
              <p style="margin:0;font:400 13.5px/1.65 'Nunito',sans-serif;color:#5f6060">You placed {html_escape.escape(_gd["label"].lower())} in a different spot than the questions did — the questions read it {_lower_higher} than your own sort. Sometimes an area is doing better, or worse, than it feels, especially when everything around it is thin. Both readings are yours. The gap is worth noticing.</p>
            </div>"""

    # ---------------------------------------------------------------
    # Section 05 "Your day" — was a fixed Morning/Afternoon/Evening/Night
    # example; now reads the person's own rro["day"] (built in
    # scoring_streamlined.py, same 1=Low/2=Medium/3=High scale the
    # rhythm screen writes).
    # ---------------------------------------------------------------
    LEVEL_WORD = {1: "Low", 2: "Medium", 3: "High"}
    LEVEL_STYLE = {
        1: ("#f7e8e0", "#cf7f5e"), 2: ("#faf0dc", "#b07c22"), 3: ("#d6edea", "#00786d"),
    }
    day_slots = rro.get("day") or [
        {"k": "Morning", "v": 2}, {"k": "Afternoon", "v": 2}, {"k": "Evening", "v": 2}, {"k": "Night", "v": 1},
    ]
    # A smooth line/area chart (matching the reference design) instead
    # of plain colour tiles.
    _CHART_Y = {1: 172, 2: 112, 3: 54}
    _n = max(len(day_slots), 1)
    _plot_left, _plot_right = 90, 560
    _step = (_plot_right - _plot_left) / max(_n - 1, 1)
    _pts = [
        (_plot_left + i * _step, _CHART_Y.get(int(s.get("v", 2)), 112))
        for i, s in enumerate(day_slots)
    ]
    _path_d = f"M{_pts[0][0]:.1f},{_pts[0][1]:.1f} "
    for (x0, y0), (x1, y1) in zip(_pts, _pts[1:]):
        dx = (x1 - x0) / 3
        _path_d += f"C{x0 + dx:.1f},{y0:.1f} {x1 - dx:.1f},{y1:.1f} {x1:.1f},{y1:.1f} "
    _area_d = _path_d + f"L{_pts[-1][0]:.1f},190 L{_pts[0][0]:.1f},190 Z"
    _dots = "".join(
        f'<circle cx="{x:.1f}" cy="{y:.1f}" r="5" fill="#ffffff" stroke="#00ae9d" stroke-width="2.5"></circle>'
        f'<text x="{x:.1f}" y="{y - 12:.1f}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="11" '
        f'font-weight="800" fill="#00786d">{LEVEL_WORD.get(int(s.get("v", 2)), "Medium")}</text>'
        f'<text x="{x:.1f}" y="205" text-anchor="middle" font-family="Nunito, sans-serif" font-size="10.5" '
        f'font-weight="700" letter-spacing="0.06em" fill="#a8a8a8">{html_escape.escape(str(s.get("k", "")).upper())}</text>'
        for (x, y), s in zip(_pts, day_slots)
    )
    day_chart_svg = f"""<svg viewBox="0 0 600 220" width="100%" style="max-width:620px;display:block" aria-label="Your energy across the day">
      <g font-family="Nunito, sans-serif" font-size="10.5" fill="#a8a8a8">
        <line x1="{_plot_left}" y1="{_CHART_Y[3]}" x2="{_plot_right}" y2="{_CHART_Y[3]}" stroke="#ededed" stroke-dasharray="2 4"></line>
        <line x1="{_plot_left}" y1="{_CHART_Y[2]}" x2="{_plot_right}" y2="{_CHART_Y[2]}" stroke="#ededed" stroke-dasharray="2 4"></line>
        <line x1="{_plot_left}" y1="{_CHART_Y[1]}" x2="{_plot_right}" y2="{_CHART_Y[1]}" stroke="#ededed" stroke-dasharray="2 4"></line>
        <text x="70" y="{_CHART_Y[3] + 4}" text-anchor="end">HIGH</text>
        <text x="70" y="{_CHART_Y[2] + 4}" text-anchor="end">MEDIUM</text>
        <text x="70" y="{_CHART_Y[1] + 4}" text-anchor="end">LOW</text>
      </g>
      <path d="{_area_d}" fill="#00ae9d" fill-opacity="0.08"></path>
      <path d="{_path_d.strip()}" fill="none" stroke="#00ae9d" stroke-width="2.5"></path>
      {_dots}
    </svg>"""

    _levels = [int(s.get("v", 2)) for s in day_slots]
    _high_slots = [s.get("k") for s, v in zip(day_slots, _levels) if v == 3]
    _low_slots = [s.get("k") for s, v in zip(day_slots, _levels) if v == 1]
    if "Evening" in _high_slots or "Night" in _high_slots:
        day_reading = "Your energy does not taper toward evening the way it does for most people — it holds or lifts late, which is often why stopping and settling feels harder than it should."
    elif _levels and _levels[0] == max(_levels) and _levels.count(max(_levels)) == 1:
        day_reading = "Your day leads with its best energy and spends down from there. Put what matters most earliest, and treat the rest of the day as a gentle descent rather than a second climb."
    elif len(set(_levels)) == 1:
        day_reading = "Your energy holds fairly even across the day, without a strong peak or dip either way."
    else:
        day_reading = "You fall asleep slowly. Your energy has a real morning, and then it does not come back in the same way." if _low_slots else "Your energy moves through the day in a shape worth knowing, rather than staying flat."

    # The reference design pairs the chart with a short insight card
    # naming the lowest slot and reframing it — was entirely absent
    # from this generator.
    if _low_slots:
        _lowest_label = _low_slots[0].lower()
        day_insight = (
            f"Most people try to fix the {_lowest_label}. Your report does not, because your {_lowest_label} "
            "is not where the problem starts."
        )
    else:
        day_insight = "Nothing in your day stands out as a low point right now — that steadiness is worth naming too."

    # ---------------------------------------------------------------
    # Section 06 "How strain travels" — was two fixed example cards;
    # now reads the person's own rro["links"] (each already carries a
    # title/body/tier from scoring_streamlined.build_link_graph).
    # ---------------------------------------------------------------
    links = rro.get("links") or []
    ORDINAL_WORD = ["Strongest", "Second", "Third", "Fourth", "Fifth", "Sixth"]

    def _link_badge_text(link: Dict[str, Any], idx: int) -> str:
        pos = ORDINAL_WORD[idx] if idx < len(ORDINAL_WORD) else f"Link {idx + 1}"
        direction = "directional" if link.get("directional") else "no direction"
        return f"{pos}, {direction}".upper()

    def _link_card(link: Dict[str, Any], idx: int) -> str:
        strongest = idx == 0
        badge_text = _link_badge_text(link, idx)
        tier_text = str(link.get("tier", "")).lower() or "supported"
        if strongest:
            return (
                f'<div style="padding:18px 20px;border-radius:16px;background:#d6edea;break-inside:avoid">'
                f'<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">'
                f'<span style="font:800 15px \'Nunito\',sans-serif;color:#414242">{html_escape.escape(link.get("title", ""))}</span>'
                f'<span style="padding:3px 8px;border-radius:6px;background:#00ae9d;font:700 10.5px \'Nunito\',sans-serif;letter-spacing:.05em;color:#ffffff">{badge_text}</span></div>'
                f'<p style="margin:10px 0 0;font:400 14px/1.65 \'Nunito\',sans-serif;color:#00786d">{html_escape.escape(link.get("body", ""))}</p>'
                f'<p style="margin:12px 0 0;font:700 11.5px/1 \'Nunito\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#00ae9d">Evidence: {html_escape.escape(tier_text)}</p></div>'
            )
        return (
            f'<div style="padding:18px 20px;border-radius:16px;border:1px solid #ededed;break-inside:avoid">'
            f'<div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">'
            f'<span style="font:800 15px \'Nunito\',sans-serif;color:#414242">{html_escape.escape(link.get("title", ""))}</span>'
            f'<span style="padding:3px 8px;border-radius:6px;background:#faf0dc;font:700 10.5px \'Nunito\',sans-serif;letter-spacing:.05em;color:#b07c22">{badge_text}</span></div>'
            f'<p style="margin:10px 0 0;font:400 14px/1.65 \'Nunito\',sans-serif;color:#5f6060">{html_escape.escape(link.get("body", ""))}</p>'
            f'<p style="margin:12px 0 0;font:700 11.5px/1 \'Nunito\',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#a8a8a8">Evidence: {html_escape.escape(tier_text)}</p></div>'
        )

    if links:
        links_html = "".join(_link_card(links[i], i) for i in range(len(links)))
    else:
        links_html = (
            '<div style="padding:18px 20px;border-radius:16px;border:1px solid #ededed">'
            '<p style="margin:0;font:400 14px/1.65 \'Nunito\',sans-serif;color:#5f6060">'
            f'{html_escape.escape(rro.get("links_not_drawn") or "Your answers do not show strong clustering between areas right now. Each area appears to be moving largely on its own terms.")}'
            '</p></div>'
        )

    # "What we did not draw" — always-true methodology note (links are
    # only drawn where both areas are under strain AND something in the
    # person's own answers named the connection), matching the
    # reference design's closing honesty card for this section.
    not_drawn_icon = (
        '<svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#a8a8a8" stroke-width="1.75" '
        'stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none">'
        '<circle cx="18" cy="5.5" r="2.5"></circle><circle cx="6" cy="12" r="2.5"></circle><circle cx="18" cy="18.5" r="2.5"></circle>'
        '<path d="M15.8 6.8 8.2 10.7M8.2 13.3l7.6 3.9" stroke-dasharray="2.5 3"></path></svg>'
    )
    _holding_names = [d["label"] for d in (dims_by_band[3] + dims_by_band[4])[:2]]
    not_drawn_body = (
        f"Your {_holding_names[0].lower()} and your {_holding_names[1].lower()} are both holding, so no link was drawn "
        "between them even where research connects them. "
        if len(_holding_names) >= 2 else ""
    ) + "Links are only drawn where both areas are under strain and something in your own answers named the connection."
    not_drawn_html = f"""<div style="display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;margin-top:16px;padding:20px 22px;border-radius:16px;background:#f4f4f4;break-inside:avoid">
      {not_drawn_icon}
      <div>
        <p style="margin:0;font:800 14px/1.4 'Nunito',sans-serif;color:#414242">What we did not draw</p>
        <p style="margin:8px 0 0;font:400 14px/1.7 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(not_drawn_body)}</p>
      </div>
    </div>"""

    # Connection map — a simplified, generalised version of the reference
    # design's node diagram: every dimension touched by any link gets a
    # node (positioned on the same fixed wheel as the cover/section-02
    # petal chart, sized/coloured by its band); each link is a line
    # between its two nodes, thickness by weight, arrowhead when
    # directional. ponytail: straight lines, not the brief's hand-tuned
    # curves — the per-card text below already carries the exact meaning.
    connection_map_svg = ""
    if links:
        import math as _math
        _node_keys = sorted({k for l in links for k in (l.get("source"), l.get("target")) if k})
        _cx, _cy, _r = 390, 210, 155
        _positions = {}
        for k in _node_keys:
            ang = _math.radians(NODE_WHEEL_ANGLE.get(k, 0) - 90)
            _positions[k] = (_cx + _r * _math.cos(ang), _cy + _r * _math.sin(ang))
        _edge_svgs = []
        for i, l in enumerate(links):
            s, t = l.get("source"), l.get("target")
            if s not in _positions or t not in _positions:
                continue
            x1, y1 = _positions[s]
            x2, y2 = _positions[t]
            width = 2 + min(float(l.get("weight", 0.5)), 1.0) * 9
            color = "#00ae9d" if i == 0 else ("#d9a44a" if i == 1 else "#c9cccb")
            _edge_svgs.append(f'<line x1="{x1:.0f}" y1="{y1:.0f}" x2="{x2:.0f}" y2="{y2:.0f}" stroke="{color}" stroke-width="{width:.1f}" stroke-linecap="round"></line>')
            if l.get("directional"):
                _ang = _math.atan2(y2 - y1, x2 - x1)
                _ax, _ay = x1 + (x2 - x1) * 0.55, y1 + (y2 - y1) * 0.55
                _p1 = (_ax - 9 * _math.cos(_ang - 0.5), _ay - 9 * _math.sin(_ang - 0.5))
                _p2 = (_ax - 9 * _math.cos(_ang + 0.5), _ay - 9 * _math.sin(_ang + 0.5))
                _edge_svgs.append(f'<path d="M{_p1[0]:.0f},{_p1[1]:.0f} L{_ax:.0f},{_ay:.0f} L{_p2[0]:.0f},{_p2[1]:.0f}" fill="{color}"></path>')
        _node_svgs = []
        for k in _node_keys:
            x, y = _positions[k]
            d = dim_map.get(k)
            if not d:
                continue
            band_meta = BAND_META.get(d["band"], BAND_META[2])
            _node_svgs.append(
                f'<circle cx="{x:.0f}" cy="{y:.0f}" r="46" fill="{band_meta["row_bg"]}" stroke="{band_meta["chip_ink"]}" stroke-width="1.5"></circle>'
                f'<text x="{x:.0f}" y="{y + 8:.0f}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="23" font-weight="800" fill="{band_meta["chip_ink"]}">{d["score"]}</text>'
                f'<text x="{x:.0f}" y="{y + 66:.0f}" text-anchor="middle" font-family="Nunito, sans-serif" font-size="12" font-weight="800" fill="#414242">{html_escape.escape(d["label"])}</text>'
            )
        connection_map_svg = f"""<div style="break-inside:avoid">
          <svg viewBox="0 0 780 420" width="100%" style="max-width:780px;display:block" aria-label="Connection map, links scaled by weight">
            {"".join(_edge_svgs)}
            {"".join(_node_svgs)}
          </svg>
          <p style="margin:4px 0 0;font:400 12px/1.6 'Nunito',sans-serif;color:#a8a8a8">Line thickness follows how strongly the link is evidenced. The arrow marks the one link that has a direction.</p>
        </div>"""

    # ---------------------------------------------------------------
    # Section 07 "Where one change reaches furthest" — was fixed to
    # Body/Emotional calm/Money; now reads rro["root_driver"] (the
    # actual computed leverage pick) plus whichever other dimensions
    # are its strongest links, falling back to the two lowest-scoring
    # other dimensions when no link touches it.
    # ponytail: link-based "sharpest reading"/"runner up" phrasing is a
    # simplification (short causal blurbs aren't a stored field) — the
    # driver pick and runner-up dimension themselves are exact.
    # ---------------------------------------------------------------
    root_driver = rro.get("root_driver") or {"key": dim_body["key"], "label": dim_body["label"],
                                              "why_this": "Because " + dim_body["why"].lower()}
    driver_label = root_driver.get("label", dim_body["label"])
    driver_key = root_driver.get("key")
    touching = sorted(
        (l for l in links if driver_key and (l.get("source") == driver_key or l.get("target") == driver_key)),
        key=lambda l: l.get("weight", 0), reverse=True,
    )

    def _other_end(link: Dict[str, Any]) -> Optional[str]:
        other_key = link["target"] if link.get("source") == driver_key else link.get("source")
        other = dim_map.get(other_key)
        return other["label"] if other else None

    reach_picks: List[Dict[str, str]] = []
    seen_labels = {driver_label}
    for link in touching:
        name = _other_end(link)
        if name and name not in seen_labels:
            downstream = bool(link.get("directional")) and link.get("source") == driver_key
            reach_picks.append({
                "name": name,
                "blurb": f"Connected through: {link.get('title', 'a shared pattern')}.",
                "tag": "Downstream" if downstream else "Alongside",
            })
            seen_labels.add(name)
        if len(reach_picks) == 2:
            break
    if len(reach_picks) < 2:
        for d in sorted(all_dims, key=lambda d: d["score"]):
            if d["label"] not in seen_labels:
                reach_picks.append({
                    "name": d["label"],
                    "blurb": "Also among the areas asking for the most attention right now.",
                    "tag": "Also strained",
                })
                seen_labels.add(d["label"])
            if len(reach_picks) == 2:
                break
    _empty_pick = {"name": "", "blurb": "", "tag": ""}
    sharpest, runner_up = (reach_picks + [_empty_pick, _empty_pick])[:2]
    driver_blurb = root_driver.get("why_this") or f"{driver_label} is where the evidence points."
    honesty_note = root_driver.get("honesty_rider")

    def _tag_icon(tag: str) -> str:
        if tag == "Downstream":
            path = '<path d="M3.5 12h17M14 5.5 20.5 12 14 18.5"></path>'
        elif tag == "Alongside":
            path = '<path d="M3.8 12a8.2 8.2 0 0 1 14-5.8M20.2 4.5V10h-5.5M20.2 12a8.2 8.2 0 0 1-14 5.8M3.8 19.5V14h5.5"></path>'
        else:
            path = '<circle cx="12" cy="12" r="9"></circle><path d="M12 8v5M12 15.5h.01"></path>'
        return (
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" '
            f'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none">{path}</svg>'
        )

    # ---------------------------------------------------------------
    # Section 09 "The one thing" — the "why this one" line was fixed to
    # "Your body...". Now built from suggestion's own why_this/
    # dose_honesty fields (already computed per-driver in
    # scoring_streamlined.select_suggestion).
    # ---------------------------------------------------------------
    why_this_one = " ".join(
        filter(None, [suggestion.get("why_this"), suggestion.get("dose_honesty")])
    ) or "This is where one small change reaches furthest, sized to meet you where you are."

    evidence_note = suggestion.get("evidence_note") or (
        "Based on implementation-intention research showing if-then cues meaningfully improve follow-through."
    )

    # Generic, true regardless of which habit was chosen — the cue-then-
    # action form itself, not the specific action, is what the research
    # backs.
    shaped_this_way_note = (
        'The specific form, "after X, I will do Y", is not a stylistic choice. Attaching a new action to an '
        "existing cue has support in its own right, independent of what the action is."
    )

    # "What this report is not asking of you" — names the hardest-hit
    # area that this week's one small step does NOT try to move, so the
    # report is honest about its own limits rather than implying the
    # one habit fixes everything.
    _not_asking_candidates = [d for d in all_dims if d["key"] != driver_key]
    not_asking_note = ""
    if _not_asking_candidates:
        _hardest = min(_not_asking_candidates, key=lambda d: d["score"])
        if _hardest["band"] == 1:
            not_asking_note = (
                f'Nothing about your {_hardest["label"].lower()} this month. '
                f'That reading is one of the hardest in this report, and no small next step moves it in a week. '
                "It is in the report because it is true, not because it is this month's work."
            )

    # ---------------------------------------------------------------
    # Section 10 "Confidence" — was 4 fixed rows; now every dimension
    # from rro["confidence_table"] (already computed for all nine).
    # ---------------------------------------------------------------
    CONF_DOTS = {"A": "●●●", "B": "●●○", "C": "●○○"}
    confidence_rows = rro.get("confidence_table") or [
        [d["label"], DEFAULT_CONFIDENCE.get(d["key"], "B"),
         "Composite reflection scale" if DEFAULT_CONFIDENCE.get(d["key"]) == "C" else "Standard validated rescale"]
        for d in all_dims
    ]
    confidence_rows_html = "".join(
        f'<tr><td style="padding:10px 10px 10px 0;border-bottom:1px solid #ededed;font:800 13.5px \'Nunito\',sans-serif">{html_escape.escape(str(row[0]))}</td>'
        f'<td style="padding:10px;border-bottom:1px solid #ededed;color:#00ae9d;font-weight:700">{CONF_DOTS.get(str(row[1]), "●●○")}</td>'
        f'<td style="padding:10px 0 10px 10px;border-bottom:1px solid #ededed;font:400 13px \'Nunito\',sans-serif;color:#5f6060">{html_escape.escape(str(row[2]))}</td></tr>'
        for row in confidence_rows
    )

    # ---------------------------------------------------------------
    # Section 11 "What we used" — was only the disclaimer; now also the
    # two lists it names in its own title (questionnaires, and the
    # research behind whichever section-06 connections actually fired
    # for this person), both already computed in rro["sources"].
    # ---------------------------------------------------------------
    sources = rro.get("sources") or {}
    instruments_li = "".join(
        f'<li style="margin:0 0 10px;font:400 13.5px/1.5 \'Nunito\',sans-serif;color:#00786d">{html_escape.escape(str(i.get("desc", "")))}</li>'
        for i in (sources.get("instruments") or [])
    )
    _fired_pairs = {(l.get("source"), l.get("target")) for l in links}
    _fired_pairs |= {(t, s) for s, t in _fired_pairs}

    def _evidence_fired(evidence_entry: Dict[str, Any]) -> bool:
        if not links:
            return True  # nothing fired at all -> show the general evidence list as-is
        parts = (evidence_entry.get("pair") or "").split(" to ")
        return len(parts) == 2 and tuple(p.strip() for p in parts) in _fired_pairs

    evidence_li = "".join(
        f'<li style="margin:0 0 10px;font:400 13.5px/1.5 \'Nunito\',sans-serif;color:#00786d">{html_escape.escape(str(e.get("citation", "")))}</li>'
        for e in (sources.get("link_evidence") or [])
        if _evidence_fired(e)
    )
    if not evidence_li and links:
        evidence_li = '<li style="margin:0 0 10px;font:400 13.5px/1.5 \'Nunito\',sans-serif;color:#00786d">See the connection cards in section 06 for what each pattern draws on.</li>'

    # The real Lewis lockup (traced from the reference brief's own
    # assets/logo-lewis.svg) in place of a plain text wordmark.
    def _lewis_logo(height: int) -> str:
        return (
            f'<svg viewBox="0 0 248 82" width="{int(height * 248 / 82)}" height="{height}" role="img" aria-label="Lewis" style="display:block">'
            '<path d="M11 41 V11 H41" fill="none" stroke="#00AE9D" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path>'
            '<path d="M71 41 V71 H41" fill="none" stroke="#5FBB46" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"></path>'
            '<circle cx="41" cy="41" r="11" fill="#00AE9D"></circle>'
            '<circle cx="71" cy="11" r="7" fill="#5FBB46"></circle>'
            '<circle cx="11" cy="71" r="7" fill="#00AE9D"></circle>'
            '<text x="113" y="57" font-family="Nunito, Helvetica, Arial, sans-serif" font-weight="800" font-size="44" letter-spacing="-1.4" fill="#16302B">Lewis</text>'
            "</svg>"
        )

    # Icons for the "what matters most" priority cards (section 01) — the
    # three the reference design shows (body, emotional calm, money) are
    # traced from its own markup; the rest borrow from the same thin-line
    # icon family already used elsewhere in the app (frontend/src/report/
    # icons.jsx) so a priority outside those three still gets a fitting
    # icon rather than none. ponytail: not every one of the 9 is pixel-
    # traced from a reference example — the brief only ever shows 3.
    _PRIORITY_ICON_PATHS = {
        "PH": '<circle cx="12" cy="5" r="2.4"></circle><path d="M12 7.6v4.6M12 12.2c-2 0-3.7 1-4.8 2.6M12 12.2c2 0 3.7 1 4.8 2.6M4.8 19.9h14.4M7 19.9c0-2.8 2.2-4.9 5-4.9s5 2.1 5 4.9"></path>',
        "EM": '<path d="M3.5 8.6h9.2a3 3 0 1 0-3-3M3.5 15.4h12.7a3 3 0 1 1-3 3M3.5 12h6.5"></path>',
        "FW": '<path d="M3.5 8.5a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z"></path><path d="M3.5 8.4V6.5a2 2 0 0 1 2-2h10.5"></path><circle cx="16.8" cy="13" r="1.4"></circle>',
        "EN": '<circle cx="12" cy="12" r="4"></circle><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"></path>',
        "RS": '<circle cx="9" cy="8" r="3"></circle><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"></path><circle cx="17.5" cy="9" r="2.4"></circle><path d="M15.8 13.7c2.9.4 5.2 2.9 5.2 6"></path>',
        "MS": '<circle cx="12" cy="12" r="9"></circle><path d="m15 9-2 6-6 2 2-6z"></path>',
        "AC": '<circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="5"></circle><circle cx="12" cy="12" r="1"></circle>',
        "IG": '<path d="m11.5 2.3-1.4 3.6a1.8 1.8 0 0 1-1 1l-3.6 1.4 3.6 1.4a1.8 1.8 0 0 1 1 1l1.4 3.6 1.4-3.6a1.8 1.8 0 0 1 1-1l3.6-1.4-3.6-1.4a1.8 1.8 0 0 1-1-1z"></path><circle cx="18.5" cy="17.5" r="2"></circle>',
        "EC": '<path d="M2.5 8c.6.5 1.4 1 2.9 1 2.6 0 2.6-2 5.1-2 2.6 0 2.6 2 5.1 2 2.6 0 2.6-2 5.1-2 1.5 0 2.3.5 2.8 1M2.5 14c.6.5 1.4 1 2.9 1 2.6 0 2.6-2 5.1-2 2.6 0 2.6 2 5.1 2 2.6 0 2.6-2 5.1-2 1.5 0 2.3.5 2.8 1"></path>',
    }

    def _priority_icon(dim_key: str) -> str:
        path = _PRIORITY_ICON_PATHS.get(dim_key, _PRIORITY_ICON_PATHS["MS"])
        return (
            '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#cf7f5e" '
            'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block">'
            f"{path}</svg>"
        )

    def _priority_card(label: str) -> str:
        # top3 stores label strings, not dimension keys — match back to one.
        matched_key = next((d["key"] for d in all_dims if d["label"] == label), None)
        icon = _priority_icon(matched_key or "")
        return (
            f'<div style="padding:16px;border-radius:14px;background:#f7e8e0">{icon}'
            f'<p style="margin:12px 0 0;font:700 14px/1.35 \'Nunito\',sans-serif;color:#414242">{html_escape.escape(str(label))}</p></div>'
        )

    priority_cards_html = "".join(_priority_card(label) for label in top3)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>LEWIS Insight Report — {html_escape.escape(user_name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
<style>
* {{ box-sizing: border-box; }}
@page {{ margin: 0; }}
body {{
  margin: 0;
  font-family: 'Nunito', system-ui, -apple-system, sans-serif;
  color: #414242;
  background: #ffffff;
  -webkit-font-smoothing: antialiased;
}}
.report-page-container {{
  max-width: 800px;
  margin: 0 auto;
  background: #ffffff;
}}
section.report-section {{
  page-break-after: auto;
  break-after: auto;
  padding-top: 10px;
  padding-bottom: 20px;
}}
@media print {{
  body {{ background: #ffffff !important; padding: 0 !important; }}
  .report-page-container {{ width: 210mm !important; max-width: none !important; margin: 0 !important; padding: 14mm 16mm !important; border: none !important; box-shadow: none !important; }}
  .no-print {{ display: none !important; }}
  section.report-section {{
    page-break-after: auto !important;
    break-after: auto !important;
    border-bottom: 1px solid #ededed !important;
  }}
  section.report-section:last-of-type {{ border-bottom: none !important; }}
  * {{ -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }}
}}
@media screen {{
  body {{ background: #f0f4f3; padding: 40px 16px; }}
  .report-page-container {{
    border-radius: 20px;
    padding: 44px 44px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.06);
  }}
  section.report-section {{
    padding-top: 36px;
    padding-bottom: 36px;
    border-bottom: 1px solid #ededed;
  }}
  section.report-section:last-of-type {{
    border-bottom: none;
  }}
}}
</style>
</head>
<body>

<div class="report-page-container">

  <!-- ==================== COVER SECTION ==================== -->
  <section class="report-section" data-screen-label="Cover">
    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;padding-bottom:20px;border-bottom:1px solid #ededed">
      {_lewis_logo(34)}
      <span style="font:700 10.5px/1 'Nunito',sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#00ae9d">Wellbeing intelligence</span>
    </div>

    <div style="display:grid;gap:16px;padding:36px 0 0">
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.22em;text-transform:uppercase;color:#a8a8a8">Insight report</span>
      <h1 style="margin:0;font:800 54px/1.02 'Nunito',sans-serif;letter-spacing:-.025em;color:#414242">Your reflection.</h1>
      <p style="margin:0;font:400 17px/1.6 'Nunito',sans-serif;color:#5f6060;max-width:46ch">Nine areas of your life, read back to you from your own answers. Where things sit, how they connect, and the one place a small change reaches furthest.</p>
      <div style="display:flex;flex-wrap:wrap;gap:10px;padding-top:4px">
        <span style="display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:8px;background:#d6edea;font:700 12px 'Nunito',sans-serif;color:#00786d">{html_escape.escape(user_name)}</span>
        <span style="display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:8px;background:#f4f4f4;font:600 12px 'Nunito',sans-serif;color:#5f6060">{date_display}</span>
        <span style="display:inline-flex;align-items:center;height:32px;padding:0 14px;border-radius:8px;background:#f4f4f4;font:600 12px 'Nunito',sans-serif;color:#5f6060">39 answers · 11 sections</span>
      </div>
    </div>

    <div style="display:grid;place-items:center;padding:24px 0 10px">
      <svg viewBox="-190 -190 380 380" width="100%" style="max-width:390px;display:block" aria-label="Your nine areas, drawn as petals">
        <g fill="none" stroke="#ededed" stroke-width="1">
          <circle cx="0" cy="0" r="57"></circle><circle cx="0" cy="0" r="88"></circle><circle cx="0" cy="0" r="119"></circle><circle cx="0" cy="0" r="150"></circle>
        </g>
        <g stroke="#ffffff" stroke-width="1.25">
          {petals_svg_inner}
        </g>
        <circle cx="0" cy="0" r="3.5" fill="#ffffff"></circle>
      </svg>
    </div>

    <div style="display:flex;justify-content:space-between;gap:16px;padding-top:18px;border-top:1px solid #ededed">
      <span style="font:400 11px/1.5 'Nunito',sans-serif;color:#a8a8a8">A reflection, not a verdict. LEWIS is non clinical.</span>
      <span style="font:400 11px/1.5 'Nunito',sans-serif;color:#a8a8a8">Lewis · lewiswellbeing.com</span>
    </div>
  </section>

  <!-- ==================== 01 WHERE THIS STARTS ==================== -->
  <section class="report-section" data-screen-label="01 Where this starts">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">01</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">Where this starts</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <p style="margin:0 0 24px;font:400 25px/1.4 'Nunito',sans-serif;color:#414242;max-width:32ch">You arrived here describing yourself as <strong style="font-weight:800;color:#00786d">{html_escape.escape(str(arrival_word))}</strong>.</p>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;align-items:start;break-inside:avoid">
      <p style="margin:0;font:400 14.5px/1.7 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(opening_voice) if opening_voice else "Some of what follows is hard, and none of it is a verdict on you."}</p>
      <div style="padding:16px 20px;border-radius:16px;background:#d6edea">
        <p style="margin:0;font:700 14.5px/1.55 'Nunito',sans-serif;color:#00786d">This describes the season you are in, not the kind of person you are.</p>
      </div>
    </div>

    <div style="margin-top:28px;padding:24px;border:1px solid #ededed;border-radius:20px;break-inside:avoid">
      <span style="font:700 10.5px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">What matters most to you right now</span>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:16px">
        {priority_cards_html}
      </div>
      <p style="margin:20px 0 0;font:400 14.5px/1.7 'Nunito',sans-serif;color:#5f6060">Your answers point to your {html_escape.escape(str(tension_dim["label"]).lower())} as the one that is furthest from where you want it. {"We asked whether that felt right, and you said yes." if tension_confirmed else "We asked whether that felt right, and left room for it to be otherwise."}</p>
      <div style="display:flex;align-items:center;gap:12px;margin-top:18px;padding-top:18px;border-top:1px dashed #ededed">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#00ae9d;flex:none;color:#ffffff;font-weight:800;font-size:14px">✓</span>
        <p style="margin:0;font:600 14px/1.55 'Nunito',sans-serif;color:#00786d">So that is where this report begins. Not because it is the loudest thing, but because you told us it is both what you care about and what is thinnest.</p>
      </div>
    </div>
  </section>

  <!-- ==================== 02 THE SHAPE ==================== -->
  <section class="report-section" data-screen-label="02 The shape">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">02</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">The shape of your wellbeing</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <div style="display:grid;place-items:center;break-inside:avoid">
      <svg viewBox="-260 -200 520 400" width="100%" style="max-width:540px;display:block" aria-label="Nine petal diagram of your nine areas">
        <g fill="none" stroke="#ededed" stroke-width="1" stroke-dasharray="2 4">
          <circle cx="0" cy="0" r="57"></circle><circle cx="0" cy="0" r="88"></circle><circle cx="0" cy="0" r="119"></circle>
        </g>
        <circle cx="0" cy="0" r="150" fill="none" stroke="#e0e0e0" stroke-width="1"></circle>
        <g stroke="#ffffff" stroke-width="1.5">
          {petals_svg_inner}
        </g>
        <circle cx="0" cy="0" r="4" fill="#ffffff"></circle>
        <g font-family="Nunito, sans-serif" font-size="11.5" font-weight="700">
          <text x="0" y="-160" text-anchor="middle" fill="#5f6060">Body <tspan fill="#cf7f5e">{dim_body['score']}</tspan></text>
          <text x="101.6" y="-117" text-anchor="start" fill="#5f6060">Emotional calm <tspan fill="#cf7f5e">{dim_calm['score']}</tspan></text>
          <text x="155.6" y="-23" text-anchor="start" fill="#5f6060">Energy <tspan fill="#d9a44a">{dim_energy['score']}</tspan></text>
          <text x="136.8" y="83" text-anchor="start" fill="#5f6060">Relationships <tspan fill="#00ae9d">{dim_rel['score']}</tspan></text>
          <text x="54" y="160" text-anchor="start" fill="#5f6060">Meaning <tspan fill="#00ae9d">{dim_mean['score']}</tspan></text>
          <text x="-54" y="160" text-anchor="end" fill="#5f6060">Progress <tspan fill="#00ae9d">{dim_prog['score']}</tspan></text>
          <text x="-136.8" y="83" text-anchor="end" fill="#5f6060">Money <tspan fill="#cf7f5e">{dim_money['score']}</tspan></text>
          <text x="-155.6" y="-23" text-anchor="end" fill="#5f6060">Curiosity <tspan fill="#cf7f5e">{dim_cur['score']}</tspan></text>
          <text x="-101.6" y="-117" text-anchor="end" fill="#5f6060">Surroundings <tspan fill="#d9a44a">{dim_surr['score']}</tspan></text>
        </g>
      </svg>
    </div>

    <p style="margin:6px 0 20px;font:400 13px/1.65 'Nunito',sans-serif;color:#808080;max-width:70ch">This shows how the nine areas sit relative to each other <strong style="font-weight:700;color:#5f6060">in your own answers</strong>. It is not a league table, and a 60 in one area does not mean the same thing as a 60 in another.</p>

    <div style="display:grid;gap:8px;break-inside:avoid">
      {band_rows_html}
    </div>

    <p style="margin:18px 0 0;font:400 14.5px/1.7 'Nunito',sans-serif;color:#5f6060">{band_summary_line}</p>
  </section>

  <!-- ==================== 03 WHAT EACH AREA ASKS ==================== -->
  <section class="report-section" data-screen-label="03 What each area asks">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">03</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">What each area asks of you</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    {band_asks_html}
  </section>

  <!-- ==================== 04 WHERE TENSION SETTLES ==================== -->
  <section class="report-section" data-screen-label="04 Where tension settles">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">04</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">Where tension settles in your body</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <div style="display:grid;grid-template-columns:{"1fr 1.1fr" if zones else "1fr"};gap:24px;align-items:start;break-inside:avoid">
      {f'<div style="padding-top:6px">{body_map_svg}</div>' if zones else ""}
      <div>
        <p style="margin:0 0 16px;font:400 15px/1.55 'Nunito',sans-serif;color:#414242">{zones_intro}</p>
        <div style="padding:18px 20px;border-radius:16px;border:1px solid #ededed">
          <span style="font:700 10.5px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">Your inner state</span>
          <p style="margin:10px 0 0;font:800 22px/1.2 'Nunito',sans-serif;color:#cf7f5e">{html_escape.escape(inner_state)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:14px">
            <span style="display:inline-flex;align-items:center;height:26px;padding:0 10px;border-radius:8px;background:#f4f4f4;font:600 11.5px 'Nunito',sans-serif;color:#5f6060">Pattern: {html_escape.escape(cluster_name)}</span>
          </div>
        </div>
      </div>
    </div>

    <p style="margin:20px 0 0;font:400 14.5px/1.7 'Nunito',sans-serif;color:#5f6060">{tension_summary}</p>

    <div style="margin-top:20px;padding:18px 20px;border-radius:16px;background:#d6edea;break-inside:avoid">
      <span style="font:700 10.5px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#00786d">One minute of breathing</span>
      <div style="margin:14px 0 10px;max-width:420px">{breathing_scale_svg}</div>
      <p style="margin:0;font:400 13.5px/1.6 'Nunito',sans-serif;color:#00786d">Before this report, you rated your tension at {t_before} out of 10. After sixty seconds of breathing, you rated it at {t_after} out of 10. This is about how your body settled with the breath. A small experiment, not a medical reading. But it is evidence, from you, that your body can come down when given a chance to.</p>
    </div>
  </section>

  <!-- ==================== 05 YOUR DAY ==================== -->
  <section class="report-section" data-screen-label="05 Your day">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">05</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">Your day, as you described it</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <div style="padding:16px 20px 6px;border-radius:16px;background:#f9fafb;margin-bottom:16px;break-inside:avoid">
      {day_chart_svg}
    </div>
    <div style="display:grid;grid-template-columns:1.4fr 1fr;gap:20px;align-items:start;break-inside:avoid">
      <p style="margin:0;font:400 14.5px/1.7 'Nunito',sans-serif;color:#5f6060">{day_reading}</p>
      <div style="padding:16px 18px;border-radius:14px;background:#f4f4f4">
        <p style="margin:0;font:700 14px/1.55 'Nunito',sans-serif;color:#414242">{html_escape.escape(day_insight)}</p>
      </div>
    </div>
  </section>

  <!-- ==================== 06 HOW STRAIN TRAVELS ==================== -->
  <section class="report-section" data-screen-label="06 How strain travels">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">06</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">How strain in one area is arriving in the next</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    {connection_map_svg}

    <div style="display:grid;gap:12px;margin-top:{"24px" if connection_map_svg else "0"}">
      {links_html}
    </div>

    {not_drawn_html if links else ""}
  </section>

  <!-- ==================== 07 WHERE ONE CHANGE REACHES FURTHEST ==================== -->
  <section class="report-section" data-screen-label="07 Where one change reaches furthest">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">07</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">Where one change reaches furthest</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <div style="display:grid;gap:6px;margin-bottom:20px">
      <p style="margin:0;font:800 36px/1.1 'Nunito',sans-serif;letter-spacing:-.02em;color:#00786d">{html_escape.escape(driver_label)}.</p>
      <p style="margin:0;font:400 16px/1.5 'Nunito',sans-serif;color:#5f6060">Not the one that hurts most. The one most connected to the rest.</p>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;break-inside:avoid">
      <div style="padding:16px 18px;border-radius:16px;border:1px solid #ededed">
        <span style="font:700 10.5px 'Nunito',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a8a8a8">Sharpest reading</span>
        <p style="margin:8px 0 0;font:800 15px 'Nunito',sans-serif;color:#414242">{html_escape.escape(sharpest["name"])}</p>
        <p style="margin:8px 0 0;font:400 13px/1.6 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(sharpest["blurb"])}</p>
        <div style="display:flex;align-items:center;gap:8px;margin-top:14px;color:#a8a8a8">{_tag_icon(sharpest["tag"])}<span style="font:700 11.5px 'Nunito',sans-serif;color:#808080">{html_escape.escape(sharpest["tag"])}</span></div>
      </div>
      <div style="padding:16px 18px;border-radius:16px;border:1px solid #ededed">
        <span style="font:700 10.5px 'Nunito',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#a8a8a8">Runner up</span>
        <p style="margin:8px 0 0;font:800 15px 'Nunito',sans-serif;color:#414242">{html_escape.escape(runner_up["name"])}</p>
        <p style="margin:8px 0 0;font:400 13px/1.6 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(runner_up["blurb"])}</p>
        <div style="display:flex;align-items:center;gap:8px;margin-top:14px;color:#a8a8a8">{_tag_icon(runner_up["tag"])}<span style="font:700 11.5px 'Nunito',sans-serif;color:#808080">{html_escape.escape(runner_up["tag"])}</span></div>
      </div>
      <div style="padding:16px 18px;border-radius:16px;background:#d6edea">
        <span style="font:700 10.5px 'Nunito',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#00786d">Where we point</span>
        <p style="margin:8px 0 0;font:800 15px 'Nunito',sans-serif;color:#414242">{html_escape.escape(driver_label)}</p>
        <p style="margin:8px 0 0;font:400 13px/1.6 'Nunito',sans-serif;color:#00786d">{html_escape.escape(driver_blurb)}</p>
      </div>
    </div>

    {f'''<div style="display:grid;grid-template-columns:auto 1fr;gap:16px;align-items:start;margin-top:22px;padding:20px 22px;border-radius:16px;background:#f4f4f4;break-inside:avoid">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#808080" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5.5M12 7.6h.01"></path></svg>
      <div>
        <p style="margin:0;font:800 14px/1.4 'Nunito',sans-serif;color:#414242">One honesty note</p>
        <p style="margin:8px 0 0;font:400 14px/1.7 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(honesty_note)}</p>
      </div>
    </div>''' if honesty_note else ""}
  </section>

  <!-- ==================== 08 GROUND YOU CAN RELY ON ==================== -->
  <section class="report-section" data-screen-label="08 Ground you can rely on">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">08</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">Ground you can rely on</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <div style="padding:12px 0 4px;break-inside:avoid">
      {ground_chart_svg}
    </div>

    {bright_quote_html}

    <p style="margin:20px 0 0;font:400 14.5px/1.7 'Nunito',sans-serif;color:#5f6060">{ground_paragraph}</p>

    {f'''<div style="display:grid;grid-template-columns:{"1fr 1fr" if instinct_gap_html else "1fr"};gap:16px;margin-top:18px">
      {sitting_with_html}
      {instinct_gap_html}
    </div>''' if (sitting_with_html or instinct_gap_html) else ""}
  </section>

  <!-- ==================== 09 THE ONE THING ==================== -->
  <section class="report-section" data-screen-label="09 The one thing">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">09</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">The one thing</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <p style="margin:0 0 16px;font:400 14.5px/1.7 'Nunito',sans-serif;color:#5f6060">You told us you want one thing to focus on, not a plan. So this is one thing.</p>

    <div style="padding:26px 28px;border-radius:20px;background:#00ae9d;break-inside:avoid;color:#ffffff">
      <span style="display:inline-block;padding:3px 10px;border-radius:6px;background:rgba(255,255,255,.22);font:700 10.5px 'Nunito',sans-serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px">Cue → Action</span>
      <p style="margin:0;font:800 26px/1.3 'Nunito',sans-serif;color:#ffffff">{html_escape.escape(sug_cue)}, {html_escape.escape(sug_action)}.</p>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:16px">
      <div style="padding:18px 20px;border-radius:16px;border:1px solid #ededed;break-inside:avoid">
        <p style="margin:0;font:800 14px 'Nunito',sans-serif;color:#414242">Why this one</p>
        <p style="margin:8px 0 0;font:400 13.5px/1.65 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(why_this_one)}</p>
      </div>
      <div style="padding:18px 20px;border-radius:16px;background:#f4f4f4;break-inside:avoid">
        <p style="margin:0;font:800 14px 'Nunito',sans-serif;color:#414242">What the evidence says</p>
        <p style="margin:8px 0 0;font:400 13.5px/1.65 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(evidence_note)}</p>
      </div>
      <div style="padding:18px 20px;border-radius:16px;border:1px solid #ededed;break-inside:avoid">
        <p style="margin:0;font:800 14px 'Nunito',sans-serif;color:#414242">Why it is shaped this way</p>
        <p style="margin:8px 0 0;font:400 13.5px/1.65 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(shaped_this_way_note)}</p>
      </div>
      {f'''<div style="padding:18px 20px;border-radius:16px;background:#f7e8e0;break-inside:avoid">
        <p style="margin:0;font:800 14px 'Nunito',sans-serif;color:#414242">What this report is not asking of you</p>
        <p style="margin:8px 0 0;font:400 13.5px/1.65 'Nunito',sans-serif;color:#5f6060">{html_escape.escape(not_asking_note)}</p>
      </div>''' if not_asking_note else ""}
    </div>
  </section>

  <!-- ==================== 10 CONFIDENCE ==================== -->
  <section class="report-section" data-screen-label="10 Confidence">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">10</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">How confident this report is, area by area</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <div style="display:flex;flex-wrap:wrap;gap:16px;margin-bottom:14px">
      <span style="font:600 11.5px 'Nunito',sans-serif;color:#00ae9d">●●● Well supported</span>
      <span style="font:600 11.5px 'Nunito',sans-serif;color:#00ae9d">●●○ Reasonably supported</span>
      <span style="font:600 11.5px 'Nunito',sans-serif;color:#00ae9d">●○○ Held loosely</span>
    </div>

    <table style="width:100%;border-collapse:collapse">
      <thead>
        <tr>
          <th style="text-align:left;padding:0 10px 8px 0;border-bottom:1px solid #414242;font:700 10.5px 'Nunito',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#414242">Area</th>
          <th style="text-align:left;padding:0 10px 8px;border-bottom:1px solid #414242;font:700 10.5px 'Nunito',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#414242">Level</th>
          <th style="text-align:left;padding:0 0 8px 10px;border-bottom:1px solid #414242;font:700 10.5px 'Nunito',sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#414242">Why</th>
        </tr>
      </thead>
      <tbody>
        {confidence_rows_html}
      </tbody>
    </table>

    <p style="margin:20px 0 0;font:700 14.5px/1.6 'Nunito',sans-serif;color:#414242">Where we are less confident, we have said so rather than making the report feel stronger than it is.</p>
  </section>

  <!-- ==================== 11 WHAT WE USED ==================== -->
  <section class="report-section" data-screen-label="11 What we used">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <span style="font:800 11px/1 'Nunito',sans-serif;letter-spacing:.2em;color:#00ae9d">11</span>
      <span style="font:700 11px/1 'Nunito',sans-serif;letter-spacing:.16em;text-transform:uppercase;color:#a8a8a8">What we used</span>
      <span style="flex:1;height:1px;background:#ededed"></span>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px">
      <div>
        <p style="margin:0 0 10px;font:800 14px 'Nunito',sans-serif;color:#414242">Questionnaires, used with their original wording unchanged</p>
        <ul style="margin:0;padding-left:18px">{instruments_li}</ul>
        <p style="margin:14px 0 0;font:800 13px 'Nunito',sans-serif;color:#414242">LEWIS's own questions</p>
        <p style="margin:6px 0 0;font:400 13px/1.6 'Nunito',sans-serif;color:#5f6060">Not from published research, and scored conservatively: the curiosity and growth items, the cultural belonging items, and parts of the body and recovery reading.</p>
      </div>
      <div>
        <p style="margin:0 0 10px;font:800 14px 'Nunito',sans-serif;color:#414242">Research behind the connections in section 06</p>
        <ul style="margin:0;padding-left:18px">{evidence_li}</ul>
      </div>
    </div>

    <div style="padding:18px 20px;border-radius:16px;background:#f4f4f4;break-inside:avoid">
      <p style="margin:0;font:800 14px 'Nunito',sans-serif;color:#414242">What this is not</p>
      <p style="margin:8px 0 0;font:400 13px/1.65 'Nunito',sans-serif;color:#5f6060">LEWIS is a reflection tool. It does not diagnose anything, makes no claim about hormones, brain states or heart rhythms, and is not a substitute for talking to a doctor or a therapist. The research behind it describes what tends to be true across many people. It cannot tell you what is true for you, only what is worth looking at.</p>
    </div>

    <div style="display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:28px;padding-top:16px;border-top:1px solid #ededed">
      {_lewis_logo(24)}
      <span style="font:400 11px/1.5 'Nunito',sans-serif;color:#a8a8a8">{html_escape.escape(user_name)} · {date_display} · LEWIS Insight Report</span>
    </div>
  </section>

</div>

</body>
</html>
"""
    return html_content

