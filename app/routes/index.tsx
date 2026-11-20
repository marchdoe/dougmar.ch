import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HeroField } from '../components/generated/HeroField'
import { SignalBand } from '../components/generated/SignalBand'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroField />
      <SignalBand />
      <SiteCallout />
    </>
  )
}
