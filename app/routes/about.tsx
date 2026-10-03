import { createFileRoute } from '@tanstack/react-router'
import { AboutIntro } from '../components/generated/AboutIntro'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { EducationSection } from '../components/generated/EducationSection'
import { PersonalSection } from '../components/generated/PersonalSection'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutIntro />
      <TimelineSection />
      <CapabilitiesSection />
      <EducationSection />
      <PersonalSection />
    </>
  )
}
