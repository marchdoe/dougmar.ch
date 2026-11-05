import { createFileRoute } from '@tanstack/react-router'
import { FeaturedSection } from '../components/generated/FeaturedSection'
import { HomeHero } from '../components/generated/HomeHero'
import { LowerSection } from '../components/generated/LowerSection'
import { SiteCallout } from '../components/SiteCallout'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <FeaturedSection />
      <LowerSection />
      <SiteCallout />
    </>
  )
}
