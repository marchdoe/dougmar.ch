# Signals Brief — 2026-10-17

## Hero Copy
If you're waiting until you feel talented enough to make it, you'll never make it.

## Hero Rationale
This is today's `signals.quote` (Criss Jami), and it carries the page without stylization: it's a dare against hesitation, which is exactly the spine of Doug's work history, seven shipped experiments from 2008 to 2026, none of them waiting for permission. The quote lane is the preferred source and this line is strong enough to anchor an index of actual made things as its proof. Criss Jami renders in the masthead as the attribution beneath the line.
Owner's voice: Doug started Politweets and Twittertale in 2008 and never stopped building side products; "just ship the thing" is how he actually works, and he'd nod at a line that says waiting to feel ready is the only sure way to fail.

## Archetype
an index-specimen under a violet masthead, the work flushed right as proof

## Composition
columns: irregular-twelve
axis: vertical
symmetry: right-weighted
hero_zone: full-bleed
density: crowded
rhythm: syncopated
shell_posture: footer-only
field_ratio: field-dominant
collapse: hero-only
hero_object: list

## Composition Rationale
The phrase is a dare, so the page answers it with evidence: the work index leads as the biggest object (list), proving Doug acted without waiting. I moved `axis` onto discouraged `vertical` because a 2008→2026 work ledger is inherently top-to-bottom and radial/diagonal fight a reading order; I moved `symmetry` and `alignment` onto discouraged `right-weighted`/`right` as the one deliberate risk point, a flush-right specimen index whose hard right edge and ragged left edge is the most un-templated way to set a ledger. `collapse: hero-only` replaces the starting `rail-to-band` because the composition has no rail to band; the masthead is the honest first fold at 360.

## Mobile
carrier: At 360 the full-bleed violet masthead carries the dare alone, then the work index follows as full-width flush-right ruled rows, the proof reading as a scroll.
first_fold: The violet quote masthead alone — "If you're waiting until you feel talented enough to make it, you'll never make it." with Criss Jami beneath and the mark top-left.
order: quote masthead, work index, site callout, footer nav + signals
hero_step_360: 2xl
nav_360: Mark stays top-left of the masthead; nav becomes a stacked numbered list in the foot (01/02/03 on their own rows) with the signals ledger below.

## Chassis
zilla-worksans

## Visual Specification
### 1. Color Specification
- **Primary hue**: 288° (grape violet). The quote is a confident dare, not a shout and not a chill; violet is warm-blooded but distinct from the terracotta the mandate targeted and the last two builds shipped. I deviate from the 15–40° target because terracotta ran 2026-10-16 (24°) and 2026-10-14 (10°) and the repetition check demands ≥60° distance; 288° sits in the available 252–340° window and is 66° off the nearest recent hue (222°).
- **Neutral palette (sand, gold-tan)**: 50 `#faf3e2`, 100 `#f2e6c4`, 200 `#e9d6a8`, 300 `#e0c88e`, 400 `#c9b483`, 500 `#a8925f`, 600 `#8a6f3e`, 700 `#5f4d30`, 800 `#4a3c25`, 900 `#2b2213`
- **Accent color (violet)**: light `#a96bd6`, default `#6e2db0`, dark `#3e176a`, glow `#c597e5`
- **Secondary accent (signal gold)**: `#d99a1e` — day's figures (Pistons score, temperature) rendered on the violet field ONLY, where it reads ~6:1; never on the gold-tan ground, where it disappears.
- **Background**: page bg (index ground) `#e9d6a8`; card/surface `#f2e6c4`; band/bgAlt `#e0c88e`; the masthead/footer field `#3e176a`
- **Text colors**: primary `#2a1142`; secondary (decks, attribution captions) `#561f8e`; muted (metadata) `#5f4d30`; on the violet field, ink `#faf3e2`, muted ink `#c597e5`

### 2. Typography
- **Hero phrase rendering**: Zilla Slab display. Because `hero_object` is `list`, the quote is the one h1 but steps down to the `4xl` fluid step, set right-aligned in the violet masthead in caps, reversed out in `fieldInk` cream, with "never make it" lifted in signal gold. "Criss Jami" sits beneath it at `sm` in `fieldInkMuted`. The project titles below are the marquee object.
- **Type treatment**: `hero` step reserved for nothing; project titles ride `hero_scale` (see MEASURABLES) at the `5xl` register. Quote at `4xl`. Section/metadata labels at `xs` tracked caps (space above a label ≥ 2× space below). Body/notes at `base`, held to 62ch. Years and roles at `sm` tabular. This spends the mid-scale: quote 4xl, titles 5xl, a `lg` standfirst on inner routes, `base` body, `xs` labels.

### 3. Layout Specification
- **Composition**: irregular-twelve / vertical / right-weighted / full-bleed / crowded / syncopated / footer-only / field-dominant / hero-only / list. A chronological work index reads top-to-bottom and flushed right against a hard right edge; the violet masthead carries the dare full-bleed, and the index underneath is the evidence that Doug didn't wait.
- **CSS grid/flex**: page is `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: clamp(16px, 2vw, 32px)`. Masthead spans cols 1–12. Index rows span cols 4–12 (right-weighted), each row an inner `grid-template-columns: 1fr auto auto` collapsing to flush-right title / year / role.
- **Major dimensions**:
  - Masthead (hero field): `min-height: 58vh`
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 112px)`
  - Index row height: `clamp(96px, 11vw, 148px)` per project, borderStrong baseline rule each
  - Section padding: vertical rhythm off the chassis base unit, roughly 1.5–3 units between zones
- **Nav placement**: deferred to the foot (posture footer-only). No top bar.
- **Hero phrase grid zone**: masthead rows 1–2, columns 4–12 (right-weighted block), quote ~`4xl`; mark top-left at columns 1–2.
- **Home callout slot**: on `/`, place `<SiteCallout />` below the work index and above the footer ledger, between the index section and the foot. No copy or styling authored here.

### 4. Component Character
- **Border radius**: cards `2px` (sm), buttons `2px`, tags `0` (none). Specimen-sharp.
- **Border treatment**: hairline `border` on row rules; `borderStrong` on the masthead/footer break and index baselines.
- **Shadow**: none. Depth comes from the violet-vs-tan field contrast, not elevation.
- **Density**: crowded; the index packs titles, years, roles, and a running count.
- **Interactive states**: on hover an index row floods `accent` violet with `accentText` cream (the row becomes a specimen chip); links underline-thicken in `accent`.

### 5. Signal Integration
- **Where**: footer ruled ledger (paper ground), one strong rule above.
- **Sports**: Pistons win, `129–125`, set as tabular figures — gold is only legible on violet, so the Pistons line renders in `accent` violet on the paper foot, or lifts to gold if placed on the masthead strip; figures bold, "WIN" as an `xs` tracked label.
- **Quote**: IS the hero phrase, in the masthead; Criss Jami attributed directly beneath.
- **Market**: SPY `763.25`, `-1.11%`, down — `textFaint` metadata line with a small down caret, not alarmist.
- **Weather**: Aldie, VA, moderate rain, `52°F` — foot ledger line.
- **Moon**: first quarter, 43% lit — foot ledger line.
- **Music**: Guided by Voices, Wet Leg — "In rotation" set quietly at the foot as taste, not as an event beside the score.
- Heavy news (Oregon) is not treated as a design element on a portfolio hero.

## Self-Check
1. Hero quotability: Yes — a complete, screenshot-worthy aphorism that stands alone.
2. Because-of chain: Yes — the dare demands proof, so the work index leads as evidence (list), violet masthead states it, gold-tan answers it.
3. Render feasibility: Yes — quote at 4xl right-aligned fits a 58vh masthead; titles at 116px clear marquee without overflow.
4. Canvas floor feasible: Yes — crowded index of seven projects + timeline + masthead + foot fills 82%.
5. Phone: Yes — hero-only puts the violet masthead quote at 2xl inside the first 640px without cutting a word.

## Rationale
The hero is Criss Jami's dare against waiting, and a portfolio is the one place that line can be answered rather than just repeated. So the composition leads with the work itself: a `list` object, seven projects dated 2008 through 2026, rendered as the biggest thing on the page, with the quote stepped down to a masthead standfirst above it. The dare states the thesis; the index is the evidence that Doug never waited to feel ready. That is the whole because-of chain, phrase to object to grid.

The chassis is Zilla Slab (zilla-worksans), chosen over the three recently-used faces because its sturdy, structural, index-tagged slab sets both a long caps standfirst and a column of poster-scale project names without tipping into either shouting or didone delicacy. It spends the middle of the scale the owner asked for: 4xl quote, 5xl titles, lg standfirst, base body at 62ch, xs labels. The palette deviates from the terracotta target on purpose, because terracotta shipped the last two nights and the repetition gate demands distance; grape violet at 288° sits in the open 252–340° window and reads as conviction, warm-blooded but unmistakably not the clay of yesterday. Paired with a gold-tan ground it makes a true duotone, two committed hues and no neutral void, which is the field-dominant commitment the gold-standard builds reward.

Layout puts the dare in a full-bleed violet masthead, flushed right against a hard edge, the single deliberate risk point: a flush-right specimen index is the most un-templated way to set a ledger, and the ragged left edge is the structure. The mark lives single-color top-left of that violet field, in the first fold at both widths, with nav deferred to a numbered foot ledger that carries the day's signals. On the phone the split and the right edge are gone, so the masthead carries the quote alone in the first 640px and the index scrolls beneath it as proof.
