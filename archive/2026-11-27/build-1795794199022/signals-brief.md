# Signals Brief — 2026-11-27

## Hero Copy
Most golf apps are digital scorecards. This one is not.

## Hero Rationale
This is a line from Doug's own voice file, the way he positions 15th Club, and today the Hero World Challenge is on the schedule, so leading with his golf product is earned rather than decorative. It beats the Lao Tzu quote and the Lions loss because it is first-person, concrete, and about work Doug actually built, not a poster of somebody else. The second sentence is a flat correction, the kind of two-beat Doug uses, and it reads as a caption to the piece it describes. Owner's voice: I say this about 15th Club all the time; most golf apps are digital scorecards, mine isn't.

## Archetype
a didone product plate pinned to the right edge

## Composition
columns: two-asymmetric
axis: diagonal
symmetry: right-weighted
hero_zone: edge-bound
density: measured
rhythm: interrupted
shell_posture: footer-only
field_ratio: type-dominant
collapse: hero-only
hero_object: artifact

## Composition Rationale
The phrase is a caption to one owned product, so the work has to lead and dominate: I moved columns off the mandate's masonry to two-asymmetric (a wide artifact column, a narrow index), symmetry off symmetric to right-weighted so the title can carry the page, hero_zone off interleaved to edge-bound so "15th / Club" pins to the right edge like a label, and axis off radial to diagonal because the read runs from the stacked title down to its italic correction and across to the index. I kept measured, interrupted, footer-only, type-dominant, hero-only and artifact from the starting tuple because the quiet, confident register of the line wants even breathing room, a single caesura between its two sentences, and the work itself as the largest object.

## Mobile
carrier: The stacked "15th / Club" didone title and its lowercase italic caption carry the phone; the index becomes a stacked list beneath them.
first_fold: The 15th / Club stacked title with "most golf apps are digital scorecards. this one is not." as its italic caption (the hero phrase), mark top-left.
order: artifact (15th Club title + caption), deck, selected-work index, site callout, signal rail, footer colophon
hero_step_360: 2xl
nav_360: Header stays footer-only; the sentence-nav and music fold into a full-width spruce colophon at the foot; the mark-only lockup remains top-left of the hero.

## Chassis
dm-serif-public

## Visual Specification
### 1. Color Specification
- **Primary hue**: 162° spruce green. Golf is green, and the muted cyan-green range reads as considered rather than loud, which is the register of a product positioned against the default scorecard.
- **Neutral palette (pine, green-tinted 165°)**: 50 #EAF3EE · 100 #D3E6DB · 200 #ABCBB7 · 300 #80A991 · 400 #557E6B · 500 #3C5E4E · 600 #2A473A · 700 #1B3328 · 800 #11211A · 900 #0A140F
- **Accent color (green)**: light #5FD6A6 · default #35C28A · dark #17885D · glow #92E6C3
- **Secondary accent**: none. One green carries the page.
- **Background**: page bg #0A140F (pine.900), card/surface bg #1B3328 (pine.700), second ground band #11211A (pine.800)
- **Text colors**: primary #EAF3EE (pine.50), secondary #ABCBB7 (pine.200), muted/faint #80A991 (pine.300)

### 2. Typography
- **Hero phrase rendering**: Chassis `dm-serif-public`. The artifact title "15th / Club" is the largest element, stacked one word per line, roman, right-aligned, at the `hero` step (clamp ~110→150px). The hero phrase itself ("most golf apps are digital scorecards. this one is not.") sits one step down as the title's caption at the `3xl` step, set in display italic, lowercase, right-aligned. The h1 is the phrase.
- **Type treatment**: Steps named for role. `hero` for the stacked product title; `3xl` for the italic hero-phrase caption; `xl` for the deck; `lg` for the selected-work titles in the index; `base` for body and signal rows; `sm` and `2xs` for metadata and the footnote. Do not invent leading or tracking; the ramp carries it. Hold body measure at 60–68ch, leading 1.5–1.6.

### 3. Layout Specification
- **Composition**: two-asymmetric / diagonal / right-weighted / edge-bound / measured / interrupted / footer-only / type-dominant / hero-only / artifact. The wide right column is the artifact (15th Club, pinned to the right edge like a label); the narrow left column is the selected-work index and signal rail. The eye travels diagonally from the stacked title down to its italic caption and across to the quiet index.
- **CSS grid**: `display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.4fr); column-gap: 7vw;` The caesura (the interrupted rhythm) is the large gap between the index rows and the artifact, and the beat between the phrase's two sentences.
- **Major dimensions**:
  - Artifact/hero area: `min-height: 88vh`
  - No sidebar panel; the left index column is ~38% of content width
  - Max content width: `max-width: none; padding: 80px 6vw` (full-width canvas, not a centered column)
  - Section padding: vertical rhythm in multiples of the chassis base; ~96px between major sections at 1440
- **Nav placement**: footer-only. Nav lives in the green flood colophon at the foot. The circular mark (mark-only, ~48px) sits top-left of the hero field, inside the first fold.
- **Hero phrase grid zone**: artifact title occupies rows 1–3 of the right column, flush to the right edge (~110–150px tall stacked); the italic hero-phrase caption sits rows 4–5 of the right column at ~3xl.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the selected-work index section and above the footer colophon, full width of the content column. I place it and do not design it.

### 4. Component Character
- **Border radius**: cards 2px, buttons 2px, tags 2px. Near-square; premium editorial.
- **Border treatment**: hairline rules only, `border` token for row rules, `borderStrong` for the section break above the footer. Borderless cards; separation by value and rule, not boxes.
- **Shadow**: none. Depth comes from surface lightness on the dark ground, not shadow.
- **Density**: measured, spacious. Even breathing room.
- **Interactive states**: links underline in `accent` on `_hover`; index rows shift ink from textMuted to text on hover; no motion on hover beyond that.

### 5. Signal Integration
- **Where signals live**: the left index column and the footer colophon.
- **Golf (Hero World Challenge)**: a meta line directly under the artifact title: "Hero World Challenge. Field set, no card yet." Ties the product to today's tournament; stated factually.
- **Sports scores (Lions)**: in the signal rail, plain: "Lions lost 35–39." En dash inside the score only. Set at `base`, textMuted, no celebration.
- **Quote (Lao Tzu)**: a quiet footnote at the base of the signal rail, `sm`, textMuted, with the author's name visibly beneath: "If you correct your mind, the rest of your life will fall into place." then "Lao Tzu" at `2xs`. Not the hero.
- **Weather**: "Cloudy, 45°F, Aldie." in the rail at `sm`.
- **Market**: "SPY 716.70, down 0.3%." at `sm`, textFaint.
- **Moon**: "Waning gibbous, 85% lit." at `sm`, textFaint.
- **Music**: in the footer colophon, treated as taste not event: "On rotation: The War on Drugs, Guided by Voices."

## Self-Check
1. Hero quotability: Yes — a first-person two-beat correction that stands alone and reads as a product thesis.
2. Because-of chain: Yes — a considered contrarian line about a built product led to artifact-first two-asymmetric, a premium didone, a committed dusk-green void, and a right-edge label layout.
3. Render feasibility: Yes — dm-serif-public tops at 160px; the stacked two-word title at ~150px and the 3xl italic caption fit the right column at 1440 without overflow.
4. Canvas floor feasible: Yes — the index column, artifact, callout and footer colophon fill ~72% comfortably at measured density.
5. Phone: Yes — collapse hero-only puts the stacked title (4xl) and its 2xl italic caption in the first fold at 360 with no word cut.

## Rationale
The phrase is Doug's own positioning line for 15th Club, and the Hero World Challenge sitting on today's schedule makes leading with his golf product honest rather than opportunistic. Because the phrase is a caption to a built thing, the page is artifact-first: the product title is the largest object and the line sits beneath it as its correction. That decides everything downstream. The composition had to give the work a dominant column and the phrase a quiet caption slot, so two-asymmetric with the title pinned to the right edge, the selected-work index and signals held in a narrow left column, reading on a diagonal.

The chassis is dm-serif-public, a high-contrast didone that was the best type of its week when it last shipped and has not been used since. A fashion-editorial didone, lowercase and set in italic, says premium and considered, which is exactly the distance the line draws between 15th Club and a plain scorecard. Single weight is the chassis's only option and it is the right one here: the contrast is in the letterforms, not the weight. The treatment moves on every axis the mandate tracks, lowercase, italic-led, right-aligned, stacked title, so the typography carries real variance, not just a font swap.

The palette is a committed dusk-green void: a near-black green-tinted ground with one spruce green carrying the accent and flooding the footer colophon. Green is golf, and the muted cyan-green hue lands inside the color mandate and reads assured, which matches both the line and the Lao Tzu signal about a corrected mind. Dark-void is a formula off the recent list, and the single green flood at the foot gives the page its one saturated beat without hedging the dark field with neutrals. The mark sits top-left of the hero where the white disc carries it at full contrast, mark-only so the circle is the whole brand gesture today.
