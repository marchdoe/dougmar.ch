import '../styles/panda.css'
import {
  createRootRoute,
  Outlet,
  HeadContent,
  ScrollRestoration,
  Scripts,
  useRouterState,
} from '@tanstack/react-router'
import { Layout } from '../components/Layout'
import { css } from '../../styled-system/css'
import type { ReactNode } from 'react'

/**
 * The archive link lives here, outside <Layout>, because Layout.tsx and
 * Sidebar.tsx are written by the React Engineer each night and the composition
 * grammar is allowed to delete the whole shell (`shell_posture: none`,
 * `footer: none`). It did: the link vanished on 2026-07-12, the day the shell
 * became a declared Art Director choice, and was absent for 16 consecutive
 * builds before anyone noticed. See issue #155.
 *
 * Home is the exception (#532). <SiteCallout /> carries the archive link there,
 * beside the white paper link, so `/` says the idea once and this one is
 * skipped. The engineer places the callout, so the build validator fails a
 * home page that does not render it (checkCalloutPlacement in
 * scripts/utils/site-callout.js). Every other page keeps this link.
 *
 * The quiet tone is a colour, not an opacity (#566). A fixed opacity over a
 * palette that changes nightly measured 2.62 to 3.88:1 on three nights. The
 * orchestrator writes this file after the preset exists, so it picks the
 * quietest of `textFaint`, `textMuted` and `text` that reaches 4.5:1 on `bg`
 * (scripts/utils/archive-link-ink.js) and writes its name in below. Font size
 * comes from the chassis ramp, which the orchestrator owns.
 */
const archiveLink = css({
  display: 'block',
  background: 'bg',
  color: 'textMuted',
  fontSize: 'xs',
  letterSpacing: '0.08em',
  textAlign: 'center',
  textDecoration: 'none',
  padding: '28px 16px',
  minHeight: '44px',
  transition: 'color 0.2s ease',
  _hover: { color: 'accent' },
})

const THEME_INIT_SCRIPT = `(function(){
  var s=localStorage.getItem('theme');
  var p=s||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.classList.add(p);
})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Deep in both. Not a generalist.' },
      { property: 'og:title', content: 'Deep in both. Not a generalist.' },
      {
        property: 'og:description',
        content:
          'A client-roster specimen on warm sand: SPACEMAN spanning the wide column, the claim set low in a terracotta band, the Red Wings win the one bright note in a size-marker ledger.',
      },
      { property: 'og:image', content: 'https://dougmar.ch/og/2026-09-23.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:url', content: 'https://dougmar.ch' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Deep in both. Not a generalist.' },
      { name: 'twitter:image', content: 'https://dougmar.ch/og/2026-09-23.png' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Zilla+Slab:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&family=Work+Sans:wght@400;500;700&display=swap',
      },
    ],
    scripts: [{ children: THEME_INIT_SCRIPT }],
  }),
  notFoundComponent: () => (
    // Mirrors public/404.html, which is the page Vercel serves for real 404s
    // (missing files under /og/ and /archive/). This one covers a mistyped
    // in-app route, where the SPA shell has already answered 200 and only the
    // client knows the route does not exist.
    //
    // Both are deliberately static: hardcoded values, no design token, so a
    // broken nightly preset cannot take down the page people land on when
    // something is already wrong. Fixed positioning covers the day's Layout,
    // which would otherwise wrap this in whatever shell the agent built. The
    // copy is asserted identical to public/404.html by
    // tests/scripts/not-found-copy.test.js — edit the two together. See #199.
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: '#0e0e10',
        color: '#f4f4f5',
        font: '400 16px/1.55 ui-sans-serif,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
        letterSpacing: '.01em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}
    >
      <main style={{ width: '100%', maxWidth: '34rem' }}>
        <div
          style={{
            fontVariantNumeric: 'tabular-nums',
            fontSize: 'clamp(3.5rem,12vw,6rem)',
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: '-.03em',
          }}
        >
          404
        </div>
        <hr style={{ border: 0, borderTop: '1px solid rgba(255,255,255,.14)', margin: '28px 0' }} />
        <h1
          style={{
            fontSize: 'clamp(1.125rem,3.4vw,1.5rem)',
            fontWeight: 500,
            lineHeight: 1.3,
            letterSpacing: '-.01em',
            margin: '0 0 14px',
          }}
        >
          The only page here that never changes.
        </h1>
        <p style={{ color: 'rgba(244,244,245,.62)', maxWidth: '30rem', margin: 0 }}>
          Nothing lives at this address. Everything else on this site was redesigned last night.
        </p>
        <a
          href="/archive"
          style={{
            display: 'inline-block',
            marginTop: '32px',
            color: '#f4f4f5',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(255,255,255,.34)',
            paddingBottom: '2px',
          }}
        >
          See what did &rarr;
        </a>
      </main>
    </div>
  ),
  component: RootComponent,
})

/**
 * The archive renders outside <Layout>.
 *
 * Layout.tsx, Sidebar.tsx, and Footer.tsx are rewritten by the React Engineer
 * every night, and the composition grammar may delete the shell entirely. An
 * archive wearing that shell wears a different face each morning, which is the
 * one thing #152 says it must not do. The surfaces carry their own chrome and
 * their own tokens instead — see the `archive.*` tokens in panda.config.ts.
 */
function isArchiveSurface(pathname: string) {
  return pathname === '/archive' || pathname.startsWith('/archive/') || pathname.startsWith('/how/')
}

function RootComponent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  if (isArchiveSurface(pathname)) {
    return (
      <RootDocument bare>
        <Outlet />
      </RootDocument>
    )
  }

  return (
    <RootDocument archiveLink={pathname !== '/'}>
      <Layout>
        <Outlet />
      </Layout>
    </RootDocument>
  )
}

/**
 * `bare` is the archive: no nightly shell, no nightly footer link, and the
 * archive's own webfont instead of the day's. `archiveLink` is off on `/`
 * alone, where the callout carries it.
 *
 * The font is declared here rather than in the route's `head` because the
 * nightly `head` block above is regenerated every morning with that day's
 * chassis fonts, and a route-level link would arrive after it in the cascade
 * with no way to guarantee ordering. See the `archive.*` font tokens in
 * panda.config.ts.
 */
const ARCHIVE_FONT =
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500&display=swap'

/**
 * The archive's ground, applied to `body` itself.
 *
 * The surfaces paint their own background, but `body` keeps whatever the
 * nightly preset gave it, and that color shows through wherever the surface
 * does not reach — the overscroll gutter above and below the page. Caught by
 * reading the computed style: #120d08 on a morning the design was warm brown.
 *
 * The literal matches `archive.bg` in panda.config.ts. It is written out
 * because this rule has to exist before any component mounts.
 *
 * Rendered as a plain string child. The React escape hatch for raw HTML is
 * blocked outright by scripts/utils/build-validator.js as an XSS gate on
 * agent-authored output, and this file is regenerated from a template on every
 * build, so it is checked like any other. The first local pipeline run failed
 * on exactly that — and the gate matches the bare word anywhere in the file,
 * comments included, so it cannot be named here either.
 */
const ARCHIVE_GROUND = 'body{background:#0e0e10;color:#e8e8ea}'

function RootDocument({
  children,
  bare = false,
  archiveLink: showArchiveLink = true,
}: {
  children: ReactNode
  bare?: boolean
  archiveLink?: boolean
}) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {bare ? (
          <>
            <link rel="stylesheet" href={ARCHIVE_FONT} />
            <style>{ARCHIVE_GROUND}</style>
          </>
        ) : null}
      </head>
      <body>
        {children}
        {bare || !showArchiveLink ? null : (
          <a href="/archive" className={archiveLink} data-archive-link>
            Archive · 144 designs
          </a>
        )}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}
