import { css } from '../../../styled-system/css'

export function CaseMissing() {
  return (
    <section
      aria-labelledby="missing-hed"
      className={css({
        order: { base: -1, lg: 0 },
        bg: 'field',
        color: 'fieldInk',
        paddingTop: '22px',
        paddingBottom: '26px',
        paddingInline: 'clamp(18px, 4vw, 40px)',
      })}
    >
      <h1
        id="missing-hed"
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          textStyle: '4xl',
          color: 'fieldInk',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Not on file.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '3',
          fontFamily: 'body',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          textStyle: 'xs',
          color: 'fieldInk',
          borderBottom: '2px solid',
          borderBottomColor: 'fieldBorder',
          _hover: { color: 'fieldInkMuted', textDecoration: 'none' },
        })}
      >
        Back to the work
      </a>
    </section>
  )
}
