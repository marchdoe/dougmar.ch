# 2026-10-17

**Design Brief:** Grape-violet masthead dare over a gold-tan work index flushed hard right, project names at poster scale as the proof, Criss Jami's line the standfirst above them.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Moderate rain
**Feel:** undefined

## Claude's Rationale

The hero is Criss Jami's dare against waiting, and a portfolio is the one place that line can be answered rather than just repeated. So the composition leads with the work itself: a `list` object, seven projects dated 2008 through 2026, rendered as the biggest thing on the page, with the quote stepped down to a masthead standfirst above it. The dare states the thesis; the index is the evidence that Doug never waited to feel ready. That is the whole because-of chain, phrase to object to grid.

The chassis is Zilla Slab (zilla-worksans), chosen over the three recently-used faces because its sturdy, structural, index-tagged slab sets both a long caps standfirst and a column of poster-scale project names without tipping into either shouting or didone delicacy. It spends the middle of the scale the owner asked for: 4xl quote, 5xl titles, lg standfirst, base body at 62ch, xs labels. The palette deviates from the terracotta target on purpose, because terracotta shipped the last two nights and the repetition gate demands distance; grape violet at 288° sits in the open 252–340° window and reads as conviction, warm-blooded but unmistakably not the clay of yesterday. Paired with a gold-tan ground it makes a true duotone, two committed hues and no neutral void, which is the field-dominant commitment the gold-standard builds reward.

Layout puts the dare in a full-bleed violet masthead, flushed right against a hard edge, the single deliberate risk point: a flush-right specimen index is the most un-templated way to set a ledger, and the ragged left edge is the structure. The mark lives single-color top-left of that violet field, in the first fold at both widths, with nav deferred to a numbered foot ledger that carries the day's signals. On the phone the split and the right edge are gone, so the masthead carries the quote alone in the first 640px and the index scrolls beneath it as proof.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/Reveal.tsx
- app/components/generated/Masthead.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/WorkRow.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/AboutHero.tsx
- app/components/generated/TimelineRow.tsx
- app/components/generated/TimelineSection.tsx
- app/components/generated/CapabilitiesSection.tsx
- app/components/generated/SigGrid.tsx
- app/components/generated/AboutLedger.tsx
- app/components/generated/CaseHero.tsx
- app/components/generated/CaseStudy.tsx
- app/components/generated/CaseExtras.tsx
- app/components/generated/CaseMissing.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
