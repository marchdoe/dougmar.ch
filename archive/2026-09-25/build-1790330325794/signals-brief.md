# Signals Brief — 2026-09-25

## Hero Copy
People rarely succeed unless they have fun in what they are doing.

## Hero Rationale
This is `signals.quote`, Dale Carnegie, and it carries the page because it is not a borrowed abstraction here: Doug runs Spaceman for the paying work and builds FishSticks and 15th Club on the side, golf plus AI, a spelling app that reads the list the teacher sent home, because they are fun. The line is his working thesis stated by someone else, and it lands warm on a Friday full moon with a Red Wings win to point at. Carnegie is named in the deck directly under the line, so the attribution is in view. Owner's voice: Doug says he's gone deep in both crafts on purpose and keeps shipping small experiments for the joy of it, so a line about succeeding by having fun is one he'd nod at.

## Archetype
A warm specimen poster, one line reversed out of a fairway-green field.

## Composition
columns: single
axis: radial
symmetry: symmetric
hero_zone: center
density: sparse
rhythm: accelerating
shell_posture: standard
field_ratio: drenched
collapse: reorder
hero_object: statement

## Composition Rationale
A whole-sentence aphorism wants to be read as one anchored block, so I moved `hero_object` off the mandate's `figure` to `statement`: the quote is the largest thing on the page and everything orbits it, which is why `symmetry` is `symmetric` (a centred quote is reflected on one axis, not a repeated pair) rather than the suggested `mirrored`. The rest of the tuple holds the mandate's starting values because they genuinely fit a centred quote poster: single column, radial around center, sparse field, drenched ground, and a standard shell present as legible chrome, which also moves off the recent none/folded/marginal shells.

## Mobile
carrier: The quote itself, full-width and centred on the green field, carries the idea; nothing structural at 1440 needs to survive because the composition was already one centred column.
first_fold: The hero quote, "People rarely succeed unless they have fun in what they are doing," with Carnegie named beneath it.
order: hero quote, Red Wings win note, remaining signals, work links, colophon footer
hero_step_360: 3xl
nav_360: Mark stays top-left corner; the nav sentence drops below the hero as one centred small-caps line above the signal rows.

## Chassis
fraunces-karla

## Visual Specification
### 1. Color Specification
- **Primary hue**: 152° (fairway green). Sits inside the 140–180° mandate, and green is Doug's own register (golf, the fairway split gold standard); saturated it reads buoyant rather than clinical, which the "have fun" line asks for.
- **Neutral palette (sage-cream)**: 50 `#F4F5EC`, 100 `#E6E9DC`, 200 `#CBD2BE`, 300 `#A9B49B`, 400 `#7F8C71`, 500 `#5C6A50`, 600 `#45513B`, 700 `#333D2C`, 800 `#232B1E`, 900 `#151A11`
- **Accent color (marigold)**: light `#F9C74B`, default `#F2B535`, dark `#BC8114`, glow `#FDE9B4`
- **Secondary accent**: marigold is the only accent; used for the Red Wings win figure and small under-par golf marks against the green.
- **Background**: page bg `#0C5730` (green 700, the drench field), card/surface bg `#0F6B3B` (green 600), footer band bgAlt `#084324` (green 800)
- **Text colors**: primary `#F4F5EC` (cream), secondary `#BFCBB2`, muted/faint `#93A188`

### 2. Typography
- **Hero phrase rendering**: `display` face (Fraunces) at the `hero` ramp step, set as a fluid clamp `clamp(40px, 7vw, 104px)`, italic, light weight, centred, reversed cream out of the green field. The full sentence wraps three to four centred lines and fills the field. Dale Carnegie is named directly beneath at `lg`, roman, in `textMuted`.
- **Type treatment**: hero at `hero`; the author/deck at `lg`; section heads (SIGNALS, SELECTED WORK) at `xl` small-caps; the Red Wings figure at `4xl`; body at `base` (Karla, 1.55 leading, capped 62ch); captions and metadata at `xs`. Every step is a `textStyle` token; I name steps, not raw leading. A mid-register standfirst at `2xl` sits between hero and body so the scale is spent, not jumped.

### 3. Layout Specification
- **Composition**: single / radial / symmetric / center / sparse / accelerating / standard / drenched / reorder / statement. One column carries everything, content orbits the centred quote, and the field floods the surface so the line reads as a poster with air on all four sides.
- **CSS grid/flex structure**: `display: grid; grid-template-rows: auto 1fr auto auto; justify-items: center` for `/`; hero is a centred flex column with `max-width: 30ch` on the quote block.
- **Major dimensions**:
  - Hero/featured area: `min-height: 88vh`, quote centred with clearance all sides
  - No sidebar
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 112px)`; body prose insets to ≤62ch centred
  - Section padding: intervals accelerate top to bottom, `160px` around the hero down to `48px` between the closing signal rows
- **Nav placement**: mark + wordmark in the top-left corner; Work / About / Contact as one small centred running sentence low in the hero field, above the colophon. No links set opposite the mark.
- **Hero phrase grid zone**: row 1, centred, occupying roughly the middle 60% of the viewport width and 55vh of height at 1440.
- **Home callout slot**: on `/`, below the signal band and above the footer colophon. I place it, I do not design or write it.

### 4. Component Character
- **Border radius**: cards/tags `6px` (md), buttons `12px` (lg), no pill shapes; mark untouched.
- **Border treatment**: hairline `fieldBorder` `#22794A` rules separate the signal rows; `borderStrong` `#2E9E62` under section heads.
- **Shadow**: none. Depth comes from the green value steps (surface lighter than bg), not shadow.
- **Density**: spacious in the hero, tightening into the signal ledger.
- **Interactive states**: links shift cream → marigold on hover, 120ms; no underlines except in the nav sentence.

### 5. Signal Integration
- **Where signals live**: a centred SIGNALS band below the hero, tabular rows on the green field.
- **Sports scores**: Red Wings 3–2 win set as the one marigold `4xl` figure, the bright note; other Detroit teams noted off-season in flat cream metadata.
- **Quote**: it is the hero phrase; Carnegie named in the deck beneath.
- **Holiday**: none today.
- **Golf**: Presidents Cup in progress, leaders +3 and +2, small tabular under-par marks in marigold (Doug's game).
- **Music**: Tobin Sprout, Guided by Voices, Radiohead as one quiet taste line in `textMuted`, not dated beside a score.
- **Other**: full moon 99.8% as a small cream note; SPY down 0.08% stated flat; overcast 47°F Aldie in metadata.

## Self-Check
1. Hero quotability: Yes — a complete Carnegie aphorism, screenshot-ready in isolation with its author named.
2. Because-of chain: Yes — warm fun line → centred sparse statement poster → warm Fraunces italic → green drench with marigold spark.
3. Render feasibility: Yes — `clamp(40px,7vw,104px)` peaks near 100px at 1440, under Fraunces' 160px hero cap, and wraps three lines in the field.
4. Canvas floor feasible: Yes — a green drench fills the field and the centred multi-line quote plus signal band clear 70%.
5. Phone: Yes — at 360 the quote sets at `3xl`, wraps inside the first 640px without cutting a word.

## Rationale
The phrase is Carnegie's line about having fun in the work, and it is Doug's stance stated by a stranger: he runs Spaceman for the paying clients and builds FishSticks and 15th Club on the side because they are fun. Because it is a whole aphorism, not a fragment, the object on the page has to be the whole line at rest in the center, which is why the composition is a single centred column, radial and symmetric, the field flooding out around it with air on all four sides. That is a statement poster, and it moves off the mandate's `figure` for the honest reason that a ten-word sentence cannot be a caption to a number.

The chassis is fraunces-karla because the line is warm and generous and glad, and Fraunces is the one catalog face that loads a soft, fat display italic to carry it; set light and italic and centred, the quote reads as spoken, not shouted. It is off the three most-worn faces of the window. The type treatment moves three fields at once off the recent template: italic-led, centred, and type-as-texture, with a giant low-opacity "fun" pulled from the line sitting as the field ground the way a Klim specimen sets one word as material.

The palette is a fairway-green drench at 152°, inside the mandate and squarely in Doug's register, saturated so it reads buoyant rather than clinical. Drench is the gold-standard formula and is fresh against the recent light-ground, split-field and duotone run; the one marigold spark is reserved for the Red Wings 3–2 win and the under-par golf marks, the bright notes against the green. On a green drench the mono mark is the honest choice, cream on green at 44px in the top-left corner inside the first fold, and the shell is a standard present-and-legible chrome that avoids the rejected wordmark-left-links-right bar by dropping the nav into one small centred sentence low in the field.
