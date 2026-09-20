import { describe, expect, it } from 'vitest'

import {
  CANONICAL_ORIGIN,
  RECOGNIZED_HOSTS,
  RECOGNIZED_ORIGINS,
  matchOrigin,
} from '../../shared/site-origin.js'

describe('the origin list', () => {
  it('recognizes the canonical origin', () => {
    expect(RECOGNIZED_ORIGINS).toContain(CANONICAL_ORIGIN)
  })

  it('is ordered longest first, so no origin shadows another as a prefix', () => {
    const lengths = RECOGNIZED_ORIGINS.map((o) => o.length)
    expect([...lengths].sort((a, b) => b - a)).toEqual(lengths)
  })

  it('exposes the bare hosts for allowlists keyed on hostname', () => {
    for (const origin of RECOGNIZED_ORIGINS) {
      expect(RECOGNIZED_HOSTS).toContain(new URL(origin).host)
    }
  })

  it('carries both sides of the move, permanently', () => {
    // 109 archived dates record doug-march.com as the host that served them.
    // Dropping it from this list would strand every one of them.
    expect(RECOGNIZED_ORIGINS).toContain('https://doug-march.com')
    expect(RECOGNIZED_ORIGINS).toContain('https://dougmar.ch')
  })
})

describe('matchOrigin', () => {
  it('matches a bare origin and any path under it', () => {
    for (const origin of RECOGNIZED_ORIGINS) {
      expect(matchOrigin(origin)).toBe(origin)
      expect(matchOrigin(`${origin}/`)).toBe(origin)
      expect(matchOrigin(`${origin}/about`)).toBe(origin)
      expect(matchOrigin(`${origin}?utm=1`)).toBe(origin)
      expect(matchOrigin(`${origin}#work`)).toBe(origin)
    }
  })

  it('refuses a host that merely BEGINS with one of ours', () => {
    // The bug this function exists to prevent. A bare startsWith matched all
    // of these, and the seal then collapsed them into the snapshot as though
    // they were our own pages.
    expect(matchOrigin('https://doug-march.com.evil.example/about')).toBeNull()
    expect(matchOrigin('https://doug-march.community')).toBeNull()
    expect(matchOrigin('https://dougmar.church')).toBeNull()
    expect(matchOrigin('https://dougmar.chat/x')).toBeNull()
  })

  it('refuses an unrelated origin', () => {
    expect(matchOrigin('https://example.com/about')).toBeNull()
    expect(matchOrigin('/about')).toBeNull()
    expect(matchOrigin('mailto:hello@example.com')).toBeNull()
  })

  it('does not match on scheme alone', () => {
    expect(matchOrigin('https://')).toBeNull()
  })
})
