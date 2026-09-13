---
id: tesla-spacex
register: radical-subtraction
affinity: full-bleed, sparse, single, edge-bound
---

**Lane: Tesla / SpaceX**

> Source: Tesla / SpaceX via VoltAgent/awesome-design-md (MIT). Paraphrased from public brand characteristics. Use as anchor reference, not copy target. Borrow the rigor and reinterpret it through today's signals and brief.

## Atmosphere
Radical subtraction. Nearly everything is removed until the single dominant element becomes inevitable. Mood is cinematic product photography: big, confident, monochrome, with rare chromatic punctuation.

## Color roles
- bg: #000000 or #FFFFFF, absolute, not "near-black"
- text: #FFFFFF on black / #171A20 on white, maximum contrast
- text.mid: #9DA3AE, secondary captions only
- accent: #E31937 (Tesla red) or #005288 (SpaceX blue), used once per viewport, never as a fill
- border: rgba(255,255,255,0.08), almost invisible; separation comes from whitespace, not lines

## Typography
- Display: "Gotham", "Inter" 700, scale ratio ~2.4 (huge jumps between levels)
- Body: "Inter" 400, 16px, line-height 1.55
- Mono: rarely used, if present, for serial numbers or timestamps only

## Component cues
- Buttons: uppercase, letter-spacing 0.12em, border only (no fill), ~14px, generous horizontal padding
- Cards: almost never used, prefer full-bleed media with text overlay

## Anti-patterns specific to this style
- DO NOT use more than one accent instance per viewport
- DO NOT use card grids, drop shadows, or rounded-corner containers
- DO NOT fill the page with body copy. Captions only, set small
- DO NOT use more than two type sizes on the hero viewport

## Mobile strategy
The dominant element stays dominant: scale it via `clamp()` rather than shrinking it uniformly. Secondary information stays secondary, small, quiet, and never competing with it. If the hero needs to reflow (e.g. "DOUG / MARCH" instead of "DOUG MARCH"), the reflow should look intentional, not cramped.
