import { createFileRoute } from '@tanstack/react-router'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'
import { AboutHero } from '../components/generated/AboutHero'
import { SectionHead } from '../components/generated/SectionHead'
import { TimelineRows } from '../components/generated/TimelineRows'
import { CapabilityBand } from '../components/generated/CapabilityBand'
import { EducationBand } from '../components/generated/EducationBand'
import { SignalsBand } from '../components/generated/SignalsBand'
import { Box } from '../../styled-system/jsx'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero statement={identity.statement} role={identity.role} />
      <Box as="main" pt={{ base: '10', md: '14' }}>
        <SectionHead eyebrow="timeline" heading="the record" />
        <Box px={{ base: '4', md: '6', lg: '96px' }}>
          <TimelineRows entries={timeline} />
        </Box>

        <CapabilityBand items={capabilities} />
        <EducationBand education={education} />

        <SignalsBand
          caption="personal, off the record"
          rows={[
            { k: 'Holes in one', v: String(personal.holesInOne) },
            { k: 'Sport', v: personal.sport },
            { k: 'Teams', v: personal.teams.join(', ') },
            { k: 'Current focus', v: personal.currentFocus },
          ]}
        />
      </Box>
    </>
  )
}
