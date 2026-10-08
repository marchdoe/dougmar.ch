import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        paddingInline: 'clamp(24px, 6vw, 96px)',
        paddingBlock: 'clamp(48px, 7vw, 112px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: '3xl',
          letterSpacing: 'tight',
        })}
      >
        No project by that name
      </h1>
      <p className={css({ marginTop: '4', fontSize: 'base' })}>
        <a href="/work">See all the work</a> or read <a href="/about">about Doug</a>.
      </p>
    </section>
  )
}
