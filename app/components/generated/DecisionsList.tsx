import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Decision = { decision: string; why: string }

export function DecisionsList({ decisions }: { decisions: Decision[] }) {
  return (
    <Box
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '8', md: '10' }}
      display="flex"
      flexDirection="column"
      gap="5"
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
          color: 'textFaint',
          textTransform: 'lowercase',
          letterSpacing: 'wide',
        })}
      >
        decisions
      </p>
      {decisions.map((item) => (
        <Box key={item.decision} borderTop="1px solid" borderColor="border" pt="3">
          <p
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: 'md',
              color: 'text',
            })}
          >
            {item.decision}
          </p>
          <p className={css({ textStyle: 'md', color: 'textMuted', mt: '1' })}>{item.why}</p>
        </Box>
      ))}
    </Box>
  )
}
