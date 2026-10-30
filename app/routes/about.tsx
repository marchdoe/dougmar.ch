import { createFileRoute } from '@tanstack/react-router'
import { AboutColophon } from '../components/generated/AboutColophon'
import { AboutStatement } from '../components/generated/AboutStatement'
import { CapabilitySet } from '../components/generated/CapabilitySet'
import { TimelineCatalog } from '../components/generated/TimelineCatalog'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutStatement />
      <TimelineCatalog />
      <CapabilitySet />
      <AboutColophon />
    </>
  )
}
