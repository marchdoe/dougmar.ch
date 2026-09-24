import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        paddingInline: '6vw',
        paddingTop: { base: '48px', xl: '64px' },
        paddingBottom: { base: '72px', xl: '96px' },
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          fontSize: '3xl',
          lineHeight: '1',
          color: 'text',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Nothing filed under that name
      </h1>
      <a
        href="/#work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '24px',
          fontFamily: 'body',
          fontSize: 'sm',
          fontWeight: 600,
          color: 'accent',
        })}
      >
        Back to the ledger →
      </a>
    </section>
  )
}
