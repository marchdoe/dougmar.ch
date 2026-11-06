import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function Colophon() {
  return (
    <footer
      id="contact"
      className={css({
        bg: 'bgAlt',
        paddingTop: '6',
        paddingBottom: '7',
        paddingInline: { base: '4', md: '6', lg: '7', xl: '8' },
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'borderStrong',
        display: 'flex',
        flexDirection: 'column',
        gap: '3',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: 'sm',
          letterSpacing: 'normal',
          color: 'textMuted',
        })}
      >
        Spaceman · {identity.name} · {identity.role} · est. 2018
      </span>
      <a
        href={`mailto:${identity.email}`}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          minWidth: '44px',
          paddingBlock: '2',
          textStyle: 'sm',
          color: 'accent',
          alignSelf: 'flex-start',
        })}
      >
        {identity.email}
      </a>
      <p
        className={css({
          margin: '0',
          textStyle: 'sm',
          lineHeight: 'normal',
          color: 'textFaint',
          maxWidth: '50ch',
        })}
      >
        “During times of adversity our true character will show.”{' '}
        <cite className={css({ color: 'textMuted', fontStyle: 'normal' })}>(Unknown)</cite>
      </p>
    </footer>
  )
}
