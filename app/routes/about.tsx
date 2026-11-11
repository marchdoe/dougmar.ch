import { createFileRoute } from '@tanstack/react-router'
import { AboutFacts } from '../components/generated/AboutFacts'
import { AboutIntro } from '../components/generated/AboutIntro'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutIntro />
      <TimelineSection />
      <CapabilitiesSection />
      <AboutFacts />
    </>
  )
}
