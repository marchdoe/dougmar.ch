import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function NavSentence({ onField }: { onField: boolean }) {
  const link = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '44px',
    minWidth: '44px',
    paddingInline: '2',
    lineHeight: '1',
    verticalAlign: 'baseline',
    color: onField ? 'fieldInk' : 'text',
    _hover: {
      color: onField ? 'fieldInk' : 'accent',
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
    },
  })
  return (
    <nav aria-label="Primary">
      <p
        className={css({
          fontSize: onField ? '18px' : 'base',
          lineHeight: 'loose',
          maxWidth: '46ch',
          marginInline: 'auto',
          textAlign: 'center',
          textTransform: 'lowercase',
          /* fieldInkMuted on field falls under 4.5:1 in the dark scheme; fieldInk clears it */
          color: onField ? 'fieldInk' : 'textMuted',
        })}
      >
        see{' '}
        <a href="/work" className={link}>
          the work
        </a>
        , read a little{' '}
        <a href="/about" className={link}>
          about him
        </a>
        , or{' '}
        <a href={`mailto:${identity.email}`} className={link}>
          get in touch
        </a>
        .
      </p>
    </nav>
  )
}
