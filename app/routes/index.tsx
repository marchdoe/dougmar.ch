import { createFileRoute } from '@tanstack/react-router'
import { SignalWall } from '../components/generated/SignalWall'
import { WorkIndex } from '../components/generated/WorkIndex'
import { SiteCallout } from '../components/SiteCallout'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <SignalWall />
      <SiteCallout />
      <WorkIndex />
    </>
  )
}
