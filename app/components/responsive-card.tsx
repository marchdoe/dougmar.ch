import { useState } from 'react'
import type { ResponsiveMetrics } from '../server/archive'

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
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </a>
  )
}

export function ResponsiveCard({
  metrics,
  date,
}: {
  metrics: ResponsiveMetrics | null
  date: string
}) {
  if (!metrics) return null

  const c = {
    bg: '#0e1014',
    border: '#2a2f36',
    muted: '#8a8f97',
    text: '#dce0e6',
    cyan: '#00e5ff',
    font: 'JetBrains Mono, monospace',
  }
  const order = ['mobile', 'tablet', 'laptop', 'desktop'] as const
  const base = `/archive-data/${date}/viewports`

  return (
    <div
      style={{
        border: `1px solid ${c.border}`,
        padding: 12,
        marginBottom: 12,
        fontFamily: c.font,
        fontSize: 11,
        color: c.text,
        background: c.bg,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>Responsive Score</strong>
        <span style={{ color: c.cyan, fontWeight: 700 }}>{metrics.overallScore} / 5</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {order.map((name) => {
          const v = metrics.viewports[name]
          if (!v) return null
          return (
            <div key={name} style={{ border: `1px solid ${c.border}`, padding: 6 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 10,
                  color: c.muted,
                  marginBottom: 4,
                }}
              >
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
        <div style={{ marginTop: 8, padding: 8, border: `1px solid ${c.border}`, color: c.muted }}>
          <strong style={{ color: c.text }}>{metrics.worstFailure.viewport}</strong> —{' '}
          {metrics.worstFailure.check}: {metrics.worstFailure.detail}
        </div>
      )}
    </div>
  )
}
