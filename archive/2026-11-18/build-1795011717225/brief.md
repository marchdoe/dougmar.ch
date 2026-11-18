# 2026-11-18

**Design Brief:** Low-sun amber on warm paper, one light-italic weather note centered in the fold, bright to dark by five.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Sunny
**Feel:** undefined

## Claude's Rationale

The phrase is a plain three-beat weather fact with an arc, "Bright, 42, and dark by five." Because it is quiet and observational, not a shout, I reached past the condensed-caps register to spectral-albert, an editorial serif that loads true display italics; set lowercase, light weight, italic, it reads like a line of verse murmured about the day rather than a slogan. The hero_object is a `statement` that owns the entire first fold (hero-only collapse), with the axis running diagonally to echo the low November sun sliding from bright to dark.

Palette follows the line directly: "bright" wants a light-ground, so the field is warm sunlit paper, not a dark void (and it breaks the recent run of drench, duotone and split-field dark grounds). The one saturated amber at 42° is the sun itself, spent on the numeral 42 inside the hero, on the hover links, and flooded across the footer band where the day closes. The neutrals are warmed toward the same amber so paper and sun share a skeleton; charcoal ink carries the cold.

Shell and header serve the withholding: shell_posture none means no nav bar at all, just the bare circular mark top-left and in-content links, which keeps the single statement uncontested. I reused mark-only-md against the Shell Mandate because a statement poster wants the quietest possible lockup, nothing competing with the one line. The wipe entrance reveals the phrase left to right like first light crossing the field, one gesture, and the vertical mirrored margin labels (place, date) give the symmetric field its balance and the type treatment its texture.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/FeaturedWork.tsx
- app/components/generated/IndexList.tsx
- app/components/generated/WorkSection.tsx
- app/components/generated/TodayFacts.tsx
- app/routes/index.tsx
- app/components/generated/AboutStatement.tsx
- app/components/generated/AboutBand.tsx
- app/components/generated/AboutTimeline.tsx
- app/components/generated/AboutDetails.tsx
- app/routes/about.tsx
- app/components/generated/WorkHero.tsx
- app/components/generated/CaseStudy.tsx
- app/components/generated/WorkMissing.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
