import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import type { Education } from '../../content/timeline'

export function EducationBlock({ education }: { education: Education }) {
  return (
    <Box
      as="section"
      borderTop="1px solid"
      borderColor="fieldBorder"
      className={css({ pt: '5', pb: '5' })}
    >
      <Box
        className={css({
          color: 'fieldInkMuted',
          mb: '4',
          fontSize: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
        })}
      >
        Education
      </Box>
      <Box
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: 'lg',
          color: 'fieldInk',
        })}
      >
        {education.school}
      </Box>
      <Box className={css({ fontSize: 'base', color: 'fieldInkMuted', mt: '2' })}>
        {education.degree}, {education.concentration} &middot; {education.years}
      </Box>
    </Box>
  )
}
