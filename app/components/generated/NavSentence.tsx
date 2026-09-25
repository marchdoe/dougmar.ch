import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const linkClass = css({
  color: 'text',
  display: 'inline-block',
  lineHeight: '1',
  paddingBlock: '3',
  paddingInline: '1',
  borderBottom: '1px solid',
  borderColor: 'fieldBorder',
  _hover: { color: 'accent', borderColor: 'accent' },
})

export function NavSentence() {
  return (
    <nav
      aria-label="Primary"
      className={css({
        fontFamily: 'body',
        textStyle: 'sm',
        fontWeight: 'normal',
        fontVariant: 'small-caps',
        letterSpacing: 'wide',
        color: 'textMuted',
        textAlign: 'center',
        maxWidth: '100%',
      })}
    >
      There’s the{' '}
      <a href="/work" className={linkClass}>
        work
      </a>
      , a little{' '}
      <a href="/about" className={linkClass}>
        about
      </a>
      , or a way to{' '}
      <a href={`mailto:${identity.email}`} className={linkClass}>
        contact
      </a>
      .
    </nav>
  )
}
