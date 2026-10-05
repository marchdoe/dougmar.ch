import { css, cx } from '../../../styled-system/css'
import { identity } from '../../content/about'

const link = css({
  color: 'textMuted',
  display: 'inline-block',
  minHeight: '44px',
  minWidth: '44px',
  textAlign: 'center',
  paddingBlock: '6px',
  paddingInline: '2px',
  lineHeight: '1.9',
  _hover: { color: 'accentAlt', textDecoration: 'underline', textDecorationColor: 'accent' },
})

export function RunningSentence({ className }: { className?: string }) {
  return (
    <p
      className={cx(
        css({
          margin: '0',
          width: 'fit-content',
          bg: 'bg',
          fontSize: 'md',
          color: 'textMuted',
          lineHeight: '1.6',
          fontVariant: 'all-small-caps',
          letterSpacing: 'wide',
          maxWidth: '46ch',
        }),
        className
      )}
    >
      The rest is simple: see the{' '}
      <a href="/work" className={link}>
        Work
      </a>
      , read{' '}
      <a href="/about" className={link}>
        About
      </a>{' '}
      the maker, or start a{' '}
      <a href={`mailto:${identity.email}`} className={link}>
        Contact
      </a>
      .
    </p>
  )
}
