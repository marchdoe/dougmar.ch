import { personal } from '../../content/about'
import { education } from '../../content/timeline'
import { Ledger } from './Ledger'
import { RevealSection } from './RevealSection'

export function EducationLedger() {
  return (
    <RevealSection title="Education" sub="Ground school">
      <Ledger
        rows={[
          { k: 'School', v: education.school },
          { k: 'Degree', v: education.degree },
          { k: 'Concentration', v: education.concentration },
          { k: 'Years', v: education.years },
        ]}
      />
    </RevealSection>
  )
}

export function PersonalLedger() {
  return (
    <RevealSection title="Off duty" sub="Personal" tone="bgAlt">
      <Ledger
        rows={[
          { k: 'Holes in one', v: String(personal.holesInOne) },
          { k: 'Sport', v: personal.sport },
          { k: 'Teams', v: personal.teams.join(', ') },
          { k: 'Current focus', v: personal.currentFocus },
        ]}
      />
    </RevealSection>
  )
}
