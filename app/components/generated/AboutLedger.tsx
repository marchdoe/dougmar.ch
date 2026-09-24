import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { KeyValueRows } from './KeyValueRows'

const educationRows = [
  { label: 'School', value: education.school },
  { label: 'Degree', value: education.degree },
  { label: 'Concentration', value: education.concentration },
  { label: 'Years', value: education.years },
]

const personalRows = [
  { label: 'Holes in one', value: String(personal.holesInOne) },
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.join(', ') },
  { label: 'Current focus', value: personal.currentFocus },
]

export function AboutLedger() {
  return (
    <section
      className={css({
        paddingTop: { base: '48px', xl: '64px' },
        paddingBottom: { base: '72px', xl: '96px' },
        paddingInline: '6vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          columnGap: '3vw',
          rowGap: '40px',
        })}
      >
        <KeyValueRows title="Education" rows={educationRows} />
        <KeyValueRows title="Off the course and on it" rows={personalRows} />
      </div>
    </section>
  )
}
