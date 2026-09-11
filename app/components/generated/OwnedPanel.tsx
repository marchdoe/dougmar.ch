import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function OwnedPanel() {
  return (
    <Box
      as="section"
      aria-label="The one thing that isn't free"
      bg="field"
      color="fieldInk"
      className={css({
        order: { base: 1, lg: 2 },
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '9', lg: '9' },
        minHeight: { base: '42vh' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '6',
        borderBottom: '2px solid',
        borderColor: 'fieldBorder',
      })}
    >
      <Box
        className={css({
          fontFamily: 'display',
          textStyle: 'sm',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          display: 'flex',
          gap: '3',
          flexWrap: 'wrap',
        })}
      >
        <span>the turn</span>
        <span className={css({ opacity: 0.55, textTransform: 'none', letterSpacing: 'normal' })}>
          — everything above was almost free
        </span>
      </Box>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'hero',
          letterSpacing: 'tight',
          color: 'fieldInk',
        })}
      >
        Not free to{' '}
        <span
          className={css({
            bg: 'accent',
            color: 'accentText',
            paddingInline: '1',
            display: 'inline-block',
          })}
        >
          own
        </span>
        .
      </h1>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'md',
          color: 'fieldInkMuted',
          maxWidth: '52ch',
        })}
      >
        AI made code, tests, policy and documentation almost free to produce. It has{' '}
        <span className={css({ color: 'fieldInk' })}>not</span> made any of them free to own. This
        portfolio rebuilds itself every night — and this is the line it's willing to be judged
        against.
      </p>
    </Box>
  )
}
