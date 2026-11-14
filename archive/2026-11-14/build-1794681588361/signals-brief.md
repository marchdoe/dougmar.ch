# Signals Brief — 2026-11-14

## Hero Copy
Do not follow the ideas of others, but learn to listen to the voice within yourself.

## Hero Rationale
From `signals.quote`, Dogen. It's a quiet Saturday with nothing to shout about: golf still mid-round, the market off a third of a percent, every Detroit team in the off-season, nine hours of daylight and overcast. A line about Doug's own day would be a weather fact or another golf figure, both of which shipped this week; the Dogen line beats them because it names the stance a one-person design-and-engineer shop actually runs on, trusting your own judgment of what ships over the trend of the week. Attribution renders directly under the quote.
Owner's voice: Doug has gone deep in both crafts on purpose and built his own small products against the two-teams-passing-files convention; "listen to the voice within yourself" is the working principle under "Deep in both. Not a generalist."

## Archetype
an illuminated reading page, the day kept in the margin

## Composition
columns: two-asymmetric
axis: vertical
symmetry: broken
hero_zone: upper-left
density: measured
rhythm: syncopated
shell_posture: standard
field_ratio: drenched
collapse: hero-only
hero_object: statement

## Composition Rationale
The two-asymmetric field lets the quote hang off one left rail while the narrow margin earns its keep holding the brand, nav and the day's facts, so a quote page never reads as a lonely centred poster. I moved axis to `vertical` (off `radial`) because a 15-word serif line is read top to bottom, not orbited; density to `measured` (off `dense`) because the line is contemplative and wants air without a void; and hero_object to `statement` (off `figure`) because the quote is the sentence and must be the largest thing on the page. `broken`, `syncopated`, `drenched` and `standard` held with the starting tuple — "yourself" breaking out as the single violation is both the broken symmetry and the syncopation, and standard shell breaks this week's footer-only/folded/marginal streak.

## Mobile
carrier: The quote carries alone at 360, set as a reading block with "yourself" broken out below it in amber outline.
first_fold: The Dogen quote (hero) with the 48px mark in the top-left corner; nothing else.
order: hero quote + Dogen, day-index band, selected work, site callout, footer data strip
hero_step_360: 2xl
nav_360: Mark drops to the top-left corner of the first fold; the margin's nav list and day-index stack into a full-width band directly below the hero.

## Chassis
spectral-albert

## Visual Specification
### 1. Color Specification
- **Primary hue**: 264° deep indigo. Stillness calls for a drenched cool field; a contemplative quote about listening inward reads as night, not daylight. 264° sits in the open 248°–274° band (see rationale on the mandate conflict).
- **Neutral palette (indigo-tinted)**: 50 `#F5F3FB`, 100 `#EBE8F4`, 200 `#D6D1E6`, 300 `#B3ADC9`, 400 `#8A82A4`, 500 `#635C80`, 600 `#49435F`, 700 `#332F45`, 800 `#221F30`, 900 `#15131F`
- **Accent color** (warm amber ember): light `#F2CF84`, default `#E8A63C`, dark `#C4821B`, glow `#F6E4B6`
- **Secondary accent**: none. One ember carries it.
- **Background**: page bg (dark) `#262050` / (light) `#EFECFB`; card/surface (dark) `#332865` / (light) `#F5F3FB`; hero field (dark) `#1A1639` / (light) `#332865`
- **Text colors**: primary (dark) `#EFECFB` / (light) `#1A1639`; secondary (dark) `#C5BAEC` / (light) `#49435F`; faint (dark) `#A294DD` / (light) `#635C80`

### 2. Typography
- **Hero phrase rendering**: `display` (Spectral) at the `hero` textStyle, overridden to `clamp(26px, 5.5vw, 80px)` so the 15-word quote sets as a reading column, not a shout. Set full-italic in the light display weight. The final word "yourself" breaks out one line down, upright (roman), one step larger, as stroked `outline` letterforms in `accent` amber — the one violation of the otherwise-even column, and the focal point.
- **Type treatment**: hero at the `hero` step; attribution "Dogen" at `md`; the margin day-index labels at `xs` small, their figures at `lg`; body/prose on the work index at `base` with `lead` for standfirsts. Spend the middle: a `2xl` section head opens the selected-work index so the page never jumps title-to-caption. Leading and tracking come from the ramp.

### 3. Layout Specification
- **Composition**: `two-asymmetric / vertical / broken / upper-left / measured / syncopated / standard / drenched / hero-only / statement`. The wide left column is a drenched indigo field carrying the quote; the narrow right margin is not whitespace, it holds the brand, the nav and the day's facts. The quote hangs off one left rail and reads down; "yourself" breaks the near-even cadence as the syncopation.
- **CSS grid structure**: `display: grid; grid-template-columns: minmax(0, 2.3fr) minmax(300px, 1fr);` hero field spans the left cell full-height; right margin is a sticky column.
- **Major dimensions**:
  - Hero field min-height `92vh`
  - Right margin width `clamp(300px, 26vw, 380px)`
  - Max content width `none`; side padding `64px 5vw`, left column inner padding to a 58–66ch measure on prose only
  - Section spacing on the vertical rhythm base; between-section `clamp(64px, 9vh, 120px)`
- **Nav placement**: right margin. Brand lockup at top of the margin, nav as a vertical `list` beneath it, then the day-index. No top bar.
- **Hero phrase grid zone**: left column, rows 1–4, roughly columns 1–8 of a 12-col read; quote block ~`72px` at 1440, anchored upper-left with clearance beneath for "yourself".
- **Home callout slot**: on `/`, place `<SiteCallout />` full-width below the selected-work index and above the footer data strip, between those two sections. No copy, no styling from me.

### 4. Component Character
- **Border radius**: cards/panels `3px`, buttons `2px`, tags `2px`. Sharp, editorial.
- **Border treatment**: hairline `border` for margin row rules; `borderStrong` for the one rule between quote column and margin.
- **Shadow**: none. Depth is value (field vs surface), not shadow.
- **Density**: measured. Breathing, with the margin populated so no column reads as a void.
- **Interactive states**: nav/links underline in `accent` on `_hover`; figures hold.

### 5. Signal Integration
- **Where signals live**: the right margin, as a quiet day-index beneath the nav.
- **Golf**: "Austin Championship" label in `fieldInkMuted` small caps; rows van Rooyen −13 (leader figure in `accent`), then Russell / Välimäki / Yu / Crowe all −12, figures in `fieldInk`. One ruled row each.
- **Weather / sun / moon**: "Aldie, overcast, 48°, feels like 42", sunrise 06:59 / sunset 16:50, first quarter moon 31% — a stacked readout in `textMuted`, the short-day facts suiting the dusk mood.
- **Market**: SPY 754.37, −0.36%, down, one row, change in `textFaint`.
- **Quote**: it is the hero. "Dogen" set at `md` directly beneath, in `fieldInkMuted`, visible attribution.
- **Music**: one line in the footer data strip, "In rotation: The War on Drugs, My Morning Jacket." Taste, not an event; never beside a score.
- **Holiday**: none today.

## Self-Check
1. Hero quotability: Yes — a complete, attributable aphorism, screenshot-worthy in isolation.
2. Because-of chain: Yes — contemplative quote → drenched cool indigo, quiet literary serif, broken column with the margin holding the day.
3. Render feasibility: Yes — 15 words at `clamp(…,80px)` across a 2.3fr column fit ~5 lines inside a 92vh field without overflow.
4. Canvas floor feasible: Yes — the indigo field floods the left column and the margin is populated, clearing 76%.
5. Phone: Yes — `hero-only` sets the quote at `2xl` in the first fold at 360, "yourself" on its own line, no word cut.

## Rationale
The phrase is Dogen's line about ignoring the crowd and trusting the voice within. On a quiet Saturday with no event to carry, that line is the strongest thing in the signals and it names how Doug actually works: one person deep in both crafts, deciding what ships. A contemplative aphorism about inwardness wants stillness, which the color philosophy maps to a drenched cool field, so the whole page is dusk indigo at 264° and the hero plane is the deepest indigo of all, quote reversed out in near-white.

Composition follows: the quote is a `statement`, the largest element, hung off one left rail in a `two-asymmetric` field so it reads as a page rather than a centred poster, with the narrow margin doing real work holding the brand, the nav and the day's facts. The one deliberate break is "yourself" — set upright and stroked in amber outline, breaking the even italic column. That single violation is the `broken` symmetry, the `syncopated` rhythm, and the meaning of the line, all in one move: the voice within is the warm ember in the cool field.

Chassis is `spectral-albert`, a transitional serif that reads literary and considered and loads true display italics, so the quote can lead in a light italic without shouting — the quietest register in the catalog suited to a reflective line, and unused in recent weeks. Palette is one dominant indigo carried across the viewport with a single warm amber accent at roughly ten percent, honoring the one-accent rule. I deviated from the 140°–180° color target because that target sits inside its own forbidden 128°–248° zone and green shipped on the 13th and the 4th; 248°–274° is a genuinely open band and drenched cool indigo is the honest fit for the phrase. The standard shell with a right-margin header breaks the recent footer-only/folded/marginal streak and the previous build's repeat.
