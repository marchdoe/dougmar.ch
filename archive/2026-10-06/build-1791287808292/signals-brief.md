# Signals Brief — 2026-10-06

## Hero Copy
The key to success is emotional stability.

## Hero Rationale
Straight from `signals.quote`, Warren Buffett. It carries because it is a plain declarative truth with no decoration, the register Doug respects, and on a BOLD day a one-line aphorism cut into a committed field is a stronger gesture than a composed score line. Buffett's name renders in the attribution band directly under the monument, so the quote is complete. I used quote because the mandate asks for it first and this line genuinely holds a page: it is short, concrete in its claim, and reads as something a ten-year independent founder would pin to the wall.
Owner's voice: Ten years running Spaceman alone, the thing that keeps work shipping isn't talent, it's not panicking when it gets hard; Buffett said the quiet part Doug already lives by.

## Archetype
a brass aphorism carved into an olive-gold field, the day's facts kept in a dark ledger

## Composition
columns: two-asymmetric
axis: horizontal
symmetry: left-weighted
hero_zone: lower-third
density: crowded
rhythm: even
shell_posture: folded-into-hero
field_ratio: field-dominant
collapse: rail-to-band
hero_object: statement

## Composition Rationale
I moved three axes off the starting tuple. `columns` three→two-asymmetric: a single aphorism wants one monument block plus an evidence rail, not newspaper thirds. `symmetry` mirrored→left-weighted: a reflection fights a single inscription; a heavy left base grounds it. `hero_zone` edge-bound→lower-third: anchoring the slab low with calm light above gives the page a literal low center of gravity, which is what "stability" looks like. Kept horizontal, even, folded-into-hero, field-dominant, rail-to-band, crowded and statement because each already serves steadiness: even rhythm is stability's rhythm, and the crowded justified slab plus packed ledger make density legible rather than noisy.

## Mobile
carrier: The olive-gold field with the justified caps monument carries the idea; the evidence ledger becomes a full-width dark band stacked beneath it.
first_fold: The lockup top-left, then the hero monument "THE KEY TO SUCCESS / IS EMOTIONAL / STABILITY" with Buffett's attribution directly under it.
order: lockup + numbered nav, hero monument, attribution, signals band (ex-rail), site callout, footer
hero_step_360: 3xl
nav_360: Horizontal lockup stays top-left at reduced scale; the three numbered links wrap to a single compact uppercase row under the monument.

## Chassis
anton-inter-tight

## Visual Specification
### 1. Color Specification
- **Primary hue**: 69° (olive-gold). Grounded brass register; reads as permanence and value, and lands in the only clean slice of the mandate (66–80°, clearing the recent amber at 36° and gold at 62°).
- **Neutral palette** (olive-tinted): 50 `#F8F9F1`, 100 `#EEEFE3`, 200 `#DBDDC9`, 300 `#BFC2A8`, 400 `#989B80`, 500 `#71745C`, 600 `#535643`, 700 `#3C3E2E`, 800 `#26271C`, 900 `#16180E`
- **Accent color** (rust): light `#E08F55`, default `#B9541C`, dark `#732F0F`, glow `#E08F55`
- **Secondary accent**: rust only; no third hue. Used for the mark, the up-arrow on SPY, and the single hairline that separates attribution from the ledger.
- **Background**: page field (bg) `#BDCE5E`; deeper gold band (bgAlt, SiteCallout) `#9FB63D`; raised card (surface) `#ECF1C5`; dark ledger rail (field) `#1D2408`
- **Text colors**: primary `#16180E`, secondary `#26271C`, muted `#3C3E2E`; on the dark rail: ink `#F7F9E6`, muted `#DBE593`

### 2. Typography
- **Hero phrase rendering**: `display` (Anton) at the `hero` step, custom `clamp(44px, 6vw, 96px)`, set in CAPS, justified into a solid 3-line rectangle: `THE KEY TO SUCCESS / IS EMOTIONAL / STABILITY`, with STABILITY as the full-width closing line. The block reads as a carved inscription anchored to the lower third of the gold field. It is the one h1 and the largest element.
- **Type treatment**: hero at `hero`; attribution ("Warren Buffett") at `lg`, body face, small-caps feel via tracking; ledger row labels at `sm`, ledger figures at `xl` (tabular). Mid-register is spent: a standfirst deck at `2xl` sits between hero and ledger so the page never jumps title-to-caption. Body copy at `base`, leading held 1.5, measure 60–68ch.

### 3. Layout Specification
- **Composition**: two-asymmetric, horizontal, left-weighted, lower-third, crowded, even, folded-into-hero, field-dominant, rail-to-band, statement. The wide gold field (left) holds the inscription low with calm light above it; the narrow dark rail (right) holds the day's evidence. The split embodies the line: steady field, disciplined ledger.
- **CSS grid structure**: `display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.9fr)`. Hero zone is a sub-grid inside the left column, content pinned to the bottom third.
- **Major dimensions**:
  - Hero field min-height `92vh`
  - Ledger rail width `~38%` (min 300px), full-height dark plane
  - Max content width: `none`; side padding `clamp(28px, 5vw, 88px)`; body prose blocks capped at 66ch inside their column
  - Section padding: vertical rhythm on an 8px base, major gaps `clamp(48px, 7vh, 96px)`
- **Nav placement**: folded into the hero. Horizontal lockup (mark + wordmark + role) top-left of the gold field; numbered nav `01 Work 02 About 03 Contact` runs in a single uppercase row along the lower edge of the hero field, olive-ink on gold.
- **Hero phrase grid zone**: left column, rows filling the lower third (roughly rows 6–9 of a 9-row field), occupying ~62% width at ~86px line height at 1440.
- **Home callout slot**: on `/`, full width below the signals band (the collapsed rail) and above the footer, between the signals band and the footer. Set in bgAlt. I place it; I write no copy and specify no styling for it.

### 4. Component Character
- **Border radius**: cards 2px, buttons 2px, tags 0. Sharp, carved register.
- **Border treatment**: bordered. Hairlines use `border` (`#647A1E`); section breaks use `borderStrong` (`#313D10`); rules inside the dark rail use `fieldBorder` (`#647A1E`).
- **Shadow**: none. Depth comes from the field/rail value split, not shadow.
- **Density**: crowded — the inscription is a dense justified slab, the ledger is packed with ruled rows; the open sky above the monument is the only quiet.
- **Interactive states**: nav and links shift to rust on hover with a 1px rust underline; ledger rows raise their label from muted to ink on hover.

### 5. Signal Integration
- **Where signals live**: the dark ledger rail (right at 1440, full-width band below the hero at 360). Labels and figures treated as design material, tabular-nums throughout.
- **Sports scores**: ruled rows, result word in rust for a win. Pistons 109–107 WIN; Lions 26–32 LOSS. Figures at `xl`.
- **Golf**: top entry in the rail. Bank of Utah Championship, FINAL. Austin Smotherman −26 set largest in the rail (figure at `xl`), then Ghim −24, Ford −23, Crowe −23, James −22 as a tight sub-list.
- **Market**: SPY 774.83, +0.67%, rust up-arrow.
- **Quote**: IS the hero. Buffett attributed in the band directly beneath the monument.
- **Holiday**: none today; "Columbus Day, Oct 12" as one faint ledger line.
- **Music**: Wet Leg and The War on Drugs set quietly at the foot of the rail under an "In rotation" label — taste, not an event, no figure beside it.
- **Weather / sky / air**: Aldie, Clear, 43.9°F; waning crescent 18%; AQI 1 Good, UV 0 — a three-line ledger cluster under one rule.

## Self-Check
1. Hero quotability: Yes — a standalone Buffett aphorism, attributed, screenshot-worthy without context.
2. Because-of chain: Yes — steadiness drove even rhythm, left-weighted low anchor, justified caps slab, olive-gold field, dark evidence ledger.
3. Render feasibility: Yes — Anton at clamp(44,6vw,96) sets a 3-line justified block in the lower third at 1440 with room above; well under the 160px ceiling.
4. Canvas floor feasible: Yes — crowded inscription slab plus a packed full-height ledger rail plus a deep gold band easily fill 82% of 1440×900.
5. Phone: Yes — at 360 the monument sets at 3xl in condensed caps, three lines inside the first 640px with no word cut; rail drops to a band below.

## Rationale
The phrase is a Buffett aphorism about staying steady, so the whole page had to look like steadiness, not triumph. That meant even rhythm, a left-weighted mass with a low center of gravity, and a monument anchored to the lower third with calm light above it. The quote is plain and declarative, so the type is plain and declarative at monumental scale: Anton condensed caps, justified into a solid three-line rectangle where STABILITY is the full-width closing line. Anton is the honest fit because a carved inscription wants one weight, no italics, no ornament, and it has not shipped in the recorded window, so it reads as a decision rather than a reflex.

Palette followed from "committed, warm, steady." The mandate's only clean slice is 66–80°, and olive-gold at 69° reads as brass and permanence rather than the acid lime at the top of that range or the amber the last builds already wore. One rust accent is the single thing that turns on, the way discipline shows up as one move: the mark, the SPY up-arrow, the attribution rule. Ground is split-field, a formula the recent window skipped: a steady gold field for the line, a dark ledger rail for the evidence. On a bright gold field the original green-and-blue mark finally has somewhere to sit, so I chose `original` instead of sinking the mono mark into a flood for the sixteenth time.

Layout serves the split argument: the field states the belief, the ledger supplies the day's hard facts, golf at −26, Pistons by two, Lions down six, SPY up two-thirds of a percent, each as a ruled row with tabular figures. At 360 the rail becomes a full-width band under the monument, so the relationship survives as adjacency. The hero rises in, the field drifts slowly over forty seconds, and the ledger reveals on scroll, because the reference sites the owner points at are defined by motion and a poster that only holds still is only half the gesture this risk budget asked for.
