# Signals Brief — 2026-11-05

## Hero Copy
Ask why. Then build the answer.

## Hero Rationale
Today's quote signal is Ayn Rand on the inventor who "asks Why? of the universe and lets nothing stand between the answer and his mind." That is grand and abstract, and the owner has rejected famous-author quotes as "a poster of somebody else," so I composed the maker's creed inside it in Doug's own register instead: short sentences, imperative, concrete. Doug is a builder of experiments (Politweets, TeeTurn, FishSticks, 15th Club) whose whole career is closing the gap between asking a question and shipping the thing that answers it, which is exactly this line, stripped of Rand's abstraction. It carries the day because it is a creed, not a description, and it reverses out of a committed field at marquee scale.
Owner's voice: Doug says what a thing does, not how it feels, and he builds small products to answer his own questions.

## Archetype
a drenched terracotta specimen with a two-beat creed carved across it

## Composition
columns: three
axis: diagonal
symmetry: broken
hero_zone: full-bleed
density: measured
rhythm: interrupted
shell_posture: footer-only
field_ratio: drenched
collapse: reorder
hero_object: statement

## Composition Rationale
The creed has two beats, a question and its answer, so the statement sweeps on a diagonal from upper-left to lower-right and the broken symmetry lets the answer land off the question's axis; the period after WHY is the single interrupted caesura. I moved columns off the start suggestion's spirit into a working three-column grid so the specimen furniture (size markers, work catalog, signals) does real layout work under the waterfall, answering the "one poster line every day" complaint. I kept drenched and footer-only because the owner's gold standard is a drenched terracotta specimen and a clean clay field needs its nav deferred, but I differ from 2026-11-01's drench on columns, axis, hero_zone, collapse, hue, chassis and every type-treatment field.

## Mobile
carrier: The diagonal is gone; the two clauses carry it as a flush-left vertical stack, ASK WHY. over THEN BUILD THE ANSWER., the period in gold.
first_fold: The hero statement, both clauses, with the mark top-left and place/date top-right above it.
order: hero statement, selected-work catalog, signals strip, site callout, footer colophon
hero_step_360: 5xl
nav_360: Mark holds top-left of the hero first fold; nav stays in the footer as a full-width uppercase vertical index, one hairline per row, each a 44px target.

## Chassis
bebas-plex

## Visual Specification
### 1. Color Specification

- **Primary hue**: 22° (burnt clay / terracotta), HSL ~22/65/44. The color mandate targets 15–40° rust, and the owner's all-time gold standard is literally a drenched terracotta specimen; I sit at the top of the warm band (22°, pushed toward a browner clay) to hold distance from 2026-11-03's vermilion (14°) while honoring the mandate. The committed warm plane matches a creed about building: confident, physical, no hedge.
- **Neutral palette (warm sand)**: 50 `#FAF6F2`, 100 `#F2E9E0`, 200 `#E3D6C8`, 300 `#CBB8A6`, 400 `#A8927C`, 500 `#836E58`, 600 `#635141`, 700 `#47392D`, 800 `#2E241B`, 900 `#1A1310`
- **Accent color (luminous gold)**: light `#FFE3AE`, default `#FFD27A`, dark `#C98A2E`, glow `#FFE9C4`. Used at ≥24px only (size markers, the period after WHY, mark pulse); it clears 3:1 on the clay field but not 4.5:1, so it never sets a sentence.
- **Secondary accent**: none. One hue, one pulse.
- **Background**: page bg `#A0401E` (base) / `#B04722` (light); hero field `#C45A2E` (base) / `#CE6836` (light); card/inset surface `#7A3217` (base) / `#8E3C1A` (light); footer band `#5F2914` (base) / `#6E2E16` (light).
- **Text colors**: primary (cream) `#FBF1EA` (base) / `#FDF4EE` (light); secondary `#F2D9C5` (base) / `#F5DECB` (light); muted/faint `#E6C2A0` (base) / `#E8C6A6` (light).

### 2. Typography

- **Hero phrase rendering**: `display` (Bebas Neue) at the `hero` step, a fluid clamp sized for marquee. The two clauses stack as a type waterfall descending a shallow diagonal: `ASK WHY.` upper-left, `THEN BUILD / THE ANSWER.` resolving lower-right, knocked out in cream fieldInk. The period after WHY is set in accent gold as the one chromatic beat.
- **Type treatment**: steps carry size/leading/tracking as textStyles. Hero at `hero`; the deck standfirst at `2xl` (the spent mid-register the owner asked for); section/catalog heads at `lg`; body (Plex) at `base`, held to 60–68ch; size-markers and foundry numbers at `sm` with `tabular-nums`; micro metadata at `xs`, never below 12px. Bebas is caps-native, so the display register is all-caps throughout; Plex carries every reading size.

### 3. Layout Specification

- **Composition**: single intent is wrong here, so `columns: three` / `axis: diagonal` / `symmetry: broken` / `hero_zone: full-bleed` / `density: measured` / `rhythm: interrupted` / `shell_posture: footer-only` / `field_ratio: drenched` / `collapse: reorder` / `hero_object: statement`. The three-column grid organizes the specimen furniture (size markers, work catalog, signals) while the creed sweeps diagonally across the full-bleed clay field above it; the period after WHY is the interrupted caesura.
- **CSS grid/flex structure**: hero `display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto`; the statement spans columns 1–11 on a shallow 6° diagonal baseline. Lower bands `display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(24px, 3vw, 48px)`.
- **Major dimensions**:
  - Hero field `min-height: 100vh` at 1440, full-bleed clay drench.
  - No fixed sidebar. `max-width: none` throughout; side padding `clamp(28px, 6vw, 112px)`.
  - Section padding `clamp(48px, 6vh, 96px)` vertical; vertical rhythm on the chassis base unit.
- **Nav placement**: deferred to the footer colophon band (footer-only). The stacked-lg mark sits top-left of the hero field; place/date/weather top-right.
- **Hero phrase grid zone**: rows 1–4, columns 1–11 of the 12-col hero; intended size `clamp(80px, 10vw, 150px)` (≈144px at 1440), descending diagonally across ~70vh.
- **Home callout slot**: on `/`, place `<SiteCallout />` below the hero, above the footer, between the selected-work catalog and the footer colophon band. No copy, no styling from me.

### 4. Component Character

- **Border radius**: cards/panels `0`; tags/size-markers `2px`; buttons `2px`. Sharp specimen edges; the owner dislikes rounded corners.
- **Border treatment**: bordered with hairlines. `fieldBorder` (`#D47E4B`) for rules inside the clay field; `border` for subtle divisions; `borderStrong` (`#E6C2A0` tan) for the one emphatic section break above the catalog.
- **Shadow**: none. Depth comes from value (inset darker surfaces), not shadow.
- **Density**: measured. Generous clearance around the hero; tighter, aligned rows in the catalog.
- **Interactive states**: on `_hover`, catalog rows shift ink to accent gold and the hairline thickens to `borderStrong`; links underline on hover only.

### 5. Signal Integration

- **Where signal elements live**: place/date/weather top-right of the hero; all other facts in the footer colophon as type-specimen size-markers (e.g. `48pt — SPY 766.81`).
- **Sports scores**: Pistons loss styled plainly as a size-marker row, `Pistons 106–112 L`, cream on the footer band, en-dash in the score, no stylization.
- **Quote display**: the Rand line is the day's reading, set small and attributed at the tail of the footer colophon ("An inventor is a man who asks Why?… — Ayn Rand"), not in the hero; it seeded the composed creed and sits as source, not statement.
- **Holiday**: Veterans Day as a quiet footer marker, `Veterans Day — 6 days`.
- **Music**: `The War on Drugs · Radiohead` as a footer "in rotation" line, presented as standing taste, never as an event beside the score.
- **Other signals**: SPY `766.81 ▲1.65%`, golf `WWT Championship · scheduled`, moon `waning crescent · 14%`, weather `Aldie, VA · rain · 65°F` — each a footer size-marker under one rule.

## Self-Check
1. Hero quotability: Yes — "Ask why. Then build the answer." is a six-word maker's creed that stands alone, not the first line of body copy.
2. Because-of chain: Yes — the two-beat creed drove the diagonal sweep, the broken caesura, the condensed-caps slab (bebas), the committed clay drench, and the footer-only colophon.
3. Render feasibility: Yes — Bebas condensed at clamp(80,10vw,150px) tops out ~144px at 1440, under the 160px chassis ceiling, and the stacked clauses span without overflow.
4. Canvas floor feasible: Yes — a full-bleed drenched field with a type waterfall and a three-column catalog clears 80% utilization easily.
5. Phone: Yes — at 360 the diagonal collapses to a vertical stack, hero at 5xl (72px) with clauses wrapping on word boundaries inside the first fold.

## Rationale
The phrase is a composed maker's creed, "Ask why. Then build the answer.", drawn from the spirit of the day's Rand inventor quote but rewritten in Doug's terse imperative register because the owner has explicitly rejected famous-author quotes as somebody else's poster. A creed in two beats, a question and its resolution, wants a composition that moves, so the statement sweeps on a shallow diagonal across a full-bleed field with broken symmetry: the question sits high-left, the answer lands low-right, and the period after WHY is the one interrupted caesura and the one chromatic beat, in gold.

Because the line is a slab of intent, the chassis is bebas-plex, a condensed editorial display that renders declarative all-caps at marquee without tipping into parody, paired with Plex for the catalog furniture. Bebas has gone unused while the three condensed faces were carried entirely by big-shoulders, so it is both fresh and exactly the specimen/catalog register the layout needs. The palette is a committed burnt-clay drench at 22°, honoring the color mandate's 15–40° rust band and the owner's all-time gold-standard terracotta specimen; one luminous gold is the only saturated pulse, used large-only because the clay ground leaves no room for a dark accent.

Layout serves the creed by making the specimen furniture do real work: three columns of size-markers, a cataloged work index, and the day's signals as type-specimen point-markers under the waterfall, so the page is not one floating poster line but a specimen of the creed with the work indexed beneath it. Nav is deferred to a footer colophon (footer-only), keeping the clay field clean for the statement, with the stacked-lg mark anchoring the hero's top-left corner inside the first fold at both widths. At 360 the diagonal collapses to a flush-left vertical stack and the catalog reorders ahead of the signals strip, so the work leads the day on the phone.
