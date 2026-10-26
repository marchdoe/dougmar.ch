import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutLedger } from '../components/generated/AboutLedger'
import { AboutTimeline } from '../components/generated/AboutTimeline'
import { CapabilityBand } from '../components/generated/CapabilityBand'
import { FootIndex } from '../components/generated/FootIndex'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTimeline />
      <CapabilityBand />
      <AboutLedger />
      <FootIndex />
    </>
  )
}
