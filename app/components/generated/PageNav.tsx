import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const link = css({
  fontFamily: 'body',
  textStyle: 'sm',
  color: 'text',
  minHeight: '44px',
  display: 'inline-flex',
  alignItems: 'center',
  _hover: { color: 'accent' },
})

export function PageNav() {
  return (
    <nav
      aria-label="Primary"
      className={css({ display: 'flex', flexWrap: 'wrap', columnGap: 'clamp(20px, 3vw, 44px)' })}
    >
      <a href="/" className={link}>
        Home
      </a>
      <a href="/work" className={link}>
        Work
      </a>
      <a href="/about" className={link}>
        About
      </a>
      <a href={`mailto:${identity.email}`} className={link}>
        Contact
      </a>
    </nav>
  )
}
