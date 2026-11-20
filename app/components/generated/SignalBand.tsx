import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

function SigCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          fontSize: '2xs',
          fontWeight: 'bold',
          color: 'fieldInkMuted',
          marginBottom: '10px',
        })}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

const lineClass = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'clamp(18px, 2.4vw, 21px)',
  lineHeight: 'snug',
  color: 'fieldInk',
  fontVariantNumeric: 'tabular-nums',
})
const subClass = css({ fontFamily: 'body', fontSize: 'xs', color: 'fieldInkMuted', marginTop: '1' })
const wxClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '6px',
  columnGap: '20px',
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'fieldInkMuted',
  '& b': { color: 'fieldInk', fontWeight: 'bold' },
})

export function SignalBand() {
  return (
    <section
      aria-label="Today"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: '40px',
        paddingInline: 'clamp(40px, 6vw, 112px)',
        borderStyle: 'solid',
        borderColor: 'fieldBorder',
        borderTopWidth: '1px',
        borderBottomWidth: '1px',
        borderLeftWidth: '0',
        borderRightWidth: '0',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: { base: 'flex', sm: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: { sm: '1fr 1fr' },
          rowGap: '28px',
          columnGap: { base: '28px', sm: '48px' },
        })}
      >
        <SigCell label="RSM Classic · Leaderboard">
          <div className={lineClass}>Svensson −8 · Greyserman −7 · Higgo −7</div>
          <div className={subClass}>Sea Island, final round in play.</div>
        </SigCell>
        <SigCell label="Market · Close">
          <div className={lineClass}>
            SPY 715.87{' '}
            <span className={css({ color: 'fieldInkMuted', fontWeight: 'bold' })}>▼ −1.96%</span>
          </div>
          <div className={subClass}>A down day; no event worth shouting.</div>
        </SigCell>
        <SigCell label="Aldie, Virginia">
          <div className={wxClass}>
            <span>
              <b>53°F</b> sunny
            </span>
            <span>
              <b>9.7h</b> daylight
            </span>
            <span>
              sunset <b>16:47</b>
            </span>
          </div>
        </SigCell>
        <SigCell label="Sky">
          <div className={wxClass}>
            <span>
              waxing gibbous <b>88%</b>
            </span>
            <span>
              AQI <b>good</b>
            </span>
          </div>
        </SigCell>
      </div>
    </section>
  )
}
