# Signals Brief — 2026-11-06

## Hero Copy
Spaceman. FishSticks, 15th Club, and the next one.

## Hero Rationale
Composed from the portfolio and Doug's own words: Spaceman is the LLC he has worked under for ten years, and it is the shop the side products came out of. The recent window leaned hard on the design-and-engineering theme (Oct 31, 29, 26, 20, 19) and on Detroit scores; the company itself has never been the hero, and its name is a real, specific proper noun that reads as a cosmic word at poster scale, which the radial composition wants. The deck names actual shipped products instead of describing them, concrete nouns the way Doug talks. Owner's voice: Spaceman is the name on the work. FishSticks and 15th Club came out of it, and so will the next one.

## Archetype
an orbital mission patch, one word as the planet

## Composition
columns: single
axis: radial
symmetry: symmetric
hero_zone: center
density: sparse
rhythm: syncopated
shell_posture: standard
field_ratio: field-dominant
collapse: hero-only
hero_object: word

## Composition Rationale
I kept radial from the starting tuple because the word is literally Spaceman: content orbiting a single anchor is the concept, not a default. I moved columns to single (a lone planet does not want a two-column split), hero_zone to center (radial puts the hero at the orbital center, which contradicts the edge-bound start), and symmetry to symmetric (a mission-patch orbit is balanced, not reflected). The remaining axes hold with reasons: syncopated spaces the satellites at irregular radii like real orbits, standard gives a fresh centered mast after a week of footer-only and folded headers, and field-dominant lets the void carry the page.

## Mobile
carrier: The orbit becomes a launch sequence read top to bottom, the word first, then the products and signals as a vertical telemetry column below it.
first_fold: The hero alone: "Spaceman" set at 4xl centered, with its deck "FishSticks, 15th Club, and the next one." on the line beneath, and nothing else inside the first 640px.
order: hero word + deck, selected work index, signal telemetry, about blurb, site callout, footer
hero_step_360: 4xl
nav_360: The centered mast holds, mark ~40px centered at top, wordmark beneath, the three numbered links wrap to one centered row below.

## Chassis
unbounded-figtree

## Visual Specification
### 1. Color Specification
- **Primary hue**: 258° (violet-indigo). Chosen against the color mandate's 15–40° terracotta target because the repetition check demands a hue at least 60° off the recent window (22°, 158°, 14°, 149°, 340°, 174°, 48°), and the Spaceman-in-orbit concept demands a cosmic field, not another warm clay. 258° is 84° from the nearest recent hue (174°) and sits in the allowed 204–310° band.
- **Neutral palette** (violet-tinted): 50 `#F5F4F8`, 100 `#E9E7F0`, 200 `#CFCBDD`, 300 `#ADA7C3`, 400 `#847DA2`, 500 `#615A80`, 600 `#474263`, 700 `#322E49`, 800 `#1F1C30`, 900 `#110F1D`
- **Accent color**: light `#C9BBFA`, default `#9B7DF0`, dark `#6B4BD1`, glow `#B9A4F7`
- **Secondary accent**: `#FF4D63` (re-entry red), used only on the down signals, the market drop and the Red Wings loss.
- **Background**: page bg `#0C0A16`, card/surface `#1A1530`, band bgAlt `#141020`, flooded field `#2A1C5C`
- **Text colors**: primary `#F5F4F8`, secondary `#ADA7C3`, muted/faint `#928BB0`

### 2. Typography
- **Hero phrase rendering**: `display` face (Unbounded), hero word "Spaceman" set at the `hero` step via `hero_scale` clamp, centered on the orbital axis, stroked (outline) in `accent` with an `accentAlt` glow. The deck, "FishSticks, 15th Club, and the next one.", sits one line beneath at `xl`, roman, in `text`. The h1 is the full phrase.
- **Type treatment**: `hero` for the word; `xl` for the deck; `3xl` for section heads (selected work, telemetry); `md`/`lede` for the standfirst and about blurb; `base` for body held at 60–68ch; `xs`/`sm` small-caps for the orbiting satellite labels and telemetry keys. At least one mid-register step (`3xl` section head, `lede` standfirst) on every inner route so nothing jumps from marquee straight to body.

### 3. Layout Specification
- **Composition**: single / radial / symmetric / center / sparse / syncopated / standard / field-dominant / hero-only / word. One word is the planet; the product names and the day's signals orbit it as satellites at syncopated angles and radii on the dark field. Radial + center is the only arrangement that lets a single proper noun be both the subject and the gravitational center.
- **CSS grid/flex structure**: hero is one `position: relative` full-bleed field; the word is centered with `display: grid; place-items: center`; satellites are absolutely positioned at computed angle/radius offsets from center. Below the fold, `display: grid; grid-template-columns: repeat(12, 1fr)` with the work index and telemetry spanning named column ranges.
- **Major dimensions**:
  - Hero field: `min-height: calc(100vh - 44px)` at 1440.
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 112px)`; body prose columns capped at 66ch inset within the grid.
  - Section padding: `clamp(64px, 9vh, 128px)` vertical between the field and the index.
- **Nav placement**: centered top-bar mast, `height: 112px` at 1440, on the vertical axis the orbit turns around.
- **Hero phrase grid zone**: dead center of the hero field, rows 2–4 of a conceptual 5-row field, the word occupying roughly the central 70% of width at ~148px cap height, deck immediately beneath.
- **Home callout slot**: on `/`, `<SiteCallout />` sits full-width below the signal-telemetry section and above the footer, between the About blurb and the footer colophon. I place it; I do not design or write it.

### 4. Component Character
- **Border radius**: cards/panels `4px` (md); satellite markers and the moon body `9999px` (full, circular, thematic orbit dots); buttons `2px`.
- **Border treatment**: hairlines in `border` `#2A2740`; section breaks in `borderStrong` `#46406A`.
- **Shadow**: none as depth; the only glow is the `accentAlt` text-shadow on the hero word and soft `mesh` blooms in the field.
- **Density**: spacious in the hero, measured in the index.
- **Interactive states**: links shift from `accent` to `accentAlt` on hover with a 1px underline offset; satellites brighten their label on hover. Respect `prefers-reduced-motion`.

### 5. Signal Integration
- **Satellites in the hero**: product names (FishSticks, 15th Club, TeeTurn, Politweets, Twittertale) and the day's key facts orbit the word as small-caps labels at syncopated radii.
- **Golf**: WWT Championship, Kirk −9, as one orbit label and a telemetry row in `accent`.
- **Market**: SPY 733.00, down 4.41%, rendered in `re-entry red` `#FF4D63` as the single down-signal satellite, the adversity in the quote made literal.
- **Quote**: not the hero. Set small and attributed in the footer colophon tail: "during times of adversity our true character will show. — Unknown".
- **Holiday**: Veterans Day, in 5 days, one quiet telemetry line.
- **Music**: War on Drugs, Radiohead, Tobin Sprout as an "In rotation" footer line, taste not event, no date beside it.
- **Other**: Red Wings 1–2 loss (red), Wembanyama 52-24-8 as one league-note telemetry line, moon waning crescent 7% rendered as a dim crescent body in the orbit, weather Aldie 63°F patchy rain in the readout.

## Self-Check
1. Hero quotability: Yes — "Spaceman. FishSticks, 15th Club, and the next one." is a name and a real index, screenshot-worthy, not a description.
2. Because-of chain: Yes — a proper-noun word drives the single giant word (word object), the orbit drives radial/center/symmetric, cosmic drives dark-void violet, blocky display drives Unbounded.
3. Render feasibility: Yes — hero_scale caps at 148px, under Unbounded's 160px hero ceiling, centered in a full-bleed field with room to spare at 1440.
4. Canvas floor feasible: Yes — satellites spread content across the whole field, so a field-dominant poster clears 72%.
5. Phone: Yes — at 4xl "Spaceman" fits one line in a ~312px column and leads the first fold alone with its deck.

## Rationale
The phrase is Spaceman, the name on ten years of Doug's work and the shop that shipped FishSticks and 15th Club. It is a proper noun, which is exactly what a single-word hero object wants: one blocky word at poster scale with a real product index as its deck. Because the word is Spaceman, the composition had to be radial and centered, content orbiting a single gravitational anchor, with the products and the day's signals placed as satellites at syncopated radii. That is a genuine compositional decision, not a silhouette off a shortlist, and it answers the owner's standing complaint that every build reads as one more poster line on a moved grid.

Because the field is deep space, the palette is dark-void in orbit violet (258°). I am reusing dark-void knowingly: a spaceman floating needs a near-black field with one luminous body on it, and fit beats novelty here. The violet also breaks a hard 60 degrees off the terracotta-and-green recent window the repetition check flagged, and the one secondary color, re-entry red, lands only on the down signals, the market's 4.4% drop and the Red Wings loss, which makes the quote's adversity literal without stylizing it. Because the word has to read as a cosmic object, the chassis is Unbounded, a blocky wide geometric display that is retro-futurist without costume, set mixed case and outline-stroked with a glow so it reads as a neon body in a nebula rather than another all-caps shout.

Centered alignment and the centered mast are both moves off the type and shell mandates, and both are demanded by the symmetric radial axis: the word sits on the vertical line the orbit turns around, and the mast sits on that same line. The header is a top-bar, which is fresh after a week of footer-only and folded headers, but arranged as a centered numbered index rather than the left-wordmark right-links pattern the owner has rejected three times. The entrance rises, the field drifts slowly like bodies in orbit, and sections below reveal on scroll, the first motion the concept has ever actually asked for.
