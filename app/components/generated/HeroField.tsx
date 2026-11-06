import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { Rings } from './Rings'
import { Satellites } from './Satellites'

export function HeroField() {
  return (
    <section
      aria-labelledby="hero"
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'field',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100svh - 142px)',
        paddingBlock: '6',
        paddingInline: { base: '4', md: '6', lg: '7', xl: '8' },
        lg: { display: 'block' },
        _before: {
          content: '""',
          position: 'absolute',
          inset: '-4%',
          bgGradient: 'to-b',
          gradientFrom: 'bg',
          gradientVia: 'field',
          gradientTo: 'bg',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        },
      })}
    >
      <Ground material="mesh" seed={1499819892} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: '1 0 auto',
          lg: { position: 'absolute', inset: '0' },
        })}
      >
        <Rings />
        <div
          className={css({
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            flex: '1 0 auto',
            minWidth: '0',
            maxWidth: '100%',
            minHeight: 'calc(100svh - 180px)',
            lg: {
              position: 'absolute',
              top: '46%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              minHeight: '0',
              width: 'min(1000px, 92%)',
            },
          })}
        >
          <h1
            id="hero"
            className={css({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4',
              maxWidth: '100%',
              textAlign: 'center',
              fontWeight: 'light',
            })}
          >
            {/* Outline stroke moved from accent to fieldInk: accent fell under 3:1 against the mesh bloom. */}
            <span
              className={css({
                display: 'block',
                whiteSpace: 'nowrap',
                fontFamily: 'display',
                fontWeight: 'light',
                textStyle: 'hero',
                fontSize: { base: '52px', md: 'hero' },
                lineHeight: 'tight',
                textTransform: 'none',
                fontStyle: 'normal',
                color: 'transparent',
                WebkitTextStroke: '2px token(colors.fieldInk)',
                animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '0ms',
              })}
            >
              Spaceman
            </span>
            <span
              className={css({
                display: 'block',
                maxWidth: '100%',
                fontFamily: 'body',
                fontWeight: 'normal',
                textStyle: { base: 'md', lg: 'xl' },
                lineHeight: 'snug',
                color: 'text',
                textWrap: 'balance',
                whiteSpace: { lg: 'nowrap' },
                animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '80ms',
              })}
            >
              FishSticks, 15th Club, and the next one.
            </span>
          </h1>
        </div>
        <Satellites />
      </div>
    </section>
  )
}
