# Signals Brief — 2026-09-17

## Hero Copy
What ships should look like what was designed.

## Hero Rationale
This is lifted straight from Doug's voice file, his job compressed into one sentence, and after five ratings running asking for "my own line, brand visible up top" it is plainly the strongest line today. The Tigers lost 1–5 so there is no scoreboard to shout, the market is flat, the day is a clear calm fall Thursday: nothing external competes with a considered craft thesis. Morrison's line is genuinely good but the owner has said a quote poster is not him three times, so a Doug line wins outright. Owner's voice: Doug says what a thing does, not how it feels, and this is exactly what he checks for a living.

## Archetype
a printed type specimen, the thesis reversed out of an antique-gold flood

## Composition
columns: single
axis: vertical
symmetry: left-weighted
hero_zone: full-bleed
density: sparse
rhythm: accelerating
shell_posture: standard
field_ratio: drenched
collapse: hero-only
hero_object: statement

## Composition Rationale
The thesis is a plain declarative sentence, so it wants to be read top to bottom, one clause at a time, which is why I moved axis to `vertical` and symmetry to `left-weighted` (both discouraged): a flush-left waterfall off one rail is the specimen discipline the owner asks for, where the mandate's centered symmetric would float it. I moved hero_zone to the discouraged `full-bleed` because a drench IS full-bleed by definition and the gold-standard terracotta specimen proves the case. I moved shell_posture to `standard` deliberately, against the `none` suggestion, because a real top bar is the only honest way to put the circular mark in the first fold at both rungs, the complaint raised in five straight ratings.

## Mobile
carrier: the small-caps statement carries alone, stacked one phrase-chunk per line down the ochre flood.
first_fold: the horizontal mark + wordmark lockup top-left, then the hero statement "What ships should look like what was designed." stacked; nothing else (hero-only).
order: header lockup, hero statement, deck, work index, signal colophon
hero_step_360: 3xl
nav_360: mark + wordmark left, the single word "Index" reveals the three links on tap

## Chassis
zilla-worksans

## Visual Specification
### 1. Color Specification
- **Primary hue**: 68° (antique gold / ochre). Warm, inside the 40–80° mandate, pushed to the olive-gold edge to separate from the 44°/50° bright amber used twice this week; a harvest register for a considered fall thesis.
- **Neutral palette (sand, gold-tinted)**: 50 `#FBF6EA`, 100 `#F3E9D0`, 200 `#E4D4A9`, 300 `#CDB77D`, 400 `#B09656`, 500 `#8E7538`, 600 `#6E5A28`, 700 `#52431D`, 800 `#372D13`, 900 `#1E180A`
- **Accent color (marigold)**: light `#F5BE33`, default `#F0AC1C`, dark `#A9740B`, glow `#F9D46B`
- **Secondary accent**: none beyond the marigold register; one hue carries the page.
- **Background**: page bg `#8C6510` (drenched ochre), second ground/band `#503809`, inset surface `#6E4E0C`
- **Text colors**: primary `#FBF6EA`, secondary `#E4D4A9`, faint `#BFA463`

### 2. Typography
- **Hero phrase rendering**: `display` (Zilla Slab) at the `hero` ramp step, the fluid marquee clamp (96px at 1440). Set small-caps, light weight, roman, flush-left, one phrase-chunk per line (`stacked`), reversed ivory out of the ochre field. It reads as a specimen line blown to poster scale, not a shout.
- **Type treatment**: `hero` for the statement; `2xl`/`xl` for the deck and section heads so inner pages never jump title-to-body; `base` (Work Sans) at 60–70ch, leading 1.5–1.6, for prose; `sm`/`xs` small-caps for size-marker labels and the signal colophon. Middle of the scale is spent on the deck and the specimen size labels.

### 3. Layout Specification
- **Composition**: single column, vertical axis, left-weighted, full-bleed hero, sparse density, accelerating rhythm, standard shell, drenched field, hero-only collapse, statement object. The full-bleed ochre flood carries the thesis reversed out, hung flush-left off one rail; the phrase is the largest thing on the page.
- **CSS structure**: `display: grid; grid-template-columns: minmax(0, 1fr); align-content: start;` hero block `padding: 128px 7vw 96px`; the statement stacks line-per-line.
- **Major dimensions**: hero min-height `88vh`; `max-width: none`, side padding `7vw`; body prose insets to `max-width: 66ch` within the flood; section padding `96px 7vw`, footer `64px 7vw`.
- **Nav placement**: top bar, 76px, mark + wordmark grouped left; nav is a single word "Index" that reveals three links (no right-aligned link row).
- **Hero phrase grid zone**: rows 1–3 beneath the top bar, full width, occupying roughly 60% of the first fold at ~96px, flush-left off the 7vw rail.

### 4. Component Character
- **Border radius**: cards/panels 3px, buttons 6px, tags 2px. Hard, printed corners.
- **Border treatment**: hairline `border` (`#A9821F`) rules between rows; `borderStrong` for section breaks. Reversed-out ink, no boxes around the statement.
- **Shadow**: none. Depth is value, not shadow.
- **Density**: sparse in the hero, tabular and tight in the colophon.
- **Interactive states**: links underline on hover in marigold `#F0AC1C`; nav word underlines on hover.

### 5. Signal Integration
- **Signal elements**: a specimen colophon at the base, signals set as size-marker rows (label · value in small-caps), one hairline top rule.
- **Sports**: Tigers 1–5, stated plainly as a fact in the colophon, tabular numerals, no celebration and no marigold; a loss is not a pulse.
- **Quote**: the Morrison line runs as one small italic footnote under the colophon, not the hero.
- **Holiday**: none today.
- **Music**: Tobin Sprout, Radiohead as a "rotation" row in the colophon, marked as standing taste, never as an event.
- **Other**: SPY −0.44%, first-quarter moon (38% lit), clear 64°F Aldie, Biltmore Championship (scheduled) each as one size-marker row; the marigold spark is reserved for a single specimen size figure, not a signal.

## Self-Check
1. Hero quotability: Yes — "What ships should look like what was designed." stands alone as a builder's creed.
2. Because-of chain: Yes — thesis in Doug's plain voice → specimen waterfall → grounded slab (Zilla) → antique-gold drench → flush-left full-bleed.
3. Render feasibility: Yes — 7 words stacked at 96px small-caps fill ~60% of a 1440×900 fold with no overflow.
4. Canvas floor feasible: Yes — the ochre flood covers the full viewport, so 72% utilization is easily met.
5. Phone: Yes — at 360 the statement sets at 3xl stacked, longest word "designed" fits one line, mark above it in the first fold.

## Rationale
The phrase is Doug's job in one sentence, "What ships should look like what was designed." It is lifted verbatim from his voice file, it is plain-spoken and quotable, and it answers five ratings running that asked for his own words with the brand visible up top instead of another borrowed quote. Because it is a declarative craft thesis, not a scoreboard, the object is a statement set at marquee scale and the page becomes a printed type specimen: the sentence reversed out of a single flooded field, hung flush-left off one rail, read one clause at a time down the page.

A thesis about building things needs a face that reads as constructed, so the chassis is zilla-worksans: Zilla Slab is a sturdy, structural, civic slab whose serifs make the statement feel engineered rather than fashion-editorial, and Work Sans answers it as a body face sharing the same humanist skeleton, which satisfies the standing complaint that display and body must share construction. It is off the three recently-worn chassis and its quieter 96px hero suits a considered line over a shout. The type treatment moves off the recent mixed/left/none defaults: small-caps, light weight, stacked one chunk per line, which reads as a specimen label enlarged.

The palette is a single antique-gold drench at 68°, inside the warm 40–80° mandate but pushed to the olive-gold edge so it separates from the 44°/50° amber used twice this week; ivory ink reversed out of the ochre flood, one marigold spark held back for a lone specimen size figure. Drench is the gold-standard formula (the benchmark terracotta specimen) and is fresh against the recent duotone/light-ground/split-field run. The shell is deliberately `standard` with a real top bar so the circular mono mark sits in the first fold at 1440 and 360, contrast-checked dark-on-gold, directly addressing the most-repeated complaint; the loss and every other signal sit subordinate in a size-marker colophon, and the Morrison line is one small footnote, never the hero.
