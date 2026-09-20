/**
 * Calendar arithmetic and cell decisions — #157.
 *
 * Kept out of the component because these are the parts with real answers:
 * which month opens, what a cell links to, and whether its ink is black or
 * white. The last one is not a matter of taste and was wrong in the prototype.
 */

import { contrastRatio } from '../../scripts/utils/contrast.js'
import type { ArchiveIndexEntry } from '../types/archive-record'

/** Channels on a 0 to 255 scale, the shape `contrastRatio` takes. */
interface Rgb {
  r: number
  g: number
  b: number
}

export type CellState = 'built' | 'record' | 'empty'

export interface Cell {
  date: string
  day: number
  state: CellState
  entry: ArchiveIndexEntry | null
}

export const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const

/**
 * Stable keys for the weekday header.
 *
 * The initials repeat — two S and two T — so the letters cannot key a list.
 */
export const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const

/** `2026-06` for a date or a month key. */
export const monthOf = (date: string) => date.slice(0, 7)

export function daysInMonth(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

/** Weekday the 1st falls on, 0 = Sunday, used to pad the grid. */
export function firstWeekday(ym: string): number {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).getDay()
}

export function monthLabel(ym: string): string {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

/** Every month between the first and last build, including ones with no builds. */
export function monthsSpanned(entries: ArchiveIndexEntry[]): string[] {
  if (entries.length === 0) return []
  const sorted = [...entries].map((e) => e.date).sort()
  const [startY, startM] = monthOf(sorted[0]).split('-').map(Number)
  const [endY, endM] = monthOf(sorted[sorted.length - 1])
    .split('-')
    .map(Number)

  const out: string[] = []
  for (let y = startY, m = startM; y < endY || (y === endY && m <= endM); ) {
    out.push(`${y}-${String(m).padStart(2, '0')}`)
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return out
}

/**
 * The newest archived day, which is what a visitor came to see (#414).
 *
 * The calendar used to open on the month with the highest share of days
 * built, so June, at 30 of 30, would have won forever and September never
 * appeared without three presses of Next. A sparse month with last night's
 * square lit is still the right landing; the All view is one click away.
 */
export function newestDate(entries: ArchiveIndexEntry[]): string | null {
  let newest: string | null = null
  for (const e of entries) if (newest === null || e.date > newest) newest = e.date
  return newest
}

/** The month the calendar opens on: the newest day's, or null with nothing built. */
export function newestMonth(entries: ArchiveIndexEntry[]): string | null {
  const newest = newestDate(entries)
  return newest ? monthOf(newest) : null
}

/**
 * Where a cell goes.
 *
 * A day with preserved pages opens the design it shipped. A day with a record
 * and no capture has no design to open, so it goes to the explainer — which is
 * the whole reason `pages` is carried in the index.
 */
export function hrefFor(entry: ArchiveIndexEntry): string {
  return entry.pages > 0 ? `/archive/${entry.date}/` : `/how/${entry.date}`
}

export function stateFor(entry: ArchiveIndexEntry | undefined): CellState {
  if (!entry) return 'empty'
  return entry.pages > 0 ? 'built' : 'record'
}

/** The ground of a day with no recorded color. */
const NEUTRAL = '#3a3a42'

/** `hsl(...)` for a day's hue, or a neutral for the 31 dates with no color recorded. */
export function swatchFor(entry: ArchiveIndexEntry): string {
  if (!entry.primaryHue) return NEUTRAL
  const { h, s, l } = entry.primaryHue
  return `hsl(${h} ${s}% ${l}%)`
}

const LIGHT = '#f2f2f4'
const DARK = '#0e0e10'
const WHITE = '#ffffff'
const BLACK = '#000000'

/** WCAG AA for small text. */
const MIN_INK_CONTRAST = 4.5

function hexToRgb(hex: string): Rgb {
  const channel = (i: number) => Number.parseInt(hex.slice(i, i + 2), 16)
  return { r: channel(1), g: channel(3), b: channel(5) }
}

/** The 8-bit sRGB a browser paints for `hsl(h s% l%)`, so the ratio is the one on screen. */
function hslToRgb(h: number, s: number, l: number): Rgb {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    return Math.round(255 * (l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))))
  }
  return { r: channel(0), g: channel(8), b: channel(4) }
}

function groundOf(entry: ArchiveIndexEntry | null): Rgb {
  if (!entry?.primaryHue) return hexToRgb(NEUTRAL)
  const { h, s, l } = entry.primaryHue
  return hslToRgb(h, s, l)
}

function strongest(inks: readonly string[], ground: Rgb): { ink: string; ratio: number } {
  return inks
    .map((ink) => ({ ink, ratio: contrastRatio(hexToRgb(ink), ground) }))
    .reduce((best, next) => (next.ratio > best.ratio ? next : best))
}

/**
 * The ink with the most contrast over a day's color. The archive's own pair
 * comes first. Between the two, a mid-luminance hue (relative luminance about
 * 0.16 to 0.19: 2026-05-16, 05-24, 06-01 and four more) reaches only 4.2 to
 * 4.4:1 with either, so those fall back to pure white or black, which clear
 * 4.5:1 for every possible ground (the worst case, luminance 0.179, is 4.58).
 */
function inkOn(ground: Rgb): { ink: string; ratio: number } {
  const own = strongest([LIGHT, DARK], ground)
  return own.ratio >= MIN_INK_CONTRAST ? own : strongest([WHITE, BLACK], ground)
}

/**
 * Ink over a day's hue, chosen by measured contrast.
 *
 * Lightness is the wrong measure and the prototype used it: `l > 55` puts white
 * on saturated yellow-greens, where it is unreadable. The first fix put a
 * luminance line at 0.35, which left white on orange and sky blue at 2.1 to
 * 2.6:1. The crossover between these two inks is luminance 0.176, so this
 * compares the two ratios directly, using the WCAG helpers the surface gate
 * uses.
 */
export function inkFor(entry: ArchiveIndexEntry | null): string {
  return inkOn(groundOf(entry)).ink
}

/** The contrast ratio `inkFor` reaches on that day's color. */
export function inkContrast(entry: ArchiveIndexEntry | null): number {
  return inkOn(groundOf(entry)).ratio
}

/** One month's grid: leading blanks, then every day of the month. */
export function cellsFor(ym: string, entries: ArchiveIndexEntry[]): (Cell | null)[] {
  const byDate = new Map(entries.map((e) => [e.date, e]))
  const pad = firstWeekday(ym)
  const total = daysInMonth(ym)

  const cells: (Cell | null)[] = Array.from({ length: pad }, () => null)
  for (let day = 1; day <= total; day += 1) {
    const date = `${ym}-${String(day).padStart(2, '0')}`
    const entry = byDate.get(date)
    cells.push({ date, day, state: stateFor(entry), entry: entry ?? null })
  }
  return cells
}

/** What a cell says under its number: the day's mood, else its archetype. */
export function cellLabel(entry: ArchiveIndexEntry): string | null {
  return entry.moodWord ?? entry.legacyArchetype ?? null
}
