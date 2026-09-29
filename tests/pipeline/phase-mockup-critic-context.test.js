/**
 * What the mockup critic is handed beside the images (spec 11 1d): the recent
 * nights it judges freshness against, and the work records it checks copy
 * against.
 */
import { describe, expect, it } from 'vitest'
import { readWorkRecords, recentNightsForCritic } from '../../scripts/pipeline/phase-mockup.js'
import { tempDir, writeUnder } from '../helpers/tmp.js'

const ID = '0123abcd'

describe('recentNightsForCritic', () => {
  it('hands over the recent briefs inside their boundary tag', () => {
    const out = recentNightsForCritic({
      boundaryId: ID,
      inputs: { recentBriefs: '\n### 2026-09-27\n## Hero Copy\nrain on the green\n' },
    })
    expect(out.startsWith(`<briefs-${ID}>\n`)).toBe(true)
    expect(out.endsWith(`</briefs-${ID}>`)).toBe(true)
    expect(out).toContain('rain on the green')
  })

  it('is empty when there are no recent briefs', () => {
    expect(recentNightsForCritic({ boundaryId: ID, inputs: { recentBriefs: '' } })).toBe('')
    expect(recentNightsForCritic({ boundaryId: ID, inputs: {} })).toBe('')
  })
})

describe('readWorkRecords', () => {
  it('returns projects.ts and about.ts as labelled source', async () => {
    const root = await tempDir('work-records-')
    writeUnder(
      root,
      'app/content/projects.ts',
      "export const projects = [{ title: 'FishSticks' }]\n"
    )
    writeUnder(root, 'app/content/about.ts', "export const identity = { name: 'Doug March' }\n")

    const out = await readWorkRecords(root)
    expect(out).toContain('### app/content/projects.ts')
    expect(out).toContain("title: 'FishSticks'")
    expect(out).toContain('### app/content/about.ts')
    expect(out).toContain("name: 'Doug March'")
  })

  it('skips a missing file and returns empty when neither exists', async () => {
    const root = await tempDir('work-records-')
    expect(await readWorkRecords(root)).toBe('')
    writeUnder(root, 'app/content/projects.ts', 'export const projects = []\n')
    const out = await readWorkRecords(root)
    expect(out).toContain('projects.ts')
    expect(out).not.toContain('about.ts')
  })

  it('reads the real records in this checkout', async () => {
    const out = await readWorkRecords(process.cwd())
    expect(out).toContain("slug: 'fishsticks'")
  })
})
