# Signals Brief — 2026-10-21

## Hero Copy
A diamond is a piece of charcoal that handled stress exceptionally well.

## Hero Rationale
From `signals.quote`, attributed to Unknown. It wins over a Detroit score line because it reads as the thesis over a decade of shipped work: pressure between what's designed and what's built, turned into something hard and finished. Unlike an abstract literary quote, this is a dry engineer's maxim in Doug's register, so it anchors a work index instead of being a poster of somebody else. The attribution (Unknown) renders as a caption beneath the line.
Owner's voice: Doug's whole career is handling the pressure between what's designed and what's built; a diamond that handled stress is the work, dryly put.

## Archetype
a foundry specimen of the work, the maxim inscribed in gold over a carbon index

## Composition
columns: irregular-twelve
axis: vertical
symmetry: right-weighted
hero_zone: full-bleed
density: crowded
rhythm: syncopated
shell_posture: standard
field_ratio: field-dominant
collapse: reorder
hero_object: list

## Composition Rationale
Invoking the Max-Risk License (axis onto a soft-forbidden value): I land `axis: vertical`, which the Composition Mandate soft-forbade for `axis`. The hero phrase demands it — the maxim is a thesis and its only proof is the work read as a ledger, project after project down the page, and a ledger of a decade reads top to bottom, not radially around a center. Every other axis sits on a non-avoided value (irregular-twelve, right-weighted, full-bleed, crowded, syncopated, standard, field-dominant, reorder, list), so this is one deliberate break, not a free-for-all.

## Mobile
carrier: The duotone unstacks into bands at 360 — a gold standfirst plane, then the carbon index of titles — so the gold/carbon alternation carries the charcoal-to-diamond idea in sequence.
first_fold: The hero phrase "A diamond is a piece of charcoal that handled stress exceptionally well." set small-caps at 2xl on the gold standfirst plane, with Unknown attributed beneath.
order: maxim standfirst, work index, signals column, site-callout, footer
hero_step_360: 2xl
nav_360: Header collapses to a top band — stacked-md mark left, Work/About/Contact as a small-caps row beneath; the right margin dissolves.

## Chassis
bebas-plex

## Visual Specification
### 1. Color Specification
- **Primary hue**: 46° (forge gold / amber). Warm, inside the 40–80° mandate. Gold stands for the diamond's brilliance and the heat of the pressure; it is a load-bearing plane, not an accent.
- **Neutral palette (carbon, warm-tinted toward amber)**: 50 `#F7F3EA`, 100 `#ECE4D2`, 200 `#D8CBB0`, 300 `#B8A986`, 400 `#A0916D`, 500 `#6B614A`, 600 `#4A4335`, 700 `#332E25`, 800 `#211E18`, 900 `#15130F`.
- **Gold scale**: 50 `#FCF3DC`, 100 `#FBE8B8`, 200 `#F7D47E`, 300 `#F5C040`, 400 `#E8A62B`, 500 `#C8911C`, 600 `#A5760F`, 700 `#7E5A0C`, 800 `#5A410B`, 900 `#3A2A08`.
- **Accent color**: default (dark) `#F5C040`, light `#A5760F`; dark/glow `#E8A62B`; darker `#C8911C`.
- **Secondary accent**: none. One hue carries the page in duotone with carbon.
- **Background**: page bg `#15130F` (carbon.900), bgAlt `#211E18`, surface `#332E25`. The gold flood plane is `#E8A62B`.
- **Text colors**: primary `#F7F3EA`, secondary `#B8A986`, faint `#A0916D`. On the gold field: ink `#15130F`, muted ink `#332E25`.

### 2. Typography (chassis: bebas-plex)
- **Hero phrase rendering**: the maxim is the single h1, set as a justified standfirst in the body face (IBM Plex Sans) at `2xl` on the gold field plane, small-caps, with "Unknown" as a tracked caption beneath. It takes one step down because the object is the index. The marquee belongs to the project titles.
- **Index titles (the object)**: Bebas Neue condensed caps at `hero` scale, reversed in gold out of carbon, one title per line, flush right.
- **Type treatment**: `hero` for the project titles; `2xl` for the maxim standfirst; `lg` for section labels and the attribution; `md` for the standfirst of a project (year/role) and signals headings; `base` for body and the data column; `sm`/`xs` for size markers and metadata. Spend the middle: every index row carries a `md` year/role line between the `hero` title and `sm` client tag, so nothing jumps straight from marquee to micro.

### 3. Layout Specification
- **Composition**: irregular-twelve / vertical / right-weighted / full-bleed / crowded / syncopated / standard / field-dominant / reorder / list. The maxim is a thesis and the work is its evidence, so the index leads at marquee and the phrase inscribes above it; a ledger of a decade reads top to bottom.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: clamp(16px, 2vw, 40px)`. Row spans change per block (syncopated): standfirst plane spans cols 5–12; signals column cols 1–4; index rows alternate span 6–12 and 4–12 so no two align.
- **Major dimensions**:
  - Gold standfirst plane: `min-height: 34vh`, full right-weight (cols 5–12).
  - Signals column: cols 1–4, sticky within the first screen.
  - Max content width: `max-width: none`; `padding: 56px 5vw 0`.
  - Section padding: vertical rhythm from the chassis base unit; index rows ~ 1.2× title leading apart.
- **Nav placement**: right margin on the carbon field. Stacked-md mark top-right inside the first fold; Work / About / Contact stack beneath as a vertical index, one amber hairline per row, small-caps.
- **Hero phrase grid zone**: rows 1–2, cols 5–12 (the gold plane), ~34vh tall; the maxim at `2xl`, justified, small-caps.
- **Home callout slot**: on `/`, below the work index and above the footer colophon, between the index block and the specimen size-marker tail. Placed, not styled.

### 4. Component Character
- **Border radius**: cards/rows 0 (`none`); tags `sm` (2px); mark circular (`full`). Hard specimen edges.
- **Border treatment**: hairlines in `border` between index rows; `borderStrong` above the footer and under the masthead row.
- **Shadow**: none. Depth comes from the gold/carbon value split, not elevation.
- **Density**: crowded, treated as specimen texture on a strict 12-col grid.
- **Interactive states**: index rows shift ink from gold.300 to gold.100 and reveal the client set on hover; nav rows underline in `accent`.

### 5. Signal Integration
- **Where signal elements live**: a dedicated data column (cols 1–4) on the carbon field, set as a foundry-style spec block.
- **Sports scores**: Pistons 121–113 (win) in gold `md` with the en dash in the score; Red Wings 3–4 (loss) in `textMuted` beneath, smaller. Detroit is the day's real signal and sits at the top of the column.
- **Quote display**: the quote IS the hero phrase, the justified small-caps standfirst on the gold plane; "Unknown" attributed in `lg` tracked caps beneath.
- **Holiday elements**: none today.
- **Music**: My Morning Jacket, The War on Drugs, Tobin Sprout as a rotation line in `textFaint` at the foot of the data column, labeled "in rotation," never dated beside the score.
- **Other signals**: weather (Clear, 44°F, Aldie) and the waxing gibbous moon as a two-line spec entry; SPY 769.05 ▲ as a one-line market mark; sunrise/sunset in the footer size-marker tail.

## Self-Check
1. Hero quotability: Yes — it is a self-contained maxim with a twist ending, screenshot-worthy out of any context.
2. Because-of chain: Yes — the maxim-as-thesis drove index-leads, which drove the condensed catalog chassis, the gold/carbon duotone, and the right-weighted ledger.
3. Render feasibility: Yes — Bebas condensed caps render short project titles at clamp(…,150px) without overflow in 12 cols at 1440.
4. Canvas floor feasible: Yes — a crowded field-dominant specimen with a full index, data column and two color planes fills ≥82%.
5. Phone: Yes — reorder leads with the maxim at `2xl`, which fits the 640px fold with attribution without cutting a word.

## Rationale
The phrase is a wry maxim: a diamond is charcoal that handled stress exceptionally well. It is a thesis about transformation under pressure, which is exactly what Doug does for a living, close the gap between what gets designed and what gets built. So the composition cannot be a single poster statement; the maxim needs evidence. That drove `hero_object: list` — the work index leads at marquee scale (POLITWEETS, SPACEMAN, FISHSTICKS, 15TH CLUB as condensed caps), and the maxim inscribes above it as the standfirst. The index is the diamonds; the phrase explains how they got hard.

Because the object is a loud index of short project names, the chassis is bebas-plex: a condensed editorial/catalog display, declarative, built for exactly this. It has not shipped in fourteen builds, so it also breaks the three-chassis monoculture the mandate flags. Single display weight forces `weight: regular`, honest for Bebas. The maxim sits one step down at `2xl` in small-caps, justified, which reads like an engraved inscription — fitting for stone and carbon. Small-caps and justified are both the only values the Type Treatment Mandate had not just used, so the fresh register and the thematic register agree.

The palette is duotone, not a drench or a void: gold and carbon carry the page together, no neutral grey. Gold at 46° is the diamond's fire and sits inside the color mandate; carbon is the charcoal, warm-tinted toward the same amber for cohesion. The gold standfirst plane and the mass of gold index titles keep gold above 40% of the field, so it reads as a true second ground rather than an accent on black. A halftone carbon screen underfoot gives the specimen its printed, carbon-dot register. The right-margin header keeps the owner's rejected top-bar off the page while giving the brand a first-class, first-fold home, and the mark sits on carbon where the full-color original passes cleanly.
