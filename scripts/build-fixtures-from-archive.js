#!/usr/bin/env node
/**
 * Seed agent fixtures from a build the pipeline already shipped.
 *
 * The alternative is `RECORD_FIXTURES=true` on a live run, which costs a
 * night's worth of model calls before anyone can begin refactoring the thing
 * the fixtures exist to make refactorable. The archive already holds what
 * each agent produced — the preset, the mockup, the critics' verdicts, the
 * declaration blocks, and (via the commit for that date) the engineer's
 * files. This reassembles those artifacts into the delimited responses the
 * parsers expect.
 *
 * What comes out is faithful in shape and true in content, but it is a
 * reconstruction, not a recording: `visual_spec` survives in trace.json only
 * as a 200-character preview, and builds from before #254 have no header
 * declaration at all, so both are marked in the fixture itself. For
 * exercising the swarm's control flow that is enough. For asserting on exact
 * model prose, record a real run.
 *
 * Usage: node scripts/build-fixtures-from-archive.js 2026-08-30
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { ROOT } from './utils/file-manager.js'
import { FIXTURE_DIR } from './utils/agent-fixtures.js'
import { SEMANTIC_COLOR_NAMES, parsePresetSemanticColors } from './utils/semantic-contract.js'
import { isMain } from './utils/cli.js'
import { pickBuild } from './utils/archive-record.js'

/**
 * Where a missing semantic role borrows its value from.
 *
 * The token contract froze at fifteen names after most of the archive was
 * written, so an older preset is short a few — the 2026-08-30 build declares
 * nine. The gate's own instruction is to "map the missing role onto the
 * palette this design already has", which is what these pairs do: each
 * missing name takes the value of the defined sibling nearest its role, so
 * the fixture stays inside the design's palette instead of inventing colour.
 */
const SEMANTIC_FALLBACKS = {
  bgAlt: 'surface',
  textFaint: 'textMuted',
  accentAlt: 'accent',
  borderStrong: 'border',
  fieldInkMuted: 'fieldInk',
  fieldBorder: 'fieldInk',
}

const RECONSTRUCTED = '<!-- reconstructed from the archive; see build-fixtures-from-archive.js -->'

function readJson(file) {
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null
}

/**
 * The build that shipped for a date, per `pickBuild` — the archive's one
 * answer to which build went live, not simply the newest that is neither
 * failed nor pre.
 *
 * @param {string} date
 * @param {{archiveDir?: string}} [options]
 */
export function shippedBuildDir(date, { archiveDir = path.join(ROOT, 'archive') } = {}) {
  const dateDir = path.join(archiveDir, date)
  if (!existsSync(dateDir)) throw new Error(`No archive for ${date}`)
  const { buildDir } = pickBuild(dateDir)
  if (!buildDir) throw new Error(`No shipped build under archive/${date}`)
  return buildDir
}

/** `key: value` lines, the shape every declaration block uses. */
export const kvBlock = (obj) =>
  Object.entries(obj)
    .filter(([, v]) => v !== null && v !== undefined)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

/**
 * Pull one `## Heading` section out of brief.md.
 *
 * The lookahead ends on the next heading or the true end of the document.
 * `$` cannot be used for that here: the `m` flag needed to anchor the heading
 * also makes `$` match the end of every line, which cut every section down to
 * its first line. `(?![\\s\\S])` is end-of-input regardless of the flag.
 */
export function briefSection(brief, heading) {
  const re = new RegExp(`^## ${heading}\\s*\\n([\\s\\S]*?)(?=\\n## |(?![\\s\\S]))`, 'm')
  return (re.exec(brief)?.[1] ?? '').trim()
}

/** A file as it stood in the commit that shipped this date. */
function fileAtDate(relPath, date) {
  try {
    const sha = execFileSync(
      'git',
      ['log', '-1', '--format=%H', `--until=${date}T23:59:59`, '--', relPath],
      { cwd: ROOT, encoding: 'utf8' }
    ).trim()
    if (!sha) return null
    return execFileSync('git', ['show', `${sha}:${relPath}`], { cwd: ROOT, encoding: 'utf8' })
  } catch {
    return null
  }
}

function write(agent, index, body) {
  const dir = path.join(FIXTURE_DIR, agent)
  mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `${String(index).padStart(2, '0')}.txt`)
  writeFileSync(file, body, 'utf8')
  console.log(`  ${path.relative(ROOT, file)}  (${(body.length / 1024).toFixed(1)}KB)`)
}

/**
 * Add any semantic colours the preset predates, borrowing each from the
 * defined sibling nearest its role.
 *
 * Without this the replay reaches build validation and stops there: the
 * archived preset is valid for the night it shipped and short of a contract
 * that tightened afterwards. Reconstructing what the Art Director would emit
 * today is the point — a fixture frozen against a retired contract can only
 * ever exercise the failure path.
 *
 * @param {string} source contents of the archived elements/preset.ts
 * @returns {string}
 */
export function completeSemanticTokens(source) {
  const declared = new Set(parsePresetSemanticColors(source))
  const missing = SEMANTIC_COLOR_NAMES.filter((n) => !declared.has(n))
  if (missing.length === 0) return source

  // Read a declared token's `value: { ... }` object back out of the source so
  // the borrowed entry is written exactly as the design wrote it. Brace-
  // counted rather than matched with `\{[^}]*\}`: every value contains
  // `{colors.x.y}` token references, so a non-greedy class stops at the first
  // inner brace and emits an unterminated string.
  const declaredValue = (name) => {
    const head = new RegExp(`\\b${name}\\s*:\\s*\\{\\s*value\\s*:\\s*`).exec(source)
    if (!head) return null
    const open = source.indexOf('{', head.index + head[0].length - 1)
    if (open < 0) return null
    let depth = 0
    for (let i = open; i < source.length; i++) {
      if (source[i] === '{') depth++
      else if (source[i] === '}' && --depth === 0) return source.slice(open, i + 1)
    }
    return null
  }

  const added = []
  for (const name of missing) {
    const donor = SEMANTIC_FALLBACKS[name]
    const value = donor ? declaredValue(donor) : null
    if (!value) {
      console.log(`  (cannot synthesize semantic token ${name} — no donor in this preset)`)
      continue
    }
    added.push(
      `        // synthesized from ${donor}: this build predates the ${name} role\n        ${name}: {\n          value: ${value},\n        },`
    )
  }
  if (added.length === 0) return source

  // Insert just inside `semanticTokens: { colors: {`.
  const anchor = /semanticTokens\s*:\s*\{\s*\n\s*colors\s*:\s*\{\s*\n/.exec(source)
  if (!anchor) throw new Error('Could not locate semanticTokens.colors in the archived preset')
  const at = anchor.index + anchor[0].length
  console.log(
    `  added ${added.length} semantic token(s) the preset predates: ${missing.join(', ')}`
  )
  return source.slice(0, at) + added.join('\n') + '\n' + source.slice(at)
}

/**
 * A HEADER block the grammar accepts.
 *
 * Builds before #254 kept nav in shell.json and declared no header at all, so
 * one has to be synthesized. It is marked as such in the block itself: these
 * numbers were nobody's design decision.
 */
export function headerBlock(header, shell, composition) {
  if (header) return kvBlock(header)
  return [
    '# synthesized: this build predates the HEADER declaration (#254)',
    kvBlock({
      placement: composition.shell_posture === 'marginal' ? 'right-margin' : 'top-bar',
      height_px: 72,
      mark_px: 40,
      wordmark_step: 'sm',
      wordmark_weight: 600,
      role_line: 'absent',
      nav_step: 'sm',
      nav_case: 'lower',
      nav: shell.nav ?? 'three lowercase links in the top-right margin',
    }),
  ].join('\n')
}

/**
 * A MOBILE block the grammar accepts (#452).
 *
 * Builds before #452 declared nothing about the phone and carry no
 * `collapse` axis, so both are synthesized: `stack` is the one collapse that
 * contradicts nothing, and the block names the hero and a two-zone order the
 * validator accepts. Marked as such in the block itself.
 */
export function mobileBlock(mobile, ad) {
  if (mobile) return kvBlock(mobile)
  return [
    '# synthesized: this build predates the MOBILE declaration (#452)',
    kvBlock({
      carrier: 'The hero phrase carries the page at 360; every other zone stacks below it.',
      first_fold: `The hero phrase "${ad.hero_copy ?? ''}" at hero step, then the nav.`,
      order: 'hero, nav, content, footer',
      hero_step_360: 'hero',
      nav_360: 'The nav becomes one row under the mark at the top of the page.',
    }),
  ].join('\n')
}

/** MEASURABLES is never persisted; these are the values the gate accepts. */
const MEASURABLE_DEFAULTS = {
  canvas_utilization_min: 85,
  hero_scale: 'clamp(64px, 8.5vw, 136px)',
  color_coverage_min: 40,
}

/** Everything the Art Director declares, read back off disk. */
export function artDirectorArtifacts(build) {
  const trace = readJson(path.join(build, 'trace.json'))
  return {
    ad: trace?.steps?.find((s) => s.name === 'art-director')?.output ?? {},
    brief: readFileSync(path.join(build, 'brief.md'), 'utf8'),
    shell: readJson(path.join(build, 'shell.json')) ?? {},
    header: readJson(path.join(build, 'header.json')),
    mobile: readJson(path.join(build, 'mobile.json')),
    composition: readJson(path.join(build, 'composition.json')) ?? {},
    scheme: readJson(path.join(build, 'color-scheme.json')),
    heroSource: readJson(path.join(build, 'hero-source.json')),
    preset: completeSemanticTokens(readFileSync(path.join(build, 'preset.ts'), 'utf8')),
  }
}

/**
 * The Art Director's response, assembled from what the build recorded.
 *
 * Exported and pure so the assembly can be asserted: this is the fixture the
 * whole replay hangs off, and every `??` here is a decision about what to do
 * when a build predates a block.
 *
 * @param {ReturnType<typeof artDirectorArtifacts>} artifacts
 * @returns {string}
 */
export function artDirectorBlocks(artifacts) {
  const { ad, brief, shell, header, mobile, composition, scheme, heroSource, preset } = artifacts
  // A build before #452 has no collapse axis; `stack` contradicts nothing.
  const tuple = composition.collapse ? composition : { ...composition, collapse: 'stack' }
  const rationale = briefSection(brief, "Claude's Rationale")
  const fallbackRationale = 'Reconstructed from the archived brief.'

  return [
    `===HERO_COPY===\n${ad.hero_copy ?? ''}`,
    `===HERO_RATIONALE===\n${rationale || fallbackRationale}`,
    heroSource?.source ? `===HERO_SOURCE===\nsource: ${heroSource.source}` : null,
    ad.archetype ? `===ARCHETYPE===\n${ad.archetype}` : null,
    `===CHASSIS_ID===\n${ad.chassisId ?? ''}`,
    // trace.json keeps a 200-char preview, never the whole spec.
    `===VISUAL_SPEC===\n${RECONSTRUCTED}\n${ad.specPreview ?? '### Specification\nReconstructed.'}`,
    `===SELF_CHECK===\n${ad.selfCheck ?? '1. Reconstructed from the archive.'}`,
    // Never persisted as an artifact; these are the defaults the gate accepts.
    `===MEASURABLES===\n# synthesized: not persisted by this build\n${kvBlock(MEASURABLE_DEFAULTS)}`,
    `===SHELL===\n${kvBlock({
      footer: shell.footer,
      brand_lockup: shell.brand_lockup,
      brand_color_mode: shell.brand_color_mode,
      ground_strategy: shell.ground_strategy,
    })}`,
    `===HEADER===\n${headerBlock(header, shell, composition)}`,
    `===MOBILE===\n${mobileBlock(mobile, ad)}`,
    `===COMPOSITION===\n${kvBlock(tuple)}`,
    `===COMPOSITION_RATIONALE===\n${rationale.slice(0, 600) || fallbackRationale}`,
    scheme ? `===COLOR_SCHEME===\n${JSON.stringify(scheme, null, 2)}` : null,
    `===FILE:elements/preset.ts===\n${preset}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

function artDirector(build) {
  write('art-director', 0, artDirectorBlocks(artDirectorArtifacts(build)))
}

function critics(build) {
  const verdicts = readJson(path.join(build, 'verdicts.json')) ?? []
  const seen = new Map()
  for (const v of verdicts) {
    const index = seen.get(v.critic) ?? 0
    seen.set(v.critic, index + 1)
    write(v.critic, index, `===VERDICT===\n${v.verdict}\n\n${v.feedback ?? ''}\n===END===`)
  }
  if (!seen.has('screenshot-critic')) {
    // Not every run reaches the screenshot gate, but a replay that does needs
    // an answer rather than a missing-fixture error.
    write('screenshot-critic', 0, `===VERDICT===\nSHIP\n\n${RECONSTRUCTED}\n===END===`)
  }
}

function mockupDesigner(build) {
  const mockupPath = path.join(build, 'mockup.html')
  if (!existsSync(mockupPath)) {
    console.log('  (no mockup.html in this build — skipping mockup-designer)')
    return
  }
  write(
    'mockup-designer',
    0,
    [
      `===FILE:mockup.html===\n${readFileSync(mockupPath, 'utf8')}`,
      `===INTERIOR_NOTES===\nInterior pages follow the home page's field split: the ledger column carries metadata, the gold field carries the title.`,
      `===RATIONALE===\n${RECONSTRUCTED}`,
    ].join('\n\n')
  )
}

function reactEngineer(build, date) {
  const brief = readFileSync(path.join(build, 'brief.md'), 'utf8')
  const changed = briefSection(brief, 'Files Changed')
    .split('\n')
    .map((l) => l.replace(/^-\s*/, '').trim())
    .filter((f) => f && f !== 'elements/preset.ts')

  const blocks = []
  const missing = []
  for (const file of changed) {
    const content = fileAtDate(file, date)
    if (content) blocks.push(`===FILE:${file}===\n${content}`)
    else missing.push(file)
  }
  if (missing.length) console.log(`  (no commit content for: ${missing.join(', ')})`)
  if (blocks.length === 0) throw new Error(`Could not recover any engineer file for ${date}`)

  blocks.push(`===RATIONALE===\n${RECONSTRUCTED}`)
  write('react-engineer', 0, blocks.join('\n\n'))
}

/**
 * @param {string} date
 * @returns {string} the build the fixtures were rebuilt from
 */
export function buildFixturesFromArchive(date) {
  const build = shippedBuildDir(date)
  console.log(`Rebuilding fixtures from ${path.relative(ROOT, build)}\n`)
  artDirector(build)
  mockupDesigner(build)
  critics(build)
  reactEngineer(build, date)
  return build
}

if (isMain(import.meta.url)) {
  const date = process.argv[2]
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('Usage: node scripts/build-fixtures-from-archive.js <YYYY-MM-DD>')
    process.exit(1)
  }
  buildFixturesFromArchive(date)
  console.log(`\nDone. Run the pipeline against them with MOCK_MODE=true.`)
}
