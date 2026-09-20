import { css } from '../../../styled-system/css'
import { signalLines } from '../../lib/archive-signals'
import type { ArchiveDetail } from '../../types/archive-record'
import { Absent, Step } from './Step'

const signalGrid = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '9px',
  maxWidth: '76ch',
})

const signalRow = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', sm: '128px minmax(0, 1fr)' },
  gap: { base: '2px', sm: '16px' },
  alignItems: 'baseline',
  paddingBottom: '9px',
  borderBottom: '1px solid',
  borderColor: 'archive.lineSoft',
})

const signalName = css({
  fontSize: 'archive.label',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'archive.dim',
})

const signalText = css({
  fontSize: 'archive.small',
  color: 'archive.text',
  minWidth: 0,
  overflowWrap: 'anywhere',
})
const signalNone = css({ fontSize: 'archive.small', color: 'archive.faint', fontStyle: 'italic' })

export function SignalsStep({ detail }: { detail: ArchiveDetail }) {
  const signals = signalLines(detail.signals)
  return (
    <Step n="01" title="The day arrived">
      {signals.length === 0 ? (
        <Absent field="signals" era={detail.era} noun="record of the day" />
      ) : (
        <div className={signalGrid}>
          {signals.map((s) => (
            <div key={s.provider} className={signalRow}>
              <span className={signalName}>{s.label}</span>
              <span className={s.empty ? signalNone : signalText}>{s.summary}</span>
            </div>
          ))}
        </div>
      )}
    </Step>
  )
}
