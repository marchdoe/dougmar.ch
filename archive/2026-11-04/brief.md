# 2026-11-04

**Design Brief:** A spec sheet for FishSticks: a chalkboard-green board beside a ruled worksheet, lowercase mono, one red grading-pen mark.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Mist
**Feel:** undefined

## Claude's Rationale

The phrase is a product's whole premise stated as input and output, so the page has to be about that product. That demands an artifact lead: one piece of owned work, FishSticks, at poster scale, with the line as its caption and the h1. Leading with a real built thing is also the strongest answer to the owner's standing note that the page reads as templated, and it breaks a five-build run of design-versus-build and golf heroes by putting a warm, human product up front instead.

An artifact beside the day wants two grounds, not one, so the ground is split-field: a deep chalkboard-green board carries the project, a ruled cream worksheet margin carries the facts. That concept is literal, a word list gets written on a board, and it keeps me inside the 140-180 green target while reading as a board rather than the teal three recent builds used. The one accent is a red grading pen, the single mark on the page, reserved for the one loss and the live up-tick, the way a teacher marks a miss.

A product Doug designed and built reads best in a spec register, which is why the chassis is Space Mono plus Archivo, never shipped recently and tied to today's own sidebar (Paper Mono, a terminal-design piece): `fishsticks` set lowercase like a package name, the caption in true mono italic like a code comment. Lowercase and italic both move off the recency walls, and left alignment is the only honest setting for type that reads as a spec. The folded header keeps the white-disc mark in the first fold on dark green where it passes contrast, the index and ledger fill both columns to a dense specimen, and at 360 the split simply becomes a sequence: board first, worksheet after.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/reveal.tsx
- app/components/generated/Split.tsx
- app/components/generated/Fold.tsx
- app/components/generated/Board.tsx
- app/components/generated/ProjectMeta.tsx
- app/components/generated/ClientPanel.tsx
- app/components/generated/HomeBoard.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/Worksheet.tsx
- app/components/generated/DayLedger.tsx
- app/components/generated/AboutBoard.tsx
- app/components/generated/AboutSheet.tsx
- app/components/generated/CaseStudy.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
- app/components/generated/homeFeature.tsx
