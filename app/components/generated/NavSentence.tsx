import { css, cx } from '../../../styled-system/css'
import { identity } from '../../content/about'

// accentDark (#2E4F0A) in the mockup's hover maps to the `field` token, the same hex.
const link = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '44px',
  minWidth: '48px',
  paddingInline: '1',
  marginBlock: '-10px',
  fontWeight: 'bold',
  color: 'accent',
  fontVariantCaps: 'all-small-caps',
  letterSpacing: 'wide',
  textDecorationLine: 'underline',
  textDecorationColor: 'accentAlt',
  textUnderlineOffset: '3px',
  textDecorationThickness: '2px',
  _hover: { color: 'field', textDecorationColor: 'accent' },
})

export function NavSentence({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        css({
          bg: 'surface',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          borderRadius: 'sm',
          paddingBlock: '14px',
          paddingInline: '20px',
        }),
        className
      )}
    >
      <p
        className={css({
          fontSize: 'base',
          color: 'textMuted',
          lineHeight: '1.5',
          maxWidth: '46ch',
        })}
      >
        See the full{' '}
        <a href="/#work" className={link}>
          Work
        </a>{' '}
        index, a note on the practice in{' '}
        <a href="/about" className={link}>
          About
        </a>
        , or get in touch via{' '}
        <a href={`mailto:${identity.email}`} className={link}>
          Contact
        </a>
        .
      </p>
    </div>
  )
}
