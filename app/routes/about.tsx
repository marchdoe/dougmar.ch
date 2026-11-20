import { createFileRoute } from '@tanstack/react-router'
import { AboutStatement } from '../components/generated/AboutStatement'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { EducationCell } from '../components/generated/EducationCell'
import { PersonalBand } from '../components/generated/PersonalBand'
import { TimelineLedger } from '../components/generated/TimelineLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutStatement />
      <PersonalBand />
      <TimelineLedger />
      <CapabilityTags />
      <EducationCell />
    </>
  )
}
