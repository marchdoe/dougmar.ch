// app/types/archive-record.ts
// The shape of archive/{date}/record.json, decided on issue #153 and written by
// scripts/utils/archive-record.js. Blocks lifted from a build's own artifacts
// keep their native snake_case; fields this project authors are camelCase.

import type { Run } from '../lib/archive-run'

/** Anything that survives a JSON round-trip. Server functions validate that
 * every field they return is serializable, so lifted blocks are typed as data
 * rather than as `unknown`. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export interface ArchiveTokens {
  colors: {
    /** Raw scales: `{ orange: { 500: '#F05428' } }` */
    ramps: Record<string, Record<string, string>>
    /** Semantic colors, whose values are condition maps: `{ base, _light }` */
    semantic: Record<string, Record<string, string> | string>
  }
  /** Every other token group the preset carried — varies by era. */
  [group: string]: JsonValue | ArchiveTokens['colors']
}

export interface ArchiveCost {
  total_usd: number | null
  estimated: boolean
  partial: boolean
  calls: number
  retries: number
  byAgent: JsonValue[]
}

export interface ArchiveRecord {
  date: string
  /** Stratum the build belongs to: prose → logged → traced → … → grammar. */
  era: string | null
  generatedAt: string
  buildId: string | null
  /** How many builds that day took. Nine dates needed more than one. */
  attempts: number

  brief: string | null
  rationale: string | null
  filesChanged: string[]
  /** One of the eight names the site was built on until 2026-08-23. */
  legacyArchetype: string | null

  signals: Record<string, JsonValue> | null
  hero: { copy: string | null; rationale: string | null; source: string | null }
  chassis: string | null
  /** The Art Director's brief, keyed by section. Keys differ by era. */
  adBrief: Record<string, string> | null
  tokens: ArchiveTokens | null

  colorScheme: Record<string, JsonValue> | null
  shell: Record<string, JsonValue> | null
  verdicts: JsonValue[] | null
  composition: Record<string, JsonValue> | null
  lane: Record<string, JsonValue> | null
  cost: ArchiveCost | null
  /** Whether the surface gate's measurements all completed (#565). Absent or
   * null on every record written before it existed; only `ran: false` is a
   * fault. */
  surfaceGate?: { ran: boolean; error: string | null; round: number | null } | null
}

/**
 * The wire shape of `public/archive-data/{date}.json`, written by
 * `scripts/generate-archive-json.js` as `{ ...record, hasScreenshot, pages,
 * uniqueness, run }`. Distinct from `TraceDetail` in
 * `app/server/archive-detail-impl.ts`, which is a dev-only payload (it adds
 * the build's trace instead of `pages`/`uniqueness`) served to the dev panel,
 * never to this file's fetch.
 */
export interface ArchiveDetail extends ArchiveRecord {
  hasScreenshot: boolean
  pages: number
  /** Composite novelty score against the preceding window, or null when
   * nothing about the day was comparable. Not rendered today, so kept as
   * data rather than a fully modeled shape. */
  uniqueness: JsonValue | null
  /** The build's trace and cost, lifted for the stage view (#415). Null when
   * the day has no trace, which is every day before 2026-03-29. */
  run: Run | null
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** The two fields `generate-archive-json.js` adds beyond `ArchiveRecord`
 * that aren't optional — `uniqueness` legitimately comes and goes. */
function hasWireFields(v: Record<string, unknown>): boolean {
  return typeof v.hasScreenshot === 'boolean' && typeof v.pages === 'number'
}

/**
 * Narrows a parsed fetch response to `ArchiveDetail`. `{}` and `null` both
 * pass a bare `typeof x === 'object'` check, and a record missing `tokens`
 * would otherwise reach `detail.tokens.colors.ramps` and throw.
 */
export function isArchiveDetail(value: unknown): value is ArchiveDetail {
  if (!isObjectRecord(value)) return false
  return typeof value.date === 'string' && 'tokens' in value && hasWireFields(value)
}

/** One entry of `public/archive-data/index.json`. */
export interface ArchiveIndexEntry {
  date: string
  era: string | null
  brief: string | null
  legacyArchetype: string | null
  chassis: string | null
  buildId: string | null
  attempts: number
  moodWord: string | null
  primaryHue: { h: number; s: number; l: number; name?: string } | null
  hasScreenshot: boolean
  /**
   * Pages of preserved site under public/archive/<date>/. Zero means the record
   * survived but the capture did not — three dates in the prose era — and the
   * calendar sends that cell to the explainer rather than to a design that is
   * not there.
   */
  pages: number
  cost: { totalUsd: number | null; estimated: boolean; retries: number } | null
  rating: { grade: string; worked: string; didnt: string; try: string } | null
}
