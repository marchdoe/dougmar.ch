import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomePlane } from '../components/generated/HomePlane'
import { SignalsBand } from '../components/generated/SignalsBand'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomePlane />
      <WorkIndex />
      <SignalsBand />
      <SiteCallout />
    </>
  )
}
