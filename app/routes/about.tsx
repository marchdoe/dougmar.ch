import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'
import { AboutThesis } from '../components/generated/AboutThesis'
import { AboutTimeline } from '../components/generated/AboutTimeline'
import { AboutEducationBand } from '../components/generated/AboutEducationBand'
import { ScorecardFooter } from '../components/generated/ScorecardFooter'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const personalSignals = [
    { label: 'Holes in One', value: String(personal.holesInOne), sub: personal.sport },
    { label: 'Teams', value: personal.teams.join(', '), sub: 'Current lineup' },
    { label: 'Current Focus', value: personal.currentFocus, sub: 'Now' },
  ]

  return (
    <>
      <div
        className={css({ display: 'grid', gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' } })}
      >
        <AboutThesis statement={identity.statement} role={identity.role} />
        <AboutTimeline timeline={timeline} capabilities={capabilities} />
      </div>
      <AboutEducationBand education={education} />
      <ScorecardFooter title="The Scorecard" dateLabel={identity.name} cells={personalSignals} />
    </>
  )
}
