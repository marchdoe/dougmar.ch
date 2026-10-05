import { createFileRoute } from '@tanstack/react-router'
import { AboutFacts } from '../components/generated/AboutFacts'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilityStrip } from '../components/generated/CapabilityStrip'
import { TimelineLedger } from '../components/generated/TimelineLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineLedger />
      <CapabilityStrip />
      <AboutFacts />
    </>
  )
}
