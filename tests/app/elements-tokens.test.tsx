// @vitest-environment jsdom
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, it, expect, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { parsePreset } from '../../scripts/utils/preset-parser.js'
import { collectPresetTokens } from '../../app/lib/preset-tokens'
import { Route } from '../../app/routes/elements'

/**
 * /elements printed a table typed in March that matched nothing in the preset
 * (#552). It now walks the preset objects, so what these tests pin down is the
 * one thing that can go wrong again: a row that the preset does not define.
 *
 * The oracle is scripts/utils/preset-parser.js reading the preset files as
 * text, a different route to the same tokens than importing the objects, so a
 * bug in the walker cannot vouch for itself.
 */

const read = (file: string) => readFileSync(path.join(process.cwd(), file), 'utf8')

type Parsed = Record<string, Record<string, unknown>> & {
  colors: {
    ramps: Record<string, Record<string, string> | string>
    semantic: Record<string, string>
  }
}

/**
 * A scale's steps as [path, hex] pairs. A preset may also declare a single
 * colour (`white: { value: '#FFFFFF' }`), which the parser returns as a bare
 * hex; walking that string as an object read it as steps `white.0` to
 * `white.6`, and the night of 2026-09-22 would have failed its verify step.
 */
function colourPaths(scale: string, steps: Record<string, string> | string): [string, string][] {
  if (typeof steps === 'string') return [[scale, steps]]
  return Object.entries(steps).map(([step, hex]) => [`${scale}.${step}`, hex])
}

// Chassis is listed last in panda.config.ts, so it wins per name.
function definedTokens() {
  const elements = parsePreset(read('elements/preset.ts')) as Parsed
  const chassis = parsePreset(read('elements/chassis-preset.ts')) as Parsed
  const merge = (key: string) => ({ ...elements[key], ...chassis[key] })
  const primitive = new Set<string>()
  for (const src of [elements, chassis]) {
    for (const [scale, steps] of Object.entries(src.colors.ramps)) {
      for (const [tokenPath] of colourPaths(scale, steps)) primitive.add(tokenPath)
    }
  }
  return {
    primitive,
    semantic: new Set(Object.keys({ ...elements.colors.semantic, ...chassis.colors.semantic })),
    fontSizes: new Set(Object.keys(merge('fontSizes'))),
    fontWeights: new Set(Object.keys(merge('fontWeights'))),
    letterSpacings: new Set(Object.keys(merge('letterSpacings'))),
    spacing: new Set(Object.keys(merge('spacing'))),
  }
}

describe('/elements token tables', () => {
  afterEach(cleanup)

  it('renders a row for every token the preset defines, and no other', () => {
    const Page = Route.options.component
    if (!Page) throw new Error('/elements has no component')
    const { container } = render(<Page />)
    const shown = (prefix: string) =>
      [...container.querySelectorAll<HTMLElement>(`[data-token-path^="${prefix}."]`)].map((el) =>
        (el.dataset.tokenPath ?? '').slice(prefix.length + 1)
      )
    const expected = definedTokens()

    expect(new Set(shown('colors'))).toEqual(expected.primitive)
    expect(new Set(shown('semantic'))).toEqual(expected.semantic)
    expect(new Set(shown('fontSizes'))).toEqual(expected.fontSizes)
    expect(new Set(shown('fontWeights'))).toEqual(expected.fontWeights)
    expect(new Set(shown('letterSpacings'))).toEqual(expected.letterSpacings)
    expect(new Set(shown('spacing'))).toEqual(expected.spacing)
  })

  it('prints the hex the preset gives each colour, following references', () => {
    const Page = Route.options.component
    if (!Page) throw new Error('/elements has no component')
    const { container } = render(<Page />)
    const elements = parsePreset(read('elements/preset.ts')) as Parsed
    const hexOf = (path: string) =>
      container.querySelector(`[data-token-path="${path}"] [data-token-value]`)?.textContent

    for (const [scale, steps] of Object.entries(elements.colors.ramps)) {
      for (const [tokenPath, hex] of colourPaths(scale, steps)) {
        expect(hexOf(`colors.${tokenPath}`)).toBe(hex)
      }
    }
    // A semantic colour written as `{colors.scale.step}` shows that step's hex.
    // No name is assumed: the night's preset may not use references at all, so
    // this loop is what checks them on the nights that do.
    for (const [name, value] of Object.entries(elements.colors.semantic)) {
      const ref = /^\{colors\.([^.]+)\.([^}]+)\}$/.exec(value)
      const scale = ref ? elements.colors.ramps[ref[1]] : undefined
      if (ref && typeof scale !== 'string') expect(hexOf(`semantic.${name}`)).toBe(scale?.[ref[2]])
      else if (/^#[0-9a-f]{6}$/i.test(value)) expect(hexOf(`semantic.${name}`)).toBe(value)
    }
  })

  it('carries no token value of its own', () => {
    // A table typed into the route is the bug. A hex in this file is a value
    // no preset gave it. Six or eight digits, so an issue number in a comment
    // is not read as one.
    const source = read('app/routes/elements.tsx')
    expect(source).not.toMatch(/#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6})\b/)
    expect(source).not.toMatch(/\bstyle=\{\{/)
  })
})

describe('collectPresetTokens', () => {
  it("shows tomorrow's tokens and none of today's when the presets change", () => {
    const tomorrow = {
      theme: {
        extend: {
          tokens: { colors: { sand: { 100: { value: '#f4ecd8' } } } },
          semanticTokens: {
            colors: {
              bg: { value: '{colors.sand.100}' },
              ghost: { value: '{colors.nowhere.500}' },
              dual: { value: { base: '#111111', _dark: '#eeeeee' } },
            },
          },
        },
      },
    }
    const chassis = {
      theme: {
        extend: {
          tokens: { fontSizes: { '2xs': { value: '0.7rem' } }, spacing: { 1: { value: '4px' } } },
        },
      },
    }
    const out = collectPresetTokens([tomorrow, chassis])

    expect(out.primitiveColors).toEqual([
      {
        scale: 'sand',
        steps: [{ name: 'sand.100', value: '#f4ecd8', ref: undefined, defined: true }],
      },
    ])
    const byName = Object.fromEntries(out.semanticColors.map((r) => [r.name, r]))
    expect(Object.keys(byName)).toEqual(['bg', 'ghost', 'dual'])
    expect(byName.bg).toMatchObject({ value: '#f4ecd8', ref: '{colors.sand.100}', defined: true })
    expect(byName.ghost).toMatchObject({ defined: false })
    expect(byName.dual.value).toBe('#111111')
    expect(out.fontSizes.map((r) => r.name)).toEqual(['2xs'])
    expect(out.spacing.map((r) => r.name)).toEqual(['1'])
    expect(out.fontWeights).toEqual([])
  })

  it('lets a later preset win per token', () => {
    const first = { theme: { tokens: { fontSizes: { xs: { value: '1rem' } } } } }
    const last = { theme: { extend: { tokens: { fontSizes: { xs: { value: '2rem' } } } } } }
    expect(collectPresetTokens([first, last]).fontSizes).toEqual([
      { name: 'xs', value: '2rem', ref: undefined, defined: true },
    ])
  })
})
