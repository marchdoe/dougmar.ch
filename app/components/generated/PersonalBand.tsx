import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalBand() {
  const facts = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(' · ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <section
      aria-label="Off the clock"
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
          columnGap: '48px',
        })}
      >
        {facts.map((fact) => (
          <div key={fact.label}>
            <div
              className={css({
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                fontSize: '2xs',
                fontWeight: 'bold',
                color: 'fieldInkMuted',
                marginBottom: '10px',
              })}
            >
              {fact.label}
            </div>
            <div
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: 'clamp(18px, 2.4vw, 21px)',
                lineHeight: 'snug',
                color: 'fieldInk',
                maxWidth: '40ch',
              })}
            >
              {fact.value}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
