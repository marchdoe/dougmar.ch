import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { featuredProject } from '../content/projects'
import { ClientSet } from '../components/generated/ClientSet'
import { FeaturedProblem } from '../components/generated/FeaturedProblem'
import { HomeHero } from '../components/generated/HomeHero'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <ClientSet clients={featuredProject?.clients ?? []} />
      <FeaturedProblem />
      <WorkIndex />
      <SiteCallout />
    </>
  )
}
