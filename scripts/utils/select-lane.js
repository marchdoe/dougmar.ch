import path from 'node:path'
import { lastDistinct, readRecentBuilds } from './recent-builds.js'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { hashToRange } from './deterministic-hash.js'
import { AXIS_NAMES, COMPOSITION_AXES } from './composition-grammar.js'
import { loadPromptSync } from './prompt-loader.js'

/**
 * Lane selection — successor to select-seed.js (deleted, Task 4) now that
 * aesthetic register is decoupled from archetype (see
 * composition-grammar.js). A lane no longer belongs to one archetype's
 * file; all 17 live in one directory and any lane can pair with any
 * composition tuple. Selection is no longer keyed by archetype at all — it
 * is keyed by the day's composition tuple, biased toward lanes whose
 * declared `affinity` overlaps that tuple's values, softly steering away
 * from lanes used on the last 3 builds. design-agents.js's call site was
 * rewired to this module in the same change that deleted select-seed.js.
 *
 * @module
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LANES_DIR = path.resolve(__dirname, '..', 'prompts', 'lanes')

/** Union of every value across every composition axis — an affinity value must be one of these. */
const ALL_AXIS_VALUES = new Set(AXIS_NAMES.flatMap((axis) => COMPOSITION_AXES[axis]))

// A lane pushes recency out by this much per build in the forbid window,
// and gains this much per composition-axis value it shares with today's
// tuple. Both additive to a hash-derived base in [0, 999] so a lane with no
// history and no affinity match still has a fair, deterministic shot —
// "biased", not gated, on either signal.
const AFFINITY_BONUS = 300
const FORBID_PENALTY = 600
const FORBID_WINDOW = 3

/**
 * Parse a lane file's `---`-delimited front-matter and body.
 *
 * Deliberately not a general YAML parser — the front-matter is three fixed
 * scalar/list fields, and a bespoke `key: value` reader keeps this module
 * free of a new dependency (composition-grammar.js and its mandate follow
 * the same policy).
 *
 * @param {string} raw
 * @returns {{ id: string|null, register: string|null, affinity: string[], body: string }}
 */
export function parseLaneFrontmatter(raw) {
  const text = String(raw ?? '')
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text)
  if (!match) return { id: null, register: null, affinity: [], body: text.trim() }

  const [, frontmatter, body] = match
  const fields = {}
  for (const line of frontmatter.split('\n')) {
    const kv = /^([a-z]+):\s*(.*)$/.exec(line.trim())
    if (kv) fields[kv[1]] = kv[2].trim()
  }

  const affinity = fields.affinity
    ? fields.affinity
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
    : []

  return {
    id: fields.id ?? null,
    register: fields.register ?? null,
    affinity,
    body: body.trim(),
  }
}

/**
 * Read and parse every lane file on disk.
 * @returns {Array<{ id: string, register: string|null, affinity: string[], body: string, path: string }>}
 */
export function loadLanes() {
  if (!existsSync(LANES_DIR)) return []
  return readdirSync(LANES_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'README.md')
    .map((f) => {
      const filePath = path.join(LANES_DIR, f)
      const parsed = parseLaneFrontmatter(loadPromptSync(path.join('lanes', f)))
      // Fall back to the filename so a lane missing its `id:` field is still
      // selectable and identifiable, rather than silently colliding as null.
      return { ...parsed, id: parsed.id ?? path.basename(f, '.md'), path: filePath }
    })
}

/**
 * Every affinity value declared across every lane must be a real
 * composition-axis value — the whole point of affinity is to bias toward
 * axis values, so a typo or a retired value here would silently do nothing.
 * @param {ReturnType<typeof loadLanes>} lanes
 * @returns {Array<{ laneId: string, value: string }>} invalid entries, empty if all valid
 */
export function validateAffinities(lanes) {
  const invalid = []
  for (const lane of lanes) {
    for (const value of lane.affinity) {
      if (!ALL_AXIS_VALUES.has(value)) invalid.push({ laneId: lane.id, value })
    }
  }
  return invalid
}

/**
 * Read the most recently used lane id for each of the last `lookbackDays`
 * dates, from the `lane.json` artifact each build persists. Returns [] when
 * no build in the window wrote one, which is the expected, non-error case:
 * every lane is equally fresh until history exists.
 *
 * @param {string} archiveDir
 * @param {number} lookbackDays
 * @returns {Array<{ date: string, laneId: string }>} newest first
 */
export function extractRecentLanes(archiveDir, lookbackDays) {
  // The build that shipped, not the newest — see scripts/utils/recent-builds.js
  const recent = readRecentBuilds(archiveDir, { lookbackDays })

  const out = []
  for (const { date: dateDir, buildDir } of recent) {
    const lanePath = path.join(buildDir, 'lane.json')
    if (!existsSync(lanePath)) continue
    try {
      const parsed = JSON.parse(readFileSync(lanePath, 'utf8'))
      if (typeof parsed.laneId === 'string' && parsed.laneId) {
        out.push({ date: dateDir, laneId: parsed.laneId })
      }
    } catch {
      /* malformed artifact — skip the build, keep the history */
    }
  }
  return out
}

/**
 * Score one lane for one day: a deterministic hash-derived base, plus a
 * bonus per composition-axis value it shares with today's tuple, minus a
 * penalty if it was used in the forbid window. Never a hard filter — a lane
 * that matches strongly enough can still win while forbidden, exactly as
 * composition-mandate.js's per-axis nudge stays soft.
 *
 * @param {{id: string, affinity: string[]}} lane
 * @param {string} date
 * @param {Set<string>} tupleValues
 * @param {string[]} forbidden
 * @returns {number}
 */
function scoreLane(lane, date, tupleValues, forbidden) {
  const base = hashToRange(`lane:${date}:${lane.id}`, 0, 999)
  const affinityMatches = lane.affinity.filter((v) => tupleValues.has(v)).length
  const penalty = forbidden.includes(lane.id) ? FORBID_PENALTY : 0
  return base + affinityMatches * AFFINITY_BONUS - penalty
}

/**
 * Pick one lane for a build. Deterministic per (date, tuple, history): the
 * same inputs always pick the same lane, so a re-run of a given day
 * reproduces it.
 *
 * @param {{ archiveDir: string, date: string, tuple?: Record<string,string>, lookbackDays?: number }} opts
 * @returns {{ lane: object, laneCount: number, scores: Array<{id: string, score: number}>, forbidden: string[] }}
 */
export function selectLane({ archiveDir, date, tuple = {}, lookbackDays = 7 }) {
  const lanes = loadLanes()
  if (lanes.length === 0) {
    throw new Error(`selectLane: no lane files found under ${LANES_DIR}`)
  }
  // A typo'd affinity value scores nothing and forbids nothing, silently.
  // This used to run only in the unit test, so a lane edited without the
  // suite could sit broken for weeks. Now the pipeline itself refuses it.
  const invalid = validateAffinities(lanes)
  if (invalid.length) {
    throw new Error(
      `selectLane: unknown affinity values: ${invalid.map((i) => `${i.laneId}: ${i.value}`).join(', ')}`
    )
  }

  const recent = extractRecentLanes(archiveDir, lookbackDays)
  const forbidden = lastDistinct(
    recent.map((r) => r.laneId),
    FORBID_WINDOW
  )
  const tupleValues = new Set(Object.values(tuple).filter(Boolean))

  const scored = lanes
    .map((lane) => ({ lane, score: scoreLane(lane, date, tupleValues, forbidden) }))
    .sort((a, b) => b.score - a.score)

  return {
    lane: scored[0].lane,
    laneCount: lanes.length,
    scores: scored.map((s) => ({ id: s.lane.id, score: s.score })),
    forbidden,
  }
}
