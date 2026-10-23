import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilitiesBlock } from '../components/generated/CapabilitiesBlock'
import { TimelineIndex } from '../components/generated/TimelineIndex'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineIndex />
      <CapabilitiesBlock />
    </>
  )
}
