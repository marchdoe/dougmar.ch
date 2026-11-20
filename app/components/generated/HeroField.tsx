import { css } from '../../../styled-system/css'

export function HeroField() {
  return (
    <section
      className={css({
        flex: '1',
        display: 'grid',
        gridTemplateColumns: '1fr',
        alignContent: 'end',
        position: 'relative',
        bg: 'bg',
        minHeight: { base: '78vh', lg: '92vh' },
        paddingTop: { base: 'clamp(40px, 8vw, 88px)', lg: 'clamp(56px, 8vw, 112px)' },
        paddingBottom: {
          base: 'calc(44px + clamp(32px, 6vw, 64px))',
          lg: 'calc(44px + clamp(56px, 7vw, 96px))',
        },
        paddingInline: 'clamp(40px, 6vw, 112px)',
      })}
    >
      <div
        className={css({
          gridColumn: '1 / -1',
          textAlign: { base: 'left', lg: 'center' },
          minWidth: '0',
        })}
      >
        <h1 className={css({ margin: '0', fontWeight: 'normal' })}>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'normal',
              fontSize: 'clamp(26px, 7.4vw, 46px)',
              lineHeight: '1.08',
              color: 'textMuted',
              marginBottom: '0.12em',
            })}
          >
            What ships should look like what was
          </span>
          <span
            className={css({
              display: 'block',
              fontFamily: 'display',
              fontStyle: 'italic',
              fontWeight: 'bold',
              fontSize: 'clamp(50px, 12vw, 158px)',
              lineHeight: '0.9',
              letterSpacing: 'tight',
              color: 'accent',
              marginTop: '0.02em',
            })}
          >
            Designed.
          </span>
        </h1>
        <p
          className={css({
            marginTop: 'clamp(20px, 3vw, 30px)',
            marginBottom: '0',
            marginInline: { base: '0', lg: 'auto' },
            fontSize: 'sm',
            letterSpacing: 'normal',
            color: 'textMuted',
            maxWidth: '42ch',
            lineHeight: 'normal',
          })}
        >
          The fidelity creed, lifted from my own capability lines: I say what a thing does, and this
          is the thing I do.
        </p>
      </div>
    </section>
  )
}
