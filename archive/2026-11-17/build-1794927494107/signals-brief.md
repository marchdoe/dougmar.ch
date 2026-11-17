# Signals Brief — 2026-11-17

## Hero Copy
Every project started as an experiment.

## Hero Rationale
Lifted from the portfolio's own framing: the work index labels TeeTurn, Politweets and Twittertale (2008) as "Experiment," and Doug's voice calls his side builds experiments ("the scorecard is the first experiment"). Read over a work index that runs 2008 to 2026, the line is a claim and the index is the proof: Spaceman, FishSticks, 15th Club all began as something he was poking at. It breaks the two-day composed streak cleanly and stays squarely about the work, not the machine. Owner's voice: Doug says what a thing is in plain words, and he'd stand over seven years of side projects and call each one an experiment before he'd call it a product.

## Archetype
a lab notebook of experiments — acid index reversed out of a near-black thesis

## Composition
columns: two-asymmetric
axis: vertical
symmetry: right-weighted
hero_zone: edge-bound
density: crowded
rhythm: even
shell_posture: folded-into-hero
field_ratio: balanced
collapse: stack
hero_object: list

## Composition Rationale
The phrase is a thesis that needs its evidence in view, so a two-asymmetric split carries it: the stacked claim bound to the left edge, the work index outweighing it on the right. I moved symmetry onto the soft-forbidden right-weighted deliberately — a list-led page where the index is the proof must let the evidence column dominate, or the claim floats unbacked. Axis stays vertical (the eye travels down the ruled rows), density crowded and rhythm even hold the catalog on one strict interval, matching the mandate's starting read while columns, hero_zone and shell move off it.

## Mobile
carrier: At 360 the split is gone; the thesis stacks first as the acid phrase word-per-line on the near-black field, then the full-width ruled work index carries the argument as evidence directly below it.
first_fold: The stacked hero phrase "Every project started as an experiment" on the dark thesis field, mark and role above it.
order: header+mark, hero phrase (dark field), work index, signal strip, site callout, baseline identity
hero_step_360: 3xl
nav_360: Mark stays top-left on the dark field; the word "Index" top-right reveals work / about / contact stacked.

## Chassis
space-mono-archivo

## Visual Specification
**1. Color Specification**
- Primary hue: 98° (lab lime). Chosen against the mandate's warm 40–80° target because the repetition check demands ≥60° off the 46–50° cluster and because "experiment" wants a reagent/terminal green, not another gold. 98° sits in the one open band (80–128°) the forbidden zones leave.
- Neutral palette (sage, green-tinted): 50 #f6f8f0, 100 #edf0e4, 200 #dce1cf, 300 #c2c9b0, 400 #99a287, 500 #727b62, 600 #545d45, 700 #39402e, 800 #22281b, 900 #131810
- Accent color (lime): light #addb68, default #3f7a19, dark #305d15, glow #addb68
- Secondary accent: none (one accent, two registers)
- Background: page bg #f6f8f0 (paper index); thesis field #131810 (near-black); callout band bgAlt #e4f2cb (pale lime)
- Text colors: primary #131810, secondary #545d45, muted #727b62; on the dark field, ink #f6f8f0 and muted #99a287

**2. Typography**
- Hero phrase rendering: `display` (Space Mono) at ramp step `3xl`→`4xl`, set small-caps italic, stacked one word per line flush-left down the thesis field in `fieldInk`, with the last line EXPERIMENT in `accentAlt` acid lime. It is the standfirst; the work index is the marquee.
- Type treatment: index project titles (the list object) set `hero`-adjacent via the MEASURABLES clamp, Space Mono 700 roman small-caps, one per ruled row. Mid-register: each row carries a `lede`/`md` role line (Archivo) and a `sm` year in tabular figures, so the scale never jumps title-to-caption. Body/roles in Archivo at `base`, 60–68ch, leading 1.5. Micro labels at `xs` in `textFaint`.

**3. Layout Specification**
- Composition: two-asymmetric / vertical / right-weighted / edge-bound / crowded / even / folded-into-hero / balanced / stack / list. The thesis (phrase) binds to the left edge on the dark field; the evidence (index) outweighs it on the right. The phrase claims, the index proves.
- Grid: `display: grid; grid-template-columns: minmax(360px, 0.72fr) 1.4fr; gap: 0`. Left = thesis field (full-bleed near-black). Right = paper index.
- Major dimensions: hero row `min-height: 100vh` across both columns; thesis column flooded edge to edge; index rows `min-height: clamp(96px, 11vh, 140px)` each. Max content width: `none`; side padding `clamp(40px, 5vw, 96px)` on the paper column, `clamp(32px, 4vw, 72px)` on the field. Section interval one even unit throughout.
- Nav placement: folded into the hero's top row. Horizontal lockup (mark + "Doug March", role beneath) top-left on the dark field; a single mono word "Index" top-right reveals work / about / contact.
- Hero phrase grid zone: left column, rows 1–6 of the thesis field (the stacked phrase), roughly 42vw × 72vh, acid word anchoring the bottom of the stack.
- Home callout slot: `<SiteCallout />` sits on `/` below the work index band and above the baseline identity row, between Selected Work and the footer line, full width, on `bgAlt` pale lime.

**4. Component Character**
- Border radius: cards/rows 0, tags `sm` (2px), buttons `sm`. Sharp, specimen-flat.
- Border treatment: hairline `border` between index rows; `borderStrong` (deep lime) above section breaks and the first/last index rule.
- Shadow: none. Depth is value (dark field vs paper), not elevation.
- Density: crowded but ruled — a dense catalog on a strict even interval.
- Interactive states: row hover floods `surface` and underlines the title in `accent`; the "Index" word reveals the three links on hover/focus.

**5. Signal Integration**
- Signal elements live in a ruled strip at the foot of the paper index, mono tabular, under one `borderStrong` rule.
- Golf: "Austin Championship · Final · Chad Ramey −20" in Space Mono tabular figures, the −20 in `accent`.
- Market: "SPY 739.95 ▼1.91%" tabular, the drop in `textMuted` (no alarm color; a quiet down day).
- Lions: "Lions 35–10" one tabular cell; not the hero (yesterday's).
- Weather/moon: "Aldie VA · 45°F sunny · first quarter" in `textFaint`.
- Music: a single mono line below the strip, "On rotation: The War on Drugs, My Morning Jacket, Tobin Sprout," labeled as taste, not an event.
- Quote (Lennon): not used; the content-lifted line is the hero.

## Self-Check
1. Hero quotability: Yes — "Every project started as an experiment" is a maker's ethos that stands alone and frames the index.
2. Because-of chain: Yes — a claim-plus-proof line drove list object → thesis/evidence two-asymmetric split → mono specimen chassis → acid lab-lime on near-black.
3. Render feasibility: Yes — titles at clamp(52px,8vw,120px) in the right column, phrase stacked at 3xl–4xl in the left; both clear 1440 without overflow.
4. Canvas floor feasible: Yes — a crowded ruled index plus a full-height dark thesis field fills 82%.
5. Phone: Yes — stacked 3xl phrase on the dark field leads the first fold at 360, index follows.

## Rationale
The hero phrase is a claim — "Every project started as an experiment" — lifted from the portfolio's own "Experiment" category and Doug's register. A claim needs evidence in the same frame, so the composition is a two-asymmetric split: the stacked phrase bound to the left edge on a near-black thesis field, the work index (2008 to 2026, titles and years and roles) outweighing it on the right as proof. That is why symmetry goes right-weighted and the hero object is the list, not the statement: the index is the biggest thing on the page and the phrase is its standfirst.

Space Mono carries the index because the evidence is literally a logged series of code experiments by a developer; mono here is the honest register of a terminal listing, not costume shorthand, and its true italics let the standfirst lead in small-caps italic while the titles stay roman and heavy. The palette answers the word "experiment": acid lab-lime at 98° against a green-tinted near-black, reagent green on a dark field, which also lands ≥60° off the recent gold cluster the repetition check flagged. Split-field is the ground because the composition already is one: the dark thesis plane and the paper catalog are two grounds that need each other.

Layout holds a single left rail per column, caps the measure at 68ch, spends the middle of the scale with a role line and tabular year on every index row, and keeps the mark in the first fold folded into the hero's top on the dark field where the white disc carries. Motion is a quiet settle with on-scroll reveal down the index, so the catalog assembles as you read. At 360 the split stacks: the acid phrase leads, the full-width index follows, and the claim-and-proof relationship survives by adjacency.
