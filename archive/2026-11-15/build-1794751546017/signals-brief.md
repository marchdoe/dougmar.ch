# Signals Brief — 2026-11-15

## Hero Copy
Nobody scored on the Red Wings.

## Hero Rationale
Detroit beat the other guys 2–0 last night, a shutout, and the Red Wings are Doug's team. The line states the defensive result plainly and it pairs with the object on the page: a hollow, outlined zero is the empty net nobody got past. It beats the SpaceX Flight 15 story, which is engineering news but not Doug's engineering, and it beats the Pistons blowout, which is a loss. A shutout is a clean fact and a quiet brag at once.
Owner's voice: Doug follows the Red Wings and states a score the way it happened, no slogan, no hype.

## Archetype
a scoreboard poster where the zero is an empty net

## Composition
columns: irregular-twelve
axis: radial
symmetry: broken
hero_zone: full-bleed
density: dense
rhythm: syncopated
shell_posture: standard
field_ratio: drenched
collapse: reorder
hero_object: figure

## Composition Rationale
I kept the date tuple's drenched radial full-bleed figure because it is exactly a scoreboard poster, but I moved symmetry from the suggested `mirrored` to `broken`: a shutout is not a balanced result, it is 2 against nothing, so the composition weights the scoring side forward and leaves the hollow zero set back and open. Everything else serves the single figure the drench exists to hold.

## Mobile
carrier: the giant 2–0 and the line "Nobody scored on the Red Wings" carry the first fold alone; the signal blocks that orbited the figure at 1440 stack into one box-score column beneath it.
first_fold: the outlined 2–0 figure and its caption hero line.
order: masthead, figure 2–0, caption, Red Wings detail line, signal grid, callout, footer strip.
hero_step_360: 5xl
nav_360: the band keeps the stacked mark top-left; the nav sentence wraps to two lines, each link a 44px tap target.

## Chassis
bitter-mulish

## Visual Specification
**1. Color Specification**
- **Primary hue**: 353° (Red Wings garnet). Chosen because the hero is a Detroit Red Wings shutout and the team is red; it also sits ~175° from the last two nights' teal/jade, which the repetition check demanded.
- **Neutral palette** (warm sand, red-tinted): 50 `#FBF4F1`, 100 `#F3E7E3`, 200 `#E5D0CB`, 300 `#CDB1AC`, 400 `#AC847F`, 500 `#845C58`, 600 `#63423F`, 700 `#472E2C`, 800 `#2F1D1D`, 900 `#1D1011`.
- **Garnet scale**: 50 `#FCEBEE`, 100 `#F9D2D8`, 200 `#F0A3AE`, 300 `#E3707F`, 400 `#D24355`, 500 `#B52537`, 600 `#991B2C`, 700 `#7A1526`, 800 `#5C0F1D`, 900 `#400A14`.
- **Accent color**: default `#E3707F` (rose, the one live mark), dark `#D24355`, light/glow `#F0A3AE`, ink on accent `#400A14`.
- **Secondary accent**: none. The page is monochrome garnet by intent.
- **Background**: page bg `#7A1526` (garnet.700), band bg `#5C0F1D` (garnet.800), raised surface `#B52537` (garnet.500), flooded field `#991B2C` (garnet.600).
- **Text colors**: primary ivory `#FBF4F1`, secondary `#F9D2D8`, faint `#F0A3AE`.

**2. Typography**
- **Hero figure rendering**: the score `2–0` in `display` (Bitter) at the `hero`/`5xl` ceiling, rendered as **outlined** letterforms (stroked, ~4px ivory stroke) — the `0` reads as the empty net. clamp caps at 156px (under the 160px chassis max).
- **Caption / hero phrase**: "Nobody scored on the Red Wings." set in `3xl` solid ivory directly beneath the figure, centred. This is the one h1.
- **Type treatment**: figure at the display ceiling (outline); caption at `3xl`; signal headings at `lg`/`xl`; box-score labels at `sm`; metadata at `xs` in textFaint. Spend the middle: the Red Wings detail line sits at `xl` between the figure and the strip so there is no jump from marquee to 15px.

**3. Layout Specification**
- **Composition**: irregular-twelve / radial / broken / full-bleed / dense / syncopated / standard / drenched / reorder / figure. Content orbits the central score; the `2` sits forward and the hollow `0` is set slightly back, so the asymmetry of a shutout is the structure.
- **Grid**: `display: grid; grid-template-columns: repeat(12, 1fr); gap: clamp(12px, 1.5vw, 24px)`. The figure spans columns 3–10 rows 1–2; signal blocks take varied spans (2, 3, 4 columns) across the lower third so no two rows align.
- **Major dimensions**: hero figure zone `min-height: 82vh`; `max-width: none`; side padding `clamp(24px, 6vw, 96px)`; section rhythm on a 24px base (multiples: 24/48/72).
- **Nav placement**: top-bar masthead band, 120px tall, stacked mark+wordmark at left, nav sentence at right.
- **Hero phrase grid zone**: figure rows 1–2 cols 3–10; caption row 3 cols 3–10, centred, ~156px figure over a ~40px caption at 1440.
- **Home callout slot**: `<SiteCallout />` sits below the signal grid and above the footer data strip, full width, in bgAlt.

**4. Component Character**
- **Border radius**: cards 2px, buttons 4px, tags 2px. Sharp, scoreboard.
- **Border treatment**: hairlines in `border` (garnet.600); section breaks in `borderStrong` (garnet.400). Bordered, no fills on cards beyond value.
- **Shadow**: none. Depth comes from value, not shadow (drench).
- **Density**: dense in the signal grid, generous around the figure.
- **Interactive states**: links underline in ivory, shift to accent (`#E3707F`) on hover; no transforms.

**5. Signal Integration**
- **Red Wings 2–0**: the hero figure, outlined, full-bleed.
- **Pistons 117–137**: plain box-score line in the signal grid, stated as a loss, no spin.
- **Golf**: Austin Championship, Trace Crowe −14 leads, in a 3-column signal block.
- **SpaceX**: one terse line, "Starship caught on Flight 15," in the grid as the day's engineering note.
- **Market**: SPY 754.37, down 0.36%, in the footer strip, tabular figures.
- **Moon**: first quarter, 40% lit, strip.
- **Weather**: Aldie, 43°F, partly cloudy, feels like 38°, strip.
- **Music**: Tobin Sprout, The War on Drugs, Wet Leg under an "in rotation" label, small, set apart from the live results so it never reads as an event.
- Sports scores set in Bitter slab figures, tabular, ivory, the live Red Wings result marked once in accent rose.

## Self-Check
1. Hero quotability: Yes — a plain, screenshot-able shutout line that doubles as the caption of an empty-net zero.
2. Because-of chain: Yes — shutout → asymmetric figure (broken radial) → slab outline (empty net) → committed garnet drench → centred full-bleed.
3. Render feasibility: Yes — three glyphs at 156px in Bitter clear 1440 with room.
4. Canvas floor feasible: Yes — dense irregular-twelve signal grid plus full-bleed drench fills 82%.
5. Phone: Yes — `2–0` at 5xl (64px) plus caption lands inside the first 640px at 360.

## Rationale
The phrase is "Nobody scored on the Red Wings," composed from last night's 2–0 shutout, Doug's team, stated the way he states a score. A shutout is two things at once: a quiet result and a wall nobody got through. That is why the object is a figure and not a statement — the score `2–0` is the largest thing on the page, and the zero is drawn as an outline so it reads as the empty net nobody beat. The caption carries the sentence under it.

Because the result is asymmetric, the composition is broken rather than mirrored: the `2` leans forward, the hollow `0` sits back and open, and the signal data orbits the center on an irregular twelve-unit grid so the page reads as a dense scoreboard around one number. The chassis is Bitter, a slab serif — the newspaper-sports register, sturdier than the condensed-caps reflex I was warned off — and its bracketed serifs give the outlined numeral a scoreboard identity even hollowed out. Weight is light and the figure is outlined on purpose: a clean sheet is restraint, not force.

The palette is a single committed garnet, the team's red, drenched across the whole field with ivory ink and one brighter rose mark for the live line. I left the 140-180° mandate deliberately: the repetition check demanded distance from the last two nights' teal, and a Red Wings shutout has exactly one correct color. The masthead is a standard top bar with a stacked mark and a nav written as a sentence, moving off the recent footer-only and folded headers and off the wordmark-left / links-right pattern the owner has rejected three ratings running.
