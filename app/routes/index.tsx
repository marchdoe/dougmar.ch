import { createFileRoute } from '@tanstack/react-router'
import { DayLedger } from '../components/generated/DayLedger'
import { HomeBoard } from '../components/generated/HomeBoard'
import { SplitPage } from '../components/generated/Split'
import { HomeIndexBand } from '../components/generated/WorkIndex'
import { SiteCallout } from '../components/SiteCallout'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <SplitPage>
        <HomeBoard />
        <HomeIndexBand />
        <DayLedger />
      </SplitPage>
      <SiteCallout />
    </>
  )
}
