import { css } from '../../../styled-system/css'

export function ClauseHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        minHeight: '58vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingInline: '6vw',
        paddingBlock: '9',
        textAlign: 'right',
      })}
    >
      {/* Diagonal honey/plum-rose duotone field, balanced ratio, plum-rose in the upper-right */}
      <div
        aria-hidden
        className={css({
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          backgroundImage:
            'linear-gradient(45deg, token(colors.bg) 0%, token(colors.bg) 50%, token(colors.field) 50%, token(colors.field) 100%)',
        })}
      />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
        })}
      >
        <span
          className={css({
            display: 'block',
            fontSize: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'accentAlt',
            marginBottom: '3',
            animationName: 'settle',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '80ms',
          })}
        >
          Before the first line
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            lineHeight: '1',
            letterSpacing: 'tight',
            color: 'text',
            textAlign: 'right',
            maxWidth: '14ch',
            fontSize: { base: '4xl', md: '5xl', xl: 'hero' },
            animationName: 'settle',
            animationDuration: '500ms',
            animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            animationFillMode: 'both',
            animationDelay: '0ms',
          })}
        >
          Buildable before the first line of code.
        </h1>
      </div>
    </section>
  )
}
