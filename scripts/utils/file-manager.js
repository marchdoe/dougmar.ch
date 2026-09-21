import { readFile, writeFile, mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(__dirname, '../..')

// Allowlist: the ONLY directories where AI-generated code may be written.
// Any path outside these prefixes is rejected. This is the primary defense
// against a malicious or prompt-injected agent overwriting the pipeline,
// workflows, package.json, .env, or other sensitive files.
//
// app/components/ itself is not a prefix (#448). The components the engineer
// invents go under app/components/generated/, which fallow ignores and the
// nightly sweeps (generated-sweep.js); the hand-written components beside it
// (ArchiveMarkdown, RunStages, MobileFooter, SectionHead, ProjectRow,
// FeaturedProject, the panel) are out of the engineer's reach. One run
// overwrote FeaturedProject.tsx, which only /elements renders (#432).
//
// app/routes/ is not a prefix either (#625). The engineer owns four routes,
// named below; the rest (/work, /experiments, /elements, /archive, /how, the
// panel) are hand-written, the surface gate never walks three of them, and
// the nightly e2e suite measures all of them. A route the engineer cannot
// write is a route it cannot break.
export const ALLOWED_WRITE_PREFIXES = ['app/components/generated/']

// The two components under app/components/ the engineer still writes: the
// required shell files, on MUTABLE_FILES and REQUIRED_FILES. Listed here by
// hand because site-context.js imports this module; the file-manager tests
// check every engineer-owned component on MUTABLE_FILES is one of these.
export const ENGINEER_COMPONENT_FILES = ['app/components/Layout.tsx', 'app/components/Sidebar.tsx']
// The routes the engineer writes, as react-engineer.md lists them. __root.tsx
// is the orchestrator's (rendered from a template, on MUTABLE_FILES so a
// rollback restores it) and is allowed on the same terms as the presets.
export const ENGINEER_ROUTE_FILES = [
  'app/routes/index.tsx',
  'app/routes/about.tsx',
  'app/routes/work.$slug.tsx',
  'app/routes/og.tsx',
]

// Exact paths allowed for writes outside the prefix list. elements/ is
// deliberately NOT a prefix: elements/chassis/index.js
// are imported and executed by the pipeline itself (design-agents.js), so a
// prefix-level allow would let a prompt-injected agent plant code that runs
// with repo write access on the next nightly run. Only the two generated
// preset files are writable there.
export const ALLOWED_EXACT = new Set([
  'elements/preset.ts',
  'elements/chassis-preset.ts',
  'app/routes/__root.tsx',
  ...ENGINEER_COMPONENT_FILES,
  ...ENGINEER_ROUTE_FILES,
])

// Within allowed prefixes, these exact files are still forbidden.
// Protects generated files (routeTree.gen.ts) and content files that
// ship real hand-maintained data (projects, timeline).
export const FORBIDDEN_EXACT = new Set(['app/routeTree.gen.ts'])

export const FORBIDDEN_PREFIXES = [
  'app/content/', // projects.ts, timeline.ts — hand-maintained
  'app/server/', // server functions — hand-maintained
  'app/styles/', // panda css base styles
  'app/assets/', // static assets
]

/**
 * Normalize and validate a relative write path.
 * Returns the normalized path if allowed, throws otherwise.
 *
 * This is the enforcement point for every AI-generated write.
 * It defends against path traversal, lateral escapes into protected
 * directories, and writes to sensitive file categories.
 *
 * @param {string} relPath - relative path from ROOT
 * @returns {string} normalized relative path
 * @throws if the path is not in the allowlist or escapes ROOT
 */
export function validateWritePath(relPath) {
  if (typeof relPath !== 'string' || !relPath) {
    throw new Error(`Invalid write path: ${relPath}`)
  }

  // Normalize the relative path first (collapses ./, resolves ..).
  // POSIX separators in path.posix.normalize for cross-platform safety.
  const normalized = path.posix.normalize(relPath.replace(/\\/g, '/'))

  // Reject any path that still contains .. after normalization
  // (means it escapes the root).
  if (normalized.startsWith('..') || normalized.includes('/../') || normalized === '..') {
    throw new Error(`Path traversal rejected: ${relPath} → ${normalized}`)
  }

  // Reject absolute paths
  if (path.isAbsolute(normalized)) {
    throw new Error(`Absolute path rejected: ${relPath}`)
  }

  // Reject dotfile writes (e.g., .env, .github/, .npmrc)
  if (normalized.startsWith('.') || normalized.includes('/.')) {
    throw new Error(`Dotfile path rejected: ${relPath}`)
  }

  // Check forbidden-exact before allowlist (belt and suspenders)
  if (FORBIDDEN_EXACT.has(normalized)) {
    throw new Error(`Forbidden file write: ${normalized}`)
  }
  for (const prefix of FORBIDDEN_PREFIXES) {
    if (normalized.startsWith(prefix)) {
      throw new Error(`Forbidden directory write: ${normalized} (in ${prefix})`)
    }
  }

  // Must match allowlist
  const inAllowedPrefix = ALLOWED_WRITE_PREFIXES.some((prefix) => normalized.startsWith(prefix))
  const inAllowedExact = ALLOWED_EXACT.has(normalized)

  if (!inAllowedPrefix && !inAllowedExact) {
    throw new Error(
      `Path not in write allowlist: ${normalized}. ` +
        `Allowed prefixes: ${ALLOWED_WRITE_PREFIXES.join(', ')}; ` +
        `exact paths: ${[...ALLOWED_EXACT].join(', ')}`
    )
  }

  // Final check: resolved absolute path must stay inside ROOT
  const absPath = path.resolve(ROOT, normalized)
  if (!absPath.startsWith(ROOT + path.sep) && absPath !== ROOT) {
    throw new Error(`Resolved path escapes ROOT: ${relPath} → ${absPath}`)
  }

  return normalized
}

/**
 * Whether `validateWritePath` would accept this path, without throwing.
 *
 * Derived from the enforcer rather than restating its rules, so a caller that
 * asks "may I write this?" can never disagree with the function that decides.
 * A check that answered "yes" where the write then threw is how the whole of
 * 2026-09-20 was lost: the engineer's repair named
 * `app/components/MobileFooter.tsx`, one directory above the part of
 * `app/components/` it owns, and the throw travelled all the way out of the
 * run.
 *
 * @param {string} relPath relative path from ROOT
 * @returns {boolean}
 */
export function isWritablePath(relPath) {
  try {
    validateWritePath(relPath)
    return true
  } catch {
    return false
  }
}

/**
 * Read each file in filePaths. Returns Map<relativePath, content|null>.
 * null means the file did not exist at backup time.
 * @param {string[]} filePaths - relative paths from repo root
 * @param {{ root?: string }} [options] repo root to read under
 * @returns {Promise<Map<string, string|null>>}
 */
export async function backup(filePaths, { root = ROOT } = {}) {
  const map = new Map()
  for (const relPath of filePaths) {
    const absPath = path.join(root, relPath)
    if (existsSync(absPath)) {
      const content = await readFile(absPath, 'utf8')
      map.set(relPath, content)
    } else {
      map.set(relPath, null)
    }
  }
  return map
}

/**
 * Write an array of { path, content } objects to disk.
 * Every path is validated against the write allowlist — any rejected
 * path throws an error that aborts the whole write batch. The caller
 * is expected to restore from backup on failure.
 *
 * When `backup` is passed, any file this call is about to overwrite is
 * captured at write time if the map doesn't already have an entry for
 * it: existing content is read in before the write, a not-yet-existing
 * path is recorded as null (the same convention `backup()` uses). This
 * covers paths the engineer writes outside the caller's original
 * MUTABLE_FILES snapshot, so `restore()` and `cleanupOrphans()` stay
 * correct even for files never on that list. The swarm passes its
 * `originalBackup` map here (see scripts/design-agents.js) so a write
 * to an untracked file like app/components/generated/Ledger.tsx is captured
 * before it's clobbered, instead of being treated as a brand-new
 * orphan on rollback. Without a `backup` map, nothing changes.
 *
 * Returns the list of normalized paths that were written (for tracking
 * what needs cleanup on rollback, including files the AI may have
 * invented beyond the canonical mutable list).
 *
 * @param {{ path: string, content: string }[]} filesArray
 * @param {{ root?: string, backup?: Map<string, string|null> }} [options]
 * @returns {Promise<string[]>} normalized paths written
 */
export async function writeFiles(filesArray, { root = ROOT, backup } = {}) {
  const written = []
  for (const { path: relPath, content } of filesArray) {
    // validateWritePath throws on any violation — we let it propagate
    // so the caller restores from backup rather than silently skipping.
    const normalized = validateWritePath(relPath)

    const absPath = path.resolve(root, normalized)

    if (backup && !backup.has(normalized)) {
      if (existsSync(absPath)) {
        const existing = await readFile(absPath, 'utf8')
        backup.set(normalized, existing)
      } else {
        backup.set(normalized, null)
      }
    }

    const dir = path.dirname(absPath)
    await mkdir(dir, { recursive: true })
    await writeFile(absPath, content, 'utf8')
    console.log(`  wrote: ${normalized}`)
    written.push(normalized)
  }
  return written
}

/**
 * Restore files from a backup Map.
 * Files that were null in the backup (did not exist before) are deleted.
 * @param {Map<string, string|null>} backupMap
 * @param {{ root?: string }} [options] repo root to write under
 */
export async function restore(backupMap, { root = ROOT } = {}) {
  for (const [relPath, content] of backupMap.entries()) {
    const absPath = path.join(root, relPath)
    if (content === null) {
      // File didn't exist before — delete it if it now exists
      if (existsSync(absPath)) {
        await unlink(absPath)
        console.log(`  restored (deleted): ${relPath}`)
      }
    } else {
      await writeFile(absPath, content, 'utf8')
      console.log(`  restored: ${relPath}`)
    }
  }
}

/**
 * Delete any "orphan" files — paths written during the swarm that were
 * not in the original backup. The AI may invent new file paths beyond
 * the canonical MUTABLE_FILES list; if a later step fails, restore()
 * alone won't clean these up because they're not in the backup.
 *
 * Call this during rollback to ensure a clean slate.
 *
 * @param {Set<string>|string[]} writtenPaths - all paths written in this run
 * @param {Map<string, string|null>} backupMap - the original backup
 * @param {{ root?: string }} [options] repo root to delete under
 */
export async function cleanupOrphans(writtenPaths, backupMap, { root = ROOT } = {}) {
  const paths = writtenPaths instanceof Set ? writtenPaths : new Set(writtenPaths)
  for (const relPath of paths) {
    if (backupMap.has(relPath)) continue // covered by restore()
    const absPath = path.join(root, relPath)
    if (existsSync(absPath)) {
      try {
        await unlink(absPath)
        console.log(`  orphan cleaned: ${relPath}`)
      } catch (err) {
        console.warn(`  orphan cleanup failed for ${relPath}: ${err.message}`)
      }
    }
  }
}
