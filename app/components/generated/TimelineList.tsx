import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'

const rowClass = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '120px 1fr' },
  gap: { base: '1', lg: '4' },
  alignItems: 'baseline',
  paddingBlock: '4',
  borderTop: '1px solid',
  borderColor: 'border',
})

export function TimelineList() {
  return (
    <Box
      as="section"
      aria-label="Timeline"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
        borderBottom: '2px solid',
        borderColor: 'borderStrong',
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          borderBottom: '1px solid',
          borderColor: 'border',
          paddingBottom: '3',
          marginBottom: '4',
        })}
      >
        timeline
      </div>
      <div>
        {timeline.map((entry, i) => (
          <div key={i} className={rowClass}>
            <span
              className={css({
                fontFamily: 'display',
                textStyle: 'xs',
                letterSpacing: 'wide',
                color: 'textFaint',
              })}
            >
              {entry.year}
            </span>
            <Box className={css({ minWidth: 0 })}>
              <div
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  textStyle: 'lg',
                  letterSpacing: 'tight',
                  overflowWrap: 'anywhere',
                })}
              >
                {entry.role} · {entry.company}
              </div>
              <p
                className={css({
                  fontFamily: 'body',
                  textStyle: 'base',
                  color: 'textMuted',
                  marginTop: '1',
                  overflowWrap: 'anywhere',
                })}
              >
                {entry.description}
              </p>
            </Box>
          </div>
        ))}
      </div>
    </Box>
  )
}
