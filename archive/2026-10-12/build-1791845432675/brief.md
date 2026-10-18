# 2026-10-12

**Design Brief:** Grass-green index-specimen on warm paper: a reflective standfirst ruled over the work, tomorrow's years first, the original mark standing at the top.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Overcast
**Feel:** undefined

## Claude's Rationale

The phrase is a forward instruction in the plural — the opportunities of tomorrow — so the page cannot be a single poster line held in isolation; it has to show the opportunities. That pointed me straight to `hero_object: list`: the quote becomes a reflective standfirst and Doug's forward work (dougmar.ch 2026, 15th Club 2025, FishSticks 2025, then the older experiments) reads as a twelve-column index ordered newest-first, so the structure literally spends its attention on what is next. The broken, interrupted twelve-grid lets one row (dougmar.ch, the current year) break its alignment as the focal caesura, which keeps the page from reading as a tidy template.

Spectral + Albert Sans is the chassis because the quote wants a considered, literary register, not a shout, and its quietest-tier display (64→96 hero, 64→120 at 5xl) is exactly the reservation the catalog describes for reflective lines — the quote sits in display italic while the index titles take the 5xl marquee at small caps. It is also fresh against a fourteen-day run that leaned on condensed and grotesque faces. The treatment moves off eight nights of sameness on every field the mandate tracks: small caps (not mixed/lower/caps), italic lead, left alignment (not right/centred/justified), and type-as-texture from the oversized index.

Palette and shell follow. Light-ground on warm green-tinted paper breaks the recent run of drench, dark-void and split-field, and it is the one ground where the Brand Contract actively wants the original green-and-blue mark — so the real stacked-lg mark anchors the top-left masthead in its own colors, which it has effectively never done on the shipped site. One committed grass-green accent at 112° carries the growth reading of "tomorrow" while clearing every forbidden hue zone, and ruled hairlines (`ground_material: rule`) do the specimen's layout work. A left-to-right `wipe` entrance reads as forward motion, and on-scroll reveal brings the index rows up as evidence as you read down.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/NavSentence.tsx
- app/components/generated/IndexLabel.tsx
- app/components/generated/SigRow.tsx
- app/components/generated/Colophon.tsx
- app/components/generated/FeaturedCaesura.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/AboutStandfirst.tsx
- app/components/generated/TimelineIndex.tsx
- app/components/generated/CapabilitiesEducation.tsx
- app/components/generated/PersonalSigs.tsx
- app/components/generated/CaseHero.tsx
- app/components/generated/CaseBody.tsx
- app/components/generated/CaseMissing.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
