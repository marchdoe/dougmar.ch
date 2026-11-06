import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { LedgerRow } from './Ledger'
import { RevealSection } from './RevealSection'

export function TimelineLedger() {
  return (
    <RevealSection title="Flight log" sub="Experience">
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'borderStrong',
          maxWidth: '66ch',
        })}
      >
        {timeline.map((entry) => (
          <LedgerRow key={`${entry.year}${entry.role}${entry.company}`} k={entry.year} stacked>
            <span className={css({ display: 'block', textStyle: 'sm', color: 'text' })}>
              {[entry.role, entry.company].filter((s) => s !== '').join(', ')}
            </span>
            {entry.description ? (
              <p
                className={css({
                  margin: '0',
                  marginTop: '1',
                  textStyle: 'sm',
                  color: 'textMuted',
                  maxWidth: '50ch',
                })}
              >
                {entry.description}
              </p>
            ) : null}
          </LedgerRow>
        ))}
      </div>
    </RevealSection>
  )
}
