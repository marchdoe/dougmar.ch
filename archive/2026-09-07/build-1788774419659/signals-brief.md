# Signals Brief — 2026-09-07

## Hero Copy
It finally assumes a tangible outward form.

## Hero Rationale
Lifted from today's `signals.quote` (Paramahansa Yogananda). It is the single most on-the-nose line this project could run: a portfolio that clings to one design idea every night and wakes up as literal, rendered form. The setup clause — "If you cling to a certain thought with dynamic will power —" threads in as a quiet lead-in, but the payoff "it finally assumes a tangible outward form" is the poster line, quotable in isolation and a thesis statement for a site that rebuilds itself into matter each day. Last hero was signal-event, so this is not a quote streak; it's the strongest line on the board.

## Archetype
a creed that assembles itself as you scroll

## Composition
columns: single
axis: vertical
symmetry: broken
hero_zone: interleaved
density: sparse
rhythm: interrupted
shell_posture: folded-into-hero
field_ratio: type-dominant
collapse: stack

## Composition Rationale
I moved `columns` off the mandate's `two-equal` to `single`: this phrase is a single act of will resolving into one form, so it wants one spine, not two columns competing for primacy. I moved `shell_posture` off the mandate's `none` to `folded-into-hero` because the owner has flagged the header as first-class three ratings running — the brand must be present, so it rides the top of the hero rather than vanishing. `collapse` moved from the suggested `split-to-sequence` to `stack` because there is no split field to sequence; a single vertical spine already stacks natively at 360.

## Mobile
carrier: The single vertical spine already is the phone layout — the hero sentence threads down one column, assembling into form as you scroll, exactly as at 1440.
first_fold: The stacked lockup, the setup clause, and "It finally assumes" (hero at 3xl) — the payoff line resolves just below.
order: brand lockup + nav, hero setup + "It finally assumes", featured work, "a tangible outward form.", Labor Day field band, work index, almanac colophon
hero_step_360: 3xl
nav_360: lockup shrinks to a smaller stacked mark; the three small-caps links sit on one dot-separated line beneath it

## Chassis
zilla-worksans

## Visual Specification
### 1. Color Specification
- **Primary hue** — 212° (clear-morning azure). Chosen over the mandate's 40–80° corridor because the repetition check flagged the previous build's hue at only 16° from 09-02 and demanded ≥60° separation; the whole 40–80° corridor is already spent (62/40/46/78°), so I moved to azure, which is ≥60° from every recent primary (66° off 328°, 94° off 118°, 134° off 78°) AND matches today's actual weather — clear, calm, 63.7°F, a cool September morning under a waning crescent. Azure also harmonizes with the brand mark's own blue, letting it render in original color.
- **Neutral palette (cool paper)** — 50 `#f8fafc`, 100 `#eef3f8`, 200 `#dde5ee`, 300 `#c4d0dd`, 400 `#94a3b5`, 500 `#667487`, 600 `#495667`, 700 `#333d4b`, 800 `#202833`, 900 `#10161e`
- **Accent color (azure)** — light `#5ba3e8`, default `#175fc0` (white on it = 6.1:1), dark `#0f4185`, glow `#bcd8f6`
- **Secondary accent** — none. One hue carries the page.
- **Background** — page bg `#f8fafc`, card/surface `#ffffff`, field band (the one flooded plane) `#175fc0`
- **Text colors** — primary `#10161e`, secondary `#495667` (7:1 on bg), muted `#667487` (4.6:1 on bg)

### 2. Typography
- **Hero phrase rendering** — Zilla Slab (`display`) at the `hero` ramp step (96px at 1440, 64px at 360). The payoff "It finally assumes a tangible outward form." is set in the sturdy slab because the phrase's own subject is *tangible form* — the type is the material the thought becomes. The setup clause runs above it in `xl` Work Sans, textMuted, italic-adjacent register, so the eye reads a whisper resolving into a mass.
- **Type treatment** — `hero` for the marquee payoff; `xl` for the setup clause and section leads (the mid-register the owner demanded); `lg` for featured-project titles and standfirsts; `base` Work Sans for body held to 62–68ch at 1.55 leading; `sm` small-caps for the almanac labels; `xs` for metadata. Attribution to Yogananda sits at `sm`, tracked, textMuted.

### 3. Layout Specification
- **Composition** — single / vertical / broken / interleaved / sparse / interrupted / folded-into-hero / type-dominant / stack. One spine down the page carries a single act of will; the hero phrase is broken and threaded through the content so the sentence *assembles into form* as you scroll — the interruption between "it finally assumes" and "a tangible outward form" is the caesura where the thought materializes.
- **CSS grid/flex structure** — `display: grid; grid-template-columns: minmax(0, 1fr); max-width: none; padding: 0 8vw` — full-width single spine, no centered column. Inner text blocks inset to `max-width: 66ch` off the single left rail.
- **Major dimensions**:
  - Hero/lead band: `min-height: 78vh`
  - No sidebar.
  - Max content width: `none`; side padding `clamp(24px, 8vw, 160px)`; body text capped at 66ch via token, hung off one rail.
  - Section spacing: large caesura gaps `clamp(96px, 14vh, 200px)` between threaded hero fragments; tight `clamp(24px, 3vh, 40px)` within a group.
- **Nav placement** — folded into the hero: the stacked brand lockup rides the top of the hero field; WORK · ABOUT · CONTACT sit as three small-caps links on one line beneath the lockup. No top bar, no band, no border.
- **Hero phrase grid zone** — the setup clause + lockup occupy rows 1–2 (top 22vh); "It finally assumes" anchors rows 3–4 at `hero` scale; a featured-work interjection occupies rows 5–6; "a tangible outward form." resolves in rows 7–8, lower-third, also at `hero` scale — the same 96px voice split by a caesura.

### 4. Component Character
- **Border radius** — cards/panels `0`, buttons/links `2px`, tags `0`. Owner disliked rounded corners; keep them near-square.
- **Border treatment** — hairline `border` (neutral.200) rules only; `borderStrong` (neutral.400) for the almanac's top rule. Borderless cards.
- **Shadow** — none. Depth comes from the azure field band, not shadow.
- **Density** — spacious/sparse; the page is mostly cool-paper field.
- **Interactive states** — links underline on `_hover` in azure; the featured-project row shifts its title to azure on hover, no motion beyond a 120ms color transition.

### 5. Signal Integration
- **Where signal elements live** — a quiet almanac colophon at the base (hairline-topped, stacked left) plus one azure field band mid-page carrying Labor Day.
- **Sports scores** — Tigers 2–3 loss set as a tabular almanac line: "DET 2 · OPP 3 — loss" in `sm` tabular-nums, textMuted, no celebration; it's a quiet fact under a page about will and form.
- **Quote** — the quote IS the hero phrase (payoff marquee + threaded setup + attribution).
- **Holiday** — Labor Day floods the single azure field band mid-scroll: "Labor Day — the work, made tangible" reversed in fieldInk white, tying the holiday to the hero's thesis.
- **Music** — Guided by Voices · The War on Drugs · Radiohead set as an "On rotation" line in the colophon, labeled as standing taste, never dated beside the score.
- **Other signals** — Clear · 63.7°F · Aldie VA; waning crescent 15%; SPY 770.19 ▼0.39%; daylight 12.6h; AQI Good — all as `sm`/`xs` almanac rows. HN "Programming is Art" cited as a single micro-line in the colophon.

## Self-Check
1. Hero quotability: Yes — "It finally assumes a tangible outward form." reads as a standalone aphorism and doubles as the site's thesis.
2. Because-of chain: Yes — thought-becomes-form → single vertical spine that assembles by scroll → sturdy slab as the material → azure as will-made-visible → interleaved fragments split by a caesura.
3. Render feasibility: Yes — Zilla `hero` at 96px on a single full-width spine at 1440 renders a 6-word line across two rows without overflow.
4. Canvas floor feasible: Yes — 68% is honest for a sparse type-dominant single-spine page whose hero fragments occupy the full width at 96px.
5. Phone: Yes — collapse `stack` keeps order; hero set at `3xl` (fits 360 without cutting "tangible") inside the first fold beneath the lockup.

## Rationale
The phrase is Yogananda's, and it is the truest line this project could run: "It finally assumes a tangible outward form." A portfolio that clings to a single compositional thought every night and wakes up rendered into matter is that sentence, literally. So the whole page is built to enact it rather than quote it. The composition is a single vertical spine — one act of will, not two columns arguing — and the hero sentence is *broken and threaded* down that spine (interleaved, interrupted). The setup clause whispers at the top, "It finally assumes" lands at full slab scale, a featured project interjects, and "a tangible outward form." resolves in the lower third: the thought assembling into form as you scroll, with the caesura between the two hero fragments as the moment of materialization.

Chassis follows the phrase's payoff word, *form*. Zilla Slab is a sturdy, low-contrast slab — type that reads as material, as mass — so the sentence about a thought becoming tangible is set in the most tangible face on the board, paired with Work Sans, which shares its humanist skeleton for the body and mid-register (answering the standing "display and body must share a skeleton" complaint). It sits outside the three recently-worn chassis and reserves its quiet 96px marquee for a reflective creed rather than shouting it off a condensed billboard.

The palette deviates from the 40–80° warm mandate on purpose: the repetition check demanded ≥60° of hue separation and the entire warm corridor is spent, so I moved to 212° azure — clear-morning blue that matches today's actual weather (clear, calm, cool) and harmonizes with the brand mark's own blue. That harmony is why the ground strategy is light-ground with the mark in *original* color: on cool paper the green-and-blue mark finally has somewhere to sit, and original has effectively never reached the page in 17 builds. Azure is the one saturated color, deployed as the will made visible — it gathers into a single flooded field band carrying Labor Day and colors the resolving hero fragment — while every signal (the quiet Tigers loss, the waning crescent, the down market, the standing music rotation) sits in a hairline almanac colophon at the base, subordinate to the type, which is the image.
