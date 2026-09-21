import { describe, expect, it } from 'vitest'
import {
  CONTENT_GAPS_TOKEN,
  fillContentGaps,
  findContentGaps,
  formatContentGapsForPrompt,
  readContentExports,
} from '../../scripts/utils/content-gaps.js'
import { tempRepoRoot, writeUnder } from '../helpers/tmp.js'

const TIMELINE = `
export type Entry = { year: string; role: string; company: string; note?: string }
export const timeline: Entry[] = [
  { year: '2025 —', role: '', company: 'Acme' },
  { year: '2020', role: 'Designer', company: 'Globex', note: 'Shipped it.' },
  { year: '2018', role: 'Developer', company: 'Initech', note: '' },
]
export const education = { school: 'Dayton', degree: 'BFA', years: '' }
export const capabilities = ['Design', '', 'Code']
export const stamp = () => ''
`

const PROJECTS = `
import type { Project } from './types'
export const projects: Project[] = [
  { slug: 'a', title: 'A', role: 'Lead' },
  { slug: 'b', title: 'B' },
]
export const featured = projects.filter((p) => p.slug === 'a')
`

/** The shape timeline.ts has since #638: derived from a sibling content file. */
const RESUME = `
export type Role = { company: string; title: string; startDate: string; endDate: string }
export const resumeExperience: Role[] = [
  { company: 'Acme', title: 'Vice President', startDate: '2025', endDate: 'Present' },
  { company: 'Globex', title: '', startDate: '2020', endDate: '2022' },
]
`

const TIMELINE_FROM_RESUME = `
import { resumeExperience } from './resume'
export type Entry = { year: string; role: string; company: string }
export const timeline: Entry[] = resumeExperience.map((r) => ({
  year: r.endDate === 'Present' ? r.startDate + ' to present' : r.startDate + ' to ' + r.endDate,
  role: r.title,
  company: r.company,
}))
`

/** A root with content files written under app/content. */
async function rootWith(files) {
  const root = await tempRepoRoot('dm-content-gaps-')
  for (const [name, source] of Object.entries(files))
    writeUnder(root, `app/content/${name}`, source)
  return root
}

describe('findContentGaps', () => {
  it('lists the string fields that are empty or missing in at least one entry', async () => {
    const root = await rootWith({ 'timeline.ts': TIMELINE, 'projects.ts': PROJECTS })
    const { exports, problems } = await readContentExports({ root })

    expect(problems).toEqual([])
    expect(findContentGaps(exports)).toEqual([
      { field: 'timeline[].role', empty: 1, absent: 0, total: 3 },
      { field: 'timeline[].note', empty: 1, absent: 1, total: 3 },
      { field: 'education.years', empty: 1, absent: 0, total: 1 },
      { field: 'projects[].role', empty: 0, absent: 1, total: 2 },
    ])
  })

  it('does not list populated fields, string arrays, functions or a filtered copy of a collection', async () => {
    const root = await rootWith({ 'timeline.ts': TIMELINE, 'projects.ts': PROJECTS })
    const fields = findContentGaps((await readContentExports({ root })).exports).map((g) => g.field)

    expect(fields.some((f) => f.startsWith('timeline[].company'))).toBe(false)
    expect(fields.some((f) => f.startsWith('capabilities'))).toBe(false)
    expect(fields.some((f) => f.startsWith('stamp'))).toBe(false)
    expect(fields.some((f) => f.startsWith('featured'))).toBe(false)
  })

  it('sees nothing in an optional field no entry sets, and nothing in an empty collection', () => {
    expect(findContentGaps({ rows: [{ a: 'x' }, { a: 'y' }], none: [] })).toEqual([])
    expect(findContentGaps({})).toEqual([])
  })
})

describe('formatContentGapsForPrompt', () => {
  it('gives the rule once and one line per field', () => {
    const text = formatContentGapsForPrompt({
      gaps: [
        { field: 'timeline[].role', empty: 3, absent: 0, total: 12 },
        { field: 'timeline[].note', empty: 1, absent: 2, total: 12 },
        { field: 'projects[].role', empty: 0, absent: 4, total: 7 },
        { field: 'education.years', empty: 1, absent: 0, total: 1 },
      ],
    })
    expect(text).toContain(
      'Render a comma, a dot, a dash or a slash between two fields only when both sides have text'
    )
    expect(text).toContain('leave it out along with its separator')
    expect(text).toContain("- `timeline[].role` is '' in 3 of 12 entries\n")
    expect(text).toContain(
      "- `timeline[].note` is '' in 1 of 12 entries and is missing from 2 of 12 entries\n"
    )
    expect(text).toContain('- `projects[].role` is missing from 4 of 7 entries\n')
    expect(text).toMatch(/- `education\.years` is ''$/m)
  })

  it('says so plainly when nothing is empty', () => {
    const text = formatContentGapsForPrompt({ gaps: [] })
    expect(text).toContain('No string field in `app/content/*.ts` is empty or missing today.')
    expect(text).not.toContain('- `')
  })

  it('names a file it could not read', () => {
    const text = formatContentGapsForPrompt({
      gaps: [],
      problems: ['app/content/broken.ts: Invalid relative URL'],
    })
    expect(text).toContain(
      'Could not read app/content/broken.ts: Invalid relative URL. Treat every string field it holds as one that can be empty.'
    )
  })
})

describe('readContentExports', () => {
  it('reports a file it cannot evaluate and still reads the others', async () => {
    const root = await rootWith({
      'timeline.ts': TIMELINE,
      'needs-import.ts': "import { x } from './elsewhere'\nexport const y = x\n",
      'syntax.ts': 'export const = \n',
    })
    const { exports, problems } = await readContentExports({ root })

    expect(Object.keys(exports)).toContain('timeline')
    expect(problems).toHaveLength(2)
    expect(problems.map((p) => p.split(':')[0])).toEqual([
      'app/content/needs-import.ts',
      'app/content/syntax.ts',
    ])
  })

  it('reports a checkout with no content directory', async () => {
    const root = await tempRepoRoot('dm-content-gaps-')
    expect(await readContentExports({ root })).toEqual({
      exports: {},
      problems: ['app/content does not exist'],
    })
  })

  it('reads the types-only file without exporting anything', async () => {
    const root = await rootWith({ 'types.ts': 'export type A = { b: string }\n' })
    expect(await readContentExports({ root })).toEqual({ exports: {}, problems: [] })
  })
})

describe('fillContentGaps', () => {
  it('replaces the placeholder with the list read from the content under root', async () => {
    const root = await rootWith({ 'timeline.ts': TIMELINE })
    const prompt = await fillContentGaps(`before\n${CONTENT_GAPS_TOKEN}\nafter`, { root })

    expect(prompt).toContain("- `timeline[].role` is '' in 1 of 3 entries")
    expect(prompt.startsWith('before\nA content field can be empty')).toBe(true)
    expect(prompt.endsWith('\nafter')).toBe(true)
    expect(prompt).not.toContain(CONTENT_GAPS_TOKEN)
  })

  it('says there is nothing to list when every field is populated', async () => {
    const root = await rootWith({ 'a.ts': "export const rows = [{ name: 'x' }]\n" })
    expect(await fillContentGaps(CONTENT_GAPS_TOKEN, { root })).toContain(
      'is empty or missing today'
    )
  })

  it('throws when the prompt lost its placeholder', async () => {
    await expect(fillContentGaps('no token here', { root: '/nowhere' })).rejects.toThrow(
      /react-engineer\.md is missing its \{\{CONTENT_GAPS\}\} placeholder/
    )
  })
})

describe('readContentExports resolves a sibling content import (#638)', () => {
  it('reads timeline.ts derived from resume.ts, with no problem reported', async () => {
    const root = await rootWith({ 'resume.ts': RESUME, 'timeline.ts': TIMELINE_FROM_RESUME })
    const { exports, problems } = await readContentExports({ root })
    expect(problems).toEqual([])
    expect(exports.timeline).toEqual([
      { year: '2025 to present', role: 'Vice President', company: 'Acme' },
      { year: '2020 to 2022', role: '', company: 'Globex' },
    ])
    // The gap check sees through to the derived rows.
    expect(findContentGaps(exports)).toContainEqual({
      field: 'timeline[].role',
      empty: 1,
      absent: 0,
      total: 2,
    })
  })

  it('names a cycle instead of recursing forever', async () => {
    const root = await rootWith({
      'a.ts': "import { b } from './b'\nexport const a = b",
      'b.ts': "import { a } from './a'\nexport const b = a",
    })
    const { problems } = await readContentExports({ root })
    expect(problems.some((p) => p.includes('import each other'))).toBe(true)
  })
})
