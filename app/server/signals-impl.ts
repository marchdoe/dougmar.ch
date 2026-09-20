// app/server/signals-impl.ts
// Pure implementation — no server function wrappers, safe to import in tests
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import * as yaml from 'js-yaml'
import { isRecord } from '../lib/guards'

const SIGNALS_PATH = resolve(process.cwd(), 'signals/today.yml')

/**
 * Parse today.yml into an object, or say why it could not be.
 *
 * `yaml.load` returns undefined for an empty file and a string for a scalar
 * one, and both were cast straight to Record<string, unknown>. An empty
 * today.yml — which is exactly what a half-finished collector run leaves —
 * made the next property read throw a TypeError that the dev middleware
 * reported as `{ error: "TypeError: Cannot read properties of undefined" }`.
 */
function loadSignalsFile(path: string): Record<string, unknown> {
  const parsed = yaml.load(readFileSync(path, 'utf8'))
  if (!isRecord(parsed)) {
    throw new Error(`${path} did not parse to a YAML mapping (got ${typeof parsed})`)
  }
  return parsed
}

export function _readSignalsHandler(path = SIGNALS_PATH): Record<string, unknown> {
  const data = loadSignalsFile(path)
  // js-yaml parses bare YYYY-MM-DD dates as Date objects — normalize to string
  if (data.date instanceof Date) {
    data.date = data.date.toISOString().slice(0, 10)
  }
  return data
}

export function _saveOverridesHandler(
  data: { moodOverride: string | null; notes: string | null },
  path = SIGNALS_PATH
): void {
  const signals = loadSignalsFile(path)
  // Both fields use ?? so an intentional empty string survives as an empty
  // string. `notes || null` quietly turned "" into null, which reads as
  // "never set" rather than "cleared".
  signals.mood_override = data.moodOverride ?? null
  signals.notes = data.notes ?? null
  writeFileSync(path, yaml.dump(signals), 'utf8')
}
