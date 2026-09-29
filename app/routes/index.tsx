import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeBand } from '../components/generated/HomeBand'
import { HomeHero } from '../components/generated/HomeHero'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeBand />
      <SiteCallout />
    </>
  )
}
