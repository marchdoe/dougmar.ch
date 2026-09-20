# dougmar.ch

A portfolio site that redesigns itself every night.

A quarter past midnight Eastern, a pipeline collects the day's signals (weather, sports, the market, the moon, whatever else happened), hands them to an Art Director, and rebuilds the home page, the about page and every project page around what the day contained. Every design it has ever made is preserved at `/archive/<date>/`, with an explainer at `/how/<date>` of what it was given and what it decided. The archive is the point. The current design is one night of it.

Live at [dougmar.ch](https://dougmar.ch). Backlog is [the issues](https://github.com/marchdoe/dougmar.ch/issues).

## Running it

pnpm only. Node 22, pinned in `.node-version`.

```bash
pnpm install          # runs panda codegen on the way (prepare)
pnpm dev              # vite dev with the dev panel at /dev
pnpm build            # panda codegen, project the archive JSON, vite build
pnpm preview          # serve dist/ the way Vercel does
```

Checks, which CI runs on every pull request:

```bash
pnpm lint             # biome ci
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest; some suites launch real Chromium
pnpm test:e2e:site    # playwright against a preview server it starts itself
pnpm test:e2e:dev     # the dev panel, against vite dev
```

The pipeline, locally:

```bash
pnpm pipeline:collect # write signals/today.yml from the 19 providers (-- --only season,sun for a subset)
pnpm pipeline         # full run; leaves the night on disk, commits nothing
pnpm pipeline:canary  # a $0 dry run in a disposable worktree, evidence kept
```

Without `ANTHROPIC_API_KEY` the agents run through the Claude CLI on a Max plan, capped at Sonnet. With a key they run through the API at the production tier (Opus for the Art Director and Mockup Designer). `PIPELINE_TIER=dev|prod` overrides that. See `scripts/utils/models.js`.

`pnpm pipeline:canary` worktrees HEAD, installs, and runs the full pipeline there with `MOCK_MODE=false DRY_RUN=true`, so it reproduces exactly what a paid run would do without spending anything, and files the log, trace, cost and any build errors under `docs/evidence/canary/<date>-<time>/`. Run it before merging a change to `scripts/prompts/**`, `scripts/design-agents.js` or `scripts/utils/build-validator.js`, and weekly otherwise — it's the only check that catches what only shows up against the real Claude CLI.

`pnpm pipeline:canary --mock` replays the recorded fixtures through the real loop and gates in about three minutes, with no model call, and is the quick check after a gate or loop change.

## What is where

```
app/                 TanStack Start app
  routes/            index, about, work.$slug, og   <- rewritten nightly
                     archive, how.$date, elements, panel, experiments, work.index
  components/        Layout, Sidebar, and the pieces the engineer composes  <- rewritten nightly
  lib/               archive calendar, eras, signal readers (authored)
  server/            server functions for the archive and signals
  dev-server/        the /dev panel's HTTP endpoints (vite dev only)
  dev-panel.tsx      the /dev panel itself
elements/
  preset.ts          today's PandaCSS tokens  <- written by the Art Director nightly
  chassis/           15 typography systems the Art Director chooses between
scripts/
  run-pipeline.js    entry: collect -> design -> archive
  daily-redesign.js  the nightly, as CI runs it
  design-agents.js   the orchestrator: Art Director -> Mockup Designer -> critics -> React Engineer -> gates
  collect-signals.js runs scripts/signals/*.js in parallel
  agents/            one file per agent: prompt assembly and response parsing
  prompts/           the agents' system prompts, lanes, and the brand contract
  pipeline/          shared phases (the variance mandates)
  utils/             validators, mandates, the surface gate, the archive record, models and budgets
archive/<date>/      that night's record: brief, signals, verdicts, trace, cost, the built files
public/archive/      the preserved sites, one directory per date, served as static HTML
public/archive-data/ the archive projected to JSON for the calendar, plus each day's screenshot and viewport captures copied from archive/ (generated at build)
signals/             profile.yml (yours), today.* (the last collection)
references/          design references the Art Director is shown
docs/                evidence screenshots per issue, specs, and plans
tests/               vitest, and tests/e2e for playwright
```

The two arrows mark the split that everything else is organised around. Files the pipeline rewrites are listed in `scripts/utils/site-context.js` as `MUTABLE_FILES`; anything not on that list is authored and survives the night. Authored routes still sit inside the nightly `Layout.tsx`, so they inherit whatever column width it chose. Size type against the container, not the viewport, or it will overflow on a night the layout narrows (#215).

## The nightly, in order

`.github/workflows/daily-redesign.yml`, two cron entries so the run triggers at 00:15 Eastern in both halves of the year. GitHub has delivered that trigger hours late since late August (#193); starting at midnight is the margin for it.

1. `collect-ratings.js` harvests the owner's grade from yesterday's rating issue.
2. `collect-signals.js` runs the providers. Ones without a key are skipped, not failed.
3. `collect-references.js` picks design references for the brief.
4. `daily-redesign.js` runs the agents. The Art Director decides the hero line, the composition, the chassis and the palette, and writes `preset.ts`. The Mockup Designer renders one HTML mockup; the Mockup Critic judges it from a screenshot. The React Engineer translates the approved mockup into the routes and components.
5. Gates. The build must pass `pnpm build`, the token gate (no unresolved Panda tokens), the static checks (biome, tsc), and the surface gate, which measures every route at 360 and 1440 in both colour schemes and fails on horizontal overflow. Then the Screenshot Critic sees the home page, a project page and the share card.
6. The result is archived, projected, sealed (the preserved pages get a frame with prev/next), and pushed to `main` over a deploy key. Vercel builds from there. A rating issue is opened for the owner.

Each of those gates exists because of a night it would have caught. The comments say which.

## Two panels

`/dev`, under `vite dev` only, guarded to localhost and same-origin: today's signals, the archive, a prompt inspector, and a button that runs the pipeline and streams its log.

`/panel`, on the live site behind HTTP basic auth (`middleware.ts`): rate the latest design, set the creative weights for tonight, trigger a run.

## Conventions

- Biome for lint and format. PandaCSS for styling; no inline style props, no Tailwind.
- Stage by path, never `git commit -a`. The working tree usually holds an uncommitted nightly build.
- Do not run `seal-archive.js` with an uncommitted `public/archive/<date>/` present. The frame derives prev/next from what is on disk and will point committed pages at a date the repository does not have.
- `grep` this repo's served HTML with `-a`. The minified single-line responses make `file` report `data`, and grep silently matches nothing.
- One pull request per issue, based on `main`. No stacks.
