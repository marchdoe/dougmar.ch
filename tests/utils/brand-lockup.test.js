import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  CAP_RATIO,
  LOCKUP_IDS,
  LOCKUP_VARIANTS,
  MARK_EM,
  MARK_TO_CAP,
  formatLockupTableForPrompt,
  lockupIsDeclared,
  renderBrandLockupFile,
  resolveWordmarkWeight,
  stepClamp,
} from '../../scripts/utils/brand-lockup.js'

const TEMPLATE = resolve(process.cwd(), 'scripts/templates/BrandLockup.tsx.template')

const chassis = (weights) => ({ fonts: { display: { weights } } })

describe('LOCKUP_VARIANTS', () => {
  it('carries the four Brand Contract ids and nothing else', () => {
    expect(LOCKUP_IDS).toEqual(['mark-only-md', 'horizontal-md', 'stacked-md', 'stacked-lg'])
  })

  it('floors every band at 32px, so the size floor falls out of the catalogue (#503)', () => {
    // horizontal-sm (20–28) and mark-only-sm (24–32) are gone: two builds
    // shipped a 24px mark that read as a speck at 1440.
    for (const id of LOCKUP_IDS) {
      expect(LOCKUP_VARIANTS[id].markMinPx).toBeGreaterThanOrEqual(32)
    }
    expect(LOCKUP_VARIANTS['horizontal-sm']).toBeUndefined()
    expect(LOCKUP_VARIANTS['mark-only-sm']).toBeUndefined()
  })

  it('gives every variant a ramp step and a mark band with room in it', () => {
    for (const id of LOCKUP_IDS) {
      const v = LOCKUP_VARIANTS[id]
      expect(typeof v.step).toBe('string')
      expect(v.markMinPx).toBeGreaterThan(0)
      expect(v.markMaxPx).toBeGreaterThan(v.markMinPx)
    }
  })

  it('derives the mark height from cap-height, not from a magic number', () => {
    expect(MARK_EM).toBeCloseTo(CAP_RATIO * MARK_TO_CAP, 3)
  })
})

describe('resolveWordmarkWeight', () => {
  it('takes the heaviest loaded weight at or below 700', () => {
    // Fraunces loads a 900 black drawn for headlines; a wordmark set in it shouts.
    expect(resolveWordmarkWeight(chassis([300, 400, 600, 900]))).toBe(600)
  })

  it('falls back to the only weight a single-cut face loads', () => {
    // Anton loads 400 and nothing else. Asking for 600 gets a synthetic bold.
    expect(resolveWordmarkWeight(chassis([400]), 600)).toBe(400)
  })

  it('honours a declared weight the chassis actually loads', () => {
    expect(resolveWordmarkWeight(chassis([300, 400, 700]), 300)).toBe(300)
  })

  it('snaps a declared weight the chassis does not load to the nearest one it does', () => {
    expect(resolveWordmarkWeight(chassis([400, 700]), 500)).toBe(400)
    expect(resolveWordmarkWeight(chassis([400, 700]), 650)).toBe(700)
  })

  it('breaks a tie heavier', () => {
    expect(resolveWordmarkWeight(chassis([400, 600]), 500)).toBe(600)
  })

  it('takes the lightest loaded weight when a face loads nothing at or below 700', () => {
    expect(resolveWordmarkWeight(chassis([800, 900]), 600)).toBe(800)
  })

  it('survives a chassis with no display weights at all', () => {
    expect(resolveWordmarkWeight(null)).toBe(600)
    expect(resolveWordmarkWeight(chassis([]))).toBe(600)
  })
})

describe('renderBrandLockupFile', () => {
  it('substitutes the resolved weight and leaves no placeholder behind', () => {
    const src = renderBrandLockupFile(chassis([300, 400, 600, 900]))
    expect(src).toContain('fontWeight: 600,')
    expect(src).not.toContain('{{WORDMARK_WEIGHT}}')
  })

  it('inlines the mark once, with both color modes', () => {
    const src = renderBrandLockupFile(chassis([400]))
    expect(src).toContain('#7AC042')
    expect(src).toContain('#008ED3')
    expect(src).toContain("const original = mode === 'original'")
    // The mark is drawn here and imported from nowhere.
    expect(src).not.toContain('logo.svg')
    expect(src).not.toContain('logo-mono.svg')
  })

  it('sets the wordmark from identity.name in the display face', () => {
    const src = renderBrandLockupFile(chassis([400]))
    expect(src).toContain("import { identity } from '../content/about'")
    expect(src).toContain('{identity.name}')
    expect(src).toContain("fontFamily: 'display'")
  })

  it('bounds every variant so the mark lands inside its Brand Contract band', () => {
    const src = renderBrandLockupFile(chassis([400]))
    for (const id of LOCKUP_IDS) {
      expect(src).toContain(stepClamp(id))
    }
  })

  it('draws the mark at a flat MARK_EM, so the wordmark can never outgrow it', () => {
    // Bounding the mark instead of the step is what put an 81px wordmark next
    // to a 96px mark on a 1.5-ratio chassis.
    const src = renderBrandLockupFile(chassis([400]))
    expect(src).toContain(`height: '${MARK_EM}em'`)
    expect(src).not.toContain('--brand-mark-h')
  })

  it('marks the mark for the surface gate and the header crop (#503)', () => {
    const src = renderBrandLockupFile(chassis([400]))
    expect(src).toContain('data-brand-mark=""')
    expect(src).toContain('data-brand-mode={mode}')
    expect(src).not.toContain("'horizontal-sm'")
    expect(src).not.toContain("'mark-only-sm'")
  })

  it('is SSR-safe: no hooks, no browser globals, no inline style props', () => {
    const src = renderBrandLockupFile(chassis([400]))
    expect(src).not.toMatch(/\buse(State|Effect|Ref|Memo|LayoutEffect)\b/)
    expect(src).not.toMatch(/\b(window|document|localStorage)\b/)
    expect(src).not.toMatch(/\sstyle=\{/)
  })

  it('throws when the template loses its placeholder', () => {
    const raw = readFileSync(TEMPLATE, 'utf8')
    expect(raw).toContain('{{WORDMARK_WEIGHT}}')
  })

  it('only reaches for tokens that survive a nightly preset rewrite', () => {
    // Same rule __root.tsx.template lives by: semantic sets are re-authored
    // every night and text/bg/accent are the three that are always there.
    const src = renderBrandLockupFile(chassis([400]))
    const block = src.slice(src.indexOf('const colorStyles'), src.indexOf('const rootRow'))
    expect(block).toContain("color: 'text'")
    expect(block).toContain("color: 'accent'")
    expect(block).not.toContain('textMuted')
    expect(block).not.toContain('textSecondary')
  })
})

describe('stepClamp', () => {
  it('divides the band by MARK_EM, so MARK_EM of the bound is the band', () => {
    for (const id of LOCKUP_IDS) {
      const { markMinPx, markMaxPx, step } = LOCKUP_VARIANTS[id]
      const [, lo, hi] = /^clamp\(([\d.]+)px, token\(fontSizes\.[^)]+\), ([\d.]+)px\)$/.exec(
        stepClamp(id)
      )
      expect(Number(lo) * MARK_EM).toBeCloseTo(markMinPx, 2)
      expect(Number(hi) * MARK_EM).toBeCloseTo(markMaxPx, 2)
      expect(stepClamp(id)).toContain(`token(fontSizes.${step})`)
    }
  })

  it('throws on a variant that is not in the contract', () => {
    expect(() => stepClamp('diagonal-xl')).toThrow(/unknown lockup variant/)
  })
})

describe('lockupIsDeclared', () => {
  it('is true for any contract id', () => {
    expect(lockupIsDeclared({ brand_lockup: 'horizontal-md' })).toBe(true)
  })

  it('is false when nothing was declared', () => {
    expect(lockupIsDeclared(null)).toBe(false)
    expect(lockupIsDeclared({})).toBe(false)
    expect(lockupIsDeclared({ brand_lockup: null })).toBe(false)
  })

  it('is false for an explicit absence', () => {
    expect(lockupIsDeclared({ brand_lockup: 'none' })).toBe(false)
    expect(lockupIsDeclared({ brand_lockup: ' None ' })).toBe(false)
    expect(lockupIsDeclared({ brand_lockup: 'absent' })).toBe(false)
  })
})

describe('formatLockupTableForPrompt', () => {
  it('names every variant, its step and its band, so the prompt cannot drift', () => {
    const table = formatLockupTableForPrompt()
    for (const id of LOCKUP_IDS) {
      const v = LOCKUP_VARIANTS[id]
      expect(table).toContain(`\`${id}\``)
      expect(table).toContain(`${v.markMinPx}–${v.markMaxPx}px`)
    }
  })
})
