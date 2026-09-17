import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type Personal = { holesInOne: number; sport: string; teams: string[]; currentFocus: string }

export function PersonalStrip({ personal }: { personal: Personal }) {
  return (
    <Box
      as="section"
      bg="bgAlt"
      className={css({
        paddingInline: '7vw',
        paddingBlock: { base: '32px 56px', md: '40px 72px' },
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
        Off the clock
      </span>
      <Box className={css({ display: 'flex', flexWrap: 'wrap', gap: '6', alignItems: 'baseline' })}>
        <Box className={css({ display: 'flex', alignItems: 'baseline', gap: '3' })}>
          <span
            className={css({
              fontFamily: 'display',
              fontSize: '4xl',
              color: 'accent',
              lineHeight: 'tight',
            })}
          >
            {personal.holesInOne}
          </span>
          <span className={css({ fontSize: 'sm', color: 'textMuted', maxWidth: '14ch' })}>
            holes in one, playing {personal.sport}
          </span>
        </Box>
        <Box className={css({ fontSize: 'sm', color: 'textMuted' })}>
          Teams, {personal.teams.join(', ')}
        </Box>
        <Box className={css({ fontSize: 'sm', color: 'textMuted', maxWidth: '40ch' })}>
          Current focus, {personal.currentFocus}
        </Box>
      </Box>
    </Box>
  )
}
