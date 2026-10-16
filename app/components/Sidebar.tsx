import { css } from '../../styled-system/css'
import { CornerHeader } from './generated/CornerHeader'

export function Sidebar() {
  return (
    <div
      data-shell-header=""
      className={css({
        bg: 'bg',
        paddingTop: { base: '40px', md: '56px', xl: '72px' },
        paddingInline: { base: '4', md: '6vw', xl: '4vw' },
      })}
    >
      <CornerHeader />
    </div>
  )
}
