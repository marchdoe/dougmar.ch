import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { DayIndex } from './generated/DayIndex'
import { MarginNav } from './generated/MarginNav'

export function Sidebar() {
  return (
    <aside
      data-margin=""
      aria-label="Doug March, the day index"
      className={css({
        bg: 'bg',
        color: 'text',
        gridColumn: { lg: '2' },
        gridRow: { lg: '1' },
        alignSelf: { lg: 'start' },
        borderLeftStyle: 'solid',
        borderLeftWidth: { base: '0', lg: '1px' },
        borderLeftColor: 'borderStrong',
        paddingTop: { base: '5', lg: '6' },
        paddingBottom: '6',
        paddingInline: { base: '4', lg: '5' },
      })}
    >
      <a
        href="/"
        data-margin-lockup=""
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: { base: 'flex-start', lg: 'center' },
          textAlign: { base: 'left', lg: 'center' },
          marginBottom: '5',
          color: 'text',
        })}
      >
        {/* Full-colour mark passes on bg in both schemes (light measured 3.1:1 on its blue). */}
        <BrandLockup variant="stacked-md" mode="original" roleLine />
      </a>
      <MarginNav />
      <DayIndex />
    </aside>
  )
}
