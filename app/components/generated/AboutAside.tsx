import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { FactList } from './FactList'

const educationFacts = [
  { label: 'School', value: education.school },
  { label: 'Degree', value: education.degree },
  { label: 'Concentration', value: education.concentration },
  { label: 'Years', value: education.years },
].filter((f) => f.value !== '')

const personalFacts = [
  { label: 'Holes in one', value: String(personal.holesInOne) },
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.join(', ') },
  { label: 'Current focus', value: personal.currentFocus },
].filter((f) => f.value !== '')

export function AboutAside() {
  return (
    <aside className={css({ display: 'grid', rowGap: '6', minWidth: '0', alignContent: 'start' })}>
      <div
        className={css({
          borderTop: '2px solid',
          borderTopColor: 'borderStrong',
          paddingTop: '14px',
        })}
      >
        <FactList heading="Education" facts={educationFacts} />
      </div>
      <div
        className={css({
          bg: 'bgAlt',
          border: '1px solid',
          borderColor: 'border',
          borderRadius: 'md',
          paddingBlock: '5',
          paddingInline: '5',
        })}
      >
        <FactList heading="Off the course and on it" facts={personalFacts} />
      </div>
    </aside>
  )
}
