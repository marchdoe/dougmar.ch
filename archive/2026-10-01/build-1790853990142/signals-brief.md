# Signals Brief — 2026-10-01

## Hero Copy
None but ourselves can free our minds.

## Hero Rationale
Today's `signals.quote` is Bob Marley, from Redemption Song, and it carries easily: six words, defiant, quotable in isolation, and it reads as a thesis for a man who spent ten years refusing the default split of design from engineering and chose to go deep in both. I took the quote lane because the mandate asks me to reach for it first and this line is strong, attributed, and sits naturally above a register of self-directed work. Bob Marley renders as the caption directly under the line, so the attribution is in view. Owner's voice: Doug decided to own both disciplines and run his own shop for ten years instead of waiting for permission, so a line about freeing your own mind is one he'd nod at over the work index that proves it.

## Archetype
an oxblood specimen ledger, the line reversed out of a red band

## Composition
columns: masonry
axis: vertical
symmetry: broken
hero_zone: edge-bound
density: measured
rhythm: interrupted
shell_posture: marginal
field_ratio: balanced
collapse: rail-to-band
hero_object: list

## Composition Rationale
The line is about freeing your own mind, so the page leads with the evidence of a self-directed career: the work index is the object, the quote the standfirst above it. I moved `axis` off the mandate's suggested `radial` onto the discouraged `vertical` because a ten-year work ledger reads top to bottom and the owner's own praised reference is "index as interface, one row per project" — radial orbit would fight that reading. `symmetry: broken` serves the masonry (featured work large, 2008 experiments small, a ragged edge), and `rhythm: interrupted` puts the one big caesura between the professional work and the old experiments.

## Mobile
carrier: The oxblood flood band carries the line at 360 while the masonry index collapses to one full-width column of titles, years and roles beneath it.
first_fold: The oxblood hero band — mark top-left, the quote standfirst "None but ourselves can free our minds." at `3xl`, "Bob Marley" caption beneath.
order: hero band (quote + mark), selected work index, experiments, site callout, nav band, data strip footer
hero_step_360: 3xl
nav_360: The right rail drops to a full-width numbered small-caps band below the index; the mark and wordmark move to the top-left of the hero band so the mark stays in the first fold.

## Chassis
bitter-mulish

## Visual Specification
### 1. Color Specification
- **Primary hue**: 8° (oxblood red). Chosen against the 140–180° mandate deliberately: the recent window is saturated with green/teal and the measured repetition penalty was a hue collision, so I move decisively warm. Oxblood reads as dignified and defiant, the register Redemption Song lives in.
- **Neutral palette** (warm bone, tinted toward red): 50 `#faf6f0`, 100 `#f3ece1`, 200 `#e8ddcc`, 300 `#d6c7b0`, 400 `#b8a488`, 500 `#948066`, 600 `#6e5e48`, 700 `#4e4232`, 800 `#332b20`, 900 `#1d1812`
- **Accent color** (oxblood): light `#b44a3b`, default `#9a3729`, dark `#5f2017`, glow `#cc6a5b`
- **Secondary accent**: none. One committed hue holds the duotone.
- **Background**: page bg `#faf6f0`, card/surface `#e8ddcc`, band bgAlt `#f3ece1`, hero flood field `#5f2017`
- **Text colors**: primary `#3f1510`, secondary `#7c2a1f`, muted/faint `#6e5e48`; reversed on the flood: bone `#faf6f0`, muted bone `#e8ddcc`

### 2. Typography (bitter-mulish)
- **Hero phrase rendering**: the quote is the standfirst, so it steps down from marquee and the work index earns the largest type. Quote set at the `4xl` step, Bitter display, small-caps, heavy, bone reversed out of the oxblood flood band at the top edge. "Bob Marley" caption directly beneath in `sm` Mulish, fieldInkMuted.
- **Type treatment**: index project titles are the marquee object at `5xl` (clamp to ~120px at 1440), Bitter heavy small-caps, oxblood ink on bone. Section labels (SELECTED WORK, EXPERIMENTS) at `md` small-caps oxblood, with twice the space above as below. Years and roles at `sm`/`base` Mulish, tabular-nums for the years. Body/metadata at `base` (16px) Mulish, measure held 60–68ch. Micro labels at `xs` (≥12px). Mid-register is spent: `5xl` titles, `4xl` quote, `md` labels, `base` body, no gap from giant to tiny.

### 3. Layout Specification
- **Composition**: masonry / vertical / broken / edge-bound / measured / interrupted / marginal / balanced / rail-to-band / list. The work index leads because the line is about a free, self-directed mind and ten years of owned work is the evidence; the quote is the standfirst band at the top edge, the masonry index cascades beneath it, ragged by importance.
- **CSS grid/flex structure**: outer `display: grid; grid-template-columns: 1fr 88px` (content + right nav rail at 1440). Index: `display: grid; grid-template-columns: repeat(12, 1fr); grid-auto-flow: dense;` with featured entries spanning more columns/rows than experiments to produce the masonry.
- **Major dimensions**:
  - Hero flood band (quote standfirst): `min-height: 42vh`, full width of content column
  - Right nav rail: `width: 88px`, `height: 640px` from top
  - Max content width: `max-width: none`, `padding: 72px 6vw` on the content column
  - Section spacing: 48px base rhythm; the caesura gap before EXPERIMENTS is ~160px (the one interruption)
- **Nav placement**: right-margin vertical rail, 88px wide, mark + wordmark stacked at its top inside the first fold, numbered links down the rail.
- **Hero phrase grid zone**: rows 1–2 of the content column, full width, inside the oxblood flood band (the quote at `4xl`, ~56–72px at 1440).
- **Home callout slot**: `<SiteCallout />` sits below the work index and above the footer data strip, between the EXPERIMENTS block and the foot. I place it, I write nothing for it.

### 4. Component Character
- **Border radius**: cards/tiles 3px, buttons/tags 2px, nothing rounded (owner has dinged rounded corners). `full` reserved for the mark only.
- **Border treatment**: hairline `border` (`#d6c7b0`) between index rows; `borderStrong` (oxblood 700) under section labels and above the data strip.
- **Shadow**: none. Depth comes from the oxblood flood vs bone value, not shadow.
- **Density**: measured. Index tiles breathe; the one big caesura does the pacing.
- **Interactive states**: `_hover` fills an index row with a faint oxblood wash (`accentAlt` at low presence via a background swap to bone 100) and shifts the title to accent; links underline-grow.

### 5. Signal Integration
- **Where signal elements live**: a full-width data strip in the footer, below the callout.
- **Sports scores**: Detroit teams are off-season; one muted line "Lions · Tigers · Pistons · Red Wings — off-season" in `xs` textFaint, no score furniture.
- **Quote**: it is the hero standfirst, reversed out of the oxblood flood; "Bob Marley" is the caption beneath it.
- **Holiday elements**: none today; the dateline "Aldie, Virginia · October 1" sits small above the quote.
- **Music**: Wet Leg, Tobin Sprout, The War on Drugs as "On rotation" in the data strip, textMuted, framed as taste, not an event.
- **Other signals**: SPY 762.63 ▼0.21% in oxblood (down reads red honestly), tabular; weather 60°F cloudy; last-quarter moon, 69% lit; AQI good. All in the strip at `xs`/`sm` tabular Mulish.

## Self-Check
1. Hero quotability: Yes — "None but ourselves can free our minds." is a screenshot line on its own, attributed to Marley.
2. Because-of chain: Yes — a self-liberation line leads with the evidence of a self-directed career (list object), reversed out of a committed oxblood band in a warm slab.
3. Render feasibility: Yes — the quote at `4xl` and the index at `5xl` both fit Bitter's range (128/160) at 1440 without overflow.
4. Canvas floor feasible: Yes — a measured masonry index of seven entries plus flood band and data strip fills ~78% comfortably.
5. Phone: Yes — at 360 the quote at `3xl` and the mark sit in the first 640px of the oxblood band before the index stacks.

## Rationale
The phrase is Marley, "None but ourselves can free our minds." It is a line about self-determination, so the page does not shout it at the viewer; it sets the line as a standfirst and then shows the proof. That is why the hero object is the work index, not the statement: ten years of owned work, Spaceman through dougmar.ch down to the 2008 experiments, is the evidence that the mind was freed. The quote sits reversed out of a deep oxblood band at the top edge, Marley captioned beneath, and the index cascades below it as the largest type on the page.

The composition follows: a vertical masonry index, broken symmetry so featured work reads large and old experiments read small, and a single interrupted caesura between the professional register and the 2008 toys. Bitter-mulish carries it because a heavy slab is sturdy and warm at once, which is the exact register of a defiant line that is not angry; its real heavy cuts give the index titles gravity and the body Mulish answers the slab's width honestly rather than defaulting to a neutral sans. Small-caps and type-as-texture turn the oversized titles into the field itself, a specimen sheet, not a poster with one slogan.

The palette breaks the green mandate on purpose. Seven straight builds sat in green and teal and the measured repetition penalty was a hue collision, so I moved to oxblood at 8°, sixty degrees clear of every recent hue, carried in a duotone of oxblood and warm bone with a dot field for the specimen register. The down market renders in the same oxblood, which reads as honestly red, and the single-color mark sits in oxblood on the bone rail where it stays recognizable without fighting the flood.
