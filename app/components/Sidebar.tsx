import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { SignalLedger } from './generated/SignalLedger'
import { revealClass } from './generated/styles'

const navItems = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
]

const navLink = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  columnGap: '3',
  paddingBlock: '16px',
  paddingInline: '2px',
  minHeight: '56px',
  fontFamily: 'display',
  fontWeight: 'normal',
  textStyle: 'xl',
  letterSpacing: '-0.01em',
  color: 'fieldInk',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  _hover: { color: 'fieldInkMuted', textDecoration: 'none' },
})

const fieldMicro = css({
  fontFamily: 'body',
  fontSize: 'xs',
  fontWeight: 'bold',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  marginBottom: '3',
})

const tape = css({
  marginTop: '18px',
  maxWidth: '52ch',
  fontFamily: 'body',
  fontSize: 'sm',
  lineHeight: '1.6',
  letterSpacing: '0.02em',
  color: 'fieldInkMuted',
})

const strong = css({ color: 'fieldInk', fontWeight: 'bold' })

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingTop: { base: '6', lg: '72px' },
        paddingInline: { base: '20px', lg: '6vw' },
        paddingBottom: { base: '40px', lg: '56px' },
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1.1fr 0.9fr' },
          gap: { base: '40px', lg: '6vw' },
          alignItems: 'start',
        })}
      >
        <nav aria-label="Primary" className={revealClass}>
          <div className={fieldMicro}>Index</div>
          <div
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'fieldBorder',
            })}
          >
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className={navLink}>
                {item.label}
              </a>
            ))}
            <a href={`mailto:${identity.email}`} className={navLink}>
              <span>Contact</span>
              <span
                className={css({
                  fontFamily: 'body',
                  fontSize: 'sm',
                  fontWeight: 'bold',
                  letterSpacing: 'normal',
                  color: 'fieldInkMuted',
                })}
              >
                {identity.email}
              </span>
            </a>
          </div>
        </nav>
        <div className={revealClass}>
          <div className={fieldMicro}>Signals · 04 Oct 2026</div>
          <SignalLedger />
          <p className={tape}>
            On rotation: <b className={strong}>Radiohead</b> &amp;{' '}
            <b className={strong}>Tobin Sprout</b>. Taste, not an event.
          </p>
          <p className={tape}>
            <b className={strong}>{identity.name}</b>, {identity.role}. Working independent under
            Spaceman since 2018. Aldie, Virginia.
          </p>
          <p className={tape}>© 2026 {identity.name}.</p>
        </div>
      </div>
    </footer>
  )
}
