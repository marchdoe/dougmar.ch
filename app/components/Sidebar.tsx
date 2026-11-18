import { css } from '../../styled-system/css'
import { identity } from '../content/about'

// textSoft (#46391F) and small-text inks on the amber field map to fieldInk for contrast.
const linkClass = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '48px',
  fontVariant: 'small-caps',
  letterSpacing: 'wide',
  textStyle: 'md',
  fontWeight: 'medium',
  color: 'fieldInk',
  _hover: { color: 'fieldInkMuted' },
})

const itemClass = css({
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'fieldBorder',
  _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid', borderBottomColor: 'fieldBorder' },
})

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: 'clamp(48px, 7vw, 96px)',
        paddingBottom: 'clamp(36px, 5vw, 60px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1.2fr 1fr 1fr' },
        alignItems: { lg: 'start' },
        gap: { base: 'clamp(32px, 4vw, 48px)', lg: 'clamp(40px, 5vw, 80px)' },
      })}
    >
      <div>
        <p
          className={css({
            margin: '0',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: 'clamp(22px, 3vw, 34px)',
            lineHeight: 'snug',
            maxWidth: '18ch',
          })}
        >
          Dark by five. Sun down 16:48, over Aldie, Virginia.
        </p>
        <p
          className={css({
            marginTop: '5',
            marginBottom: '0',
            textStyle: 'sm',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            fontWeight: 'semibold',
            color: 'fieldInk',
          })}
        >
          On rotation: Wet Leg, Radiohead.
        </p>
      </div>
      <div
        className={css({
          textStyle: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontWeight: 'semibold',
          color: 'fieldInk',
        })}
      >
        <span
          className={css({
            display: 'block',
            textStyle: 'md',
            letterSpacing: 'wide',
            marginBottom: '1',
          })}
        >
          {identity.name}
        </span>
        <span className={css({ display: 'block' })}>{identity.role}</span>
      </div>
      <div>
        <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
          <li className={itemClass}>
            <a href="/work" className={linkClass}>
              Work
            </a>
          </li>
          <li className={itemClass}>
            <a href="/about" className={linkClass}>
              About
            </a>
          </li>
          <li className={itemClass}>
            <a href={`mailto:${identity.email}`} className={linkClass}>
              Contact
            </a>
          </li>
        </ul>
      </div>
    </footer>
  )
}
