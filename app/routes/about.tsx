import { createFileRoute } from '@tanstack/react-router'
import { AboutBand } from '../components/generated/AboutBand'
import { AboutHeader } from '../components/generated/AboutHeader'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { FactsSection } from '../components/generated/FactsSection'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHeader />
      <AboutBand />
      <TimelineSection />
      <CapabilitiesSection />
      <FactsSection />
    </>
  )
}
