import { css } from '../../../styled-system/css'
import { SectionHeading } from './SectionHeading'

const rows = [
  { pos: '1', name: 'Taylor Pendrith', thru: 'round 3 · thru 18', score: '−17' },
  { pos: '2', name: 'Denny McCarthy', thru: 'round 3 · thru 18', score: '−16' },
  { pos: '3', name: 'Harry Higgs', thru: 'round 3 · thru 17', score: '−15' },
  { pos: 'T4', name: 'Keith Mitchell', thru: 'round 3 · thru 16', score: '−14' },
  { pos: 'T4', name: 'Vince Whaley', thru: 'round 3 · thru 16', score: '−14' },
]

export function LeaderboardSection() {
  return (
    <section
      className={css({
        paddingTop: '96px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHeading label="today, on the wire" title="bank of utah championship" />
      <div
        className={css({
          maxWidth: '560px',
          marginInline: 'auto',
          marginTop: '28px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
        })}
      >
        {rows.map((r) => (
          <div
            key={r.name}
            className={css({
              display: 'grid',
              gridTemplateColumns: '44px 1fr auto',
              alignItems: 'baseline',
              columnGap: '12px',
              paddingBlock: '14px',
              paddingInline: '8px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
              transition: 'background 0.2s ease',
              _hover: { bg: 'surface' },
            })}
          >
            <span
              className={`tnum ${css({ fontFamily: 'display', fontSize: 'sm', color: 'textMuted' })}`}
            >
              {r.pos}
            </span>
            <span className={css({ fontSize: 'sm', color: 'text' })}>
              {r.name}
              <span
                className={css({
                  display: 'block',
                  fontSize: 'xs',
                  color: 'textFaint',
                  marginTop: '2px',
                  textTransform: 'lowercase',
                  letterSpacing: '0.04em',
                })}
              >
                {r.thru}
              </span>
            </span>
            <span
              className={`tnum ${css({ fontFamily: 'display', fontSize: '20px', color: 'fieldBorder' })}`}
            >
              {r.score}
            </span>
          </div>
        ))}
      </div>
      <div
        className={css({
          textAlign: 'center',
          fontSize: 'xs',
          color: 'textMuted',
          marginTop: '14px',
          textTransform: 'lowercase',
          letterSpacing: '0.06em',
        })}
      >
        in progress · october 3
      </div>
    </section>
  )
}
