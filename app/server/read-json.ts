// app/server/read-json.ts
import { existsSync, readFileSync } from 'node:fs'

/**
 * Read a JSON file and hand it back only if it is the shape the caller asked
 * for. Missing file, unparseable file, and wrong shape all collapse to null,
 * because every caller here treats "no usable record" the same way.
 *
 * app/types/archive-record.ts says server functions validate every field they
 * return. Nothing did: three copies of `JSON.parse(readFileSync(p)) as T`
 * asserted the shape and moved on, so a truncated write or a schema change
 * surfaced as a TypeError in a component rather than a skipped day here.
 */
export function readJson<T>(path: string, guard: (value: unknown) => value is T): T | null {
  if (!existsSync(path)) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return null
  }
  return guard(parsed) ? parsed : null
}
