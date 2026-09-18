import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { projects, selectedWork, experiments } from '../content/projects'
import { ThesisPanel } from '../components/generated/ThesisPanel'
import { LeaderboardPanel } from '../components/generated/LeaderboardPanel'
import { WorkIndexSection } from '../components/generated/WorkIndexSection'
import { ScorecardFooter } from '../components/generated/ScorecardFooter'

export const Route = createFileRoute('/')({ component: HomePage })

const homeSignals = [
  { label: 'Market', value: '762.60', sub: 'SPY up 1.13%' },
  { label: 'Weather', value: '71F', sub: 'Patchy rain, 95% humidity' },
  { label: 'Moon', value: '49%', sub: 'First quarter' },
  { label: 'Detroit', value: '31-41', sub: 'Lions loss, Tigers 1-3 loss' },
  { label: 'On Rotation', value: 'Tobin Sprout', sub: 'The War on Drugs, Guided by Voices' },
  { label: 'Design Wire', value: 'Product-first', sub: 'We are all product engineers now.' },
]

function HomePage() {
  // The thesis panel argues 15th Club's claim specifically, standing beside
  // the live leaderboard as its proof, so it binds that project by slug
  // rather than whichever project the content file happens to feature.
  const heroProject = projects.find((p) => p.slug === '15th-club')

  return (
    <>
      <div
        className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' } })}
      >
        {heroProject ? <ThesisPanel project={heroProject} /> : null}
        <LeaderboardPanel />
      </div>
      <WorkIndexSection selectedWork={selectedWork} experiments={experiments} />
      <ScorecardFooter
        title="The Scorecard"
        dateLabel="Thursday, September 18, 2026, Aldie VA"
        cells={homeSignals}
      />
    </>
  )
}
