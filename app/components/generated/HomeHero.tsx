import { css } from '../../../styled-system/css'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        minHeight: 'calc(100svh - 140px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
        paddingTop: '6',
        paddingBottom: { base: '32vh', md: '40vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        bg: 'bg',
      })}
    >
      <span
        className={css({
          position: 'absolute',
          top: 'calc((100% - 40vh) / 2)',
          left: 'calc(clamp(1.25rem, 6vw, 4rem) * 0.34)',
          transform: 'translateY(-50%) rotate(180deg)',
          writingMode: 'vertical-rl',
          textStyle: '2xs',
          fontWeight: 'medium',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          zIndex: 3,
          display: { base: 'none', md: 'block' },
        })}
      >
        Aldie, Virginia
      </span>
      <span
        className={css({
          position: 'absolute',
          top: 'calc((100% - 40vh) / 2)',
          right: 'calc(clamp(1.25rem, 6vw, 4rem) * 0.34)',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          textStyle: '2xs',
          fontWeight: 'medium',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
          zIndex: 3,
          display: { base: 'none', md: 'block' },
        })}
      >
        18 November 2026
      </span>

      <h1
        className={css({
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'light',
          textTransform: 'lowercase',
          textStyle: '4xl',
          fontSize: 'clamp(52px, 7.5vw, 104px)',
          lineHeight: '1.02',
          letterSpacing: '-0.01em',
          maxWidth: '14ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        <span className={css({ display: 'block' })}>
          Bright,{' '}
          {/* mockup --amberLarge #B86D12 maps to fieldBorder (amber.600), the only token at that value */}
          <span className={css({ color: 'fieldBorder' })}>42</span>, and
        </span>
        <span className={css({ display: 'inline-block', position: 'relative' })}>
          dark by five.
          <span
            aria-hidden="true"
            className={css({
              display: 'block',
              height: '3px',
              width: '62%',
              marginTop: '0.12em',
              marginInline: 'auto',
              bg: 'field',
            })}
          />
        </span>
      </h1>

      <div
        className={css({
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          height: { base: '32vh', md: '40vh' },
          bg: 'field',
          clipPath: 'polygon(0 18%, 100% 0, 100% 100%, 0 100%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
          paddingBottom: 'clamp(1.5rem, 4vh, 2.75rem)',
          zIndex: 1,
        })}
      >
        <p
          className={css({
            margin: '0',
            textAlign: 'center',
            color: 'fieldInk',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: 'clamp(17px, 2.2vw, 22px)',
            lineHeight: '1.35',
            maxWidth: '40ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          Clear and 42 in Aldie. Sun up at 7:04, down at 16:48.
        </p>
      </div>
    </section>
  )
}
