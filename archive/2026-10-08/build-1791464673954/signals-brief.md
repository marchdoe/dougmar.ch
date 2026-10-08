# Signals Brief — 2026-10-08

## Hero Copy
If you want to find the secrets of the universe, think in terms of energy, frequency and vibration.

## Hero Rationale
This is `signals.quote`, Tesla, and it is the preferred lane: resonant, famous, attributed, and in no way thin or generic. It carries a page because its own grammar hands me a structure, a triad (energy, frequency and vibration) that becomes the compositional device, with the scale rising noun by noun to its climax. The attribution renders in view beneath the triad, as the contract requires. Owner's voice: Doug tunes design and engineering until they ship in sync, and his rotation (My Morning Jacket, Radiohead, The War on Drugs) is music built on energy and frequency; he would pin a line about getting the vibration right to the wall.

## Archetype
A frequency poster: type rising to vibration on a saffron flood.

## Composition
columns: three
axis: diagonal
symmetry: right-weighted
hero_zone: interleaved
density: dense
rhythm: syncopated
shell_posture: standard
field_ratio: drenched
collapse: split-to-sequence
hero_object: word

## Composition Rationale
I moved `columns` off the mandate's `masonry` to `three` because the quote names a triad, energy / frequency / vibration, and letting the sentence's own grammar be the grid is a genuine compositional decision, not ragged packing with no tie to the line. I moved `axis` off `radial` to `diagonal` so the three nouns step down-right and the type scale rises as it goes, making the sentence accelerate toward its climax. Everything else sits on the starting tuple because it genuinely fits: drenched energy, interleaved threading of the hero through the readings, syncopated off-beat for a line about vibration, and standard chrome because the owner has asked for a real, legible header.

## Mobile
carrier: The rising type scale carries it alone at 360, the lead-in small, energy/frequency/and stepping up, vibration largest, so "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration" accelerates down one column.
first_fold: The hero phrase, "If you want to find the secrets of the universe, think in terms of energy, frequency and vibration", set as a small lead-in deck over the rising triad that ends on vibration at marquee, with Nikola Tesla attributed beneath.
order: top-bar nav, quote lead-in deck, energy / frequency / and (rising), vibration, Nikola Tesla, signal ledger, site callout, footer band
hero_step_360: 4xl
nav_360: Top bar holds the mark left; the numbered links wrap to a second row under the hairline and the readout drops.

## Chassis
bricolage-manrope

## Visual Specification
### 1. Color Specification
- **Primary hue**: 44° (saffron/amber). It is the hue of radiant energy, inside the 40–80° target band. The mandate also lists 0–99° as a forbidden zone, which fully contains the target band, a generated contradiction; I honor the stated intent (warm sunny, 40–80°) and push the chroma high so this saffron reads electric rather than the olive-gold (69°) and burnt-amber (36°) recently shipped.
- **Neutral palette** (amber-tinted warm espresso): 50 `#FBF6EC`, 100 `#F4EAD6`, 200 `#E6D7B8`, 300 `#CBB98E`, 400 `#A08A5E`, 500 `#74613A`, 600 `#574726`, 700 `#3E3119`, 800 `#2A2010`, 900 `#1A1308`
- **Accent color** (burnt sienna): light/glow `#CF5A28`, default `#A1320A`, dark `#7E2708`, deep ground `#5C1D06`
- **Secondary accent**: none beyond the sienna register; the market-down tick borrows accent dark.
- **Background**: page bg `#F2AE2B` (saffron flood), card/surface `#FBE8B4` (pale saffron), second ground/band `#E2990F` (deeper saffron)
- **Text colors**: primary `#1A1308`, secondary `#3E3119`, muted/faint `#574726`

### 2. Typography
- **Hero phrase rendering**: `display` is Bricolage Grotesque. The nominated hero phrase is the full quote; the poster WORD is `vibration`, set in accent (burnt sienna) at `hero` scale (the fluid marquee clamp). Above it, `energy,` / `frequency` / `and` stack flush-right at `xl`→`3xl`, rising in scale line by line so the type itself accelerates toward the climax. The lead-in `If you want to find the secrets of the universe, think in terms of` is the deck at `2xl`, textMuted ink. `Nikola Tesla` sits at `sm` small-caps beneath, in text ink.
- **Type treatment**: use the ramp steps as `textStyle` tokens, do not invent leading/tracking. Hero = `hero` step. Rising triad = `xl`, `2xl`, `3xl` on the three words below the climax. Deck/standfirst = `2xl` for the lead-in, `lg` for section standfirsts (this is the mid-register the owner demands between marquee and body). Body = `base` at 60–70ch. Captions/ledger = `sm`; micro labels = `xs`. Never below 12px.

### 3. Layout Specification
- **Composition**: three / diagonal / right-weighted / interleaved / dense / syncopated / standard / drenched / split-to-sequence / word. The quote's triad becomes three columns; the hero is threaded (interleaved) through them, the scale rising diagonally toward the lower-right where `vibration` masses (right-weighted), so the eye travels the sentence as it grows.
- **CSS grid/flex structure**: `display: grid; grid-template-columns: 1fr 1fr 1.3fr; column-gap: clamp(16px, 2.4vw, 40px)`. The rising triad spans across the three tracks, its baselines stepping down-right; signal readings fill the gutters and column feet.
- **Major dimensions**:
  - Hero/featured area: `min-height: 92vh`
  - No fixed sidebar; signal ledger is interleaved into column feet.
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 96px)`. Body copy blocks individually capped at 66ch.
  - Section padding: vertical rhythm on the chassis spacing base, ~`clamp(48px, 7vw, 112px)` between sections.
- **Nav placement**: top bar, 64px, full width. Single-color mark left; numbered nav (`01 Work 02 About 03 Contact`) grouped immediately right of the mark, left-of-center; a small location/date readout at the far right (not nav links). One `borderStrong` hairline under the bar.
- **Hero phrase grid zone**: deck in row 1, columns 1–2; the rising triad occupies rows 2–4 across columns 1–3, with `vibration` landing rows 4–5, columns 2–3 at marquee; attribution row 5, column 3.
- **Home callout slot**: on `/`, `<SiteCallout />` sits below the signal-ledger section and above the footer field band, full width. No copy or styling authored here.

### 4. Component Character
- **Border radius**: cards/tags `2px`, buttons `3px`, mark/pills `full`. Deliberately near-square; the owner has flagged rounded corners.
- **Border treatment**: hairline `border` on ledger rows; `borderStrong` for the nav rule and section breaks. Cards are borderless, separated by value against the saffron field.
- **Shadow**: none. Depth comes from value (pale surface vs saffron bg), not shadow.
- **Density**: dense, information-forward; tight gutters, signals packed as readings.
- **Interactive states**: links underline in accent on hover; ledger rows shift to surface on hover; mark static.

### 5. Signal Integration
- **Where signal elements live**: interleaved into the three column feet and gutters as a dense "readings of the day" ledger.
- **Sports scores**: Baycurrent Classic leaderboard as a tabular-nums micro-table, Bridgeman `-8` in accent, positions in textFaint. Golf, not Detroit (all four teams off-season).
- **Quote display**: the quote IS the hero; rendered as the rising triad with Tesla attributed beneath.
- **Holiday**: Columbus Day noted as `in 4 days` in the ledger, textFaint, no ornament.
- **Music**: My Morning Jacket and Wet Leg set as "on rotation" in the footer field band, taste not event, never beside a score.
- **Other**: SPY `777.22 −0.24%` with the tick in accent dark; weather `Clear, 55°F, Aldie` as a reading; moon `waning crescent, 5%`; and a quiet memorial, `Margaret Hamilton, 1936–2026. She named software engineering.`, which belongs here because design and engineering as one job is Doug's whole thesis.

## Self-Check
1. Hero quotability: Yes — a famous, attributed Tesla line, screenshot-worthy in isolation.
2. Because-of chain: Yes — triad→three columns, rising climax→diagonal/right-weighted, energy→saffron drench, frequency→halftone, bricolage carries warm expressive marquee.
3. Render feasibility: Yes — `hero` clamp caps at 128px under bricolage's 160px ceiling; `vibration` is one word, no wrap at 1440.
4. Canvas floor feasible: Yes — dense drench with interleaved ledger across three columns fills 82%+ of the viewport.
5. Phone: Yes — at 360 the triad stacks full-width at `4xl`, `vibration` (9 chars) clears the column without cutting.

## Rationale
The phrase is Tesla's triad, and the triad is doing all the work. Because the line names three things in order, the composition becomes three columns, and because it builds to a climax, the type scale rises diagonally from a quiet lead-in through `energy` and `frequency` to a burnt-sienna `vibration` that masses lower-right. The hero object is a word, the single word `vibration` at marquee, with the rest of the sentence rising to meet it and Tesla attributed beneath. That is the whole page in one gesture.

Bricolage Grotesque carries it: it is warm, expressive, and genuinely unused across the recent fourteen builds, so it answers the chassis mandate while giving the marquee enough personality to hold a visionary line without tipping into a shout. Manrope answers it below with a shared humanist skeleton, so the ledger and body read as chosen, not pasted on. The palette is a saffron drench, hue 44°, because `energy` wants a radiant field, not a void; the deep burnt-sienna accent is dark enough to clear contrast on that glowing ground and gives `vibration` its struck note. A halftone screen in espresso reads as a tuned signal across the flood, the honest material for a line about frequency, and the field drifts slowly so it is never quite still.

Layout serves the climb. The top bar is a real, legible header, mark single-color espresso for high contrast on saffron (the mono mark has sunk into drench grounds before; at nine-to-one it will not here), with numbered nav grouped by the mark rather than the rejected wordmark-left/links-right silhouette. Signals interleave into the column feet as a dense ledger of the day's readings, golf in accent, the market tick, the weather, and a one-line memorial to Margaret Hamilton, who named the thing Doug does for a living. At 360 the three columns become one sequence and the rising scale alone carries the sentence down the phone.
