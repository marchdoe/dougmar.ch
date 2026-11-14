import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilitySection } from '../components/generated/CapabilitySection'
import { PersonalSection } from '../components/generated/PersonalSection'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineSection />
      <CapabilitySection />
      <PersonalSection />
    </>
  )
}
