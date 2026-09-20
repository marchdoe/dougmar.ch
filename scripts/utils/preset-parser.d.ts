// Hand-written declarations for preset-parser.js so TS test files can import
// parsePreset without allowJs. Keep in sync with the JS export.

/**
 * The token record of a preset.ts: colour ramps and semantic colours under
 * `colors`, and every other token group as a flat name-to-value map.
 */
export function parsePreset(src: string): Record<string, Record<string, unknown>>
