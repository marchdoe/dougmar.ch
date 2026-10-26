# Signals Brief — 2026-10-26

## Hero Copy
Deep in both. Not a generalist.

## Hero Rationale
Lifted from Doug's own voice file, the "Lines I would say" list, where it sits unused. It carries today because the work index is leading the page, and this line is the exact claim the index proves: founder, SaaS, AI, experiments, spanning design and engineering both. The line sets the thesis; the titles underneath are the evidence. It beats the Columbus quote because it is Doug's claim about his own practice, not a stranger's aphorism about discovery.
Owner's voice: he wrote it himself, two short sentences, concrete, no hype, a claim he stands behind.

## Archetype
a foundry specimen of the work, thesis reversed out of an umber masthead

## Composition
columns: masonry
axis: horizontal
symmetry: symmetric
hero_zone: full-bleed
density: crowded
rhythm: accelerating
shell_posture: none
field_ratio: type-dominant
collapse: reorder
hero_object: list

## Composition Rationale
The claim "deep in both" is proved by the catalog, so the work index leads (list) and the phrase is its standfirst. I moved hero_zone off the suggested `lower-third` to `full-bleed` because a standfirst belongs at the top as a band over the index, not low on the page. I moved collapse off `split-to-sequence` to `reorder` because there is no split field to sequence; a masonry linearizes to a single column at 360 with the featured project pulled ahead to lead the index. Masonry, horizontal, symmetric, crowded, accelerating, none and type-dominant stayed on the suggestions because a packed, ragged-edge specimen that navigates through its own titles is exactly what a work-index-first page wants.

## Mobile
carrier: The two grounds stack as full-width bands, umber masthead over the paper index, and the project titles stay at marquee so the list still leads.
first_fold: The umber masthead with the mark top-left and the standfirst "Deep in both. Not a generalist." justified across it.
order: masthead (mark + standfirst), work index (Spaceman first), work/about/contact list, site callout, signal colophon
hero_step_360: 3xl
nav_360: Mark stays top-left of the masthead; nav collapses to the stacked small-caps work/about/contact list below the index, each row a 44px tap target.

## Chassis
big-shoulders-atkinson

## Visual Specification
**1. Color Specification**
- Primary hue: 46° brass gold. Warm, structural, closer to machined brass than trophy amber, which suits an engineering-and-design claim and the cold clear night (muted saturation, not a sunny flood). Inside the 40-80° target; I pulled saturation down and lightness to the mid so it reads as oiled metal, not marigold, which separates it from the recent 34/46/52 warm floods that were all bright single-hue drenches. This is a two-ground split-field, a different formula entirely.
- Neutral palette (umber, warm-tinted): 50 `#f9f5ec`, 100 `#f0e9d8`, 200 `#e0d4ba`, 300 `#c5b291`, 400 `#a08a63`, 500 `#7c6844`, 600 `#5e4e31`, 700 `#443820`, 800 `#2d2615`, 900 `#1b1710`
- Accent (brass): light `#ddb954`, default `#cda235`, dark `#96691f`, glow `#ecd389`
- Secondary accent: none
- Background: page bg (base/light) `#f9f5ec`, (dark) `#2d2615`; card/surface `#ffffff` (dark `#443820`); masthead field `#1b1710` both schemes
- Text colors: primary `#1b1710` (dark `#f9f5ec`), secondary `#5e4e31` (dark `#e0d4ba`), muted/faint `#7c6844` (dark `#c5b291`)

**2. Typography**
- Hero phrase rendering: the standfirst "Deep in both. Not a generalist." is set in the `display` face (Big Shoulders) at ramp step `4xl`, small-caps, reversed brass-paper out of the umber masthead field, justified edge to edge across the full-bleed band. It is NOT the biggest element: hero_object is `list`, so the phrase steps down and the work index carries marquee.
- Type treatment: project titles (SPACEMAN, FISHSTICKS, 15TH CLUB, TEETURN, POLITWEETS, TWITTERTALE) set at the `hero` step as the page's marquee, stacked one word per line in the masonry blocks. Years and roles in Atkinson at `sm`/`base` for the index metadata (the mid-register the owner asked for lives here: standfirst at 4xl, a `lg` section rule label, titles at hero, metadata at base). Body/colophon in Atkinson `base`, muted ink, measure held ≤66ch. Small-caps throughout the display register; Atkinson stays mixed case for reading copy.

**3. Layout Specification**
- Composition: masonry / horizontal / symmetric / full-bleed / crowded / accelerating / none / type-dominant / reorder / list. The work index leads as a packed masonry of differing-height blocks with a ragged bottom edge; the phrase is the full-width standfirst band above it. The index earns marquee because the line's proof is the list.
- CSS structure: masthead `display:flex; justify-content:space-between` full-bleed band. Index `display:grid; grid-template-columns: repeat(3, 1fr); grid-auto-flow: dense;` with blocks of varied row-spans (masonry via spanned rows), alternating paper and umber grounds.
- Major dimensions: masthead `min-height: 34vh`; index fills to a ragged bottom, `min-height: 66vh`; `max-width: none`; side padding `clamp(24px, 6vw, 96px)`; masthead vertical padding `48px`.
- Nav placement: none. Mark top-left of the umber masthead. The project titles ARE the nav to the work; work / about / contact stack as a small-caps index with one brass hairline per row at the foot of the masonry.
- Hero phrase grid zone: masthead band, full width, rows 1 of the page, roughly 34vh tall; standfirst justified across it at ~56px cap.
- Home callout slot: `<SiteCallout />` sits below the masonry work index and above the footer colophon, between the index and the signal strip, full width in bgAlt.

**4. Component Character**
- Border radius: cards/blocks 0 (`none`), tags 2px (`sm`), only `full` on the fixed circular mark. Sharp specimen, no rounded chrome.
- Border treatment: bordered with hairlines, `border` on index blocks, `borderStrong` on the masthead-to-index break and the section rule; `fieldBorder` inside the umber masthead.
- Shadow: none. Depth comes from the two grounds, not shadow.
- Density: crowded, packed to the ragged edge, treated as texture.
- Interactive states: on `_hover` a project block's title shifts to accent and its hairline thickens to borderStrong; no motion beyond color.

**5. Signal Integration**
- Signals live in a footer colophon strip under one borderStrong rule, tabular figures.
- Golf: Butterfield Bermuda, "Smotherman and Power, -16" with the score in brass, tabular-nums.
- Detroit: "Lions 20-17. Pistons 106-93." both wins, brass scores, in the colophon.
- World Series: "Brewers lead 2-0" as a news line, muted.
- Market: "SPY 759.97, down 0.52%" in textFaint, no celebration (it fell).
- Music: "In rotation: The War on Drugs, Tobin Sprout" small-caps, taste not event, set apart from the scores.
- Moon: a one-line caption in the masthead corner, "Full moon, 99%."
- Weather/place: masthead top-right, "Aldie, Virginia. Clear, 44°F."
- Halloween: "Halloween, 5 days" quiet in the colophon.
- Quote: Columbus runs as a small attributed footnote in the colophon, author on its own small-caps line, no dash.

## Self-Check
1. Hero quotability: Yes — "Deep in both. Not a generalist." is a flat, confident claim that stands alone.
2. Because-of chain: Yes — the claim needs proof, so the work index leads (list) with the phrase as standfirst, on a split-field of two grounds that renders "both," in a signage specimen chassis.
3. Render feasibility: Yes — standfirst at 4xl and index titles at the hero clamp (≤144px, under Big Shoulders' 160 ceiling) fit a 1440 masthead and masonry without overflow.
4. Canvas floor feasible: Yes — seven packed masonry blocks plus masthead plus colophon fill a crowded 80%+ canvas.
5. Phone: Yes — standfirst at 3xl inside the umber masthead sits in the first 640px with the mark, no word cut.

## Rationale
The phrase is Doug's own line, "Deep in both. Not a generalist." It is a claim, and a claim demands evidence, so the composition leads with the work index rather than a poster statement: masonry blocks of the seven projects, titles at marquee, the phrase stepped down to a standfirst band above them. The object on the page is the list, not another single big line, which is exactly the variance the owner has asked for after eight days of eyebrow-statement-deck-signals.

The chassis is big-shoulders-atkinson because the work titles want a signage display at scale and Atkinson Hyperlegible answers it with a workhorse body that carries years, roles and the colophon without strain. Big Shoulders has not shipped in the recorded window, so it also breaks the three-chassis monoculture. Small-caps, heavy, justified, stacked: the display register is set as a deliberate specimen, not left on roman-mixed-case defaults.

The palette is a split-field, two grounds for "both": a warm paper field where the work lives and a dark umber masthead where the thesis is reversed, with brass gold as the one accent binding them. That is a different formula from the recent dark-void and drench floods even though the hue stays warm, and it lets the full-colour mark sit on the umber field in both schemes. Halftone on the fields gives the signage specimen its printed register; the ground drifts slowly and the index rows reveal on scroll, so the page has life without a load-time cascade.
