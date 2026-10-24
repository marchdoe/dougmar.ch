import type { CSSProperties } from 'react'
import { css } from '../../../styled-system/css'

const quarters = [
  { q: 'Q1', det: 32, opp: 28, dh: '94%', oh: '82%' },
  { q: 'Q2', det: 34, opp: 26, dh: '100%', oh: '76%' },
  { q: 'Q3', det: 30, opp: 29, dh: '88%', oh: '85%' },
  { q: 'Q4', det: 32, opp: 28, dh: '94%', oh: '82%' },
]

const barBase = css({
  width: '38%',
  position: 'relative',
  borderTopRadius: 'sm',
  height: 'var(--h)',
})
const detBar = css({ bg: 'accent' })
const oppBar = css({ bg: 'borderStrong' })
const barNum = css({
  position: 'absolute',
  top: '6px',
  left: '50%',
  transform: 'translateX(-50%)',
  fontWeight: 'bold',
  textStyle: 'xs',
})
// numbers sit inside their bars, so each takes the ink paired with its fill
const detNum = css({ color: 'accentText' })
const oppNum = css({ color: 'fieldInk' })
const legendItem = css({ display: 'inline-flex', alignItems: 'center', gap: '6px' })

export function ChartBand() {
  return (
    <section
      aria-label="Scoring by quarter"
      className={css({
        position: 'relative',
        zIndex: 1,
        bg: 'bgAlt',
        borderTop: '3px solid',
        borderTopColor: 'borderStrong',
        paddingTop: '7',
        paddingBottom: '56px',
        paddingInline: '5vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '1180px', marginInline: 'auto' })}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '3',
            borderTop: '2px solid',
            borderTopColor: 'text',
            paddingTop: '3',
            marginBottom: '28px',
          })}
        >
          <span
            className={css({
              textStyle: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'text',
            })}
          >
            Analysis · Scoring by quarter
          </span>
          <span
            className={css({
              display: 'flex',
              gap: '18px',
              textStyle: '2xs',
              fontWeight: 'bold',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'text',
            })}
          >
            <span className={legendItem}>
              <span
                className={css({ width: '12px', height: '12px', borderRadius: 'sm', bg: 'accent' })}
              />
              Pistons
            </span>
            <span className={legendItem}>
              <span
                className={css({
                  width: '12px',
                  height: '12px',
                  borderRadius: 'sm',
                  bg: 'borderStrong',
                })}
              />
              Opponent
            </span>
          </span>
        </div>
        <div
          role="img"
          aria-label="Pistons 32, 34, 30, 32 by quarter; opponent 28, 26, 29, 28"
          className={css({
            display: 'flex',
            alignItems: 'flex-end',
            gap: '14px',
            height: '200px',
            borderBottom: '2px solid',
            borderBottomColor: 'text',
          })}
        >
          {quarters.map((q) => (
            <div
              key={q.q}
              className={css({
                flex: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
              })}
            >
              <div
                className={css({
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  gap: '7px',
                  width: '100%',
                  height: '100%',
                })}
              >
                <span className={`${barBase} ${detBar}`} style={{ '--h': q.dh } as CSSProperties}>
                  <b className={`${barNum} ${detNum}`}>{q.det}</b>
                </span>
                <span className={`${barBase} ${oppBar}`} style={{ '--h': q.oh } as CSSProperties}>
                  <b className={`${barNum} ${oppNum}`}>{q.opp}</b>
                </span>
              </div>
              <span
                className={css({
                  marginTop: '10px',
                  textStyle: '2xs',
                  fontWeight: 'bold',
                  letterSpacing: 'wider',
                  textTransform: 'uppercase',
                  color: 'text',
                })}
              >
                {q.q}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
