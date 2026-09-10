import { createFileRoute } from '@tanstack/react-router'
import { Box } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { IdentityStandfirst } from '../components/generated/IdentityStandfirst'
import { TimelineRows } from '../components/generated/TimelineRows'
import { CapabilitiesChips } from '../components/generated/CapabilitiesChips'
import { EducationCard } from '../components/generated/EducationCard'
import { PersonalSignal } from '../components/generated/PersonalSignal'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

const kicker = css({
  textStyle: '2xs',
  fontWeight: '700',
  fontVariant: 'small-caps',
  letterSpacing: 'widest',
  color: 'textMuted',
  marginTop: '9',
  marginBottom: '5',
})

function AboutPage() {
  return (
    <Box className={css({ bg: 'bg', color: 'text', minHeight: '100vh' })}>
      <IdentityStandfirst identity={identity} />
      <Box
        className={css({
          paddingX: { base: '5', lg: '6vw' },
          paddingBottom: { base: '9', lg: '9' },
        })}
      >
        <p className={kicker}>Timeline</p>
        <TimelineRows entries={timeline} />

        <p className={kicker}>Capabilities</p>
        <CapabilitiesChips capabilities={capabilities} />

        <p className={kicker}>Education</p>
        <EducationCard education={education} />

        <PersonalSignal personal={personal} />
      </Box>
    </Box>
  )
}
