import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GENERATED_HEADER, VENDORED_TARGET, syncUnslop } from '../../scripts/sync-unslop.js'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

describe('syncUnslop', () => {
  let dir
  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), 'sync-unslop-'))
  })
  afterEach(() => {
    rmSync(dir, { recursive: true, force: true })
  })

  it('writes the header and then the skill file verbatim', () => {
    const source = path.join(dir, 'SKILL.md')
    const target = path.join(dir, 'unslop.md')
    writeFileSync(source, '---\nname: unslop\n---\n\n# Unslop\n')
    const result = syncUnslop({ source, target })
    expect(result.synced).toBe(true)
    expect(readFileSync(target, 'utf8')).toBe(
      `${GENERATED_HEADER}---\nname: unslop\n---\n\n# Unslop\n`
    )
  })

  it('leaves the target alone and reports why when the skill is absent (CI)', () => {
    const target = path.join(dir, 'unslop.md')
    writeFileSync(target, 'kept')
    const result = syncUnslop({ source: path.join(dir, 'missing.md'), target })
    expect(result.synced).toBe(false)
    expect(result.reason).toContain('no skill file')
    expect(readFileSync(target, 'utf8')).toBe('kept')
  })

  it('targets scripts/prompts/unslop.md', () => {
    expect(VENDORED_TARGET).toBe(path.join(REPO, 'scripts', 'prompts', 'unslop.md'))
  })
})

describe('scripts/prompts/unslop.md', () => {
  const vendored = readFileSync(VENDORED_TARGET, 'utf8')

  it('says it is generated, and how to refresh it', () => {
    expect(vendored.startsWith(GENERATED_HEADER)).toBe(true)
    expect(vendored).toContain('pnpm unslop:sync')
  })

  it('carries the whole pattern list', () => {
    expect(vendored).toContain('## Patterns to detect and fix')
    expect(vendored).toContain('13. **Em dash overuse.**')
    expect(vendored).toContain('31. **Prefer the plain word.**')
  })
})
