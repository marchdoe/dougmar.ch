import { createFileRoute } from '@tanstack/react-router'
import { identity } from '../content/about'
import { EducationLedger, PersonalLedger } from '../components/generated/AboutLedgers'
import { AboutStatement } from '../components/generated/AboutStatement'
import { CapabilityChips } from '../components/generated/CapabilityChips'
import { TimelineLedger } from '../components/generated/TimelineLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutStatement statement={identity.statement} />
      <TimelineLedger />
      <CapabilityChips />
      <EducationLedger />
      <PersonalLedger />
    </>
  )
}
