/**
 * Bring the pipeline map up to date after its cited sources change.
 *
 * usage: pnpm pipeline-map:refresh [--dry-run] [--base <sha>]
 *   --dry-run  print the stale report and the prompt; call nothing, write nothing
 *   --base     diff from this commit instead of the map's `basis`
 *
 * Runs stale.js. Nothing stale: says so and stops, with no model call. Otherwise it makes
 * one Sonnet call through the local `claude` CLI (the Max plan; never the API key, never
 * the SDK), applies the returned edits to the stale nodes and the edges that touch them,
 * validates the map with the same checks the vitest suite runs, records HEAD as `basis`,
 * rebuilds public/pipeline-map/index.html and runs the viewer audit. New files no node
 * cites are listed for a person to place; the refresh never adds or removes nodes.
 *
 * It refuses to run with ANTHROPIC_API_KEY set or inside GitHub Actions, and when
 * `claude` is not on PATH. It commits nothing, pushes nothing and opens no PR.
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { accessSync, constants } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isStale, NIGHTLY_OUTPUT, parseArgs, staleReport, toText } from './stale.js'
import { MAP_PATH, ROOT, readMap, validateMap, writeMap } from './validate.js'

export const NODE_FIELDS = ['label', 'sublabel', 'what', 'when', 'how', 'source']
export const EDGE_FIELDS = ['label', 'when']
export const DIFF_CAP = 60_000
const AGENT_NAME = 'pipeline-map-refresh'

/** Why this machine must not make the call, or null. */
export function refusal(env = process.env, onPath = isOnPath) {
  if (env.ANTHROPIC_API_KEY)
    return 'ANTHROPIC_API_KEY is set. The refresh bills the Max plan through the claude CLI and never the API; unset it and run again.'
  if (env.GITHUB_ACTIONS)
    return 'the refresh runs locally, not in CI: CI only reports staleness (pipeline-map-stale.yml).'
  if (!onPath('claude', env.PATH))
    return '`claude` is not on PATH. Install Claude Code and log in with the Max plan.'
  return null
}

export function isOnPath(bin, pathVar = '') {
  return pathVar
    .split(path.delimiter)
    .filter(Boolean)
    .some((dir) => {
      try {
        accessSync(path.join(dir, bin), constants.X_OK)
        return true
      } catch {
        return false
      }
    })
}

/** The diff of the stale paths, cut to `cap` characters with a note when cut. */
export function staleDiff(report, { cwd = ROOT, cap = DIFF_CAP } = {}) {
  const paths = [...new Set(report.changedNodes.flatMap((n) => n.paths))]
  if (!paths.length) return ''
  const diff = execFileSync('git', ['diff', `${report.base}..${report.head}`, '--', ...paths], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  })
  if (diff.length <= cap) return diff
  return `${diff.slice(0, cap)}\n[diff cut at ${cap} of ${diff.length} characters]\n`
}

/** The stale nodes, the edges touching them and the views showing them. */
export function staleContext(map, report) {
  const ids = new Set(report.changedNodes.map((n) => n.id))
  const nodes = map.nodes.filter((n) => ids.has(n.id))
  const edges = map.edges.filter((e) => ids.has(e.from) || ids.has(e.to))
  const views = map.views
    .filter((v) => (v.nodeIds ?? []).some((id) => ids.has(id)))
    .map((v) => ({ id: v.id, title: v.title, caption: v.caption }))
  const neighbours = new Set(edges.flatMap((e) => [e.from, e.to]).filter((id) => !ids.has(id)))
  const names = map.nodes
    .filter((n) => neighbours.has(n.id))
    .map((n) => ({ id: n.id, label: n.label, kind: n.kind }))
  return { ids, nodes, edges, views, neighbours: names }
}

export const SYSTEM_PROMPT = `You keep a hand-written map of a software pipeline accurate. You are given a git diff and the map entries that cite the changed files. Rewrite only what the diff makes wrong or incomplete, in the map's existing voice: plain, specific, present tense, naming real files, flags and values. Do not restate unchanged facts in new words. Reply with one JSON object and nothing else: no prose, no code fence.`

/** One prompt for the whole refresh. */
export function buildPrompt(map, report, diff) {
  const ctx = staleContext(map, report)
  return [
    `Repository commit range: ${report.base}..${report.head}`,
    '',
    '## Map rules',
    '',
    `- Node kinds: ${Object.entries(map.kinds)
      .map(([k, v]) => `${k} (${v})`)
      .join('; ')}. A node keeps its id and kind.`,
    `- You may change these node fields: ${NODE_FIELDS.join(', ')}. Edge fields: ${EDGE_FIELDS.join(', ')}. Nothing else.`,
    '- `source` is a list of repo-relative paths that exist at the head commit (or https URLs). Keep the paths a node already cites unless the diff deletes or moves them.',
    '- `[[node-id]]` inside text links another node; link only ids already in these entries or listed as neighbours below.',
    `- These files are rewritten by the nightly run and are not sources of truth for edits: ${NIGHTLY_OUTPUT.join(', ')}.`,
    '- Leave a field out when it needs no change. Leave a node or edge out when nothing about it changed.',
    '',
    '## Reply format',
    '',
    '{"nodes": {"<node id>": {"<field>": <new value>}}, "edges": {"<edge id>": {"<field>": "<new value>"}}, "notes": "<one or two sentences: what changed and why>"}',
    '',
    `Only these node ids may appear under "nodes": ${[...ctx.ids].join(', ')}.`,
    `Only these edge ids may appear under "edges": ${ctx.edges.map((e) => e.id).join(', ') || '(none)'}.`,
    '',
    '## Stale nodes (with the paths that changed)',
    '',
    JSON.stringify(
      ctx.nodes.map((n) => ({
        ...n,
        changed: report.changedNodes.find((c) => c.id === n.id)?.paths,
      })),
      null,
      1
    ),
    '',
    '## Edges touching them',
    '',
    JSON.stringify(ctx.edges, null, 1),
    '',
    '## Their neighbours (read only)',
    '',
    JSON.stringify(ctx.neighbours),
    '',
    '## Views that show them (read only)',
    '',
    JSON.stringify(ctx.views, null, 1),
    '',
    '## Diff',
    '',
    diff || '(no diff: only missing or uncited paths)',
  ].join('\n')
}

/** The model's reply as a patch object. Tolerates a code fence; nothing else. */
export function parsePatch(text) {
  const body = text
    .trim()
    .replace(/^```(?:json)?\s*/, '')
    .replace(/\s*```$/, '')
  const patch = JSON.parse(body)
  if (!patch || typeof patch !== 'object' || Array.isArray(patch))
    throw new Error('patch is not a JSON object')
  return { nodes: patch.nodes ?? {}, edges: patch.edges ?? {}, notes: patch.notes ?? '' }
}

function checkValue(where, field, value) {
  if (field === 'source') {
    if (!Array.isArray(value) || !value.every((p) => typeof p === 'string' && p))
      throw new Error(`${where}.source must be a list of non-empty strings`)
  } else if (typeof value !== 'string') {
    throw new Error(`${where}.${field} must be a string`)
  }
}

function applyFields(target, edits, allowed, where) {
  if (!edits || typeof edits !== 'object' || Array.isArray(edits))
    throw new Error(`${where} must be an object of fields`)
  const changed = []
  for (const [field, value] of Object.entries(edits)) {
    if (!allowed.includes(field)) throw new Error(`${where}: field ${field} may not be edited`)
    checkValue(where, field, value)
    if (JSON.stringify(target[field]) === JSON.stringify(value)) continue
    target[field] = value
    changed.push(field)
  }
  return changed
}

/**
 * Apply a patch to a copy of the map. Throws, changing nothing, on any node outside the
 * stale set, any edge not touching it, or any field outside NODE_FIELDS / EDGE_FIELDS.
 *
 * @returns {{map: object, changes: {kind: 'node'|'edge', id: string, fields: string[]}[]}}
 */
export function applyPatch(map, patch, staleIds) {
  const ids = new Set(staleIds)
  const next = structuredClone(map)
  const changes = []
  for (const [id, edits] of Object.entries(patch.nodes ?? {})) {
    if (!ids.has(id)) throw new Error(`patch edits node ${id}, which is not in the stale set`)
    const node = next.nodes.find((n) => n.id === id)
    const fields = applyFields(node, edits, NODE_FIELDS, `node ${id}`)
    if (fields.length) changes.push({ kind: 'node', id, fields })
  }
  for (const [id, edits] of Object.entries(patch.edges ?? {})) {
    const edge = next.edges.find((e) => e.id === id)
    if (!edge || !(ids.has(edge.from) || ids.has(edge.to)))
      throw new Error(`patch edits edge ${id}, which does not touch a stale node`)
    const fields = applyFields(edge, edits, EDGE_FIELDS, `edge ${id}`)
    if (fields.length) changes.push({ kind: 'edge', id, fields })
  }
  return { map: next, changes }
}

/** Record the commit the map now reflects. */
export function setBasis(map, sha) {
  const next = { ...map, basis: sha }
  if (/^main @ [0-9a-f]+$/.test(map.branch ?? '')) next.branch = `main @ ${sha.slice(0, 8)}`
  return next
}

function fileExistsAt(sha, cwd) {
  const files = new Set(
    execFileSync('git', ['ls-tree', '-r', '--name-only', sha], { cwd, encoding: 'utf8' })
      .split('\n')
      .filter(Boolean)
  )
  return (p) => files.has(p) || [...files].some((f) => f.startsWith(`${p.replace(/\/+$/, '')}/`))
}

/** The suggested PR, for a person to open. */
export function suggestPr(report, changes, notes, today = new Date().toISOString().slice(0, 10)) {
  const list = (items) => (items.length ? items : ['(none)'])
  return {
    branch: `chore/pipeline-map-${today}`,
    title: `docs(pipeline-map): refresh the map to ${report.head.slice(0, 8)}`,
    body: [
      `Refreshes the pipeline map from \`${report.base.slice(0, 8)}\` to \`${report.head.slice(0, 8)}\` with \`pnpm pipeline-map:refresh\`.`,
      '',
      notes ? `${notes}\n` : '',
      'Edited:',
      ...list(changes.map((c) => `- ${c.kind} \`${c.id}\`: ${c.fields.join(', ')}`)),
      '',
      'New files no node cites (place by hand or leave out on purpose):',
      ...list(report.uncitedFiles.map((f) => `- \`${f}\``)),
      '',
      'Closes the open "Pipeline map is out of date" issue.',
    ].join('\n'),
  }
}

/** Default model call: the local CLI, Sonnet, with the CLI's own env allowlist. */
async function callCli(system, prompt) {
  const { callClaudeCLI } = await import('../utils/claude-cli.js')
  const { MODEL_IDS } = await import('../utils/models.js')
  const { getUsageRecords } = await import('../utils/cost-ledger.js')
  // refusal() already stopped a run with the key set; this keeps it out of the child
  // even if a caller skipped that check. claude-cli.js forwards it only when present.
  delete process.env.ANTHROPIC_API_KEY
  const text = await callClaudeCLI(AGENT_NAME, system, prompt, {
    model: MODEL_IDS.sonnet,
    timeoutMs: 600_000,
  })
  const rec = getUsageRecords().at(-1)
  if (rec)
    console.log(
      `usage: ${rec.model} input=${rec.input} output=${rec.output} cache_read=${rec.cache_read} cache_write=${rec.cache_write} cost_usd=${rec.cost_usd}${rec.estimated ? ' (estimated)' : ''} (the CLI's figure; billed to the Max plan)`
    )
  return text
}

const runNode = (script, cwd) =>
  spawnSync(process.execPath, [path.join(cwd, script)], { cwd, stdio: 'inherit' }).status

/**
 * The whole refresh. Every side effect is injectable so the test can run it without a
 * model, a browser or the real map.
 */
export async function refresh({
  argv = [],
  cwd = ROOT,
  mapPath = MAP_PATH,
  env = process.env,
  log = console.log,
  callModel = callCli,
  checkRefusal = refusal,
  write = writeMap,
  build = () => runNode('scripts/pipeline-map/build.js', cwd),
  audit = () => runNode('scripts/pipeline-map/audit.js', cwd),
} = {}) {
  const opts = parseArgs(argv)
  const map = readMap(mapPath)
  const report = staleReport({ cwd, map, ...(opts.base && { base: opts.base }) })
  log(toText(report))
  if (!isStale(report)) return { status: 'current', report }

  const prompt = report.changedNodes.length
    ? buildPrompt(map, report, staleDiff(report, { cwd }))
    : ''
  if (opts.dryRun) {
    if (prompt)
      log(
        `\n--- system prompt ---\n${SYSTEM_PROMPT}\n\n--- prompt (${prompt.length} chars) ---\n${prompt}`
      )
    return { status: 'dry-run', report, prompt }
  }

  let next = map
  let changes = []
  let notes = ''
  if (prompt) {
    const why = checkRefusal(env)
    if (why) throw new Error(`refusing to call the model: ${why}`)
    const patch = parsePatch(await callModel(SYSTEM_PROMPT, prompt))
    ;({ map: next, changes } = applyPatch(
      map,
      patch,
      report.changedNodes.map((n) => n.id)
    ))
    notes = patch.notes
  }
  next = setBasis(next, report.head)
  const problems = validateMap(next, { exists: fileExistsAt(report.head, cwd) })
  if (problems.length)
    throw new Error(`the refreshed map fails its checks:\n  ${problems.join('\n  ')}`)
  write(next, mapPath)
  log(
    `\nwrote ${path.relative(cwd, mapPath)}: ${changes.length} edit(s), basis ${report.head.slice(0, 8)}`
  )
  for (const c of changes) log(`  ${c.kind} ${c.id}: ${c.fields.join(', ')}`)

  if (build() !== 0) throw new Error('build.js failed')
  const auditStatus = audit()
  if (auditStatus !== 0) log('audit.js reported issues; check the layout before opening the PR')

  if (report.missingPaths.length)
    log(
      `\ncited paths that no longer exist (fix by hand):\n${report.missingPaths.map((m) => `  ${m.path} (${m.ids.join(', ')})`).join('\n')}`
    )
  log(
    `\nnew files no node cites (place by hand):\n${report.uncitedFiles.map((f) => `  ${f}`).join('\n') || '  (none)'}`
  )
  const pr = suggestPr(report, changes, notes)
  log(
    `\nsuggested branch: ${pr.branch}\nsuggested PR title: ${pr.title}\nsuggested PR body:\n${pr.body}`
  )
  return { status: 'refreshed', report, changes, pr, auditStatus }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  refresh({ argv: process.argv.slice(2) }).catch((err) => {
    console.error(err.message)
    process.exitCode = 1
  })
}
