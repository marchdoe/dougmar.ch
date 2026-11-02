import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { SignalRow } from './SignalRow'

export function AboutRail() {
  const degree = [education.degree, education.concentration, education.years]
    .filter(Boolean)
    .join(', ')
  return (
    <aside
      aria-label="Education and personal"
      className={css({
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderRadius: 'sm',
        paddingTop: '8px',
        paddingBottom: '14px',
        paddingInline: '20px',
        alignSelf: 'start',
        gridColumn: { lg: '9 / 13' },
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textMuted',
          paddingTop: '12px',
          paddingBottom: '10px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'borderStrong',
        })}
      >
        Off The Card
      </div>
      <SignalRow label="Holes in one" fig={String(personal.holesInOne)} />
      <SignalRow label="Sport" sub={personal.sport} />
      <SignalRow label="Teams" sub={personal.teams.join(' · ')} />
      <SignalRow label="Current focus" sub={personal.currentFocus} />
      <SignalRow label="Education" sub={education.school} micro={degree} />
    </aside>
  )
}
