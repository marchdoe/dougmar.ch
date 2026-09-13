---
id: pinterest
register: light-masonry-mosaic
affinity: masonry, dense, syncopated, field-dominant
---

**Lane: Pinterest**

> Source: Pinterest via VoltAgent/awesome-design-md (MIT). Paraphrased from public brand characteristics. Use as anchor reference, not copy target. Borrow the rigor and reinterpret it through today's signals and brief.

## Atmosphere
Image-first, varied tile sizes, tight horizontal gaps and slightly wider vertical ones. Reads like a curated pinboard, visual first, label second. The red accent only appears on actionable marks (bookmark, follow). Confident whitespace between clusters.

## Color roles
- bg: #FFFFFF, clean canvas
- bg.tile: transparent, tiles ARE the images
- text: #111111, titles below tiles
- text.mid: #767676, metadata, captions
- accent: #E60023, Pinterest red, used only on interactive icons or active states
- border: transparent (no borders on tiles), separation comes from gaps
- tile-radius: 16px

## Typography
- Display: "Inter" or "Sohne" 700, scale ratio 1.3 (tiles, not posters, type supports imagery)
- Body: "Inter" 400, 14px, line-height 1.4
- Mono: rarely; captions only

## Component cues
- Buttons: pill, fully rounded, filled red for primary, filled black for secondary, 14px
- Cards: the tile IS the card, 16px radius, no border, no shadow, slight hover lift

## Anti-patterns specific to this style
- DO NOT crop every image to the same aspect ratio. Tiles keep the proportions their content came with
- DO NOT use drop shadows or thick borders on tiles
- DO NOT use the red accent as a large fill. It marks interactions only
- DO NOT use serif type

## Mobile strategy
Each artifact keeps its scale *relative* to viewport width (e.g. 80vw for featured pieces, 60vw for thumbnails) rather than absolute pixels, so a featured piece still reads as featured. The curator's hand has to show at the narrowest width too.
