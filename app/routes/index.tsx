import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { DayLedger } from '../components/generated/DayLedger'
import { HomeHero } from '../components/generated/HomeHero'
import { WorkLedger } from '../components/generated/WorkLedger'
import { SiteCallout } from '../components/SiteCallout'

export const Route = createFileRoute('/')({ component: HomePage })

const calloutSlot = css({
  marginTop: { base: '64px', md: '96px' },
  marginBottom: { base: '64px', md: '96px' },
})

function HomePage() {
  return (
    <>
      <HomeHero />
      <WorkLedger />
      <div className={calloutSlot}>
        <SiteCallout />
      </div>
      <DayLedger />
    </>
  )
}
