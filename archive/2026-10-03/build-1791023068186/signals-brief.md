# Signals Brief — 2026-10-03

## Hero Copy
Four holes in one. The scorecard is the first experiment.

## Hero Rationale
This is Doug's own line, verbatim from his voice file, and it ties straight to today's live golf signal (the Bank of Utah Championship in progress) without pretending his own teams played. It carries a real, rare number (four aces) and it bridges his two subjects: golf and the small products he builds, where tracking a scorecard became his first experiment. I passed over today's `signals.quote` (the Bhagavad Gita on lust, anger and greed as gates to self-destructive hell) because it is a dark religious moral in nobody's register but a stranger's, and the taste memory is explicit that a quote that isn't Doug's is "a poster of somebody else."
Owner's voice: Doug says this because the aces are a real scorecard he keeps, and the scorecard is literally where his product-building started.

## Archetype
a scoreboard numeral made a fall poster

## Composition
columns: single
axis: radial
symmetry: symmetric
hero_zone: center
density: sparse
rhythm: accelerating
shell_posture: standard
field_ratio: type-dominant
collapse: stack
hero_object: figure

## Composition Rationale
A hole-in-one is a ball dropped into a circle, so a radial axis orbiting a single centered anchor is the honest structure, and the anchor is the scorecard numeral "4". I invoke the Max-Risk License to land hero_zone on `center`, the value the Composition Mandate soft-forbade today: the radial axis has no meaning without a center anchor, and placing the figure upper-left would break the orbit the phrase demands. Symmetry moves from mirrored to symmetric (a single centered numeral is true-symmetric, not a reflected pair), and the object moves from word to figure so the number itself gets marquee scale.

## Mobile
carrier: The giant amber "4" stacks above its caption and carries the page; the radial cluster becomes a single centered column of leaderboard rows and signal lines.
first_fold: The figure "4" and the hero phrase "four holes in one. the scorecard is the first experiment."
order: header (centered mark + nav), hero figure + phrase, golf leaderboard, selected work, signals band, site callout, footer
hero_step_360: hero
nav_360: Mark centered at the top at ~40px, the three lowercase labels centered in one row beneath it.

## Chassis
alfa-rubik

## Visual Specification
### 1. Color Specification
- **Primary hue**: 36° (burnt amber). Autumnal, celebratory, warm. It is inside the mandate's 15–40° target and sits 28° off the nearest recent primary (oxblood 8°); it reads as gold-amber, not red, so the perceptual distance is wider than the angle suggests. Chosen because a hole-in-one is a golden moment and October golf wants a warm field, not a cool one.
- **Neutral palette** (warm, tinted toward amber): 50 `#FAF6EF`, 100 `#F1EADD`, 200 `#E3D8C6`, 300 `#CDBDA2`, 400 `#9D8E76`, 500 `#6F624C`, 600 `#554A38`, 700 `#3E3628`, 800 `#2A251A`, 900 `#1A1710`
- **Accent color**: light `#E8B873`, default `#D4862A`, dark `#B86D1C`, glow `#F0D0A0`
- **Secondary accent**: none. One amber carries the page.
- **Background**: page bg `#FAF6EF`, card/surface `#FEFBF5`, second ground (bgAlt / callout band) `#F1EADD`
- **Text colors**: primary `#1A1710`, secondary `#554A38`, muted/faint `#6F624C`

### 2. Typography
- **Hero figure rendering**: the numeral `4` is the marquee, set in `display` (Alfa Slab One) at the `hero` clamp, hero_scale `clamp(120px, 11vw, 158px)`, centered as the radial anchor. The hero phrase (the page's one h1) is its caption directly beneath, set at `2xl` so the figure stays clearly dominant (roughly 4:1).
- **Type treatment**: steps as textStyle tokens — figure `hero`; phrase/caption `2xl`; section heads `xl`; standfirst/mid-register `lg` (so no page jumps straight from marquee to body); body `base` (Rubik, measure held at 62–68ch, leading 1.5); leaderboard rows and signal lines `sm`; micro labels `xs` (never below 12px). Phrase and all display set lowercase for the warm, rounded Alfa+Rubik register; body sentence case.

### 3. Layout Specification
- **Composition**: single / radial / symmetric / center / sparse / accelerating / standard / type-dominant / stack / figure. Content orbits one anchor — the amber `4` — so the composition is literally a radial field around the figure, which is exactly what a hole-in-one (a ball into a circle) wants, and the symmetry is true-centered rather than a mirrored pair.
- **CSS grid/flex structure**: `display: grid; grid-template-rows: auto minmax(70vh, auto) auto auto auto; place-items: center;` hero block is a centered flex column (figure over caption); the leaderboard and signals arrange as a centered radial cluster (`display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); justify-items: center`) orbiting below.
- **Major dimensions**:
  - Hero/figure area: `min-height: 72vh`
  - No sidebar.
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 112px)`. Body prose blocks inset to ~64ch inside the centered field.
  - Section padding: vertical rhythm on the chassis base unit; intervals shrink descending (accelerating): hero 128px below, work band 96px, signals 64px, footer 48px.
- **Nav placement**: top-bar, 88px tall, symmetric and centered — circular mark centered at top, three lowercase nav labels centered in a row beneath it, one amber hairline under the bar. This deliberately is not the rejected wordmark-left/links-right pattern.
- **Hero phrase grid zone**: row 2, centered; the figure occupies the vertical center of the viewport, the phrase caption sits in the lower half of that same row, both centered on the page's vertical axis (roughly columns 4–9 of a 12-grid at 1440).
- **Home callout slot**: on `/`, place `<SiteCallout />` below the selected-work band and below the signals band, directly above the footer. It is the only place that subject appears.

### 4. Component Character
- **Border radius**: cards/panels `4px` (md), tags `2px` (sm), the mark untouched, full `9999px` only for the mark's own geometry. Crisp, not rounded — honoring the standing header complaint.
- **Border treatment**: hairlines in `border` (#E3D8C6); section breaks and the nav rule in `borderStrong` (#9D8E76) and amber for the hero underline.
- **Shadow**: none. Depth comes from value, not shadow (light ground).
- **Density**: spacious / sparse. The field is mostly paper.
- **Interactive states**: nav and links shift to `accent` (#D4862A) on hover with a 1px amber underline that grows from left; leaderboard rows raise to `surface` on hover.

### 5. Signal Integration
- **Golf (hero-adjacent)**: the Bank of Utah Championship leaderboard sits in the radial cluster directly under the hero caption, five rows, tabular-nums in `display` small caps for position/score, names in body. Scores (`-17`, `-16`) in `accent`. This is the one signal the hero theme earns, so it gets prominence.
- **Sports scores**: Red Wings loss as one quiet line in the signals band — "Red Wings 0, (opp) 2" in body with the score tabular; no celebration, a loss stays flat.
- **Market**: "SPY 769.64, up 0.74%" one line, direction arrow in `accent`, tabular-nums.
- **Weather**: "Aldie, Virginia. Patchy rain, 59°F." one caption line, textMuted.
- **Quote**: not used as hero; the Gita line is omitted rather than shrunk into furniture, because it fights Doug's register.
- **Music**: a single caption, "on rotation: My Morning Jacket, Radiohead, The War on Drugs," in the colophon as taste, never beside the scores as an event.
- **Moon/air**: "Last quarter moon. Air quality good." one micro line in the colophon.

## Self-Check
1. Hero quotability: Yes — "Four holes in one. The scorecard is the first experiment." is a complete, screenshot-worthy line that carries a real number and a real idea.
2. Because-of chain: Yes — a hole-in-one is a ball into a circle, so radial/center; the figure "4" is a scorecard numeral, so a fatface slab (alfa-rubik) and a warm amber on fall paper; the figure anchors the grid at center.
3. Render feasibility: Yes — a single numeral at `clamp(120px,11vw,158px)` lands at ~158px at 1440 (under the 160 cap) with the phrase at 2xl beneath, no overflow.
4. Canvas floor feasible: Yes — the centered figure, caption, orbiting leaderboard and signal cluster fill ~70% of the 1440×900 field.
5. Phone: Yes — a single "4" at the `hero` clamp cannot cut a word and sits in the first 640px with the phrase beneath it.

## Rationale
The phrase is Doug's: four holes in one, and the scorecard became his first experiment. I passed over the day's Gita quote because a moral about lust, anger and greed is a stranger's voice, and the taste memory is blunt that a quote that isn't his reads as a poster of somebody else. Today's live golf tournament gives the line a reason to exist this morning without faking a Detroit win the Red Wings didn't get.

A hole-in-one is a ball into a circle, so the composition is radial around one anchor, and the anchor is the scorecard numeral itself: hero_object becomes `figure`, a single amber "4" at marquee scale with the phrase as its caption and the one h1. That decision pulls the chassis: a fatface slab, Alfa Slab One over Rubik (alfa-rubik), because a scorecard number wants weight and physical warmth, and the rounded Rubik body answers Alfa's rounded terminals so display and body share a skeleton. The palette follows the number: burnt amber at 36° is the golden moment, set on warm fall paper rather than drenched, which keeps it off the recent dark-void/duotone/drench run and gives the original green-and-blue mark a light ground to sit on for once.

Layout serves the figure: a centered, symmetric radial field, the "4" at the vertical center, the leaderboard and the day's signals orbiting below in a centered cluster, intervals tightening as the page descends. The header is a symmetric centered top bar with the real circular mark, not the wordmark-left/links-right pattern the owner has rejected three ratings running. Lowercase, centred, single-weight type is the treatment, moved off the recent caps/heavy/justified defaults so the composition reads as a decision, not a template.
