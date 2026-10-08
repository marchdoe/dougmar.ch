---
type: spec
tags: [spec, area/site]
created: 2026-04-27
updated: 2026-04-27
aliases: []
sources: []
status: ready
---

# Spec 04 — Archive loading states

**Status:** ready to execute
**Depends on:** none

## Goal

Stop showing "No archive entries yet." while the archive is still loading, and stop showing a blank white screen on the detail page during fetch. Replace both with skeletons that match the eventual layout.

## Today's bug

- `app/routes/archive.tsx:92-94` — `entries.length === 0 ? "No archive entries yet."` collapses two states into one. Same message for "still fetching" and "actually empty".
- `app/routes/archive.$date.tsx:149` — `if (!detail) return null` blanks the page during fetch, so users see a flash of nothing before content appears.

## Decisions

| Question | Decision |
|----------|----------|
| Loading treatment | **Skeleton** matching the real layout — better UX than a spinner, low extra code |
| Library | None — render plain divs with muted bg + 1.2s pulse animation. No new dependencies. |
| Empty state distinct from loading | Yes — empty stays as "No archive entries yet." but only renders after the fetch resolves with zero results |
| Error state | Detail page already has one (`error` flag); no change. Index page silently swallows fetch errors today (`.catch(() => setLoaded(true))`) — leaves it as "No entries yet" which is wrong for a fetch error, but out of scope here |

## Implementation outline

### `app/routes/archive.tsx`

The component already tracks `loaded`. Use it:

```jsx
{!loaded ? (
  // 5 skeleton rows matching ArchiveRow's layout
  <ArchiveRowSkeleton count={5} />
) : entries.length === 0 ? (
  <p style={{...}}>No archive entries yet.</p>
) : (
  entries.map(...)
)}
```

`ArchiveRowSkeleton`: same flex layout as `ArchiveRow` (lines 117-179) but with two muted-bg blocks (one for archetype label width, one for brief preview line) and a small block on the right for the date. Border-bottom pattern preserved so skeleton rows visually feel like real rows.

### `app/routes/archive.$date.tsx`

Replace `if (!detail) return null` with a skeleton matching the four sections:

1. Header section (archetype kicker + date + h1 brief + rationale paragraphs)
2. Tokens section (label + 4-color-swatch-row + 2-font-row)
3. Signals section (label + 3 stacked text blocks)
4. Actions section (back link)

Skeleton uses muted-bg blocks at the same widths as the real content's typical sizes. Same maxWidth/padding wrappers as the real page so layout doesn't shift on load.

### Pulse animation

Single CSS keyframe in each route file (or a shared util):

```css
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
}
```

Applied to the muted-bg blocks. Background color: `var(--colors-border, #e5e5e5)` — already used elsewhere on the page so no new token.

## Acceptance criteria

- [ ] Index page shows skeleton rows while `_data.json` is in flight, then the real list — no flash of "No entries yet"
- [ ] Detail page shows skeleton sections while `_detail.json` is in flight, then the real content — no flash of blank screen
- [ ] On a genuinely empty archive (rare — only at first deploy), index shows "No entries yet" *after* fetch resolves
- [ ] On detail-not-found (404), the existing error message renders unchanged
- [ ] No layout shift between skeleton and final content (max-widths and padding match)
- [ ] Pulse animation respects `prefers-reduced-motion` — fall back to static muted bg

## Risks

- **Out-of-scope refactor temptation.** The current `useEffect` + `useState` pattern could be replaced with TanStack Router loaders (which fetch before render and remove the loading state entirely). Cleaner long-term. Not part of this spec — keep the diff small.
- **Layout shift if skeleton sizes are off.** Mitigation: skeleton block widths derived from typical content widths observed in `_detail.json` samples. Verify in browser at execution time.
