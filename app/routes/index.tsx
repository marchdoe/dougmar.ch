import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { TodayFacts } from '../components/generated/TodayFacts'
import { WorkSection } from '../components/generated/WorkSection'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <WorkSection />
      <TodayFacts />
      <SiteCallout />
    </>
  )
}
