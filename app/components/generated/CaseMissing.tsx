import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(48px, 10vh, 128px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
        display: 'grid',
        gap: '5',
      })}
    >
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
        href="/#work"
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          color: 'accentAlt',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
        })}
      >
        Back to the work index
      </a>
    </section>
  )
}
