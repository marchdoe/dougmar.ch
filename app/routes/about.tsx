import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { EducationPersonal } from '../components/generated/EducationPersonal'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineSection />
      <CapabilitiesSection />
      <EducationPersonal />
    </>
  )
}
