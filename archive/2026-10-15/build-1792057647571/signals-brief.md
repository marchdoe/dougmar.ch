# Signals Brief — 2026-10-15

## Hero Copy
Just get out and do it. You will be very, very glad that you did.

## Hero Rationale
This is `signals.quote`, Christopher McCandless, and it carries a page on its own: an imperative anyone would screenshot, with a plainspoken repetition ("very, very glad") that sounds like a person, not a slogan. It is also exactly the register Doug uses about his own work: ship the thing, find out. The Pistons win (128-106) and the autumn jade field sit under it as evidence, not as the headline. Owner's voice: Doug has four holes in one and a stack of shipped experiments because he just got out and did it, and he'd tell you so.

## Archetype
a jade poster, the imperative stacked like a trailhead sign

## Composition
columns: two-asymmetric
axis: diagonal
symmetry: right-weighted
hero_zone: interleaved
density: dense
rhythm: even
shell_posture: folded-into-hero
field_ratio: drenched
collapse: split-to-sequence
hero_object: statement

## Composition Rationale
I moved `columns` off the suggested `three` to `two-asymmetric`: a three-column newspaper measure fights a word-per-line poster stack, so a wide jade field plus one narrow signal rail serves the imperative better. I moved `hero_object` off the suggested `figure` to `statement`: the quote's object is its sentence, and today's real number (128-106) is evidence in the rail, not the headline. The rest sits near the starting tuple because the jade drench, dense rail, even rhythm, folded header and split-to-sequence collapse genuinely fit a stacked quote facing its signals.

## Mobile
carrier: The stacked imperative stays the hero and the rail collapses to a full-width jade band of signals directly beneath it.
first_fold: The stacked "Just get out and do it" with "Christopher McCandless" under it.
order: hero stack, author caption, deck line, Pistons figure, signal band, callout, footer
hero_step_360: 4xl
nav_360: Mark top-left; the numbered links wrap to one small row beneath it.

## Chassis
unbounded-figtree

## Visual Specification
### 1. Color Specification
- **Primary hue**: 158° jade. The quote is about walking out the door; jade is the going-outside green, saturated and committed rather than a muted sage. It lands inside the 140-180° mandate.
- **Neutral palette** (sage, tinted toward green): 50 #f4f8f6, 100 #e6efea, 200 #ceddd4, 300 #afc3b8, 400 #89a396, 500 #6a8477, 600 #516a5e, 700 #3d5147, 800 #293930, 900 #15221c
- **Accent color** (gold): light #f8d888, default #f2b134, dark #d9971f, glow #f5c659
- **Secondary accent**: none. The one gold carries marks, the Pistons figure, and the attribution.
- **Background**: page bg #0b6e4b, card/inset surface #0a4330, sidebar/rail bg #0a5940
- **Text colors**: primary #f1fbf6, secondary #b6e3cf, muted #9bd2b8

### 2. Typography
- **Hero phrase rendering**: `display` (Unbounded), set at the `hero` ramp step as the fluid clamp, but capped below the chassis marquee (see MEASURABLES) so the six stacked words fit the fold. Each word on its own flush-left line: Just / get / out / and / do / it. The remainder of the quote ("You will be very, very glad that you did.") sits as the deck at `xl`, not stacked, beneath the stack.
- **Type treatment**: hero at `hero`; the deck/standfirst at `xl`; the Pistons figure and section heads at `3xl`/`2xl` to spend the middle of the scale; body/captions at `base`; rail metadata at `sm`; micro labels at `xs`. Leading and tracking come from the ramp steps, not invented values.

### 3. Layout Specification
- **Composition**: two-asymmetric / diagonal / right-weighted / interleaved / dense / even / folded-into-hero / drenched / split-to-sequence / statement. A narrow left signal rail and a wide right jade field; the stacked imperative owns the field, the eye steps down the words then crosses diagonally to the rail. Statement, because a quote's object is its sentence.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 0.32fr 0.68fr; gap: 0;`
- **Major dimensions**:
  - Hero field min-height: `min-height: 100vh`
  - Left rail width: `32%` (min 300px)
  - Max content width: `max-width: none`, side padding `padding: 72px 5vw`
  - Section padding: vertical rhythm on the chassis base unit, roughly 48–96px between zones
- **Nav placement**: folded into the hero, a numbered row along the lower edge of the jade field; mark top-left of the same field.
- **Hero phrase grid zone**: rows 2–8, column 2 (the wide right field), stacked words filling roughly 70vw height-first; the deck occupies the row directly beneath.
- **Home callout slot**: on `/`, place `<SiteCallout />` below the hero field and above the footer field band, between the signal rail/hero zone and the footer. I write no copy or styling for it.

### 4. Component Character
- **Border radius**: cards/panels 6px (md), buttons 6px, tags 3px (sm). Hard-edged poster, not pillowed.
- **Border treatment**: hairlines in `border` #15825a; section breaks in `borderStrong` #2fae7f; rail dividers in `fieldBorder` #136a49.
- **Shadow**: none. Depth comes from value (surface darker than bg), per drench discipline.
- **Density**: dense in the rail, spacious in the field.
- **Interactive states**: links shift from `accent` gold to `accentAlt` #f5c659 on hover, 120ms.

### 5. Signal Integration
- **Where signal elements live**: the left rail, threaded top to bottom.
- **How sports scores are styled**: Pistons 128-106 as a mid-scale gold figure (`3xl`) in the rail, "Pistons over the floor, 128-106" labeled beneath in muted mint. A win, stated as a score.
- **How the quote is displayed**: it IS the hero. "Christopher McCandless" renders as a gold `sm` caption directly under the stacked words; the deck is the rest of his line.
- **Holiday elements**: none today.
- **Music**: Guided by Voices and My Morning Jacket set as a single rotation caption at the rail foot, faint, marked as taste not news.
- **Other signals**: Overcast 61°F Aldie in faint mint; waxing crescent moon glyph; SPY down 1.08% as a small muted figure, not dramatized.

## Self-Check
1. Hero quotability: Yes — an imperative with a human repetition, screenshot-ready in isolation with its author in view.
2. Because-of chain: Yes — statement object, jade drench, blocky Unbounded, stacked field, gold evidence all flow from the imperative.
3. Render feasibility: Yes — hero clamps to 116px max, six short stacked lines clear a 900px fold with the rail beside them.
4. Canvas floor feasible: Yes — a drench field with a dense rail and a tall stack fills well past 82%.
5. Phone: Yes — six short words at 4xl stack inside the first 640px without cutting a word.

## Rationale
The phrase is McCandless's imperative, "Just get out and do it. You will be very, very glad that you did." It is a push, not a mood, so the object on the page is the statement itself and nothing competes with it for scale. The first five words break into a flush-left stack, one word per line, reading like a trailhead sign, and the rest of the quote lands as the deck beneath. Because the sentence is the poster, I set it in Unbounded, a wide blocky geometric display that carries an imperative at full width without reaching for the condensed caps I have leaned on all month, and I set it light rather than heavy so the words read as a steady instruction instead of a shout.

Palette follows the going-outside reading of the line: a committed jade drench at 158°, the green of walking out the door, with one gold mark for the "glad you did." Gold also does the evidence work, the Pistons 128-106 figure and the attribution, so the page has exactly one accent carrying both triumph and warmth against the field. The ground is drench with a faint gold dot field, which keeps color coverage past 70% while giving the specimen a little surface, and the single-color mint mark is the honest choice on a saturated field.

Layout is two-asymmetric: the wide jade field holds the stacked imperative, a narrow left rail threads the day's signals, and the eye steps down the words then crosses diagonally to the rail, which is where the Pistons score, the overcast Aldie weather, the waxing crescent and the Guided by Voices / My Morning Jacket rotation live. The header folds into the field, mark top-left and a numbered nav along the lower edge, so nothing sits above the poster. At 360 the split becomes a sequence: the stack stays the hero with the author under it, and the rail drops to a full-width signal band directly beneath, the relationship kept by adjacency.
