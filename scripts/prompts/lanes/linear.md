---
id: linear
register: dark-keyboard-first-density
affinity: interleaved, dense, even, single
---

**Lane: Linear**

> Source: Linear via VoltAgent/awesome-design-md (MIT). Paraphrased from public brand characteristics. Use as anchor reference, not copy target. Borrow the rigor and reinterpret it through today's signals and brief.

## Atmosphere
Ultra-minimal list/table density. Reads like a well-kept index, tabular numerals, aligned columns, one-line rows, small metadata. Feels like a keyboard-first app. Muted palette; the purple accent is rare and precise.

## Color roles
- bg: #08090A, near-black, slightly blue
- bg.row: transparent with rgba(255,255,255,0.02) on hover
- text: #E6E6E6, primary
- text.mid: #8A8F98, secondary metadata
- text.dim: #62666D, tertiary, timestamps
- accent: #5E6AD2, Linear purple, used on active row indicators and links only
- border: rgba(255,255,255,0.06), hairline row dividers

## Typography
- Display: "Inter" 600, scale ratio 1.25 (small contrast, this is a list, not a poster)
- Body: "Inter" 400, 14px, line-height 1.45, tabular-nums feature enabled
- Mono: "IBM Plex Mono" 400, 12px, IDs, timestamps

## Component cues
- Buttons: small, 6px radius, 13px, icon + label, subtle hover fill
- Cards: no cards, rows in a list, separated by 1px hairlines

## Anti-patterns specific to this style
- DO NOT use drop shadows or rounded cards
- DO NOT vary row heights. Uniform rhythm is the voice
- DO NOT use serif type
- DO NOT apply the purple accent as a background fill. It marks, never coats

## Mobile strategy
The index character survives the narrow width: uniform row rhythm, visible row numbers or bullets, metadata still set small and dim beside what it describes. Year, role and description stay legible as labelled values rather than dissolving into a paragraph.
