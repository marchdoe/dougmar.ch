# Signals Brief — 2026-10-14

## Hero Copy
Thousands of kids practicing spelling from the list the teacher sent home.

## Hero Rationale
This is a FishSticks line, lifted from Doug's own voice file: a real product doing a real thing for a real number of kids. It carries the day because the scale word "thousands" sits against one tender specific (the list the teacher sent home), which is the productive irony the gold standards reward. I passed over today's Tolstoy quote ("you love the person as they are, and not as you'd like them to be") because it is a love aphorism outside Doug's register of design, engineering, golf, Detroit and music; the taste memory is explicit that an out-of-voice quote ships as "a poster of somebody else," and I cannot honestly write the Owner's-voice line for it. Owner's voice: FishSticks reads the word list the teacher sent home, and thousands of kids practice from it. That is what it does, stated plain.

## Archetype
A warm word-poster lit like a kitchen table at dusk.

## Composition
columns: single
axis: horizontal
symmetry: left-weighted
hero_zone: upper-left
density: sparse
rhythm: accelerating
shell_posture: marginal
field_ratio: type-dominant
collapse: stack
hero_object: word

## Composition Rationale
I kept eight axes on the date-derived starting tuple because a single-column, left-weighted, type-dominant word-poster off one rail is exactly what this phrase wants. The one deliberate move is my Max-Risk axis break: I land `hero_object` on `word`, a value the Composition Mandate soft-forbade (it suggested `figure`). The FishSticks line has no numeric figure to render, and its whole force is the scale word "thousands" set against one tender specific, so `word` is the only object that renders the irony — a huge word for a quiet classroom fact — the way the gold standards reward.

## Mobile
carrier: The single warm word carries it — "thousands" glows at the top in fat italic Fraunces and the rest of the hero phrase reads straight under it, while the left rail folds to a top mark plus one small-caps nav row.
first_fold: The hero phrase "Thousands of kids practicing spelling from the list the teacher sent home" leads the fold — "thousands" at 4xl in vermilion with the remaining words ("of kids practicing spelling from the list the teacher sent home") as the deck beneath it, and the cream mark top-left.
order: hero word + deck, selected work, signals, site callout, colophon
hero_step_360: 4xl
nav_360: The left rail folds to the top: cream mark top-left, Work About Contact as one small-caps row beneath the hero deck.

## Chassis
fraunces-karla

## Visual Specification
### 1. Color Specification
- **Primary hue**: 10° (warm vermilion-red). Chosen as the warm family that reads cleanly distinct from the recent amber/gold heroes while honoring the warmth the human line asks for; it glows like a kitchen lamp against warm-black.
- **Neutral palette (warm clay)**: 50 `#FBF4EF`, 100 `#F4E7DD`, 200 `#E6D2C4`, 300 `#D0B6A6`, 400 `#AD9183`, 500 `#866B5F`, 600 `#5E483F`, 700 `#3E2C27`, 800 `#241715`, 900 `#160C0A`
- **Accent color**: light `#FF9478`, default `#F0391E`, dark `#C62A10`, glow `#FF6E4D`
- **Secondary accent**: none
- **Background**: page `#160C0A`, card/surface `#241715`, warm band `#420E05`
- **Text colors**: primary `#FBF4EF`, secondary `#D0B6A6`, muted `#AD9183`

### 2. Typography
- **Hero phrase rendering**: `display` (Fraunces) at the `hero` step for the single word "thousands," set lowercase italic at the heavy end of the variable axis, in `accent` vermilion; the remaining words of the phrase ("of kids practicing spelling from the list the teacher sent home") drop to the body face (Karla) at `xl` roman in `text`, sitting as the deck directly beneath the word. The full sentence is the one h1.
- **Type treatment**: `hero` carries the marquee word; `xl` carries the deck and keeps the full specific line at a readable measure; `3xl` sets the "Selected work" head in Fraunces lower; `md`/`lede` set the project rows (title, year, role) in Karla; `sm` and `xs` carry signals, the quiet Tolstoy aside, and the small-caps rail labels. Mid-register is deliberately spent (deck at xl, section head at 3xl, row titles at md) so the page is never a giant word over default text.

### 3. Layout Specification
- **Composition**: single / horizontal / left-weighted / upper-left / sparse / accelerating / marginal / type-dominant / stack / word. One column hangs off a single left rail; "thousands" sits in the upper-left quadrant and the specific line reads out to the right of it, so the eye travels left to right across the warm void exactly as the sentence does.
- **CSS structure**: `display: grid; grid-template-columns: 96px 1fr;` (left rail + content). Content zone is `display: flex; flex-direction: column;` with accelerating gaps (hero block gap 48px, work rows gap 20px, signals gap 12px).
- **Major dimensions**:
  - Hero block min-height: `72vh`
  - Left rail width: `96px` fixed (mark top, vertical index below)
  - Max content width: `none`; side padding `96px 6vw` at 1440
  - Section padding: hero `96px` top; work index `64px` block; colophon `40px`
- **Nav placement**: left rail, vertical. Mark at the top of the rail; Work / About / Contact stacked as a vertical index below, one warm hairline per row, small-caps.
- **Hero phrase grid zone**: rows 1–2, content column; "thousands" occupies the upper-left ~60% width at `clamp(60px, 11vw, 158px)`, deck on the two lines directly beneath at `xl`.
- **Home callout slot**: on `/`, below the Selected Work index and above the colophon footer — between the work index and the footer. Placed, not styled; no copy written here.

### 4. Component Character
- **Border radius**: cards 2px, buttons/tags 2px, no large rounded corners (owner complaint)
- **Border treatment**: hairline `border`; section breaks use `borderStrong`
- **Shadow**: none; depth from surface value, not shadow (dark-void)
- **Density**: sparse up top, tightening down the page
- **Interactive states**: nav and row links shift from `textMuted` to `accent` on `_hover`, 120ms; a vermilion underline rule grows under the hovered work row

### 5. Signal Integration
- **Signal elements**: a quiet signals strip above the colophon, right-aligned to the content rail
- **Sports scores**: Red Wings loss stated plain, not celebrated: "Red Wings 4–5, one goal short," set in Karla `sm`, `textMuted`, tabular figures; it is a signal, not the hero
- **Quote (Tolstoy)**: demoted to a small attributed aside in the signals strip, Karla `sm` italic with "— Leo Tolstoy" in `textFaint`; present, not load-bearing
- **Market**: SPY 778.01, down 0.01%, one faint `xs` line, `textFaint`
- **Weather / sun / moon**: Aldie, clear, 63.8°F, 11 hours of daylight, waxing crescent — folded into the colophon line, `textFaint`
- **Golf**: "Butterfield Bermuda Championship, tees off" one faint line
- **Music**: "On rotation: The War on Drugs, Tobin Sprout, Wet Leg" in the colophon, framed as taste, never as an event beside a score

## Self-Check
1. Hero quotability: Yes — "Thousands of kids practicing spelling from the list the teacher sent home" is a complete, screenshottable claim with scale and a specific.
2. Because-of chain: Yes — the scale word drove word-object → marquee "thousands" → warm Fraunces → vermilion-on-void lamp palette → single column off one rail.
3. Render feasibility: Yes — "thousands" (9 letters) at 158px in Fraunces fits the content column at 1440 on one line with room to spare.
4. Canvas floor feasible: Yes — giant word, deck, work index, signals and colophon fill ~66% of a sparse, type-dominant canvas.
5. Phone: Yes — "thousands" at `4xl` (~60px) is ~270px wide, inside a 320px usable column at 360 without cutting.

## Rationale
The phrase is a FishSticks line from Doug's own voice file, and it works because of a scale/specific tension: "thousands" is a big abstract number, "the list the teacher sent home" is a kitchen-table fact. That tension decided the object. A word-poster puts "thousands" at marquee scale and lets the specific read quietly beneath it, which is the productive irony the gold standards (the fairway Split, the terracotta Specimen) are rated for. So the composition is a single column hung off one left rail, mass gathered upper-left, horizontal, sparse, type-dominant — type as the image, the way the composition mandate's starting tuple read it.

The chassis is fraunces-karla because the line is warm and human and the word "thousands" wants a fat, soft, generous letterform, not a condensed shout; Fraunces loads display italics, so "thousands" can lead lowercase italic at the heavy end of the axis and read tender rather than loud, with Karla answering it as a humanist body that shares its warmth. The palette is a dark-void lit like a lamp over a table at dusk: a warm near-black clay ground, the vermilion word glowing out of it, warm cream for the reading. I moved the hue to 10° red to clear the amber/gold cluster (44°, 48°, 69°) the repetition check flagged, keeping it warm and in the allowed 0-14° band and far from the forbidden greens, blues and fuchsia.

Layout serves the word: the mark and a vertical small-caps index live in a 96px left rail (marginal posture, no top bar, which the owner has rejected three ratings running), and the content accelerates down the page — big word and deck, then the work index, then a tight signals strip where the Red Wings loss is stated plain and the Tolstoy quote sits as a quiet attributed aside. Motion is restraint plus life: the poster word arrives fully formed (entrance none, the only non-recent option) while the warm glow drifts slowly, so the lamp breathes without a cascade.
