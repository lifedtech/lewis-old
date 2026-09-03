# Lifed Design System

The design system for **Lifed** — a global platform to discover, book and attend curated, real-world wellbeing programs across **wellness, functional movement and recovery**, delivered as residential stays and session-based workshops. Every program is *curated*: shaped together with the expert, centre, community or organiser that hosts it (Lifed's **Healthmates**) and the Lifed team — built for Lifed, not relisted. **LEWIS** is Lifed's wellbeing intelligence, an AI discovery assistant. Lifed is non-clinical and proactive: it helps people live well rather than waiting for things to break.

> Operated by Holobiont Pvt Ltd. Website: https://lifedhealth.com

---

## Sources used to build this system
- **`uploads/Lifed - Brand Kit - Mini - 050726.pdf`** — official brand guidelines (logos, colours, typefaces, radius & button specs). Logos were extracted from this PDF into `assets/`.
- **`uploads/Screenshot 2026-06-26 at 1.35.38 PM.png`** — homepage screenshot (hero, search bar, program cards, category tabs).
- **https://lifedhealth.com** — live site, read for product structure, program copy, tone and section patterns.

No source code or Figma file was provided; component behaviour is a faithful cosmetic recreation from the brand kit + live site, not a code port.

---

## CONTENT FUNDAMENTALS

**Voice.** Warm, human, quietly confident. Lifed speaks *to* the reader ("you", "your body already knows the cost") and often opens with an evocative, almost literary observation before getting practical. It is never clinical, never hype-y, never fear-mongering — wellbeing is framed as a *practice*, not a fix.

**Person & tone.** Second person ("you", "your"). Brand refers to itself as "Lifed" (or "LIFED" in the logo/wordmark). Tone is calm, grounded, encouraging — "proactive, not reactive."

**Casing.**
- **Headlines / hero:** Sentence case with strong full stops as rhythm — *"Live Well. Every Single Day."*, *"Your Passport to Wellness."*
- **Section eyebrows / kickers:** UPPERCASE with wide tracking — *"CURATED WELLBEING PROGRAMS"*, *"THE LIFED WAY"*, *"REAL PEOPLE. REAL SHIFTS."*
- **Buttons / CTAs:** UPPERCASE — *"EXPLORE PROGRAMS"*, *"DETAILS"*, *"BECOME A HEALTHMATE"*, *"SIGN IN"*.
- **Program titles:** Title/sentence case, descriptive and specific — *"Ojas Renewal: 7-Day Ayurvedic Reset for Digital Workers"*.

**Copy patterns.**
- Program blurbs open with a felt problem: *"Somewhere between the deadlines and the devices, the mind forgot how to be still."*
- Stats are stark and honest: *"1 in 3 adults affected"*, *"80–90% drop-out rate"*.
- Process is a four-beat verb sequence: **Discover · Book · Experience · Sustain**.
- Testimonials are real people with real roles ("Teacher & Cancer survivor", "IFS Officer").

**Emoji:** Not used. Iconography carries visual accents instead.

**Vocabulary:** Healthmates (hosts), LEWIS (AI discovery), SMALL Habits (daily micro-tools), curated, wellbeing (preferred over "wellness" as the umbrella), regenerative, residential vs session-based.

---

## VISUAL FOUNDATIONS

**Colour.** Built on two brand hues: **LIFED Teal `#00ae9d`** (primary — trust, vitality) and **Green of Life `#5fbb46`** (accent — growth). Soft **Healing Aqua** tints (`#d6edea`, `#e6f4d0`) carry calm section backgrounds; **Grey of Dark `#414242`** is the ink; **Grey of Light `#f4f4f4`** and **Pure White** are surfaces. Ramps (`--teal-*`, `--green-*`, `--grey-*`) are derived hue-locked for hover/press states. **Max 1–2 background colours per layout** — white and one aqua/grey wash. Teal dominates; green is a supporting accent, never 50/50 with teal.

**Typography.** **Manrope** (display) for all headings, titles, eyebrows and key UI; **Nunito** (body) for paragraphs, buttons, captions, labels and long-form. Headings are Bold/Medium with tight leading (1.2) and slightly negative tracking; body is Regular at 1.6 line-height. Rounded, humanist letterforms in both → friendly but modern.

**Backgrounds & imagery.** Real, warm lifestyle photography (people in calm, natural, outdoor/spa settings; soft daylight; greenery and water). Photography is warm and serene — never cold or clinical. Heroes are full-bleed photo/gradient with a dark-to-transparent protection gradient for white text. Between photo sections, solid white or a single aqua/grey wash. No busy patterns, no textures, no grain. *(This kit ships no photos — see Iconography/UI-kit notes; placeholders stand in.)*

**Gradients.** Used sparingly and only in brand hues — deep teal → teal → green diagonal on heroes and the Healthmate CTA. Never rainbow, never bluish-purple.

**Corner radius.** Soft, generous, consistent: **8px** chips/tags, **16px** buttons/inputs/cards (default), **24px** feature cards/sections, **32px** hero images/large containers, pill for search bars & avatars. Rounded geometry echoes the logo's rounded blocks.

**Cards.** White surface, 24px radius, 1px subtle border (`--border-subtle`) + soft low-spread shadow (`--shadow-sm`); on hover they lift (`translateY(-4px)`) with a larger shadow and the cover image scales up gently. No coloured left-border accents.

**Shadows.** Calm and diffuse, tinted with the dark grey ink at low opacity (`--shadow-xs`→`lg`). Brand CTAs carry a soft **teal glow** (`--shadow-brand`). Focus states use a 3px teal ring (`--shadow-focus`).

**Borders.** Hairline 1px neutral borders on cards/inputs; inputs and date-choices switch to a 2px teal border when active/selected.

**Motion.** Gentle and calm — 140–380ms, standard/ease-out curves, **no bounce, no spring**. Fades and short slides only. Buttons nudge down 1px on press; icon buttons scale to 0.94; toggles slide smoothly.

**Hover / press states.** Hover = a darker step on the brand ramp (teal-500 → teal-600) or a soft aqua fill on ghost/secondary. Press = the next darker step (teal-700) plus a 1px downward nudge. Links turn a deeper teal and add an offset underline.

**Transparency & blur.** Used lightly: hero nav is transparent over imagery; badges overlaid on photos are semi-translucent brand colour with a small backdrop blur; the booking confirmation dims the page with a blurred teal scrim.

**Layout.** Max content width `--container-max` 1200px, 40px gutters, generous 72px section padding. Grids with `gap` (never margin-spacing). Booking summary is a sticky side card.

---

## ICONOGRAPHY

Lifed uses **simple single-weight line icons** with rounded caps/joins (map-pin, calendar, users/guests, search, home/centre, clock/duration, category glyphs for Wellness/Recovery/Movement) plus occasional teal accent colour. The category icons on the live site are lightly custom (a hands-with-heart for Wellness, a rotating-arrows recovery glyph, an activity/movement glyph).

- **No icon font or SVG sprite was provided** in the sources.
- **Substitution (flagged):** this system uses **[Lucide](https://lucide.dev)** (`unpkg.com/lucide`, 1.75px stroke, rounded) as the closest match to Lifed's line-icon style. Category mappings: Wellness → `heart-handshake`, Recovery → `refresh-cw`, Movement → `move`. See the **Brand › Iconography** card. If official Lifed icons exist, drop them into `assets/icons/` and swap the `LI` helper.
- **Emoji / unicode icons:** not used anywhere.

---

## Components

React primitives live under `components/<group>/` (`.jsx` + `.d.ts` + `.prompt.md` + one `@dsCard` per group). Consume via `const { X } = window.LifedDesignSystem_d86b5c` after loading `_ds_bundle.js`.

- **buttons/** — `Button` (primary · accent · secondary · ghost; sm/md/lg; uppercase; icons), `IconButton`
- **forms/** — `Input`, `Textarea`, `Toggle` (LEWIS AI switch), `SearchBar` (Where/When/Who hero booking control)
- **display/** — `Tag` (chips, filters, locations), `Badge` (duration/status ribbons), `Avatar`
- **cards/** — `ProgramCard` (core listing unit), `StatCard`, `TestimonialCard`, `StepCard`
- **navigation/** — `NavBar` (solid + hero-overlay), `CategoryTabs` (Wellness/Recovery/Movement)

**Intentional additions:** none invented beyond what the brand kit + live site imply. `SearchBar`, `ProgramCard`, `StepCard`, `StatCard` and `CategoryTabs` are direct recreations of signature site elements.

---

## UI Kits

- **`ui_kits/website/`** — interactive recreation of the Lifed marketing & booking site: **Home**, **Programs** listing, and **Program Detail + booking flow**. Composes the components above. See its `README.md`.

---

## Foundations (Design System tab cards)

Specimen cards live in `guidelines/`, grouped **Colors** (brand, surfaces, neutrals, semantic), **Type** (typefaces, hierarchy), **Spacing** (scale, radius, elevation) and **Brand** (logo lockups, iconography).

---

## Repository index

```
styles.css                 → global entry (links tokens + base); consumers link THIS
tokens/                    → fonts.css, colors.css, typography.css, spacing.css, base.css
assets/                    → logos & brand marks (see below)
components/<group>/         → Button, IconButton, Input, Textarea, Toggle, SearchBar,
                             Tag, Badge, Avatar, ProgramCard, StatCard, TestimonialCard,
                             StepCard, NavBar, CategoryTabs
guidelines/                → foundation specimen cards
ui_kits/website/           → interactive site recreation
thumbnail.html             → design-system homepage tile
SKILL.md                   → portable skill manifest (Claude Code compatible)
readme.md                  → this file
```

### Assets
`assets/lifed-logo.png` (primary), `lifed-mark.png` (symbol), `lifed-wordmark.png`, each also as `-transparent.png` and `-white.png` (for teal/dark/photo backgrounds). Logos were extracted from the brand-kit PDF; **do not recolour or distort** them.

---

## Known gaps / open questions
- **Fonts** are loaded from Google Fonts (Manrope + Nunito are the actual brand typefaces — no substitution). The compiler therefore reports 0 self-hosted `@font-face`; provide `.woff2` files if self-hosting is required.
- **Photography** is not included (none in sources) — UI kit uses tinted placeholders.
- **Official icon set** unknown — using Lucide as the closest match (flagged above).
