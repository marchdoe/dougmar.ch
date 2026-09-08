import { createFileRoute } from '@tanstack/react-router'
import { IdentityStatement } from '../components/generated/IdentityStatement'
import { TimelineList } from '../components/generated/TimelineList'
import { CapabilitiesPanel } from '../components/generated/CapabilitiesPanel'
import { EducationBlock } from '../components/generated/EducationBlock'
import { PersonalStamps } from '../components/generated/PersonalStamps'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <IdentityStatement statement={identity.statement} role={identity.role} />
      <TimelineList entries={timeline} />
      <CapabilitiesPanel capabilities={capabilities} />
      <EducationBlock education={education} />
      <PersonalStamps personal={personal} />
    </>
  )
}
