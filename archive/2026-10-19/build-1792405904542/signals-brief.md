# Signals Brief — 2026-10-19

## Hero Copy
What ships should look like what was designed.

## Hero Rationale
This is Doug's thesis stated plainly, lifted from his own voice file ("What ships should look like what was designed") and never yet worn on the page. It carries the day because today's signals are quiet, off-season Detroit, a scheduled tournament, a down market, a cold clear morning, so the work's own argument is the loudest thing available, and the design links in the sidebar ("Design owns coherence," "Someone behind the software") happen to circle the same idea from the outside. A quote from Plato about speech was available, but a line about Doug's actual job beats a borrowed aphorism on a slow news day. Lane is content-lifted, not a repeat of yesterday's composed.
Owner's voice: he says this constantly, it is literally how he describes closing the gap between design and build.

## Archetype
a type specimen read as a spec sheet, one thesis on warm paper with a diagonal marigold seam

## Composition
columns: three
axis: diagonal
symmetry: symmetric
hero_zone: center
density: dense
rhythm: even
shell_posture: folded-into-hero
field_ratio: balanced
collapse: stack
hero_object: statement

## Composition Rationale
The phrase is about two things matching, so the page is one material (warm paper) crossed by a single diagonal marigold seam where the designed register meets the shipped register; the seam gives me the discouraged-but-earned `diagonal` axis and keeps `symmetric` honest because the centred statement balances across it. I moved `field_ratio` off its only non-discouraged value (`drenched`) onto the avoided `balanced`, because drenching the field would bury the precision read and would also collide with 2026-10-15's drenched diagonal; a paper-and-ink page with one committed amber plane renders the phrase as a spec that was honored, not a poster that shouts. I kept `hero_object` on `statement` rather than the suggested `word` because the sentence is quotable whole and loses its claim if broken to one word.

## Mobile
carrier: The diagonal seam flattens to a horizontal marigold rule; the centred statement stacks full-width on paper with the deck and work index following in one column beneath it.
first_fold: The hero statement "What ships should look like what was designed" set at 2xl, with the mark above it.
order: mark + sentence nav, hero statement, deck, work index, SiteCallout, signal plinth
hero_step_360: 2xl
nav_360: Mark stays top-left at 44px; the work/about/contact sentence wraps to one lowercase line directly under the mark.

## Chassis
hanken-solo

## Visual Specification
### 1. Color Specification
- **Primary hue**: 52° (marigold-gold). Warm, confident, legible as both a bright field and a deep ink. Chosen inside the 40-80° mandate but nudged past the recent 44/48 saffron-gold cluster so the day is warm without repeating last week's gold.
- **Neutral palette** (warm, tinted toward amber): 50 `#FAF7F0`, 100 `#F1EBDC`, 200 `#E3DAC6`, 300 `#CFC3A6`, 400 `#AB9E7F`, 500 `#766B50`, 600 `#5B523E`, 700 `#403928`, 800 `#262113`, 900 `#16130A`
- **Accent color** (marigold ramp): light `#EFCE4A` (bright field), default `#74590A` (text-safe deep amber for links and marks), dark `#4E3C07`, glow `#BE9510`
- **Secondary accent**: none. One hue, committed.
- **Background**: page bg `#FAF7F0`, card/surface `#FFFDF6`, second ground (SiteCallout band) `#F1EBDC`, marigold field `#EFCE4A`
- **Text colors**: primary `#262113`, secondary `#5B523E`, muted/faint `#766B50`; ink on the marigold field `#262113`, secondary on field `#5A4708`

### 2. Typography
- **Hero phrase rendering**: `display` (Hanken Grotesk) at the `hero` ramp step, set lowercase and heavy, centred across three lines ("what ships should / look like what / was designed"). One family carries display and body, which is the point: design and engineering as one voice, one skeleton. The statement is the single h1 and the largest object on the page.
- **Type treatment**: hero at the `hero` step (clamp near 110px at 1440, compressing cleanly at 360). Deck/standfirst at `lede`. Section heads and project titles at `xl`/`2xl` so the middle of the scale is spent. Body at `base`, held to 62-68ch at 1.55 leading. Metadata and signal labels at `xs`. Mid-register element present on every route (standfirst under the hero, project titles at `2xl`), so no page jumps straight from marquee to body.

### 3. Layout Specification
- **Composition**: three / diagonal / symmetric / center / dense / even / folded-into-hero / balanced / stack / statement. A centred thesis crosses a diagonal marigold seam that divides a "designed" register above from a "shipped" register below; the two sides carry the same type and the same work, so the seam reads as a clean match, which is the phrase made visible.
- **CSS grid/flex structure**: `display: grid; grid-template-rows: auto 1fr auto;` the hero zone centres the statement over a diagonal field (`clip-path` marigold band at roughly -8°). The work index below is `grid-template-columns: repeat(3, 1fr)` with hairline rules.
- **Major dimensions**:
  - Hero zone: `min-height: 82vh`, statement centred.
  - Max content width: `max-width: none`; side padding `padding: 72px 6vw`.
  - Work index: three columns, `gap: 0` with vertical hairlines; rows ruled.
  - Section padding: 96px vertical between hero, index, and plinth.
- **Nav placement**: folded into the hero. The original-color mark + wordmark (horizontal-md) sits top-left of the paper field inside the first fold. Work, about and contact run as one lowercase sentence along the hero's lower-left edge, marigold links on paper.
- **Hero phrase grid zone**: rows 1, centred horizontally, occupying roughly the middle 60% of the hero height, statement at ~110px at 1440.
- **Home callout slot**: `<SiteCallout />` sits below the work index and above the signal plinth/footer, full width, in today's bgAlt `#F1EBDC`. Placed, not styled.

### 4. Component Character
- **Border radius**: none `0`, sm `2px`, md `4px`, lg `8px`, full `9999px`. Cards and the work index use `0` (square); the mark keeps its own geometry. This answers the standing rounded-corner complaint directly.
- **Border treatment**: bordered with hairlines. `border` `#E3DAC6` for row rules, `borderStrong` `#AB9E7F` for the index head and the plinth rule. `fieldBorder` `#A07E10` inside the marigold seam.
- **Shadow**: none. Depth comes from value, not shadow.
- **Density**: dense in the lower two-thirds (three-column index + signal plinth), open around the centred statement.
- **Interactive states**: links shift from accent `#74590A` to glow `#BE9510` with a 1px underline on hover; index rows warm toward surface `#FFFDF6` on hover.

### 5. Signal Integration
- **Where signal elements live**: a signal plinth band at the foot (below SiteCallout), a tabular block set like a specimen footer.
- **Sports**: Detroit teams are all off-season; stated once, quietly, as "Lions, Tigers, Pistons, Red Wings, off-season" in the plinth, no score furniture.
- **Market**: SPY `763.25 ▼1.1%` in tabular figures, the down-tick in deep amber, not a second hue.
- **Weather**: kicker over the hero, "Aldie, Virginia. 40°F, clear."
- **Moon**: "First quarter, 65% lit." in the plinth.
- **Golf**: "Butterfield Bermuda Championship, scheduled." in the plinth.
- **Music** (rotation, taste not event): "On rotation: Tobin Sprout, Radiohead." in the plinth, labeled as rotation so it never sits as a same-day event.
- **Quote**: Plato's "Wise men speak because they have something to say; fools because they have to say something." set small and attributed in the plinth as an epigraph, visible author, not the hero.

## Self-Check
1. Hero quotability: Yes — it is a complete, screenshot-worthy claim about the work, not a label.
2. Because-of chain: Yes — the match concept drives the diagonal seam, the single-family chassis, the one committed hue, and the centred statement.
3. Render feasibility: Yes — Hanken at ~110px over three centred lines fits 1440 with 6vw padding, well under the 160px chassis ceiling.
4. Canvas floor feasible: Yes — the three-column index plus plinth plus hero fills 80% of 1440×900.
5. Phone: Yes — at `2xl` the eight words wrap over five short lines inside the first 640px with the mark above.

## Rationale
The phrase is Doug's one-line thesis, "What ships should look like what was designed," so every other decision serves the idea of two things matching. The composition makes the match literal: one material (warm paper) divided by a single diagonal marigold seam, the designed register above and the shipped register below, carrying the same type and the same cataloged work, so the seam reads as a clean join rather than a contrast. The statement sits centred, crossing the seam, the one h1 and the largest object on the page.

The chassis is the deepest part of the chain. Hanken Grotesk alone, one humanist family at three weights, sets display and body from the same skeleton, which is the phrase's claim in typographic form: design and engineering as one voice, not two teams passing files. It is also one of the catalog's never-shipped chassis, and it directly answers the standing complaint that display and body must share a skeleton. Set lowercase, heavy, centred, it is confident without shouting, Swiss-adjacent restraint rather than another condensed-caps poster.

The palette commits to a single marigold at 52°, inside the warm mandate but clear of last week's 44 and 48 golds. Light-ground keeps the amber a precise seam and a saturated field plane rather than one more drench, which lets the original green-and-blue mark finally sit on paper where it belongs. Square corners, hairline rules, tabular signal figures and a type-specimen footer treat the furniture as design material, and the entrance settles the statement into place, arriving composed, which is the quiet motion a precision claim wants.
