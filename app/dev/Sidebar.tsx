import type { ReactNode } from 'react'
import { css, cva } from '../../styled-system/css'
import type { Meta } from './api'
import type { PaneName, PipelineStatus } from './lib/pipeline'
import { dot } from './styles'

const nav = css({
  background: 'devPanel.bg',
  borderRight: '1px solid',
  borderRightColor: 'devPanel.border',
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '8px',
  overflow: 'hidden',
})

const runButton = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: 'calc(100% - 16px)',
    margin: '8px 8px 4px',
    padding: '10px 12px',
    background:
      'linear-gradient(135deg, color-mix(in srgb, {colors.devPanel.cyan} 8%, transparent), color-mix(in srgb, {colors.devPanel.blue} 6%, transparent))',
    border: '1px solid',
    borderColor: 'devPanel.cyan/15',
    borderRadius: '6px',
    color: 'devPanel.secondary',
    fontSize: '11px',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
    letterSpacing: '.03em',
    transition: 'all 0.15s ease',
  },
  variants: {
    active: {
      true: {
        background: 'devPanel.cyan/12',
        borderColor: 'devPanel.cyan',
        color: 'devPanel.cyan',
      },
    },
  },
})

const playGlyph = css({ fontSize: '10px' })
const rule = css({
  borderBottom: '1px solid',
  borderBottomColor: 'devPanel.border',
  margin: '8px 14px',
})
const items = css({ flex: 1 })

const refreshButton = cva({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'devPanel.card',
    border: '1px solid',
    borderColor: 'devPanel.border',
    borderRadius: '10px',
    padding: '1px 7px 1px 5px',
    cursor: 'pointer',
    fontSize: '9px',
    color: 'devPanel.muted',
    lineHeight: '16px',
    transition: 'all 0.15s ease',
  },
  variants: {
    refreshing: {
      true: {
        background: 'devPanel.orange/12',
        borderColor: 'devPanel.orange/30',
        color: 'devPanel.orange',
      },
      false: {
        _hover: {
          borderColor: 'devPanel.cyan/30',
          color: 'devPanel.cyan',
          background: 'devPanel.cyan/8',
        },
      },
    },
  },
})

const refreshGlyph = cva({
  base: { fontSize: '11px', lineHeight: 1, display: 'inline-block' },
  variants: {
    spinning: { true: { animation: 'devPanelSpin 0.8s linear infinite' } },
  },
})

export function Sidebar({
  activePane,
  onSelect,
  pipelineStatus,
  meta,
  refreshingSignals,
  onRefreshSignals,
  archiveCount,
  traceCount,
}: {
  activePane: PaneName
  onSelect: (pane: PaneName) => void
  pipelineStatus: PipelineStatus
  meta: Meta | null
  refreshingSignals: boolean
  onRefreshSignals: () => void
  archiveCount: number
  traceCount: number
}) {
  const isRunning = pipelineStatus === 'running'
  return (
    <nav className={nav}>
      {/* Run Pipeline — prominent at top */}
      <button
        type="button"
        onClick={() => onSelect('run')}
        className={runButton({ active: activePane === 'run' })}
      >
        {isRunning ? (
          <span className={dot({ size: 'lg', tone: 'orange', pulse: 'fast' })} />
        ) : (
          <span className={playGlyph}>&#9654;</span>
        )}
        <span>{isRunning ? 'Running...' : 'Run Pipeline'}</span>
      </button>

      <div className={rule} />

      <div className={items}>
        <SidebarItem
          label="Signals"
          active={activePane === 'pipeline'}
          onClick={() => onSelect('pipeline')}
          widget={
            <button
              type="button"
              title="Refresh signals"
              onClick={(e) => {
                e.stopPropagation()
                onRefreshSignals()
              }}
              className={refreshButton({ refreshing: refreshingSignals })}
            >
              <span className={refreshGlyph({ spinning: refreshingSignals })}>↻</span>
              <span>{refreshingSignals ? '...' : meta ? `${meta.providers_ok}` : '–'}</span>
            </button>
          }
        />
        <SidebarItem
          label="Archive"
          active={activePane === 'archive'}
          onClick={() => onSelect('archive')}
          badge={archiveCount > 0 ? String(archiveCount) : undefined}
        />
        <SidebarItem
          label="Prompt Inspector"
          active={activePane === 'inspector'}
          onClick={() => onSelect('inspector')}
          badge={traceCount > 0 ? String(traceCount) : undefined}
        />
      </div>
    </nav>
  )
}

const itemRow = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    width: '100%',
    boxSizing: 'border-box',
    padding: '9px 14px',
    background: 'transparent',
    borderLeft: '2px solid transparent',
  },
  variants: {
    active: { true: { background: 'devPanel.cyan/6', borderLeftColor: 'devPanel.cyan' } },
  },
})

const itemButton = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    minWidth: 0,
    padding: 0,
    background: 'transparent',
    border: 'none',
    color: 'devPanel.muted',
    fontSize: '11px',
    cursor: 'pointer',
    textAlign: 'left',
    letterSpacing: '.02em',
  },
  variants: {
    active: { true: { color: 'devPanel.text' } },
  },
})

const itemLabel = css({ flex: 1 })
const badgeStyle = css({
  fontSize: '9px',
  color: 'devPanel.muted',
  background: 'devPanel.card',
  padding: '1px 6px',
  borderRadius: '8px',
  border: '1px solid',
  borderColor: 'devPanel.border',
})

function SidebarItem({
  label,
  active,
  onClick,
  badge,
  widget,
}: {
  label: string
  active: boolean
  onClick: () => void
  badge?: string
  widget?: ReactNode
}) {
  return (
    <div className={itemRow({ active })}>
      <button type="button" onClick={onClick} className={itemButton({ active })}>
        <span className={itemLabel}>{label}</span>
        {badge && <span className={badgeStyle}>{badge}</span>}
      </button>
      {widget}
    </div>
  )
}
