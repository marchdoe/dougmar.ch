import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { SiteCallout } from '../components/SiteCallout'
import { EventLog } from '../components/generated/EventLog'
import { HeroBanner } from '../components/generated/HeroBanner'
import { SignalBand } from '../components/generated/SignalBand'
import { WorkIndex } from '../components/generated/WorkIndex'
import { experiments, featuredProject, selectedWork } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

const SIGNALS = [
  { k: 'Tigers · Win', n: '4–3', s: 'One win banked' },
  { k: 'SPY · Up', n: '+0.54%', s: '771.35 ▲' },
  { k: 'Full moon', n: '97%', s: 'Rising over Aldie' },
  { k: 'Red Wings · Loss', n: '2–4', s: 'A score is a score' },
  { k: 'Sky · Aldie', n: '60°', s: 'Cloudy · Air good' },
  { k: 'News · NJ', n: 'FLOOD', s: "Nor'easter inbound" },
]

function HomePage() {
  return (
    <>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'repeat(2, minmax(0, 1fr))' },
        })}
      >
        <HeroBanner />
        <WorkIndex featured={featuredProject} work={selectedWork} experiments={experiments} />
        <EventLog />
        <SignalBand
          head="Eventful. The amber ledger"
          aside="Fair, no. Eventful, yes."
          cells={SIGNALS}
        />
      </div>
      <SiteCallout />
    </>
  )
}
