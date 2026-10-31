# Signals Brief — 2026-10-31

## Hero Copy
Design and engineering as one job, not two teams passing files.

## Hero Rationale
This is Doug's thesis, lifted straight from his voice notes ("Design and engineering as one job, not two teams passing files"), and it is the one claim his whole résumé exists to prove: Spaceman, the client roster, FishSticks, 15th Club, all of it is one person closing the gap between designed and built. It beats the Les Brown quote because the quote is generic motivation that fails the "would Doug say this" test, while this is the exact sentence he uses about his work. The hero word is "one" at marquee scale, because the number is the argument: one job, not two teams.
Owner's voice: Doug says this about his own practice, flatly, with a real number of teams in it and no hype.

## Archetype
The work on the left, one word on the right, balanced across the fold.

## Composition
columns: three
axis: diagonal
symmetry: symmetric
hero_zone: edge-bound
density: dense
rhythm: even
shell_posture: folded-into-hero
field_ratio: balanced
collapse: reorder
hero_object: word

## Composition Rationale
The phrase is a claim about two disciplines resolving into one, so the canvas is split into balanced halves: a dense three-column work index on the left (the engineering) answered by the single word "one" on the right (the design), symmetric weight making the argument visual. I moved hero_zone off the suggested upper-left to `edge-bound` because the word wants to be flung hard against the right margin where the diagonal reading path lands; the mandate's avoid lists left most other axes with only their start value available (horizontal/vertical/radial, crowded/sparse/measured, type/field/drenched all soft-forbidden), so I kept those deliberately rather than passively and spent the real movement on placement.

## Mobile
carrier: The giant lowercase "one" and its deck still lead the screen at 360, amber on teal, with the three-column index folded to one.
first_fold: The hero word "one" and the deck "Design and engineering as one job, not two teams passing files."
order: hero (one + deck), featured project Spaceman, work index, signals strip, site callout, footer
hero_step_360: 5xl
nav_360: Lockup top-left with the role line; the numbered links wrap to one lowercase row below it, each link padded to a 44px tap target.

## Chassis
bricolage-manrope

## Visual Specification
## 1. Color Specification

- **Primary hue**: 174° (pine teal). It sits inside the 140–180° mandate and reads as a considered, structural green-teal, the right ground for an engineering thesis. The word floats on it in amber.
- **Neutral palette** (tinted toward teal): 50 `#F2F6F5`, 100 `#E3EAE8`, 200 `#C7D4D1`, 300 `#A4B4B0`, 400 `#7B8D89`, 500 `#5B6D69`, 600 `#45534F`, 700 `#333E3B`, 800 `#222A28`, 900 `#141918`.
- **Teal scale**: 50 `#E9F5F2`, 100 `#C9E7E1`, 200 `#9DD3CB`, 300 `#6ABCB1`, 400 `#3E9E93`, 500 `#2A8077`, 600 `#20655E`, 700 `#184F4A`, 800 `#123B38`, 900 `#0C2927`.
- **Accent color (amber)**: light `#F6CD85`, default `#E8A23C`, dark `#B06C1C`, glow `#FDF3E0`.
- **Secondary accent**: none. One accent, amber, carries every mark.
- **Background**: page bg `#0C2927` (deep teal hero + footer), card/surface `#184F4A`, amber index plane (field) `#E8A23C`. Light scheme: page bg `#E9F5F2`, surface `#F2F6F5`.
- **Text colors**: primary text `#E9F5F2` (dark scheme) / `#0C2927` (light), secondary `#9DD3CB` / `#20655E`, faint `#6ABCB1` / `#5B6D69`. Ink on the amber plane: `#0C2927` body, `#45290A` muted.

## 2. Typography

- **Hero phrase rendering**: `display` (Bricolage Grotesque), ramp step `hero` (fluid clamp), set as the single lowercase word **one** flung to the right edge in heavy weight, amber on the teal field. The full phrase is the deck directly beneath it, right-aligned, at step `3xl`, in pale mint. The word is the object; the sentence is the h1 carried at the step down.
- **Type treatment**: hero word `hero` step; deck `3xl`; section heads (WORK, SIGNALS) `lg`; project titles `xl`; project meta and nav `sm`; body/standfirsts `base` held to 62–68ch; captions and footer facts `xs`, never below 13px. Body (Manrope) answers Bricolage's humanist skeleton, so the display and body share construction rather than fight.

## 3. Layout Specification

- **Composition**: columns `three`, axis `diagonal`, symmetry `symmetric`, hero_zone `edge-bound`, density `dense`, rhythm `even`, shell_posture `folded-into-hero`, field_ratio `balanced`, collapse `reorder`, hero_object `word`. The left half carries the dense work (the engineering), the right edge carries the single word (the design claim), balanced across center so the page itself argues "two as one."
- **CSS structure**: hero band `display: grid; grid-template-columns: 1fr 1.1fr` (left: lockup + nav + full deck; right: the word hard against the edge). Index band `display: grid; grid-template-columns: repeat(3, 1fr); gap: 0` with hairline rules between cells.
- **Major dimensions**:
  - Hero band `min-height: 68vh`.
  - Max content width `none`; side padding `clamp(24px, 6vw, 112px)`.
  - Section padding `96px clamp(24px, 6vw, 112px)`.
  - Amber index plane full-bleed width, ~ one and a half folds tall.
- **Nav placement**: folded into the hero band, top-left, under the horizontal lockup. No top bar.
- **Hero phrase grid zone**: the word occupies the right column, rows 1–2, flush to the right padding edge, at `clamp(72px, 11vw, 158px)`; the deck sits in the left column, lower third of the hero band.
- **Home callout slot**: `<SiteCallout />` sits below the three-column work index and the signals section, above the footer data strip, full width, in `bgAlt`. No copy or styling from me.

## 4. Component Character
- **Border radius**: cards/tags `2px` (sm), buttons `4px` (md). Near-square, no soft corners.
- **Border treatment**: bordered with hairlines, `border` between index cells, `borderStrong` for the band break above the footer. Amber plane uses `fieldBorder`.
- **Shadow**: none. Depth comes from the teal/amber value step, not shadow.
- **Density**: spacious hero, dense index.
- **Interactive states**: link hover underlines in `accent`; work rows shift background one teal step on hover; tap targets ≥44px.

## 5. Signal Integration
- **Where signals live**: a single-row footer data strip on the teal ground, facts separated by amber hairlines (ground material `rule`).
- **Sports scores**: Pistons 110–94 win set as the loudest footer fact, `sm` tabular figures in amber with a teal label. Golf: Mexico Open, Novak −14, as a ranked line in the strip.
- **Quote**: the Les Brown line is not the hero; it sits small and attributed at the tail of the footer strip, one line.
- **Holiday**: Halloween named as a dated fact in the strip, no costume treatment.
- **Music**: My Morning Jacket and Tobin Sprout labeled "rotation" in the strip, marked as taste, not an event beside the score.
- **Other**: SPY −1.77%, last-quarter moon 64%, Aldie 45°F cloudy, date, all as ruled facts in the strip.

## Self-Check
1. Hero quotability: Yes — "Design and engineering as one job, not two teams passing files" is Doug's thesis and stands alone.
2. Because-of chain: Yes — word hero "one" drove edge-bound placement, a balanced two-plane duotone, a humanist display/body pair, and the right-aligned marquee.
3. Render feasibility: Yes — a three-letter word at 158px on bricolage (max 160) fits the right column at 1440 without overflow.
4. Canvas floor feasible: Yes — dense three-column index plus two full-bleed colored planes clears 80%.
5. Phone: Yes — "one" at 5xl and its deck fit the first fold at 360 with no cut word.

## Rationale
The phrase is Doug's one-sentence thesis, so the page is built to make its central word visible before the sentence is read: "one" set at 158px, lowercase, heavy, flung hard against the right edge, with the full sentence as the deck beneath it. The number is the argument. Because the claim is about two things becoming one, the composition is a symmetric split: the dense three-column work index on the left stands for the engineering, the single word on the right stands for the design, and they balance across the center line so the page performs its own thesis.

Bricolage Grotesque carries the word because it is warm, brand-driven and expressive at 160px without tipping into the condensed-caps register I have leaned on too often, and because Manrope answers its humanist construction, so display and body share a skeleton rather than reading as a poster headline pasted onto a default page. The treatment is deliberately off the recent rut: lowercase, right-aligned, heavy, roman, no texture, where the last week ran small-caps and justified and centred.

The palette is a committed duotone, deep pine teal (174°, inside the mandate) and one ember amber, two hues carrying the whole surface with no neutral void, honoring the "avoid dark-void and drench" steer while staying saturated and alive. The teal grounds the hero and footer; a full-bleed amber plane holds the work index; the word is amber on teal. Ruled hairlines give the index the structure an engineering claim earns. The header folds into the hero as a real design surface, horizontal lockup top-left with a role line that itself says "designer and developer," small and recognizable, in the first fold at both widths.
