# 2026-09-13

**Design Brief:** Detroit-red scoreboard glowing out of a warm near-black void — 11–7 mirrored across a dash in athletic condensed caps, the real green-and-blue mark back in the corner, one accent pulse on the winning number.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Fog
**Feel:** undefined

## Claude's Rationale

The phrase decides everything, and today the strongest line is Doug's, not the machine's: the Detroit Tigers won 11–7. After a week where five of eight heroes were borrowed quotes or the site talking about itself, a scoreboard fact returns the subject to the owner — a Detroit sports fan on a Sunday morning — and it plays directly to his two highest grades, both of which were score-led (the trophy-gold scoreboard flood and the fairway split). Stated plainly as a signal-event, "TIGERS 11–7" is quotable in isolation and it wants marquee numerals.

Because the phrase is a scoreboard, the composition is radial and mirrored around a single center: "11" and "7" reflected across a dash, the score as the sun with everything radiating and accelerating downward. That demands an athletic signage voice, so the chassis is big-shoulders-atkinson — its condensed display is the literal register of stadium numerals (not a lazy default-to-condensed-for-scale, but the exact use case), and it is fresh, unused in the last fourteen builds. The palette turns on one saturated hue at volume: Detroit red at 356°, the city's own color, glowing off a warm near-black void. This deviates from the 140–180° green mandate deliberately — the last three greens (158°, 162°, 125°) dominated the recent window, the repetition check demanded a hue 60°+ off them, and triumph calls for a single saturated hue; red is both fresh and genuinely Detroit (Red Wings).

Layout and shell answer the owner's standing complaints head-on. Ground strategy is dark-void (fresh against the week's drench/light-ground/duotone run), and crucially a warm dark ground gives the original green-and-blue mark somewhere to sit — so brand_color_mode is original for the first time in effectively 17 builds, addressing "the single-color mark disappears" directly. Shell posture is standard with a corner header, putting the real circular mark in the first fold at both 1440 and 360, which fixes the repeated "no brand above the fold" failure. The scoreboard sits on a large saturated red field panel centered in the void; every other signal — market up-tick, fog, crescent moon, golf, music-on-rotation, and a demoted Aristophanes footnote — lives as a subordinate tabular box-score strip.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/HeroScoreboard.tsx
- app/components/generated/DataGrid.tsx
- app/components/generated/BoxScoreStrip.tsx
- app/components/generated/Footer.tsx
- app/components/generated/FieldBand.tsx
- app/components/generated/TimelineLedger.tsx
- app/components/generated/CapabilityTags.tsx
- app/components/generated/CaseStudyNarrative.tsx
- app/components/generated/CaseStudyMeta.tsx
- app/components/generated/WhitePaperContext.tsx
- app/components/generated/WhitePaperProcess.tsx
- app/components/generated/WhitePaperDecisions.tsx
- app/components/generated/WhitePaperReferences.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
