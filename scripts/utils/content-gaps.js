/**
 * The content fields that can be empty, read from the content files (#568).
 *
 * `react-engineer.md` declared `role: string` for the timeline and never said
 * the owner had left three of them `''`. The engineer wrote `{role}, {company}`,
 * and `/about` rendered ", iCapital" at 54px. The copy gate now catches the
 * result (`orphan-separator` in copy-gate.js); this module tells the engineer
 * before it writes the template, from the files themselves, so the list stays
 * true on the day the owner fills a field or empties another one.
 *
 * The content files are TypeScript that a plain script cannot import, and the
 * repo's other readers take fields out of the source with a regex. A regex
 * cannot tell an empty `role` from one that holds a value on the next line, so
 * this strips the types with Node's own `stripTypeScriptTypes` and reads the
 * exports as data. The files are hand-written data in this repo, which is why
 * running them is safe here; a file that needs an import at runtime is
 * reported as unreadable rather than guessed at.
 *
 * @module
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import * as nodeModule from 'node:module'
import path from 'node:path'
import { CONTENT_DIR } from './copy-gate.js'
import { ROOT } from './file-manager.js'

/** The token in `react-engineer.md` this module's text replaces. */
export const CONTENT_GAPS_TOKEN = '{{CONTENT_GAPS}}'

const isRecord = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)

/**
 * @typedef {object} ContentGap
 * @property {string} field how the engineer reaches it, e.g. `timeline[].role`
 * @property {number} empty entries where it is `''`
 * @property {number} absent entries where it is not there at all
 * @property {number} total entries in the collection
 */

/**
 * The collections in a set of exports: an array of records, or a single
 * record, which is a collection of one. Arrays of strings and functions are
 * not collections. A collection whose entries are all in a bigger one is
 * dropped, because `selectedWork` is `projects.filter(...)` and listing its
 * fields again would say everything twice.
 *
 * @param {Record<string, unknown>} exportsByName
 * @returns {Array<{ label: string, rows: Array<Record<string, unknown>> }>}
 */
function collectionsOf(exportsByName) {
  const found = []
  for (const [name, value] of Object.entries(exportsByName)) {
    if (Array.isArray(value) && value.length && value.every(isRecord)) {
      found.push({ label: `${name}[]`, rows: value })
    } else if (isRecord(value)) {
      found.push({ label: name, rows: [value] })
    }
  }
  found.sort((a, b) => b.rows.length - a.rows.length)
  const seen = new Set()
  return found.filter(({ rows }) => {
    const fresh = rows.some((r) => !seen.has(r))
    for (const r of rows) seen.add(r)
    return fresh
  })
}

/**
 * Every string field that is `''` or missing in at least one entry. A field
 * counts as a string field when some entry holds a string in it, so an
 * optional field that no entry sets is invisible, and so is a field that is
 * always populated. Fields with an empty string come first.
 *
 * @param {Record<string, unknown>} exportsByName the content modules' exports
 * @returns {ContentGap[]}
 */
export function findContentGaps(exportsByName) {
  const gaps = []
  for (const { label, rows } of collectionsOf(exportsByName)) {
    const keys = new Set(
      rows.flatMap((r) => Object.keys(r).filter((k) => typeof r[k] === 'string'))
    )
    for (const key of keys) {
      const empty = rows.filter((r) => r[key] === '').length
      const absent = rows.filter((r) => r[key] === undefined).length
      if (empty || absent) {
        gaps.push({ field: `${label}.${key}`, empty, absent, total: rows.length })
      }
    }
  }
  // An empty string is the trap: it is typed `string`, so nothing marks it.
  // A missing field is typed optional and the prompt's shapes already show `?`.
  return gaps.sort((a, b) => Number(b.empty > 0) - Number(a.empty > 0))
}

/**
 * One gap as a sentence fragment: `` `timeline[].role` is '' in 3 of 11 entries ``.
 *
 * @param {ContentGap} gap
 * @returns {string}
 */
function describeGap({ field, empty, absent, total }) {
  const of = (n) => (total === 1 ? '' : ` in ${n} of ${total} entries`)
  const parts = []
  if (empty) parts.push(`is ''${of(empty)}`)
  if (absent) parts.push(`is missing${of(absent).replace(' in ', ' from ')}`)
  return `\`${field}\` ${parts.join(' and ')}`
}

/**
 * The exports of every `app/content/*.ts` file, merged into one record, and
 * a line for each file that could not be read.
 *
 * @param {{ root?: string }} [opts]
 * @returns {Promise<{ exports: Record<string, unknown>, problems: string[] }>}
 */
export async function readContentExports({ root = ROOT } = {}) {
  const dir = path.join(root, CONTENT_DIR)
  const merged = {}
  const problems = []
  if (!existsSync(dir)) return { exports: merged, problems: [`${CONTENT_DIR} does not exist`] }
  for (const file of readdirSync(dir)
    .filter((f) => f.endsWith('.ts'))
    .sort()) {
    try {
      Object.assign(merged, await importTypeScript(readFileSync(path.join(dir, file), 'utf8')))
    } catch (err) {
      problems.push(`${CONTENT_DIR}/${file}: ${String(err?.message ?? err).split('\n')[0]}`)
    }
  }
  return { exports: merged, problems }
}

/**
 * Evaluate a data-only TypeScript module. Node warns once that
 * `stripTypeScriptTypes` is experimental; the warning goes to stderr and the
 * night's log, and nothing else.
 *
 * @param {string} source
 * @returns {Promise<Record<string, unknown>>}
 */
async function importTypeScript(source) {
  if (typeof nodeModule.stripTypeScriptTypes !== 'function') {
    throw new Error('this Node has no module.stripTypeScriptTypes')
  }
  const js = nodeModule.stripTypeScriptTypes(source)
  return { ...(await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)) }
}

/**
 * The block that replaces `{{CONTENT_GAPS}}` in the engineer's prompt. Always
 * says something: a list, or plainly that there is nothing to list, or which
 * file it could not read.
 *
 * @param {{ gaps: ContentGap[], problems?: string[] }} read
 * @returns {string}
 */
export function formatContentGapsForPrompt({ gaps, problems = [] }) {
  const lines = [
    'A content field can be empty, and an empty one must not leave its separator behind. ' +
      'Render a comma, a dot, a dash or a slash between two fields only when both sides have text; ' +
      'when a field is empty, leave it out along with its separator. ' +
      'The copy gate fails a heading or line of text that opens or closes on a separator. ' +
      `Read from \`${CONTENT_DIR}/*.ts\` when this prompt was assembled:`,
    '',
    ...(gaps.length
      ? gaps.map((g) => `- ${describeGap(g)}`)
      : [
          `- No string field in \`${CONTENT_DIR}/*.ts\` is empty or missing today. Write the templates this way anyway; the owner can empty one tomorrow.`,
        ]),
  ]
  for (const p of problems) {
    lines.push(`- Could not read ${p}. Treat every string field it holds as one that can be empty.`)
  }
  return lines.join('\n')
}

/**
 * Fill `{{CONTENT_GAPS}}` in the engineer's system prompt from the content
 * files under `root`. Throws when the prompt has no such token, so the
 * placeholder cannot be deleted from the markdown and go unnoticed.
 *
 * @param {string} prompt
 * @param {{ root?: string }} [opts]
 * @returns {Promise<string>}
 */
export async function fillContentGaps(prompt, { root = ROOT } = {}) {
  if (!prompt.includes(CONTENT_GAPS_TOKEN)) {
    throw new Error(`react-engineer.md is missing its ${CONTENT_GAPS_TOKEN} placeholder`)
  }
  const { exports, problems } = await readContentExports({ root })
  const text = formatContentGapsForPrompt({ gaps: findContentGaps(exports), problems })
  return prompt.replace(CONTENT_GAPS_TOKEN, () => text)
}
