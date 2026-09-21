/**
 * The tablet rung against real Chromium (#565).
 *
 * tablet-rung.test.js proves what the rung reads from a measurement. This
 * proves the measurement: three served pages, walked at all three rungs by
 * `runSurfaceGate`, one that breaks only between the phone and the desktop,
 * one whose type is cut off only there, and one that fails the phone-only and
 * desktop-only checks at their own rungs so the tablet has to stay silent.
 */
import { createServer } from 'node:http'
import { describe, expect, it } from 'vitest'
import { TABLET_VIEWPORT } from '../../elements/chassis/viewports.js'
import { faultsForOwner, runSurfaceGate } from '../../scripts/utils/surface-gate.js'

// The band the tablet sits in and the phone and desktop do not.
const BAND = '(min-width: 600px) and (max-width: 1000px)'

const PAGES = {
  // A grid that keeps its desktop width in the band: the document scrolls
  // sideways at 820 and nowhere else.
  '/': `<h1>Home</h1><a href="/about">About</a>
    <style>.grid{height:20px;background:#ccc}@media ${BAND}{.grid{width:1200px}}</style>
    <div class="grid"></div>`,
  // A heading in a box that clips it, in the band only. The document itself
  // does not scroll, which is the fault the clip check exists for.
  '/about': `<h1>About</h1><a href="/about">About</a>
    <style>@media ${BAND}{.cut{width:300px;overflow:hidden;white-space:nowrap;font-size:60px}}</style>
    <h2 class="cut">Design systems, mostly, and the people who use them</h2>`,
  // Fails the phone-only and desktop-only checks: no h1, no /about link, no
  // brand mark, a target under the tap floor. Fits at every width.
  '/work/plain': `<a href="/elsewhere" style="display:inline-block;width:20px;height:20px">x</a>`,
}

async function serve() {
  const server = createServer((req, res) => {
    const html = PAGES[req.url ?? '']
    res.statusCode = html ? 200 : 404
    res.setHeader('content-type', 'text/html')
    res.end(`<!doctype html><html><body style="margin:0">${html ?? ''}</body></html>`)
  })
  await new Promise((resolve) => server.listen(0, resolve))
  return server
}

describe('the tablet rung through runSurfaceGate', () => {
  it('reports overflow and clipping at the tablet width and nothing else there', async () => {
    const server = await serve()
    try {
      const { port } = server.address()
      const { findings, measured } = await runSurfaceGate({
        port,
        routes: [
          { id: 'home', route: '/' },
          { id: 'about', route: '/about' },
          { id: 'plain', route: '/work/plain' },
        ],
        schemes: ['light'],
      })
      // Three routes, three rungs, one scheme.
      expect(measured).toBe(9)

      const tablet = findings.filter((f) => f.width === TABLET_VIEWPORT.width)
      expect(tablet.every((f) => f.viewport === 'tablet')).toBe(true)
      // The wide box is also a box past the edge, which is a warning: only
      // the document scroll and the cut text are errors.
      expect(tablet.map((f) => `${f.surface}:${f.kind}:${f.severity}`).sort()).toEqual([
        '/:clipped:warning',
        '/:overflow:error',
        '/about:clipped:error',
      ])
      expect(faultsForOwner(tablet, 'react-engineer')).toHaveLength(2)

      // The same two pages are clean at the other rungs: these are the
      // tablet-only faults the gate could not see before.
      const elsewhere = findings.filter((f) => f.width !== TABLET_VIEWPORT.width)
      const geometry = elsewhere.filter((f) => f.kind === 'overflow' || f.kind === 'clipped')
      expect(geometry).toEqual([])

      // What the plain page fails, it fails at its own rungs and only there.
      const plain = findings.filter((f) => f.surface === '/work/plain')
      const widthsOf = (kind) => plain.filter((f) => f.kind === kind).map((f) => f.width)
      expect(widthsOf('tap-target')).toEqual([360])
      for (const kind of ['heading', 'nav-reach', 'brand-fold']) {
        expect(widthsOf(kind)).not.toContain(TABLET_VIEWPORT.width)
        expect(widthsOf(kind).length).toBeGreaterThan(0)
      }
    } finally {
      await new Promise((resolve) => server.close(resolve))
    }
  }, 90000)
})
