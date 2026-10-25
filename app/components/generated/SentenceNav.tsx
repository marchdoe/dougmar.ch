import { css, cx } from '../../../styled-system/css'
import { identity } from '../../content/about'

const link = css({
  color: 'accent',
  fontWeight: '500',
  display: 'inline-block',
  paddingBlock: '13px',
  marginBlock: '-13px',
  paddingInline: '6px',
  marginInline: '-6px',
  _hover: { color: 'accentAlt' },
})

export function SentenceNav({ className }: { className?: string }) {
  return (
    <nav
      aria-label="Primary"
      className={cx(
        css({
          fontFamily: 'body',
          fontSize: '15px',
          lineHeight: '1.6',
          color: 'textMuted',
          textTransform: 'lowercase',
        }),
        className
      )}
    >
      <p className={css({ maxWidth: '34ch' })}>
        There’s the{' '}
        <a href="/work" className={link}>
          work
        </a>
        , a little{' '}
        <a href="/about" className={link}>
          about
        </a>
        , and a way to make{' '}
        <a href={`mailto:${identity.email}`} className={link}>
          contact
        </a>
        .
      </p>
    </nav>
  )
}
