import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutLedger } from '../components/generated/AboutLedger'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineSection />
      <CapabilitiesSection />
      <AboutLedger />
    </>
  )
}
