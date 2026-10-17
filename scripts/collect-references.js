#!/usr/bin/env node

/**
 * Reference Collector — selects curated references + trending design signals
 * for the Design Director based on brief text keyword matching.
 *
 * Usage:
 *   node scripts/collect-references.js                  # reads today.brief.md, writes today.references.md
 *   node scripts/collect-references.js --brief <path>   # custom brief path
 *
 * Exports collectReferences(briefText) for programmatic use.
 */

import { readFile, writeFile } from 'node:fs/promises'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as yaml from 'js-yaml'
import { isMain } from './utils/cli.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const REFERENCES_PATH = path.join(ROOT, 'references/index.yml')
const SIGNALS_PATH = path.join(ROOT, 'signals/today.yml')
const BRIEF_PATH = path.join(ROOT, 'signals/today.brief.md')
const OUTPUT_PATH = path.join(ROOT, 'signals/today.references.md')

// --- Scoring ---

const SCORE_WEIGHTS = {
  composition: 3,
  mood: 2,
  density: 1,
}

function scoreReference(ref, briefLower) {
  let score = 0
  const tags = ref.tags ?? {}
  for (const [dimension, weight] of Object.entries(SCORE_WEIGHTS)) {
    const value = tags[dimension]
    if (value && briefLower.includes(value.toLowerCase())) {
      score += weight
    }
  }
  return score
}

/**
 * Pick the references for the Art Director. Tiered entries (`tier: floor` or
 * `tier: gold`) go first and are never dropped: not by the 12-entry cap, not by
 * brief scoring.
 * The remaining slots are filled as before.
 */
export function selectCuratedReferences(references, briefText) {
  const tiered = references.filter((ref) => ref.tier === 'floor' || ref.tier === 'gold')
  const rest = references.filter((ref) => ref.tier !== 'floor' && ref.tier !== 'gold')
  // No fresh brief (the normal case — the Art Director ingests raw signals
  // directly and writes the brief AFTER deciding): hand over the whole
  // library and let the AD select what serves today's direction.
  if (!briefText) return [...tiered, ...rest.slice(0, Math.max(0, 12 - tiered.length))]
  const briefLower = briefText.toLowerCase()
  const scored = rest
    .map((ref) => ({ ...ref, score: scoreReference(ref, briefLower) }))
    .filter((ref) => ref.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
  return [...tiered, ...scored]
}

// --- Formatting ---

function formatCuratedSection(refs) {
  if (!refs.length) return ''
  const scored = refs.some((ref) => ref.score !== undefined)
  const lines = [
    '## Curated References',
    '',
    ...(scored
      ? []
      : [
          "> Full library — select the 2-3 references that best serve today's direction; ignore the rest.",
          '',
        ]),
  ]
  for (const ref of refs) {
    const tags = ref.tags ?? {}
    const tagStr = [tags.composition, tags.mood, tags.density].filter(Boolean).join(' / ')
    lines.push(`### ${ref.description ?? ref.file}`)
    if (ref.url) lines.push(`- **Source**: ${ref.url}`)
    lines.push(`- **Tags**: ${tagStr}`)
    if (ref.score !== undefined) lines.push(`- **Match score**: ${ref.score}`)
    lines.push('')
  }
  return lines.join('\n')
}

function formatTrendingSection(signals) {
  const sections = []

  const sidebar = signals?.sidebar?.links
  if (Array.isArray(sidebar) && sidebar.length > 0) {
    const lines = ['## Sidebar — Today in Design', '']
    for (const link of sidebar) {
      const title = link.title ?? 'Untitled'
      const url = link.url ?? ''
      const source = link.source ?? ''
      lines.push(`- **${title}**${source ? ` (${source})` : ''}${url ? ` — ${url}` : ''}`)
      if (link.description) lines.push(`  ${link.description}`)
    }
    lines.push('')
    sections.push(lines.join('\n'))
  }

  const awwwards = signals?.awwwards?.sites_of_the_day
  if (Array.isArray(awwwards) && awwwards.length > 0) {
    const lines = ['## Awwwards Sites of the Day', '']
    for (const site of awwwards) {
      // Awwwards data may be strings or objects depending on provider version
      const title = typeof site === 'string' ? site : (site.title ?? site.name ?? 'Untitled')
      const url = typeof site === 'string' ? '' : (site.url ?? '')
      const desc = typeof site === 'string' ? '' : (site.description ?? '')
      const screenshot = typeof site === 'string' ? '' : (site.screenshot_url ?? '')
      lines.push(`- **${title}**${url ? ` — ${url}` : ''}`)
      if (desc) lines.push(`  ${desc}`)
      if (screenshot) lines.push(`  Screenshot: ${screenshot}`)
    }
    lines.push('')
    sections.push(lines.join('\n'))
  }

  return sections.join('\n')
}

// --- Main ---

export async function collectReferences(briefText) {
  const parts = []
  let hasCurated = false
  let hasTrending = false

  // Layer 1: Curated Library
  if (existsSync(REFERENCES_PATH)) {
    try {
      const raw = await readFile(REFERENCES_PATH, 'utf8')
      const doc = yaml.load(raw)
      const refs = doc?.references
      if (Array.isArray(refs) && refs.length > 0) {
        const selected = selectCuratedReferences(refs, briefText)
        if (selected.length > 0) {
          parts.push(formatCuratedSection(selected))
          hasCurated = true
        }
      }
    } catch (err) {
      console.warn(`  [curated] skipped: ${err.message}`)
    }
  }

  // Layer 2: Trending Design Signals
  if (existsSync(SIGNALS_PATH)) {
    try {
      const raw = await readFile(SIGNALS_PATH, 'utf8')
      const signals = yaml.load(raw)
      const trending = formatTrendingSection(signals)
      if (trending) {
        parts.push(trending)
        hasTrending = true
      }
    } catch (err) {
      console.warn(`  [trending] skipped: ${err.message}`)
    }
  }

  if (parts.length === 0) return null

  const date = new Date().toISOString().slice(0, 10)
  const header = `# Design References — ${date}\n\n`
  const summary = `> Sources: ${[hasCurated && 'curated library', hasTrending && 'trending signals'].filter(Boolean).join(', ')}\n\n`

  return header + summary + parts.join('\n')
}

// --- CLI ---

if (isMain(import.meta.url)) {
  const briefFlag = process.argv.indexOf('--brief')
  const briefPath = briefFlag !== -1 ? process.argv[briefFlag + 1] : BRIEF_PATH

  // The interpret-signals stage that wrote today.brief.md was removed
  // (2026-04-29) — the file on disk is a stale leftover from an old run.
  // Only score against it when it was actually written today (an explicit
  // --brief path is always trusted); otherwise pass the full library through.
  let briefText = null
  if (existsSync(briefPath)) {
    const writtenToday =
      briefFlag !== -1 ||
      statSync(briefPath).mtime.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
    if (writtenToday) briefText = await readFile(briefPath, 'utf8')
    else console.log(`  [curated] brief is stale (${briefPath}) — passing full library`)
  }

  console.log('Collecting design references...')
  const output = await collectReferences(briefText)

  if (!output) {
    console.log('No references found. Skipping output.')
    process.exit(0)
  }

  await writeFile(OUTPUT_PATH, output, 'utf8')
  console.log(`Written: signals/today.references.md`)
}
