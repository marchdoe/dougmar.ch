import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalBand() {
  const rows = [
    ['Holes in one', String(personal.holesInOne)],
    ['Sport', personal.sport],
    ['Teams', personal.teams.join(', ')],
    ['Current focus', personal.currentFocus],
  ]
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'fieldBorder',
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
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(22px, 3vw, 34px)',
          textTransform: 'lowercase',
          letterSpacing: '-0.01em',
          paddingBottom: '14px',
          marginBottom: '8px',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        off the course
      </h2>
      {rows.map((r) => (
        <div
          key={r[0]}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: '200px 1fr' },
            columnGap: '24px',
            rowGap: '4px',
            alignItems: 'baseline',
            paddingBlock: '12px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
          })}
        >
          <span
            className={css({
              fontSize: '2xs',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
              fontWeight: 'bold',
            })}
          >
            {r[0]}
          </span>
          <p
            className={css({
              fontSize: 'base',
              color: 'fieldInk',
              fontWeight: 'bold',
              maxWidth: '50ch',
            })}
          >
            {r[1]}
          </p>
        </div>
      ))}
    </section>
  )
}
