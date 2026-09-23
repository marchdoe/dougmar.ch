import { css } from '../../../../styled-system/css'
import { fmtDuration } from '../../lib/format'

const box = css({
  border: '1px solid',
  borderColor: 'devPanel.redDeep/30',
  borderRadius: '4px',
  background: 'devPanel.redDeep/6',
  padding: '16px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
})
const mark = css({ color: 'devPanel.red', fontSize: '16px', flexShrink: 0, fontWeight: 700 })
const body = css({ flex: 1 })
const title = css({ fontSize: '12px', fontWeight: 700, color: 'devPanel.red', marginBottom: '4px' })
const took = css({
  fontWeight: 400,
  fontSize: '10px',
  color: 'devPanel.redSoft',
  marginLeft: '6px',
})
const message = css({ fontSize: '10px', color: 'devPanel.redSoft' })
const retry = css({
  background: 'devPanel.red',
  color: 'devPanel.white',
  border: 'none',
  borderRadius: '4px',
  padding: '7px 14px',
  fontSize: '11px',
  fontWeight: 700,
  cursor: 'pointer',
  flexShrink: 0,
  letterSpacing: '.05em',
})

/** A run that failed or never started, with the reason and a retry. */
export function ErrorSection({
  error,
  totalMs,
  onRetry,
}: {
  error: string
  totalMs: number
  onRetry: () => void
}) {
  return (
    <div className={box}>
      <div className={mark}>X</div>
      <div className={body}>
        <div className={title}>
          Pipeline failed
          <span className={took}>({fmtDuration(totalMs)})</span>
        </div>
        <div className={message}>{error}</div>
      </div>
      <button type="button" onClick={onRetry} className={retry}>
        RETRY
      </button>
    </div>
  )
}
