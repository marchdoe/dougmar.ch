import { describe, expect, it } from 'vitest'
import { resumeExperience } from '../../app/content/resume'
import { capabilities, education, timeline } from '../../app/content/timeline'

/**
 * /about reads timeline.ts, and timeline.ts is the résumé reshaped (#638). The
 * engineer's components bind these fields, so the shape is a contract: one
 * signal per fact, or a component that adds its own "to present" for an open
 * range prints it twice ("2025 to present to present", 2026-09-21).
 */
describe('timeline.ts, the résumé as /about binds it', () => {
  it('has one entry per résumé role, in the résumé order, with the résumé titles', () => {
    expect(timeline).toHaveLength(resumeExperience.length)
    expect(timeline.map((t) => [t.company, t.role])).toEqual(
      resumeExperience.map((r) => [r.company, r.title])
    )
    expect(timeline.every((t) => t.role !== '')).toBe(true)
  })

  it('writes each year out in full, with no dash and no separate open-range flag', () => {
    for (const entry of timeline) {
      expect(entry.year, entry.company).toMatch(/^\d{4}( to (\d{4}|present))?$/)
      expect(entry, entry.company).not.toHaveProperty('current')
    }
    expect(timeline[0].year).toBe('2025 to present')
    expect(timeline.find((t) => t.company === 'Spaceman LLC')?.year).toBe('2018 to present')
    expect(timeline.find((t) => t.company === 'The Atlantic')?.year).toBe('2018')
  })

  it('carries the acquisition note, the bullets and the technologies through', () => {
    const parallel = timeline.find((t) => t.company === 'Parallel Markets')
    expect(parallel?.description).toMatch(/^Acquired by iCapital/)
    expect(timeline.every((t) => Array.isArray(t.bullets))).toBe(true)
    expect(timeline[0].technologies).toContain('React')
  })

  it('exports the education block and a flat capabilities list', () => {
    expect(education).toMatchObject({ school: 'The University of Dayton', years: '' })
    expect(capabilities.length).toBeGreaterThan(8)
    expect(capabilities.every((c) => typeof c === 'string' && c !== '')).toBe(true)
  })
})
