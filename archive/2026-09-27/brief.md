# 2026-09-27

**Design Brief:** Phosphor-green log of an eventful Sunday: Carol Burnett's line justified in Space Mono caps across the top edge, the work and the day's scores cataloged as amber terminal entries, the mark alone glowing in a right-margin rail.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Cloudy
**Feel:** undefined

## Claude's Rationale

The hero is Carol Burnett's "No one ever said life was fair. Just Eventful." It wins the preferred quote lane because it is Doug's register exactly, a dry shrug rather than a slogan, and today earns it: one Detroit win, one Detroit loss, a market tick up, a full moon, a nor'easter. The line doesn't want to be a poster shout. It wants to head a record of the eventful day, which is why the object on the page is a `list`, the work index and the day's scores cataloged as log entries, with the phrase as the standfirst banner and the list carrying marquee scale. That directly answers the owner's complaint that every day is one big poster line over a signal list.

Composition follows the line: a justified Space Mono caps banner pinned across the top edge (edge-bound, type-dominant), then two equal columns reading left to right as a strip, work index against the day's event log, the regular row rhythm broken once by a caesura and a single emphasized amber row. The chassis is space-mono-archivo, chosen off the three-night serif streak and off the worn faces; a retro-futurist monospace turns the eventful day into a terminal log, and the concept keeps mono from reading as costume, Doug is a designer-developer and the ledger is a real printout with tabular figures. Type is set caps, justified, heavy, roman, texture none: the justified mono banner and the amber data are the texture, and a log renders as solid type, so an outline or repeated-type ground would undercut the deadpan.

The palette is a duotone, off the recent dark-void, drench and light-ground run: deep pine green (166°, inside the mandate but pushed past the recent 152° and 178° to separate) as the field and amber (44°) as the co-hue flooding the signals band and marking every event. Green and amber are the two classic CRT phosphor colors, so the duotone and the terminal chassis are the same idea. The mark is single-color amber, the honest choice on a two-hue field where the original green-and-blue would blend into the green, and it uses the fresh mark-only-md lockup at the top of a right-margin rail, in the first fold at both widths. Motion is a wipe entrance, the log printing in left to right, with on-scroll reveal so entries rise as you read.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/LogTail.tsx
- app/components/generated/SectionHead.tsx
- app/components/generated/HeroBanner.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/FeaturedCard.tsx
- app/components/generated/IndexList.tsx
- app/components/generated/IndexRow.tsx
- app/components/generated/EventLog.tsx
- app/components/generated/LogRow.tsx
- app/components/generated/SignalBand.tsx
- app/components/generated/FocusCell.tsx
- app/components/generated/LedgerSection.tsx
- app/components/generated/StatementBanner.tsx
- app/components/generated/TimelineList.tsx
- app/components/generated/TagList.tsx
- app/components/generated/KeyValueList.tsx
- app/components/generated/ProjectBanner.tsx
- app/components/generated/ProseBlocks.tsx
- app/components/generated/BuildSection.tsx
- app/components/generated/CaseStudy.tsx
- app/components/generated/MissingProject.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
