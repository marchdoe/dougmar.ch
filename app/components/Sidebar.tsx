import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'

export function Sidebar() {
  return (
    <div
      className={css({
        position: 'absolute',
        top: { base: '6', lg: '8' },
        left: { base: '6vw', lg: '5vw' },
        zIndex: 5,
        color: 'fieldInk',
      })}
    >
      <BrandLockup variant="horizontal-md" mode="single-color" roleLine={false} />
    </div>
  )
}
