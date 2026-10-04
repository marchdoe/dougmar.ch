import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

export function AboutHero({ statement }: { statement: string }) {
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
      <h1
        className={css({
          marginLeft: 'auto',
          maxWidth: '46ch',
          fontFamily: 'body',
          fontWeight: 'normal',
          textStyle: 'lg',
          lineHeight: '1.45',
          textAlign: 'right',
          color: 'text',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {statement}
      </h1>
    </section>
  )
}
