/**
 * A harness that runs the real `runAgentSwarm` against a temp root.
 *
 * Everything the swarm reads and writes lives under a `tempRepoRoot()` seeded
 * with copies of the real prompts, chassis, preset, assets and two archived
 * days. The model calls, the process spawns and the browser captures are the
 * only fakes; every parser, validator, gate, backup and restore in between is
 * the production code (#221). `restore` and `cleanupOrphans` stay real but are
 * wrapped to record what they were handed, so a rollback can be asserted by
 * the map it received as well as by the disk it left behind.
 *
 * The `vi.mock` declarations cannot live here — vitest hoists them per test
 * file — so a test file pastes this block at its top and the factories below
 * supply the fakes:
 *
 *   import { mockFactories as m } from './swarm-harness.js'
 *   vi.mock('../../scripts/utils/claude-cli.js', (o) => m['scripts/utils/claude-cli.js'](o))
 *   vi.mock('../../scripts/utils/vision-router.js', (o) => m['scripts/utils/vision-router.js'](o))
 *   vi.mock('../../scripts/utils/build-validator.js', (o) => m['scripts/utils/build-validator.js'](o))
 *   vi.mock('../../scripts/utils/snapshot.js', (o) => m['scripts/utils/snapshot.js'](o))
 *   vi.mock('../../scripts/utils/surface-gate.js', (o) => m['scripts/utils/surface-gate.js'](o))
 *   vi.mock('../../scripts/utils/archiver.js', (o) => m['scripts/utils/archiver.js'](o))
 *   vi.mock('../../scripts/seal-archive.js', (o) => m['scripts/seal-archive.js'](o))
 *   vi.mock('../../scripts/utils/file-manager.js', (o) => m['scripts/utils/file-manager.js'](o))
 *   vi.mock('node:child_process', (o) => m['node:child_process'](o))
 *
 * The arrow wrappers matter: `vi.mock` is hoisted above the import, so the
 * factory may only touch `m` when it eventually runs, not when it is declared.
 * Nothing in this module imports a mocked module at top level for the same
 * reason; `design-agents.js` is imported inside `runSwarm`. A test file that
 * needs `site-context.js` (it imports file-manager.js) loads it with a
 * top-level `await import` placed after the block.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'
import { afterEach, vi } from 'vitest'
import { tempRepoRoot, writeUnder } from '../helpers/tmp.js'
import { clearRunDeadline } from '../../scripts/utils/run-budget.js'
import { summarizeLedger } from '../../scripts/utils/cost-ledger.js'
import { modelFor } from '../../scripts/utils/models.js'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const FIXTURES = path.join(REPO, 'tests', 'fixtures')

export const AGENTS = [
  'art-director',
  'spec-critic',
  'mockup-designer',
  'mockup-critic',
  'react-engineer',
  'screenshot-critic',
]

/** The engineer files the swarm refuses to ship without. */
export const REQUIRED_ENGINEER_FILES = [
  'app/components/Layout.tsx',
  'app/components/Sidebar.tsx',
  'app/routes/index.tsx',
  'app/routes/about.tsx',
  'app/routes/work.$slug.tsx',
  'app/routes/og.tsx',
]

/** The recorded response for one agent, `fixtures/agents/<agent>/00.txt`. */
export function fixtureFor(agent) {
  return readFileSync(path.join(REPO, 'fixtures', 'agents', agent, '00.txt'), 'utf8')
}

// ---------------------------------------------------------------------------
// Recorder state, shared between the fakes and the test
// ---------------------------------------------------------------------------

/**
 * One state object for the whole file. `runSwarm` resets it before each run
 * so a scenario never sees the previous one's calls or queues.
 */
const state = {
  root: null,
  /** @type {Array<object>} every model call, in order */
  calls: [],
  /** @type {Map<string, {queue: Array<unknown>, last: unknown}>} */
  agentQueues: new Map(),
  /** per-seam scripts: shift one per call, fall back to the default */
  scripts: {
    codegen: [],
    build: [],
    gate: [],
    mockupCapture: [],
    screenshot: [],
    routeCapture: [],
    phoneFilmstrip: [],
    routes: [],
  },
  /** per-seam call recorders */
  fakes: {
    spawnSync: [],
    validateBuild: [],
    formatGeneratedFile: [],
    captureHtmlFileScreenshot: [],
    captureScreenshot: [],
    captureRouteScreenshot: [],
    captureRoutePhoneFilmstrip: [],
    runSurfaceGate: [],
    listGeneratedRoutes: [],
    archive: [],
    /** `{ seq, paths, map, root }` per real `restore` call */
    restore: [],
    /** `{ seq, written, root }` per real `cleanupOrphans` call */
    cleanupOrphans: [],
  },
}

function resetState(root) {
  state.root = root
  state.calls = []
  state.agentQueues = new Map()
  for (const k of Object.keys(state.scripts)) state.scripts[k] = []
  for (const k of Object.keys(state.fakes)) state.fakes[k] = []
}

/** Take the next scripted value for a seam, or the default when none is left. */
function nextScript(name, fallback) {
  const q = state.scripts[name]
  return q.length ? q.shift() : fallback
}

/**
 * A queue entry is a response, an `Error` to throw, or a function of the
 * recorded call that returns (or throws) either. Functions run every time
 * they are replayed, so a side effect such as `setRunDeadline` fires again.
 */
function realize(entry, call) {
  const value = typeof entry === 'function' ? entry(call) : entry
  if (value instanceof Error) throw value
  return value
}

// ---------------------------------------------------------------------------
// The agent fakes
// ---------------------------------------------------------------------------

/**
 * Per-agent response queues. Each agent's queue defaults to its fixture;
 * `overrides` replaces the whole queue for the agents it names. When a queue
 * runs dry the last entry is replayed, matching `nextFixture`.
 * @param {Partial<Record<string, Array<unknown>>>} [overrides]
 */
export function scriptAgents(overrides = {}) {
  state.agentQueues = new Map()
  for (const agent of AGENTS) {
    const queue = overrides[agent] ? [...overrides[agent]] : [fixtureFor(agent)]
    state.agentQueues.set(agent, { queue, last: null })
  }
  for (const agent of Object.keys(overrides)) {
    if (!state.agentQueues.has(agent)) {
      state.agentQueues.set(agent, { queue: [...overrides[agent]], last: null })
    }
  }
}

function takeResponse(agent, call) {
  const entry = state.agentQueues.get(agent)
  if (!entry) throw new Error(`[swarm-harness] no queue for agent "${agent}"`)
  if (entry.queue.length) entry.last = entry.queue.shift()
  if (entry.last == null) throw new Error(`[swarm-harness] empty queue for agent "${agent}"`)
  return realize(entry.last, call)
}

/** The `callClaudeCLI(agentName, systemPrompt, promptText, options)` fake. */
async function fakeCallClaudeCLI(agentName, systemPrompt, promptText, options = {}) {
  const call = {
    agent: agentName,
    channel: 'cli',
    model: options.model,
    systemPrompt,
    userPrompt: promptText,
    options: { ...options },
  }
  state.calls.push(call)
  return takeResponse(agentName, call)
}

/** Text of the content blocks, images as size markers. */
function renderBlocks(blocks) {
  return blocks
    .map((b) => {
      if (b.type === 'text') return b.text
      if (b.type === 'image') {
        const bytes = Buffer.from(b.source?.data ?? '', 'base64').length
        return `[image ${b.source?.media_type ?? 'unknown'}, ${bytes} bytes]`
      }
      return `[${b.type}]`
    })
    .join('\n\n---\n\n')
}

/** The `callVisionAgent({ agentName, ... })` fake. Always answers as `sdk-vision`. */
async function fakeCallVisionAgent(args) {
  const { agentName, systemPrompt, contentBlocks, maxTokens, timeoutMs, stallTimeoutMs } = args
  const call = {
    agent: agentName,
    channel: 'vision',
    model: modelFor(agentName),
    systemPrompt,
    userPrompt: renderBlocks(contentBlocks),
    imageCount: contentBlocks.filter((b) => b.type === 'image').length,
    options: { maxTokens, timeoutMs, stallTimeoutMs },
  }
  state.calls.push(call)
  const response = takeResponse(agentName, call)
  args.onChannel?.('sdk-vision')
  return response
}

// ---------------------------------------------------------------------------
// The process and browser fakes
// ---------------------------------------------------------------------------

const PNG = (label) => Buffer.from(`png:${label}`)
const JPEG = (label) => Buffer.from(`jpeg:${label}`)

/** A build error naming an engineer-owned file, so identifyFailingAgent routes it. */
export const DEFAULT_BUILD_ERROR =
  "app/components/Layout.tsx(12,7): error TS2322: Type 'string' is not assignable to type 'number'."

function fakeSpawnSync(cmd, args, opts) {
  state.fakes.spawnSync.push({ cmd, args, cwd: opts?.cwd })
  const scripted = nextScript('codegen', { status: 0 })
  const r = typeof scripted === 'function' ? scripted() : scripted
  return { status: 0, stdout: '', stderr: '', ...r }
}

function fakeValidateBuild(opts) {
  state.fakes.validateBuild.push({ ...opts })
  const scripted = nextScript('build', true)
  const r = typeof scripted === 'function' ? scripted(opts) : scripted
  if (r === true) return { success: true }
  if (r === false) return { success: false, error: DEFAULT_BUILD_ERROR }
  return r
}

function fakeFormatGeneratedFile(relPath, opts) {
  state.fakes.formatGeneratedFile.push({ relPath, root: opts?.root })
  return { success: true, output: '' }
}

async function fakeCaptureHtmlFileScreenshot(filePath, opts) {
  state.fakes.captureHtmlFileScreenshot.push({ filePath, ...opts })
  const scripted = nextScript('mockupCapture', null)
  const r = typeof scripted === 'function' ? scripted() : scripted
  if (r instanceof Error) throw r
  return (
    r ?? {
      png: PNG('mockup'),
      jpeg: JPEG('mockup'),
      headerJpeg: JPEG('mockup-header'),
      mobileJpeg: JPEG('mockup-360'),
    }
  )
}

async function fakeCaptureScreenshot(port, opts) {
  state.fakes.captureScreenshot.push({ port, ...opts })
  const scripted = nextScript('screenshot', null)
  const r = typeof scripted === 'function' ? scripted() : scripted
  if (r instanceof Error) throw r
  return (
    r ?? {
      png: PNG('home-light'),
      jpeg: JPEG('home-light'),
      darkPng: PNG('home-dark'),
      darkJpeg: JPEG('home-dark'),
      headerJpeg: JPEG('home-header'),
      mobileJpeg: JPEG('home-360'),
      fingerprint: null,
    }
  )
}

async function fakeCaptureRouteScreenshot(route, opts) {
  state.fakes.captureRouteScreenshot.push({ route, ...opts })
  const scripted = nextScript('routeCapture', null)
  const r = typeof scripted === 'function' ? scripted(route) : scripted
  if (r instanceof Error) throw r
  return r ?? PNG(`route:${route}`)
}

async function fakeCaptureRoutePhoneFilmstrip(route, opts) {
  state.fakes.captureRoutePhoneFilmstrip.push({ route, ...opts })
  const scripted = nextScript('phoneFilmstrip', null)
  const r = typeof scripted === 'function' ? scripted(route) : scripted
  if (r instanceof Error) throw r
  return r ?? JPEG(`filmstrip:${route}`)
}

/** A gate with nothing to report. */
export const CLEAN_GATE = { findings: [], measured: 8, errorCount: 0 }

async function fakeRunSurfaceGate(opts) {
  state.fakes.runSurfaceGate.push({ ...opts })
  const scripted = nextScript('gate', null)
  const r = typeof scripted === 'function' ? scripted() : scripted
  if (r instanceof Error) throw r
  return r ?? CLEAN_GATE
}

export const DEFAULT_ROUTES = [
  { id: 'home', route: '/' },
  { id: 'about', route: '/about' },
  { id: 'work-index', route: '/work' },
  { id: 'experiments', route: '/experiments' },
  { id: 'work-sample', route: '/work/sample' },
]

async function fakeListGeneratedRoutes(root) {
  state.fakes.listGeneratedRoutes.push({ root })
  const scripted = nextScript('routes', null)
  const r = typeof scripted === 'function' ? scripted() : scripted
  if (r instanceof Error) throw r
  return r ?? DEFAULT_ROUTES
}

/**
 * Records the ten positional arguments and creates `archive/<date>/build-<ts>/`
 * under the root, which is where `saveTrace` then looks for a build dir. The
 * string and Buffer artifacts are written into it so a test can read
 * `verdicts.json` the way the archive would hold it.
 */
async function fakeArchive(
  date,
  signals,
  rationale,
  designBrief,
  changedFiles,
  weights,
  colorScheme,
  archetype,
  artifacts = {},
  options = {}
) {
  const root = options.root
  const buildDir = root ? path.join(root, 'archive', String(date), `build-${Date.now()}`) : null
  state.fakes.archive.push({
    date,
    signals,
    rationale,
    designBrief,
    changedFiles,
    weights,
    colorScheme,
    archetype,
    artifacts,
    options,
    buildDir,
  })
  if (!buildDir) return
  await mkdir(buildDir, { recursive: true })
  for (const [name, value] of Object.entries(artifacts)) {
    if (value == null) continue
    await writeFile(path.join(buildDir, name), value)
  }
}

// ---------------------------------------------------------------------------
// The rollback recorders: the real functions run, their arguments are kept
// ---------------------------------------------------------------------------

/** Position across both rollback lists, so a test can say which ran first. */
function rollbackSeq() {
  return state.fakes.restore.length + state.fakes.cleanupOrphans.length
}

function recordingFileManager(real) {
  return {
    ...real,
    restore: async (backupMap, opts) => {
      state.fakes.restore.push({
        seq: rollbackSeq(),
        paths: [...backupMap.keys()],
        map: new Map(backupMap),
        root: opts?.root,
      })
      return real.restore(backupMap, opts)
    },
    cleanupOrphans: async (writtenPaths, backupMap, opts) => {
      state.fakes.cleanupOrphans.push({
        seq: rollbackSeq(),
        written: [...writtenPaths],
        root: opts?.root,
      })
      return real.cleanupOrphans(writtenPaths, backupMap, opts)
    },
  }
}

// ---------------------------------------------------------------------------
// The vi.mock factories, keyed by module path from the repo root
// ---------------------------------------------------------------------------

export const mockFactories = {
  'scripts/utils/claude-cli.js': async (importOriginal) => ({
    ...(await importOriginal()),
    callClaudeCLI: fakeCallClaudeCLI,
  }),
  'scripts/utils/vision-router.js': async (importOriginal) => ({
    ...(await importOriginal()),
    callVisionAgent: fakeCallVisionAgent,
  }),
  'scripts/utils/build-validator.js': async (importOriginal) => ({
    ...(await importOriginal()),
    validateBuild: fakeValidateBuild,
    formatGeneratedFile: fakeFormatGeneratedFile,
  }),
  'scripts/utils/snapshot.js': async (importOriginal) => ({
    ...(await importOriginal()),
    captureHtmlFileScreenshot: fakeCaptureHtmlFileScreenshot,
    captureScreenshot: fakeCaptureScreenshot,
    captureRouteScreenshot: fakeCaptureRouteScreenshot,
    captureRoutePhoneFilmstrip: fakeCaptureRoutePhoneFilmstrip,
    captureSnapshot: async () => {},
  }),
  'scripts/utils/surface-gate.js': async (importOriginal) => ({
    ...(await importOriginal()),
    runSurfaceGate: fakeRunSurfaceGate,
    listGeneratedRoutes: fakeListGeneratedRoutes,
  }),
  'scripts/utils/archiver.js': async (importOriginal) => ({
    ...(await importOriginal()),
    archive: fakeArchive,
  }),
  'scripts/seal-archive.js': async () => ({
    sealArchive: async () => ({ changed: [], scanned: 0, dates: 0 }),
  }),
  'scripts/utils/file-manager.js': async (importOriginal) =>
    recordingFileManager(await importOriginal()),
  'node:child_process': async (importOriginal) => ({
    ...(await importOriginal()),
    spawnSync: fakeSpawnSync,
  }),
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

/**
 * A temp root shaped like the checkout: the real prompts (with `lanes/` and
 * `impeccable/`), chassis, preset, brand assets, a hand-authored signals YAML
 * and two archived days. The directories the swarm writes into exist and are
 * empty; `app/components/Layout.tsx` in particular is NOT pre-created, since
 * the Layout gate is an `existsSync` on disk.
 *
 * Also carries the `.d.ts` files `readPatternProps` reads to render the
 * `{{PATTERN_PROPS}}` block: every `styled-system/patterns/*.d.ts` and
 * `styled-system/jsx/index.d.ts`, copied file-by-file rather than as a
 * recursive directory copy — `styled-system/` also holds the compiled `.mjs`
 * runtime the swarm never reads, and this keeps the seed small (#432). Copied
 * from `REPO`'s own generated `styled-system/`, so it must exist there first
 * (`pnpm panda codegen` — gitignored, not committed).
 * @returns {Promise<{ root: string, signals: object }>}
 */
export async function seedRoot() {
  const root = await tempRepoRoot('dm-swarm-')
  const copy = (rel) =>
    cpSync(path.join(REPO, rel), path.join(root, rel), { recursive: true, force: true })
  mkdirSync(path.join(root, 'scripts'), { recursive: true })
  copy('scripts/prompts')
  copy('elements/chassis')
  copy('elements/preset.ts')
  copy('app/assets')
  for (const d of [
    'app/components/generated',
    'app/routes',
    'app/stubs',
    'public/og',
    'references',
  ]) {
    mkdirSync(path.join(root, d), { recursive: true })
  }

  const patternsDir = path.join(REPO, 'styled-system', 'patterns')
  mkdirSync(path.join(root, 'styled-system', 'patterns'), { recursive: true })
  for (const f of readdirSync(patternsDir)) {
    if (f.endsWith('.d.ts')) copy(path.join('styled-system', 'patterns', f))
  }
  mkdirSync(path.join(root, 'styled-system', 'jsx'), { recursive: true })
  copy(path.join('styled-system', 'jsx', 'index.d.ts'))

  cpSync(path.join(FIXTURES, 'swarm-archive'), path.join(root, 'archive'), { recursive: true })
  const signalsYaml = readFileSync(path.join(FIXTURES, 'signals', 'today.yml'), 'utf8')
  writeUnder(root, 'signals/today.yml', signalsYaml)
  const signals = yaml.load(signalsYaml)
  return { root, signals }
}

/** What `readContext()` would compute from projects.ts, held still. */
export const CONTENT_SUMMARY = [
  '## Projects (from app/content/projects.ts)',
  '',
  '- Sample Project (product, 2026, slug: sample)',
  '- Second Sample (experiment, 2025, slug: second)',
  '',
  'Exports: `projects`, `featuredProject`, `selectedWork`, `experiments`',
  "The `Project` and `Client` types live in `app/content/types.ts` and are re-exported from `projects.ts` — import them with `import type { Project } from '../content/projects'` or `'../content/types'`.",
  '',
  '## Timeline (from app/content/timeline.ts)',
  'Exports: `timeline` (array of career entries), `capabilities` (array of skill strings)',
  'Render both on the About page. There is no standing component for either — compose them wherever the layout wants them.',
].join('\n')

// ---------------------------------------------------------------------------
// Running
// ---------------------------------------------------------------------------

/**
 * Pin every environment variable the swarm reads. PROD models, no API key,
 * no fixture replay, the default budget, and the creative weights unset so
 * `signals`/`inspiration`/`ratings` fall back to 5 and `risk` derives from the
 * run date, exactly as a nightly with the owner panel untouched.
 */
function pinEnv() {
  vi.stubEnv('PIPELINE_TIER', 'prod')
  for (const name of [
    'ANTHROPIC_API_KEY',
    'MOCK_MODE',
    'RECORD_FIXTURES',
    'RUN_BUDGET_MINUTES',
    'PIPELINE_DEBUG',
    'WEIGHT_RISK',
    'WEIGHT_SIGNALS',
    'WEIGHT_INSPIRATION',
    'WEIGHT_RATINGS',
  ]) {
    vi.stubEnv(name, undefined)
  }
}

afterEach(() => {
  clearRunDeadline()
  vi.unstubAllEnvs()
})

/** The trace `saveTrace` wrote, from a `build-*` dir first, then `build-failed-*`. */
export function readTrace(root, date) {
  const dateDir = path.join(root, 'archive', date)
  if (!existsSync(dateDir)) return null
  const dirs = readdirSync(dateDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .reverse()
  const succeeded = dirs.filter((d) => /^build-\d+$/.test(d))
  const failed = dirs.filter((d) => d.startsWith('build-failed-') && /^build-failed-\d+$/.test(d))
  for (const d of [...succeeded, ...failed]) {
    const file = path.join(dateDir, d, 'trace.json')
    if (existsSync(file)) return { dir: d, ...JSON.parse(readFileSync(file, 'utf8')) }
  }
  return null
}

/**
 * Run the real swarm once, against a fresh seeded root.
 *
 * @param {object} [opts]
 * @param {Partial<Record<string, Array<unknown>>>} [opts.agents] per-agent
 *   response queues; an agent not named keeps its fixture. Entries: a string,
 *   an `Error`, or `(call) => string|Error`.
 * @param {Array<boolean|{success: boolean, error?: string}|Function>} [opts.build]
 *   `validateBuild` results in call order; `true` after the list ends.
 * @param {Array<{status: number, stdout?: string, stderr?: string}|Function>} [opts.codegen]
 *   `spawnSync` results for `panda codegen`; status 0 after the list ends.
 * @param {Array<{findings: Array<object>, measured: number, errorCount: number}|Error|Function>} [opts.gate]
 *   `runSurfaceGate` results per round; `CLEAN_GATE` after the list ends.
 * @param {Array<object|Error|Function>} [opts.mockupCapture] `captureHtmlFileScreenshot` results
 * @param {Array<object|Error|Function>} [opts.screenshot] `captureScreenshot` results
 * @param {Array<Buffer|Error|Function>} [opts.routeCapture] `captureRouteScreenshot` results
 * @param {Array<Buffer|null|Error|Function>} [opts.phoneFilmstrip] `captureRoutePhoneFilmstrip` results
 * @param {Array<Array<object>|Error|Function>} [opts.routes] `listGeneratedRoutes` results
 * @param {string} [opts.brief] the optional `context.brief`; the nightly never sets it
 * @param {Function} [opts.onTraceStep]
 * @param {(root: string) => void|Promise<void>} [opts.beforeRun] runs after
 *   seeding and before the swarm, for a scenario that needs to edit the root
 * @returns {Promise<{
 *   result: object|null, error: Error|null, calls: Array<object>,
 *   fakes: typeof state.fakes, root: string, trace: object|null,
 *   verdicts: Array<object>|null, retries: number, date: string,
 *   callsFor: (agent: string) => Array<object>,
 * }>}
 */
export async function runSwarm(opts = {}) {
  // The swarm's module reads .env at import time; import before pinning so a
  // developer's key never outlives the stubs.
  const { runAgentSwarm } = await import('../../scripts/design-agents.js')
  pinEnv()
  clearRunDeadline()

  const { root, signals } = await seedRoot()
  resetState(root)
  scriptAgents(opts.agents)
  for (const seam of Object.keys(state.scripts)) {
    if (opts[seam]) state.scripts[seam] = [...opts[seam]]
  }
  await opts.beforeRun?.(root)

  const context = { signals, contentSummary: CONTENT_SUMMARY }
  if (opts.brief) context.brief = opts.brief

  let result = null
  let error = null
  try {
    result = await runAgentSwarm(context, { root, onTraceStep: opts.onTraceStep })
  } catch (err) {
    error = err
  } finally {
    clearRunDeadline()
  }

  const date = signals.date
  const archiveCall = state.fakes.archive[0]
  const verdictsJson = archiveCall?.artifacts?.['verdicts.json']
  return {
    result,
    error,
    calls: state.calls,
    fakes: state.fakes,
    root,
    date,
    trace: readTrace(root, date),
    verdicts: verdictsJson ? JSON.parse(verdictsJson) : null,
    retries: summarizeLedger().retries,
    callsFor: (agent) => state.calls.filter((c) => c.agent === agent),
  }
}

/**
 * A stable, readable rendering of the model calls for a file snapshot: agent,
 * model, timeouts, then both prompts. The temp root is replaced by `<root>`
 * so the text carries no absolute paths.
 */
export function serializeCalls(calls, root) {
  const scrub = (s) =>
    String(s ?? '')
      .split(root)
      .join('<root>')
  return calls
    .map((c, i) => {
      const o = c.options ?? {}
      return [
        `${'='.repeat(78)}`,
        `call ${i + 1}: ${c.agent} (${c.channel})`,
        `model: ${c.model}`,
        `timeoutMs: ${o.timeoutMs} | stallTimeoutMs: ${o.stallTimeoutMs}${
          o.maxTokens !== undefined ? ` | maxTokens: ${o.maxTokens}` : ''
        }${c.imageCount !== undefined ? ` | images: ${c.imageCount}` : ''}`,
        `${'-'.repeat(30)} system prompt ${'-'.repeat(33)}`,
        scrub(c.systemPrompt),
        `${'-'.repeat(30)} user prompt ${'-'.repeat(35)}`,
        scrub(c.userPrompt),
      ].join('\n')
    })
    .join('\n\n')
}
