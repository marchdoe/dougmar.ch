/**
 * Which parts of the pipeline map have gone stale since the commit it was last
 * checked against (`basis` in docs/pipeline-map/map.json).
 *
 * usage: node scripts/pipeline-map/stale.js [--base <sha>] [--head <ref>] [--json | --markdown]
 *   --base      the commit to diff from (default: the map's `basis`)
 *   --head      the commit to diff to (default: HEAD)
 *   --json      the report as JSON, with `stale: true|false`
 *   --markdown  the body of the "Pipeline map is out of date" issue
 *
 * Three lists:
 *   changedNodes  nodes whose `source` files changed between base and head
 *   missingPaths  cited paths that no longer exist at head
 *   uncitedFiles  files added under scripts/pipeline/, scripts/utils/ or
 *                 .github/workflows/ since base that no node cites
 *
 * Only new files count as uncited. Those directories already hold helpers the map
 * leaves out on purpose, and listing them every time would keep the issue open forever.
 *
 * Files the nightly rewrites (NIGHTLY_OUTPUT) never make a node stale, even when a node
 * cites them: they change every morning by design. The workflow's `paths` filter
 * excludes the same globs. The CLI exits 0 whether or not anything is stale; it makes
 * no model call. `pnpm pipeline-map:refresh` does the update.
 */
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { localSources, MAP_PATH, ROOT, readMap } from './validate.js'

export const NIGHTLY_OUTPUT = [
  'elements/preset.ts',
  'elements/chassis-preset.ts',
  'app/components/generated/**',
  'app/routes/**',
  'archive/**',
  'public/**',
]

export const UNCITED_DIRS = ['scripts/pipeline/', 'scripts/utils/', '.github/workflows/']

const REPO = 'marchdoe/dougmar.ch'

/** A path glob (`*` within a segment, `**` across them) as a RegExp. */
export function globToRegExp(glob) {
  const body = glob
    .split('**')
    .map((part) =>
      part
        .split('*')
        .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
        .join('[^/]*')
    )
    .join('.*')
  return new RegExp(`^${body}$`)
}

const NIGHTLY_RE = NIGHTLY_OUTPUT.map(globToRegExp)
export const isNightlyOutput = (file) => NIGHTLY_RE.some((re) => re.test(file))

const isTestOrFixture = (file) =>
  /(^|\/)(tests?|__tests__|fixtures?|__fixtures__)\//.test(file) ||
  /\.(test|spec)\.[jt]sx?$/.test(file)

const git = (cwd, args) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

/** A cited path matches a file when it is that file or a directory holding it. */
const cites = (cited, file) => file === cited || file.startsWith(`${cited.replace(/\/+$/, '')}/`)

/**
 * `git diff --name-status -M` output -> [{ status, path, from? }]. A rename lists its
 * new path, with the old one as `from`.
 */
export function parseNameStatus(text) {
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, a, b] = line.split('\t')
      return b ? { status: status[0], path: b, from: a } : { status: status[0], path: a }
    })
}

/**
 * The stale report, as pure data, from the map, the base..head file changes and the
 * files that exist at head.
 *
 * @param {object} map parsed map.json
 * @param {{status: string, path: string, from?: string}[]} changes
 * @param {string[]} headFiles every tracked file at head
 */
export function computeStale(map, changes, headFiles) {
  const touched = changes.flatMap((c) => [c.path, c.from]).filter((f) => f && !isNightlyOutput(f))

  const changedNodes = map.nodes
    .map((n) => ({
      id: n.id,
      paths: localSources(n).filter((p) => touched.some((f) => cites(p, f))),
    }))
    .filter((n) => n.paths.length)

  const missing = new Map()
  for (const n of map.nodes) {
    for (const p of localSources(n)) {
      if (headFiles.some((f) => cites(p, f))) continue
      missing.set(p, [...(missing.get(p) ?? []), n.id])
    }
  }
  const missingPaths = [...missing].map(([p, ids]) => ({ path: p, ids }))

  const cited = map.nodes.flatMap(localSources)
  const uncitedFiles = changes
    .filter((c) => c.status === 'A' || c.status === 'R' || c.status === 'C')
    .map((c) => c.path)
    .filter((f) => UNCITED_DIRS.some((d) => f.startsWith(d)))
    .filter((f) => !isTestOrFixture(f))
    .filter((f) => !cited.some((p) => cites(p, f)))
    .sort()

  return { changedNodes, missingPaths, uncitedFiles }
}

export const isStale = (r) =>
  r.changedNodes.length + r.missingPaths.length + r.uncitedFiles.length > 0

/** Read the repo at `cwd` and build the report for base..head. */
export function staleReport({
  cwd = ROOT,
  map = readMap(path.join(cwd, 'docs/pipeline-map/map.json')),
  base = map.basis,
  head = 'HEAD',
} = {}) {
  if (!base) throw new Error('map.json has no basis and no --base was given')
  try {
    git(cwd, ['cat-file', '-e', `${base}^{commit}`])
  } catch {
    throw new Error(
      `base commit ${base} is not in this clone (a shallow checkout needs fetch-depth: 0)`
    )
  }
  const baseSha = git(cwd, ['rev-parse', `${base}^{commit}`]).trim()
  const headSha = git(cwd, ['rev-parse', `${head}^{commit}`]).trim()
  const changes = parseNameStatus(
    git(cwd, ['diff', '--name-status', '-M', `${baseSha}..${headSha}`])
  )
  const headFiles = git(cwd, ['ls-tree', '-r', '--name-only', headSha]).split('\n').filter(Boolean)
  const report = computeStale(map, changes, headFiles)
  return { base: baseSha, head: headSha, stale: isStale(report), ...report }
}

const short = (sha) => sha.slice(0, 8)

/** The issue body. */
export function toMarkdown(r, repo = REPO) {
  const lines = [
    `The pipeline map (\`docs/pipeline-map/map.json\`) was last checked against \`${short(r.base)}\`. Since then, up to \`${short(r.head)}\` ([compare](https://github.com/${repo}/compare/${r.base}...${r.head})):`,
    '',
  ]
  const section = (title, items) => {
    if (!items.length) return
    lines.push(`### ${title}`, '', ...items, '')
  }
  section(
    'Nodes whose sources changed',
    r.changedNodes.map((n) => `- \`${n.id}\`: ${n.paths.map((p) => `\`${p}\``).join(', ')}`)
  )
  section(
    'Cited paths that no longer exist',
    r.missingPaths.map(
      (m) => `- \`${m.path}\`, cited by ${m.ids.map((id) => `\`${id}\``).join(', ')}`
    )
  )
  section(
    'New files no node cites',
    r.uncitedFiles.map((f) => `- \`${f}\``)
  )
  lines.push(
    'To update it, run `pnpm pipeline-map:refresh` locally (one Sonnet call through the `claude` CLI on the Max plan). It edits the stale nodes only; place new files by hand. A PR that merges the refresh closes this issue.',
    '',
    '<sub>Opened by the Pipeline Map Stale workflow. This issue body is rewritten on every push that leaves the map stale.</sub>'
  )
  return `${lines.join('\n')}\n`
}

/** Plain-text summary for a terminal. */
export function toText(r) {
  if (!r.stale)
    return `pipeline map is current: nothing cited changed in ${short(r.base)}..${short(r.head)}`
  return [
    `pipeline map is stale (${short(r.base)}..${short(r.head)})`,
    ...r.changedNodes.map((n) => `  changed  ${n.id}: ${n.paths.join(', ')}`),
    ...r.missingPaths.map((m) => `  missing  ${m.path} (${m.ids.join(', ')})`),
    ...r.uncitedFiles.map((f) => `  uncited  ${f}`),
  ].join('\n')
}

export function parseArgs(argv) {
  const opts = { format: 'text' }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--base' || a === '--head') opts[a.slice(2)] = argv[++i]
    else if (a === '--json') opts.format = 'json'
    else if (a === '--markdown') opts.format = 'markdown'
    else if (a === '--dry-run') opts.dryRun = true
    else throw new Error(`unknown argument: ${a}`)
  }
  return opts
}

function main() {
  const opts = parseArgs(process.argv.slice(2))
  const report = staleReport({
    map: readMap(MAP_PATH),
    ...(opts.base && { base: opts.base }),
    ...(opts.head && { head: opts.head }),
  })
  const out = {
    json: () => JSON.stringify(report, null, 2),
    markdown: () => toMarkdown(report, process.env.GITHUB_REPOSITORY || REPO),
    text: () => toText(report),
  }[opts.format]()
  process.stdout.write(out.endsWith('\n') ? out : `${out}\n`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (err) {
    console.error(err.message)
    process.exitCode = 1
  }
}
