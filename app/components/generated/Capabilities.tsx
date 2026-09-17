import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

export function Capabilities({ items }: { items: string[] }) {
  return (
    <Box
      as="section"
      bg="bgAlt"
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
        Capabilities
      </span>
      <Box className={css({ display: 'flex', flexWrap: 'wrap', gap: '3' })}>
        {items.map((item) => (
          <span
            key={item}
            className={css({
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: 'sm',
              color: 'textMuted',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'sm',
              padding: '2',
            })}
          >
            {item}
          </span>
        ))}
      </Box>
    </Box>
  )
}
