/**
 * #740: the pipeline map notices when it goes stale (stale.js, run by CI with no
 * model call) and a local refresh edits only the stale nodes (refresh.js). The git
 * cases run against a throwaway repo in a tmpdir.
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  applyPatch,
  buildPrompt,
  parsePatch,
  refresh,
  refusal,
} from '../../scripts/pipeline-map/refresh.js'
import {
  globToRegExp,
  isNightlyOutput,
  NIGHTLY_OUTPUT,
  staleReport,
  toMarkdown,
} from '../../scripts/pipeline-map/stale.js'
import { localSources, readMap, validateMap } from '../../scripts/pipeline-map/validate.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const MAP = {
  title: 'fixture',
  branch: 'main @ 0000000',
  basis: '',
  kinds: { script: 'a script', state: 'a file' },
  nodes: [
    { id: 'a', label: 'A', kind: 'script', what: 'old a', source: ['scripts/pipeline/a.js'] },
    { id: 'b', label: 'B', kind: 'script', what: 'old b', source: ['scripts/utils/b.js'] },
    { id: 'c', label: 'C', kind: 'state', what: 'old c', source: ['elements/preset.ts'] },
    { id: 'd', label: 'D', kind: 'script', what: 'old d', source: ['scripts/utils/d.js'] },
  ],
  edges: [
    { id: 'ab', from: 'a', to: 'b', label: 'calls', when: 'always' },
    { id: 'cd', from: 'c', to: 'd', label: 'reads', when: 'always' },
  ],
  views: [{ id: 'root', title: 'All', nodeIds: ['a', 'b', 'c', 'd'], edges: ['ab', 'cd'] }],
}

let dir
const git = (...args) =>
  execFileSync(
    'git',
    ['-c', 'user.name=t', '-c', 'user.email=t@t', '-c', 'commit.gpgsign=false', ...args],
    {
      cwd: dir,
      encoding: 'utf8',
    }
  ).trim()
const put = (file, text) => {
  mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
  writeFileSync(path.join(dir, file), text)
}
const commit = (msg) => {
  git('add', '-A')
  git('commit', '-q', '-m', msg)
  return git('rev-parse', 'HEAD')
}
const mapPath = () => path.join(dir, 'docs/pipeline-map/map.json')

/** A repo whose first commit is the map's basis. */
function seed() {
  for (const f of [
    'scripts/pipeline/a.js',
    'scripts/utils/b.js',
    'elements/preset.ts',
    'scripts/utils/d.js',
  ])
    put(f, `// ${f}\n`)
  put('docs/pipeline-map/map.json', JSON.stringify(MAP))
  const base = commit('seed')
  const map = { ...MAP, basis: base }
  put('docs/pipeline-map/map.json', JSON.stringify(map))
  const checked = commit('basis')
  return { base, checked, map }
}

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'pmap-stale-'))
  git('init', '-q', '-b', 'main')
})
afterEach(() => rmSync(dir, { recursive: true, force: true }))

describe('stale.js', () => {
  it('reports nothing when no cited file changed', () => {
    const { map } = seed()
    put('README.md', 'x\n')
    commit('unrelated')
    const r = staleReport({ cwd: dir, map })
    expect(r.stale).toBe(false)
    expect(r).toMatchObject({ changedNodes: [], missingPaths: [], uncitedFiles: [] })
  })

  it('lists changed nodes, missing paths and new uncited files', () => {
    const { map } = seed()
    put('scripts/pipeline/a.js', '// a, changed\n')
    unlinkSync(path.join(dir, 'scripts/utils/b.js'))
    put('elements/preset.ts', '// nightly rewrite\n')
    put('scripts/utils/new-helper.js', '// new\n')
    put('.github/workflows/new.yml', 'name: x\n')
    put('scripts/utils/__fixtures__/f.js', '// fixture\n')
    put('scripts/utils/thing.test.js', '// test\n')
    put('scripts/other/elsewhere.js', '// not a watched dir\n')
    const head = commit('change')

    const r = staleReport({ cwd: dir, map })
    expect(r.head).toBe(head)
    expect(r.stale).toBe(true)
    expect(r.changedNodes).toEqual([
      { id: 'a', paths: ['scripts/pipeline/a.js'] },
      { id: 'b', paths: ['scripts/utils/b.js'] },
    ])
    expect(r.missingPaths).toEqual([{ path: 'scripts/utils/b.js', ids: ['b'] }])
    expect(r.uncitedFiles).toEqual(['.github/workflows/new.yml', 'scripts/utils/new-helper.js'])
  })

  it('takes an explicit base and refuses one the clone does not have', () => {
    const { map } = seed()
    put('scripts/utils/d.js', '// d, changed\n')
    const mid = commit('d')
    put('scripts/pipeline/a.js', '// a, changed\n')
    commit('a')
    expect(staleReport({ cwd: dir, map, base: mid }).changedNodes.map((n) => n.id)).toEqual(['a'])
    expect(() => staleReport({ cwd: dir, map, base: 'f'.repeat(40) })).toThrow(/not in this clone/)
  })

  it('writes an issue body with the range and every list', () => {
    const { checked, map } = seed()
    put('scripts/pipeline/a.js', '// a, changed\n')
    put('scripts/utils/new-helper.js', '// new\n')
    commit('change')
    const body = toMarkdown(staleReport({ cwd: dir, map }), 'o/r')
    expect(body).toContain(`https://github.com/o/r/compare/${checked}...`)
    expect(body).toContain('- `a`: `scripts/pipeline/a.js`')
    expect(body).toContain('- `scripts/utils/new-helper.js`')
    expect(body).toContain('pnpm pipeline-map:refresh')
  })

  it('counts a later map edit as a check of everything before it', () => {
    const { map } = seed()
    put('scripts/pipeline/a.js', '// a, changed alongside the map\n')
    put('docs/pipeline-map/map.json', JSON.stringify({ ...map, title: 'edited' }))
    const edited = commit('map and code together')
    put('scripts/utils/d.js', '// d, changed later\n')
    commit('d')
    const r = staleReport({ cwd: dir, map })
    expect(r.base).toBe(edited)
    expect(r.changedNodes.map((n) => n.id)).toEqual(['d'])
  })

  it("leaves the map's own upkeep files out of the uncited list", () => {
    const { map } = seed()
    put('.github/workflows/pipeline-map-stale.yml', 'name: x\n')
    put('scripts/utils/pipeline-map-helper.js', '// upkeep\n')
    put('scripts/utils/other-helper.js', '// pipeline code\n')
    commit('new files')
    expect(staleReport({ cwd: dir, map }).uncitedFiles).toEqual(['scripts/utils/other-helper.js'])
  })

  it('matches globs the way the workflow paths filter does', () => {
    expect(globToRegExp('app/routes/**').test('app/routes/work/x.tsx')).toBe(true)
    expect(globToRegExp('elements/*.ts').test('elements/chassis/x.ts')).toBe(false)
    expect(isNightlyOutput('elements/preset.ts')).toBe(true)
    expect(isNightlyOutput('elements/chassis/index.js')).toBe(false)
  })
})

describe('pipeline-map-stale.yml', () => {
  const doc = yaml.load(
    readFileSync(path.join(ROOT, '.github/workflows/pipeline-map-stale.yml'), 'utf8')
  )
  const paths = doc.on.push.paths
  const include = paths.filter((p) => !p.startsWith('!')).map(globToRegExp)
  const exclude = paths.filter((p) => p.startsWith('!')).map((p) => globToRegExp(p.slice(1)))

  it('fires for every cited source the nightly does not rewrite', () => {
    const cited = [...new Set(readMap().nodes.flatMap(localSources))].filter(
      (p) => !isNightlyOutput(p)
    )
    const missed = cited.filter(
      (p) => !include.some((re) => re.test(p)) || exclude.some((re) => re.test(p))
    )
    expect(missed).toEqual([])
  })

  it('excludes exactly the nightly output stale.js ignores', () => {
    expect(paths.filter((p) => p.startsWith('!')).map((p) => p.slice(1))).toEqual(NIGHTLY_OUTPUT)
  })

  it('makes no model call and reads no secret but the token', () => {
    const text = readFileSync(path.join(ROOT, '.github/workflows/pipeline-map-stale.yml'), 'utf8')
    expect(text).not.toMatch(/claude|ANTHROPIC/i)
    expect([...text.matchAll(/secrets\.(\w+)/g)].map((m) => m[1])).toEqual(['GITHUB_TOKEN'])
    expect(doc.jobs.check.permissions).toEqual({ contents: 'read', issues: 'write' })
  })
})

describe('refresh.js', () => {
  const quiet = { log: () => {}, build: () => 0, audit: () => 0, checkRefusal: () => null }

  it('refuses with an API key set, inside Actions, or without claude on PATH', () => {
    const onPath = () => true
    expect(refusal({ ANTHROPIC_API_KEY: 'k', PATH: '/bin' }, onPath)).toMatch(/ANTHROPIC_API_KEY/)
    expect(refusal({ GITHUB_ACTIONS: 'true', PATH: '/bin' }, onPath)).toMatch(/not in CI/)
    expect(refusal({ PATH: '/bin' }, () => false)).toMatch(/not on PATH/)
    expect(refusal({ PATH: '/bin' }, onPath)).toBeNull()
  })

  it('says the map is current and calls nothing', async () => {
    seed()
    const callModel = vi.fn()
    const res = await refresh({ cwd: dir, mapPath: mapPath(), callModel, ...quiet })
    expect(res.status).toBe('current')
    expect(callModel).not.toHaveBeenCalled()
  })

  it('--dry-run prints the prompt and makes no call and no write', async () => {
    seed()
    put('scripts/pipeline/a.js', '// a, changed\n')
    commit('change')
    const callModel = vi.fn()
    const write = vi.fn()
    const lines = []
    const res = await refresh({
      argv: ['--dry-run'],
      cwd: dir,
      mapPath: mapPath(),
      ...quiet,
      log: (l) => lines.push(l),
      callModel,
      write,
    })
    expect(res.status).toBe('dry-run')
    expect(callModel).not.toHaveBeenCalled()
    expect(write).not.toHaveBeenCalled()
    expect(res.prompt).toContain('// a, changed')
    expect(lines.join('\n')).toContain('--- prompt')
  })

  it('applies the edits, records the new basis and keeps the map valid', async () => {
    seed()
    put('scripts/pipeline/a.js', '// a, changed\n')
    const head = commit('change')
    const callModel = vi.fn(async () =>
      JSON.stringify({
        nodes: { a: { what: 'new a' } },
        edges: { ab: { when: 'sometimes' } },
        notes: 'a moved',
      })
    )
    const res = await refresh({ cwd: dir, mapPath: mapPath(), callModel, ...quiet })
    expect(res.status).toBe('refreshed')
    expect(callModel).toHaveBeenCalledTimes(1)
    const written = JSON.parse(readFileSync(mapPath(), 'utf8'))
    expect(written.basis).toBe(head)
    expect(written.branch).toBe(`main @ ${head.slice(0, 8)}`)
    expect(written.nodes.find((n) => n.id === 'a').what).toBe('new a')
    expect(written.nodes.find((n) => n.id === 'b').what).toBe('old b')
    expect(written.edges.find((e) => e.id === 'ab').when).toBe('sometimes')
    expect(validateMap(written, { exists: () => true })).toEqual([])
    expect(res.pr.branch).toMatch(/^chore\/pipeline-map-\d{4}-\d{2}-\d{2}$/)
    expect(res.pr.body).toContain('node `a`: what')
  })

  it('writes nothing when the model edits a node outside the stale set', async () => {
    const { map } = seed()
    put('scripts/pipeline/a.js', '// a, changed\n')
    commit('change')
    const before = readFileSync(mapPath(), 'utf8')
    const callModel = async () => JSON.stringify({ nodes: { b: { what: 'sneaky' } } })
    await expect(refresh({ cwd: dir, mapPath: mapPath(), callModel, ...quiet })).rejects.toThrow(
      /node b, which is not in the stale set/
    )
    expect(readFileSync(mapPath(), 'utf8')).toBe(before)
    expect(map.nodes[1].what).toBe('old b')
  })
})

describe('applyPatch', () => {
  it('rejects edges that do not touch the stale set and fields outside the allowed ones', () => {
    expect(() => applyPatch(MAP, { edges: { cd: { label: 'x' } } }, ['a'])).toThrow(/edge cd/)
    expect(() => applyPatch(MAP, { nodes: { a: { kind: 'gate' } } }, ['a'])).toThrow(/field kind/)
    expect(() => applyPatch(MAP, { nodes: { a: { id: 'z' } } }, ['a'])).toThrow(/field id/)
    expect(() => applyPatch(MAP, { nodes: { a: { source: 'one.js' } } }, ['a'])).toThrow(/list/)
    expect(() => applyPatch(MAP, { edges: { ab: { from: 'c' } } }, ['a'])).toThrow(/field from/)
  })

  it('applies label, sublabel, what, when, how and source and leaves the input alone', () => {
    const edits = { label: 'A2', sublabel: 's', what: 'w', when: 'n', how: 'h', source: ['x.js'] }
    const { map, changes } = applyPatch(MAP, { nodes: { a: edits } }, ['a'])
    expect(map.nodes[0]).toMatchObject(edits)
    expect(MAP.nodes[0].what).toBe('old a')
    expect(changes).toEqual([{ kind: 'node', id: 'a', fields: Object.keys(edits) }])
  })

  it('reads a fenced reply and rejects prose', () => {
    expect(parsePatch('```json\n{"nodes":{}}\n```').nodes).toEqual({})
    expect(() => parsePatch('Sure! Here is the patch')).toThrow()
  })

  it('names the allowed ids and the diff in the prompt', () => {
    const report = {
      base: 'b',
      head: 'h',
      changedNodes: [{ id: 'a', paths: ['scripts/pipeline/a.js'] }],
    }
    const prompt = buildPrompt(MAP, report, 'DIFF-BODY')
    expect(prompt).toContain('may appear under "nodes": a.')
    expect(prompt).toContain('may appear under "edges": ab.')
    expect(prompt).toContain('DIFF-BODY')
  })
})
