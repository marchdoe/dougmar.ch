# 2026-10-09

**Design Brief:** A creed in small-caps italic over a spruce broadsheet index, bone band of clarity above the dark field, one emerald turning on where the work earns it.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Overcast
**Feel:** undefined

## Claude's Rationale

The phrase is a trimmed line from today's Dumbledore quote, "What is easy and what is right," chosen because it is the one fragment that stands as a creed and because it names the choice Doug has made for ten years: the right build over the easy one, buildable before code and faithful after it. A creed needs its evidence beside it, so the composition leads with the work (`hero_object: list`): the index of projects, titles, years, roles and client sets runs down an irregular-twelve grid as the proof, and the fragment stands over it as the standfirst. That is the decision that breaks the eight-day "one poster line" template the owner flagged, because the object on the page changes, not only the grid.

The chassis is Spectral + Albert Sans, fresh across the last fourteen builds and the right literary, considered register for a reflective line about dark times; its quieter hero (96–120px) is reserved exactly for editorial phrases that should not shout, and its display italics let the creed lead in small-caps italic light. The palette is a two-green duotone, deep spruce field for the dark times and a pale bone band for the right choice, with one emerald turning on where the index earns a mark. The overcast 52°F day and the 1.5%-lit new moon are the ground truth for that gravity; the hue sits at 165° inside the mandate's 140–180° target.

Layout flows from all of it: the standfirst and the original green-and-blue mark sit upper-left on the bone field (a light pole where the mark finally gets a home in its own colors, not the sixteenth single-color render), the index flows below and right with per-row spans and a single hard caesura between selected work and experiments, and a ruled ground carries the broadsheet logic. Shell is `none`: no bar, no rail, the index is the navigation, which is the honest posture for a page whose whole argument is the work itself. The creed wipes in; the sections below reveal on scroll.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/SigRow.tsx
- app/components/generated/HeroBand.tsx
- app/components/generated/WorkRow.tsx
- app/components/generated/FeaturedRow.tsx
- app/components/generated/HomeStage.tsx
- app/components/generated/Experiments.tsx
- app/components/generated/PageLinks.tsx
- app/components/generated/AboutHero.tsx
- app/components/generated/TimelineSection.tsx
- app/components/generated/CapabilitiesSection.tsx
- app/components/generated/AboutLedger.tsx
- app/components/generated/WorkHero.tsx
- app/components/generated/CaseFacts.tsx
- app/components/generated/CaseStudy.tsx
- app/components/generated/WorkMissing.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
