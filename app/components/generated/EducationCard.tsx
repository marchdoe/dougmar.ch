import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { education } from '../../content/timeline'

export function EducationCard() {
  return (
    <Box
      as="section"
      aria-label="Education"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <Box
        className={css({
          bg: 'surface',
          border: '1px solid',
          borderColor: 'border',
          borderTop: '2px solid',
          borderTopColor: 'accent',
          padding: { base: '6', lg: '8' },
          display: 'grid',
          gap: '2',
        })}
      >
        <div
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'xl',
            letterSpacing: 'tight',
          })}
        >
          {education.school}
        </div>
        <div className={css({ fontFamily: 'body', textStyle: 'md', color: 'textMuted' })}>
          {education.degree} · {education.concentration}
        </div>
        <div
          className={css({
            fontFamily: 'display',
            textStyle: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          {education.years}
        </div>
      </Box>
    </Box>
  )
}
