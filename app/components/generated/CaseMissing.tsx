import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function CaseMissing() {
  return (
    <header
      className={css({
        bg: 'bg',
        paddingTop: { base: '24px', md: '34px', lg: '44px' },
        paddingBottom: '56px',
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
      })}
    >
      <div className={css({ color: 'text', width: 'max-content' })}>
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>
      <h1
        className={css({
          marginTop: '7',
          fontFamily: 'display',
          textStyle: '3xl',
          fontWeight: 'normal',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'text',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Not in the record.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '4',
          fontSize: 'sm',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'accent',
        })}
      >
        Back to the work →
      </a>
    </header>
  )
}
