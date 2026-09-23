import { css, cva } from '../../../styled-system/css'
import { fmtStepDuration } from '../lib/format'
import type { TraceStep } from '../lib/pipeline'

const TRACE_PHASES: Record<number, { name: string; tone: Tone }> = {
  0: { name: 'SETUP', tone: 'muted' },
  1: { name: 'DIRECTION', tone: 'cyan' },
  2: { name: 'TOKENS', tone: 'violet' },
  3: { name: 'DESIGN', tone: 'orange' },
  4: { name: 'VALIDATION', tone: 'green' },
}

type Tone = 'muted' | 'cyan' | 'violet' | 'orange' | 'green'

const frame = cva({
  base: {
    background: 'devPanel.card',
    border: '1px solid',
    borderColor: 'devPanel.border',
    borderLeftWidth: '3px',
    borderRadius: '4px',
    marginBottom: '6px',
  },
  variants: {
    tone: {
      muted: { borderLeftColor: 'devPanel.muted' },
      cyan: { borderLeftColor: 'devPanel.cyan' },
      violet: { borderLeftColor: 'devPanel.violet' },
      orange: { borderLeftColor: 'devPanel.orange' },
      green: { borderLeftColor: 'devPanel.green' },
    },
  },
})

// The tag's background is its colour at 0x18 of 0xff, about 9%.
const phaseTag = cva({
  base: {
    fontSize: '9px',
    fontWeight: 700,
    letterSpacing: '0.05em',
    padding: '2px 6px',
    borderRadius: '3px',
  },
  variants: {
    tone: {
      muted: { color: 'devPanel.muted', background: 'devPanel.muted/9' },
      cyan: { color: 'devPanel.cyan', background: 'devPanel.cyan/9' },
      violet: { color: 'devPanel.violet', background: 'devPanel.violet/9' },
      orange: { color: 'devPanel.orange', background: 'devPanel.orange/9' },
      green: { color: 'devPanel.green', background: 'devPanel.green/9' },
    },
  },
})

const toggle = css({
  display: 'block',
  width: '100%',
  textAlign: 'left',
  font: 'inherit',
  color: 'inherit',
  background: 'transparent',
  border: 'none',
  padding: '10px 12px',
  cursor: 'pointer',
})
const toggleRow = css({ display: 'flex', justifyContent: 'space-between', alignItems: 'center' })
const titleGroup = css({ display: 'flex', alignItems: 'center', gap: '10px' })
const stepName = css({ fontSize: '12px', color: 'devPanel.text', fontWeight: 700 })
const duration = css({ fontSize: '10px', color: 'devPanel.muted' })
const chevron = css({ fontSize: '11px', color: 'devPanel.muted' })
const body = css({ padding: '0 12px 10px' })

const blockWrap = css({ marginBottom: '8px' })
const blockLabel = css({
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.07em',
  color: 'devPanel.muted',
  marginBottom: '4px',
})
const json = cva({
  base: {
    fontSize: '10px',
    color: 'devPanel.secondary',
    background: 'devPanel.bg',
    padding: '8px',
    borderRadius: '4px',
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    margin: 0,
    fontFamily: 'devPanel.mono',
  },
  variants: {
    kind: { input: { maxHeight: '200px' }, output: { maxHeight: '300px' } },
  },
})

function TraceJsonBlock({
  label,
  value,
}: {
  label: 'INPUT' | 'OUTPUT'
  value: Record<string, unknown>
}) {
  return (
    <div className={blockWrap}>
      <div className={blockLabel}>{label}</div>
      <pre className={json({ kind: label === 'INPUT' ? 'input' : 'output' })}>
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

/** One trace step: its phase, name and duration, expanding to its input and output. */
export function TraceStepCard({
  step,
  expanded,
  onToggle,
}: {
  step: TraceStep
  expanded: boolean
  onToggle: () => void
}) {
  const phase = TRACE_PHASES[step.phase] ?? { name: `P${step.phase}`, tone: 'muted' }

  return (
    <div className={frame({ tone: phase.tone })}>
      <button type="button" aria-expanded={expanded} className={toggle} onClick={onToggle}>
        <div className={toggleRow}>
          <div className={titleGroup}>
            <span className={phaseTag({ tone: phase.tone })}>{phase.name}</span>
            <span className={stepName}>{step.name}</span>
            {(step.durationMs ?? 0) > 0 && (
              <span className={duration}>{fmtStepDuration(step.durationMs ?? 0)}</span>
            )}
          </div>
          <span className={chevron}>{expanded ? '▾' : '▸'}</span>
        </div>
      </button>

      {expanded && (
        <div className={body}>
          {step.input && Object.keys(step.input).length > 0 && (
            <TraceJsonBlock label="INPUT" value={step.input} />
          )}
          {step.output && Object.keys(step.output).length > 0 && (
            <TraceJsonBlock label="OUTPUT" value={step.output} />
          )}
        </div>
      )}
    </div>
  )
}
