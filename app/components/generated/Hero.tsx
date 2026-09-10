import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function Hero() {
  return (
    <Box className={css({ marginTop: { base: '2', lg: '0px' }, maxWidth: '100%', minWidth: 0 })}>
      <h1
        className={css({
          fontFamily: 'display',
          color: 'text',
          textStyle: { base: 'xl', lg: '4xl' },
          lineHeight: 'tight',
          letterSpacing: 'tight',
          margin: 0,
          maxWidth: '100%',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
        })}
      >
        <span className={css({ display: 'block' })}>The future</span>
        <span className={css({ display: 'block' })}>is the worst thing</span>
        <span className={css({ display: 'block' })}>about the present.</span>
      </h1>
      <p
        className={css({
          marginTop: { base: '4', lg: '7' },
          fontFamily: 'body',
          fontWeight: '600',
          textStyle: 'sm',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'textMuted',
        })}
      >
        — Gustave Flaubert
      </p>
      <p
        className={css({
          marginTop: { base: '8', lg: '9' },
          maxWidth: '30ch',
          fontFamily: 'body',
          textStyle: { base: 'base', lg: 'xl' },
          lineHeight: 'snug',
          color: 'text',
        })}
      >
        A portfolio that demolishes and rebuilds itself every night — today&apos;s version, already
        dreading tomorrow&apos;s.
      </p>
    </Box>
  )
}
