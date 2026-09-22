import { useEffect, useState } from 'react'
import { css } from '../styled-system/css'
import { ResponsiveTrend } from './components/responsive-trend'
import { readResponsiveHistory, type ResponsiveMetrics } from './server/archive'

const page = css({
  padding: '16px',
  fontFamily: 'dev.mono',
  fontSize: '12px',
  background: 'dev.bg',
  color: 'dev.text',
  minHeight: '100vh',
})

const heading = css({ fontSize: '14px', marginBottom: '16px' })

/**
 * The /dev/responsive page.
 *
 * Mounted by dev-responsive-entry.tsx under the dev server's own HTTP
 * surface (app/dev-server/index.ts), the same way /dev mounts DevPanel — not
 * a router route. A route file here built a chunk (route definition, loader,
 * server-fn client runtime) that Vite bundled and modulepreloaded on every
 * production page even though its beforeLoad refused to render (#328); this
 * way the page, and the import of readResponsiveHistory it needs, exist only
 * where `vite dev`'s configureServer runs, never in a production build.
 */
export function DevResponsivePage() {
  const [history, setHistory] = useState<ResponsiveMetrics[]>([])

  useEffect(() => {
    readResponsiveHistory({ data: { limit: 30 } }).then(setHistory)
  }, [])

  return (
    <div className={page}>
      <h1 className={heading}>Responsive — last 30 builds</h1>
      <ResponsiveTrend history={history} />
    </div>
  )
}
