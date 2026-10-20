import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const linkClass = css({
  fontFamily: 'display',
  fontSize: '15px',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  color: 'text',
  display: 'inline-block',
  minHeight: '44px',
  minWidth: '44px',
  lineHeight: '44px',
  paddingInline: '4px',
  textAlign: 'center',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textUnderlineOffset: '0.18em',
})

export function HeroRail() {
  return (
    <>
      <p
        className={css({
          fontFamily: 'body',
          fontSize: '16px',
          color: 'textMuted',
          bg: 'bg',
          width: 'fit-content',
          lineHeight: '2.5',
          maxWidth: '36ch',
          marginBottom: '26px',
        })}
      >
        {identity.name} is a designer who ships his own code. See the{' '}
        <a href="#work" className={linkClass}>
          work
        </a>
        , read the{' '}
        <a href="/about" className={linkClass}>
          about
        </a>
        , or{' '}
        <a href={`mailto:${identity.email}`} className={linkClass}>
          get in touch
        </a>
        .
      </p>
      <blockquote
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontSize: '14px',
          color: 'textMuted',
          bg: 'bg',
          width: 'fit-content',
          lineHeight: '1.5',
          maxWidth: '34ch',
          borderLeftWidth: '2px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'borderStrong',
          paddingLeft: '14px',
        })}
      >
        Faith means believing the unbelievable.
        <cite
          className={css({
            fontStyle: 'normal',
            display: 'block',
            marginTop: '6px',
            fontSize: '14px',
            color: 'textMuted',
            letterSpacing: '0.03em',
          })}
        >
          G.K. Chesterton
        </cite>
      </blockquote>
    </>
  )
}
