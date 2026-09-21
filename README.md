# dougmar.ch

A portfolio site that redesigns itself every night.

A quarter past midnight Eastern, a pipeline collects the day's signals (weather, sports, the market, the moon, whatever else happened), hands them to an Art Director, and rebuilds the home page, the about page and every project page around what the day contained. Every design it has ever made is preserved at `/archive/<date>/`, with an explainer at `/how/<date>` of what it was given and what it decided. The archive is the point. The current design is one night of it.

Live at [dougmar.ch](https://dougmar.ch). Backlog is [the issues](https://github.com/marchdoe/dougmar.ch/issues).

## Running it

pnpm only. Node 22, pinned in `.node-version`.

```bash
pnpm install          # runs panda codegen on the way (prepare)
pnpm dev              # vite dev with the dev panel at /dev
pnpm build            # panda codegen, project the archive JSON, vite build, pin inline scripts
pnpm preview          # serve dist/ the way Vercel does
```

Checks. CI runs these on every pull request and on every push to `main` (`.github/workflows/ci.yml`, five jobs):

```bash
pnpm lint             # biome ci
pnpm typecheck        # tsc --noEmit
pnpm test             # vitest; some suites launch real Chromium
pnpm build            # the test job builds before the site e2e run
pnpm test:e2e:site    # playwright against a preview server it starts itself
pnpm test:e2e:dev     # the dev panel, against vite dev (CI sets E2E_DEV=1 for it)
pnpm fallow audit --base origin/main   # the architecture job; fails only on what the PR changed
```

Before opening a PR, run `pnpm fallow --summary`. It covers the whole repo and exits 0 on a clean checkout of `main`, so any finding it prints is new. The CI audit above fails only on what the PR changed, so a regression elsewhere reaches `main` without turning CI red.

The pipeline, locally:

```bash
pnpm pipeline:collect # write signals/today.yml from the 19 providers (-- --only season,sun for a subset)
pnpm pipeline         # full run; leaves the night on disk, commits nothing
pnpm pipeline:canary  # a $0 dry run in a disposable worktree, evidence kept
```

Without `ANTHROPIC_API_KEY` the agents run through the Claude CLI on a Max plan, capped at Sonnet. With a key they run through the API at the production tier (Opus for the Art Director and Mockup Designer). `PIPELINE_TIER=dev|prod` overrides that. See `scripts/utils/models.js`.

`pnpm pipeline:canary` worktrees HEAD, installs, and runs the full pipeline there with `MOCK_MODE=false DRY_RUN=true`, so it reproduces exactly what a paid run would do without spending anything, and files the log, trace, cost and any build errors under `docs/evidence/canary/<date>-<time>/`. Run it before merging a change to `scripts/prompts/**`, `scripts/design-agents.js` or `scripts/utils/build-validator.js`, and weekly otherwise — it's the only check that catches what only shows up against the real Claude CLI.

`pnpm pipeline:canary --mock` replays the recorded night under `fixtures/canary/` through the real loop and gates in under a minute on a warm pnpm store, with no model call, and is the quick check after a gate or loop change. `RECORD_FIXTURES=true pnpm pipeline:canary` re-records that night from a real $0 run; do it after a gate or prompt change the old recording cannot pass.

## What is where

```
app/                 TanStack Start app
  routes/            index, about, work.$slug, og   <- the engineer rewrites these nightly
                     __root                         <- the orchestrator writes this one
                     archive, how.$date, elements, panel, experiments, work.index
  components/        Layout, Sidebar                <- the engineer rewrites these nightly
    generated/       components the engineer adds   <- rewritten and swept nightly
                     BrandLockup, Material, SiteCallout, WhitePaper
                                                    <- written by the orchestrator, never by an agent
    panel/           the tabs of /panel
                     the rest of the files here are hand-written
  content/           about, projects, timeline, callout, resume: the site's copy (authored; agents cannot write here)
  lib/               archive calendar, eras, run records, signal readers (authored)
  server/            server functions for the archive and signals
  types/             types shared by the archive and the panel
  dev-server/        the /dev panel's HTTP endpoints (vite dev only)
  dev/               the /dev panel's client for those endpoints
  dev-panel.tsx      the /dev panel itself
api/                 the /panel API as Vercel functions (panel/), with auth and CSRF guards in _lib/
middleware.ts        basic auth and the same-origin check in front of /panel and /api/panel
elements/
  preset.ts          today's PandaCSS tokens  <- written by the Art Director nightly
  chassis-preset.ts  the chosen chassis as a preset  <- written by the orchestrator nightly
  chassis/           15 typography systems the Art Director chooses between
scripts/
  run-pipeline.js    entry: collect -> design -> archive
  daily-redesign.js  the nightly, as CI runs it
  design-agents.js   the orchestrator: Art Director -> Mockup Designer -> critics -> React Engineer -> gates
  collect-signals.js runs scripts/signals/*.js in parallel
  agents/            Art Director, Mockup Designer, Mockup Critic, Screenshot Critic; the React Engineer runs from design-agents.js
  prompts/           the agents' system prompts, lanes, and the brand contract
  pipeline/          shared phases (the variance mandates)
  utils/             validators, mandates, the surface gate, the archive record, models and budgets
archive/<date>/      that night's record: brief, signals, verdicts, trace, cost, the built files
public/archive/      the preserved sites, one directory per date, served as static HTML
public/archive-data/ the archive projected to JSON for the calendar, plus each day's screenshot and viewport captures copied from archive/ (generated at build)
signals/             profile.yml (yours), today.* (the last collection)
references/          design references the Art Director is shown
fixtures/agents/     the recorded night the swarm tests assert against (frozen)
fixtures/canary/     the recorded night `pipeline:canary --mock` replays; `FIXTURE_DIR` picks either
docs/
  adr/               decisions that are hard to reverse
  research/          dated analyses
  specs/             numbered specs; some are marked superseded
  evidence/          screenshots and canary runs, kept per issue
tests/               vitest, and tests/e2e for playwright
```

The arrows mark the split that everything else is organised around. Files the pipeline rewrites are listed in `scripts/utils/site-context.js` as `MUTABLE_FILES`, plus everything under `app/components/generated/`; anything else is authored and survives the night. Authored routes still sit inside the nightly `Layout.tsx`, so they inherit whatever column width it chose. Size type against the container, not the viewport, or it will overflow on a night the layout narrows (#215).

## The nightly, in order

`.github/workflows/daily-redesign.yml`, two cron entries so the run triggers at 00:15 Eastern in both halves of the year. GitHub has delivered that trigger hours late since late August (#193); starting at midnight is the margin for it.

1. `collect-ratings.js` harvests the owner's grade from yesterday's rating issue.
2. `collect-signals.js` runs the providers. Ones without a key are skipped, not failed.
3. `collect-references.js` picks design references for the brief.
4. `daily-redesign.js` runs the agents. The Art Director decides the hero line, the composition, the chassis and the palette, and writes `preset.ts`. Before anything renders, code checks the reply against itself (`scripts/utils/ad-spec-checks.js`): every hex in the spec's Color Specification must be one the preset defines, `hero_scale` may not pass the biggest step on the chassis ramp, and `hero_step_360` must be a step on it. A mismatch sends the Art Director back once with the finding in the brief. The Mockup Designer renders one HTML mockup; the Mockup Critic judges it from a screenshot. The React Engineer translates the approved mockup into the routes and components.
5. Gates. The build must pass `pnpm build`, the token gate (no unresolved Panda tokens), the static checks (biome, tsc, and `fallow audit --base HEAD`, the same audit CI's architecture job runs), and the surface gate, which measures every route at 360 and 1440 in both colour schemes and fails on horizontal overflow. Then the Screenshot Critic sees the home page at 1440 in both schemes, phone renders of the home page, `/about` and a project page, and a project page at 1440.
6. The result is archived, projected and sealed (the preserved pages get a frame with prev/next). Then `pnpm test` and `pnpm test:e2e:site` run against it, and a failure there means nothing reaches `main`. The `publish` job applies the night as a patch and pushes it over a deploy key. Vercel builds from there. A rating issue is opened for the owner.

Each of those gates exists because of a night it would have caught. The comments say which.

## Two panels

`/dev`, under `vite dev` only, guarded to localhost and same-origin: today's signals, the archive, a prompt inspector, and a button that runs the pipeline and streams its log.

`/panel`, on the live site behind HTTP basic auth (`middleware.ts`): rate the latest design, browse the archive, set the creative weights for tonight, trigger a run.

## Conventions

- Biome for lint and format. PandaCSS for styling; no inline style props, no Tailwind.
- Stage by path, never `git commit -a`. The working tree usually holds an uncommitted nightly build.
- Do not run `seal-archive.js` with an uncommitted `public/archive/<date>/` present. The frame derives prev/next from what is on disk and will point committed pages at a date the repository does not have.
- `grep` this repo's served HTML with `-a`. The minified single-line responses make `file` report `data`, and grep silently matches nothing.
- One pull request per issue, based on `main`. No stacks.
