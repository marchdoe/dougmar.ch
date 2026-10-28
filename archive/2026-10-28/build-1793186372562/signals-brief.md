# Signals Brief — 2026-10-28

## Hero Copy
Fog, fifty degrees, calm.

## Hero Rationale
This morning in Aldie is one unambiguous fact: 98% humidity, fog to the ground, 49.9°F, wind at 2.2 mph. That is a weather readout stated plainly, the three facts formatted into one terse line, condition, temperature, and the calm of near-zero wind. It beats the Morrison quote because the quote is beautiful but it is not Doug's register; a weather readout in short fragments with real numbers is exactly how he clocks a morning. The Pistons loss and the market tick are lesser signals and go to the colophon.
Owner's voice: Doug says what a morning is in three facts and no adjectives, a score is a score and so is the fog.

## Archetype
a fog readout, the figure settling at the treeline

## Composition
columns: two-equal
axis: radial
symmetry: broken
hero_zone: lower-third
density: measured
rhythm: interrupted
shell_posture: footer-only
field_ratio: drenched
collapse: split-to-sequence
hero_object: figure

## Composition Rationale
I moved `columns` off the suggested `three` to `two-equal` because the fog readout wants the gold-standard thesis/evidence split: the morning on the left, the work index on the right, both drenched teal so the division is value, not void. Keeping `radial` fits fog literally, mesh blooms diffusing from centers rather than ruled into rows, and `lower-third` leaves the upper field empty like mist with the figure settling at the treeline. Against the nearest drench-figure day (10-24, three/center/hero-only) I differ on columns, hero_zone and collapse, so the silhouette reads as a split field, not a centered scoreboard.

## Mobile
carrier: The split collapses to a sequence: the fog field runs full width with the 98% figure and the phrase, then the work index runs full width beneath it, the thesis still above its evidence by adjacency.
first_fold: The 98% figure, its HUMIDITY · ALDIE label, and the hero phrase "Fog, fifty degrees, calm." with the stacked mark top-left.
order: hero fog field (figure + phrase + deck), selected-work index, site callout, about + capabilities, footer flood colophon
hero_step_360: 5xl
nav_360: Mark stays top-left of the fog field; nav list moves to the footer flood band, small-caps rows stacked full width.

## Chassis
source-serif-text

## Visual Specification
## 1. Color Specification
- **Primary hue**: 165° (muted cyan-green). Fog at 98% humidity over dark pines reads as a soft deep teal, inside the mandate's 140–180° target. Committed as a single-hue drench.
- **Neutral palette** (pine-grey, teal-tinted): 50 `#f2f5f4`, 100 `#e3e9e7`, 200 `#c8d2cf`, 300 `#a3b0ac`, 400 `#7c8a86`, 500 `#5d6b67`, 600 `#475450`, 700 `#38423f`, 800 `#2a3230`, 900 `#1b211f`
- **Accent color** (pale aqua-mint, the one light in the fog): light `#9fe8d4`, default `#45cfa8`, dark `#1f9476`, glow `#c9f2e4`
- **Secondary accent**: none. One accent, same hue family, carrying the figure and the key marks.
- **Background**: page bg `#203f37` (deep fog teal), card/index surface `#274f44`, footer flood/field `#17302a`
- **Text colors**: primary text `#eef6f3`, secondary `#b2d2c9`, faint `#84b5a8`

## 2. Typography
- **Hero figure rendering**: the figure `98%` set in `display` (Source Serif 4) at the `5xl` step (clamp to 120px at 1440). A small-caps label `HUMIDITY · ALDIE` in `sm` sits above it, with twice the gap above the label as below it (label binds down to the figure). The hero phrase `Fog, fifty degrees, calm.` is the one h1, set at `3xl` directly beneath the figure as its caption, in caps.
- **Type treatment**: ramp steps carry size/leading/tracking. Figure `5xl`; phrase/h1 `3xl`; section heads and the work-index titles `2xl`; standfirst/deck `lede`; body and index rows `base` held to 62–68ch at 1.55 leading; captions and colophon metadata `sm`; micro labels `xs` (never below 13px). Light display weight throughout, roman, caps register. A single large outlined serif word (`ALDIE`) sits faint in the fog field as atmosphere, stroked not filled.

## 3. Layout Specification
- **Composition**: two-equal / radial / broken / lower-third / measured / interrupted / footer-only / drenched / split-to-sequence / figure. Left half is the fog readout (figure settling in the lower third of an empty misty field), right half is the selected-work index in ruled rows. The split is the gold-standard thesis/evidence: the morning on the left, the work on the right, both drenched teal, so the page is one field at two values.
- **CSS grid structure**: `display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh` for the hero band; the index column is `display: grid; grid-auto-flow: row` with hairline-ruled rows.
- **Major dimensions**:
  - Hero band `min-height: 92vh`; the left fog field holds its upper two-thirds empty, figure+phrase land lower-third.
  - No fixed sidebar. `max-width: none`; side padding `clamp(24px, 5vw, 80px)`.
  - Section padding `clamp(48px, 6vw, 112px)` vertical; vertical rhythm on the chassis base unit.
- **Nav placement**: deferred to the footer flood band (shell_posture footer-only). The stacked-lg brand mark sits top-left of the fog field, inside the first fold.
- **Hero phrase grid zone**: left column, rows spanning the lower third (roughly rows 7–10 of a 12-row field); figure at ~120px, phrase caption at `3xl` directly below.
- **Home callout slot**: `<SiteCallout />` on `/` sits full width below the selected-work index section and above the footer flood band, between the work index and the about/capabilities section. It renders in today's `bgAlt`. I write no copy and no styling for it.

## 4. Component Character
- **Border radius**: cards/panels `4px` (md), buttons/tags `2px` (sm), nothing rounded.
- **Border treatment**: bordered by hairline `border` on index rows; `borderStrong` for the one section break and the figure's underscore. Footer rules in `fieldBorder`.
- **Shadow**: none. Depth comes from the teal value split (bg vs surface vs field), not shadow.
- **Density**: spacious, measured. Fog wants air.
- **Interactive states**: index-row and nav links shift ink to `accent` on hover and draw a 1px `accent` underline; the whole row gets a 44px tap box.

## 5. Signal Integration
- **Where signals live**: the hero carries the weather readout (98% figure, phrase, deck). Everything else lives in the footer flood band.
- **Pistons loss**: in the footer index, `Pistons 97, Jazz-row style 111` as `Pistons 97–111 L`, score in `sm` tabular, the en dash allowed inside the score.
- **Market**: `SPY 769.66 +0.56%` in the footer, `sm` tabular, direction up in `accent`.
- **Quote**: Morrison "You are your best thing." attributed `— Toni Morrison` in the footer, small, since it is not the hero.
- **Holiday**: `Halloween, 3 days out` as a quiet footer note.
- **Golf**: `VidantaWorld Mexico Open · scheduled` footer line, no leaders yet.
- **Music**: `In rotation: My Morning Jacket, The War on Drugs` labeled as rotation, taste not event, footer.
- **Moon**: `Waning gibbous, 90%` footer.
- **Deck under the hero**: `98% humidity over Aldie. Wind 2 mph, east. Sunrise 7:41.`

## Self-Check
1. Hero quotability: Yes — three raw facts in Doug's terse weather register, a still line that stands alone over the fog field.
2. Because-of chain: Yes — a calm fog readout forces a drenched cold teal, a quiet literary serif, a figure object, and a lower-third settle in near-empty space.
3. Render feasibility: Yes — the figure at 120px (chassis 5xl max) and the phrase at 3xl fit a half-column at 1440 with room to spare.
4. Canvas floor feasible: Yes — two filled teal halves at measured density clear 70%; the empty upper-left fog is an intentional caesura inside a filled field.
5. Phone: Yes — split becomes a sequence; the 98% figure at 5xl (64px) and the phrase caption land inside the first fold, no word cut.

## Rationale
The phrase is a weather readout, three raw facts stated flat: fog, fifty degrees, calm. It is signal-event, not composed, because the morning handed me a 98% humidity figure and a 2.2 mph wind and the honest move is to format them, not embroider them. That phrase is a figure day: the humidity leads at poster scale and the line is its caption, which is why the composition is a figure object in the lower third of a near-empty field, the fog holding the upper two-thirds and the readout settling at the treeline.

Because the line is calm and cold, the field is one committed teal drench at 165°, inside the color mandate, with a single pale-mint light where the figure sits. No second accent, no neutral void: fog is one color at volume. The chassis is Source Serif 4, the one literary quiet face in the catalog that has not shipped, and the loudness guidance reserves the quietest heroes for lines that do not want shouting. A fog stillness does not shout; a warm text serif at a light weight reads as a contemplative morning, not a scoreboard.

The layout is the gold-standard split: the morning on the left, the selected work on the right, both drenched teal at two values so the division is weight, not a seam. Shell is footer-only, nav deferred to a flooded colophon band that reverses the signals out of the field, with the stacked-lg mark top-left of the fog so the brand is in the first fold at both widths. Motion is a wipe, the hero clearing in left to right like fog lifting, over a mesh ground that drifts slowly, the only moving thing a cold morning would actually do.
