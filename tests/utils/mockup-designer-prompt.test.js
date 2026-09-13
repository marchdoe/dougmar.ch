import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  assembleMockupDesignerSystemPrompt,
  MOCKUP_DESIGNER_PROMPT_MAX,
} from '../../scripts/utils/mockup-designer-prompt.js'
import { loadLanes } from '../../scripts/utils/select-lane.js'

// #508: every lane in the worst case (bolder.md loaded, as it is whenever
// the color story is committed or drenched) must stay under the budget,
// with enough headroom that an ordinary prompt edit cannot trip it
// silently. Reads the same files, and the same lane loader, production
// splices at assembly time (design-agents.js), so this measures what ships.

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..', '..')
const promptDir = path.join(root, 'scripts', 'prompts')
const refDir = path.join(promptDir, 'impeccable', 'reference')

const HEADROOM_MIN = 16 * 1024

function read(filePath) {
  return readFileSync(filePath, 'utf8')
}

describe('mockup-designer prompt budget (#508)', () => {
  const raw = read(path.join(promptDir, 'mockup-designer.md'))
  const refBrand = read(path.join(refDir, 'brand.md'))
  const brandRegisterDeclaration = `\n\n## Project Register: BRAND\n\nThis project is BRAND register — a personal portfolio where design IS the product. Apply brand-register conventions throughout. The detailed brand-register reference follows.\n\n${refBrand}`
  const refTypography = read(path.join(refDir, 'typography.md'))
  const refColor = read(path.join(refDir, 'color-and-contrast.md'))
  const refSpatial = read(path.join(refDir, 'spatial-design.md'))
  const refBolder = read(path.join(refDir, 'bolder.md'))
  const brandContract = read(path.join(promptDir, 'brand-contract.md'))

  const lanes = loadLanes()

  it('finds lane files to measure', () => {
    expect(lanes.length).toBeGreaterThan(0)
  })

  const results = lanes.map((lane) => {
    const { bytes } = assembleMockupDesignerSystemPrompt({
      raw,
      laneBody: lane.body,
      brandRegisterDeclaration,
      refs: [refTypography, refColor, refSpatial, refBolder],
      brandContract,
    })
    return { id: lane.id, bytes }
  })

  beforeAll(() => {
    const rows = [...results].sort((a, b) => b.bytes - a.bytes)
    const table = rows.map(({ id, bytes }) => `  ${id}: ${bytes}`).join('\n')
    console.log(`mockup-designer prompt bytes per lane (bolder on):\n${table}`)
  })

  it.each(results)('lane $id stays within the $bytes byte budget', ({ bytes }) => {
    expect(bytes).toBeLessThanOrEqual(MOCKUP_DESIGNER_PROMPT_MAX)
  })

  it('leaves at least 16KB of headroom on the largest lane, so an ordinary prompt edit cannot trip the budget silently', () => {
    const largest = Math.max(...results.map((r) => r.bytes))
    expect(MOCKUP_DESIGNER_PROMPT_MAX - largest).toBeGreaterThanOrEqual(HEADROOM_MIN)
  })
})
