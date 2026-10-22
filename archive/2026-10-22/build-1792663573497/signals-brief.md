# Signals Brief — 2026-10-22

## Hero Copy
Ten years independent. Still the vehicle for the next experiment.

## Hero Rationale
This is Doug's own line about Spaceman, the LLC he has worked under for ten years. The sidebar today is full of "everyone is starting over" career churn; his counter is quiet and grounded, ten years in the same vehicle, still pointed at the next thing. It reads as a thesis, which is why the page argues it: the word on the left, the decade of evidence on the right. I chose content-lifted over the Gandhi quote so the page speaks in Doug's register rather than borrowing a maxim on a day his own narrative is the stronger line.
Owner's voice: Doug wrote this one himself, about running Spaceman for a decade and still using it to ship the next experiment.

## Archetype
a thesis-and-evidence split, the word carved into a claret panel facing its decade of work

## Composition
columns: two-equal
axis: horizontal
symmetry: left-weighted
hero_zone: lower-third
density: sparse
rhythm: accelerating
shell_posture: marginal
field_ratio: type-dominant
collapse: rail-to-band
hero_object: word

## Composition Rationale
The phrase is a thesis, so the page argues it as a two-equal split: the word on the claret left panel, ten years of work on the bone right panel, each needing the other. I moved columns off the mandate's `masonry` start to `two-equal` because a packed rag would fragment a single quiet claim, and I set the hero alignment to `right` (off the recently-used left/centred) so the word reaches across the seam toward the evidence it produced. Kept horizontal, left-weighted, lower-third, sparse, accelerating, marginal, type-dominant, rail-to-band and word where they genuinely fit; this diverges from 2026-10-18 on columns, hero_zone and hero_object plus the whole split structure.

## Mobile
carrier: At 360 the split is gone; the claret thesis panel stacks full-width on top with the word, the bone evidence panel below it, and the rail becomes a top band carrying the mark and nav.
first_fold: The hero phrase "Ten years independent. Still the vehicle for the next experiment." carried with "Independent" at 3xl and the rest of the phrase as the deck beneath it, on the claret field; the mark band sits above.
order: brand band, hero word, phrase deck, ten-year timeline, work index, site callout, signal footer
hero_step_360: 3xl
nav_360: The left rail collapses to a full-width top band: mark left, Work / About / Contact as a title-case row beside it.

## Chassis
bitter-mulish

## Visual Specification
### 1. Color Specification
- **Primary hue**: 340° (claret/wine). Chosen because the last week drowned in golds (46, 52, 48, 44, 69, 80); a deep claret is warm-family, autumnal, and mature, and it carries the "ten years, established" register without shouting. This deviates from the mandate's 40–80° target, justified in the color story: the target hue band is exactly the gold band that has repeated, and the repetition check demands distance from 46/52.
- **Neutral palette (bone)**: 50 `#FBF6EE`, 100 `#F3EADF`, 200 `#E8D8C8`, 300 `#D6C0AC`, 400 `#B9997E`, 500 `#94715C`, 600 `#6E4C40`, 700 `#4F322C`, 800 `#341C1E`, 900 `#221016`
- **Accent (burnt gold)**: light `#E3A94A`, default `#BD7A24`, dark `#9E6A20`, glow `#F2C878`
- **Secondary accent**: none beyond accent family; accentAlt `#E3A94A` is the lighter register of the same gold, used for small type on the claret field.
- **Background**: page bg (light) `#F3EADF` bone; card/surface `#FBF6EE`; claret field panel `#451221`; dark-scheme page bg `#2C0B15`.
- **Text colors**: primary text `#2C0B15`, secondary `#611830`, faint `#7A5A48`; on the claret field, ink `#F3EADF`, muted `#ECA0B8`.

### 2. Typography
- **Hero phrase rendering**: Chassis `display` (Bitter heavy). The word **Independent** is set at the `hero` ramp step (clamp sized to ~128px at 1440), right-aligned to the split seam. "Ten years" sits above it at `lg`, and "Still the vehicle for the next experiment." runs beneath as the deck at `2xl`. The full sentence is the single h1 for semantics; the word is the largest object.
- **Type treatment**: `hero` for the word, `2xl` for the deck line, `xl` for the ten-year standfirst in the evidence panel, `lg` for project titles and year markers, `base` (Mulish) for timeline body held at 60–68ch, `sm` for roles/clients, `xs` for the signal baseline. Mid-register is deliberately spent: standfirst at `xl`, section heads at `lg`, year figures at `lg` so no page jumps from marquee straight to body.

### 3. Layout Specification
- **Composition**: two-equal / horizontal / left-weighted / lower-third / sparse / accelerating / marginal / type-dominant / rail-to-band / word. The split makes the phrase an argument: the word is the thesis, the decade of work is the evidence, and the two panels need each other the way the gold-standard Split does.
- **CSS grid**: `display: grid; grid-template-columns: 88px 1fr 1fr;` (rail | claret thesis | bone evidence). Inside each panel, flex column.
- **Major dimensions**: hero split `min-height: 100vh`. Left rail `width: 88px`. Claret panel and bone panel each `1fr`. `max-width: none`; panel padding `clamp(32px, 5vw, 80px)`. Top two-thirds of the claret panel held open; word lands in the lower third.
- **Nav placement**: left rail, full height. Mark at top of rail; nav index below it.
- **Hero phrase grid zone**: claret panel = column 2, rows 1–full; the word occupies the lower third of that panel (roughly rows 7–9 of a 9-row panel), right-aligned to the seam, intended ~128px at 1440.
- **Home callout slot**: on `/`, full width below the hero split and above the signal footer, sitting between the work index and the footer baseline. Placed, not designed.

### 4. Component Character
- **Border radius**: cards/panels 4px (md), buttons/tags 2px (sm), the mark full. Grounded, squared, slab-appropriate.
- **Border treatment**: bordered with hairlines; `border` on the bone side, `fieldBorder` inside the claret panel, `borderStrong` (claret) for the one strong rule under the standfirst.
- **Shadow**: none. Depth is value and seam, not shadow.
- **Density**: sparse at the hero fold, measured in the evidence index below.
- **Interactive states**: links shift to accent dark on hover with a 2px gold underline; no motion on the hero.

### 5. Signal Integration
- **Where signals live**: a single ruled signal baseline across the foot, plus a small attributed pull-quote low in the evidence panel.
- **Sports scores**: all four Detroit teams are off-season; no scoreboard. A quiet one-line "All four off-season" note in the footer, no false score treatment.
- **Quote**: the Gandhi line ("Learn as if you were to live forever.") set small and attributed low in the bone evidence panel, as a note on reinvention, not as the hero.
- **Holiday**: none today; no holiday element.
- **Music**: "On rotation: My Morning Jacket, Wet Leg" in the footer baseline, set as taste in `textFaint`, never beside a score as an event.
- **Golf**: "On the tee: Butterfield Bermuda Championship" in the footer, no fabricated leaders.
- **Market / weather / lunar / air**: footer baseline row — Aldie 44°F clear, waxing gibbous 90%, SPY 773.09 up 0.53%, AQI good.

## Self-Check
1. Hero quotability: Yes — "Ten years independent. Still the vehicle for the next experiment." stands alone as Doug's claim.
2. Because-of chain: Yes — thesis phrase → split composition → heavy slab Bitter → claret/bone split-field → word on left panel, decade on right.
3. Render feasibility: Yes — one word "Independent" at 128px fits the claret panel at 1440 without overflow.
4. Canvas floor feasible: Yes — the split fills both panels; 70% is reachable with the claret field plus the evidence index.
5. Phone: Yes — claret panel stacks first, the word at `3xl` with "Independent" (one word) fitting 360 width without a cut.

## Rationale
The hero is Doug's own sentence about Spaceman: ten years independent, still the vehicle for the next experiment. On a day whose sidebar is full of "everyone is starting over," his answer is stability, not churn, and that answer is a thesis. A thesis wants an argument, so the composition is a two-equal split: the word carved into the left panel, the decade of actual work cataloged on the right, each half meaningless without the other. That is the gold-standard Split logic, which I have not repeated in the recent window.

The chassis is bitter-mulish because the line is grounded and established, not loud. Bitter's real heavy slab cuts make "Independent" a solid brick of a word, physical and weighted, while Mulish answers it with a humanist body that shares its screen-slab skeleton, so the inner pages will not read as a headline pasted onto default text. The palette is a deep claret field against a warm bone plane, a split-field strategy that fits the two-panel argument and deliberately walks away from the week's parade of golds; claret reads as autumnal, mature and settled, which is the register of "ten years." Burnt gold is the single accent, used as fills, year markers and small type on the claret field where it reaches full contrast.

Layout follows: a marginal left rail carries the mark-only mark and a title-case nav index, so the chrome stays out of the argument; at 360 that rail becomes a top band and the split stacks, claret panel first with the word at 3xl. The hero holds the top two-thirds of the claret panel open and lands the word low, right-aligned to the seam so it pushes toward the evidence. Nothing animates on load because all three recent entrances are spent and because a slab thesis should arrive fully formed; only the evidence index below the fold rises on scroll.
