# 2026-11-02

**Design Brief:** Night-scoreboard poster: 19–15 glowing in gridiron green on a floodlit near-black field, Big Shoulders numerals with an outlined DETROIT ghost behind.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Overcast
**Feel:** undefined

## Claude's Rationale

The phrase is a fan line about a four-point win, "Lions win ugly, and I'll take it." It is the one signal that is unmistakably Doug: his team, his first person, his opinion, said the way the voice file says a score is a score. Because the win itself is a number, the composition leads with the number: hero_object is `figure`, the score `19–15` set at poster scale, the phrase as its caption. That is the mandate's own starting object, and it fits the day cleanly.

Because the object is a scoreboard number, the chassis is big-shoulders-atkinson: condensed athletic signage is literally the register of a scoreboard, and Big Shoulders renders the numerals heavy at 160px while Atkinson Hyperlegible keeps the rail and body clean. I reached for a condensed face despite the mandate's caution against defaulting to them, because a sports figure genuinely wants signage numerals, not because it needs scale. The palette follows from the field: gridiron green at 149°, inside the color mandate, reversed out of a near-black green-tinted void, so the score glows like a lit board at night. Dark-void is the ground strategy, off the recent drench/duotone/light-ground list, with a low grain for stadium-light atmosphere and no dots (standing complaint).

Layout carries the chain: an irregular-twelve grid gives the figure 8 columns of poster width with a 4-column signal rail holding golf, market, moon, weather and music, left-weighted and anchored upper-left to match the one-sided fan voice. The brand is a stacked-md mark in a top-left corner cluster with a hairline-ruled vertical nav index, off the recently-used lockups and placements and well clear of a top bar. The figure rises into place and the grain drifts slowly, the restrained motion the owner asked to push toward, while every section stays visible without scroll reveal. At 360 the figure stacks over the phrase as the whole first fold and the rail becomes a band beneath.

## Files Changed

- elements/preset.ts
- app/components/generated/SectionHead.tsx
- app/components/generated/SignalRow.tsx
- app/components/generated/SignalRail.tsx
- app/components/generated/ScoreFigure.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/OffTheClock.tsx
- app/components/generated/TickerFooter.tsx
- app/components/Sidebar.tsx
- app/components/Layout.tsx
- app/routes/index.tsx
- app/components/generated/AboutHero.tsx
- app/components/generated/TimelineIndex.tsx
- app/components/generated/CapabilityStrip.tsx
- app/components/generated/AboutRail.tsx
- app/routes/about.tsx
- app/components/generated/CaseHero.tsx
- app/components/generated/CaseCta.tsx
- app/components/generated/CaseStudy.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
