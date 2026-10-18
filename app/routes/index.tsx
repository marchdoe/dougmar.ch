import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HeroScore } from '../components/generated/HeroScore'
import { HomeWork } from '../components/generated/HomeWork'
import { experiments, featuredProject, selectedWork } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const selected = featuredProject ? [featuredProject, ...selectedWork] : selectedWork
  return (
    <>
      <HeroScore />
      <HomeWork selected={selected} experiments={experiments} />
      <SiteCallout />
    </>
  )
}
