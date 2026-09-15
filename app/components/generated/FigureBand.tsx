import { css } from '../../../styled-system/css'
import { Box, Flex } from '../../../styled-system/jsx'

// The mockup's marigold win-marker has no token equivalent in the frozen
// 15-name set; substituted with `accent`, the nearest saturated semantic.
const scores = [
  { team: 'Detroit Lions', won: 31, lost: 30, margin: 'Won by 1' },
  { team: 'Detroit Tigers', won: 6, lost: 5, margin: 'Won by 1' },
]

const revealCss = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

export function FigureBand() {
  return (
    <Box
      as="footer"
      bg="field"
      color="fieldInk"
      borderTop="2px solid"
      borderColor="fieldBorder"
      className={css({
        padding: { base: '40px 6vw 44px', lg: '52px 4vw 56px', xl: '60px 72px 64px' },
      })}
    >
      <Box className={revealCss}>
        <Flex
          wrap="wrap"
          gap="3"
          className={css({
            color: 'fieldInkMuted',
            mb: '6',
            fontSize: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          <span>The weekend, both wins</span>
          <span>Combined margin, two</span>
        </Flex>
        <Box
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
            gap: '6',
          })}
        >
          {scores.map((s) => (
            <Box
              key={s.team}
              borderTop="1px solid"
              borderColor="fieldBorder"
              className={css({ pt: '4' })}
            >
              <Box
                className={css({
                  fontSize: '2xs',
                  textTransform: 'uppercase',
                  letterSpacing: 'wide',
                  color: 'fieldInkMuted',
                  mb: '2',
                })}
              >
                {s.team}
              </Box>
              <Flex align="baseline" gap="4" wrap="wrap">
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    textStyle: '5xl',
                    color: 'accent',
                  })}
                >
                  {s.won}
                </span>
                <span
                  className={css({
                    fontFamily: 'display',
                    textStyle: '4xl',
                    color: 'fieldInkMuted',
                  })}
                >
                  &ndash;
                </span>
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    textStyle: '5xl',
                    color: 'fieldInk',
                  })}
                >
                  {s.lost}
                </span>
                <span
                  className={css({
                    marginLeft: 'auto',
                    fontSize: 'sm',
                    textTransform: 'uppercase',
                    letterSpacing: 'wide',
                    color: 'accent',
                    fontWeight: 'bold',
                  })}
                >
                  {s.margin}
                </span>
              </Flex>
            </Box>
          ))}
        </Box>
        <Box
          borderTop="1px solid"
          borderColor="fieldBorder"
          className={css({ mt: '7', pt: '4', display: 'flex', flexDirection: 'column', gap: '2' })}
        >
          <span
            className={css({
              fontStyle: 'italic',
              fontSize: 'sm',
              color: 'fieldInkMuted',
              maxWidth: '60ch',
            })}
          >
            &ldquo;The biggest adventure you can take is to live the life of your dreams.&rdquo;
            &middot; Oprah Winfrey
          </span>
          <span
            className={css({
              fontSize: '2xs',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              color: 'fieldInkMuted',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            Doug March &middot; Design and engineering &middot; dougmar.ch &middot; 2026-09-15
          </span>
        </Box>
      </Box>
    </Box>
  )
}
