import { createFileRoute } from '@tanstack/react-router'
import { identity } from '../content/about'
import { capabilities, timeline } from '../content/timeline'
import { AboutLedger } from '../components/generated/AboutLedger'
import { CapabilityGrid } from '../components/generated/CapabilityGrid'
import { PageField } from '../components/generated/PageField'
import { TimelineList } from '../components/generated/TimelineList'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <PageField eyebrow={identity.role} title={identity.statement} />
      <TimelineList entries={timeline} />
      <CapabilityGrid items={capabilities} />
      <AboutLedger />
    </>
  )
}
