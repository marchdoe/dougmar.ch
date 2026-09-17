import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Education = { school: string; degree: string; concentration: string; years: string }

export function EducationRow({ education }: { education: Education }) {
  return (
    <Box
      as="section"
      bg="bg"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '32px', md: '40px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <span
        className={css({
          fontSize: 'xs',
          fontWeight: '600',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textFaint',
          display: 'block',
          marginBottom: '4',
        })}
      >
        Education
      </span>
      <Box
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: 'border',
          paddingBlock: '4',
        })}
      >
        <Box fontFamily="display" color="text" className={css({ fontSize: 'md' })}>
          {education.school}, {education.degree}
        </Box>
        <Box color="textMuted" className={css({ fontSize: 'sm' })}>
          {education.concentration}
        </Box>
        <Box fontFamily="display" color="accent" className={css({ fontSize: 'sm' })}>
          {education.years}
        </Box>
      </Box>
    </Box>
  )
}
