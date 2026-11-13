import { createFileRoute } from '@tanstack/react-router'
import { AboutFacts } from '../components/generated/AboutFacts'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineTiles } from '../components/generated/TimelineTiles'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineTiles />
      <AboutFacts />
    </>
  )
}
