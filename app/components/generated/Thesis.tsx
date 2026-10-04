import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function Thesis() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        minWidth: '0',
        gap: { base: '40px', lg: 'clamp(40px, 6vh, 72px)' },
      })}
    >
      <div
        className={css({
          color: 'text',
          alignSelf: 'flex-start',
          marginLeft: { base: '-12px', sm: '0' },
        })}
      >
        <BrandLockup variant="stacked-lg" mode="single-color" />
      </div>
      <h1
        className={css({
          textAlign: 'right',
          alignSelf: 'stretch',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'light',
            textStyle: '5xl',
            fontSize: { lg: 'clamp(88px, 14vw, 160px)' },
            lineHeight: '0.86',
            letterSpacing: '-0.01em',
            color: 'text',
          })}
        >
          Mind
        </span>
        <span
          className={css({
            display: 'block',
            marginTop: '22px',
            marginLeft: 'auto',
            maxWidth: '22ch',
            fontFamily: 'body',
            fontWeight: 'normal',
            textStyle: { base: 'lede', lg: 'xl' },
            lineHeight: '1.3',
            letterSpacing: '-0.01em',
            color: 'textMuted',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          Make your mind your own business.
          <span
            className={css({
              display: 'block',
              marginTop: '14px',
              fontSize: 'base',
              fontWeight: 'normal',
              letterSpacing: 'normal',
              color: 'text',
            })}
          >
            Jack Butcher
          </span>
        </span>
      </h1>
    </div>
  )
}
