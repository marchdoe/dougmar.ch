import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { BrandLockup } from '../BrandLockup'

export function AboutHero() {
  return (
    <header
      className={css({
        position: 'relative',
        bg: 'bg',
        paddingTop: { base: '24px', md: '34px', lg: '44px' },
        paddingBottom: { base: '40px', md: '48px', lg: '56px' },
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
      })}
    >
      <div className={css({ color: 'text', width: 'max-content' })}>
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>
      <h1
        className={css({
          marginTop: { base: '6', lg: '7' },
          fontFamily: 'display',
          textStyle: '3xl',
          fontWeight: 'normal',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'accent',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.name}
      </h1>
      <div
        className={css({
          marginTop: '3',
          fontSize: 'xs',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textFaint',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {identity.role}
      </div>
      <p
        className={css({
          marginTop: '5',
          marginBottom: '0',
          fontSize: 'lede',
          lineHeight: 'normal',
          color: 'textMuted',
          maxWidth: '48ch',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '160ms',
        })}
      >
        {identity.statement}
      </p>
    </header>
  )
}
