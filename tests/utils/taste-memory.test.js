import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  MAX_TASTE_MEMORY_BYTES,
  MAX_VOICE_BYTES,
  buildTasteMemoryBlock,
  buildVoiceBlock,
} from '../../scripts/utils/taste-memory.js'

describe('buildTasteMemoryBlock', () => {
  let root
  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'taste-memory-'))
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('returns "" when signals/taste.md is absent', () => {
    expect(buildTasteMemoryBlock(root)).toBe('')
  })

  it('returns "" when signals/taste.md is empty', () => {
    mkdirSync(path.join(root, 'signals'), { recursive: true })
    writeFileSync(path.join(root, 'signals', 'taste.md'), '   \n  ')
    expect(buildTasteMemoryBlock(root)).toBe('')
  })

  it('wraps present content in the Owner Taste Memory heading', () => {
    mkdirSync(path.join(root, 'signals'), { recursive: true })
    writeFileSync(
      path.join(root, 'signals', 'taste.md'),
      '## Gold standard\n\nDrenched terracotta.'
    )
    const block = buildTasteMemoryBlock(root)
    expect(block).toContain('## Owner Taste Memory (permanent — these override recent trends)')
    expect(block).toContain('Drenched terracotta.')
  })

  it('truncates content over the cap and appends a note', () => {
    mkdirSync(path.join(root, 'signals'), { recursive: true })
    const big = 'x'.repeat(MAX_TASTE_MEMORY_BYTES + 2000)
    writeFileSync(path.join(root, 'signals', 'taste.md'), big)
    const block = buildTasteMemoryBlock(root)
    expect(Buffer.byteLength(block, 'utf8')).toBeLessThan(MAX_TASTE_MEMORY_BYTES + 2000)
    expect(block).toContain('truncated')
    expect(block).toContain('signals/taste.md exceeds')
  })

  // The real file was 5,638 bytes against a 3KB cap on 2026-09-04, which cut
  // five standing complaints and the grade ledger out of every Art Director
  // prompt. The cap has to stay ahead of the file it exists to carry.
  it('carries the whole of the real taste file', () => {
    const real = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), '../../signals/taste.md'),
      'utf8'
    )
    mkdirSync(path.join(root, 'signals'), { recursive: true })
    writeFileSync(path.join(root, 'signals', 'taste.md'), real)
    const block = buildTasteMemoryBlock(root)
    expect(block).not.toContain('truncated')
    expect(block).toContain(real.trimEnd().split('\n').at(-1))
  })

  it('does not truncate content under the cap', () => {
    mkdirSync(path.join(root, 'signals'), { recursive: true })
    const content = 'A short taste note.'
    writeFileSync(path.join(root, 'signals', 'taste.md'), content)
    const block = buildTasteMemoryBlock(root)
    expect(block).not.toContain('truncated')
    expect(block).toContain(content)
  })
})

describe('buildVoiceBlock', () => {
  let root
  beforeEach(() => {
    root = mkdtempSync(path.join(tmpdir(), 'voice-'))
    mkdirSync(path.join(root, 'signals'), { recursive: true })
  })
  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
  })

  it('returns "" when signals/voice.md is absent or empty', () => {
    expect(buildVoiceBlock(root)).toBe('')
    writeFileSync(path.join(root, 'signals', 'voice.md'), ' \n')
    expect(buildVoiceBlock(root)).toBe('')
  })

  it('wraps the file in the Owner Voice heading', () => {
    writeFileSync(path.join(root, 'signals', 'voice.md'), '## Lines I would say\n\n- Deep in both.')
    const block = buildVoiceBlock(root)
    expect(block.startsWith('## Owner Voice (permanent.')).toBe(true)
    expect(block).toContain('- Deep in both.')
  })

  it('truncates over the cap with the same note as the taste block', () => {
    writeFileSync(path.join(root, 'signals', 'voice.md'), 'v'.repeat(MAX_VOICE_BYTES + 500))
    const block = buildVoiceBlock(root)
    expect(Buffer.byteLength(block, 'utf8')).toBeLessThan(MAX_VOICE_BYTES + 500)
    expect(block).toContain('signals/voice.md exceeds')
  })

  // The real file: owner-curated, under 60 lines by its own rule, and read
  // whole. No em dashes and nothing about the pipeline in the lines it offers.
  it('carries the whole of the real voice file, which keeps to its own rules', () => {
    const real = readFileSync(
      path.join(path.dirname(fileURLToPath(import.meta.url)), '../../signals/voice.md'),
      'utf8'
    )
    expect(real.split('\n').length).toBeLessThanOrEqual(60)
    expect(real).not.toContain('—')
    expect(real).toContain('The pipeline never writes here.')
    writeFileSync(path.join(root, 'signals', 'voice.md'), real)
    const block = buildVoiceBlock(root)
    expect(block).not.toContain('truncated')
    expect(block).toContain(real.trimEnd().split('\n').at(-1))
  })
})
