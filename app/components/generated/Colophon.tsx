import { css } from '../../../styled-system/css'
import { Box, Grid } from '../../../styled-system/jsx'

const signals = [
  { label: 'Detroit Tigers', value: '1–5' },
  { label: 'Market, SPY', value: '−0.44%' },
  { label: 'Moon', value: 'First quarter, 38% lit' },
  { label: 'Aldie, VA', value: 'Clear, 64°F' },
  { label: 'Golf', value: 'Biltmore Championship' },
  { label: 'Rotation', value: 'Tobin Sprout, Radiohead' },
]

export function Colophon() {
  return (
    <Box
      as="footer"
      aria-label="Colophon"
      bg="bgAlt"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '40px 56px', md: '56px 72px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <Box borderTop="1px solid" borderColor="borderStrong" marginBottom="7" />
      <Box
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '6',
          marginBottom: '7',
        })}
      >
        <span
          className={css({
            fontSize: 'xs',
            fontWeight: '600',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          Colophon, Wednesday, September 17, 2026, Aldie, Virginia
        </span>
        <Box className={css({ display: 'flex', alignItems: 'baseline', gap: '3' })}>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              fontSize: { base: '4xl', md: '5xl' },
              lineHeight: 'tight',
              color: 'accent',
              letterSpacing: 'tight',
            })}
          >
            96 pt
          </span>
          <span
            className={css({
              fontSize: 'xs',
              fontWeight: '600',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
              maxWidth: '12ch',
            })}
          >
            Statement set size at 1440
          </span>
        </Box>
      </Box>
      <Grid
        className={css({
          gridTemplateColumns: { base: '1fr', md: '1fr 1fr', xl: '1fr 1fr 1fr' },
          columnGap: { md: '8' },
        })}
      >
        {signals.map((s) => (
          <Box
            key={s.label}
            className={css({
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: '4',
              paddingBlock: '3',
              borderTop: '1px solid',
              borderColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: 'sm',
                fontWeight: '600',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textMuted',
              })}
            >
              {s.label}
            </span>
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                fontSize: 'md',
                color: 'text',
                textAlign: 'right',
              })}
            >
              {s.value}
            </span>
          </Box>
        ))}
      </Grid>
      <Box
        as="p"
        fontFamily="display"
        fontStyle="italic"
        className={css({
          marginTop: '7',
          fontSize: 'base',
          lineHeight: 'loose',
          color: 'textFaint',
          maxWidth: '60ch',
        })}
      >
        “Design is the part you can still see once it works.”{' '}
        <span className={css({ fontStyle: 'normal', color: 'textMuted' })}>Morrison</span>
      </Box>
    </Box>
  )
}
