# Signals Brief — 2026-10-07

## Hero Copy
Red Wings take it, 5–3.

## Hero Rationale
Last night the Red Wings won 5–3, and a Detroit result is the one signal this morning that is unambiguously mine. Today's quote ("Being a good example is the best form of service," Sathya Sai Baba) is a devotional aphorism with no purchase on design, engineering, or the day's facts, and it does not read in my register, so I passed it for the scoreboard. A score leads the page as a figure; the words are its caption. Owner's voice: I say a score as a score, and the Wings are my team.

## Archetype
a night scoreboard, one number lit

## Composition
columns: single
axis: horizontal
symmetry: mirrored
hero_zone: center
density: sparse
rhythm: accelerating
shell_posture: marginal
field_ratio: type-dominant
collapse: stack
hero_object: figure

## Composition Rationale
A score is two numbers facing across a dash, so I moved axis off the mandate's suggested `radial` onto `horizontal` and set `symmetry: mirrored`: the 5 and the 3 read as a literal scoreboard pair, not as content orbiting a point. I moved `columns` off `masonry` to `single` and `shell_posture` to `marginal` so the number owns one clean centred field with the brand on a quiet spine, which also pulls the whole tuple away from 10-03's radial/standard figure day. Everything else (center, sparse, accelerating, type-dominant, stack, figure) stays on the suggestion because a poster scoreboard genuinely wants a single dominant numeral with the data accelerating beneath it.

## Mobile
carrier: The monumental 5–3 numeral still carries at 360, centred, with the Red Wings label above and the lowercase caption below.
first_fold: The 5–3 figure and the h1 caption "red wings take it, 5–3."
order: brand+nav band, score figure, caption, signal stack, site callout, footer strip
hero_step_360: 3xl
nav_360: The left rail folds to a top band: mark left, Work/About/Contact as a short uppercase row beneath it, each with a 44px tap box.

## Chassis
big-shoulders-atkinson

## Visual Specification
### 1. Color Specification
- **Primary hue**: 222° steel blue. It is the cold of ice and arena light, and it sits inside the one allowed window (219–281°) the mandate leaves open. The neutrals and the field are all built off it so the void reads as a rink at night, not as generic black.
- **Neutral palette (ink, blue-tinted)**: 50 `#eef1f7`, 100 `#dce2ee`, 200 `#b9c4da`, 300 `#9aa6c2`, 400 `#72819f`, 500 `#4b5a7d`, 600 `#394662`, 700 `#2a3449`, 800 `#1a2133`, 900 `#0b0f1a`
- **Primary scale (azure 222°)**: 50 `#eaf1fc`, 100 `#cfe0f8`, 200 `#a2c3ef`, 300 `#6f9fe3`, 400 `#447ad3`, 500 `#2a5dba`, 600 `#214a97`, 700 `#1a3972`, 800 `#142a54`, 900 `#0e1c38`
- **Accent color (wing red 25°)**: light `#f94f45`, default `#e8322d`, dark `#961716`, glow `#f94f45`
- **Secondary accent**: wing red is the second accent, carried only by the winning numeral and one hairline under the score. Blue is primary/field; red is the one saturated thing turned on. Signal contrast (two team registers) justifies it.
- **Background**: page bg `#0b0f1a`, card/surface `#1a2133`, rail/bgAlt `#0e1c38`
- **Text colors**: primary `#eef1f7`, secondary `#9aa6c2`, muted/faint `#72819f`

### 2. Typography
- **Hero figure rendering**: `display` (Big Shoulders Display) at the `hero` clamp, `clamp(96px, 20vw, 160px)`, landing at 160px at 1440. The numeral `5–3` is the largest object on the page: the `5` is a solid `accent` (wing red) fill, the `3` is the same face set `outline` in `borderStrong` steel. The en dash sits between them at reduced weight in `textMuted`.
- **Hero phrase (the h1 caption)**: `red wings take it, 5–3.` set lowercase in `display` at the `3xl` step (one step down from the figure, per the figure rule), `textMuted` with "red wings" in `text`. It sits directly beneath the numeral, centred.
- **Type treatment / ramp steps**: eyebrow label `RED WINGS · NHL` at `sm`, Atkinson, tracked caps, `textFaint`. Mid-register standfirst at `lede`/`md` (fills the middle of the scale the owner asked for). Body and signal rows at `base` Atkinson Hyperlegible, `textMuted`, tabular-nums on all figures. Captions/metadata at `sm`, `textFaint`. Name steps, not raw leading/tracking.

### 3. Layout Specification
- **Composition**: single / horizontal / mirrored / center / sparse / accelerating / marginal / type-dominant / stack / figure. A score is two numbers facing each other across a dash; the mirrored horizontal pair centred in a type-dominant void is the scoreboard made literal, and the figure object puts the number where the eye lands first.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 96px 1fr;` left rail 96px + main field. Main field `display: grid; place-items: center; grid-auto-rows: min-content;` with the numeral row, the caption row, then an accelerating stack of signal rows descending.
- **Major dimensions**:
  - Hero/figure field: `min-height: 82vh`
  - Left rail: `width: 96px`, full viewport height
  - Max content width: `max-width: none`; main field padding `96px 7vw`; signal stack capped at `62ch` for readable rows
  - Section spacing: base unit from the chassis rhythm; intervals shrink descending (accelerating): score→caption generous, caption→signals tighter, signal rows tightest
- **Nav placement**: left rail (marginal). Mark at the top of the rail inside the first fold; nav as a stacked vertical list down the spine, one hairline per row. No top bar.
- **Hero phrase grid zone**: the numeral occupies the centred figure zone (main column, rows 1–2, full width of the field, ~160px tall at 1440); the h1 caption sits rows 3, directly under it at `3xl`.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the signal stack and above the footer data strip, between the signal section and the footer. I place it; I write no copy and no styling for it.

### 4. Component Character
- **Border radius**: cards `4px` (md), buttons `2px` (sm), tags `2px`. Sharp, scoreboard-hard.
- **Border treatment**: hairlines in `border`; the single rule under the score and the rail row rules in `borderStrong`/`fieldBorder`.
- **Shadow**: none. Depth comes from surface lightness over the void, not shadow.
- **Density**: sparse up top, compacting downward.
- **Interactive states**: nav/links shift `textMuted` → `accent` on `_hover`, with the row rule brightening to `borderStrong`. Tap targets ≥44px.

### 5. Signal Integration
- **Where signals live**: an accelerating stack beneath the score caption on `/`, plus the footer data strip.
- **Sports scores**: the Red Wings 5–3 IS the hero figure. Any other score (Falcons 45–24 Saints) renders as a quiet tabular row in the stack, `textMuted`, not competing.
- **Quote**: demoted; appears nowhere as hero. Not used.
- **Market**: SPY 779.09, +0.55% up, one tabular row, the `+` in `accent`.
- **Weather**: Aldie, clear, 43.9°F, one row (cold night, fits the rink).
- **Nobel / HN / news**: a single muted "today" line in the stack (Nobel Chemistry 2026), no link lifted.
- **Music**: The War on Drugs, My Morning Jacket, Guided by Voices as a footer rotation line, taste not event, kept away from the score rows.
- **Holiday**: none today; Columbus Day (5 days away) gets no treatment.
- **Moon**: waning crescent, 11% — one faint metadata note in the footer strip.

## Self-Check
1. Hero quotability: Yes — a score stated flat, "Red Wings take it, 5–3," reads as a caption anyone in Detroit would post.
2. Because-of chain: Yes — figure leads → scoreboard numeral → athletic signage chassis → steel void + wing red → centred mirrored field.
3. Render feasibility: Yes — Big Shoulders hero caps at 160px at 1440, and `5–3` is four glyphs, no overflow.
4. Canvas floor feasible: Yes — a 160px numeral, caption, rail, and descending signal stack fill ~68% of a sparse poster.
5. Phone: Yes — numeral at the hero clamp and the caption at `3xl` both land inside the first 640px at 360 without cutting a word.

## Rationale
The phrase is a score: the Red Wings won 5–3 last night, and of everything in the feed it is the one fact that is plainly mine, said the way I say a score. Because the anchor is a number, the object has to be a figure, not a statement: the numeral is the largest thing on the page and the words are its caption. A figure that size wants an athletic signage face, so big-shoulders-atkinson carries the numerals (Big Shoulders Display is literally stadium signage) over the hyperlegible Atkinson body for the data rows.

The palette follows the subject. A night game reads as a rink under lights, so the ground is a dark-void in steel blue 222°, the one hue the mandate leaves open and the right cold for ice. The single saturated thing turned on is wing red, carried only by the winning 5 and one hairline under the score; the losing 3 is the same face outlined in steel, so the texture itself states the result. The original green-and-blue mark sits on near-black where it has room to breathe, honoring the contract's preference for the real mark over the mono stand-in.

Layout serves the number. A single centred field, two numerals mirrored across the dash on a horizontal axis, is the scoreboard made literal; a marginal left spine holds the mark and a stacked nav list so nothing competes with the figure. Below it the signals accelerate downward, tightening as they descend, with the market, the weather, and one Nobel line as quiet tabular rows. Nothing animates on load; the dot field drifts slowly like light over ice, and sections below the fold rise on scroll.
