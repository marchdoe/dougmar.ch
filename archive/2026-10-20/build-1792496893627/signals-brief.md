# Signals Brief — 2026-10-20

## Hero Copy
Closing the gap between what gets designed and what gets built.

## Hero Rationale
This is Doug's own thesis, lifted straight from his voice file's "Lines I would say," and it is the one line that answers today's loudest design signal: the "Design in the material you ship" piece arguing a designer should know code the way an architect knows stone. Where that article is somebody else's framing, this is Doug's, and it earns the page because the artifact under it (Spaceman, ten years, Zeldman through Rolex) is the proof. The gap-closing is literally what he was hired to do for those clients. It beats the Chesterton quote, which is about faith, not about the work.
Owner's voice: Doug says this verbatim; it's his sentence about the one job he's spent a career on.

## Archetype
a client ledger reversed out of azure, the project title set like a departure board

## Composition
columns: two-asymmetric
axis: vertical
symmetry: broken
hero_zone: interleaved
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: drenched
collapse: split-to-sequence
hero_object: artifact

## Composition Rationale
The artifact leads with Doug's strongest evidence (Spaceman and its client roster), so the phrase works as its caption and the proof carries the thesis. I moved axis off the mandate's `radial` to `vertical` because a client ledger is read top to bottom and radial would scatter an ordered list; I moved symmetry off `mirrored` to `broken` because an asymmetric metadata-margin plus ledger cannot reflect, and the rhythm's single caesura (`interrupted`) is where the phrase caption breaks the row grid. Everything else sits on the mandate's starting tuple.

## Mobile
carrier: At 360 the two columns become one sequence; the oversized SPACEMAN title stacked directly above its hairline-ruled client ledger carries the artifact, the phrase caption sitting between them.
first_fold: The SPACEMAN title and the phrase caption "Closing the gap between what gets designed and what gets built."
order: mark, SPACEMAN title, project meta (2018, Founder), phrase caption, client ledger, signals colophon, site-callout, footer
hero_step_360: 2xl
nav_360: No chrome; mark top-left above the title, Work/About/Contact as inline links inside the ledger.

## Chassis
space-mono-archivo

## Visual Specification
## 1. Color Specification

- **Primary hue**: 212° deep azure. It reads as the cold clear 46°F October sky and as the engineering/code register, and it sits 60°+ off the warm 36–80° cluster the last month leaned on (repetition check flagged a 4° repeat). Deviation from the 40–80° target is deliberate: the mandate's own forbidden zone (0–110°) swallows its target, and the repetition gate demands distance from the warm window.
- **Neutral palette** (azure-tinted): 50 `#f8fbff`, 100 `#eef3f9`, 200 `#cdd9e6`, 300 `#a6b6c9`, 400 `#7789a3`, 500 `#576a85`, 600 `#42526a`, 700 `#2f3c4e`, 800 `#1e2734`, 900 `#111823`
- **Primary azure scale**: 50 `#edf4fc`, 100 `#d3e5f8`, 200 `#a7ccf1`, 300 `#84b7eb`, 400 `#3a83d6`, 500 `#1a66c0`, 600 `#125aa8`, 700 `#0e4789`, 800 `#0a335f`, 900 `#07213f`
- **Accent color** (amber): light `#f8b44d`, default `#f5a623`, dark `#b86f0a`, glow `#f8b44d`
- **Secondary accent**: none beyond the amber mark; the amber is the one saturated counterpoint.
- **Background**: page bg `#0e4789` (deep azure drench), callout/band bgAlt `#0a335f`, raised surface `#125aa8`, knockout field plane `#07213f`
- **Text colors**: primary text `#edf4fc`, secondary `#a7ccf1`, faint/metadata `#84b7eb`

## 2. Typography (space-mono-archivo)

- **Hero phrase rendering**: the phrase is the page's one h1, set in the `3xl` step in Space Mono, roman, flush left under the artifact title, color `text` `#edf4fc`. It is the caption; the artifact title is the marquee.
- **Artifact title**: "SPACEMAN" set at the `hero` step, Space Mono caps, weight heavy (700), as an oversized type-ground that the ledger sits with. This is the largest object.
- **Type treatment**: `hero` for SPACEMAN; `3xl` for the phrase caption; `lg`/`md` for client rows (Archivo body); `sm` and `xs` for the margin metadata and colophon. The mid-register is carried by the client roster rows at `lg` and the project standfirst at `md`, so there is no jump from marquee straight to micro. Body (Archivo) holds 60–68ch at leading 1.55.

## 3. Layout Specification

- **Composition**: two-asymmetric / vertical / broken / interleaved / measured / interrupted / none / drenched / split-to-sequence / artifact. A narrow left margin column holds the year, role, a small attributed epigraph and in-content links; the wide right column leads with SPACEMAN and the hairline-ruled client ledger, the phrase threaded in as its caption. The asymmetry and the single left rail serve a thesis about one unified job.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: minmax(180px, 0.9fr) minmax(0, 2.6fr); column-gap: clamp(32px, 5vw, 88px);`
- **Major dimensions**:
  - Hero/artifact area: `min-height: 92vh`
  - Left margin column: `~26%` (not a shell rail; it holds content)
  - Max content width: `max-width: none`; side padding `clamp(28px, 6vw, 112px)`
  - Section padding: vertical rhythm on the chassis base unit; client rows ~`1.4` line-boxes tall with hairline `border` rules, taller tap boxes on phone
- **Nav placement**: no chrome bar (shell_posture none). Work/About/Contact are in-content links woven into the ledger and the margin.
- **Hero phrase grid zone**: SPACEMAN occupies rows 1–2 of the right column; the phrase caption sits rows 3–4 of the right column directly beneath it, inside the first fold at `hero`/`3xl`.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the client-ledger section and above the footer colophon, between the ledger and the footer. I place it; I do not design or write it.

## 4. Component Character

- **Border radius**: cards/panels `none` (0), tags `sm` (2px), the circular mark is the only round form.
- **Border treatment**: hairline `border` `#1a66c0` between client rows; `borderStrong` `#3a83d6` for the one section break above the colophon.
- **Shadow**: none. Depth is value, not shadow (drench).
- **Density**: measured; generous rows, one caesura gap before the phrase caption.
- **Interactive states**: in-content links shift from `text` to `accent` `#f5a623` on hover with a 1px amber underline; no motion on hover.

## 5. Signal Integration

- **Signal elements**: live in the footer knockout colophon on the `field` plane `#07213f`, as a tabular index.
- **Sports scores**: all Detroit teams off-season; one quiet faint line "Lions, Tigers, Pistons, Red Wings, off-season."
- **Golf**: "Butterfield Bermuda Championship, scheduled." one tabular row, no leaders yet.
- **Market**: "SPY 766.48, up 0.42%." tabular, `textFaint`.
- **Quote**: Chesterton is NOT the hero. It sits small and attributed in the left margin as a secondary epigraph: "Faith means believing the unbelievable. — G.K. Chesterton," `textMuted`, clearly subordinate.
- **Weather/sun/moon**: "Aldie, Virginia. Clear, 46°F. Waxing gibbous, 74%." in the colophon.
- **Music**: The War on Drugs and My Morning Jacket set as a taste line in the colophon ("On rotation:"), never as a dated event.

## Self-Check
1. Hero quotability: Yes — it is Doug's standalone thesis, screenshot-worthy for any designer-developer.
2. Because-of chain: Yes — a line about closing design↔build into one job drives drench (one hue), the artifact lead (the proof), the mono/engineering chassis, the azure field with one amber mark.
3. Render feasibility: Yes — Space Mono hero clamps to 148px max at 1440 (under the 160 ceiling), SPACEMAN is 8 chars and fits the wide column; phrase caption at 3xl clears.
4. Canvas floor feasible: Yes — drenched azure fills the field, the ledger and margin fill the right and left columns, 78% is reachable.
5. Phone: Yes — SPACEMAN at 4xl and the caption at 2xl both land inside the first 640px without cutting a word.

## Rationale
The phrase is Doug's thesis, "Closing the gap between what gets designed and what gets built," and a thesis about two jobs made one wants a composition that leads with the proof. So the hero object is `artifact`: Spaceman leads with its year, role and client set (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass), and the phrase sits as its caption. The title gets marquee; the line steps down to a caption and stays the single h1. The two-asymmetric column, single left rail and interrupted ledger rhythm all serve reading the evidence in order, with one caesura where the caption breaks the grid.

The chassis is space-mono-archivo because the line is half about code. Space Mono sets SPACEMAN like a departure board or a terminal readout, which is the "built" register made visible, and Archivo answers it with a clean, mechanical grotesk that shares its even, engineered construction for the client rows, so display and body share a skeleton. Mono is earned here rather than costume: Doug is a developer, and the phrase is literally about build. The palette is a drenched 212° azure because one committed hue is the visual form of "one job, not two," and because it lands 60°+ off a month of warm golds that the repetition gate flagged. A cold clear 46°F October morning justifies the cool field. One amber mark is the only saturated counterpoint: the designed half, against the built-blue field.

Layout follows: drench fills the field, the artifact and ledger fill the wide column, the margin holds metadata, the Chesterton quote and the in-content links. No chrome bar; the stacked-lg mark anchors the hero top-left and stays in the first fold at both widths. The wipe entrance flips SPACEMAN in left to right like a board resolving, then the page holds still. At 360 the two columns sequence into one, SPACEMAN over its ledger, the caption between them, adjacency keeping the artifact-and-caption relationship intact.
