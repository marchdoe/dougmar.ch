/**
 * Assembles the mockup-designer system prompt and measures it against a
 * budget (#508).
 *
 * The ceiling used to guard a CLI bug: 2.1.92 failed on system prompts near
 * 56KB. `.github/workflows/daily-redesign.yml` now pins 2.1.207, where that
 * regression does not reproduce (PR #69, 2026-07-12). What is left is a
 * budget, not a crash guard, the model reads the whole prompt every
 * revision round, so a bigger prompt costs more and competes for the
 * model's attention, but it will not fail outright.
 *
 * Pure and I/O-free so it can be measured in a test without a build: every
 * argument is text the caller already read from disk.
 *
 * @module
 */

/** The system prompt budget, in bytes (`text.length`). See module doc for what it guards. */
export const MOCKUP_DESIGNER_PROMPT_MAX = 96 * 1024

/**
 * Splice the day's lane into `raw` and append the brand-register
 * declaration, the reference docs, and the brand contract, in the order
 * production sends them to the model.
 *
 * @param {object} opts
 * @param {string} opts.raw mockup-designer.md, with the `<!-- SEED_ANCHOR -->` placeholder
 * @param {string} opts.laneBody the chosen lane's body (select-lane.js's `loadLanes()` output)
 * @param {string} opts.brandRegisterDeclaration
 * @param {string[]} opts.refs typography, color, spatial, plus `bolder.md` when the color story is committed or drenched
 * @param {string} opts.brandContract
 * @returns {{ text: string, bytes: number }} bytes is `text.length`, the same measure the caller's throw checks against `MOCKUP_DESIGNER_PROMPT_MAX`
 */
export function assembleMockupDesignerSystemPrompt({
  raw,
  laneBody,
  brandRegisterDeclaration,
  refs,
  brandContract,
}) {
  const text = [
    raw.replace('<!-- SEED_ANCHOR -->', laneBody),
    brandRegisterDeclaration,
    ...refs,
    brandContract,
  ].join('\n\n')
  return { text, bytes: text.length }
}
