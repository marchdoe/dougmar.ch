import { createFileRoute } from '@tanstack/react-router'
import { ClientSet } from '../components/generated/ClientSet'
import { HomeHero } from '../components/generated/HomeHero'
import { Reveal } from '../components/generated/Reveal'
import { WorkIndex } from '../components/generated/WorkIndex'
import { SiteCallout } from '../components/SiteCallout'
import { experiments, featuredProject, projects } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

// Open item: the empty folds reported below the footer are not fixed here. No file in
// this patch adds height after Colophon, and the cause could not be found from source.
function HomePage() {
  const feature = projects.find((project) => project.title === 'Spaceman') ?? featuredProject
  const work = projects.filter((project) => project.depth === 'full')
  return (
    <>
      <HomeHero project={feature} />
      <Reveal>
        <ClientSet project={feature} />
      </Reveal>
      <WorkIndex work={work} lab={experiments} />
      <SiteCallout />
    </>
  )
}
