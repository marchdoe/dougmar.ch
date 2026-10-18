import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section className={css({ paddingTop: { base: '40px', lg: '80px' }, paddingBottom: '64px' })}>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: '3xl',
          color: 'text',
        })}
      >
        No project by that name
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '20px',
          color: 'accent',
          _hover: { color: 'accentAlt' },
        })}
      >
        See all work
      </a>
    </section>
  )
}
