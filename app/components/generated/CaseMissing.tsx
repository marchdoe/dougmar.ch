import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({ bg: 'bg', paddingBlock: '8', paddingInline: '6vw', textAlign: 'center' })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontSize: '3xl',
          lineHeight: 'snug',
          fontWeight: 'normal',
          textTransform: 'lowercase',
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
          marginTop: '4',
          fontSize: 'lede',
          textDecoration: 'underline',
          textDecorationColor: 'accent',
          textUnderlineOffset: '4px',
        })}
      >
        back to the work
      </a>
    </section>
  )
}
