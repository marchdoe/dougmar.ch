# Signals Brief — 2026-10-16

## Hero Copy
Do you want to know who you are? Don't ask. Act! Action will delineate and define you.

## Hero Rationale
This is today's `signals.quote` (Thomas Jefferson), and it carries the day without stylization: a question, a hard command, and a promise, which is exactly the shape of how Doug has built a career. He defines himself by what he shipped, not by what he claims, so the quote anchors a page where one real project and its client roster stand as the evidence of having acted. The attribution renders in the thesis panel beneath the line. Owner's voice: "Don't ask, act" is the ten-years-independent, build-the-thing, four-holes-in-one ethic Doug states plainly, the work is the answer, not the talking about it.

## Archetype
a thesis-and-evidence split: the imperative carved in a cream broadsheet, the work flooded on a terracotta ledger

## Composition
columns: two-equal
axis: vertical
symmetry: broken
hero_zone: edge-bound
density: measured
rhythm: interrupted
shell_posture: standard
field_ratio: balanced
collapse: split-to-sequence
hero_object: artifact

## Composition Rationale
The mandate's starting tuple already describes an artifact-led broadsheet split, which fits a quote whose own shape is thesis (the imperative) and evidence (the work), so I held most axes: two-equal with a broken symmetry lets the cropped SPACEMAN title become the primary focal point without surrendering the balanced thesis/evidence read. I moved `collapse` off the suggested `reorder` onto the discouraged `split-to-sequence` because a two-equal split collapses most faithfully to two sequential full-width fields; the quote field sits directly above the terracotta artifact field so the thesis-then-evidence argument survives by adjacency at 360. Everything else serves the phrase: the interrupted rhythm is the caesura after "Act!", the edge-bound crop is the title acting against its own frame.

## Mobile
carrier: The two panels become two full-width fields in sequence, the cream quote field first then the terracotta artifact field directly below, adjacency preserving thesis then evidence.
first_fold: The Jefferson quote (hero phrase) at `2xl` on the cream field, with "Thomas Jefferson" beneath it, inside the first 640px.
order: corner mark + nav, quote (thesis), SPACEMAN artifact + client ledger, site callout, footer colophon
hero_step_360: 2xl
nav_360: Stacked mark top-left; the running-sentence nav collapses to three small title-case labels in one row beneath the mark.

## Chassis
bitter-mulish

## Visual Specification
### 1. Color Specification
- **Primary hue**: 24° (clay terracotta). The mandate targets 15–40°, and this is the owner's benchmark hue (2026-04-28 drenched terracotta). Pushed to a cooler clay (24°) so it reads distinct from 10-14's ember-vermilion word-poster and 10-08's saffron; the split-field treatment and bitter slab make the register unmistakably its own.
- **Neutral palette (warm stone)**: 50 `#FAF6F1`, 100 `#F2EBE1`, 200 `#E4D8C8`, 300 `#CDBCA6`, 400 `#A28B72`, 500 `#786450`, 600 `#5E4D3C`, 700 `#44382B`, 800 `#2B2219`, 900 `#1A140D`
- **Accent color (terracotta)**: light `#D06C43`, default `#B5461F`, dark `#732B13`, glow `#D06C43`
- **Secondary accent**: none (single dominant hue)
- **Background**: page bg `#FAF6F1`, bgAlt band `#FBEEE7`, surface/card `#F2EBE1`, evidence field (flood) `#96391A`
- **Text colors**: primary `#1A140D`, secondary `#5E4D3C`, muted/faint `#786450`; on the terracotta field, ink `#FAF6F1`, muted ink `#F6DBCB`

### 2. Typography
- **Hero phrase rendering**: Bitter display, `3xl` on the thesis panel (the quote is the h1, one step down from marquee), set small-caps, justified, heavy. The word "Act!" takes the terracotta `accent` inside the otherwise dark line, tying the thesis to the evidence field. Attribution "Thomas Jefferson" sits beneath in `lede`/`md`, textMuted. The artifact title SPACEMAN is the marquee element, `hero` step, reversed to `fieldInk` on the terracotta field.
- **Type treatment**: `hero` for the SPACEMAN title; `3xl` for the quote; `lede` standfirst/role line; `base` for client roster rows and body; `sm` for the signal ledger; `xs` for micro labels. Spend the middle: role line and the ruled client rows carry the mid-register so the page is never "big title then tiny text."

### 3. Layout Specification
- **Composition**: two-equal / vertical / broken / edge-bound / measured / interrupted / standard / balanced / split-to-sequence / artifact. Two matched columns, but the broken symmetry (the SPACEMAN title cropping against the right edge and bleeding toward the gutter) makes the evidence panel the focal point, which is how an artifact leads inside a split.
- **CSS grid**: `display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh;` gutter `0` (the two grounds meet at a hard seam).
- **Major dimensions**: hero split `min-height: 100vh`; no sidebar; `max-width: none` with `padding: 72px 5vw` per panel; the interrupted caesura is a single oversized gap (~96px) between the quote and its attribution on the left, and between the title and the client ledger on the right.
- **Nav placement**: corner header, top-left of the cream thesis panel; nav as a short running sentence along the top edge to the right of the lockup.
- **Hero phrase grid zone**: left column, rows 1–2 (the quote block), ~44% viewport width, quote set at `3xl`; SPACEMAN title occupies right column upper band at `hero` scale.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the hero split and above the footer colophon, between the evidence/artifact section and the footer. Full width, in today's bgAlt `#FBEEE7`. No copy or styling authored here.

### 4. Component Character
- **Border radius**: cards/panels `none` (0), buttons/tags `sm` (2px). The owner dislikes rounded corners; keep edges square.
- **Border treatment**: bordered via hairlines; `border` for client-row rules on the cream side, `fieldBorder` (`#D06C43`) for ruled rows on the terracotta field, `borderStrong` for the footer rule.
- **Shadow**: none. Depth comes from the hard split seam and value, not shadow.
- **Density**: measured, generous caesura between groups.
- **Interactive states**: links underline on hover in `accent`; nav sentence words shift to `accent` on hover.

### 5. Signal Integration
- **Where signals live**: footer colophon block, a ruled typographic index under one `borderStrong` rule.
- **Sports**: Red Wings win 2–1 (Oct 15) gets the most character, set in `base` with the score in `accent`: "Red Wings take it, 2–1." Doug's team, a real result.
- **Quote**: the quote IS the hero phrase, h1 on the thesis panel, attribution in view.
- **Holiday**: none today.
- **Music**: "On rotation: The War on Drugs, My Morning Jacket, Radiohead" in `textFaint`, presented as taste, not an event.
- **Other signals**: golf (Butterfield Bermuda Championship, scheduled), SPY 771.79 up 0.28%, Aldie VA light rain 60.6°F, first-quarter moon 33%, sunrise 07:28 / sunset 18:22, all as ruled ledger rows in `sm`/`xs`.

## Self-Check
1. Hero quotability: Yes — a question, a command, and a promise; fully quotable in isolation with attribution.
2. Because-of chain: Yes — the imperative/evidence shape drove the split, the slab drove the declarative weight, terracotta drives the field of action, the artifact is the proof.
3. Render feasibility: Yes — bitter `3xl` quote fits a 44% column; SPACEMAN at `clamp(64px,9vw,128px)` clears below the 160px chassis ceiling.
4. Canvas floor feasible: Yes — a full-height two-panel split with a flooded terracotta column fills 75% easily.
5. Phone: Yes — split-to-sequence stacks the quote field first at `2xl`, no word cut inside 640px.

## Rationale
The phrase is Jefferson's: a question, a hard command, a promise. Its shape is thesis and evidence, so the composition is a split, two equal columns with a broken symmetry. The left column is the thesis (the imperative, carved in a cream broadsheet, "Act!" in terracotta), the right column is the evidence (Spaceman, Founder, 2018, and the client roster that action delineated). The artifact leads as the marquee object because the quote's own argument is that you prove who you are by what you did, not by what you say, which is also Doug's register exactly.

The chassis is bitter-mulish: a sturdy screen slab with real heavy cuts answered by a humanist body that shares its skeleton, declarative and grounded, built for broadsheet and split work. It gives the quote editorial weight at `3xl` and the SPACEMAN title marquee presence without tipping into the condensed-caps register that eight recent builds leaned on. Small-caps, justified, heavy, with "ACT" set colossal and faint as type-as-texture under the evidence panel: action is literally the field the work stands on.

The palette is clay terracotta at 24°, the owner's gold-standard hue and the mandate's target, committed across the flooded evidence panel while the cream thesis panel keeps the imperative legible. Split-field, not drench, so the page is two committed grounds meeting at a hard seam rather than one void. The original green-and-blue mark sits in the cream corner where a light ground finally gives it somewhere to live. Motion wipes the content in left to right, because a wipe is what delineates; everything else holds still.
