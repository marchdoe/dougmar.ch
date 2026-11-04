# Signals Brief — 2026-11-04

## Hero Copy
The week's spelling words in. A week of practice out.

## Hero Rationale
This is the caption on a single featured artifact, FishSticks, Doug's own spelling app, distilled from its description in the portfolio (a spelling app built around the words a kid is actually tested on). It wins over another design-versus-build headline because the last five heroes circled that same thesis; leading with one real, warm, human product breaks the rut and shows the work instead of restating the manifesto. It states what the thing does in input and output terms, no hype, no feature invention beyond the record.
Owner's voice: Doug explains a product the way he'd explain it to another parent, plain nouns, what goes in and what comes out, never how it feels.

## Archetype
a spec sheet for a built product: chalkboard board beside a ruled worksheet

## Composition
columns: two-asymmetric
axis: vertical
symmetry: left-weighted
hero_zone: upper-left
density: dense
rhythm: even
shell_posture: folded-into-hero
field_ratio: balanced
collapse: split-to-sequence
hero_object: artifact

## Composition Rationale
Artifact leads because one real product carries the caption better than a sixth design-versus-build statement. I moved axis to vertical off the suggested diagonal (a project spec reads top to bottom, title then caption then premise), symmetry to left-weighted off mirrored (the board weights the left, the worksheet is margin), and shell_posture to folded-into-hero off none (the mark has to sit in the first fold and the header is a real surface, not absence). Collapse is split-to-sequence off reorder because an honest split field becomes a stack of full-width panels at 360, not a shuffled single column.

## Mobile
carrier: The green board goes full width as the first panel with `fishsticks` reversed and the caption beneath it; the cream worksheet panels follow in sequence, their adjacency keeping the board-and-day relationship.
first_fold: the folded mark and lockup, then the title `fishsticks`, then the h1 caption "The week's spelling words in. A week of practice out."
order: mark + lockup, fishsticks artifact (title, year, role, caption, premise), selected-work index, signals ledger, site callout, footer
hero_step_360: 3xl
nav_360: lockup stays top-left of the green panel at 44px; the one-sentence nav wraps to two mono lines beneath it, links still inline.

## Chassis
space-mono-archivo

## Visual Specification
### 1. Color Specification
- **Primary hue**: 158° chalkboard green. A deep school-chalkboard green reads as the surface a word list gets written on, which is the literal premise of the featured app. It lands inside the 140-180 target; I pushed it toward the yellow-green edge (158, not 165-174 which three recent builds used) and desaturated-deep so it reads as a board, not teal.
- **Neutral palette** (worksheet sand, warm, faintly green-tinted): 50 `#FAF8F1`, 100 `#F4F1E7`, 200 `#E9E4D5`, 300 `#D8D1BD`, 400 `#BDB49C`, 500 `#958C76`, 600 `#6E6857`, 700 `#4E4A3D`, 800 `#302D25`, 900 `#1A1813`
- **Accent color** (red grading pen): light `#E3705E`, default `#C23A2E`, dark `#80241C`, glow `#E3705E`
- **Secondary accent**: none. The red is the single accent; green is the primary/field.
- **Background**: page bg `#FAF8F1` (cream worksheet), card/surface `#F4F1E7`, the green board field `#123528`
- **Text colors**: primary `#0C2319` (deep green-black ink on cream), secondary `#1C4A36`, muted/faint `#6E6857`; on the green field, chalk ink `#ECF4EF` and muted chalk `#A7CDB8`

### 2. Typography
- **Hero phrase rendering**: the h1 is the caption, "The week's spelling words in. A week of practice out.", set in `display` (Space Mono) at the `4xl` step, italic, reversed in chalk ink on the green board, sitting directly under the artifact title. The artifact title `fishsticks` is the marquee object, set in `display` at the custom `hero_scale` clamp (below the marquee ceiling), lowercase like a package name.
- **Type treatment**: title at `hero_scale`; caption (h1) at `4xl`; the premise standfirst at `lg`; project-index rows and ledger key:value lines at `base`; specimen size-markers and metadata at `sm` and `2xs`. At least one mid-register element (the `lg` standfirst) sits between title and body so the page is never two sizes.

### 3. Layout Specification
- **Composition**: two-asymmetric / vertical / left-weighted / upper-left / dense / even / folded-into-hero / balanced / split-to-sequence / artifact. The wide left board holds one project at poster scale with its caption; the narrow right worksheet runs the day as a ledger. The split field is the argument: board (the work) beside worksheet (the day).
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1.62fr 1fr;` for the hero; the project index below is `display: grid; grid-template-columns: repeat(12, 1fr)` with rows spanning full width.
- **Major dimensions**:
  - Hero board min-height `92vh`
  - Right worksheet margin `width: 38%` (the 1fr of the split)
  - Max content width: `max-width: none`, side padding `64px 5vw`
  - Section padding: `96px 5vw` on the index and footer; `48px` internal gutters, held on a single baseline unit
- **Nav placement**: folded into the top of the green board, top-left. Horizontal lockup, then one running mono sentence below it carrying the three links. No top bar.
- **Hero phrase grid zone**: rows 2-4 of the left column (under the ~72px folded header), the title at `hero_scale` on one line, the caption (h1) immediately beneath at `4xl`, both flush left on the single rail.
- **Home callout slot**: on `/`, place `<SiteCallout />` full width below the selected-work index and above the footer, between the index and the spec-metadata footer. No copy or styling from me.

### 4. Component Character
- **Border radius**: cards `2px`, buttons `2px`, tags `2px`. Crisp, no soft corners.
- **Border treatment**: bordered with hairlines, `border` on cream, `fieldBorder` on the board. Index rows separated by one `borderStrong` rule each.
- **Shadow**: none. Planes separate by value, not shadow.
- **Density**: dense, information-forward, small gutters on a strict baseline.
- **Interactive states**: links underline on hover; index rows shift ink to `accent` (red) on hover, no motion.

### 5. Signal Integration
- **Where signal elements live**: the cream worksheet margin at 1440, as a ruled ledger of mono key:value rows; it moves below the artifact at 360.
- **Sports scores**: Red Wings `L 2–4` set with the red grading-pen accent (`accent`), the only red on the page, the way a teacher marks a miss. En dash inside the score only.
- **Quote**: none today; no quote furniture.
- **Holiday**: Veterans Day shown as an upcoming row, `nov 11 · veterans day · +7`, in `textFaint`.
- **Music**: labeled `in rotation` (taste, not an event): Radiohead, The War on Drugs, Tobin Sprout, in a muted ledger row, never beside a score as if it happened today.
- **Other signals**: `weather · mist · 52°F · 95% rh`, `SPY 754.35 ▲ 0.30%` (up mark in green), `moon · waning crescent · 22%`, `golf · WWT Championship · scheduled`. All concrete, all present as spec rows.

## Self-Check
1. Hero quotability: Yes — "The week's spelling words in. A week of practice out." is a complete two-beat line that reads as a product's whole premise, not a sentence fragment.
2. Because-of chain: Yes — a product caption wants an artifact lead, an artifact-plus-day wants a split field, a built product wants the mono spec register, and the two grounds set the palette.
3. Render feasibility: Yes — `fishsticks` (10 mono glyphs) at clamp max 120px fits the 62% left column at 1440 with padding to spare.
4. Canvas floor feasible: Yes — two full columns, a 12-row index, a ledger and a footer fill a dense specimen past 82%.
5. Phone: Yes — the green board goes full width first, mark then title then caption at `3xl` lands inside 596px below the site rail without cutting a word.

## Rationale
The phrase is a product's whole premise stated as input and output, so the page has to be about that product. That demands an artifact lead: one piece of owned work, FishSticks, at poster scale, with the line as its caption and the h1. Leading with a real built thing is also the strongest answer to the owner's standing note that the page reads as templated, and it breaks a five-build run of design-versus-build and golf heroes by putting a warm, human product up front instead.

An artifact beside the day wants two grounds, not one, so the ground is split-field: a deep chalkboard-green board carries the project, a ruled cream worksheet margin carries the facts. That concept is literal, a word list gets written on a board, and it keeps me inside the 140-180 green target while reading as a board rather than the teal three recent builds used. The one accent is a red grading pen, the single mark on the page, reserved for the one loss and the live up-tick, the way a teacher marks a miss.

A product Doug designed and built reads best in a spec register, which is why the chassis is Space Mono plus Archivo, never shipped recently and tied to today's own sidebar (Paper Mono, a terminal-design piece): `fishsticks` set lowercase like a package name, the caption in true mono italic like a code comment. Lowercase and italic both move off the recency walls, and left alignment is the only honest setting for type that reads as a spec. The folded header keeps the white-disc mark in the first fold on dark green where it passes contrast, the index and ledger fill both columns to a dense specimen, and at 360 the split simply becomes a sequence: board first, worksheet after.
