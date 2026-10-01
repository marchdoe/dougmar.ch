import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { DataGrid } from './DataGrid'

export function AboutFacts() {
  const items = [
    { lbl: 'School', val: education.school },
    { lbl: 'Degree', val: education.degree },
    { lbl: 'Concentration', val: education.concentration },
    { lbl: 'Years', val: education.years },
    { lbl: 'Holes in one', val: String(personal.holesInOne) },
    { lbl: 'Sport', val: personal.sport },
    { lbl: 'Teams', val: personal.teams.join(' · ') },
    { lbl: 'Current focus', val: personal.currentFocus },
  ].filter((d) => d.val !== '')
  return (
    <section
      className={css({
        marginTop: '64px',
        bg: 'field',
        color: 'fieldInk',
        paddingTop: '36px',
        paddingBottom: '44px',
        paddingInline: '24px',
        md: { paddingTop: '48px', paddingBottom: '56px', paddingInline: '6vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          fontSize: '15px',
          color: 'fieldInk',
          marginBottom: '20px',
        })}
      >
        Education and the rest
      </h2>
      <DataGrid items={items} />
    </section>
  )
}
