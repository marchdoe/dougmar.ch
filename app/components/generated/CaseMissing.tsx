import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function CaseMissing() {
  return (
    <header
      className={css({
        bg: 'bg',
        paddingTop: 'clamp(34px, 6vw, 76px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 6vw, 96px)',
      })}
    >
      <BrandLockup variant="stacked-lg" mode="original" />
      <h1
        className={css({
          marginTop: 'clamp(28px, 5vw, 60px)',
          fontFamily: 'display',
          fontWeight: 'normal',
          color: 'text',
          fontSize: 'clamp(26px, 3.4vw, 42px)',
          lineHeight: '1.12',
          maxWidth: '22ch',
          marginBottom: '20px',
        })}
      >
        No project lives at this address.
      </h1>
      <a
        href="/#work"
        className={css({
          fontFamily: 'display',
          fontSize: '15px',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'text',
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          textDecoration: 'underline',
          textDecorationColor: 'accent',
          textUnderlineOffset: '0.18em',
        })}
      >
        Back to the work
      </a>
    </header>
  )
}
