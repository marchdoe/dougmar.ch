# 2026-10-24

**Design Brief:** Trophy-amber scoreboard, the score as the sun, oxblood marks the seventeen, Alfa Slab flip-board on a late-October flood.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Clear
**Feel:** undefined

## Claude's Rationale

The phrase is a composed Detroit score, "Pistons run away with it, 128–111," the one signal today that is unambiguously Doug's. A blowout is a number, so the composition leads with the object: hero_object `figure`, the score at poster scale, dead center, with everything else in the day treated as satellites that orbit it. Radial axis and a three-column grid give those satellites their positions; the near-symmetry of the orbit is broken once, the oxblood margin chip and the full-moon disc pulled off-axis, and that single violation is the focus the composition mandate asks for.

A score that runs away with it wants weight and physicality, not elegance, so the chassis is alfa-rubik, an ultra-bold fatface slab that has never shipped here and whose numbers read like a fairground flip-board at 160px. Its single display weight and roman-only cut force `weight: regular` and `lead: roman`; the caps, centred setting and type-as-texture ("DETROIT" ghosted amber-on-amber behind the score) are the decisions carrying the typographic variance. The palette is triumph made literal: a 34° trophy-amber drench across ~70% of the viewport, the gold-standard scoreboard flood, pushed off the recent gold cluster toward orange, with one oxblood accent doing exactly one job, marking the seventeen-point margin.

Layout serves the figure end to end. Footer-only defers the nav to a knockout box-score band at the foot where the day's facts belong, and plants the brand mark top-center of the hero so it sits in the first fold the owner keeps asking for; because a bright amber is a saturated mid-tone, the contract's contrast test fails the full-colour mark, so it renders single-color at 6.9:1 and will not sink. At 360 the orbit collapses to hero-only: the score stacks 128 over 111 like a board, caption beneath, satellites flattened into a column below. The home callout takes the caesura gap between the orbit and the footer.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/FootNav.tsx
- app/components/generated/BoxScore.tsx
- app/components/generated/Pod.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/ChartBand.tsx
- app/components/generated/projectFields.tsx
- app/components/generated/FeaturedWork.tsx
- app/components/generated/WorkList.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/Kicker.tsx
- app/components/generated/AboutHero.tsx
- app/components/generated/TimelineSection.tsx
- app/components/generated/CapabilitiesSection.tsx
- app/components/generated/EducationSection.tsx
- app/components/generated/PersonalSection.tsx
- app/components/generated/CaseHero.tsx
- app/components/generated/CaseBody.tsx
- app/components/generated/CaseMissing.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
