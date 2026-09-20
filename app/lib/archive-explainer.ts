import type { ArchiveTokens } from '../types/archive-record'
import { isRecord } from './guards'

/**
 * The readers behind the explainer page (/how/<date>).
 *
 * A record is data that survived a JSON round trip, and `ArchiveDetail` says
 * what each field should be, not what a given day's file holds. These take
 * `unknown` where the type is looser than the data can be, so a field of the
 * wrong shape reads as absent instead of reaching React as an object child.
 */

export interface Swatch {
  name: string
  hex: string
}

export interface Ramp {
  name: string
  stops: Swatch[]
}

export interface Pair {
  name: string
  value: string
}

export interface BriefSection {
  heading: string
  body: string
}

/** The value as a plain object, or null for anything else. */
export function asRecord(value: unknown): Record<string, unknown> | null {
  return isRecord(value) ? value : null
}

/** A string, or null for anything else. An empty string is still a string. */
export function asString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

/**
 * Ramps kept as ramps, so a scale reads as a scale rather than a pile.
 *
 * Not every color token is a ramp: a one-off like `glow: { value: '#FF8FC7' }`
 * unwraps to a bare string, and iterating that yields one swatch per character.
 */
export function ramps(tokens: ArchiveTokens | null): Ramp[] {
  const scales = asRecord(asRecord(tokens?.colors)?.ramps)
  if (!scales) return []
  const out: Ramp[] = []
  for (const [name, stops] of Object.entries(scales)) {
    if (typeof stops === 'string') {
      out.push({ name, stops: [{ name, hex: stops }] })
      continue
    }
    const scale = Object.entries(asRecord(stops) ?? {})
      .filter((e): e is [string, string] => typeof e[1] === 'string')
      .map(([stop, hex]) => ({ name: stop, hex }))
    if (scale.length) out.push({ name, stops: scale })
  }
  return out
}

/** A token group flattened to name/value pairs, or [] when the era had none. */
export function pairs(tokens: ArchiveTokens | null, group: string): Pair[] {
  const block = asRecord(tokens?.[group])
  if (!block) return []
  return Object.entries(block)
    .filter((entry): entry is [string, string] => typeof entry[1] === 'string')
    .map(([name, value]) => ({ name, value }))
}

/** The Art Director's headings, which changed vocabulary in 2026-05. */
const BRIEF_LABELS: Record<string, string> = {
  visualSpecification: 'Visual specification',
  signalIntegration: 'Signal integration',
  selfCheck: 'Self-check',
  rationale: 'Rationale',
  compositionRationale: 'Composition rationale',
  mood: 'Mood',
  compositionDirection: 'Composition direction',
  typographyDirection: 'Typography direction',
  paletteDirection: 'Palette direction',
}

export function briefSections(adBrief: Record<string, string> | null): BriefSection[] {
  if (!adBrief) return []
  return Object.entries(adBrief)
    .filter(([, bodyText]) => typeof bodyText === 'string' && bodyText.trim())
    .map(([key, bodyText]) => ({ heading: BRIEF_LABELS[key] ?? key, body: bodyText }))
}

export function formatDate(date: string): string {
  try {
    return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return date
  }
}

/** What step 03 and the rail show of a day's color direction. */
export interface ColorRead {
  /** False when the record has no color scheme at all. */
  present: boolean
  mood: string | null
  /** The hue's name, or its hsl() string when the record names none. */
  name: string | null
  /** `hsl(h s% l%)` when the primary hue carries all three numbers. */
  hsl: string | null
  story: string | null
}

export function readColor(colorScheme: unknown): ColorRead {
  const scheme = asRecord(colorScheme)
  const hue = asRecord(scheme?.primary_hue)
  const hsl =
    hue && typeof hue.h === 'number' && typeof hue.s === 'number' && typeof hue.l === 'number'
      ? `hsl(${hue.h} ${hue.s}% ${hue.l}%)`
      : null
  const story = asString(scheme?.color_story)
  return {
    present: scheme !== null,
    mood: asString(scheme?.mood_word),
    name: asString(hue?.name) ?? hsl,
    hsl,
    story: story || null,
  }
}
