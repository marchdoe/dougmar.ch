import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { SigRow } from './SigRow'

const headCls = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontVariant: 'small-caps',
  letterSpacing: 'wider',
  fontSize: 'sm',
  color: 'textFaint',
  marginBottom: '18px',
})

export function AboutLedger() {
  const school = [
    { label: 'School', value: education.school },
    { label: 'Degree', value: education.degree },
    { label: 'Concentration', value: education.concentration },
    { label: 'Years', value: education.years },
  ].filter((r) => r.value !== '')
  const life = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ].filter((r) => r.value !== '')
  return (
    <section
      className={css({
        bg: 'bgAlt',
        color: 'textMuted',
        paddingTop: '44px',
        paddingInline: '24px',
        paddingBottom: '44px',
        borderTop: '2px solid',
        borderColor: 'borderStrong',
        display: 'grid',
        gridTemplateColumns: '1fr',
        rowGap: '6',
        lg: {
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          columnGap: '2vw',
          paddingTop: '60px',
          paddingInline: '4vw',
        },
        xl: { paddingInline: '5vw' },
      })}
    >
      <div>
        <h2 className={headCls}>Education</h2>
        {school.map((r) => (
          <SigRow key={r.label} label={r.label} value={r.value} />
        ))}
      </div>
      <div>
        <h2 className={headCls}>Off the clock</h2>
        {life.map((r) => (
          <SigRow key={r.label} label={r.label} value={r.value} />
        ))}
      </div>
    </section>
  )
}
