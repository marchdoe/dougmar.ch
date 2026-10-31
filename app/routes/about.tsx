import { createFileRoute } from '@tanstack/react-router'
import { personal } from '../content/about'
import { AboutHero } from '../components/generated/AboutHero'
import { SignalsStrip, todaySignals } from '../components/generated/SignalsStrip'
import { TimelinePlane } from '../components/generated/TimelinePlane'

export const Route = createFileRoute('/about')({ component: AboutPage })

const personalFacts = [
  { label: 'holes in one', value: String(personal.holesInOne), loud: true },
  { label: 'sport', value: personal.sport },
  { label: 'teams', value: personal.teams.join(' · ') },
  { label: 'current focus', value: personal.currentFocus },
]

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelinePlane />
      <SignalsStrip kicker="off the clock" facts={personalFacts} />
      <SignalsStrip kicker="signals · sat 31 oct 2026" facts={todaySignals} />
    </>
  )
}
