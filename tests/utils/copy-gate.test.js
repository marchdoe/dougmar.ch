import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  MAX_COPY_TELLS_PER_SURFACE,
  MAX_HUMAN_COPY_TELLS_PER_FILE,
  applyExemptions,
  copyFindingsForFile,
  extractCopy,
  htmlToText,
  listScannedFiles,
  ownerForFile,
  readCopyExemptions,
  renderedCopyFindings,
  runCopyGate,
  scanRuns,
  scanSource,
  scanText,
} from '../../scripts/utils/copy-gate.js'

const SOURCE = `import { css } from '../../styled-system/css'
import type { ReactNode } from 'react'
// a comment — with nightly in it
/* a block — comment */
const LINES = ['Rebuilt nightly — again', "plain"]
export function Hero() {
  return (
    <section>
      <p>This portfolio rebuilds itself every night — and this is the line.</p>
      <blockquote data-allow-copy-tell><p>Truth — beauty</p></blockquote>
      <span>{x > 1 ? 'a' : 'b'}</span>
      <a href="https://x.y">Doug's work is here</a>
    </section>
  )
}
`

describe('extractCopy', () => {
  const runs = extractCopy(SOURCE)
  const texts = runs.map((r) => r.text)

  it('finds string literals and JSX text with their lines', () => {
    expect(runs).toContainEqual({ line: 5, text: 'Rebuilt nightly — again' })
    expect(runs).toContainEqual({
      line: 9,
      text: 'This portfolio rebuilds itself every night — and this is the line.',
    })
    expect(runs).toContainEqual({ line: 12, text: "Doug's work is here" })
  })

  it('skips comments and import lines', () => {
    expect(texts.join('\n')).not.toContain('comment')
    expect(texts).not.toContain('../../styled-system/css')
    expect(texts).not.toContain('react')
  })

  it('does not open a string on an apostrophe in JSX text', () => {
    expect(texts).not.toContain('s work is here')
  })

  it('skips the subtree of an element marked data-allow-copy-tell', () => {
    expect(texts.join('\n')).not.toContain('Truth')
  })
})

describe('scanSource', () => {
  it('reports the line, the tell and the line text', () => {
    const hits = scanSource(SOURCE)
    const dash = hits.find((h) => h.line === 5 && h.tell === 'em-dash')
    expect(dash.lineText).toBe(`const LINES = ['Rebuilt nightly — again', "plain"]`)
    expect(hits.map((h) => h.label)).toContain('self-reference "rebuilds itself"')
    expect(hits.some((h) => h.line === 3)).toBe(false)
    expect(hits.some((h) => h.lineText.includes('Truth'))).toBe(false)
  })
})

describe('applyExemptions and scanText', () => {
  it('masks hand-written content sentences without moving the text', () => {
    const content = 'I work at the intersection of design and engineering — not as a generalist.'
    const text = `${content} Rebuilt every night.`
    const masked = applyExemptions(text, { exemptions: { quoteText: '', contentTexts: [content] } })
    expect(masked).toHaveLength(text.length)
    expect(scanText(text, { exemptions: { quoteText: '', contentTexts: [content] } })).toEqual([
      expect.objectContaining({ label: 'self-reference "every night"' }),
    ])
  })

  it('lets a quoted hero line keep its em dash, and no other', () => {
    const quote = 'Hope — is the thing.'
    const hits = scanText(`${quote} — Emily`, {
      exemptions: { quoteText: quote, contentTexts: [] },
    })
    expect(hits).toHaveLength(1)
    expect(hits[0].context).toBe('Hope — is the thing. — Emily')
  })

  it('drops text the page marked allowed', () => {
    const hits = scanText('one — two. three — four.', { allowed: ['one — two.'] })
    expect(hits).toHaveLength(1)
    expect(hits[0].context).toContain('three — four')
  })

  it('reports about eighty characters of context around a hit', () => {
    const text = `${'a '.repeat(60)}— ${'b '.repeat(60)}`
    const [hit] = scanText(text)
    expect(hit.context.length).toBeLessThanOrEqual(90)
    expect(hit.context).toContain('—')
    expect(hit.context.startsWith('...')).toBe(true)
  })
})

describe('renderedCopyFindings', () => {
  it('shapes findings for the surface gate and caps them', () => {
    const text = Array.from({ length: 15 }, (_, i) => `line ${i} — dash.`).join(' ')
    const findings = renderedCopyFindings({ text, allowed: [] }, { severity: 'error' })
    expect(findings).toHaveLength(MAX_COPY_TELLS_PER_SURFACE)
    expect(findings[0]).toMatchObject({ kind: 'copy-tell', tell: 'em-dash', severity: 'error' })
    expect(findings[0].detail).toMatch(/^em dash in rendered copy: ".*line 0 — dash/)
    expect(findings[0].detail).toContain('Use a period or a comma.')
  })
})

describe('scanRuns and the orphan finding (#568)', () => {
  const run = (text, extra = {}) => ({ tag: 'div', text, before: false, after: false, ...extra })

  it('reports each distinct block once, with a count for a repeat', () => {
    const hits = scanRuns([run(', a'), run(', a'), run(', b', { tag: 'h2' }), run('fine')])
    expect(hits).toEqual([
      { tag: 'div', text: ', a', position: 'start', separator: ',', count: 2 },
      { tag: 'h2', text: ', b', position: 'start', separator: ',', count: 1 },
    ])
  })

  it('leaves an edge alone when the sentence carries on across it', () => {
    expect(scanRuns([run('DET · off season ·', { after: true })])).toEqual([])
    expect(scanRuns([run('· no game', { before: true })])).toEqual([])
    // The far side counts, not the near one: a trailing dot with only a block before it is an orphan.
    expect(scanRuns([run('DET ·', { before: true })])).toHaveLength(1)
  })

  it('masks content sentences and the attributed quote before it looks', () => {
    const content = 'closing the gap between design and code, '
    const exemptions = { quoteText: 'Hope — is the thing.', contentTexts: [content.trim()] }
    expect(scanRuns([run(content), run('Hope — is the thing.')], { exemptions })).toEqual([])
    expect(scanRuns([run(`${content}, x`)], { exemptions })).toHaveLength(1)
  })

  it('tolerates a page read without runs, and a run without text', () => {
    expect(scanRuns(undefined)).toEqual([])
    expect(scanRuns([{ tag: 'p' }])).toEqual([])
  })

  it('shapes a finding for the surface gate and the repair brief', () => {
    const findings = renderedCopyFindings(
      { text: 'Select a busy man.', allowed: [], runs: [run(', iCapital', { tag: 'h2' })] },
      { severity: 'error' }
    )
    expect(findings).toEqual([
      {
        kind: 'copy-tell',
        tell: 'orphan-separator',
        severity: 'error',
        detail:
          'orphan separator in rendered copy: <h2> ", iCapital" opens on ",". ' +
          'A field can be empty; render the separator only when both sides exist.',
      },
    ])
  })

  it('says closes for a trailing separator and shows the end of a long run', () => {
    const long = `${'word '.repeat(40)}2025 —`
    const [f] = renderedCopyFindings({ text: '', runs: [run(long)] }, { severity: 'warning' })
    expect(f.severity).toBe('warning')
    expect(f.detail).toMatch(
      /^orphan separator in rendered copy: <div> "\.\.\.[^"]*2025 —" closes on "—"\. /
    )
    expect(f.detail.length).toBeLessThan(220)
  })

  it('keeps the vocabulary tells first and caps each kind at ten', () => {
    const text = Array.from({ length: 12 }, (_, i) => `line ${i} — dash.`).join(' ')
    const runs = Array.from({ length: 12 }, (_, i) => run(`, item ${i}`))
    const findings = renderedCopyFindings({ text, runs }, { severity: 'error' })
    expect(findings).toHaveLength(2 * MAX_COPY_TELLS_PER_SURFACE)
    expect(findings.slice(0, 10).every((f) => f.tell === 'em-dash')).toBe(true)
    expect(findings.slice(10).every((f) => f.tell === 'orphan-separator')).toBe(true)
  })
})

describe('ownerForFile', () => {
  it('routes the engineer files and its generated components to the engineer', () => {
    expect(ownerForFile('app/routes/index.tsx')).toBe('react-engineer')
    expect(ownerForFile('app/components/Layout.tsx')).toBe('react-engineer')
    expect(ownerForFile('app/components/generated/Deck.tsx')).toBe('react-engineer')
  })

  it('routes content and hand-owned routes to a human', () => {
    expect(ownerForFile('app/content/projects.ts')).toBe('human')
    expect(ownerForFile('app/routes/experiments.tsx')).toBe('human')
    expect(ownerForFile('app/routes/__root.tsx')).toBe('human')
  })
})

describe('copyFindingsForFile', () => {
  it('makes an engineer file an error with the line and its text', () => {
    const [f] = copyFindingsForFile('app/routes/index.tsx', `const deck = 'A — B'\n`)
    expect(f).toMatchObject({
      surface: 'app/routes/index.tsx',
      line: 1,
      owner: 'react-engineer',
      kind: 'copy-tell',
      tell: 'em-dash',
      severity: 'error',
    })
    expect(f.detail).toBe(`em dash: "const deck = 'A — B'". Use a period or a comma.`)
  })

  it('makes a content file a warning, capped low', () => {
    const src = Array.from({ length: 6 }, (_, i) => `const s${i} = 'x — y'`).join('\n')
    const findings = copyFindingsForFile('app/content/projects.ts', src)
    expect(findings).toHaveLength(MAX_HUMAN_COPY_TELLS_PER_FILE)
    expect(findings.every((f) => f.severity === 'warning' && f.owner === 'human')).toBe(true)
  })
})

describe('runCopyGate', () => {
  let root
  const write = (rel, content) => {
    mkdirSync(path.join(root, path.dirname(rel)), { recursive: true })
    writeFileSync(path.join(root, rel), content)
  }
  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'copy-gate-'))
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('scans what exists, routes by owner, and counts errors', async () => {
    write('app/routes/index.tsx', `export const deck = 'Rebuilt every night — again'\n`)
    write('app/components/generated/Deck.tsx', `export const eyebrow = 'A vibrant day'\n`)
    write('app/content/about.ts', `export const statement = 'design and engineering — not as'\n`)
    const gate = await runCopyGate({ root })
    expect(listScannedFiles(root)).toEqual([
      'app/routes/index.tsx',
      'app/components/generated/Deck.tsx',
      'app/content/about.ts',
    ])
    expect(gate.scanned).toBe(3)
    expect(gate.errorCount).toBe(3)
    expect(gate.findings.map((f) => [f.surface, f.severity])).toEqual([
      ['app/routes/index.tsx', 'error'],
      ['app/routes/index.tsx', 'error'],
      ['app/components/generated/Deck.tsx', 'error'],
      ['app/content/about.ts', 'warning'],
    ])
  })

  it('reads the attributed quote and the content sentences as exemptions', () => {
    write('signals/today.yml', 'quote:\n  text: Hope — is the thing.\n  author: Emily\n')
    write(
      'app/content/about.ts',
      `export const s = 'closing the gap — every day'\nexport const t = 'short'\n`
    )
    expect(readCopyExemptions(root)).toEqual({
      quoteText: 'Hope — is the thing.',
      contentTexts: ['closing the gap — every day'],
    })
  })

  it('ignores an unattributed quote and a missing signals file', () => {
    write('signals/today.yml', 'quote:\n  text: Hope — is the thing.\n')
    expect(readCopyExemptions(root).quoteText).toBe('')
    rmSync(path.join(root, 'signals'), { recursive: true })
    expect(readCopyExemptions(root)).toEqual({ quoteText: '', contentTexts: [] })
  })
})

describe('htmlToText', () => {
  it('drops scripts, styles, comments and tags, and decodes entities', () => {
    const text = htmlToText(
      '<style>a{}</style><p>A&#x27;s &mdash; b</p><!-- c — d --><script>x — y</script>&ldquo;q&rdquo;'
    )
    expect(text.replace(/\s+/g, ' ').trim()).toBe(`A's — b "q"`)
  })
})
