/**
 * Build the canonical record for one archived day.
 *
 * Decided on issue #153. The record is `archive/<date>/record.json`: a
 * materialized summary of everything that was true of the build that shipped
 * that day, written by the pipeline and rebuildable for history by
 * `scripts/backfill-archive-records.js`. It is a cache, not a source — nothing
 * here is hand-edited, and `generate-archive-json.js` projects the public copy
 * from it rather than re-deriving anything from `brief.md` prose.
 */

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { parsePreset } from './preset-parser.js'

/**
 * Coverage is stratigraphic: each artifact appears on one date and then runs
 * unbroken to today. The era is stamped from this table, never from observing
 * which files are present, because observation cannot tell "this stratum did
 * not exist yet" from "this build dropped a file" — and that distinction is the
 * whole point of stamping an era.
 */
export const ERAS = [
  { era: 'prose', start: '2026-03-12', gains: ['brief.md', 'archetype.txt'] },
  { era: 'logged', start: '2026-03-20', gains: ['build.json'] },
  { era: 'traced', start: '2026-03-29', gains: ['trace.json', 'signals-brief.md', 'preset.ts'] },
  { era: 'color-directed', start: '2026-04-18', gains: ['color-scheme.json'] },
  {
    era: 'shell-directed',
    start: '2026-07-12',
    gains: ['shell.json', 'verdicts.json', 'mockup.html'],
  },
  {
    era: 'grammar',
    start: '2026-08-23',
    gains: ['composition.json', 'lane.json', 'hero-source.json', 'cost.json'],
  },
  { era: 'header-declared', start: '2026-08-30', gains: ['header.json'] },
]

/** The eight-name vocabulary the site was built on for five months. Kept as a
 * record of how it was made, and no longer written — today's `archetype.txt`
 * holds free prose, which is dropped rather than preserved as a ninth name. */
export const LEGACY_ARCHETYPES = [
  'Broadsheet',
  'Gallery Wall',
  'Index',
  'Poster',
  'Scroll',
  'Specimen',
  'Split',
  'Stack',
]

/**
 * @param {string} date `YYYY-MM-DD`
 * @returns {string|null} era name, or null for a date before the archive begins
 */
export function eraForDate(date) {
  let found = null
  for (const e of ERAS) {
    if (date >= e.start) found = e.era
  }
  return found
}

/**
 * Every artifact an era is expected to carry: its own gains plus everything
 * the strata below it gained.
 * @param {string} era
 * @returns {string[]}
 */
export function expectedArtifacts(era) {
  const out = []
  for (const e of ERAS) {
    out.push(...e.gains)
    if (e.era === era) break
  }
  return out
}

function readSafe(p) {
  return existsSync(p) ? readFileSync(p, 'utf8') : null
}

function readJsonSafe(p) {
  const raw = readSafe(p)
  if (raw === null) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Pick the build that shipped, which is not always the newest by timestamp.
 *
 * `archive()` writes the shipping build's brief to `archive/<date>/brief.md` as
 * the day's "latest", so a build whose own `brief.md` matches that file is the
 * one whose design went live. Two dates need this: `2026-04-28`, whose newest
 * build dir holds nothing but a `.DS_Store`, and `2026-04-30`, whose newest is a
 * complete-looking retry that never shipped. Taking the newest silently records
 * a design the site never wore.
 *
 * @param {string} dateDir
 * @returns {{buildId: string|null, buildDir: string|null, attempts: number}}
 */
export function pickBuild(dateDir) {
  if (!existsSync(dateDir)) return { buildId: null, buildDir: null, attempts: 0 }

  const builds = readdirSync(dateDir, { withFileTypes: true })
    .filter((b) => b.isDirectory() && /^build-\d+$/.test(b.name))
    .map((b) => b.name)
    .sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)))

  const attempts = builds.length
  if (attempts === 0) return { buildId: null, buildDir: null, attempts: 0 }

  const shippedBrief = readSafe(join(dateDir, 'brief.md'))
  const matching = shippedBrief
    ? builds.filter((b) => readSafe(join(dateDir, b, 'brief.md')) === shippedBrief)
    : []

  const withBrief = builds.filter((b) => existsSync(join(dateDir, b, 'brief.md')))
  const chosen = matching.at(-1) ?? withBrief.at(-1) ?? builds.at(-1)

  return { buildId: chosen.slice('build-'.length), buildDir: join(dateDir, chosen), attempts }
}

/**
 * Parse the day's `brief.md`. The format has not changed since 2026-03-12:
 * a date heading, a one-line design brief, a rationale section, a file list.
 * @param {string|null} md
 * @returns {{brief: string|null, rationale: string|null, filesChanged: string[]}}
 */
export function parseBrief(md) {
  if (!md) return { brief: null, rationale: null, filesChanged: [] }
  const lines = md.split('\n')
  const briefPrefix = '**Design Brief:** '
  const briefLine = lines.find((l) => l.startsWith(briefPrefix))
  const rationaleStart = lines.findIndex((l) => l.startsWith("## Claude's Rationale"))
  const filesStart = lines.findIndex((l) => l.startsWith('## Files Changed'))

  let rationale = null
  if (rationaleStart !== -1) {
    const end = filesStart === -1 ? lines.length : filesStart
    rationale =
      lines
        .slice(rationaleStart + 1, end)
        .join('\n')
        .trim() || null
  }

  const filesChanged = []
  if (filesStart !== -1) {
    for (const line of lines.slice(filesStart + 1)) {
      const t = line.trim()
      if (t.startsWith('- ')) filesChanged.push(t.slice(2).trim())
    }
  }

  return {
    brief: briefLine ? briefLine.slice(briefPrefix.length).trim() : null,
    rationale,
    filesChanged,
  }
}

/**
 * `signals-brief.md` headings by era. Two vocabularies exist: the Art Director
 * has written Hero Copy / Chassis / Visual Specification since 2026-05, and
 * before that wrote a directional brief with no hero at all. Both are read.
 * Anything not listed here — the date and title headings every file opens with —
 * is dropped rather than turned into a key.
 */
const BRIEF_SECTIONS = {
  'Hero Copy': 'heroCopy',
  'Hero Rationale': 'heroRationale',
  Chassis: 'chassis',
  'Visual Specification': 'visualSpecification',
  'Self-Check': 'selfCheck',
  Rationale: 'rationale',
  'Composition Rationale': 'compositionRationale',
  // pre-2026-05 vocabulary
  Mood: 'mood',
  'Composition Direction': 'compositionDirection',
  'Typography Direction': 'typographyDirection',
  'Signal Integration': 'signalIntegration',
  'Palette Direction': 'paletteDirection',
}

/**
 * Split markdown into `## ` sections. Sub-headings stay inside their parent's
 * body — `### 5. Signal Integration` belongs to the visual specification.
 * @param {string} md
 * @returns {Map<string, string>}
 */
function sectionsByHeading(md) {
  const out = new Map()
  let heading = null
  let body = []
  for (const line of md.split('\n')) {
    const m = /^##\s+(.+?)\s*$/.exec(line)
    if (m && !line.startsWith('###')) {
      if (heading !== null) out.set(heading, body.join('\n').trim())
      heading = m[1]
      body = []
    } else if (heading !== null) {
      body.push(line)
    }
  }
  if (heading !== null) out.set(heading, body.join('\n').trim())
  return out
}

/**
 * @param {string|null} md
 * @returns {{hero: {copy: string|null, rationale: string|null}, chassis: string|null, adBrief: Record<string, string>|null}}
 */
export function parseSignalsBrief(md) {
  if (!md) return { hero: { copy: null, rationale: null }, chassis: null, adBrief: null }

  const sections = sectionsByHeading(md)
  /** @type {Record<string, string>} */
  const named = {}
  for (const [heading, key] of Object.entries(BRIEF_SECTIONS)) {
    const body = sections.get(heading)
    if (body) named[key] = body
  }

  // In the modern brief, signal integration is a numbered subsection of the
  // visual spec rather than a heading of its own.
  if (!named.signalIntegration && named.visualSpecification) {
    const m = /^###\s+\d+\.\s+Signal Integration\s*$/m.exec(named.visualSpecification)
    if (m) {
      const rest = named.visualSpecification.slice(m.index + m[0].length)
      const next = /^###\s+/m.exec(rest)
      const body = (next ? rest.slice(0, next.index) : rest).trim()
      if (body) named.signalIntegration = body
    }
  }

  const { heroCopy, heroRationale, chassis, ...adBrief } = named
  return {
    hero: { copy: heroCopy ?? null, rationale: heroRationale ?? null },
    chassis: chassis ?? null,
    adBrief: Object.keys(adBrief).length > 0 ? adBrief : null,
  }
}

/**
 * Lift the day's signals. The `## Signals` body of `brief.md` is empty on 108
 * of 122 dates, so the real source is the `signals-loaded` step of `trace.json`,
 * which carries the raw provider payload on every trace that exists.
 * @param {unknown} trace
 * @returns {object|null}
 */
export function liftSignals(trace) {
  if (!trace || typeof trace !== 'object') return null
  const steps = Array.isArray(trace) ? trace : trace.steps
  if (!Array.isArray(steps)) return null
  const step = steps.find((s) => s && s.name === 'signals-loaded')
  const output = step?.output
  return output && typeof output === 'object' ? output : null
}

/**
 * Read `cost.json` into the record's shape. Native snake_case is kept: the
 * lift is a straight copy of the artifact with no translation layer to drift.
 * @param {object|null} raw
 */
function normalizeCost(raw) {
  if (!raw || typeof raw !== 'object') return null
  return {
    total_usd: typeof raw.total_usd === 'number' ? raw.total_usd : null,
    estimated: Boolean(raw.estimated),
    partial: Boolean(raw.partial),
    calls: typeof raw.calls === 'number' ? raw.calls : 0,
    retries: typeof raw.retries === 'number' ? raw.retries : 0,
    byAgent: Array.isArray(raw.byAgent) ? raw.byAgent : [],
  }
}

/**
 * Build one date's record.
 *
 * @param {string} date `YYYY-MM-DD`
 * @param {object} [options]
 * @param {string} [options.archiveDir] defaults to `<cwd>/archive`
 * @param {object} [options.signals] signals as loaded this run — the pipeline
 *   passes them directly because `trace.json` is not written until after
 *   `archive()` returns. Backfill omits them and lifts from the trace.
 * @param {string} [options.generatedAt] ISO stamp; defaults to now
 * @returns {object|null} the record, or null if the date has no archive dir
 */
export function buildRecord(date, options = {}) {
  const archiveDir = options.archiveDir ?? join(process.cwd(), 'archive')
  const dateDir = join(archiveDir, date)
  if (!existsSync(dateDir)) return null

  const era = eraForDate(date)
  const { buildId, buildDir, attempts } = pickBuild(dateDir)
  const inBuild = (name) => (buildDir ? join(buildDir, name) : join(dateDir, name))

  const briefMd = readSafe(inBuild('brief.md')) ?? readSafe(join(dateDir, 'brief.md'))
  const { brief, rationale, filesChanged } = parseBrief(briefMd)

  const archetypeRaw = readSafe(join(dateDir, 'archetype.txt'))?.trim() ?? null
  const legacyArchetype = LEGACY_ARCHETYPES.includes(archetypeRaw) ? archetypeRaw : null

  const signals = options.signals ?? liftSignals(readJsonSafe(inBuild('trace.json')))

  const { hero, chassis, adBrief } = parseSignalsBrief(readSafe(inBuild('signals-brief.md')))
  const heroSource = readJsonSafe(inBuild('hero-source.json'))

  const presetSrc = readSafe(inBuild('preset.ts'))
  let tokens = null
  let tokensError = null
  if (presetSrc) {
    try {
      tokens = parsePreset(presetSrc)
    } catch (err) {
      tokensError = err.message
    }
  }

  const record = {
    date,
    era,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
    buildId,
    attempts,

    brief,
    rationale,
    filesChanged,
    legacyArchetype,

    signals,

    hero: { ...hero, source: heroSource?.source ?? null },
    chassis,
    adBrief,
    tokens,

    colorScheme: readJsonSafe(inBuild('color-scheme.json')),
    shell: readJsonSafe(inBuild('shell.json')),
    header: readJsonSafe(inBuild('header.json')),
    verdicts: readJsonSafe(inBuild('verdicts.json')),
    composition: readJsonSafe(inBuild('composition.json')),
    lane: readJsonSafe(inBuild('lane.json')),
    cost: normalizeCost(readJsonSafe(inBuild('cost.json'))),
    // Declared MEASURABLES floors plus the achieved render numbers (#456).
    // Not added to ERAS/expectedArtifacts: it is new as of this build and an
    // absent file on every older date is expected, not an anomaly.
    measurables: readJsonSafe(inBuild('measurables.json')),
  }

  Object.defineProperty(record, '__anomalies', {
    value: findAnomalies(record, { dateDir, buildDir, tokensError }),
    enumerable: false,
  })

  return record
}

/**
 * Artifacts the era says should be here and are not. A date that disagrees with
 * its stratum is worth logging rather than papering over: `2026-04-14` surfaces
 * on its own this way, having lost its date-level brief entirely.
 * @returns {string[]}
 */
function findAnomalies(record, { dateDir, buildDir, tokensError }) {
  const out = []
  const expected = record.era ? expectedArtifacts(record.era) : []
  const has = {
    'brief.md': record.brief !== null,
    'archetype.txt': existsSync(join(dateDir, 'archetype.txt')),
    'build.json': buildDir ? existsSync(join(buildDir, 'build.json')) : false,
    'trace.json': record.signals !== null,
    'signals-brief.md': record.adBrief !== null || record.chassis !== null,
    'preset.ts': record.tokens !== null,
    'color-scheme.json': record.colorScheme !== null,
    'shell.json': record.shell !== null,
    'header.json': record.header !== null,
    'verdicts.json': record.verdicts !== null,
    'mockup.html': buildDir ? existsSync(join(buildDir, 'mockup.html')) : false,
    'composition.json': record.composition !== null,
    'lane.json': record.lane !== null,
    'hero-source.json': record.hero.source !== null,
    'cost.json': record.cost !== null,
  }
  for (const artifact of expected) {
    if (has[artifact] === false) out.push(`missing ${artifact}`)
  }
  if (tokensError) out.push(`preset.ts unparseable: ${tokensError}`)
  return out
}

/**
 * Anomalies found while building a record. Non-enumerable on the record itself
 * so it never reaches `record.json`.
 * @param {object} record
 * @returns {string[]}
 */
export function anomaliesOf(record) {
  return record?.__anomalies ?? []
}
