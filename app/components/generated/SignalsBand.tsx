import { css } from '../../../styled-system/css'

export function SignalsBand() {
  const lab = css({
    display: 'block',
    fontSize: 'clamp(18px, 1.5vw, 22px)',
    fontVariant: 'small-caps',
    letterSpacing: 'wide',
    fontWeight: 'bold',
    color: 'fieldInk',
    paddingBottom: '6px',
    marginBottom: '2px',
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    // mockup carbon-700 rule; nearest rule token on a flooded plane is fieldBorder
    borderColor: 'fieldBorder',
  })
  const big = css({ fontSize: 'clamp(17px, 1.5vw, 20px)', fontWeight: 'bold', color: 'fieldInk' })
  const sub = css({ fontSize: '15px', color: 'fieldInkMuted', lineHeight: '1.5' })
  const cell = css({ display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' })
  return (
    <aside
      aria-label="Signals"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(40px, 5vw, 72px)',
        paddingInline: '5vw',
        display: 'grid',
        gridTemplateColumns: {
          base: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        gap: 'clamp(24px, 3vw, 48px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        className={css({
          gridColumn: '1 / -1',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(40px, 5vw, 72px)',
          lineHeight: '1',
          color: 'fieldInk',
        })}
      >
        Signals
      </h2>
      <div className={cell}>
        <span className={lab}>Detroit</span>
        <span className={big}>
          Pistons 121–113{' '}
          <span className={css({ color: 'fieldInkMuted', fontWeight: 'normal' })}>win</span>
        </span>
        <span className={sub}>Red Wings 3–4, loss</span>
      </div>
      <div className={cell}>
        <span className={lab}>Sky</span>
        <span className={big}>Clear · 44°F · Aldie, VA</span>
        <span className={sub}>Waxing gibbous moon</span>
      </div>
      <div className={cell}>
        <span className={lab}>Market</span>
        <span className={big}>SPY 769.05 ▲</span>
      </div>
      <div className={cell}>
        <span className={lab}>In rotation</span>
        <span className={sub}>My Morning Jacket · The War on Drugs · Tobin Sprout</span>
      </div>
    </aside>
  )
}
