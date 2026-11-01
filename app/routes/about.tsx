import { createFileRoute } from '@tanstack/react-router'
import { AboutDetails } from '../components/generated/AboutDetails'
import { AboutHero } from '../components/generated/AboutHero'
import { PersonalBand } from '../components/generated/PersonalBand'
import { TimelineSection } from '../components/generated/TimelineSection'
import { identity, personal } from '../content/about'
import { capabilities, education, timeline } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero statement={identity.statement} name={identity.name} role={identity.role} />
      <TimelineSection entries={timeline} />
      <AboutDetails capabilities={capabilities} education={education} />
      <PersonalBand
        holesInOne={personal.holesInOne}
        sport={personal.sport}
        teams={personal.teams}
        currentFocus={personal.currentFocus}
      />
    </>
  )
}
