# Signals Brief — 2026-11-14

## Hero Copy
sunny, 36°, feels like 30

## Hero Rationale
Straight off today's weather in Aldie: sunny, 36.8°F, feels-like 30°F, clear enough that the air index reads 1. A bright cold Saturday where the sun is out and does nothing to warm you is the one fact worth saying plainly, and it carries the whole page as a horizon readout: warm word, cold numbers. I pick signal-event over the Coelho quote because a stopped-clock aphorism is figurative and philosophical, the opposite of how Doug talks; and over composed because the lane ran two days straight. The weather-fact register is already proven his ("Fog, fifty degrees, calm.").
Owner's voice: Doug states a condition and two numbers and lets the gap between them do the work, the way he says "a score is a score."

## Archetype
reads like a dawn weather station: open frost sky over a gold horizon band

## Composition
columns: two-equal
axis: horizontal
symmetry: right-weighted
hero_zone: lower-third
density: sparse
rhythm: interrupted
shell_posture: footer-only
field_ratio: type-dominant
collapse: split-to-sequence
hero_object: word

## Composition Rationale
I moved axis off the mandate's `diagonal` onto `horizontal` because the composition is a literal horizon: a pale cold sky over a single gold band, and the organizing line of that reading is horizontal, not a cut corner. Everything else sits on the date-derived start because it genuinely fits this phrase: the upper two-thirds held open as bright sky is the lower-third hero landing (the warm word at the horizon), two-equal columns split the gold band so the word faces the day's numbers across a seam, and split-to-sequence stacks that pair cleanly at 360. The sky void is a decision, framed by the stacked-lg lockup and the metadata strip, not an abandoned column.

## Mobile
carrier: The gold horizon band becomes a full-width gold panel directly under a thin sky strip; the word "sunny" still sits on gold, with the signal ledger following as the next full-width block, the split kept by vertical adjacency.
first_fold: The hero readout — "sunny" at 5xl over "36°, feels like 30" — on the gold panel, with the brand mark above it.
order: brand mark, weather readout on gold panel, signal ledger, selected work, about, site callout, footer colophon
hero_step_360: 5xl
nav_360: Mark stays top-left at ~56px; nav remains the vertical index in the footer colophon, full-width rows.

## Chassis
zilla-worksans

## Visual Specification
### 1. Color Specification
- **Primary hue**: 48° (winter gold). The low November sun. It falls inside the mandate's 40–80° target. Gold was used recently, but the brief is a cold *sunny* day, so a single band of sun-gold against a cold pale sky is the literal subject, not a reflex; I keep it to one minority horizon band so light-ground stays dominant.
- **Neutral palette (frost sand)**: 50 `#FBF9F3`, 100 `#F4F0E6`, 200 `#E8E2D2`, 300 `#CFC6AE`, 400 `#A89E7E`, 500 `#7A7158`, 600 `#5E5744`, 700 `#45402F`, 800 `#2B2416`, 900 `#16130B`
- **Accent color (gold)**: light `#F2C94C`, default `#E0A82E`, dark `#A9741A`, glow `#FBEBC0`
- **Secondary accent**: none. One hue carries the page; the down market reads in muted ink, not a second color.
- **Background**: page bg `#FBF9F3` (light) / `#16130B` (dark); card/surface `#FFFFFF` (light) / `#2B2416` (dark); horizon band/field `#E0A82E` both schemes
- **Text colors**: primary `#1C1810` (light) / `#F6F1E4` (dark); secondary `#5E5744` (light) / `#BDB393` (dark); muted `#7A7158` (light) / `#8E8468` (dark). On the gold band: ink `#1C1810`, muted ink `#533810`.

### 2. Typography
- **Hero phrase rendering**: `display` (Zilla Slab) set as a stacked readout, right-flush to the center seam, sitting on the gold horizon band in `fieldInk`. The word **sunny** at the `hero` step, `hero_scale` clamp(64px, 8vw, 116px), lowercase. Zilla's largest display step is 120px at 1440, so 116px stays inside it. Beneath it, "36°," and "feels like 30" at `2xl`→`3xl` as the deck, same right-flush axis.
- **Type treatment**: steps are `hero` (the word), `3xl`/`2xl` (deck numbers and the golf leader figure), `lg` (section heads, the deck closers), `base`/`sm` (ledger rows, body), `xs` (metadata, colophon). Spend the middle: the leader score `−13` sits at `3xl` so the page has mass between 116px and 16px. Body holds 60–68ch, leading from the ramp (~1.55). Slab, low-contrast, civic: it states a fact rather than performing one.

### 3. Layout Specification
- **Composition**: two-equal / horizontal / right-weighted / lower-third / sparse / interrupted / footer-only / type-dominant / split-to-sequence / word. A horizon: pale open sky above a gold band, the warm word facing the cold day's numbers across a center seam. Horizontal axis because the organizing line is a literal horizon.
- **CSS grid/flex structure**: first fold `display: grid; grid-template-rows: 1fr auto; min-height: 88vh`. Upper row is the pale sky (brand top-left, metadata top-right, center held open). Lower `auto` row is the gold band: `display: grid; grid-template-columns: 1fr 1fr` — left half the hero readout right-flush to the seam, right half the signal ledger left-flush from the seam.
- **Major dimensions**:
  - Hero/first fold: `min-height: 88vh`; gold horizon band `~34%` of the fold height.
  - No fixed sidebar.
  - Max content width: `max-width: none`; side padding `clamp(24px, 6vw, 112px)`. Full-width canvas, not a centered column.
  - Section padding: vertical rhythm on the ramp base (~24px unit); band inner padding `48px clamp(24px,6vw,112px)`.
- **Nav placement**: footer-only. Nav deferred to the footer colophon as a vertical index. The brand mark lives top-left of the hero sky.
- **Hero phrase grid zone**: lower row of the fold, left column (band columns 1–6 of 12), right-flush to the center seam; the word "sunny" at ~116px, deck beneath. Occupies roughly the lower third of the fold.
- **Home callout slot**: on `/`, place `<SiteCallout />` full width below the selected-work index and above the footer colophon, between the work section and the footer. No copy or styling from me.

### 4. Component Character
- **Border radius**: cards/bands 3px (md), tags 2px (sm), buttons 2px. Tight, civic, no soft corners (owner dislikes rounding).
- **Border treatment**: hairline ruled, `border` on the pale ground, `fieldBorder` (dark gold) inside the band, `borderStrong` for section breaks. Broadsheet discipline: rules separate, color does not.
- **Shadow**: none. Depth comes from the gold band's value step, not shadow.
- **Density**: sparse sky, measured ledger. The readout and the ledger are the only dense moments.
- **Interactive states**: links underline on `_hover` in `accent`-dark; ledger rows raise ink from muted to full on hover.

### 5. Signal Integration
- **Where signal elements live**: the gold horizon band (right half) is the ledger; metadata strip top-right of the sky.
- **Sports/golf scores**: Austin Championship pres. by Compliance Solutions, "In Progress". Trace Crowe leads at `−13` set at `3xl` in ink on the band — the one figure with weight. Chasers (Yu −12, Harman −11, Ventura −11, Välimäki −10) as `sm` ruled rows beneath in muted ink, tabular-nums.
- **Quote**: not used; the weather fact is the hero.
- **Market**: SPY 754.37, −0.37% as one `sm` muted-ink ledger line (down, stated flat, no red).
- **Moon**: waxing crescent, 29% lit, in the top-right metadata strip.
- **Weather**: IS the hero.
- **Music**: The War on Drugs and My Morning Jacket as a single quiet `xs` line in the footer colophon ("in rotation"), taste not event, never beside a score.
- **Holiday**: none today.
- **Sun**: sunrise 06:59 / sunset 16:50 as a thin `xs` metadata pair under the moon line, reinforcing the short-daylight horizon read.

## Self-Check
1. Hero quotability: Yes — "sunny, 36°, feels like 30" is a readout you'd screenshot; the warm/cold gap is the hook.
2. Because-of chain: Yes — horizon phrase → horizontal band composition → grounded slab chassis → gold-on-frost palette → lower-third gold band.
3. Render feasibility: Yes — "sunny" at 116px (under Zilla's 120px ceiling) clears 1440×900 easily in the lower third.
4. Canvas floor feasible: Yes — open sky plus brand, metadata, hero band and ledger fill ~68% without padding.
5. Phone: Yes — at 360 the band becomes a full-width gold panel, "sunny" at `5xl` (64px) fits the first fold whole.

## Rationale
The phrase is a weather readout: "sunny, 36°, feels like 30." A bright cold Saturday where the sun is out and the wind takes it back. That gap between the warm word and the cold numbers is the whole idea, so the composition is a horizon. The upper two-thirds are held open as pale frost sky; a single band of low November sun-gold runs across the lower third, and the word "sunny" sits on that band at 116px facing the day's numbers across a center seam. Horizontal axis because the organizing line is a literal horizon; two-equal columns so the warm word on the left faces the day's facts (golf, market) on the right, the 2026-06-13 split-as-argument move at small scale.

Zilla Slab carries it because a plain weather fact wants a sturdy, low-contrast slab that states rather than performs — civic, grounded, matter-of-fact, exactly Doug's flat declarative register. It is also genuinely underused (never shipped in the last fourteen nights) and its quieter 120px ceiling is right: a weather report should not shout, and slab stroke weight gives the word presence without a didone's drama. Lowercase and right-flush-stacked makes it read as a station readout, not a headline.

The palette is light-ground: frost-sand sky dominant, one minority band of winter gold at 48° as the sun on the horizon. Gold is recent across the window, but the brief is a cold *sunny* day, so the sun-color is the literal subject rather than a reflex, and I keep it to one band so the pale field stays dominant and the original colored mark's blue clears 3:1 on the frost ground. All text is ink for contrast safety; gold works as fill, never as small type. The wipe entrance sweeps the word in left to right like dawn light crossing a clear cold morning, and the page then holds still.
