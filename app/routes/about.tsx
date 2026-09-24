import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutLedger } from '../components/generated/AboutLedger'
import { CapabilityChips } from '../components/generated/CapabilityChips'
import { TimelineBand } from '../components/generated/TimelineBand'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineBand />
      <CapabilityChips />
      <AboutLedger />
    </>
  )
}
