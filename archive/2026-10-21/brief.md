# 2026-10-21

**Design Brief:** A foundry specimen of a decade of work, the diamond maxim inscribed small-caps in gold over a carbon index, halftone carbon underfoot.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Clear
**Feel:** undefined

## Claude's Rationale

The phrase is a wry maxim: a diamond is charcoal that handled stress exceptionally well. It is a thesis about transformation under pressure, which is exactly what Doug does for a living, close the gap between what gets designed and what gets built. So the composition cannot be a single poster statement; the maxim needs evidence. That drove `hero_object: list` — the work index leads at marquee scale (POLITWEETS, SPACEMAN, FISHSTICKS, 15TH CLUB as condensed caps), and the maxim inscribes above it as the standfirst. The index is the diamonds; the phrase explains how they got hard.

Because the object is a loud index of short project names, the chassis is bebas-plex: a condensed editorial/catalog display, declarative, built for exactly this. It has not shipped in fourteen builds, so it also breaks the three-chassis monoculture the mandate flags. Single display weight forces `weight: regular`, honest for Bebas. The maxim sits one step down at `2xl` in small-caps, justified, which reads like an engraved inscription — fitting for stone and carbon. Small-caps and justified are both the only values the Type Treatment Mandate had not just used, so the fresh register and the thematic register agree.

The palette is duotone, not a drench or a void: gold and carbon carry the page together, no neutral grey. Gold at 46° is the diamond's fire and sits inside the color mandate; carbon is the charcoal, warm-tinted toward the same amber for cohesion. The gold standfirst plane and the mass of gold index titles keep gold above 40% of the field, so it reads as a true second ground rather than an accent on black. A halftone carbon screen underfoot gives the specimen its printed, carbon-dot register. The right-margin header keeps the owner's rejected top-bar off the page while giving the brand a first-class, first-fold home, and the mark sits on carbon where the full-color original passes cleanly.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/copy.tsx
- app/components/generated/HomePlane.tsx
- app/components/generated/IndexRow.tsx
- app/components/generated/FeaturedEntry.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/SignalsBand.tsx
- app/components/generated/SpecimenTail.tsx
- app/routes/index.tsx
- app/components/generated/AboutPlane.tsx
- app/components/generated/TimelineIndex.tsx
- app/components/generated/CapabilitiesBand.tsx
- app/components/generated/EducationRows.tsx
- app/components/generated/PersonalTail.tsx
- app/routes/about.tsx
- app/components/generated/CaseHead.tsx
- app/components/generated/ProblemPlane.tsx
- app/components/generated/CaseNarrative.tsx
- app/components/generated/CaseStack.tsx
- app/components/generated/ClientBand.tsx
- app/components/generated/CaseBody.tsx
- app/components/generated/CaseMissing.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
