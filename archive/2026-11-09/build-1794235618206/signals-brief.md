# Signals Brief — 2026-11-09

## Hero Copy
Designed and shipped by the same hands.

## Hero Rationale
This is a capability declaration lifted from the thing Doug's whole career is about: closing the gap between what gets designed and what gets built, one person doing both jobs. It leads an artifact, Spaceman, the LLC he's run for ten years with Zeldman, Rolex, The Nature Conservancy, Intuit and LastPass on the client set, so the line reads as the caption on real evidence rather than a slogan floating alone. It beats a golf or Lions line today because the leaderboard and the scoreboard have carried five of the last fourteen heroes and the signals are quiet, while the work has not led since a FishSticks spec on the 4th.
Owner's voice: Doug says "deep in both, not a generalist" and "design and engineering as one job" — this is the same claim, stated as a fact about who touched the work.

## Archetype
a maker's spec plate: one project reversed out of an olive field, its caption flush to the spine

## Composition
columns: two-asymmetric
axis: vertical
symmetry: left-weighted
hero_zone: interleaved
density: dense
rhythm: even
shell_posture: folded-into-hero
field_ratio: balanced
collapse: split-to-sequence
hero_object: artifact

## Composition Rationale
I moved columns off the suggested `masonry` to `two-asymmetric`: an artifact spec plate wants one dominant olive feature field and a metadata rail with a shared spine, not ragged packed blocks that would scatter the client evidence. The spine is what lets the cream SPACEMAN title and its paper caption flush to a single line and face each other, which is the whole point of leading with the work. Everything else holds the date-derived tuple because left-weighted vertical interleaving genuinely serves an artifact lead; alignment moves to `right` (off the recently-used left/centred/justified) precisely to build that spine.

## Mobile
carrier: the split becomes a sequence — the olive SPACEMAN panel stacks above the paper caption-and-client field, the caption kept directly beneath the title it describes by adjacency.
first_fold: brand lockup, SPACEMAN reversed on olive, and the hero phrase caption "Designed and shipped by the same hands."
order: brand+numbered nav, SPACEMAN olive panel, hero caption, client set, selected work, callout, colophon
hero_step_360: 2xl
nav_360: horizontal lockup top-left on paper, numbered index collapses to a single 01 · 02 · 03 row beneath it

## Chassis
bitter-mulish

## Visual Specification
**1. Color Specification**

- **Primary hue**: 94° (olive-brass). Chosen against the 40–80° warm mandate because the repetition check requires at least 60° from recent hues (14/22/48/149/158/258/340) and 48° sits dead-center of the mandate window; 94° is the best-achievable clearance (≈46° from 48°, ≈55° from 149°) and lands in the allowed gap between the 0–78° and 119–188° forbidden zones. Olive-brass also reads as November harvest and craft, which serves the phrase better than a bright sunny amber would.
- **Neutral palette (sand, warm)**: 50 `#FAF7EE`, 100 `#F4EFE4`, 200 `#E8E1CF`, 300 `#D4CBB3`, 400 `#A89E86`, 500 `#7D7563`, 600 `#5A5344`, 700 `#403B30`, 800 `#2A2720`, 900 `#1A1813`
- **Accent (olive)**: light `#948528` (glow/alt), default `#76691D` (mark/fill on paper), dark `#5E551A` (the field), bright `#B3A64A` (accent on dark ground)
- **Secondary accent**: none. One hue carries the page.
- **Background**: page paper `#F4EFE4`, surface/raised `#FAF7EE`, callout/footer band `#E8E1CF`; dark scheme page `#1A1813`
- **Text colors**: primary `#1A1813`, secondary/muted `#403B30`, faint metadata `#5A5344`; on the olive field, title ink `#FAF7EE`, muted field ink `#DCD29A`

**2. Typography (bitter-mulish)**

- **Hero phrase rendering**: the phrase is the page's one h1, the caption of the artifact. Set it in the `display` face (Bitter) at the `3xl` step, small-caps, heavy, ink `#1A1813` on paper, flush right to the central spine. It sits one step below the marquee object so the artifact title can be the largest element.
- **Marquee object**: SPACEMAN set in `display` at `hero_scale`, small-caps heavy, reversed cream `#FAF7EE` on the olive field, flush right to the spine.
- **Type treatment / ramp steps**: SPACEMAN at `hero_scale`; hero phrase (h1 caption) at `3xl`; the artifact data line "2018 · FOUNDER" at `lede`; section heads (Selected Work) at `2xl`; client rows and body at `base`; nav and labels at `sm` small-caps; colophon at `xs`. This deliberately spends the middle of the scale (no jump from marquee straight to body) per the standing complaint. Labels carry at least twice the space above as below.

**3. Layout Specification**

- **Composition**: two-asymmetric / vertical / left-weighted / interleaved / dense / even / folded-into-hero / balanced / split-to-sequence / artifact. A spec plate wants a dominant feature field and a metadata rail, and a central spine both the cream title and the paper caption flush to; that spine is what makes the caption face the artifact it describes.
- **CSS grid**: `display: grid; grid-template-columns: 1.55fr 1fr;` olive feature field left, paper rail right, hairline spine between.
- **Major dimensions**:
  - Hero/feature field: `min-height: 82vh`
  - Rail width: right column ≈ 40% (`1fr` of `1.55fr 1fr`)
  - Max content width: `max-width: none`; side padding `clamp(24px, 5vw, 80px)`; client rows and colophon copy capped at 62ch
  - Section padding: vertical rhythm on the chassis base unit, ≈ `clamp(48px, 6vw, 96px)` between bands
- **Nav placement**: folded into the top of the paper rail (right column), part of the hero composition, not a top bar.
- **Hero phrase grid zone**: the caption occupies the upper paper rail, rows 1–2 of the right column, flush right to the spine, directly across from SPACEMAN; SPACEMAN fills rows 1–3 of the left olive field at `hero_scale`.
- **Home callout slot**: `<SiteCallout />` sits full width below the Selected Work index and above the footer colophon, between those two sections. Its own `bgAlt` band. I place it and write no copy for it.

**4. Component Character**

- **Border radius**: cards/rows 0, tags/marks 2px (`sm`), nothing rounder. Hard corners per the owner complaint.
- **Border treatment**: hairline rules only, `border` (`#D4CBB3`) for row dividers, `borderStrong` (`#403B30`) for section breaks and the spine; `fieldBorder` (`#948528`) inside the olive field.
- **Shadow**: none. Depth comes from the olive/paper value split.
- **Density**: dense, information-forward; even repeating interval.
- **Interactive states**: client rows and nav items shift ink to `accent` (`#76691D`) on hover, underline offset 2px; no motion beyond color.

**5. Signal Integration**

- **Where signals live**: in the footer colophon block (multi-line, not a single ticker strip), under one `borderStrong` rule.
- **Golf**: World Wide Technology Championship, Final. Blades Brown −25 set as the lead colophon line in olive `accent`, James −24, Kim −22 beneath in `textFaint`.
- **Sports scores**: Lions 19–9 win and Pistons 116–121 loss as plain score lines, tabular figures, `text` on paper, no color drama on a quiet day.
- **Market**: SPY 735.29 +0.31% as one colophon figure.
- **Quote**: none in signals today; the hero is content-lifted, so no blockquote.
- **Holiday**: Veterans Day, Nov 11, noted in the colophon as "Veterans Day, Nov 11" in `textMuted`.
- **Music**: The War on Drugs and Guided by Voices listed under "In rotation" in the colophon, taste not event, never beside a score as if it happened today.
- **Weather/lunar**: "Aldie, 48°F, sunny, new moon" as one colophon line in `textFaint`.

## Self-Check
1. Hero quotability: Yes — "Designed and shipped by the same hands" stands alone as a claim about craft, not a descriptive label.
2. Because-of chain: Yes — a craft/continuity line → artifact spec plate (two-asymmetric spine) → sturdy warm slab (bitter-mulish) → olive-brass-on-paper split-field.
3. Render feasibility: Yes — SPACEMAN at `hero_scale` clamps under Bitter's 160px ceiling; the caption at `3xl` on the paper rail has room beside it at 1440.
4. Canvas floor feasible: Yes — a dense two-column spec plate with an olive feature field and full client/work index fills 82% of the canvas.
5. Phone: Yes — split-to-sequence stacks the olive SPACEMAN panel above its paper caption at `2xl`, caption still directly beneath the title, inside the first 640px.

## Rationale
The phrase is a claim about continuity of craft: one pair of hands drew the mockup and shipped the build. That demands evidence, not decoration, so the composition leads with an artifact, Spaceman, the ten-year LLC, with its real client set (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) as the proof and the phrase as the caption. A two-asymmetric split with a central spine lets the cream SPACEMAN title and the ink caption flush to one line and face each other; left-weighted mass sits in the olive feature field, the paper rail carries the folded nav and the data.

Bitter-mulish is the chassis because a screen slab with real heavy cuts reads as made, sturdy, workshop, which is the register of "the same hands," and its soft humanist body answers the slab's construction rather than fighting it (the display/body skeleton complaint). It has not shipped in the recent window, so it also clears the chassis mandate honestly. Small-caps heavy flush-right sets the title as a brass plate; that alignment is also the fresh move off the recently-worn left/centred/justified.

The palette is one hue, olive-brass at 94°, committed as a split-field: olive feature panel against warm paper, no grey, no second accent. It deviates from the 40–80° mandate because 48° is both the mandate center and a recent hue, and the repetition check demands real clearance; 94° is the furthest defensible step into the allowed gap and reads as November craft rather than a sunny amber. Light paper ground and ink-dark text keep it off the recent duotone/dark-void/drench formulas, the mark sits on paper where its blue carries 3:1, and settle plus on-scroll reveal give it the quiet entrance a slab statement earns.
