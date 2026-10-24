# Signals Brief — 2026-10-24

## Hero Copy
Pistons run away with it, 128–111

## Hero Rationale
Detroit won by seventeen on Saturday, and a Detroit result is the one signal here that is unambiguously Doug's: taste.md names the Pistons by name and the voice file says a score is a score. The composed line states the fact and adds the only editorial a blowout needs ("run away with it"), with the number itself carried at poster scale as the object. It beats the Napoleon Hill quote because the quote is somebody else's poster; the score is his team. Owner's voice: A Pistons win is a Pistons win. I just say the score.

## Archetype
a trophy-amber scoreboard, the score as the sun and the day orbiting it

## Composition
columns: three
axis: radial
symmetry: broken
hero_zone: center
density: measured
rhythm: interrupted
shell_posture: footer-only
field_ratio: drenched
collapse: hero-only
hero_object: figure

## Composition Rationale
A scoreboard centers its score, so I moved hero_zone off the mandate's `interleaved` to `center` and columns off `two-asymmetric` to `three`: the figure is the fixed sun and the three-column grid hosts the satellites that orbit it, with symmetry broken once (the oxblood margin chip and the full-moon disc pulled off-axis) as the focus. I moved collapse off `split-to-sequence` to `hero-only` because a radial orbit has no split to sequence — at 360 the number must own the first fold and the satellites flatten below it. Radial, drenched, footer-only and figure stay on the starting tuple because a triumphant single number is exactly what they describe.

## Mobile
carrier: The score carries it alone — 128 stacked over 111 fills the first screen like a flip-board, and the orbit's satellites fall into one centered column beneath.
first_fold: the single-color mark, then the stacked figure 128 over 111 with its caption "Pistons run away with it", and nothing else.
order: mark, figure + caption, golf, moon, market, weather, home callout, footer box-score nav
hero_step_360: hero
nav_360: mark centered at the top of the amber hero; the numbered nav collapses to a stacked 01/02/03 list inside the knockout band at the foot.

## Chassis
alfa-rubik

## Visual Specification
**1. Color Specification**

- **Primary hue**: 34° (trophy amber). A Detroit blowout is triumph, and triumph wants a saturated single hue drenched edge to edge. 34° pushes the recent gold cluster (44–52°) toward orange so it reads as its own ground, and it answers late October without turning into a Halloween costume. It sits just under the mandate's 40–80 target; the justification is triumph plus seasonal warmth plus differentiation from five recent golds.
- **Neutral palette (warm umber)**: 50 `#F7F1E6`, 100 `#EADCC4`, 200 `#D3BD94`, 300 `#B2975F`, 400 `#8A6E3C`, 500 `#654E28`, 600 `#5E4414`, 700 `#3E2D0C`, 800 `#2A1D0B`, 900 `#1C1004`
- **Accent (oxblood)**: light `#DD7154`, default `#A82E15`, dark `#6A180B`, glow `#C9472A`
- **Secondary accent**: oxblood is the only second register; used as a fill chip for the winning side and the margin, never as small text on amber.
- **Background**: page ground `#D07C0C` (amber drench), band/callout bg `#BE7310`, raised surface `#ECA428`, knockout footer field `#1C1004`
- **Text colors**: primary `#1C1004`, secondary `#2A1D0B`, faint `#3E2D0C`; on the knockout field, ink `#FCEAC8`, muted `#F3BC54`

**2. Typography**

- **Hero phrase rendering**: the FIGURE is the object. `128–111` is set in `display` (Alfa Slab One) at the `hero` step, `hero_scale` clamp, centred, near-black ink on the amber flood, arriving by a left-to-right wipe like a flip-board. The h1 phrase "Pistons run away with it" sits one step down at `4xl`, caps, centred, directly beneath the number as its caption; together the number and its caption are the single h1.
- **Type treatment**: use the ramp steps as textStyles. `hero` for the score; `4xl` for the caption line; `2xl` for satellite figures (golf −13, moon 98.8%, SPY −0.52%, 41.7°F); `lede`/`md` for the deck and satellite labels; `base` for any body; `sm`/`xs` tracked caps for micro labels and the footer box-score. Mid-register is mandatory: the `2xl` satellite numbers and the `lede` deck fill the gap between the poster score and the fine print.

**3. Layout Specification**

- **Composition**: three / radial / broken / center / measured / interrupted / footer-only / drenched / hero-only / figure. The score is the fixed point of a scoreboard, so it sits dead center and the day's other facts orbit it; the near-symmetry of that orbit is broken once (the oxblood margin chip pulled off-axis toward the 128) and that break is the focus.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1fr minmax(auto, 920px) 1fr; place-items: center;` with satellites absolutely positioned at radial offsets around the center cell at 1440.
- **Major dimensions**:
  - Hero orbit area: `min-height: 88vh`
  - No sidebar.
  - Max content width: `max-width: none`; `padding: 96px 6vw`. Full-width canvas, not a centered measure column (body copy inside the callout/about caps at ~66ch).
  - Section spacing on a 1.5× base; one deliberate large gap (the caesura) between the orbit and the home callout.
- **Nav placement**: deferred to the foot (footer-only). The mark lives top-center of the amber hero, stacked above the score, inside the first fold at 1440 and 360.
- **Hero phrase grid zone**: center cell, rows 2–4, the `128–111` figure spanning ~720px wide at 1440 with the caption beneath; the orbit satellites occupy columns 1 and 3 at staggered heights.
- **Home callout slot**: on `/`, directly below the orbit section and above the footer box-score band, occupying the caesura gap. Full width, today's `bgAlt`/`text`/`textMuted`/`accent`/`borderStrong`. No copy or styling authored here.

**4. Component Character**

- **Border radius**: cards/chips `2px`, the oxblood margin chip `2px`, the circular satellites `full`; buttons `2px`. Physical, hard-edged, no soft corners.
- **Border treatment**: hairlines in `border` (`#94590C`) around satellites; section rules in `borderStrong` (`#2A1D0B`). Bordered, not shadowed.
- **Shadow**: none. Depth comes from value (the amber flood, the dark footer field), not elevation.
- **Density**: measured. Satellites breathe; one large gap acts as the caesura.
- **Interactive states**: links underline-thicken on hover; the margin chip lifts opacity on hover; footer nav numbers shift to oxblood on hover.

**5. Signal Integration**

- **Where signals live**: the score is the center; everything else orbits as satellites, then repeats as a box-score row in the footer.
- **Sports scores**: `128–111` is the hero figure at `hero` scale, near-black on amber, winning side `128` tagged with an oxblood `+17` chip (cream text). The caption names it.
- **Quote**: Napoleon Hill, "Opportunity often comes disguised in the form of misfortune or temporary defeat." Set small in the footer box-score band with attribution visible; it is NOT the hero.
- **Golf**: Butterfield Bermuda satellite, `−13` at `2xl`, labeled "Hirata / Blanchet, tied."
- **Market**: SPY `759.97` with an oxblood down-tick `−0.52%` satellite.
- **Weather**: `41.7°F` clear, Aldie, as a satellite.
- **Moon**: a filled amber disc at `98.8%`, full moon, the satellite pulled slightly to break symmetry.
- **Music**: The War on Drugs, Guided by Voices — one quiet line in the footer, framed as the rotation it is, never beside the score as an event.
- **Holiday/season**: Halloween in 7 days noted small in the footer upcoming line; the amber already carries the season.

## Self-Check
1. Hero quotability: Yes — "Pistons run away with it, 128–111" is a fan's line a Detroit follower would screenshot.
2. Because-of chain: Yes — a triumphant score demands a figure at poster scale (figure object, radial center), a physical loud slab (alfa-rubik), an amber triumph drench, and a scoreboard orbit grid.
3. Render feasibility: Yes — `128–111` at 160px Alfa Slab fits ~720px inside the 920px center cell at 1440 without overflow.
4. Canvas floor feasible: Yes — a drenched amber flood with a centered orbit and a knockout footer easily clears 78%.
5. Phone: Yes — at 360 the figure stacks 128 over 111 at the `hero` step (~110px, three digits ~200px) inside the first fold with its caption, no cut.

## Rationale
The phrase is a composed Detroit score, "Pistons run away with it, 128–111," the one signal today that is unambiguously Doug's. A blowout is a number, so the composition leads with the object: hero_object `figure`, the score at poster scale, dead center, with everything else in the day treated as satellites that orbit it. Radial axis and a three-column grid give those satellites their positions; the near-symmetry of the orbit is broken once, the oxblood margin chip and the full-moon disc pulled off-axis, and that single violation is the focus the composition mandate asks for.

A score that runs away with it wants weight and physicality, not elegance, so the chassis is alfa-rubik, an ultra-bold fatface slab that has never shipped here and whose numbers read like a fairground flip-board at 160px. Its single display weight and roman-only cut force `weight: regular` and `lead: roman`; the caps, centred setting and type-as-texture ("DETROIT" ghosted amber-on-amber behind the score) are the decisions carrying the typographic variance. The palette is triumph made literal: a 34° trophy-amber drench across ~70% of the viewport, the gold-standard scoreboard flood, pushed off the recent gold cluster toward orange, with one oxblood accent doing exactly one job, marking the seventeen-point margin.

Layout serves the figure end to end. Footer-only defers the nav to a knockout box-score band at the foot where the day's facts belong, and plants the brand mark top-center of the hero so it sits in the first fold the owner keeps asking for; because a bright amber is a saturated mid-tone, the contract's contrast test fails the full-colour mark, so it renders single-color at 6.9:1 and will not sink. At 360 the orbit collapses to hero-only: the score stacks 128 over 111 like a board, caption beneath, satellites flattened into a column below. The home callout takes the caesura gap between the orbit and the footer.
