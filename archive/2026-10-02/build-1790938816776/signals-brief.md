# Signals Brief — 2026-10-02

## Hero Copy
You can't go forward and backwards at the same time.

## Hero Rationale
This is `signals.quote` (Steve Harvey), and I took it at the lane's word: reach for the quote first. It reads as a line about commitment, which is exactly Doug's working creed. He checks a thing is buildable before the first line of code and faithful after the last; both demand you pick a direction and move, not hedge. The gold-standard note in his own memory says the bar is "committed gestures, not hedges," and this quote is that idea in nine words. Steve Harvey's name renders as the caption directly under the line.
Owner's voice: Doug commits to one direction on every build, buildable-then-faithful, and has no patience for hedging either way.

## Archetype
a committed aphorism on a green-black void, two directions outlined against each other

## Composition
columns: two-asymmetric
axis: horizontal
symmetry: left-weighted
hero_zone: center
density: crowded
rhythm: even
shell_posture: folded-into-hero
field_ratio: field-dominant
collapse: hero-only
hero_object: statement

## Composition Rationale
The phrase is about direction, so I moved `axis` off the mandate's radial to horizontal, the literal forward/backward reading line. I kept `hero_object` on statement rather than the suggested figure because this is a quote: the whole line has to read at marquee scale or the forward/backward opposition it hinges on is lost; a figure or single word would gut it. `columns` moved to two-asymmetric (from three) so the quote owns a committed left field while the day's signals crowd the narrow right, and `hero_zone` to center so the line is the still point the crowded data orbits.

## Mobile
carrier: With the two-asymmetric split gone, the quote carries alone; the two outlined direction words against solid caps hold the forward/backward opposition.
first_fold: "You can't go forward and backwards at the same time." set as the justified marquee block, filling the first fold alone with the lockup top-left; signals follow below.
order: lockup+quote, signals, site-callout, footer
hero_step_360: 3xl
nav_360: Lockup stays top-left in the first fold; the three title-case links drop to a bottom-of-hero row above the signals.

## Chassis
anybody-franklin

## Visual Specification
### 1. Color Specification
- **Primary hue**: 160° (spring green). A forward, go-signal green, the one color lit on the void. Direction, not decoration.
- **Neutral palette** (green-tinted): 50 `#eef4f0`, 100 `#dde9e2`, 200 `#bdd1c6`, 300 `#93ab9f`, 400 `#6b857a`, 500 `#4d645a`, 600 `#394d44`, 700 `#293932`, 800 `#182621`, 900 `#0c1611`
- **Accent color**: light `#5ce6b0`, default `#1fd891`, dark `#14986a`, glow `#0b5f43`
- **Secondary accent**: none. One color carries the page.
- **Background**: page bg `#0c1611`, bgAlt band `#10201a`, surface/panel `#16271f`, flooded signal field `#0f2e22`
- **Text colors**: primary `#eef4f0`, secondary `#9fb6aa`, faint `#80978b`; ink on accent `#06130d`; ink on field `#d9f6e9`, muted on field `#83c6a7`

### 2. Typography
- **Hero phrase rendering**: `display` (Anybody) at the `hero` ramp step for the marquee quote, clamped `clamp(44px, 6.5vw, 104px)` so it never passes Anybody's 160px ceiling and never overflows 1440. Set in caps, italic, heavy, justified as a solid block. The two direction words "FORWARD" and "BACKWARDS" render as outlined (stroked) letterforms in `accent`; every other word is solid `text`. The opposition is visible, not just read.
- **Type treatment**: hero at `hero`; the attribution "Steve Harvey" at `md`; signal section heads at `lg`; the leaderboard names/figures at `base` with tabular numerals; captions and metadata at `sm`; micro labels at `xs`, never below 13px. Body (Libre Franklin) runs 60-68ch at `base`, leading held by the `base` textStyle. One mid-register element (the attribution + a short standfirst) spends the middle of the scale so it never jumps title-to-caption.

### 3. Layout Specification
- **Composition**: two-asymmetric / horizontal / left-weighted / center / crowded / even / folded-into-hero / field-dominant / hero-only / statement. The horizontal axis is the forward/backward reading line; the quote sits center-weighted in the larger left field while the day's signals crowd the narrow right column, the noise of going both ways around the one still line.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, 1fr); min-height: 100vh;` on the hero section. Quote block spans the left column, vertically centered; signal cluster fills the right column top to bottom.
- **Major dimensions**:
  - Hero/void height: `min-height: 100vh`
  - Signal rail width: right column `minmax(300px, 1fr)` (~36% at 1440)
  - Max content width: `max-width: none`; side padding `clamp(24px, 5vw, 88px)`
  - Section padding: vertical rhythm on the chassis base unit; signal rows at one repeating interval (even rhythm)
- **Nav placement**: folded into the hero. Horizontal lockup top-left of the void. Three title-case links in a row along the lower-left edge, beneath the quote. No top bar, no links opposite the mark.
- **Hero phrase grid zone**: left column, rows spanning the vertical center (roughly rows 3–8 of a 10-row hero), occupying ~60% of viewport width and ~50vh height, the largest element on the page.
- **Home callout slot**: `<SiteCallout />` sits on `/` directly below the hero void and above the footer, between the signal/hero fold and the baseline-rule footer. Full column width, orchestrator-styled. I place it, I do not design it.

### 4. Component Character
- **Border radius**: cards/panels 10px (`lg`) sparingly; tags/labels 2px (`sm`); buttons 4px (`md`). Mostly square; the void wants hard edges.
- **Border treatment**: hairlines in `border` between signal rows; `borderStrong` for the one rule above the footer and the top edge of the flooded signal field.
- **Shadow**: none. Depth comes from field lightness (surface/bgAlt lifting off bg) and the mesh blooms, not shadow.
- **Density**: crowded in the signal rail, spacious around the quote. The contrast is the composition.
- **Interactive states**: nav and links shift `text` → `accent` on `_hover`, no underline slide; leaderboard leader row holds `accent` always.

### 5. Signal Integration
- **Where signal elements live**: the crowded right rail, as a packed data stack over the flooded `field` plane.
- **Sports scores**: Bank of Utah Championship, in progress. Zach Bauchou −9 as the leader row in `accent` with tabular numerals at `base`; Yellamaraju, Lipsky, Jaeger, Fisk −8 beneath in `fieldInk`/`fieldInkMuted`, one hairline per row. Section head "Bank of Utah · in progress" at `lg`.
- **Market**: SPY 763.99, up 0.18%, as a compact figure row with the up-direction in `accent`.
- **Weather**: Aldie, Virginia, 66.7°F, cloudy, as one metadata line at `sm` in `textMuted`.
- **Moon**: last quarter, 58.5% lit, one faint line at `xs` in `textFaint`.
- **Quote**: IS the hero. "Steve Harvey" renders as the caption at `md` in `textMuted` directly beneath the justified block.
- **Music**: The War on Drugs and Wet Leg, a standing rotation, set as one quiet caption in the footer baseline rule, never beside the live golf or market figures as if it happened today.
- **Air quality**: Good (AQI 1) folded into the weather line, not given its own row.

## Self-Check
1. Hero quotability: Yes — a nine-word aphorism about direction that stands fully on its own, attributed.
2. Because-of chain: Yes — commitment-to-one-direction drove dark-void (one committed ground), Anybody's forward-leaning italic, outlined direction words, horizontal axis, and the single green.
3. Render feasibility: Yes — `clamp(44px, 6.5vw, 104px)` under Anybody's 160px ceiling, justified across ~60% of 1440 wraps to three legible lines without overflow.
4. Canvas floor feasible: Yes — crowded field-dominant void with a packed signal rail genuinely fills 82% of 1440×900.
5. Phone: Yes — `hero_step_360: 3xl` lands the full quote in the first 640px above the signals without cutting a word.

## Rationale
The phrase is Steve Harvey's "You can't go forward and backwards at the same time," a line about committing to one direction. Everything flows from that. The composition commits to a single ground, dark-void, instead of splitting the canvas into two fields, because the phrase says you can't do both at once; a split-field would literally go two directions and contradict the line. The quote holds the center as a statement at marquee scale, the one still point, while the day's signals crowd the narrow right rail, the noise of going both ways.

The chassis is Anybody, a wide squarish grotesk with true italics. The italic lean is forward motion made typographic, and the two direction words "FORWARD" and "BACKWARDS" render as outlined letterforms in the one accent against the solid caps, so the opposition in the sentence is visible on the page. Caps, heavy, justified locks the quote into a committed slab with its edges pinned, direction chosen. I kept it off the condensed-caps default and off the three recently-used chassis.

The palette is one spring green at 160° floating on a green-black void, a single go-signal lit in the dark. That honors the 140-180 target and, more important, breaks the recent run of green drenches and duotones by changing the formula, not just the hue. The mark goes single-color inheriting `text` ink, not the mono-in-the-green trap the owner flagged, so it clears contrast in the first fold. Rise entrance and a slow drifting mesh give the void depth and move the quote forward as it arrives, the first motion this surface has carried.
