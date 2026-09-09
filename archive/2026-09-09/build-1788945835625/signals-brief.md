# Signals Brief — 2026-09-09

## Hero Copy
Limit the number of details

## Hero Rationale
Today's densest, truest lane is the design-discourse sidebar, and its lead essay states the whole meta-argument of a portfolio that rebuilds itself every night: "Every detail asks for attention. Limiting how many we add is what gives us room to make the ones that remain better." The imperative distilled from it — "Limit the number of details" — is a manifesto a self-redesigning site should have to live by. On a new-moon, overcast, market-down day with no triumph to shout, the strongest move is not addition but subtraction, and this line is the subtraction stated out loud.

## Archetype
a poster of restraint — one statement withheld into a void

## Composition
columns: single
axis: vertical
symmetry: symmetric
hero_zone: center
density: sparse
rhythm: accelerating
shell_posture: standard
field_ratio: drenched
collapse: hero-only

## Composition Rationale
A manifesto about subtraction cannot be crowded, so I moved density off the mandate's `crowded` to `sparse` and columns off `three` to `single` — a single centered spine is the only honest structure for "limit the number of details," and three newspaper columns would add exactly the details the phrase rejects. I moved axis off `radial` to `vertical` (a radial diagram orbits new elements around the center, the opposite of editing down) and symmetry off `mirrored` to `symmetric` (a centered poster, deliberate like davidrudnick.org, not a reflected pattern). I kept `center`, `accelerating`, `standard`, `drenched` and `hero-only` from the starting tuple because they genuinely serve: the void floods the canvas, the hero owns the fold, and the index below tightens as it descends.

## Mobile
carrier: The void and the single centered phrase carry the whole idea at 360 — subtraction needs no device to survive the collapse.
first_fold: The hero phrase "Limit the number of details" alone, centered in the teal-black void, nothing else in the first 640px.
order: hero, selected work index, about + timeline, colophon
hero_step_360: hero
nav_360: Corner cluster collapses to a single top line — mark + wordmark; the three small-caps links move to one wrapped row directly beneath, still no bar.

## Chassis
hanken-solo

## Visual Specification
### 1. Color Specification
- **Primary hue** — 162° (teal-green). Chosen inside the 140–180° mandate; it reads as the color of a dark, still night that still has life in it — the new moon (3.3% illuminated) as ground, one green pulse as the surviving detail.
- **Neutral palette (teal-black, hued toward 162°)** — 50 `#eef4f2`, 100 `#d7e2de`, 200 `#b3c6c0`, 300 `#8aa39b`, 400 `#647d75`, 500 `#48605a`, 600 `#344944`, 700 `#223531`, 800 `#142320`, 900 `#0a1512`.
- **Accent color** — light `#6ef0c6`, default `#2ecf9d`, dark `#12a37a`, glow `#8ff6d6`.
- **Secondary accent** — none. The page turns on exactly one color.
- **Background** — page bg `#06110f` (near-black teal void), card/surface `#0f2620`, flooded field plane `#0d3a2c`.
- **Text colors** — primary `#e8f4ef`, secondary `#9dbdb2`, muted/faint `#7f9f94`.

### 2. Typography (chassis: hanken-solo — one humanist grotesk at three weights)
- **Hero phrase rendering** — set at the `hero` ramp step (fluid clamp ~64px→96px), weight 700, centered in the void with clearance on all four sides, `text-wrap: balance` so it settles into 2–3 lines. A single family carrying display, standfirst and body IS the message: limit the details, including the fonts.
- **Type treatment** — hero = `hero`; a standfirst under the phrase = `xl`; section heads (Selected work, About, Colophon) = `2xl`; index row titles = `lg`; body/deck = `base` capped at 62–68ch; metadata and colophon = `sm`; micro labels = `xs` (never a sentence). Leading and tracking come from the chassis ramp — I name steps, not raw values. This spends the middle of the scale the owner asked for.

### 3. Layout Specification
- **Composition** — single / vertical / symmetric / center / sparse / accelerating / standard / drenched / hero-only. A manifesto about subtraction wants one spine, centered, floating in a flooded void — the confidence is in what is withheld (davidrudnick.org logic).
- **CSS grid/flex structure** — `display: grid; grid-template-columns: minmax(0,1fr); justify-items: center;` for the hero fold; below-fold sections are single-column blocks max 68ch, left-aligned to one rail, `margin-inline: auto`.
- **Major dimensions**:
  - Hero fold: `min-height: 92vh`, phrase optically centered.
  - No sidebar/fixed panel.
  - Max content width — this is `columns: single`: body pinned to `max-width: 68ch`; hero block `max-width: 20ch`. Side padding `clamp(24px, 6vw, 96px)`.
  - Section padding: vertical rhythm from the chassis spacing base; sections tighten as the page descends (accelerating): first gap ~14 units, last ~6.
- **Nav placement** — corner header, top-left cluster (mark + wordmark), three small-caps links tucked beneath. Not a top bar. Height ~72px.
- **Hero phrase grid zone** — occupies the centered single column, rows spanning the first fold (roughly viewport rows 2–8 of 10), intended rendered size 64px (360) → 96px (1440).

### 4. Component Character
- **Border radius** — cards/buttons/tags 0–2px (hard corners; owner dislikes rounded). Only the circular mark is round.
- **Border treatment** — hairlines only, `border` token; section breaks use `borderStrong`. No boxes around the hero.
- **Shadow** — none. Depth comes from surface lightness (`#0f2620` sits above `#06110f`), not shadow.
- **Density** — sparse above the fold, quietly measured in the index below.
- **Interactive states** — links shift `text → accent` on `_hover`, hairline underline appears; no motion beyond a single staggered fade-in on load.

### 5. Signal Integration
- **Where signal elements live** — a hairline baseline colophon at the page foot; the void itself is the primary signal (the new moon).
- **Sports scores** — Tigers 2–3 loss set quietly in `sm` tabular figures in the colophon, textMuted, no accent — it is not today's win.
- **Quote** — Mandela's line is deliberately NOT the hero (breaking the quote habit); it sits once as a small `sm` footnote near the about block: "express yourself as though everyone is listening."
- **Holiday** — none today; omitted.
- **Music** — Radiohead · Guided by Voices · My Morning Jacket as an "on rotation" micro-line in the colophon, marked as taste, not an event; Radiohead's mood suits the restrained void.
- **Other signals** — new moon 3.3% (named as the ground concept + colophon), overcast 69°F Aldie, SPY 765.96 (−0.55%), AQI Good / UV 0, Biltmore Championship (scheduled) — all as spaced small-caps entries on the one colophon rule, subordinate to the type.

## Self-Check
1. Hero quotability: Yes — "Limit the number of details" is a standalone imperative that reads as a design manifesto, screenshot-worthy in isolation.
2. Because-of chain: Yes — restraint phrase → sparse single-spine void → single-family quiet chassis → dark-void teal with one accent → centered poster with an accelerating index beneath.
3. Render feasibility: Yes — 5 short words at hanken `hero` (max 96px) fit 2–3 balanced lines centered at 1440 with clearance, no overflow.
4. Canvas floor feasible: Yes — a drenched teal-black void fills the full canvas as chromatic ground even at sparse density; 70% is easily cleared.
5. Phone: Yes — `hero-only` puts the phrase alone in the first fold; at 360 the `hero` step is 64px and the longest word ("details") fits the column without cutting.

## Rationale
The phrase is a manifesto about subtraction, lifted from the day's design-discourse lane and elevated into the argument a self-redesigning portfolio should be judged against: "Limit the number of details." On a new-moon, overcast, market-down day with no win to celebrate, the honest gesture is not to add but to withhold — so every downstream decision serves that withholding. The composition collapses to a single vertical spine, one phrase centered in a flooded void with clearance on all four sides, because a manifesto about editing cannot be rendered as three crowded columns without contradicting itself. The confidence comes from what is absent.

The chassis is hanken-solo — one humanist grotesk at three weights — chosen precisely because it is a single voice. A page arguing to limit details should not run two competing typefaces; using one family for hero, standfirst, index and body makes the type system itself enact the message, and it answers the standing "display and body must share a skeleton" complaint completely (they are the same face). Its quiet 96px hero is a feature, not a shortfall: this line is a considered statement, not a shout, and a poster whose restraint is the point wants the reserved register, not a condensed billboard.

The palette is a new-moon teal-black void at 162°, inside the 140–180° mandate and clear of every recently-spent warm and violet zone. Dark-void is the preferred formula this week (drench, light-ground and split-field are all recently used) and it is genuinely called for: the moon is 3.3% illuminated, the darkest night of the cycle, and a near-black teal ground with one saturated cyan-green pulse is that night made into pigment — the single surviving detail glowing in an edited-away field. Because a dark teal ground gives green somewhere to sit, the brand mark runs in its original green-and-blue for the first time in effectively 17 builds, harmonizing with the accent rather than fighting it. The header is a fresh corner cluster (no top bar the owner has rejected three times), the footer a single hairline colophon carrying every remaining signal as quiet spaced small-caps, subordinate to the one line that carries the day.
