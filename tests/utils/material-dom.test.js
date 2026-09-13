/**
 * The material library against real Chromium (#505).
 *
 * material.test.js proves the markup; this proves it paints. Panda resolves
 * `css()` at extract time, so the component's classes mean nothing without
 * the stylesheet: `panda cssgen` is run once here over the real app tree
 * (which includes app/components/Material.tsx) and its output is inlined
 * into the page. Each material is mounted as the first child of a relatively
 * positioned hero on the `bg` token, the way the engineer is told to place
 * it, and checked three ways: the layer fills the hero, it carries a
 * background or an SVG filter, and the pixels differ from the same hero with
 * no material. Modelled on surface-gate-dom.test.js.
 */
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { chromium } from '@playwright/test'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { ROOT } from '../../scripts/utils/file-manager.js'
import { measureDesignFidelity } from '../../scripts/utils/design-fidelity.js'
import { MATERIAL_NAMES } from '../../scripts/utils/material.js'
import { Ground } from '../../app/components/Material.tsx'

const SEED = 4242
const HERO = { width: 1440, height: 600 }

function pageFor(css, material) {
  const ground = renderToStaticMarkup(createElement(Ground, { material, seed: SEED }))
  return `<!doctype html><html><head><style>${css}</style></head><body style="margin:0">
<section id="hero" style="position:relative;overflow:hidden;width:${HERO.width}px;height:${HERO.height}px;background:var(--colors-bg)">
${ground}
<h1 style="position:relative;z-index:1;margin:0;padding:48px;font:700 96px/1 sans-serif;color:var(--colors-text)">Fourteen hours of light</h1>
</section></body></html>`
}

describe('<Ground> paints', () => {
  let browser
  let css
  let tmp
  let bare
  beforeAll(async () => {
    tmp = mkdtempSync(path.join(tmpdir(), 'material-dom-'))
    const out = path.join(tmp, 'styles.css')
    const run = spawnSync(
      path.join(ROOT, 'node_modules', '.bin', 'panda'),
      ['cssgen', '--outfile', out],
      {
        cwd: ROOT,
        encoding: 'utf8',
      }
    )
    if (run.status !== 0) throw new Error(`panda cssgen failed: ${run.stderr || run.stdout}`)
    css = readFileSync(out, 'utf8')
    browser = await chromium.launch({ headless: true })
    // The bare hero, for the pixel comparison below.
    const page = await mount('none')
    try {
      bare = await heroPixels(page)
    } finally {
      await page.close()
    }
  }, 60_000)
  afterAll(async () => {
    await browser?.close()
    if (tmp) rmSync(tmp, { recursive: true, force: true })
  })

  async function mount(material) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await page.setContent(pageFor(css, material))
    return page
  }

  async function heroPixels(page) {
    return await page.screenshot({ type: 'png', clip: { x: 0, y: 0, ...HERO } })
  }

  it('the stylesheet carries the material classes', () => {
    expect(css).toContain('--colors-bg')
    expect(css).toMatch(/feTurbulence|radial-gradient/)
    expect(css).toContain('repeating-linear-gradient')
  })

  it('renders no layer for none', async () => {
    const page = await mount('none')
    try {
      expect(await page.locator('[data-ground-material]').count()).toBe(0)
    } finally {
      await page.close()
    }
  })

  for (const material of MATERIAL_NAMES.filter((m) => m !== 'none')) {
    it(`${material} fills the hero, sits under its content, and changes the pixels`, async () => {
      const page = await mount(material)
      try {
        const probe = await page.evaluate(() => {
          const hero = document.getElementById('hero').getBoundingClientRect()
          const root = document.querySelector('[data-ground-material]')
          const rootStyle = getComputedStyle(root)
          const layer = root.firstElementChild
          const layerStyle = getComputedStyle(layer)
          return {
            rect: root.getBoundingClientRect().toJSON(),
            hero: hero.toJSON(),
            position: rootStyle.position,
            pointerEvents: rootStyle.pointerEvents,
            zIndex: rootStyle.zIndex,
            layerTag: layer.tagName.toLowerCase(),
            hasFilter: !!layer.querySelector('feTurbulence'),
            backgroundImage: layerStyle.backgroundImage,
            layerColor: layerStyle.color,
            layerRect: layer.getBoundingClientRect().toJSON(),
            h1Top: document.querySelector('h1').getBoundingClientRect().top,
          }
        })
        // inset 0 took: the Panda class resolved.
        expect(probe.rect).toEqual(probe.hero)
        expect(probe.position).toBe('absolute')
        expect(probe.pointerEvents).toBe('none')
        expect(probe.zIndex).toBe('0')
        // Every layer at least covers the hero (halftone is oversized for rotation).
        expect(probe.layerRect.width).toBeGreaterThanOrEqual(HERO.width - 1)
        expect(probe.layerRect.height).toBeGreaterThanOrEqual(HERO.height - 1)
        if (material === 'grain') {
          expect(probe.layerTag).toBe('svg')
          expect(probe.hasFilter).toBe(true)
          // The flood inherits the `text` token through currentColor.
          expect(probe.layerColor).not.toBe('rgba(0, 0, 0, 0)')
        } else {
          expect(probe.layerTag).toBe('div')
          expect(probe.backgroundImage).toMatch(/gradient/)
          expect(probe.backgroundImage).not.toContain('var(')
        }
        // It paints: the hero is not the bare field any more.
        const painted = await heroPixels(page)
        expect(painted.equals(bare)).toBe(false)
        // And the fidelity measurement still sees the hero as designed content.
        const measured = await page.evaluate(measureDesignFidelity)
        expect(measured.canvas_utilization).toBeGreaterThan(0)
      } finally {
        await page.close()
      }
    }, 30_000)
  }
})
