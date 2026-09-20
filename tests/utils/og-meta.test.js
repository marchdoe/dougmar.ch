import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { buildOgMetaEntries } from '../../scripts/utils/og-meta.js'
import { CANONICAL_ORIGIN, RECOGNIZED_ORIGINS } from '../../shared/site-origin.js'

describe('buildOgMetaEntries', () => {
  it('emits og + twitter entries with escaped content', () => {
    const code = buildOgMetaEntries({
      date: '2026-06-12',
      heroCopy: 'SAY "LESS"',
      designBrief: 'A drenched teal stack.',
      siteUrl: CANONICAL_ORIGIN,
    })
    expect(code).toContain(`property: 'og:image'`)
    expect(code).toContain(`${CANONICAL_ORIGIN}/og/2026-06-12.png`)
    expect(code).toContain(JSON.stringify('SAY "LESS"')) // escaped via JSON.stringify
    expect(code).toContain(`'summary_large_image'`)
    expect(code).toContain(`property: 'og:description'`)
  })
  it('falls back to defaults when hero/brief are empty', () => {
    const code = buildOgMetaEntries({ date: '2026-06-12' })
    expect(code).toContain('Doug March')
    expect(code).toContain(`${CANONICAL_ORIGIN}/og/2026-06-12.png`)
  })

  it('leads with a plain `title` entry, the shell default (#327)', () => {
    // __root.tsx.template has no title of its own — this is the one place
    // the shell's <title> comes from, so a rewrite of this function that
    // dropped the entry would leave every page without a title again.
    const code = buildOgMetaEntries({ date: '2026-06-12', heroCopy: 'SAY "LESS"' })
    expect(code.trim().split('\n')[0]).toBe(`{ title: ${JSON.stringify('SAY "LESS"')} },`)
  })
})

describe('the host is not baked in', () => {
  // Task 0.2 of the domain move. Written while doug-march.com is still
  // canonical, so it can still fail loudly when Phase 1 flips the constant.
  // An assertion spelling the host would simply stop covering anything.
  it('carries whichever siteUrl it is given', () => {
    for (const origin of RECOGNIZED_ORIGINS) {
      const code = buildOgMetaEntries({ date: '2026-06-12', siteUrl: origin })
      expect(code).toContain(`${origin}/og/2026-06-12.png`)
      // og:url goes through JSON.stringify, so it lands double-quoted.
      expect(code).toContain(`{ property: 'og:url', content: ${JSON.stringify(origin)} }`)
    }
  })

  it('defaults to the canonical origin, whatever that currently is', () => {
    const code = buildOgMetaEntries({ date: '2026-06-12' })
    expect(code).toContain(`${CANONICAL_ORIGIN}/og/2026-06-12.png`)
  })
})

describe('the root-checked fallback (#399)', () => {
  // The capture that produces public/og/<date>.png is best-effort and can
  // fail or not have run yet. Passing `root` is what turns the check on —
  // the two calls that write __root.tsx before capture runs omit it, since
  // the file can never exist yet at that point.
  let root

  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'og-meta-'))
    mkdirSync(path.join(root, 'public', 'og'), { recursive: true })
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('names the dated image when it is on disk', () => {
    writeFileSync(path.join(root, 'public', 'og', '2026-06-12.png'), 'fake png')
    const code = buildOgMetaEntries({ date: '2026-06-12', root })
    expect(code).toContain(`${CANONICAL_ORIGIN}/og/2026-06-12.png`)
    expect(code).not.toContain('/og/default.png')
  })

  it('falls back to default.png when the dated image is missing', () => {
    const code = buildOgMetaEntries({ date: '2026-06-12', root })
    expect(code).toContain(`${CANONICAL_ORIGIN}/og/default.png`)
    expect(code).not.toContain('/og/2026-06-12.png')
  })

  it('does not check disk at all when root is omitted', () => {
    // No public/og/ under this root has 2026-06-12.png, but root was never
    // passed, so the check never runs — today's behavior, preserved.
    const code = buildOgMetaEntries({ date: '2026-06-12' })
    expect(code).toContain(`${CANONICAL_ORIGIN}/og/2026-06-12.png`)
  })
})
