import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { WorkIndex } from '../components/generated/WorkIndex'
import { experiments, featuredProject, selectedWork } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <SiteCallout />
      <WorkIndex featured={featuredProject} selected={selectedWork} experiments={experiments} />
    </>
  )
}
