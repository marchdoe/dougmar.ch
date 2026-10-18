# Signals Brief — 2026-10-12

## Hero Copy
Spend eighty percent of your time focusing on the opportunities of tomorrow rather than the problems of yesterday.

## Hero Rationale
This is `signals.quote` (Brian Tracy), and it carries the day because it is a working instruction, not a mood: an 80/20 rule pointed forward, which is exactly how Doug frames his own practice ("Still the vehicle for the next experiment"). Rather than set it as a lone poster, I let it do work it was built for: it becomes the standfirst over Doug's work index, and the forward-leaning projects (dougmar.ch 2026, 15th Club 2025, FishSticks 2025) are the opportunities the line names. Brian Tracy is set as a visible caption under the line. Owner's voice: Doug spends his energy on what ships next, not on relitigating finished work, and he'd read this as plain operating advice, not a slogan.

## Archetype
An index-specimen: a reflective standfirst ruled over the work, forward years first.

## Composition
columns: irregular-twelve
axis: vertical
symmetry: broken
hero_zone: edge-bound
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: balanced
collapse: reorder
hero_object: list

## Composition Rationale
I kept the date-derived starting tuple's structural spine (irregular-twelve, vertical, broken, interrupted, none, balanced, reorder) because a reflective instruction paired with evidence wants a ruled index read top to bottom, not a poster. I moved hero_object from `artifact` to `list`: the quote names "opportunities of tomorrow" in the plural, so the forward work (newest years first) leads as a multi-row index, not one piece. I moved hero_zone from `full-bleed` to `edge-bound` so the quote binds to the top edge as a standfirst band over the index, which is how a standfirst-above-list actually sits; full-bleed would have forced the quote to be the whole first screen and starved the object.

## Mobile
carrier: At 360 the twelve-column index collapses to one column of full-width ruled rows, each project title over its year, role and client set, with the quote standfirst reordered to lead.
first_fold: The stacked-lg mark top-left, then the hero quote "Spend eighty percent of your time focusing on the opportunities of tomorrow rather than the problems of yesterday." at 2xl with Brian Tracy beneath.
order: mark, quote standfirst, nav sentence, work index, home callout, colophon
hero_step_360: 2xl
nav_360: No bar; mark top-left near 56px, the three nav links sit as a small-caps sentence directly under the quote.

## Chassis
spectral-albert

## Visual Specification
## 1. Color Specification
- **Primary hue**: 112° (grass green). Chosen for growth/forward-season reading that pairs with "opportunities of tomorrow," and positioned to clear the forbidden 130-252 band and the recent 160/176 greens.
- **Neutral palette** (green-warm tinted): 50 `#FAFBF5`, 100 `#F2F4EA`, 200 `#E6E9D9`, 300 `#D3D8C3`, 400 `#ADB49B`, 500 `#868D74`, 600 `#656B54`, 700 `#4A4F3D`, 800 `#2A2E22`, 900 `#1B1E14`
- **Accent color**: light `#87C03E`, default `#3F6B0F`, dark `#2E4F0A`, glow `#87C03E`
- **Secondary accent**: none
- **Background**: page bg `#FAFBF5`, card/surface `#F2F4EA`, band bgAlt `#F1F8E5`, flooded field `#2E4F0A`
- **Text colors**: primary `#1B1E14`, secondary `#4A4F3D`, faint `#656B54`

## 2. Typography (spectral-albert)
- **Hero phrase rendering**: the quote is the h1, set in Spectral **display italic** at the `3xl`→`4xl` step as a top-edge standfirst (`lead: italic`). "Brian Tracy" sits under it in Albert Sans small caps at `sm`. It is NOT the largest object: the work index carries marquee.
- **Display register (the object)**: project titles set at `5xl` (64→120px) in Spectral **small caps**, roman — the page's largest type, forming the index-specimen rhythm (`texture: type-as-texture`).
- **Type treatment**: hero quote `4xl` italic; project titles `5xl` small-caps; standfirst/attribution `sm`; metadata (year, role, client) `xs` Albert Sans tabular; body/decks `base`→`lede` Albert Sans at 1.55 leading, 62ch. Mid-register section heads at `xl` so the scale is spent, never jumping title-to-caption.

## 3. Layout Specification
- **Composition**: `irregular-twelve / vertical / broken / edge-bound / measured / interrupted / none / balanced / reorder / list`. The quote binds to the top edge as a ruled standfirst band; beneath it the work reads as a twelve-column index whose spans change per row, so no two rows align — the structure itself says "look ahead, here is the evidence."
- **CSS grid**: `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; row-gap: clamp(28px, 4vh, 56px)`. Title spans cols 1–8, year 9–10, role/client 11–12, varying ±2 per row; one row (dougmar.ch, 2026) breaks to span 1–11 offset right as the caesura.
- **Major dimensions**: hero standfirst band `min-height: 46vh`; index fills below with ruled rows at ~96px each. No sidebar. `max-width: none; padding: 72px 6vw`. Content reads full-width.
- **Nav placement**: no bar. Mark top-left of the paper. Nav as three in-content links inside one running sentence set low under the standfirst.
- **Hero phrase grid zone**: rows 1–2, columns 1–11 (top-edge band), intended 32→56px at 1440. Project-title index begins row 4.
- **Home callout slot**: on `/`, below the work index and above the footer colophon block, as its own full-width band between the index and the colophon.

## 4. Component Character
- **Border radius**: cards/rows 2px, buttons 4px, tags 2px. Nearly sharp — specimen discipline.
- **Border treatment**: bordered. Hairline `border` rules between index rows; `borderStrong` under the standfirst and above the colophon.
- **Shadow**: none. Depth from value and rule, not elevation.
- **Density**: measured. Generous row rhythm, one caesura gap.
- **Interactive states**: index rows shift ink to `accent` and the row rule thickens to `borderStrong` on hover; links underline in `accent`.

## 5. Signal Integration
- **Where**: a ruled colophon block in the footer carries the day's signals as a typographic index; the mark and quote own the top.
- **Sports scores**: Lions 45–21 and Baycurrent Classic (Brennan −16, Mitchell/Bridgeman −15) set in Albert Sans tabular numerals, `sm`, accent-green score figures against paper, one rule per line.
- **Quote**: it IS the hero phrase, the standfirst; Brian Tracy credited beneath in small caps.
- **Holiday**: "Columbus Day" as a dated label in the colophon.
- **Music**: Radiohead, Wet Leg, Tobin Sprout on an "On rotation" line in the colophon, framed as standing taste, never as an event beside the scores.
- **Other**: Aldie overcast 68.8°F, waxing crescent 5.9%, SPY −0.06%, AQI good — each a ruled metadata row in the colophon.

## Self-Check
1. Hero quotability: Yes — a forward-pointed 80/20 instruction, quotable standing alone and attributed.
2. Because-of chain: Yes — forward quote → work-as-evidence list → index-specimen tuple → reflective Spectral → grass-green on paper → ruled twelve-column grid.
3. Render feasibility: Yes — Spectral 5xl reaches 120px; index titles at clamp max 116px fit without overflow, quote standfirst sits at 4xl.
4. Canvas floor feasible: Yes — a full-width ruled index of seven projects plus standfirst and colophon fills 72% comfortably.
5. Phone: Yes — at 360 the reordered quote leads at `2xl` inside the first fold without cutting a word.

## Rationale
The phrase is a forward instruction in the plural — the opportunities of tomorrow — so the page cannot be a single poster line held in isolation; it has to show the opportunities. That pointed me straight to `hero_object: list`: the quote becomes a reflective standfirst and Doug's forward work (dougmar.ch 2026, 15th Club 2025, FishSticks 2025, then the older experiments) reads as a twelve-column index ordered newest-first, so the structure literally spends its attention on what is next. The broken, interrupted twelve-grid lets one row (dougmar.ch, the current year) break its alignment as the focal caesura, which keeps the page from reading as a tidy template.

Spectral + Albert Sans is the chassis because the quote wants a considered, literary register, not a shout, and its quietest-tier display (64→96 hero, 64→120 at 5xl) is exactly the reservation the catalog describes for reflective lines — the quote sits in display italic while the index titles take the 5xl marquee at small caps. It is also fresh against a fourteen-day run that leaned on condensed and grotesque faces. The treatment moves off eight nights of sameness on every field the mandate tracks: small caps (not mixed/lower/caps), italic lead, left alignment (not right/centred/justified), and type-as-texture from the oversized index.

Palette and shell follow. Light-ground on warm green-tinted paper breaks the recent run of drench, dark-void and split-field, and it is the one ground where the Brand Contract actively wants the original green-and-blue mark — so the real stacked-lg mark anchors the top-left masthead in its own colors, which it has effectively never done on the shipped site. One committed grass-green accent at 112° carries the growth reading of "tomorrow" while clearing every forbidden hue zone, and ruled hairlines (`ground_material: rule`) do the specimen's layout work. A left-to-right `wipe` entrance reads as forward motion, and on-scroll reveal brings the index rows up as evidence as you read down.
