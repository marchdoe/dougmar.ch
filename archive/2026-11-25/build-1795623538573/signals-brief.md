# Signals Brief — 2026-11-25

## Hero Copy
The Pistons held them to 86.

## Hero Rationale
Of everything in today's data, one thing actually happened: the Detroit Pistons won 104–86, and they won it on defense, holding the other side to 86. That's the Detroit signal and it's unambiguously Doug's, a score, not a slogan. The frame "held them to 86" is the fan's read of a grind-it-out defensive night, which is what the number says. Yesterday was also composed, but the only unambiguous "today" fact is this Pistons result, and stating it in Doug's defensive-fan register means composing the caption rather than lifting a line.
Owner's voice: Doug pulls for the Pistons and a score is a score; a win built on stops is exactly the kind of thing he'd note in a sentence with the number in it.

## Archetype
a sports-page broadsheet front, the score set as the masthead

## Composition
columns: three
axis: vertical
symmetry: left-weighted
hero_zone: upper-left
density: crowded
rhythm: even
shell_posture: marginal
field_ratio: balanced
collapse: rail-to-band
hero_object: figure

## Composition Rationale
The score is a figure, so it leads as a masthead and the day's signals read as a front page beneath it; that wants three even columns top-down. I moved axis off the suggested radial to vertical because a broadsheet descends from headline to columns, not from a center point; moved symmetry to left-weighted so everything hangs off one left rail (the owner's standing rule) with the nav spine anchoring that weight; and moved hero_zone to upper-left so the score sits where a front-page headline sits rather than threaded through the body. Density, rhythm, shell, field_ratio and collapse hold on the suggested values because a crowded, even, marginal, balanced, rail-to-band front page is exactly what this figure wants.

## Mobile
carrier: At 360 the oversized score stays the masthead, the left spine becomes a full-width ruled nav band under the caption, and the three columns stack into one column of ruled signal rows.
first_fold: The score 104–86 at 5xl and its caption "The Pistons held them to 86." sit inside the first 640px.
order: score, caption, nav band, deck, signals, site-callout, footer
hero_step_360: 5xl
nav_360: The left spine collapses to a full-width small-caps band (Work / About / Contact) beneath the caption; the horizontal-md lockup sits top-left above the score.

## Chassis
bitter-mulish

## Visual Specification
### 1. Color Specification
- **Primary hue**: 350° (Detroit red). Deviates from the 140–180° target, which itself sits inside its own forbidden zone (122–260°); the recent window is saturated with greens/teals/blues (152, 158, 187, 230), so I chose the hue maximally far from that cluster, and a Pistons defensive win calls for committed Detroit red.
- **Neutral palette (newsprint bone, warm-tinted toward red-brown)**: 50 `#FBF6EF`, 100 `#F4EDE4`, 200 `#ECE2D5`, 300 `#DCD2C4`, 400 `#C3B7A6`, 500 `#9A8E80`, 600 `#6B6155`, 700 `#534A42`, 800 `#332B26`, 900 `#1E1815`
- **Accent color (crimson ramp)**: light/glow `#E34D63`, default `#C8102E`, dark `#560713`, second register (accentAlt) `#7E0A1C`
- **Secondary accent**: none. One red carries the page.
- **Background**: page bg `#F4EDE4`, card/surface `#FBF6EF`, second ground / band `#ECE2D5`
- **Text colors**: primary text `#1E1815`, secondary text `#534A42`, muted/faint `#6B6155`
- **Flooded footer field**: field `#C8102E`, ink on field `#FBF6EF`, muted ink on field `#F9D4DA`, rule on field `#F3A9B5`

### 2. Typography
- **Hero phrase rendering**: The figure is the Pistons score `104–86`, set in Bitter heavy numerals in accent red `#C8102E`, scaled to the chassis ceiling via the `5xl` register (clamp up to ~158px at 1440). The hero phrase itself, "The Pistons held them to 86.", is the caption one step down at `3xl`, small-caps, in text ink. The score is justified across the hero block (left two columns): 104 flush to the block's left edge, 86 to its right, the en dash tensioned between them.
- **Type treatment**: steps as textStyle tokens. Figure `5xl`; caption/h1 `3xl` small-caps heavy; deck/standfirst `xl`; column heads `md` small-caps; body `base` at 1.5 leading, 62–66ch; signal labels `sm` small-caps; metadata `xs`. Spend the middle: every column carries a `md` head above `base` prose so nothing jumps from marquee straight to caption.

### 3. Layout Specification
- **Composition**: three / vertical / left-weighted / upper-left / crowded / even / marginal / balanced / rail-to-band / figure. A broadsheet sports front: the score is the masthead object top-left, three even columns of the day's signals read top-down beneath it, nav lives in a left spine rail. Crowded, packed to the edge like a front page, which is honest for a day this full of signals.
- **CSS grid/flex structure**: outer `display: grid; grid-template-columns: 96px 1fr; ` (left rail + body). Body: `display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 40px; row-gap: 32px`. Score zone spans body columns 1–2 in the top rows.
- **Major dimensions**:
  - Hero/score band: `min-height: 56vh`
  - Left rail: `width: 96px` fixed
  - Max content width: `max-width: none`; `padding: 64px 5vw 0`
  - Section padding: `padding-block: 40px`; hairline rules (`border`) between column rows
- **Nav placement**: left spine rail, 96px, full height; horizontal-md lockup at its top, vertical index below.
- **Hero phrase grid zone**: score occupies body rows 1–3, columns 1–2 (justified across that width); caption sits rows 4, columns 1–2; deck row 5 column 1.
- **Home callout slot**: on `/`, `<SiteCallout />` sits below the three-column signal section and above the flooded-red footer band, full body width.

### 4. Component Character
- **Border radius**: cards 3px, buttons/tags 2px, score and rules square (0). Broadsheet sharpness.
- **Border treatment**: bordered with hairlines, `border` `#DCD2C4` between rows, `borderStrong` `#332B26` for the rule under the masthead and above the footer.
- **Shadow**: none. Depth comes from value and rules, not shadow.
- **Density**: crowded, newspaper-tight columns.
- **Interactive states**: links underline in accent on hover; nav rows shift ink to accent on hover.

### 5. Signal Integration
- **Where signal elements live**: three body columns beneath the score masthead; identity + music in the flooded footer band.
- **Sports scores**: `104–86` is the hero figure at poster scale, accent red, justified masthead. Caption states the read.
- **Quote**: none today.
- **Holiday**: "Thanksgiving tomorrow." set as a dateline kicker at the top of column 1, `md` small-caps.
- **Music**: taste, not an event. "On rotation: Guided by Voices, Wet Leg." reversed out of the red footer band in `fieldInkMuted`, never beside a score.
- **Every signal**: col 1 Thanksgiving dateline + full moon ("Full moon, 97% lit."); col 2 weather ("Overcast, 39°, dark by 4:44.") + daylight 9.6h; col 3 market ("SPY 718.78, down 0.49%.") + golf ("Hero World Challenge tees off, no leaders yet."). AQI/UV as a single faint metadata line under the rail.

## Self-Check
1. Hero quotability: Yes — "The Pistons held them to 86." stands alone as a fan's one-line read of a defensive win.
2. Because-of chain: Yes — figure object (score) → broadsheet masthead composition → sturdy Bitter slab → Detroit red on bone → left-rail front page.
3. Render feasibility: Yes — Bitter's `5xl` reaches 160px at 1440; `104–86` is five glyphs, fits the two-column block without overflow.
4. Canvas floor feasible: Yes — a crowded three-column front page with a masthead figure fills well past 82%.
5. Phone: Yes — `104–86` at `5xl` plus the caption land inside the first 640px at 360 without cutting.

## Rationale
The phrase is a Detroit result: "The Pistons held them to 86." That decides the object first. A score is a figure, so the number `104–86` is the largest thing on the page and the phrase is its caption one step down. A figure that size wants a masthead, and a masthead over a day this full of signals wants a front page, which is why the composition is a three-column broadsheet weighted to a single left rail with the score upper-left and the day's facts packed into even columns beneath it.

The chassis follows from the register of the win: a grind-it-out defensive night, not a shootout. Bitter is a sturdy screen slab with real heavy cuts and strong tabular numerals, grounded rather than loud, which is right for a win built on stops; its `5xl` reaches 160px so the score carries at genuine poster scale. It is not one of the three recently-overused faces, and it holds small-caps and a mid-register head, so I can spend the middle of the scale the way the owner asked. The type is set small-caps, heavy, justified across the hero block, with the oversized score functioning as the field's type-as-texture, all moves off the recently-worn defaults.

The palette amplifies the phrase: Detroit red at full saturation on warm newsprint bone, with a flooded-red footer band so the red is load-bearing, not a garnish. I left the green target range because it sits inside its own forbidden zone and the last two weeks are a wall of greens, teals and blues; a Pistons win is Detroit red, and 350° is the hue furthest from the recent cluster. Film grain gives the bone ground a printed-sports-page register without any banned pattern. The score settles in, the columns reveal on scroll, and at 360 the left spine becomes a full-width nav band with the score still leading.
