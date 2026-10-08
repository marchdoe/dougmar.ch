---
type: knowledge
tags: [area/taste, pillar]
created: 2026-10-08
updated: 2026-10-08
aliases: [Ratings, Design Feedback]
sources: []
status: living
verified: 2026-10-08
---

# Feedback channels

How Doug's judgement of a night reaches the pipeline. These channels are what [[The Four Pillars|pillar 3]] depends on: the gates can say a night is done, and only these can say whether it was good.

## Ratings

1. The nightly opens a `daily-rating` issue for the night it shipped.
2. Doug rates it, either in the `/panel` Rate tab (`app/components/panel/RateTab.tsx`) or with a comment on the issue. Only comments from accounts GitHub vouches for on the repo count.
3. The next run starts with `scripts/collect-ratings.js`. It harvests the issue into `archive/<date>/rating-<ts>.json` (`{ date, grade, worked, didnt, try, timestamp }`) and closes it.
4. `scripts/pipeline/context.js` hands the Art Director the ratings for the ten most recent archived dates (`scripts/utils/ratings.js`), under the heading "the single most important taste signal". The harvester takes every open `daily-rating` issue, so a late rating still lands.

A rating shapes the Art Director for ten nights, then drops out of the window. Rating a night older than the ten most recent dates still archives the rating, but the Art Director never sees it.

As of 2026-10-08 there were 32 harvested ratings. The last one was for 2026-09-22, and the fifteen nights from 09-23 to 10-07 were still open issues. That means the ten-date window was empty, so the Art Director had been working with no ratings at all. The cause was time, not friction.

## `signals/taste.md`

Hand-curated and permanent. The pipeline reads it and never writes to it, apart from `pnpm taste` (below). It holds the gold standards and the standing complaints. This is where [[The Four Pillars|pillar 1]] is written down. A complaint that shows up in ratings twice belongs here, and then in a gate ([[The Four Pillars|pillar 2]]). Last edited 2026-09-12.

## `pnpm taste`

`scripts/taste-note.js` appends a one-line reaction to a canary run under a "Local canary notes" heading in `signals/taste.md`. `pnpm pipeline:canary` prints the exact command at the end of every run that ships. As of 2026-10-08 it had never been used, and the heading doesn't exist yet.

## References

`references/` holds screenshots plus `index.yml`. `scripts/collect-references.js` picks three to five for each brief. The newest local screenshot is from 2026-09-17.

## Related

- [[Spec 11 - Taste And Cost]] adds the taste critic and a fourteen-night memory.
- [[Taste MOC]]
