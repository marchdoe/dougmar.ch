import { createFileRoute } from '@tanstack/react-router'
import { AboutIntro } from '../components/generated/AboutIntro'
import { CapabilitiesList } from '../components/generated/CapabilitiesList'
import { EducationRow } from '../components/generated/EducationRow'
import { PersonalBand } from '../components/generated/PersonalBand'
import { TimelineList } from '../components/generated/TimelineList'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutIntro />
      <TimelineList />
      <CapabilitiesList />
      <EducationRow />
      <PersonalBand />
    </>
  )
}
