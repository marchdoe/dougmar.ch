import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { AboutBlurb } from '../components/generated/AboutBlurb'
import { HeroField } from '../components/generated/HeroField'
import { Telemetry } from '../components/generated/Telemetry'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroField />
      <WorkIndex />
      <Telemetry />
      <AboutBlurb />
      <SiteCallout />
    </>
  )
}
