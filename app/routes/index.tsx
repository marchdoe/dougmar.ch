import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HeroHome } from '../components/generated/HeroHome'
import { SignalLedger } from '../components/generated/SignalLedger'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroHome />
      <SignalLedger />
      <WorkIndex />
      <SiteCallout />
    </>
  )
}
