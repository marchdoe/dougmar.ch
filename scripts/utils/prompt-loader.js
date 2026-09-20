/**
 * The one door a prompt file comes through on its way to a model.
 *
 * The markdown under `scripts/prompts/` names the phone width as
 * `{{NARROW_PX}}`, and the number is filled in here from
 * `elements/chassis/viewports.js`, the same constant the ramp, the gates and
 * the captures read. A prompt read with a bare `readFile` would send the
 * token to the model unfilled, so every reader goes through `loadPrompt` or
 * `loadPromptSync`: `scripts/design-agents.js`, `engineer-patch.js` for the
 * repair brief, and `select-lane.js` for the lanes.
 *
 * `{{DATA_BOUNDARY_RULE}}` is filled here too, from `data-boundary-rule.md`.
 *
 * The other placeholders (`{{GATES}}`, `{{CHASSIS_RENDER_FACTS}}` and the
 * rest) are still filled by their own `.replace` where each prompt is
 * assembled. They are generated blocks with one owner each; this is a single
 * number that many files quote.
 *
 * @module
 */

import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { NARROW_VIEWPORT } from '../../elements/chassis/viewports.js'

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const PROMPTS_REL = path.join('scripts', 'prompts')

/** The token a prompt writes where it means the phone width in CSS pixels. */
export const NARROW_PX_TOKEN = '{{NARROW_PX}}'

/**
 * Replace every `{{NARROW_PX}}` with the phone width. Any other `{{TOKEN}}`
 * is left for whoever owns it.
 * @param {string} text
 * @param {{ narrowPx?: number }} [options] defaults to `NARROW_VIEWPORT.width`
 * @returns {string}
 */
export function fillViewportTokens(text, { narrowPx = NARROW_VIEWPORT.width } = {}) {
  return text.replaceAll(NARROW_PX_TOKEN, String(narrowPx))
}

/**
 * The token a prompt writes where the third-party data rule belongs. The rule
 * is one paragraph in `data-boundary-rule.md`, shared by every agent that is
 * handed text a stranger wrote, so it is worded once (see
 * `scripts/utils/data-boundary.js`).
 */
export const DATA_BOUNDARY_RULE_TOKEN = '{{DATA_BOUNDARY_RULE}}'
const DATA_BOUNDARY_RULE_REL = 'data-boundary-rule.md'

/**
 * Replace every `{{DATA_BOUNDARY_RULE}}` with the rule text.
 * @param {string} text
 * @param {string} rule the contents of `data-boundary-rule.md`
 * @returns {string}
 */
export function fillDataBoundaryRule(text, rule) {
  return text.replaceAll(DATA_BOUNDARY_RULE_TOKEN, rule.trim())
}

/**
 * Read a prompt file with its viewport tokens and the data boundary rule filled.
 * @param {string} rel path under `scripts/prompts/`, e.g. `art-director.md`
 *   or `impeccable/reference/brand.md`
 * @param {{ root?: string }} [options] the checkout to read from
 * @returns {Promise<string>}
 */
export async function loadPrompt(rel, { root = REPO_ROOT } = {}) {
  const text = fillViewportTokens(await readFile(path.join(root, PROMPTS_REL, rel), 'utf8'))
  if (!text.includes(DATA_BOUNDARY_RULE_TOKEN)) return text
  return fillDataBoundaryRule(
    text,
    await readFile(path.join(root, PROMPTS_REL, DATA_BOUNDARY_RULE_REL), 'utf8')
  )
}

/**
 * {@link loadPrompt} for the callers that read synchronously.
 * @param {string} rel
 * @param {{ root?: string }} [options]
 * @returns {string}
 */
export function loadPromptSync(rel, { root = REPO_ROOT } = {}) {
  const text = fillViewportTokens(readFileSync(path.join(root, PROMPTS_REL, rel), 'utf8'))
  if (!text.includes(DATA_BOUNDARY_RULE_TOKEN)) return text
  return fillDataBoundaryRule(
    text,
    readFileSync(path.join(root, PROMPTS_REL, DATA_BOUNDARY_RULE_REL), 'utf8')
  )
}
