# Signals Brief — 2026-09-28

## Hero Copy
Buildable before the first line of code. Faithful after the last.

## Hero Rationale
This is Doug's own thesis, lifted verbatim from his voice notes: the whole reason he works as one person doing both jobs is that he checks a design can be built before code is written and checks the ship matches the mockup after. Today's quote, "A leader is one who knows the way, goes the way, and shows the way" (author Unknown), is a leadership fortune-cookie with no attribution, exactly the borrowed self-help register the owner has rejected before, so I passed it. The line reads as a before/after promise, which the whole page can be built around. Owner's voice: Doug literally lists "Buildable before the first line of code. Faithful after the last." as a line he would say.

## Archetype
a drafting sheet, stamped

## Composition
columns: two-asymmetric
axis: horizontal
symmetry: left-weighted
hero_zone: upper-left
density: crowded
rhythm: even
shell_posture: folded-into-hero
field_ratio: field-dominant
collapse: split-to-sequence
hero_object: word

## Composition Rationale
I invoke the Max-Risk License to land one composition axis on a soft-forbidden value: axis is `horizontal`, which the Composition Mandate soft-forbade (start `vertical`, avoid horizontal/diagonal/radial). The phrase is explicitly temporal, "before the first line of code" then "after the last," and only a left-to-right reading path renders that before→after sequence; a vertical stack would flatten the two clauses into an ordinary list. Columns move to two-asymmetric so the wide indigo thesis field can face the narrower pale evidence field, and collapse is split-to-sequence because this is a genuine split field that must become before-above-after at 360.

## Mobile
carrier: At 360 the horizontal before→after split becomes a vertical sequence, the indigo thesis panel stacked directly above the pale evidence panel so before still sits above after by adjacency.
first_fold: The indigo thesis panel: BUILDABLE at the 5xl step with "Buildable before the first line of code. Faithful after the last." as its deck, the pale title-block mark above it.
order: title-block + BUILDABLE + phrase, work index, signal revision table, site callout, footer
hero_step_360: 5xl
nav_360: The title-block card spans full width at top; mark left, and Work / About / Contact as a ruled vertical list beneath it.

## Chassis
big-shoulders-atkinson

## Visual Specification
## 1. Color Specification

- **Primary hue**: 262° indigo-violet. It reads as technical drafting ink, right for a page about buildability and fidelity. The mandate target of 140–180° is spent (166° and 152° are both in the recent window and inside the forbidden 122–245° recency zone), so I moved to the freshest committed hue available in a non-forbidden band (245–310°); 262° sits ~47° off the 215° cobalt of 09-24 and ~78° off the 340° of 09-22, the widest separation the constraints allow.
- **Neutral palette (vellum, warm, faintly violet)**: 50 `#F9F6F0`, 100 `#F4F1EA`, 200 `#E9E4D8`, 300 `#D8D2C4`, 400 `#BDB5A4`, 500 `#948B78`, 600 `#6E6656`, 700 `#5A5346`, 800 `#322E27`, 900 `#211F1B`.
- **Accent color**: light `#7C68E8`, default `#5B44D6`, dark `#4E3CB0`, glow `#7C68E8`.
- **Secondary accent**: none. One saturated hue carries the page.
- **Background**: page bg `#F4F1EA` (warm vellum, the evidence field), card bg `#F9F6F0`, the deep thesis field `#2C2160` (indigo).
- **Text colors**: primary `#211F1B`, secondary `#5A5346`, muted `#6E6656`; on the indigo field, ink `#EFEBFB`, muted `#9E8FEE`.

## 2. Typography

- **Hero phrase rendering**: `display` (Big Shoulders Display) sets the single word BUILDABLE at the `hero` step, `clamp(110px, 11vw, 156px)`, caps, stroked outline, knocked into the indigo thesis field upper-left. The rest of the phrase, "before the first line of code. Faithful after the last.", is the deck directly beneath it at the `lg`/`md` step in Atkinson Hyperlegible, so the giant word is literally the first word of the sentence.
- **Type treatment**: hero at `hero` (outline caps). Section heads and the evidence standfirst at `2xl`/`xl` to spend the mid-scale the owner asked for. Body and work-index rows at `base`/`lg` in Atkinson, held to 60–68ch, leading 1.5. Captions and revision-table metadata at `sm`; micro drafting labels at `xs`, never under 13px. Tabular figures on every score.

## 3. Layout Specification

- **Composition**: `two-asymmetric` / `horizontal` / `left-weighted` / `upper-left` / `crowded` / `even` / `folded-into-hero` / `field-dominant` / `split-to-sequence` / `word`. The split reads before→after left to right: the wide indigo thesis field states the design intent (BUILDABLE + the line), the pale evidence field to the right proves it with the shipped work. The two halves need each other, which is the gold-standard split shape.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1.35fr 1fr;` at 1440. Evidence side is an internal `grid-template-columns: repeat(2, 1fr)` catalog of work rows.
- **Major dimensions**:
  - Thesis (hero) field `min-height: 100vh` at 1440.
  - No fixed sidebar; the split columns are the structure.
  - Max content width: `max-width: none`, side padding `clamp(32px, 5vw, 88px)`; body columns capped at ~64ch via a token, not the grid.
  - Section padding: vertical rhythm on the chassis base unit; evidence rows at even 1-interval spacing (drafting grid).
- **Nav placement**: folded into the hero. A pale vellum title-block card sits top-left of the indigo thesis field holding the original mark; Work / About / Contact stack as a ruled vertical index beneath it.
- **Hero phrase grid zone**: rows 1–3, column 1 (the indigo thesis field), BUILDABLE at ~156px filling the upper-left, deck beneath at ~30–40px.
- **Home callout slot**: full width, below the evidence field and above the footer, between the work/signals evidence section and the drafting title-block footer. Set in `bgAlt`. I place it; I do not design or write it.

## 4. Component Character

- **Border radius**: cards `2px` (sm), buttons `2px`, tags `0`. Sharp, drafting-sheet edges; no rounded corners.
- **Border treatment**: bordered with hairlines. `border` on vellum, `borderStrong` for the drafting ink rules that separate rows, `fieldBorder` for rules inside the indigo field.
- **Shadow**: none. Depth comes from the value split, not shadow.
- **Density**: crowded. Evidence rows, timeline, capabilities and the signal revision table pack the pale field like a spec sheet.
- **Interactive states**: `_hover` lifts a work row's rule to `borderStrong` and tints the row number to `accent`. No motion on hover beyond color.

## 5. Signal Integration

- **Where signal elements live**: a drafting revision-table band at the foot of the evidence field.
- **Sports scores**: Atkinson tabular-nums, `lg`. Lions 31–24 (win) is the prominent row, its figure marked in `accent`. Tigers 2–4 (loss) stated flat beneath it in `text`, no color. Presidents Cup final, 17–13, as a golf revision row (Doug's game).
- **Quote**: passed as hero; it appears once as a small muted footnote in the revision block, attributed "Unknown," so the signal is present without carrying the page.
- **Holiday elements**: none today.
- **Music**: Tobin Sprout and My Morning Jacket as a single muted "on rotation" caption in the colophon, taste not event, no score treatment.
- **Other signals**: SPY 771.35, up 0.54%, one revision row; overcast 59.6°F, Aldie as the dateline; waning gibbous 92.6% and AQI good as micro rows.

## Self-Check
1. Hero quotability: Yes — "Buildable before the first line of code. Faithful after the last." is a complete, screenshot-worthy claim, not descriptive filler.
2. Because-of chain: Yes — before/after phrase → horizontal split → industrial signage chassis → indigo-ink split-field → drafting-sheet layout, all traceable.
3. Render feasibility: Yes — BUILDABLE (9 condensed caps) at 156px fits column 1 of a 1440 canvas without overflow.
4. Canvas floor feasible: Yes — crowded evidence catalog plus a large indigo field fill 80%+ of a 1440×900 viewport.
5. Phone: Yes — at 5xl (72px) condensed, BUILDABLE is ~290px wide, inside the 360 first fold without cutting a word.

## Rationale
The phrase is Doug's own, "Buildable before the first line of code. Faithful after the last." It is a before-and-after promise about the one job he does as two, so the page is a drafting sheet split down the middle: a deep indigo thesis field states the intent, a pale vellum evidence field proves it with the shipped work. That is why the object is a single word, BUILDABLE, stamped upper-left in the thesis field with the full line as its deck, and why the composition is a two-asymmetric horizontal split reading before→after rather than the mandate's vertical stack.

Big Shoulders Display carries the word: it is an industrial signage face, literally built for architectural and construction lettering, so BUILDABLE reads as a stamp on a drawing. I set it in outline, so the word is a drafting outline, drawn but not yet solid, which is what "buildable" means, before code. Condensed caps have not shipped in fourteen builds and the owner's gold standards are condensed-caps posters, so reaching for the register is fresh, not a default. Atkinson Hyperlegible answers it as clean engineering-manual body text at real reading size.

The palette is drafting ink on vellum: indigo-violet at 262°, the freshest committed hue the recency constraints allow, because the 140–180° target is spent and forbidden. Split-field is the honest ground strategy here, fresh against the recent duotone/dark-void/drench run and a one-to-one match for the before/after split. Ruled lines are the material because a spec sheet is ruled. And because one half is a pale sheet, the original green-and-blue mark finally has a home: it sits on a vellum title-block card in the thesis corner, in full color, unclipped, in the first fold at both widths, answering the standing complaint that the mark is always a single-color afterthought.
