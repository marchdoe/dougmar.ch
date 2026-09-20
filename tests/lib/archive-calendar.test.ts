import { describe, expect, it } from 'vitest'

import {
  cellLabel,
  cellsFor,
  daysInMonth,
  firstWeekday,
  hrefFor,
  inkContrast,
  inkFor,
  monthLabel,
  monthsSpanned,
  newestDate,
  newestMonth,
  stateFor,
  swatchFor,
} from '../../app/lib/archive-calendar'
import type { ArchiveIndexEntry } from '../../app/types/archive-record'
import { contrastRatio } from '../../scripts/utils/contrast.js'

function entry(date: string, over: Partial<ArchiveIndexEntry> = {}): ArchiveIndexEntry {
  return {
    date,
    era: 'grammar',
    brief: 'A brief.',
    legacyArchetype: null,
    chassis: 'spectral-albert',
    buildId: '1',
    attempts: 1,
    moodWord: 'candlelit',
    primaryHue: { h: 35, s: 95, l: 48, name: 'amber gold' },
    hasScreenshot: false,
    pages: 9,
    cost: null,
    rating: null,
    ...over,
  }
}

describe('date arithmetic', () => {
  it('counts days, leap year included', () => {
    expect(daysInMonth('2026-02')).toBe(28)
    expect(daysInMonth('2024-02')).toBe(29)
    expect(daysInMonth('2026-06')).toBe(30)
    expect(daysInMonth('2026-07')).toBe(31)
  })

  it('finds the weekday the month opens on', () => {
    // 2026-06-01 is a Monday.
    expect(firstWeekday('2026-06')).toBe(1)
  })

  it('labels a month for a human', () => {
    expect(monthLabel('2026-06')).toBe('June 2026')
  })
})

describe('monthsSpanned', () => {
  it('includes months with no builds, so the run reads as continuous', () => {
    const entries = [entry('2026-03-12'), entry('2026-06-28')]
    expect(monthsSpanned(entries)).toEqual(['2026-03', '2026-04', '2026-05', '2026-06'])
  })

  it('crosses a year boundary', () => {
    expect(monthsSpanned([entry('2026-11-30'), entry('2027-01-02')])).toEqual([
      '2026-11',
      '2026-12',
      '2027-01',
    ])
  })

  it('is empty when nothing has been built', () => {
    expect(monthsSpanned([])).toEqual([])
  })
})

describe('newestDate', () => {
  it('is the latest day, whatever order the index arrives in', () => {
    const entries = [
      entry('2026-06-02'),
      entry('2026-09-02'),
      entry('2026-06-01'),
      entry('2026-08-23'),
    ]
    expect(newestDate(entries)).toBe('2026-09-02')
  })

  it('is null when nothing has been built', () => {
    expect(newestDate([])).toBeNull()
  })

  it('names the month the calendar opens on', () => {
    expect(newestMonth([entry('2026-06-30'), entry('2026-09-02')])).toBe('2026-09')
    expect(newestMonth([])).toBeNull()
  })
})

describe('cell state and destination', () => {
  it('sends a day with a preserved design to the design', () => {
    const e = entry('2026-06-28', { pages: 9 })
    expect(stateFor(e)).toBe('built')
    expect(hrefFor(e)).toBe('/archive/2026-06-28/')
  })

  it('sends a record-only day to the explainer, because there is no design to open', () => {
    // 2026-03-12, 03-14 and 03-15 have a record and no capture.
    const e = entry('2026-03-12', { pages: 0 })
    expect(stateFor(e)).toBe('record')
    expect(hrefFor(e)).toBe('/how/2026-03-12')
  })

  it('treats a day with no entry as dead', () => {
    expect(stateFor(undefined)).toBe('empty')
  })
})

describe('swatchFor', () => {
  it('uses the recorded hue', () => {
    expect(swatchFor(entry('2026-06-28'))).toBe('hsl(35 95% 48%)')
  })

  it('falls back to a neutral on the dates with no color recorded', () => {
    expect(swatchFor(entry('2026-03-20', { primaryHue: null }))).toBe('#3a3a42')
  })
})

describe('inkFor', () => {
  const ink = (h: number, s: number, l: number) => inkFor(entry('x', { primaryHue: { h, s, l } }))

  it('puts dark ink on a saturated yellow-green, where lightness alone fails', () => {
    // The prototype's `l > 55` rule chose white here and it was unreadable.
    expect(ink(75, 90, 50)).toBe('#0e0e10')
    expect(ink(60, 100, 50)).toBe('#0e0e10')
  })

  it('puts light ink on a deep blue', () => {
    expect(ink(220, 80, 30)).toBe('#f2f2f4')
  })

  it('puts dark ink on a pale ground', () => {
    expect(ink(35, 60, 88)).toBe('#0e0e10')
  })

  it('puts light ink on near-black', () => {
    expect(ink(0, 0, 6)).toBe('#f2f2f4')
  })

  it('defaults to light ink when no color was recorded', () => {
    expect(inkFor(entry('x', { primaryHue: null }))).toBe('#f2f2f4')
    expect(inkFor(null)).toBe('#f2f2f4')
  })

  it('puts dark ink on orange and sky blue, where a 0.35 luminance line chose white at 2.1 to 2.4:1', () => {
    // 2026-07-06, 2026-09-16 and 2026-06-18 in the index.
    expect(ink(28, 92, 52)).toBe('#0e0e10')
    expect(ink(28, 88, 52)).toBe('#0e0e10')
    expect(ink(203, 91, 56)).toBe('#0e0e10')
  })

  it('falls back to pure white or black where neither of the archive inks reaches 4.5:1', () => {
    // Luminance 0.163 to 0.19: the two archive inks top out at 4.2 to 4.4:1 here.
    expect(ink(278, 62, 55)).toBe('#ffffff')
    expect(ink(205, 78, 42)).toBe('#ffffff')
    expect(ink(285, 78, 56)).toBe('#000000')
  })
})

/** hsl to sRGB the long way round, so the test does not share the code's formula. */
function paint(h: number, s: number, l: number) {
  const sat = s / 100
  const light = l / 100
  const chroma = (1 - Math.abs(2 * light - 1)) * sat
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = light - chroma / 2
  const [r, g, b] =
    h < 60
      ? [chroma, x, 0]
      : h < 120
        ? [x, chroma, 0]
        : h < 180
          ? [0, chroma, x]
          : h < 240
            ? [0, x, chroma]
            : h < 300
              ? [x, 0, chroma]
              : [chroma, 0, x]
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  }
}

describe('inkFor reaches 4.5:1 on any recorded color', () => {
  const hex = (value: string) => ({
    r: Number.parseInt(value.slice(1, 3), 16),
    g: Number.parseInt(value.slice(3, 5), 16),
    b: Number.parseInt(value.slice(5, 7), 16),
  })

  it('holds across the whole hue, saturation and lightness range', () => {
    const misses: string[] = []
    for (let h = 0; h < 360; h += 5) {
      for (let s = 0; s <= 100; s += 10) {
        for (let l = 0; l <= 100; l += 2) {
          const e = entry('x', { primaryHue: { h, s, l } })
          const ratio = contrastRatio(hex(inkFor(e)), paint(h, s, l))
          if (ratio < 4.5) misses.push(`hsl(${h} ${s}% ${l}%) ${ratio.toFixed(2)}`)
        }
      }
    }
    expect(misses).toEqual([])
  })

  it('reports the ratio it reached', () => {
    const e = entry('x', { primaryHue: { h: 28, s: 92, l: 52 } })
    expect(inkContrast(e)).toBeCloseTo(contrastRatio(hex(inkFor(e)), paint(28, 92, 52)), 2)
    expect(inkContrast(entry('x', { primaryHue: null }))).toBeGreaterThan(4.5)
  })
})

describe('cellsFor', () => {
  it('pads the grid so the 1st lands on its weekday', () => {
    const cells = cellsFor('2026-06', [])
    // June 1 2026 is a Monday, so one blank for Sunday.
    expect(cells.slice(0, 1)).toEqual([null])
    expect(cells[1]).toMatchObject({ day: 1, date: '2026-06-01', state: 'empty' })
    expect(cells).toHaveLength(1 + 30)
  })

  it('marks each day with what the archive has for it', () => {
    const cells = cellsFor('2026-06', [
      entry('2026-06-02', { pages: 9 }),
      entry('2026-06-03', { pages: 0 }),
    ])
    const byDay = new Map(cells.filter(Boolean).map((c) => [c?.day, c]))
    expect(byDay.get(2)).toMatchObject({ state: 'built' })
    expect(byDay.get(3)).toMatchObject({ state: 'record' })
    expect(byDay.get(4)).toMatchObject({ state: 'empty', entry: null })
  })
})

describe('cellLabel', () => {
  it('prefers the day’s mood word', () => {
    expect(cellLabel(entry('x', { moodWord: 'candlelit' }))).toBe('candlelit')
  })

  it('falls back to the archetype in the prose era, where there was no mood', () => {
    expect(cellLabel(entry('x', { moodWord: null, legacyArchetype: 'Poster' }))).toBe('Poster')
  })

  it('says nothing rather than something invented', () => {
    expect(cellLabel(entry('x', { moodWord: null, legacyArchetype: null }))).toBeNull()
  })
})
