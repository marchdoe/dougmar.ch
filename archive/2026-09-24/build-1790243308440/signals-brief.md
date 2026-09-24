# Signals Brief — 2026-09-24

## Hero Copy
The quality of your commitments will determine the course of your life.

## Hero Rationale
`signals.quote` handed over a clean line from Ralph Marston about commitments setting the course of a life, and it carries because commitment is Doug's actual thesis: deep in both design and engineering, on purpose, ten years under one LLC, not a generalist. The last two builds both used the content-lifted lane, and the mandate says reach for the quote first; this one earns it rather than filling a slot. The word "commitments" pulls out as the poster object because it is the exact hinge between the stranger's sentence and Doug's own career of going deep instead of wide. Owner's voice: Doug bet his whole career on committing deep to two crafts instead of skimming ten, so a line that says the quality of your commitments sets your course is one he'd nod at and set on a wall.

## Archetype
reads like a type specimen ledger of one man's commitments

## Composition
columns: three
axis: vertical
symmetry: left-weighted
hero_zone: upper-left
density: crowded
rhythm: even
shell_posture: folded-into-hero
field_ratio: field-dominant
collapse: stack
hero_object: word

## Composition Rationale
I moved columns off the suggested `masonry` to `three` because a quote about the sum of one's commitments wants an orderly ledger of them, not a ragged packed edge, and three columns let the specimen rows align while the word spans full width. I moved symmetry off `mirrored` to `left-weighted` because the hero and every ruled row hang off one left rail, honoring the one-rail rule. Collapse moved off `hero-only` to `stack` so the crowded specimen keeps its 1440 order full-width on the phone; the rest sit on the mandate's suggestions because vertical reading, an upper-left word, crowded density, even rhythm, a folded header and a field-dominant cobalt band all genuinely serve this line.

## Mobile
carrier: the poster word "commitments" carries at 360, stacked full-width above the quote and the ruled commitment ledger.
first_fold: the stacked-lg mark, then the hero word "commitments" at 4xl, with the quote deck line beginning just beneath it.
order: mark and numbered nav, hero word commitments, quote deck and Ralph Marston, work index, home callout, signal cobalt band, footer
hero_step_360: 4xl
nav_360: lockup stays top-left, numbered links wrap to a two-line row beneath the mark

## Chassis
spectral-albert

## Visual Specification
### 1. Color Specification
- **Primary hue**: 215° cobalt. Blue reads as depth, trust, and duration, which is the tone of a line about commitments shaping a life; it also harmonizes with the blue in Doug's own green-and-blue mark so the original lockup sits at home on a pale ground.
- **Neutral palette** (cobalt-tinted cool slate): 50 `#f7f9fc`, 100 `#eef2f8`, 200 `#dde4ee`, 300 `#c3cddb`, 400 `#9aa7ba`, 500 `#6f7c90`, 600 `#515d6f`, 700 `#3b4453`, 800 `#262d38`, 900 `#171c24`
- **Accent color**: light `#4a7fd4`, default `#1f4fa8`, dark `#17356d`, glow `#85abe0`
- **Secondary accent**: none
- **Background**: page bg `#eef4fb` (faint cobalt sheet), card/surface bg `#f7f9fc` (near-white, reads raised by value), band/bgAlt `#d9e6f6`, deep field band `#17356d`
- **Text colors**: primary text `#171c24`, secondary text `#3b4453`, muted/faint `#515d6f`; on the cobalt field: ink `#eef4fb`, muted `#a9c4e8`

### 2. Typography
- **Hero phrase rendering**: `display` (Spectral). The single word **commitments** is set at the `5xl` step via `hero_scale` clamp(52px, 9vw, 120px), lowercase, italic, light cut, hanging off the left rail. The full quote sits beneath it as the deck at `lg`, and "Ralph Marston" is the caption at `sm` small caps directly under the quote so the attribution is always in view.
- **Type treatment**: `5xl` for the poster word; `lg` for the deck/quote line; `md` for section heads and standfirsts (spend the middle of the scale); `base` for body/ruled rows (60–70ch, leading 1.5–1.6); `sm` for attribution, roles and years; `xs` for micro labels. No size jumps from giant to body without the mid steps carrying section heads and the deck.

### 3. Layout Specification
- **Composition**: columns three, axis vertical, symmetry left-weighted, hero_zone upper-left, density crowded, rhythm even, shell folded-into-hero, field_ratio field-dominant, collapse stack, hero_object word. A quote about the sum of one's commitments earns density: the word leads upper-left, then Doug's real commitments (ten years of Spaceman, the client roster, seven projects, the day's signals) are cataloged in ruled rows across the three columns, a Klim-style specimen where every row is a commitment.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 3vw; row-gap: 48px`. The hero word spans `grid-column: 1 / -1`. Ruled rows below distribute across the three columns.
- **Major dimensions**:
  - Hero/word area: `min-height: 62vh`
  - Cobalt field band (signals): full width, `min-height: 44vh`, `padding: 72px 6vw`
  - Max content width: `max-width: none`; side padding `96px 6vw` at 1440
  - Section padding: 96px vertical between major zones; ruled rows tight at 18px row padding
- **Nav placement**: folded into the hero, upper-left, beneath the stacked lockup. No top bar.
- **Hero phrase grid zone**: rows 1–2, columns 1–3 (word spans full width, left-aligned off the rail); intended ~120px cap height at 1440, ~52px at 360.
- **Home callout slot**: on `/`, below the hero and the work index, above the footer, placed between the work index and the deep-cobalt signal band.

### 4. Component Character
- **Border radius**: cards/rows 0; chips/tags 2px (`sm`); buttons 2px. Sharp, ledger-like.
- **Border treatment**: borderless surfaces; hairline `border` (`#c3cddb`) rules separate rows; `borderStrong` (`#9aa7ba`) for section breaks; `fieldBorder` (`#2f5490`) inside the cobalt band.
- **Shadow**: none. Depth comes from value (surface brighter than bg), not shadow.
- **Density**: spacious around the word, tight and crowded through the ruled specimen rows.
- **Interactive states**: links shift to `accent` and gain a 1px underline on hover/focus; rows lift their year/role to full ink on hover.

### 5. Signal Integration
- **Where signal elements live**: the deep-cobalt field band, lower page, as ruled specimen rows in fieldInk.
- **Sports scores**: Tigers 2–4 loss stated flat in one row, tabular figures, no color celebration since it's a loss; Presidents Cup listed "Scheduled, no leaders yet" as one quiet row.
- **Quote**: it IS the hero. The word "commitments" is the poster object, the full quote is the deck, "Ralph Marston" the caption.
- **Holiday elements**: none today.
- **Music**: The War on Drugs and Radiohead named once as a taste footnote at the base of the band, set apart from the dated facts, never as an event.
- **Other signals**: SPY 767.81, down 0.72%, in tabular figures; Aldie overcast, 51°F, wind N 9mph; full moon, 97.6% illuminated; sunrise 07:06, sunset 18:57. Each a ruled row.

## Self-Check
1. Hero quotability: Yes — a standalone aphorism about commitments, quotable with attribution and screenshot-worthy.
2. Because-of chain: Yes — commitment theme drove the specimen-of-commitments layout, the reflective Spectral serif, the cobalt-depth palette, and the ruled ledger.
3. Render feasibility: Yes — Spectral `5xl` reaches 120px at 1440 for a single italic word without overflow.
4. Canvas floor feasible: Yes — crowded ruled specimen rows plus the cobalt band fill 82% comfortably.
5. Phone: Yes — "commitments" at `4xl` (~52px) is 11 characters near 286px inside a 320px column, fits the first fold without cutting.

## Rationale
The phrase is Marston's line, "The quality of your commitments will determine the course of your life." It wins the quote lane because commitment is not a borrowed abstraction here: it is Doug's literal thesis, deep in two crafts on purpose, ten years independent, not a generalist. The word "commitments" is the hinge between the stranger's sentence and Doug's own career, so the object on the page is that word, pulled to poster scale with the full quote as its deck and Ralph Marston named beneath it.

Because the line is about the sum of one's commitments, the composition is a specimen ledger of them: the word leads upper-left, then Doug's actual commitments, ten years of Spaceman, the client roster, seven projects, and the day's facts, are cataloged in ruled rows across three columns. That is why density is crowded rather than sparse, and why the ground material is `rule`. The chassis is spectral-albert, chosen off the three worn faces, because a reflective transitional serif that loads display italics carries a life-quote at a considered 120px without shouting; the light italic cut is elegance, not a slab, the right register for a line about the quality of a life.

The palette is a cobalt light-ground, fresh against the recent split-field, duotone and drench run, and it deviates from the 140–180° mandate on purpose. That range was spent two and three days ago (178°, 162°), and the repetition check demands at least 60° of separation from the recent window; 215° cobalt is the freshest committed hue that also harmonizes with the blue in Doug's own mark, which is why this is an honest day to bring the original green-and-blue lockup back at stacked-lg scale on a pale sheet, big and clear in the first fold. One deep-cobalt field band holds the signals so field-dominant reads true on a light ground, and the day's facts, the Tigers loss stated flat, the market down, the full moon, the music as taste, close the page as the final ruled rows of the same ledger.
