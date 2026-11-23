# Signals Brief — 2026-11-23

## Hero Copy
Ten years independent. Still the vehicle for the next experiment.

## Hero Rationale
Lifted from Doug's own voice file, where he describes Spaceman as "the LLC I've worked under for ten years" and "still the vehicle for the next experiment." On a Monday when SPY dropped 3.6% and the news is all noise and caregiving and layoffs-adjacent anxiety, the steadiest true thing on the page is that Doug has run his own shop for a decade and is already building the next small thing (FishSticks, 15th Club, the one after). It beats another design/build credo because the recent run already fished that theme three times; this one is about endurance and forward motion, not the gap. It beats the Aristotle quote because that line elevates teaching over doing, and Doug is a doer who builds the things he wants to exist, so the quote would be a poster of Aristotle, not of him.
Owner's voice: Doug literally wrote this line about Spaceman; ten years, one vehicle, next experiment, no hype.

## Archetype
a drenched ledger-specimen: the decade outlined, the next experiment solid

## Composition
columns: irregular-twelve
axis: horizontal
symmetry: broken
hero_zone: full-bleed
density: dense
rhythm: syncopated
shell_posture: folded-into-hero
field_ratio: drenched
collapse: reorder
hero_object: statement

## Composition Rationale
I kept the mandate's horizontal/dense/syncopated/folded-into-hero/drenched/statement because a two-beat credo on a committed field is exactly that read. I moved columns off `three` to `irregular-twelve` so the marquee statement can run full-bleed while the day's signals pack the cells below as size-marked specimen furniture (three newspaper columns would chop a 112px caps line). I moved symmetry off `symmetric` to `broken` so line one (outlined decade) and line two (solid saffron future) carry different weight and position, and I moved collapse off `hero-only` to `reorder` so the dense furniture survives at 360 instead of vanishing below an isolated hero. hero_zone went to `full-bleed` because a drench wants the type filling the field, not floating centered with clearance.

## Mobile
carrier: The drench field and the centred caps statement carry it; the signal furniture restacks as a single-column data list beneath.
first_fold: The hero statement, "TEN YEARS / INDEPENDENT." wrapping at 3xl with "Still the vehicle for the next experiment." solid saffron below it.
order: hero statement, golf live marker, Detroit scores, market, sun and moon, work index, site callout, footer data strip
hero_step_360: 3xl
nav_360: Mark holds top-left at ~48px; the running sentence nav wraps to three underlined links on one line below the mark.

## Chassis
zilla-worksans

## Visual Specification
## 1. Color Specification

**Primary hue**: 187° petrol teal. The color mandate targets 140–180° but its own forbidden band (12–182°) swallows that target because fairway-green 152° and teal 170° shipped recently; 187° is the open slot just past the forbidden edge, a cooler deep petrol distinct from both recent greens. Drenched cool reads as stillness, which is the point against a 3.6% market drop and a cloudy full-moon Monday.

**Neutral palette (teal-tinted)**: 50 #F2F7F6 · 100 #E2ECEB · 200 #C6D6D5 · 300 #A6BCBB · 400 #76908F · 500 #556E6D · 600 #3E5453 · 700 #2C3E3D · 800 #1C2B2A · 900 #0F1A19

**Accent color (saffron)**: light #F8CF85 · default #F2A32C · dark #B9741A · glow #F8CF85

**Secondary accent**: none beyond saffron. Saffron is the single turned-on hue; it marks only what is live or forward (the RSM Classic in progress, the "next experiment" line).

**Background**: page bg #0E4D52 (deep petrol teal, the drench field) · card/surface #146064 · second ground / band #0A3C40

**Text colors**: primary #E9F5F4 · secondary #9BD1D0 · muted/faint #63B4B5

## 2. Typography

**Hero phrase rendering**: Zilla Slab display at the `hero` ramp step for line one, "TEN YEARS INDEPENDENT.", set in outlined caps (transparent fill, `text`-colored stroke) so the decade reads as a frame already filled. Line two, "STILL THE VEHICLE FOR THE NEXT EXPERIMENT.", drops to the `3xl` step in solid saffron (`accent`) caps, the live and forward clause rendered solid and glowing. The whole two-sentence phrase is the single h1; the outlined line is the largest element on the page.

**Type treatment**: `hero` for line one, `3xl` for line two (the syncopated two-beat), `lg` Work Sans for the one-line standfirst/deck, `base` Work Sans for the data-strip rows and any body, `sm` small for signal labels, `2xs` for the size-marks and metadata set as specimen furniture. Hold body at 60–70ch, leading 1.5–1.6. Each small label sits with twice the space above it as below, binding down to its row.

## 3. Layout Specification

**Composition**: irregular-twelve / horizontal / broken / full-bleed / dense / syncopated / folded-into-hero / drenched / reorder / statement. A twelve-column grid lets the marquee statement span full-bleed across rows 1–3 while the day's signals pack the cells below as size-marked furniture, so the page reads as a committed specimen, not a centered stack.

**CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); gap: clamp(12px, 1.4vw, 24px);` Hero block spans columns 1–12, rows 1–3. Signal furniture occupies asymmetric spans below (e.g. golf cols 1–5, Detroit cols 6–9, market cols 9–12, sun/moon cols 1–4).

**Major dimensions**:
- Hero/featured area: `min-height: 82vh`
- No fixed sidebar (folded-into-hero).
- Max content width: `max-width: none`; side padding `clamp(24px, 5vw, 72px)`.
- Section padding: vertical `clamp(48px, 7vw, 112px)`.

**Nav placement**: folded into the hero's top row. Stacked-lg lockup top-left; the three nav links woven into one running line top-right. Top row height ~120px.

**Hero phrase grid zone**: rows 1–3, columns 1–12; line one at `clamp(52px, 8vw, 112px)`, line two at the `3xl` step, both centred within the full-bleed field.

**Home callout slot**: on `/`, place `<SiteCallout />` below the signal furniture band and above the footer data strip, between the work-index band and the footer. Full width, bgAlt band, untouched.

## 4. Component Character

**Border radius**: cards 2px, buttons 4px, tags 2px. Sharp, specimen-like.

**Border treatment**: hairline rules in `border`; section breaks and the data-strip head in `borderStrong`. No box shadows.

**Shadow**: none. Depth comes from value (surface is lighter than bg in dark).

**Density**: dense. Small gutters, information-forward, size-marks as material.

**Interactive states**: links underline on `_hover` and shift to `accent`; nav links carry a 1px saffron underline that thickens on hover.

## 5. Signal Integration

**Where signal elements live**: a dense furniture band directly below the hero, specimen cells on the twelve-column grid, plus a footer data strip.

**Sports scores**: Lions 31–21 (win) and Pistons 97–107 (loss) set as tabular `base` Work Sans figures in mint, each with a `2xs` label above. En dashes in the scores only.

**Golf**: RSM Classic is the one live event, so it gets the saffron: "Max Greyserman and Rasmus Højgaard, −14, tied" set with the figure in `accent` saffron on teal, flagged "in progress."

**Market**: SPY 689.81, −26.06, −3.64% in a muted mint cell, label above; stated as a fact, no drama.

**Quote**: the Aristotle line is not the hero; it sits as a small `sm` footnote in the data strip with its attribution, "Aristotle," visible, used as the day's found text, not Doug's voice.

**Holiday**: Thanksgiving is 3 days out, noted as a `2xs` countdown marker in the footer strip, not a hero.

**Music**: Guided by Voices / Tobin Sprout treated as a standing "on rotation" caption in the footer strip, `2xs`, never beside a score as if it happened today.

**Moon/sun**: full moon 99.9% and daylight 9.6h as small paired figures in a sun/moon cell.

## Self-Check
1. Hero quotability: Yes — "Ten years independent. Still the vehicle for the next experiment." is a standalone credo, not a descriptive opener.
2. Because-of chain: Yes — endurance credo → drenched still field + broken two-weight statement → structural slab (Zilla) → petrol-teal cool for stillness, saffron for the live/forward beat.
3. Render feasibility: Yes — Zilla hero clamps to 112px at 1440 (under its 120px ceiling), line two drops to 3xl; no overflow at full-bleed.
4. Canvas floor feasible: Yes — dense signal furniture plus a full-bleed marquee statement and footer data strip genuinely fill 82%.
5. Phone: Yes — at 360 the caps line wraps "TEN YEARS / INDEPENDENT" at 3xl inside the first fold without cutting a word.

## Rationale
The phrase is a plant-your-feet credo lifted straight from Doug's own words about Spaceman: ten years running his own shop, already building the next small thing. On a Monday when the market fell 3.6% and the headlines are caregiving costs and a dead reality star and layoff-adjacent AI talk, the steadiest true thing is Doug's decade. So the page is drenched in a deep petrol teal, a cool committed field that reads as stillness, not noise. The composition is a full-bleed statement: the credo is the single h1, broken into two beats, the decade outlined like a frame already filled, the next experiment solid and glowing saffron. That is the one place color turns on, and it lands only on what is actually live and forward.

Zilla Slab carries it because the catalog's structural-civic-grounded voice is exactly the register of "ten years independent": a sturdy slab says built, not shouted. It shipped once two weeks ago in a completely different treatment (dark-void, lower-case, vertical), so today's drenched caps outline is a genuine new use, and it keeps me off the three condensed-caps chassis and off the three recently-avoided faces. The twelve-column grid lets the marquee run full-bleed while the day's signals pack the cells below as size-marked specimen furniture, so the page is dense and committed rather than a centered stack with one poster line.

The palette is one dominant hue at volume with a single warm pulse, the gold-standard committed gesture. Petrol teal 187° sits in the open slot just past the mandate's self-contradictory forbidden edge, distinct from the recent fairway and teal greens, and cool drench fits the day's mood. Saffron marks the RSM Classic in progress and the forward clause, nothing else, so the accent stays rare and load-bearing. The brand mark folds into the hero top-left, white disc carrying on the deep teal in dark and the mono mark stepping in for the pale light scheme, inside the first fold at both widths.
