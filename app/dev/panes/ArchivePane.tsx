import { useState } from 'react'
import { css, cva } from '../../../styled-system/css'
import type { ArchiveEntry } from '../../server/archive'
import { emptyText, paneHeading } from '../styles'

const count = css({ color: 'devPanel.muted', fontWeight: 400 })

const entryBox = cva({
  base: {
    padding: '10px 12px',
    marginBottom: '6px',
    background: 'devPanel.card',
    border: '1px solid',
    borderColor: 'devPanel.border',
    borderRadius: '4px',
  },
  variants: {
    today: { true: { background: 'devPanel.cyan/4', borderColor: 'devPanel.cyan/15' } },
  },
})
const entryRow = css({ display: 'flex', alignItems: 'center', gap: '12px' })
const dateColumn = css({ minWidth: '110px' })
const dateText = cva({
  base: { fontSize: '12px', fontWeight: 700, color: 'devPanel.text' },
  variants: { today: { true: { color: 'devPanel.cyan' } } },
})
const todayTag = css({ fontSize: '9px', color: 'devPanel.cyan', marginLeft: '6px' })
const timeText = css({ fontSize: '9px', color: 'devPanel.muted', marginTop: '2px' })
const brief = css({
  fontSize: '11px',
  color: 'devPanel.secondary',
  fontStyle: 'italic',
  flex: 1,
  lineHeight: '1.4',
})
const previewButton = css({
  background: 'devPanel.preview/10',
  border: '1px solid',
  borderColor: 'devPanel.preview/20',
  borderRadius: '3px',
  padding: '3px 8px',
  fontSize: '9px',
  color: 'devPanel.preview',
  cursor: 'pointer',
  flexShrink: 0,
})
const ruledBlock = css({
  display: 'flex',
  gap: '12px',
  marginTop: '6px',
  paddingTop: '6px',
  borderTop: '1px solid',
  borderTopColor: 'devPanel.border',
})
const weight = css({ fontSize: '9px', color: 'devPanel.muted' })
const weightName = css({ color: 'devPanel.dim' })
const weightValue = css({ color: 'devPanel.secondary' })
const detailWrap = css({ marginTop: '6px' })
const detailToggle = css({
  background: 'none',
  border: 'none',
  padding: 0,
  fontSize: '9px',
  color: 'devPanel.dim',
  cursor: 'pointer',
})
const detail = css({
  marginTop: '8px',
  paddingTop: '8px',
  borderTop: '1px solid',
  borderTopColor: 'devPanel.border',
})
const rationale = cva({
  base: {
    fontSize: '11px',
    color: 'devPanel.secondary',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    marginBottom: 0,
  },
  variants: { beforeFiles: { true: { marginBottom: '8px' } } },
})
const files = css({ display: 'flex', gap: '6px', flexWrap: 'wrap' })
const file = css({
  fontSize: '9px',
  color: 'devPanel.dim',
  background: 'devPanel.bg',
  border: '1px solid',
  borderColor: 'devPanel.border',
  borderRadius: '3px',
  padding: '2px 6px',
})

const WEIGHT_KEYS = ['signals', 'inspiration', 'ratings', 'risk'] as const

function previewUrl(entry: ArchiveEntry) {
  if (entry.buildId) return `/api/archive-preview/${entry.date}/build-${entry.buildId}/index.html`
  return `/api/archive-preview/${entry.date}/index.html`
}

function buildTime(entry: ArchiveEntry) {
  if (!entry.timestamp) return ''
  return new Date(entry.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

/** Every archived build, newest first, with its weights, brief and preview. */
export function ArchivePane({ archive }: { archive: ArchiveEntry[] }) {
  const today = new Date().toISOString().slice(0, 10)
  const [expandedBuild, setExpandedBuild] = useState<string | null>(null)

  return (
    <>
      <h2 className={paneHeading}>
        // ARCHIVE <span className={count}>({archive.length})</span>
      </h2>

      {archive.length === 0 && <div className={emptyText}>No archive entries yet.</div>}

      {archive.map((entry, i) => {
        const isToday = entry.date === today
        const time = buildTime(entry)
        const w = entry.weights
        const entryKey = entry.buildId || entry.date + i
        const fileCount = entry.filesChanged?.length ?? 0
        const expanded = expandedBuild === entryKey
        return (
          <div key={entryKey} className={entryBox({ today: isToday })}>
            <div className={entryRow}>
              <div className={dateColumn}>
                <span className={dateText({ today: isToday })}>
                  {entry.date}
                  {isToday && <span className={todayTag}>TODAY</span>}
                </span>
                {time && <div className={timeText}>{time}</div>}
              </div>
              <span className={brief}>{entry.brief}</span>
              <button
                type="button"
                onClick={() => window.open(previewUrl(entry), '_blank')}
                className={previewButton}
              >
                Preview ↗
              </button>
            </div>
            {w && (
              <div className={ruledBlock}>
                {WEIGHT_KEYS.map((k) => (
                  <span key={k} className={weight}>
                    <span className={weightName}>{k[0].toUpperCase() + k.slice(1)}</span>{' '}
                    <span className={weightValue}>{w[k]}</span>
                  </span>
                ))}
              </div>
            )}
            {(entry.rationale || fileCount > 0) && (
              <div className={detailWrap}>
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpandedBuild(expanded ? null : entryKey)}
                  className={detailToggle}
                >
                  {expanded ? '▾ Hide Brief' : '▸ View Brief'}
                </button>
                {expanded && (
                  <div className={detail}>
                    {entry.rationale && (
                      <div className={rationale({ beforeFiles: fileCount > 0 })}>
                        {entry.rationale}
                      </div>
                    )}
                    {fileCount > 0 && (
                      <div className={files}>
                        {entry.filesChanged?.map((f) => (
                          <span key={f} className={file}>
                            {f}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </>
  )
}
