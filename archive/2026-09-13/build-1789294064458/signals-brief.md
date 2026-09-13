# Signals Brief — 2026-09-13

## Hero Copy
TIGERS 11–7

## Hero Rationale
The Tigers took it 11–7 yesterday — a Detroit win is the one signal today that is unambiguously Doug's, not the machine's, and it passes the owner's test cleanly ("would Doug say this, about... Detroit"). It also plays to the owner's two A-grade gestures: the trophy-gold scoreboard flood and the fairway split-as-argument, both scoreboard/score-led. Stated as a signal-event, the score is quotable in isolation and demands marquee numerals. It breaks the quote streak the mandate flags and puts the subject back on Doug.

## Archetype
a stadium scoreboard reversed into the dark

## Composition
columns: single
axis: radial
symmetry: mirrored
hero_zone: center
density: sparse
rhythm: accelerating
shell_posture: standard
field_ratio: drenched
collapse: hero-only

## Composition Rationale
A scoreboard is radial and mirrored by nature — two numbers reflected across a dash, radiating from a single center — so I took the mandate's suggested radial/mirrored/sparse/accelerating/drenched and single directly. I moved hero_zone off the suggested `interleaved` to `center` because a score cannot be threaded through content without destroying the scoreboard read, and I moved shell_posture off the suggested `none` to `standard` because the owner has flagged "no brand in the first fold" three ratings running — `none` would repeat that exact failure. Collapse is `hero-only` (not the suggested `split-to-sequence`, which contradicts a single column and caused yesterday's rejection): the score alone is the phone's first fold.

## Mobile
carrier: The giant mirrored numerals "11–7" on the red field panel carry the page as one full-width scoreboard block.
first_fold: The hero "TIGERS 11–7" on the red field, with the corner mark top-left; nothing else.
order: hero, deck, box-score strip, work index, footer
hero_step_360: hero
nav_360: corner mark + wordmark stay top-left; work · about · contact collapse to one small-caps row above the footer

## Chassis
big-shoulders-atkinson

## Visual Specification
### 1. Color Specification
- **Primary hue** — 356° (deep saturated red). Chosen for triumph (a win → one saturated hue) and because red is genuinely a Detroit color (Red Wings), tying the hue to Doug's fandom rather than to a stock accent.
- **Neutral palette** (warm red-tinted "oxblood ash") — 50 `#FAF3F2`, 100 `#EFE3E1`, 200 `#D8C4C1`, 300 `#B89C98`, 400 `#8F6E69`, 500 `#6B4C48`, 600 `#4E3532`, 700 `#362321`, 800 `#241413`, 900 `#160A09`
- **Accent color** — light `#E4564C`, default `#D0281E`, dark `#85140E`, glow `#FF8A7A`
- **Secondary accent** — none. One hue carries the page.
- **Background** — page bg `#160A09` (warm near-black void), card/surface `#362321`, scoreboard field panel `#AE1A12` (saturated red plane)
- **Text colors** — primary `#FAF3F2`, secondary `#B89C98`, muted/faint `#8F6E69` (micro labels only)

### 2. Typography
- **Hero phrase rendering** — `display` (Big Shoulders Display) at the `hero` ramp step. The numerals "11–7" set the largest, mirrored across an en-dash on the red field panel, reversed in cream; the word "TIGERS" sits above at `2xl` as the label. Marquee target `clamp(110px, 15vw, 200px)`.
- **Type treatment** — hero = `hero` step for the score; label "TIGERS" = `2xl`; deck/standfirst = `xl` (Big Shoulders in a lighter cut, mixed case) to spend the mid-scale; section labels = `sm` small-caps with 0.09em tracking; body/ledger = `base` Atkinson Hyperlegible at 1.5 leading, capped 60–68ch. Case contrast (condensed caps score vs. humanist mixed-case deck) does the varying, not scale alone.

### 3. Layout Specification
- **Composition** — single / radial / mirrored / center / sparse / accelerating / standard / drenched / hero-only. The score is the sun: it sits at the optical center, "11" and "7" mirrored across the dash (the scoreboard made literal), everything else radiating out and accelerating downward. One column, drenched dark-void ground.
- **CSS grid/flex structure** — `display: grid; grid-template-rows: auto 1fr auto; justify-items: center` for the page; the scoreboard is `display: grid; grid-template-columns: 1fr auto 1fr; align-items: center` (number · dash · number).
- **Major dimensions**:
  - Hero/scoreboard field area: `min-height: 82vh`, red panel `max-width: 1100px; margin: 0 auto`
  - No sidebar.
  - Max content width: `max-width: none`; side padding `96px 7vw` (desktop), `40px 6vw` (mobile). Body ledger insets to ≤68ch.
  - Section padding: `clamp(48px, 8vh, 128px)` top/bottom, shrinking toward the footer (accelerating rhythm).
- **Nav placement** — corner header, top-left, inside the hero field: mark + "Doug March" wordmark on one line, work · about · contact small-caps beneath. Header height ~96px. No top bar, no band.
- **Hero phrase grid zone** — center of the first fold, rows 2–3 of the page grid, occupying roughly the middle 60% of a 1440×900 viewport; numerals render at ~200px.

### 4. Component Character
- **Border radius** — cards 0, buttons 2px, tags 0. Hard corners throughout (owner dislikes rounded).
- **Border treatment** — bordered where needed with `border` (`#362321`) hairlines on the void; `fieldBorder` (`#E4564C`) inside the red panel.
- **Shadow** — none. Depth comes from surface lightness (dark-void discipline).
- **Density** — sparse: the score dominates, few elements, generous void.
- **Interactive states** — links shift to `accentAlt` (`#E4564C`) on hover with a 1px underline offset; nav small-caps gain a red baseline rule on hover.

### 5. Signal Integration
- **Where signal elements live** — a single tabular "box-score" data strip beneath the hero and in the footer, on the dark void.
- **Sports scores** — the hero. 11–7 as mirrored marquee numerals reversed out of the red field, accent glow on the winning "11".
- **Quote** — Aristophanes ("High thoughts must have high language") is deliberately NOT the hero; demoted to one hairline footnote line in the footer at `sm`, italic — a nod, not a poster.
- **Holiday elements** — none today.
- **Music** — War on Drugs / My Morning Jacket labeled "on rotation" as a quiet footnote pair, never presented as a today-event beside the score or market.
- **Other signals** — market SPY 764.29 ▲0.85% with a small accent up-arrow; weather "Fog · 71.7°F · 97%" over Aldie; waxing crescent moon 5.9%; Biltmore Championship (Asheville, scheduled); AQI Good / UV 0 — all as tabular rows in the box-score strip, subordinate to the score.

## Self-Check
1. Hero quotability: Yes — "TIGERS 11–7" is a scoreboard fact Doug would post, quotable alone.
2. Because-of chain: Yes — score → scoreboard center/mirror/radial → athletic Big Shoulders → triumphant Detroit red → drenched void with the score reversed.
3. Render feasibility: Yes — condensed caps render "11–7" at ~200px centered on 1440×900 without overflow, hero in the first fold.
4. Canvas floor feasible: Yes — drenched dark-void with a large red field panel fills the declared 72%.
5. Phone: Yes — hero-only collapse shows "11–7" at the `hero` step (110px condensed) inside 640px at 360, no word cut, mark in the corner.

## Rationale
The phrase decides everything, and today the strongest line is Doug's, not the machine's: the Detroit Tigers won 11–7. After a week where five of eight heroes were borrowed quotes or the site talking about itself, a scoreboard fact returns the subject to the owner — a Detroit sports fan on a Sunday morning — and it plays directly to his two highest grades, both of which were score-led (the trophy-gold scoreboard flood and the fairway split). Stated plainly as a signal-event, "TIGERS 11–7" is quotable in isolation and it wants marquee numerals.

Because the phrase is a scoreboard, the composition is radial and mirrored around a single center: "11" and "7" reflected across a dash, the score as the sun with everything radiating and accelerating downward. That demands an athletic signage voice, so the chassis is big-shoulders-atkinson — its condensed display is the literal register of stadium numerals (not a lazy default-to-condensed-for-scale, but the exact use case), and it is fresh, unused in the last fourteen builds. The palette turns on one saturated hue at volume: Detroit red at 356°, the city's own color, glowing off a warm near-black void. This deviates from the 140–180° green mandate deliberately — the last three greens (158°, 162°, 125°) dominated the recent window, the repetition check demanded a hue 60°+ off them, and triumph calls for a single saturated hue; red is both fresh and genuinely Detroit (Red Wings).

Layout and shell answer the owner's standing complaints head-on. Ground strategy is dark-void (fresh against the week's drench/light-ground/duotone run), and crucially a warm dark ground gives the original green-and-blue mark somewhere to sit — so brand_color_mode is original for the first time in effectively 17 builds, addressing "the single-color mark disappears" directly. Shell posture is standard with a corner header, putting the real circular mark in the first fold at both 1440 and 360, which fixes the repeated "no brand above the fold" failure. The scoreboard sits on a large saturated red field panel centered in the void; every other signal — market up-tick, fog, crescent moon, golf, music-on-rotation, and a demoted Aristophanes footnote — lives as a subordinate tabular box-score strip.
