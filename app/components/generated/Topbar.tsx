import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function Topbar() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        gap: '5',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        minWidth: '0',
      })}
    >
      <a
        href="/"
        className={css({
          color: 'text',
          bg: 'bg',
          display: 'inline-flex',
          padding: '2',
          borderRadius: 'md',
        })}
      >
        <BrandLockup variant="stacked-lg" mode="original" />
      </a>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: 'base',
          lineHeight: 'snug',
          color: 'textMuted',
          bg: 'bg',
          paddingBlock: '2',
          paddingInline: '3',
          borderRadius: 'md',
          maxWidth: '34ch',
          textAlign: { base: 'left', md: 'right' },
        })}
      >
        Aldie, Virginia · Overcast · 50°F
        <span
          className={css({
            display: 'block',
            fontWeight: 'bold',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            fontSize: 'xs',
            color: 'textFaint',
            marginTop: '2',
          })}
        >
          01 Nov 2026
        </span>
      </div>
    </div>
  )
}
