import { createFileRoute } from '@tanstack/react-router'
import { AboutStatement } from '../components/generated/AboutStatement'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { InteriorHeader } from '../components/generated/InteriorHeader'
import { PageFrame } from '../components/generated/PageFrame'
import { PersonalPlinth } from '../components/generated/PersonalPlinth'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <PageFrame>
      <InteriorHeader />
      <AboutStatement />
      <TimelineSection />
      <CapabilitiesSection />
      <PersonalPlinth />
    </PageFrame>
  )
}
