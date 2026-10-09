import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutLedger } from '../components/generated/AboutLedger'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { PageLinks } from '../components/generated/PageLinks'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineSection />
      <CapabilitiesSection />
      <PageLinks />
      <AboutLedger />
    </>
  )
}
