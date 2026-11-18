import { css } from '../../../styled-system/css'

const factClass = css({
  textStyle: 'base',
  lineHeight: 'normal',
  // mockup --textSoft #46391F has no token; nearest semantic ink is textMuted
  color: 'textMuted',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  paddingTop: '3',
  margin: '0',
})

const strongClass = css({
  color: 'text',
  fontWeight: 'semibold',
  fontVariantNumeric: 'tabular-nums',
})

export function TodayFacts() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
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
      <h2
        className={css({
          display: 'block',
          marginBottom: 'clamp(20px, 3vw, 32px)',
          textStyle: 'xs',
          fontWeight: 'semibold',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        Today
      </h2>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          rowGap: { base: '20px', md: '28px', lg: '40px' },
          columnGap: { base: '20px', md: '40px' },
        })}
      >
        <p className={factClass}>
          Pistons win,{' '}
          {/* mockup --amberSmall #8F520D has no token; nearest amber ink is fieldInkMuted */}
          <span
            className={css({
              color: 'fieldInkMuted',
              fontWeight: 'semibold',
              fontVariantNumeric: 'tabular-nums',
            })}
          >
            105–93
          </span>
          .
        </p>
        <p className={factClass}>
          SPY <strong className={strongClass}>732.44</strong>, off 1.0%.
        </p>
        <p className={factClass}>
          Waxing gibbous, <strong className={strongClass}>71%</strong> full.
        </p>
        <p className={factClass}>The RSM Classic tees off.</p>
      </div>
    </section>
  )
}
