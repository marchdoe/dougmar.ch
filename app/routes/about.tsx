import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutField } from '../components/generated/AboutField'
import { TimelineList } from '../components/generated/TimelineList'
import { RecordGrid } from '../components/generated/RecordGrid'
import { SiteColophon } from '../components/generated/SiteColophon'
import { timeline, education } from '../content/timeline'
import { personal } from '../content/about'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutField />
      <TimelineList entries={timeline} />
      <RecordGrid education={education} personal={personal} />
      <SiteColophon />
    </>
  )
}
