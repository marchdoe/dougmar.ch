/**
 * The line between the pipeline's own prompt text and text a stranger wrote.
 *
 * Signals come off the public internet (a Hacker News title, a Product Hunt
 * tagline, a headline, an awwwards og:title). Archive briefs are model output
 * from the night before, so an instruction that got through once repeats
 * itself. Both used to reach a prompt as if they were part of it. Now each
 * goes inside a tag whose name ends in a per-run random suffix, and the system
 * prompt says text inside such a tag is data (`prompts/data-boundary-rule.md`,
 * loaded through `{{DATA_BOUNDARY_RULE}}`).
 *
 * The suffix is what keeps a value from closing the tag early: the repo is
 * public, so the tag names are not secret, but the suffix is drawn at the start
 * of each run. A value is also scrubbed of anything shaped like one of these
 * tags, whatever its suffix, so the assembled prompt has exactly one open and
 * one close per block.
 *
 * @module
 */

import { randomBytes } from 'node:crypto'
import * as yaml from 'js-yaml'

/** The tag names a block can go under. The rule in the system prompt names the form, not this list. */
export const BOUNDARY_NAMES = ['signals', 'references', 'briefs']

/** Eight hex characters, the suffix every tag carries. */
export const BOUNDARY_ID_PATTERN = /^[0-9a-f]{8}$/

/**
 * A fresh per-run suffix. `runAgentSwarm` draws one and hands it to every
 * builder; a test passes a fixed one so a prompt snapshot stays byte for byte.
 * @returns {string} eight hex characters
 */
export function newBoundaryId() {
  return randomBytes(4).toString('hex')
}

const NAME_ALTERNATION = BOUNDARY_NAMES.join('|')

// Any open or close tag in the family, with any suffix at all. An attacker
// cannot know this run's suffix, but a lookalike with another one still
// muddies which tag is real, so all of them go.
const TAG_LOOKALIKE = new RegExp(`<\\s*/?\\s*(?:${NAME_ALTERNATION})-[\\w-]*\\s*>`, 'gi')

// Three or more backticks in a row is a code fence. One or two are inline code,
// which a real headline can carry.
const BACKTICK_RUN = /`{3,}/g

/**
 * Remove what could close or fake a boundary from a string.
 *
 * Runs to a fixed point: deleting a run of backticks or a tag can splice the
 * text on either side into a new one (`</sig` + backticks + `nals-x>`), and a
 * single pass would hand that back.
 *
 * @param {string} text
 * @param {{ fences?: boolean }} [options] `fences` also strips backtick runs;
 *   set it for a value that lands inside a fenced block
 * @returns {string}
 */
export function scrubUntrusted(text, { fences = false } = {}) {
  let out = String(text)
  for (;;) {
    let next = out.replace(TAG_LOOKALIKE, '')
    if (fences) next = next.replace(BACKTICK_RUN, '')
    if (next === out) return out
    out = next
  }
}

function scrubTree(value) {
  if (typeof value === 'string') return scrubUntrusted(value, { fences: true })
  if (Array.isArray(value)) return value.map(scrubTree)
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [scrubUntrusted(k, { fences: true }), scrubTree(v)])
    )
  }
  return value
}

/**
 * Serialise the day's signals as YAML that a value cannot break out of.
 * `yaml.dump` does the quoting and escaping (a `'`, a newline, a leading
 * `---`, non-ASCII all round-trip), and every string, key included, is scrubbed
 * of backtick runs and boundary-tag lookalikes first.
 * @param {Record<string, unknown>} signals
 * @returns {string} YAML, no trailing newline
 */
export function serialiseSignals(signals) {
  return yaml.dump(scrubTree(signals), { lineWidth: -1, noRefs: true, skipInvalid: true }).trimEnd()
}

/**
 * Put text a stranger or an earlier run wrote inside its boundary tag.
 * @param {string} name one of {@link BOUNDARY_NAMES}
 * @param {string} body
 * @param {string} id the run's suffix from {@link newBoundaryId}
 * @param {{ fences?: boolean }} [options] see {@link scrubUntrusted}
 * @returns {string}
 */
export function wrapAsData(name, body, id, options) {
  if (!BOUNDARY_NAMES.includes(name)) throw new Error(`unknown boundary name "${name}"`)
  if (!BOUNDARY_ID_PATTERN.test(id))
    throw new Error(`boundary id must be 8 hex characters: "${id}"`)
  return `<${name}-${id}>\n${scrubUntrusted(body, options)}\n</${name}-${id}>`
}
