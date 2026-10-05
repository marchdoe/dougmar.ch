# Signals Brief — 2026-10-05

## Hero Copy
The dream is free, but the hustle is sold separately.

## Hero Rationale
Straight from `signals.quote` (Steve Harvey), and it earns the day by sitting as the caption on ten years of Spaceman: the idea was the free part, the building was sold separately. It reads as a work-ethic line, not a motivational poster, once it hangs over a real client ledger (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) as evidence of the hustle. Steve Harvey is attributed in the standfirst beneath the line. Owner's voice: Doug builds products on the side and has said the mockup is the easy part and shipping it is the work, so "the dream is free, the hustle is sold separately" is exactly how he'd frame ten years of Spaceman.

## Archetype
a founder's specimen ledger, the quote stamped over the evidence

## Composition
columns: irregular-twelve
axis: vertical
symmetry: broken
hero_zone: upper-left
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: balanced
collapse: reorder
hero_object: artifact

## Composition Rationale
Artifact leading is right because the quote needs proof under it: Spaceman's ten-year client roster is the hustle made concrete, so the work leads and the line is its caption. I moved symmetry off the mandate's `mirrored` to `broken` because a reflected arrangement would read as decorative here, whereas a broken rail lets the teal evidence panel offset and physically interrupt the sand field, which is the whole argument. Interrupted rhythm gives the one oversized caesura gap before that panel so the claim and its evidence read as a deliberate turn, not a continuous column.

## Mobile
carrier: At 360 the quote leads full-width in small-caps italic, the Spaceman title and its client ledger stack beneath as ruled rows, and the broken off-axis of 1440 becomes a single left rail every zone hangs from.
first_fold: The hero quote "The dream is free, but the hustle is sold separately." at `3xl` italic, with the original mark stacked top-left directly above it.
order: mark, quote, Spaceman title + metadata, client ledger (teal band), site callout, signal ledger
hero_step_360: 3xl
nav_360: No header bar; the stacked mark sits top-left above the quote; the three links stay in the running sentence low in the field, teal on sand.

## Chassis
zilla-worksans

## Visual Specification
### 1. Color Specification
- **Primary hue**: 176° deep teal. It is the evidence color, the flooded plane the client ledger reverses out of, cool enough to read as proof against the warm sand the quote lives on.
- **Neutral palette (warm sand, tinted toward 70°)**: 50 `#faf5ea`, 100 `#f3ecd9`, 200 `#ece2cc`, 300 `#e0d2b4`, 400 `#cdbb94`, 500 `#a8906a`, 600 `#7c6a4b`, 700 `#574a34`, 800 `#3a3123`, 900 `#241e14`
- **Accent color (hustle coral)**: light `#ea8257`, default `#e05d2d`, dark `#c24a1f`, glow `#f2b092`
- **Secondary accent**: none beyond coral; teal is a ground, not a second accent.
- **Background**: page bg `#ece2cc` (sand 200), card/surface `#f3ecd9` (sand 100), teal field panel `#0a3d39` (teal 800), bgAlt band `#e0d2b4` (sand 300)
- **Text colors**: primary `#0a3d39` (teal ink on sand), secondary `#0f615a`, muted/faint `#7c6a4b`; on the teal field, ink `#faf5ea`, muted `#93cdc6`

### 2. Typography
- **Hero phrase rendering**: the quote is the single h1, set at `4xl` (desktop) in the Zilla Slab display, small-caps, italic, left — a printed ledger epigraph, not a shout. The artifact title "Spaceman" is the marquee object at `hero_scale` (`5xl` register), small-caps heavy roman, functioning as type-as-texture anchoring the upper-left.
- **Type treatment**: `hero_scale`/`5xl` for the Spaceman title; `4xl` for the quote h1; `md` standfirst for the Steve Harvey attribution and the role/year line; `base` for ledger body (hold 60-68ch, leading 1.5); `sm`/`xs` small-caps for the ruled client labels and signal rows. At least one mid-register element (the `md` standfirst) sits between marquee and body so no page jumps title-to-body.

### 3. Layout Specification
- **Composition**: irregular-twelve / vertical / broken / upper-left / measured / interrupted / none / balanced / reorder / artifact. A twelve-unit grid where the Spaceman title and quote anchor the upper-left and the teal client ledger breaks the grid on the right, so the "evidence" panel physically answers the "hustle" claim.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: clamp(16px, 2vw, 32px)`. Hero quote cols 1-7; Spaceman title cols 1-8; teal ledger panel cols 5-12 (offset, breaking the rail); metadata cols 1-4.
- **Major dimensions**:
  - Hero/artifact area: `min-height: 88vh`
  - Teal ledger panel: spans cols 5-12, `min-height: 60vh`, offset down ~120px from the title (the interrupted-rhythm caesura)
  - Max content width: `max-width: none`; `padding: clamp(64px, 7vw, 112px) 6vw`
  - Section spacing: vertical rhythm on the chassis base unit; one oversized gap (~160px) before the ledger panel as the caesura
- **Nav placement**: no header bar (shell none). The original mark sits top-left of the sand field; Work / About / Contact resolve inside one quiet running sentence low in the artifact field (teal links on sand).
- **Hero phrase grid zone**: rows 1-2, cols 1-7, quote at `4xl` (~64px at 1440); the Spaceman title occupies rows 3-5, cols 1-8 at `hero_scale`.
- **Home callout slot**: `<SiteCallout />` sits below the Spaceman artifact-and-ledger section and above the footer signal ledger, full width, between the ledger panel and the footer. Not inside the hero.

### 4. Component Character
- **Border radius**: cards/panels `0` (none), buttons/links `2px` (sm), tags `0`. Sharp ledger geometry.
- **Border treatment**: bordered with hairlines; `border` (sand 400) for ledger row rules, `borderStrong` (sand 600) for section breaks, `fieldBorder` (teal 600) inside the teal panel.
- **Shadow**: none. Depth comes from the teal/sand value split, not shadow.
- **Density**: measured — ruled rows breathe, generous caesura before the ledger.
- **Interactive states**: links underline-from-transparent to coral on `_hover`; ledger rows shift ground to surface on hover.

### 5. Signal Integration
- **Where signals live**: a footer "ruled signal ledger" strip on the sand ground, one strong teal rule above it, rows below. No nav in it (shell none).
- **Sports scores**: ruled rows in `sm` small-caps with tabular figures. "Bank of Utah Championship · Final · Smotherman −26" as the lead golf row (Doug's game). "Lions 26, 32 · loss" and "Red Wings 2–3 · loss" as his-team rows, loss noted plainly.
- **Market**: "SPY 769.64 · +0.74%" one row, coral up-tick mark.
- **Quote display**: the quote IS the hero phrase, the artifact's caption; Steve Harvey attributed in the `md` standfirst directly beneath.
- **Weather**: "Aldie · mist · 54°F" quiet row. **Lunar**: "waning crescent · 27%" micro label.
- **Music**: The War on Drugs / Guided by Voices / Radiohead as a standing-rotation caption at the strip's foot, framed as taste, not a dated event.
- **Holiday**: none today; "Columbus Day · Oct 12" as a faint upcoming note.

## Self-Check
1. Hero quotability: Yes — "The dream is free, but the hustle is sold separately" is a complete, screenshottable line.
2. Because-of chain: Yes — the hustle line demanded evidence, so artifact leads with Spaceman's client ledger (composition), rendered in a sturdy slab specimen (chassis), on a committed teal/sand duotone (palette).
3. Render feasibility: Yes — Zilla carries the title at ~118px (under its 120px cap) and the quote at `4xl`/64px at 1440 without overflow.
4. Canvas floor feasible: Yes — the teal ledger panel plus sand field and ruled rows fill ~75% of a measured, balanced canvas.
5. Phone: Yes — the quote at `3xl` wraps to 3-4 lines inside 640px at 360 with the mark above it, no word cut.

## Rationale
The phrase is a quote about effort: the idea is free, the building is the cost. A line like that is weightless on its own, so it demanded evidence under it, which is why the composition leads with an artifact — Spaceman, Founder, 2018, and the real client roster (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) as the proof of ten years of hustle. The quote becomes the caption stamped over that ledger, exactly the register a founder's specimen sheet wants.

Because the page is a ledger of evidence, the chassis is Zilla Slab, a sturdy structural slab built for specimens and index work, set small-caps and italic-led so the quote reads as a printed epigraph rather than a shout. The palette answers the same logic: a warm sand ledger ground where the quote lives, and deep teal evidence panels the client list reverses out of, so the two grounds carry the whole page as a committed duotone with no neutral void. One coral mark is the hustle, used sparingly as the 10% pulse against the teal and sand.

Layout follows from the artifact and the broken symmetry: the title and quote anchor the upper-left, and the teal ledger panel offsets down and right, breaking the rail so the evidence physically interrupts the claim after one oversized caesura gap. The mark stays in the first fold top-left as original green-and-blue, which the warm sand ground gives it somewhere honest to sit, and the nav dissolves into a single running sentence low in the field because the shell is none. At 360 the quote reorders to lead, then the title, then the ledger, so the argument survives one column.
