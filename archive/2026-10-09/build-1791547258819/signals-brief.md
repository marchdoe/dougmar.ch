# Signals Brief — 2026-10-09

## Hero Copy
What is easy and what is right

## Hero Rationale
This is the operative core of today's `signals.quote` (Albus Dumbledore): "Dark times lie ahead of us and there will be a time when we must choose between what is easy and what is right." The full line renders directly beneath the fragment with the author's name, so the attribution is in view and the fragment is the quotable creed over the body of work. I passed over nothing: the quote lane won on its own merits because the "easy versus right" choice is the exact tension Doug has built a career inside, and the overcast, new-moon, market-down signals give the "dark times" register a real ground to sit on. Owner's voice: Doug has spent ten years choosing the harder, right build (buildable, faithful to the mockup) over the easy one (ship whatever, pass files between teams); this is the line under all of it.

## Archetype
a creed over a broadsheet index

## Composition
columns: irregular-twelve
axis: vertical
symmetry: broken
hero_zone: upper-left
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: balanced
collapse: reorder
hero_object: list

## Composition Rationale
The phrase is a creed about choosing the harder, right path, so the proof has to be present: I moved hero_object off the suggested `artifact` to `list` because the whole catalog of work, not one piece, is what the creed stands over, and `list` is a fresh object besides. I moved hero_zone off `full-bleed` to `upper-left` so the standfirst anchors the bone field while the index flows below, and `collapse` off `hero-only` to `reorder` because a hero-only first fold contradicts a list that must lead with the creed then the work. The remaining axes held on the mandate's starting values (irregular-twelve, vertical, broken, measured, interrupted, none, balanced), which already read as a broadsheet index and need no push.

## Mobile
carrier: At 360 the duotone stacks as two stacked bands, the bone standfirst with the creed and mark on top, the spruce work index beneath, and the left spine label drops out.
first_fold: The fragment "What is easy and what is right" at 3xl on the bone band, the full quote and Dumbledore beneath it, and the 72px mark above.
order: standfirst (mark, creed, full quote), work index, about/contact links, colophon
hero_step_360: 3xl
nav_360: No bar; mark top-left of the bone band, the work index becomes the stacked nav directly below it.

## Chassis
spectral-albert

## Visual Specification
### 1. Color Specification
- **Primary hue**: 165° (deep spruce green). Cool, grave, evergreen; carries "dark times" without collapsing into a neutral black void, and reads as a committed hue rather than a tint.
- **Neutral palette** (spruce-tinted): 50 `#f4f6f4`, 100 `#e7ebe8`, 200 `#d0d7d2`, 300 `#aab4ad`, 400 `#7d8882`, 500 `#596560`, 600 `#434d49`, 700 `#333b38`, 800 `#232927`, 900 `#161a18`
- **Accent color** (emerald): light `#4fb391`, default `#1f9c76`, dark `#137a5a`, glow `#7fd4b8`
- **Secondary accent**: none. One emerald carries the page.
- **Background**: page bg `#1a332f` (deep spruce field), card/surface `#22433e`, deeper band bgAlt `#122421`, bone field `#eef4f1`
- **Text colors**: primary `#e9f0ec`, secondary `#a9bdb5`, muted/faint `#8fa69c`; on the bone field, ink `#163029`, muted ink `#356459`

### 2. Typography (spectral-albert)
- **Hero phrase rendering**: the fragment "What is easy and what is right" is the h1, set as the standfirst in `display` (Spectral) at the `4xl` step, small-caps, italic, light, flush left on the bone field, upper-left. The full quote plus "Albus Dumbledore" runs directly beneath it at `base` in the body face (Albert Sans), `textMuted` on bone. The phrase is one step down from the marquee object by design.
- **Type treatment**: project titles (the marquee object) in `display` at `hero_scale`, small-caps light italic. Standfirst `4xl`; index titles `hero`/`5xl` register via hero_scale; section heads `xl`; body and client sets `base`; years, roles and metadata `sm`; the vertical spine label and colophon micro-labels `2xs`. Spend the middle: a `lg` standfirst sentence sits over the index so the page never jumps title-to-body.

### 3. Layout Specification
- **Composition**: irregular-twelve / vertical / broken / upper-left / measured / interrupted / none / balanced / reorder / list. The quote is a creed and the proof is the work, so the work index leads and the fragment stands over it as the standfirst; a twelve-unit grid with per-row spans keeps the index from reading as a table.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 2vw; row-gap: clamp(28px, 4vh, 56px)`. Standfirst zone spans columns 1–5, rows 1–3 on the bone field. Index rows alternate spans (`3 / 13`, `1 / 10`, `4 / 12`) so no two rows align the same left edge except the single shared rail.
- **Major dimensions**:
  - Standfirst/bone zone: `min-height: 62vh`, full width of columns 1–5 at 1440.
  - No fixed sidebar; the left spine label occupies a 44px rotated gutter.
  - Max content width: `none`; `padding: 88px 6vw`.
  - Section padding: `clamp(48px, 7vh, 112px)` vertical; the caesura between selected work and experiments is a single `18vh` gap.
- **Nav placement**: none. No header bar, no rail. The work index is the navigation (in-content links to each `/work/*`); About and Contact sit as two small small-caps links low on the bone field. The mark lives top-left of the bone field.
- **Hero phrase grid zone**: columns 1–5, rows 1–3, bone field; standfirst at `4xl` (~80–96px at 1440), full quote deck beneath.
- **Home callout slot**: on `/`, place `<SiteCallout />` below the work index and above the colophon footer, between the experiments sub-list and the colophon block. Full width of the twelve-grid. No copy or styling from me.

### 4. Component Character
- **Border radius**: cards/panels `none` (0), tags/links `sm` (2px). Sharp, editorial.
- **Border treatment**: bordered with hairlines. `border` on index row rules, `borderStrong` on the caesura break and the standfirst underline, `fieldBorder` inside the bone field. The ground material is ruled lines.
- **Shadow**: none. Depth comes from the duotone value split, not shadow.
- **Density**: measured, leaning spacious; generous row rhythm, one hard caesura.
- **Interactive states**: index row hover fills to `surface` with the year flipping to `accent`; in-content links underline in `accent` on hover.

### 5. Signal Integration
- **Where signal elements live**: the colophon block (bgAlt `#122421`) at the page foot carries every signal as ruled rows; the weather drives the palette itself.
- **Sports/golf**: the Baycurrent Classic is in progress, so it is a quiet colophon row, not a hero: "Baycurrent Classic · Mitchell −11 · Bridgeman −11", `sm` with the leader figures in `accent`. No Detroit team is active.
- **How the quote is displayed**: it IS the hero. Fragment as the standfirst h1; full sentence plus "Albus Dumbledore" as the deck directly beneath, so attribution is never offstage.
- **Holiday**: "Columbus Day, Monday" as one `2xs` faint line in the colophon.
- **Weather**: "Aldie, Virginia · Overcast · 52°F" in the colophon; the overcast cool is why the whole page is spruce.
- **Market**: "SPY 773.93 ▾ 0.42%" colophon row, the down figure in `textMuted`, not accent.
- **Moon**: "New moon, 1.5% lit" colophon row; the near-dark moon is the duotone's gravity.
- **Music**: "On rotation: My Morning Jacket, Radiohead, The War on Drugs" as a taste line in the colophon, not dated beside the score.

## Self-Check
1. Hero quotability: Yes — "What is easy and what is right" is a known, poster-worthy line that reads as a creed in isolation, with full quote and author in view.
2. Because-of chain: Yes — the easy/right choice drove list-leads-with-work (the proof), the editorial Spectral chassis, the grave spruce duotone, and the creed-over-index layout.
3. Render feasibility: Yes — Spectral's 4xl standfirst and a ~108px titled index both fit a 1440×900 upper-left zone with the index flowing below without overflow.
4. Canvas floor feasible: Yes — a twelve-row index plus standfirst plus colophon fills ~72% of a 1440×900 viewport at measured density.
5. Phone: Yes — reorder pulls the fragment to lead at `3xl` on the bone band inside the first 640px without cutting a word.

## Rationale
The phrase is a trimmed line from today's Dumbledore quote, "What is easy and what is right," chosen because it is the one fragment that stands as a creed and because it names the choice Doug has made for ten years: the right build over the easy one, buildable before code and faithful after it. A creed needs its evidence beside it, so the composition leads with the work (`hero_object: list`): the index of projects, titles, years, roles and client sets runs down an irregular-twelve grid as the proof, and the fragment stands over it as the standfirst. That is the decision that breaks the eight-day "one poster line" template the owner flagged, because the object on the page changes, not only the grid.

The chassis is Spectral + Albert Sans, fresh across the last fourteen builds and the right literary, considered register for a reflective line about dark times; its quieter hero (96–120px) is reserved exactly for editorial phrases that should not shout, and its display italics let the creed lead in small-caps italic light. The palette is a two-green duotone, deep spruce field for the dark times and a pale bone band for the right choice, with one emerald turning on where the index earns a mark. The overcast 52°F day and the 1.5%-lit new moon are the ground truth for that gravity; the hue sits at 165° inside the mandate's 140–180° target.

Layout flows from all of it: the standfirst and the original green-and-blue mark sit upper-left on the bone field (a light pole where the mark finally gets a home in its own colors, not the sixteenth single-color render), the index flows below and right with per-row spans and a single hard caesura between selected work and experiments, and a ruled ground carries the broadsheet logic. Shell is `none`: no bar, no rail, the index is the navigation, which is the honest posture for a page whose whole argument is the work itself. The creed wipes in; the sections below reveal on scroll.
