# Signals Brief — 2026-11-18

## Hero Copy
Bright, 42, and dark by five.

## Hero Rationale
Today's one honest fact in Aldie is a clear, cold, short November day: sunny, 42°F, sunrise 7:04, sunset 16:48. I composed the weather into a three-beat line that carries the whole arc of the day, bright at the top and gone by evening, the way Doug clocks where he actually lives. It beats a fifth Detroit score in fifteen builds, which would read as the template the owner already flagged, and it beats the Walt Disney quote, which is motivational-poster register and not his plain-numbers voice. Owner's voice: Doug reads the weather where he lives in plain numbers, and a clear 42-degree day that's dark by five is exactly how he'd say it.

## Archetype
a weather note set like a line of verse

## Composition
columns: single
axis: diagonal
symmetry: symmetric
hero_zone: center
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: type-dominant
collapse: hero-only
hero_object: statement

## Composition Rationale
The phrase is one short arc from bright to dark, so a single centered statement that owns the whole first fold serves it better than any split or rail; I moved columns to `single` and shell to `none` off the masonry start because a type-dominant weather note wants one column and no nav furniture, matching the poster references that withhold everything but the line. The diagonal axis is literal: the low-November-sun slant carries the eye from "bright," upper-left to "dark by five." lower-right. I kept `symmetric` (fresh versus the last three builds' right/left/broken) and balanced it with mirrored vertical margin labels, and `interrupted` gives the one large caesura before the amber footer band.

## Mobile
carrier: At 360 the single centered italic statement carries the first fold alone; the work index, the day's facts, the callout and the amber band stack full-width beneath it in reading order.
first_fold: The hero block only — the phrase "Bright, 42, and dark by five." at 4xl with its one-line deck, and the bare mark top-left. The work index begins below 640px.
order: hero, work index, today's facts, site callout, footer amber band
hero_step_360: 4xl
nav_360: No nav bar; the mark sits top-left of the hero, in-content links carry navigation, and work / about / contact sit in the footer amber band.

## Chassis
spectral-albert

## Visual Specification
### 1. Color Specification
- **Primary hue**: 42° low-sun amber. A bright, sunny, cold day reads as the warm honey slant of late-fall light, not a trophy gold; 42° sits warmer (more orange) than the recent 46–50° scoreboard golds and inside the 40–80° mandate.
- **Neutral palette** (warm paper, tinted toward 45°): 50 `#FBF7F0`, 100 `#F5EEE0`, 200 `#E9DCC6`, 300 `#D6C6A4`, 400 `#B3A079`, 500 `#806E4C`, 600 `#5F4F32`, 700 `#46391F`, 800 `#2C2313`, 900 `#1C160C`.
- **Accent color** (amber): light `#F3CE8C`, default `#E8972A`, dark `#B86D12`, glow `#F8E3BE`.
- **Secondary accent**: none. One amber carries the page.
- **Background**: page bg `#FBF7F0`, raised surface `#F5EEE0`, second ground / callout band `#FBF1DD`, flooded amber field band `#E8972A`.
- **Text colors**: primary `#1C160C`, secondary `#5F4F32`, muted/faint `#806E4C`.

### 2. Typography
- **Hero phrase rendering**: `display` (Spectral) at the `hero` ramp step, fluid clamp `clamp(52px, 7.5vw, 104px)`, set lowercase, light weight, italic, centred. It wraps to two lines at 1440 ("bright, 42, and" / "dark by five."); the numeral `42` is set in `accent` amber (the sun's warmth), the rest in `text` charcoal. It is the only large element in the first fold.
- **Type treatment**: hero at `hero`; deck at `lede` (~20–22px, `textMuted`); section labels at `sm` small-caps (`textFaint`); work-index titles at `3xl`; index metadata (year, role) at `sm` (`textFaint`); body/prose at `base`, leading 1.5, measure capped 64ch. Mirrored margin metadata set vertical at `xs` (`textFaint`). Middle of the scale is spent: hero → 3xl index titles → lede deck → base body.

### 3. Layout Specification
- **Composition**: single / diagonal / symmetric / center / measured / interrupted / none / type-dominant / hero-only / statement. One centered statement owns the first fold; the eye travels the diagonal from "bright," upper-left to "dark by five." lower-right, an amber hairline under "five." closing the corner-to-corner reading path, while the field stays balanced about the vertical center.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: [edge] 2.5rem [main] 1fr [edge] 2.5rem; grid-template-rows: 100svh auto auto auto auto;` hero block centered in the first row; below, a single content column. Prose pinned `max-width: 64ch`; index rows full width of the main column.
- **Major dimensions**: hero first fold `min-height: 100svh`; no sidebar; content max column ~`900px`; prose measure `≤64ch`; section padding `clamp(56px, 7vw, 112px)` block, `6vw` inline; index rows `min-height: 112px` with hairline rules.
- **Nav placement**: none. The page navigates through in-content links (the work index titles link, the footer band holds work / about / contact). The circular mark sits top-left of the hero field.
- **Hero phrase grid zone**: main column, row 1, centered, occupying roughly the middle 70% of the first fold vertically, ~860px wide at 1440.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the hero-only first fold, between the day's-facts row and the footer amber band; full width of the main column. I place it and do not style it.

### 4. Component Character
- **Border radius**: cards/panels `sm` (1px, effectively crisp), buttons/tags `md` (2px), marks none. Sharp, editorial, no soft corners.
- **Border treatment**: bordered hairlines only. `border` for index row rules, `borderStrong` for the section break above the footer band, `fieldBorder` inside the amber band.
- **Shadow**: none. Depth comes from value (surface vs bg) and the amber field band, never shadow.
- **Density**: measured. Generous air around the hero; even index rhythm broken once by the larger gap before the footer band (the caesura).
- **Interactive states**: links underline in `accent` amber on hover; index titles shift to `accent` on hover. No scale or shadow changes.

### 5. Signal Integration
- **Where signal elements live**: the weather IS the hero and its deck. All other facts live in one ruled "today" row beneath the work index, and the footer amber band repeats identity plus the day's close.
- **Sports scores**: "Pistons win, 105–93." set in `base` tabular figures, the score in `accent` amber, as one cell in the today row.
- **Quote**: not used as hero; the Walt Disney line is omitted rather than shown as a poster of someone else.
- **Holiday elements**: none today.
- **Music**: taste, not an event. One quiet caption in the footer band: "On rotation: Wet Leg, Radiohead." No score treatment.
- **Other signals**: deck carries "Clear and 42 in Aldie. Sun up at 7:04, down at 16:48." Today row carries "SPY 732.44, off 1.0%", "Waxing gibbous, 71% full", "The RSM Classic tees off." Mirrored vertical margin labels carry "ALDIE, VIRGINIA" (left) and "18 NOVEMBER 2026" (right) in `textFaint`.

## Self-Check
1. Hero quotability: Yes — "Bright, 42, and dark by five." is a complete, quotable observation with an arc, not a descriptive opener.
2. Because-of chain: Yes — a quiet bright/dark weather note wants a reflective light-italic serif (spectral-albert), a warm-paper light-ground field for "bright," a saturated amber for the sun, and a hero-only statement that gives the line the whole first fold.
3. Render feasibility: Yes — six words of Spectral italic at `clamp(52px,7.5vw,104px)` wrap to two lines inside an ~860px centered zone at 1440, under the chassis's 120px ceiling.
4. Canvas floor feasible: Yes — hero fold plus full-width work index, today row, callout and amber footer band fill 70%+ without padding voids.
5. Phone: Yes — at 4xl the phrase wraps to ~3 lines well inside 640px with no cut word; the mark sits top-left of the same fold.

## Rationale
The phrase is a plain three-beat weather fact with an arc, "Bright, 42, and dark by five." Because it is quiet and observational, not a shout, I reached past the condensed-caps register to spectral-albert, an editorial serif that loads true display italics; set lowercase, light weight, italic, it reads like a line of verse murmured about the day rather than a slogan. The hero_object is a `statement` that owns the entire first fold (hero-only collapse), with the axis running diagonally to echo the low November sun sliding from bright to dark.

Palette follows the line directly: "bright" wants a light-ground, so the field is warm sunlit paper, not a dark void (and it breaks the recent run of drench, duotone and split-field dark grounds). The one saturated amber at 42° is the sun itself, spent on the numeral 42 inside the hero, on the hover links, and flooded across the footer band where the day closes. The neutrals are warmed toward the same amber so paper and sun share a skeleton; charcoal ink carries the cold.

Shell and header serve the withholding: shell_posture none means no nav bar at all, just the bare circular mark top-left and in-content links, which keeps the single statement uncontested. I reused mark-only-md against the Shell Mandate because a statement poster wants the quietest possible lockup, nothing competing with the one line. The wipe entrance reveals the phrase left to right like first light crossing the field, one gesture, and the vertical mirrored margin labels (place, date) give the symmetric field its balance and the type treatment its texture.
