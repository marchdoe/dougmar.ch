# Signals Brief — 2026-11-16

## Hero Copy
Lions by 25

## Hero Rationale
Detroit beat somebody 35-10 on Sunday, a 25-point blowout, and it's the one signal in today's feed that is unambiguously Doug's: a Lions fan stating a margin. The D.H. Lawrence quote is a stranger's line about women and luxuries and fails the "would Doug say this" test outright, so it stays off the page. I composed the margin ("by 25") from the 35-10 score because the margin is how a fan brags, and I can't invent the opponent I wasn't given. Same lane as yesterday (composed), justified because a Lions score framed as a margin is the strongest Doug-voice material in the feed and no quote or content line comes close.
Owner's voice: I'm a Lions fan and a 25-point win is a 25-point win, I'll say the margin out loud.

## Archetype
a gold scoreboard poster with a bronze signal rail

## Composition
columns: three
axis: horizontal
symmetry: left-weighted
hero_zone: upper-left
density: sparse
rhythm: accelerating
shell_posture: marginal
field_ratio: field-dominant
collapse: rail-to-band
hero_object: word

## Composition Rationale
I moved shell_posture off the starting `none` to `marginal` so the day's signals (golf, weather, market, music) and the mark have a declared bronze-rail home, and because the starting `collapse: rail-to-band` is only valid with a rail — the one move makes the starting collapse coherent instead of contradictory. Everything else stays on the starting tuple: three columns, horizontal strip, mass and the LIONS poster word gathered upper-left, sparse air up top accelerating into the index. field-dominant is kept literally: the saturated gold plane leads and type is placed into it.

## Mobile
carrier: The gold field with the bronze LIONS carries it; the right rail's mark and signals drop into a full-width bronze band directly beneath the hero.
first_fold: The hero phrase "Lions by 25": LIONS at 5xl on the gold field with "by 25" beneath it, 25 in burnt orange, and the mark top-right in the bronze header stub.
order: hero (Lions by 25), signals band (nav, golf, weather, market, music), selected work, site callout, footer line
hero_step_360: 5xl
nav_360: The right rail becomes a full-width bronze band below the hero holding the mark, the nav list and the day's facts.

## Chassis
unbounded-figtree

## Visual Specification
**1. Color Specification**

- **Primary hue**: 50° (scoreboard gold). A sunny 40°F Detroit Sunday and a three-score win both want committed warm light, not a pale wash. Honors the 40–80° mandate.
- **Neutral palette** (bronze-tinted, warm): 50 `#FBF7EF`, 100 `#F0E8DA`, 200 `#E0D4BF`, 300 `#C9B89B`, 400 `#A89572`, 500 `#827055`, 600 `#5E4F3A`, 700 `#423728`, 800 `#2A2217`, 900 `#1A140C`.
- **Accent color** (burnt orange): light `#C4560F`, default `#A8480C`, dark `#8A3A09`, glow `#FBA862`.
- **Secondary accent**: the burnt orange above IS the single turned-on accent (used for the margin figure and the golf −14); no third hue.
- **Background**: page bg (day) `#F3B733` gold; card/surface `#F8CB5E`; rail/field `#221808` bronze. Dark scheme: page bg `#1A1308`, flooded field `#E8A61C`.
- **Text colors**: primary `#241A0A` bronze, secondary `#4A3A22`, muted/faint `#574630` (day); on the bronze rail, ink `#F3D98A`, muted `#C9A24E`.

**2. Typography** (chassis unbounded-figtree)

- **Hero phrase rendering**: `LIONS` set as the poster word in the `display` face (Unbounded) at the `hero` step, a fluid clamp, caps, heavy, left-aligned, bronze (`text`) on the gold field. "by 25" sits directly beneath as the deck at `2xl`, with `25` in the burnt-orange accent (`accent`, clears 3:1 on gold). The whole line "Lions by 25" is the single h1.
- **Type treatment**: hero = `hero` step; "by 25" deck = `2xl`; selected-work titles = `3xl`; section heads / standfirst = `lede`; rail signals and nav = `base`; metadata and years = `sm`. Spend the middle: the `2xl` deck and `lede` section heads keep the page off a two-size cliff. Body held at 60–68ch, leading from the ramp.

**3. Layout Specification**

- **Composition**: columns `three`, axis `horizontal`, symmetry `left-weighted`, hero_zone `upper-left`, density `sparse`, rhythm `accelerating`, shell_posture `marginal`, field_ratio `field-dominant`, collapse `rail-to-band`, hero_object `word`. Mass gathers left (LIONS stamped on the gold field, upper-left), the bronze signal rail holds the right margin; the page reads as a strip of gold with a dark spine down its right edge.
- **CSS structure**: `display: grid; grid-template-columns: minmax(0, 1fr) 320px` at 1440; the right 320px is the bronze rail. Below the hero, the work index is `display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(24px, 3vw, 48px)` inside the gold field.
- **Major dimensions**: hero gold field `min-height: 82vh`; right rail `width: 320px`, full page height, bronze; max content width `none`, side padding `96px 6vw` on the gold field; section padding `clamp(48px, 6vw, 112px)`; intervals shrink descending (accelerating).
- **Nav placement**: inside the right bronze rail as a vertical `list` index (work / about / contact), one hairline rule per row, upper case, 44px tap rows. No top bar.
- **Hero phrase grid zone**: rows 1–2, left column, upper-left quadrant of the gold field; LIONS target ~140px cap at 1440, "by 25" ~44px beneath.
- **Home callout slot**: `<SiteCallout />` sits below the Selected Work index and above the footer line, between the work index and the rail-foot identity, full width of the gold field. Not designed here.

**4. Component Character**

- **Border radius**: cards 2px, buttons 4px, tags 2px. Near-square, stamped.
- **Border treatment**: bordered with `border` hairlines inside the gold field, `fieldBorder` inside the bronze rail, `borderStrong` for the section break above the work index.
- **Shadow**: none. Depth comes from the bronze-vs-gold value split, not shadow.
- **Density**: spacious up top (sparse hero), tightening toward the index.
- **Interactive states**: nav/links underline on `_hover` and shift to `accent`; work rows raise to `surface` on hover.

**5. Signal Integration**

- **Where signals live**: the right bronze rail, top to bottom: mark, nav list, then the day's facts.
- **Sports scores**: the hero IS the Lions result; the golf leaderboard sits in the rail as the top five of the Austin Championship with tabular figures, Trace Crowe −14 lit in `accent`, the three tied at −13 beneath in `fieldInkMuted`.
- **Quote**: omitted; the D.H. Lawrence line is not Doug's register and is not the hero.
- **Holiday**: none today.
- **Music**: one quiet rail footnote, "In rotation: The War on Drugs, Tobin Sprout," in `fieldInkMuted`, framed as taste, not an event.
- **Other**: weather "Aldie · Sunny · 40°F" and market "SPY 754.37 · −0.36%" as rail lines (market down in muted, a small move, no alarm); "First quarter moon" as a one-line rail note.

## Self-Check
1. Hero quotability: Yes — "Lions by 25" is the line a fan says out loud, quotable alone.
2. Because-of chain: Yes — triumph margin → gold duotone field-dominant → expanded blocky caps (unbounded) → bronze rail for the facts.
3. Render feasibility: Yes — "LIONS" is five expanded caps, ~750px at 140px cap, fits the gold field under 1270px content.
4. Canvas floor feasible: Yes — gold field + full-height bronze rail + three-column index fill ≥72%.
5. Phone: Yes — "LIONS" is one short word, lands at 5xl (72px) inside the first 640px without cutting.

## Rationale
The phrase is "Lions by 25," a fan stating a 25-point margin from a 35-10 Sunday, the one line in today's feed that is unambiguously Doug's. A margin brag is a scoreboard gesture, so the composition is a scoreboard: the gold field leads (field-dominant), the win is stamped into it, and the facts live down a bronze spine on the right. The hero object is a single word, LIONS, at poster scale with "by 25" as its deck, the margin figure lit in burnt orange as the one accent the page turns on.

The chassis is unbounded-figtree because a blowout wants a wide, blocky, confident caps word, and because the brief warns against reaching for condensed caps every time a phrase wants scale. Unbounded's expanded geometric letterforms stamp LIONS like a stencil on a scoreboard; Figtree answers it as a geometric body that shares its skeleton. It is off the recent chassis list (last used 11-06) and gives a non-condensed route to marquee scale.

The palette is a warm duotone: scoreboard gold at 50° carrying the dominant field, espresso bronze carrying the signal rail, burnt orange as the single accent for the margin and the golf −14. Duotone keeps two committed hues working with no neutral void, which reads as triumph and as a bright 40°F sunny morning at once, and it is not on the recent-avoid formula list. The layout seats LIONS upper-left on the gold, the bronze rail holds mark, a vertical nav index, and the day's facts; at 360 that rail folds into a full-width bronze band directly under the hero, so the phone keeps the same two-material logic. Nothing moves on load: a scoreboard arrives already lit.
