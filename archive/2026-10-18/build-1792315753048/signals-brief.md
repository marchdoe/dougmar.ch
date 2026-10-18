# Signals Brief — 2026-10-18

## Hero Copy
Red Wings edge it, 4–3

## Hero Rationale
Detroit won 4–3 last night, and a Detroit win is the single signal this morning that is unambiguously Doug's: he lists the Lions, Tigers, Pistons and Red Wings by name and he states scores flat. I avoided the quote lane (used three days running) in favor of a composed score line, with the margin itself made the object. The previous hockey hero ("Red Wings take it, 5–3") was a different score on a different night; this one is a one-goal game, so the phrase carries the tension of a close win rather than a comfortable one.
Owner's voice: Doug would say this because a score is a score, and the Red Wings are his.

## Archetype
a cold-rink scoreboard rendered in neon didone

## Composition
columns: single
axis: horizontal
symmetry: left-weighted
hero_zone: upper-left
density: sparse
rhythm: accelerating
shell_posture: marginal
field_ratio: type-dominant
collapse: rail-to-band
hero_object: figure

## Composition Rationale
A final score reads left to right and wants one planted object, so single/horizontal/figure with the margin upper-left serves the phrase directly. I moved `collapse` off the mandate's `reorder` to `rail-to-band` because the marginal left-rail posture genuinely has a rail, and the honest 360 move is to drop that spine into a band rather than resequence a page that already leads with its figure. Everything else sits on the starting tuple because a sparse, type-dominant, accelerating poster is exactly what a one-number hero needs; the figure object itself is the break from eight statement days.

## Mobile
carrier: The outlined neon 4–3 still carries at 360; the left rail folds into a full-width band beneath the mark.
first_fold: The figure 4–3 and its caption "Red Wings edge it, 4–3".
order: header band (mark + nav), figure 4–3, hero caption, deck, selected work, site callout, footer data strip
hero_step_360: 5xl
nav_360: The left rail becomes a full-width band under the mark; Work / About / Contact inline, small-caps, chartreuse on near-black.

## Chassis
dm-serif-public

## Visual Specification
### 1. Color Specification
- **Primary hue**: 80° (acid chartreuse). The color mandate forbids 0–78° and 82–188°, leaving a narrow warm window at 78–82°; 80° is the sharpest cold-bright warm available and reads as low winter sun, matching a 38°F clear AQI-1 morning and a one-goal win better than any literal team red would.
- **Neutral palette** (warm-black, tinted toward 80°): 50 `#FAFAF2`, 100 `#F0F0E4`, 200 `#D9D9C8`, 300 `#BABAA6`, 400 `#94947E`, 500 `#6E6E58`, 600 `#4E4E3C`, 700 `#333327`, 800 `#1C1C13`, 900 `#0D0D08`
- **Accent color** (chartreuse): light `#D4F56B`, default `#B9E532`, dark `#8FB81E`, glow `#E6FF9E`
- **Secondary accent** (ice blue): `#52A5E0` — used only for the losing numeral's outline and the cold-weather readout, never as a second brand voice.
- **Background**: page bg `#0D0D08`, card/surface `#333327`, rail/bgAlt `#1C1C13`
- **Text colors**: primary `#FAFAF2`, secondary (muted) `#BABAA6`, faint `#94947E`

### 2. Typography
- **Hero phrase rendering**: The figure `4–3` is the object, set in `display` (DM Serif Display) at the `hero` step as a fluid clamp, outlined (stroked) acid-chartreuse on near-black like a neon rink scoreboard. The hero phrase proper, "Red Wings edge it, 4–3", sits one step down at `3xl` as the figure's caption, mixed case, roman. The deck "One goal in it." runs at `lede`.
- **Type treatment**: `hero` for the figure; `3xl` for the caption line (the h1); `lede` for the deck and the work-index standfirst; `base` Public Sans for body and rows at 1.5 leading, 62–66ch; `sm` for the rail nav and row metadata; `xs` for the footer data strip. At least three registers between the 160px figure and the body so no page is "big number, then default text."

### 3. Layout Specification
- **Composition**: single / horizontal / left-weighted / upper-left / sparse / accelerating / marginal / type-dominant / rail-to-band / figure. One column reads left to right as a scoreboard line; the figure hangs upper-left on the rail and everything else accelerates beneath it. The horizontal read serves a score.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 96px 1fr;` the 96px left column is the rail; the 1fr column holds figure, caption, deck, work index.
- **Major dimensions**:
  - Hero/figure area: `min-height: 82vh`
  - Left rail width: `96px` at 1440
  - Max content width: `max-width: none`, side padding `clamp(24px, 6vw, 112px)`
  - Section padding: intervals shrink descending (accelerating) — 160px under the figure, 112px, 72px, 48px between later rows
- **Nav placement**: left rail (marginal). Mark at the top of the rail, Work/About/Contact stacked as a vertical index below it, one hairline per row.
- **Hero phrase grid zone**: figure occupies rows 1–2, column 2, upper-left of the field, `clamp(96px, 14vw, 160px)`. Caption directly beneath, same column, `3xl`.
- **Home callout slot**: on `/`, place `<SiteCallout />` below the selected-work index and above the footer data strip, between those two sections, full width of column 2. No copy or styling from me.

### 4. Component Character
- **Border radius**: cards `0`, tags `2px` (sm), buttons `4px` (md)
- **Border treatment**: hairline `border` rules between work rows; `borderStrong` above the footer strip. Borderless cards; separation by value, not box.
- **Shadow**: none. Depth comes from surface value on the dark void.
- **Density**: spacious up top, tightening downward.
- **Interactive states**: nav links shift from `textMuted` to `accent` on `_hover`; work rows reveal a chartreuse underline on hover; targets ≥44px tall.

### 5. Signal Integration
- **Where signal elements live**: the Red Wings score IS the hero figure. Everything else lives in the footer data strip and a small reading index.
- **Sports scores**: `4–3` at `hero` scale, outlined didone, the `4` filled chartreuse (the win) and the `3` outlined in ice blue (`#52A5E0`) — the margin made visible.
- **Quote**: Les Brown's line sits as a quiet attributed footnote in the colophon strip, small, `textMuted`, with "Les Brown" visible. Not the hero.
- **Holiday elements**: none today.
- **Music**: Guided by Voices, Radiohead, Tobin Sprout as an "On rotation" line in the footer strip, taste not event, set apart from the score and the market close.
- **Other signals**: footer data strip carries Aldie VA / 38°F clear / AQI good / first-quarter moon (54%) / SPY 763.25, down 1.1% / Butterfield Bermuda, on the tee. The standing design-reading sidebar renders as a compact index above the footer.

## Self-Check
1. Hero quotability: Yes — "Red Wings edge it, 4–3" is a flat, screenshottable score line, not a description.
2. Because-of chain: Yes — close win → figure object → dark void → neon chartreuse at the only open warm hue → didone outline → scoreboard read.
3. Render feasibility: Yes — `4–3` is three glyphs; dm-serif-public tops out at 160px and clamps to fit 1440 without overflow.
4. Canvas floor feasible: Yes — a sparse type-dominant poster at 66% is honest for a figure-led void with a work index below.
5. Phone: Yes — at 360 the figure sets at `5xl` (72px), three glyphs well inside the first fold, no word cut.

## Rationale
The phrase is a one-goal Detroit win, "Red Wings edge it, 4–3", so the score is the object. A `figure` composition lifts `4–3` to poster scale and lets the words caption it, which is the break from eight straight statement days and the honest shape for a number that is the news. Single column, horizontal read, left-weighted on a rail: a scoreboard is read left to right, and the margin is the whole story of a one-goal game.

Because the object is a score glowing against a cold morning, the ground is a near-black void and the material is a slow-drifting mesh, the dawn glow behind a rink board. The accent had to be warm by mandate, and the only warm the forbidden zones leave open sits at 80°, an acid chartreuse that reads as low winter sun on a 38° clear day rather than as a reflex red; the ice-blue second voice outlines the losing numeral so the margin is visible, not just stated. The chassis is dm-serif-public, a high-contrast didone, chosen for productive tension: a fashion-editorial treatment of a blue-collar hockey score, rendered outlined like a neon board, which no recent build has used.

Layout serves the figure: the rail carries a mark-only lockup and a stacked nav index so the field stays type-dominant, the intervals accelerate as the work index drops beneath, and at 360 the rail folds into a band so the figure still leads the first fold. The hero holds perfectly still (entrance none) because a final score is settled; the life lives in the drifting ground and the scroll reveals below.
