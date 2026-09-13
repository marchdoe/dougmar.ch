---
id: nike
register: kinetic-color-block-motion
affinity: vertical, accelerating, dense, full-bleed
---

**Lane: Kinetic Sport Scroll**

> Source: sport-brand launch pages (Nike and similar). General genre characteristics of kinetic, color-block athletic marketing, not a specific copyrighted layout. Use as anchor reference, not copy target.

## Atmosphere
Kinetic, high-contrast, motion-implied even in static images. Bold saturated color blocks punctuate an otherwise photography-driven scroll. Energy over minimalism, but still one idea at a time.

## Color roles
- bg: #000000 primary, alternating with full-bleed saturated color-block sections (e.g. #FF4400 or #FFE600) between photo sections
- text (on black): #FFFFFF
- text (on color block): #000000 or #FFFFFF, whichever contrasts harder
- accent: the saturated color-block hue of the day, used as full section backgrounds, not small marks
- border: none

## Typography
- Display: whatever the chassis provides at 700–900, scale ratio 1.8, tight leading, often italic or slanted to imply motion
- Body: 400–500, 16px, line-height 1.4, frequently uppercase for captions/stats
- Mono: not used in this lane

## Component cues
- Buttons: solid fill, sharp or barely-rounded (4px), bold uppercase label, high contrast
- Cards: full-bleed photo/video blocks carrying a huge stat overlay (e.g. "26.2 MI")

## Anti-patterns specific to this style
- DO NOT stay monochrome. At least one full-bleed saturated color-block section is required
- DO NOT use a serif typeface
- DO NOT shrink stat callouts. Numbers should be huge and confident, never dainty
- DO NOT use pastel colors. Saturation stays high throughout

## Mobile strategy
The saturated color keeps its extent and never thins into a stripe. Stat numbers scale via `clamp()` but keep their visual dominance. They should never read as smaller than the surrounding body text's weight would suggest.
