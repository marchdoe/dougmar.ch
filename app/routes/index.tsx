import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { SignalsStrip, todaySignals } from '../components/generated/SignalsStrip'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <WorkIndex />
      <SignalsStrip kicker="signals · sat 31 oct 2026" facts={todaySignals} />
      <SiteCallout />
    </>
  )
}
