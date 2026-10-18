# Design Reference Library

A curated collection of design references used by the daily redesign pipeline. With a fresh brief the pipeline scores the library against it and keeps the top 5; with no brief (the normal case) the Art Director gets up to 12 entries and picks from them. Entries are text-only unless they carry a `tier` (see below).

---

## How to Add a Reference

1. Save a screenshot into this directory as a `.png` or `.jpg` file.
2. Open `index.yml` and add an entry under `references:`.

```yaml
- file: your-screenshot.png
  url: https://source-url.com
  description: "One sentence describing what makes this reference worth keeping."
  tags:
    composition: poster
    mood: dramatic
    density: sparse
```

3. Commit `index.yml`. Image files are gitignored, except `own-*.png`, which are tracked.

---

## Tag Reference

### composition
How the layout is structured spatially.

| Value | Meaning |
|-------|---------|
| `poster` | Single dominant element, full-bleed or centered |
| `broadsheet` | Multi-column editorial grid, newspaper-like |
| `gallery` | Grid of equal-weight items |
| `scroll` | Vertical narrative flow, one section after another |
| `split` | Two-panel or left/right division |
| `stack` | Stacked horizontal bands or sections |
| `specimen` | Type or element showcase, catalog-like |
| `index` | List or directory structure, text-heavy |

### mood
The emotional register of the design.

| Value | Meaning |
|-------|---------|
| `warm` | Earthy tones, approachable, human |
| `cold` | Blue-grey palette, precise, clinical |
| `energetic` | High contrast, bold moves, kinetic |
| `calm` | Low contrast, generous whitespace, unhurried |
| `dramatic` | Strong shadows, tension, high stakes |
| `minimal` | Near-nothing, reduction as statement |
| `playful` | Unexpected choices, delight, wit |
| `serious` | Restrained, authoritative, no-nonsense |

### density
How much information is packed into the space.

| Value | Meaning |
|-------|---------|
| `sparse` | Lots of breathing room, few elements |
| `moderate` | Balanced — enough to feel complete |
| `dense` | Information-rich, maximalist, layered |

---

## How the Pipeline Uses References

The pipeline reads `index.yml` and, when a fresh brief exists, scores each reference against it. The highest-scoring references go to the Art Director as context. References influence layout composition, typographic mood, and spacing decisions. They do not override the brief, they inform it.

For ordinary entries only the YAML text is sent. The `description` carries the whole signal.

---

## Tiers

Add `tier: floor` or `tier: gold` to an entry to send its image to the models, not just its text.

- `floor`: Doug's minimum bar. Every night must be at least this good. Currently 2026-06-13, 2026-09-12 and 2026-10-17.
- `gold`: aspirational. Empty until Doug names one.

```yaml
- file: own-2026-06-13-fairway-split.png
  tier: floor
  description: "..."
```

Tiered entries are always included first, never dropped by the 12-entry cap or by brief scoring, and later pipeline stages send their images. `scripts/utils/reference-tiers.js` (`loadTier({ root, tier })`) is the single loader; entries whose image is missing are skipped and returned in `missing`.

`own-2026-06-13-fairway-split.png` is rendered from the archive. The 2026-10-17 image is the shipped build's `screenshot.png`, so it includes the archive viewer bar along the top. To render a night from the archive (first fold, 1440x900, needs network for web fonts):

```sh
node scripts/render-archive-fold.js --date 2026-06-13 --out references/own-2026-06-13-fairway-split.png
```

Look at the result before committing it. The viewer frame is hidden in the render, so the page can start 44px down.
