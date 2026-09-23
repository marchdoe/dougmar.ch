import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { BrowserContext, Page, Route } from '@playwright/test'
import * as yaml from 'js-yaml'
import { _readSignalsHandler, _saveOverridesHandler } from '../../app/server/signals-impl'

// Fixture data and API stubs for tests/e2e/dev-panel.spec.ts.
//
// Every /api/* call the panel makes is answered here, in the test process, so
// no test can start a real pipeline or write the real signals/today.yml. The
// one server behaviour worth running for real is the override write, so the
// signals live in a YAML file in a temp directory and the stubs read and
// write it with the same signals-impl functions the dev server uses.

/** Every provider a card reads, populated, so every card renders its data. */
export const FULL_SIGNALS = {
  date: '2026-09-01',
  mood_override: null,
  notes: null,
  season: { season: 'Autumn', month_name: 'September', day_of_year: 244 },
  day_of_week: { day: 'Saturday', is_weekend: true, day_index: 6 },
  sun: { sunrise: '06:58', sunset: '20:02', daylight_hours: 13.1 },
  lunar: { phase: 'waxing crescent', illumination: 0.42 },
  holidays: { today: null, upcoming: [{ name: 'Labor Day', date: '2026-09-07', days_away: 6 }] },
  quote: { text: 'Fixture quote about making things.', author: 'Fixture Author' },
  sports: {
    teams: [
      { name: 'Detroit Lions', league: 'NFL', result: 'W', score: '31-17' },
      { name: 'Detroit Tigers', league: 'MLB', result: 'L', score: '2-5' },
      { name: 'Detroit Pistons', league: 'NBA', result: 'off season' },
    ],
  },
  golf: {
    tournament: 'Fixture Championship',
    status: 'Round 3',
    leaders: [
      { name: 'Golfer One', position: '1', score: '-16' },
      { name: 'Golfer Two', position: 'T2', score: '-13' },
      { name: 'Golfer Three', position: 'T2', score: '-13' },
      { name: 'Golfer Four', position: '4', score: '-11' },
    ],
  },
  github: {
    repos: [
      { name: 'fixture/typed-repo', description: '', language: 'TypeScript', stars: 12345 },
      { name: 'fixture/odd-lang', description: '', language: 'Brainfuck', stars: null },
      { name: 'fixture/no-lang', description: '' },
    ],
  },
  hacker_news: {
    stories: [
      { title: 'Fixture story with a big score', score: 938, by: 'a' },
      { title: 'Fixture story with a small score', score: 29, by: 'b' },
    ],
  },
  weather: {
    location: 'Fixtureville, MI',
    conditions: 'Partly cloudy',
    temp_f: 71.6,
    humidity: 55,
    wind_mph: 8,
    wind_dir: 'NW',
    feels_like_f: 70.2,
  },
  air_quality: { aqi_index: 1, uv_index: 4, air_quality_label: 'Good' },
  news: {
    headlines: [
      { title: 'Fixture headline one', source: 'Fixture Times' },
      { title: 'Fixture headline without a source' },
    ],
  },
  market: {
    symbol: 'SPY',
    price: '769.3500',
    change: '-1.7500',
    change_percent: '-0.2269%',
    direction: 'down',
  },
  product_hunt: {
    products: [
      { name: 'Fixture Product', tagline: 'A tagline', votes: 412 },
      { name: 'Second Product', votes: 88 },
    ],
  },
  music: { bands: ['The War on Drugs', 'Wet Leg'] },
  books: { currently_reading: ['Fixture Novel'] },
}

/**
 * The same day with every keyed provider missing and every list empty: the
 * cards' "API unavailable" and "no data" branches.
 */
export const SPARSE_SIGNALS = {
  date: '2026-09-02',
  mood_override: 'dark',
  notes: 'saved note',
  season: { season: 'Autumn', month_name: 'September', day_of_year: 245 },
  day_of_week: { day: 'Wednesday', is_weekend: false },
  sun: { sunrise: '06:59', sunset: '20:00', daylight_hours: 13 },
  lunar: { phase: 'full moon' },
  holidays: { today: null, upcoming: [] },
  sports: { teams: [] },
  golf: {},
  github: { repos: [] },
  hacker_news: { stories: [] },
  music: { bands: [] },
  books: { currently_reading: [] },
}

export const META = {
  collected_at: '2026-09-01T12:00:00.000Z',
  duration_ms: 3176,
  providers_total: 19,
  providers_ok: 18,
  providers_failed: 1,
  sources: {},
}

/** Today in the panel's own terms (UTC ISO date), so one entry is "today". */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

export const BUILD_ID = '1767225600000'

export function archiveEntries() {
  return [
    {
      date: todayIso(),
      buildId: BUILD_ID,
      brief: 'Today fixture brief',
      rationale: 'Fixture rationale for the newest build.',
      filesChanged: ['app/routes/index.tsx', 'elements/preset.ts'],
      timestamp: Date.parse(`${todayIso()}T14:30:00`),
      weights: { signals: 7, inspiration: 3, ratings: 5, risk: 6 },
    },
    {
      date: '2026-01-02',
      buildId: '1767312000000',
      brief: 'Second fixture brief',
      rationale: null,
      filesChanged: [],
    },
    {
      date: '2026-01-01',
      buildId: null,
      brief: 'Legacy fixture brief',
      rationale: null,
      filesChanged: [],
    },
  ]
}

/** One `data:` frame of the pipeline SSE stream. */
function frame(event: unknown): string {
  return `data: ${JSON.stringify(event)}\n\n`
}

export const log = (line: string) => frame({ type: 'log', line })
export const trace = (step: Record<string, unknown>) => frame({ type: 'trace', step })
export const done = (success: boolean, error?: string) => frame({ type: 'done', success, error })

/** The first half of a run: through to the Claude phase, then the stream ends. */
export const RUN_FIRST_HALF = [
  log('Stage 1: Collect signals'),
  log('Stage 2: Interpret signals'),
  trace({
    name: 'interpret-signals',
    phase: 1,
    input: { signalCount: 19 },
    output: { mood: 'bright' },
    durationMs: 1500,
  }),
  log('--- Attempt 2 of 3 ---'),
  log('[1/4] Reading site context'),
  trace({ name: 'design-tokens', phase: 2, input: { hue: 210 }, durationMs: 250 }),
  log('calling claude CLI'),
].join('')

/** The rest of a successful run. */
export const RUN_SECOND_HALF = [
  log('writing files'),
  log('=== Build passed! ==='),
  log('design_brief: Fixture brief from the stream'),
  done(true),
].join('')

/** A complete successful run in one response. */
export const RUN_COMPLETE = RUN_FIRST_HALF + RUN_SECOND_HALF

export interface StubState {
  signalsPath: string
  dir: string
  /** Bodies of every POST /api/pipeline/start, parsed. */
  starts: unknown[]
  collectCalls: number
  overridePosts: unknown[]
}

export interface StubOptions {
  signals?: Record<string, unknown> | null
  archive?: unknown[]
  devDataStatus?: number
  /** Response to POST /api/pipeline/start: 'ok', a refusal, or a network failure. */
  start?: 'ok' | { status: number; error: string } | 'abort'
  /**
   * Bodies for successive GET /api/pipeline requests. A function is awaited, so
   * a test can hold a request open until it has looked at the running state.
   * Past the end of the list the last entry repeats.
   */
  streams?: Array<string | { status: number } | (() => Promise<string>)>
  /** Runs when /api/collect-signals is called, before it answers. */
  onCollect?: (state: StubState) => void
}

function json(route: Route, status: number, body: unknown) {
  return route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
}

/**
 * Stub the panel's API on `page` and the archive preview on `context` (the
 * preview opens in a new tab, which page-level routes do not reach).
 */
export async function stubDevApi(
  page: Page,
  context: BrowserContext,
  options: StubOptions = {}
): Promise<StubState> {
  const dir = mkdtempSync(join(tmpdir(), 'dev-panel-e2e-'))
  const signalsPath = join(dir, 'today.yml')
  const signals = options.signals === undefined ? FULL_SIGNALS : options.signals
  if (signals) writeFileSync(signalsPath, yaml.dump(signals), 'utf8')

  const state: StubState = { signalsPath, dir, starts: [], collectCalls: 0, overridePosts: [] }
  const archive = options.archive ?? archiveEntries()
  const streams = options.streams ?? [RUN_COMPLETE]
  let streamCalls = 0

  await page.route('**/api/dev-data', (route) => {
    if (options.devDataStatus && options.devDataStatus !== 200) {
      return route.fulfill({ status: options.devDataStatus, body: 'fixture dev-data failure' })
    }
    const current = signals ? _readSignalsHandler(signalsPath) : null
    return json(route, 200, { signals: current, archive, meta: signals ? META : null })
  })

  await page.route('**/api/collect-signals', (route) => {
    state.collectCalls += 1
    options.onCollect?.(state)
    return json(route, 200, { ok: true })
  })

  await page.route('**/api/dev-overrides', (route) => {
    const body = route.request().postDataJSON() as {
      moodOverride: string | null
      notes: string | null
    }
    state.overridePosts.push(body)
    _saveOverridesHandler(body, signalsPath)
    return json(route, 200, { ok: true })
  })

  await page.route('**/api/pipeline/start', (route) => {
    state.starts.push(route.request().postDataJSON())
    const start = options.start ?? 'ok'
    if (start === 'abort') return route.abort('failed')
    if (start === 'ok') return json(route, 200, { ok: true })
    return json(route, start.status, { error: start.error })
  })

  await page.route('**/api/pipeline', async (route) => {
    const next = streams[Math.min(streamCalls, streams.length - 1)]
    streamCalls += 1
    if (typeof next === 'object') return route.fulfill({ status: next.status, body: '' })
    const body = typeof next === 'function' ? await next() : next
    return route.fulfill({
      status: 200,
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' },
      body,
    })
  })

  await context.route('**/api/archive-preview/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: `<!doctype html><title>preview</title><h1>Fixture preview of ${new URL(route.request().url()).pathname}</h1>`,
    })
  )

  return state
}

export function cleanup(state: StubState) {
  rmSync(state.dir, { recursive: true, force: true })
}

export function writeSignals(state: StubState, signals: Record<string, unknown>) {
  writeFileSync(state.signalsPath, yaml.dump(signals), 'utf8')
}

/** A promise plus the function that settles it. */
export function deferred<T>() {
  let resolve: (value: T) => void = () => {}
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}
