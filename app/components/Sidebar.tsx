import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: `mailto:${identity.email}` },
]

const footLines = [
  `${identity.name}, ${identity.role}`,
  'Aldie, VA · Nov 5, 2026',
  'In rotation: The War on Drugs · Radiohead',
]

function NavIndex() {
  return (
    <nav aria-label="Primary">
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {navLinks.map((link) => (
          <li
            key={link.label}
            className={css({
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
              '&:first-child': {
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'fieldBorder',
              },
            })}
          >
            <a
              href={link.href}
              className={css({
                display: 'flex',
                alignItems: 'center',
                minHeight: '52px',
                fontFamily: 'display',
                fontSize: 'clamp(28px,4vw,40px)',
                textTransform: 'uppercase',
                letterSpacing: '0.02em',
                color: 'text',
                transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                _hover: { color: 'accent', transform: 'translateX(10px)' },
              })}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function FootLines() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        textStyle: '2xs',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'textFaint',
      })}
    >
      {footLines.map((line) => (
        <span key={line}>{line}</span>
      ))}
    </div>
  )
}

function RandLine() {
  return (
    <figure
      className={css({
        marginTop: 'clamp(48px,6vh,96px)',
        marginBottom: '0',
        marginInline: '0',
        paddingTop: '24px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
      })}
    >
      <blockquote
        className={css({
          margin: '0',
          fontStyle: 'italic',
          fontSize: '15px',
          lineHeight: '1.6',
          color: 'textMuted',
          maxWidth: '56ch',
        })}
      >
        “An inventor is a man who asks Why? of the universe and lets nothing stand between the
        answer and his mind.”
      </blockquote>
      <figcaption
        className={css({
          marginTop: '10px',
          textStyle: '2xs',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        Ayn Rand, source for today's creed
      </figcaption>
    </figure>
  )
}

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        paddingInline: 'clamp(28px,6vw,112px)',
        paddingTop: 'clamp(48px,6vh,96px)',
        paddingBottom: 'clamp(36px,5vh,56px)',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: '1fr 1.4fr' },
          gap: { base: 'clamp(48px,6vh,96px)', md: 'clamp(28px,6vw,112px)' },
          alignItems: { md: 'start' },
        })}
      >
        <NavIndex />
        <FootLines />
      </div>
      <RandLine />
    </footer>
  )
}
