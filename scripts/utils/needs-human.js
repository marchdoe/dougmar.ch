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
 *
 * A final re-judge that never reached the SDK vision channel — a truncated
 * SDK reply, a fallen-back text-only critic — is neither of those (#486):
 * `design-agents.js` writes `{ critic: 'screenshot-critic', round: 'final',
 * verdict: 'UNVERIFIED', channel, feedback }` for it, and this module prints
 * a plain one-line note instead of the faults section — the build was never
 * re-seen, so nothing about it was confirmed wrong.
 *
 * A surface gate that threw is the last case (#565): `design-agents.js` catches
 * it so the build can ship, and writes `{ critic: 'surface-gate', round,
 * verdict: 'GATE-FAILED', feedback }` for it. Nothing was measured, which
 * reads the same as a clean pass unless someone says so, and the last section
 * here does.
 *
 * Drift from the approved mockup that forced revisions and survived them
 * ships under `{ critic: 'mockup-fidelity', verdict: 'DRIFTED', feedback }`
 * (mockup-drift-gate.js), and is listed under "Drifted from the mockup".
 */

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { pickBuild } from './archive-record.js'
import { GATE_FAILED } from './gate-outcome.js'
import { DRIFTED_VERDICT } from './mockup-drift-gate.js'

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
 * The final round's UNVERIFIED verdict from the day's shipped build, or
 * `null` when there is no build, no `verdicts.json`, or the final re-judge
 * reached the SDK vision channel (see module doc, #486).
 * @param {string} archiveDir e.g. `archive`
 * @param {string} date `YYYY-MM-DD`
 * @returns {{critic: string, verdict: string, feedback: string, channel?: string}|null}
 */
export function readFinalCheckUnverifiedEntry(archiveDir, date) {
  const entries = readVerdictEntries(archiveDir, date, 'UNVERIFIED').filter(
    (v) => v?.round === 'final'
  )
  return entries.at(-1) ?? null
}

/**
 * The GATE-FAILED verdicts from the day's shipped build: one per surface-gate
 * round that threw.
 * @param {string} archiveDir e.g. `archive`
 * @param {string} date `YYYY-MM-DD`
 * @returns {Array<{critic: string, verdict: string, feedback: string}>}
 */
export function readGateFailedEntries(archiveDir, date) {
  return readVerdictEntries(archiveDir, date, GATE_FAILED)
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

/**
 * Human-readable reason for each channel a final re-judge can land on other
 * than `sdk-vision` (#486). Keyed by the `channel` vision-router.js reports
 * through `onChannel`.
 */
const UNVERIFIED_CHANNEL_REASONS = {
  'sdk-vision-truncated': 'its reply was cut off at the output cap',
  'cli-text-fallback': 'the vision call failed and the text-only fallback never saw it',
  'cli-text-no-key': 'no API key was available for image input',
  'cli-text-no-images': 'no screenshot reached the critic',
  'fixture-replay': 'a recorded fixture answered instead of a live critique',
  'call-failed': 'the critic could not be reached on any channel',
}

/**
 * The "Final check" section for the rating issue body, or `''` when there is
 * nothing to report. Printed instead of "Shipped with faults" when the final
 * re-judge after a repair round never reached the SDK vision channel: a
 * REVISE from a text-only fallback or a truncated reply is not a confirmed
 * fault, so it must not read like one.
 * @param {{channel?: string}|null} entry
 * @returns {string}
 */
export function buildFinalCheckSection(entry) {
  if (!entry) return ''
  const reason =
    UNVERIFIED_CHANNEL_REASONS[entry.channel] ??
    `it answered through ${entry.channel ?? 'an unrecorded channel'} instead of seeing the build`

  return ['## Final check', '', `Final check could not see the build (${reason}).`].join('\n')
}

/**
 * The "Surface gate did not run" section for the rating issue body, or `''`
 * when every round measured. The gate is non-blocking, so a build whose gate
 * threw still shipped; this is the only place that says it shipped unmeasured.
 * @param {Array<{feedback: string}>} entries
 * @returns {string}
 */
export function buildGateFailedSection(entries) {
  const lines = (entries ?? []).map((e) => (e?.feedback ?? '').trim()).filter(Boolean)
  if (!lines.length) return ''

  return [
    '## Surface gate did not run',
    '',
    'The gate threw, so this build shipped unmeasured. That reads the same as a clean pass, so it is listed here.',
    '',
    ...lines.map((line) => `- ${line}`),
  ].join('\n')
}

/**
 * The DRIFTED verdicts from the day's shipped build.
 * @param {string} archiveDir e.g. `archive`
 * @param {string} date `YYYY-MM-DD`
 * @returns {Array<{critic: string, verdict: string, feedback: string}>}
 */
export function readDriftedEntries(archiveDir, date) {
  return readVerdictEntries(archiveDir, date, DRIFTED_VERDICT)
}

/**
 * The "Drifted from the mockup" section for the rating issue body, or `''`
 * when the build held the mockup's hierarchy or the revisions restored it.
 * @param {Array<{feedback: string}>} entries
 * @returns {string}
 */
export function buildDriftedSection(entries) {
  const lines = (entries ?? []).map((e) => (e?.feedback ?? '').trim()).filter(Boolean)
  if (!lines.length) return ''

  return [
    '## Drifted from the mockup',
    '',
    'The revisions were told to restore these and did not. They do not block a night, so it shipped with them.',
    '',
    ...lines,
  ].join('\n')
}
