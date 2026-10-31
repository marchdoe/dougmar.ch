import { css } from '../../styled-system/css'
import { identity } from '../content/about'

// 44x44 thumb target on every footer link: min box plus a little inline padding
const footLinkClass = css({
  fontSize: 'sm',
  fontWeight: 'semibold',
  color: 'accent',
  minHeight: '44px',
  minWidth: '48px',
  paddingInline: '1',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export function Sidebar() {
  const nameRole = [identity.name, identity.role].filter(Boolean).join(' · ')
  return (
    <footer
      id="contact"
      className={css({
        bg: 'bg',
        paddingInline: { base: '5', md: '7', xl: '8' },
        paddingTop: { base: '6', lg: '7' },
        paddingBottom: { base: '6', lg: '7' },
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        display: 'flex',
        flexDirection: 'column',
        gap: '5',
      })}
    >
      <blockquote
        className={css({
          margin: '0',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontStyle: 'italic',
          textStyle: 'lg',
          lineHeight: '1.4',
          color: 'textMuted',
          maxWidth: '46ch',
        })}
      >
        Shoot for the moon. Even if you miss, you’ll land among the stars.
        <cite
          className={css({
            display: 'block',
            marginTop: '2',
            fontFamily: 'body',
            fontStyle: 'normal',
            fontSize: 'sm',
            fontWeight: 'semibold',
            color: 'textFaint',
          })}
        >
          Les Brown
        </cite>
      </blockquote>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          rowGap: '3',
          columnGap: '5',
          paddingTop: '4',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          fontSize: 'xs',
          color: 'textFaint',
          letterSpacing: 'wide',
        })}
      >
        <span>{nameRole}</span>
        <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '4', rowGap: '1' })}>
          <a href="/about" className={footLinkClass}>
            about
          </a>
          <a href="/work" className={footLinkClass}>
            work
          </a>
          <a href={`mailto:${identity.email}`} className={footLinkClass}>
            {identity.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
