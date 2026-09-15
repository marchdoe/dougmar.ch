import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import { timeline, capabilities, education } from '../../content/timeline'
import { personal } from '../../content/about'
import { TimelineList } from './TimelineList'
import { CapabilityTags } from './CapabilityTags'
import { EducationBlock } from './EducationBlock'
import { PersonalSignals } from './PersonalSignals'

export function AboutLedger() {
  return (
    <Box
      as="aside"
      bg="field"
      color="fieldInk"
      minWidth="0px"
      className={css({
        position: 'relative',
        padding: { base: '32px 6vw 44px', lg: '40px 3vw 56px', xl: '52px 40px 64px' },
      })}
    >
      <TimelineList entries={timeline} />
      <CapabilityTags capabilities={capabilities} />
      <EducationBlock education={education} />
      <PersonalSignals personal={personal} />
    </Box>
  )
}
