import { css } from '../../../styled-system/css'

export function HomeDeck() {
  return (
    <section
      aria-label="Lead"
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' },
        columnGap: 'clamp(26px, 3vw, 44px)',
        alignItems: 'start',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <p
        className={css({
          gridColumn: { lg: '1 / 3' },
          fontFamily: 'display',
          fontWeight: 'normal',
          color: 'textMuted',
          textStyle: { base: 'md', lg: 'xl' },
          lineHeight: 'snug',
          maxWidth: { base: '34ch', lg: '38ch' },
          paddingTop: { base: '6px', lg: '20px' },
          paddingBottom: '14px',
          borderBottom: '1px solid',
          borderBottomColor: 'border',
        })}
      >
        Detroit pulled for its defense and got it, a 104–86 final decided at the far end of the
        floor, not the near one. Below, the rest of the day's ledger.
      </p>
      <div
        className={css({
          fontFamily: 'body',
          textStyle: '2xs',
          letterSpacing: 'wide',
          color: 'textMuted',
          textTransform: 'uppercase',
          paddingTop: { base: '10px', lg: '24px' },
          paddingBottom: '20px',
        })}
      >
        AQI 22 · UV 1 · Detroit, MI
      </div>
    </section>
  )
}
