# 2026-11-25

**Design Brief:** Sports-page broadsheet front, the Pistons score as the masthead, Detroit red committed on newsprint bone.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Overcast
**Feel:** undefined

## Claude's Rationale

The phrase is a Detroit result: "The Pistons held them to 86." That decides the object first. A score is a figure, so the number `104–86` is the largest thing on the page and the phrase is its caption one step down. A figure that size wants a masthead, and a masthead over a day this full of signals wants a front page, which is why the composition is a three-column broadsheet weighted to a single left rail with the score upper-left and the day's facts packed into even columns beneath it.

The chassis follows from the register of the win: a grind-it-out defensive night, not a shootout. Bitter is a sturdy screen slab with real heavy cuts and strong tabular numerals, grounded rather than loud, which is right for a win built on stops; its `5xl` reaches 160px so the score carries at genuine poster scale. It is not one of the three recently-overused faces, and it holds small-caps and a mid-register head, so I can spend the middle of the scale the way the owner asked. The type is set small-caps, heavy, justified across the hero block, with the oversized score functioning as the field's type-as-texture, all moves off the recently-worn defaults.

The palette amplifies the phrase: Detroit red at full saturation on warm newsprint bone, with a flooded-red footer band so the red is load-bearing, not a garnish. I left the green target range because it sits inside its own forbidden zone and the last two weeks are a wall of greens, teals and blues; a Pistons win is Detroit red, and 350° is the hue furthest from the recent cluster. Film grain gives the bone ground a printed-sports-page register without any banned pattern. The score settles in, the columns reveal on scroll, and at 360 the left spine becomes a full-width nav band with the score still leading.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/SiteFooter.tsx
- app/components/generated/FloodHero.tsx
- app/components/generated/HeroChip.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/HomeDeck.tsx
- app/components/generated/SignalColumns.tsx
- app/components/generated/WorkList.tsx
- app/components/generated/FeaturedCase.tsx
- app/components/generated/WorkIndex.tsx
- app/routes/index.tsx
- app/components/generated/AboutMasthead.tsx
- app/components/generated/TimelineList.tsx
- app/components/generated/FactList.tsx
- app/components/generated/AboutAside.tsx
- app/components/generated/AboutBody.tsx
- app/components/generated/CapabilitiesBand.tsx
- app/routes/about.tsx
- app/components/generated/CaseMasthead.tsx
- app/components/generated/CaseNarrative.tsx
- app/components/generated/CaseDetails.tsx
- app/components/generated/MoreWork.tsx
- app/components/generated/CaseStudy.tsx
- app/components/generated/CaseMissing.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
