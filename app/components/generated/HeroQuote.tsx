import { css } from '../../../styled-system/css'
import { Box, Flex } from '../../../styled-system/jsx'

const lines: { text: string; indent: string; emphasis?: boolean }[] = [
  { text: 'There will be nothing', indent: '0%' },
  { text: 'learned from any', indent: '9%' },
  { text: 'challenge in which', indent: '22%' },
  { text: "we don't", indent: '36%' },
  { text: 'try our hardest.', indent: '50%', emphasis: true },
]

export function HeroQuote() {
  return (
    <Box
      as="header"
      className={css({
        bg: 'field',
        minHeight: { base: '100vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingInline: { base: '5', lg: '9' },
        paddingBlock: { base: '6', lg: '8' },
        position: 'relative',
      })}
    >
      <Flex
        justify="space-between"
        align="flex-start"
        gap="4"
        className={css({ position: 'relative', zIndex: 2 })}
      >
        <span
          className={css({
            textStyle: 'xs',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'accentAlt',
          })}
        >
          Today&rsquo;s creed
        </span>
        <span
          className={css({
            textStyle: 'xs',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'fieldInkMuted',
            textAlign: 'right',
            lineHeight: 'loose',
          })}
        >
          Saturday · 12 Sep 2026
          <br />
          Aldie, VA · overcast 67°F
        </span>
      </Flex>

      <Box
        className={css({
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: '5',
          marginTop: { base: '8', lg: '0' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: '500',
            textStyle: { base: '2xl', lg: 'hero' },
            letterSpacing: 'tight',
            color: 'fieldInk',
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          {lines.map((line) => (
            <span
              key={line.text}
              className={css({
                display: 'block',
                marginLeft: { base: '0', lg: line.indent },
                fontStyle: line.emphasis ? 'italic' : 'normal',
                fontWeight: line.emphasis ? '700' : 'inherit',
                color: line.emphasis ? 'accentAlt' : 'fieldInk',
              })}
            >
              {line.text}
            </span>
          ))}
        </h1>
        <p
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            textStyle: 'lg',
            color: 'fieldInkMuted',
          })}
        >
          — Josh Waitzkin
        </p>
      </Box>
    </Box>
  )
}
