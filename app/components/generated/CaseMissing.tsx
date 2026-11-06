import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        paddingBlock: '8',
        paddingInline: { base: '4', md: '6', lg: '7', xl: '8' },
        display: 'flex',
        flexDirection: 'column',
        gap: '4',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'light',
          textStyle: '3xl',
          color: 'text',
        })}
      >
        Out of orbit
      </h1>
      <a href="/#work" className={css({ textStyle: 'base', color: 'accent' })}>
        Back to the work
      </a>
    </section>
  )
}
