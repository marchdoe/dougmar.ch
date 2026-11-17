import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { IndexNav } from './IndexNav'

export function ThesisTop() {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        columnGap: '16px',
        rowGap: '4px',
        marginInline: { base: '-16px', sm: '0' },
      })}
    >
      <a
        href="/"
        aria-label="Doug March, home"
        className={css({
          display: 'inline-flex',
          flex: '1 1 auto',
          minWidth: '0',
          color: 'fieldInk',
          _hover: { textDecoration: 'none' },
        })}
      >
        <BrandLockup variant="horizontal-md" mode="original" roleLine />
      </a>
      <div className={css({ marginLeft: 'auto', flex: 'none' })}>
        <IndexNav />
      </div>
    </div>
  )
}
