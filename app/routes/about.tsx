import { createFileRoute } from '@tanstack/react-router'
import { AboutIntro } from '../components/generated/AboutIntro'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { FigureBand } from '../components/generated/FigureBand'
import { TimelineIndex } from '../components/generated/TimelineIndex'
import { identity, personal } from '../content/about'
import { capabilities, education, timeline } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

const groups = [
  {
    title: 'Education',
    rows: [
      { label: 'School', value: education.school },
      { label: 'Degree', value: education.degree },
      { label: 'Concentration', value: education.concentration },
      { label: 'Years', value: education.years },
    ],
  },
  {
    title: 'Off the clock',
    rows: [
      { label: 'Holes in one', value: String(personal.holesInOne) },
      { label: 'Sport', value: personal.sport },
      { label: 'Teams', value: personal.teams.join(', ') },
      { label: 'Current focus', value: personal.currentFocus },
    ],
  },
]

function AboutPage() {
  return (
    <>
      <AboutIntro name={identity.name} role={identity.role} statement={identity.statement} />
      <TimelineIndex entries={timeline} />
      <CapabilityTags items={capabilities} />
      <FigureBand groups={groups} />
    </>
  )
}
