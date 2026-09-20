import { describe, expect, it } from 'vitest'

import {
  asRecord,
  asString,
  briefSections,
  formatDate,
  pairs,
  ramps,
  readColor,
} from '../../app/lib/archive-explainer'
import type { ArchiveTokens } from '../../app/types/archive-record'

function tokens(over: Record<string, unknown> = {}): ArchiveTokens {
  return {
    colors: { ramps: {}, semantic: {} },
    ...over,
  } as ArchiveTokens
}

describe('asRecord / asString', () => {
  it('asRecord returns the object or null', () => {
    const obj = { a: 1 }
    expect(asRecord(obj)).toBe(obj)
    expect(asRecord([1])).toBeNull()
    expect(asRecord(null)).toBeNull()
    expect(asRecord('x')).toBeNull()
  })

  it('asString keeps strings, including empty ones, and drops the rest', () => {
    expect(asString('amber')).toBe('amber')
    expect(asString('')).toBe('')
    expect(asString(4)).toBeNull()
    expect(asString({ name: 'x' })).toBeNull()
    expect(asString(undefined)).toBeNull()
  })
})

describe('ramps', () => {
  it('is empty without tokens', () => {
    expect(ramps(null)).toEqual([])
  })

  it('keeps a scale as a scale, one swatch per stop', () => {
    const t = tokens({
      colors: { ramps: { orange: { '500': '#F05428', '600': '#C0431F' } }, semantic: {} },
    })
    expect(ramps(t)).toEqual([
      {
        name: 'orange',
        stops: [
          { name: '500', hex: '#F05428' },
          { name: '600', hex: '#C0431F' },
        ],
      },
    ])
  })

  it('reads a one-off string as one swatch, not one per character', () => {
    const t = tokens({ colors: { ramps: { glow: '#FF8FC7' }, semantic: {} } })
    expect(ramps(t)).toEqual([{ name: 'glow', stops: [{ name: 'glow', hex: '#FF8FC7' }] }])
  })

  it('drops non-string stops and any ramp left with none', () => {
    const t = tokens({
      colors: {
        ramps: { mixed: { '100': '#111111', '200': 7 }, broken: { '100': 7 }, nothing: null },
        semantic: {},
      },
    })
    expect(ramps(t)).toEqual([{ name: 'mixed', stops: [{ name: '100', hex: '#111111' }] }])
  })

  it('is empty when the colors block is missing or the wrong shape', () => {
    expect(ramps({} as ArchiveTokens)).toEqual([])
    expect(ramps(tokens({ colors: 'teal' }))).toEqual([])
    expect(ramps(tokens({ colors: { ramps: [] } }))).toEqual([])
  })
})

describe('pairs', () => {
  it('flattens a group to name/value pairs', () => {
    const t = tokens({ fonts: { body: 'IBM Plex Sans', display: 'Archivo' } })
    expect(pairs(t, 'fonts')).toEqual([
      { name: 'body', value: 'IBM Plex Sans' },
      { name: 'display', value: 'Archivo' },
    ])
  })

  it('skips values that are not strings', () => {
    const t = tokens({ fontSizes: { sm: '14px', lg: 18, xl: { value: '22px' } } })
    expect(pairs(t, 'fontSizes')).toEqual([{ name: 'sm', value: '14px' }])
  })

  it('is empty when the era had no such group, or it is not an object', () => {
    expect(pairs(null, 'fonts')).toEqual([])
    expect(pairs(tokens(), 'fonts')).toEqual([])
    expect(pairs(tokens({ fonts: 'Archivo' }), 'fonts')).toEqual([])
    expect(pairs(tokens({ fonts: ['Archivo'] }), 'fonts')).toEqual([])
    expect(pairs(tokens({ fonts: null }), 'fonts')).toEqual([])
  })
})

describe('briefSections', () => {
  it('is empty without a brief', () => {
    expect(briefSections(null)).toEqual([])
  })

  it('names known keys and passes unknown ones through', () => {
    expect(
      briefSections({ visualSpecification: 'Dark.', selfCheck: 'Passed.', invented: 'Extra.' })
    ).toEqual([
      { heading: 'Visual specification', body: 'Dark.' },
      { heading: 'Self-check', body: 'Passed.' },
      { heading: 'invented', body: 'Extra.' },
    ])
  })

  it('drops sections that are blank or not strings', () => {
    const brief = { mood: '   ', rationale: 'Because.', paletteDirection: 4 } as unknown as Record<
      string,
      string
    >
    expect(briefSections(brief)).toEqual([{ heading: 'Rationale', body: 'Because.' }])
  })
})

describe('formatDate', () => {
  it('spells the day out', () => {
    expect(formatDate('2026-09-19')).toBe('Saturday, September 19, 2026')
    expect(formatDate('2026-01-01')).toBe('Thursday, January 1, 2026')
  })
})

describe('readColor', () => {
  it('reads a day with no color scheme as absent', () => {
    expect(readColor(null)).toEqual({
      present: false,
      mood: null,
      name: null,
      hsl: null,
      story: null,
    })
    expect(readColor('teal').present).toBe(false)
    expect(readColor([]).present).toBe(false)
  })

  it('reads a full scheme', () => {
    const color = readColor({
      mood_word: 'candlelit',
      color_story: 'Amber against ink.',
      primary_hue: { h: 35, s: 95, l: 48, name: 'amber gold' },
    })
    expect(color).toEqual({
      present: true,
      mood: 'candlelit',
      name: 'amber gold',
      hsl: 'hsl(35 95% 48%)',
      story: 'Amber against ink.',
    })
  })

  it('names the color by its hsl string when the hue has no name', () => {
    const color = readColor({ primary_hue: { h: 200, s: 50, l: 40 } })
    expect(color.name).toBe('hsl(200 50% 40%)')
    expect(color.hsl).toBe('hsl(200 50% 40%)')
  })

  it('has no swatch when a channel is missing or not a number', () => {
    expect(readColor({ primary_hue: { h: 200, s: '50', l: 40, name: 'blue' } })).toMatchObject({
      hsl: null,
      name: 'blue',
    })
    expect(readColor({ primary_hue: { h: 200 } })).toMatchObject({ hsl: null, name: null })
  })

  it('never hands back an object where a string belongs', () => {
    const color = readColor({
      mood_word: { word: 'candlelit' },
      color_story: ['a', 'b'],
      primary_hue: { h: 1, s: 2, l: 3, name: { en: 'red' } },
    })
    expect(color.mood).toBeNull()
    expect(color.story).toBeNull()
    expect(color.name).toBe('hsl(1 2% 3%)')
  })

  it('treats an empty story as none', () => {
    expect(readColor({ color_story: '' }).story).toBeNull()
  })
})
