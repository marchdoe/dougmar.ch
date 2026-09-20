/**
 * Flatten Panda presets into the token lists /elements prints.
 *
 * The page used to carry its own copy of the palette, the type ramp and the
 * spacing scale. The pipeline rewrites `elements/preset.ts` and
 * `elements/chassis-preset.ts` every night, so the copy was wrong the morning
 * after it was typed (#552). This reads the same two objects Panda reads, so
 * the table can only show what the build was given.
 *
 * Shapes handled, because the nightly writes both: tokens directly under
 * `theme`, and under `theme.extend`. Leaves are `{ value }`; a `DEFAULT` key
 * names its parent; a semantic value may be `{colors.teal.400}` or a
 * `{ base, _dark }` condition map, of which `base` is the one shown.
 *
 * Later presets win per token path, the order `presets` has in panda.config.ts.
 */

type Rec = Record<string, unknown>

export type TokenRow = {
  /** The Panda token name, as css() takes it: `teal.400`, `2xl`, `3`. */
  name: string
  /** The value to print. For a semantic colour, the hex after following references. */
  value: string
  /** The raw reference a semantic token was written as, when it was one. */
  ref?: string
  /** False when a semantic reference points at a token the preset does not define. */
  defined: boolean
}

export type ColorScale = { scale: string; steps: TokenRow[] }

export type PresetTokens = {
  semanticColors: TokenRow[]
  primitiveColors: ColorScale[]
  fontSizes: TokenRow[]
  fontWeights: TokenRow[]
  letterSpacings: TokenRow[]
  spacing: TokenRow[]
}

const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v)

/** A token value as a string. Condition maps give up their `base`. */
function scalar(v: unknown): string | undefined {
  if (typeof v === 'string') return v
  if (typeof v === 'number') return String(v)
  if (isRec(v)) return scalar(v.base ?? v.DEFAULT)
  return undefined
}

function flatten(node: unknown, path: string[], out: Map<string, string>): void {
  if (!isRec(node)) return
  if ('value' in node) {
    const value = scalar(node.value)
    if (value !== undefined && path.length > 0) out.set(path.join('.'), value)
    return
  }
  for (const [key, child] of Object.entries(node)) {
    flatten(child, key === 'DEFAULT' ? path : [...path, key], out)
  }
}

/** Every category under `theme.<block>` and `theme.extend.<block>`, flat by `category.path`. */
function collect(preset: unknown, block: 'tokens' | 'semanticTokens', into: Map<string, string>) {
  if (!isRec(preset) || !isRec(preset.theme)) return
  const { theme } = preset
  const sources = [theme[block], isRec(theme.extend) ? theme.extend[block] : undefined]
  for (const source of sources) flatten(source, [], into)
}

const REF = /^\{([^}]+)\}$/

export function collectPresetTokens(presets: readonly unknown[]): PresetTokens {
  const raw = new Map<string, string>()
  const semantic = new Map<string, string>()
  for (const preset of presets) {
    collect(preset, 'tokens', raw)
    collect(preset, 'semanticTokens', semantic)
  }

  /** Follow `{colors.x.y}` references to a literal, or undefined if the chain breaks. */
  const resolve = (value: string, depth = 0): string | undefined => {
    const ref = REF.exec(value)
    if (!ref) return value
    if (depth > 8) return undefined
    const next = raw.get(ref[1]) ?? semantic.get(ref[1])
    return next === undefined ? undefined : resolve(next, depth + 1)
  }

  const category = (name: string, source: Map<string, string>): TokenRow[] => {
    const prefix = `${name}.`
    const rows: TokenRow[] = []
    for (const [path, value] of source) {
      if (!path.startsWith(prefix)) continue
      const resolved = resolve(value)
      rows.push({
        name: path.slice(prefix.length),
        value: resolved ?? value,
        ref: REF.test(value) ? value : undefined,
        defined: resolved !== undefined,
      })
    }
    return rows
  }

  const scales = new Map<string, TokenRow[]>()
  for (const row of category('colors', raw)) {
    const [scale, ...rest] = row.name.split('.')
    const steps = scales.get(scale) ?? []
    steps.push({ ...row, name: rest.length > 0 ? row.name : scale })
    scales.set(scale, steps)
  }

  return {
    semanticColors: category('colors', semantic),
    primitiveColors: [...scales].map(([scale, steps]) => ({ scale, steps })),
    fontSizes: category('fontSizes', raw),
    fontWeights: category('fontWeights', raw),
    letterSpacings: category('letterSpacings', raw),
    spacing: category('spacing', raw),
  }
}
