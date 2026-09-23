# Signals Brief — 2026-09-23

## Hero Copy
Deep in both. Not a generalist.

## Hero Rationale
This is Doug's own line from the voice file, verbatim, and it captions the one artifact that proves it: Spaceman, ten years of work for Zeldman, Rolex, The Nature Conservancy, Intuit and LastPass, where he has been deep in design and deep in engineering at once. I passed today's quote (Sydney Smith, "We know nothing of tomorrow, our business is to be good and happy today") because it is a soft life-aphorism, not Doug's register of concrete work-talk, and permanent memory has rejected quote posters three times as "not my voice"; a warm homily captioning a client roster would read as a poster of somebody else. I land on content-lifted again (yesterday was too) because the owner's permanent taste, "would Doug say this," outranks the lane-rotation note, and content-lifted is literally his own words on a line that has not run before.
Owner's voice: he says "Deep in both. Not a generalist." because he built two disciplines on purpose and has a decade of clients as the receipt.

## Archetype
a client-roster specimen with the claim set low

## Composition
columns: two-asymmetric
axis: horizontal
symmetry: broken
hero_zone: lower-third
density: measured
rhythm: interrupted
shell_posture: none
field_ratio: type-dominant
collapse: split-to-sequence
hero_object: artifact

## Composition Rationale
The phrase is a claim that needs evidence, so the artifact leads and the client roster proves it, the gold-standard split logic. I moved columns off the suggested `masonry` to `two-asymmetric` because one dominant artifact and its narrow evidence rail is a split, not a packed block field, and I moved symmetry off `mirrored` to `broken` because a dominant artifact is deliberately off-balance, not reflected. I kept `lower-third` (fresh, unused recently) so the claim lands last and largest under the evidence, and `shell none` because a mark top-left with in-content links structurally prevents the clipped-header the owner flagged three ratings running.

## Mobile
carrier: at 360 the split becomes a vertical sequence, mark then SPACEMAN and its caption then the client roster then the ledger, so the artifact and its evidence stay adjacent and the claim still resolves against the names beneath it.
first_fold: the mark, SPACEMAN at 4xl, and the caption "Deep in both. Not a generalist."
order: mark, artifact (Spaceman title + caption), deck, client roster, project metadata + description, SiteCallout, signal ledger, in-content nav
hero_step_360: 4xl
nav_360: no bar; mark top-left above the artifact; Work, About, Contact as in-content links at the base.

## Chassis
zilla-worksans

## Visual Specification
## 1. Color Specification

**Primary hue**: 22° terracotta clay. Fall in Aldie, a printed-specimen register, and Doug's no-hype authority all want a warm earth. It sits inside the 15–40° target; it overlaps the broad recent-warm forbidden band (0–98°) only because three warm days precede it, but the FORMULA here is split-field, not the rust drench of 09-21 or the raspberry duotone of 09-22, so it reads new, and 22° separates it from 09-21's 18° and the recent 28°/68°.

**Neutral palette (warm sand)**: 50 #FAF4EC · 100 #F5EBDF · 200 #EBDCC8 · 300 #DBC6AB · 400 #C0A585 · 500 #9C8264 · 600 #74604A · 700 #524234 · 800 #2E241A · 900 #1C1610

**Accent color (terracotta clay)**: light #E28E6B · default #B24A26 (light) / #D9703C (dark) · dark #7A331A · glow/accentAlt #D9703C (light) / #E28E6B (dark)

**Secondary accent**: none. One committed hue.

**Background**: page bg #FAF4EC (light) / #1C1610 (dark); card/surface #EBDCC8 (light) / #524234 (dark); terracotta field band #B24A26 (both).

**Text colors**: primary #1C1610 (light) / #FAF4EC (dark); secondary #74604A (light) / #DBC6AB (dark); muted/faint #9C8264 (light) / #C0A585 (dark).

## 2. Typography

**Hero phrase rendering**: The artifact is the object, so the project title SPACEMAN carries the marquee at `hero_scale` (`hero`/`5xl` register, up to 120px), set in the Zilla Slab display face, caps, heavy, tracked to span the wide column edge to edge. The hero phrase "Deep in both. Not a generalist." steps down to `3xl` and sits as the caption inside the terracotta band, set stacked (a clause per line) flush. Deck "Design and engineering as one job. Not two teams passing files." runs at `lg` above the roster.

**Type treatment**: `hero`/`5xl` for the SPACEMAN specimen title; `3xl` for the caption; `lg` for the deck and section heads (the mandated mid-register so the page isn't title-then-body); `base` for the client roster names and description at 60–68ch, leading 1.5–1.6; `sm`/`xs` for size-marker labels and the signal ledger. Tabular figures on the ledger and the SPY line.

## 3. Layout Specification

**Composition**: two-asymmetric · horizontal · broken · lower-third · measured · interrupted · shell none · type-dominant · split-to-sequence · artifact. A wide artifact column and a narrow evidence rail; the upper two-thirds hold the roster and the description, then one large caesura drops into the terracotta band where SPACEMAN and its caption anchor the lower third. The claim lands last and biggest, after the evidence that earns it.

**CSS grid/flex structure**: `display: grid; grid-template-columns: 1.65fr 1fr; grid-template-rows: auto 1fr auto;` for the hero region; the terracotta band is a full-width row spanning both columns at the bottom.

**Major dimensions**:
- Hero/artifact region: `min-height: 92vh`.
- Terracotta band (lower third): `min-height: 34vh`, full bleed.
- Evidence rail: `width: ~34%` (the 1fr column).
- Max content width: `max-width: none`; side padding `clamp(28px, 6vw, 104px)`. Roster/description body capped to 66ch inside its column.
- Section padding: vertical rhythm on the chassis base unit; band inset `clamp(28px, 5vw, 72px)`.

**Nav placement**: no header bar or rail. Navigation is in-content only: Work, About, Contact set as title-case links in one closing sentence at the base of the evidence rail. The mark lives top-left of the upper sheet.

**Hero phrase grid zone**: SPACEMAN occupies the wide column, lower band, rows spanning the terracotta field (roughly rows 3, columns 1–8 of a 12-col read), 56–120px. The caption "Deep in both. Not a generalist." sits directly beneath it inside the band at `3xl`, stacked.

**Home callout slot**: on `/`, place `<SiteCallout />` below the terracotta artifact band and above the signal ledger footer, between the evidence/artifact section and the signal ledger, full column width. No copy or styling from me.

## 4. Component Character

**Border radius**: cards 2px, buttons 2px, tags 0. Sharp, sturdy, slab-consistent (the owner dislikes rounded corners).
**Border treatment**: hairlines in `border`; emphatic section rules in `borderStrong`; rules inside the band in `fieldBorder`.
**Shadow**: none. Depth from value and the band, not shadow.
**Density**: measured, generous around the caesura.
**Interactive states**: `_hover` shifts links to `accent` and adds a 1px underline offset; no motion beyond color.

## 5. Signal Integration

**Where signal elements live**: a specimen size-marker ledger below the SiteCallout, tabular rows on the sand ground.
**Sports scores**: Red Wings 7–4 is the one bright note, its figures in `accentAlt`, top of the ledger, "Detroit Red Wings 7, opponent 4." stated flat. Tigers 1–3 loss below in `textMuted`, flat. Presidents Cup listed as Scheduled, no leaders.
**Quote**: not used as hero; it does not appear (passed for register). 
**Holiday**: none today; omitted.
**Music**: Tobin Sprout, Guided by Voices, Radiohead as one taste line in the ledger tail, `textFaint`, never presented as an event.
**Other**: SPY 773.38, −0.02% flat tabular; Aldie 55°F, patchy rain; moon waxing gibbous 93% as a micro row.

## Self-Check
1. Hero quotability: Yes — "Deep in both. Not a generalist." is a punchy, opinionated claim that stands alone.
2. Because-of chain: Yes — a claim-with-evidence drove the artifact object, the specimen slab, the terracotta split-field, and the low-anchored claim.
3. Render feasibility: Yes — SPACEMAN at up to 120px in the wide column clears the caption at `3xl` with room at 1440.
4. Canvas floor feasible: Yes — roster and description fill the upper field, the terracotta band floods the lower third, marquee spans the wide column.
5. Phone: Yes — the sequence leads with SPACEMAN at `4xl` (8 chars fit 360) and the caption, hero inside the first fold.

## Rationale
The phrase is Doug's own claim, "Deep in both. Not a generalist.", and it demands proof, so the object on the page is the artifact that supplies it: Spaceman, ten years, with the Zeldman/Rolex/Nature Conservancy/Intuit/LastPass roster surfaced as the evidence rail instead of buried in prose, the exact fix the owner asked for. That is why the composition is a broken two-asymmetric split with the artifact title spanning the wide column and the claim landing in the lower third: the reader sees the work and the clients first, then the caesura drops into the terracotta band where SPACEMAN and its caption close the argument.

The chassis is zilla-worksans because "deep in both" is engineering as much as design, and a low-contrast slab reads as built and grounded, not fashion-editorial; it is off the three most-worn faces, spends the middle of the scale with a real display step plus mid heads, and its Index/Broadsheet affinity fits a specimen of one project and its client ledger. Type is set caps, heavy, justified and stacked, four moves off the eight-day mixed/roman/left template the owner keeps reading as templated, with the title tracked edge to edge and the caption stacked a clause per line.

The palette is a warm-sand light sheet resolving into a terracotta band, split-field rather than the recent drench, duotone and dark-void, so a single committed earth hue carries the page without a moving-blob ground the owner called an AI tell. Light-ground gives the original green-and-blue mark a home it has effectively never had, so it sits top-left in full colour and full size, unclipped, inside the first fold at both widths. The header is `none` on purpose: a mark plus in-content links has no rail or bar to sever the wordmark, which is what has broken three ratings running.
