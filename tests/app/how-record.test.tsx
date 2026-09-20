// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HowLoading, HowMissing } from '../../app/components/how/HowNotice'
import { HowRecord } from '../../app/components/how/HowRecord'
import type { ArchiveDetail } from '../../app/types/archive-record'

/**
 * The explainer's parts, rendered from a record. The page used to hold all of
 * this in one function that read `colorScheme.mood_word` and `primary_hue.name`
 * as strings whatever they held; these pin the shapes a day's file can have
 * that are not the shape the type promises.
 */

function record(over: Record<string, unknown> = {}): ArchiveDetail {
  return {
    date: '2026-09-19',
    era: 'grammar',
    generatedAt: '2026-09-19T05:00:00Z',
    buildId: '1789000000000',
    attempts: 2,
    brief: 'A quiet page about ink.',
    rationale: null,
    filesChanged: ['app/routes/index.tsx'],
    legacyArchetype: null,
    signals: null,
    hero: { copy: null, rationale: null, source: null },
    chassis: 'spectral-albert',
    adBrief: null,
    tokens: {
      colors: { ramps: { ink: { '500': '#111111' } }, semantic: {} },
      fonts: { body: 'IBM Plex Sans' },
    },
    colorScheme: {
      mood_word: 'candlelit',
      color_story: 'Amber against ink.',
      primary_hue: { h: 35, s: 95, l: 48, name: 'amber gold' },
    },
    shell: null,
    verdicts: null,
    composition: { grid: 'two-column' },
    lane: { name: 'editorial' },
    cost: null,
    hasScreenshot: true,
    pages: 9,
    uniqueness: null,
    run: null,
    ...over,
  } as ArchiveDetail
}

describe('HowRecord', () => {
  afterEach(cleanup)

  it('renders the six steps in order under the date', () => {
    render(<HowRecord date="2026-09-19" detail={record()} />)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Saturday, September 19, 2026'
    )
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual([
      'The day arrived',
      'A brief was written',
      'A color was chosen',
      'Tokens were generated',
      'A composition was decided',
      'It was built',
    ])
    expect(document.body.textContent).toContain('A quiet page about ink.')
    expect(document.body.textContent).toContain('Amber against ink.')
    expect(document.body.textContent).toContain('two-column')
    expect(document.querySelector('a[href="/archive/2026-09-19/"]')).not.toBeNull()
  })

  it('offers no design to open when the pages did not survive', () => {
    render(<HowRecord date="2026-09-19" detail={record({ pages: 0 })} />)
    expect(document.querySelector('a[href="/archive/2026-09-19/"]')).toBeNull()
    expect(document.body.textContent).toContain('There is no design to open.')
    expect(document.body.textContent).toContain('none — the capture did not survive')
  })

  it('says what the era could not record rather than showing an empty step', () => {
    const early = record({
      era: 'prose',
      colorScheme: null,
      composition: null,
      lane: null,
      tokens: null,
    })
    render(<HowRecord date="2026-03-12" detail={early} />)
    expect(screen.getAllByText(/had no such concept in the prose era/).length).toBeGreaterThan(0)
  })

  it('reads a mood, hue name, or story of the wrong type as absent instead of throwing', () => {
    const odd = record({
      colorScheme: {
        mood_word: { word: 'candlelit' },
        color_story: ['a', 'b'],
        primary_hue: { h: 35, s: 95, l: 48, name: { en: 'amber' } },
      },
    })
    expect(() => render(<HowRecord date="2026-09-19" detail={odd} />)).not.toThrow()
    // The color falls back to its hsl() string, and the mood row is left out.
    expect(document.body.textContent).toContain('hsl(35 95% 48%)')
    expect(screen.queryByText('Mood')).toBeNull()
  })

  it('does not throw on a record whose blocks are the wrong shape', () => {
    const odd = record({
      tokens: { colors: 'teal' },
      composition: ['a'],
      lane: 'editorial',
      shell: 7,
      colorScheme: 'teal',
    })
    expect(() => render(<HowRecord date="2026-09-19" detail={odd} />)).not.toThrow()
  })
})

describe('HowNotice', () => {
  afterEach(cleanup)

  it('names the date it has no record for and links back', () => {
    render(<HowMissing date="2020-01-01" />)
    expect(screen.getByText('Nothing archived for 2020-01-01.')).toBeTruthy()
    expect(document.querySelector('a[href="/archive"]')).not.toBeNull()
  })

  it('shows the long date while loading', () => {
    render(<HowLoading date="2026-09-19" />)
    expect(document.body.textContent).toBe('Loading Saturday, September 19, 2026…')
  })
})
