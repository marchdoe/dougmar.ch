# Signals Brief — 2026-09-11

## Hero Copy
Free to produce. Not free to own.

## Hero Rationale
Today's densest lane isn't a score or a quote — it's the design-discourse convergence in the sidebar: "AI has made code, tests, policy, documentation… almost free to produce. It has not made any of them free to own," sharpened by "why products get worse" and "worse on purpose." For a portfolio that is itself an AI that mass-produces a new version of itself every night, this is the most honest and cutting thing it can say about its own condition. Composed from that essay into a parallel aphorism with a hard turn, it is a poster line: the abundance clause, then the caesura, then the one thing that isn't free.

## Archetype
A build-log poster — over-production as texture, ownership as the one clean line.

## Composition
columns: irregular-twelve
axis: vertical
symmetry: broken
hero_zone: lower-third
density: crowded
rhythm: interrupted
shell_posture: folded-into-hero
field_ratio: type-dominant
collapse: reorder

## Composition Rationale
The phrase is a vertical descent — abundance up top, the one owned thing at the bottom — so I invoke the Max-Risk License to land one axis on a soft-forbidden value: axis: vertical (the mandate suggests radial and discourages horizontal/vertical/diagonal). Radial would scatter what has to fall top-to-bottom; the argument reads as a drop from over-production to ownership, and the caesura between clauses becomes the interrupted rhythm's single large gap. I also moved columns off the suggested masonry to irregular-twelve because a real grid is needed to pack ragged produce-fragments across the top and seat the full-width owned panel below — masonry's ragged bottom edge fights a single deliberate resolution.

## Mobile
carrier: The owned marquee "Not free to own." reversed out of the forest panel leads, and the produce-noise stacks beneath it as the evidence.
first_fold: The hero phrase "Not free to own." on the deep-forest panel with the lockup above it.
order: hero-owned-panel, produce-noise-field, work-index, build-log-foot
hero_step_360: 2xl
nav_360: lockup shrinks and stacks full-width at the very top; nav becomes one small-caps row of three links beneath it.

## Chassis
space-mono-archivo

## Visual Specification
### 1. Color Specification
- **Primary hue** — 125° HSL (signal/spring green). Chosen because the essay is a critique of over-production; a sharp, alert green reads as "stop building," and 125° sits inside the allowed green band (92–132° HSL), clear of the forbidden warm/violet/magenta zones, and 32° off the last teal (162°) — a different green in feel, not a repeat.
- **Neutral palette (sage, green-tinted)** — 50 `#F3F8F2` · 100 `#E7F1E6` · 200 `#D3E2D2` · 300 `#B2C9B1` · 400 `#86A385` · 500 `#5F7D5E` · 600 `#476246` · 700 `#354A34` · 800 `#212F21` · 900 `#101810`
- **Accent color** — light `#6BCE7F` · default `#2BAE3B` · dark `#176B24` · glow `#9FE0AC`. Used as FILL only (chips, knockout block behind "own", rules), never as body text on paper.
- **Secondary accent** — none.
- **Background** — page `#F3F8F2` · card `#FFFFFF` · field panel `#0E3316` (deep forest, carries the owned marquee).
- **Text colors** — primary `#101810` · secondary `#354A34` · muted `#476246`.

### 2. Typography
- **Hero phrase rendering** — Space Mono (`display`) at the `hero` clamp. "Free to produce." sets small and repeats as terminal texture in the produce field up top; "Not free to own." lands at the `hero` step reversed out of the deep-forest panel in the lower third, with the word **own** on a `#2BAE3B` knockout block (dark ink `#101810` on it, ~4.9:1). Monospace here is subject matter, not costume — code's own texture is what's "almost free to produce."
- **Type treatment** — steps as textStyle tokens: `hero` for the payoff marquee; `2xl`/`xl` for the "Free to produce." fragments and standfirst (spends the mid-scale so no page jumps title→body); `lg` for section heads; Archivo `base` at 60–68ch, leading 1.5–1.6, for body/case prose; `sm` for build-log signal rows and captions.

### 3. Layout Specification
- **Composition** — irregular-twelve · vertical · broken · lower-third · crowded · interrupted · folded-into-hero · type-dominant · reorder. A twelve-column grid lets fragments of "Free to produce." pack the crowded upper two-thirds as over-built noise; the vertical descent resolves to one owned line low on the page, the caesura between clauses rendered as the single large gap (interrupted rhythm) that is the focal point.
- **CSS grid/flex** — `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: clamp(12px, 1.6vw, 28px)`. Produce fragments span assorted column runs (e.g. cols 1–5, 7–12, 3–9) at ragged vertical offsets; the owned panel spans cols 1–12.
- **Major dimensions**:
  - Produce field: `min-height: 62vh`; owned panel: `min-height: 38vh` (full-bleed deep-forest).
  - No fixed sidebar.
  - Max content width: `none`; side padding `clamp(40px, 6vw, 96px)`; body prose capped at 66ch inset.
  - Section padding: `clamp(48px, 6vh, 96px)` vertical.
- **Nav placement** — folded into the hero: stacked-lg lockup top-left inside the composition, three small-caps links (work · about · contact) on one row beneath, no band, no top bar. Header height ~220px.
- **Hero phrase grid zone** — "Not free to own." occupies rows 8–11, columns 1–12 (the lower-third forest panel), rendered at `clamp(56px, 8.5vw, 122px)`.

### 4. Component Character
- **Border radius** — none everywhere (hard corners; owner has flagged rounded corners three ratings running). Tags/chips square.
- **Border treatment** — hairline `border` (sage.200) for produce-fragment separators; `borderStrong` (sage.700) for the rule under the lockup and the top of the build-log foot; `fieldBorder` inside the forest panel.
- **Shadow** — none. Depth is by value and panel, not shadow.
- **Density** — crowded in the produce field (fragments packed to the edge of legibility as texture); spacious around the owned line.
- **Interactive states** — links: dark ink → `#176B24` with a green underline block on hover; the "own" knockout stays static.

### 5. Signal Integration
- **Where signal elements live** — the day's signals ARE the produce-noise up top and recur as a build-log foot at the base.
- **Sports** — Detroit clubs all off-season: one flat monospace line "DET · all clubs · off season · no game" in the produce texture; no false score.
- **Quote** — Brian Tracy's line is NOT the hero; it sits as a single `sm` footnote in the build-log foot, unstyled beyond format.
- **Holiday** — none today; nothing invented.
- **Music** — Guided by Voices / The War on Drugs shown as a build-log line "on rotation ▸ guided by voices · the war on drugs" — taste, tagged as rotation, not an event beside the market close.
- **Other signals with treatment** — market SPY −0.60% as a red-free muted line; new moon (0.1% illum) as "new moon · 0% · cycle day 0"; AQI 1 Good / UV 0; overcast 74°F Aldie; all set as monospace terminal rows in the produce field and echoed in the foot, deliberately over-produced so the crowd is the argument.

## Self-Check
1. Hero quotability: Yes — "Free to produce. Not free to own." is a self-contained parallel aphorism with a turn, screenshot-worthy on its own.
2. Because-of chain: Yes — the two-clause turn dictates interrupted rhythm and the lower-third owned line; over-production dictates the crowded produce field; code-production dictates mono; the critique dictates alert green on paper.
3. Render feasibility: Yes — Space Mono `hero` reaches 122px at 1440; "Not free to own." fits the lower-third panel across one or two lines without overflow.
4. Canvas floor feasible: Yes — packed produce texture fills the upper 62vh and the forest panel fills 38vh, clearing 76%.
5. Phone: Yes — collapse reorder brings the owned marquee to the top; at 360 it sets at `2xl`, wide mono wrapping cleanly with no cut word inside the first fold.

## Rationale
The phrase decides everything. "Free to produce. Not free to own." is composed from the day's densest lane — the sidebar's essays on AI over-production, worse-on-purpose products, and quality drained without a metric moving — into the one argument a self-redesigning AI portfolio should be judged against. It is structurally a turn: an abundance clause, a hard caesura, and the single thing that isn't free. That turn is the composition. The produce clause crowds the upper two-thirds as ragged monospace texture — the over-built noise made visible, packed to the edge of legibility — and the owned clause lands low, one clean marquee reversed out of a deep-forest panel, the caesura rendered as the interrupted rhythm's one large gap.

The chassis is space-mono-archivo because the essay is literally about the mass production of code; monospace is code's own texture, so the crowded field reads as a build-log dump and the owned line stands apart from it — mono here is subject matter, not the lazy developer costume the brand ban warns against. It sits outside the three recently-worn chassis and is not one of the condensed-caps trio, and its 122px hero carries the payoff at genuine poster scale without shouting.

The palette is a light-ground paper build — a fresh formula against the week's duotone/dark-void/drench run — with sage neutrals tinted toward the accent and one saturated signal green at 125° HSL doing all the work as a fill. Strict 60° separation from the last teal (162°) is impossible inside the forbidden-zone-constrained wheel, so I took the nearest allowed green band and landed 32° off it at a sharper, more alert green that suits a critique. Light ground is exactly the day the Brand Contract asks for the original mark: on paper the green-and-blue circular mark finally has somewhere to sit, so brand_color_mode is original at a fresh over-64 stacked-lg lockup, the header folded into the hero, hard corners throughout, and every signal — market, new moon, off-season clubs, the Tracy footnote, the standing music rotation — set as monospace build-log texture, subordinate to the one line that isn't free.
