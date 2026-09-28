import { createFileRoute } from '@tanstack/react-router'
import { Capabilities, CellGroup } from '../components/generated/AboutBlocks'
import { EvidenceHead } from '../components/generated/EvidenceHead'
import { HeroStatement } from '../components/generated/HeroStatement'
import { EvidencePanel, Split } from '../components/generated/Split'
import { Thesis } from '../components/generated/Thesis'
import { TimelineTable } from '../components/generated/TimelineTable'
import { identity, personal } from '../content/about'
import { education, timeline } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

const educationCells = [
  { label: 'School', value: education.school },
  { label: 'Degree', value: education.degree },
  { label: 'Concentration', value: education.concentration },
  { label: 'Years', value: education.years },
]

const personalCells = [
  { label: 'Holes in one', value: String(personal.holesInOne) },
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.join(', ') },
  { label: 'Current focus', value: personal.currentFocus },
]

function AboutPage() {
  return (
    <Split>
      <Thesis>
        <HeroStatement
          scale="about"
          eyebrow="Sheet 02 · Profile"
          word="About"
          deck={identity.statement}
        />
      </Thesis>
      <EvidencePanel>
        <EvidenceHead title="Revision history" count={`${timeline.length} entries`} />
        <TimelineTable />
        <Capabilities />
        <CellGroup title="Education" cells={educationCells} />
        <CellGroup title="Off the sheet" cells={personalCells} />
      </EvidencePanel>
    </Split>
  )
}
