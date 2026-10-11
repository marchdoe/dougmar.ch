# Signals Brief — 2026-10-11

## Hero Copy
Better to die fighting for freedom than be a prisoner all the days of your life.

## Hero Rationale
This is `signals.quote` (Bob Marley), and it carries the day because it reads as the caption to the one piece of owned work that actually embodies it: Spaceman, the LLC Doug has run independently for ten years. The quote is not about martyrdom here; it is about choosing to build on your own terms rather than sit salaried in someone else's plan, and Spaceman's client set (Zeldman, Rolex, The Nature Conservancy, Intuit, LastPass) is the evidence that the bet paid. The author renders as a byline directly under the line. Owner's voice: Doug chose a decade of independent work over a day job, so a line about freedom over a cell is one he'd stamp on Spaceman without flinching.

## Archetype
a founder's specimen ledger, one defiant caption over a decade of evidence

## Composition
columns: irregular-twelve
axis: vertical
symmetry: broken
hero_zone: upper-left
density: measured
rhythm: interrupted
shell_posture: footer-only
field_ratio: balanced
collapse: hero-only
hero_object: artifact

## Composition Rationale
The quote is the stamp over a decade of evidence, so the object has to be the evidence: Spaceman leads as the artifact, its client set the proof, the Marley line its caption. I moved columns off the mandate's `masonry` to `irregular-twelve` because a ragged packed grid scatters evidence while a strict 12-column ledger catalogs it; axis off `radial` to `vertical` because a ledger reads down, not in orbit; symmetry off `symmetric` to `broken` because the title, quote and client rows hang off one left rail rather than mirror; and shell_posture off `none` to `footer-only` so the nav defers cleanly to a colophon while the mark still owns the hero's upper-left corner. Upper-left, measured, interrupted, balanced, hero-only and artifact I kept from the suggestion because each genuinely serves a rail-anchored specimen with one caesura.

## Mobile
carrier: At 360 the oversized "Spaceman" word and the terracotta field carry the artifact; the quote reads beneath it as its caption, the client ledger follows below the fold.
first_fold: the bone mark top-left, the "Spaceman" marquee as type-texture, and the Marley quote with its byline as the caption — the full hero, nothing else.
order: mark, Spaceman marquee, quote + Bob Marley byline, project standfirst, client ledger, signal ledger, footer colophon
hero_step_360: 3xl
nav_360: No top bar; nav stays in the footer colophon as a stacked index; the mark remains top-left of the hero.

## Chassis
spectral-albert

## Visual Specification
**1. Color Specification**
- **Primary hue**: 16° (rust terracotta). Warm red-orange reads as fired earth and defiance; it is the gold-standard terracotta committed, not a light amber wash.
- **Neutral palette (warm sand)**: 50 #FAF4EF, 100 #F0E7DF, 200 #E0D2C6, 300 #C8B4A6, 400 #A89080, 500 #88705F, 600 #6A5345, 700 #4E3B30, 800 #33251D, 900 #1E1511
- **Accent (ember)**: light #F6C095, default #F08A3C, dark #DE6F1E, glow #F6C095
- **Secondary accent**: none
- **Background**: page bg #8E3B1E (terracotta), card/surface #74301A (brick), second ground #5A2413 (oxblood), flooded field #3A1710 (char)
- **Text colors**: primary #FBF1E9 (bone), secondary #ECC6AE (rust 200), muted #E0A585 (rust 300, metadata only)

**2. Typography (spectral-albert)**
- **Hero phrase rendering**: the Marley quote is the single h1, set in the `display` face (Spectral) italic at the `4xl` step (fluid clamp, ~56px at 1440), mixed case, flush-left to the one rail. It sits one step below the marquee object by design.
- **Marquee object**: the project title "Spaceman" set in `display` italic at `hero_scale` (clamp to ~116px, below Spectral's 120px 5xl ceiling) as the type-as-texture ground of the hero field, bleeding toward the right edge in ember-washed bone.
- **Type treatment / ramp steps**: hero/marquee = artifact title at `hero_scale`; `4xl` = quote h1; `xl`–`lg` = the project standfirst and section heads (the mandated mid-register, so the page is never title-then-16px); `base` = body and ledger rows (Albert Sans, 17px, leading 1.55, measure capped 64ch); `sm`/`xs` small-caps tracked 0.09em = labels, years, signal metadata. Space above every label is at least twice the space below it.

**3. Layout Specification**
- **Composition**: irregular-twelve / vertical / broken / upper-left / measured / interrupted / footer-only / balanced / hero-only / artifact. A strict 12-column ledger lets Spaceman's facts (year, role, client set) sit as cataloged rows with hairline rules while the giant title and the quote-caption span the wide columns — the quote reads as the stamp over a decade of proof.
- **CSS grid structure**: `display: grid; grid-template-columns: repeat(12, 1fr); column-gap: 24px; row-gap: 0;`. Hero/artifact block: title type-texture spans cols 1–9, quote h1 cols 1–7, standfirst cols 1–6. Client ledger: cols 1–8 as ruled rows. Signal ledger: cols 9–12 as a narrow evidence column, so no column reads as an accidental void.
- **Major dimensions**: hero/artifact field `min-height: 88vh`; max-width: none, side padding `clamp(28px, 6vw, 108px)`; section vertical rhythm in multiples of the chassis base; the caesura is a single `96px` gap between the hero block and the ledger.
- **Nav placement**: no top bar, no rail. Nav lives in the footer colophon as a vertical index.
- **Hero phrase grid zone**: quote h1 occupies rows 3–4, columns 1–7, ~56px at 1440; the "Spaceman" marquee occupies rows 1–3, columns 1–9 at ~116px.
- **Home callout slot**: `<SiteCallout />` sits on `/` below the client ledger and above the footer colophon, between the signal ledger and the footer, full width of the content column. I place it and write no copy or styling for it.

**4. Component Character**
- **Border radius**: cards 1px (sm), buttons 2px (md), tags 0 (none). Crisp specimen edges, no soft corners.
- **Border treatment**: bordered. Ledger rows separated by `border` (#B85733) hairlines; section breaks and the colophon head by `borderStrong` (#CE7D54). Inside the char field, `fieldBorder` (#7E3A22).
- **Shadow**: none. Depth comes from value steps between bg, surface, bgAlt and field.
- **Density**: measured. Generous breathing room, nothing crowded, one deliberate caesura.
- **Interactive states**: in-content links underline on rest in ember; on `_hover` the underline thickens and the row ground lifts to `surface`.

**5. Signal Integration**
- **Signal elements**: the narrow evidence column (cols 9–12) beside the ledger, plus the footer colophon.
- **Sports scores**: Red Wings 0–1 loss (Oct 10) as a ruled row, score in tabular figures, the result tagged in ember so the one live defeat is the lit mark.
- **Golf**: Baycurrent Classic, Final, Michael Brennan −16 leads Keith Mitchell −15, as a two-line ruled row in bone with ember leader figure.
- **Market**: SPY 778.57, +0.60%, direction up, a single ruled row.
- **Quote display**: the quote IS the hero phrase, the h1 caption to the Spaceman artifact; "Bob Marley" renders directly beneath it as a small-caps byline.
- **Weather / lunar**: Aldie, light rain, 61.5°F and new moon (0.01) as footer colophon rows.
- **Holiday**: Columbus Day, Oct 12, one quiet footer line.
- **Music**: The War on Drugs and Guided by Voices set in the footer as a standing rotation, labeled as taste, never beside a score as if it happened today.

## Self-Check
1. Hero quotability: Yes — a 14-word Marley line about freedom over imprisonment is screenshot-worthy in isolation.
2. Because-of chain: Yes — the freedom line captions Spaceman (artifact), which wants a 12-col specimen ledger, a literary Spectral serif, a committed terracotta duotone, and a rail-anchored upper-left grid.
3. Render feasibility: Yes — Spectral's 4xl quote (~56px) and ~116px marquee title both clear the 120px ceiling and fit a 1440×900 fold without overflow.
4. Canvas floor feasible: Yes — a measured 12-col ledger with marquee title, quote, standfirst, client rows and signal column genuinely fills 78%.
5. Phone: Yes — at 360 the quote sets at `3xl` in short lines under the marquee word, inside the first 640px, no word cut.

## Rationale
The phrase is a Marley line about choosing freedom over a lifetime in a cell, and the only honest way to make that Doug's rather than a poster of somebody else is to pin it to the one owned thing that proves he lived it: Spaceman, ten years of independent work for Zeldman, Rolex, The Nature Conservancy, Intuit and LastPass. So the object leads as artifact, the quote drops one step to caption, and the composition becomes a founder's specimen ledger: a strict irregular-twelve grid reading down the vertical axis, broken off a single upper-left rail, with the client set cataloged as ruled rows and the day's signals in a narrow evidence column.

Spectral-albert carries this because it is a transitional slab serif built for considered, literary setting, and it is genuinely fresh (unused in the last fourteen builds and off the recently-used chassis list). Its display italic lets the 14-word quote read as weighted manifesto prose rather than a shouted slab; I set it mixed-case rather than the small-caps or caps the mandate steers toward because fourteen words in caps destroys the sentence, and a quote has to read as a quote. The marquee "Spaceman" runs at ~116px as the hero field's type-texture, the gold-standard terracotta waterfall move.

The palette is a committed rust terracotta duotone at 16°, inside the mandate's 15–40° target, pushed redder and darker than Oct 3's amber so it won't read as a repeat. Terracotta is the gold-standard committed hue and the right register for defiance: fired earth, not a cheerful orange. One ember accent lights the single live signal (the Red Wings loss and the tournament leader). Ruled lines are the ground material because this is a ledger, and the mark goes single-color bone because the green-and-blue original would fight a field drenched in rust. The hero arrives on a left-to-right wipe, a banner unfurling to match the line.
