#!/usr/bin/env node

/**
 * Project the archive records into the static JSON the SPA fetches.
 *
 * Produces:
 *   public/archive-data/index.json    — one light entry per archived day
 *   public/archive-data/{date}.json   — that day's record, plus display extras
 *                                       and the run the day page draws (#415)
 *
 * This derives nothing. `archive/{date}/record.json` (#153) is the record; this
 * only decides what a browser receives. Any date missing a record is rebuilt
 * here rather than skipped, so a checkout that has never run the backfill still
 * produces a complete archive.
 *
 * The files live under `/archive-data/` rather than inside `/archive/`, which is
 * reserved for bytes that shipped on the day they are named after. The day's
 * screenshot and viewport captures are served from here too. They are copied
 * out of `archive/<date>/build-*` by `publishArchiveImages` below, at build
 * time, rather than committed a second time (#549).
 */

import {
  constants,
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { ROOT } from './utils/file-manager.js'
import { isMain } from './utils/cli.js'
import { archivedDates, readJsonSafe } from './utils/archive-fs.js'
import { anomaliesOf, buildRecord, pickBuild } from './utils/archive-record.js'
import { readRatingForDate } from './utils/ratings.js'
import { WINDOW, computeUniqueness } from './utils/uniqueness-index.js'
import { readUniquenessInputs } from './utils/read-uniqueness-history.js'

/**
 * Read the record the pipeline wrote. Rebuilding when it is absent keeps this
 * script honest on a fresh clone; the log line says which happened.
 * @param {string} date
 * @param {string} archiveDir
 * @returns {{record: object|null, rebuilt: boolean}}
 */
export function loadRecord(date, archiveDir) {
  const path = join(archiveDir, date, 'record.json')
  if (existsSync(path)) {
    try {
      return { record: JSON.parse(readFileSync(path, 'utf8')), rebuilt: false }
    } catch {
      /* fall through to a rebuild */
    }
  }
  return { record: buildRecord(date, { archiveDir }), rebuilt: true }
}

/** The image types a build's `viewports/` directory has held: PNG first, WebP since #549. */
const VIEWPORT_IMAGE = /\.(png|webp)$/i

/**
 * Copy one file unless the destination already exists. Returns 1 when it wrote.
 * @param {string} src
 * @param {string} dest
 * @returns {number}
 */
function copyIfAbsent(src, dest) {
  mkdirSync(dirname(dest), { recursive: true })
  try {
    copyFileSync(src, dest, constants.COPYFILE_EXCL)
    return 1
  } catch (err) {
    if (err?.code === 'EEXIST') return 0
    throw err
  }
}

/**
 * Put each day's screenshot and viewport captures where the site serves them:
 * `<outDir>/<date>.png` and `<outDir>/<date>/viewports/<name>`, copied from the
 * build that shipped that day.
 *
 * Until #549 the nightly committed these as a second copy beside the ones in
 * `archive/`, and the same bytes then sat in the tree up to five times. They
 * are gitignored now and made here, the way the JSON beside them is.
 *
 * An existing file is never overwritten. Every copy committed before #549 is
 * the served bytes for its URL and must keep answering it unchanged, and
 * leaving a tracked file alone also keeps the nightly's working tree clean.
 * A stale local copy is cleared with `git clean -fdX public/archive-data`.
 *
 * @param {{ archiveDir: string, outDir: string }} paths
 * @returns {number} files written
 */
export function publishArchiveImages({ archiveDir, outDir }) {
  let written = 0
  for (const date of archivedDates(archiveDir)) {
    const { buildDir } = pickBuild(join(archiveDir, date))
    if (!buildDir) continue

    const screenshot = join(buildDir, 'screenshot.png')
    if (existsSync(screenshot)) written += copyIfAbsent(screenshot, join(outDir, `${date}.png`))

    const viewports = join(buildDir, 'viewports')
    if (!existsSync(viewports)) continue
    for (const name of readdirSync(viewports).filter((f) => VIEWPORT_IMAGE.test(f))) {
      written += copyIfAbsent(join(viewports, name), join(outDir, date, 'viewports', name))
    }
  }
  return written
}

/**
 * Pages of preserved site under public/archive/<date>/.
 *
 * Counted rather than assumed: three dates have a record and no capture, and
 * the ten earliest have five pages instead of nine.
 * @param {string} date
 * @param {string} publicDir
 */
export function countSnapshotPages(date, publicDir) {
  const dir = join(publicDir, 'archive', date)
  if (!existsSync(dir)) return 0
  let n = 0
  const walk = (d, rel) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(d, entry.name), rel ? `${rel}/${entry.name}` : entry.name)
      else if (entry.name.endsWith('.html')) n += 1
    }
  }
  walk(dir, '')
  return n
}

/**
 * Read one date's uniqueness inputs off disk.
 *
 * Computed here for every date rather than only read back from the
 * `uniqueness.json` the pipeline now writes, so the chart covers the whole
 * corpus on the first run instead of starting from whenever the index shipped.
 * The persisted file stays the per-build record; this is the projection.
 *
 * It delegates to the pipeline's own reader. The two used to be separate
 * copies, drifted once (#254 added header.json on one side only), and were
 * both taking the newest build dir instead of the one that shipped (#308).
 *
 * @param {string} date
 * @param {string} archiveDir
 * @returns {import('./utils/read-uniqueness-history.js').UniquenessInputs}
 */
export function uniquenessInputs(date, archiveDir) {
  return readUniquenessInputs(join(archiveDir, date), date)
}

/**
 * A trace step that took time. The pipeline also logs markers with a duration
 * of zero — `signals-loaded`, `brief-loaded`, `build-validation` — which say
 * that something happened, not how long it took, and the day page has no row
 * to give them.
 */
const isStage = (step) =>
  step &&
  typeof step.name === 'string' &&
  typeof step.durationMs === 'number' &&
  step.durationMs > 0 &&
  typeof step.timestamp === 'string'

/**
 * The run, lifted for the day page (#415): each traced step's name, phase and
 * duration, when the run started and ended, and each agent call's model, time
 * and cost. A plain lift of `trace.json` and `cost.json` with the fields the
 * page needs and nothing else; `app/lib/archive-run.ts` does the merging.
 *
 * Read from the build that shipped, like the uniqueness inputs. `record.json`
 * cannot carry the trace because the pipeline writes the record before
 * `trace.json` exists, so both files are read off disk at projection time.
 * A missing or malformed trace is an absent run; a missing or malformed cost
 * file leaves `calls` null and the run is time only.
 *
 * @param {string} date
 * @param {string} archiveDir
 * @returns {object|null}
 */
export function liftRun(date, archiveDir) {
  const { buildDir } = pickBuild(join(archiveDir, date))
  if (!buildDir) return null

  const trace = readJsonSafe(join(buildDir, 'trace.json'))
  if (!trace || typeof trace !== 'object' || !Array.isArray(trace.steps)) return null

  const steps = trace.steps.filter(isStage).map((s) => ({
    name: s.name,
    phase: typeof s.phase === 'number' ? s.phase : null,
    durationMs: s.durationMs,
    endedAt: s.timestamp,
  }))

  const cost = readJsonSafe(join(buildDir, 'cost.json'))
  const calls = Array.isArray(cost?.byAgent)
    ? cost.byAgent
        .filter((c) => c && typeof c.agent === 'string')
        .map((c) => ({
          agent: c.agent,
          model: typeof c.model === 'string' ? c.model : null,
          ms: typeof c.ms === 'number' ? c.ms : null,
          costUsd: typeof c.cost_usd === 'number' ? c.cost_usd : null,
          estimated: Boolean(c.estimated),
        }))
    : null

  return {
    startedAt: typeof trace.startedAt === 'string' ? trace.startedAt : null,
    completedAt: typeof trace.completedAt === 'string' ? trace.completedAt : null,
    steps,
    calls,
    totalUsd: calls && typeof cost.total_usd === 'number' ? cost.total_usd : null,
    estimated: calls ? Boolean(cost.estimated) : false,
    retries: calls && typeof cost.retries === 'number' ? cost.retries : null,
  }
}

/**
 * The calendar and the dev panel both read the index, so it carries only what a
 * list needs: enough to label a day and color a cell.
 */
export function indexEntry(record, { hasScreenshot, pages, uniqueness }, archiveDir) {
  return {
    date: record.date,
    era: record.era,
    brief: record.brief,
    legacyArchetype: record.legacyArchetype,
    chassis: record.chassis,
    buildId: record.buildId,
    attempts: record.attempts,
    moodWord: record.colorScheme?.mood_word ?? null,
    primaryHue: record.colorScheme?.primary_hue ?? null,
    hasScreenshot,
    // How many pages of that day's site were preserved. 0 means the record
    // survived but the capture did not, and the calendar must send that cell to
    // the explainer instead of to a design that is not there. See #157.
    pages,
    cost: record.cost
      ? {
          totalUsd: record.cost.total_usd,
          estimated: record.cost.estimated,
          retries: record.cost.retries,
        }
      : null,
    rating: readRatingForDate(archiveDir, record.date),
    // Composite 0..1, or null when nothing about the day was comparable.
    // `window` says how many builds it was measured against, so a chart can
    // dim the early dates rather than treating a 2-build window as a verdict.
    uniqueness: uniqueness ? { composite: uniqueness.composite, window: uniqueness.window } : null,
  }
}

/**
 * Project every archived day into `outDir`. Returns what it wrote so a test
 * can look without reading the files back.
 *
 * @param {{ archiveDir: string, publicDir: string, outDir: string }} paths
 * @returns {{ index: object[], rebuilt: number, anomalous: string[] }}
 */
export function projectArchive({ archiveDir, publicDir, outDir }) {
  console.log('[generate-archive-json] Projecting archive records...')

  const dates = archivedDates(archiveDir, { newestFirst: true })
  mkdirSync(outDir, { recursive: true })
  // Before the loop: `hasScreenshot` below asks whether the day's PNG is there.
  const images = publishArchiveImages({ archiveDir, outDir })
  console.log(`  published ${images} image file(s) from archive/ to ${outDir}`)

  const index = []
  let rebuilt = 0
  const anomalous = []

  // Uniqueness inputs for every date, oldest first, so each date can be scored
  // against the WINDOW dates that actually preceded it.
  const chronological = [...dates].sort()
  const inputsByDate = new Map(chronological.map((d) => [d, uniquenessInputs(d, archiveDir)]))
  const uniquenessByDate = new Map()
  for (let i = 0; i < chronological.length; i++) {
    const date = chronological[i]
    const history = chronological
      .slice(Math.max(0, i - WINDOW), i)
      .reverse()
      .map((d) => inputsByDate.get(d))
    uniquenessByDate.set(date, computeUniqueness(inputsByDate.get(date), history))
  }

  for (const date of dates) {
    const { record, rebuilt: wasRebuilt } = loadRecord(date, archiveDir)
    if (!record) continue
    if (wasRebuilt) {
      rebuilt++
      for (const anomaly of anomaliesOf(record)) anomalous.push(`${date}: ${anomaly}`)
    }

    const hasScreenshot = existsSync(join(outDir, `${date}.png`))
    const pages = countSnapshotPages(date, publicDir)
    const uniqueness = uniquenessByDate.get(date) ?? null
    const run = liftRun(date, archiveDir)

    writeFileSync(
      join(outDir, `${date}.json`),
      JSON.stringify({ ...record, hasScreenshot, pages, uniqueness, run }),
      'utf8'
    )
    index.push(indexEntry(record, { hasScreenshot, pages, uniqueness }, archiveDir))
  }

  writeFileSync(join(outDir, 'index.json'), JSON.stringify(index), 'utf8')

  console.log(`  wrote ${join(outDir, 'index.json')} (${index.length} entries)`)
  console.log(
    `  wrote ${index.length} per-date files${rebuilt ? `, ${rebuilt} rebuilt from artifacts` : ''}`
  )
  for (const anomaly of anomalous) console.warn(`  record anomaly — ${anomaly}`)
  console.log('[generate-archive-json] Done')
  return { index, rebuilt, anomalous }
}

if (isMain(import.meta.url)) {
  projectArchive({
    archiveDir: join(ROOT, 'archive'),
    publicDir: join(ROOT, 'public'),
    outDir: join(ROOT, 'public', 'archive-data'),
  })
}
