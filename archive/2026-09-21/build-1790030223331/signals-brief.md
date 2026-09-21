# Signals Brief — 2026-09-21

## Hero Copy
Twenty-six under wins the Biltmore.

## Hero Rationale
The Biltmore Championship went final Monday with Jacob Bridgeman at −26, two clear of Ben James, so today's loudest owner-true fact is a golf score, and Doug follows golf with four holes in one to his name. I composed the leaderboard fact into a headline the way a Tigers rout became "ten to one," a number a golf fan would screenshot. I passed over `signals.quote` (Mark Manson, "The less you talk about your shame, the more of it you have.") because a shame-and-vulnerability line is nowhere near Doug's register about design, golf or Detroit, and the ratings have twice graded down borrowed quotes that are "not me." I also moved off yesterday's `content-lifted` lane, which the mandate flags as a fault two days running. Owner's voice: a score is a score, and this is the golf story of the day stated plainly, the way he'd say the Tigers won 11–7.

## Archetype
a scoreboard made a fall poster

## Composition
columns: irregular-twelve
axis: radial
symmetry: right-weighted
hero_zone: full-bleed
density: sparse
rhythm: accelerating
shell_posture: footer-only
field_ratio: drenched
collapse: reorder
hero_object: figure

## Composition Rationale
I moved `axis` off the mandate's `diagonal` suggestion to `radial` because the phrase is "two clear": the winner is a focal point and the field falls away from him by distance, so a radial layout literally renders the margin of victory, which a diagonal reading path would not. Everything else follows the date-derived tuple, but that tuple already diverges from the last figure day (09-16) on five axes — sparse vs dense, accelerating vs even, drenched vs field-dominant, reorder vs stack, plus radial — so it is not a template repeat. The `reorder` collapse pulls the leaderboard ahead of the work index at 360 so the golf story completes before the portfolio index begins.

## Mobile
carrier: the italic `−26` at poster scale and its small-caps caption carry the win; the radial collapses to a centred vertical stack.
first_fold: the `−26` figure and the caption "Twenty-six under wins the Biltmore."
order: mark, figure, caption (hero phrase), leaderboard, work index, footer data strip
hero_step_360: hero
nav_360: header collapses to the cream mark top-left at ~40px in the first fold; the nav sentence stays in the footer strip.

## Chassis
anybody-franklin

## Visual Specification
**1. Color Specification**

- **Primary hue**: 18° (terracotta/brick rust). Chosen because a decisive win at a grand mountain estate in late-September fall wants a saturated single warm hue, and 18° is the brick edge of the 15–40° mandate, pushed as far from the recent 28° orange as the target range allows.
- **Neutral palette (warm sand, tinted toward rust)**: 50 #FBEEE2 · 100 #F3DCC9 · 200 #E4C0A6 · 300 #CFA283 · 400 #B08063 · 500 #8E6047 · 600 #6E4632 · 700 #522F20 · 800 #3A1F14 · 900 #24120A
- **Accent (marigold)**: light #F7BE6A · default #F0A03C · dark #C06A1E · glow #FCE4BE
- **Secondary accent**: none.
- **Background**: page bg #7E3218 (terracotta drench) · card/surface #97401F · footer band bgAlt #632512 · figure knockout field #481A0D
- **Text colors**: primary #FBEEE2 · secondary #F7D9C7 · muted/faint #ECB093

**2. Typography (anybody-franklin)**

- **Hero object rendering**: The figure `−26` is the marquee object, set in the `display` face (Anybody) at `hero_scale` clamp(96px, 20vw, 160px), italic, heavy, cream (`fieldInk`) solid over a ghosted chase. The hero phrase "Twenty-six under wins the Biltmore." is its caption at `3xl`, small-caps, centred, `textMuted`. Deck "Jacob Bridgeman, two clear of the field at Asheville." at `lg`, `textMuted`.
- **Type treatment**: ramp steps as textStyles — figure at `hero`; caption/h1 at `3xl`; deck at `lg`; leaderboard scores at `4xl`/`3xl` tabular; section heads at `md`; body at `base` capped 62–68ch; micro labels at `xs` small-caps with 0.09em tracking. Spend the middle: caption 3xl and deck lg sit between the 160px figure and the base body so no page jumps straight from marquee to 16px.

**3. Layout Specification**

- **Composition**: irregular-twelve / radial / right-weighted / full-bleed / sparse / accelerating / footer-only / drenched / reorder / figure. The radial serves the phrase directly: the winner sits at the focal point and the chasing field falls away from it by distance, so the layout is a map of "two clear."
- **Grid/flex**: `display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: auto;` figure occupies rows 1–7 / cols 5–12 (focal point offset right); the ghosted chase spans the full field beneath at low alpha; leaderboard rows step in at cols 2–9 with intervals shrinking down the page (accelerating).
- **Major dimensions**: hero/figure field `min-height: 92vh`; no sidebar; `max-width: none` with `padding: 88px 6vw`; section spacing steps 120px → 72px → 40px descending.
- **Nav placement**: deferred to the footer data strip (footer-only posture); no top bar.
- **Hero phrase grid zone**: figure rows 1–6, cols 5–12, ~clamp(96px,20vw,160px); caption rows 6–7, cols 5–11, ~3xl.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the work index and above the footer data strip, full column width. I place it there and do not design or write it.

**4. Component Character**

- **Border radius**: cards 4px, buttons 2px, tags 2px (sharp, poster/scoreboard).
- **Border treatment**: hairline `border` (rust.500) for leaderboard row rules; `borderStrong` for the one rule above the footer.
- **Shadow**: none. Flat poster; depth from value, not shadow.
- **Density**: spacious/sparse up top, tightening into the leaderboard.
- **Interactive states**: `_hover` shifts links to `accent` marigold with a 1px underline; scores brighten to `accentAlt`.

**5. Signal Integration**

- **Golf (lead)**: `−26` is the poster figure; the chase (James −24, Castillo −23, Shipley −23, Poston −21) renders twice — oversized and faint as `type-as-texture` ground behind the figure, and as clean tabular accelerating rows below, under-par scores in marigold `accent`.
- **Sports scores**: Lions loss 31–41 stated flat in the footer data strip, tabular, no color.
- **Quote**: passed over (Manson, off Doug's register); not shown.
- **Market**: SPY 773.51, up 1.55%, in the footer strip.
- **Weather**: Aldie, patchy rain, 68°F, footer strip.
- **Moon**: waxing gibbous, 83%, footer strip.
- **Music**: "In rotation: Guided by Voices, Tobin Sprout, My Morning Jacket" as taste in the footer, never as an event beside a score.
- **Design links** (HN, awwwards, sidebar): carried by the standing Sidebar component, not the hero.

## Self-Check
1. Hero quotability: Yes — "Twenty-six under wins the Biltmore." is a golf fan's screenshot line, quotable alone.
2. Because-of chain: Yes — figure object → radial distance-from-winner → sporty wide grotesk → rust drench → footer-deferred poster, all traceable to the winning score.
3. Render feasibility: Yes — a 3-glyph figure at clamp cap 160px on a full-bleed field cannot overflow at 1440.
4. Canvas floor feasible: Yes — the figure, ghosted chase, accelerating leaderboard and footer fill ~70% without crowding a sparse poster.
5. Phone: Yes — `−26` is three characters at `hero` step inside the first fold at 360 with no word to cut.

## Rationale
The phrase is a golf score stated plainly, "Twenty-six under wins the Biltmore," because the Biltmore Championship went final Monday with Bridgeman at −26 two clear, and golf is one of the few things the owner cares about that the day handed over as a fact. Manson's shame quote couldn't carry a builder's portfolio and isn't his register, and yesterday already spent the content-lifted lane, so the honest move is to compose the leaderboard into a headline the way a Tigers rout became "ten to one." Because the win is a number and a margin, the object is a figure, not another eyebrow-statement-deck poster: `−26` is the largest thing on the page and the phrase is its caption.

Composition follows the margin. A radial axis puts the winner at a focal point with the chasing field falling away by distance, which is literally what "two clear" means; the chase renders twice, once as a ghosted `type-as-texture` ground and once as accelerating tabular rows, so the field the winner beat is visible behind him. anybody-franklin carries it: a wide, squarish, sporty grotesk with true italics, so the score leans forward in heavy italic like a surge, and it avoids both the condensed-caps default and the reflex-reject serifs while staying off the three recently-worn faces. Libre Franklin answers it for the leaderboard and footer, sharing the grotesk skeleton the standing complaint demands.

The palette amplifies a decisive win at a grand mountain estate in fall: a single terracotta-rust drench at 18°, the brick edge of the 15–40° mandate, cream reversed out of it, one marigold spark reserved for the under-par figures. Drench is the gold-standard formula and is fresh against the recent dark-void, light-ground and split-field run; a rust drench in fall reads as a printed sports poster, which the grain material and sharp radii reinforce. On a drench the mono mark is the honest answer, so it sits top-left of the hero in cream at 44px, ~9:1 clear, fixing the repeated "mark sank into the ground" complaint, with the nav deferred to a single running sentence in the footer data strip where the Lions loss, the market, the weather, the moon and the music rotation all sit subordinate to the number that won the day.
