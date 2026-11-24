import { css } from '../../../styled-system/css'

const label = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  textStyle: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  color: 'accent',
  marginBottom: '14px',
})

const note = css({
  fontFamily: 'body',
  textStyle: 'sm',
  color: 'textMuted',
  lineHeight: '1.5',
  maxWidth: '38ch',
})

const ticker = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  textStyle: 'xl',
  color: 'text',
  letterSpacing: '-0.01em',
  fontVariantNumeric: 'tabular-nums',
})

export function SignalIndex() {
  return (
    <section
      aria-label="Today's signals"
      className={css({
        // The mockup's band #FBEABD has no semantic token; bgAlt is the nearest ground.
        bg: 'bgAlt',
        paddingBlock: 'clamp(40px, 6vw, 64px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        display: 'grid',
        gap: { base: '36px', lg: '48px' },
        gridTemplateColumns: { base: '1fr', lg: '1.4fr 1fr 1fr' },
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div>
        <div className={label}>Detroit</div>
        <p
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            textStyle: 'xl',
            lineHeight: '1.1',
            color: 'text',
            marginBottom: '12px',
          })}
        >
          Lions 31, Bears 21
        </p>
        <p className={note}>
          A cold, bright afternoon at a quarter to five, the kind you glance up at and just say what
          you see.
        </p>
      </div>
      <div>
        <div className={label}>Market close</div>
        <p className={ticker}>
          SPY 722.29 <span className={css({ color: 'accent' })}>+4.71%</span>
        </p>
      </div>
      <div>
        <div className={label}>Sky</div>
        <p className={ticker}>Clear, 0% cloud</p>
        <p
          className={css({
            fontFamily: 'body',
            textStyle: 'sm',
            color: 'textMuted',
            lineHeight: '1.5',
            maxWidth: '38ch',
            marginTop: '12px',
          })}
        >
          Cloudless through sunset. The full moon rises as the sun sets at 4:45.
        </p>
      </div>
    </section>
  )
}
