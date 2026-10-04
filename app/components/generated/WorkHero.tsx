import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function WorkHero({ title, deck }: { title: string; deck: string }) {
  return (
    <section
      className={css({
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        gap: { base: '40px', lg: '7' },
        paddingTop: { base: '4', lg: '6' },
        paddingInline: { base: '20px', lg: '6vw' },
        paddingBottom: { base: '6', lg: '7' },
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
      <div className={css({ textAlign: 'right', minWidth: '0' })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'light',
            fontSize: 'clamp(34px, 8vw, 128px)',
            lineHeight: '0.9',
            letterSpacing: '-0.01em',
            color: 'text',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {title}
        </h1>
        <p
          className={css({
            marginTop: '4',
            marginLeft: 'auto',
            maxWidth: '30ch',
            fontFamily: 'body',
            textStyle: 'lg',
            color: 'textMuted',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {deck}
        </p>
      </div>
    </section>
  )
}
