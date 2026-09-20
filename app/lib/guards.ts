/**
 * Type guards shared by client and server code. No Node imports, so a route
 * or component can use them; app/server/read-json.ts cannot serve that role
 * because it pulls in node:fs.
 */

/** A plain object: not an array, not null, not a primitive. */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
