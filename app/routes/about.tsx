import { createFileRoute } from '@tanstack/react-router'
import { AboutPlane } from '../components/generated/AboutPlane'
import { CapabilitiesBand } from '../components/generated/CapabilitiesBand'
import { EducationRows } from '../components/generated/EducationRows'
import { PersonalTail } from '../components/generated/PersonalTail'
import { TimelineIndex } from '../components/generated/TimelineIndex'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutPlane />
      <TimelineIndex />
      <CapabilitiesBand />
      <EducationRows />
      <PersonalTail />
    </>
  )
}
