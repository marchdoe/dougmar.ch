import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function HeroTopbar() {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '20px',
        flexWrap: 'wrap',
      })}
    >
      <BrandLockup variant="stacked-lg" mode="original" />
      <div
        className={css({
          textAlign: 'right',
          fontSize: '2xs',
          lineHeight: '1.55',
          color: 'textMuted',
          letterSpacing: '0.02em',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        Aldie, VA
        <br />
        <span className={css({ color: 'text', fontWeight: 'bold' })}>sunny · 44°F</span>
        <br />
        <span className={css({ color: 'accentAlt', fontWeight: 'bold' })}>new moon · 2% lit</span>
      </div>
    </div>
  )
}
