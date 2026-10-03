import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { Ground } from '../Material'

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        minHeight: { base: '76vh', md: '78vh' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: '48px',
        paddingBottom: { base: '72px', md: '112px' },
        paddingInline: 'clamp(24px, 6vw, 112px)',
      })}
    >
      <Ground material="grain" seed={994076678} />
      {/* glow #F0D0A0 has no semantic token; nearest is accent, laid down soft and blurred */}
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(80%, 640px)',
          aspectRatio: '1',
          borderRadius: 'full',
          bg: 'accent',
          opacity: 0.2,
          filter: 'blur(72px)',
          pointerEvents: 'none',
          zIndex: 0,
        })}
      />
      {/* ring stroke #E8B873 has no semantic token; nearest is accent at reduced opacity */}
      <svg
        aria-hidden="true"
        viewBox="0 0 800 800"
        fill="none"
        className={css({
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(100%, 860px)',
          height: 'auto',
          aspectRatio: '1',
          color: 'accent',
          opacity: 0.32,
          pointerEvents: 'none',
          zIndex: 0,
        })}
      >
        <g stroke="currentColor" strokeWidth="2" fill="none">
          <circle cx="400" cy="400" r="110" />
          <circle cx="400" cy="400" r="175" />
          <circle cx="400" cy="400" r="240" />
          <circle cx="400" cy="400" r="305" />
          <circle cx="400" cy="400" r="370" />
        </g>
      </svg>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        })}
      >
        <span
          className={css({
            fontFamily: 'body',
            fontSize: 'xs',
            fontWeight: '500',
            textTransform: 'lowercase',
            letterSpacing: '0.22em',
            color: 'text',
          })}
        >
          holes in one · a scorecard i keep
        </span>
        <span
          className={`tnum ${css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'hero',
            lineHeight: '0.9',
            letterSpacing: '-0.01em',
            color: 'fieldBorder',
            marginTop: '2px',
            marginBottom: '6px',
          })}`}
        >
          {personal.holesInOne}
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '28px', lg: '40px' },
            lineHeight: '1.08',
            letterSpacing: '-0.005em',
            textTransform: 'lowercase',
            color: 'text',
            maxWidth: '16ch',
          })}
        >
          Four holes in one. The scorecard is the first experiment.
        </h1>
        <p
          className={css({
            fontSize: 'sm',
            color: 'textMuted',
            maxWidth: '46ch',
            marginTop: '6px',
          })}
        >
          the aces are a real card, and 15th club's scorecard is the first of its experiments. see
          the{' '}
          <a
            href="#work"
            className={css({
              color: 'text',
              bg: 'surface',
              borderBottomWidth: '2px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
              paddingBlock: '1px',
              paddingInline: '5px',
              borderRadius: 'sm',
              _hover: { color: 'accentAlt', borderBottomColor: 'accentAlt' },
            })}
          >
            work
          </a>
          .
        </p>
      </div>
    </section>
  )
}
