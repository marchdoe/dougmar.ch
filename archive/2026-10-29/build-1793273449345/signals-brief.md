# Signals Brief — 2026-10-29

## Hero Copy
Buildable before the first line of code. Faithful after the last.

## Hero Rationale
This is an Owner Voice line that has never shipped ("Buildable before the first line of code. Faithful after the last."), and it is the cleanest statement of Doug's whole thesis: he checks a design can be built before anyone writes code, and checks what ships matches what was drawn. It is two balanced clauses with a built-in before/after pivot, which is rarer and more quotable than another score or weather reading, and it carries the fog-calm, waning-moon stillness of the day better than a Pistons box score would. The lane is content-lifted, not the signal-event of yesterday.
Owner's voice: This is verbatim from his own list of lines he would say, the discipline he's built a ten-year practice on.

## Archetype
a blueprint read top to bottom, before the code mirrored against after

## Composition
columns: irregular-twelve
axis: vertical
symmetry: mirrored
hero_zone: interleaved
density: sparse
rhythm: syncopated
shell_posture: standard
field_ratio: field-dominant
collapse: hero-only
hero_object: statement

## Composition Rationale
The phrase has a literal before/after pivot, so symmetry stays mirrored and axis vertical: "Buildable before the first line of code." sits above the centerline, "Faithful after the last." below, reflected. I moved hero_zone off the mandate's `center` to `interleaved` so the mirror's seam can hold a thin band of today's signals, the actual present-day "code" written between before and after. After the mandate's avoid-lists, axis, density, rhythm and field_ratio each had only their suggested value left, and I kept irregular-twelve (for the mirrored offset spans 1–9 / 4–12), mirrored, standard (owner wants the header first-class, placed in a corner cluster not the rejected top bar), hero-only and statement because the phrase genuinely demands each.

## Mobile
carrier: At 360 the before/after mirror becomes a vertical sequence; the signal pivot band is the seam between the two clauses, so the before-code / after-code relationship survives by adjacency.
first_fold: The full hero phrase, both clauses set at 3xl in blueprint cyan and near-white on navy, with the corner mark above it. Nothing else.
order: hero phrase, signal pivot band, site callout, colophon footer
hero_step_360: 3xl
nav_360: Mark stays top-left corner at ~44px; the numbered nav collapses under it as 01/02/03 title-case links, each a ≥44px tap target.

## Chassis
zilla-worksans

## Visual Specification
### 1. Color Specification
- **Primary hue**: 220° (blueprint azure). A buildability statement wants the color of a plan: cyan-blue linework on a dark drafting field. 220° is the only region outside every forbidden zone in the color mandate (0–195, 246–306, 310–360 leave 196–245 open) and it sits farthest from the recent hue window, satisfying the repetition note.
- **Neutral palette (cool draft grey, tinted 220°)**: 50 #F1F5FB · 100 #DFE8F3 · 200 #BFD0E4 · 300 #93AAC8 · 400 #6A85A6 · 500 #466084 · 600 #2E466B · 700 #1D3250 · 800 #13243B · 900 #0B1A2E
- **Accent color (azure)**: light #9CCDF6 · default #38B6FF · dark #156FBF · glow #9CCDF6
- **Secondary accent (signal amber)**: #E8962A default, #F0AD45 light — only on positive signal data (Pistons win, SPY up).
- **Background**: page bg #0B1A2E (navy void), card/surface #1D3250, second ground bgAlt #13243B
- **Text colors**: primary #F1F5FB, secondary #93AAC8, muted/faint #6A85A6

### 2. Typography
- **Hero phrase rendering**: `display` (Zilla Slab) at the `hero` step, fluid clamp capped at 96px on 1440. Heavy slab weight, roman, mixed case. The phrase breaks across five short lines so each line clears the column; "before" and "after" set in `accent` cyan, the rest in `text` near-white, like blueprint linework carved into the field.
- **Type treatment**: hero at `hero` step; the central pivot band uses `md`/`lg` for place and date (the mid-register the owner asked for); decks and standfirsts at `lede`; signal labels at `sm`; metadata at `xs` (never below 12px). Body capped 62–68ch, leading held at the ramp's body step. One slab family, Work Sans body answering Zilla's low-contrast skeleton.

### 3. Layout Specification
- **Composition**: irregular-twelve / vertical / mirrored / interleaved / sparse / syncopated / standard / field-dominant / hero-only / statement. The two clauses mirror across the horizontal centerline (before above, after below), and a thin interleaved pivot band of today's signals sits between them as "the code" written in the present.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto auto auto;` clause one spans cols 1–9, pivot band spans cols 1–12, clause two spans cols 4–12 (the mirrored offset).
- **Major dimensions**:
  - Hero/featured area: `min-height: 100vh` on `/`, the phrase occupying the center two-thirds
  - No fixed sidebar; header is a top-left corner cluster
  - Max content width: `max-width: none`, `padding: 72px 6vw`; full-width field
  - Section padding: vertical rhythm on the chassis base unit, generous (sparse)
- **Nav placement**: top-left corner cluster only, no spanning bar
- **Hero phrase grid zone**: clause one rows 1, cols 1–9; pivot band row 2, cols 1–12; clause two row 3, cols 4–12; intended hero type ~96px at 1440
- **Home callout slot**: on `/`, below the interleaved hero and above the footer colophon, between the hero block and the colophon. Placed, not designed.

### 4. Component Character
- **Border radius**: cards/panels `none` (0), tags `sm` (2px), buttons `sm` (2px). Sharp, drafting-edge.
- **Border treatment**: bordered with `border` hairlines, `borderStrong` for section rules and the pivot band edges.
- **Shadow**: none. Depth comes from surface lightness over the void.
- **Density**: spacious (sparse).
- **Interactive states**: links shift `text`→`accent` on `_hover`, 1px azure underline grows; tap targets ≥44px.

### 5. Signal Integration
- **Where signals live**: the interleaved pivot band (place, date, fog) plus a footer colophon block.
- **Sports scores**: Pistons 97–89 win set in `md` with the figure in signal amber and an up-mark; World Series "Rays force Game 5, 4–3" as a one-line news item in `sm`.
- **Quote**: the Jefferson quote is NOT the hero; it appears attributed small in the footer colophon as the day's note.
- **Holiday**: Halloween, 2 days out, a small `xs` metadata chip in the colophon.
- **Music**: MMJ / Guided by Voices / Tobin Sprout listed as "in rotation" in the colophon, taste not event, no amber, no score styling.
- **Other signals**: fog 48.8°F / Aldie VA in the pivot band; SPY +0.34% in amber; waning gibbous 82%, golf (VidantaWorld Mexico Open, scheduled) in the colophon grid.

## Self-Check
1. Hero quotability: Yes — "Buildable before the first line of code. Faithful after the last." is a standalone maxim, two mirrored clauses, screenshot-ready.
2. Because-of chain: Yes — a buildability claim → mirrored before/after composition → structural slab chassis → blueprint azure → interleaved pivot band holding today as "the code".
3. Render feasibility: Yes — five short lines of Zilla heavy at 96px clear a 1268px column at 1440 with 6vw padding; no overflow.
4. Canvas floor feasible: Yes — five marquee type lines plus pivot band and footer fill ~74% of 1440×900 with the navy field dominant.
5. Phone: Yes — at 360 the full phrase sets at `3xl` across short lines inside the first 640px, hero-only, no word cut.

## Rationale
The phrase is Doug's own discipline stated plainly: a design is checked buildable before any code, and checked faithful after the last line ships. That before/after pivot is the whole design. Composition mirrors the two clauses across the horizontal centerline, vertical axis, "Buildable before the first line of code." above and "Faithful after the last." below, and the interleaved pivot band between them holds today's actual signals, the code being written in the present between the plan and the delivery. The irregular-twelve grid lets the clauses sit on offset spans (1–9, then 4–12) so the reflection reads as a slightly syncopated mirror rather than a dead-centered stack.

Zilla Slab is the chassis because a buildability claim wants a structural, built voice, not a fashion didone or a condensed shout. Its low-contrast slab reads as engineered and civic, Work Sans answers it on the same humanist skeleton (the owner's standing complaint about display and body sharing construction), and at the hero step it carries five short marquee lines without tipping into parody. I kept it off the three recently-used chassis and used it at heavy weight, mixed case, left, with the phrase itself as the field's texture.

The palette is blueprint logic made literal: a deep drafting-table navy ground (dark-void, a formula not used in the recent window) with the phrase drawn in blueprint cyan and near-white, like linework on a plan. 220° is the one hue outside every forbidden zone and the farthest from the recent window, which also fixes the repetition note. One amber accent is held back for the day's positive results only (Pistons 97–89, SPY up), so the cool field stays dominant. Grain gives the navy a printed, drafting-paper register; the mark sits original-colour in a top-left corner cluster, its white disc clearing contrast on the navy in both schemes.
