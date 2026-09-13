---
id: vercel-geist
register: dev-precision-specimen
affinity: full-bleed, sparse, type-dominant, center
---

**Lane: Vercel / Geist**

> Source: Vercel / Geist via VoltAgent/awesome-design-md (MIT). Paraphrased from public brand characteristics. Use as anchor reference, not copy target. Borrow the rigor and reinterpret it through today's signals and brief.

## Atmosphere
Type is the page. Black-and-white precision. A type foundry's specimen sheet. Oversized glyphs, metric annotations, tabular figures, hairline guides. Feels engineered. Every size, weight, and spacing value is deliberate and legible as a choice.

## Color roles
- bg: #FFFFFF (light) or #000000 (dark), one, not a gradient
- text: #000000 / #FFFFFF, pure
- text.mid: #666666 / #888888, metadata, measurements
- text.dim: #A1A1A1, annotations (size labels, grid marks)
- accent: #0070F3, used only on interactive affordances, never as fill
- border: #EAEAEA / #333333, 1px hairlines

## Typography
- Display: "Geist" or "Inter" 800, scale ratio 2.0, oversized hero glyphs (120–240px)
- Body: "Geist" or "Inter" 400, 15px, line-height 1.5
- Mono: "Geist Mono" or "JetBrains Mono" 500, 13px, used for labels, sizes, timestamps, slugs

## Component cues
- Buttons: 1px border, square-ish (4px radius), text-weight 500, subtle hover invert
- Cards: bordered, no shadow, tight 16–24px padding, meta row at top in mono
- Wordmark: small-caps text links register, mono subtitles

## Anti-patterns specific to this style
- DO NOT use color fills or gradients
- DO NOT use serif display type. Geometric sans is the voice
- DO NOT use drop shadows or heavy borders
- DO NOT center body copy

## Mobile strategy
The label block (metadata, callouts, signals) stays mono, small and dim wherever it lands. Hero type uses `font-size: clamp(3rem, 14vw, 11.25rem)` so the specimen-scale character survives shrinking without overflow. The specimen element itself should be ≥ 60% of viewport height on mobile. Don't let it collapse into something indistinguishable from normal body content.
