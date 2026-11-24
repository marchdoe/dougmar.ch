import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { SignalIndex } from '../components/generated/SignalIndex'
import { WorkIndex } from '../components/generated/WorkIndex'
import { experiments, featuredProject, selectedWork } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

const work = featuredProject
  ? [featuredProject, ...selectedWork, ...experiments]
  : [...selectedWork, ...experiments]

function HomePage() {
  return (
    <>
      <HomeHero />
      <SignalIndex />
      <WorkIndex items={work} label="Selected work & experiments" />
      <SiteCallout />
    </>
  )
}
