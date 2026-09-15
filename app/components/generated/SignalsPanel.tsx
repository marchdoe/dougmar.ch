import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

const signals = [
  { k: 'Market · SPY', v: '−0.45%' },
  { k: 'Weather', v: 'Overcast · 54°F' },
  { k: 'Moon', v: 'Waxing crescent · 19.5%' },
  { k: 'Air Quality', v: 'Good' },
  { k: 'Daylight', v: '12.2 h' },
  { k: 'Golf', v: 'Biltmore Championship · scheduled' },
]

const revealCss = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

export function SignalsPanel() {
  return (
    <Box
      as="section"
      borderTop="1px solid"
      borderColor="fieldBorder"
      className={css({ pt: '5', pb: '5' })}
    >
      <Box className={revealCss}>
        <Box
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            color: 'fieldInkMuted',
            mb: '4',
            fontSize: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          <span>Signals · Sep 15</span>
          <span className={css({ color: 'accentAlt' })}>Detroit</span>
        </Box>
        <Box as="ul" className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
          {signals.map((s) => (
            <Box
              as="li"
              key={s.k}
              borderTop="1px dotted"
              borderColor="fieldBorder"
              className={css({
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: '3',
                py: '2',
                fontSize: 'base',
                _first: { borderTop: 'none' },
              })}
            >
              <span
                className={css({
                  color: 'fieldInkMuted',
                  textTransform: 'uppercase',
                  letterSpacing: 'wide',
                  fontSize: '2xs',
                })}
              >
                {s.k}
              </span>
              <span
                className={css({
                  fontVariantNumeric: 'tabular-nums',
                  color: 'fieldInk',
                  textAlign: 'right',
                })}
              >
                {s.v}
              </span>
            </Box>
          ))}
        </Box>
        <Box className={css({ mt: '4', fontSize: 'base', color: 'fieldInk' })}>
          <span
            className={css({
              display: 'block',
              color: 'fieldInkMuted',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              fontSize: '2xs',
              mb: '1',
            })}
          >
            On rotation
          </span>
          Tobin Sprout · My Morning Jacket
        </Box>
      </Box>
    </Box>
  )
}
