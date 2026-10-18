import path from 'node:path'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import {
  archiveStaticPlugin,
  browserStorageContextStub,
  devPanelPlugin,
  pipelineMapStaticPlugin,
} from './app/dev-server'
import { archivedDates, datesWithOgImage } from './scripts/utils/archive-fs.js'

// The dev panel's HTTP surface — /dev, its data endpoints, the pipeline
// runner — lives in app/dev-server/. This file is the Vite config.

// /archive and /how/<date> render outside the nightly shell (#152) and carry
// their own title, canonical link, and OG card (#327) — meta a crawler only
// sees if it is baked into the HTML, not applied after hydration. Every other
// route still falls back to the SPA shell via vercel.json's rewrite.
const HOW_DATE_PAGES = archivedDates(path.join(process.cwd(), 'archive')).map((date) => ({
  path: `/how/${date}`,
  prerender: { enabled: true, crawlLinks: false },
}))

// how.$date.tsx's head() names /og/<date>.png for every date, but the
// pipeline's capture is best-effort and some dates never got one (#399).
// head() ships in the client bundle alongside every other route, so it
// cannot stat public/og/ itself at runtime — only this file, which Vite
// never bundles, can. `define` bakes the answer in as a literal at build
// time, the same way HOW_DATE_PAGES bakes in which dates prerender at all.
const OG_IMAGE_DATES = datesWithOgImage(path.join(process.cwd(), 'public', 'og'))

export default defineConfig({
  define: {
    __OG_IMAGE_DATES__: JSON.stringify(OG_IMAGE_DATES),
  },
  plugins: [
    archiveStaticPlugin(),
    pipelineMapStaticPlugin(),
    devPanelPlugin(),
    browserStorageContextStub(),
    tanstackStart({
      srcDirectory: 'app',
      spa: {},
      prerender: {
        // Only the SPA shell (always prerendered) and the pages listed below.
        // Without this, every static route file (about, elements, work/index,
        // …) would be auto-discovered and prerendered too — a much bigger
        // change than #327 asked for.
        autoStaticPathsDiscovery: false,
      },
      pages: [
        { path: '/archive', prerender: { enabled: true, crawlLinks: false } },
        ...HOW_DATE_PAGES,
      ],
    }),
    // React Refresh runtime for dev mode. Without this, TanStack Start's dev
    // client entry 500s (/@react-refresh unresolved) and every TanStack route
    // renders shell-only under `vite dev` — the "blank content area" noted in
    // the 2026-08-05 deps-update evidence. Production builds were unaffected.
    react(),
  ],
})
