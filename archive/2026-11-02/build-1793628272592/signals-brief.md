# Signals Brief — 2026-11-02

## Hero Copy
Lions win ugly, and I'll take it.

## Hero Rationale
Detroit beat its NFL opponent 19-15 on Sunday, a four-point, one-score grind with no touchdown shootout and no cushion. This is the one signal this morning that is unambiguously Doug's: a Lions result, stated the way a fan states it, in first person with an opinion. It beats the Disney quote (chosen lane yesterday, and not his register) and beats the golf win because Detroit is his team, named by him in the voice file. The score itself leads as the poster figure; this line is its caption.
Owner's voice: I'm a Lions fan, a one-score grind in November is still a win, and I'll take it.

## Archetype
reads like a night scoreboard

## Composition
columns: irregular-twelve
axis: vertical
symmetry: left-weighted
hero_zone: upper-left
density: sparse
rhythm: syncopated
shell_posture: standard
field_ratio: field-dominant
collapse: hero-only
hero_object: figure

## Composition Rationale
The figure has to read as a scoreboard number, so I kept the mandate's `figure` and `field-dominant` starts but moved `columns` to irregular-twelve so the score spans 8 columns at true poster width with a lean 4-column signal rail, which `two-equal` would have cramped. I moved `symmetry` off `mirrored` to `left-weighted` and `hero_zone` off `center` to `upper-left` because the win is a left-anchored, left-aligned statement with chrome and rail hanging to the right; a mirrored center would fight the fan-line's one-sided voice.

## Mobile
carrier: the giant 19–15 stacks over the phrase and holds the first fold; the right signal rail becomes a full-width ruled band below.
first_fold: the figure "19–15" and the phrase "Lions win ugly, and I'll take it."
order: hero figure + phrase, signal band, work index, reading list, site callout, footer ticker
hero_step_360: 3xl
nav_360: corner cluster collapses to the mark top-left and a "Menu" word top-right that reveals Work / About / Contact.

## Chassis
big-shoulders-atkinson

## Visual Specification
## 1. Color Specification

**Primary hue**: 149° (gridiron green). A football field is green; a four-point Detroit win on the grass earns a committed field-green that also lands inside the 140–180° mandate. Saturated enough to glow off near-black like a lit scoreboard.

**Neutral palette** (green-tinted dark, "field shadow"):
- 50 `#EDF4EF`
- 100 `#DCE8E0`
- 200 `#BACCC0`
- 300 `#9BB4A4`
- 400 `#789585`
- 500 `#51665A`
- 600 `#35463B`
- 700 `#202E25`
- 800 `#152019`
- 900 `#0B130E`

**Accent color** (gridiron green):
- light `#8EECB9`
- default `#2FCB7B`
- dark `#178A51`
- glow `#57DF95`

**Secondary accent**: none. A down market in red beside green would clash and fail for color-blind readers; the market figure renders in muted neutral with a down-arrow instead.

**Background**: page bg `#0B130E` (near-black, green-tinted void); card bg `#202E25`; sidebar/band bg `#152019`.

**Text colors**: primary text `#EDF4EF`; secondary text `#9BB4A4`; muted text `#789585`.

## 2. Typography

**Hero phrase rendering**: Two display elements. The figure `19–15` is the poster object: `display` token at the `hero` step (fluid clamp to ~160px at 1440), set in gridiron green `#2FCB7B` solid. Behind and above it, the word `DETROIT` set at `5xl` in `outline` (stroked letterforms, `border`-weight stroke, no fill) as a marquee ghost. The hero phrase itself, "Lions win ugly, and I'll take it.", is the caption directly under the figure at `4xl` in `#EDF4EF` — one step down from the marquee figure, still the page's one h1.

**Type treatment**: Spend the middle of the ramp. Figure at `hero`; `DETROIT` ghost at `5xl` outline; hero phrase at `4xl`; deck standfirst at `lg`; signal-rail figures (Novak −25, SPY) at `2xl`; signal labels at `sm`; body and colophon at `base`; micro metadata at `xs`. Big Shoulders Display carries the figure and display; Atkinson Hyperlegible carries deck, rail and body. Leading and tracking come from the chassis ramp.

## 3. Layout Specification

**Composition**: irregular-twelve / vertical / left-weighted / upper-left / sparse / syncopated / standard / field-dominant / hero-only / figure. A 12-column grid lets the figure span columns 1–8 at true poster scale while a 4-column signal rail (9–12) holds the rest of the day; the left mass and the quiet rail serve a fan line captioning one dominant number.

**CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 2vw;`. Hero figure block spans cols 1–8; signal rail spans cols 9–12.

**Major dimensions**:
- Hero/figure area: `min-height: 82vh`
- Signal rail: columns 9–12 (~30% width), ruled rows
- Max content width: `max-width: none; padding: 64px 5vw 96px;`
- Section padding: vertical bands at `clamp(48px, 8vh, 96px)`

**Nav placement**: top-left corner cluster. No spanning top bar.

**Hero phrase grid zone**: figure occupies rows 2–4, columns 1–8 (~160px cap height at 1440); the `DETROIT` outline ghost sits rows 1–2 cols 1–6 behind it; the hero phrase caption sits row 5, columns 1–7, at `4xl`.

**Home callout slot**: on `/`, place `<SiteCallout />` as a full-width band below the signal rail / work-index teaser and above the footer ticker. I place it; I do not design or write it.

## 4. Component Character

**Border radius**: cards/tags `2px` (sm), buttons `4px` (md); mostly `none`. Sharp, scoreboard-flat — no soft rounding (owner complaint).

**Border treatment**: bordered with hairlines — `border` token on signal-rail rows, `borderStrong` for section breaks and the ticker rule.

**Shadow**: none. Depth comes from the green glow of the figure against the void, not shadow.

**Density**: spacious in the hero, compact in the signal rail.

**Interactive states**: links shift `accent` → `accentAlt` (glow) on hover; rail rows lift ink from muted to text on hover.

## 5. Signal Integration

- **Lions 19-15**: the hero figure, poster scale, gridiron green on the void, `DETROIT` outlined behind. The page's subject.
- **Golf**: in the signal rail, `Novak, −25` at `2xl` with `Ventura / Fisk −20` beneath at `sm`, VidantaWorld Mexico Open, Final.
- **Market**: rail row, `SPY 755.72` with `↓ 1.77%` in `textMuted` plus a small down-arrow — no red, no second accent.
- **Moon**: rail row, last quarter, 42% illuminated.
- **Weather**: rail row, Overcast 51°F, Aldie, Virginia.
- **Music**: colophon line, "On rotation: My Morning Jacket, Guided by Voices, Wet Leg." Treated as standing taste, not a Sunday event.
- **Quote (Disney)**: small attributed footnote at the tail of the footer ticker, "Walt Disney," not the hero.
- **Reading list (sidebar links)**: a quiet ruled strip in the lower band before the callout.

## Self-Check
1. Hero quotability: Yes — a first-person fan line that stands alone and screenshots as an opinion, not a label.
2. Because-of chain: Yes — fan line about a gritty win → figure leads at scale → athletic signage chassis → gridiron green on void → scoreboard grid.
3. Render feasibility: Yes — `19–15` is five glyphs at 160px on Big Shoulders, fits cols 1–8 of 1440 with room.
4. Canvas floor feasible: Yes — field-dominant dark void plus 8-col figure and 4-col rail fills ~78% without padding.
5. Phone: Yes — figure at hero clamp over the phrase at 3xl fits the first 640px at 360 with no word cut.

## Rationale
The phrase is a fan line about a four-point win, "Lions win ugly, and I'll take it." It is the one signal that is unmistakably Doug: his team, his first person, his opinion, said the way the voice file says a score is a score. Because the win itself is a number, the composition leads with the number: hero_object is `figure`, the score `19–15` set at poster scale, the phrase as its caption. That is the mandate's own starting object, and it fits the day cleanly.

Because the object is a scoreboard number, the chassis is big-shoulders-atkinson: condensed athletic signage is literally the register of a scoreboard, and Big Shoulders renders the numerals heavy at 160px while Atkinson Hyperlegible keeps the rail and body clean. I reached for a condensed face despite the mandate's caution against defaulting to them, because a sports figure genuinely wants signage numerals, not because it needs scale. The palette follows from the field: gridiron green at 149°, inside the color mandate, reversed out of a near-black green-tinted void, so the score glows like a lit board at night. Dark-void is the ground strategy, off the recent drench/duotone/light-ground list, with a low grain for stadium-light atmosphere and no dots (standing complaint).

Layout carries the chain: an irregular-twelve grid gives the figure 8 columns of poster width with a 4-column signal rail holding golf, market, moon, weather and music, left-weighted and anchored upper-left to match the one-sided fan voice. The brand is a stacked-md mark in a top-left corner cluster with a hairline-ruled vertical nav index, off the recently-used lockups and placements and well clear of a top bar. The figure rises into place and the grain drifts slowly, the restrained motion the owner asked to push toward, while every section stays visible without scroll reveal. At 360 the figure stacks over the phrase as the whole first fold and the rail becomes a band beneath.
