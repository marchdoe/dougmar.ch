import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const links = [
  { label: 'work', href: '/work' },
  { label: 'about', href: '/about' },
]

const item = css({
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderColor: 'border',
  '&:last-child': { borderBottomWidth: '1px', borderBottomStyle: 'solid' },
})

const link = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '48px',
  fontFamily: 'body',
  fontSize: 'base',
  color: 'text',
  textTransform: 'lowercase',
  letterSpacing: 'normal',
  '&:hover': { color: 'accent', textDecoration: 'underline', textUnderlineOffset: '4px' },
})

export function MarginNav() {
  return (
    <nav aria-label="Primary">
      <ul className={css({ listStyle: 'none', margin: '0', padding: '0', marginBottom: '5' })}>
        {links.map((l) => (
          <li key={l.href} className={item}>
            <a href={l.href} className={link}>
              {l.label}
            </a>
          </li>
        ))}
        <li className={item}>
          <a href={`mailto:${identity.email}`} className={link}>
            contact
          </a>
        </li>
      </ul>
    </nav>
  )
}
