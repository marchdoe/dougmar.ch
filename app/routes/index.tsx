import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { FeaturedWork } from '../components/generated/FeaturedWork'
import { HomeHero } from '../components/generated/HomeHero'
import { PageFrame } from '../components/generated/PageFrame'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <PageFrame>
        <HomeHero />
        <FeaturedWork />
        <WorkIndex />
      </PageFrame>
      <SiteCallout />
    </>
  )
}
