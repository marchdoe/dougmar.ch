import { education } from '../../content/timeline'
import { Ledger } from './Ledger'
import { SectionHead } from './SectionHead'

export function AboutEducation() {
  return (
    <section>
      <SectionHead label="Education" />
      <Ledger
        rows={[
          { k: 'School', v: education.school },
          { k: 'Degree', v: education.degree },
          { k: 'Concentration', v: education.concentration },
          { k: 'Years', v: education.years },
        ]}
      />
    </section>
  )
}
