# Signals Brief — 2026-09-14

## Hero Copy
Buildable before the first line of code. Faithful after the last.

## Hero Rationale
This is lifted straight from Doug's own voice file, where it sits as a candidate line: it is his entire job stated in two clauses, the design-to-build gap he has spent a career closing. On a bright, quiet Monday with two Detroit wins and a market tick but no single headline event, the strongest line is not a score or a borrowed quote, it is Doug saying what he does. It answers three ratings running ("my own line," "content-lifted hero in my own words," "not a quote poster"). It anchors an artifact: Spaceman, the LLC that carried Zeldman, Rolex, The Nature Conservancy, Intuit and LastPass, becomes the evidence the line is true.
Owner's voice: it's my whole job in one line, said the way I say it.

## Archetype
an artifact-led broadsheet — the client ledger IS the argument

## Composition
columns: three
axis: horizontal
symmetry: left-weighted
hero_zone: upper-left
density: measured
rhythm: syncopated
shell_posture: marginal
field_ratio: balanced
collapse: rail-to-band
hero_object: artifact

## Composition Rationale
The phrase is a claim about design and build fidelity, so it needs evidence: an artifact-led three-column broadsheet puts Spaceman and its client set (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) forward as proof the line is true, fixing the standing complaint that the client evidence stays buried. I moved shell_posture off the date-derived start of `none` to `marginal` because the owner's top complaint is brand-absent-from-the-first-fold, and a right-margin rail guarantees the original mark sits in the fold at both widths while still giving rail-to-band a real rail to collapse. This differs from the nearest neighbor (2026-09-10) on columns (three vs two-asymmetric), hero_zone (upper-left vs edge-bound), hero_object, chassis, hue, ground strategy and header placement, and it abandons the poster-statement silhouette of the last three builds by leading with the work, not a line at marquee.

## Mobile
carrier: The thesis reversed out of an espresso block, SPACEMAN beneath it, then the client names as a stacked ledger — the split becomes a top-to-bottom sequence of espresso-then-cream.
first_fold: The brand band (mark + wordmark), then the thesis "Buildable before the first line of code. Faithful after the last." and the SPACEMAN marquee word, all inside the first 640px.
order: brand band, hero thesis + SPACEMAN, client ledger, signal band, dateline footer
hero_step_360: 4xl
nav_360: the right-margin rail becomes a slim full-width top band — stacked mark + wordmark left, work / about / contact as a small-caps row; the signal ledger drops to its own band lower down

## Chassis
bitter-mulish

## Visual Specification
### 1. Color Specification
- **Primary hue**: 44° harvest gold — warm, September-harvest, and the register of Doug's proven gold gestures (terracotta specimen, trophy-gold scoreboard). It reads confident and structural, not clinical, which suits a design-and-build thesis.
- **Neutral palette (warm sand, tinted toward amber)**: 50 `#FAF5EC`, 100 `#F1E8D5`, 200 `#E3D2AD`, 300 `#CDB483`, 400 `#AB9059`, 500 `#7F6B42`, 600 `#5E4E30`, 700 `#443921`, 800 `#2C2515`, 900 `#1B160C`
- **Accent color (marigold)**: light `#F9B53E`, default `#EF9C1A`, dark `#B0670C`, glow `#FCCE72`
- **Secondary accent**: the marigold above is the only saturated color; used exclusively on the day's two win figures and the up-market tick, nowhere decorative.
- **Background**: page bg `#FAF5EC` (cream), evidence panel bgAlt `#F1E8D5`, card/raised surface `#FFFDF6`, thesis/artifact field `#2C2515` (espresso)
- **Text colors**: primary `#1B160C` on cream, secondary `#5E4E30`, muted/faint `#7F6B42`; on the espresso field, cream `#FAF5EC` and tan `#CDB483`

### 2. Typography (bitter-mulish)
- **Hero phrase rendering**: The h1 is the thesis, set in Bitter at the `4xl` step on desktop, mixed case, heavy cut, flush left, reversed cream out of the espresso thesis panel. The two clauses stack on two lines so the "Buildable… / Faithful…" turn lands as a broadsheet couplet. The artifact title `SPACEMAN` is the marquee element at `hero`/`5xl` scale (clamp to ~176px), heavy Bitter, caps, tracked tight, cream on espresso; the thesis reads as its standfirst-caption directly above it.
- **Type treatment**: Bitter's real heavy cut carries both the marquee word and the thesis; Mulish answers it as the ledger/body face sharing the screen-slab humanist skeleton. Spend the middle of the ramp: project meta (Founder · 2018) at `xl`, client rows at `lg`, section labels at `sm` small-caps, body/signal rows at `base` held to 60–68ch at 1.5 leading. Ramp steps used: `hero`/`5xl` (SPACEMAN), `4xl` (thesis), `2xl`→`xl` (deck, client ledger heads), `lg`→`base` (rows), `sm`/`xs` (labels, metadata).

### 3. Layout Specification
- **Composition**: `three` columns, `horizontal` axis, `left-weighted`, hero `upper-left`, `measured` density, `syncopated` rhythm, `marginal` shell, `balanced` field ratio, `rail-to-band` collapse, `artifact` object. A three-column broadsheet strip: the artifact and thesis gather in the left region (thesis on espresso), the client ledger fills the center on cream, the right margin carries brand and signals. The split serves the phrase because the line is a claim and the client set is its proof — thesis and evidence need each other, the fairway-split logic in warm gold.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1.15fr 1fr 320px; gap: 0;` The left column is the espresso field (thesis + SPACEMAN), the center is the cream evidence ledger, the 320px right column is the marginal rail (cream, holds the original brand mark + nav + signal ledger).
- **Major dimensions**:
  - Hero/artifact zone: `min-height: 88vh` at 1440
  - Right margin rail width: `320px`
  - Max content width: `max-width: none`; side padding `72px 5vw`, ledger rows capped at 66ch
  - Section padding: vertical rhythm on the Bitter base unit, `clamp(48px, 6vw, 96px)` between zones
- **Nav placement**: right-margin rail. Stacked mark over wordmark at the rail top, `work / about / contact` as a vertical small-caps list, one hairline rule per row, reading down the margin. No top bar. Rail width 320px, brand cluster ~96px tall at the top.
- **Hero phrase grid zone**: thesis (h1) occupies rows 1–2, column 1 (espresso field), ~`4xl` reversed cream; SPACEMAN marquee directly beneath in rows 3–5, column 1, at ~176px. Both inside the first fold at 1440.

### 4. Component Character
- **Border radius**: hard throughout — cards/panels `none` (0), buttons/links `sm` (2px), tags `none`. A broadsheet has no rounded corners.
- **Border treatment**: bordered by hairline. `border` for ledger row rules on cream, `fieldBorder` for rules inside the espresso panel, `borderStrong` for the section break between thesis and evidence.
- **Shadow**: none. Depth comes from the split-field value change (espresso vs cream), not shadow.
- **Density**: measured — generous but full; the ledger rows breathe on a strict baseline grid.
- **Interactive states**: links underline on hover in marigold; ledger rows shift ground to bgAlt on hover. `_hover` condition only.

### 5. Signal Integration
- **Where signal elements live**: the right-margin rail, below the brand cluster, as a tabular signal ledger. At 360 the rail becomes a full-width band.
- **Sports scores**: two Detroit wins are the standout signals — Lions 31–30, Tigers 8–1 — set as tabular rows (team, league, result) with the winning score in marigold `#EF9C1A`, en dash inside the score only. Two wins in one weekend, stated plainly.
- **Quote**: Zig Ziglar is present but deliberately not the hero (breaking the quote habit); demoted to a single small italic footnote in the dateline footer, clearly subordinate.
- **Holiday elements**: none today.
- **Music**: Tobin Sprout, The War on Drugs, Wet Leg set as one quiet "On rotation" line in the rail colophon — taste, not an event, no score-adjacent prominence.
- **Other signals**: SPY 764.29 +0.85% as a ledger row, up-tick in marigold; Clear 69.6°F Aldie as a row; waxing crescent (12%) as a small glyph row; Biltmore Championship (scheduled) as a muted golf row; AQI Good as a micro label.

## Self-Check
1. Hero quotability: Yes — "Buildable before the first line of code. Faithful after the last." is a standalone two-clause creed, screenshot-worthy, and it's Doug's own line.
2. Because-of chain: Yes — thesis needs proof → artifact/ledger split → structural slab (Bitter) → warm harvest split-field → three-column broadsheet with client evidence forward.
3. Render feasibility: Yes — Bitter's heavy 5xl (176px) sets SPACEMAN in column 1 and the `4xl` thesis above it inside 88vh at 1440 with no overflow.
4. Canvas floor feasible: Yes — a three-column broadsheet with a full client ledger, thesis panel and signal rail genuinely fills 78% of 1440×900.
5. Phone: Yes — SPACEMAN drops to `4xl` (one word, no wrap) and the thesis to `2xl`, both inside the first 640px with the mark band above.

## Rationale
The phrase decides everything, and today the strongest line is Doug's, not the machine's or a stranger's. Five ratings running have asked for the same thing: his own words, brand visible, not another quote poster. "Buildable before the first line of code. Faithful after the last." is lifted verbatim from his voice file. It is his entire job compressed into a two-clause turn, and it wants proof, not just scale. That is the compositional decision: an artifact leads. Spaceman, the LLC he has run for ten years, carries the client set that is his real evidence — Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass — and the thesis is its caption. This finally moves the object off the eight-day poster-statement template and pulls the buried client list to the front of the page.

Because the page is a claim plus its proof, the composition is a three-column broadsheet split: the thesis reversed out of an espresso panel with SPACEMAN at marquee scale on the left, the client ledger on cream in the center, brand and signals in a right margin rail. That structure wants a face that is sturdy and built, not editorial-serif costume, so the chassis is bitter-mulish — a screen slab with real heavy cuts, unused in the last fourteen builds and outside the three recently-worn chassis. Its heavy Bitter carries both the marquee word and the two-clause thesis while Mulish answers as the ledger body sharing the same humanist screen-slab skeleton, satisfying the "display and body share a skeleton" complaint by construction.

The palette commits a warm harvest gold at 44° across a split-field, a formula not used in the last week (which ran dark-void, drench and light-ground). Cream evidence panels against a deep espresso thesis panel give the original green-and-blue mark a light ground to sit on, so brand_color_mode is original for only the second time in effectively 18 builds — the owner said the original mark on paper read clearest all week. The right-margin rail places that mark in the first fold at 1440 and, via rail-to-band, in a top band at 360, answering the repeated "no brand above the fold." One saturated marigold pulse is reserved for the weekend's two Detroit wins in the signal ledger; everything else stays quiet and tabular, subordinate to the line that carries the day.
