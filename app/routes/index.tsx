import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { SignalBand } from '../components/generated/SignalBand'
import { WorkBand } from '../components/generated/WorkBand'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <SignalBand />
      <WorkBand />
      <SiteCallout />
    </>
  )
}
