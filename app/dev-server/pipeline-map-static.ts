import { existsSync, readFileSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

// Serve the pipeline map at /pipeline-map/ the way production does (#738).
//
// It is a static file under public/pipeline-map/. Vercel serves the slashed
// form from the filesystem and rewrites the slash-less one (vercel.json). Vite
// 307s the slashed form to the slash-less one and then hands it to the SPA, so
// without this the page is only reachable in production.

const MAP_URL = /^\/pipeline-map\/?$/

export function pipelineMapMiddleware(roots: string[]) {
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    if (!MAP_URL.test((req.url ?? '').split('?')[0])) return next()
    const page = roots.map((r) => resolve(r, 'index.html')).find((p) => existsSync(p))
    if (!page) return next()
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    return res.end(readFileSync(page))
  }
}

export function pipelineMapStaticPlugin(): Plugin {
  const PUBLIC = resolve('public', 'pipeline-map')
  const DIST = resolve('dist', 'client', 'pipeline-map')

  return {
    name: 'pipeline-map-static',
    configureServer(server) {
      server.middlewares.use(pipelineMapMiddleware([PUBLIC, DIST]))
    },
    configurePreviewServer(server) {
      server.middlewares.use(pipelineMapMiddleware([DIST, PUBLIC]))
    },
  }
}
