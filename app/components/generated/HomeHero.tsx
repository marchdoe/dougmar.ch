import { css } from '../../../styled-system/css'
import { Ground } from '../Material'
import { PivotBand } from './PivotBand'

const clause = css({
  display: { base: 'block', md: 'grid' },
  gridTemplateColumns: { md: 'repeat(12, 1fr)' },
  color: 'text',
})
const clauseLate = css({
  display: { base: 'block', md: 'grid' },
  gridTemplateColumns: { md: 'repeat(12, 1fr)' },
  color: 'text',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})
const lineLeft = css({
  display: 'block',
  fontSize: 'clamp(38px, 7vw, 96px)',
  gridColumn: { md: '1 / 9' },
})
const lineRight = css({
  display: 'block',
  fontSize: 'clamp(38px, 7vw, 96px)',
  gridColumn: { md: '5 / 13' },
  textAlign: { md: 'right' },
})
const cy = css({ color: 'accent' })
const ghost = css({ display: 'block', whiteSpace: 'nowrap' })

export function HomeHero() {
  return (
    <section
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        minHeight: { base: 'auto', md: 'calc(100vh - 180px)' },
        paddingInline: { base: '7vw', md: '6vw' },
        paddingBottom: { base: '40px', md: '56px' },
        _before: {
          content: '""',
          position: 'absolute',
          inset: '-4%',
          bg: 'bg',
          zIndex: 0,
          pointerEvents: 'none',
          animation: 'drift 40s cubic-bezier(0.65, 0, 0.35, 1) infinite alternate',
        },
      })}
    >
      <Ground material="grain" seed={826646261} />
      <div
        aria-hidden="true"
        className={css({
          position: 'absolute',
          right: { base: '7vw', md: '6vw' },
          bottom: '40px',
          zIndex: 0,
          opacity: 0.05,
          color: 'text',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(80px, 20vw, 300px)',
          lineHeight: '0.85',
          textAlign: 'right',
          pointerEvents: 'none',
        })}
      >
        <span className={ghost}>before</span>
        <span className={ghost}>after</span>
      </div>
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          paddingTop: { base: '4', md: '7' },
        })}
      >
        <h1
          className={css({
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'display',
            fontWeight: 'bold',
            lineHeight: '0.98',
            letterSpacing: '-0.01em',
            textAlign: 'left',
            textTransform: 'none',
            fontStyle: 'normal',
            animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          <span className={clause}>
            <span className={lineLeft}>Buildable</span>
            <span className={lineLeft}>
              <span className={cy}>before</span> the first
            </span>
            <span className={lineLeft}>line of code.</span>
          </span>
          <PivotBand />
          <span className={clauseLate}>
            <span className={lineRight}>
              Faithful <span className={cy}>after</span>
            </span>
            <span className={lineRight}>the last.</span>
          </span>
        </h1>
      </div>
    </section>
  )
}
