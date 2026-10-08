import { createFileRoute } from '@tanstack/react-router'
import { AboutCells } from '../components/generated/AboutCells'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { TimelineLedger } from '../components/generated/TimelineLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineLedger />
      <CapabilityTags />
      <AboutCells />
    </>
  )
}
