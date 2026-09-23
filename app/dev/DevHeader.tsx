import { css } from '../../styled-system/css'
import type { Meta } from './api'
import type { PipelineStatus } from './lib/pipeline'
import { dot, healthCapsule } from './styles'

const header = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  borderBottom: '1px solid',
  borderBottomColor: 'devPanel.border',
  background: 'devPanel.bg',
  flexShrink: 0,
})
const titleGroup = css({ display: 'flex', alignItems: 'baseline', gap: '12px' })
const title = css({ fontSize: '13px', fontWeight: 700, color: 'devPanel.text' })
const subtitle = css({ fontSize: '11px', color: 'devPanel.muted' })
const statusGroup = css({ display: 'flex', alignItems: 'center', gap: '12px' })
const running = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '11px',
  fontWeight: 700,
  color: 'devPanel.cyan',
  animation: 'devPanelPulse 1.5s ease-in-out infinite',
})
const siteLink = css({
  fontSize: '11px',
  color: 'devPanel.dim',
  textDecoration: 'none',
  padding: '4px 10px',
  border: '1px solid',
  borderColor: 'devPanel.border',
  borderRadius: '4px',
})

export function DevHeader({
  meta,
  pipelineStatus,
}: {
  meta: Meta | null
  pipelineStatus: PipelineStatus
}) {
  const siteUrl = window.location.origin
  return (
    <header className={header}>
      <div className={titleGroup}>
        <span className={title}>dougmar.ch</span>
        <span className={subtitle}>Daily Redesign &middot; Dev Panel</span>
      </div>
      <div className={statusGroup}>
        {meta && (
          <span className={healthCapsule}>
            <span className={dot({ tone: 'green', pulse: 'slow' })} />
            {meta.providers_ok} / {meta.providers_total}
          </span>
        )}
        {pipelineStatus === 'running' && (
          <span className={running}>
            <span className={dot({ tone: 'cyan' })} />
            Running
          </span>
        )}
        <a href={siteUrl} target="_blank" rel="noopener noreferrer" className={siteLink}>
          Open Site &#8599;
        </a>
      </div>
    </header>
  )
}
