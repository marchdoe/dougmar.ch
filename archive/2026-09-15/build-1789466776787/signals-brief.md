# Signals Brief — 2026-09-15

## Hero Copy
BOTH

## Hero Rationale
Doug's voice file says it plainly: "Deep in both. Not a generalist." The one word that carries it is BOTH, the crux of his whole pitch, design and engineering held at the same depth. It lands the week the sidebar is full of essays about taste mattering when the coding is "solved" and a London studio wins Awwwards for "craft before scale", so the day's mood argues for exactly Doug's differentiator. The full line rides as the deck; the standfirst is his own follow-on, "Design and engineering as one job, not two teams passing files."
Owner's voice: Doug wrote "Deep in both. Not a generalist." himself; it is his claim, not a stranger's quote or the machine's.

## Archetype
a type specimen for one word

## Composition
columns: two-asymmetric
axis: vertical
symmetry: broken
hero_zone: edge-bound
density: crowded
rhythm: interrupted
shell_posture: folded-into-hero
field_ratio: type-dominant
collapse: reorder
hero_object: word

## Composition Rationale
The phrase reduces to one word, so hero_object moves off the eight-day `statement` habit (and off yesterday's `artifact`) to `word`: BOTH is the largest thing on the page, the claim its deck. Symmetry goes to `broken` and hero_zone to `edge-bound` because an outlined word bleeding toward the field edge with a packed evidence rail off to one side is deliberately off-balance, not a centred poster. Density stays `crowded` honestly: the narrow rail carries the full work index, timeline, and every signal as ledger texture, filling the second column the way the owner asked instead of leaving a void beside the type.

## Mobile
carrier: the outlined word BOTH stacked over its deck carries the fold at 360; the two-column split becomes a single stack with the evidence rail reordered below the claim.
first_fold: the real mark top-left, the hero word BOTH, and the deck "Deep in both. Not a generalist." all inside the first 640px.
order: mark + numbered nav, hero word BOTH, deck, standfirst, work index, signals, footer figure band
hero_step_360: 4xl
nav_360: mark stays top-left; the three numbered links wrap to one row directly beneath it

## Chassis
anybody-franklin

## Visual Specification
### 1. Color Specification
- **Primary hue**: 205° deep azure. Chosen for "deep" (deep water, depth of practice) and to escape the recent warm/green run; the forbidden zones (0–80, 95–192, 235–295, 326–360) leave only 80–95, 192–235 and 295–326, and 192–235 azure is the freshest against last week's gold, red and emerald. It also rhymes with today's Awwwards winner, "AN OCEAN of IDEAS."
- **Neutral palette (cool slate)**: 50 #f4f7f9 · 100 #e7edf1 · 200 #d3dde3 · 300 #b3c2cb · 400 #8a9ba6 · 500 #66757f · 600 #4c5a62 · 700 #374349 · 800 #232c31 · 900 #141a1d
- **Accent color (azure)**: light #3d97c6 · default #0f6598 · dark #0d4f78 · glow #6fb6db
- **Secondary accent (marigold)**: #e8961f, used only on the two winning scores (Lions 31–30, Tigers 6–5) and their margin marks. Complementary spark against the azure; signal contrast only.
- **Background**: page bg #f4f7f9 · card/surface #ffffff · footer field band #103f5f (deep azure knockout)
- **Text colors**: primary #141a1d · secondary #4c5a62 · muted #66757f

### 2. Typography (anybody-franklin)
- **Hero phrase rendering**: `display` face (Anybody, wide squarish grotesk), the word BOTH set at `hero`/hero_scale in italic caps, stroked as outline in `accent`. The full phrase "Deep in both. Not a generalist." sits under it at `3xl` as the deck (solid ink), and the Doug standfirst "Design and engineering as one job, not two teams passing files." at `xl` fills the middle of the scale so no inner page jumps title-to-body.
- **Type treatment**: hero = `hero` step; deck = `3xl`; standfirst / section heads = `xl`; work-index rows and ledger = `lg`; body = `base` held at 60–68ch; micro labels = `sm` uppercase with 0.09em tracking. Rely on the ramp's per-step leading and tracking; don't invent values.

### 3. Layout Specification
- **Composition**: two-asymmetric / vertical / broken / edge-bound / crowded / interrupted / folded-into-hero / type-dominant / reorder / word. A wide left field carries the edge-bound outlined BOTH; a narrower right rail is the crowded evidence ledger (work index + timeline + signals). Two unequal columns literally stage "both": the claim and its proof, which answers the "empty column must be a decision" complaint by filling the rail with what belongs there.
- **CSS grid**: `display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.9fr); gap: 4vw;`
- **Major dimensions**:
  - Hero field min-height: `88vh`
  - Evidence rail width: `~34%` (min 300px)
  - Max content width: `none`; side padding `72px 5vw` at 1440, `28px 6vw` at 360
  - Section padding: vertical rhythm off the chassis base unit; band separations generous, ledger rows tight
- **Nav placement**: folded into the hero. Real mark top-left inside the first fold; three numbered links (01 02 03) beneath it. No top bar.
- **Hero phrase grid zone**: rows 1–3, column 1 (left field), BOTH bleeding toward the field edges; deck and standfirst rows 3–4 column 1; evidence rail column 2 rows 1–6. BOTH renders `clamp(96px, 22vw, 300px)`.

### 4. Component Character
- **Border radius**: cards 0, buttons 2px, tags 0. Hard corners (owner disliked rounding).
- **Border treatment**: hairlines in `border`; section breaks and the ledger head in `borderStrong`; inside the footer field use `fieldBorder`.
- **Shadow**: none. Depth comes from value (surface vs bg) and the azure field band.
- **Density**: hero field breathes; evidence rail is packed ledger texture. Crowded overall, honestly.
- **Interactive states**: nav and links shift to `accent` on `_hover` with a 1px azure underline; no motion beyond color.

### 5. Signal Integration
- **Where signals live**: the right rail and the footer figure-band.
- **Sports scores**: the weekend's two wins are the pulse. Lions 31–30 and Tigers 6–5 set as large tabular numerals in the footer band, the winning side and the one-point/one-run margin marked in `marigold`. Both are Doug's teams; two wins by a combined two runs/points.
- **Quote**: the Oprah line is not the hero and not shown as a poster; it appears as one small italic footnote in the footer, subordinate.
- **Holiday**: none today.
- **Music**: Tobin Sprout and My Morning Jacket set as a single quiet "On rotation" line in the rail, taste not event, no score treatment.
- **Other signals**: market SPY −0.45%, overcast 54°F, waxing crescent 19.5%, AQI good, 12.2h daylight, Biltmore Championship (scheduled) all as small tabular rail rows.

## Self-Check
1. Hero quotability: Yes — BOTH plus "Deep in both. Not a generalist." is a claim you could screenshot; it is Doug's own line.
2. Because-of chain: Yes — the word BOTH drives word-object composition, the wide Anybody specimen face, the azure-for-depth palette, and the claim/proof two-column split.
3. Render feasibility: Yes — a 4-letter word at up to 300px fits 1440 easily beside a 34% rail; no overflow.
4. Canvas floor feasible: Yes — the outlined word fills the left field and the crowded rail fills the right, clearing 78%.
5. Phone: Yes — BOTH at `4xl` (≈79px at 360) fits inside the first fold with the deck, no word cut.

## Rationale
The phrase is Doug's, not a stranger's and not the machine's: "Deep in both. Not a generalist." Five ratings running have asked for exactly this, his own words with the brand visible up top, and the day supports it, sidebar essays arguing that taste and craft matter once the coding is solved, and an Awwwards winner rewarded for "craft before scale." The one word that carries the claim is BOTH, so the object on the page is a word, not another eyebrow-statement-deck poster. That single decision drives everything: the word is the largest element, the full line is its deck, and Doug's follow-on runs the middle of the scale so the page does real typographic work.

Because a single wide word has to hold poster scale and stay Doug (sporty, confident, not editorial-serif costume), the chassis is anybody-franklin, a wide squarish grotesk with true italics, unused recently and off the three worn faces. Its display italic lets BOTH lean forward in outlined caps like a specimen sheet, while Libre Franklin answers as a body face sharing the same broad humanist construction. The palette follows the word's meaning: azure for depth, at 205° inside the only fresh band the forbidden zones allow (192–235), a clean escape from last week's gold, red and emerald. Ground is light, a cool near-white specimen sheet, which is the honest day to bring the real green-and-blue mark back, so brand_color_mode is original and it sits top-left in the first fold.

Layout answers the standing complaints directly. Two unequal columns stage the claim and its proof: BOTH edge-bound in the wide left field, a crowded evidence rail on the right carrying the work index, timeline and every signal, so no column reads as a failed void. The mark lives inside the first fold at 1440 and 360, and the reorder collapse leads the phone with the word before stacking the ledger. One marigold spark is held back for the weekend's two one-point Detroit wins in the footer figure band, Doug's teams, stated as scores; the Oprah line is a footnote, not a poster.
