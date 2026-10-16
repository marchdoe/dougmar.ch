import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { LedgerRow } from './LedgerRow'

const head = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  paddingBottom: '12px',
  borderBottom: '2px solid',
  borderBottomColor: 'borderStrong',
})

export function AboutLedger() {
  const school = [
    { label: 'School', value: education.school },
    { label: 'Degree', value: education.degree },
    { label: 'Concentration', value: education.concentration },
    { label: 'Years', value: education.years },
  ].filter((r) => Boolean(r.value))
  const life = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: { base: '64px', md: '80px' },
        paddingInline: { base: '4', md: '6vw' },
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
        gap: { base: '44px', md: '64px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div>
        <h2 className={head}>Education</h2>
        {school.map((r) => (
          <LedgerRow key={r.label} label={r.label}>
            {r.value}
          </LedgerRow>
        ))}
      </div>
      <div>
        <h2 className={head}>Off the clock</h2>
        {life.map((r) => (
          <LedgerRow key={r.label} label={r.label} lead={r.label === 'Holes in one'}>
            {r.value}
          </LedgerRow>
        ))}
      </div>
    </section>
  )
}
