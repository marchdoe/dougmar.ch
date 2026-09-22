import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { readRecentBuilds } from './recent-builds.js'
import { hashToRange } from './deterministic-hash.js'
import {
  AXIS_NAMES,
  COMPOSITION_AXES,
  densityForbidsHeroObject,
  describeAxisValue,
  isValidTuple,
} from './composition-grammar.js'

/**
 * Composition variance mandate — successor to layout-signature-mandate.js.
 *
 * The predecessor soft-forbade the last 3 *exact* four-key tuples. Against
 * the 5,760,000-tuple space of the composition grammar an exact repeat almost
 * never happens, so that mandate would have been dead weight: technically
 * enforced, never binding. Recency here is **per axis** instead — a value
 * used on any of the last 3 builds is discouraged for that axis alone. That
 * is the lever that bites, because it pushes each axis independently rather
 * than waiting for all ten to collide at once.
 *
 * It also seeds a date-derived suggestion tuple. Without one, an
 * unopinionated day resolves to the model's priors, which is exactly the
 * pull toward the familiar the grammar exists to break; with one, the day
 * starts somewhere specific and reproducible.
 *
 * Builds archived before the composition axes existed carry only four of
 * the keys, every build before #452 lacks `collapse`, and every
 * composition.json before #501 lacks `hero_object`. Those axes read as "no
 * history" rather than erroring, so the mandate degrades instead of breaking
 * on the existing archive.
 */

/** How many recent builds' values are discouraged, per axis. */
const FORBID_WINDOW = 3

/**
 * Read the shipped build's `composition.json` (or its predecessor,
 * `layout-signature.json`) for each of the last `lookbackDays` dates.
 *
 * @param {string} archiveDir
 * @param {number} lookbackDays
 * @returns {Array<{date: string, tuple: Record<string, string|null>}>} newest first
 */
export function extractRecentCompositions(archiveDir, lookbackDays) {
  // readRecentBuilds resolves each date to the build that SHIPPED.
  // Taking the newest build dir, as this did, reads designs the site
  // never wore — see scripts/utils/recent-builds.js.
  const recent = readRecentBuilds(archiveDir, { lookbackDays })

  const out = []
  for (const { date: dateDir, buildDir } of recent) {
    // composition.json is what Task 4 persists; layout-signature.json is the
    // predecessor artifact. Prefer the new one, fall back to the old, so the
    // history spans the changeover instead of restarting at it.
    const buildPath = buildDir
    const sigPath = [
      path.join(buildPath, 'composition.json'),
      path.join(buildPath, 'layout-signature.json'),
    ].find((p) => existsSync(p))
    if (!sigPath) continue

    try {
      const parsed = JSON.parse(readFileSync(sigPath, 'utf8'))
      const tuple = {}
      let any = false
      for (const axis of AXIS_NAMES) {
        const value = typeof parsed[axis] === 'string' ? parsed[axis].toLowerCase().trim() : null
        // Only values still in the vocabulary count as history. A retired
        // value shouldn't forbid anything — there is nothing to repeat.
        tuple[axis] = value && COMPOSITION_AXES[axis].includes(value) ? value : null
        if (tuple[axis]) any = true
      }
      if (any) out.push({ date: dateDir, tuple })
    } catch {
      /* malformed artifact — skip the build, keep the history */
    }
  }
  return out
}

/**
 * Pick a starting value for each axis from the date alone. Deterministic:
 * the same date always suggests the same tuple, so a re-run of a given day
 * reproduces it. Per-axis salt keeps the axes from moving in lockstep.
 *
 * @param {string} date - YYYY-MM-DD
 * @returns {Record<string, string>} a complete, valid tuple
 */
export function suggestTupleForDate(date) {
  const tuple = {}
  for (const axis of AXIS_NAMES) {
    const values = COMPOSITION_AXES[axis]
    tuple[axis] = values[hashToRange(`composition:${axis}:${date}`, 0, values.length - 1)]
  }
  // Each axis is seeded independently, so the two draws can land on the one
  // pair the grammar forbids — `density: sparse` with a `hero_object` that
  // needs room sparse doesn't have (#514). Re-seed hero_object off a
  // different salt rather than let a suggestion isValidTuple would reject
  // through the door it's supposed to guard.
  if (densityForbidsHeroObject(tuple.density, tuple.hero_object)) {
    const open = COMPOSITION_AXES.hero_object.filter((v) => v !== 'list' && v !== 'artifact')
    tuple.hero_object =
      open[hashToRange(`composition:hero_object:sparse-safe:${date}`, 0, open.length - 1)]
  }
  return tuple
}

/**
 * Per-axis recency plus a date-derived suggestion.
 *
 * The suggestion is nudged off discouraged values where the axis has one
 * available, so the two halves of the mandate don't contradict each other on
 * the first line the Art Director reads.
 *
 * @param {{archiveDir: string, date: string, lookbackDays?: number}} opts
 * @returns {{recent: object[], softForbidden: Record<string, string[]>, suggestion: Record<string, string>, rationale: string}}
 */
export function computeCompositionMandate({ archiveDir, date, lookbackDays = 7 }) {
  const recent = extractRecentCompositions(archiveDir, lookbackDays)
  const window = recent.slice(0, FORBID_WINDOW)

  /** @type {Record<string, string[]>} */
  const softForbidden = {}
  for (const axis of AXIS_NAMES) {
    const used = []
    for (const { tuple } of window) {
      if (tuple[axis] && !used.includes(tuple[axis])) used.push(tuple[axis])
    }
    softForbidden[axis] = used
  }

  const suggestion = suggestTupleForDate(date)
  for (const axis of AXIS_NAMES) {
    const forbidden = softForbidden[axis]
    if (!forbidden.includes(suggestion[axis])) continue
    const open = COMPOSITION_AXES[axis].filter((v) => !forbidden.includes(v))
    // Every value discouraged means the window covers the whole axis; leave
    // the suggestion alone rather than inventing one outside the vocabulary.
    if (open.length) {
      suggestion[axis] = open[hashToRange(`composition-nudge:${axis}:${date}`, 0, open.length - 1)]
    }
  }

  // The per-axis nudge above moves density and hero_object independently,
  // so it can reintroduce the density/hero_object pair suggestTupleForDate
  // already avoided (#514) — one axis nudges onto the forbidden combination
  // while the other sits still. Prefer moving hero_object; if the recency
  // window has already claimed every non-list/artifact value, fall back to
  // moving density off sparse instead.
  if (densityForbidsHeroObject(suggestion.density, suggestion.hero_object)) {
    const heroForbidden = new Set([...softForbidden.hero_object, 'list', 'artifact'])
    const openHero = COMPOSITION_AXES.hero_object.filter((v) => !heroForbidden.has(v))
    if (openHero.length) {
      suggestion.hero_object =
        openHero[
          hashToRange(`composition-nudge:hero_object:sparse-safe:${date}`, 0, openHero.length - 1)
        ]
    } else {
      const densityForbidden = new Set([...softForbidden.density, 'sparse'])
      const openDensity = COMPOSITION_AXES.density.filter((v) => !densityForbidden.has(v))
      if (openDensity.length) {
        suggestion.density =
          openDensity[
            hashToRange(`composition-nudge:density:sparse-safe:${date}`, 0, openDensity.length - 1)
          ]
      }
      // Both axes exhausted by the recency window plus this rule: leave the
      // pair as seeded rather than invent a value outside either vocabulary,
      // the same call the per-axis nudge above makes.
    }
  }

  const rationale = recent.length
    ? `Last ${recent.length} composition${recent.length === 1 ? '' : 's'}: ${recent
        .map(
          ({ date: d, tuple }) =>
            `${d}: ${AXIS_NAMES.filter((a) => tuple[a])
              .map((a) => `${a}=${tuple[a]}`)
              .join(' ')}`
        )
        .join(' | ')}`
    : 'No recent composition history available; every axis is open.'

  return { recent, softForbidden, suggestion, rationale }
}

/**
 * Render the mandate for prompt injection.
 *
 * With no history the block drops its avoid-clauses and carries only the
 * starting tuple. That case is the norm, not an edge: no build has ever
 * written a signature artifact — it shipped 2026-08-23, and the pipeline has
 * not run since 2026-07-30 — so the first three armed runs have nothing to
 * push away from. Suppressing the block there would leave exactly those runs
 * steered by the model's priors, which is the sameness this grammar exists
 * to break. An unusable mandate object still returns ''.
 *
 * @param {object} mandate - from computeCompositionMandate
 * @returns {string}
 */
export function formatCompositionMandateForPrompt(mandate) {
  if (!mandate?.suggestion || !isValidTuple(mandate.suggestion).valid) return ''

  if (!mandate.recent?.length) {
    return [
      '## Composition Mandate',
      '',
      "No recent composition history — every axis is open. These starting values are derived from today's date, so they are specific and reproducible rather than a default. Move any axis you have a reason to move; do not leave every axis where it landed because nothing pushed back.",
      '',
      ...AXIS_NAMES.map(
        (axis) =>
          `- **${axis}** — start from \`${mandate.suggestion[axis]}\`: ${describeAxisValue(axis, mandate.suggestion[axis])}`
      ),
    ].join('\n')
  }

  const axisLines = AXIS_NAMES.map((axis) => {
    const forbidden = mandate.softForbidden[axis]
    const avoid = forbidden.length ? `avoid \`${forbidden.join('`, `')}\`` : 'nothing to avoid'
    return `- **${axis}** — start from \`${mandate.suggestion[axis]}\` (${avoid})`
  })

  return [
    '## Composition Mandate',
    '',
    `Recency is tracked per axis, not per whole tuple: a value used on any of the last ${FORBID_WINDOW} builds is discouraged for that axis. The starting values below are derived from today's date — they are a specific place to begin, not an instruction.`,
    '',
    ...axisLines,
    '',
    `- **Rationale:** ${mandate.rationale}`,
    '',
    'Move any axis you have a reason to move, including onto a discouraged value — say why in your rationale, the same as for a recently-used hue. What you must not do is leave every axis sitting on the suggestion because nothing pushed back. Fit beats novelty; sameness beats neither.',
    '',
    `Today's starting point reads as: ${AXIS_NAMES.map((a) => describeAxisValue(a, mandate.suggestion[a])).join(' ')}`,
  ].join('\n')
}
