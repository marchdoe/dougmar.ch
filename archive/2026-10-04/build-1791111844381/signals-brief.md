# Signals Brief — 2026-10-04

## Hero Copy
Make your mind your own business.

## Hero Rationale
Straight from `signals.quote`, Jack Butcher, a designer Doug reads. It carries because it is an aphorism about owning your own decisions, and Doug has spent ten years independent under Spaceman doing exactly that: no handoffs, no committee, design and engineering as one call. The double sense (mind your own business / make your mind your enterprise) gives it a poster's wit, and "Mind" is a word that wants to be enormous. The author renders in the deck beneath the word.
Owner's voice: Doug went deep in both crafts on purpose and answers to no one on how the work gets made; "make your mind your own business" is the principle he runs on, said by a designer he actually reads.

## Archetype
a defiant specimen poster, one word owned

## Composition
columns: two-equal
axis: diagonal
symmetry: right-weighted
hero_zone: full-bleed
density: dense
rhythm: syncopated
shell_posture: footer-only
field_ratio: drenched
collapse: split-to-sequence
hero_object: word

## Composition Rationale
The phrase wants one owned word, so I kept the mandate's `word` object and two-equal split (a deliberate echo of the 2026-06-13 fairway high-water mark: thesis word left, evidence rows right, both needing each other). I moved `hero_zone` off the suggested `interleaved` to `full-bleed`, because threading a one-word poster through the content would bury the single thing that has to dominate; the word owns the whole field instead. Dense, syncopated and drenched all stayed because the evidence column and the committed fuchsia flood genuinely earn them.

## Mobile
carrier: The giant word "Mind" leads, the aphorism stacks beneath it, then the evidence rows follow; adjacency keeps the thesis-and-evidence relationship the 1440 split made side by side.
first_fold: The mark top-left, then the hero word "Mind" and its deck "Make your mind your own business. Jack Butcher."
order: mark, hero word Mind, aphorism deck with attribution, selected work rows, signals ledger, footer nav
hero_step_360: 5xl
nav_360: Mark stays top-left of the hero at ~56px; the nav list drops into the full-width footer ledger as stacked ruled rows.

## Chassis
unbounded-figtree

## Visual Specification
### 1. Color Specification
- **Primary hue**: 312° (electric fuchsia/magenta). It sits far off the recent green window and reads as assertion, not atmosphere; the right register for a defiant aphorism.
- **Neutral palette** (magenta-tinted plum-ink): 50 `#FBF7FA`, 100 `#F3EDF1`, 200 `#E3D9E0`, 300 `#C9BBC6`, 400 `#9E8B99`, 500 `#766575`, 600 `#574A57`, 700 `#3C3340`, 800 `#251F2A`, 900 `#15101A`
- **Accent color** (same hue, used as fills/marks): light `#C01593`, default `#981073`, dark `#6E0C54`, glow `#E84FB8`
- **Secondary accent**: none. One hue carries the page at full saturation.
- **Background**: page bg `#E84FB8` (the drench), band bgAlt `#DE1FAD`, raised surface `#F088CE`, deep flooded field `#6E0C54`
- **Text colors**: primary text `#15101A`, secondary text `#251F2A`, faint/micro `#3C3340`; on the deep field, ink `#FBF7FA`, muted `#F7B9E1`

### 2. Typography
- **Hero phrase rendering**: `display` (Unbounded). The single word "Mind" set at ramp `hero` (fluid clamp, ~160px at 1440), the rest of the quote and the attribution set as the deck at `xl` directly under it. The full line is the one h1; "Mind" is the largest element on the page.
- **Type treatment**: `hero` for the poster word; `xl` for the quote deck; `2xl`/`3xl` for the section standfirsts (the mid-register the owner demands); `base` for the evidence rows and signal ledger at 1.5 leading, capped 62–68ch; `sm` for the footer nav; `xs` for micro labels above their rows (space above a label ≥ 2× the space below). Tabular figures on all scores and the market line.

### 3. Layout Specification
- **Composition**: two-equal / diagonal / right-weighted / full-bleed / dense / syncopated / footer-only / drenched / split-to-sequence / word. Two matched columns on one full-bleed fuchsia field: left is the thesis ("Mind" at poster scale), right is the evidence (dense cataloged rows). It is the fairway-split logic rebuilt in fuchsia, the word is the biggest object and the proof sits beside it.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1fr 1fr; column-gap: 4vw` at 1440; collapses to one column at 360.
- **Major dimensions**:
  - Hero field: `min-height: 92vh`, full-bleed fuchsia.
  - Max content width: `max-width: none`, `padding: 80px 6vw`. Reads full-width, not a centered column.
  - Section padding: 80px vertical rhythm at 1440, 48px at 360.
- **Nav placement**: footer-only. Nav deferred to a deep-fuchsia knockout ledger band at the foot; the mark lives top-left of the hero field, inside the first fold.
- **Hero phrase grid zone**: rows 1–2, left column (col 1 of 2), the word "Mind" occupying roughly the left 45% of the field; deck sits beneath it flush right within that column.
- **Home callout slot**: on `/`, place `<SiteCallout />` as a full-width band below the signals/evidence section and above the footer ledger band. I write no copy and no styling for it.

### 4. Component Character
- **Border radius**: cards 2px, buttons 2px, tags 0. Sharp, no soft corners (owner complaint).
- **Border treatment**: hairline rules in `border` (`#C01593`) between evidence rows; `borderStrong` (`#981073`) for section breaks; `fieldBorder` inside the deep ledger.
- **Shadow**: none. Depth is value (ink weight, field steps), not shadow.
- **Density**: dense right column, spacious around the poster word.
- **Interactive states**: links underline on hover in `accent`; row hover lifts the row ink to full `text` and the rule to `borderStrong`.

### 5. Signal Integration
- **Where signals live**: the dense right column and the footer ledger band.
- **Sports scores**: the Bank of Utah Championship leaderboard as a ruled ledger, Smotherman −23 at the top in `text` heavy, tabular figures, the leader row marked with an `accent` tick. Doug Ghim −22 below it.
- **Market**: one ledger line, SPY 769.64, +0.74%, tabular, dark ink.
- **Quote**: it IS the hero phrase, "Mind" at poster scale with the full line and "Jack Butcher" as the deck.
- **Weather**: a micro line, Aldie 58.7°F, overcast, in `textMuted`.
- **Lunar**: last quarter, 37% lit, as a faint metadata row.
- **Music**: Radiohead and Tobin Sprout as a single quiet rotation caption in the footer ledger, marked as taste, not an event.

## Self-Check
1. Hero quotability: Yes — a standalone aphorism by a named designer, screenshot-ready.
2. Because-of chain: Yes — word poster ("Mind") drove full-bleed drench, a loud blocky display, the committed single-hue palette, and the thesis/evidence split.
3. Render feasibility: Yes — Unbounded tops at 160px; "Mind" is four letters, no overflow at 1440.
4. Canvas floor feasible: Yes — dense evidence column plus full-bleed field easily clears 82%.
5. Phone: Yes — "Mind" at `5xl` (~72px) is ~260px wide, fits the 360 first fold uncut above the deck.

## Rationale
The phrase is Jack Butcher's "Make your mind your own business," and the one word that has to be owned is "Mind." That decides the object: a word poster. The word becomes the biggest thing on the page at `hero` scale, the full quote and the author sit beneath it as the deck, and the page splits into two equal columns so the thesis (the word) has evidence beside it (the dense cataloged rows and the day's signals). That split is the 2026-06-13 fairway high-water mark rebuilt deliberately: the two halves need each other.

The chassis is Unbounded, a blocky, wide geometric display that has never shipped here, set light. Light wide caps at 160px read as cool, owned confidence rather than a shout, which is the register of the line. The palette is a committed electric-fuchsia drench, one hue across roughly 78% of the field with near-black plum ink owning it. Fuchsia is the deliberate deviation from the 140–180° mandate: that band is already saturated by four recent builds, the repetition check demanded at least 60° off the recent window, and a line about owning your mind wants assertion, not another cyan-green atmosphere. 312° clears the recent greens entirely and stays out of the forbidden zones.

Layout follows: full-bleed field so the word dominates, footer-only shell so nothing competes above (the mono mark pinned top-left of the hero to satisfy the first-fold complaint), halftone screen for the poster register, and a settle entrance with a slow field drift so the page arrives with one quiet gesture. At 360 the split becomes a sequence, the word still leads, and the evidence follows directly beneath it.
