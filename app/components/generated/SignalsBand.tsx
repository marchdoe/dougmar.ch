import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type SignalRow = { k: string; v: string }

export function SignalsBand({ caption, rows }: { caption: string; rows: SignalRow[] }) {
  return (
    <Box
      as="section"
      bg="bgAlt"
      px={{ base: '4', md: '6', lg: '96px' }}
      pt={{ base: '9', md: '12' }}
      pb={{ base: '5', md: '6' }}
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
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          mb: '2',
          textTransform: 'lowercase',
        })}
      >
        {caption}
      </p>
      <Box
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
          columnGap: '12',
        })}
      >
        {rows.map((row) => (
          <div
            key={row.k}
            className={css({
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: '3',
              py: '3',
              borderTop: '1px solid',
              borderColor: 'border',
              alignItems: 'baseline',
            })}
          >
            <span
              className={css({
                fontSize: 'sm',
                color: 'textFaint',
                textTransform: 'lowercase',
                letterSpacing: 'wide',
              })}
            >
              {row.k}
            </span>
            <span className={css({ fontSize: 'sm', color: 'text', textAlign: 'right' })}>
              {row.v}
            </span>
          </div>
        ))}
      </Box>
    </Box>
  )
}
