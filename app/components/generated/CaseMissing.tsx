import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingTop: { base: '96px', lg: '132px' },
        paddingBottom: { base: '64px', lg: '96px' },
        paddingInline: { base: '20px', lg: '5vw' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        gap: '5',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'normal',
          textStyle: '3xl',
          textTransform: 'lowercase',
          maxWidth: '19ch',
          color: 'text',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        That case is not on file.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          color: 'accent',
          textStyle: 'sm',
          fontWeight: 'bold',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          textDecoration: 'underline',
          textUnderlineOffset: '5px',
        })}
      >
        See the work ↗
      </a>
    </section>
  )
}
