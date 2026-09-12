import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Box } from '../../styled-system/jsx'
import { AboutHero } from '../components/generated/AboutHero'
import { TimelineList } from '../components/generated/TimelineList'
import { CapabilitiesRow } from '../components/generated/CapabilitiesRow'
import { EducationBlock } from '../components/generated/EducationBlock'
import { PersonalLedger } from '../components/generated/PersonalLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <Box
        className={css({
          bg: 'bg',
          paddingInline: { base: '5', lg: '9' },
          paddingBlock: { base: '8', lg: '9' },
        })}
      >
        <TimelineList />

        <Box className={css({ marginTop: '9' })}>
          <span
            className={css({
              textStyle: 'xs',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              color: 'textFaint',
              display: 'block',
              marginBottom: '5',
            })}
          >
            Capabilities
          </span>
          <CapabilitiesRow />
        </Box>

        <EducationBlock />
        <PersonalLedger />
      </Box>
    </>
  )
}
