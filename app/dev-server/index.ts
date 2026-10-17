import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'
import type { Plugin } from 'vite'
import { archivePreviewHandler } from './archive-preview'
import { devDataHandler } from './dev-data'
import { guardRequest } from './guards'
import { createPipelineRunner } from './pipeline-runner'
import { collectSignalsHandler, devOverridesHandler } from './signals-endpoints'

export { archiveStaticPlugin } from './archive-static'
export { pipelineMapStaticPlugin } from './pipeline-map-static'
export { browserStorageContextStub } from './storage-context-stub'

/**
 * The dev panel's HTTP surface: the /dev page, its data endpoints, and the
 * pipeline runner. Dev server only — nothing here is registered under
 * `vite build` or `vite preview`.
 *
 * This was 490 lines inside vite.config.ts (#227). The config file now holds
 * the config; each endpoint lives in its own module with the guard it runs
 * behind, and the guard has tests.
 */
export function devPanelPlugin(): Plugin {
  return {
    name: 'dev-panel',
    configureServer(server) {
      // .env is for the pipeline the panel launches. Loading it here, rather
      // than when the plugin object is constructed, keeps it out of
      // `vite build` and `vite preview`, which have no use for it.
      loadDotenv({ quiet: true })

      const runner = createPipelineRunner()

      // The /dev page itself, as a standalone SPA
      server.middlewares.use('/dev', (req, res, next) => {
        if (!guardRequest(req, res)) return
        if (req.url && req.url !== '/' && !req.url.startsWith('/?')) return next()
        const html = readFileSync(resolve('app/dev-panel.html'), 'utf8')
        server
          .transformIndexHtml('/dev', html)
          .then((transformed) => {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(transformed)
          })
          .catch(next)
      })

      // /dev/responsive — same standalone-page pattern as /dev above.
      // Formerly a router route (app/routes/dev.responsive.tsx); that put its
      // route definition, loader, and the server-fn client runtime it needs
      // in the eagerly-loaded part of the client bundle, so production
      // shipped and modulepreloaded a chunk for a page whose beforeLoad did
      // nothing but throw notFound() there (#328). Serving it here instead
      // means it exists only while `vite dev`'s configureServer is running.
      server.middlewares.use('/dev/responsive', (req, res, next) => {
        if (!guardRequest(req, res)) return
        if (req.url && req.url !== '/' && !req.url.startsWith('/?')) return next()
        const html = readFileSync(resolve('app/dev-responsive.html'), 'utf8')
        server
          .transformIndexHtml('/dev/responsive', html)
          .then((transformed) => {
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(transformed)
          })
          .catch(next)
      })

      server.middlewares.use('/api/dev-data', devDataHandler)
      server.middlewares.use('/api/dev-overrides', devOverridesHandler)
      server.middlewares.use('/api/collect-signals', collectSignalsHandler)
      server.middlewares.use('/api/pipeline/start', runner.start)
      server.middlewares.use('/api/pipeline', runner.stream)
      server.middlewares.use('/api/archive-preview', archivePreviewHandler)
    },
  }
}
