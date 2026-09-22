/**
 * A repair is a patch (#432, ADR 0001).
 *
 * The Phase 5 repair and the post-critic revision used to hand the React
 * Engineer its whole original task plus the error, and every reply was a
 * regeneration of 17 to 32 files that traded the error it was given for a
 * new one. Now the engineer gets a brief: the files it owns on disk, the
 * error report verbatim, and the instruction to return only what must
 * change. The orchestrator merges the reply over what is on disk.
 *
 * Pure where it can be: `renderRepairBrief` and `mergeEngineerPatch` touch
 * nothing; `readOwnedFiles` and `deleteFiles` are the two that reach disk.
 */

import { readFile, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { ROOT, validateWritePath } from './file-manager.js'
import { loadPrompt } from './prompt-loader.js'
import { ORCHESTRATOR_FILES } from './site-context.js'

const TEMPLATE_NAME = 'react-engineer-repair.md'
const TEMPLATE_REL = `scripts/prompts/${TEMPLATE_NAME}`

/**
 * The paths the engineer owns this run: everything written so far that is
 * neither the Art Director's preset nor an orchestrator file.
 * @param {Iterable<string>} writtenPaths
 * @param {Record<string, string>} fileOwnership path to owning agent
 * @returns {string[]}
 */
export function engineerOwnedPaths(writtenPaths, fileOwnership) {
  return [...writtenPaths].filter(
    (p) => fileOwnership[p] !== 'art-director' && !ORCHESTRATOR_FILES.includes(p)
  )
}

/**
 * The engineer's files as they stand on disk, in the order they were first
 * written. A path written earlier and since deleted is skipped.
 * @param {Iterable<string>} writtenPaths
 * @param {Record<string, string>} fileOwnership
 * @param {{ root?: string }} [options]
 * @returns {Promise<Array<{ path: string, content: string }>>}
 */
export async function readOwnedFiles(writtenPaths, fileOwnership, { root = ROOT } = {}) {
  const owned = []
  for (const rel of engineerOwnedPaths(writtenPaths, fileOwnership)) {
    const abs = path.join(root, rel)
    if (!existsSync(abs)) continue
    owned.push({ path: rel, content: await readFile(abs, 'utf8') })
  }
  return owned
}

/**
 * @param {{ root?: string }} [options]
 * @returns {Promise<string>} the brief template with its two placeholders
 */
export async function loadRepairBriefTemplate({ root = ROOT } = {}) {
  const template = await loadPrompt(TEMPLATE_NAME, { root })
  for (const placeholder of ['{{FILES}}', '{{ERRORS}}', '{{PRESET}}']) {
    if (!template.includes(placeholder)) {
      throw new Error(`${TEMPLATE_REL} is missing its ${placeholder} placeholder`)
    }
  }
  return template
}

/**
 * The user prompt for a repair or revision call.
 * @param {string} template from {@link loadRepairBriefTemplate}
 * @param {{ owned: Array<{ path: string, content: string }>, errors: string, preset?: string }} params
 *   `errors` is the report verbatim: a build error, or the critic's feedback
 *   with the measured faults. `preset` is `elements/preset.ts` as written
 *   this run, printed read-only (#447) — the critic's feedback is often
 *   about fidelity to tokens the owned-files listing never carries, since
 *   the engineer does not own that file.
 * @returns {string}
 */
export function renderRepairBrief(template, { owned, errors, preset }) {
  // The engineer runs with no tools and one turn, so the brief is the only
  // way it can see a file it is not rewriting. Sizes alone left it guessing
  // the props of sibling components three attempts running (#460).
  const files = owned.length
    ? owned
        .map((f) => `--- ${f.path} ---\n${f.content.replace(/\n$/, '')}\n--- end ${f.path} ---`)
        .join('\n\n')
    : '(none written yet)'
  return template
    .replace('{{FILES}}', files)
    .replace('{{PRESET}}', (preset ?? '').trim() || '(not available)')
    .replace('{{ERRORS}}', errors.trim())
}

/**
 * @typedef {object} MergedPatch
 * @property {Array<{ path: string, content: string }>} files the merged set:
 *   what is on disk after the patch is applied, owned order first, new files
 *   after
 * @property {Array<{ path: string, content: string }>} writes reply files to write
 * @property {string[]} deletes owned paths the reply emptied
 * @property {string[]} ignoredDeletes emptied paths that were not owned;
 *   nothing happens to them
 */

/**
 * Merge a patch reply over the owned files.
 *
 * A non-empty reply file replaces the owned file at that path or adds a new
 * one. An empty reply file deletes the owned file at that path; an empty
 * block for a path the engineer does not own this run is ignored, so a
 * reply cannot reach past its own files. Everything else stays.
 *
 * @param {Array<{ path: string, content: string }>} owned
 * @param {Array<{ path: string, content: string }>} reply
 * @returns {MergedPatch}
 */
export function mergeEngineerPatch(owned, reply) {
  const ownedPaths = new Set(owned.map((f) => f.path))
  const writes = reply.filter((f) => f.content !== '')
  const emptied = reply.filter((f) => f.content === '').map((f) => f.path)
  const deletes = emptied.filter((p) => ownedPaths.has(p))
  const ignoredDeletes = emptied.filter((p) => !ownedPaths.has(p))

  const byPath = new Map(owned.map((f) => [f.path, f]))
  for (const p of deletes) byPath.delete(p)
  for (const f of writes) byPath.set(f.path, f)

  return { files: [...byPath.values()], writes, deletes, ignoredDeletes }
}

/**
 * Delete the files a patch emptied. Every path goes through the same
 * allowlist as a write: a delete outside it throws, like a write would.
 * @param {string[]} relPaths
 * @param {{ root?: string }} [options]
 * @returns {Promise<string[]>} the normalized paths removed
 */
export async function deleteFiles(relPaths, { root = ROOT, backup } = {}) {
  const removed = []
  for (const rel of relPaths) {
    const normalized = validateWritePath(rel)
    const abs = path.resolve(root, normalized)
    if (!existsSync(abs)) continue
    // A deleted file the run did not create must come back on rollback, so
    // it is recorded the way writeFiles records an overwrite (#432).
    if (backup && !backup.has(normalized)) backup.set(normalized, await readFile(abs, 'utf8'))
    await unlink(abs)
    console.log(`  deleted: ${normalized}`)
    removed.push(normalized)
  }
  return removed
}
