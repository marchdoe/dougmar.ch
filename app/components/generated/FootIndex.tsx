import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

export function FootIndex() {
  const rows = [
    { href: '/work', label: 'Work', note: 'the full index →' },
    { href: '/about', label: 'About', note: 'design and engineering, both →' },
    { href: `mailto:${identity.email}`, label: 'Contact', note: 'start a conversation →' },
  ]
  return (
    <div
      className={css({
        bg: 'bgAlt',
        borderBottomWidth: '3px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      {rows.map((row) => (
        <a
          key={row.label}
          href={row.href}
          className={css({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '4',
            minHeight: '44px',
            paddingBlock: '18px',
            paddingInline: 'clamp(20px, 6vw, 96px)',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'accent',
            _first: { borderTopWidth: '0' },
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            textStyle: { base: 'lg', md: '2xl' },
            fontSize: { base: '22px', md: '2xl' },
            letterSpacing: 'wide',
            color: 'text',
            transition: 'color 0.18s ease, background-color 0.18s ease',
            _hover: { color: 'accent', bg: 'surface' },
            '&:hover [data-part=ar]': { color: 'accent' },
          })}
        >
          {row.label}
          <span
            data-part="ar"
            className={css({
              fontFamily: 'body',
              fontWeight: 'normal',
              fontVariant: 'normal',
              textStyle: 'sm',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
              textAlign: 'right',
            })}
          >
            {row.note}
          </span>
        </a>
      ))}
    </div>
  )
}
