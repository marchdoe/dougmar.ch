# Signals Brief — 2026-09-20

## Hero Copy
Ten years independent. Still the vehicle for the next experiment.

## Hero Rationale
This is lifted verbatim from Doug's voice file, where it sits under Spaceman, the LLC he has run for a decade. Today the composition mandate wants the work index to lead, and this line is the exact standfirst that frames a list of experiments: Spaceman, FishSticks, 15th Club, TeeTurn, and the two 2008 Twitter-era hacks. It is his own words with the brand up top, which is the note five ratings running have asked for, and it answers a two-loss Detroit weekend by pointing at the work instead of a borrowed quote about adversity. Owner's voice: he says Spaceman is ten years old and every project is the next experiment, so the sentence is already his.

## Archetype
The work index as a ten-year register.

## Composition
columns: three
axis: vertical
symmetry: left-weighted
hero_zone: upper-left
density: crowded
rhythm: even
shell_posture: folded-into-hero
field_ratio: field-dominant
collapse: stack
hero_object: list

## Composition Rationale
The phrase frames a decade of experiments, so the work index leads and the phrase is its standfirst (hero_object: list, per the mandate start). I moved axis to vertical (off radial) because a ranked ten-year register reads top to bottom, not around a center, and I landed symmetry on the soft-forbidden left-weighted because an index is a ledger that must hang off one left rail, honoring the standing "one left rail per page" complaint; centring or right-hanging it would destroy the scan. hero_zone moved to upper-left (off lower-third) because a standfirst sits above the list it introduces.

## Mobile
carrier: the three-column index collapses to full-width stacked rows, each project one row of number, title, year and role, read top to bottom as a register.
first_fold: the mark, the standfirst "Ten years independent. Still the vehicle for the next experiment." at 2xl, and the first two index rows.
order: masthead (mark + numbered nav), standfirst, work index, about + timeline, running-foot signals
hero_step_360: 2xl
nav_360: mark top-left, numbered links wrap to one row beneath; folded masthead becomes a compact two-line block.

## Chassis
space-mono-archivo

## Visual Specification
### 1. Color Specification
- **Primary hue**: 178° teal. Chosen at the cyan edge of the 140–180° mandate to separate from yesterday's 162° pine (the repetition check flagged a 4° collision earlier in the window); 178° teal reads as a distinct register from a forest green while staying inside the mandate range.
- **Neutral palette (teal-tinted)**: 50 #edf3f2, 100 #dce6e4, 200 #b8ccc9, 300 #8ba8a4, 400 #6f8a85, 500 #3d5854, 600 #2a403d, 700 #1a2b29, 800 #0f1c1a, 900 #081210
- **Accent color (teal)**: light #5eead4, default #2dd4bf, dark #0d9488, glow #14b8a6
- **Secondary accent**: none. One teal carries the page.
- **Background**: page bg #081412 (near-black teal void), card/surface bg #10201d, band bgAlt #0d1c19
- **Text colors**: primary #e6efed, secondary #9db5b0, muted #6f8a85

### 2. Typography
- **Hero phrase rendering**: The phrase is the standfirst, set in the `display` face (Space Mono) at `3xl`, lowercase, roman, sitting directly above the work index. It is not the largest element; the index titles are.
- **Object rendering (the list)**: Project titles run at the `hero`/`5xl` register (Space Mono), the largest elements on the page, each a full-width ledger row numbered 01–07 with year and role in `sm` tabular figures to the right. This is the middle-of-the-scale work the ratings demanded: standfirst `3xl`, section heads `xl`, row titles `hero`, metadata `sm`, footnotes `xs`.
- **Type treatment**: lowercase throughout the display register, tabular numerals on globally (`font-variant-numeric: tabular-nums`) so every year and score column aligns. Body (Archivo) at `base`, capped at 62ch, leading 1.5–1.6.

### 3. Layout Specification
- **Composition**: columns=three, axis=vertical, symmetry=left-weighted, hero_zone=upper-left, density=crowded, rhythm=even, shell_posture=folded-into-hero, field_ratio=field-dominant, collapse=stack, hero_object=list. A vertical, left-hung register serves a ranked list of a decade's work; the phrase stands above it as the reason the list exists.
- **CSS grid/flex**: page `display: grid; grid-template-rows: auto auto 1fr auto`. Index rows `display: grid; grid-template-columns: 4rem minmax(0, 1fr) 8rem 10rem` (number | title | year | role), one repeating row interval. A single left rail at `6vw`; a rotated vertical spine line ("ashburn, virginia · est. 2016") runs the left edge as texture.
- **Major dimensions**: hero+first rows fill `min-height: 92vh`; no sidebar; `max-width: none` with `padding: 96px 6vw`; row height a constant `clamp(96px, 12vh, 148px)`; section spacing on the shared base unit.
- **Nav placement**: folded into the hero masthead, top-left, mark above wordmark, numbered links beneath the standfirst.
- **Hero phrase grid zone**: rows 1–2, columns 1–9 (upper-left), phrase at `3xl` (~clamp 40–64px); index titles rows 3+ at `hero`.

### 4. Component Character
- **Border radius**: cards 4px, buttons 4px, tags 2px. Sharp, ledger-like.
- **Border treatment**: hairline `border` between every index row; `borderStrong` under the masthead and above the footer.
- **Shadow**: none. Depth comes from surface lightness on the void, not shadow.
- **Density**: crowded but strictly gridded; every element on the row grid.
- **Interactive states**: `_hover` floods a row to `surface` and turns the number teal (`accent`); links underline on hover.

### 5. Signal Integration
- **Where signals live**: a full-width running-foot register below the index, styled as the closing rows of the same ledger.
- **Sports scores**: Lions 31–41 loss and Tigers 1–3 loss stated flat in tabular figures, no editorializing, en dash inside the score only.
- **Golf**: the Biltmore Championship gets its own three-row mini-leaderboard (Shipley -21, Kohles -20, Cole -17), under-par figures in teal `accent`.
- **Quote**: Lagace's "The highest level of wisdom is when you not only accept but love adversity." set as one small italic footnote at the base (Space Mono italic), a quiet nod to the two losses, never the hero.
- **Holiday**: none today.
- **Music**: Wet Leg and Tobin Sprout listed in the running-foot as "in rotation", taste not event, no date beside it.
- **Weather/moon/market**: fog 63.7°F, waxing gibbous 71%, SPY 761.69 +0.13% as three tabular columns in the running-foot.

## Self-Check
1. Hero quotability: Yes — "Ten years independent. Still the vehicle for the next experiment." stands alone as a maker's statement.
2. Because-of chain: Yes — a list-framing standfirst drives a left-hung index (list object), which drives the terminal register chassis, which drives the teal void palette.
3. Render feasibility: Yes — standfirst at 3xl and index titles at hero both fit 1440×900 without overflow.
4. Canvas floor feasible: Yes — seven full-width index rows plus a running-foot fill a crowded, field-dominant canvas past 84%.
5. Phone: Yes — the standfirst compresses to 2xl inside the first fold at 360 without cutting a word; index stacks below.

## Rationale
The hero phrase is Doug's own line about Spaceman: ten years independent, still the vehicle for the next experiment. It is his words with the brand up top, the note the ratings keep making, and on a weekend where both Detroit teams lost it points at the work rather than reaching for the adversity quote as a poster. Because the line is a frame for a body of work, the object on the page is the work index itself, not another eyebrow-statement-deck poster. That is the composition mandate's own suggestion (hero_object: list) and it is the honest one today: seven projects dated 2008 to 2026 read as a register of experiments, with the phrase as the standfirst that explains why they belong together.

An index of dated experiments by a product engineer who ships code wants a terminal register, so the chassis is space-mono-archivo, fresh against the recent window and off the three worn faces. Mono is not costume here; Doug's brand is genuinely technical, and Space Mono's tabular figures do the layout work an index needs, numbers and years and scores aligning down the columns. The type is set lowercase, roman, left-hung off one rail, with a rotated vertical spine line as texture, moving off the mixed-case defaults the mandate flagged. Project titles run at the hero register as the largest elements; the standfirst steps down to 3xl above them, so the page spends the middle of the scale instead of jumping from a giant title to body.

The palette is a dark-void teal, a formula fresh against the recent light-ground, split-field and drench run. A near-black teal-tinted void with one bright teal floating on it reads as a lit screen, and the mesh material paints soft teal blooms that answer today's fog. The hue sits at 178°, the cyan edge of the 140–180° mandate, pushed as far from yesterday's 162° pine as the range allows after the repetition check flagged a color collision. The dark ground is also the one honest day to bring the real green-and-blue mark back at stacked-lg scale, where it glows against the black instead of sinking into a flood, sitting top-left in the first fold at both rungs. Signals close the page as the final rows of the same ledger: two losses flat, the Biltmore leaders with under-par figures in teal, the Lagace line as one small italic footnote.
