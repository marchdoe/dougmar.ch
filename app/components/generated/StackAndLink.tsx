import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function StackAndLink({ stack, liveUrl }: { stack?: string[]; liveUrl?: string }) {
  if (!stack && !liveUrl) return null
  return (
    <Box
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '8', md: '10' }}
      display="flex"
      flexDirection="column"
      gap="4"
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {stack && (
        <Box display="flex" flexWrap="wrap" gap="3">
          {stack.map((tech) => (
            <span
              key={tech}
              className={css({
                fontSize: 'sm',
                color: 'textMuted',
                border: '1px solid',
                borderColor: 'border',
                px: '3',
                py: '1',
              })}
            >
              {tech}
            </span>
          ))}
        </Box>
      )}
      {liveUrl && (
        <a
          href={liveUrl}
          className={css({
            fontSize: 'sm',
            color: 'accentAlt',
            borderBottom: '2px solid',
            borderColor: 'accentAlt',
            pb: '1',
            display: 'inline-block',
            width: 'fit-content',
          })}
        >
          Visit live site &rarr;
        </a>
      )}
    </Box>
  )
}
