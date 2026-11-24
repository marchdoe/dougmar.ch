# Signals Brief — 2026-11-24

## Hero Copy
Clear all day, full moon all night.

## Hero Rationale
Two signals carry the day with no hype: the sky is genuinely sunny and cloudless at 44°F, and the moon is a full moon at 99.4% illumination with sunset at 4:45. The line is a plain observation of a cold, bright late-November Tuesday, the kind of thing you'd say glancing up, and it reads as one continuous statement with a day-half and a night-half. It beats the Manson quote, which is abstract ("the desire for more positive experience is itself a negative experience") and not in Doug's concrete, numeric register. It beats another Lions or golf score, both of which the last two weeks already wore.
Owner's voice: Doug says exactly this, flat and literal, looking at a crisp day that stays clear through the afternoon and drops to a full moon when the sun sets at a quarter to five.

## Archetype
a day/night specimen split, the clear day and the full-moon night sharing one seam

## Composition
columns: two-equal
axis: horizontal
symmetry: mirrored
hero_zone: center
density: sparse
rhythm: accelerating
shell_posture: standard
field_ratio: field-dominant
collapse: split-to-sequence
hero_object: word

## Composition Rationale
The phrase is a timeline, morning read through to night, so I moved `axis` off the suggested `radial` to `horizontal`: the eye travels left (clear day) to right (full moon night) across the seam, which a radial center cannot stage. I moved `columns` off the suggested `three` to `two-equal` because the phrase has exactly two halves, and `collapse` off `hero-only` to `split-to-sequence` because a day/night split must survive at 360 as two stacked full-width panels or the relationship dies. The remaining axes (mirrored, center, sparse, accelerating, standard, field-dominant, word) sit on the mandate's suggestions and genuinely fit a two-panel poster.

## Mobile
carrier: The day/night contrast is carried by stacking the gold day panel over the umber night panel full-width, the seam becoming a horizontal break you scroll across.
first_fold: The gold day panel: "Clear" at hero scale, "all day," beneath it, and the weather caption (Clear, 44°F, sunset 4:45).
order: top bar, day panel (hero "Clear" + deck + weather), night panel (full moon + golf leaderboard + Thanksgiving note), signal index, work index, site callout, footer colophon
hero_step_360: 5xl
nav_360: The two-tier bar collapses to the stacked mark at top-left and the numbered index as a single tappable "Menu" word that reveals 01/02/03.

## Chassis
fraunces-karla

## Visual Specification
**1. Color Specification**

- **Primary hue**: 45° (low-sun gold). This is the pale, warm gold of a late-November afternoon sun, inside the 40–80° mandate. It is the "clear all day" half of the phrase rendered as a ground.
- **Neutral palette** (warm, amber-tinted umber): 50 `#FBF4E6`, 100 `#F3E8D2`, 200 `#E5D3B3`, 300 `#CDB68E`, 400 `#9C835A`, 500 `#6B5636`, 600 `#4E3C20`, 700 `#3A2C15`, 800 `#2A1E0C`, 900 `#1A1206`.
- **Accent color** (ember terracotta): light `#E07B3A`, default `#9C3A0E`, dark `#6B2608`, glow `#F2A96B`.
- **Secondary accent**: the ember family above is the only saturated accent; its glow `#E07B3A` sits on the night field for the "full moon" pulse, its deep `#9C3A0E` marks on the gold.
- **Background**: page ground (day field) `#F7D98A`; card/raised surface `#FDF6E3`; night field (flooded panel) `#2A1E0C`; callout band `#F3E8D2`.
- **Text colors**: primary ink `#1A1206`; secondary `#4E3C20`; faint `#6B5636`; on the night field, primary `#FBF4E6`, muted `#E5D3B3`.

**2. Typography** (fraunces-karla)

- **Hero phrase rendering**: `hero_object: word`. The word **Clear** is set in the `display` face (Fraunces) at the `hero` marquee clamp, roughly 144px at 1440, mixed case, roman, heavy, flush left in the day panel. The rest of the phrase, "all day, full moon all night," is the deck at the `3xl` step: "all day," closes the day panel, "full moon all night" opens the night panel in warm cream. The complete phrase is the one h1.
- **Type treatment**: hero word at `hero`; phrase deck at `3xl`; the night-panel leaderboard header and work-index titles at `xl`/`2xl` (the mid-register the owner demands); place/date/weather caption at `sm`; body and leaderboard rows (Karla) at `base`, held to 60–68ch and 1.5 leading; micro labels at `xs` in letterspaced small caps. No step jumps straight from hero to body.

**3. Layout Specification**

- **Composition**: `two-equal / horizontal / mirrored / center / sparse / accelerating / standard / field-dominant / split-to-sequence / word`. The phrase is a day-to-night timeline, so the canvas splits into two equal fields reflecting across a central vertical seam: left is the clear gold day, right is the umber full-moon night, and the hero word anchors the seam at center.
- **CSS grid structure**: `display: grid; grid-template-columns: 1fr 1fr; min-height: calc(100vh - 120px)` for the hero split. Below it the night-panel signal index and work index are `grid-template-columns: repeat(12, 1fr)` with content on spans.
- **Major dimensions**:
  - Hero split: `min-height: calc(100vh - 120px)`, each panel full-bleed to its half.
  - No fixed sidebar. `max-width: none`; side padding `clamp(24px, 5vw, 88px)` per panel.
  - Section padding accelerates downward: hero panels `88px`, signal index `64px`, work index `48px`, callout `0` (full band), footer `56px`.
- **Nav placement**: top bar, full width, 120px tall, two tiers: stacked lockup left on tier one, a full-width numbered index (01 Work / 02 About / 03 Contact) on tier two above a `borderStrong` hairline.
- **Hero phrase grid zone**: "Clear" occupies the left panel, rows centered, baseline reaching toward the seam (col 1 of 2, vertical center); "all day," beneath it; "full moon all night" in the right panel, upper-center, cream on umber.
- **Home callout slot**: `<SiteCallout />` sits below the work index and above the footer, between the work index and the footer colophon, full width, on `bgAlt`. I place it only; I write none of its copy.

**4. Component Character**

- **Border radius**: cards/panels `4px` (md), tags `2px` (sm), the mark/full `9999px`. No large rounded corners.
- **Border treatment**: hairlines in `border` on the gold field, `fieldBorder` inside the night panel, `borderStrong` for the header rule and section breaks.
- **Shadow**: none. Depth comes from the gold/umber value split, not elevation.
- **Density**: spacious up top (sparse hero), tightening into the signal and work indexes.
- **Interactive states**: links underline on hover in `accent`; work-index rows shift ink to `accent` on hover, no motion on the hero.

**5. Signal Integration**

- **Where signals live**: the night (umber) panel and a signal index directly below the hero split.
- **Sports scores**: golf leaderboard in the night panel, tabular-nums, cream rows with the leader's `-17` in ember glow `#E07B3A`: "RSM Classic, Final. Penge −17. Thorbjornsen, Li, Greyserman −16." Lions line beneath in the index: "Lions 31, Bears 21."
- **Quote**: Mark Manson's line is NOT the hero. It sits as a small attributed pull-quote in the footer colophon, `textMuted`, author "Mark Manson" visible beneath.
- **Holiday**: "Thanksgiving, Thursday." as a quiet note in the night panel near the moon line.
- **Music**: Wet Leg, Tobin Sprout, My Morning Jacket as a rotation line in the footer colophon, labeled "In rotation," never presented as an event.
- **Full moon**: caption under "full moon all night" in the night panel: "99.4% lit." Weather caption in the day panel: "Aldie, Virginia. Clear. 44°F. Sunset 4:45." Market as a muted ticker in the signal index: "SPY 722.29, +4.71%."

## Self-Check
1. Hero quotability: Yes — "Clear all day, full moon all night." is a parallel, self-contained observation you'd screenshot, not a label.
2. Because-of chain: Yes — the day/night phrase drove the split field, the split drove two-equal + horizontal + split-to-sequence, the warm calm mood drove Fraunces and the gold/umber palette.
3. Render feasibility: Yes — Fraunces hero clamp (~144px at 1440) sets the five-letter word "Clear" in a half-width panel with room to spare.
4. Canvas floor feasible: Yes — two full-bleed color fields fill the viewport; field-dominant easily clears 80%.
5. Phone: Yes — at 360 the split stacks to gold-over-umber panels and "Clear" at `5xl` (≈72px) fits the first fold without cutting the word.

## Rationale
The hero is a composed weather-and-sky observation, "Clear all day, full moon all night," chosen because it is the one thing about this cold bright Tuesday that is both true and quotable, and it is said in Doug's register: flat, concrete, two parallel halves, no adjectives doing work. It carries a day-half and a night-half, and that duality is the entire compositional engine.

Because the phrase is a day-to-night timeline, the canvas splits into two equal fields reading left to right: a soft low-sun gold panel for the clear day, a deep umber panel for the full-moon night, mirrored across a central seam where the hero word "Clear" is anchored (two-equal, horizontal, mirrored, center, field-dominant). The word earns marquee scale as the object while the rest of the phrase distributes across the two panels as the deck. At 360 the split honestly becomes a sequence, gold over umber, with "Clear" holding the first fold. The chassis is Fraunces (fraunces-karla): its fat, soft display serif is the one voice whose warmth matches a calm sky observation rather than shouting it, and it is fresh (just outside the avoid list), set mixed case, roman, heavy, left, with no texture, all fresh treatment choices.

The palette is a committed warm split-field inside the 40–80° gold mandate: pale November gold as the daylight ground, deep amber-tinted umber as the night field, and a single ember terracotta accent carrying marks and the moon-glow line. Tinted neutrals lean warm so the gold and the ink share a skeleton. The top-bar masthead gives the owner the first-class header he has asked for three ratings running, arranged as a two-tier index to stay clear of the rejected wordmark-left/links-right pattern, with a single-color mark (the original fails 3:1 on bright gold) sitting inside the first fold at both widths. Motion holds still on the hero (a poster that arrives formed) with sections rising on scroll below.
