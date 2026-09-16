# Signals Brief — 2026-09-16

## Hero Copy
Ten to one, no questions asked.

## Hero Rationale
The Detroit Tigers won 10–1 last night, a genuine blowout, and Doug follows the Tigers. That score is the loudest, most Doug-owned fact in today's signals, so the number leads at poster scale and this line is its caption. It's a flat call on a lopsided game, the way a fan states a rout: the score did the arguing. Owner's voice: Doug says what happened and calls it plainly, a ten-run win is a blowout and he'd say so without dressing it up.

## Archetype
a scoreboard slab in Tigers colors

## Composition
columns: irregular-twelve
axis: diagonal
symmetry: right-weighted
hero_zone: full-bleed
density: dense
rhythm: even
shell_posture: footer-only
field_ratio: field-dominant
collapse: stack
hero_object: figure

## Composition Rationale
I kept the mandate's starting figure/diagonal/right-weighted/dense/even/field-dominant spine because a blowout score is exactly the poster-figure day the mandate describes. I moved hero_zone off lower-third to full-bleed: lower-third graded C on 09-11 for leaving a void above the fold, and a full-bleed figure guarantees the score lands in the first fold at 1440. I moved shell_posture off `none` to footer-only, because `none` forces header placement `none` and mark_px 0, which would strip the brand from the first fold; footer-only keeps the mark top-left of the hero and defers only the nav.

## Mobile
carrier: the orange `10–1` figure fills the top of the navy field full-width, the caption directly under it.
first_fold: the mark top-left, the figure `10–1`, and the caption "Ten to one, no questions asked."
order: mark, figure (10–1), caption, deck, work index, signals colophon, footer nav
hero_step_360: hero
nav_360: header defers to the footer; nav becomes a stacked vertical list at the base, mark stays top-left of the hero.

## Chassis
alfa-rubik

## Visual Specification
### 1. Color Specification
- **Primary hue**: 28° (Tiger orange). The Tigers' orange is the saturated hue a blowout deserves; against navy it is the team's two-color signal, which the generic 40–80° amber the mandate suggests could not say.
- **Neutral palette (sand, warm)**: 50 `#FAF6F0`, 100 `#F0E8DC`, 200 `#E0D3C0`, 300 `#C9B79F`, 400 `#A89279`, 500 `#85705A`, 600 `#665442`, 700 `#48392C`, 800 `#2C2119`, 900 `#17100A`
- **Accent color (orange)**: light `#F0883F`, default `#E86F1E`, dark `#9E4611`, glow `#FF8A3D`
- **Secondary accent (navy)**: `#0D1A30` field / `#081120` deep band; navy is the dominant ground, orange the flooded poster plane and the winning numeral.
- **Background**: page bg `#0D1A30` (navy 800), card/surface `#142440` (navy 700), band bgAlt `#081120` (navy 900), orange field `#E86F1E`
- **Text colors**: primary `#FAF6F0`, secondary `#E0D3C0`, muted `#A89279`; on the orange field, ink `#081120`

### 2. Typography
- **Hero phrase rendering**: The figure `10–1` is the `display` face (Alfa Slab One) at the `hero` clamp, the single largest object on the page. The phrase "Ten to one, no questions asked." sits one step down at `3xl` as the figure's caption. A deck at `lg` ("Detroit put up ten and gave back one.") holds the middle of the scale so no page jumps title-to-body.
- **Type treatment**: `hero` for the score, `3xl` for the caption phrase, `lg` for the deck and section heads, `md` for standfirsts, `base` for body held to 60–68ch, `sm`/`xs` small-caps for colophon labels. Alfa Slab One's fat physical numerals are the scoreboard slab; Rubik answers as a rounded grotesk body sharing the warm rounded skeleton.

### 3. Layout Specification
- **Composition**: irregular-twelve / diagonal / right-weighted / full-bleed / dense / even / footer-only / field-dominant / stack / figure. The score fills the field full-bleed so the figure lands in the first fold at 1440 (fixing the 09-11 void), and the diagonal cut plus right-weighting resolve the mass against the reading direction.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto;` hero figure spans columns 3–12 rows 1–3 on the navy field; an orange knockout plate carries the "10" across columns 6–12.
- **Major dimensions**:
  - Hero/figure field: `min-height: 82vh`
  - No sidebar; footer colophon band `min-height: 220px`
  - Max content width: `max-width: none`, side padding `clamp(24px, 6vw, 96px)`
  - Section padding: vertical rhythm on the chassis base unit, `clamp(48px, 8vh, 120px)` between zones
- **Nav placement**: footer colophon band; nav lives at the base. The mono mark sits top-left of the hero field, inside the first fold at 1440 and 360.
- **Hero phrase grid zone**: figure `10–1` rows 1–3, columns 3–12; caption phrase row 4, columns 7–12 (right-weighted), at `3xl`; the "10" numeral itself reaching ~300px at 1440.

### 4. Component Character
- **Border radius**: cards/buttons/tags `0` (hard corners, owner dislikes rounded); `full` reserved for the circular mark only.
- **Border treatment**: hairlines in `border` (navy 600); the orange field uses `fieldBorder` rules; section breaks in `borderStrong`.
- **Shadow**: none. Depth comes from field value shifts, navy to orange.
- **Density**: dense, information-forward, small gutters in the colophon.
- **Interactive states**: links shift to `accentAlt` on hover with a 1px underline offset; no motion beyond color.

### 5. Signal Integration
- **Where signal elements live**: the score is the hero figure; every other signal is a tabular colophon at the base.
- **Sports scores**: `10–1` is the marquee figure in Alfa Slab One, orange knockout on navy; the deck states it plainly.
- **Quote**: Maya Angelou's "Try to be a rainbow in someone's cloud." is a single small italic footnote in the colophon, never the hero (no back-to-back quote streak, and the score is the stronger line).
- **Holiday**: none today.
- **Music**: Wet Leg, My Morning Jacket, Radiohead set as a quiet "On rotation" small-caps line in the colophon, presented as taste, not an event.
- **Other signals**: SPY 757.39, down 0.46%; clear 58°F, wind SSW 4mph; waxing crescent, 28% lit; Biltmore Championship (scheduled); AQI Good. All set as tabular colophon rows.

## Self-Check
1. Hero quotability: Yes — "Ten to one, no questions asked." reads as a rout called flat, quotable off the number.
2. Because-of chain: Yes — score → figure object → scoreboard slab chassis → Tigers duotone → full-bleed field, all traceable.
3. Render feasibility: Yes — `10–1` is four glyphs, Alfa at hero clamp fills the field at 1440 without overflow.
4. Canvas floor feasible: Yes — field-dominant duotone with a poster figure and dense colophon clears 82%.
5. Phone: Yes — `10–1` at `hero` step is short and lands whole in the first fold at 360.

## Rationale
The phrase is the score. The Detroit Tigers won 10–1, a genuine rout, and Doug follows the Tigers, so today's loudest owner-true fact is a blowout number, not a borrowed quote and never the machine. That decides the object: a figure leads, the "10–1" is the single largest thing on the page, and "Ten to one, no questions asked." is its caption. That is the composition the mandate pointed at, and it is the gesture the owner's A-grades keep rewarding, the trophy-gold scoreboard and the fairway split, a score carried entirely by type and color.

Because the figure has to hit poster scale as physical scoreboard numerals, the chassis is alfa-rubik: Alfa Slab One is a fat, physical fatface whose numerals read as a scoreboard slab at 177px, and Rubik answers as a rounded grotesk body sharing that warm rounded skeleton. It is off the three recently-worn faces and is not the condensed-caps default. The palette is the only honest one for this score: Detroit's own navy and orange, a duotone with no neutral void, the two team colors flooding the field. That deviates from the 40–80° warm mandate deliberately, the generic amber it would produce says nothing about the Tigers, and gold has run three times in the recent window; navy and orange are the team, and a ten-run win earns the team's palette at volume.

Layout follows: full-bleed figure on the navy field so the score lands in the first fold at 1440 and cannot leave a void above it, right-weighted mass and a diagonal reading path per the mandate, and a footer-only shell that defers only the nav while the single-color mark holds top-left of the hero at 3:1 against the navy, inside the fold at both rungs. Every other signal, the SPY dip, the clear 58° morning, the waxing crescent, the scheduled Biltmore Championship, the standing music rotation, and the Angelou line as one small italic footnote, sits as a tabular colophon at the base, subordinate to the number that carried the day.
