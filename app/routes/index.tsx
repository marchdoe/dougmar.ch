import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HeroScore } from '../components/generated/HeroScore'
import { SignalStrip } from '../components/generated/SignalStrip'
import { WorkSection } from '../components/generated/WorkSection'

export const Route = createFileRoute('/')({ component: HomePage })

const signals = [
  { label: 'Markets', value: 'SPY 689.81', sub: '▼ down 3.64% on the day' },
  { label: 'Pistons', value: '102–105', sub: 'Fell at home, one possession short' },
  { label: 'Weather', value: '47°F', sub: 'Aldie, VA, overcast' },
  { label: 'Holiday', value: 'Thanksgiving', sub: 'In 5 days' },
]

function HomePage() {
  return (
    <>
      <HeroScore />
      <SignalStrip label="The day in signals" items={signals} />
      <WorkSection />
      <SiteCallout />
    </>
  )
}
