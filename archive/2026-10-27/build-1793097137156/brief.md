# 2026-10-27

**Design Brief:** Victory banner: "detroit" flung italic to the right edge of an acid-lime field, spruce spine down the left, both Detroit scores reversed in the dark.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Clear
**Feel:** undefined

## Claude's Rationale

The phrase is a composed fact: two Detroit teams played this weekend and both won. That decided everything. A win is loud and singular, so the page is a word poster, one word at marquee scale with the scores as its proof, which is the `word` hero object. "detroit" pressed flush to the right edge in a wide squarish grotesk, lowercase and italic and heavy, leans the whole page forward the way a victory feels, and that lean sets the diagonal reading path down to the score panel on the spine.

The chassis is anybody-franklin because the catalog calls it broad, sporty, emphatic, with true italics, and this is a sports line that wants a sporty italic cut; none of the recently-avoided three (big-shoulders, spectral, alfa) carries that register. The palette is a two-hue duotone, acid victory lime against a spruce spine, trading places between schemes. I deviated from the 40-80° gold mandate on purpose: the repetition check flagged hue 46° gold repeating and three of the last seven builds were gold, so staying in that range would have shipped the same page in a new phrase. 92° lime stays warm-leaning and loud without being gold, and at full saturation across the field it is the committed gesture a Risk-7 bold day asks for.

Layout follows from the word on the edge: a single dense column of content hangs on a left spruce spine (marginal shell), the lime field carries the word and deck on its right edge, and the reversed score panel sits low-left so the diagonal from word to evidence is the structure. The spine holds the horizontal lockup and a lowercase vertical nav list, a treatment off the recent rotation, and the original mark sits on spruce in both schemes so Doug's real green-and-blue circle reads every time. At 360 the spine bands to the top and the word drops to the 5xl step so "detroit" clears the fold intact.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/LedgerCell.tsx
- app/components/generated/LedgerFooter.tsx
- app/components/generated/ScorePanel.tsx
- app/components/generated/HeroField.tsx
- app/components/generated/FeaturedEntry.tsx
- app/components/generated/WorkRows.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/PageField.tsx
- app/components/generated/TimelineList.tsx
- app/components/generated/CapabilityGrid.tsx
- app/components/generated/AboutLedger.tsx
- app/components/generated/CaseMeta.tsx
- app/components/generated/CaseStudy.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
