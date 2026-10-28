import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { SignalIndex } from './generated/SignalIndex'

const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(48px, 6vw, 112px)',
        paddingInline: 'clamp(24px, 5vw, 80px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'auto 1fr', lg: '260px 1fr' },
        gap: 'clamp(36px, 5vw, 72px)',
        fontFamily: 'body',
      })}
    >
      <nav aria-label="Primary">
        <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
          {navLinks.map((link) => (
            <li
              key={link.label}
              className={css({
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderColor: 'fieldBorder',
                _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid' },
              })}
            >
              <a
                href={link.href}
                className={css({
                  display: 'block',
                  paddingBlock: '3',
                  minHeight: '44px',
                  textStyle: 'lg',
                  fontVariantCaps: 'all-small-caps',
                  letterSpacing: 'wider',
                  color: 'fieldInk',
                  transition: 'color .2s ease',
                  _hover: { color: 'accent' },
                })}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <SignalIndex />

      <div
        className={css({
          gridColumn: '1 / -1',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'borderStrong',
          paddingTop: '5',
        })}
      >
        <blockquote
          className={css({
            margin: '0',
            textStyle: 'xl',
            lineHeight: 'snug',
            fontStyle: 'italic',
            fontFamily: 'display',
            color: 'fieldInk',
            maxWidth: '24ch',
          })}
        >
          You are your best thing.
        </blockquote>
        <cite
          className={css({
            display: 'block',
            marginTop: '3',
            fontStyle: 'normal',
            fontSize: 'sm',
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wider',
            color: 'fieldInkMuted',
          })}
        >
          Toni Morrison
        </cite>
      </div>

      <div
        className={css({
          gridColumn: '1 / -1',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'fieldBorder',
          paddingTop: '4',
          fontSize: 'xs',
          color: 'fieldInkMuted',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          rowGap: '2',
          columnGap: '4',
        })}
      >
        <span>{identity.name}</span>
        <span>{identity.role}</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            minWidth: '44px',
            color: 'fieldInk',
            _hover: { color: 'accent' },
          })}
        >
          {identity.email}
        </a>
        <span>Aldie, Virginia</span>
        <span>49.9°F · fog · wind 2.2 mph east</span>
        <span>© 2026 {identity.name}</span>
      </div>
    </footer>
  )
}
