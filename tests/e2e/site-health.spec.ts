import { extname, join } from 'node:path'
import { readFile, stat } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { CANONICAL_ORIGIN, RECOGNIZED_ORIGINS } from '../../scripts/utils/site-origin.js'
import { test, expect, type Page } from '@playwright/test'

// Runs against PREVIEW_URL (Vercel preview deploy, or localhost dev server)
// Usage: PREVIEW_URL=https://your-preview.vercel.app pnpm test:e2e:site

// The archived days these tests lean on, and why each one. A date here is a
// fixture: it was chosen because of what it carries, and a test that switches
// to another date silently changes what it proves. Display forms ("June 28,
// 2026") in a few assertions are the same days spelled the way the page does.
const CORPUS = {
  // Prose era, record only: has a record.json and no captured pages, so the
  // calendar must send it to the explainer, and four fields predate its era.
  recordOnly: '2026-03-12',
  // The earliest day with preserved static HTML under public/archive/.
  firstStatic: '2026-03-26',
  // A fully built day — pages, brief, signals, a full moon — the workhorse.
  built: '2026-06-28',
  // A sealed design, used to prove no link escapes onto the live site.
  sealed: '2026-07-17',
  // 07-25 was never built, so Next from 07-24 must land on 07-26.
  beforeGap: '2026-07-24',
  afterGap: '2026-07-26',
  // No such day, ever.
  never: '9999-99-99',
} as const

// Helper: check page loads with HTTP 200 and renders content
async function expectPageLoads(page: Page, path: string) {
  const response = await page.goto(path)
  expect(response?.status()).toBeLessThan(500)
  await expect(page).not.toHaveURL(/\/error/)

  // Page should render some visible content
  const body = await page.textContent('body')
  expect(body?.length).toBeGreaterThan(50)
}

test.describe('site health — core pages', () => {
  const corePages = ['/', '/about', '/elements']

  for (const path of corePages) {
    test(`${path} loads and renders`, async ({ page }) => {
      await expectPageLoads(page, path)
    })
  }
})

test.describe('site health — project pages', () => {
  const slugs = [
    'spaceman',
    'fishsticks',
    '15th-club',
    'dougmar-ch',
    'teeturn',
    'politweets',
    'twittertale',
  ]

  for (const slug of slugs) {
    test(`/work/${slug} loads and renders`, async ({ page }) => {
      await expectPageLoads(page, `/work/${slug}`)
    })
  }
})

/**
 * Panda extracts styles at build time, so a value that only exists at run time
 * — a size picked from a word's length, a delay passed as an argument — yields
 * a class name with no rule behind it. Nothing errors. The markup is right,
 * the class is on the element, and the property simply never arrives.
 *
 * The day that shipped, the hero word carried `color: transparent` (static, so
 * emitted) and its `-webkit-text-stroke` (runtime, so not) and the home page
 * opened on a blank band where the largest thing on it should have been.
 *
 * Transparent text is legitimate when something else paints the glyphs — a
 * stroke, or a clipped background. With neither, it is invisible, and that is
 * the assertion. The design changes nightly, so this names no word and no size.
 */
test.describe('site health — nothing renders invisible', () => {
  for (const path of ['/', '/about']) {
    test(`${path} paints every piece of text it renders`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      const invisible = await page.evaluate(() => {
        const bad: string[] = []
        for (const el of Array.from(document.querySelectorAll('body *'))) {
          // Only elements holding text of their own, not wrappers.
          const own = Array.from(el.childNodes)
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent ?? '')
            .join('')
            .trim()
          if (!own) continue

          const r = el.getBoundingClientRect()
          if (r.width < 2 || r.height < 2) continue // sr-only and the like

          const cs = getComputedStyle(el)
          if (cs.visibility === 'hidden' || cs.display === 'none') continue
          if (Number.parseFloat(cs.opacity) === 0) continue // a reveal mid-flight

          const transparent = /^rgba\(.*,\s*0\)$/.test(cs.color)
          if (!transparent) continue

          const stroked = Number.parseFloat(cs.webkitTextStrokeWidth || '0') > 0
          const clipped = (cs.webkitBackgroundClip || cs.backgroundClip) === 'text'
          if (stroked || clipped) continue

          bad.push(`<${el.tagName.toLowerCase()}> "${own.slice(0, 30)}" color=${cs.color}`)
        }
        return bad
      })

      expect(invisible, `text painted in nothing at all:\n${invisible.join('\n')}`).toEqual([])
    })
  }
})

test.describe('site health — archive', () => {
  test('the calendar loads and shows days', async ({ page }) => {
    await page.goto('/archive')

    // A built day opens the design it shipped; a record-only day opens the
    // explainer, because there is no design to open. Both are cells.
    const days = page.locator('a[href^="/archive/20"], a[href^="/how/20"]')
    await expect(days.first()).toBeVisible({ timeout: 15000 })
    expect(await days.count()).toBeGreaterThan(0)
  })

  // Both spellings reach the same route, and for a while only one of them
  // worked: the strict archive CSP matched `/archive/` but not `/archive`, so
  // the trailing-slash form was served with script and fetch forbidden and
  // rendered its masthead over an empty page. Whichever URL a visitor has
  // bookmarked, the calendar has to come up.
  test('the calendar loads at the trailing-slash spelling too', async ({ page }) => {
    await page.goto('/archive/')

    const days = page.locator('a[href^="/archive/20"], a[href^="/how/20"]')
    await expect(days.first()).toBeVisible({ timeout: 15000 })
    expect(await days.count()).toBeGreaterThan(0)
  })

  test('the explainer renders and links back to the archive', async ({ page }) => {
    // The calendar-to-explainer journey itself is covered under "the calendar" below.
    await page.goto(`/how/${CORPUS.built}`)
    await expect(page.getByRole('heading', { name: /June 28, 2026/ })).toBeVisible({
      timeout: 15000,
    })
    await expect(page.locator('a[href="/archive"]').first()).toBeVisible()
  })

  test('explainer handles a date with no record gracefully', async ({ page }) => {
    await page.goto(`/how/${CORPUS.never}`)
    await expect(page.getByText(`Nothing archived for ${CORPUS.never}`)).toBeVisible({
      timeout: 15000,
    })
  })

  test('the record projection is served', async ({ request }) => {
    const index = await request.get('/archive-data/index.json')
    expect(index.status()).toBe(200)
    expect((await index.json()).length).toBeGreaterThan(0)
  })
})

test.describe('site health — archived site serving', () => {
  test('archived HTML serves as static file, not SPA shell', async ({ page }) => {
    // Hard 200 on a date known to be preserved. This used to be wrapped in
    // `if (status === 200)`, so a 404 — the archive not being served at all —
    // passed the test whose whole job is to notice that.
    const response = await page.goto(`/archive/${CORPUS.firstStatic}/index.html`)
    expect(response?.status()).toBe(200)
    const content = await page.content()
    // Self-contained: CSS inlined, JS stripped by snapshot.js, so the SPA
    // entry point must not be there.
    expect(content).not.toContain('tanstack-start-client-entry')
  })

  // A preserved design's URL must end in a slash: every snapshot links its own
  // pages document-relative, and the browser resolves those against the
  // directory. The slash-less form redirects rather than serving. See #154.
  test('a preserved design serves at its own URL, and its pages resolve in-date', async ({
    page,
  }) => {
    const response = await page.goto(`/archive/${CORPUS.built}/`)
    expect(response?.status()).toBe(200)

    const about = await page.goto(`/archive/${CORPUS.built}/about.html`)
    expect(about?.status()).toBe(200)
  })

  test('the slash-less form redirects to the design', async ({ page }) => {
    await page.goto(`/archive/${CORPUS.built}`)
    await expect(page).toHaveURL(new RegExp(`/archive/${CORPUS.built}/$`))
  })
})

// The frame and the seal, exercised in a browser rather than asserted over
// bytes. The static checks live in tests/scripts/archive-seal-corpus.test.js;
// what only a real page can show is that the rail renders above a design that
// styles every bare element, and that its links go where they claim. See
// #156 and #158.
test.describe('site health — the archive frame', () => {
  test('the rail renders over the design and names the day', async ({ page }) => {
    await page.goto(`/archive/${CORPUS.built}/`)

    const frame = page.locator('[data-archive-frame]')
    await expect(frame).toBeVisible()
    await expect(frame).toContainText('June 28, 2026')
    await expect(frame).toContainText('not the current site')
  })

  test('the rail is on the inner pages too, where the design invites the click', async ({
    page,
  }) => {
    await page.goto(`/archive/${CORPUS.built}/work/spaceman.html`)
    await expect(page.locator('[data-archive-frame]')).toBeVisible()
  })

  test('it displaces the design rather than covering it', async ({ page }) => {
    await page.goto(`/archive/${CORPUS.built}/`)
    const padding = await page.evaluate(() =>
      Number.parseInt(getComputedStyle(document.body).paddingTop, 10)
    )
    expect(padding).toBeGreaterThanOrEqual(44)
  })

  test('prev and next step over the days with no build', async ({ page }) => {
    await page.goto(`/archive/${CORPUS.beforeGap}/`)
    await page.locator('[data-archive-frame] a[title^="Next build"]').click()
    await expect(page).toHaveURL(new RegExp(`/archive/${CORPUS.afterGap}/$`))
  })

  test('the explainer is one click from the design', async ({ page }) => {
    await page.goto(`/archive/${CORPUS.built}/`)
    await page.locator('[data-archive-frame] a', { hasText: 'How it was made' }).click()
    await expect(page).toHaveURL(new RegExp(`/how/${CORPUS.built}$`))
  })

  test('a sealed design keeps no link onto the live site', async ({ page }) => {
    await page.goto(`/archive/${CORPUS.sealed}/`)
    // Every origin the site has ever served from, not just today's. After a
    // domain move a snapshot can carry either, and a check spelling one host
    // silently stops covering the other.
    const escaping = await page.evaluate(
      (origins) =>
        [...document.querySelectorAll('a')]
          .filter((a) => !a.closest('[data-archive-frame]'))
          .map((a) => a.getAttribute('href') ?? '')
          .filter(
            (href) => href.startsWith('/') || origins.some((o: string) => href.startsWith(o))
          ),
      RECOGNIZED_ORIGINS
    )
    expect(escaping).toEqual([])
  })
})

// The archive must not change when the site does. These run against a real
// build, so they fail the morning a redesign reaches in — which is the whole
// point of #152 and the reason the tokens live in panda.config.ts.
test.describe('site health — the archive keeps its own identity', () => {
  for (const path of ['/archive', `/how/${CORPUS.built}`]) {
    test(`${path} renders outside the nightly shell`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('h1')).toBeVisible({ timeout: 15000 })

      // The nightly footer link belongs to every other page, not to these.
      await expect(page.locator('a[data-archive-link]')).toHaveCount(0)

      // The ground is the archive's, not the day's.
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
      expect(bg).toBe('rgb(14, 14, 16)')
    })

    test(`${path} sets its own type, not the day's chassis`, async ({ page }) => {
      await page.goto(path)
      // These pages fetch their record before rendering anything.
      await expect(page.locator('h1')).toBeVisible({ timeout: 15000 })
      const fonts = await page.evaluate(() => ({
        heading: getComputedStyle(document.querySelector('h1') as Element).fontFamily,
        loaded: [...document.querySelectorAll('link[rel=stylesheet]')].some((l) =>
          (l as HTMLLinkElement).href.includes('IBM+Plex')
        ),
      }))
      expect(fonts.heading).toContain('IBM Plex Sans')
      expect(fonts.loaded).toBe(true)
    })
  }

  test('the rest of the site is untouched by all of that', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('a[data-archive-link]')).toBeVisible({ timeout: 15000 })
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor)
    expect(bg).not.toBe('rgb(14, 14, 16)')
  })
})

test.describe('site health — the calendar', () => {
  test('opens on the newest month with the newest day marked (#414)', async ({ page }) => {
    await page.goto('/archive')
    const current = page.locator('a[aria-current="date"]')
    await expect(current).toBeVisible({ timeout: 15000 })
    // The marked cell is the latest day in the index, and it is on screen
    // without pressing Next — which is the whole point of the change.
    const index = await page.evaluate(() =>
      fetch('/archive-data/index.json').then((r) => r.json() as Promise<{ date: string }[]>)
    )
    const newest = index
      .map((e) => e.date)
      .sort()
      .at(-1)
    await expect(current).toHaveAttribute('href', new RegExp(`/${newest}/?$`))
    await expect(page.locator('button', { hasText: 'next' })).toBeDisabled()
  })

  test('the active view toggle is legible: light label on a filled button (#423)', async ({
    page,
  }) => {
    await page.goto('/archive')
    const pressed = page.locator('button[aria-pressed="true"]')
    await expect(pressed).toHaveCount(1)
    await expect(pressed).toHaveText('Month')
    // The bug was two classes both setting `background`, with the transparent
    // one winning the cascade; the label was then page-colored text on the page.
    const { background, color } = await pressed.evaluate((el) => {
      const s = getComputedStyle(el)
      return { background: s.backgroundColor, color: s.color }
    })
    expect(background).not.toBe('rgba(0, 0, 0, 0)')
    expect(background).not.toBe(color)
    await page.locator('button', { hasText: 'All' }).click()
    await expect(page.locator('button[aria-pressed="true"]')).toHaveText('All')
  })

  test('a day opens the design it shipped', async ({ page }) => {
    await page.goto('/archive')
    // The workhorse day is in June; the calendar opens on the newest month.
    await page.locator('button', { hasText: 'All' }).click()
    const cell = page.locator(`a[href="/archive/${CORPUS.built}/"]`).first()
    await expect(cell).toBeVisible({ timeout: 15000 })
    await cell.click()
    await expect(page).toHaveURL(new RegExp(`/archive/${CORPUS.built}/$`))
  })

  test('a day with no preserved pages goes to the explainer instead', async ({ page }) => {
    await page.goto('/archive')
    await page.locator('button', { hasText: 'All' }).click()
    const recordCell = page.locator(`a[href="/how/${CORPUS.recordOnly}"]`).first()
    await expect(recordCell).toBeVisible({ timeout: 15000 })
  })
})

test.describe('site health — the explainer', () => {
  test('leads with the brief and links to the design', async ({ page }) => {
    await page.goto(`/how/${CORPUS.built}`)
    await expect(page.getByRole('heading', { name: 'A brief was written' })).toBeVisible({
      timeout: 15000,
    })
    await expect(page.locator(`a[href="/archive/${CORPUS.built}/"]`)).toBeVisible()
  })

  test('names the era when a field did not exist yet, rather than looking broken', async ({
    page,
  }) => {
    await page.goto(`/how/${CORPUS.recordOnly}`)
    // Four fields predate the prose era, so the sentence appears more than once.
    await expect(page.getByText(/had no such concept in the prose era/).first()).toBeVisible({
      timeout: 15000,
    })
    // A record-only day has no design to offer.
    await expect(page.locator(`a[href="/archive/${CORPUS.recordOnly}/"]`)).toHaveCount(0)
  })

  test('summarizes each signal in words rather than counting items', async ({ page }) => {
    await page.goto(`/how/${CORPUS.built}`)
    await expect(page.getByText(/full moon, \d+% lit/)).toBeVisible({ timeout: 15000 })
    await expect(page.getByText(/\d+ items/)).toHaveCount(0)
  })

  test('never embeds the preserved design, which would put two identities on one page', async ({
    page,
  }) => {
    await page.goto(`/how/${CORPUS.built}`)
    await expect(page.locator('iframe')).toHaveCount(0)
  })
})

test.describe('site health — content verification', () => {
  test('home page shows real content', async ({ page }) => {
    await page.goto('/')

    // Non-Specimen/Poster days: project names appear in the listing.
    // Specimen/Poster days: phrase-only home page — no project listing, but h1 (hero phrase) is present.
    const projectNames = page
      .locator('body')
      .filter({ hasText: /Spaceman|FishSticks|Doug March|Teeturn|Politweets/ })
    const heroPhrase = page.locator('h1')
    await expect(projectNames.or(heroPhrase).first()).toBeVisible({ timeout: 15000 })
  })

  test('about page shows real timeline content', async ({ page }) => {
    await page.goto('/about')

    // Wait for content to hydrate by checking for real timeline content
    await expect(page.locator('body')).toContainText(/LivingSocial|iCapital|Doug March/, {
      timeout: 15000,
    })
  })
})

test.describe('site health — share-sheet meta', () => {
  test('shell HTML og meta is well-formed when present', async ({ page }) => {
    await page.goto('/')
    // A committed checkout (before the first pipeline run on this branch) has
    // no og meta in __root.tsx — skip rather than hard-fail in that case.
    const ogMeta = page.locator('meta[property="og:image"]')
    // Fast skip (no ~30s auto-wait) when the tag is absent on a pre-pipeline checkout.
    if ((await ogMeta.count()) === 0)
      test.skip(true, 'og meta not yet generated (pre-first-pipeline-run checkout)')
    const ogImage = await ogMeta.getAttribute('content')
    // Two shapes are valid. A dated capture is what the pipeline writes on a
    // green run; `default.png` is the committed fallback that ships a real card
    // before any run has succeeded, and is what a fresh checkout serves. See
    // #201 — asserting only the dated form encoded an assumption that the site
    // always has a successful capture behind it, which it did not.
    expect(ogImage).toMatch(/\/og\/(\d{4}-\d{2}-\d{2}|default)\.png$/)
    // Whichever it is, the card has to point at this site.
    expect(ogImage).toContain(CANONICAL_ORIGIN)
    const card = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    expect(card).toBe('summary_large_image')
  })
})

test.describe('site health — archive link (#155)', () => {
  // This exists because the link silently disappeared. It was on every build
  // through 2026-07-10 and vanished on 2026-07-12, the day the page shell
  // became a declared Art Director choice. Sixteen builds shipped without it
  // before anyone looked. The link now lives in __root.tsx, outside <Layout>,
  // where no agent can delete it.
  //
  // Asserts VISIBLE, not merely present: a design using full-bleed
  // `position: fixed` or `overflow: hidden` can bury an element that is
  // perfectly well-formed in the markup.
  test('every page carries a visible link into the archive', async ({ page }) => {
    for (const path of ['/', '/about', '/work/spaceman']) {
      await page.goto(path)
      const link = page.locator('a[data-archive-link]')
      await expect(link, `no visible archive link on ${path}`).toBeVisible({ timeout: 15000 })
      await expect(link).toHaveAttribute('href', '/archive')
      await expect(link).toContainText(/Archive [—·] \d+ designs/)
    }
  })

  test('the archive link actually reaches the archive', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('a[data-archive-link]')
    await expect(link).toBeVisible({ timeout: 15000 })
    await link.click()
    await expect(page).toHaveURL(/\/archive/, { timeout: 15000 })
  })
})

const STATIC_MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

/**
 * A minimal static server over `dist/client`, covering just enough of
 * vercel.json's rewrites (`/` → `_shell.html`, `/<dir>` → `<dir>/index.html`)
 * to serve the routes below — nothing else touches this server.
 *
 * It exists because `vite preview`, which every other test in this file runs
 * against, does not serve these bytes. TanStack Start's own preview plugin
 * (`previewServerPlugin` in `@tanstack/start-plugin-core`) intercepts every
 * request and re-renders the route live through `dist/server/server.js`, so a
 * page loaded through `vite preview` never carries the `Content-Security-
 * Policy` meta `pin-inline-scripts.js` wrote into the file on disk — that
 * step only touches `dist/client`, and `vite preview` never reads it for an
 * app route. Confirmed by hand: appending a marker string to
 * `dist/client/archive/index.html` and requesting `/archive` from
 * `vite preview` does not return it. Production is unaffected — Vercel's
 * `outputDirectory: dist/client` serves the static files directly, with no
 * server in front of them for these routes — so this is the one place a real
 * static host needs standing in for `vite preview`, which is what the
 * decision in #332 assumed would work.
 */
function serveDistClient(root: string): Promise<{ server: Server; baseURL: string }> {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', 'http://localhost')
    const pathname =
      decodeURIComponent(url.pathname) === '/' ? '/_shell.html' : decodeURIComponent(url.pathname)

    for (const candidate of [join(root, pathname), join(root, pathname, 'index.html')]) {
      try {
        const info = await stat(candidate)
        if (!info.isFile()) continue
        res.writeHead(200, {
          'Content-Type': STATIC_MIME[extname(candidate)] ?? 'application/octet-stream',
        })
        res.end(await readFile(candidate))
        return
      } catch {
        // try the next candidate
      }
    }
    res.writeHead(404)
    res.end('not found')
  })

  return new Promise((resolve, reject) => {
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : 0
      resolve({ server, baseURL: `http://127.0.0.1:${port}` })
    })
  })
}

test.describe('site health — inline script pinning (#332)', () => {
  let server: Server
  let baseURL: string

  test.beforeAll(async () => {
    ;({ server, baseURL } = await serveDistClient(join(process.cwd(), 'dist', 'client')))
  })

  test.afterAll(() => {
    server.close()
  })

  for (const path of ['/', '/archive', `/how/${CORPUS.built}`]) {
    test(`${path} carries a pinned CSP and logs no violation`, async ({ page }) => {
      const violations: string[] = []
      page.on('console', (msg) => {
        if (/Content-Security-Policy|Refused to execute/.test(msg.text())) {
          violations.push(msg.text())
        }
      })
      page.on('pageerror', (err) => {
        const text = String(err)
        if (/Content-Security-Policy|Refused to execute/.test(text)) violations.push(text)
      })

      await page.goto(`${baseURL}${path}`)
      await expect(page.locator('h1')).toBeVisible({ timeout: 15000 })

      const meta = page.locator('meta[http-equiv="Content-Security-Policy"]')
      await expect(meta).toHaveCount(1)
      expect(await meta.getAttribute('content')).toContain('sha256-')

      expect(violations).toEqual([])
    })
  }
})

test.describe('site health — navigation', () => {
  test('can navigate between pages without errors', async ({ page }) => {
    // Start at home
    const homeResponse = await page.goto('/')
    expect(homeResponse?.status()).toBeLessThan(500)

    // The first /about link in DOM order is not always the visible one: a
    // sidebar may render a phone-only nav row ahead of its desktop list, and
    // at Desktop Chrome's width that row is display: none (2026-09-14 shipped
    // exactly that and this test went red on main). The surface gate now
    // fails a route with no visible /about link at either rung, so the
    // assertion here is that a visible one can be clicked, not which one.
    const aboutLink = page.locator('a[href="/about"]:visible').first()
    await expect(aboutLink).toBeVisible({ timeout: 15000 })

    await aboutLink.click()
    await expect(page).toHaveURL(/\/about/, { timeout: 15000 })
  })
})
