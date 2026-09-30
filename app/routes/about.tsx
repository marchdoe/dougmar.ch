import { createFileRoute } from '@tanstack/react-router'
import {
  CapabilitiesSection,
  EducationSection,
  PersonalSection,
} from '../components/generated/AboutDetails'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineSection />
      <CapabilitiesSection />
      <EducationSection />
      <PersonalSection />
    </>
  )
}
