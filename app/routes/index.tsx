import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { FeaturedMeta } from '../components/generated/FeaturedMeta'
import { HomeHero } from '../components/generated/HomeHero'
import { SignalLedger } from '../components/generated/SignalLedger'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedMeta />
      <SiteCallout />
      <SignalLedger />
    </>
  )
}
