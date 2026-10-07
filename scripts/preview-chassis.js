#!/usr/bin/env node

/**
 * Preview the artifacts the orchestrator would generate for a given chassis.
 * Lets curators eyeball the URL, font tokens, fontSizes ramp, and rendered
 * __root.tsx without running the full pipeline.
 *
 * Usage:
 *   node scripts/preview-chassis.js <chassis-id>
 *   node scripts/preview-chassis.js --list
 */

import { CHASSIS_CATALOG } from '../elements/chassis/index.js'
import {
  buildGoogleFontsUrl,
  buildFontTokens,
  buildFontSizes,
  renderRootTemplate,
} from './utils/chassis.js'
import { latestArchivedDateBefore } from './utils/archive-count.js'
import { localDateString } from './utils/local-time.js'

const arg = process.argv[2]

if (!arg || arg === '--list' || arg === '-l') {
  console.log('Available chassis:\n')
  for (const c of CHASSIS_CATALOG) {
    console.log(`  ${c.id.padEnd(28)} ${c.description}`)
    console.log(`  ${' '.repeat(28)} moods: ${c.moods.join(', ')}`)
    console.log(`  ${' '.repeat(28)} archetypes: ${c.archetypes.join(', ')}\n`)
  }
  process.exit(0)
}

const chassis = CHASSIS_CATALOG.find((c) => c.id === arg)
if (!chassis) {
  console.error(`Unknown chassis: ${arg}`)
  console.error(`Available: ${CHASSIS_CATALOG.map((c) => c.id).join(', ')}`)
  process.exit(1)
}

const url = buildGoogleFontsUrl(chassis)
const fontTokens = buildFontTokens(chassis)
const fontSizes = buildFontSizes(chassis)
// The live rail needs a date (#702); a preview has no run, so it uses today's.
const today = localDateString(new Date())
const rootTsx = renderRootTemplate(url, '', 0, 'text', today, latestArchivedDateBefore(today))

console.log(`\n=== Chassis: ${chassis.name} (${chassis.id}) ===`)
console.log(`\n${chassis.description}`)
console.log(`Moods: ${chassis.moods.join(', ')}`)
console.log(`Archetypes: ${chassis.archetypes.join(', ')}`)

console.log('\n--- Google Fonts URL ---')
console.log(url)

console.log('\n--- theme.tokens.fonts (injected into preset.ts) ---')
console.log(JSON.stringify(fontTokens, null, 2))

console.log('\n--- theme.tokens.fontSizes (injected into preset.ts) ---')
console.log(JSON.stringify(fontSizes, null, 2))

console.log('\n--- __root.tsx (first 30 lines after substitution) ---')
console.log(rootTsx.split('\n').slice(0, 30).join('\n'))
console.log('...')
