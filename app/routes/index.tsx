import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { NavRow } from '../components/generated/NavRow'
import { TodaySignals } from '../components/generated/TodaySignals'
import { WorkIndex } from '../components/generated/WorkIndex'
import { projects } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeHero />
      <NavRow />
      <WorkIndex heading="selected work" items={projects} />
      <TodaySignals />
      <SiteCallout />
    </>
  )
}
