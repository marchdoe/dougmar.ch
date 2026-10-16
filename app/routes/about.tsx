import { createFileRoute } from '@tanstack/react-router'
import { AboutLedger } from '../components/generated/AboutLedger'
import { AboutThesis } from '../components/generated/AboutThesis'
import { SplitHero } from '../components/generated/Panels'
import { TimelinePanel } from '../components/generated/TimelinePanel'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <SplitHero>
        <AboutThesis />
        <TimelinePanel />
      </SplitHero>
      <AboutLedger />
    </>
  )
}
