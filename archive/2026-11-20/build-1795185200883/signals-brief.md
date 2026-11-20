# Signals Brief — 2026-11-20

## Hero Copy
What ships should look like what was designed.

## Hero Rationale
Lifted from my own capability lines: the one sentence that states what I actually do, fidelity between the mockup and the merge. Today's inputs circle the same idea from the outside, a game about craft and impermanence, a Toyota-museum note that in making things we make ourselves, a post that only the human merges, so the honest Doug version of that mood is the fidelity line, not a borrowed quote. It beats a composed signal line because the market is down and the Detroit teams are all off-season, so there is no event worth shouting, and the lane breaks yesterday's and the day-before's composed streak. Owner's voice: I say what a thing does, and this is the thing I do, what ships should look like what was designed.

## Archetype
a blueprint title-block specimen, the spec resolving into one warm word

## Composition
columns: two-equal
axis: radial
symmetry: mirrored
hero_zone: lower-third
density: sparse
rhythm: accelerating
shell_posture: marginal
field_ratio: field-dominant
collapse: rail-to-band
hero_object: word

## Composition Rationale
The phrase is a creed that resolves into one word, so the word is the radial anchor low on the field and the sentence accelerates down into it, mirrored across the gutter. I moved columns off the mandate's suggestion (two-equal, not three) specifically to break from 2026-11-16, which shared six axes with the starting tuple; two-equal gives the mirror axis the gutter the radial needs. Everything else serves the single resolved word, which is the whole argument.

## Mobile
carrier: The sentence reads straight down and resolves into the marquee word; the left spine becomes a full-width top band.
first_fold: The lead-in "What ships should look like what was" and the marquee word "Designed." both inside the first 640px.
order: mark+nav band, hero (lead-in then Designed.), signal band, site callout, title-block colophon
hero_step_360: 4xl
nav_360: The left spine collapses to a full-width top band: mark left, Work / About / Contact as a small-caps row with amber rules.

## Chassis
fraunces-karla

## Visual Specification
### 1. Color Specification

- **Primary hue**: 230° ultramarine. The subject is fidelity between a design and what ships, and a blueprint is literally the design made law. The hue also honors the only clean zone in today's mandate (200–323°) and sits 180° from yesterday's gold run, which the repetition check demanded.
- **Neutral palette (ink-blue)**: 50 `#F4F6FD`, 100 `#E7EAF6`, 200 `#CDD4EA`, 300 `#AAB4D6`, 400 `#818CB6`, 500 `#5E6893`, 600 `#474F75`, 700 `#333A58`, 800 `#22283E`, 900 `#141627`
- **Accent color (chalk amber)**: light `#FFD58A`, default `#ECA23D`, dark `#C67E22`, glow `#FFD58A`
- **Secondary accent**: amber is the duotone's second hue, not a tertiary; it carries the resolved word, the signal figures and every rule.
- **Background**: page bg `#22329E` (blue-700), band/bgAlt `#1C2878` (blue-800), surface `#2B3FC4` (blue-600)
- **Text colors**: primary `#EAF0FF`, secondary `#BBC7FF`, faint `#8FA0F0`

### 2. Typography

- **Hero phrase rendering**: `display` (Fraunces). The resolved word "Designed." is set at the `hero` step as the poster object; the lead-in "What ships should look like what was" sits above it at `2xl`, so the sentence reads downward and resolves into the one warm word. The full sentence is the single `h1`.
- **Type treatment**: `hero` for the marquee word; `2xl` for the lead-in deck; `lg` for the signal-band leaderboard line and the title-block fields; `md` for the rail nav and the standfirst; `base` for body and captions; `xs` for metadata. Italic lead across the whole hero (Fraunces loads display italics), heavy weight on the marquee word. At least one mid-register element (the `lg` title-block / standfirst) sits between the marquee and body so the page is never a two-size jump.

### 3. Layout Specification

- **Composition**: two-equal / radial / mirrored / lower-third / sparse / accelerating / marginal / field-dominant / rail-to-band / word. The marquee word is the radial anchor low on the field; the lead-in and the day's facts are placed by distance from it, mirrored across the gutter, so every element points at the resolved word, which is the thesis.
- **CSS grid/flex structure**: outer `display: grid; grid-template-columns: 96px 1fr;` (left rail + field). Inside the field: `display: grid; grid-template-columns: 1fr 1fr; align-content: end;` the hero spans `grid-column: 1 / -1`.
- **Major dimensions**:
  - Hero field min-height: `92vh`
  - Left rail width: `96px` at 1440
  - Max content width: `max-width: none`; field padding `clamp(40px, 6vw, 112px)` on the right/left of the field, rail excluded
  - Section padding: vertical rhythm in multiples of the chassis base; signal band `padding: 64px clamp(40px,6vw,112px)`
- **Nav placement**: left spine rail, full height, `96px` wide; stacked-md mark at top, vertical index beneath.
- **Hero phrase grid zone**: lead-in in rows 1–2 spanning both field columns, lower third; marquee "Designed." in row 3 spanning both columns, baseline near the 82% line. Marquee intended `clamp(72px, 11vw, 158px)`.
- **Home callout slot**: on `/`, place `<SiteCallout />` below the signal band and above the footer title-block, between the signal band and the colophon. No copy or styling from me.

### 4. Component Character

- **Border radius**: cards/bands `4px`, buttons `4px`, tags `2px` (sharp, technical).
- **Border treatment**: bordered with amber hairlines; `border` for default rules, `borderStrong` for the title-block frame and band edges.
- **Shadow**: none. Depth comes from the surface value step, not shadow.
- **Density**: spacious; sparse field, generous intervals that tighten toward the marquee (accelerating).
- **Interactive states**: nav rows underline in amber on hover; links shift `text` → `accent`.

### 5. Signal Integration

- **Where signal elements live**: an amber field band directly below the hero carries the day's facts; the rail carries weather and place; the title-block footer carries taste notes.
- **Sports scores**: RSM Classic, Svensson −8, Greyserman and Higgo −7, set as a `lg` leaderboard line in `fieldInk` with tabular figures on the amber band.
- **Quote**: none today; the hero is the lifted line.
- **Market**: SPY 715.87, −1.96% with a down caret, `lg` tabular on the amber band in `fieldInkMuted`.
- **Weather**: Aldie, 53°F, sunny, 9.7h daylight, sunset 16:47, in the rail as `base` metadata.
- **Holiday**: Thanksgiving in 6 days, a small `xs` note in the title-block.
- **Music**: Radiohead, Tobin Sprout, My Morning Jacket set as "On rotation" in the footer title-block, taste not event.
- **Other**: waxing gibbous 88%, AQI good, as `xs` metadata in the title-block fields.

## Self-Check
1. Hero quotability: Yes — a plain creed about the work, quotable standing alone.
2. Because-of chain: Yes — fidelity creed → word resolves out of the sentence → warm Fraunces against cold blueprint blue → duotone.
3. Render feasibility: Yes — Fraunces hero is 160px at 1440; "Designed." fits at clamp max 158.
4. Canvas floor feasible: Yes — field-dominant blue fills the canvas; the band and rail carry the rest.
5. Phone: Yes — "Designed." at 4xl clears the first 640px without cutting its eight letters.

## Rationale
The phrase is my fidelity creed, what ships should look like what was designed, and the day's references all circle it from outside: a game about craft, a museum note that in making things we make ourselves, a post that only the human merges. The honest Doug version of that mood is the line about the work, not a borrowed quote, so the lane is content-lifted and it breaks the two-day composed streak. The object is one word: the sentence reads down and resolves into "Designed." set huge, because the whole argument is that the drawing and the shipped thing are the same, and the word that proves it earns the field.

The composition is a mirrored radial anchored low, two equal columns so the gutter is the mirror axis, the lead-in and the day's facts placed by distance from the resolved word. I moved columns off the mandate's three to two-equal specifically to break from 2026-11-16, which the repetition check flagged. Chassis is fraunces-karla, fresh against the last fourteen builds, a fat warm serif that loads display italics; the warmth of the letterforms is the human signal against the cold spec blue, and at 160px the word fills the field.

The palette is a duotone: blueprint ultramarine at 230° carries the page as the drawing, chalk amber lands on the one resolved word and the day's facts. Blue sits in the only clean zone the mandate leaves open and 180° from the recent warm run; the amber keeps it committed and alive rather than cold. Nav is a left spine with a stacked mark and a ruled vertical index, the footer a drawing title-block, both reading as a spec sheet, which is the thesis made furniture.
