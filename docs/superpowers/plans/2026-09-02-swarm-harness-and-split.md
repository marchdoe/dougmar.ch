# The swarm, tested and then split — plan

**Spec:** `docs/superpowers/specs/2026-09-02-swarm-harness-and-split-design.md`.
**Source:** [#221](https://github.com/marchdoe/dougmar.ch/issues/221).
**Rule for every task:** no prompt, model, budget, retry bound or rollback set changes. If a task needs one to pass, stop and say so.

## Load-bearing facts

Measured 2026-09-02 against `82f03c3`. Line numbers are `scripts/design-agents.js`.

- `runAgentSwarm` spans 466 to 2282. Nested functions: `saveTrace` 536, `archiveFailedSources` 593, `archiveAndReturn` 1676, `runScreenshotCriticGate` 1763, `measureSurfaces` 1782.
- Shared state that crosses phases: `today`, `weights`, `trace`, `archiveRan`, `swarmError`, `writtenPaths`, `verdicts`, `finalScreenshot`, `originalBackup`, `artDirectorResult`, `chosenArchetype`, `chosenComposition`, `headerDecl`, `chosenChassis`, `shellDecl`, `tokenResult`, `mockup`, `mockupScreenshot`, `engineerResult`, `buildResult`, plus the prompt strings and mandate sections loaded once at 632 to 802.
- Retry bounds: Art Director 1 retry (851); codegen 1 retry through a third Art Director call (999); mockup loop `MAX_MOCKUP_REVISIONS = 2` so at most 3 designer calls (1383); engineer 1 stall retry (1569); engineer output loop `MAX_OUTPUT_RETRIES = 2` (1594); post-critic revision at most 1 per gate (2044); repair loop `MAX_REPAIR_ATTEMPTS = 3` (2199).
- Deadline checkpoints (`pastDeadline()` from `run-budget.js`): 1389, 1482, 1544, 1564, 1600, 2033, 2200. Two of them throw with no restore (1389, 1544).
- Rollback sets: `restore(originalBackup)` after Art Director, mockup, engineer and repair failures; `restore(passingBackup)` after a failed post-critic revision; `restore(filesToRestore)` at 2166 skips every `art-director`-owned path; `cleanupOrphans(writtenPaths, ...)` precedes most of them.
- `saveTrace` writes `archive/<today>/<newest build-*>/trace.json` when `archiveRan` is true, else `archive/<today>/build-failed-<ts>/{trace.json,error.txt}`.
- Model seams: `callClaudeCLI` (only inside `callAgent` and the three agent modules) and `callVisionAgent` (mockup critic, screenshot critic). Fixtures: `fixtures/agents/<agent>/00.txt` for all six agents.
- Process and browser seams: `spawnSync` for codegen (428), `validateBuild` (1660, 2055, 2070, 2256), `formatGeneratedFile` (951, 962, 1037, 1046, 1699), `captureHtmlFileScreenshot` (1413), `captureScreenshot` (1838, 2097), `captureRouteScreenshot` (126, 1892), `runSurfaceGate` (1786), `listGeneratedRoutes` (1888), `archive` (1725).
- `ROOT` appears 34 times in the file. `backup`, `restore` and `cleanupOrphans` use the module constant; `writeFiles` already takes `{ root }`.
- Existing tests that read the swarm's source as text: `tests/scripts/design-agents.test.js` describes "the Phase 5 repair loop", "one run date", "the two required calls check the deadline before starting", "the surface gate decides, not just measures", "engineer output reaches disk through one function".

## PR 1: harness

Branch `enh/221-swarm-harness`. Closes nothing; #221 stays open for PR 2.

### Task 1: the root option

Files: `scripts/utils/file-manager.js`, `scripts/design-agents.js`, `tests/scripts/file-manager.test.js`.

- `backup(filePaths, { root = ROOT } = {})`, `restore(backupMap, { root = ROOT } = {})`, `cleanupOrphans(writtenPaths, backupMap, { root = ROOT } = {})`. Tests: each writes and reads under a temp root and never touches the module root.
- `runAgentSwarm(context, { onTraceStep, root = ROOT } = {})`. Every `ROOT` in the swarm body and in `writeEngineerFiles`, `captureOgCard`, `writeArchetype` and `validateCodegen` becomes `root`, passed explicitly to the three helpers. `validateBuild`, `formatGeneratedFile`, `writeFiles`, `computeMandateSections`, `countArchivedDesigns`, `selectLane`, `readRecentRatings`, `buildLessonsBlock`, `buildTasteMemoryBlock`, `buildRecentRatingsBlock` and `archive` receive the root or a path under it. A source test asserts `ROOT` no longer appears inside `runAgentSwarm`.
- `scripts/daily-redesign.js` and the dev panel runner keep calling with no option.

### Task 2: the harness

File: `tests/pipeline/swarm-harness.js`.

- `seedRoot()`: `tempRepoRoot()` plus copies of `scripts/prompts/` (including `lanes/` and `impeccable/`), `elements/chassis/`, `elements/preset.ts`, `app/assets/`, `signals/today.yml` from `tests/fixtures`, and `archive/2026-08-29/` and `archive/2026-08-30/` with a `record.json` and `brief.md` each so the advisory blocks have something to read.
- `scriptAgents(overrides)`: per-agent arrays of responses, defaulting to the agent's fixture. `callClaudeCLI` and `callVisionAgent` fakes shift from the queue, record `{ agent, systemPrompt, userPrompt, options }` into `calls`, and replay the last entry when the queue runs dry, matching `nextFixture`. A queue entry may be an `Error` to throw instead.
- Fakes with call recorders for `spawnSync` (codegen), `validateBuild`, `formatGeneratedFile`, the three captures, `runSurfaceGate`, `listGeneratedRoutes` and `archive`. Each scriptable per call in order. The `archive` fake creates `archive/<date>/build-<Date.now()>/` under the root.
- `runSwarm({ agents, build, gate, deadline, ... })` returns `{ result, error, calls, fakes, root, trace }` where `trace` is the parsed `trace.json` wherever `saveTrace` put it.
- `vi.mock` declarations live in the test file, not the harness, because vitest hoists them per file; the harness exports the factories they call.

### Task 3: scenarios

File: `tests/pipeline/swarm.test.js`. One `it` per row. Each asserts the calls made, in order, and the state left under the root.

| Scenario | Drives | Asserts |
|---|---|---|
| Happy path | fixtures as recorded | returns `{ rationale, design_brief, files }` with preset plus six engineer files; `archive` called once; `trace.json` under `build-*`; `elements/preset.ts`, `__root.tsx`, `BrandLockup.tsx`, six engineer files and `signals/today.mockup.html` exist under the root; `verdicts` carry spec-critic, mockup-critic round 0, surface-gate round 1, screenshot-critic |
| Prompt snapshot | happy path | each of `calls` matches its own file in `tests/pipeline/__snapshots__/swarm-calls/` via `toMatchFileSnapshot`, with agent, model, timeouts and both prompts |
| Mockup REVISE twice then APPROVE | critic queue `REVISE`, `REVISE`, `APPROVE` | 3 designer calls; rounds 1 and 2 carry the previous feedback in the user prompt; 3 mockup-critic verdicts with rounds 0 to 2; `noteRetry` twice |
| Mockup critic malformed | critic reply with no verdict block | loop breaks after round 0 with the round-0 mockup |
| Build fails, repair succeeds | `validateBuild` false then true | `restore` at 2166 receives only non-art-director paths; one repair call carrying the build error; `archive` once with rationale suffix `(repair 1)` |
| Repairs exhausted | `validateBuild` false four times | 3 repair calls; `archive/<date>/build-failed-sources-*` holds the engineer files; `restore(originalBackup)`; throw begins `Build failed after 3 repair attempt(s)`; trace under `build-failed-*` with `error.txt` |
| Repair reply incomplete | repair reply missing `about.tsx` | attempt spent without a `validateBuild` call; next repair prompt contains the reminder |
| Deadline before mockup | `setRunDeadline(Date.now())` before the loop | throws `run budget exhausted before the Mockup Designer could start`; no `restore` call |
| Deadline before engineer | deadline set after mockup approval | throws the engineer variant; no `restore` |
| Deadline during repairs | deadline set after first build failure | repair loop breaks at 0 attempts; throw says `after 0 repair attempt(s)` |
| Engineer omits Sidebar, retry fixes it | engineer queue: five files, then six | 2 engineer calls; second prompt contains the required-files reminder; six files on disk |
| Engineer omits Sidebar twice | five files, five files, five files | 3 engineer calls, original kept, build proceeds with five files |
| Engineer omits Layout | reply without `Layout.tsx`, retries too | throws `did not produce Layout.tsx`; `cleanupOrphans` then `restore(originalBackup)` |
| Engineer stalls once | first call throws `stalled`, second returns files | 2 engineer calls; `noteRetry` once |
| Engineer stalls past deadline | throw `stalled` with deadline passed | one call; `restore`; throw `React Engineer failed:` |
| Screenshot critic REVISE, revision builds | critic reply `REVISE` with feedback | one revision call whose prompt carries the feedback; `validateBuild` twice on the success path; `runSurfaceGate` twice; `archive` once |
| Screenshot critic REVISE, revision fails to build | revision `validateBuild` false, re-validate true | `restore(passingBackup)`; ships the passing engineer result; `archive` once |
| Revision rollback fails to build | revision false, re-validate false | throw with `fatal`; `restore(originalBackup)`; no `archive` |
| Surface gate demands revision on SHIP | `runSurfaceGate` returns an engineer-owned error finding; critic says `SHIP` | revision happens; feedback includes the measured fault |
| Art Director fails once | first `callClaudeCLI('art-director')` throws | 2 Art Director calls; second prompt carries `retryContext`; run completes |
| Art Director fails twice | both throw | `restore(originalBackup)`; throw `Art Director failed after retry` |
| Codegen fails then passes | `spawnSync` status 1 then 0 | third Art Director call with the codegen error; `__root.tsx` and `BrandLockup.tsx` regenerated; run completes |
| Codegen fails twice | status 1, 1 | `cleanupOrphans`, `restore(originalBackup)`, throw `Codegen failed after Art Director retry` |
| Spec critic REVISE | spec-critic reply `REVISE` | logged into `verdicts`; nothing else changes; run completes |
| Trace on success | happy path | `trace.json` steps include `art-director`, `spec-critic`, `mockup-critic`, `react-engineer`, `build-validation`, `surface-gate`, `screenshot-critic` in that order |

Delete the source-regex cases in `tests/scripts/design-agents.test.js` that these cover (the five `describe` blocks named in the facts) once the matching scenario is green. Keep `FILE_OWNERSHIP`, `identifyFailingAgent`, `archiveArtifacts` and `parseDelimiterResponse` tests as they are.

### Task 4: gates and PR

`pnpm lint`, `pnpm typecheck`, `GITHUB_ACTIONS=true CI=true pnpm test`, `pnpm test:e2e:site`, `pnpm fallow audit --base origin/main`. The audit will report `runAgentSwarm` as inherited; nothing introduced. PR body states the mechanical change in one paragraph and lists the scenario table. Merge through the five-job gate.

### Task 5: one nightly

Wait for the next `daily-redesign` run on main. A green run with a normal trace is the go for PR 2. A red run stops everything until its cause is known.

## PR 2: the split

Branch `enh/221-swarm-split` from main after Task 5. One commit per module, in this order, each leaving `pnpm test` green and the prompt snapshot unchanged.

1. `scripts/pipeline/run-state.js`: `createRunState({ context, root, onTraceStep })` returning the shared locals from the facts as one object, built in the swarm's prologue. The swarm body reads and writes `state.x` instead of the closure variable. No logic moves yet.
2. `scripts/pipeline/persist.js`: `saveTrace(state, error)`, `archiveFailedSources(state, paths)`, `archiveAndReturn(state, filesResult, suffix)`.
3. `scripts/pipeline/context.js`: prompt loading with its placeholder guards, `originalBackup`, recent briefs, ratings, taste memory, uniqueness, references, mandates. Returns the strings the phases read.
4. `scripts/pipeline/phase-art-director.js`: lines 799 to 1093. The three `runArtDirector` argument objects become one builder with a `retryContext` parameter.
5. `scripts/pipeline/gates.js`: spec critic (1096 to 1197) and `runScreenshotCriticGate` with `measureSurfaces`.
6. `scripts/pipeline/phase-mockup.js`: lines 1208 to 1495.
7. `scripts/pipeline/phase-engineer.js`: lines 1497 to 1655.
8. `scripts/pipeline/repair.js`: lines 2143 to 2274.
9. `runAgentSwarm` is the remaining conductor. Fallow's `runAgentSwarm` finding should now be gone; each new module must pass the audit on its own.

Tests for PR 2 are the PR 1 scenarios, unchanged. Each module also gets a small direct test where a seam is cheap to reach (for example `persist.saveTrace` with `archiveRan` true and false). Closes #221. Then file the four oddities from the spec as issues.
