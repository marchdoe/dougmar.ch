/**
 * PandaCSS does not fail on a token it has never heard of — it passes the name
 * through as a literal, so `fontSize: '5xl'` against a ramp that stops at `2xl`
 * ships `font-size:5xl` and the browser drops the declaration. On 2026-08-30
 * that put the home hero at 32px on mobile where the approved mockup called for
 * 64px, and nothing noticed.
 *
 * The bar for this gate is asymmetric. A missed finding costs one bad morning;
 * a false one kills a nightly run that would have been fine. Most of what
 * follows is therefore about what must NOT be flagged.
 */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import {
  authoringSpellings,
  checkTokenResolution,
  CHECKED_PROPERTIES,
  correctedSpacingForm,
  findNumericScaleMisses,
  findSpacedSpacing,
  findUnresolvedCssValues,
  formatFindings,
  isBareIdentifier,
  isUnresolvedTokenValue,
  parseAtomicSelector,
  parseDeclarations,
  parseGeneratedTokenKeys,
  readGeneratedTokenScales,
  readReachableSources,
  stripComments,
} from '../../scripts/utils/token-gate.js'

describe('the properties the gate checks', () => {
  it('covers colour, type, space, size and radius', () => {
    for (const prop of [
      'color',
      'background',
      'background-color',
      'border-color',
      'fill',
      'font-size',
      'font-family',
      'letter-spacing',
      'padding-top',
      'margin',
      'gap',
      'width',
      'height',
      'border-radius',
    ]) {
      expect(CHECKED_PROPERTIES.has(prop)).toBe(true)
    }
  })

  it('leaves properties whose values are open-ended identifiers alone', () => {
    // `display: grid`, `position: sticky`, `text-rendering: optimizelegibility`
    // and `animation-name: whatever` are all bare identifiers that mean
    // something. There is no way to tell a typo from a keyword here.
    for (const prop of [
      'display',
      'position',
      'text-rendering',
      'animation-name',
      'grid-area',
      'text-transform',
      'font-weight',
      'line-height',
      'z-index',
      'opacity',
      'flex',
      'order',
      'overflow',
      'align-items',
      'cursor',
    ]) {
      expect(CHECKED_PROPERTIES.has(prop)).toBe(false)
    }
  })
})

describe('unresolved token names', () => {
  it.each([
    ['font-size', '5xl'],
    ['font-size', '7xl'],
    ['color', 'textSecondary'],
    ['color', 'accentGlow'],
    ['border-color', 'border.accent'],
    ['background', 'cardBg'],
    ['color', 'pine.4'],
    ['font-family', 'heading'],
    ['padding-top', 'px'],
    ['letter-spacing', 'wideish'],
    ['border-radius', 'pill'],
  ])('flags %s: %s', (prop, value) => {
    expect(isUnresolvedTokenValue(prop, value)).toBe(true)
  })

  it('ignores the same name on a property it does not check', () => {
    expect(isUnresolvedTokenValue('grid-template-areas', 'cardBg')).toBe(false)
  })

  it('sees through !important', () => {
    expect(isUnresolvedTokenValue('color', 'accentGlow !important')).toBe(true)
  })
})

describe('valid CSS is never a finding', () => {
  it.each([
    ['color', 'inherit'],
    ['color', 'transparent'],
    ['color', 'currentColor'],
    ['color', 'currentcolor'],
    ['background', 'none'],
    ['width', 'auto'],
    ['letter-spacing', 'normal'],
    ['color', 'initial'],
    ['color', 'unset'],
    ['color', 'revert'],
    ['color', 'revert-layer'],
  ])('keyword %s: %s', (prop, value) => {
    expect(isUnresolvedTokenValue(prop, value)).toBe(false)
  })

  it.each([
    ['color', 'rebeccapurple'],
    ['color', 'tomato'],
    ['background-color', 'white'],
    ['fill', 'black'],
    ['border-color', 'gold'],
    ['stroke', 'DarkSlateGray'],
  ])('named colour %s: %s', (prop, value) => {
    expect(isUnresolvedTokenValue(prop, value)).toBe(false)
  })

  it.each([
    ['font-size', 'small'],
    ['font-size', 'xx-large'],
    ['font-size', 'larger'],
    ['font-family', 'sans-serif'],
    ['font-family', 'ui-monospace'],
    ['font-family', 'system-ui'],
    ['width', 'fit-content'],
    ['max-width', 'max-content'],
    ['min-height', 'min-content'],
    ['border-width', 'thin'],
    ['background', 'border-box'],
    ['background', 'no-repeat'],
  ])('property keyword %s: %s', (prop, value) => {
    expect(isUnresolvedTokenValue(prop, value)).toBe(false)
  })

  it.each([
    ['width', '-webkit-fill-available'],
    ['height', '-moz-fit-content'],
  ])('vendor keyword %s: %s', (prop, value) => {
    expect(isUnresolvedTokenValue(prop, value)).toBe(false)
  })

  it.each([
    ['color', 'var(--colors-accent)'],
    ['background', 'var(--colors-bg, #000)'],
    ['font-size', 'clamp(4rem,8.5vw,8.5rem)'],
    ['width', 'calc(100% - 2rem)'],
    ['background', 'url(data:image/svg+xml;base64,AAA)'],
    ['background', 'linear-gradient(90deg, #000, #fff)'],
    ['color', '#b5e61d'],
    ['color', '#fff'],
    ['color', 'rgb(0 0 0 / 50%)'],
    ['color', 'hsl(210deg 40% 20%)'],
    ['color', 'color-mix(in srgb, red, blue)'],
    ['font-family', "'IBM Plex Mono', ui-monospace, monospace"],
    ['font-family', 'Inter, system-ui, sans-serif'],
    ['width', '100%'],
    ['font-size', '0.9rem'],
    ['font-size', '13px'],
    ['letter-spacing', '-0.01em'],
    ['margin', '0'],
    ['padding', '0 auto'],
    ['width', '8.5vw'],
    ['gap', '1px 4px'],
    ['border-radius', '9999px'],
    ['background', 'transparent url(x.png) no-repeat'],
  ])('raw value %s: %s', (prop, value) => {
    expect(isUnresolvedTokenValue(prop, value)).toBe(false)
  })

  it('treats a number with any CSS unit as a measurement, not a name', () => {
    for (const v of ['1px', '2rem', '0.5s', '150ms', '45deg', '1fr', '3ch', '100dvh', '2.5e2px']) {
      expect(isBareIdentifier(v)).toBe(false)
    }
  })

  it('still reads a ramp step that starts with a digit as a name', () => {
    // `5xl` and `2xs` both begin with a number, and `2xs` even ends in `s`.
    // Neither is a measurement.
    expect(isBareIdentifier('5xl')).toBe(true)
    expect(isBareIdentifier('2xs')).toBe(true)
  })
})

describe('reading the emitted stylesheet', () => {
  it('finds rules nested inside at-rules', () => {
    const css =
      '@layer utilities{.fs_5xl{font-size:5xl}@media (min-width:768px){.md\\:fs_7xl{font-size:7xl}}}'
    expect(findUnresolvedCssValues(css).map((f) => f.value)).toEqual(['5xl', '7xl'])
  })

  it('skips custom property declarations', () => {
    const css = ':where(:root){--colors-accent:#F4B90A;--scroll-snap-strictness:proximity}'
    expect(parseDeclarations(css).length).toBe(0)
  })

  it('leaves the globalCss reset alone', () => {
    // Real base-layer output from 2026-08-30. Every value here is legal.
    const css =
      'body{background:var(--colors-bg);color:var(--colors-text);-webkit-font-smoothing:antialiased;' +
      'text-rendering:optimizelegibility;margin:0;padding:0}' +
      'a{color:inherit;text-decoration:none}*{box-sizing:border-box}'
    expect(findUnresolvedCssValues(css)).toEqual([])
  })

  it('reports one finding per property and value, however many breakpoints repeat it', () => {
    const css = '.fs_5xl{font-size:5xl}.sm\\:fs_5xl{font-size:5xl}.lg\\:fs_5xl{font-size:5xl}'
    expect(findUnresolvedCssValues(css)).toHaveLength(1)
  })

  it('recovers the value the engineer wrote, not the one Panda emitted', () => {
    // Panda rewrites `pine.400` to `pine.4` on the way out, so the emitted value
    // will not be found in the TSX. The class name still carries the original.
    const [finding] = findUnresolvedCssValues('.c_pine\\.400{color:pine.4}')
    expect(finding).toMatchObject({ value: 'pine.4', authoredValue: 'pine.400' })
  })
})

describe('parsing an escaped Panda selector', () => {
  it('keeps an escaped colon and drops a pseudo-class', () => {
    expect(parseAtomicSelector('.hover\\:c_accentGlow:hover')).toEqual({
      className: 'hover:c_accentGlow',
      authoredValue: 'accentGlow',
    })
  })

  it('keeps an escaped dot inside a nested token path', () => {
    expect(parseAtomicSelector('.c_text\\.dim')).toEqual({
      className: 'c_text.dim',
      authoredValue: 'text.dim',
    })
  })

  it('handles a pseudo-element', () => {
    expect(parseAtomicSelector('.after\\:bg_accentGlow:after').authoredValue).toBe('accentGlow')
  })

  it('returns null for a selector with no class, such as globalCss', () => {
    expect(parseAtomicSelector('body')).toBe(null)
    expect(parseAtomicSelector('h1,h2,h3')).toBe(null)
  })
})

describe('reading the scale out of what Panda compiled', () => {
  // The gate reads styled-system/tokens, not the preset sources. The sources
  // cannot answer the question: panda.config.ts merges two presets that own
  // different halves of the theme, and only the merge knows what won.
  const generated = `
    const tokens = {
      "colors.gold.400": { "value": "#F4B90A", "variable": "var(--colors-gold-400)" },
      "spacing.1": { "value": "4px", "variable": "var(--spacing-1)" },
      "spacing.4": { "value": "24px", "variable": "var(--spacing-4)" },
      "spacing.9": { "value": "128px", "variable": "var(--spacing-9)" },
      "spacing.-1": { "value": "calc(var(--spacing-1) * -1)" },
      "sizes.breakpoint-lg": { "value": "1024px", "variable": "var(--sizes-breakpoint-lg)" },
      "fontSizes.2xs": { "value": "10px" },
      "fontSizes.hero": { "value": "clamp(72px, 11vw, 148px)" }
    }`

  it('reads the keys of the scale it was asked for', () => {
    expect([...parseGeneratedTokenKeys(generated, 'spacing')]).toEqual(['1', '4', '9', '-1'])
  })

  it('reads a scale whose keys are not numbers', () => {
    expect([...parseGeneratedTokenKeys(generated, 'fontSizes')]).toEqual(['2xs', 'hero'])
  })

  it('keeps a dotted key whole', () => {
    expect([...parseGeneratedTokenKeys(generated, 'colors')]).toEqual(['gold.400'])
  })

  it('returns nothing for a scale the theme does not define', () => {
    expect(parseGeneratedTokenKeys(generated, 'radii')).toEqual(new Set())
  })

  it('does not flag a legal spacing token the Art Director never wrote', () => {
    // The 2026-09-01 regression. The Art Director is told not to emit
    // `spacing`; the orchestrator generates it into the chassis preset. 49 of
    // these killed that run and every one was correct code.
    const scales = {
      spacing: parseGeneratedTokenKeys(generated, 'spacing'),
      sizes: parseGeneratedTokenKeys(generated, 'sizes'),
    }
    expect(findNumericScaleMisses(`css({ gap: '4', marginTop: '9' })`, scales)).toEqual([])
  })

  it('still flags the 11px mark against the compiled sizes scale', () => {
    // The compiled `sizes` scale is not empty — Panda injects breakpoint-*.
    // It carries no numeric step, which is what makes `width: '11'` a finding,
    // and that case is the reason this gate exists.
    const scales = {
      spacing: parseGeneratedTokenKeys(generated, 'spacing'),
      sizes: parseGeneratedTokenKeys(generated, 'sizes'),
    }
    expect(scales.sizes.size).toBeGreaterThan(0)
    expect(findNumericScaleMisses(`css({ width: '11' })`, scales)).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })

  it('still flags a spacing key past the end of the compiled scale', () => {
    const scales = {
      spacing: parseGeneratedTokenKeys(generated, 'spacing'),
      sizes: parseGeneratedTokenKeys(generated, 'sizes'),
    }
    expect(findNumericScaleMisses(`css({ marginBottom: '12' })`, scales)).toEqual([
      { prop: 'marginBottom', value: '12', category: 'spacing' },
    ])
  })
})

describe('bare numbers where a token key was meant', () => {
  const scales = { spacing: new Set(['1', '2', '3', '4']), sizes: new Set() }

  it('flags the 11px logo', () => {
    // The live case: Sidebar.tsx set the brand mark to `width: '11'`, meaning a
    // spacing token. Panda appended px. The mockup had it at 44px.
    expect(findNumericScaleMisses(`css({ width: '11' })`, scales)).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })

  it('flags the JSX prop spelling too', () => {
    expect(findNumericScaleMisses(`<Box height="3" />`, scales)).toEqual([
      { prop: 'height', value: '3', category: 'sizes' },
    ])
  })

  it('accepts a spacing key the preset defines', () => {
    expect(findNumericScaleMisses(`css({ marginTop: '3', gap: '1' })`, scales)).toEqual([])
  })

  it('flags a spacing key past the end of the scale', () => {
    expect(findNumericScaleMisses(`css({ marginBottom: '12' })`, scales)).toEqual([
      { prop: 'marginBottom', value: '12', category: 'spacing' },
    ])
  })

  it('always allows zero', () => {
    expect(findNumericScaleMisses(`css({ margin: '0', padding: '0' })`, scales)).toEqual([])
  })

  it('leaves values with a unit alone', () => {
    expect(
      findNumericScaleMisses(`css({ width: '11px', maxWidth: '520px', gap: '0.5rem' })`, scales)
    ).toEqual([])
  })

  it('leaves unitless numbers on properties that take them alone', () => {
    expect(
      findNumericScaleMisses(
        `css({ lineHeight: '1.5', opacity: '0.6', zIndex: '10', flex: '1', fontWeight: '600', order: '2' })`,
        scales
      )
    ).toEqual([])
  })

  it('reports each distinct miss once', () => {
    expect(
      findNumericScaleMisses(`css({ width: '11' }); css({ width: '11' })`, scales)
    ).toHaveLength(1)
  })

  it('does not flag inline SVG geometry attributes (#316)', () => {
    // <svg width="24"> is not the same width as <Box width="24">.
    // resolveImport already excludes an imported .svg asset for the same
    // reason; this is the inline case.
    const src = `<svg width="24" height="24" viewBox="0 0 24 24"/>`
    expect(findNumericScaleMisses(src, scales)).toEqual([])
  })

  it('does not flag geometry attributes on an SVG child element either (#316)', () => {
    const src = `<svg viewBox="0 0 24 24"><rect width="10" height="10"/></svg>`
    expect(findNumericScaleMisses(src, scales)).toEqual([])
  })

  it('still flags a real prop of the same value elsewhere in the file (#316)', () => {
    // The skip is by tag, not by value — an SVG width="24" must not shadow a
    // later <Box width="24"> or css({ width: '24' }) that reads the token scale.
    const src = `<svg width="24" height="24" viewBox="0 0 24 24"/><Box width="24">X</Box>css({ width: '24' })`
    expect(findNumericScaleMisses(src, scales)).toEqual([
      { prop: 'width', value: '24', category: 'sizes' },
    ])
  })

  it('does not mistake a closed SVG tag for still being inside it, later in the file (#316)', () => {
    const src = `<svg width="24" height="24">
  <rect width="10" height="10"/>
</svg>
css({ width: '11' })`
    expect(findNumericScaleMisses(src, scales)).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })
})

describe('the message handed to the retry', () => {
  it('names the file, the property, the value and the scale', () => {
    const message = formatFindings([
      {
        kind: 'unresolved',
        property: 'font-size',
        value: '5xl',
        authoredValue: '5xl',
        category: 'fontSizes',
        files: ['app/components/Sidebar.tsx'],
      },
      {
        kind: 'numeric',
        property: 'width',
        value: '11',
        category: 'spacing',
        available: ['1', '2', '3'],
        files: ['app/components/Sidebar.tsx'],
      },
    ])
    expect(message).toContain('app/components/Sidebar.tsx')
    expect(message).toContain("font-size: '5xl'")
    expect(message).toContain('fontSizes.5xl')
    expect(message).toContain("width: '11'")
    expect(message).toContain('1, 2, 3')
  })

  it('tells an agent to use a unit when the scale has no numbered steps', () => {
    // What `width: '11'` should hear back. The compiled sizes scale carries
    // breakpoint-* and nothing numeric, so there is no step to point at.
    const message = formatFindings([
      {
        kind: 'numeric',
        property: 'width',
        value: '11',
        category: 'sizes',
        available: [],
        files: ['app/components/Sidebar.tsx'],
      },
    ])
    expect(message).toContain('no numbered steps at all')
    expect(message).toContain('write the length you mean with a unit')
  })
})

describe('blaming the file that actually wrote it', () => {
  // `width:full` in the stylesheet used to be blamed on every file containing
  // the string 'full'. On 2026-09-01 that meant `depth: 'full'` — project
  // metadata, not a style prop — in app/content/projects.ts and two others,
  // and the retry was handed a message naming files the React Engineer is not
  // allowed to open. There is only one retry to spend.
  it('derives the camelCase spelling', () => {
    expect(authoringSpellings('font-size')).toEqual(['font-size', 'fontSize'])
  })

  it('includes the Panda shorthands a CSS property could have been written as', () => {
    expect(authoringSpellings('min-width')).toEqual(['min-width', 'minWidth', 'minW'])
    expect(authoringSpellings('background')).toContain('bg')
    expect(authoringSpellings('width')).toContain('w')
  })

  it('leaves a property with no shorthand alone', () => {
    expect(authoringSpellings('color')).toEqual(['color', 'textColor'])
  })
})

describe('the keyword sizes the theme must keep', () => {
  // Naming any preset in `presets` replaces @pandacss/preset-panda, which took
  // the whole sizes scale with it. `width: 'full'` then shipped the literal
  // `width:full` and the browser dropped it — that failed the 2026-09-01 dry
  // run. Restored in panda.config.ts, which agents cannot write.
  const scales = readGeneratedTokenScales(process.cwd())

  it('resolves the four keyword sizes', () => {
    for (const key of ['full', 'min', 'max', 'fit']) {
      expect(scales.sizes.has(key)).toBe(true)
    }
  })

  it('defines no numeric sizes key, so the 11px mark still fails', () => {
    // Upstream has none either. `width: '11'` against a 44px mockup is the
    // defect this gate was built for and it must keep failing.
    expect([...scales.sizes].filter((k) => /^\d+$/.test(k))).toEqual([])
    expect(findNumericScaleMisses(`css({ width: '11' })`, scales)).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })
})

describe('a theme the gate cannot read', () => {
  it('returns null rather than an empty scale when codegen has not run', () => {
    // An empty scale and an unreadable one are different facts. Empty is
    // authoritative and must still flag `width: '11'`; unreadable means the
    // gate knows nothing, and a gate that knows nothing must not invent 49
    // findings — which is exactly how #283 took the nightly down.
    expect(readGeneratedTokenScales('/nonexistent-root-for-this-test')).toBeNull()
  })

  it('reads the real generated scale from this repo', () => {
    // Guards the path and the file shape together: if Panda ever moves or
    // renames its output, this fails here instead of at 4am.
    const scales = readGeneratedTokenScales(process.cwd())
    expect(scales).not.toBeNull()
    expect(scales.spacing.size).toBeGreaterThan(0)
  })
})

describe('stripComments', () => {
  it('does not mistake a URL inside a string for a comment', () => {
    const src = `const u = 'https://dougmar.ch/work'\nconst w = { width: '11' }`
    expect(stripComments(src)).toContain("'https://dougmar.ch/work'")
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })

  it('does not flag a bare number that only appears in a comment', () => {
    // Sidebar.tsx carries a comment explaining that `width: '11'` once meant a
    // spacing token that does not exist. The gate flagged the comment and
    // reported an 11px mark in a file that renders none — a rule firing on its
    // own documentation.
    const src = `// it kept going wrong: \`width: '11'\` meant a spacing token\nexport const x = 1`
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([])
  })

  it('blanks block comments without moving line numbers', () => {
    const src = `/* width: '11'\n   height: '9' */\nconst gap = { gap: '3' }`
    const stripped = stripComments(src)
    expect(stripped.split('\n')).toHaveLength(src.split('\n').length)
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([
      { prop: 'gap', value: '3', category: 'spacing' },
    ])
  })

  it('keeps an escaped quote from ending a string early', () => {
    const src = `const s = 'it\\'s fine // not a comment'\nconst w = { width: '11' }`
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })

  it('does not let an apostrophe in JSX text open a fake string (#309)', () => {
    // Doug's studio: the apostrophe used to open a string that ran to the
    // next one, swallowing the `//` comment on the next line and never
    // stripping it, resurrecting the exact false positive this gate exists
    // to kill.
    const src =
      "export function A(){ return <p>Doug's studio</p> }\n" +
      "// width: '11' was the old spacing token"
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([])
  })

  it('still flags a real numeric miss elsewhere in the file (#309)', () => {
    const src = "export function A(){ return <p>Doug's studio</p> }\ncss({ width: '11' })"
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })

  it('leaves a `//` inside a real string untouched', () => {
    const src = "const u = 'https://dougmar.ch/work'"
    expect(stripComments(src)).toBe(src)
  })

  it('leaves a `/* */` inside a string untouched', () => {
    const src = "const s = 'a /* not a comment */ b'"
    expect(stripComments(src)).toBe(src)
  })

  it('still strips a real comment after JSX text with apostrophes on two lines', () => {
    const src =
      "<p>Doug's studio</p>\n" +
      "<p>It's here</p>\n" +
      "// width: '11' was the old spacing token\n" +
      'export const x = 1'
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([])
  })

  it('does not let a regex character class open a fake string (#309)', () => {
    const src = "const RE = /['\"]/\nconst w = { width: '11' }"
    expect(findNumericScaleMisses(src, { sizes: new Set(), spacing: new Set() })).toEqual([
      { prop: 'width', value: '11', category: 'sizes' },
    ])
  })

  it('opens a string right after `return`, with only whitespace before the quote (#313)', () => {
    // No punctuation precedes the quote at all -- `n` (the last letter of
    // "return") is not in CAN_OPEN_STRING, so a naive heuristic leaves the
    // string unopened and the `//` inside the URL reads as a real comment,
    // silently deleting the rest of the line.
    const src = "function f() {\n  doSomething()\n  return 'https://dougmar.ch/a'\n}"
    expect(stripComments(src)).toContain("'https://dougmar.ch/a'")
  })

  it('opens a string right after `case`, `throw`, `typeof`, `yield`, and `await` (#313)', () => {
    for (const keyword of ['case', 'throw', 'typeof', 'yield', 'await']) {
      const src = `${keyword} 'https://dougmar.ch/a'`
      expect(stripComments(src)).toContain("'https://dougmar.ch/a'")
    }
  })

  it('does not open a string after a non-keyword identifier (#313)', () => {
    // "returning" is not "return" -- a word-boundary miss here would silently
    // widen the heuristic to any identifier, not just the keyword set.
    const src = "returning 'https://dougmar.ch/a'"
    expect(stripComments(src)).not.toContain("'https://dougmar.ch/a'")
  })
})

describe('several tokens in one spacing string (#553)', () => {
  // The two shapes app/routes/experiments.tsx carried on main. Panda resolves a
  // token only when it is the whole value, so both shipped as px:
  // `.p_3_4{padding:3px 4px}` and `.md\:p_8_6vw{padding:8px 6vw}`. The row had 3px
  // of vertical padding where the preset's `3` is 16px. Valid CSS, so part one
  // cannot see it.
  const EXPERIMENTS_ROW = `const rowClass = css({
  display: 'flex',
  gap: '4',
  padding: '3 4',
  borderBottom: '1px solid',
})`
  const EXPERIMENTS_PAGE = `<Box
  containerType="inline-size"
  padding={{ base: '6 4', md: '8 6vw' }}
  display="flex"
>`

  it("flags padding: '3 4' and gives the one-token-per-property form", () => {
    expect(findSpacedSpacing(EXPERIMENTS_ROW)).toEqual([
      {
        prop: 'padding',
        value: '3 4',
        line: 4,
        text: "padding: '3 4',",
        fix: "paddingBlock: '3', paddingInline: '4'",
      },
    ])
  })

  it('flags every string in a responsive JSX prop, on the line it sits on', () => {
    expect(findSpacedSpacing(EXPERIMENTS_PAGE)).toEqual([
      {
        prop: 'padding',
        value: '6 4',
        line: 3,
        text: "padding={{ base: '6 4', md: '8 6vw' }}",
        fix: "paddingBlock: '6', paddingInline: '4'",
      },
      {
        prop: 'padding',
        value: '8 6vw',
        line: 3,
        text: "padding={{ base: '6 4', md: '8 6vw' }}",
        fix: "paddingBlock: '8', paddingInline: '6vw'",
      },
    ])
  })

  it('reads the JSX string forms and the css() object forms alike', () => {
    for (const src of [
      `<Box padding="3 4" />`,
      `<Box padding={'3 4'} />`,
      `<Box padding={["3 4", "6 8"]} />`,
      `css({ padding: { base: '3 4' } })`,
      `css({ padding: \`3 4\` })`,
    ]) {
      expect(findSpacedSpacing(src).length, src).toBeGreaterThan(0)
    }
  })

  it('flags a value that mixes a unit with a bare token', () => {
    const [hit] = findSpacedSpacing(`css({ padding: '3px 4' })`)
    expect(hit.fix).toBe("paddingBlock: '3px', paddingInline: '4'")
  })

  it('spells out three and four values', () => {
    expect(correctedSpacingForm('padding', ['1', '2', '3'])).toBe(
      "paddingTop: '1', paddingInline: '2', paddingBottom: '3'"
    )
    expect(correctedSpacingForm('margin', ['1', '2', '3', '4'])).toBe(
      "marginTop: '1', marginRight: '2', marginBottom: '3', marginLeft: '4'"
    )
    expect(correctedSpacingForm('inset', ['1', '2'])).toBe("insetBlock: '1', insetInline: '2'")
    expect(correctedSpacingForm('inset', ['1', '2', '3', '4'])).toBe(
      "top: '1', right: '2', bottom: '3', left: '4'"
    )
  })

  it('splits the axis and gap properties along their own names', () => {
    expect(correctedSpacingForm('paddingInline', ['3', '4'])).toBe(
      "paddingInlineStart: '3', paddingInlineEnd: '4'"
    )
    expect(correctedSpacingForm('marginBlock', ['3', '4'])).toBe(
      "marginBlockStart: '3', marginBlockEnd: '4'"
    )
    expect(correctedSpacingForm('gap', ['2', '4'])).toBe("rowGap: '2', columnGap: '4'")
    expect(findSpacedSpacing(`css({ gap: '2 4', paddingX: '1 2' })`).map((h) => h.prop)).toEqual([
      'gap',
      'paddingX',
    ])
  })

  it('falls back to a plain instruction where no split exists', () => {
    expect(correctedSpacingForm('paddingTop', ['3', '4'])).toContain('one property per value')
    expect(correctedSpacingForm('padding', ['1', '2', '3', '4', '5'])).toContain(
      'one property per value'
    )
  })

  it('accepts one token per property, the corrected form', () => {
    const src = `css({ paddingBlock: '3', paddingInline: '4', gap: '4' })
<Box paddingBlock={{ base: '6', md: '8' }} paddingInline={{ base: '4', md: '6vw' }} />`
    expect(findSpacedSpacing(src)).toEqual([])
  })

  it('accepts multi-value spacing that is plain CSS, where every part says what it is', () => {
    // Lengths with units, zero, keywords, percentages, functions. None of them
    // is a token Panda skipped, and the tooling surfaces write these on purpose.
    for (const value of [
      '1px 5px',
      '0 auto',
      'auto 0',
      '0 0 16px 0',
      '2rem 28px 2rem 32px',
      '5% 10%',
      'calc(1rem + 2px) 4px',
      'var(--row) var(--col)',
      'env(safe-area-inset-top) 0',
    ]) {
      expect(findSpacedSpacing(`css({ padding: '${value}' })`), value).toEqual([])
    }
  })

  it('accepts a single value, which parts one and two already judge', () => {
    expect(findSpacedSpacing(`css({ padding: '4', margin: '0', gap: 'auto' })`)).toEqual([])
  })

  it('leaves component props named left and right alone', () => {
    // generated/RunningFoot.tsx passes `left="lions" right="31 to 41"` as data.
    // Those are not the inset sides, and a false finding kills a nightly run.
    expect(findSpacedSpacing(`<FootRow left="lions" right="31 to 41" tag="loss" />`)).toEqual([])
  })

  it('ignores the strings in a call inside the braces', () => {
    expect(findSpacedSpacing(`<Box padding={pick({ a: 'x y' }, 'p q')} />`)).toEqual([])
  })

  it('does not read a comment, a custom property or a member access', () => {
    const src = `// was padding: '3 4' until #553
/* padding: '3 4' */
const a = { '--card-padding': '3 4' }
el.style.padding = '3 4'`
    expect(findSpacedSpacing(src)).toEqual([])
  })

  it('reports a distinct value once, at its first line', () => {
    const hits = findSpacedSpacing(`css({ padding: '3 4' })\ncss({ padding: '3 4' })`)
    expect(hits).toHaveLength(1)
    expect(hits[0].line).toBe(1)
  })

  describe('in the message handed to the retry', () => {
    const finding = {
      kind: 'spaced',
      property: 'padding',
      value: '3 4',
      line: 17,
      text: "padding: '3 4',",
      fix: "paddingBlock: '3', paddingInline: '4'",
      files: ['app/routes/experiments.tsx'],
    }

    it('names the file and line, quotes the line, and gives the corrected form', () => {
      const message = formatFindings([finding])
      expect(message).toContain('app/routes/experiments.tsx:17')
      expect(message).toContain("padding: '3 4'")
      expect(message).toContain("Write paddingBlock: '3', paddingInline: '4'.")
      expect(message).toContain('Panda resolves a token only when it is the whole value')
    })
  })

  describe('as a build gate', () => {
    // checkTokenResolution over a scratch site: one route, an empty stylesheet.
    const site = (files) => {
      const root = mkdtempSync(path.join(tmpdir(), 'token-gate-spaced-'))
      mkdirSync(path.join(root, 'app', 'routes'), { recursive: true })
      mkdirSync(path.join(root, 'dist', 'client', 'assets'), { recursive: true })
      writeFileSync(path.join(root, 'dist', 'client', 'assets', 'app.css'), '')
      for (const [rel, src] of Object.entries(files)) {
        mkdirSync(path.dirname(path.join(root, rel)), { recursive: true })
        writeFileSync(path.join(root, rel), src)
      }
      return root
    }

    it('blocks the build when a file the engineer owns does it, and the brief carries the fix', () => {
      const root = site({ 'app/routes/index.tsx': EXPERIMENTS_ROW })
      try {
        const gate = checkTokenResolution({ root, ownedFiles: ['app/routes/index.tsx'] })
        expect(gate.ok).toBe(false)
        expect(gate.blocking).toHaveLength(1)
        expect(gate.blocking[0]).toMatchObject({ kind: 'spaced', property: 'padding', line: 4 })
        expect(gate.error).toContain('app/routes/index.tsx:4')
        expect(gate.error).toContain("paddingBlock: '3', paddingInline: '4'")
      } finally {
        rmSync(root, { recursive: true, force: true })
      }
    })

    it('only warns for a file the nightly agents do not own', () => {
      const root = site({ 'app/routes/experiments.tsx': EXPERIMENTS_ROW })
      try {
        const gate = checkTokenResolution({ root, ownedFiles: ['app/routes/index.tsx'] })
        expect(gate.ok).toBe(true)
        expect(gate.warnings).toHaveLength(1)
        expect(gate.warnings[0].kind).toBe('spaced')
      } finally {
        rmSync(root, { recursive: true, force: true })
      }
    })

    it('finds nothing in the routes and components this repo renders', () => {
      // The check must not trip on what the nightly has already written and
      // shipped: every source file reachable from app/routes on this checkout.
      const sources = readReachableSources(process.cwd())
      expect(sources.size).toBeGreaterThan(10)
      const hits = []
      for (const [file, source] of sources) {
        for (const hit of findSpacedSpacing(source)) hits.push(`${file}:${hit.line} ${hit.text}`)
      }
      expect(hits).toEqual([])
    })
  })
})
