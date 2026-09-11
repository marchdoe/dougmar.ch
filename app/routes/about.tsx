import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineList } from '../components/generated/TimelineList'
import { CapabilitiesGrid } from '../components/generated/CapabilitiesGrid'
import { EducationCard } from '../components/generated/EducationCard'
import { PersonalLog } from '../components/generated/PersonalLog'
import { AboutClosingPanel } from '../components/generated/AboutClosingPanel'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineList />
      <CapabilitiesGrid />
      <EducationCard />
      <PersonalLog />
      <AboutClosingPanel />
    </>
  )
}
