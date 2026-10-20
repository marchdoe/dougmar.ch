import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalLedger() {
  const rows = [
    { key: 'Holes in one', value: String(personal.holesInOne) },
    { key: 'Sport', value: personal.sport },
    { key: 'Teams', value: personal.teams.join(', ') },
    { key: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
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
          fontSize: '13px',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          marginBottom: '8px',
        })}
      >
        Off the clock
      </h2>
      <div className={css({ display: 'grid', rowGap: '4px', maxWidth: '860px' })}>
        {rows.map((row) => (
          <div
            key={row.key}
            className={css({
              display: 'flex',
              gap: '14px',
              alignItems: 'baseline',
              paddingBlock: '10px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontSize: '12px',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
                flex: '0 0 118px',
              })}
            >
              {row.key}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                fontSize: '14px',
                color: 'fieldInk',
                lineHeight: '1.4',
                minWidth: '0',
              })}
            >
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
