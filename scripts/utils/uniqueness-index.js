/**
 * Uniqueness index — how different today's build is from the ones before it.
 *
 * Every metric is deterministic and costs no tokens. Each returns a score in
 * 0..1 where 1 is "nothing like the recent past" and 0 is "identical to
 * something in the window". The composite is a weighted mean over whichever
 * metrics could be computed, so a build missing artifacts still scores on the
 * rest instead of dropping out entirely.
 *
 * The window is the last 7 builds. Seven is short enough that a repeat inside
 * it is a repeat a visitor would notice, and long enough that a fortnightly
 * rotation still reads as varied.
 *
 * Comparison is against the *nearest* neighbour in the window, not the mean.
 * Averaging hides the failure this index exists to catch: a build that clones
 * yesterday still averages well against six unlike days.
 */

import { AXIS_NAMES } from './composition-grammar.js'
import { hueDistance } from './color-validation.js'
import { geometryNovelty } from './geometry-fingerprint.js'
import { HUE_ASK_FOR_DISTANCE, HUE_NEAR_REPEAT } from './hue-thresholds.js'

/** Builds compared against. @type {number} */
export const WINDOW = 7

/** Shell fields with enumerated values. `footer` is free prose and cannot be compared exactly. */
export const SHELL_FIELDS = ['brand_lockup', 'brand_color_mode', 'ground_strategy']

/**
 * Header fields with enumerated values. `nav` moved here from shell.json with
 * #254 and stays prose; `placement` is the enumerated half and is exactly the
 * repetition the owner kept flagging — three ratings running complained about
 * a top bar.
 */
export const HEADER_FIELDS = ['placement']

/**
 * Composite weights. Keys absent from a build are dropped and the rest renormalized.
 *
 * `geometry` was added with #255 and takes its share from the four declaration
 * metrics, because it is the only one that looks at the rendered page. The
 * others can all report a build as new when it is a repeat: two unlike tuples
 * put the mark top-left, the hero on the left and a data column down the right
 * on both 2026-08-23 and 2026-08-30. It sits just under `composition` — a
 * repeated silhouette is the failure, and the tuple is still what an agent can
 * steer directly.
 */
export const WEIGHTS = {
  composition: 0.28,
  geometry: 0.22,
  hue: 0.16,
  lane: 0.16,
  shell: 0.12,
  fidelity: 0.06,
}

/**
 * Count axes whose values differ. A value missing on either side counts as a
 * difference: an Art Director that omitted an axis did not match it.
 * @param {Record<string, string>} a
 * @param {Record<string, string>} b
 * @returns {number} 0 to AXIS_NAMES.length
 */
export function hammingTuple(a, b) {
  return AXIS_NAMES.reduce((n, axis) => n + (a?.[axis] === b?.[axis] ? 0 : 1), 0)
}

/**
 * Distance from the nearest composition in the window.
 * History entries without a composition are skipped: they cannot be compared,
 * and treating them as maximally distant would inflate the score of a build
 * whose only neighbours are legacy.
 * @param {Record<string, string>|null} current
 * @param {Array<{date?: string, composition?: Record<string, string>|null}>} history
 * @returns {{ raw: number|null, score: number|null, nearest: string|null, compared: number }}
 */
export function compositionNovelty(current, history = []) {
  if (!current) return { raw: null, score: null, nearest: null, compared: 0 }
  const usable = history.filter((h) => h?.composition)
  if (usable.length === 0) return { raw: null, score: null, nearest: null, compared: 0 }

  let best = Number.POSITIVE_INFINITY
  let nearest = null
  for (const h of usable) {
    const d = hammingTuple(current, h.composition)
    if (d < best) {
      best = d
      nearest = h.date ?? null
    }
  }
  return { raw: best, score: best / AXIS_NAMES.length, nearest, compared: usable.length }
}

/**
 * Circular distance from the nearest primary hue in the window, in degrees.
 * 180° apart is the most distant two hues can be, so that is the ceiling.
 * @param {number|null} current
 * @param {Array<{date?: string, hue?: number|null}>} history
 * @returns {{ raw: number|null, score: number|null, nearest: string|null, compared: number }}
 */
export function hueNovelty(current, history = []) {
  if (typeof current !== 'number' || Number.isNaN(current)) {
    return { raw: null, score: null, nearest: null, compared: 0 }
  }
  const usable = history.filter((h) => typeof h?.hue === 'number' && !Number.isNaN(h.hue))
  if (usable.length === 0) return { raw: null, score: null, nearest: null, compared: 0 }

  let best = Number.POSITIVE_INFINITY
  let nearest = null
  for (const h of usable) {
    const d = hueDistance(current, h.hue)
    if (d < best) {
      best = d
      nearest = h.date ?? null
    }
  }
  return { raw: best, score: best / 180, nearest, compared: usable.length }
}

/**
 * Builds since this lane last ran. A lane absent from the window scores 1.
 * Yesterday's lane scores 0.
 * @param {string|null} current
 * @param {Array<{date?: string, lane?: string|null}>} history newest first
 * @returns {{ raw: number|null, score: number|null, lastSeen: string|null, compared: number }}
 */
export function laneNovelty(current, history = []) {
  if (!current) return { raw: null, score: null, lastSeen: null, compared: 0 }
  const usable = history.filter((h) => h?.lane)
  if (usable.length === 0) return { raw: null, score: null, lastSeen: null, compared: 0 }

  const idx = usable.findIndex((h) => h.lane === current)
  if (idx === -1) {
    return { raw: usable.length, score: 1, lastSeen: null, compared: usable.length }
  }
  return {
    raw: idx,
    score: idx / usable.length,
    lastSeen: usable[idx].date ?? null,
    compared: usable.length,
  }
}

/**
 * Shell posture plus the enumerated shell and header treatments, against the
 * nearest neighbour. Posture lives on the composition tuple, the shell
 * treatments on shell.json, the header placement on header.json, so this
 * reads all three. A build with no header.json — every archived build before
 * 2026-08-30 — contributes a null for placement, which the comparable-field
 * filter below drops rather than scoring as a match.
 * @param {{ posture?: string|null, shell?: Record<string, string>|null, header?: Record<string, string>|null }} current
 * @param {Array<{date?: string, posture?: string|null, shell?: Record<string, string>|null, header?: Record<string, string>|null}>} history
 * @returns {{ raw: number|null, score: number|null, nearest: string|null, compared: number }}
 */
export function shellNovelty(current, history = []) {
  const fieldsOf = (e) => [
    e?.posture ?? null,
    ...SHELL_FIELDS.map((f) => e?.shell?.[f] ?? null),
    ...HEADER_FIELDS.map((f) => e?.header?.[f] ?? null),
  ]
  const mine = fieldsOf(current)
  if (mine.every((v) => v === null)) return { raw: null, score: null, nearest: null, compared: 0 }

  const usable = history.filter((h) => fieldsOf(h).some((v) => v !== null))
  if (usable.length === 0) return { raw: null, score: null, nearest: null, compared: 0 }

  let best = Number.POSITIVE_INFINITY
  let bestTotal = 0
  let nearest = null
  for (const h of usable) {
    const theirs = fieldsOf(h)
    // Only fields one side actually declares are comparable. Counting
    // null-against-null as a match would let a legacy build carrying nothing
    // but a posture score 1/4 for a posture mismatch, when a posture
    // mismatch is the only thing there was to get wrong.
    const comparable = mine
      .map((v, i) => [v, theirs[i]])
      .filter(([a, b]) => a !== null || b !== null)
    if (comparable.length === 0) continue
    const d = comparable.reduce((n, [a, b]) => n + (a === b ? 0 : 1), 0)
    if (d / comparable.length < best / (bestTotal || 1) || bestTotal === 0) {
      best = d
      bestTotal = comparable.length
      nearest = h.date ?? null
    }
  }
  if (bestTotal === 0) return { raw: null, score: null, nearest: null, compared: 0 }
  return { raw: best, score: best / bestTotal, nearest, compared: usable.length }
}

/**
 * Did the build hit the floors the Art Director declared?
 *
 * Unlike the other four metrics this one is not a novelty score: it is the
 * fraction of declared numeric floors the measured render actually cleared.
 * It returns null whenever measurements are absent, which today is always —
 * MEASURABLES is parsed but never persisted, and the screenshot critic emits
 * prose rather than numbers. Wiring those two up is what turns this on.
 *
 * @param {{canvas_utilization_min?: number|null, color_coverage_min?: number|null}|null} declared
 * @param {{canvas_utilization?: number|null, color_coverage?: number|null}|null} measured
 * @returns {{ raw: number|null, score: number|null, checks: Array<{name: string, floor: number, actual: number, met: boolean}> }}
 */
export function fidelity(declared, measured) {
  const pairs = [
    ['canvas_utilization', declared?.canvas_utilization_min, measured?.canvas_utilization],
    ['color_coverage', declared?.color_coverage_min, measured?.color_coverage],
  ]
  const checks = []
  for (const [name, floor, actual] of pairs) {
    if (typeof floor !== 'number' || typeof actual !== 'number') continue
    checks.push({ name, floor, actual, met: actual >= floor })
  }
  if (checks.length === 0) return { raw: null, score: null, checks: [] }
  const met = checks.filter((c) => c.met).length
  return { raw: met, score: met / checks.length, checks }
}

/**
 * Weighted mean over the metrics that produced a score. Metrics scoring null
 * are dropped and the remaining weights renormalized, so an early build with
 * no history still gets a composite from whatever it could compute.
 * @param {Record<string, {score: number|null}>} metrics
 * @returns {number|null}
 */
export function composite(metrics) {
  let sum = 0
  let weight = 0
  for (const [key, w] of Object.entries(WEIGHTS)) {
    const score = metrics[key]?.score
    if (typeof score !== 'number' || Number.isNaN(score)) continue
    sum += score * w
    weight += w
  }
  return weight === 0 ? null : sum / weight
}

/**
 * Compute the whole index for one build.
 *
 * @param {object} build
 * @param {string} build.date
 * @param {Record<string, string>|null} [build.composition]
 * @param {number|null} [build.hue] primary_hue.h from color-scheme.json
 * @param {string|null} [build.lane] laneId from lane.json
 * @param {Record<string, string>|null} [build.shell] shell.json
 * @param {Record<string, string>|null} [build.header] header.json
 * @param {object|null} [build.fingerprint] fingerprint.json, the rendered silhouette
 * @param {object|null} [build.declared] parsed MEASURABLES
 * @param {object|null} [build.measured] measured render values, absent today
 * @param {Array<object>} history same shape, newest first, trimmed to WINDOW
 * @returns {object} the uniqueness.json payload
 */
export function computeUniqueness(build, history = []) {
  const window = history.slice(0, WINDOW)
  const asShell = (b) => ({
    posture: b?.composition?.shell_posture ?? null,
    shell: b?.shell ?? null,
    header: b?.header ?? null,
  })

  const metrics = {
    composition: compositionNovelty(build?.composition ?? null, window),
    hue: hueNovelty(build?.hue ?? null, window),
    lane: laneNovelty(build?.lane ?? null, window),
    shell: shellNovelty(
      asShell(build),
      window.map((h) => ({ date: h.date, ...asShell(h) }))
    ),
    geometry: geometryNovelty(build?.fingerprint ?? null, window),
    fidelity: fidelity(build?.declared ?? null, build?.measured ?? null),
  }

  return {
    date: build?.date ?? null,
    window: window.length,
    metrics,
    composite: composite(metrics),
    version: 2,
  }
}

/**
 * Render the previous build's index as a prompt section for the Art Director.
 *
 * This is repetition feedback that costs nothing and needs no owner rating: it
 * names the specific day that was repeated and on which axis, which is more
 * actionable than a score. Returns '' when there is nothing to say, so the
 * caller can push it unconditionally.
 *
 * @param {object|null} index a uniqueness.json payload
 * @returns {string}
 */
export function formatUniquenessForPrompt(index) {
  if (!index || index.composite === null || index.window === 0) return ''

  const pct = Math.round(index.composite * 100)
  const lines = [
    '## Repetition Check (previous build)',
    '',
    `The build before this one scored ${pct}/100 for uniqueness against the ${index.window} builds before it. This is measured, not an opinion: it compares the composition tuple, the primary hue, the aesthetic lane, the shell, and the silhouette the page actually rendered against their nearest neighbour in that window.`,
    '',
  ]

  const m = index.metrics ?? {}
  const notes = []
  if (m.composition?.raw === 0 && m.composition?.nearest) {
    notes.push(
      `- Composition was an EXACT repeat of ${m.composition.nearest}. All ${AXIS_NAMES.length} axes matched. Do not land on that tuple again.`
    )
  } else if (typeof m.composition?.raw === 'number' && m.composition.raw <= 2) {
    notes.push(
      `- Composition differed from ${m.composition.nearest} on only ${m.composition.raw} of ${AXIS_NAMES.length} axes. Move more than one axis today.`
    )
  }
  if (typeof m.hue?.raw === 'number' && m.hue.raw < HUE_NEAR_REPEAT) {
    notes.push(
      `- Primary hue sat ${Math.round(m.hue.raw)}° from ${m.hue.nearest}. Under ${HUE_NEAR_REPEAT}° reads as the same color. Pick a hue at least ${HUE_ASK_FOR_DISTANCE}° away from the recent window.`
    )
  }
  if (m.lane?.raw === 0 && m.lane?.lastSeen) {
    notes.push(
      `- The aesthetic lane repeated ${m.lane.lastSeen} back to back. Choose another lane.`
    )
  }
  if (m.shell?.raw === 0 && m.shell?.nearest) {
    notes.push(
      `- Shell posture and treatment were identical to ${m.shell.nearest}. Change the posture, the lockup, or the ground strategy.`
    )
  }
  if (typeof m.geometry?.raw === 'number' && m.geometry.raw < 0.35 && m.geometry.nearest) {
    notes.push(
      `- The rendered silhouette sat ${Math.round(m.geometry.raw * 100)}/100 from ${m.geometry.nearest}: the headline, the nav, the mark and the first sections landed in close to the same places on the page. This is measured off the built page, not off the tuple, so a fresh tuple that puts the hero where yesterday's put it still lands here. Move something a visitor would see move.`
    )
  }

  if (notes.length === 0) {
    lines.push('No axis repeated closely. Keep the spread.')
  } else {
    lines.push('What repeated:', '', ...notes)
  }
  return lines.join('\n')
}
