import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { LeaderboardSection } from '../components/generated/LeaderboardSection'
import { SignalsSection } from '../components/generated/SignalsSection'
import { WorkListSection } from '../components/generated/WorkListSection'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <LeaderboardSection />
      <WorkListSection />
      <SignalsSection />
      <SiteCallout />
    </>
  )
}
