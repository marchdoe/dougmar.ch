import { createFileRoute } from '@tanstack/react-router'
import { HomeHero } from '../components/generated/HomeHero'
import { SiteCallout } from '../components/SiteCallout'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <SiteCallout />
    </>
  )
}
