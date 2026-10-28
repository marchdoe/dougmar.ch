import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { AboutTeaser } from '../components/generated/AboutTeaser'
import { ExperimentsSection } from '../components/generated/ExperimentsSection'
import { HomeHero } from '../components/generated/HomeHero'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <ExperimentsSection />
      <SiteCallout />
      <AboutTeaser />
    </>
  )
}
