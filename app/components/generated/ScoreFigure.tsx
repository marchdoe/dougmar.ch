import { css } from '../../../styled-system/css'

export function ScoreFigure() {
  return (
    <div
      className={css({
        position: 'relative',
        paddingTop: 'clamp(46px, 8vw, 104px)',
        gridColumn: { lg: '1 / 9' },
        alignSelf: { lg: 'center' },
      })}
    >
      <span
        aria-hidden="true"
        className={css({
          position: 'absolute',
          top: '0',
          left: '-0.02em',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both',
          animationDelay: '80ms',
        })}
      >
        {/* accentDark (#178A51) has no semantic token; nearest is field */}
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'bold',
            lineHeight: '0.78',
            fontSize: 'clamp(56px, 11.5vw, 138px)',
            letterSpacing: '0.01em',
            color: 'field',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: '2px token(colors.field)',
            whiteSpace: 'nowrap',
            opacity: 0.85,
          })}
        >
          DETROIT
        </span>
      </span>
      {/* The eyebrow sits on its own flat bg box so the outline word behind it never runs through its glyphs */}
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textMuted',
          bg: 'bg',
          width: 'fit-content',
          paddingInlineEnd: '8px',
          marginBottom: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both',
          animationDelay: '80ms',
          _before: {
            content: '""',
            width: '28px',
            height: '4px',
            bg: 'accent',
            display: 'inline-block',
          },
        })}
      >
        Lions · Final
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          lineHeight: '0.82',
          fontSize: 'clamp(104px, 13vw, 160px)',
          letterSpacing: '-0.01em',
          color: 'accent',
          whiteSpace: 'nowrap',
          textShadow: '0 0 50px color-mix(in srgb, token(colors.accent) 34%, transparent)',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both',
          animationDelay: '160ms',
        })}
      >
        19–15
      </div>
      <p
        className={css({
          position: 'relative',
          zIndex: 1,
          fontSize: 'sm',
          color: 'textMuted',
          marginTop: '14px',
          marginBottom: '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '12px',
          maxWidth: '40ch',
          lineHeight: '1.5',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) 240ms both',
          animationDelay: '240ms',
        })}
      >
        Detroit 19, their opponent 15. One score, no cushion, no touchdown shootout.
      </p>
      <h1
        className={css({
          position: 'relative',
          zIndex: 1,
          marginTop: '24px',
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '3xl',
          fontSize: 'clamp(28px, 4.4vw, 54px)',
          lineHeight: '1.02',
          color: 'text',
          maxWidth: '17ch',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms both',
          animationDelay: '0ms',
        })}
      >
        Lions win ugly, and I’ll take it.
      </h1>
      <p
        className={css({
          position: 'relative',
          zIndex: 1,
          fontSize: 'lede',
          color: 'textMuted',
          marginTop: '14px',
          marginBottom: '0',
          maxWidth: '54ch',
          lineHeight: '1.55',
          animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) 240ms both',
          animationDelay: '240ms',
        })}
      >
        A four-point grind in November with no breathing room. Not pretty. Still a win, and that is
        the only column that matters this morning.
      </p>
    </div>
  )
}
