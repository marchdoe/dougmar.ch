import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <SiteCallout />
    </>
  )
}
