# 2026-10-07

**Design Brief:** A night-rink scoreboard: steel-blue void, the winning five lit in Red Wings red, the losing three outlined in cold steel, one spine of chrome down the left.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Clear
**Feel:** undefined

## Claude's Rationale

The phrase is a score: the Red Wings won 5–3 last night, and of everything in the feed it is the one fact that is plainly mine, said the way I say a score. Because the anchor is a number, the object has to be a figure, not a statement: the numeral is the largest thing on the page and the words are its caption. A figure that size wants an athletic signage face, so big-shoulders-atkinson carries the numerals (Big Shoulders Display is literally stadium signage) over the hyperlegible Atkinson body for the data rows.

The palette follows the subject. A night game reads as a rink under lights, so the ground is a dark-void in steel blue 222°, the one hue the mandate leaves open and the right cold for ice. The single saturated thing turned on is wing red, carried only by the winning 5 and one hairline under the score; the losing 3 is the same face outlined in steel, so the texture itself states the result. The original green-and-blue mark sits on near-black where it has room to breathe, honoring the contract's preference for the real mark over the mono stand-in.

Layout serves the number. A single centred field, two numerals mirrored across the dash on a horizontal axis, is the scoreboard made literal; a marginal left spine holds the mark and a stacked nav list so nothing competes with the figure. Below it the signals accelerate downward, tightening as they descend, with the market, the weather, and one Nobel line as quiet tabular rows. Nothing animates on load; the dot field drifts slowly like light over ice, and sections below the fold rise on scroll.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/FootStrip.tsx
- app/components/generated/Field.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/SignalStack.tsx
- app/components/generated/HomeSignals.tsx
- app/components/generated/SectionLabel.tsx
- app/components/generated/AboutIntro.tsx
- app/components/generated/Timeline.tsx
- app/components/generated/Capabilities.tsx
- app/components/generated/AboutFacts.tsx
- app/components/generated/WorkHeader.tsx
- app/components/generated/CaseStudy.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/MissingWork.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
