---
id: notion-mintlify
register: soft-warm-minimalism
affinity: vertical, syncopated, measured, balanced
---

**Lane: Notion / Mintlify**

> Source: Notion / Mintlify via VoltAgent/awesome-design-md (MIT). Paraphrased from public brand characteristics. Use as anchor reference, not copy target. Borrow the rigor and reinterpret it through today's signals and brief.

## Atmosphere
Soft, banded sections, each with its own density and treatment (one is dense bullets, another is a single illustration, another is a quote). Warm minimalism: off-white surfaces, rounded corners, generous padding. Friendly, documentation-adjacent tone.

## Color roles
- bg: #FFFEFC, warm off-white
- bg.band: #F7F6F3, alternate band fill
- bg.card: #FFFFFF, elevated surfaces
- text: #191918, primary
- text.mid: #6F6E69, secondary
- accent: #E1661A (warm terracotta) or #2EAADC (soft cyan), one only
- border: rgba(55,53,47,0.09), soft hairline
- radius: 8–12px consistently

## Typography
- Display: "Inter" or "Söhne" 600, scale ratio 1.333
- Body: "Inter" 400, 16px, line-height 1.6
- Mono: "JetBrains Mono" / "Berkeley Mono" 400, 14px, for inline code

## Component cues
- Buttons: 8px radius, soft fill (filled or subtle tint), medium weight, 14px
- Cards: 12px radius, soft 1px border, 24–32px padding, rare soft shadow (elevation only when needed)

## Anti-patterns specific to this style
- DO NOT use harsh black (#000) or pure white (#FFF). Warm off-whites and ink browns
- DO NOT give every band the same treatment. One is bullets, one is a single illustration, one is a quote, and that variety is the voice
- DO NOT use sharp square corners. Rounded is the voice
- DO NOT use saturated gradients or neon accents

## Mobile strategy
Use `min-height` tokens that scale down. No `height: 100vh` without a mobile fallback like `min-height: 500px`. Bands keep a clear break between them at every width; the softness comes from the padding and the rounding, never from letting them run together.
