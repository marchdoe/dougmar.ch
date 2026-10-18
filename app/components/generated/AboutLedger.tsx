import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { Reveal } from './Reveal'
import { SigGrid } from './SigGrid'

const educationItems = [
  { label: 'School', value: education.school },
  { label: 'Degree', value: education.degree },
  { label: 'Concentration', value: education.concentration },
  { label: 'Years', value: education.years },
]

const personalItems = [
  { label: 'Holes in one', value: String(personal.holesInOne) },
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.join(', ') },
  { label: 'Current focus', value: personal.currentFocus },
]

export function AboutLedger() {
  return (
    <Reveal label="Education and personal">
      <div
        className={css({
          bg: 'surface',
          paddingInline: 'clamp(24px, 6vw, 112px)',
          paddingBlock: 'clamp(22px, 3vw, 34px)',
          borderTopWidth: '3px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        <SigGrid title="Education" items={educationItems} />
        <div
          className={css({
            borderTopWidth: '2px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
          })}
        >
          <SigGrid title="Off the clock" items={personalItems} />
        </div>
      </div>
    </Reveal>
  )
}
