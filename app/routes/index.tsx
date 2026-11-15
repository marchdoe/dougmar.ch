import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HeroScoreboard } from '../components/generated/HeroScoreboard'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroScoreboard />
      <WorkIndex />
      <SiteCallout />
    </>
  )
}
