import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function ContextBlock({
  context,
  constraints,
}: {
  context?: string
  constraints?: string[]
}) {
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
      {context && (
        <p className={css({ textStyle: 'md', color: 'textMuted', maxW: '68ch' })}>{context}</p>
      )}
      {constraints && (
        <ul
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '2',
            pl: '0',
            listStyle: 'none',
          })}
        >
          {constraints.map((constraint) => (
            <li
              key={constraint}
              className={css({
                fontSize: 'sm',
                color: 'textFaint',
                borderTop: '1px solid',
                borderColor: 'border',
                pt: '2',
              })}
            >
              {constraint}
            </li>
          ))}
        </ul>
      )}
    </Box>
  )
}
