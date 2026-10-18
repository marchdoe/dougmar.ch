/**
 * Run the map viewer's own audit (#check=1) against public/pipeline-map/index.html
 * in headless Chromium and print per-view issue counts and route stats.
 *
 * usage: node scripts/pipeline-map/audit.js [--optimize] [--json]
 *   --optimize  also run the viewer's crossing-minimising search and print the
 *               suggested `layout` for every view that has none, as JSON on stdout
 *   --json      print the raw audit result as JSON instead of the table
 *
 * The viewer only reports route stats summed over all views. To get them per view the
 * script adds one counter to the page it loads (in memory; the file on disk is untouched).
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const PAGE = path.join(ROOT, 'public/pipeline-map/index.html')
const args = new Set(process.argv.slice(2))

const PER_VIEW_FROM = 'routes[k] = (routes[k] || 0) + n; });'
const PER_VIEW_TO =
  'routes[k] = (routes[k] || 0) + n; ((routes.byView ||= {})[v.id] ||= {})[k] = n; });'

async function audit({ optimize = false } = {}) {
  let html = readFileSync(PAGE, 'utf8')
  const perView = html.includes(PER_VIEW_FROM)
  if (perView) html = html.replace(PER_VIEW_FROM, () => PER_VIEW_TO)
  const browser = await chromium.launch()
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    const hash = optimize ? '#check=1&optimize=1' : '#check=1'
    await page.route('http://map.local/**', (r) =>
      r.fulfill({ status: 200, contentType: 'text/html', body: html })
    )
    await page.goto(`http://map.local/index.html${hash}`)
    const pre = page.locator('#visual-check')
    await pre.waitFor({ state: 'attached', timeout: optimize ? 600_000 : 60_000 })
    return JSON.parse(await pre.textContent())
  } finally {
    await browser.close()
  }
}

/** "view v-gates: edges a and b cross" -> "v-gates" */
const viewOf = (issue) => issue.split(':')[0].slice('view '.length)

/** One line per view: issue count, then each route kind and its count. */
function viewLines({ overlaps, routes }) {
  return Object.entries({ ...routes.byView }).map(([id, stats]) => {
    const kinds = Object.entries(stats).map(([k, n]) => `${k}=${n}`)
    const issues = overlaps.filter((o) => viewOf(o) === id).length
    return `${id.padEnd(12)} issues=${issues}  ${kinds.join(' ')}`
  })
}

function report(res) {
  const fallbacks = [...(res.routes.fallbackEdges ?? [])].map((f) => `fallback ${f}`)
  return [
    ...viewLines(res),
    ...[...res.overlaps, ...fallbacks].map((line) => `  ${line}`),
    ...res.errors.map((e) => `error: ${e}`),
  ]
}

async function main() {
  const optimize = args.has('--optimize')
  const res = { overlaps: [], routes: {}, errors: [], layouts: {}, ...(await audit({ optimize })) }
  const lines = args.has('--json') ? [JSON.stringify(res, null, 2)] : report(res)
  // with --optimize stdout carries only the layouts JSON, so the report goes to stderr
  const log = [console.log, console.error][Number(optimize)]
  for (const line of lines) log(line)
  if (optimize) console.log(JSON.stringify(res.layouts, null, 2))
  process.exitCode = Math.sign(res.overlaps.length + res.errors.length)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
