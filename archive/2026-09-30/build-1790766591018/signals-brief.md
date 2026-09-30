# Signals Brief — 2026-09-30

## Hero Copy
Design and engineering as one job, not two teams passing files.

## Hero Rationale
There is no `signals.quote` in today's data, so the quote lane has nothing to draw on; I lifted this line straight from Doug's own voice memory, where it sits as his clearest statement of who he is. It carries the day because the whole page is one artifact, Spaceman, the ten-year practice where design and engineering genuinely are one job, and the line captions that work without a word of hype. The client roster (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) is the evidence the line is standing on. Owner's voice: Doug says design and engineering are one job all the time, it is the thing he has built ten years around and the reason he says he is deep in both.

## Archetype
a founder's specimen sheet, reversed out of the fog

## Composition
columns: irregular-twelve
axis: diagonal
symmetry: right-weighted
hero_zone: full-bleed
density: dense
rhythm: syncopated
shell_posture: footer-only
field_ratio: drenched
collapse: reorder
hero_object: artifact

## Composition Rationale
I kept the mandate's starting artifact, twelve-column, diagonal, full-bleed, dense, syncopated, footer-only tuple because a claim about a body of work wants that work shown as evidence on a specimen grid. I moved `symmetry` off `mirrored` to `right-weighted`: one artifact with a hanging roster is a weighted mass with a reading path, not a reflection, and the weight gives the diagonal a place to land. I moved `field_ratio` off `balanced` to `drenched` because the mist is total, so the teal field has to be total, with every line reversed out of it, which is the gold-standard specimen model from 2026-04-28.

## Mobile
carrier: At 360 the diagonal is gone; a single flush-right column carries it, Spaceman large, then the phrase caption stacked beneath, then the five roster names as full-width hairline rows.
first_fold: The mark top-left, the marquee title Spaceman, and the hero caption "Design and engineering as one job, not two teams passing files" set at 3xl, all inside the first 640px.
order: mark, hero (Spaceman title + phrase caption), client roster, site callout, signals foot band, foot nav
hero_step_360: 3xl
nav_360: Mark stays top-left of the hero; the numbered index stacks 01/02/03 full-width at the foot with the signals line beneath.

## Chassis
hanken-solo

## Visual Specification
### 1. Color Specification
- **Primary hue**: 188° (fog teal). Chosen because today's signal is Mist, 58°F, 96% humidity in Aldie, a cold cyan morning, not a green one. It sits just outside the mandate's 140–180 target, deliberately: the last three builds saturated the 148–166 green band and the repetition check flagged the 4° collision with 09-25, so I pushed into true cyan-teal where the fog actually lives, perceptually clear of the recent greens.
- **Neutral palette** (teal-tinted): 50 `#f3f8f7`, 100 `#e4efee`, 200 `#c8dad9`, 300 `#a3bab9`, 400 `#758c8b`, 500 `#526462`, 600 `#3d4d4b`, 700 `#2c3937`, 800 `#1d2827`, 900 `#101817`
- **Accent color** (lit amber): light `#eebf4e`, default `#e5a92a`, dark `#c78a17`, glow `#f5d585`
- **Secondary accent**: the amber above IS the single turned-on color; no third hue. Used only for the roster numerals, one hairline and the mark's warmth against cold.
- **Background**: page bg `#0d434a` (teal 800, the drench ground), card/surface `#10555c` (teal 700), band/bgAlt `#0a373d` (teal 850), deep field `#082e34` (teal 900)
- **Text colors**: primary `#eafaf9` (teal 50), secondary `#9fe0dd` (teal 200), muted/faint `#6bc8c6` (teal 300)

### 2. Typography
- **Hero phrase rendering**: `display` (Hanken Grotesk). The artifact object leads, so the project title **Spaceman** takes the marquee at `5xl` (`hero_scale` clamp, up to 152px at 1440), and the hero phrase, the one h1, sits beneath it as its caption at `4xl` stepping to `3xl`. One family carries display and body both, which is the point: one skeleton doing two jobs is the thesis rendered as type.
- **Type treatment**: `5xl` for the marquee title; `4xl`/`3xl` for the phrase caption; `xl`/`lg` for the client roster names (the middle of the scale, so the page is never a big title over tiny text); `sm` for "Founder · 2018" and roster numerals; `base` for the deck and foot copy; `xs` never below the 14px floor. Hanken's own leading and tracking per step; no invented values.

### 3. Layout Specification
- **Composition**: irregular-twelve / diagonal / right-weighted / full-bleed / dense / syncopated / footer-only / drenched / reorder / artifact. A single owned piece leads across a twelve-unit grid whose spans change per row, the reading path cutting from the mark upper-left down to the roster foot lower-right; the artifact's mass is weighted right so the diagonal has somewhere to land. This serves the phrase because the phrase is a claim about a body of work, so the work (Spaceman + its roster) has to be the evidence in view while the line captions it.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto;` marquee title spans cols 4–12 right-aligned; phrase caption spans cols 6–12; roster spans cols 7–12 as stacked hairline rows; mark pinned cols 1–3 row 1.
- **Major dimensions**:
  - Hero/artifact spread: `min-height: 100vh`
  - No fixed sidebar; the roster is a right-hanging column, not a rail
  - Max content width: `max-width: none`, side padding `padding: 88px 6vw`
  - Section padding: vertical rhythm on Hanken's base unit, roughly 24px multiples; roster rows 1.5 units apart
- **Nav placement**: deferred to a foot band (footer-only), full width, height ~88px at 1440. Numbered index right-aligned.
- **Hero phrase grid zone**: the marquee title occupies rows 1–2, cols 4–12; the phrase caption (h1) rows 3–4, cols 6–12, rendered at ~clamp(34px, 4.5vw, 62px).
- **Home callout slot**: on `/`, below the artifact/roster spread and above the foot nav band, sitting between the client roster section and the footer. Placed, not designed or written by me.

### 4. Component Character
- **Border radius**: cards 2px, buttons 2px, tags 0. Sharp; the owner has rejected rounded corners.
- **Border treatment**: hairline `border` (`#146a70`) between roster rows; `borderStrong` (`#3ba7a8`) for the single rule above the foot band; `fieldBorder` (`#1f8589`) inside the deep field.
- **Shadow**: none. Depth comes from value (surface teal 700 vs bg teal 800), not shadow.
- **Density**: dense, information-forward specimen.
- **Interactive states**: `_hover` lifts a roster row's numeral to amber and its name to full `text`; links underline on hover only.

### 5. Signal Integration
- **Where signal elements live**: the weather is expressed as the palette itself (the fog teal), and the remaining signals sit as one muted line in the foot band, not a scoreboard, because nothing happened in sport today (all Detroit teams off-season).
- **Sports scores**: none shown. Off-season is off-season; a fabricated score would be dishonest.
- **Quote**: no quote today; the hero is a content-lifted line, so no blockquote treatment.
- **Holiday elements**: none today.
- **Music**: `signals.music` treated as taste, one muted foot line: "In rotation: Radiohead, Guided by Voices, Wet Leg." Never presented as an event.
- **Every signal**: Weather → the fog-teal drench plus "Aldie, Virginia. Mist, 58°F, wind 2 mph." Market → "SPY 764.20, down 0.18%." Moon → "Waning gibbous, 78% lit." Music → the rotation line above. All in `textMuted`/`textFaint` at the foot under a single `borderStrong` rule.

## Self-Check
1. Hero quotability: Yes — "Design and engineering as one job, not two teams passing files" is a standalone claim, quotable without the page around it.
2. Because-of chain: Yes — the phrase is a claim about work, so an artifact leads (composition), a single-family grotesk renders one-job-one-skeleton (chassis), a cold-fog drench renders the morning (palette), and the roster becomes the evidence (layout).
3. Render feasibility: Yes — Hanken sets Spaceman at 152px (under its 160px 5xl ceiling) and the phrase at ~62px, both fit at 1440 without overflow.
4. Canvas floor feasible: Yes — a dense drenched specimen with a five-row roster and foot band fills 82% comfortably.
5. Phone: Yes — at 360 the artifact reorders to lead, Spaceman marquee with the phrase caption at 3xl inside the first fold, no word cut.

## Rationale
The phrase is Doug's plainest self-definition, "Design and engineering as one job, not two teams passing files," and there was no quote in today's signals to weigh it against. Because it is a claim about a practice, the page cannot be a poster of the sentence alone; it has to show the practice. So the object is an artifact: Spaceman, Founder, 2018, with its real client roster (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) surfaced as tabular evidence, which is exactly what the owner asked for after 09-01 buried that roster mid-sentence. The line becomes the caption on the work rather than a slogan floating over it.

The chassis is Hanken Grotesk alone, one humanist family running display and body both. That is the thesis rendered in type: one skeleton doing two jobs, the way one person does design and engineering. It also settles the standing complaint that display and body must share a skeleton, since here they are literally the same family. The composition is a twelve-column specimen read on a diagonal from the mark upper-left down to the roster foot, weighted right so the artifact has mass, dense and syncopated so the roster rows never align the same way.

The palette is the morning itself: Mist, 58°F, 96% humidity, a cold cyan fog, drenched across the whole field at 188° so the type reverses out of it the way the benchmark terracotta specimen did. I pushed off the recent 148–166 greens into true teal-cyan because the repetition check flagged a 4° collision and because cyan, not green, is what fog reads as. One warm amber is the single light turned on in the cold, carrying the roster numerals and the mark. Halftone, not a soft bloom, gives the field its texture, because the owner has twice graded down gradient-blob grounds as an AI tell; a printed dot screen keeps the specimen honest.
