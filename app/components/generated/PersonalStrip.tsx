import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalStrip() {
  const data = [
    { k: 'Holes in one', v: String(personal.holesInOne) },
    { k: 'Sport', v: personal.sport },
    { k: 'Teams', v: personal.teams.join(' · ') },
    { k: 'Current focus', v: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        marginTop: { base: '48px', lg: '96px' },
        paddingTop: '28px',
        borderTop: '1px solid',
        borderColor: 'border',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '18px', columnGap: '28px' })}
      >
        {data.map((d) => (
          <div
            key={d.k}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              minWidth: '0',
              maxWidth: '46ch',
            })}
          >
            <span
              className={css({
                fontSize: '13px',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'textFaint',
              })}
            >
              {d.k}
            </span>
            <span
              className={css({
                fontSize: '14px',
                color: 'textMuted',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {d.v}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
