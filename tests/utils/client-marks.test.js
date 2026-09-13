import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  formatClientMarksForPrompt,
  parseClientLogos,
  readClientMarkSources,
} from '../../scripts/utils/client-marks.js'
import { ROOT } from '../../scripts/utils/file-manager.js'

const PROJECTS = `
const spacemanClients: Client[] = [
  { name: 'Rolex', logo: '/clients/rolex.svg', url: 'https://rolex.com' },
  {
    name: 'The Nature Conservancy',
    logo: '/clients/nature-conservancy.svg',
  },
  { name: 'Framebridge', logo: '/clients/framebridge.png', url: 'https://framebridge.com' },
  { name: 'WorkAround', url: 'https://joinworkaround.com' }, // logo: provide file
]
`

describe('parseClientLogos', () => {
  it('reads every name and logo pair, in order, and skips a client with no logo', () => {
    expect(parseClientLogos(PROJECTS)).toEqual([
      { name: 'Rolex', logo: '/clients/rolex.svg' },
      { name: 'The Nature Conservancy', logo: '/clients/nature-conservancy.svg' },
      { name: 'Framebridge', logo: '/clients/framebridge.png' },
    ])
  })
})

describe('readClientMarkSources', () => {
  let root
  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'client-marks-'))
    mkdirSync(path.join(root, 'app/content'), { recursive: true })
    mkdirSync(path.join(root, 'public/clients'), { recursive: true })
    writeFileSync(path.join(root, 'app/content/projects.ts'), PROJECTS)
    writeFileSync(path.join(root, 'public/clients/rolex.svg'), '<svg id="rolex"></svg>\n')
    writeFileSync(path.join(root, 'public/clients/framebridge.png'), Buffer.from([0x89, 0x50]))
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('inlines the SVG marks it finds and leaves a raster or missing mark without source', () => {
    expect(readClientMarkSources({ root })).toEqual([
      { name: 'Rolex', logo: '/clients/rolex.svg', svg: '<svg id="rolex"></svg>' },
      { name: 'The Nature Conservancy', logo: '/clients/nature-conservancy.svg', svg: null },
      { name: 'Framebridge', logo: '/clients/framebridge.png', svg: null },
    ])
  })

  it('returns nothing when the content file is absent, as in the swarm harness root', () => {
    rmSync(path.join(root, 'app/content/projects.ts'))
    expect(readClientMarkSources({ root })).toEqual([])
  })

  it('finds every mark the real content points at, on disk', () => {
    const marks = readClientMarkSources({ root: ROOT })
    expect(marks.length).toBeGreaterThanOrEqual(8)
    for (const { logo, svg } of marks) {
      if (logo.endsWith('.svg')) expect(svg).toMatch(/<svg[\s>]/)
    }
  })
})

describe('formatClientMarksForPrompt', () => {
  it('is empty with nothing to inline', () => {
    expect(formatClientMarksForPrompt([])).toBe('')
    expect(formatClientMarksForPrompt(null)).toBe('')
  })

  it('fences each SVG under the client name and lists a sourceless mark by name', () => {
    const block = formatClientMarksForPrompt([
      { name: 'Rolex', logo: '/clients/rolex.svg', svg: '<svg id="rolex"></svg>' },
      { name: 'Framebridge', logo: '/clients/framebridge.png', svg: null },
    ])
    expect(block).toContain('## Client Marks')
    expect(block).toContain(
      '### Rolex (`/clients/rolex.svg`)\n\n```html\n<svg id="rolex"></svg>\n```'
    )
    expect(block).toContain(
      '### Framebridge (`/clients/framebridge.png`, no SVG source; render the name)'
    )
    expect(block).toContain('file:// URL')
  })
})
