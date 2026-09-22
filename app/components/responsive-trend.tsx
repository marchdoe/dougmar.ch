import { css } from '../../styled-system/css'
import { token } from '../../styled-system/tokens'
import type { ResponsiveMetrics } from '../server/archive'

type HistoryItem = ResponsiveMetrics

const noData = css({ color: 'dev.muted' })
const chartWrap = css({ marginBottom: '16px' })
const chartLabel = css({ fontSize: '11px', color: 'dev.muted', marginBottom: '4px' })
const chartSvg = css({ border: '1px solid', borderColor: 'dev.border' })

function LineChart({
  data,
  label,
}: {
  data: Array<{ x: number; y: number; labelX?: string }>
  label: string
}) {
  const W = 600,
    H = 120,
    pad = 24
  if (data.length === 0) return <div className={noData}>no data</div>
  const xs = data.map((d) => d.x)
  const xMin = Math.min(...xs),
    xMax = Math.max(...xs)
  const yMin = 1,
    yMax = 5
  const sx = (x: number) => pad + ((x - xMin) / Math.max(1, xMax - xMin)) * (W - pad * 2)
  const sy = (y: number) => H - pad - ((y - yMin) / (yMax - yMin)) * (H - pad * 2)
  const poly = data.map((d) => `${sx(d.x)},${sy(d.y)}`).join(' ')
  const cyan = token('colors.dev.cyan')
  return (
    <div className={chartWrap}>
      <div className={chartLabel}>{label}</div>
      <svg width={W} height={H} className={chartSvg}>
        <title>{label}</title>
        <polyline points={poly} fill="none" stroke={cyan} strokeWidth={1.5} />
        {data.map((d) => (
          <circle key={d.x} cx={sx(d.x)} cy={sy(d.y)} r={2.5} fill={cyan}>
            <title>{`${d.labelX || d.x}: ${d.y}/5`}</title>
          </circle>
        ))}
      </svg>
    </div>
  )
}

const barRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '11px',
  marginBottom: '2px',
})
const barLabel = css({ width: '180px' })
const barTrack = css({ flex: '1', background: 'dev.border', height: '12px', position: 'relative' })
// The fill's width is per-row data, so it goes through a CSS custom property
// on `style` rather than a runtime value in `css()` — the same pattern as
// the deliberate exceptions in RunStages.tsx and archive.tsx.
const barFill = css({ height: '100%', background: 'dev.fail', width: 'var(--bar-width)' })
const barCount = css({ width: '40px', textAlign: 'right', color: 'dev.muted' })

function BarChart({ rows }: { rows: Array<{ label: string; count: number }> }) {
  const max = Math.max(1, ...rows.map((r) => r.count))
  return (
    <div className={chartWrap}>
      {rows.map((r) => (
        <div key={r.label} className={barRow}>
          <span className={barLabel}>{r.label}</span>
          <div className={barTrack}>
            <div
              className={barFill}
              style={{ '--bar-width': `${(r.count / max) * 100}%` } as React.CSSProperties}
            />
          </div>
          <span className={barCount}>{r.count}</span>
        </div>
      ))}
    </div>
  )
}

const sectionLabel = css({
  fontSize: '11px',
  color: 'dev.muted',
  marginBottom: '4px',
  marginTop: '16px',
})
const tableEl = css({ fontSize: '11px', borderCollapse: 'collapse' })
const thLeft = css({ textAlign: 'left', padding: '4px' })
const th = css({ padding: '4px' })
const td = css({ padding: '4px' })
const listEl = css({ fontSize: '11px', paddingLeft: '16px' })
const linkEl = css({ color: 'dev.cyan' })

export function ResponsiveTrend({ history }: { history: HistoryItem[] }) {
  const asc = [...history].sort((a, b) => a.date.localeCompare(b.date))

  const overallData = asc.map((h, i) => ({ x: i, y: h.overallScore, labelX: h.date }))

  const perVp = ['mobile', 'tablet', 'laptop', 'desktop']
  const perVpSeries = perVp.map((name) => ({
    name,
    data: asc.map((h, i) => ({ x: i, y: h.viewports?.[name]?.score ?? 0, labelX: h.date })),
  }))

  const failCounts: Record<string, number> = {}
  for (const h of history) {
    if (h.worstFailure?.check)
      failCounts[h.worstFailure.check] = (failCounts[h.worstFailure.check] || 0) + 1
  }
  const failRows = Object.entries(failCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([label, count]) => ({ label, count }))

  const byArchetype: Record<string, { total: number; n: number }> = {}
  for (const h of history) {
    const k = h.archetype || 'unknown'
    if (!byArchetype[k]) byArchetype[k] = { total: 0, n: 0 }
    byArchetype[k].total += h.overallScore
    byArchetype[k].n += 1
  }
  const archRows = Object.entries(byArchetype)
    .map(([k, { total, n }]) => ({ archetype: k, avg: (total / n).toFixed(1), n }))
    .sort((a, b) => parseFloat(a.avg) - parseFloat(b.avg))

  const worstBuilds = [...history]
    .filter((h) => h.overallScore <= 3)
    .sort((a, b) => a.overallScore - b.overallScore)
    .slice(0, 10)

  return (
    <div>
      <LineChart data={overallData} label={`Overall score (last ${asc.length} builds)`} />
      {perVpSeries.map((s) => (
        <LineChart key={s.name} data={s.data} label={`${s.name} score`} />
      ))}

      <div className={sectionLabel}>Failure types</div>
      <BarChart rows={failRows} />

      <div className={sectionLabel}>Worst by archetype</div>
      <table className={tableEl}>
        <thead>
          <tr>
            <th className={thLeft}>archetype</th>
            <th className={th}>avg</th>
            <th className={th}>n</th>
          </tr>
        </thead>
        <tbody>
          {archRows.map((r) => (
            <tr key={r.archetype}>
              <td className={td}>{r.archetype}</td>
              <td className={td}>{r.avg}</td>
              <td className={td}>{r.n}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={sectionLabel}>Worst recent builds</div>
      <ul className={listEl}>
        {worstBuilds.map((b) => (
          <li key={b.buildId}>
            <a href={`/how/${b.date}`} className={linkEl}>
              {b.date} · {b.archetype || '—'} · {b.overallScore}/5
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
