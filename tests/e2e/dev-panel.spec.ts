import { readFileSync } from 'node:fs'
import { test, expect, type BrowserContext, type Page } from '@playwright/test'
import * as yaml from 'js-yaml'
import {
  BUILD_ID,
  FULL_SIGNALS,
  RUN_COMPLETE,
  RUN_EVENTS_FIRST_HALF,
  RUN_EVENTS_SECOND_HALF,
  RUN_FIRST_HALF,
  RUN_SECOND_HALF,
  SPARSE_SIGNALS,
  type StubOptions,
  type StubState,
  archiveEntries,
  cleanup,
  deferred,
  done,
  log,
  stubDevApi,
  todayIso,
  writeSignals,
} from './dev-panel-fixtures'

// Runs against the Vite dev server playwright.config.ts starts for the
// dev-panel project. Usage: pnpm test:e2e:dev
//
// No fixed sleeps: every assertion below is a locator wait with its own
// timeout, so a slow server makes the test wait, not fail — and a fast one
// makes it fast. The old `waitForTimeout(1000)` on every test did neither.

test.describe('/dev panel', () => {
  test('loads without console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(String(err)))

    await page.goto('/dev')
    // The panel is client-rendered; wait for something it draws rather than
    // for the network to go quiet, which says nothing about React.
    await expect(page.getByText('SIGNALS').first()).toBeVisible({ timeout: 10000 })
    expect(errors).toEqual([])
  })

  test('shows signals data', async ({ page }) => {
    await page.goto('/dev')
    await expect(page.getByText('SIGNALS').first()).toBeVisible({ timeout: 10000 })
  })

  test('shows the archive section', async ({ page }) => {
    await page.goto('/dev')
    await expect(page.getByText('Archive').first()).toBeVisible({ timeout: 10000 })
  })

  test('offers to run the pipeline', async ({ page }) => {
    await page.goto('/dev')
    await expect(page.getByText('Run Pipeline').first()).toBeVisible({ timeout: 10000 })
  })
})

// ─── Against stubbed data ────────────────────────────────────────────────────
//
// Everything below answers the panel's /api/* calls from
// dev-panel-fixtures.ts: fixed signals (in a temp YAML file, never
// signals/today.yml), a fixed archive, and a scripted pipeline stream. No
// test here can start a real run.

const sidebar = (page: Page) => page.getByRole('navigation')
const content = (page: Page) => page.locator('nav + div')

async function openPanel(page: Page) {
  await page.goto('/dev')
  await expect(page.getByTestId('signals-heading')).toBeVisible({ timeout: 15000 })
}

async function openPane(
  page: Page,
  name: 'Run Pipeline' | 'Signals' | 'Archive' | 'Prompt Inspector'
) {
  // The run button reads "Running..." while a run is going.
  const label = name === 'Run Pipeline' ? /Run Pipeline|Running\.\.\./ : name
  await sidebar(page).getByRole('button', { name: label }).first().click()
}

/** The row of weight buttons whose label carries this tooltip. */
function weightRow(page: Page, title: string) {
  return page.locator(`span[title="${title}"]`).locator('..')
}

const SIGNALS_TIP = 'How much weather, sports, holidays drive the design'
const RISK_TIP = 'How experimental vs safe the design should be'

let stub: StubState | null = null
test.afterEach(() => {
  if (stub) cleanup(stub)
  stub = null
})

/** Stub the API for this test; the temp signals file is removed after it. */
async function stubbed(page: Page, context: BrowserContext, options?: StubOptions) {
  stub = await stubDevApi(page, context, options)
  return stub
}

test.describe('/dev panel — shell and tabs', () => {
  test('header, sidebar and every pane render with no console errors', async ({
    page,
    context,
  }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    page.on('pageerror', (err) => errors.push(String(err)))
    await stubbed(page, context)
    await openPanel(page)

    const header = page.getByRole('banner')
    await expect(header.getByText('dougmar.ch')).toBeVisible()
    await expect(header.getByText('Daily Redesign · Dev Panel')).toBeVisible()
    await expect(header.getByText('18 / 19')).toBeVisible()
    const openSite = header.getByRole('link', { name: /Open Site/ })
    await expect(openSite).toHaveAttribute('href', new URL(page.url()).origin)
    await expect(openSite).toHaveAttribute('target', '_blank')

    const nav = sidebar(page)
    await expect(nav.getByRole('button', { name: 'Run Pipeline' })).toBeVisible()
    await expect(nav.getByTitle('Refresh signals')).toHaveText(/18/)
    // The archive badge counts entries; the inspector has no badge before a run.
    await expect(nav.getByRole('button', { name: /Archive/ })).toHaveText(/Archive\s*3/)
    await expect(nav.getByRole('button', { name: 'Prompt Inspector', exact: true })).toBeVisible()

    await openPane(page, 'Archive')
    await expect(page.getByRole('heading', { name: /ARCHIVE/ })).toBeVisible()
    await openPane(page, 'Prompt Inspector')
    await expect(page.getByRole('heading', { name: '// PROMPT INSPECTOR' })).toBeVisible()
    await openPane(page, 'Run Pipeline')
    await expect(page.getByRole('heading', { name: '// RUN PIPELINE' })).toBeVisible()
    await openPane(page, 'Signals')
    await expect(page.getByTestId('signals-heading')).toBeVisible()

    expect(errors).toEqual([])
  })

  test('only the chosen pane is shown, and it survives a reload', async ({ page, context }) => {
    await stubbed(page, context)
    await openPanel(page)

    await openPane(page, 'Archive')
    await expect(page.getByRole('heading', { name: /ARCHIVE/ })).toBeVisible()
    await expect(page.getByTestId('signals-heading')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: '// RUN PIPELINE' })).toHaveCount(0)

    await page.reload()
    await expect(page.getByRole('heading', { name: /ARCHIVE/ })).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('signals-heading')).toHaveCount(0)
  })

  test('an unreadable dev-data response is shown, not swallowed', async ({ page, context }) => {
    await stubbed(page, context, { devDataStatus: 500 })
    await page.goto('/dev')
    await expect(page.getByText(/500 .*fixture dev-data failure/)).toBeVisible({ timeout: 15000 })
    await expect(page.getByText('No signals collected yet.')).toBeVisible()
    await expect(page.getByText('node scripts/collect-signals.js')).toBeVisible()
  })

  test('no signals file yet explains how to collect one', async ({ page, context }) => {
    await stubbed(page, context, { signals: null })
    await page.goto('/dev')
    await expect(page.getByText('No signals collected yet.')).toBeVisible({ timeout: 15000 })
    await expect(page.getByTestId('signals-heading')).toHaveCount(0)
  })
})

test.describe('/dev panel — signals pane', () => {
  test('every zone and card renders the fixture data', async ({ page, context }) => {
    await stubbed(page, context)
    await openPanel(page)
    const pane = content(page)

    // Zone 1: header
    await expect(page.getByTestId('signals-date')).toHaveText('2026-09-01')
    await expect(pane.getByText('3176ms')).toBeVisible()
    await expect(pane.getByText('18 / 19')).toBeVisible()

    // Zone 2: atmosphere strip
    await expect(pane.getByText('SEASON', { exact: true })).toBeVisible()
    await expect(pane.getByText('Autumn')).toBeVisible()
    await expect(pane.getByText('September · Day 244')).toBeVisible()
    await expect(pane.getByText('Saturday')).toBeVisible()
    await expect(pane.getByText('Weekend', { exact: true })).toBeVisible()
    await expect(pane.getByText('13.1h')).toBeVisible()
    await expect(pane.getByText('06:58 ↑ 20:02 ↓')).toBeVisible()
    await expect(pane.getByText('waxing crescent')).toBeVisible()
    await expect(pane.getByText('42% illuminated')).toBeVisible()
    await expect(pane.getByText('Labor Day')).toBeVisible()
    await expect(pane.getByText('in 6 days')).toBeVisible()

    // Zone 3: quote
    await expect(pane.getByText('DAILY QUOTE')).toBeVisible()
    await expect(pane.getByText('“Fixture quote about making things.”')).toBeVisible()
    await expect(pane.getByText('-- Fixture Author')).toBeVisible()

    // Zone 4: live data cards
    const sports = pane.getByRole('heading', { name: /\/\/ SPORTS/ })
    await expect(sports).toContainText('3 teams')
    await expect(pane.getByText('Detroit Lions')).toBeVisible()
    await expect(pane.getByText('31-17')).toBeVisible()
    await expect(pane.getByText('W', { exact: true })).toBeVisible()
    await expect(pane.getByText('L', { exact: true })).toBeVisible()
    await expect(pane.getByText('off season')).toBeVisible()

    await expect(pane.getByRole('heading', { name: '// GOLF' })).toBeVisible()
    await expect(pane.getByText('Fixture Championship')).toBeVisible()
    await expect(pane.getByText('Round 3')).toBeVisible()
    await expect(pane.getByText('Golfer One')).toBeVisible()
    await expect(pane.getByText('-16')).toBeVisible()

    await expect(pane.getByRole('heading', { name: '// GITHUB TRENDING' })).toBeVisible()
    await expect(pane.getByText('fixture/typed-repo')).toBeVisible()
    await expect(pane.getByText('12,345')).toBeVisible()
    await expect(pane.getByText('fixture/no-lang')).toBeVisible()

    await expect(pane.getByRole('heading', { name: /HACKER NEWS/ })).toBeVisible()
    await expect(pane.getByText('Fixture story with a big score')).toBeVisible()
    await expect(pane.getByText('938')).toBeVisible()

    await expect(pane.getByRole('heading', { name: '// WEATHER' })).toBeVisible()
    await expect(pane.getByText('72°F')).toBeVisible()
    await expect(pane.getByText('Partly cloudy')).toBeVisible()
    await expect(pane.getByText(/Feels like 70°F · 55%\s+humidity/)).toBeVisible()
    await expect(pane.getByText('Wind 8 mph NW')).toBeVisible()
    await expect(pane.getByText('Fixtureville, MI')).toBeVisible()
    await expect(pane.getByText('Good')).toBeVisible()
    await expect(pane.getByText('UV')).toBeVisible()

    await expect(pane.getByRole('heading', { name: '// NEWS' })).toBeVisible()
    await expect(pane.getByText('Fixture headline one')).toBeVisible()
    await expect(pane.getByText('Fixture Times')).toBeVisible()

    await expect(pane.getByRole('heading', { name: '// MARKET' })).toBeVisible()
    await expect(pane.getByText('SPY')).toBeVisible()
    await expect(pane.getByText('$769.35')).toBeVisible()
    await expect(pane.getByText('▼')).toBeVisible()
    await expect(pane.getByText('-1.7500 (-0.2269%)')).toBeVisible()

    await expect(pane.getByRole('heading', { name: '// PRODUCT HUNT' })).toBeVisible()
    await expect(pane.getByText('Fixture Product')).toBeVisible()
    await expect(pane.getByText('412')).toBeVisible()

    // Zone 5: bottom row
    await expect(pane.getByRole('heading', { name: '// MUSIC' })).toBeVisible()
    await expect(pane.getByText('The War on Drugs')).toBeVisible()
    await expect(pane.getByRole('heading', { name: '// BOOKS' })).toBeVisible()
    await expect(pane.getByText('Fixture Novel')).toBeVisible()
    await expect(pane.getByText('+ add signals')).toBeVisible()

    // No card fell back to its error state.
    await expect(pane.getByText('API unavailable')).toHaveCount(0)

    // Last run line, from the newest archive entry.
    await expect(pane.getByText(/Last run:/)).toContainText(todayIso())
    await expect(pane.getByText('Today fixture brief...')).toBeVisible()
  })

  test('missing providers show their error cards and empty states', async ({ page, context }) => {
    await stubbed(page, context, { signals: SPARSE_SIGNALS, archive: [] })
    await openPanel(page)
    const pane = content(page)

    await expect(pane.getByText('API unavailable')).toHaveCount(4)
    await expect(pane.getByText('WEATHER_API_KEY not set')).toBeVisible()
    await expect(pane.getByText('NEWS_API_KEY not set')).toBeVisible()
    await expect(pane.getByText('ALPHA_VANTAGE_API_KEY not set')).toBeVisible()
    await expect(
      pane.getByText('PRODUCT_HUNT_CLIENT_ID and PRODUCT_HUNT_CLIENT_SECRET not set')
    ).toBeVisible()

    await expect(pane.getByText('Weekday')).toBeVisible()
    await expect(pane.getByText('None nearby')).toBeVisible()
    await expect(pane.getByText('--', { exact: true })).toBeVisible()
    await expect(pane.getByText('No teams')).toBeVisible()
    await expect(pane.getByText('No tournament')).toBeVisible()
    await expect(pane.getByText('No data', { exact: true })).toBeVisible()
    await expect(pane.getByText('No stories')).toBeVisible()
    await expect(pane.getByText('No bands')).toBeVisible()
    await expect(pane.getByText('nothing currently')).toBeVisible()
    await expect(pane.getByText('DAILY QUOTE')).toHaveCount(0)
    await expect(pane.getByText(/Last run:/)).toHaveCount(0)

    // Saved overrides come back into the controls.
    await expect(page.getByTestId('mood-override-input')).toHaveValue('dark')
    await expect(page.getByLabel('Notes for Claude')).toHaveValue('saved note')
  })

  test('a holiday today is named as today', async ({ page, context }) => {
    await stubbed(page, context, {
      signals: { ...FULL_SIGNALS, holidays: { today: 'Fixture Day', upcoming: [] } },
    })
    await openPanel(page)
    await expect(content(page).getByText('Fixture Day')).toBeVisible()
    await expect(content(page).getByText('Today!')).toBeVisible()
  })

  test('saving overrides writes them to the signals file', async ({ page, context }) => {
    const s = await stubbed(page, context)
    await openPanel(page)

    await page.getByTestId('mood-override-input').selectOption('tense')
    await page.getByLabel('Notes for Claude').fill('I just got a hole in one')
    const save = page.getByTestId('save-overrides-btn')
    await expect(save).toHaveText('Save overrides')
    await save.click()

    await expect.poll(() => s.overridePosts.length).toBe(1)
    expect(s.overridePosts[0]).toEqual({
      moodOverride: 'tense',
      notes: 'I just got a hole in one',
    })
    await expect(save).toHaveText('Save overrides')
    await expect(save).toBeEnabled()

    const written = yaml.load(readFileSync(s.signalsPath, 'utf8')) as Record<string, unknown>
    expect(written.mood_override).toBe('tense')
    expect(written.notes).toBe('I just got a hole in one')
    // The rest of the day's signals are untouched by the write.
    expect(written.quote).toEqual(FULL_SIGNALS.quote)

    // A reload reads the saved values back from the file.
    await page.reload()
    await expect(page.getByTestId('mood-override-input')).toHaveValue('tense', { timeout: 15000 })
    await expect(page.getByLabel('Notes for Claude')).toHaveValue('I just got a hole in one')

    // Clearing both sends nulls, and the file records them as unset.
    await page.getByTestId('mood-override-input').selectOption('')
    await page.getByLabel('Notes for Claude').fill('')
    await save.click()
    await expect.poll(() => s.overridePosts.length).toBe(2)
    expect(s.overridePosts[1]).toEqual({ moodOverride: null, notes: null })
  })

  test('refresh re-collects and re-reads the signals', async ({ page, context }) => {
    const s = await stubbed(page, context, {
      onCollect: (state) =>
        writeSignals(state, {
          ...FULL_SIGNALS,
          quote: { text: 'A freshly collected quote.', author: 'Collector' },
        }),
    })
    await openPanel(page)
    await expect(content(page).getByText('“Fixture quote about making things.”')).toBeVisible()

    // The refresh widget sits inside the Signals row and must not also switch panes.
    await openPane(page, 'Archive')
    await sidebar(page).getByTitle('Refresh signals').click()
    await expect.poll(() => s.collectCalls).toBe(1)
    await expect(page.getByRole('heading', { name: /ARCHIVE/ })).toBeVisible()

    await openPane(page, 'Signals')
    await expect(content(page).getByText('“A freshly collected quote.”')).toBeVisible()
    await expect(content(page).getByText('-- Collector')).toBeVisible()
  })
})

test.describe('/dev panel — archive pane', () => {
  test('lists every build with its brief, weights and details', async ({ page, context }) => {
    await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Archive')
    const pane = content(page)

    await expect(page.getByRole('heading', { name: /ARCHIVE/ })).toContainText('(3)')
    await expect(pane.getByText('TODAY', { exact: true })).toBeVisible()
    await expect(pane.getByText('02:30 PM')).toBeVisible()
    await expect(pane.getByText('Today fixture brief')).toBeVisible()
    await expect(pane.getByText('Second fixture brief')).toBeVisible()
    await expect(pane.getByText('Legacy fixture brief')).toBeVisible()
    await expect(pane.getByText('Signals 7')).toBeVisible()
    await expect(pane.getByText('Inspiration 3')).toBeVisible()
    await expect(pane.getByText('Risk 6')).toBeVisible()

    // Only the entry with a rationale offers the brief, collapsed at first.
    const toggle = pane.getByRole('button', { name: '▸ View Brief' })
    await expect(toggle).toHaveCount(1)
    await expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await expect(pane.getByText('Fixture rationale for the newest build.')).toHaveCount(0)

    await toggle.click()
    const hide = pane.getByRole('button', { name: '▾ Hide Brief' })
    await expect(hide).toHaveAttribute('aria-expanded', 'true')
    await expect(pane.getByText('Fixture rationale for the newest build.')).toBeVisible()
    await expect(pane.getByText('app/routes/index.tsx')).toBeVisible()
    await expect(pane.getByText('elements/preset.ts')).toBeVisible()

    await hide.click()
    await expect(pane.getByText('Fixture rationale for the newest build.')).toHaveCount(0)
  })

  test('preview opens the build, or the legacy date, in a new tab', async ({ page, context }) => {
    await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Archive')
    const previews = content(page).getByRole('button', { name: 'Preview ↗' })
    await expect(previews).toHaveCount(3)

    const [perBuild] = await Promise.all([page.waitForEvent('popup'), previews.nth(0).click()])
    await expect(perBuild.getByRole('heading')).toHaveText(
      `Fixture preview of /api/archive-preview/${todayIso()}/build-${BUILD_ID}/index.html`
    )
    await perBuild.close()

    const [legacy] = await Promise.all([page.waitForEvent('popup'), previews.nth(2).click()])
    await expect(legacy.getByRole('heading')).toHaveText(
      'Fixture preview of /api/archive-preview/2026-01-01/index.html'
    )
    await legacy.close()
  })

  test('an empty archive says so', async ({ page, context }) => {
    await stubbed(page, context, { archive: [] })
    await openPanel(page)
    await openPane(page, 'Archive')
    await expect(page.getByRole('heading', { name: /ARCHIVE/ })).toContainText('(0)')
    await expect(content(page).getByText('No archive entries yet.')).toBeVisible()
  })
})

test.describe('/dev panel — prompt inspector', () => {
  test('offers live and one button per archived date', async ({ page, context }) => {
    await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Prompt Inspector')
    const pane = content(page)

    await expect(pane.getByText('Run the pipeline to see trace data here.')).toBeVisible()
    await expect(pane.getByRole('button', { name: 'Live' })).toBeVisible()
    for (const entry of archiveEntries()) {
      await expect(pane.getByRole('button', { name: entry.date })).toBeVisible()
    }

    // A date with no trace on disk says so, and Live goes back.
    await pane.getByRole('button', { name: '2026-01-02' }).click()
    await expect(pane.getByText('No trace data available for this build.')).toBeVisible({
      timeout: 15000,
    })
    await pane.getByRole('button', { name: 'Live' }).click()
    await expect(pane.getByText('Run the pipeline to see trace data here.')).toBeVisible()
  })
})

test.describe('/dev panel — run pane', () => {
  test('idle state shows the weights, the controls and the empty tracker', async ({
    page,
    context,
  }) => {
    await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    const pane = content(page)

    await expect(pane.getByText('Creative Weights')).toBeVisible()
    for (const label of ['Signals', 'Inspiration', 'Ratings', 'Risk']) {
      await expect(pane.getByText(label, { exact: true })).toBeVisible()
    }
    await expect(weightRow(page, SIGNALS_TIP).getByRole('button')).toHaveCount(11)
    await expect(weightRow(page, RISK_TIP).getByRole('button')).toHaveCount(12)
    await expect(pane.getByTitle('Auto — derive risk 3-10 from the build date')).toBeVisible()

    await expect(page.getByTestId('run-pipeline-btn')).toHaveText('RUN PIPELINE')
    await expect(page.getByTestId('run-pipeline-btn')).toBeEnabled()
    await expect(pane.getByRole('checkbox', { name: 'Dry run (no commit)' })).not.toBeChecked()

    await expect(pane.getByText('// PIPELINE · Idle')).toBeVisible()
    await expect(pane.getByText('Waiting for pipeline start...')).toBeVisible()
    for (const phase of [
      'Collect signals',
      'Interpret signals',
      'Read context',
      'Claude designing',
      'Write & build',
      'Archive & done',
    ]) {
      await expect(pane.getByText(phase, { exact: true })).toBeVisible()
    }
  })

  test('a run posts the chosen weights and dry-run flag, always in mock mode', async ({
    page,
    context,
  }) => {
    const s = await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Run Pipeline')

    await weightRow(page, SIGNALS_TIP).getByRole('button', { name: '8', exact: true }).click()
    await weightRow(page, RISK_TIP).getByRole('button', { name: '7', exact: true }).click()
    await content(page).getByRole('checkbox', { name: 'Dry run (no commit)' }).check()
    await page.getByTestId('run-pipeline-btn').click()

    await expect.poll(() => s.starts.length).toBe(1)
    expect(s.starts[0]).toEqual({
      dryRun: true,
      mock: true,
      weights: { signals: 8, inspiration: 5, ratings: 5, risk: 7 },
    })
  })

  test('risk defaults to auto, and auto can be chosen again', async ({ page, context }) => {
    const s = await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Run Pipeline')

    await weightRow(page, RISK_TIP).getByRole('button', { name: '3', exact: true }).click()
    await weightRow(page, RISK_TIP).getByRole('button', { name: 'A', exact: true }).click()
    await page.getByTestId('run-pipeline-btn').click()

    await expect.poll(() => s.starts.length).toBe(1)
    expect(s.starts[0]).toEqual({
      dryRun: false,
      mock: true,
      weights: { signals: 5, inspiration: 5, ratings: 5, risk: null },
    })
  })

  test('a run streams phases and log lines, then reports success', async ({ page, context }) => {
    const release = deferred<void>()
    await stubbed(page, context, {
      // The first stream ends mid-run; the panel reconnects, and that second
      // request is held open until the running state has been checked.
      streams: [RUN_FIRST_HALF, () => release.promise.then(() => RUN_SECOND_HALF)],
    })
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()
    const pane = content(page)

    // Running
    await expect(page.getByTestId('run-pipeline-btn')).toHaveText(/RUNNING\.\.\. \d+:\d\d/)
    await expect(page.getByTestId('run-pipeline-btn')).toBeDisabled()
    await expect(
      content(page).getByRole('checkbox', { name: 'Dry run (no commit)' })
    ).toBeDisabled()
    await expect(weightRow(page, SIGNALS_TIP).getByRole('button', { name: '3' })).toBeDisabled()
    await expect(sidebar(page).getByRole('button', { name: 'Running...' })).toBeVisible()
    await expect(page.getByRole('banner').getByText('Running')).toBeVisible()
    await expect(pane.getByText('// PIPELINE · Attempt 2 of 3')).toBeVisible()
    await expect(pane.getByText('● running')).toBeVisible()
    await expect(pane.getByText('calling claude CLI')).toBeVisible()
    await expect(pane.getByText('Stage 1: Collect signals')).toBeVisible()
    // The attempt line resets the tracker: the first two phases are done and
    // "Read context" was reached; the Claude phase is the active one.
    await expect(pane.getByText('Claude designing', { exact: true })).toBeVisible()
    await expect(pane.getByText('// PIPELINE · Idle')).toHaveCount(0)

    // The live trace reaches the inspector while the run is going.
    await expect(sidebar(page).getByRole('button', { name: /Prompt Inspector/ })).toHaveText(
      /Prompt Inspector\s*2/
    )
    await openPane(page, 'Prompt Inspector')
    await expect(pane.getByText('streaming 2 steps')).toBeVisible()
    await expect(pane.getByText('interpret-signals')).toBeVisible()
    await expect(pane.getByText('DIRECTION', { exact: true })).toBeVisible()
    await expect(pane.getByText('1.5s')).toBeVisible()
    await expect(pane.getByText('design-tokens')).toBeVisible()
    await expect(pane.getByText('TOKENS', { exact: true })).toBeVisible()
    await pane.getByRole('button', { name: /interpret-signals/ }).click()
    await expect(pane.getByRole('button', { name: /interpret-signals/ })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
    await expect(pane.getByText('INPUT', { exact: true })).toBeVisible()
    await expect(pane.getByText('"signalCount": 19')).toBeVisible()
    await expect(pane.getByText('OUTPUT', { exact: true })).toBeVisible()
    await expect(pane.getByText('"mood": "bright"')).toBeVisible()
    await pane.getByRole('button', { name: /interpret-signals/ }).click()
    await expect(pane.getByText('"signalCount": 19')).toHaveCount(0)

    // Finish the run.
    await openPane(page, 'Run Pipeline')
    release.resolve()

    const status = pane.getByRole('status')
    await expect(status).toContainText('Build passed -- committed', { timeout: 15000 })
    await expect(status).toContainText('“Fixture brief from the stream”')
    await expect(pane.getByText(/Total: .* · 2 attempts/)).toBeVisible()
    await expect(pane.getByRole('button', { name: 'OPEN SITE' })).toBeVisible()
    await expect(pane.getByText('Step Timings')).toBeVisible()
    for (const word of ['Collect', 'Interpret', 'Read', 'Claude', 'Write', 'Archive']) {
      await expect(pane.getByText(word, { exact: true })).toBeVisible()
    }
    await expect(pane.getByText('Recent designs')).toBeVisible()
    await expect(pane.getByText(`${todayIso()} *`)).toBeVisible()
    await expect(pane.getByText('Second fixture brief')).toBeVisible()
    await expect(pane.getByRole('button', { name: 'RUN AGAIN' })).toBeEnabled()

    await expect(page.getByTestId('run-pipeline-btn')).toHaveText('RUN PIPELINE')
    await expect(page.getByTestId('run-pipeline-btn')).toBeEnabled()
    await expect(sidebar(page).getByRole('button', { name: 'Run Pipeline' })).toBeVisible()
    // A finished run leaves nothing for the next load to reconnect to.
    expect(await page.evaluate(() => sessionStorage.getItem('pipeline-start-time'))).toBeNull()
  })

  test('a run streamed as phase events drives the tracker from events, not prose (#227)', async ({
    page,
    context,
  }) => {
    const release = deferred<void>()
    await stubbed(page, context, {
      streams: [RUN_EVENTS_FIRST_HALF, () => release.promise.then(() => RUN_EVENTS_SECOND_HALF)],
    })
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()
    const pane = content(page)

    await expect(page.getByTestId('run-pipeline-btn')).toHaveText(/RUNNING\.\.\. \d+:\d\d/)
    await expect(pane.getByText('calling claude CLI')).toBeVisible()
    // The events tracker's own phase list, not the legacy six-phase one:
    // collect-signals/collect-references/context/art-director are all done,
    // mockup is the active phase.
    await expect(pane.getByText('Mockup design', { exact: true })).toBeVisible()
    await expect(pane.getByText('Engineering', { exact: true })).toBeVisible()
    // The legacy prose tracker's labels never appear once events are driving —
    // proof the log lines above (which do contain "calling claude CLI") were
    // not what advanced the tracker.
    await expect(pane.getByText('Interpret signals')).toHaveCount(0)
    await expect(pane.getByText('Claude designing')).toHaveCount(0)

    release.resolve()

    const status = pane.getByRole('status')
    await expect(status).toContainText('Build passed -- committed', { timeout: 15000 })
    await expect(status).toContainText('“Fixture brief from events”')
    await expect(pane.getByText('Step Timings')).toBeVisible()
    for (const word of ['Art', 'Mockup', 'Engineering', 'Build', 'Gate', 'Archive']) {
      await expect(pane.getByText(word, { exact: true })).toBeVisible()
    }
  })

  test('the success card opens the site in a new tab', async ({ page, context }) => {
    await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()
    const open = content(page).getByRole('button', { name: 'OPEN SITE' })
    await expect(open).toBeVisible({ timeout: 15000 })
    const [site] = await Promise.all([page.waitForEvent('popup'), open.click()])
    expect(new URL(site.url()).origin).toBe(new URL(page.url()).origin)
    await site.close()
  })

  test('run again counts down, then starts the next run', async ({ page, context }) => {
    const s = await stubbed(page, context)
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()
    const again = content(page).getByRole('button', { name: 'RUN AGAIN' })
    await expect(again).toBeEnabled({ timeout: 15000 })
    await again.click()

    await expect(content(page).getByRole('button', { name: /RUN AGAIN IN \d+s/ })).toBeDisabled()
    await expect(page.getByTestId('run-pipeline-btn')).toHaveText(/COOLDOWN \d+s/)
    await expect(page.getByTestId('run-pipeline-btn')).toBeDisabled()

    await expect.poll(() => s.starts.length, { timeout: 20000 }).toBe(2)
    await expect(content(page).getByRole('status')).toContainText('Build passed -- committed', {
      timeout: 15000,
    })
  })

  test('a refused start is reported, and retry tries again', async ({ page, context }) => {
    const s = await stubbed(page, context, {
      start: { status: 409, error: 'A pipeline is already running' },
    })
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()

    const alert = content(page).getByRole('alert')
    await expect(alert).toContainText('Pipeline failed')
    await expect(alert).toContainText('A pipeline is already running')
    await expect(page.getByTestId('run-pipeline-btn')).toBeEnabled()
    expect(await page.evaluate(() => sessionStorage.getItem('pipeline-start-time'))).toBeNull()

    await alert.getByRole('button', { name: 'RETRY' }).click()
    await expect.poll(() => s.starts.length).toBe(2)
  })

  test('a start that never reaches the server is reported', async ({ page, context }) => {
    await stubbed(page, context, { start: 'abort' })
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()

    await expect(content(page).getByRole('alert')).toContainText('Pipeline failed')
    await expect(page.getByTestId('run-pipeline-btn')).toHaveText('RUN PIPELINE')
    expect(await page.evaluate(() => sessionStorage.getItem('pipeline-start-time'))).toBeNull()
  })

  test('a failed build shows the error from the stream', async ({ page, context }) => {
    await stubbed(page, context, {
      streams: [log('Stage 1: Collect signals') + done(false, 'Build failed after 3 attempts')],
    })
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()

    const alert = content(page).getByRole('alert')
    await expect(alert).toContainText('Pipeline failed', { timeout: 15000 })
    await expect(alert).toContainText('Build failed after 3 attempts')
    await expect(alert.getByRole('button', { name: 'RETRY' })).toBeVisible()
  })

  test('a stream that keeps failing gives up with an error', async ({ page, context }) => {
    test.setTimeout(45000)
    await stubbed(page, context, { streams: [{ status: 503 }] })
    await openPanel(page)
    await openPane(page, 'Run Pipeline')
    await page.getByTestId('run-pipeline-btn').click()

    await expect(content(page).getByRole('alert')).toContainText(
      'Lost connection to pipeline (server may be down)',
      { timeout: 20000 }
    )
    expect(await page.evaluate(() => sessionStorage.getItem('pipeline-start-time'))).toBeNull()
  })

  test('a reload during a run reconnects to the stream', async ({ page, context }) => {
    const s = await stubbed(page, context, { streams: [RUN_COMPLETE] })
    await page.addInitScript(() => {
      sessionStorage.setItem('pipeline-start-time', String(Date.now()))
      sessionStorage.setItem('dev-panel-pane', 'run')
    })
    await page.goto('/dev')

    await expect(content(page).getByRole('status')).toContainText('Build passed -- committed', {
      timeout: 15000,
    })
    // It reconnected rather than starting a run of its own.
    expect(s.starts).toHaveLength(0)
  })
})
