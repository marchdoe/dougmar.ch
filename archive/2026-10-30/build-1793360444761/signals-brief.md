# Signals Brief — 2026-10-30

## Hero Copy
Zeldman and Rolex hired one person for both.

## Hero Rationale
The composition leads with Spaceman, the LLC Doug has run for ten years, and the strongest evidence that work carries is the client set the About copy lists but buries in prose: Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass. I composed the caption from that client list to state the one claim the artifact proves, that design and the build were done by a single person for clients at that level. It reframes today's Chinese proverb ("A needle is not sharp at both ends") rather than quoting it: the proverb says you can't be sharp at both ends, the specimen quietly answers that two of the most demanding clients in the field hired one person who was.
Owner's voice: I did the design and the build myself for Zeldman and Rolex. That is the whole point.

## Archetype
a foundry specimen of one project, the client list set as the proof

## Composition
columns: two-asymmetric
axis: horizontal
symmetry: right-weighted
hero_zone: full-bleed
density: crowded
rhythm: accelerating
shell_posture: none
field_ratio: type-dominant
collapse: rail-to-band
hero_object: artifact

## Composition Rationale
The artifact lead needs one strict rail, so I moved columns off the mandate's `three` onto `two-asymmetric`: a thin foundry-label rail plus a wide specimen field gives the single-margin discipline the owner has asked for and lets SPACEMAN span the field. That rail is exactly what `collapse: rail-to-band` needs, so I moved off the suggested `reorder`: the sliver label rail can't survive at 360 and becomes a full-width band above the title. The rest sits where the date-derived tuple started because an artifact specimen genuinely wants it — full-bleed first screen, crowded type-dominant field, accelerating descent into the index, no nav chrome with the project titles doing the navigating.

## Mobile
carrier: the thin left label rail becomes a full-width band of foundry labels and running head above SPACEMAN, and the specimen descends as a single column.
first_fold: the mark top-left, the label band, SPACEMAN at the marquee step, and the h1 caption "Zeldman and Rolex hired one person for both" beneath it.
order: label band, artifact title (SPACEMAN), caption phrase, client list, work index, home callout, colophon
hero_step_360: 2xl
nav_360: no header bar; the mark holds top-left above the label band, and navigation is the project titles and the colophon links.

## Chassis
unbounded-figtree

## Visual Specification
**1. Color Specification**

- **Primary hue**: 48° saffron/amber. It sits inside the 40–80° mandate and reads as print gold on paper, the right register for a type specimen and a nod to the pre-Halloween week without reaching for literal orange (which is both outside the range and recently used).
- **Neutral palette** (warm sand, tinted toward amber): 50 `#FDF9EF`, 100 `#F6EDDB`, 200 `#ECDCBF`, 300 `#D3BE93`, 400 `#9A8C6B`, 500 `#756A49`, 600 `#5C5139`, 700 `#423A29`, 800 `#2A2318`, 900 `#191409`.
- **Accent color** (amber): light/glow `#E6B747`, default (light scheme) `#8A5600`, default (dark scheme) `#D99E1C`, dark `#6B4300`. Field flood `#D99E1C`.
- **Secondary accent**: none. One hue carries the page.
- **Background**: page bg `#F6EDDB` (paper), card/surface `#FDF9EF`, second ground / band `#ECDCBF`; dark flip page `#191409`, surface `#423A29`.
- **Text colors**: primary `#191409`, secondary `#5C5139`, muted/micro `#756A49` (dark flip: `#FDF9EF`, `#D3BE93`, `#9A8C6B`).

**2. Typography** (chassis unbounded-figtree)

- **Hero phrase rendering**: the artifact title SPACEMAN is the marquee object, set in `display` (Unbounded) at `hero_scale` `clamp(56px, 11vw, 150px)`, small-caps, heavy, letter-spacing tracked out so the single word justifies edge to edge across the wide field. The hero phrase itself ("Zeldman and Rolex hired one person for both.") is the page's one h1, set in `display` at the `3xl` step directly beneath the title, small-caps, justified, in `text` with the two client names in `accent`. Title outranks phrase; phrase outranks everything else.
- **Type treatment**: `hero_scale` for the title; `3xl` for the h1 caption; `xl`/`2xl` for the stacked client list (the mid-register element the page leans on); `lg` for work-index titles; `base` (16–18px, Figtree, 60–70ch, leading ~1.55) for standfirsts and body; `sm`/`xs` tracked uppercase for foundry labels and metadata; `2xs` floors at 13px for the colophon micro-labels.

**3. Layout Specification**

- **Composition**: two-asymmetric / horizontal / right-weighted / full-bleed / crowded / accelerating / shell none / type-dominant / rail-to-band / artifact. A thin foundry-label rail on the left and a wide specimen field on the right gives the single-rail discipline the specimen wants; the artifact title spanning the field and the client list gathering right put the visual mass against the reading direction, which is the whole point of a flex.
- **CSS grid structure**: `display: grid; grid-template-columns: minmax(104px, 0.2fr) 1fr; column-gap: 4vw`. Work index inside the field: `grid-template-columns: repeat(3, 1fr)`.
- **Major dimensions**: hero/first screen `min-height: 92vh`; label rail `~0.2fr` (min 104px); max-width `none`, side padding `64px 5vw`; section padding descends `96px → 72px → 48px` (accelerating). Client list rows at `line-height: 1.1`, one per line, flush right.
- **Nav placement**: none. The project titles in the work index are the links to `/work/*`; about and contact are quiet text links inside the colophon. The circular mark sits top-left of the specimen field.
- **Hero phrase grid zone**: field column, rows 1–2 — SPACEMAN fills the field width (rows 1), the h1 caption sits rows 2 at `3xl`, both inside the first screen at ~150px / ~56px respectively at 1440.
- **Home callout slot**: on `/`, below the work index and above the colophon footer, full width of the field column. Named only; not designed or written here.

**4. Component Character**

- **Border radius**: cards/rows `none` (0), buttons/tags `sm` (2px). Sharp, square, no rounded corners.
- **Border treatment**: hairline `border` between index rows and under labels; `borderStrong` for the one section rule above the colophon and the framed edge of the saffron band.
- **Shadow**: none. Depth comes from value and rule, not shadow (light-ground).
- **Density**: crowded but legible — a packed specimen sheet, labels and size markers treated as material.
- **Interactive states**: work-index rows take a `bgAlt` fill and the title shifts to `accent` on hover; text links underline on hover.

**5. Signal Integration**

- **Where signals live**: a specimen colophon at the foot, signals as foundry-numbered catalog entries (01–09) under one `borderStrong` rule.
- **Sports scores**: Red Wings 4–1 as a catalog entry, score in tabular figures in `accent` ("NHL · RED WINGS 4–1"). The en dash is the score dash, not a clause break.
- **Golf**: "VIDANTAWORLD MEXICO OPEN · KARL VILIPS −9, IN PROGRESS" as a catalog entry, position figure in `accent`.
- **Quote**: "A needle is not sharp at both ends. — Chinese Proverb" set small and attributed in the colophon; it reads as the claim the specimen answers, not the hero.
- **Holiday**: "OCT 31 · HALLOWEEN" a catalog entry, one day out.
- **Music**: "ON ROTATION: WET LEG · GUIDED BY VOICES · TOBIN SPROUT" as a taste entry in the colophon, not dated beside the scores.
- **Market/weather/moon**: "SPY 769.36 −0.38%" in `textMuted` (a loss, no accent), "ALDIE VA · CLEAR 54°F", "WANING GIBBOUS 74%" as catalog entries. Every noteworthy signal appears with a treatment.

## Self-Check
1. Hero quotability: Yes — "Zeldman and Rolex hired one person for both" is a screenshot-worthy flex with real names, quotable without the page.
2. Because-of chain: Yes — artifact lead forced the specimen grid, which chose the blocky Unbounded title face, which wanted a warm paper ground with one saffron turned on.
3. Render feasibility: Yes — SPACEMAN at clamp max 150px (under Unbounded's 160 ceiling) justifies across the field at 1440 without overflow.
4. Canvas floor feasible: Yes — a crowded two-asymmetric specimen with a label rail, full-width title, client list, three-column index and a colophon fills 82%.
5. Phone: Yes — the label rail collapses to a band, SPACEMAN steps to 3xl and the h1 to 2xl, both inside the first 640px with no word cut.

## Rationale
The phrase is a flex built from the one piece of evidence the About copy owns and then buries: Zeldman, Rolex and the rest hired a single person to do both the design and the build. Because the proof is a client list attached to one project, the page has to lead with that project as an object, not with a slogan, so the hero object is `artifact` and Spaceman becomes the largest thing on the page with the phrase as its caption. An artifact that is really a client list wants the vocabulary of a type foundry specimen: foundry numbers, size markers, hairline rules, one strict rail. That forced the two-asymmetric grid (label rail plus wide field) and the stacked client list set as material flush right.

A specimen needs a display face with weight and width that can carry a single justified word across the field without looking like a default headline, so I reached past the three condensed-caps faces I have been leaning on and past the recently-used zilla/source-serif/anybody set to Unbounded, a blocky expanded geometric that has not shipped. Figtree answers its geometric construction closely enough to read as a chosen pair rather than a neutral body. Small-caps, heavy, justified and the client list stacked are all the specimen's own grammar, and all four move off the recently-repeated mixed/roman/left defaults.

The palette is a warm sand specimen sheet with one saffron turned on, which honors the 40–80° mandate and keeps the page in print register rather than screen glow. Light-ground was chosen over the recently-worn dark-void, drench and duotone formulas: the specimen reads as paper, the saffron does the work in the title, the client names, the dot field and a single flooded colophon band. Depth comes from value and hairline rules, not shadow, which suits both the specimen and the owner's distaste for rounded, templated chrome. The mark sits bare top-left of the field, the project titles navigate, and the whole page resolves against the reading direction, mass to the right, the way a confident claim should.
