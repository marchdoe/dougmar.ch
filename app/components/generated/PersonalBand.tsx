import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

export function PersonalBand() {
  const facts = [
    { k: 'holes in one', v: String(personal.holesInOne) },
    { k: 'sport', v: personal.sport },
    { k: 'teams', v: personal.teams.join(', ') },
    { k: 'current focus', v: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: '8',
        paddingInline: '6vw',
        textAlign: 'center',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <dl
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: '6',
          maxWidth: '880px',
          marginInline: 'auto',
          margin: '0',
        })}
      >
        {facts.map((f) => (
          <div key={f.k} className={css({ minWidth: '0' })}>
            {/* fieldInkMuted on field is under 4.5:1 in the dark scheme; fieldInk clears it */}
            <dt
              className={css({
                fontSize: 'xs',
                letterSpacing: 'wide',
                color: 'fieldInk',
                marginBottom: '2',
              })}
            >
              {f.k}
            </dt>
            <dd
              className={css({
                margin: '0',
                fontSize: 'lede',
                lineHeight: 'snug',
                color: 'fieldInk',
              })}
            >
              {f.v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
