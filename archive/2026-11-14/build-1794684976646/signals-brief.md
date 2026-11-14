# Signals Brief — 2026-11-14

## Hero Copy
Thousands of kids practicing spelling from the list the teacher sent home.

## Hero Rationale
This is one of Doug's own standing lines about FishSticks, lifted from the Owner Voice block and never shipped yet. It is concrete, warm, and counts real people doing a real thing: kids, a word list, a teacher. It beats today's Og Mandino quote because the quote is generic motivation from a stranger, and yesterday was already a quote day; this line is Doug talking about a product he built and what it does in the world. It anchors FishSticks, the owned artifact that leads the page.
Owner's voice: Doug says what a thing does, with the real noun ("the list the teacher sent home") and no hype.

## Archetype
a product spec plate, the work reversed out of a teal-black void

## Composition
columns: two-equal
axis: diagonal
symmetry: right-weighted
hero_zone: lower-third
density: measured
rhythm: interrupted
shell_posture: footer-only
field_ratio: type-dominant
collapse: split-to-sequence
hero_object: artifact

## Composition Rationale
The hero is a sentence that captions a built product, so the object leads and the phrase steps down: I moved hero_object off the suggested `word` to `artifact` because "fishsticks" reversed out of the void is the right marquee, with the sentence as its caption. I moved axis off the suggested `radial` to `diagonal` because two matched panels read across a sightline, not around a center; radial would fight the split. Everything else honors the date tuple (two-equal, right-weighted, lower-third, sparse, interrupted, footer-only, type-dominant, split-to-sequence) because each genuinely fits a spec-plate that masses right and anchors its human line low.

## Mobile
carrier: The FishSticks plate stacks full-width above its caption sentence, so the artifact and its human line stay adjacent and the relationship survives without the split.
first_fold: The stacked-lg mark top-left, the `fishsticks` artifact title, and the hero caption sentence beneath it set at 2xl.
order: brand mark, fishsticks artifact title + metadata, hero caption, work index, site callout, footer signal band
hero_step_360: 2xl
nav_360: Mark stays top-left in the hero field; numbered nav 01 02 03 drops to the footer band as a short wrapped row.

## Chassis
zilla-worksans

## Visual Specification
### 1. Color Specification
- **Primary hue**: 170° (teal). Inside the 140–180° mandate; teal reads as water (FishSticks) and as a made, durable product color, not a mood.
- **Neutral palette** (teal-tinted):
  - 50 `#f1f6f4`
  - 100 `#e2ebe8`
  - 200 `#c3d1cc`
  - 300 `#9aaea8`
  - 400 `#7e948d`
  - 500 `#56726a`
  - 600 `#3a544e`
  - 700 `#2a413c`
  - 800 `#10201d`
  - 900 `#0a1513`
- **Accent color** (teal): light `#99f6e4`, default `#2dd4bf`, dark `#0f766e`, glow `#5eead4`
- **Secondary accent** (amber, signal only): `#f5b63f`. Used on the footer signal field and for score figures; never on the hero.
- **Background**: page bg `#0a1513`, card/surface `#1a2e2a`, second ground (bgAlt) `#10201d`
- **Text colors**: primary `#e4ece9`, secondary `#a3b5af`, muted/faint `#7e948d`

### 2. Typography
- **Hero phrase rendering**: The h1 is the full sentence "Thousands of kids practicing spelling from the list the teacher sent home.", set in `display` (Zilla Slab) at the `3xl` step, lowercase, right-aligned, sitting in the lower third as the caption to the artifact. The artifact title `fishsticks` is the marquee object, set at `hero_scale` (clamp 72→116px), reversed teal-on-void, carrying the eye.
- **Type treatment**: artifact title at `hero`/`5xl`; hero caption/h1 at `3xl`; project metadata (2025, SaaS, Design + Build) as a `sm` vertical label along the gutter spine; work index titles at `xl`; standfirst at `md`; body at `base` held to 62ch, leading 1.5; micro labels at `2xs`. Every step from the ramp carries its own leading and tracking; I name steps, not pixel line-heights.

### 3. Layout Specification
- **Composition**: two-equal / diagonal / right-weighted / lower-third / sparse / interrupted / footer-only / type-dominant / split-to-sequence / artifact. Two matched panels; the FishSticks plate masses right and heavy, the caption and work index hang left, a diagonal sightline runs from the big title down to the index. The split lets the artifact and its human caption need each other, the way the 06-13 gold-standard split does.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1fr 1fr; gap: clamp(32px, 5vw, 96px)` for the hero; the FishSticks plate is the right cell, reversed as a `surface` panel.
- **Major dimensions**:
  - Hero area `min-height: 92vh`
  - No sidebar; `max-width: none`, side padding `clamp(40px, 6vw, 112px)`
  - Body columns capped at 62ch inside the index
  - Section padding `clamp(64px, 8vh, 140px)` vertical
- **Nav placement**: footer-only. Numbered nav (01 02 03 work / about / contact) lives in the footer signal band. No top bar.
- **Hero phrase grid zone**: the h1 caption occupies rows 7–9 (lower third) of the left panel, right-aligned, at `3xl`; the `fishsticks` artifact title fills rows 2–6 of the right panel at 72–116px.
- **Home callout slot**: `<SiteCallout />` sits full width below the work index and above the footer signal band, between the index section and the colophon. I place it; I write no copy and set no styling for it.

### 4. Component Character
- **Border radius**: cards/plate `2px`, tags `2px`, buttons `2px`. Sharp, built, no soft corners.
- **Border treatment**: hairline `border` on index rows; `borderStrong` for the one caesura rule above the caption and the rule above the footer field.
- **Shadow**: none. Depth comes from the `surface` panel being a lighter value than `bg`, not shadow.
- **Density**: spacious / sparse. Large intervals; one caesura gap above the caption.
- **Interactive states**: nav and index links underline in `accent` on hover; `_hover` lifts link ink to `text`.

### 5. Signal Integration
- **Where signal elements live**: the footer amber `field` band holds the day's facts in one colophon block.
- **Sports scores (golf)**: Austin Championship leaderboard in the amber field, tabular-nums: van Rooyen −14, Yu −14, Harman −13, set in `fieldInk` with scores emphasized, a hairline per row.
- **Quote**: Og Mandino's "Never settle for the crumbs of life." runs as a small attributed footnote in the footer, `fieldInkMuted`, not as the hero.
- **Holiday**: none today.
- **Music**: The War on Drugs and My Morning Jacket as a quiet "in rotation" caption in the colophon, taste not event, no score treatment.
- **Other**: weather (Aldie, 48°F, overcast) top-right of the hero in `textFaint`; SPY 754.37, −0.36% and first-quarter moon as `2xs` metadata in the footer field.

## Self-Check
1. Hero quotability: Yes — a warm, concrete sentence about real kids and a real list, quotable standing alone.
2. Because-of chain: Yes — artifact-leads object chose the two-equal plate, which chose the sturdy slab chassis, which chose the teal-black built palette, which chose the lower-third caption zone.
3. Render feasibility: Yes — `fishsticks` at ≤116px fits one panel at 1440; the 3xl caption wraps cleanly in the lower third.
4. Canvas floor feasible: Yes — the right-panel plate plus left caption and index fill a 72% floor without crowding.
5. Phone: Yes — split-to-sequence stacks the plate over its caption; the 2xl caption lands in the first fold under the artifact title and the mark without cutting a word.

## Rationale
The phrase is one of Doug's own standing lines about FishSticks, never shipped: a count of real kids doing a real thing with the word list the teacher sent home. Because it is a sentence that describes an owned product, the object has to be the product, not the sentence. So the hero_object is `artifact`: "fishsticks" set as a reversed teal-on-void plate at marquee scale, and the phrase steps down to the 3xl caption that anchors it in the lower third. The two-equal split lets the plate and its human line need each other, the way the 06-13 fairway split does.

Because the page is a spec plate for a built thing, the chassis is zilla-worksans, a sturdy low-contrast slab that reads as structural and made, not fashionable; it has not shipped recently and it breaks the condensed-caps and expressive-grotesque habit. Set lowercase, heavy, right-aligned, with the project metadata running vertically up the gutter, the type itself becomes the texture. The palette is a teal-black dark-void (fresh against seven days of drench, split and duotone), teal reading as both water and a durable product color, with one warm amber field reserved for the day's signals so the leaderboard and market and moon live in their own plane and never touch the hero.

Layout follows: footer-only posture puts the stacked-lg mark top-left of the hero field and defers numbered nav to the amber colophon band, which is a different posture, lockup and ground than the last two builds the repetition check flagged. The wipe entrance reveals the plate left to right, the ground drifts a slow teal luminance, and the index rises on scroll, so the page moves the way the reference sites move without a cascade.
