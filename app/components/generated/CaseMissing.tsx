import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      data-beside-margin=""
      className={css({
        gridColumn: { md: '1 / 9', lg: '1 / 10' },
        gridRow: { md: '1' },
        minWidth: '0',
        bg: 'bg',
        paddingBlock: 'clamp(32px, 5vw, 72px)',
        paddingInline: '5vw',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: 'clamp(44px, 12vw, 72px)', md: 'clamp(72px, 8vw, 120px)' },
          lineHeight: '0.9',
          color: 'accent',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        No project here
      </h1>
      <a
        href="/work"
        className={css({
          fontSize: '15px',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'accent',
        })}
      >
        Back to the index of work
      </a>
    </section>
  )
}
