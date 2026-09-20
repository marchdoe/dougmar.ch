import { describe, it, expect, afterEach } from 'vitest'
import { CANONICAL_ORIGIN } from '../../shared/site-origin.js'

/**
 * how.$date.tsx's head() names /og/<date>.png for every date, but the
 * pipeline's capture is best-effort and some dates never got one — a build
 * bakes __OG_IMAGE_DATES__ (vite.config.ts) in as a literal, and this is
 * what the route checks it against (#399). Vitest doesn't run that `define`,
 * so each test sets the global itself before importing the route module —
 * a bare, un-declared identifier reference resolves to a global property of
 * the same name, same as it would post-`define` in a real build.
 */
interface MetaTag {
  property?: string
  content?: string
}

describe('how.$date og:image fallback (#399)', () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, '__OG_IMAGE_DATES__')
  })

  it('names the dated image for a date the build captured one for', async () => {
    ;(globalThis as Record<string, unknown>).__OG_IMAGE_DATES__ = ['2026-06-12']
    const { Route } = await import('../../app/routes/how.$date')
    const head = await Route.options.head?.({ params: { date: '2026-06-12' } } as never)
    const image = (head?.meta as MetaTag[] | undefined)?.find((m) => m.property === 'og:image')
    expect(image?.content).toBe(`${CANONICAL_ORIGIN}/og/2026-06-12.png`)
  })

  it('falls back to default.png for a date the build never captured one for', async () => {
    ;(globalThis as Record<string, unknown>).__OG_IMAGE_DATES__ = ['2026-06-12']
    const { Route } = await import('../../app/routes/how.$date')
    const head = await Route.options.head?.({ params: { date: '2026-06-13' } } as never)
    const image = (head?.meta as MetaTag[] | undefined)?.find((m) => m.property === 'og:image')
    expect(image?.content).toBe(`${CANONICAL_ORIGIN}/og/default.png`)
  })
})
