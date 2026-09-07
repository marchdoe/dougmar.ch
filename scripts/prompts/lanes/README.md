# Aesthetic Lanes

Concrete anchor references for the mockup-designer prompt — the successor to
`scripts/prompts/seeds/`. A lane describes an aesthetic register only: mood,
color roles, typography, component styling, and named anti-patterns. It says
nothing about page structure (columns, axis, symmetry, hero placement,
density, rhythm, shell posture, field ratio, collapse); those nine axes are
owned by `scripts/utils/composition-grammar.js` and asserted independently by
the Art Director. Decoupling the two means any lane can pair with any composition
tuple, instead of one lane only ever reaching the prompt when a specific
archetype was chosen.

## A lane does not place the header

Every lane carried a `Nav:` line until 2026-08-30, and between them they
prescribed a fixed top bar, a left sidebar, a corner mark, a logo at the seam
of two zones. That is placement, and placement is the composition tuple's and
the `===HEADER===` block's. The pattern the lanes kept reaching for — a top bar
with a wordmark on the left and text links on the right — is the one the owner
rejected in three consecutive ratings, which is roughly what you would expect
from seventeen files quietly voting for it. The lines are gone (#254).

What a lane may still say about the brand is typographic: that the wordmark
wants small caps, that it is set in the display serif, that it reads all-caps
like a section label. Those are register. Where it sits, how tall the mark is,
whether there is a role line under it — those are declared per day and
measured by both critics.

## A lane does not lay out the page either

The `Nav:` lines were the loudest leak, not the only one. A second sweep (#255)
found column counts in a mobile strategy, tiles pinned to a regular grid or to
varied heights, an annotation column placed beside its glyph, a thumbnail placed
at the left of a row, a kicker in the top-left corner, and half a dozen
instructions to stack, collapse or re-center at a given width. Between them they
were quietly asserting `columns`, `symmetry`, `density` and `hero_zone` — four of
the axes the Art Director is supposed to be free to set. The `collapse` axis
(#452) is the same kind of decision: a lane says nothing about what stacks
at 360 or in what order.

The rule those rewrites follow: say what a thing looks like, never where it goes.
A mobile strategy may say the dominant element stays dominant, that a rule keeps
its weight, that a caption stays a caption; it may not say what sits above what.
Where something is placed is the composition tuple's, and how tall the header is
and where it sits is the `===HEADER===` block's.

`scripts/utils/select-lane.js` scores every lane for the day: a deterministic
hash-derived base, a bonus per composition-axis value the lane's `affinity`
shares with today's tuple, and a penalty if the lane ran in the last 3
builds. Highest score wins — affinity and recency are both a bias, never a
hard filter.

## Front-matter

```md
---
id: tesla-spacex
register: radical-subtraction
affinity: full-bleed, sparse, single, edge-bound
---
```

- `id` — matches the filename; used as the selection key and in `lane.json`.
- `register` — a short kebab-case aesthetic label, for logs and rationale text.
- `affinity` — 3-4 real composition-axis values (see `composition-grammar.js`
  for the vocabulary) this lane's mood tends to suit. Advisory only.

## Lanes

| Lane | Register | From (former archetype) |
|---|---|---|
| `tesla-spacex` | radical-subtraction | Poster |
| `swiss-poster` | grid-rigor | Poster |
| `psychedelic-gig-poster` | maximalist-collage | Poster |
| `wired` | paper-white-editorial-density | Broadsheet |
| `economist` | data-driven-editorial-confidence | Broadsheet |
| `pinterest` | light-masonry-mosaic | Gallery Wall |
| `behance` | dark-portfolio-grid | Gallery Wall |
| `vercel-geist` | dev-precision-specimen | Specimen |
| `klim-specimen` | warm-foundry-annotation | Specimen |
| `framer-stripe` | structural-corporate-tension | Split |
| `arc-browser` | playful-gradient-blob | Split |
| `apple` | cinematic-monochrome-verticality | Scroll |
| `nike` | kinetic-color-block-motion | Scroll |
| `linear` | dark-keyboard-first-density | Index |
| `are-na` | warm-paper-collectors-ledger | Index |
| `notion-mintlify` | soft-warm-minimalism | Stack |
| `cash-app` | bold-saturated-color-blocking | Stack |

The "former archetype" column is provenance only — selection never
consults it. A lane born from the Poster seed can land on a `masonry`,
`three`-column, or `radial` day exactly as readily as `single`/`full-bleed`.

## Licensing

Unchanged from `scripts/prompts/seeds/README.md`: paraphrased from
publicly-known brand and genre characteristics, inspired in structure by
VoltAgent/awesome-design-md (MIT). No DESIGN.md files are copied verbatim.
Lanes referencing historical movements or platform genres describe general,
long-established style characteristics rather than any specific living
brand or copyrighted work.
