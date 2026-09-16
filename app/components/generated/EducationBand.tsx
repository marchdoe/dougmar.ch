import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import type { education } from '../../content/timeline'

type Education = typeof education

export function EducationBand({ education }: { education: Education }) {
  return (
    <Box
      as="section"
      bg="field"
      color="fieldInk"
      borderTop="3px solid"
      borderBottom="3px solid"
      borderColor="fieldBorder"
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '8', md: '10' }}
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <p
        className={css({
          fontSize: 'sm',
          color: 'fieldInkMuted',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          textTransform: 'lowercase',
          mb: '4',
        })}
      >
        education
      </p>
      <h3
        className={css({
          fontFamily: 'display',
          textStyle: 'lg',
          fontWeight: 'bold',
          color: 'fieldInk',
          lineHeight: 'tight',
          mb: '3',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        })}
      >
        {education.school}
      </h3>
      <p className={css({ textStyle: 'md', color: 'fieldInk' })}>
        {education.degree}, {education.concentration}. {education.years}.
      </p>
    </Box>
  )
}
