# Signals Brief — 2026-09-27

## Hero Copy
No one ever said life was fair. Just Eventful.

## Hero Rationale
This is `signals.quote`, Carol Burnett, and it wins the preferred lane because it is wry, plain-spoken realism, not a self-help affirmation of the kind the owner has rejected. The day itself proves the line: Tigers win 4–3, Red Wings lose 2–4, market up, a full moon at 97%, a nor'easter flooding New Jersey. Fair, no. Eventful, yes, and the page becomes a log of the events with the line as its deadpan header; Carol Burnett is named in the caption beneath it.
Owner's voice: Doug takes wins and losses the same way, a score is a score, and this dry shrug at "fair" is exactly how he'd read a Sunday that gave him one win and one loss.

## Archetype
reads like a terminal log of one day

## Composition
columns: two-equal
axis: horizontal
symmetry: broken
hero_zone: edge-bound
density: measured
rhythm: interrupted
shell_posture: marginal
field_ratio: type-dominant
collapse: rail-to-band
hero_object: list

## Composition Rationale
The phrase is a two-beat shrug at an eventful day, so the object is the events themselves cataloged as a log, which is why hero_object is `list` and the two-equal horizontal strip reads work-index-then-scores left to right. I moved symmetry off the mandate's `mirrored` to `broken` on purpose: a mirror would over-order a day that is by definition uneven, so the regular row rhythm is broken once by a large caesura and one emphasized amber event row (interrupted rhythm). The justified caps banner genuinely needs edge-bound and type-dominant to stretch across the top edge, so those start values are kept because they fit, not because nothing pushed.

## Mobile
carrier: the event log itself — phrase banner, then work index and the day's scores stacked as one continuous mono ledger, amber marking every event.
first_fold: the hero phrase "No one ever said life was fair. Just Eventful." at 2xl with the Carol Burnett caption, mark held top-left.
order: mark strip, hero phrase + attribution, work index, signals band (amber), nav band, footer
hero_step_360: 2xl
nav_360: rail collapses to a full-width band below the work index (rail-to-band); the mark stays in a small top strip inside the first fold, links go to the band as a lowercase mono row.

## Chassis
space-mono-archivo

## Visual Specification
## 1. Color Specification

- **Primary hue**: 166° (teal-leaning pine green). Chosen inside the 140–180° mandate but pushed to 166° to separate from the recent 152° fairway and 178° emerald; a deep chromatic green reads as an old phosphor terminal, the ground for an event log.
- **Neutral palette** (green-tinted): 50 `#eef3f1`, 100 `#dde7e3`, 200 `#c1d1cb`, 300 `#9bb2aa`, 400 `#6f8981`, 500 `#4e675f`, 600 `#3a4e47`, 700 `#2b3a35`, 800 `#1c2723`, 900 `#0e1512`
- **Green scale**: 50 `#e8f5f0`, 100 `#cceadf`, 200 `#a3d6c8`, 300 `#72bda9`, 400 `#479f89`, 500 `#2f8270`, 600 `#226a5b`, 700 `#1a5449`, 800 `#123c34`, 900 `#0b2620`
- **Accent color (amber)**: light `#f7e7ba`, default `#ddaa3d`, dark `#a2751f`, glow `#efd184`
- **Secondary accent**: amber is the second hue of the duotone, not a third color; it flags every event (Tigers win, market up, full moon) and floods the signals band.
- **Background**: page bg `#0b2620` (green.900), card/panel surface `#1a5449` (green.700), rail bg `#123c34` (green.800)
- **Text colors**: primary `#e8f5f0` (green.50), secondary `#a3d6c8` (green.200), muted `#72bda9` (green.300)

## 2. Typography

- **Hero phrase rendering**: `display` (Space Mono) set at the `4xl` step, ALL CAPS, roman, weight heavy (700), **justified** so it stretches edge to edge across the top of the field as a taut terminal banner. Colour green.50 (pale phosphor). "— CAROL BURNETT" sits directly beneath at `sm` in amber, tabular. The phrase is the page's one h1; the work index below carries marquee scale.
- **Type treatment**: ramp steps as textStyles. `4xl` for the phrase banner; the work-index project titles are the largest object at `hero_scale` (Space Mono, mixed case); `lg`/`md` for section heads and the amber pull-figures (the mid-register the owner asked for); `base` (Archivo) for body at 60–68ch, leading 1.5; `sm` tabular-nums (Space Mono) for every ledger data line so scores and figures align like a printout; `xs`/`2xs` for micro labels, never under 12px. `font-variant-numeric: tabular-nums` throughout the ledger.

## 3. Layout Specification

- **Composition**: two-equal / horizontal / broken / edge-bound / measured / interrupted / marginal / type-dominant / rail-to-band / list. The justified phrase pins to the top edge (edge-bound); beneath, the day reads left-to-right as a strip of two equal columns, work index left, day's event log right, broken once by a large caesura gap and one emphasized amber row.
- **CSS grid/flex structure**: outer `display: grid; grid-template-columns: 1fr 72px` (content + right-margin rail). Inner content `display: grid; grid-template-columns: 1fr 1fr; column-gap: 5vw` for the two ledgers.
- **Major dimensions**:
  - Hero/banner zone: `min-height: 46vh` (phrase banner + attribution), pinned to top and side edges.
  - Right-margin rail width: `72px` fixed.
  - Max content width: `max-width: none; padding: 72px 5vw 72px 6vw`.
  - Section padding: 72px vertical between ledger and callout; the caesura gap between index rows and the amber signal band is `clamp(48px, 7vh, 96px)`.
- **Nav placement**: right-margin vertical rail, full height. Mark-only mark at top of the rail inside the first fold; work / about / contact stacked as a lowercase mono list reading down the rail, one hairline per row.
- **Hero phrase grid zone**: rows 1–2, spanning both content columns (columns 1–2 of the inner grid), justified full width, ~46vh tall at 1440.
- **Home callout slot**: on `/`, `<SiteCallout />` sits below the amber signals band and above the log-tail footer, full width of the content column, between the day's event log and the footer.

## 4. Component Character

- **Border radius**: cards/panels 8px (lg), tags/marks 2px (sm), buttons 4px (md). Sharp, printout register.
- **Border treatment**: hairline. `border` = green.700 for row rules; `borderStrong` = green.500 for the caesura break and section heads; inside the amber band, `fieldBorder` = amber.700.
- **Shadow**: none. Depth comes from surface value steps (green.900 → .800 → .700), not shadow.
- **Density**: measured. Rows breathe; the log is legible, not crowded.
- **Interactive states**: hover flips a row's ground to green.800 and its leading mark to amber (`_hover`), like a cursor landing on a log line. Nav links underline amber on hover.

## 5. Signal Integration

- **Where signals live**: the right content column is the day's event log; the amber signals band below the two columns floods the second hue as a full ground.
- **Sports scores**: mono tabular. Wins in amber (`TIGERS 4–3 W`, amber leading mark); losses stated flat in textMuted (`RED WINGS 2–4 L`). Presidents Cup logged as `PRESIDENTS CUP · IN PROGRESS`.
- **Quote**: it IS the hero banner. Carol Burnett named in the amber caption beneath.
- **Market**: `SPY 771.35 ▲ +0.54%` in amber (up).
- **Full moon**: `FULL MOON · 97%` amber log line; **weather** `ALDIE 60°F · CLOUDY`; **AQI** `AIR: GOOD` in muted.
- **News**: `NOR'EASTER · NJ FLOODS` as one flat log line, an event, not amber.
- **Music**: Radiohead / The War on Drugs / My Morning Jacket named quietly in the footer colophon as `ON ROTATION`, textFaint, never in the event log beside a score.
- **Holidays**: none today; omitted.

## Self-Check
1. Hero quotability: Yes — a wry stand-alone aphorism with attribution, screenshot-worthy.
2. Because-of chain: Yes — deadpan quote → mono terminal chassis → day-as-event-log object → green+amber phosphor duotone → ledger layout.
3. Render feasibility: Yes — phrase at 4xl justified fits both content columns' span at 1440; list at 96px cap is under the 160px ceiling.
4. Canvas floor feasible: Yes — two full ledgers plus amber band plus rail fill a type-dominant measured page past 78%.
5. Phone: Yes — phrase drops to 2xl, wraps across 360 without cutting a word; rail becomes a band, mark held at top.

## Rationale
The hero is Carol Burnett's "No one ever said life was fair. Just Eventful." It wins the preferred quote lane because it is Doug's register exactly, a dry shrug rather than a slogan, and today earns it: one Detroit win, one Detroit loss, a market tick up, a full moon, a nor'easter. The line doesn't want to be a poster shout. It wants to head a record of the eventful day, which is why the object on the page is a `list`, the work index and the day's scores cataloged as log entries, with the phrase as the standfirst banner and the list carrying marquee scale. That directly answers the owner's complaint that every day is one big poster line over a signal list.

Composition follows the line: a justified Space Mono caps banner pinned across the top edge (edge-bound, type-dominant), then two equal columns reading left to right as a strip, work index against the day's event log, the regular row rhythm broken once by a caesura and a single emphasized amber row. The chassis is space-mono-archivo, chosen off the three-night serif streak and off the worn faces; a retro-futurist monospace turns the eventful day into a terminal log, and the concept keeps mono from reading as costume, Doug is a designer-developer and the ledger is a real printout with tabular figures. Type is set caps, justified, heavy, roman, texture none: the justified mono banner and the amber data are the texture, and a log renders as solid type, so an outline or repeated-type ground would undercut the deadpan.

The palette is a duotone, off the recent dark-void, drench and light-ground run: deep pine green (166°, inside the mandate but pushed past the recent 152° and 178° to separate) as the field and amber (44°) as the co-hue flooding the signals band and marking every event. Green and amber are the two classic CRT phosphor colors, so the duotone and the terminal chassis are the same idea. The mark is single-color amber, the honest choice on a two-hue field where the original green-and-blue would blend into the green, and it uses the fresh mark-only-md lockup at the top of a right-margin rail, in the first fold at both widths. Motion is a wipe entrance, the log printing in left to right, with on-scroll reveal so entries rise as you read.
