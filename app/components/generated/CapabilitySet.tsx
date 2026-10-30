import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { Label } from './Label'

export function CapabilitySet() {
  return (
    <section
      className={css({
        marginTop: '40px',
        paddingTop: '22px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ marginBottom: '16px' })}>
        <Label>Capabilities</Label>
      </div>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          rowGap: '10px',
          columnGap: '12px',
        })}
      >
        {capabilities.map((cap, i) => (
          <span
            key={cap}
            className={css({ display: 'inline-flex', alignItems: 'baseline', gap: '12px' })}
          >
            {i > 0 ? (
              <span aria-hidden="true" className={css({ color: 'accent', fontSize: 'lg' })}>
                ·
              </span>
            ) : null}
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                fontSize: { base: 'base', md: 'lg' },
                color: 'text',
              })}
            >
              {cap}
            </span>
          </span>
        ))}
      </div>
    </section>
  )
}
