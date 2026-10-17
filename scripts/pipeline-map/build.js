/**
 * Render docs/pipeline-map/map.json through the vendored super-board /visual
 * map template (MIT, see THIRD_PARTY_NOTICES.md) into public/pipeline-map/index.html.
 *
 * usage: node scripts/pipeline-map/build.js
 *
 * The template stays a clean vendored copy. Every text change we make to it is
 * listed in SWAPS below, and each must match exactly once, so an upstream
 * refresh that moves an anchor fails the build instead of silently shipping.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const TEMPLATE_PATH = path.join(ROOT, 'scripts/pipeline-map/template.html')
const MAP_PATH = path.join(ROOT, 'docs/pipeline-map/map.json')
const OUT_PATH = path.join(ROOT, 'public/pipeline-map/index.html')

export const BLOB = 'https://github.com/marchdoe/dougmar.ch/blob/main/'

// Our kinds -> the template's map kinds (colour, shape, wire rules key off these names).
export const KINDS = {
  agent: 'lane',
  gate: 'hook',
  workflow: 'step',
  state: 'board',
  script: 'script',
}

const SWAPS = [
  ['<title>super-board skill map</title>', '<title>Pipeline Map</title>'],
  [
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">\n<meta name="robots" content="noindex">',
  ],
  [
    '  Section layout adapted from BuilderIO',
    "  Page template from EricTechPro/super-board diagrams/visual (MIT); map data is dougmar.ch's own.\n  Section layout adapted from BuilderIO",
  ],
  [
    "'m-lane': ['k-lane', 'Board lane', 'the board starts it']",
    "'m-lane': ['k-lane', 'Agent', 'a model call']",
  ],
  [
    "'m-script': ['k-script', 'Script', 'code a skill runs']",
    "'m-script': ['k-script', 'Script', 'a node or shell step']",
  ],
  [
    "'m-hook': ['k-hook', 'Hook / guard', 'fires on its own']",
    "'m-hook': ['k-hook', 'Gate', 'can stop the night']",
  ],
  [
    "'m-board': ['k-board', 'State', 'board, config, ledgers']",
    "'m-board': ['k-board', 'State', 'files the night reads or writes']",
  ],
  [
    "'m-step': ['k-public', 'Process step', 'open for implementation details']",
    "'m-step': ['k-public', 'Workflow', 'a GitHub Actions run or job']",
  ],
  ["n.k === 'm-lane' ? 'LANE' : ''", "n.k === 'm-lane' ? 'AGENT' : ''"],
  ["['guard', 'guard', 'a hook steps in']", "['guard', 'guard', 'a gate steps in']"],
  ['Add them to the map model and run /visual again.', 'Add them to the map model and rebuild.'],
  ["'Try a skill, verb, script or view name.'", "'Try an agent, gate, script or view name.'"],
]

/** Pure transform: template HTML + parsed map -> page HTML. Throws on any drift. */
export function renderPipelineMap(template, map) {
  const d = structuredClone(map)

  const bad = [...new Set(d.nodes.map((n) => n.kind))].filter((k) => !(k in KINDS)).sort()
  if (bad.length) throw new Error(`unknown kinds: ${bad.join(', ')}`)

  for (const n of d.nodes) {
    n.kind = KINDS[n.kind]
    const src = n.source ?? []
    n.source = [
      ...src.filter((p) => !p.startsWith('http')).map((p) => BLOB + p.replace(/^\/+/, '')),
      ...src.filter((p) => p.startsWith('http')),
    ]
  }
  d.kinds = Object.fromEntries(Object.entries(d.kinds).map(([k, v]) => [KINDS[k], v]))
  d.kind = 'map'
  d.meta = { sourceBase: BLOB }

  let html = template
  for (const [from, to] of SWAPS) {
    const count = html.split(from).length - 1
    if (count !== 1)
      throw new Error(`template anchor not found once (${count}): ${from.slice(0, 60)}`)
    html = html.replace(from, () => to)
  }

  const blob = JSON.stringify(d).replaceAll('</', '<\\/')
  if (!html.includes('%%DATA%%')) throw new Error('template has no %%DATA%% placeholder')
  return html.replace('%%DATA%%', () => blob)
}

function main() {
  const template = readFileSync(TEMPLATE_PATH, 'utf8')
  const map = JSON.parse(readFileSync(MAP_PATH, 'utf8'))
  let out
  try {
    out = renderPipelineMap(template, map)
  } catch (err) {
    console.error(err.message)
    process.exit(1)
  }
  mkdirSync(path.dirname(OUT_PATH), { recursive: true })
  writeFileSync(OUT_PATH, out, 'utf8')
  console.log(
    `${path.relative(ROOT, OUT_PATH)} ${out.length} chars, ${map.nodes.length} nodes, ${map.edges.length} edges, ${map.views.length} views`
  )
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
