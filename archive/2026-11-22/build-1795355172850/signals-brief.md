# Signals Brief — 2026-11-22

## Hero Copy
I build the things I want to exist.

## Hero Rationale
Doug's whole register is the maker who closes the gap himself: FishSticks because a kid needed the teacher's actual word list, 15th Club because golf apps are only scorecards, Spaceman as the vehicle for ten years of it. This line is the standfirst that frames the work index below it, seven self-made products from 2008 to 2026, and it reads as a credo rather than a slogan. It also answers today's loudest references (craft, making, "in making things we make ourselves") in Doug's plainer first person, without the site ever becoming its own subject. I kept the composed lane one more day because the phrase has to characterize a body of work, not restate a signal, and no verbatim content line does that job.
Owner's voice: Doug says "I" and builds the thing he wants to see, from the spelling list to the golf app, instead of waiting for someone to make it.

## Archetype
a right-rail broadsheet index, maker's credo as the standfirst

## Composition
columns: single
axis: diagonal
symmetry: right-weighted
hero_zone: edge-bound
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: type-dominant
collapse: stack
hero_object: list

## Composition Rationale
The hero is a standfirst framing seven project titles, so the work index is the largest object and reads as a right-rail broadsheet of ruled rows, not running newspaper columns. I moved `columns` off the suggested `three` to `single` because three narrow measures would shrink the titles below marquee and break the single right rail; everything else stays near the date tuple because a list-led, type-dominant, right-weighted broadsheet with a caesura between Selected Work and Experiments genuinely fits this credo. `alignment: right` (a Type Treatment value the mandate steers off) binds the standfirst and every title to one rail, satisfying the owner's one-rail rule and matching the FLOOR 10-17 right-aligned index.

## Mobile
carrier: The right-rail broadsheet becomes a full-width stack where the large right-aligned project titles carry the page and the lowercase standfirst sits above them.
first_fold: Circular mark top-left, the standfirst "I build the things I want to exist.", and the first project title.
order: mark, standfirst, work index, signal band, site callout, footer signature
hero_step_360: 3xl
nav_360: No header; mark top-left above the standfirst, work-index titles are the nav, about/contact in the footer.

## Chassis
hanken-solo

## Visual Specification
### 1. Color Specification
- **Primary hue**: 291° amethyst violet. A cool, nocturnal, considered hue for a reflective Sunday under a 98%-full moon, and the only fresh register that sits ≥60° from all seven recent primaries. Deviates from the auto-mandate's 140–180° green, which would land inside last week's teal/fairway cluster (see color_story).
- **Neutral palette** (violet-tinted): 50 `#f6f3fa`, 100 `#ece7f3`, 200 `#dcd4e8`, 300 `#c3b8d5`, 400 `#9d8fb3`, 500 `#776a8d`, 600 `#5a4e70`, 700 `#433a56`, 800 `#2d2740`, 900 `#1b1729`
- **Accent color**: light `#9a6dd6`, default `#7b42d1`, dark `#51288c`, glow `#b592e3`
- **Secondary accent** (down-signals only, market/loss): `#b24a3f` brick, used as a small ▼ and status tint, never as a second brand colour
- **Background**: page bg `#ece7f3`, card/surface `#f6f3fa`, band/bgAlt `#dcd4e8`
- **Text colors**: primary `#1b1729`, secondary `#433a56`, muted/faint `#5a4e70`

### 2. Typography
- **Hero phrase rendering**: The standfirst "I build the things I want to exist." is the one h1, set in `display` (Hanken Grotesk) at `4xl`, lowercase, roman, right-aligned to the page's right rail. Because `hero_object` is `list`, the phrase steps down and the work-index titles below it take marquee scale at the `hero_scale` clamp (effectively `5xl`→`hero`). The standfirst sits above the index as its deck, reversed sense of hierarchy intact: the work is the biggest object, the credo captions it.
- **Type treatment**: Hanken Grotesk at three weights carries everything (single-voice chassis). Steps: index titles → `hero_scale` clamp; standfirst (h1) → `4xl`; section rule-labels → `sm` lowercase, 0.08em tracking; project metadata (year, role) → `sm` with `tabular-nums`; body/decks → `lede`/`base` held to 62–66ch, leading 1.5; captions and the vertical spine label → `xs`. One mid-register element on every zone (standfirst under titles, a `lede` note in the signal band) so no page jumps title-to-body.

### 3. Layout Specification
- **Composition**: `single / diagonal / right-weighted / edge-bound / measured / interrupted / none / type-dominant / stack / list`. A single right-rail broadsheet: the credo and every project title hang off one right edge, metadata to their left, so the seven titles read as the hero object and the phrase is their standfirst. The reading path cuts diagonally from the small left metadata of each row to the large right title and down the stack.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: [spine] 40px [meta] minmax(96px, 0.9fr) [title] 2fr [edge] 6vw;` each index row spans meta→title with the title right-aligned to the `edge` gutter. Hero block spans meta→title, right-aligned.
- **Major dimensions**:
  - Hero/standfirst area: `min-height: 62vh` (standfirst + first two index rows in the first fold)
  - No sidebar. Left spine column fixed `40px`, carries the vertical label only.
  - Max content width: `max-width: none`; `padding: 72px 6vw`. Body/deck prose capped at 64ch where it appears.
  - Section padding: 48px row rhythm, broken once by a 112px caesura between Selected Work and Experiments.
- **Nav placement**: No header element. The work-index titles are the in-content nav to `/work/*`; about and contact are text links in the footer signature line. Circular mark top-left of the hero field, `42px`.
- **Hero phrase grid zone**: rows 1–2, columns meta–title (right-aligned), ~`4xl`, pinned to the right edge above the first project title.
- **Home callout slot**: `<SiteCallout />` sits below the signal band and above the footer signature line, between the Experiments group's close and the footer. Full width, its own `bgAlt` band. No copy or styling from me.

### 4. Component Character
- **Border radius**: cards/chips 2px (`sm`), buttons/links 0, tags 2px. Crisp, broadsheet, no large rounding.
- **Border treatment**: hairline `border` rules between index rows; `borderStrong` for the caesura rule and the band dividers. Bordered rows, no boxes.
- **Shadow**: none. Depth is value, not shadow.
- **Density**: measured. Generous row leading, one deliberate large caesura.
- **Interactive states**: title links shift ink→`accent` on `_hover` and draw a 2px `accent` underline from the right; metadata stays put.

### 5. Signal Integration
- **Where signals live**: a ruled signal band directly below the Experiments group, before the SiteCallout. Three tabular rows, right-aligned to the rail.
- **Sports scores**: Red Wings 2–3, loss — set in `sm` tabular figures, the loss marked with a small brick `#b24a3f` ▼; no gloating, a score is a score.
- **Golf**: "RSM Classic, in progress. Three at −9." — Penge, Neergaard-Petersen, Thorbjornsen listed in `sm` with the −9 in `accent`. It carried the hero yesterday, so today it is one line in the band.
- **Market**: "SPY 689.81, ▼ 3.64% on the day" in tabular figures, the arrow and percent in brick `#b24a3f`.
- **Weather/atmosphere**: "Aldie, Virginia. Overcast, 53°F, air moderate." in the place/date line under the mark, `textMuted`.
- **Lunar**: a small `accent`-glow note "Full moon, 98% lit" as the caption that justifies the violet, set `xs` beside the date.
- **Holiday**: "Thanksgiving, four days out." one forward line, `textMuted`, in the band.
- **Music**: "On rotation: Tobin Sprout, My Morning Jacket, The War on Drugs." set apart in the footer as standing taste, never beside the scores as an event.

## Self-Check
1. Hero quotability: Yes — "I build the things I want to exist." stands alone as a maker's credo, not a descriptive opener.
2. Because-of chain: Yes — a credo that frames a body of work made the work index the hero object, which made a single right-rail broadsheet, which chose a quiet single-grotesk chassis and a considered amethyst-on-paper palette.
3. Render feasibility: Yes — `4xl` standfirst and `hero_scale` titles both sit well under Hanken's 160px ceiling on 1440×900 with 6vw gutters.
4. Canvas floor feasible: Yes — seven ruled index rows plus standfirst, signal band and callout fill a type-dominant broadsheet past 74%.
5. Phone: Yes — `stack` keeps order; standfirst at `3xl` lands six short words in the first fold above the first title without a cut.

## Rationale
The phrase is a maker's credo, "I build the things I want to exist.", so the only honest way to prove it is to put the work itself first. That makes the work index the hero object: seven self-made products from 2008 to 2026 set as large right-aligned titles in ruled rows, with the credo as their standfirst. The composition follows directly, a single right-rail broadsheet (columns single, axis diagonal, right-weighted, edge-bound, type-dominant) with a deliberate caesura splitting Selected Work from Experiments, because the titles need one rail and one reading direction to read as a catalog rather than a poster.

The chassis is Hanken Grotesk alone, never shipped and the quiet counter to a fortnight of condensed-caps and didones. A single humanist grotesk carrying titles, standfirst and body matches Doug's register, plain, concrete, no editorial costume, and keeps the page in the Swiss/index lane the FLOOR 10-17 reference sketches rather than drifting into magazine serif. Its single display weight and lack of italics set the type treatment for me (regular, roman), and I set it lowercase and right-aligned so the whole page hangs off one rail.

The palette amplifies the mood, not the volume: deep amethyst (291°) on cool violet-grey paper, a light-ground strategy for an overcast 53° Sunday under a 98%-lit full moon. It is saturated where it counts, the accent carries titles on hover and the −9 and the deep violet field band, while the down signals (SPY off 3.64%, a Red Wings loss) get one restrained brick tint so the page tells the truth about the day without going grey. The violet clears every recent hue by at least 60°, which the mandate's green could not do.
