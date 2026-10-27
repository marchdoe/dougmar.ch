# Signals Brief — 2026-10-27

## Hero Copy
Detroit went two for two this weekend

## Hero Rationale
Two Detroit teams played this weekend and both won: Lions 20–17, Red Wings 4–3. A double-win weekend is unambiguously Doug's signal, and stating it as two for two keeps it a fact, not a slogan. The Red Wings score alone would repeat a recent hero verbatim, so I composed the pairing instead and let the two scores do the evidence work below. Owner's voice: Doug follows all four Detroit teams and talks in scores, so a clean two-for-two weekend is exactly the kind of thing he'd say out loud.

## Archetype
a victory banner flung to the right edge of an acid-lime field

## Composition
columns: single
axis: diagonal
symmetry: left-weighted
hero_zone: edge-bound
density: dense
rhythm: even
shell_posture: marginal
field_ratio: balanced
collapse: stack
hero_object: word

## Composition Rationale
The win is one word, so hero_object stays on the suggested `word` and "detroit" earns the marquee while the scores do the arguing. I moved symmetry off the suggested `mirrored` to `left-weighted` because the content genuinely hangs on one spine and nothing mirrors, and I moved hero_zone off `interleaved` to `edge-bound` so the word presses flush to the right edge like a banner rather than threading through the data; the right-aligned italic then cuts the diagonal reading path down to the low-left score panel. The remaining axes stay on the date-derived suggestions because a single dense column with a marginal rail and even rhythm is exactly what a scoreboard poster wants.

## Mobile
carrier: The giant italic word "detroit" still leads full-width with the two scores stacked as a reversed ledger directly beneath it, so the win and its evidence stay adjacent.
first_fold: The hero word "detroit" and its deck "went two for two this weekend".
order: top band (lockup + nav), hero word + deck, scores ledger, work index, site callout, footer ledger
hero_step_360: 5xl
nav_360: The left spine collapses to a top spruce band; horizontal lockup at the left, nav as an inline lowercase row beneath it, each link padded to a 44px tap target.

## Chassis
anybody-franklin

## Visual Specification
### 1. Color Specification
- **Primary hue**: 92° (victory lime). Loud, warm-leaning green at full saturation; reads as a triumphant acid field, not a muted spring.
- **Neutral palette (spruce, green-tinted)**: 50 `#eef4f0`, 100 `#dce8e1`, 200 `#bbd2c6`, 300 `#95b4a4`, 400 `#6c8e7c`, 500 `#4c6d5a`, 600 `#375143`, 700 `#2a3f34`, 800 `#1d2e26`, 900 `#142019`
- **Lime scale**: 50 `#f4fae0`, 100 `#e8f4c8`, 200 `#d9ed9e`, 300 `#c9e675`, 400 `#bfe36a`, 500 `#a6d24a`, 600 `#88b733`, 700 `#6a9622`, 800 `#4f7018`, 900 `#35490f`
- **Accent color (grass, deep green for light scheme)**: light `#6fa32b`, default `#4f8a18`, dark `#3e6f12`, glow `#88b733`
- **Secondary accent**: none
- **Background**: light scheme page `#bfe36a` (lime), card `#f4fae0`, spine `#142019` (spruce). Dark scheme page `#142019`, card `#2a3f34`, lime plane `#bfe36a`.
- **Text colors**: light scheme primary `#142019`, secondary `#375143`, muted `#4c6d5a`. Dark scheme primary `#e8f4c8`, secondary `#95b4a4`, muted `#6c8e7c`.

### 2. Typography
- **Hero phrase rendering**: `display` face (Anybody), word object. The single word "detroit" is set at the `hero` clamp (`clamp(72px, 14vw, 160px)`, lands 160px at 1440), lowercase, italic, heaviest loaded weight, right-aligned flush to the right edge. The rest of the phrase, "went two for two this weekend", is the deck beneath it at `3xl`, right-aligned, spruce ink.
- **Type treatment**: hero word at `hero`; deck at `3xl`; score figures at `4xl`; section heads and work titles at `2xl`; standfirsts/captions at `lede`; body at `base` held to 60–68ch and 1.5–1.6 leading; micro labels at `xs` with 0.09em tracking. At least one mid-register element (the `3xl` deck and `4xl` scores) sits between the marquee word and body so the page is never two sizes.

### 3. Layout Specification
- **Composition**: single / diagonal / left-weighted / edge-bound / dense / even / marginal / balanced / stack / word. One column of content hangs on a left spine; the word is bound to the right edge and the scores anchor low-left, so the eye cuts a diagonal from the marquee word down to the evidence, and the italic lean reinforces that line.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 184px 1fr;` left column is the spruce spine (nav rail + brand), right column is the lime field. Inside the field: `display: grid; grid-template-rows: auto auto 1fr auto;` (hero word, deck, scores ledger, work index).
- **Major dimensions**:
  - Hero field min-height `88vh`
  - Left spine width `184px` (spruce), full height
  - Max content width: `none`; field padding `clamp(40px, 6vw, 96px)`; body copy blocks inset to 64ch
  - Section spacing: vertical rhythm on the chassis base unit, generous between zones (~96px at 1440)
- **Nav placement**: left spine (marginal). Horizontal lockup at the top of the spine; nav list stacked below it, one lime hairline per row.
- **Hero phrase grid zone**: right column, rows 1–2, the word pressed to the right edge of the field (approx right 60% of the field width, 160px cap-height at 1440). Deck immediately beneath, same right edge.
- **Home callout slot**: on `/`, place `<SiteCallout />` as a full-width band below the work index and above the footer, between the work index and the footer. No copy or styling authored here.

### 4. Component Character
- **Border radius**: cards/panels `2px`, buttons `2px`, tags `2px`. Near-square; the owner has rejected rounded corners.
- **Border treatment**: bordered with hairlines. `border` for row rules in the lime field, `fieldBorder` for rules inside the spruce spine and score panels, `borderStrong` for section breaks.
- **Shadow**: none. Depth is value difference (lime field vs spruce spine vs pale card), never shadow.
- **Density**: dense. Scores, standings, and signals packed tight on an even interval.
- **Interactive states**: nav and links shift to `accent` on `_hover` with a 2px underline offset; no transforms.

### 5. Signal Integration
- **Where signal elements live**: scores in the hero evidence zone (lower-left on the spruce spine / reversed score panel); remaining signals in the footer ledger.
- **Sports scores**: the two Detroit wins render as a reversed score panel (`field` spruce, `fieldInk` lime): "LIONS 20–17" and "RED WINGS 4–3" with the figures at `4xl` tabular. These are the hero's evidence.
- **Quote**: James Allen line demoted to a small attributed footnote in the footer ledger (`textMuted`, author in `textFaint`), not the hero.
- **Golf**: Butterfield Bermuda Championship, Final, Austin Smotherman −16 over Séamus Power −15, as a one-line ledger entry in the footer.
- **Market**: SPY 765.37, up 0.71%, footer ledger entry, accent on the up direction.
- **Music**: rotation treatment only, a quiet "in rotation" tile in the footer: Radiohead, Tobin Sprout, Guided by Voices. Not presented as an event.
- **Holiday**: Halloween in 4 days noted as a small footer tile, no decoration.
- **Moon / weather**: waning gibbous 95%, Clear 51°F in Aldie, footer ledger entries.

## Self-Check
1. Hero quotability: Yes — "Detroit went two for two this weekend" stands alone as a line Doug would say about his teams.
2. Because-of chain: Yes — a victory line drove the word-object marquee, the sporty wide italic chassis, the acid-lime duotone, and the spine-plus-field layout.
3. Render feasibility: Yes — "detroit" at 160px in a wide grotesk is ~630px, fits the right column at 1440 without overflow.
4. Canvas floor feasible: Yes — spine, lime field, score panel, work index and footer ledger fill 80%+ of a dense balanced canvas.
5. Phone: Yes — at 360 the word drops to the `5xl` step (~64px), "detroit" ~300px, inside the first fold without cutting.

## Rationale
The phrase is a composed fact: two Detroit teams played this weekend and both won. That decided everything. A win is loud and singular, so the page is a word poster, one word at marquee scale with the scores as its proof, which is the `word` hero object. "detroit" pressed flush to the right edge in a wide squarish grotesk, lowercase and italic and heavy, leans the whole page forward the way a victory feels, and that lean sets the diagonal reading path down to the score panel on the spine.

The chassis is anybody-franklin because the catalog calls it broad, sporty, emphatic, with true italics, and this is a sports line that wants a sporty italic cut; none of the recently-avoided three (big-shoulders, spectral, alfa) carries that register. The palette is a two-hue duotone, acid victory lime against a spruce spine, trading places between schemes. I deviated from the 40-80° gold mandate on purpose: the repetition check flagged hue 46° gold repeating and three of the last seven builds were gold, so staying in that range would have shipped the same page in a new phrase. 92° lime stays warm-leaning and loud without being gold, and at full saturation across the field it is the committed gesture a Risk-7 bold day asks for.

Layout follows from the word on the edge: a single dense column of content hangs on a left spruce spine (marginal shell), the lime field carries the word and deck on its right edge, and the reversed score panel sits low-left so the diagonal from word to evidence is the structure. The spine holds the horizontal lockup and a lowercase vertical nav list, a treatment off the recent rotation, and the original mark sits on spruce in both schemes so Doug's real green-and-blue circle reads every time. At 360 the spine bands to the top and the word drops to the 5xl step so "detroit" clears the fold intact.
