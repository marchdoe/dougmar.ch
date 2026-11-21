# Signals Brief — 2026-11-21

## Hero Copy
Three tied at nine under.

## Hero Rationale
The RSM Classic is live right now and the top of the board is a dead heat: Penge, Neergaard-Petersen and Thorbjornsen all at −9, with McGreevy and Hodges a shot back at −8. Doug built 15th Club and has four holes in one, so a three-way tie at the lead is exactly the signal he'd stop on, and it beats a random Yogananda quote that would read as somebody else's poster. The figure −9 leads at scale and the phrase is its caption, a plain fact stated plainly. Owner's voice: Doug says a score is a score, short and with the number in it, and a three-way tie is the one thing worth saying about this board.

## Archetype
a live scoreboard readout, one score the whole field shares

## Composition
columns: two-asymmetric
axis: vertical
symmetry: left-weighted
hero_zone: upper-left
density: crowded
rhythm: even
shell_posture: footer-only
field_ratio: balanced
collapse: split-to-sequence
hero_object: figure

## Composition Rationale
I moved `columns` off the mandate's `masonry` start to `two-asymmetric`: a leaderboard is ruled rows, not blocks packed to a ragged edge, and masonry would scatter the standings that make the −9 mean something. The rest holds the start values because they genuinely fit: the big number gathers mass upper-left (left-weighted, upper-left), the standings read top to bottom (vertical), ruled rows want one repeating interval (even), and crowded lets the margins carry market, Pistons, weather and Thanksgiving as scoreboard texture around the hero.

## Mobile
carrier: At 360 the two-asymmetric band becomes a sequence of full-width fields: the −9 first, its standings directly under it, so the number and the names it belongs to stay adjacent.
first_fold: The −9 figure at 5xl with its stacked caption "Three tied at nine under." and the mark top-right.
order: hero figure + caption, leaderboard rows, signal strip (market/Pistons/weather/Thanksgiving), selected-work teaser, site callout, footer nav
hero_step_360: 5xl
nav_360: Mark stays top-right of the hero; numbered nav collapses into the footer band as a stacked small-caps index.

## Chassis
bebas-plex

## Visual Specification
### 1. Color Specification
- **Primary hue**: 152° (fairway green). Chosen because the signal is golf and green is the course; it also lands inside the 140°–180° target range.
- **Neutral palette** (green-tinted, exact hex):
  - 50 `#f6f9f7`
  - 100 `#e7ede9`
  - 200 `#cdd6cf`
  - 300 `#a7b2aa`
  - 400 `#78857c`
  - 500 `#566058`
  - 600 `#3c453f`
  - 700 `#272f2a`
  - 800 `#161b17`
  - 900 `#0b100d`
- **Accent color**: light `#4ce38c`, default `#2fd676`, dark `#0b6438`, glow `#86edb0`
- **Secondary accent**: none (one hue carries the page)
- **Background**: page bg `#0b100d`, card/surface `#161b17`, band/sidebar bgAlt `#07331e`
- **Text colors**: primary `#f6f9f7`, secondary `#a7b2aa`, muted `#78857c`

### 2. Typography (bebas-plex: Bebas Neue display + IBM Plex Sans body)
- **Hero phrase rendering**: the figure `−9` is the hero object, set in `display` (Bebas Neue) at the `hero` step sized by `hero_scale`, right-aligned to a vertical rail. The phrase "Three tied at nine under." is its caption, set in `display` at the `2xl` step, small-caps, stacked flush-right beside the figure (word per line).
- **Type treatment**: `hero` for the −9; `2xl` for the stacked caption; `lg`/`md` for leaderboard surnames; `base` (IBM Plex Sans) for standings body and signal rows held at 60–68ch; `sm` tabular-nums for scores; `xs` small-caps for micro labels (never under 13px). Body leading rides the chassis ramp (~1.5). Standings use `font-variant-numeric: tabular-nums` so scores align on the rail.

### 3. Layout Specification
- **Composition**: two-asymmetric / vertical / left-weighted / upper-left / crowded / even / footer-only / balanced / split-to-sequence / figure. The giant −9 holds the left column at the upper-left while the three tied names and the chasers run as even ruled rows in the right column; the number states the fact, the rows are the evidence.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1.15fr 0.85fr; column-gap: 4vw` for the hero band; standings as `display: grid; grid-template-columns: 1fr auto` rows.
- **Major dimensions**:
  - Hero/figure band `min-height: 86vh`
  - Right standings column `width: ~42%` of the hero band
  - Max content width: `max-width: none`, side padding `padding: 72px 6vw`
  - Section padding: vertical rhythm on the chassis base unit, ~48–72px between bands
- **Nav placement**: deferred to the footer (footer-only). The lockup (mark + "Doug March") sits top-right of the hero void; the −9 holds top-left.
- **Hero phrase grid zone**: the `−9` occupies rows 1–3, columns 1 (left column), flush-right to the center rail; the stacked caption sits rows 2–4 immediately right of the figure. Intended rendered figure height ~160px at 1440.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the signals band and above the footer, between the "selected work" teaser and the footer nav. Full width, on today's bgAlt.

### 4. Component Character
- **Border radius**: cards/panels `3px` (md), buttons `2px` (sm), tags `2px`; nothing rounded enough to soften the scoreboard.
- **Border treatment**: bordered with hairlines — `border` for row rules, `borderStrong` for the center rail and the footer break.
- **Shadow**: none; depth comes from surface lightness (`surface` lighter than `bg`), not shadow.
- **Density**: crowded — margins packed with signal rows as scoreboard texture.
- **Interactive states**: links shift `text`→`accent` on hover, 120ms; rows raise to `surface` on hover.

### 5. Signal Integration
- **Where signal elements live**: golf leads (hero figure + right-column standings); market, Pistons, weather and Thanksgiving pack a crowded signal strip below the hero; music lives as a quiet footer caption.
- **Sports scores**: standings as ruled rows, surnames in Bebas `lg`, scores in Plex `sm` tabular-nums right-aligned on the rail; the three `−9` scores are set in `accent`, the two `−8` chasers in `textMuted`. Pistons shown soberly: "Pistons fell 102–105" in `text` with the figures tabular.
- **Quote**: not used as hero; no quote furniture on the page today.
- **Market**: "SPY 689.81, down 3.64%" in the signal strip, figure in `textMuted` with a down caret in `textFaint` — stated as a fact, no second red hue imported.
- **Holiday**: "Thanksgiving in 5 days" as an `xs` small-caps micro label in the strip.
- **Weather**: "Aldie, overcast, 47°F" as an `xs` textFaint label top-left under the figure.
- **Music**: "On rotation: The War on Drugs, My Morning Jacket" as a footer caption, taste not event.

## Self-Check
1. Hero quotability: Yes — "Three tied at nine under." is a complete scoreboard fact, screenshot-ready.
2. Because-of chain: Yes — golf figure → scoreboard figure object + leaderboard rows → Bebas scoreboard chassis → fairway green on void → right-rail standings.
3. Render feasibility: Yes — a 2-character −9 at 160px Bebas fits the left column at 1440 with room for the stacked caption.
4. Canvas floor feasible: Yes — figure + standings + crowded signal strip fills 82% comfortably.
5. Phone: Yes — "−9" at 5xl (72px) fits 360 without cutting; caption stacks beneath.

## Rationale
The phrase is a live scoreboard fact: three men share the lead at the RSM Classic, all nine under. That decides the object before anything else: a figure, the −9 at marquee scale, with the phrase as its caption and the standings as evidence beside it. A figure hero needs a face that renders a big clean number like a stadium digit, so bebas-plex carries it, Bebas Neue for the −9 and the surnames, IBM Plex Sans for the tabular scores and body. Bebas has not shipped in the last fourteen nights, which answers the chassis mandate while fitting the scoreboard conceit exactly.

The composition is two-asymmetric, left-weighted, upper-left: the number holds the left column and the three tied names plus the two chasers run as even ruled rows on the right, right-aligned on a shared rail so the scores stack like a real leaderboard. I moved columns off the mandate's masonry start because standings are rows, not packed blocks. Crowded density packs the margins with the rest of the day, the market drop, the Pistons loss, the overcast 47 degrees, Thanksgiving five days out, as scoreboard texture around the hero.

The palette is a dark-void: a near-black green-tinted field with one bright fairway −9 glowing on it. Green is the course, which ties color to signal, and it lands inside the 140°–180° mandate. Dark-void sits outside the recently-overused duotone, drench and light-ground formulas. The market loss is stated in muted ink rather than importing a red that would break the one-hue commitment. The type is set small-caps, right-aligned, stacked, three moves off the recent mixed-case left-set default, so the scoreboard reads as a decision, not a template.
