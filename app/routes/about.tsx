import { createFileRoute } from '@tanstack/react-router'
import { AboutFacts } from '../components/generated/AboutFacts'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilityRow } from '../components/generated/CapabilityRow'
import { TimelineList } from '../components/generated/TimelineList'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineList />
      <CapabilityRow />
      <AboutFacts />
    </>
  )
}
