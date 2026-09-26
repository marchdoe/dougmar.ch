# Signals Brief — 2026-09-26

## Hero Copy
Tigers, by one.

## Hero Rationale
Detroit won 8–7 on Friday night, a one-run game held to the last out, and the Tigers are on Doug's short list of teams he actually watches. It carries the day because it is his, concrete, and a score is a score: the figure "8–7" is the poster object and the phrase is its caption. I passed over `signals.quote` (the Eckhart Tolle line about space being created for something new) because it is abstract self-help in a register the owner has explicitly rejected before (Flaubert, Yogananda, "a poster of somebody else"); Doug talks in real numbers, not "space emerging in your life," so it fails the would-Doug-say-it test.
Owner's voice: he'd say "Tigers, by one" the way he says "a score is a score" — flat, exact, his team, no adjective needed.

## Archetype
a full-moon box score: didone gold floating on a dark scoreboard

## Composition
columns: masonry
axis: diagonal
symmetry: right-weighted
hero_zone: full-bleed
density: dense
rhythm: syncopated
shell_posture: footer-only
field_ratio: balanced
collapse: hero-only
hero_object: figure

## Composition Rationale
I kept the date-derived starting tuple (masonry, diagonal, right-weighted, dense, syncopated, footer-only, balanced, hero-only, figure) because it reads as a scoreboard and the hero is genuinely a score, so the suggestion fits rather than needs breaking. The one axis I moved is `hero_zone`, from the suggested `edge-bound` to `full-bleed`: edge-bound crops the hero against the edge, and cropping a two-glyph score would read as broken the way the clipped wordmark did, so the figure owns the full field instead. Everything else earns its place — the diagonal path resolves the eye on the win, and the right-weighted mass matches the figure pinned to the right.

## Mobile
carrier: The gold 8–7 at poster scale carries the fold alone; the dot field and the caption "Tigers, by one." hold the idea without the ledger.
first_fold: The figure "8–7" and directly beneath it the hero phrase "Tigers, by one." with the deck "One run stood up."
order: hero (8–7 + phrase + deck), signals ledger, site callout, footer nav
hero_step_360: hero
nav_360: Footer nav stacks its three links into a single row at the foot; the stacked mark holds top-left of the hero at ~40px.

## Chassis
dm-serif-public

## Visual Specification
### 1. Color Specification
- **Primary hue**: 62° golden-amber. It sits inside the 40–80° mandate and reads as trophy/scoreboard gold — the register of Doug's own gold-standard 2026-09-01 flood — while landing far (82°+) from the previous build's 152° green.
- **Neutral palette** (warm charcoal, tinted toward gold): 50 `#F6F2E9`, 100 `#E7E1D0`, 200 `#CDC5AF`, 300 `#A79E84`, 400 `#7E765E`, 500 `#5A5341`, 600 `#403A2C`, 700 `#2C271D`, 800 `#1C1812`, 900 `#100D08`.
- **Accent color** (gold): light `#F0D287`, default `#E9BE55`, dark `#7A5817`, glow `#F7E7BC`.
- **Secondary accent**: none. One saturated hue carries the night.
- **Background**: page bg `#100D08`, card/surface `#2C271D`, band/bgAlt `#1C1812`, deep scoreboard field `#2E220B`.
- **Text colors**: primary `#F6F2E9`, secondary `#CDC5AF`, muted `#A79E84`.

### 2. Typography
- **Hero phrase rendering**: The poster object is the figure `8–7`, set in the `display` face (DM Serif Display) at the `hero` step, high-contrast didone numerals glowing gold (`accent`) on the dark void. The hero phrase `Tigers, by one.` is the page's one h1, set one step down at `3xl`, small-caps, flush right beneath the figure. The deck `One run stood up.` sits at `lg` in `textMuted`.
- **Type treatment**: `hero` for the score; `3xl` for the h1 phrase; `xl`/`lg` for section heads and the deck; `base` (Public Sans) at 1.5–1.6 leading, capped 62–68ch, for ledger and body; `sm`/`xs` for labels and metadata. Body face answers the didone with civic-neutral structure; set at genuine reading size so the pairing reads as chosen high/low contrast, not a headline pasted onto default text. Small labels get 2× the space above as below.

### 3. Layout Specification
- **Composition**: masonry / diagonal / right-weighted / full-bleed / dense / syncopated / footer-only / balanced / hero-only / figure. The score owns the field at full bleed pinned right; the reading path cuts diagonally from the bottom-left signal ledger up to the top-right number, so the eye resolves on the win. It serves "Tigers, by one" by making the one-run margin the literal largest object.
- **CSS grid/flex**: hero fold is `display: grid; grid-template-columns: 1fr 1.4fr; grid-template-rows: auto 1fr auto` with the figure spanning the right two-thirds; signal zone below is `display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); grid-auto-flow: dense` for the masonry cells.
- **Major dimensions**: hero fold `min-height: 92vh`; `max-width: none` with `padding: 88px 6vw`; signal cells vary 140–260px tall for the ragged masonry edge; section spacing on a 8px base rhythm.
- **Nav placement**: footer band only, full width, ~128px tall at 1440. The stacked mono mark lives top-left of the hero field.
- **Hero phrase grid zone**: the figure occupies rows 1–3, right two-thirds (cols 5–12 of a 12-track read), at `clamp(96px, 12vw, 160px)`; the h1 phrase and deck sit rows 2–3 flush right beneath it.
- **Home callout slot**: on `/`, `<SiteCallout />` sits below the signals ledger and above the footer nav band, full width of the dark field. I place it and do not style or write it.

### 4. Component Character
- **Border radius**: cards 4px (`md`), tags 2px (`sm`), no pills — a scoreboard is sharp.
- **Border treatment**: hairline `border` (`#2C271D`) between cells; `borderStrong` (`#5A5341`) and `fieldBorder` gold rules on the footer band.
- **Shadow**: none. Depth comes from surface lightness on the void, not shadow.
- **Density**: dense, information-forward, small gutters.
- **Interactive states**: `_hover` lifts link color from `textMuted` to `accent`; ledger cells brighten border to `borderStrong`.

### 5. Signal Integration
- **Where signal elements live**: a masonry ledger below the hero fold, each fact one cell.
- **Sports scores**: the Tigers 8–7 IS the hero figure, gold didone at poster scale. Presidents Cup (in progress, leaders +3 / +7) sits as one ledger cell, tabular figures in `text`, label in `textFaint`.
- **Quote**: not used as hero; the Tolle line is omitted rather than shrunk into furniture (self-help register, not Doug's).
- **Holiday elements**: none today.
- **Music**: My Morning Jacket and Radiohead as a small "In rotation" cell, plainly, taste not event, never beside the score as if it happened today.
- **Other signals**: full moon (99.7%) as one cell with the phase; market SPY +0.54% up, tabular; weather clear 54°F, NW 9.8mph, Aldie VA; sunrise/sunset 07:08 / 18:53. All flat, all in the ledger.

## Self-Check
1. Hero quotability: Yes — "Tigers, by one." is a tight, screenshot-able line for a fan, anchored by the 8–7 figure.
2. Because-of chain: Yes — score → figure object → full-bleed scoreboard → didone gold on dark void → dot-matrix field, all traceable.
3. Render feasibility: Yes — `8–7` at `clamp(96px,12vw,160px)` caps at DM Serif Display's 160px hero ceiling, no overflow at 1440.
4. Canvas floor feasible: Yes — dense masonry ledger plus a full-bleed figure clears 80%.
5. Phone: Yes — hero-only fold shows the gold `8–7` at `hero` step (96px min) with its two-word caption, no word cut.

## Rationale
The phrase is a signal stated plainly: Detroit won 8–7, a one-run game, and the Tigers are one of the few things Doug watches. I passed the Tolle quote because it is abstract self-help, the exact register the owner has rejected in other borrowed quotes, and "a score is a score" is his actual voice. Because the win is a number and a margin, the object on the page is the figure, not another eyebrow-statement-deck poster: `8–7` is the largest thing on the page and "Tigers, by one." is its caption.

The composition follows from the figure. A full-bleed scoreboard fold with the number pinned right, a diagonal reading path resolving on the win, and a dense masonry ledger of the day's other facts below — that is the date-derived tuple, kept because it genuinely reads as a scoreboard rather than swapped off a shortlist. The chassis is dm-serif-public, one of the three faces that has never shipped, chosen over the condensed-caps reflex: a high-contrast didone renders `8–7` as an elegant headline, not a sports-poster cliché, which fits a quiet one-run win held under a near-full moon on a clear cool night. It loads a single display weight, so the type is set small-caps, roman, regular, flush right — three moves off the recent mixed/left/centred template.

The palette is a dark-void, fresh against the recent drench, light-ground and split-field run, and it puts scoreboard gold (62°, inside the 40–80° mandate and Doug's own trophy-gold register) floating on a warm near-black. The dot-matrix ground material reinforces the scoreboard read without painting the color floor. The mono mark sits single-color cream on the void, top-left of the hero inside the first fold at both widths, the nav deferred to a box-score footer where the Presidents Cup, the full moon, the market, the weather and the music rotation all sit subordinate to the number that won the night.
