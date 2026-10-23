import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        paddingInline: 'clamp(24px, 6vw, 112px)',
        paddingBottom: 'clamp(48px, 7vw, 112px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: '600',
          fontSize: 'clamp(34px, 6vw, 64px)',
          letterSpacing: '-0.03em',
          lineHeight: '1',
          textTransform: 'lowercase',
        })}
      >
        no such project
      </h1>
      <a
        href="/#work"
        className={css({
          display: 'inline-flex',
          marginTop: '26px',
          fontSize: '15px',
          fontWeight: 'bold',
          color: 'accent',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'accent',
          paddingBottom: '3px',
        })}
      >
        back to the work
      </a>
    </section>
  )
}
