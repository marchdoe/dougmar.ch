# 2026-10-30

**Design Brief:** Spaceman as a foundry specimen, saffron on warm sand, the client list set as the proof and the proverb answered in small type.

## Signals

### Weather
**Location:** Aldie, Virginia
**Conditions:** Clear
**Feel:** undefined

## Claude's Rationale

The phrase is a flex built from the one piece of evidence the About copy owns and then buries: Zeldman, Rolex and the rest hired a single person to do both the design and the build. Because the proof is a client list attached to one project, the page has to lead with that project as an object, not with a slogan, so the hero object is `artifact` and Spaceman becomes the largest thing on the page with the phrase as its caption. An artifact that is really a client list wants the vocabulary of a type foundry specimen: foundry numbers, size markers, hairline rules, one strict rail. That forced the two-asymmetric grid (label rail plus wide field) and the stacked client list set as material flush right.

A specimen needs a display face with weight and width that can carry a single justified word across the field without looking like a default headline, so I reached past the three condensed-caps faces I have been leaning on and past the recently-used zilla/source-serif/anybody set to Unbounded, a blocky expanded geometric that has not shipped. Figtree answers its geometric construction closely enough to read as a chosen pair rather than a neutral body. Small-caps, heavy, justified and the client list stacked are all the specimen's own grammar, and all four move off the recently-repeated mixed/roman/left defaults.

The palette is a warm sand specimen sheet with one saffron turned on, which honors the 40–80° mandate and keeps the page in print register rather than screen glow. Light-ground was chosen over the recently-worn dark-void, drench and duotone formulas: the specimen reads as paper, the saffron does the work in the title, the client names, the dot field and a single flooded colophon band. Depth comes from value and hairline rules, not shadow, which suits both the specimen and the owner's distaste for rounded, templated chrome. The mark sits bare top-left of the field, the project titles navigate, and the whole page resolves against the reading direction, mass to the right, the way a confident claim should.

## Files Changed

- elements/preset.ts
- app/components/Layout.tsx
- app/components/Sidebar.tsx
- app/components/generated/Colophon.tsx
- app/components/generated/ColophonSignals.tsx
- app/components/generated/Label.tsx
- app/components/generated/ArtifactLabel.tsx
- app/components/generated/HeroBand.tsx
- app/components/generated/HomeHero.tsx
- app/components/generated/ClientSet.tsx
- app/components/generated/FeaturedProblem.tsx
- app/components/generated/WorkIndex.tsx
- app/components/generated/AboutStatement.tsx
- app/components/generated/TimelineCatalog.tsx
- app/components/generated/CapabilitySet.tsx
- app/components/generated/AboutColophon.tsx
- app/components/generated/CaseHero.tsx
- app/components/generated/CaseNarrative.tsx
- app/components/generated/CaseStack.tsx
- app/components/generated/CaseStudy.tsx
- app/components/generated/ProjectMissing.tsx
- app/routes/index.tsx
- app/routes/about.tsx
- app/routes/work.$slug.tsx
- app/routes/og.tsx
