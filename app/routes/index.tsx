import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { WorkLedger } from '../components/generated/WorkLedger'
import { experiments, featuredProject, selectedWork } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero project={featuredProject} />
      <WorkLedger selected={selectedWork} experiments={experiments} />
      <SiteCallout />
    </>
  )
}
