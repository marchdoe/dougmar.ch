import { createFileRoute } from '@tanstack/react-router'
import { AboutDetails } from '../components/generated/AboutDetails'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineSection } from '../components/generated/TimelineSection'
import { identity } from '../content/about'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero statement={identity.statement} />
      <TimelineSection />
      <AboutDetails />
    </>
  )
}
