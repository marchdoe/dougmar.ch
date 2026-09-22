import { useState } from 'react'
import { css } from '../../styled-system/css'
import type { ResponsiveMetrics } from '../server/archive'

const viewportImg = css({ width: '100%', height: 'auto', display: 'block' })

/**
 * One viewport capture. Nights since #549 store WebP; every earlier night
 * stored PNG under the same name, so a WebP that 404s falls back to the PNG.
 */
function ViewportImage({ base, name }: { base: string; name: string }) {
  const [ext, setExt] = useState<'webp' | 'png'>('webp')
  const src = `${base}/${name}.${ext}`
  return (
    <a href={src} target="_blank" rel="noreferrer">
      <img
        src={src}
        alt={`${name} viewport screenshot`}
        onError={() => setExt('png')}
        className={viewportImg}
      />
    </a>
  )
}

const card = css({
  border: '1px solid',
  borderColor: 'dev.border',
  padding: '12px',
  marginBottom: '12px',
  fontFamily: 'dev.mono',
  fontSize: '11px',
  color: 'dev.text',
  background: 'dev.bg',
})

const scoreRow = css({ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' })
const scoreValue = css({ color: 'dev.cyan', fontWeight: '700' })
const viewportGrid = css({ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' })
const viewportCell = css({ border: '1px solid', borderColor: 'dev.border', padding: '6px' })
const viewportLabel = css({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '10px',
  color: 'dev.muted',
  marginBottom: '4px',
})
const failure = css({
  marginTop: '8px',
  padding: '8px',
  border: '1px solid',
  borderColor: 'dev.border',
  color: 'dev.muted',
})
const failureViewport = css({ color: 'dev.text' })

export function ResponsiveCard({
  metrics,
  date,
}: {
  metrics: ResponsiveMetrics | null
  date: string
}) {
  if (!metrics) return null

  const order = ['mobile', 'tablet', 'laptop', 'desktop'] as const
  const base = `/archive-data/${date}/viewports`

  return (
    <div className={card}>
      <div className={scoreRow}>
        <strong>Responsive Score</strong>
        <span className={scoreValue}>{metrics.overallScore} / 5</span>
      </div>
      <div className={viewportGrid}>
        {order.map((name) => {
          const v = metrics.viewports[name]
          if (!v) return null
          return (
            <div key={name} className={viewportCell}>
              <div className={viewportLabel}>
                <span>
                  {name} {v.width}
                </span>
                <span>{v.score}/5</span>
              </div>
              <ViewportImage base={base} name={name} />
            </div>
          )
        })}
      </div>
      {metrics.worstFailure && (
        <div className={failure}>
          <strong className={failureViewport}>{metrics.worstFailure.viewport}</strong> —{' '}
          {metrics.worstFailure.check}: {metrics.worstFailure.detail}
        </div>
      )}
    </div>
  )
}
