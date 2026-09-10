# Signals Brief — 2026-09-10

## Hero Copy
The future is the worst thing about the present.

## Hero Rationale
Pulled from `signals.quote` — Flaubert, and genuinely the strongest line on the board today. On a new-moon reset (0.6% illumination, the cycle bottoming out) with the market slipping and a portfolio that anxiously demolishes and rebuilds itself every single night, a mordant aphorism about dreading tomorrow while standing in today is exactly this machine's condition. It is quotable in isolation, dark-witted, literary, and it is not a back-to-back quote streak (the last two heroes were composed), so the streak flag doesn't fire.

## Archetype
a didone specimen with a resigned smirk

## Composition
columns: two-asymmetric
axis: horizontal
symmetry: left-weighted
hero_zone: edge-bound
density: measured
rhythm: syncopated
shell_posture: marginal
field_ratio: balanced
collapse: rail-to-band

## Composition Rationale
The sentence is literally a present shadowed by a future, so the canvas splits into two grounds — a wide lit gold field (present) pinned against a narrow dark rail (future) — making two-asymmetric/horizontal/edge-bound the structural argument, not decoration. I moved symmetry off the suggested `mirrored` to `left-weighted` because the aphorism's mass must anchor hard against the rail rather than balance across it, and I moved density off `crowded` to `measured` because a high-contrast didone marquee needs air — the packed signal ledger in the rail supplies the texture so it never reads sparse. Everything else sits on the mandate's starting tuple because the rail-and-field strip genuinely serves this line.

## Mobile
carrier: The lit gold field carries the aphorism full-width; the dark rail folds into a full-width espresso band above it holding the lockup, nav, and signal ledger.
first_fold: The hero phrase "The future is the worst thing about the present." in the gold field, directly under the collapsed dark nav band.
order: nav-band, hero-phrase, work-index, signal-ledger, footer
hero_step_360: 2xl
nav_360: Left rail becomes a full-width dark band at top — mark + wordmark left, work · about · contact as small-caps links with 44px tap targets beneath.

## Chassis
dm-serif-public

## Visual Specification
### 1. Color Specification
- **Primary hue** — 50° old-gold ochre. Warm dusk gold: honors the 40–80° mandate and reads as a clear late-summer evening (sunset 19:20, 72.7°F clear), but tarnished rather than bright, matching the aphorism's resigned tone. Deviates from recent 40°/62°/78° clustering only slightly — differentiation carried by FORMULA (duotone present/future split), not hue.
- **Neutral palette (bister sand, amber-tinted)** — 50 `#f8f3ea` · 100 `#ece2d2` · 200 `#d6c8b0` · 300 `#b7a488` · 400 `#8f7c5e` · 500 `#6a5940` · 600 `#4c3f2b` · 700 `#362c1d` · 800 `#241c10` · 900 `#17110a`
- **Accent color (marigold)** — light `#ffd47a` (glow) · default `#f2a91f` · dark `#b56e0e` · glow `#ffe6b0`
- **Secondary accent** — none. Single committed hue.
- **Background** — page field (present) `#dda233`; deeper band `#c98a1e`; raised card `#e8bd5c`; dark rail/field (future) `#17110a`
- **Text colors** — primary `#17110a` on gold; secondary `#362c1d`; muted/faint `#4c3f2b`; on the dark rail: cream `#f9ebc6`, muted `#b7a488`

### 2. Typography (dm-serif-public — DM Serif Display + Public Sans)
- **Hero phrase rendering** — `display` face at the `hero` step (fluid clamp, ~177px at 1440). Set dark espresso `#17110a` reversed out of the lit gold field, left-anchored and edge-bound, breaking across three lines so "The future / is the worst thing / about the present." stacks with the didone's high stroke-contrast doing the drama. `text-wrap: balance`.
- **Type treatment** — `hero` for the phrase; `2xl`/`xl` for the deck and any section head (mid-scale is mandatory — a standfirst under the phrase and labeled ledger heads occupy 24–48px so the page is never "big title then 16px"); `base` (Public Sans, ≥16px, leading 1.5, measure 60–68ch) for any running body; `xs`/`sm` small-caps for rail labels and metadata. Public Sans answers the didone with a clean civic vertical proportion for the ledger rows.

### 3. Layout Specification
- **Composition** — `two-asymmetric / horizontal / left-weighted / edge-bound / measured / syncopated / marginal / balanced / rail-to-band`. A narrow dark rail (the future) runs the left margin; the wide lit gold field (the present) carries the aphorism edge-bound against it — the two grounds enact the sentence's tension.
- **CSS grid** — `display: grid; grid-template-columns: 240px 1fr;` main field `padding: 88px 6vw`. Rail is `background: field; color: fieldInk`.
- **Major dimensions** — hero field `min-height: 92vh`; left rail `width: 240px` (fixed); `max-width: none` on the field with viewport padding (`88px 6vw`); running body capped at 66ch; section spacing on a 24px base unit (multiples: 24/48/96).
- **Nav placement** — left vertical rail (spine), the dark field; stacked lockup at top, small-caps links reading down the spine, day's signal ledger at the rail base.
- **Hero phrase grid zone** — column 2, rows 1–3 (upper-left of the gold field, edge-bound to the rail), intended ~clamp(56px,12vw,177px), occupying ~60% of the field's height.

### 4. Component Character
- **Border radius** — cards 0, buttons 2px, tags 0. Hard corners throughout (standing owner complaint about rounded).
- **Border treatment** — bordered hairlines: `border` `#a56e14` on gold, `fieldBorder` `#362c1d` inside the dark rail; section breaks `borderStrong` `#7f5413`.
- **Shadow** — none. Depth comes from the two grounds, not shadow.
- **Density** — measured; generous field air around the phrase, the signal ledger packed tight in the rail as texture.
- **Interactive states** — nav/link hover shifts ink to marigold `#f2a91f` with a marigold underline; no motion beyond a 120ms color transition.

### 5. Signal Integration
- **Where signals live** — the dark left rail base, as a tabular ledger (spaced small-caps labels, tabular-nums figures).
- **Sports** — Tigers 7–2 WIN as the ledger's marked row: figure in marigold `#f2a91f` on the espresso rail (the one glowing datum), label "DET · MLB · W" in cream small-caps.
- **Quote** — IS the hero phrase; attribution "— Gustave Flaubert" runs as an `xs` cream small-caps line beneath the phrase's third row.
- **Holiday** — none today; omitted.
- **Music** — My Morning Jacket · Tobin Sprout · Radiohead as an "ON ROTATION" taste line low in the rail, `textFaint`/muted-cream, explicitly framed as standing rotation, never dated beside the score.
- **Other** — new moon (0.6%), SPY 762.40 ▾0.46%, clear 72.7°F, 12.5h daylight each get a labeled ledger row; "Today in the field" (Awwwards Qissa / HN iPhone Duo) as two dim micro-rows at the very base.

## Self-Check
1. Hero quotability: Yes — a self-contained Flaubert aphorism, screenshot-ready in isolation.
2. Because-of chain: Yes — present/future tension → duotone split-ground + two-asymmetric rail, dramatic didone for a literary line, warm-dusk gold for resigned warmth.
3. Render feasibility: Yes — 8-word phrase breaks to three lines in DM Serif at the hero clamp inside a 1fr field with 6vw padding, no overflow at 1440×900.
4. Canvas floor feasible: Yes — 240px dark rail + full-height gold field + edge-bound marquee comfortably fills 72% at 1440×900.
5. Phone: Yes — rail collapses to a band, phrase set at `2xl` lands three short lines inside the first 640px without cutting a word.

## Rationale
The phrase decides everything. Flaubert's "The future is the worst thing about the present." is a mordant, literary aphorism, and it happens to describe this exact machine — a portfolio that spends every night anxious about the version it will become. Because the sentence is structurally a *now* shadowed by a *tomorrow*, the composition is a two-asymmetric horizontal strip: a lit old-gold field (the present) pinned against a narrow espresso rail (the future) that crops the marquee edge-bound. The two grounds don't balance; the gold carries the weight and the dark rail lurks beside it, which is the sentence made into layout.

The chassis follows the line's voice, not the loudness ladder. A 19th-century French aphorism about dread wants high-contrast didone drama, so dm-serif-public sets the phrase at the hero clamp (~177px) reversed dark out of the gold field — fashion-editorial, declarative, elegant, and cutting — while Public Sans answers it with clean civic ledger rows in the rail, spending the mid-scale (a deck at 2xl, section heads at xl) so no inner page jumps from marquee to body with nothing between. It sidesteps all three recently-worn chassis and the condensed-caps trio.

The palette commits one hue at volume inside the 40–80° mandate — 50° old gold — but escapes the recent warm monoculture on FORMULA: duotone, not the drench/dark-void/light-ground that ran all week. Lit gold present against espresso future, one marigold pulse reserved for the single glowing datum (Tigers 7–2 in the rail). On a duotone warm flood the green-and-blue mark would fight the field, so the lockup is single-color mono riding the dark rail where cream reads clean; the header is a fresh left-rail spine (avoiding the recently-used corner/footer/folded placements and the thrice-rejected top bar), hard corners throughout, and every signal from the new moon to the standing music rotation lives as tabular texture at the rail's base, subordinate to the one line that carries the day.
