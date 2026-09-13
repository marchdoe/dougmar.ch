import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  MATERIAL_NAMES,
  MATERIAL_OWNER,
  formatMaterialContractBlock,
  groundJsx,
  isMaterialName,
  materialSeed,
  renderMaterialFile,
} from '../../scripts/utils/material.js'
import { hashToRange } from '../../scripts/utils/deterministic-hash.js'
import { stripComments } from '../../scripts/utils/token-gate.js'
import { Ground } from '../../app/components/Material.tsx'

const TEMPLATE = resolve(process.cwd(), 'scripts/templates/Material.tsx.template')
const OWNER = resolve(process.cwd(), MATERIAL_OWNER)

const render = (material, seed) => renderToStaticMarkup(createElement(Ground, { material, seed }))

describe('MATERIAL_NAMES', () => {
  it('is the six declarable values, none first', () => {
    expect(MATERIAL_NAMES).toEqual(['none', 'grain', 'mesh', 'halftone', 'rule', 'dots'])
    expect(isMaterialName('grain')).toBe(true)
    expect(isMaterialName('velvet')).toBe(false)
    expect(isMaterialName(null)).toBe(false)
  })
})

describe('materialSeed', () => {
  it('is the namespaced FNV-1a hash of the date, inside the signed 32-bit range', () => {
    expect(materialSeed('2026-09-13')).toBe(hashToRange('material:2026-09-13', 1, 2 ** 31 - 1))
    expect(materialSeed('2026-09-13')).toBe(materialSeed('2026-09-13'))
    expect(materialSeed('2026-09-13')).not.toBe(materialSeed('2026-09-14'))
    expect(materialSeed('2026-09-13')).toBeGreaterThanOrEqual(1)
    expect(materialSeed('2026-09-13')).toBeLessThanOrEqual(2 ** 31 - 1)
  })
})

describe('formatMaterialContractBlock', () => {
  it('hands the engineer the exact JSX line for a declared material', () => {
    const block = formatMaterialContractBlock('grain', 123456)
    expect(block).toContain('## Ground Material')
    expect(block).toContain('<Ground material="grain" seed={123456} />')
    expect(block).toContain('first child of the relatively positioned hero')
    expect(groundJsx('dots', 7)).toBe('<Ground material="dots" seed={7} />')
  })

  it('says to render nothing on none, and treats an unknown name as none', () => {
    for (const value of ['none', null, undefined, 'velvet']) {
      const block = formatMaterialContractBlock(value, 1)
      expect(block).toContain('ground_material: none')
      expect(block).not.toContain('<Ground material=')
    }
  })
})

describe('renderMaterialFile', () => {
  const source = renderMaterialFile()

  it('renders the template verbatim, and the tracked component is that render', () => {
    expect(source).toBe(readFileSync(TEMPLATE, 'utf8'))
    expect(readFileSync(OWNER, 'utf8')).toBe(source)
  })

  it('handles every material key', () => {
    for (const name of MATERIAL_NAMES) expect(source).toContain(`'${name}'`)
  })

  it('draws from the semantic tokens through Panda, with no randomness, clock, innerHTML or external URL', () => {
    expect(source).toContain("from '../../styled-system/css'")
    // The doc comment names the things the code must not do; read past it.
    const code = stripComments(source)
    expect(code).not.toMatch(/Math\.random/)
    expect(code).not.toMatch(/\bDate\b/)
    expect(code).not.toContain('dangerouslySetInnerHTML')
    expect(code).not.toMatch(/https?:\/\/(?!www\.w3\.org\/2000\/svg)/)
    expect(code).not.toMatch(/\bstyle=\{/)
    for (const token of [
      '{colors.accent}',
      '{colors.accentAlt}',
      '{colors.bg}',
      '{colors.border}',
    ]) {
      expect(source).toContain(token)
    }
  })
})

describe('<Ground>', () => {
  it('renders nothing for none', () => {
    expect(render('none', 4242)).toBe('')
  })

  it('is deterministic for a seed and varies with it', () => {
    for (const material of ['grain', 'mesh', 'halftone', 'rule', 'dots']) {
      expect(render(material, 4242)).toBe(render(material, 4242))
    }
    expect(render('grain', 4242)).not.toBe(render('grain', 4243))
  })

  it('carries the declaration on the root and builds grain from an SVG filter', () => {
    const html = render('grain', 4242)
    expect(html).toContain('data-ground-material="grain"')
    expect(html).toContain('data-ground-seed="4242"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('<feTurbulence')
    expect(html).toMatch(/baseFrequency="0\.[6-9]\d{3}"/)
    expect(html).toContain('<feColorMatrix type="luminanceToAlpha"')
    expect(html).toContain('<rect width="100%" height="100%" filter="url(#ground-grain-4242)"')
  })

  it('keeps baseFrequency inside 0.6 to 0.9 across seeds', () => {
    for (const seed of [1, 2999, 3000, 3001, 123456789, 2 ** 31 - 1]) {
      const m = /baseFrequency="([\d.]+)"/.exec(render('grain', seed))
      const f = Number(m[1])
      expect(f).toBeGreaterThanOrEqual(0.6)
      expect(f).toBeLessThanOrEqual(0.9)
    }
  })

  it('renders one layer per CSS material, with a class Panda can extract', () => {
    for (const material of ['mesh', 'halftone', 'rule', 'dots']) {
      const html = render(material, 4242)
      expect(html).toContain(`data-ground-material="${material}"`)
      expect(html).not.toContain('<svg')
      expect(html).toMatch(/<div class="[^"]+"><\/div><\/div>$/)
    }
  })
})
