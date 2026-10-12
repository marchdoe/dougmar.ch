import { createFileRoute } from '@tanstack/react-router'
import { AboutStandfirst } from '../components/generated/AboutStandfirst'
import { CapabilitiesEducation } from '../components/generated/CapabilitiesEducation'
import { PersonalSigs } from '../components/generated/PersonalSigs'
import { TimelineIndex } from '../components/generated/TimelineIndex'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutStandfirst />
      <TimelineIndex />
      <CapabilitiesEducation />
      <PersonalSigs />
    </>
  )
}
