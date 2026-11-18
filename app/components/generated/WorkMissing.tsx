import { css } from '../../../styled-system/css'

export function WorkMissing() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 96px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          textStyle: '3xl',
        })}
      >
        No project by that name.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '5',
          textStyle: 'sm',
          fontWeight: 'semibold',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'field',
        })}
      >
        See all work
      </a>
    </section>
  )
}
