import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '16px',
        paddingTop: '96px',
        paddingBottom: '96px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: '2xl',
          textTransform: 'lowercase',
          color: 'text',
        })}
      >
        not on the card
      </h1>
      <a
        href="/#work"
        className={css({
          fontSize: 'sm',
          color: 'text',
          minHeight: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        back to the selected work
      </a>
    </section>
  )
}
