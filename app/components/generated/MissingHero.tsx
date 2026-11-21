import { css } from '../../../styled-system/css'
import { TopLockup } from './TopLockup'

export function MissingHero() {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        color: 'text',
        display: 'flex',
        flexDirection: 'column',
        rowGap: '28px',
        paddingTop: { base: '28px', lg: '40px' },
        paddingInline: '6vw',
        paddingBottom: { base: '40px', lg: '56px' },
      })}
    >
      <TopLockup />
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: '4xl',
          color: 'text',
        })}
      >
        No project by that name
      </h1>
      <a
        href="/work"
        className={css({
          textStyle: 'sm',
          fontWeight: 'bold',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
        })}
      >
        ← All work
      </a>
    </section>
  )
}
