# Signals Brief — 2026-11-01

## Hero Copy
Loss is nothing else but change, and change is nature's delight.

## Hero Rationale
This is Marcus Aurelius, lifted from `signals.quote`, and it wins the day because today is literally a day of losses stated plainly: the Red Wings fell 4–5, SPY dropped 1.77%, the moon is waning to last quarter, and it is the first overcast Sunday of November in Aldie. The line names exactly that mood and then turns it, which no score-lead or weather fact could do on its own. It beats a composed line about Doug's own day because Doug's day here is a string of small losses; rather than dress up a bad Sunday, the honest move is to let an old, attributed line do the talking, with the author's name standing in plain view. Attribution renders twice: vertically at the field edge and as a caption beneath the quote.
Owner's voice: a down market, a Red Wings loss, fall coming on. Doug would rather let a line about loss carry it than hype a grey Sunday into something it wasn't.

## Archetype
a stoic line drenched at dusk, reversed out of oxblood

## Composition
columns: single
axis: radial
symmetry: broken
hero_zone: lower-third
density: measured
rhythm: interrupted
shell_posture: footer-only
field_ratio: drenched
collapse: stack
hero_object: statement

## Composition Rationale
Seven axes sit on the mandate's starting tuple because a quiet, drenched quote genuinely wants them: radial content orbiting the low quote, a broken near-symmetry whose violation is the rose italic break, an empty upper two-thirds as the caesura, measured spacing, the nav deferred to the foot, color flooding the field. I moved `collapse` off `split-to-sequence` to `stack` because there is no split field to sequence — a single column stacks honestly at 360 — and `hero_object` off `figure` to `statement` because today's anchor is a 12-word quote, not a number; no score, moon figure, or market tick deserves poster scale over the line itself. I also moved `alignment` off the recently-worn left/right/justified to `centred`, the one fresh value, which pairs with the radial axis and sets the quote as a monument rather than a left-rail paragraph.

## Mobile
carrier: The single column already carries it — wine drench floods the screen, the mark anchors the top, the centred quote holds the middle, signals and nav fall to the foot.
first_fold: Mark lockup top-left and the place/weather standfirst top-right, then the Aurelius quote "Loss is nothing else but change, and change is nature's delight." set at 3xl, centred, reversed out of the wine field.
order: mark + standfirst, hero quote + attribution, site callout, signals colophon + nav
hero_step_360: 3xl
nav_360: Mark stays top-left; nav and signals collapse into the full-width footer index at the foot.

## Chassis
dm-serif-public

## Visual Specification
### 1. Color Specification
- **Primary hue**: 340° (oxblood wine). Chosen as a contemplative autumn-dusk hue that reads as loss and richness at once; it sits 64°+ from every hue in the recent 7-build window (174, 48, 220, 165, 92, 46, 276), satisfying the repetition check's 60° demand. It falls outside the color mandate's 140–180 target and is justified below: a muted cyan-green cannot carry a line about loss, while wine names both the mourning and the "delight" the phrase insists on.
- **Neutral palette** (warm, wine-tinted): 50 `#faf4f5`, 100 `#f0e6e8`, 200 `#ddccd0`, 300 `#c3aeb4`, 400 `#9c838b`, 500 `#766069`, 600 `#574650`, 700 `#3d3038`, 800 `#271e24`, 900 `#170f13`
- **Accent color** (rose): light `#f7b9c8`, default `#e5708c`, dark `#b23659`, glow `#fcdce3`
- **Secondary accent**: none
- **Background**: page bg `#4a1524` (wine.800), card/surface bg `#6a1f33` (wine.700), footer/band bg `#2e0d17` (wine.900)
- **Text colors**: primary text `#faf4f5` (neutral.50), secondary text `#ddccd0` (neutral.200), muted text `#c3aeb4` (neutral.300)

### 2. Typography
- **Hero phrase rendering**: the quote is set in the `display` face (DM Serif Display, high-contrast didone) at the `5xl` textStyle, sized by `hero_scale` = `clamp(40px, 6vw, 96px)`, caps, centred, reversed out of the wine field in `text` ivory. It is the single largest element. The closing phrase "nature's delight" renders in `accent` rose `#e5708c`, italic (DM Serif loads display italics), the one break in an otherwise roman block — the composition's focal violation.
- **Type treatment**: hero at `5xl`; a mid-register standfirst (place, weather, date) at `md`; the author caption and signal labels at `lg`/`base`; colophon metadata at `sm`; micro labels at `xs` (floors at 13px). At least three live steps between hero and micro so the page is never a two-size jump. Attribution MARCUS AURELIUS also set rotated 90° along the left field edge in `textMuted` at `sm` (the `vertical` texture).

### 3. Layout Specification
- **Composition**: single / radial / broken / lower-third / measured / interrupted / footer-only / drenched / stack / statement. The upper two-thirds hold an almost-empty wine field (the caesura), the quote settles low and centred, and the broken radial symmetry — the flush rose italic break plus the vertical author line — is the focal point. A reflective 12-word line wants stillness above it and weight below.
- **CSS grid/flex structure**: `display: grid; grid-template-rows: auto 1fr auto; min-height: 100vh;` row 1 the mark lockup + top-right standfirst, row 2 the centred quote block anchored to the lower third (`align-self: end; padding-bottom: 12vh`), row 3 the SiteCallout then the footer colophon.
- **Major dimensions**:
  - Hero field: `min-height: 100vh`, drenched edge to edge
  - Max content width: `max-width: none`, side padding `clamp(24px, 6vw, 96px)`; quote block itself capped at `~22ch` per line for the caps measure
  - Section padding: vertical rhythm on the chassis base unit; quote block `padding-bottom: 12vh`
- **Nav placement**: deferred to the footer band (footer-only). Links stack as a vertical index, one `fieldBorder` hairline per row, over the deepened wine foot (`bgAlt`).
- **Hero phrase grid zone**: row 2, full width, bottom-anchored — occupies roughly the lower third (vertical 62%–88% of the viewport) centred horizontally, at `clamp(40px, 6vw, 96px)`.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the hero quote block and above the footer colophon, between row 2 (hero) and row 3 (footer). Placed, not designed.

### 4. Component Character
- **Border radius**: cards/panels `10px` (lg), tags/rules `2px` (sm), buttons `4px` (md). Didone editorial wants near-square edges.
- **Border treatment**: hairlines in `border`; section breaks in `borderStrong`; rules inside the wine foot in `fieldBorder`.
- **Shadow**: none. Depth comes from value shifts between bg/surface/bgAlt, not shadow.
- **Density**: spacious, measured.
- **Interactive states**: nav links shift from `textMuted` to `accent` on `_hover`, with the row hairline brightening to `borderStrong`; 44px minimum row height for touch.

### 5. Signal Integration
- **Where signal elements live**: the footer colophon band, a single ruled vertical column reversed out of `bgAlt`.
- **Sports scores**: Red Wings 4–5 loss set as `Red Wings fall 4–5` in `text` with the number in `accent`; it quietly rhymes with the hero's "loss." Golf as `Mexico Open · Novak -23 · Ghim -16`, scores in `textMuted`, tabular figures.
- **Quote display**: the quote IS the hero phrase — centred, caps, didone, reversed out of wine, closing phrase rose italic. Author rendered vertically at the left edge and as a caption beneath.
- **Holiday elements**: none today.
- **Music**: `In rotation: The War on Drugs, Tobin Sprout` in the colophon as taste, labeled "in rotation," never beside the scores as an event.
- **Other signals**: `Aldie, Virginia · Overcast · 50°F` as the top-right standfirst; `Last quarter moon, 53% lit`, `SPY 755.72, down 1.77%`, `Air quality moderate` in the colophon; date `01 Nov 2026` at the lockup.

## Self-Check
1. Hero quotability: Yes — a complete, attributed Marcus Aurelius sentence, screenshot-worthy in isolation.
2. Because-of chain: Yes — a long reflective quote drove didone + drench + lower-third stillness + vertical attribution + wipe entrance.
3. Render feasibility: Yes — 12 words at `clamp(40px,6vw,96px)` (96px < DM Serif's 160px ceiling) wrap across ~4 centred lines in the lower third without overflow.
4. Canvas floor feasible: Yes — the wine drench floods the full canvas and the quote + lockup + callout + footer fill content comfortably past 68%.
5. Phone: Yes — at `3xl` the quote stacks ~5 lines under the mark inside 640px with no word cut.

## Rationale
The phrase is a complete, attributed Marcus Aurelius line about loss and change, nominated because today is a day of small losses stated plainly — the Red Wings fell 4–5, SPY dropped 1.77%, the moon wanes, November opens grey over Aldie. A reflective twelve-word sentence cannot be shouted in a condensed poster face; it wants an editorial voice and stillness, so the composition holds the upper two-thirds nearly empty (the caesura of `interrupted`) and settles the quote low and centred, orbited by its own attribution and the day's facts (`radial`, `lower-third`, `broken`). The one break in the near-symmetry is "nature's delight" in rose italic — the only warmth in the line, made the only warmth on the field.

That editorial-literary need chose DM Serif Display, a high-contrast didone the owner already praised at scale ("didone at scale, best type of the week," 09-10); it is the longest-ago serif in the window and loads the display italics the closing phrase needs, and its single weight forces the fresh `regular` the type mandate wanted. Didone caps reversed out of color read like an engraved plaque, which is the register loss asks for. The palette is a drench of oxblood wine at 340° — a committed single hue across ~78% of the field, the gold-standard terracotta move relocated to a moodier dusk hue, 64°+ off every recent primary. I accept the deviation from the 140–180 mandate: a muted cyan-green reads as weather or stillness, not as loss turned toward delight, and the phrase is the authority here.

Layout follows: single column, drenched, nav deferred to a footer colophon so nothing clutters the quiet top, the stacked-lg mark anchoring the empty upper-left and the place/weather standfirst balancing top-right. The signals live as a ruled vertical index in the wine foot, the Red Wings loss quietly rhyming with the hero. The wipe entrance reveals the line left to right like a sentence being read, the mesh ground drifts like overcast dusk light, and sections below rise on scroll — motion the shipped site has never had, chosen because "change" is the subject.
