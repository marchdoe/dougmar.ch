# Signals Brief — 2026-11-10

## Hero Copy
twenty-five under. one shot clear.

## Hero Rationale
Composed from the World Wide Technology Championship final: Blades Brown posted 25-under and held off Ben James at 24-under, a one-shot win. Doug has four holes in one and follows the game closely; a decisive low number that just barely holds is exactly the finish he'd call out, stated as a score and not a slogan. It beats the Lions/Pistons double-win because Detroit sweeps have run three times this month, and it beats the Stephen King quote because that line is Shawshank's voice, not Doug's. Owner's voice: Doug reads a final leaderboard and says the number first, then the margin, flat, no adjectives.

## Archetype
a cream golf specimen, −25 at marquee, knockout colophon band at the foot

## Composition
columns: irregular-twelve
axis: diagonal
symmetry: broken
hero_zone: upper-left
density: dense
rhythm: interrupted
shell_posture: footer-only
field_ratio: type-dominant
collapse: reorder
hero_object: figure

## Composition Rationale
The win is a number, so the figure leads and the phrase captions it; I moved hero_object off the suggested `statement` (and off the "one poster line every day" rut) onto soft-forbidden `figure` because the day's fact IS a score. I moved field_ratio off `drenched` to `type-dominant` and columns off `three` to `irregular-twelve` so the page reads as a parchment type specimen with the leaderboard hung as evidence, deliberately NOT a gold flood (that would collide with the 11-05 terracotta drench and 11-08 gold leaderboard). density `dense` is soft-forbidden but a Klim specimen earns it with the full leaderboard, size markers and work index; the result differs from its nearest neighbor 11-05 on five axes.

## Mobile
carrier: At 360 the figure −25 still leads at marquee with the phrase stacked beneath it; the vertical spine label drops to a horizontal eyebrow and the leaderboard becomes a full-width band directly under the hero.
first_fold: The mark top-left, the −25 figure at 5xl, and the phrase "twenty-five under. one shot clear." beneath it.
order: mark, hero figure + phrase, leaderboard band, selected work, site callout, footer colophon
hero_step_360: 5xl
nav_360: No top bar; mark stays top-left of the hero; nav remains the footer vertical list, each row a 44px tap target.

## Chassis
bricolage-manrope

## Visual Specification
### 1. Color Specification
- **Primary hue**: 46° deep marigold. It sits inside the 40–80° mandate and pulls directly from the golf-scorecard/trophy register; one saturated gold is the whole color story, so neutrals tint toward it for cohesion.
- **Neutral palette** (warm parchment): 50 `#FCF9F1`, 100 `#F5EEDD`, 200 `#EAE0C9`, 300 `#D8CBAB`, 400 `#BBAD87`, 500 `#938763`, 600 `#6E6346`, 700 `#4B4330`, 800 `#26221A`, 900 `#17150E`
- **Accent color** (gold): light `#E6B436`, default `#C8870B`, dark `#7A5206`, glow `#F6E2A8`
- **Secondary accent**: none. One gold carries the page.
- **Background**: page bg `#FCF9F1`, card/surface `#F8F2E2`, knockout field band `#26221A`
- **Text colors**: primary `#17150E`, secondary `#574E38`, faint `#6E6346`

### 2. Typography
- **Hero phrase rendering**: Bricolage Grotesque `display`. The hero OBJECT is the figure `−25`, set at the `hero` clamp (marquee) in primary ink with the minus sign in gold. The hero PHRASE "twenty-five under. one shot clear." steps down to `4xl`/`3xl`, lowercase, flush-left directly beneath the figure as its caption. One h1, carried by the phrase; the figure is the loud element it captions.
- **Type treatment**: `hero` for the figure; `4xl` for the phrase; `2xl` for the leaderboard leader and selected-work titles; `lede`/`md` for decks and standfirsts (this is the mid-register the page must spend); `base` for Manrope body at 60–68ch, leading 1.5; `sm`/`xs` for the vertical spine label and colophon metadata. Manrope set `tabular-nums` everywhere a score appears.

### 3. Layout Specification
- **Composition**: irregular-twelve / diagonal / broken / upper-left / dense / interrupted / footer-only / type-dominant / reorder / figure. A 12-column specimen grid lets the marquee figure anchor upper-left while the leaderboard rows hang right, and the reading path cuts diagonally from the `−25` down to the phrase, the way the eye crosses a scorecard.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px`. Hero figure occupies cols 2–7, rows 1–2; vertical spine label col 1; leaderboard cols 8–12, rows 1–3; phrase cols 2–7, row 3.
- **Major dimensions**:
  - Hero zone min-height `78vh`
  - No fixed sidebar; the spine label column is ~5% / 1 of 12
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 112px)`
  - Section padding: vertical `clamp(48px, 7vw, 112px)`, the interrupted caesura being one doubled gap between hero and selected work
- **Nav placement**: deferred to the footer colophon band; no top bar.
- **Hero phrase grid zone**: figure rows 1–2 cols 2–7 at `clamp(72px,12vw,160px)`; phrase row 3 cols 2–7 at `4xl` (~56–72px at 1440).
- **Home callout slot**: `<SiteCallout />` sits on `/` below the Selected Work index and above the footer colophon band, full column width, in today's `bgAlt`. Between Selected Work and the footer. No copy or styling authored here.

### 4. Component Character
- **Border radius**: cards/panels `2px`, buttons `3px`, tags `2px`. Near-square, specimen-precise.
- **Border treatment**: bordered with hairlines, `border` for row rules, `borderStrong` for section breaks and the leader row.
- **Shadow**: none. Depth comes from the dark knockout band value, not shadow.
- **Density**: dense but gridded, Klim-specimen discipline, nothing floats.
- **Interactive states**: links `accentAlt` ink, hover underline in `accent`; leaderboard rows raise the gold rule on hover.

### 5. Signal Integration
- **Golf**: the hero. `−25` at marquee; full top-5 leaderboard as hairline-ruled rows cols 8–12 (Brown −25, James −24, Kim −22, Hirata −21, Ford −20), leader row carrying a gold `borderStrong` rule, scores right-aligned tabular.
- **Sports scores**: Lions 19–9 and Pistons 122–111 set as two tabular rows in the footer colophon band, reversed cream-on-ink.
- **Market**: SPY 752.69, +2.37% in the colophon, up-direction in gold.
- **Quote**: Stephen King's "hope is a good thing" set small at the colophon tail, attributed, not as hero.
- **Holiday**: "Veterans Day tomorrow, Nov 11" as one colophon line.
- **Music**: Guided by Voices and Wet Leg named in the colophon as standing rotation, labeled "in rotation," never as an event.
- **Weather/moon**: Aldie, sunny, 44°F and new moon (2% lit) as the top-right hero readout opposite the mark.

## Self-Check
1. Hero quotability: Yes — "twenty-five under. one shot clear." stands alone as a golf line, two fragments, a real number and a real margin.
2. Because-of chain: Yes — decisive low score → figure object at marquee → bricolage renders a 160px numeral → one saturated gold on parchment → specimen grid with leaderboard as evidence.
3. Render feasibility: Yes — bricolage hero caps at 160px at 1440; `−25` is three glyphs, no overflow.
4. Canvas floor feasible: Yes — dense specimen grid, leaderboard, work index and colophon band fill 74% comfortably.
5. Phone: Yes — figure at `5xl` (~72px) plus the two-fragment phrase land inside the first 640px at 360 without cutting a word.

## Rationale
The hero is a score: Blades Brown won the WWT Championship at 25-under, one shot clear of Ben James. Doug reads leaderboards for sport and has four holes in one, so the line he'd say is the number and the margin, flat. Because the day's fact is a figure, the hero OBJECT is the numeral `−25` at marquee and the phrase "twenty-five under. one shot clear." steps down to caption it, which breaks the eight-build "one poster statement" template the owner flagged.

The figure wants a display face that renders a clean, warm, brand-driven numeral and a body that shares its humanist skeleton for a dense leaderboard: bricolage-manrope, not another condensed-caps face (anton and bebas already carried the last two golf/gold builds, and the owner is tired of the condensed rut). Lowercase, heavy, left, with a rotated tournament spine as the one vertical texture element keeps it modern and understated rather than shouty.

Palette serves the phrase by refusing to flood. The last gold golf page drenched; this one is a parchment specimen with a single deep-marigold accent pulled from the number, neutrals tinted warm toward it, and the only flooded plane is the knockout colophon band at the foot where the day's other facts (Lions 19–9, Pistons 122–111, SPY +2.37%, new moon, Veterans Day tomorrow, the GbV/Wet Leg rotation, the King line attributed small) reverse out of ink. That differs from its nearest composition neighbor on five axes, on hue, on ground strategy and on chassis, and it reaches for the Klim-specimen bar the owner named a gold standard.
