# Signals Brief — 2026-11-13

## Hero Copy
Nobody guarded anybody, 144-140.

## Hero Rationale
The Pistons won a track meet last night, both teams past 140, and a Detroit box score is the one signal this morning that is unambiguously Doug's. The Jefferson quote is well made but it is about anger, not design, engineering, golf, Detroit or the work, so it fails the "would Doug say this" test and loses to a wry line about the score. A composed line beats a bare "144-140" because the joke is the point: when a game ends 144-140, the defense took the night off. This is the same lane as yesterday, justified because the shootout is the only live, owned, Doug-register signal in the set and a flat score wouldn't carry a hero.
Owner's voice: A score is a score, and Doug would laugh that two NBA teams scored 284 points between them and call it exactly what it was.

## Archetype
a box-score specimen wall, numbers set as type

## Composition
columns: masonry
axis: vertical
symmetry: symmetric
hero_zone: interleaved
density: crowded
rhythm: even
shell_posture: folded-into-hero
field_ratio: balanced
collapse: stack
hero_object: statement

## Composition Rationale
The phrase is a wry one-liner about a night of pure offense, so the page is the offense: a crowded, evenly-gutted masonry wall of the night's numbers with the statement woven in as the dominant tile. I moved hero_zone off the starting `center` to `interleaved` because a masonry wants its hero as a tile among tiles, not floating with clearance, and hero_object off `word` to `statement` because the quotable line, not a single word, is the largest object. Symmetric packing is kept deliberately: 144-140 was a near-even game, so even columns and matched weight on both sides are the structure, with the value split (dark field vs lit jade) carrying the result instead of layout imbalance.

## Mobile
carrier: the statement tile leads full-width, then 144 and 140 stack as two full-width specimen bands so the shootout survives by adjacency, then the rest of the night's numbers run as one column.
first_fold: the hero phrase "Nobody guarded anybody, 144-140." in the top tile, set at 3xl.
order: hero statement, 144 / 140 score pair, Red Wings 4–5, golf / market / weather / moon, music + Jefferson, work index, split colophon
hero_step_360: 3xl
nav_360: lockup shrinks to mark + "Doug March" at top-left, role line drops; 01 02 03 links wrap to a row beneath it.

## Chassis
alfa-rubik

## Visual Specification
## 1. Color Specification

**Primary hue**: 158° (jade green). Inside the mandate's 140–180° target. A saturated, lit green reads as an LED scoreboard glow and gives a high-scoring Detroit win its heat without leaving the green lane; the brightness, not a second hue, carries the energy.

**Neutral palette** (green-tinted): 50 `#f2f7f3`, 100 `#e3ece6`, 200 `#c6d6cc`, 300 `#a1b4a8`, 400 `#74887c`, 500 `#54685b`, 600 `#405249`, 700 `#2e3c33`, 800 `#1e2821`, 900 `#121a15`.

**Accent color** (electric green): light `#93f2b4`, default `#4ce68a`, dark `#1bb560`, glow `#c6ffd9`.

**Secondary accent**: none. One hue, committed.

**Background**: page ground (dark field) `#07311f`; second ground `#0a4a34`; raised tile/surface `#0c4330`; lit jade field `#12a86a`.

**Text colors**: primary `#f3f7f4`, secondary `#9fc4af`, muted/faint `#7fae92`. On the jade field: ink `#04261a`, muted ink `#063d28`.

## 2. Typography

**Hero phrase rendering**: `display` (Alfa Slab One) at the `hero` ramp step, small-caps, justified, in the dominant tile that spans the top two masonry columns. "Nobody guarded anybody," runs in `text`/near-white over the dark forest field; ", 144-140" closes in `accent` electric green. It is the page's one h1 and the largest object on the canvas.

**Type treatment**: `hero` for the statement tile; `5xl`/`4xl` for the two score specimens (144, 140) set in Alfa Slab as the wall's material; `2xl` for tile section heads; `lede`/`lg` (Rubik) for the standfirst and tile labels; `base` (Rubik) for body at 16px, 1.55 leading, 62ch cap; `sm`/`xs` for metadata and attribution. Every tile carries a mid-register label so no tile jumps straight from a giant number to 12px.

## 3. Layout Specification

**Composition**: masonry / vertical / symmetric / interleaved / crowded / even / folded-into-hero / balanced / stack / statement. A shootout night is dense with numbers, so the wall packs them as flat color specimen tiles with the wry statement woven in as the biggest tile; the near-even 144-140 wants evenly-packed, symmetric columns, not a hierarchy.

**CSS grid/flex structure**: `display: grid; grid-template-columns: repeat(4, 1fr); grid-auto-rows: minmax(150px, auto); gap: 2px;` (hairline gutters read as rules, not padding). Hero tile `grid-column: span 2; grid-row: span 2;` at top-left. Score specimen tiles `span 1`. No rounded card chrome anywhere.

**Major dimensions**:
- Hero tile min-height: `min-height: 54vh`.
- No fixed sidebar; the header folds into the top tile row.
- Max content width: `max-width: none; padding: 60px 5vw`. Full-bleed wall.
- Section padding: 2px gutters inside the wall; 80px between the wall, the callout band and the footer band.

**Nav placement**: folded into the hero. Horizontal lockup (mark + "Doug March", role beneath) top-left on the deep forest field; `01 02 03` Work / About / Contact as numbered specimen links top-right. Header band ~96px tall inside the hero.

**Hero phrase grid zone**: rows 1–2, columns 1–2 (the top-left spanning tile), ~54vh tall, type set at the `hero` clamp (to ~148px at 1440).

**Home callout slot**: on `/`, a full-width band below the masonry wall and above the footer colophon band, sitting between the work-index tiles and the split colophon. Orchestrator-owned; no copy or styling from me.

## 4. Component Character

**Border radius**: cards/tiles `0`, buttons `3px` (sm), tags `0`. Sharp, specimen-wall edges.

**Border treatment**: bordered by `fieldBorder`/`border` hairlines, which are really the 2px grid gutters showing the ground through. No drop borders on tiles beyond the gutter.

**Shadow**: none. Depth comes from the jade/forest value split, not shadow.

**Density**: crowded. Tiles pack tight, gutters are hairlines.

**Interactive states**: links underline on `_hover` in `accent`; numbered nav items shift ink to `accent` on hover; tiles do not move.

## 5. Signal Integration

- **Pistons 144-140**: the hero statement plus the two score specimens, 144 in the lit jade field (winner), 140 in a dark forest tile, both Alfa Slab at `5xl`/`4xl`.
- **Red Wings 4-5 loss**: one dark tile, "RED WINGS 4–5" with a quiet "L" marker in `textFaint`.
- **Golf, Austin Championship**: a jade tile, "TRACE CROWE −10" leading, "IN PROGRESS" as a `sm` label.
- **Market SPY**: tile, "757.12" with "−0.35%" in `textMuted` (down, so no accent).
- **Weather**: "43°F CLOUDY, FEELS 36" tile, Aldie VA, `base`.
- **Moon**: "WAXING CRESCENT 20%" tile, `sm`.
- **Music** (`rotation: true`): a quiet "IN ROTATION" tile listing Tobin Sprout / Guided by Voices / The War on Drugs in `base`, no date, no event framing. Taste, not news.
- **Quote (Jefferson)**: a small attributed tile, "count to one hundred — Thomas Jefferson" at `sm`, clearly a found line, not the hero.
- No holiday today.

## Self-Check
1. Hero quotability: Yes — "Nobody guarded anybody, 144-140" is a complete wry take you could screenshot, not a label.
2. Because-of chain: Yes — shootout line → packed symmetric specimen wall → fat carnival slab (alfa-rubik) → committed electric jade → interleaved hero tile.
3. Render feasibility: Yes — hero clamps to ~148px under alfa-rubik's 160px ceiling, justified small-caps fills the two-column tile without overflow.
4. Canvas floor feasible: Yes — a crowded masonry of colored tiles fills well past 82% of 1440×900.
5. Phone: Yes — collapse stack leads with the hero tile at `3xl`, which fits "anybody" inside 360 without cutting a word.

## Rationale
The phrase came first: the Pistons won a shootout 144-140, both teams past 140, and the only line that is both quotable and unmistakably Doug's is the dry observation that nobody played any defense. That decides the object: the page is the offense, a crowded masonry wall of the night's numbers, with the wry statement woven in as the dominant tile rather than a lone centered hero. The near-even score decides the symmetry: evenly-packed columns, matched weight on both sides, with a dark forest field and a lit jade field trading points so the value split, not the layout, carries the win.

The chassis is alfa-rubik because a 284-point track meet wants a fat, physical, carnival-loud slab, not another condensed signage face or editorial serif, and Alfa Slab One has gone unused while three condensed faces and the serifs have carried recent nights. Its single weight and lack of italics forces an honest regular/roman treatment, so the variance lives in small-caps, justified, and type-as-texture instead: the 144 and 140 set as oversized specimen numerals are the wall's material. The palette is committed single-hue jade (158°, dead inside the mandate) because the brightness itself reads as scoreboard heat, and one electric accent green closes the score line without needing a second hue.

Layout follows: a four-column masonry on hairline gutters, the hero tile spanning the top-left two columns and two rows, the header folded into the top row with a horizontal lockup on the dark forest field where the white disc of the mark clears contrast easily. Split-field is the ground strategy because the two color fields are the composition, and it is off the recently-overused drench/duotone/light-ground formulas. At 360 the wall stacks, leading with the statement tile, then the 144/140 pair as adjacent full-width bands so the shootout survives the collapse.
