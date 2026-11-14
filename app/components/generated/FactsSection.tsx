import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { FactList } from './FactList'
import { RevealSection } from './RevealSection'
import { SecLabel } from './SecLabel'

const educationFacts = [
  { k: 'School', v: education.school },
  { k: 'Degree', v: education.degree },
  { k: 'Concentration', v: education.concentration },
  { k: 'Years', v: education.years },
]

const personalFacts = [
  { k: 'Sport', v: personal.sport },
  { k: 'Teams', v: personal.teams.join(', ') },
  { k: 'Holes in one', v: String(personal.holesInOne) },
  { k: 'Current focus', v: personal.currentFocus },
]

export function FactsSection() {
  return (
    <RevealSection
      className={css({
        paddingTop: 'clamp(24px, 3vw, 40px)',
        paddingBottom: 'clamp(40px, 5vw, 64px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
        gap: { base: '40px', md: '56px' },
      })}
    >
      <div>
        <SecLabel>Education</SecLabel>
        <FactList facts={educationFacts} />
      </div>
      <div>
        <SecLabel>Off the clock</SecLabel>
        <FactList facts={personalFacts} />
      </div>
    </RevealSection>
  )
}
