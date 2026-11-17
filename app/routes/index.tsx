import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeThesis } from '../components/generated/HomeThesis'
import { SignalStrip } from '../components/generated/SignalStrip'
import { SplitFrame } from '../components/generated/SplitFrame'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <SplitFrame thesis={<HomeThesis />}>
        <WorkIndex />
        <SignalStrip />
      </SplitFrame>
      <SiteCallout />
    </>
  )
}
