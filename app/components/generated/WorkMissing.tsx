import { css } from '../../../styled-system/css'

export function WorkMissing() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 80px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        bg: 'bg',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '3xl',
          color: 'text',
        })}
      >
        No project by that name.
      </h1>
      <a
        href="/#work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '16px',
          color: 'text',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
        })}
      >
        Back to the work
      </a>
    </section>
  )
}
