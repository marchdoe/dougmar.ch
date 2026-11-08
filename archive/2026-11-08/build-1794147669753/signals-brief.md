# Signals Brief — 2026-11-08

## Hero Copy
Ben James leads at −21.

## Hero Rationale
Signal-event, straight off today's golf board: Ben James is 21 under at the World Wide Technology Championship, with Gerard, Kirk, McCarthy and Ortiz stacked behind him and the round still in progress. It beats the day's quote because the quote ("What have you done today to make someone else happy?") is a stranger's sermon, not Doug's register, and it beats the Red Wings' 0–4 shutout because a dominant golf lead is the one triumphant number on the board, and triumph is what a saturated warm field wants to carry. Golf is Doug's subject, he builds 15th Club and has four holes in one, so a −21 is a number he actually watches.
Owner's voice: Ben James is 21 under and the week isn't over. I follow golf, that's a number worth watching.

## Archetype
a leaderboard split, the leader slammed to the right edge

## Composition
columns: two-equal
axis: horizontal
symmetry: right-weighted
hero_zone: edge-bound
density: crowded
rhythm: accelerating
shell_posture: marginal
field_ratio: type-dominant
collapse: stack
hero_object: figure

## Composition Rationale
I moved hero_object off the mandate's `list` to `figure` because −21 is the single dramatic number on the board and a work-index lead would bury it; the leaderboard still appears as the evidence list beside the figure, so `list`'s intent survives as the left panel. I took columns to `two-equal` (the owner's gold-standard Split: thesis left, evidence right) and hero_zone to `edge-bound` so the leader slams the right edge at the end of a left-to-right read, which keeps the mandate's horizontal strip. `alignment: justified` is the only non-recent value and it is also the authentic scoreboard setting (name flush-left, score flush-right, dotted leader between), so the constraint and the content agree.

## Mobile
carrier: the giant −21 stacked above the leaderboard rows, the lead sitting over the chase the way it does at 1440.
first_fold: the figure "−21" with its caption "BEN JAMES LEADS AT" and the tournament label.
order: hero figure, tournament label, leaderboard rows, standfirst, callout, footer scorecard strip
hero_step_360: 5xl
nav_360: corner mark top-left stays at 52px, "Index" word toggles the three links; no top bar.

## Chassis
anton-inter-tight

## Visual Specification
**1. Color Specification**
- **Primary hue**: 48° warm gold. Golf's natural green sits in the forbidden 119–204 zone and is overused; a triumphant leaderboard wants heat, not fairway, and 48° lands inside the 40–80 target (nudged off 34/46/48 recent ambers by a crisper, higher-value yellow-gold).
- **Neutral palette** (warm ink "course dusk"): 50 #F4EAD0, 100 #DFD1AC, 200 #BCAC7E, 300 #9C8A5C, 400 #7A6A45, 500 #5A4D2F, 600 #46391C, 700 #342A13, 800 #241C0C, 900 #17120A
- **Gold scale**: 50 #FBF3DC, 100 #F6E7B4, 200 #F0D784, 300 #EFC94E, 400 #E8B735, 500 #D9A520, 600 #B5891C, 700 #9A5E0A, 800 #6E4A12, 900 #3A2E0E
- **Accent**: light #9A5E0A (burnt amber mark on gold ground), default/dark-scheme #E8B735, glow #F0D784, dark-cut #6E4A12
- **Secondary accent**: none. One hue carries it.
- **Background**: light scheme page #EFC94E, card #F6E7B4, figure-panel flood #17120A; dark scheme page #17120A, card #1D1709, figure-panel flood #E8B735
- **Text colors**: light primary #17120A, secondary #342A13, muted #46391C; dark primary #F4EAD0, secondary #BCAC7E, muted #9C8A5C

**2. Typography**
- **Hero phrase rendering**: `display` (Anton) at `hero`, the figure "−21" set at `clamp(120px, 15vw, 160px)` reversed out of the ink panel (fieldInk). The caption "BEN JAMES LEADS AT" sits at `2xl` above the figure. The phrase is the page's one h1; the number is the largest object, the words are its caption.
- **Type treatment**: `hero` for the figure, `2xl` for the caption and section heads, `lg` for the leaderboard names (Inter Tight body, tabular-nums), `base` for decks and the signal strip, `sm`/`xs` for labels. Leaderboard scores set at `xl` tabular. A standfirst at `lede` keeps a mid-register element on every view so nothing jumps 160px→16px.

**3. Layout Specification**
- **Composition**: two-equal / horizontal / right-weighted / edge-bound / crowded / accelerating / marginal / type-dominant / stack / figure. The eye enters the left leaderboard (the chase), travels right across the horizontal axis, and slams into −21 bound to the right edge. The two halves need each other: the leader is nothing without the field behind him.
- **CSS grid/flex**: `display: grid; grid-template-columns: 1fr 1fr; min-height: 100vh`. Left panel `display: flex; flex-direction: column` with ruled leaderboard rows; right panel is the ink flood holding the figure, bound to the right edge.
- **Major dimensions**: hero split `min-height: 100vh`; no sidebar; `max-width: none`, panel padding `clamp(40px, 5vw, 88px)`; vertical rhythm on the chassis base unit; leaderboard rows 64px tall, accelerating to 48px toward the bottom.
- **Nav placement**: corner, top-left of the left panel, mark + a single "Index" word.
- **Hero phrase grid zone**: right column, rows 1–full, figure flush to the right edge (edge-bound), figure box ~`clamp(120px,15vw,160px)` cap height, caption directly above.
- **Home callout slot**: `<SiteCallout />` on `/` sits full-width below the hero split and above the footer scorecard strip, between the leaderboard-hero section and the footer, in today's bgAlt. No copy or styling from me.

**4. Component Character**
- **Border radius**: 0 everywhere. Cards, tags, the figure panel all sharp (scoreboard, not app).
- **Border treatment**: hairline `border` for leaderboard row rules, `borderStrong` for the panel seam and section breaks.
- **Shadow**: none. Depth comes from the ink/gold value split.
- **Density**: crowded on the left (packed rows), sparse-but-huge on the right.
- **Interactive states**: links shift to accent and gain a 2px underline on `_hover`; rows lift one value step.

**5. Signal Integration**
- **Signals live**: golf is the hero and the left leaderboard; the rest sit in the footer scorecard strip.
- **Sports scores**: Anton tabular figures, scores flush-right in each justified row (name left, dotted leader, score right). −21 is the hero figure; 0–4 Red Wings and SPY 735.29 +0.31% sit in the footer.
- **Quote**: not used as hero; the Chaterjee line is omitted, it isn't Doug's register.
- **Holiday**: Veterans Day (Nov 11, 3 days out) noted small in the footer strip.
- **Music**: Wet Leg, Radiohead, Tobin Sprout set as a quiet "in rotation" line in the footer, taste not event, never beside a score as if it happened today.
- **Weather/moon**: 42.8°F sunny, new moon 0.4% in the footer strip.

## Self-Check
1. Hero quotability: Yes — "Ben James leads at −21" is a clean leaderboard line a golf fan screenshots mid-round.
2. Because-of chain: Yes — triumphant figure → scoreboard split → condensed Anton → committed warm gold/ink duotone → right-edge figure.
3. Render feasibility: Yes — "−21" is three glyphs in a condensed face, 160px clears easily in a half-width panel at 1440×900.
4. Canvas floor feasible: Yes — a crowded leaderboard half plus a full-height figure half genuinely fills 82%.
5. Phone: Yes — at 360 the figure stacks on top at `5xl` (72px), three glyphs fit the first fold without cutting.

## Rationale
The phrase is a raw signal fact: Ben James leads at −21, a monster number mid-tournament. That single figure decides everything downstream. A number this dominant wants to be the largest object on the page, so the composition is a figure day, not a statement day, and it is a Split (the owner's gold standard): the leaderboard chase on the left, the lead slammed to the right edge, the two halves needing each other. The reading runs left-to-right along the horizontal axis and ends in −21.

The chassis is Anton (condensed, single heavy display weight) with Inter Tight body, because a scoreboard figure wants the same near-black condensed caps register the owner's 2026-09-01 trophy scoreboard was rated against, and Anton specifically hasn't shipped recently while the three condensed faces I'd reflex toward (bebas, big-shoulders twice) have. The palette is a committed warm gold at 48°, dead inside the 40–80 mandate: golf's green is forbidden and overused, and triumph calls for heat. One deep warm-ink panel floods behind the figure so −21 reverses out at full force, and the whole thing reads duotone, gold and ink, no neutral void, a formula the recent list didn't touch.

Layout serves the figure: full-height two-equal split, sharp corners, justified leaderboard rows with dotted leaders and tabular figures, a corner mark-only lockup (the real circular mark, blue carrying 3:1 on the gold), and no entrance motion at all. This is a poster that arrives fully formed and holds still, which is the honest motion choice for a slab and the one not used in the last seven nights. Grain on the ink field gives it the feel of a printed scorecard.
