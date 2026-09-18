# Signals Brief — 2026-09-18

## Hero Copy
Most golf apps are digital scorecards. This one is not.

## Hero Rationale
This is Doug's line about 15th Club, lifted straight from his voice file, and today the day hands it a live demo: the Biltmore Championship is in progress with Greyserman and Cole tied at -7. So the work leads and the tournament proves the point. It is contrarian, opinionated, and plainly his, the opposite of a borrowed quote poster, and it answers five ratings running that asked for his own words with the brand up top. The AI-saturated wire today (Astra for Law, Bonsai compression, "we are all product engineers now") sits right under 15th Club's own thesis: golf plus AI, not a scorecard.
Owner's voice: he wrote exactly this line about 15th Club, and he says what a thing does, not how it feels.

## Archetype
The work leads, the live tournament is the demo — a split argument.

## Composition
columns: two-equal
axis: horizontal
symmetry: mirrored
hero_zone: center
density: dense
rhythm: syncopated
shell_posture: marginal
field_ratio: balanced
collapse: rail-to-band
hero_object: artifact

## Composition Rationale
The matched two-equal split is the argument: the 15th Club thesis on the violet panel is meaningless without a real tournament beside it, and today supplies one, so the mirrored halves genuinely need each other. I moved density off the mandate's `measured` to `dense` because the evidence panel carries a full five-deep leaderboard and the footer a scorecard of signals, and a risk-7 BOLD day earns the packed proof side rather than a hedged one. Everything else holds the date-derived tuple because a rail-fed split serves an artifact-led page exactly.

## Mobile
carrier: The artifact still leads — "15th Club" and its phrase caption stack full-width, then the leaderboard becomes a full-width band directly below, so the claim and its proof stay adjacent.
first_fold: The "15th Club" title (4xl) and the hero phrase "Most golf apps are digital scorecards. This one is not." both sit inside the first 640px.
order: rail-band (mark + nav), thesis (15th Club + phrase), evidence (live leaderboard), scorecard footer (signals + rotation)
hero_step_360: 4xl
nav_360: the left spine becomes a top band, mark top-left in the first fold with Work / About / Contact as a compact inline row beneath it.

## Chassis
bricolage-manrope

## Visual Specification
### 1. Color Specification
- **Primary hue**: 272° royal violet. It is the argument in color: a golf product that refuses the fairway-green scorecard cliché floods its thesis panel in violet instead. It also lands in the only genuinely fresh band the recent window leaves (nearest recent primary is 205°, 67° away), breaking the sub-30° repeat flagged on the last build.
- **Neutral palette** (warm violet bone): 50 `#F6F1E7`, 100 `#EFE8DA`, 200 `#DFD5C2`, 300 `#C7BAA1`, 400 `#9F947F`, 500 `#78705F`, 600 `#585141`, 700 `#3E382D`, 800 `#2A251D`, 900 `#171410`
- **Accent color** (under-par green): light `#5CCB8C`, default `#147A44`, dark `#0F5C33`, glow `#C8F0D8`
- **Secondary accent**: none beyond the green above; violet is the field, green is the one functional spark.
- **Background**: page bg (bone) `#F4EEE3`; card/row surface `#FBF7EF`; thesis panel + rail + footer band field `#2E1A54`
- **Text colors**: primary `#241938`, secondary `#5B5170`, muted `#6E6580`; on violet field: bone `#F4EEE3`, muted lavender `#B9AED0`

### 2. Typography (bricolage-manrope)
- **Hero phrase rendering**: The artifact leads, so the project title "15th Club" is the marquee, set in `display` (Bricolage Grotesque) heavy at the `hero` step (fluid clamp, ~122px at 1440), reversed out of the violet thesis panel. The h1 hero phrase, "Most golf apps are digital scorecards. This one is not.", sits directly beneath it as the caption at the `3xl` step in bone, so the phrase steps down one register and the object earns the scale.
- **Type treatment**: `hero` for the project title; `3xl` for the phrase caption; `xl`/`2xl` for the evidence panel head and the section heads (the mid-scale the taste memory demands); `base` (Manrope) for body and leaderboard rows held to 60–70ch with tabular-nums on all figures; `sm` for meta (AI · 2025 · product) and rail nav; `xs` for the scorecard footer labels. Leading and tracking come from the chassis ramp.

### 3. Layout Specification
- **Composition**: two-equal / horizontal / mirrored / center / dense / syncopated / marginal / balanced / rail-to-band / artifact. Two matched panels state a claim and its proof: 15th Club as thesis on the violet left, today's live leaderboard as evidence on the bone right, a narrow violet spine at the far edge carrying the mark. The matched split serves the phrase because the two halves need each other, the thesis is empty without a real tournament beside it.
- **CSS grid**: `display: grid; grid-template-columns: 84px 1fr 1fr;` (spine, thesis, evidence). Evidence panel inner: `display: grid; grid-template-columns: 1fr auto auto;` for name / to-par / thru.
- **Major dimensions**:
  - Hero/split area: `min-height: 100vh` at 1440, each panel `min-height: 100vh`.
  - Left spine (rail): `width: 84px`.
  - Max content width: `max-width: none`; panel padding `clamp(32px, 4vw, 72px)`; body copy inside the thesis capped at 62ch.
  - Section padding: vertical rhythm on the chassis base unit; leaderboard rows 56px tall.
- **Nav placement**: left vertical spine (marginal). Stacked mark at top of the spine, role line beneath, then work / about / contact as a vertical list reading down the rail, one hairline rule per row.
- **Hero phrase grid zone**: thesis panel, column 2, rows 1–3. Title occupies the upper two-thirds at ~122px; the phrase caption sits rows 3–4 at `3xl` (~34px). Together inside the first fold at 1440.

### 4. Component Character
- **Border radius**: cards/rows `sm` (4px); the mark ring `full`; panels square (`none`). Crisp, spec-sheet, no soft template rounding.
- **Border treatment**: hairlines only. `border` between leaderboard rows on bone; `fieldBorder` for rules inside the violet panel. Scorecard-ledger discipline.
- **Shadow**: none. Depth comes from the value split between violet field and bone, not shadow.
- **Density**: spacious thesis, dense evidence. Leaderboard is tight and tabular; the thesis breathes.
- **Interactive states**: `_hover` lifts a leaderboard row's surface to `surface` and turns the to-par figure to `accent`; nav rows underline in `fieldBorder`.

### 5. Signal Integration
- **Where signals live**: the evidence panel is the live golf leaderboard; a violet scorecard footer band carries the rest as tabular columns.
- **Sports scores**: Golf is the hero evidence, top five styled as app rows: Greyserman -7, Cole -7, Kohles -6, Kirk -6, Hughes -6, under-par figures in `accent` green with tabular-nums. Detroit losses go in the footer, stated flat, no spin: "Lions 31–41 L · Tigers 1–3 L." A score is a score.
- **Quote**: not the hero. Hepburn's line is not poster-worthy today and is not Doug's; it is omitted from the page rather than demoted into a fake footnote.
- **Holiday**: none today.
- **Music**: Tobin Sprout, The War on Drugs, Guided by Voices in the footer under "On rotation," taste not event, never beside a score as if it happened today.
- **Other signals**: SPY 762.60 (+1.13%), patchy rain 71°F / 95% humidity in Aldie, first-quarter moon 49%, and one line of the design wire (the sidebar reads) all sit as scorecard-footer columns, subordinate to the leaderboard.

## Self-Check
1. Hero quotability: Yes — "Most golf apps are digital scorecards. This one is not." is a standalone opinion, not a description.
2. Because-of chain: Yes — contrarian product line → artifact split with live leaderboard as proof → brand-driven Bricolage → violet field that refuses scorecard green → two matched panels off one spine.
3. Render feasibility: Yes — "15th Club" is two short words at 122px on half the 1440 canvas, no overflow; phrase caption at 3xl fits beneath.
4. Canvas floor feasible: Yes — a dense evidence leaderboard plus a violet thesis and footer band fill 80%+ with real content.
5. Phone: Yes — rail becomes a top band, title drops to 4xl, phrase caption follows, both inside 640px with no cut word.

## Rationale
The hero phrase is Doug's own line about 15th Club, "Most golf apps are digital scorecards. This one is not." It is opinionated, quotable in isolation, and today it gets a living demo: the Biltmore Championship is in progress, two players tied at -7. So the object on the page is the artifact, not another poster statement. The work leads and the real tournament stands beside it as proof. That decision moves the page off the eight-day eyebrow-statement-deck template the owner keeps flagging.

Because the page is a claim and its proof, the composition is a matched two-equal split hung off one left spine: 15th Club at marquee scale on the violet thesis panel, today's live leaderboard on the bone evidence panel. The two halves need each other, which is why the split earns itself. The chassis is bricolage-manrope, unused in the recent window and off the three worn faces, an expressive brand-driven grotesque that carries a product statement without editorial-serif costume, with Manrope answering it for the dense leaderboard and footer. Type is set heavy, mixed case, left off the single spine per the standing "one rail per page" rule.

The palette is the argument in color. A golf product that refuses the fairway-green scorecard cliché floods its thesis in royal violet at 272°, the fresh band the recent window leaves open and 67° off the nearest recent hue, so the color itself says "this one is not." Green survives only where golf actually earns it, as the one functional spark on the under-par figures. Ground strategy is split-field, fresh against the week's drench and duotone run, and its bone half finally gives the original green-and-blue mark a warm ground to sit on, so brand_color_mode is original, mark stacked at the top of the left spine inside the first fold at 1440 and 360. The footer is a violet scorecard band stating the Detroit losses flat, the market, weather, moon, and the music rotation as taste, never as an event beside a score.
