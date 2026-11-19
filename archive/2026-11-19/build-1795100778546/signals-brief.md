# Signals Brief — 2026-11-19

## Hero Copy
Design and build on the same desk.

## Hero Rationale
Today the composition mandate pushes a piece of owned work to the front, and the one project carrying a real client set is Spaceman: the ten-year LLC behind Zeldman, Rolex, The Nature Conservancy, Intuit and LastPass. The phrase captions that artifact and states the thing Spaceman actually is, one person doing the design and the engineering, no files passed between teams. It is composed from Doug's standing thesis without repeating any shipped line ("Closing the gap…", "Same hands…", "Design and engineering as one job…" are all taken), so it earns its own day.
Owner's voice: Doug says design and engineering are one job, not two teams passing files, and "one desk" is how he'd compress that without a dash.

## Archetype
an engraved brass desk-plate specimen

## Composition
columns: irregular-twelve
axis: horizontal
symmetry: broken
hero_zone: full-bleed
density: dense
rhythm: syncopated
shell_posture: standard
field_ratio: drenched
collapse: reorder
hero_object: artifact

## Composition Rationale
The phrase captions one piece of owned work, so the artifact leads and the twelve-column title-block puts the SPACEMAN plate at thesis-left with its metadata and client ledger as evidence-right. I moved axis off the mandate's `radial` start onto the discouraged `horizontal`: a dense drawing title-block genuinely reads left-to-right, and radial would scatter a client ledger around a center it cannot hold (and would repeat the earlier Spaceman-orbit conceit). Columns moved masonry→irregular-twelve and symmetry mirrored→broken so the oversized SPACEMAN breaks the grid instead of being tiled by it.

## Mobile
carrier: The engraved SPACEMAN nameplate and its caption carry full-width at 360; the client ledger and work index stack beneath as full-width ruled rows.
first_fold: SPACEMAN at 4xl with the caption h1 "Design and build on the same desk." at 2xl directly beneath it.
order: masthead, artifact (SPACEMAN + caption), client ledger, selected-work index, site callout, footer data strip
hero_step_360: 2xl
nav_360: top bar collapses to the stacked mark plus the "Index" word; work / about / contact move into the footer data strip.

## Chassis
big-shoulders-atkinson

## Visual Specification
### 1. Color Specification
- **Primary hue**: 66° (olive-brass / tarnished gold). The engraved-nameplate conceit for "Design and build on the same desk" wants aged brass, not scoreboard gold. The Color Mandate targets 40–80° warm; the repetition check wants ≥60° off the recent 42–50° golds, but every hue 60° away is inside a forbidden zone, so I push to the green edge the range allows (66°) and differentiate further by value (dark drench) and formula (drench, not the recent light-ground/duotone/split).
- **Neutral palette (patina stone)**: 50 `#f8f7ef`, 100 `#ececdf`, 200 `#d8d8c4`, 300 `#bdbda3`, 400 `#9c9c7f`, 500 `#7b7b60`, 600 `#5f5f49`, 700 `#464636`, 800 `#2f2f23`, 900 `#1c1c14`
- **Accent color (warm gold, the lit edge of the brass)**: light `#efcb52`, default `#ecc53d`, dark `#b08a1f`, glow `#f6e08c`
- **Secondary accent**: none (one dominant accent, held at full saturation)
- **Background**: page bg `#50541a` (dark olive-brass), card/surface `#656a21`, band bgAlt `#3f4313`, poster/masthead field `#272a0c`
- **Text colors**: primary `#f7f5e2` (green-tinted ivory), secondary `#ddd9a7`, muted/faint `#c3c66e`

### 2. Typography
- **Hero phrase rendering**: the artifact is the marquee. `SPACEMAN` is set in `display` (Big Shoulders) at the `hero` step as stroked **outline** caps, the engraved channels of a nameplate, sized `clamp(96px, 13vw, 156px)`. The hero phrase itself, "Design and build on the same desk.", is the h1 and sits beneath as the caption at the `4xl` step in solid display caps, one step down from the object as the artifact rule requires.
- **Type treatment**: ramp steps carry size/leading/tracking. `hero` for SPACEMAN; `4xl` for the caption h1; `xl` for work-index project titles; `lg` for client names and section heads; `lede` for the standfirst deck under SPACEMAN (the mid-register element: role, year, one sentence); `base` (Atkinson) for body in a 60–68ch measure at 1.5 leading; `sm` for metadata rows; `xs`/`2xs` for micro labels, never under 12px. Accent caps labels get 0.1em tracking and space-above at twice space-below.

### 3. Layout Specification
- **Composition**: irregular-twelve / horizontal / broken / full-bleed / dense / syncopated / standard / drenched / reorder / artifact. A twelve-column title-block reads thesis-left (the SPACEMAN plate) / evidence-right (metadata and ledger), the gold-standard FLOOR split logic, so the work leads and the phrase captions it.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); gap: 24px;`
- **Major dimensions**:
  - Hero/artifact plate: `min-height: 84vh`
  - Max content width: `max-width: none`, side padding `padding: 72px 6vw`
  - SPACEMAN occupies cols 1–9; artifact metadata (2018 · Founder) cols 10–12 as a drawing title-block
  - Client ledger: full width cols 1–12, hairline-ruled rows, tracked caps
  - Section spacing: 96px between major zones at 1440; 56px at 360
- **Nav placement**: thin top bar, `height 112px`, full width; stacked lockup engraved at left, single word "Index" (small-caps) at right revealing the links. Not the rejected wordmark-left / links-right row.
- **Hero phrase grid zone**: SPACEMAN rows 1–3 cols 1–9; caption h1 rows 3–4 cols 1–8 at `4xl` (~88–104px at 1440).
- **Home callout slot**: on `/`, placed below the selected-work index and above the footer data strip, between the work index and the footer. Not inside the hero. I write no copy for it and specify no styling.

### 4. Component Character
- **Border radius**: cards 2px, buttons 2px, tags 1px (square, machined). `full` reserved for the brand disc.
- **Border treatment**: bordered hairlines, `border` on bg, `borderStrong` for section rules and the title-block frame. No raised cards; planes separate by value.
- **Shadow**: none. Depth comes from the value step between field/bg/surface.
- **Density**: dense, information-forward, small gutters.
- **Interactive states**: hover lifts ink to `accent` and thickens the row rule to `borderStrong`; no color-only state.

### 5. Signal Integration
- **Where signals live**: a footer **data strip**, one ruled tabular row of the day's facts, plus a signal line in the colophon.
- **Sports scores**: tabular figures. Pistons 122–109 is the lit one (`accent` on the margin). Red Wings 1–4 set muted. RSM Classic in progress: "RSM Classic · John Parry −1 · five tied" in the strip.
- **Quote**: not the hero. A small attributed footnote in the colophon: "May you find grace as you surrender to life." Dan Millman. Quiet, `textFaint`.
- **Holiday**: "Thanksgiving in 7" micro-label at the strip's end.
- **Music**: one quiet colophon line, "On rotation: Guided by Voices, The War on Drugs, Wet Leg." Taste, not an event, set apart from the score row.
- **Market/weather**: "SPY 730.20 −0.31%" muted (down, no celebration); "Aldie VA · Sunny · 50°F" in the strip.

## Self-Check
1. Hero quotability: Yes — "Design and build on the same desk." is a standalone thesis, not a descriptive first line.
2. Because-of chain: Yes — artifact-leads → Spaceman plate → condensed signage chassis → tarnished-brass drench → twelve-column title-block.
3. Render feasibility: Yes — Big Shoulders condensed caps at ~156px fits 1440 without overflow; caption at 4xl sits beneath.
4. Canvas floor feasible: Yes — a dense drenched spec plate with artifact, ledger, index and data strip fills 82%.
5. Phone: Yes — SPACEMAN at 4xl over the caption at 2xl lands inside 640px without cutting a word.

## Rationale
The phrase is "Design and build on the same desk." It captions the one artifact that proves it: Spaceman, the ten-year shop where the design and the engineering are one pair of hands, with a client roster (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) that is itself the argument. So the object leads, not another poster statement. That forced an artifact composition: a twelve-column drawing title-block, SPACEMAN at marquee thesis-left, its year, role and client ledger as evidence-right, the phrase as its caption one step down.

Because the object is a stamped nameplate, the chassis is Big Shoulders Display, condensed signage caps with Atkinson's hyperlegible body for the dense ledger and index; it has not shipped recently, and it carries the word at 156px. The type is set in caps with outline (stroked) letterforms, the engraved channels of a plate, which is why I reached onto the discouraged caps value: an engraved nameplate is caps, and outline is the fresh, on-theme texture. The palette is a tarnished-brass drench at 66°: aged olive-gold rather than the recent scoreboard golds, dark enough to reverse ivory type at 7:1, metallic rather than bright. Drench is a formula none of the last seven builds used, and it carries the single-plate conceit across 70% of the viewport.

Layout holds one left rail, spends the middle of the scale (standfirst deck, section heads, the client ledger between the 156px marquee and 16px body), and gives every signal a concrete home in a tabular footer strip, with the Pistons win lit and the market drop left muted. The mark is the real circular lockup, stacked and engraved on the dark brass field where the white disc carries, inside the first fold at both widths.
