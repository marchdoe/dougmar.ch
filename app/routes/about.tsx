import { createFileRoute } from '@tanstack/react-router'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineSection } from '../components/generated/TimelineSection'
import { CapabilitiesEducation } from '../components/generated/CapabilitiesEducation'
import { PersonalLedger } from '../components/generated/PersonalLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero role={identity.role} statement={identity.statement} />
      <TimelineSection entries={timeline} />
      <CapabilitiesEducation capabilities={capabilities} education={education} />
      <PersonalLedger personal={personal} />
    </>
  )
}
