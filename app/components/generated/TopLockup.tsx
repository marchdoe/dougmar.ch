import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function TopLockup() {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        color: 'text',
        gridColumn: { lg: '2' },
        gridRow: { lg: '1' },
        alignSelf: { lg: 'start' },
      })}
    >
      <BrandLockup variant="horizontal-md" mode="original" />
    </div>
  )
}
