---
type: spec
tags: [spec, area/site]
created: 2026-10-07
updated: 2026-10-07
aliases: []
sources: []
status: in-progress
---

# 12. The live rail (#702)

The archive's top rail, adapted for the live site, so a first-time visitor learns the site is redesigned every morning.

## Decisions

Doug made these on 2026-10-06 and 2026-10-07. They override the issue body where the two disagree.

- **Routes.** The rail renders on `/`, `/about` and `/work/*` only. It is rendered from `__root.tsx`, outside `<Layout>`, and is not shown on `/archive*`, `/how/*`, `/elements`, `/panel`, `/experiments`, `/work` or `/og`.
- **In flow.** The rail sits at the top of `<body>` in normal flow, 44px tall, and scrolls away with the page. It has no fixed or sticky positioning.
- **Desktop copy.** `Archive · N designs   ‹   Today, October 6   A new design ships every morning.   [Read the white paper] [How it was made]`
  - The white paper button goes to `/work/dougmar-ch` and comes first. The "How it was made" button goes to `/how/<date>`.
  - `‹` goes to the previous archived snapshot, `/archive/<prev>/`. There is no `›`.
- **Phones (under 480px).** `Archive   Today   [White paper] [How]`, with no arrows.
- **Between 480 and 640px.** The note is hidden, the same as on the archive rail.
- **Unchanged.** `<SiteCallout />` stays. The footer archive link on non-home pages stays.
- **Archived rail.** The note becomes `Archived design. See today's →` and links to `https://dougmar.ch/`. It has to be a full URL, because `archive-seal-corpus.test.js` fails on any root-relative `href` outside `/archive` and `/how`.
- **Day's pinned headers.** A `position: fixed` element at `top: 0` covers an in-flow rail at scroll 0. The engineer prompt says top bars are `sticky`, never `fixed`, and a surface-gate check fails a build where a fixed element overlaps `[data-live-frame]` at scroll 0. A sticky header doesn't need the check, because it is in flow below the rail until the rail has scrolled away.

## Where the issue was wrong

- No rail string trips `SELF_REFERENCE` or any other tell (checked with `findTells`), so no copy-gate exemption is needed.
- `text-contrast.js` `ORCHESTRATOR_PARTS` reassigns a failure to a human; it doesn't block it. The rail's colours are fixed literals pinned by a unit test instead.
- Tonight's `/how/<date>` isn't in the nightly's `dist/`, because the build runs before `archive()`. The nightly e2e checks the link's `href`, not its status.
- `stripFrame` can't remove a React-rendered rail, and the corpus "exactly once" test only counts `data-archive-frame`.
- The PR doesn't touch `public/archive/`. The nightly reseals the whole archive every run (`archiver.js`), so the new archived note reaches every page on the first night after merge. Until then, `node scripts/seal-archive.js --check` reports every page as changed. That is expected.

## The marker

The rail's root is `<div data-live-frame="<YYYY-MM-DD>">`, and it contains **no nested `<div>`**: only `span` and `a`. That lets `stripLiveFrame` cut at the first `</div>`, the same way `stripFrame` does. A unit test enforces it.

## Phase 1: three parallel tasks, disjoint files

### Task A. Archive side

Files: `scripts/utils/archive-seal.js`, `scripts/utils/snapshot.js`, and their unit tests: `tests/utils/archive-seal*.test.js`, `tests/scripts/archive-seal-corpus.test.js` and the snapshot tests.

1. `buildFrame`: the note becomes `<a class="af-note" href="https://dougmar.ch/">Archived design. See today&rsquo;s &rarr;</a>`. Keep the muted colour, the ellipsis, and the rule that hides it under 640px.
2. Export `LIVE_FRAME_MARKER = 'data-live-frame'` and `stripLiveFrame(html)` from `archive-seal.js`.
3. `processHtml` in `snapshot.js` calls `stripLiveFrame` before it rewrites links. `sealPage` also calls it, so a snapshot captured before this change can't carry two rails.
4. The corpus "exactly once" test also asserts that there are zero `data-live-frame` elements. Add a unit test that sealing a page carrying a live rail gives exactly one rail.

### Task B. Live rail

Files: `app/components/LiveRail.tsx` (new and hand-written; agents can't write `app/components/` outside `generated/`), `app/content/rail.ts` (new), `scripts/templates/__root.tsx.template`, `app/routes/__root.tsx`, `scripts/utils/chassis.js` (`renderRootTemplate`), `scripts/utils/archive-count.js`, the four `renderRootTemplate` callers, `tests/scripts/root-template.test.js`, and `tests/e2e/site-health.spec.ts`.

1. Copy lives in `app/content/rail.ts`, which agents can't write.
2. `LiveRail` takes `date`, `prevDate | null` and `archiveCount`.
   - Styles are Panda `css()` with literal values only, no runtime values (see the Panda static-extraction trap, PR #525). The colours and system font stack match the archive rail.
   - The long and short labels swap at 480px.
   - Every tap target is at least 44px tall on phones.
3. The template gains `{{DESIGN_DATE}}` and `{{PREV_DATE}}`. `renderRootTemplate` validates them. The callers pass `runDate(signals)` / `state.today` and the latest archived date before it, from a new `latestArchivedDateBefore()` in `archive-count.js`.
4. `RootComponent` renders `<LiveRail …/>` before `<Layout>` when the path is `/`, `/about` or `/work/*`.
5. Regenerate the committed `app/routes/__root.tsx` so it matches the template.
6. Site-health e2e:
   - The rail is visible on `/`, `/about` and one `/work/*` page.
   - Its "How it was made" link is `/how/<data-live-frame date>`.
   - The `‹` link returns 200.
   - `a[data-archive-link]` counts are unchanged.
   - The archive frame assertion `'not the current site'` becomes `'Archived design'`, so it passes on both old and newly sealed pages.
7. A unit test pins the rail's colours and checks contrast of at least 4.5:1 for every text colour on its background.

### Task C. Gates, captures and prompts

Files: `scripts/utils/surface-gate.js` and/or `scripts/utils/shell-overlap.js`, `scripts/utils/design-fidelity.js`, `scripts/utils/geometry-fingerprint.js`, `scripts/utils/mockup-fidelity.js`, `scripts/prompts/{react-engineer,art-director,mockup-designer,screenshot-critic}.md`, `tests/pipeline/__snapshots__/swarm-calls/*`, and their unit tests.

1. **Overlap gate.** At scroll 0, any element with computed `position: fixed` whose box intersects `[data-live-frame]` is an error-severity finding owned by the react engineer. Rail descendants are excluded.
2. **Measurement without the rail.** Design fidelity, the geometry fingerprint and mockup fidelity measure the design, not the site frame. They ignore `[data-live-frame]` and its height, so the mockup comparison isn't shifted by 44px. Critic screenshots and the brand-fold and hero-fold gates keep the rail, because they judge the page as visitors see it.
3. **Prompts.**
   - **Engineer:** the top 44px of `/`, `/about` and `/work/*` is the site's rail, rendered above `<Layout>`. Pin top bars with `sticky`, never `fixed`.
   - **Art director and mockup designer:** the fold starts 44px lower on those pages. Mockups are drawn without the rail.
   - **Critic:** the dark band at the top is the site frame, identical every day, and not part of the design.

## Phase 2: me

- Run biome, tsc, fallow, `pnpm test` with `GITHUB_ACTIONS=true`, and site-health e2e.
- Take screenshots at 1440, 768, 390 and 320px on `/`, `/about` and `/work/*`, and measure the 320px fit.
- Run a pinned-header check against 2026-07-07 (sticky) and a synthetic fixed header for the gate.
- Run one `pnpm pipeline:canary --mock` in the worktree.
- Open the PR with screenshots in `docs/evidence/live-rail/`.
