# Signals Brief — 2026-09-29

## Hero Copy
What do we live for, if it is not to make life less difficult for each other?

## Hero Rationale
This is `signals.quote`, George Eliot, and it wins the preferred lane cleanly: it is a warm rhetorical question about reducing difficulty for other people, which is the plain description of what Doug does for a living. He spends his days closing the gap between design and build so the handoff is less difficult, and he builds small tools (a spelling app that reads the exact list the teacher sent home) whose whole point is making someone's day easier. The author renders as a caption directly under the line, so the attribution is in view. The overcast, mild fall day and the quiet news slate ask for a reflective register, not a shout, and this question carries a contemplative page.
Owner's voice: Doug would say this because his job is friction removal for the people downstream of the work, and he states purpose plainly, not as hype.

## Archetype
reads like a gallery caption on a pale sage wall

## Composition
columns: single
axis: vertical
symmetry: symmetric
hero_zone: lower-third
density: sparse
rhythm: accelerating
shell_posture: standard
field_ratio: type-dominant
collapse: stack
hero_object: statement

## Composition Rationale
A whole aphorism cannot be a caption to a number, so the object is a statement and the phrase is the largest thing on the page, landing low after empty field so it reads as a considered wall caption. I moved symmetry off the mandate's `mirrored` to `symmetric` because a centred single line has no reflected repeat to justify mirroring; I moved `shell_posture` off `none` to `standard` because the owner has called the header first-class three ratings running and a corner mark plus a sentence nav is a real header decision, not an absence. I took `field_ratio` onto the discouraged `type-dominant` deliberately: this is a reading page for a literary line, and the type is the substance, with color present in one deep-green band rather than flooding the field.

## Mobile
carrier: The sage field and the centred question carry it; there is no split or rail to lose, so the single column simply keeps its order.
first_fold: The George Eliot question at `3xl` — "what do we live for, if it is not to make life less difficult for each other?" with "George Eliot" beneath it — leads the phone; the upper contemplative air is a 1440 luxury and compresses to a short top margin at 360.
order: header mark, hero question and attribution, deck and nav sentence, work index, site callout, signals colophon, footer
hero_step_360: 3xl
nav_360: Mark stays top-left at ~40px; the nav sentence sits centred just under the deck as one small lowercase line.

## Chassis
source-serif-text

## Visual Specification
### 1. Color Specification
- **Primary hue**: 148° (warm sage-forest green). Chosen inside the 140–180° mandate; it reads as care and growth, and it is literally the color of an overcast, mild fall day in Aldie, so the palette answers both the phrase and the weather.
- **Neutral palette** (sage-tinted): 50 `#f6f8f4`, 100 `#eef2ea`, 200 `#dde4d6`, 300 `#c3ceba`, 400 `#9aa891`, 500 `#6b7a62`, 600 `#505c48`, 700 `#3a4434`, 800 `#2a3226`, 900 `#191f16`
- **Accent color** (green): light `#5aa470`, default `#3f7d54`, dark `#2c5a3c`, glow `#a7d4b0`
- **Secondary accent** (amber, one note only): `#b5821c` — used only on the Lions win figure and nowhere else.
- **Background**: page bg `#f6f8f4`, card/surface `#eef2ea`, band/bgAlt `#d8ecdb`, deep field band `#2c5a3c`
- **Text colors**: primary `#191f16`, secondary `#505c48`, muted/faint `#6b7a62`

### 2. Typography (chassis: source-serif-text — Source Serif 4, one optically-sized family running display and body)
- **Hero phrase rendering**: `display` token, `hero_scale` clamp(40px, 6.5vw, 104px) (under the chassis 120px ceiling), set lowercase, roman, regular, centred, in `text` on `bg`. It wraps to roughly four lines at ~22ch measure and lands in the lower third of the first fold. The line is the sole h1.
- **Type treatment**: hero at the `hero`/`5xl` register; a mid-register deck in `md` sits below the attribution so the scale is not "giant line then 16px" (spends the middle per the owner note); section heads in `lg`; work index titles in `xl` stepping down; body/prose in `base` at 60–70ch with `lede` leading; captions and metadata in `sm`; micro labels in `xs`. Attribution "George Eliot" set in `sm` small-caps-feel lowercase, `textMuted`, directly beneath the line.

### 3. Layout Specification
- **Composition**: single / vertical / symmetric / lower-third / sparse / accelerating / standard / type-dominant / stack / statement. A single centred reading column holds air in the upper two-thirds and lets the question settle low, the way a considered caption sits under generous wall space; the eye travels straight down and the line arrives after stillness.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: minmax(0,1fr); justify-items: center` for the hero fold; work index `display: grid; grid-template-columns: 1fr; row-gap` tightening downward (accelerating).
- **Major dimensions**:
  - Hero fold `min-height: 92vh`; upper ~62% deliberately empty field, question centred in the lower third.
  - No sidebar. Max content width for the quote ~22ch (display); body/index pinned to ≤70ch. `padding: clamp(48px,7vw,120px) 6vw`.
  - Section padding tightens as the page descends: hero 120px, work index 88px, callout/colophon 64px.
- **Nav placement**: corner. The mark alone sits top-left; nav links live as one quiet lowercase running sentence low in the hero, beneath the deck. No top bar.
- **Hero phrase grid zone**: rows 3–4 of a 4-row hero grid, full column width, centred, ~72–104px at 1440.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the hero fold and the work index, above the signals colophon and footer — between the work index section and the colophon. I place it and write none of its copy or styling.

### 4. Component Character
- **Border radius**: cards/rows `sm` (2px), buttons `md` (6px), tags `sm`. Deliberately low; the owner dislikes rounded chrome.
- **Border treatment**: hairline, `border` token; section breaks use `borderStrong`. Work index is ruled rows, no cards.
- **Shadow**: none. Depth comes from value (surface vs bg) and the deep-green field band.
- **Density**: spacious at top, tightening toward the foot.
- **Interactive states**: links `text` with an `accent` underline on `_hover`; index rows shift ground to `surface` on hover.

### 5. Signal Integration
- **Where signal elements live**: a colophon band at the foot, quiet centred caption rows under a hairline.
- **Sports scores**: Lions 31–24 win rendered as the one warm note in amber `#b5821c`; Tigers 2–4 loss stated flat in `text` ("Tigers 2, Guardians 4."). Tabular figures, `sm`.
- **Quote**: it IS the hero. George Eliot named as the caption directly beneath.
- **Holiday elements**: none today.
- **Music**: Tobin Sprout, The War on Drugs, Wet Leg set as a single muted taste line in the colophon, marked as rotation, never beside a score as an event.
- **Other signals**: SPY 765.61, down 0.74% (down in `textMuted`); Presidents Cup, Final; waning gibbous, 86%; overcast, 62°F, Aldie — each a concrete colophon row.

## Self-Check
1. Hero quotability: Yes — a complete, screenshot-worthy George Eliot aphorism, quotable in isolation and attributed.
2. Because-of chain: Yes — reflective question → sparse lower-third contemplative single column → quiet bookish Source Serif → soft sage light-ground.
3. Render feasibility: Yes — a 15-word line at ~22ch wraps to four lines at ≤104px inside a 1440 column without overflow.
4. Canvas floor feasible: Yes — 66% is honest for a sparse, type-dominant reading page with a deep-green colophon band and full work index.
5. Phone: Yes — `stack` compresses the upper air; the question leads at `3xl` inside the first 640px without cutting a word.

## Rationale
The phrase is George Eliot's question about making life less difficult for each other. It is a warm, complete aphorism, not a fragment, so it has to be the largest thing on the page and it has to be at rest, which is why the hero object is a statement and the composition is a single centred column with the line landing in the lower third after a held, near-empty field. The question is reflective, not triumphant, so the register is quiet: it wants the quietest hero in the catalog, not a condensed shout.

That reading leads straight to source-serif-text, a single optically-sized serif running display and body alike, bookish and considered, which suits a Victorian novelist's line and answers the owner's rule that display and body share a skeleton (here they are one family). It is one of the faces that had never shipped, so it is genuinely fresh against the condensed-caps and mono run. I set it lowercase, roman, regular, centred, texture none: lowercase reads as an intimate spoken thought, centred is contemplative and off the recent left/justified/right pattern, and a flowing fifteen-word sentence must read as running type, which is why type-as-material would break it.

The palette is a warm sage light-ground at 148°, inside the mandate and the honest color of an overcast, mild fall morning read as soft green and warm fog, not grey. Light-ground is the fresh formula against the recent split-field, duotone and dark-void run, and, crucially, it is the day the original green-and-blue mark finally reads: on a pale sage sheet it sits in full color in the corner, unclipped, in the first fold at both widths, answering the standing complaint that the mark has effectively never shipped in its own colors. One deep-green field band carries the commitment and one amber note marks the Lions win; everything else is ink on the sage wall.
