import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function HeroNav() {
  const links = [
    { num: '01', label: 'Work', href: '/#work' },
    { num: '02', label: 'About', href: '/about' },
    { num: '03', label: 'Contact', href: `mailto:${identity.email}` },
  ]
  return (
    <nav
      aria-label="Primary"
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: '2',
        columnGap: '5',
        alignItems: 'baseline',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingTop: '3',
      })}
    >
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className={css({
            display: 'inline-flex',
            alignItems: 'baseline',
            gap: '2',
            color: 'text',
            fontFamily: 'body',
            fontSize: 'sm',
            fontWeight: 'normal',
            letterSpacing: 'normal',
            paddingBlock: '12px',
            paddingInline: '2px',
            minHeight: '44px',
            minWidth: '48px',
            _hover: { color: 'accentAlt' },
          })}
        >
          <span className={css({ fontFamily: 'display', fontSize: 'md', color: 'accentAlt' })}>
            {l.num}
          </span>
          <span>{l.label}</span>
        </a>
      ))}
    </nav>
  )
}
