import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeDeck } from '../components/generated/HomeDeck'
import { HomeHero } from '../components/generated/HomeHero'
import { SignalColumns } from '../components/generated/SignalColumns'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeDeck />
      <SignalColumns />
      <WorkIndex />
      <SiteCallout />
    </>
  )
}
