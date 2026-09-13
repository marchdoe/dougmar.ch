---
id: swiss-poster
register: grid-rigor
affinity: diagonal, broken, irregular-twelve, measured
---

**Lane: Swiss International Style**

> Source: International Typographic Style (Müller-Brockmann, Ruder, Hofmann lineage). General historical movement characteristics, not a specific living brand or copyrighted work. Use as anchor reference, not copy target.

## Atmosphere
Objectivity held to the millimetre. One gesture is permitted, an oversized numeral, a rule run at an angle, and everything else is set with the precision that lets it read as a gesture. Sans-serif, flush-left ragged-right text, hard-cropped photography. Function over decoration. A mood of quiet confidence rather than spectacle.

## Color roles
- bg: #FFFFFF, pure, no warmth
- text: #000000, pure, no softening
- accent: #E30613 (signal red), the only color besides black and white
- accent.secondary: #005EB8 (data blue), reserve for chart/data marks only, never decorative
- border: #000000, thin, precise hairline rules only, never rgba-softened

## Typography
- Display: a grotesk at 700, scale ratio ~1.618, set to a visible baseline grid
- Body: same grotesk family at 400, 16px, line-height 1.4, ragged right, never justified, never centered
- Mono: not used in this lane

## Component cues
- Buttons: none, links are bold black text with a red underline rule, no border, no fill
- Cards: none, thin black rules do the separating, and nothing is boxed

## Anti-patterns specific to this style
- DO NOT center type. Flush left, ragged right, everywhere
- DO NOT use a third color beyond black, white, and signal red
- DO NOT use gradients, drop shadows, or rounded corners anywhere
- DO NOT use a serif typeface
- DO NOT soften the geometry with organic or freeform shapes. Every edge is straight and every angle is deliberate

## Mobile strategy
The one permitted gesture scales via `clamp()` and stays off-axis. It must never straighten out to fit. Rules stay hairline-thin and pure black at every width; nothing softens to make room.
