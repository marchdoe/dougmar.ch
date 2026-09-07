/**
 * NEEDS-HUMAN and SHIPPED-WITH-FAULTS findings for the day's rating issue.
 *
 * `design-agents.js` writes a `{ critic: 'surface-gate', verdict:
 * 'NEEDS-HUMAN', feedback }` entry into `verdicts.json` whenever an authored
 * route outside `MUTABLE_FILES` (`/work`, `/experiments`) fails the surface
 * gate — no agent owns those files, so nothing can act on the finding.
 * Nothing read that entry (#468): it shipped to `archive/<date>/build-<id>/`
 * and sat there. This module reads it back and turns it into a section for
 * the nightly rating issue, so a person actually sees it.
 *
 * The same gap existed for a final REVISE after a repair round (#467):
 * `design-agents.js` writes a `{ critic: 'ship-gate', verdict:
 * 'SHIPPED-WITH-FAULTS', feedback }` entry when the build still fails its
 * last critique and ships anyway, and this module surfaces that entry the
 * same way.
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pickBuild } from './archive-record.js'

/**
 * Verdict entries of one kind from the day's shipped build, or `[]` when
 * there is no build, no `verdicts.json`, or nothing of that verdict.
 * @param {string} archiveDir e.g. `archive`
 * @param {string} date `YYYY-MM-DD`
 * @param {string} verdict e.g. `NEEDS-HUMAN`
 * @returns {Array<{critic: string, verdict: string, feedback: string}>}
 */
function readVerdictEntries(archiveDir, date, verdict) {
  const { buildDir } = pickBuild(path.join(archiveDir, date))
  if (!buildDir) return []

  const verdictsPath = path.join(buildDir, 'verdicts.json')
  if (!existsSync(verdictsPath)) return []

  let verdicts
  try {
    verdicts = JSON.parse(readFileSync(verdictsPath, 'utf8'))
  } catch {
    return []
  }

  return (Array.isArray(verdicts) ? verdicts : []).filter((v) => v?.verdict === verdict)
}

/**
 * The NEEDS-HUMAN verdicts from the day's shipped build.
 * @param {string} archiveDir e.g. `archive`
 * @param {string} date `YYYY-MM-DD`
 * @returns {Array<{critic: string, verdict: string, feedback: string}>}
 */
export function readNeedsHumanEntries(archiveDir, date) {
  return readVerdictEntries(archiveDir, date, 'NEEDS-HUMAN')
}

/**
 * The SHIPPED-WITH-FAULTS verdicts from the day's shipped build.
 * @param {string} archiveDir e.g. `archive`
 * @param {string} date `YYYY-MM-DD`
 * @returns {Array<{critic: string, verdict: string, feedback: string}>}
 */
export function readShippedWithFaultsEntries(archiveDir, date) {
  return readVerdictEntries(archiveDir, date, 'SHIPPED-WITH-FAULTS')
}

/**
 * The "Needs a human" section for the rating issue body, or `''` when there
 * is nothing to report — the caller appends this as-is, so an empty return
 * leaves the body unchanged.
 * @param {Array<{feedback: string}>} entries
 * @returns {string}
 */
export function buildNeedsHumanSection(entries) {
  const lines = (entries ?? []).map((e) => (e?.feedback ?? '').trim()).filter(Boolean)
  if (!lines.length) return ''

  return [
    '## Needs a human',
    '',
    "These routes are outside the agents' ownership and will be reported again every night until a person fixes them.",
    '',
    ...lines,
  ].join('\n')
}

/**
 * The "Shipped with faults" section for the rating issue body, or `''` when
 * there is nothing to report.
 * @param {Array<{feedback: string}>} entries
 * @returns {string}
 */
export function buildShippedWithFaultsSection(entries) {
  const lines = (entries ?? []).map((e) => (e?.feedback ?? '').trim()).filter(Boolean)
  if (!lines.length) return ''

  return [
    '## Shipped with faults',
    '',
    'The final critique still found a fault after the last repair round. It shipped anyway.',
    '',
    ...lines,
  ].join('\n')
}
