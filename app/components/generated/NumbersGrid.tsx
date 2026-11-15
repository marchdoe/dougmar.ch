import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { SignalCard } from './SignalCard'

const terse = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'md',
  lineHeight: '1.2',
})
const meta = css({ fontSize: 'sm', color: 'textMuted', marginTop: '12px', lineHeight: '1.45' })

export function NumbersGrid() {
  const eduMeta = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(', ')
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '16px',
        sm: { gridTemplateColumns: 'repeat(2, 1fr)' },
        lg: { gridTemplateColumns: 'repeat(4, 1fr)' },
      })}
    >
      <SignalCard label="Education">
        <div className={terse}>{education.school}</div>
        <div className={meta}>{eduMeta}</div>
      </SignalCard>
      <SignalCard label="Holes in one" flood>
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'xl',
            lineHeight: '1',
          })}
        >
          {personal.holesInOne}
        </div>
        <div className={css({ fontSize: 'sm', color: 'fieldInkMuted', marginTop: '12px' })}>
          {personal.sport}
        </div>
      </SignalCard>
      <SignalCard label="Teams">
        <div className={terse}>{personal.teams.join(', ')}</div>
      </SignalCard>
      <SignalCard label="Current focus">
        <div className={meta}>{personal.currentFocus}</div>
      </SignalCard>
    </div>
  )
}
