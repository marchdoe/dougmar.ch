## Brand Contract

The brand is a fixed mark with constrained variation. It must be recognizable
every single day. It participates in the design without being reinvented by it.

### The mark

- Source: `app/assets/logo.svg` (original colors), `app/assets/logo-mono.svg`
  (single-color variant; inherits `currentColor`).
- The mark's geometry is untouchable. Never redraw, distort, crop, rotate the
  glyph shapes, or substitute another mark.
- In the built site the mark is drawn once, inside
  `app/components/BrandLockup.tsx`, which the orchestrator generates from a
  frozen template every run. Nothing else may import the SVG or carry the path
  data. The mockup is the exception: it is a standalone HTML file with no build
  step, so it inlines the SVG source it is handed.

### Lockup variants (choose exactly one per day)

| id | composition | wordmark step | mark_px band |
|---|---|---|---|
| `mark-only-md` | mark alone | `lg` | 40–56px |
| `horizontal-md` | mark + wordmark on one line | `lg` | 32–48px |
| `stacked-md` | mark above wordmark, centered | `lg` | 40–56px |
| `stacked-lg` | mark above wordmark, centered | `2xl` | 64–96px |

The wordmark step is the ramp step the name is set at, and the mark's height is
derived from it rather than fixed: the mark stands 2.4 cap-heights tall, taking
cap-height as 0.7em, so it grows and shrinks with the day's type instead of
against it. The step is bounded either side so that figure lands inside the
band above, which is why the declared `mark_px` and the rendered mark cannot
disagree by much. The bound is on the step rather than on the mark, so the
wordmark shrinks with the mark instead of being left oversized beside one that
was cut down to fit.

Orientation (horizontal vs stacked) may follow the day's header placement — a
`left-rail` header usually wants a stacked lockup, a `top-bar` a horizontal one.

### Position

The mark sits inside the first fold at 360 and at 1440, whatever the
placement. `footer-only` and `none` move the nav, never the mark; the `nav`
line says where in the hero it lives. A `single-color` mark needs 3:1
against its ground. Both are measured on the built page.

### The wordmark

The wordmark is typographic, not an image. `BrandLockup` sets it from
`identity.name` and enforces the following; the reason to know them is so the
mockup matches what the built page will do.

- Face: the day's `display` face. Never the body face, never a substitute.
- Weight: whatever `wordmark_weight` you declare, resolved to the nearest
  weight the chassis actually loads, capped at 700. A chassis that loads only
  400 sets the wordmark at 400 — a heavier request would render as a
  synthesized bold and distort the letterforms.
- Tracking: −0.015em. The name is short and set at display scale, where
  default tracking reads loose.
- Leading: 1. The wordmark is one line and its line box is the alignment
  reference for everything beside it.
- Horizontal lockups align the mark to the wordmark's cap-height, not to its
  line box or its baseline. Stacked lockups center both.

### The role line

`identity.role` under the name, on or off per day via `role_line` in the
`===HEADER===` block. It is set in the body face, uppercase, at 0.09em
tracking, and floors at 13px so it stays legible when the lockup runs small.
Absent is a real choice: mark-only and `corner` headers rarely want one, and a
role line under a `stacked-lg` lockup competes with the hero.

### Color — exactly two modes

1. `original` — the mark's own colors, as authored in `logo.svg`.
2. `single-color` — the mono variant, inheriting exactly ONE existing text or
   accent token from today's preset via `currentColor`.

No other treatment is permitted: no gradients over the mark, no per-shape
recolors, no opacity tricks, no outlines.

Pick the mode that sits better on today's palette — but know that across 17
builds carrying a shell declaration, `single-color` was chosen 16 times, so the
green-and-blue mark has effectively never reached the page. `original` is the
better choice whenever the palette gives it somewhere to sit: a light or paper
ground, a neutral field, any page that is not already drenched in a hue that
fights green and blue. On a `drench` or hard `duotone` day, `single-color` is
the honest answer. On a `light-ground` day, reach for `original` first.

### Declaration and enforcement

- The Art Director declares `brand_lockup` and `brand_color_mode` in the
  `===SHELL===` block, and `mark_px`, `wordmark_step`, `wordmark_weight` and
  `role_line` in the `===HEADER===` block.
- The Mockup Designer must execute the declared lockup exactly.
- The React Engineer renders `<BrandLockup />` and never draws the mark.
- `scripts/utils/build-validator.js` fails the build on a direct logo import,
  on inline mark path data, and on a declared lockup that nothing renders.
- Both critics receive a 2x crop of the header region and measure the rendered
  mark against the declared `mark_px`.
