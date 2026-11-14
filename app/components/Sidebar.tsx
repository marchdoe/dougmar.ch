import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const links = [
  { label: 'work', href: '/work' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'bg',
        color: 'text',
        paddingTop: 'clamp(40px, 6vw, 72px)',
        paddingBottom: 'clamp(32px, 4vw, 48px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1.3fr 1fr' },
        gap: { base: '40px', md: '56px' },
      })}
    >
      <div
        className={css({ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '46ch' })}
      >
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'lg',
            letterSpacing: '-0.01em',
            color: 'text',
          })}
        >
          {identity.name}
        </span>
        <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{identity.role}</span>
        <p className={css({ textStyle: 'sm', color: 'textMuted', maxWidth: '46ch' })}>
          A bright cold Saturday in Aldie. The sun is out and does nothing to warm you.
        </p>
        <p className={css({ textStyle: 'sm', color: 'textMuted', letterSpacing: '0.02em' })}>
          in rotation · The War on Drugs · My Morning Jacket
        </p>
      </div>

      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexDirection: 'column',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          maxWidth: '440px',
        })}
      >
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            className={css({
              display: 'flex',
              alignItems: 'center',
              minHeight: '48px',
              paddingBlock: '10px',
              paddingInline: '2px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              textStyle: 'sm',
              fontWeight: 'normal',
              color: 'text',
              textTransform: 'lowercase',
              _hover: {
                color: 'accentAlt',
                textDecoration: 'underline',
                textDecorationColor: 'accentAlt',
              },
            })}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div
        className={css({
          gridColumn: '1 / -1',
          paddingTop: '20px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          textStyle: 'xs',
          color: 'textMuted',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        })}
      >
        <span>dougmar.ch</span>
        <span>Nov 14, 2026 · Aldie, VA</span>
      </div>
    </footer>
  )
}
