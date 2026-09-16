import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function CapabilityBand({ items }: { items: string[] }) {
  return (
    <Box
      as="section"
      bg="surface"
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '6', md: '8' }}
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        gap: '4',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {items.map((item) => (
        <span
          key={item}
          className={css({
            fontSize: 'sm',
            color: 'textMuted',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textTransform: 'lowercase',
            borderBottom: '1px solid',
            borderColor: 'border',
            pb: '1',
          })}
        >
          {item}
        </span>
      ))}
    </Box>
  )
}
