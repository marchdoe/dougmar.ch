import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'

export function Sidebar() {
  return (
    <header
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '3',
        marginBottom: { base: '24px', md: '30px' },
        color: 'text',
      })}
    >
      <a href="/" className={css({ color: 'text', _hover: { color: 'text' } })}>
        <BrandLockup variant="stacked-lg" mode="original" />
      </a>
    </header>
  )
}
