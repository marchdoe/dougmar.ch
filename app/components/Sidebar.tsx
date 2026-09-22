import { BrandLockup } from './BrandLockup'
import { css } from '../../styled-system/css'

const navLink = css({
  display: 'flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  paddingBlock: '2',
  paddingInline: '3',
  fontSize: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: { base: 'text', xl: 'fieldInk' },
  xl: { justifyContent: 'center' },
})

const navItem = css({
  borderTop: '1px solid',
  borderColor: { base: 'border', xl: 'fieldBorder' },
  xl: { width: '100%' },
})

export function Sidebar() {
  return (
    <header
      className={css({
        bg: { base: 'bg', xl: 'field' },
        color: { base: 'text', xl: 'fieldInk' },
        display: 'flex',
        flexDirection: 'column',
        gap: '3',
        paddingInline: '6vw',
        paddingBlock: '4',
        xl: {
          position: 'sticky',
          top: '0',
          alignSelf: 'start',
          height: '100vh',
          width: '88px',
          paddingInline: '3',
          paddingBlock: '6',
          justifyContent: 'flex-start',
          gap: '5',
        },
      })}
    >
      <div
        className={css({
          color: { base: 'text', xl: 'fieldInk' },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          xl: { alignItems: 'center', textAlign: 'center', width: '100%' },
        })}
      >
        <BrandLockup variant="stacked-md" mode="single-color" roleLine />
      </div>
      <nav>
        <ul
          className={css({
            listStyle: 'none',
            margin: 0,
            padding: 0,
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '5',
            rowGap: '0',
            borderTop: '1px solid',
            borderColor: { base: 'border', xl: 'fieldBorder' },
            marginTop: '2',
            xl: { flexDirection: 'column', width: '100%' },
          })}
        >
          <li className={navItem}>
            <a href="/" className={navLink}>
              Work
            </a>
          </li>
          <li className={navItem}>
            <a href="/about" className={navLink}>
              About
            </a>
          </li>
          <li className={navItem}>
            <a href="#contact" className={navLink}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
