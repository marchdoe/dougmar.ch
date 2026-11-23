import { css, cx } from '../../../styled-system/css'
import { identity, personal } from '../../content/about'
import { label, reveal } from './styles'

const linkStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  paddingInline: '1',
  marginRight: '5',
  textStyle: 'base',
  fontWeight: 'normal',
  color: 'text',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})

const small = css({ textStyle: 'sm', color: 'textMuted', lineHeight: 'normal' })
const strong = css({ color: 'text', fontWeight: 'bold' })

export function SiteFooter() {
  return (
    <footer
      className={cx(
        css({
          paddingTop: 'clamp(48px, 7vw, 112px)',
          paddingBottom: 'clamp(40px, 5vw, 64px)',
          paddingInline: 'clamp(24px, 5vw, 72px)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        }),
        reveal
      )}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: '2fr 1fr 1fr' },
          gap: 'clamp(24px, 3vw, 40px)',
          marginBottom: 'clamp(32px, 4vw, 56px)',
        })}
      >
        <div>
          <span className={label}>The standing claim</span>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'xl',
              color: 'text',
              letterSpacing: 'tight',
            })}
          >
            Ten years independent. Still the vehicle for the next experiment.
          </div>
        </div>
        <div>
          <span className={label}>The vehicle</span>
          <div className={small}>
            <b className={strong}>Spaceman LLC</b>, a solo contributor on some projects and embedded
            in a larger team on others.
          </div>
        </div>
        <div>
          <span className={label}>Off the desk</span>
          <div className={small}>
            <b className={strong}>{personal.sport}</b>: {personal.holesInOne} holes in one.
            <br />
            <b className={strong}>{personal.teams.join(', ')}</b>
            <br />
            {personal.currentFocus}
          </div>
        </div>
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          rowGap: '1',
          columnGap: '6',
          paddingTop: 'clamp(24px, 3vw, 36px)',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
        })}
      >
        <div>
          <a href="/#work" className={linkStyle}>
            Work
          </a>
          <a href="/about" className={linkStyle}>
            About
          </a>
          <a href={`mailto:${identity.email}`} className={linkStyle}>
            Contact
          </a>
        </div>
        <div className={css({ textStyle: 'xs', color: 'textFaint' })}>
          © 2026 {identity.name}, {identity.role}
        </div>
      </div>
    </footer>
  )
}
