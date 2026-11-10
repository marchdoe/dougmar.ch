import { css } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'

const kicker = css({
  fontSize: '2xs',
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'accentAlt',
  fontWeight: 'bold',
  marginBottom: '14px',
})

export function CapabilitiesSection() {
  const rows = [
    ['School', education.school],
    ['Degree', education.degree],
    ['Concentration', education.concentration],
    ['Years', education.years],
  ].filter((r) => r[1] !== '')
  return (
    <section
      className={css({
        paddingBottom: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1.4fr 1fr' },
        gap: 'clamp(32px, 4vw, 56px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div>
        <div className={kicker}>Capabilities</div>
        <ul
          className={css({
            listStyle: 'none',
            padding: '0',
            margin: '0',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '20px',
            rowGap: '8px',
          })}
        >
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'lg',
                textTransform: 'lowercase',
                color: 'text',
              })}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className={kicker}>Education</div>
        {rows.map((r) => (
          <div
            key={r[0]}
            className={css({
              display: 'grid',
              gridTemplateColumns: '130px 1fr',
              gap: '12px',
              alignItems: 'baseline',
              paddingBlock: '10px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
            })}
          >
            <span
              className={css({
                fontSize: '2xs',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'textFaint',
                fontWeight: 'bold',
              })}
            >
              {r[0]}
            </span>
            <span className={css({ fontSize: 'base', color: 'text' })}>{r[1]}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
