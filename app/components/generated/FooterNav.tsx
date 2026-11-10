import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const linkClass = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '52px',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'clamp(26px, 4vw, 40px)',
  lineHeight: '1.1',
  textTransform: 'lowercase',
  letterSpacing: '-0.01em',
  color: 'fieldInk',
  _hover: { color: 'fieldInk', textDecoration: 'underline' },
})

export function FooterNav() {
  return (
    <nav aria-label="Primary">
      <div
        className={css({
          fontSize: '2xs',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          fontWeight: 'bold',
          marginBottom: '10px',
        })}
      >
        Index
      </div>
      <ul
        className={css({
          listStyle: 'none',
          padding: '0',
          margin: '0',
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        <li>
          <a href="/work" className={linkClass}>
            work
          </a>
        </li>
        <li>
          <a href="/about" className={linkClass}>
            about
          </a>
        </li>
        <li>
          <a href={`mailto:${identity.email}`} className={linkClass}>
            contact
          </a>
        </li>
      </ul>
    </nav>
  )
}
