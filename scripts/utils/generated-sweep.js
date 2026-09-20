/**
 * The sweep of app/components/generated/ (#448).
 *
 * The React Engineer's invented components live in one directory of their
 * own. A night's routes import the ones that night needs; the next night's
 * routes may import none of them, and a file nothing imports is a fallow
 * finding the engineer did not write and cannot fix from a repair brief.
 * So after every engineer write and before the build, whatever in the
 * directory today's files do not import is deleted. Each deleted file goes
 * into the run's backup first, the way `deleteFiles` records a patch's
 * deletes, so the rollback at the end of a failed run puts it back.
 *
 * "Imports" is read off the source with a regex over `from '...'` and
 * `import('...')`, relative specifiers only, resolved against the importer's
 * directory with and without an extension. The importers are every `.ts` and
 * `.tsx` under app/routes/ and app/components/, the generated directory
 * included: a generated file imported only by another generated file stays
 * as long as that one does, and goes when it goes.
 *
 * The required files (Layout, Sidebar, the routes) are outside the directory
 * and are never candidates. The hand-written components beside it are not
 * touched either; this only ever deletes what it listed under generated/.
 */

import { readdirSync, readFileSync } from 'node:fs'
import { readFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { ROOT } from './file-manager.js'

export const GENERATED_DIR = 'app/components/generated'

/** Where an import of a generated file can come from. */
const IMPORTER_DIRS = ['app/routes', 'app/components']

const SOURCE_EXT = /\.tsx?$/

/** `from '...'` and `import('...')`, in either quote style. */
const IMPORT_RE = /(?:\bfrom\s*|\bimport\s*\(\s*)['"]([^'"]+)['"]/g

/**
 * Every `.ts`/`.tsx` under `dir`, recursively, as absolute paths. A missing
 * directory is an empty list.
 * @param {string} dir
 * @param {string[]} [out]
 * @returns {string[]}
 */
function listSources(dir, out = []) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) listSources(full, out)
    else if (SOURCE_EXT.test(entry.name)) out.push(full)
  }
  return out
}

/**
 * The relative specifiers a source file imports, static and dynamic.
 * @param {string} source
 * @returns {string[]}
 */
export function collectImports(source) {
  const out = []
  for (const match of source.matchAll(IMPORT_RE)) {
    if (match[1].startsWith('.')) out.push(match[1])
  }
  return out
}

/**
 * The generated file a specifier names, or null when it names none.
 * @param {string} importerAbs
 * @param {string} spec
 * @param {Set<string>} generated absolute paths
 * @returns {string|null}
 */
function resolveToGenerated(importerAbs, spec, generated) {
  const base = path.resolve(path.dirname(importerAbs), spec)
  for (const candidate of [
    base,
    `${base}.tsx`,
    `${base}.ts`,
    path.join(base, 'index.tsx'),
    path.join(base, 'index.ts'),
  ]) {
    if (generated.has(candidate)) return candidate
  }
  return null
}

/**
 * Delete every file under app/components/generated/ that nothing imports.
 *
 * @param {{ root?: string, backup?: Map<string, string|null> | Array<Map<string, string|null>> }} [options]
 *   `backup` receives the content of each removed file a map does not
 *   already know, so `restore()` brings it back on rollback. A path a map
 *   already holds (a file this run wrote over, or created) keeps its entry.
 *   Pass every map a rollback may restore from: a revision that fails to
 *   rebuild restores the passing snapshot, not the run's original backup.
 * @returns {Promise<{ kept: string[], removed: string[] }>} repo-relative
 *   paths, sorted
 */
export async function sweepGenerated({ root = ROOT, backup } = {}) {
  const toRel = (abs) => path.relative(root, abs).split(path.sep).join('/')
  const generated = new Set(listSources(path.join(root, GENERATED_DIR)))
  if (generated.size === 0) return { kept: [], removed: [] }

  const backups = Array.isArray(backup) ? backup : backup ? [backup] : []
  const kept = keptGenerated(importEdges(root, generated), generated)
  const removed = [...generated].filter((f) => !kept.has(f)).sort()
  for (const abs of removed) {
    const rel = toRel(abs)
    const lacking = backups.filter((b) => !b.has(rel))
    if (lacking.length > 0) {
      const source = await readFile(abs, 'utf8')
      for (const b of lacking) b.set(rel, source)
    }
    await unlink(abs)
  }

  return {
    kept: [...kept].map(toRel).sort(),
    removed: removed.map(toRel),
  }
}

/**
 * Every importer under {@link IMPORTER_DIRS} and the generated files it
 * imports. A file's import of itself is not an edge.
 * @param {string} root
 * @param {Set<string>} generated absolute paths
 * @returns {Map<string, Set<string>>} importer absolute path -> targets
 */
function importEdges(root, generated) {
  const edges = new Map()
  for (const dir of IMPORTER_DIRS) {
    for (const file of listSources(path.join(root, dir))) {
      if (edges.has(file)) continue
      const targets = new Set()
      for (const spec of collectImports(readFileSync(file, 'utf8'))) {
        const target = resolveToGenerated(file, spec, generated)
        if (target && target !== file) targets.add(target)
      }
      edges.set(file, targets)
    }
  }
  return edges
}

/**
 * The generated files something keeps alive: imported by a file outside the
 * directory, or by a kept generated file. Iterated to the fixpoint so a chain
 * hanging off nothing goes as a whole.
 * @param {Map<string, Set<string>>} edges from {@link importEdges}
 * @param {Set<string>} generated absolute paths
 * @returns {Set<string>}
 */
function keptGenerated(edges, generated) {
  const kept = new Set()
  let grew = true
  while (grew) {
    grew = false
    for (const [importer, targets] of edges) {
      if (generated.has(importer) && !kept.has(importer)) continue
      for (const target of targets) {
        if (kept.has(target)) continue
        kept.add(target)
        grew = true
      }
    }
  }
  return kept
}
