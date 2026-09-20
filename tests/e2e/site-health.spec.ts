import { extname, join } from 'node:path'
import { readFile, stat } from 'node:fs/promises'
import { createServer, type Server } from 'node:http'
import { siteCallout } from '../../app/content/callout'
import { NARROW_VIEWPORT, WIDE_VIEWPORT } from '../../elements/chassis/viewports.js'
import { CANONICAL_ORIGIN, RECOGNIZED_ORIGINS } from '../../shared/site-origin.js'
import { test, expect, type Locator, type Page } from '@playwright/test'

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

const PROJECT_SLUGS = [
  'spaceman',
  'fishsticks',
  '15th-club',
  'dougmar-ch',
  'teeturn',
  'politweets',
  'twittertale',
]

test.describe('site health — project pages', () => {
  for (const slug of PROJECT_SLUGS) {
    test(`/work/${slug} loads and renders`, async ({ page }) => {
      await expectPageLoads(page, `/work/${slug}`)
    })
  }
})

/**
 * /work/dougmar-ch is the one page whose layout does not change nightly. The
 * engineer still rewrites the route around it, so the build validator reads
 * the route's source and this reads what the route rendered: the fixed
 * component is on the page, it carries the whole paper, and its column is the
 * measure it was drawn with. The palette and the faces are the day's, so none
 * of this names a colour or a font. See #533.
 */
test.describe('site health — the white paper holds its layout', () => {
  test('/work/dougmar-ch renders the fixed page and no other slug does', async ({ page }) => {
    await page.goto('/work/dougmar-ch')
    const paper = page.locator('[data-white-paper]')
    await expect(paper).toHaveCount(1)

    await expect(paper.locator('h2')).toHaveText([
      'Problem',
      'Constraints',
      'Approach',
      'Process',
      'Decisions',
      'Outcome',
      'References',
      'Built with',
    ])
    await expect(paper.locator('ol > li')).toHaveCount(9)
    await expect(paper.locator('ol > li h3').first()).toHaveText('Signals')
    await expect(paper.locator('ol > li h3').last()).toHaveText('Archive')
    await expect(paper.locator('a[href^="https://chadfowler.com/"]')).toHaveCount(3)

    // The title stays the route's, and there is one of it.
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(paper.locator('h1')).toHaveCount(0)

    await page.goto('/work/spaceman')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('[data-white-paper]')).toHaveCount(0)
  })

  for (const [width, measure] of [
    [WIDE_VIEWPORT.width, 640],
    [NARROW_VIEWPORT.width, 0],
  ] as const) {
    test(`the text column holds at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/work/dougmar-ch')
      const box = await page.evaluate(() => {
        const paper = document.querySelector('[data-white-paper]')
        const prose = paper?.querySelector('section p')
        if (!paper || !prose) return null
        const cs = getComputedStyle(prose)
        return {
          paper: paper.getBoundingClientRect().width,
          prose: prose.getBoundingClientRect().width,
          fontSize: cs.fontSize,
          scroll: document.documentElement.scrollWidth,
        }
      })
      expect(box).not.toBeNull()
      if (!box) return
      expect(box.fontSize).toBe('18px')
      expect(box.scroll).toBeLessThanOrEqual(width)
      // 40rem from `lg` up; below it, the article's width less 1.25rem a side.
      expect(Math.round(box.prose)).toBe(measure || Math.round(box.paper) - 40)
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
        // Text the element holds itself, not what its children hold.
        const ownText = (el: Element) =>
          Array.from(el.childNodes)
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent ?? '')
            .join('')
            .trim()

        // sr-only, collapsed, and a reveal caught mid-flight are all fine.
        const onScreen = (el: Element, cs: CSSStyleDeclaration) => {
          const r = el.getBoundingClientRect()
          if (r.width < 2 || r.height < 2) return false
          if (cs.visibility === 'hidden' || cs.display === 'none') return false
          return Number.parseFloat(cs.opacity) !== 0
        }

        // Transparent glyphs still count as painted if a stroke or a clipped
        // background draws them.
        const painted = (cs: CSSStyleDeclaration) => {
          if (!/^rgba\(.*,\s*0\)$/.test(cs.color)) return true
          if (Number.parseFloat(cs.webkitTextStrokeWidth || '0') > 0) return true
          return (cs.webkitBackgroundClip || cs.backgroundClip) === 'text'
        }

        const bad: string[] = []
        for (const el of Array.from(document.querySelectorAll('body *'))) {
          const own = ownText(el)
          if (!own) continue

          const cs = getComputedStyle(el)
          if (!onScreen(el, cs) || painted(cs)) continue

          bad.push(`<${el.tagName.toLowerCase()}> "${own.slice(0, 30)}" color=${cs.color}`)
        }
        return bad
      })

      expect(invisible, `text painted in nothing at all:\n${invisible.join('\n')}`).toEqual([])
    })
  }
})

/**
 * Type sized without reference to the column it lands in. 2026-09-20 set
 * project titles at 273px in columns of 240px and 819px under `overflow-wrap:
 * anywhere`, so instead of overflowing, "Spaceman" ran one letter per line and
 * "Twittertale" came out as twit / tert / ale. The text was painted and nothing
 * scrolled sideways, so every other check here passed. See #530.
 *
 * The assertion is the break itself: one word whose glyphs sit on more than
 * one line. A word wider than its box is the cause, but a wide word can also
 * overflow or bleed on purpose without breaking, and telling those apart takes
 * thresholds. A word on two lines has no honest reading, at any size. Run over
 * the 19 archived designs from 2026-08-30 on, every hit was a word cut in half.
 *
 * A word is a run of letters and digits, so a URL or an email wrapping at its
 * punctuation is not a break, and neither is a hyphenated compound. A stack
 * of one word per line stays expressible: `<br>` between words breaks between
 * them, and vertical `writing-mode` is skipped outright. So is `hyphens:
 * auto`, where the break arrives with a hyphen and is ordinary typesetting.
 */
const SHRED_VIEWPORTS = [NARROW_VIEWPORT, WIDE_VIEWPORT]

// Designs the owner chose to leave up with this defect, keyed by the date in
// the page's og:image, with the routes it shows on. `test.fail` rather than a
// skip: CI keeps proving the gate catches the day, and the entry stops
// applying the night a new design replaces it. Delete entries once they are
// history.
const KNOWN_SHREDS: Record<string, string[]> = {}

test.describe('site health — no word breaks across lines', () => {
  const paths = ['/', '/about', ...PROJECT_SLUGS.map((slug) => `/work/${slug}`)]

  for (const path of paths) {
    for (const viewport of SHRED_VIEWPORTS) {
      test(`${path} at ${viewport.width} keeps every word on one line`, async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto(path)
        await page.waitForLoadState('networkidle')
        // A fallback face has different widths; measure the one that ships.
        await page.evaluate(() => document.fonts.ready)

        const ogImage = await page.evaluate(
          () => document.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? ''
        )
        const designDate = ogImage.match(/\/og\/(\d{4}-\d{2}-\d{2})\.png$/)?.[1] ?? ''
        test.fail(
          KNOWN_SHREDS[designDate]?.includes(path) ?? false,
          `${designDate} shipped with shredded titles and stays up (#530)`
        )

        const shredded = await page.evaluate(() => {
          // Vertical type is a deliberate stack, and a hyphenated break is
          // ordinary typesetting. Neither is this defect.
          const measurable = (cs: CSSStyleDeclaration) =>
            cs.visibility !== 'hidden' &&
            cs.hyphens !== 'auto' &&
            cs.writingMode.startsWith('horizontal')

          // The box that did the breaking is the nearest one that is not inline.
          const boxWidth = (el: Element) => {
            let block = el
            while (block.parentElement && getComputedStyle(block).display.startsWith('inline')) {
              block = block.parentElement
            }
            const cs = getComputedStyle(block)
            return (
              block.clientWidth -
              Number.parseFloat(cs.paddingLeft) -
              Number.parseFloat(cs.paddingRight)
            )
          }

          // One rect per line the word touches; `display: none` gives none.
          const range = document.createRange()
          const brokenWords = (node: Node, el: Element, size: number) =>
            Array.from((node.textContent ?? '').matchAll(/[\p{L}\p{N}'’]+/gu)).flatMap((word) => {
              range.setStart(node, word.index)
              range.setEnd(node, word.index + word[0].length)
              const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0)
              const lines = new Set(rects.map((r) => Math.round(r.top / (size / 2))))
              if (lines.size < 2) return []
              const needs = rects.reduce((sum, r) => sum + r.width, 0)
              return [
                `<${el.tagName.toLowerCase()}> "${word[0]}" at ${Math.round(size)}px needs ` +
                  `${Math.round(needs)}px, its box is ${Math.round(boxWidth(el))}px, ` +
                  `broken over ${lines.size} lines`,
              ]
            })

          const bad: string[] = []
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const el = node.parentElement
            if (!el) continue
            const cs = getComputedStyle(el)
            if (measurable(cs)) bad.push(...brokenWords(node, el, Number.parseFloat(cs.fontSize)))
          }
          return bad
        })

        expect(
          shredded,
          `${path} at ${viewport.width}x${viewport.height}: a word is broken mid-word because its ` +
            `column is narrower than the word. Size the type to the column, or stack words ` +
            `with <br> or writing-mode:\n${shredded.join('\n')}`
        ).toEqual([])
      })
    }
  }
})

/**
 * The reveal must not be load-bearing.
 *
 * Sections arrive with `rise`/`wipe` under `animation-fill-mode: both`, so
 * their resting state before the animation runs is invisible. That makes the
 * whole page below the hero depend on a scroll-driven timeline advancing. The
 * `@supports (animation-timeline: view())` guard covers an engine that cannot
 * do it at all; it does not cover one that claims support and then does not
 * drive it, and the failure there is a blank page, not a still one.
 *
 * Under reduced motion no animation runs at all, which is the cheapest way to
 * ask the question the guard cannot: with the reveal taken away, is the page
 * still there? The chassis preset drops `animation-name` outright so that it is.
 *
 * The invisible-text scan above skips `opacity: 0` on purpose, since a reveal
 * caught mid-flight is legitimate. Nothing here is mid-flight.
 */
test.describe('site health — the reveal is not load-bearing', () => {
  for (const path of ['/', '/about']) {
    test(`${path} renders without the reveal running`, async ({ page }) => {
      // emulateMedia rather than `test.use({ reducedMotion })`: the fixture
      // did not reach the page under this project's `use` block, and the test
      // passed against a page that had never been asked for reduced motion.
      // Asserting the emulation took is cheaper than trusting it.
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await page.goto(path)
      await page.waitForLoadState('networkidle')

      expect(
        await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
        'reduced motion was not emulated, so the rest of this test proves nothing'
      ).toBe(true)

      const stranded = await page.evaluate(() =>
        Array.from(document.querySelectorAll('body *'))
          .filter((el) => (el.textContent ?? '').trim().length > 0)
          .filter((el) => {
            const cs = getComputedStyle(el)
            if (cs.visibility === 'hidden' || cs.display === 'none') return false
            return Number.parseFloat(cs.opacity) === 0
          })
          .map(
            (el) => `<${el.tagName.toLowerCase()}> "${(el.textContent ?? '').trim().slice(0, 30)}"`
          )
      )

      expect(
        stranded,
        `left at opacity 0 with no animation to finish:\n${stranded.join('\n')}`
      ).toEqual([])

      // And the page is genuinely populated, not merely free of zeroes.
      expect((await page.locator('body').innerText()).trim().length).toBeGreaterThan(200)
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

  // The screenshot and viewport captures are copied out of archive/ at build
  // time, not committed a second time (#549). A build that stops copying them
  // would still answer 200 for these URLs, with the SPA shell, so the type is
  // what proves an image came back.
  test("the newest day's screenshot and phone capture are served as images", async ({
    request,
  }) => {
    const index = (await (await request.get('/archive-data/index.json')).json()) as {
      date: string
      hasScreenshot: boolean
    }[]
    const newest = index
      .filter((e) => e.hasScreenshot)
      .map((e) => e.date)
      .sort()
      .at(-1)
    expect(newest).toBeTruthy()

    const shot = await request.get(`/archive-data/${newest}.png`)
    expect(shot.status()).toBe(200)
    expect(shot.headers()['content-type']).toContain('image/png')

    // PNG before #549, WebP after; one of the two has to answer.
    const phone = await Promise.all(
      ['webp', 'png'].map((ext) => request.get(`/archive-data/${newest}/viewports/mobile.${ext}`))
    )
    expect(
      phone.some((r) => r.status() === 200 && r.headers()['content-type']?.startsWith('image/'))
    ).toBe(true)
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
  test('shell HTML og meta is well-formed', async ({ page }) => {
    await page.goto('/')
    // __root.tsx has carried og meta since 2026-07-13 and the pipeline's
    // template always writes it, so a missing tag is a regression, not a
    // checkout that has not had its first run.
    const ogMeta = page.locator('meta[property="og:image"]')
    await expect(ogMeta).toHaveCount(1)
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
  // where no agent can delete it. On `/` the home callout carries it instead
  // (#532, below), on the same `data-archive-link` hook, so these assertions
  // hold for home without knowing which file rendered the link.
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

test.describe('site health — the home callout (#532)', () => {
  // The one element that says what the site does, and home's only link to the
  // white paper and the archive. The orchestrator writes the component and the
  // engineer places it, so this is the check on the placing: a callout the
  // build validator saw in index.tsx can still be buried, or put in the hero.
  test('home shows it below the hero, above the footer, with one of its lines', async ({
    page,
  }) => {
    await page.goto('/')
    const callout = page.locator('[data-site-callout]')
    await expect(callout).toBeVisible({ timeout: 15000 })
    await expect(callout).toHaveCount(1)
    await expect(callout).toHaveAccessibleName(siteCallout.label)

    const line = (await callout.locator('p').first().textContent())?.trim()
    expect(siteCallout.lines).toContain(line)

    const placed = await page.evaluate(() => {
      const el = document.querySelector('[data-site-callout]') as Element
      const h1 = document.querySelector('h1') as Element
      const footer = document.querySelector('footer')
      const top = (node: Element) => node.getBoundingClientRect().top + window.scrollY
      return {
        holdsHero: el.contains(h1),
        calloutTop: top(el),
        heroBottom: h1.getBoundingClientRect().bottom + window.scrollY,
        footerTop: footer && !footer.contains(el) ? top(footer) : null,
        overflows: el.getBoundingClientRect().right > window.innerWidth + 1,
      }
    })
    expect(placed.holdsHero).toBe(false)
    expect(placed.calloutTop).toBeGreaterThanOrEqual(placed.heroBottom)
    if (placed.footerTop !== null) expect(placed.calloutTop).toBeLessThan(placed.footerTop)
    expect(placed.overflows).toBe(false)
  })

  test('the archive link on home is the callout’s, and the only one', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-site-callout]')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('a[data-archive-link]')).toHaveCount(1)
    await expect(page.locator('[data-site-callout] a[data-archive-link]')).toHaveCount(1)
  })

  test('no other page carries the callout', async ({ page }) => {
    for (const path of ['/about', '/work/spaceman']) {
      await page.goto(path)
      await expect(page.locator('a[data-archive-link]')).toBeVisible({ timeout: 15000 })
      await expect(page.locator('[data-site-callout]')).toHaveCount(0)
    }
  })

  test('the main link reaches the white paper', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('[data-site-callout] a[data-callout-white-paper]')
    await expect(link).toBeVisible({ timeout: 15000 })
    await expect(link).toHaveAttribute('href', '/work/dougmar-ch')
    await link.click()
    await expect(page).toHaveURL(/\/work\/dougmar-ch$/, { timeout: 15000 })
    await expect(page.locator('h1')).toBeVisible({ timeout: 15000 })
  })

  test('the second link reaches the archive', async ({ page }) => {
    await page.goto('/')
    const link = page.locator('[data-site-callout] a[data-archive-link]')
    await expect(link).toBeVisible({ timeout: 15000 })
    await link.click()
    await expect(page).toHaveURL(/\/archive/, { timeout: 15000 })
    await expect(page.locator('h1')).toContainText('every design it has made', { timeout: 15000 })
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

/**
 * /elements reads the presets, so the browser is where it gets held to them
 * (#552). Every colour it prints must be the colour its swatch paints from the
 * built stylesheet, no text may sit under the type ramp's floor, nothing
 * scrolls sideways, and the nightly Sidebar, which runs down the left edge of
 * the Layout wrapper, must not sit on the content. None of it names a token or
 * a size: the preset changes every night.
 *
 * The page callbacks only gather numbers and strings; the comparing happens
 * here, so each stays a few lines long.
 */
const rgbToHex = (rgb: string) => {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb)
  if (!m) return rgb
  return `#${[m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('')}`
}

test.describe('site health — /elements reads the preset', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/elements')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('[data-token-path]').first()).toBeVisible()
  })

  test('every printed colour is the colour the built CSS paints', async ({ page }) => {
    const swatches = await page.locator('[data-token-path]').evaluateAll((items) =>
      items.map((item) => ({
        path: item.getAttribute('data-token-path'),
        printed: item.querySelector('[data-token-value]')?.textContent?.trim() ?? '',
        paints: item.firstElementChild
          ? getComputedStyle(item.firstElementChild).backgroundColor
          : '',
      }))
    )
    const hexes = swatches.filter((s) => /^#[0-9a-f]{6}$/i.test(s.printed))
    expect(hexes.length, 'no swatch had a hex to compare').toBeGreaterThan(0)
    const wrong = hexes.filter((s) => rgbToHex(s.paints).toLowerCase() !== s.printed.toLowerCase())
    expect(wrong.map((s) => `${s.path}: prints ${s.printed}, paints ${s.paints}`)).toEqual([])
  })

  test('a semantic colour with no value tonight says so instead of painting nothing', async ({
    page,
  }) => {
    const swatches = await page.locator('[data-token-path^="semantic."]').evaluateAll((items) =>
      items.map((item) => ({
        path: item.getAttribute('data-token-path'),
        said: /not defined tonight/.test(item.textContent ?? ''),
        paints: item.firstElementChild
          ? getComputedStyle(item.firstElementChild).backgroundColor
          : '',
      }))
    )
    const blank = swatches.filter(
      (s) => !s.said && (s.paints === '' || s.paints === 'rgba(0, 0, 0, 0)')
    )
    expect(blank.map((s) => s.path)).toEqual([])
  })

  for (const width of [360, 820, 1440]) {
    test(`type floor, overflow and sidebar at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.reload()
      await page.waitForLoadState('networkidle')

      // The ramp floor is whatever `2xs` is tonight.
      const floor = await page.evaluate(() => {
        const probe = document.createElement('span')
        probe.style.fontSize = 'var(--font-sizes-2xs)'
        document.body.append(probe)
        const size = Number.parseFloat(getComputedStyle(probe).fontSize)
        probe.remove()
        return size
      })

      const lines = await page.evaluate(() => {
        const out: { size: number; text: string; left: number; right: number }[] = []
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement
          const text = n.textContent?.trim() ?? ''
          if (!el || !text || el.closest('[aria-hidden="true"]')) continue
          const size = Number.parseFloat(getComputedStyle(el).fontSize)
          const range = document.createRange()
          range.selectNodeContents(n)
          for (const r of range.getClientRects()) {
            if (r.width > 0)
              out.push({ size, text: text.slice(0, 24), left: r.left, right: r.right })
          }
        }
        return out
      })
      const small = lines.filter((l) => l.size < floor - 0.01)
      expect(
        small.map((l) => `${l.size}px "${l.text}"`),
        `text under the ${floor}px floor`
      ).toEqual([])

      const page_ = await page.evaluate(() => {
        const root = document.documentElement
        const sidebar = document.querySelector('[aria-hidden="true"]')
        const shown = sidebar && getComputedStyle(sidebar).display !== 'none'
        const box = shown ? sidebar.getBoundingClientRect() : null
        return {
          overflow: root.scrollWidth - root.clientWidth,
          side: box && { left: box.left, right: box.right },
        }
      })
      expect(page_.overflow).toBeLessThanOrEqual(0)

      // The Sidebar shows from the md breakpoint up, and keeps clear of every line.
      if (width >= 768) expect(page_.side, 'the sidebar did not render').not.toBeNull()
      const { side } = page_
      const under = side ? lines.filter((l) => l.left < side.right && l.right > side.left) : []
      expect(
        under.map((l) => l.text),
        'text under the sidebar'
      ).toEqual([])
    })
  }
})

/**
 * The work index is hand-written and takes only the day's colours and type
 * (#561). Until then it was styled like a different site and clipped at 320:
 * a 208px column under a 54px title, so "Spaceman" read "Spacemar". The Layout
 * wrapper hides horizontal overflow, so `scrollWidth` says nothing is wrong
 * while text runs off the screen. Text is measured against the viewport too.
 */
test.describe('site health — the work index fits every width (#561)', () => {
  for (const width of [320, 768, 1440]) {
    test(`/work at ${width} clips nothing, breaks no word and links every project`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/work')
      await page.waitForLoadState('networkidle')
      await page.evaluate(() => document.fonts.ready)

      await expect(page.locator('h1')).toHaveCount(1)
      for (const slug of PROJECT_SLUGS) {
        await expect(page.locator(`main a[href="/work/${slug}"]`)).toBeVisible()
      }

      // The page callbacks only gather numbers; the comparing happens here.
      const text = await page.evaluate(() => {
        const range = document.createRange()
        const linesOf = (node: Text, start: number, end: number, size: number) => {
          range.setStart(node, start)
          range.setEnd(node, end)
          const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0)
          return new Set(rects.map((r) => Math.round(r.top / (size / 2)))).size
        }
        const wordsOf = (node: Text, size: number) =>
          Array.from(node.data.matchAll(/[\p{L}\p{N}'’]+/gu), (w) => ({
            word: w[0],
            size: Math.round(size),
            lines: linesOf(node, w.index, w.index + w[0].length, size),
          }))
        const edgesOf = (node: Text) => {
          range.selectNodeContents(node)
          return Array.from(range.getClientRects())
            .filter((r) => r.width > 0)
            .map((r) => ({ left: Math.round(r.left), right: Math.round(r.right) }))
        }
        const shown = (el: Element) => {
          const cs = getComputedStyle(el)
          return cs.visibility !== 'hidden' && cs.writingMode.startsWith('horizontal')
        }

        const out: {
          text: string
          edges: ReturnType<typeof edgesOf>
          words: ReturnType<typeof wordsOf>
        }[] = []
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement
          if (!el || el.closest('[aria-hidden="true"]') || !shown(el)) continue
          const size = Number.parseFloat(getComputedStyle(el).fontSize)
          const node = n as Text
          out.push({
            text: node.data.trim().slice(0, 24),
            edges: edgesOf(node),
            words: wordsOf(node, size),
          })
        }
        return out
      })

      const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a[href]'), (a) => {
          const r = a.getBoundingClientRect()
          return { text: (a.textContent ?? '').trim().slice(0, 24), w: r.width, h: r.height }
        })
      )
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      )

      const clipped = text.flatMap((t) =>
        t.edges
          .filter((e) => e.left < 0 || e.right > width + 0.5)
          .map((e) => `"${t.text}" ${e.left}..${e.right}`)
      )
      // A word whose glyphs sit on more than one line was cut in half.
      const broken = text.flatMap((t) =>
        t.words
          .filter((w) => w.lines > 1)
          .map((w) => `"${w.word}" at ${w.size}px on ${w.lines} lines`)
      )
      const small = links
        .filter((l) => l.w > 0 && l.h > 0 && (l.w < 44 || l.h < 44))
        .map((l) => `"${l.text}" ${Math.round(l.w)}x${Math.round(l.h)}`)

      expect(overflow, 'the page scrolls sideways').toBeLessThanOrEqual(0)
      expect(clipped, 'text runs past the viewport').toEqual([])
      expect(broken, 'a word is broken across lines').toEqual([])
      expect(small, 'link targets under 44px').toEqual([])
    })
  }
})

/**
 * /experiments wrote `padding: '3 4'`. Panda resolves a token only when it is
 * the whole value, so the row shipped 3px of vertical padding and 4px of
 * horizontal, and stood 25px tall against a 44px tap target (#553). The page
 * sits in the nightly Layout wrapper, whose Sidebar is absolute from top to
 * bottom, so a wrapper as tall as three rows put the Sidebar's line on the rows.
 *
 * The spacing values are read back from the stylesheet's own `--spacing-*`
 * variables, so this names no pixel value: the chassis moves them nightly.
 */
test.describe('site health — /experiments spacing', () => {
  for (const width of [360, 820, 1440]) {
    test(`rows carry the spacing tokens, reach 44px and clear the sidebar at ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/experiments')
      await page.waitForLoadState('networkidle')

      const token = (name: string) =>
        page.evaluate((n) => {
          const probe = document.createElement('div')
          probe.style.paddingLeft = `var(--spacing-${n})`
          document.body.append(probe)
          const px = getComputedStyle(probe).paddingLeft
          probe.remove()
          return px
        }, name)

      const rows = await page.locator('a[href]:not([data-archive-link])').evaluateAll((links) =>
        links.map((a) => {
          const cs = getComputedStyle(a)
          return {
            block: [cs.paddingTop, cs.paddingBottom],
            inline: [cs.paddingLeft, cs.paddingRight],
            height: a.getBoundingClientRect().height,
          }
        })
      )
      expect(rows.length).toBeGreaterThan(0)
      const block = await token('3')
      const inline = await token('4')
      for (const row of rows) {
        expect(row.block).toEqual([block, block])
        expect(row.inline).toEqual([inline, inline])
        expect(row.height).toBeGreaterThanOrEqual(44)
      }

      const lines = await page.evaluate(() => {
        const out: { text: string; left: number; right: number; side: boolean }[] = []
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement
          if (!el || !n.textContent?.trim()) continue
          const range = document.createRange()
          range.selectNodeContents(n)
          const side = Boolean(el.closest('[aria-hidden="true"]'))
          for (const r of range.getClientRects()) {
            out.push({
              text: n.textContent.trim().slice(0, 24),
              left: r.left,
              right: r.right,
              side,
            })
          }
        }
        return out
      })
      const side = lines.filter((l) => l.side)
      const under = lines.filter(
        (l) => !l.side && side.some((s) => l.left < s.right && l.right > s.left)
      )
      // The Sidebar is a md-and-up element: it has text to clear only there.
      if (width >= 768) expect(side.length, 'the sidebar did not render').toBeGreaterThan(0)
      expect(under.map((l) => l.text)).toEqual([])
    })
  }
})

/**
 * /how/<date> set its reading text at 15px in a column that held 95 characters
 * of it, printed labels at 9 to 11px, and let the Files changed list push the
 * document to 371px on a 320 or 360 phone (#559). The date is a fixture: its
 * file paths are the ones that overflowed, and its brief is long enough to
 * wrap. The floors are the pipeline's own (12px, a 44px target); the line cap
 * has headroom over the 68 to 72 characters the column now holds.
 */
test.describe('site health — the explainer reads on a phone (#559)', () => {
  const DAY = '2026-09-19'

  for (const width of [320, 360, 1440]) {
    test(`fits, holds a 12px floor and keeps lines under 80 characters at ${width}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(`/how/${DAY}`)
      await expect(page.getByRole('heading', { name: 'A brief was written' })).toBeVisible({
        timeout: 15000,
      })
      // The specification is folded away; open it so its prose is measured too.
      await page.locator('summary').click()
      await page.waitForLoadState('networkidle')

      const overflow = await page.evaluate(() => {
        const root = document.documentElement
        return root.scrollWidth - root.clientWidth
      })
      expect(overflow).toBeLessThanOrEqual(0)

      const small = await page.evaluate(() => {
        const out: string[] = []
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement
          const text = n.textContent?.trim() ?? ''
          if (!el || !text || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue
          const size = Number.parseFloat(getComputedStyle(el).fontSize)
          if (size < 12) out.push(`${size}px "${text.slice(0, 24)}"`)
        }
        return out
      })
      expect(small, 'text under 12px').toEqual([])

      // Characters per rendered line, counted one glyph at a time: `ch` is the
      // width of a zero, which says little about how many letters fit.
      const longest = await page.evaluate(() => {
        let max = { chars: 0, text: '' }
        const blocks = [...document.querySelectorAll('p, li')].filter(
          (e) => Number.parseFloat(getComputedStyle(e).fontSize) >= 15
        )
        for (const block of blocks) {
          const rows = new Map<number, string>()
          const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT)
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            const text = n.textContent ?? ''
            for (let i = 0; i < text.length; i++) {
              const range = document.createRange()
              range.setStart(n, i)
              range.setEnd(n, i + 1)
              const rect = range.getClientRects()[0]
              if (!rect || rect.width === 0) continue
              const row = Math.round(rect.top / 4)
              rows.set(row, (rows.get(row) ?? '') + text[i])
            }
          }
          for (const line of rows.values()) {
            const chars = line.trim().length
            if (chars > max.chars) max = { chars, text: line.trim().slice(0, 24) }
          }
        }
        return max
      })
      expect(longest.chars, 'no prose was measured').toBeGreaterThan(0)
      expect(longest.chars, `prose line "${longest.text}"`).toBeLessThanOrEqual(80)
    })
  }

  test('links and the specification toggle are 44px targets at 390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto(`/how/${DAY}`)
    await expect(page.getByRole('heading', { name: 'A brief was written' })).toBeVisible({
      timeout: 15000,
    })

    const targets = await page.locator('a[href], summary, button').evaluateAll((els) =>
      els.map((el) => {
        const box = el.getBoundingClientRect()
        return { text: (el.textContent ?? '').trim().slice(0, 24), w: box.width, h: box.height }
      })
    )
    // The back link, the design link and the specification toggle.
    expect(targets.length).toBeGreaterThanOrEqual(3)
    for (const t of targets) {
      expect(t.h, `"${t.text}" is ${t.w}x${t.h}`).toBeGreaterThanOrEqual(44)
      expect(t.w, `"${t.text}" is ${t.w}x${t.h}`).toBeGreaterThanOrEqual(44)
    }
  })
})

/**
 * /archive set every label at 11px, truncated mood words to three letters on a
 * phone, put white ink on orange and sky blue at 2.1 to 2.4:1, and made its
 * controls 30px tall (#563). The floors are the pipeline's own: 12px text, 4.5:1
 * ink, a 44px control. Day cells are not held to 44px: a seven-column month is
 * 34px at 320 and 44px at 390, and WCAG 2.2's 24px minimum is what fits.
 */
test.describe('site health — the archive calendar reads on a phone (#563)', () => {
  for (const width of [320, 1440]) {
    test(`holds a 12px floor, 44px controls and no overflow at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/archive')
      await expect(page.locator('a[aria-current="date"]')).toBeVisible({ timeout: 15000 })

      for (const view of ['Month', 'All']) {
        const toggle = page.getByRole('button', { name: view, exact: true })
        await toggle.click()
        await expect(toggle).toHaveAttribute('aria-pressed', 'true')

        const overflow = await page.evaluate(() => {
          const root = document.documentElement
          return root.scrollWidth - root.clientWidth
        })
        expect(overflow, `${view} view overflows`).toBeLessThanOrEqual(0)

        const small = await page.evaluate(() => {
          const out: string[] = []
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            const el = n.parentElement
            const text = n.textContent?.trim() ?? ''
            if (!el || !text || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(el.tagName)) continue
            const size = Number.parseFloat(getComputedStyle(el).fontSize)
            if (size < 12) out.push(`${size}px "${text.slice(0, 24)}"`)
          }
          return out
        })
        expect(small, `${view} view has text under 12px`).toEqual([])

        const controls = await page.locator('button').evaluateAll((els) =>
          els.map((el) => {
            const box = el.getBoundingClientRect()
            return { text: (el.textContent ?? '').trim().slice(0, 24), w: box.width, h: box.height }
          })
        )
        expect(controls.length).toBeGreaterThanOrEqual(3)
        for (const c of controls) {
          expect(c.h, `"${c.text}" is ${c.w}x${c.h}`).toBeGreaterThanOrEqual(44)
          expect(c.w, `"${c.text}" is ${c.w}x${c.h}`).toBeGreaterThanOrEqual(44)
        }
      }
    })
  }

  // The newest day's link is the one the calendar marks. Its accessible name is
  // the day number then its label, from the same index the page reads.
  async function newestDay(page: Page) {
    const current = page.locator('a[aria-current="date"]')
    await expect(current).toBeVisible({ timeout: 15000 })
    const index = await page.evaluate(() =>
      fetch('/archive-data/index.json').then(
        (r) =>
          r.json() as Promise<
            { date: string; moodWord: string | null; legacyArchetype: string | null }[]
          >
      )
    )
    const newest = index.sort((a, b) => a.date.localeCompare(b.date)).at(-1)
    if (!newest) throw new Error('the archive index is empty')
    const label = newest.moodWord ?? newest.legacyArchetype ?? ''
    const name = new RegExp(`^${Number(newest.date.slice(8))}\\s*${label}$`, 'i')
    return { current, name, word: current.locator('span').nth(1) }
  }

  const rectOf = (el: Locator) =>
    el.evaluate((node) => {
      const r = node.getBoundingClientRect()
      return { x: r.x, y: r.y, w: r.width, h: r.height }
    })

  test('below md the mood label is hidden and still in the accessible name', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 })
    await page.goto('/archive')
    const { current, name, word } = await newestDay(page)
    await expect(current).toHaveAccessibleName(name)
    expect((await rectOf(word)).w, 'label is visible at 390').toBeLessThanOrEqual(2)
  })

  test('from md the mood label shows whole, inside its cell', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 900 })
    await page.goto('/archive')
    const { current, name, word } = await newestDay(page)
    await expect(current).toHaveAccessibleName(name)
    const label = await rectOf(word)
    const cell = await rectOf(current)
    expect(label.w, 'label is hidden at 820').toBeGreaterThan(10)
    expect(label.x).toBeGreaterThanOrEqual(cell.x - 0.5)
    expect(label.x + label.w).toBeLessThanOrEqual(cell.x + cell.w + 0.5)
    expect(label.y + label.h).toBeLessThanOrEqual(cell.y + cell.h + 0.5)
  })

  test('every day cell in the month reads at 4.5:1 and the disabled control at 3:1', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 820, height: 900 })
    await page.goto('/archive')
    await expect(page.locator('a[aria-current="date"]')).toBeVisible({ timeout: 15000 })

    const { cells, disabled } = await page.evaluate(() => {
      type Rgb = { r: number; g: number; b: number }
      const channels = (css: string): Rgb => {
        const m = css.match(/rgba?\(([^)]+)\)/)
        const [r, g, b] = (m?.[1] ?? '0 0 0').split(/[ ,/]+/).map(Number)
        return { r, g, b }
      }
      const lin = (c: number) => {
        const s = c / 255
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
      }
      const lum = (c: Rgb) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b)
      const ratio = (a: Rgb, b: Rgb) => {
        const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x)
        return (hi + 0.05) / (lo + 0.05)
      }
      // The page's own div carries the ground; the headline's nearest div is it.
      const ground = channels(
        getComputedStyle(document.querySelector('h1')?.closest('div') as Element).backgroundColor
      )
      const cells = [...document.querySelectorAll<HTMLElement>('a[style*="--day"]')].map((a) => {
        const bg = channels(getComputedStyle(a).backgroundColor)
        const worst = Math.min(
          ...[...a.querySelectorAll('span')].map((s) =>
            ratio(channels(getComputedStyle(s).color), bg)
          )
        )
        return { href: a.getAttribute('href') ?? '', worst }
      })
      const disabled = [...document.querySelectorAll<HTMLElement>('button:disabled')].map((b) => ({
        text: b.textContent ?? '',
        ratio: ratio(channels(getComputedStyle(b).color), ground),
        opacity: Number(getComputedStyle(b).opacity),
      }))
      return { cells, disabled }
    })

    expect(cells.length).toBeGreaterThan(0)
    for (const c of cells) expect(c.worst, `${c.href} ink`).toBeGreaterThanOrEqual(4.5)
    expect(disabled.length, 'the newest month disables Next').toBeGreaterThan(0)
    for (const d of disabled) {
      expect(d.opacity, `"${d.text}" is dimmed with opacity`).toBe(1)
      expect(d.ratio, `"${d.text}" disabled ink`).toBeGreaterThanOrEqual(3)
    }
  })
})
