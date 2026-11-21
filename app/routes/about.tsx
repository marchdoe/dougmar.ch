import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { CapabilityStrip } from '../components/generated/CapabilityStrip'
import { EducationBlock } from '../components/generated/EducationBlock'
import { SignalStrip } from '../components/generated/SignalStrip'
import { TimelineList } from '../components/generated/TimelineList'
import { personal } from '../content/about'

export const Route = createFileRoute('/about')({ component: AboutPage })

const personalSignals = [
  {
    label: 'Holes in one',
    value: String(personal.holesInOne),
    sub: 'Aces on the card',
    accent: true,
  },
  { label: 'Sport', value: personal.sport, sub: 'The game on the weekend' },
  { label: 'Teams', value: personal.teams.join(', '), sub: 'Followed closely' },
  { label: 'Current focus', value: 'Now', sub: personal.currentFocus },
]

function AboutPage() {
  return (
    <>
      <AboutHero />
      <TimelineList />
      <CapabilityStrip />
      <EducationBlock />
      <SignalStrip label="Off the clock" items={personalSignals} />
    </>
  )
}
