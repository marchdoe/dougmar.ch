import { createFileRoute } from '@tanstack/react-router'
import { AboutFacts } from '../components/generated/AboutFacts'
import { AboutHero } from '../components/generated/AboutHero'
import { Capabilities } from '../components/generated/Capabilities'
import { Column } from '../components/generated/Column'
import { TimelineIndex } from '../components/generated/TimelineIndex'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <Column>
        <TimelineIndex />
        <Capabilities />
      </Column>
      <AboutFacts />
    </>
  )
}
