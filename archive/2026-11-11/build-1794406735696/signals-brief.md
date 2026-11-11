# Signals Brief — 2026-11-11

## Hero Copy
Veterans Day

## Hero Rationale
Today is Veterans Day, and the date itself is the signal: 11.11, the eleventh hour of the eleventh day, the Armistice. I'm leading with the date as the poster object and naming the day plainly, which is how I say things, a date is a date, no slogan pinned to it. It beats forcing a sentiment I wouldn't write, and it beats the Schwarzenegger quote, which I've kept as an attributed note near the facts where it fits the giving-back theme without pretending to be my line. The two elevens mirror across the dot, so the composition is built into the number.
Owner's voice: I'd put the date up and let it stand, the way I'd post a score, because it's the one thing that's unambiguously true about today.

## Archetype
an engraved date on service-navy

## Composition
columns: single
axis: radial
symmetry: mirrored
hero_zone: full-bleed
density: measured
rhythm: syncopated
shell_posture: standard
field_ratio: drenched
collapse: hero-only
hero_object: figure

## Composition Rationale
I moved hero_object off the mandate's start (statement) to figure, which the mandate discourages, because today the date IS the event: 11.11 is Armistice, the eleventh hour of the eleventh day, so the number earns marquee and "Veterans Day" captions it. Symmetry mirrored is literal, the two elevens reflect across the brass dot. I moved columns to single and hero_zone to full-bleed (off the three/lower-third start) because a drenched memorial figure wants one centered field and nothing beside it; the rest holds on the mandate's suggestions (radial, measured, syncopated, standard, drenched, hero-only).

## Mobile
carrier: The mirrored 11.11 still centers the fold at 360, the brass dot holding the axis, with "Veterans Day" beneath it.
first_fold: The figure 11.11, the hero phrase "Veterans Day" as its caption, and the standfirst line.
order: hero figure + Veterans Day caption + standfirst, work index, site callout, signal strip
hero_step_360: hero
nav_360: Top bar holds the mark at left and the "Index" word at right; links reveal on tap.

## Chassis
dm-serif-public

## Visual Specification
### 1. Color Specification
- **Primary hue**: 218° service navy. Reasoning: the Color Mandate's 40–80° target sits inside its own forbidden 0–124° band (recent builds drowned in gold: 46°, 48°, 48°, 22°, 14°), so a fresh warm hue isn't available. 218° is in the non-forbidden 188–228° window, it's the flag/remembrance color a Veterans Day page wants, and it sits far from the recent gold cluster. The mandated warm hue survives as the brass accent, not the field.
- **Neutral palette (navy-tinted cool)**: 50 `#f1f5fb`, 100 `#d6e3f1`, 200 `#aec8e3`, 300 `#7aa2cf`, 400 `#4a7cb8`, 500 `#2a5e9c`, 600 `#1f4a7d`, 700 `#16365c`, 800 `#102743`, 900 `#0a1a2e`
- **Accent color (medal brass)**: light `#eecd7f`, default `#e3b354`, dark `#cf9a33`, glow `#eecd7f`
- **Secondary accent**: brass is the only accent; used as the gold point between the elevens, hairlines, and the one warm mark.
- **Background**: page bg `#16365c` (the drench field), card/surface bg `#1f4a7d`, second ground / footer flood `#102743`
- **Text colors**: primary text `#f1f5fb`, secondary text `#aec8e3`, muted/faint text `#7aa2cf`

### 2. Typography
- **Hero phrase rendering**: The hero OBJECT is the figure `11.11`, set in the `display` face (DM Serif Display) at the `hero` clamp, outlined/engraved, centered, the dot between the pairs flooded brass as the mirror axis. The hero PHRASE "Veterans Day" steps down to `4xl`, roman, directly beneath the figure as its caption and the page's single h1.
- **Type treatment**: `hero` for the figure (engraved outline); `4xl` for the hero phrase caption; `lede`/`xl` for the standfirst "The eleventh hour of the eleventh day of the eleventh month."; `base` for the honor-note and body; `sm` for the signal strip; `2xs` tracked for micro labels. Spend the middle: the standfirst and section head keep the page off the two-size cliff. Body measure held 60–70ch, leading at the ramp's body step.

### 3. Layout Specification
- **Composition**: single / radial / mirrored / full-bleed / measured / syncopated / standard / drenched / hero-only / figure. A single centered figure that mirrors across its own dot wants one column, a radial center, and the navy flooding full-bleed behind it; nothing competes with the date.
- **CSS grid/flex structure**: hero `display: grid; place-items: center; min-height: 100vh` single column; below, `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` for the work index; footer strip `display: flex; flex-wrap: wrap; justify-content: space-between`.
- **Major dimensions**:
  - Hero/featured area height: `min-height: 100vh`, drenched `#16365c`
  - No sidebar.
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 96px)`; body blocks inset to ~66ch.
  - Section padding: `clamp(48px, 8vh, 112px)` vertical.
- **Nav placement**: thin top bar, 64px, on the navy drench. stacked-md mark at left (white disc carries), single title-case word "Index" at right revealing Work / About / Contact. Not the rejected wordmark-left / links-right bar.
- **Hero phrase grid zone**: figure `11.11` occupies the centered cell, rows center, roughly the middle 60% of the viewport at `clamp(96px, 12.5vw, 160px)`; "Veterans Day" sits directly below at `4xl`; standfirst below that.
- **Home callout slot**: `<SiteCallout />` sits below the work index and above the footer signal strip, between those two sections, full width in `bgAlt` `#102743`.

### 4. Component Character
- **Border radius**: cards `2px` (sm), buttons `4px` (md), tags `2px`. Minimal, dignified.
- **Border treatment**: hairline `border` `#2a5e9c`; emphatic rules `borderStrong` `#4a7cb8`; the one brass hairline under the figure uses accent `#e3b354`.
- **Shadow**: none. Depth comes from surface lightness (`#1f4a7d` over `#16365c`).
- **Density**: measured, spacious hero, quiet index below.
- **Interactive states**: links brighten toward `#f1f5fb` and show a brass `#e3b354` underline on hover.

### 5. Signal Integration
- **Where signal elements live**: footer data strip, one ruled row in `field` `#102743`.
- **Sports scores**: Red Wings 2–3 loss, set in `sm` tabular figures, label in brass `#cf9a33`, score ink `#f1f5fb`.
- **Quote**: Schwarzenegger "Help others and give something back." set as a small attributed caption in the strip, author `Arnold Schwarzenegger` visible in `#aec8e3`. Not the hero.
- **Holiday**: Veterans Day is the hero; 11.11 is the figure.
- **Music**: My Morning Jacket, Radiohead, Tobin Sprout listed as "in rotation" in the strip, taste not event.
- **Other signals**: SPY 749.92, down 0.37%; Aldie VA, 51°F, sunny, calm; waxing crescent, 6.5% lit; Austin Championship, scheduled, all as tracked facts in the strip.

## Self-Check
1. Hero quotability: Yes — "Veterans Day" is a sanctioned signal-event holiday name carried as the caption of a poster-scale 11.11, legible and screenshot-worthy on the navy field.
2. Because-of chain: Yes — the mirrored date drives mirrored symmetry, centered radial single column, the drench, the engraved didone, and the brass axis-point.
3. Render feasibility: Yes — "11.11" is five glyphs at ≤160px, centered at 1440 with room to spare.
4. Canvas floor feasible: Yes — a full-bleed drench with a centered marquee figure fills ≥80% by construction.
5. Phone: Yes — at 360 the figure holds at the `hero` step (~110px), five glyphs fit inside the first fold without cutting, with "Veterans Day" beneath.

## Rationale
The phrase is "Veterans Day," carried by the figure 11.11, so the composition had to be a mirror. The two elevens reflect across the dot, which means the page reads from its center outward: single column, radial axis, mirrored symmetry, the figure full-bleed on a drenched field with nothing beside it to break the reflection. The one hero object is the date; everything else is caption, standfirst, and quiet evidence below the fold.

The chassis is DM Serif Display because a memorial date wants engraved, high-contrast letterforms, the voice of a monument or a plaque, not a signage grotesque. I set it outlined so the numerals read as cut into the field rather than pasted on it, and centred because the mirror demands it. It loads one display weight, so the treatment commits to regular and lets scale and the stroke carry the drama. The brass dot between the elevens is the still point the whole reflection turns on.

The palette deviates from the gold mandate on purpose: that mandate's warm target sits inside its own forbidden band after a week of gold builds, so I took the flag's color instead. Service navy drenched across the full viewport is the committed gesture the gold standard asks for, the warm mandate hue preserved as a single medal-brass accent, which is exactly where gold belongs on navy. The shell is a thin standard top bar with the nav collapsed to one word so it reads as dignified chrome, not the rejected links-right pattern, and the signals, score, market, weather, moon, rotation, and the Schwarzenegger line with his name attached, sit in one ruled strip at the foot.
