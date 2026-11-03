import { createFileRoute } from '@tanstack/react-router'
import { HomeTrajectory } from '../components/generated/HomeTrajectory'
import { Reveal } from '../components/generated/Reveal'
import { CloseLine, WorkStage } from '../components/generated/WorkStage'
import { SiteCallout } from '../components/SiteCallout'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <WorkStage />
      <Reveal>
        <CloseLine />
      </Reveal>
      <Reveal>
        <HomeTrajectory />
      </Reveal>
      <SiteCallout />
    </>
  )
}
