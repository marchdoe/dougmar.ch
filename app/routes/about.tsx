import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilityStrip } from '../components/generated/CapabilityStrip'
import { EducationBlock } from '../components/generated/EducationBlock'
import { PersonalLedger } from '../components/generated/PersonalLedger'
import { TimelineLedger } from '../components/generated/TimelineLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineLedger />
      <CapabilityStrip />
      <EducationBlock />
      <PersonalLedger />
    </>
  )
}
