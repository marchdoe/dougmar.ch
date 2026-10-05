import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { WorkIndex } from '../components/generated/WorkIndex'
import { featuredProject } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero project={featuredProject} />
      <WorkIndex />
      <SiteCallout />
    </>
  )
}
