/**
 * The harness's temp root is the only checkout a swarm test may touch (#221).
 *
 * Every path the swarm reads or writes derives from its `root` option, and
 * the phases under scripts/pipeline/ take it from the run state. A phase that
 * fell back to the repo's own root would write tonight's preset, routes or og
 * card into the working tree the tests run from. This runs the real swarm
 * twice, once to a shipped night and once to a rollback, and compares the
 * repo's app/, elements/ and public/ before and after: every file's size and
 * mtime, and the content hash of everything outside public/.
 */
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it, vi } from 'vitest'
import { mockFactories as m, runSwarm } from './swarm-harness.js'

vi.mock('../../scripts/utils/claude-cli.js', (o) => m['scripts/utils/claude-cli.js'](o))
vi.mock('../../scripts/utils/vision-router.js', (o) => m['scripts/utils/vision-router.js'](o))
vi.mock('../../scripts/utils/build-validator.js', (o) => m['scripts/utils/build-validator.js'](o))
vi.mock('../../scripts/utils/snapshot.js', (o) => m['scripts/utils/snapshot.js'](o))
vi.mock('../../scripts/utils/surface-gate.js', (o) => m['scripts/utils/surface-gate.js'](o))
vi.mock('../../scripts/utils/copy-gate.js', (o) => m['scripts/utils/copy-gate.js'](o))
vi.mock('../../scripts/utils/archiver.js', (o) => m['scripts/utils/archiver.js'](o))
vi.mock('../../scripts/seal-archive.js', (o) => m['scripts/seal-archive.js'](o))
vi.mock('../../scripts/utils/file-manager.js', (o) => m['scripts/utils/file-manager.js'](o))
vi.mock('node:child_process', (o) => m['node:child_process'](o))

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const WATCHED = ['app', 'elements', 'public']

/**
 * Every file under the watched directories: size and mtime, plus a content
 * hash outside public/ (which holds a copy of every archived night and is
 * compared by size and mtime alone).
 * @returns {Map<string, string>}
 */
function fingerprintRepo() {
  const out = new Map()
  const walk = (rel) => {
    for (const entry of readdirSync(path.join(REPO, rel), { withFileTypes: true })) {
      const next = `${rel}/${entry.name}`
      if (entry.isDirectory()) {
        walk(next)
        continue
      }
      const abs = path.join(REPO, next)
      const { size, mtimeMs } = statSync(abs)
      const hash = next.startsWith('public/')
        ? ''
        : createHash('sha1').update(readFileSync(abs)).digest('hex')
      out.set(next, `${size}:${mtimeMs}:${hash}`)
    }
  }
  for (const dir of WATCHED) walk(dir)
  return out
}

/** Paths added, removed or changed between two fingerprints, sorted. */
function differences(before, after) {
  const paths = new Set([...before.keys(), ...after.keys()])
  return [...paths].filter((p) => before.get(p) !== after.get(p)).sort()
}

describe('a swarm run leaves the real checkout alone', () => {
  it('a run that ships a night writes nothing under app/, elements/ or public/', async () => {
    const before = fingerprintRepo()
    const run = await runSwarm()

    expect(run.error).toBeNull()
    expect(run.fakes.archive).toHaveLength(1)
    expect(run.root).not.toBe(REPO)
    expect(differences(before, fingerprintRepo())).toEqual([])
  })

  it('a run that rolls back writes nothing under app/, elements/ or public/', async () => {
    const before = fingerprintRepo()
    const run = await runSwarm({
      // Thrown after the Art Director's files and the mockup are on disk.
      beforeRun: (root) => {
        const file = path.join(root, 'scripts', 'prompts', 'react-engineer.md')
        writeFileSync(file, readFileSync(file, 'utf8').replaceAll('{{GATES}}', ''))
      },
    })

    expect(run.error?.message).toBe('react-engineer.md is missing its {{GATES}} placeholder')
    expect(run.fakes.restore).toHaveLength(1)
    expect(differences(before, fingerprintRepo())).toEqual([])
  })
})
