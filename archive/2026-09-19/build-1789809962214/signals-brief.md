# Signals Brief — 2026-09-19

## Hero Copy
Closing the gap between what gets designed and what gets built.

## Hero Rationale
This is lifted verbatim from Doug's voice file, where it sits at the top of "Who I am." It is his entire job in one sentence, plainspoken and quotable on its own, and it answers five ratings running that asked for his own words with the brand visible up top instead of another stranger's quote. The poster word is GAP: the smallest thing in the sentence rendered as the biggest object on the page, the same productive irony as the fairway-split gold standard, and the deck states the gap closed. Owner's voice: it's the sentence I use to explain what I do, design and build as one job.

## Archetype
A blueprint specimen: one word drawn, not shouted.

## Composition
columns: two-asymmetric
axis: horizontal
symmetry: broken
hero_zone: edge-bound
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: type-dominant
collapse: split-to-sequence
hero_object: word

## Composition Rationale
Invoking the Max-Risk License to land `axis: horizontal`, a value the Composition Mandate soft-forbade (avoid: horizontal). The hero is literally about a horizontal distance being closed between two poles, design and build, so a horizontal axis with the page split into a DESIGNED field and a BUILT field, an oversized column-gap as the seam, is the one reading the phrase demands. `hero_zone` moved from the suggested upper-left to `edge-bound` so GAP spans margin to margin and the justified tracking makes the gap physically visible; `shell_posture: none` keeps the poster clean with the mark folded into the hero and links in-content.

## Mobile
carrier: With the desktop side-by-side split gone, GAP leads and the DESIGNED field stacks directly above the BUILT field; adjacency keeps the two poles the phrase is about facing each other.
first_fold: The word GAP at `hero`, then the full deck "Closing the gap between what gets designed and what gets built."
order: mark, GAP + deck, designed field, built field, golf leaderboard, footer ledger
hero_step_360: hero
nav_360: no bar; mark top-left at ~44px; work / about / contact as one lowercase in-content sentence at the base of the built field.

## Chassis
unbounded-figtree

## Visual Specification
### 1. Color Specification
- **Primary hue**: 162° (pine/emerald-teal). Chosen inside the 140–180° mandate at the green edge so it harmonizes with the brand mark's green-and-blue and reads as craft/engineering, not decoration.
- **Neutral palette (sage, tinted 162°)**: 50 `#f4f7f5`, 100 `#e7eeea`, 200 `#cdddd4`, 300 `#a7bfb2`, 400 `#7a9788`, 500 `#566d60`, 600 `#405349`, 700 `#2f3e37`, 800 `#1e2a24`, 900 `#111a15`
- **Accent color (pine)**: light `#2fb381`, default `#0a7d54`, dark `#0a6244`, glow `#63cfa2`
- **Secondary accent**: none. One hue carries the page.
- **Background**: page bg `#f4f7f5`, card/surface `#ffffff`, deep flooded field (footer band + zone labels) `#0b4c37`
- **Text colors**: primary `#111a15`, secondary `#405349`, muted/faint `#566d60`; in-content links `#0a6244`

### 2. Typography (chassis: unbounded-figtree)
- **Hero phrase rendering**: The word **GAP** is the object at `hero` (fluid clamp), set in Unbounded caps, **outlined** (thick 3–4px pine strokes, hollow counters showing the pale sheet and dot grid through them). It runs `edge-bound` and `justified` so the three glyphs stretch to both margins and the tracking gaps between them are literal. The full phrase sits beneath GAP as the deck at `3xl`, Figtree.
- **Type treatment**: use the ramp's `hero` for GAP, `3xl` for the deck, `xl` for the DESIGNED / BUILT zone heads, `lg` for the leaderboard title, `base` for evidence rows and body, `sm`/`xs` for the footer ledger and metadata. Numbers use `tabular-nums` everywhere they align (scores, leaderboard, market). At least three mid-scale steps live between GAP and body so no page jumps title-to-caption.

### 3. Layout Specification
- **Composition**: `two-asymmetric / horizontal / broken / edge-bound / measured / interrupted / none / type-dominant / split-to-sequence / word`. The phrase is about a horizontal distance between two poles, so the axis is horizontal and the page below GAP is genuinely split into a wide DESIGNED field and a narrower BUILT field; the seam between them is the one interruption in the rhythm, the caesura the phrase names.
- **CSS structure**: hero band `display: grid; grid-template-columns: 1fr` full-bleed for GAP; body `display: grid; grid-template-columns: 1.6fr 1fr; column-gap: clamp(48px, 8vw, 120px)` (the gap column-gap is deliberately oversized).
- **Major dimensions**:
  - Hero band `min-height: 62vh`, GAP spanning full width edge to edge.
  - No sidebar; the BUILT column is `1fr` of the body grid, not a fixed rail.
  - `max-width: none`; side padding `96px 6vw`.
  - Section spacing on the chassis base unit; zone labels get 2× space above vs below.
- **Nav placement**: no header bar. The original green-and-blue mark sits top-left of the hero field at 52px. Work / about / contact appear only as lowercase in-content links in one sentence at the base of the BUILT column.
- **Hero phrase grid zone**: GAP occupies the hero band, rows 1–2, full 12 columns, edge to edge; deck rows 3–4 hung off the left rail; at ~27vw the word reaches roughly 388px at 1440.

### 4. Component Character
- **Border radius**: cards/panels 4px, buttons/tags 2px, mark untouched. Tight, drawn, engineered.
- **Border treatment**: hairline `border` on ledger and leaderboard rows; `borderStrong` for the seam rule between DESIGNED and BUILT; deep field band uses `fieldBorder`.
- **Shadow**: none. Depth comes from value (white surface vs sage bg), not shadow.
- **Density**: measured. Rows breathe; the one oversized gap does the punctuation.
- **Interactive states**: links shift to `accent` and gain a 2px underline on hover; leaderboard rows tint `bgAlt` on hover.

### 5. Signal Integration
- **Golf**: Biltmore Championship (In Progress) is a live evidence index in the BUILT column, tabular, Neal Shipley -15 top; every under-par figure set in pine accent, tabular-nums.
- **Sports scores**: Tigers 11–8 (win) and Lions 31–41 (loss) stated flat in the footer ledger, tabular, no adjectives, the win figure in accent.
- **Quote**: the Brinkley line is a single quiet footnote in the footer, attributed, never the hero.
- **Holiday**: none today.
- **Music**: Wet Leg and My Morning Jacket noted as "in rotation" in the footer, taste, not an event beside a score.
- **Market/weather/moon/air**: SPY 761.69 (+0.13%), 61.9°F partly cloudy, first-quarter moon (59%), AQI good, set as tabular ledger rows across the deep-green footer band.

## Self-Check
1. Hero quotability: Yes — it's Doug's own one-sentence definition of his work, quotable standing alone.
2. Because-of chain: Yes — word GAP → horizontal split of designed/built → blocky Unbounded that renders GAP as architecture → pine-on-pale blueprint palette → edge-bound justified hero.
3. Render feasibility: Yes — three caps at clamp(140,27vw,400) span the width without overflow at 1440×900.
4. Canvas floor feasible: Yes — an edge-bound word plus a two-field split and footer band fill 72% comfortably.
5. Phone: Yes — GAP is three letters; at `hero` on 360 it lands whole inside the first fold above the deck.

## Rationale
The phrase is Doug's, verbatim: "Closing the gap between what gets designed and what gets built." It is the first thing he says about himself and it answers the repeated rating note to lead with his own words and the brand, not a stranger's quote. The one word that carries it is GAP, so the object on the page is a word, not another eyebrow-statement-deck poster. GAP is rendered as the largest thing on the page, the word for a small distance made enormous, the same productive irony the owner rated as a high-water mark in the fairway split.

Because the phrase is about a horizontal distance between two poles, the composition splits the page below GAP into a wide DESIGNED field and a narrower BUILT field with an oversized gap between them, the caesura the rhythm names. That needs a face that reads as built, blocky, architectural, so the chassis is unbounded-figtree, a wide geometric display off the three recently-worn faces and outside the last three builds; GAP set in outlined caps, justified edge to edge, becomes a blueprint of the word being drawn, hollow strokes showing the sheet through them. Figtree answers as a warm neutral grotesk for the deck, evidence rows and dense leaderboard, sharing the geometric skeleton.

The palette is a light-ground specimen: a pale sage sheet tinted toward the pine accent, ink-dark green content, one committed pine hue at 162° inside the 140–180° mandate. It is a green edge that harmonizes with the brand's own green-and-blue, which is why this is the honest day to bring the original mark back rather than a mono variant sinking into a flood. Ground strategy is light-ground, fresh against the recent split-field, drench and duotone run, with a faint accent dot grid for the engineering-graph register. The entrance wipes left to right, literally closing across the field, and the deep-green footer band states the Tigers win, the Lions loss and the day's signals flat, tabular, with the Brinkley line as one quiet footnote.
