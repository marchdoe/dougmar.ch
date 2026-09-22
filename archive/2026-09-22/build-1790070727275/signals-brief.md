# Signals Brief — 2026-09-22

## Hero Copy
Buildable before the first line of code. Faithful after the last.

## Hero Rationale
This is Doug's own thesis, lifted verbatim from his voice file, and it says his whole job in two clauses on a before/after axis: check it can be built before code, check what ships matches the design after. The ratings have asked five times running for his line with the brand up top, not a stranger's quote, and today has no `signals.quote` at all, so the quote lane is simply absent. It is fresh against the recent content-lifted lines (the gap line, the ships line, the ten-years line were all spent in the last week) and it is the sharpest, most quotable of his unused candidates. Owner's voice: it is literally a line he wrote for himself, plain, two-part, a real claim about design and engineering as one job.

## Archetype
A builder's promise on a diagonal seam: honey-gold before, deep rose after.

## Composition
columns: two-equal
axis: diagonal
symmetry: right-weighted
hero_zone: interleaved
density: dense
rhythm: syncopated
shell_posture: marginal
field_ratio: balanced
collapse: rail-to-band
hero_object: statement

## Composition Rationale
The phrase is a before/after promise, so the diagonal seam between honey (designed, before) and plum-rose (shipped, after) is the axis, and the two clauses bracket the work as an interleaved hero rather than a single poster block. I moved symmetry off the mandate's `symmetric` onto `right-weighted` because a mirrored page needs two rails and the standing complaint is "one rail per page": here the nav owns the left spine and every clause and content row hangs off one right edge, settling weight to the right like a signature at the end of a statement. Everything else follows the date-derived tuple because it genuinely fits a dense, two-column thesis with a marginal rail collapsing to a band.

## Mobile
carrier: The diagonal honey/rose seam becomes a horizontal one; the page stacks into a honey band carrying clause one, the work and signals between, then a plum-rose band carrying clause two.
first_fold: The cream mark top-left, then clause one "Buildable before the first line of code." set at 4xl on the honey band.
order: nav band, clause one (honey), work index, signals ledger, site callout, clause two (rose field), colophon
hero_step_360: 4xl
nav_360: The left spine collapses to a full-width honey band at top: cream mark left, Work / About / Contact as a horizontal title-case row beneath it.

## Chassis
bitter-mulish

## Visual Specification
### 1. Color Specification
- **Primary hue**: 340° raspberry-rose. The phrase is a binary promise, so the page runs on two committed hues rather than one; rose is the saturated accent and the deep field. 340° is the point in the allowed 302–348° gap that sits farthest (≈58°) from every recent primary (18°, 28°, 68°, 162°, 178°, 205°, 272°), which is why I deviate from the 15–40° terracotta mandate: yesterday was an 18° terracotta drench and the repetition check explicitly requires ≥60° of separation, so a third warm-earth day would read as the same page.
- **Neutral palette (warm, rose-tinted)**: 50 `#FAF5F5`, 100 `#F1E9E9`, 200 `#E1D4D5`, 300 `#C7B4B6`, 400 `#A18B8D`, 500 `#7B6668`, 600 `#5C4A4C`, 700 `#423436`, 800 `#2B2122`, 900 `#191113`
- **Accent color (raspberry-rose)**: light `#E483A2`, default `#B93764`, dark `#9C2A53`, glow `#F0B0C4`
- **Secondary accent (honey-gold, the second duotone hue / ground)**: light `#F2DA95`, default `#EAC868`, dark `#C8942A`, deep `#7E5A18`
- **Background**: page bg `#F2DA95` (light honey gold), band bgAlt `#EAC868` (deeper honey), card surface `#FCF6E7` (pale warm)
- **Text colors**: primary `#380E1E` (deep plum-black), secondary `#5A1730` (deep rose), muted `#5C4A4C` (warm rose-grey)
- **Flooded plane (the "after" field)**: field `#7C2140` (deep plum-rose), fieldInk `#FCEDF1`, fieldInkMuted `#EAC868`, fieldBorder `#9C2A53`

### 2. Typography
- **Hero phrase rendering**: `display` (Bitter, heavy cut). The two clauses are the page's only h1, split into two marquee blocks: clause one set at the `hero` step in the honey-gold upper region, clause two at the `hero` step in the plum-rose lower field. Both flush-right, heavy, mixed case, roman. `hero` clamps to 96px at 1440 and 64px at 360, which is a considered slab register, not a shout, right for a thesis.
- **Type treatment**: use the ramp steps as textStyles. Hero clauses → `hero`. Project titles in the work index → `2xl`. Section heads / the signals ledger caption → `xl`. Standfirst above the index → `2xl` italic-free (mid-register so the page spends the middle of the scale). Body → `base` held to 62ch at 1.55 leading. Captions and colophon rows → `sm` tabular-nums. Micro labels → `xs` at 0.09em tracking, never a sentence. Accent caps checked against their ground before shipping.

### 3. Layout Specification
- **Composition**: two-equal, diagonal, right-weighted, interleaved, dense, syncopated, marginal, balanced, rail-to-band, statement. The two clauses bracket the work, so the phrase is threaded through the page (interleaved) rather than sitting as one poster block, and the honey→rose duotone splits on a corner-to-corner seam that literally reads before→after; content hangs off one right rail while the nav owns the left spine, which is why weight settles right.
- **CSS grid/flex structure**: outer `display: grid; grid-template-columns: 88px 1fr` (left spine + main). Main: `display: grid; grid-template-rows: auto auto auto auto` — clause-1 zone, two-equal content band (`grid-template-columns: 1fr 1fr`, work index | signals ledger), callout, clause-2 zone. A diagonal color seam (linear-gradient hard stop at ~118deg) carries honey in the upper-left, plum-rose in the lower-right across the whole main area.
- **Major dimensions**:
  - Hero/featured: clause-1 zone `min-height: 58vh`, clause-2 zone `min-height: 46vh`
  - Left spine: `width: 88px`, full height
  - Max content width: `max-width: none`; main padding `72px 6vw`; content band gutter 40px
  - Section padding: 72px vertical between zones; content rows on a 24px base unit
- **Nav placement**: left spine, full height, plum-rose field. Stacked single-color mark (cream) at the top inside the first fold, role line beneath, then Work / About / Contact as a vertical list reading down the spine, one hairline rule per row.
- **Hero phrase grid zone**: clause 1 occupies main rows 1, flush-right, top ~58vh of the honey region; clause 2 occupies the bottom row, flush-right, inside the plum-rose field, ~46vh. Each clause ≈96px at 1440.
- **Home callout slot**: on `/`, `<SiteCallout />` sits full-width between the signals-ledger content band and the closing clause-2 field, below the hero content and above the colophon footer. No copy or styling authored here.

### 4. Component Character
- **Border radius**: cards 4px (md), buttons/tags 2px (sm), field chips 0 (none). Structural, near-square, matching a builder's register.
- **Border treatment**: hairlines in `border` `#C9A24A` on honey; section breaks and the index rules in `borderStrong` `#7C2140`; inside the rose field use `fieldBorder` `#9C2A53`.
- **Shadow**: none. Depth comes from value between honey ground, pale surface and rose field, not shadow.
- **Density**: dense. Work index and signals ledger packed on a strict 24px baseline.
- **Interactive states**: `_hover` shifts nav links and index rows from `text` toward `accent`, with the row rule thickening to `borderStrong`; no motion beyond a 120ms color transition.

### 5. Signal Integration
- **Where signal elements live**: the right column of the content band is the signals ledger; the "Today in Design" sidebar links sit beneath it.
- **Sports scores**: tabular-nums in Bitter, stated flat. The one win is the bright note: "Tigers win, 9–2" set with a small raspberry `accent` chip (cream `accentText`). The two losses stated plainly in `text`: "Lions 31, 41." / "Red Wings 0, 1." No editorializing.
- **Quote display**: none today; the hero is Doug's own lifted line, not a quote. Attribution not required for a self-authored thesis.
- **Golf**: yesterday's Biltmore result demoted to a fact in the ledger: "Biltmore, final. Bridgeman −26." Under-par figures in honey-gold `fieldInkMuted` where they sit on the rose field, else in `text`.
- **Market**: "SPY 773.50, up 1.55%" one ledger row, tabular.
- **Weather / moon**: "Aldie, light rain, 59°F." and "Waxing gibbous, 87%." as quiet ledger rows in `textMuted`.
- **Music**: "On rotation: The War on Drugs, Radiohead." one `sm` caption at the base of the ledger, marked as taste, never beside a score as an event.
- **Holiday**: none today.
- **Air quality**: "Air good, AQI 1." folded into the ledger as a single micro row.

## Self-Check
1. Hero quotability: Yes — "Buildable before the first line of code. Faithful after the last." is a complete two-part claim, screenshot-worthy in isolation.
2. Because-of chain: Yes — two-clause promise → interleaved bracketing on a diagonal seam → two-hue duotone before/after → structural slab chassis → right-hung content off one rail.
3. Render feasibility: Yes — bitter `hero` clamps to 96px at 1440, well under its 160px ceiling; two 7-word clauses wrap cleanly in a right-hung column.
4. Canvas floor feasible: Yes — honey ground plus rose field plus a dense work/signals band fill the canvas; 82% is realistic for a duotone dense page.
5. Phone: Yes — at 360 clause one sets at `4xl`, three lines under the mark, inside the first 640px without cutting a word.

## Rationale
The phrase had to be Doug's, in the first fold, with the brand visible: the ratings have said so five times, and today handed over no quote to argue with. "Buildable before the first line of code. Faithful after the last." is his job in two clauses, and its structure decides everything. Two clauses on a before/after axis want to be threaded through the page, not stacked as one poster, so the hero is interleaved: clause one opens the top, the work and the signals sit between, clause two closes the bottom. The work is literally bracketed by the promise made before it and the promise kept after it.

The composition put the two clauses across a diagonal color seam so the page reads before→after in hue as well as position: honey-gold in the upper-left for what gets designed, deep plum-rose in the lower-right for what ships faithful. That is a duotone, two committed hues carrying the whole page with no neutral void, fresh against the recent drench, dark-void and light-ground run. The chassis is bitter-mulish: a sturdy screen slab with real heavy cuts, structural and weighted, the right register for "buildable" without tipping into condensed-caps shouting or a reflex serif. It is off the three most-worn faces, and its `hero` step lands at a considered 96px, a thesis rather than a scream. Type is set heavy, mixed case, roman, and flush-right, which is the fresh alignment and the honest one: content hangs off a single right edge while the nav owns the left spine.

The palette deviates from the 15–40° terracotta mandate on purpose. Yesterday was an 18° terracotta drench and the repetition check requires at least 60° of separation, so a third warm-earth day would read as the same page. 340° raspberry-rose is the point in the only open hue gap that sits farthest from every recent primary, and paired with honey-gold it is a jewel-tone duotone that is bold and warm, the committed gesture Risk 8 asks for. The mark is single-color cream on the plum-rose spine, honest on a two-hue day and contrast-clear inside the first fold at both widths; the day's signals close the page as a colophon, the Tigers win the one bright note, the two losses stated flat, the music named as taste.
