import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { ZoneHead } from './ZoneHead'

export function CapabilityChips() {
  return (
    <section
      className={css({
        paddingTop: { base: '88px', xl: '120px' },
        paddingBottom: { base: '48px', xl: '64px' },
        paddingInline: '6vw',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <ZoneHead title="Capabilities" kicker="Design and engineering" />
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '8px' })}>
        {capabilities.map((capability) => (
          <span
            key={capability}
            className={css({
              display: 'inline-block',
              paddingBlock: '6px',
              paddingInline: '12px',
              borderRadius: 'sm',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              bg: 'surface',
              fontFamily: 'body',
              fontSize: 'sm',
              fontWeight: 600,
              fontVariantCaps: 'all-small-caps',
              letterSpacing: 'wide',
              color: 'text',
            })}
          >
            {capability}
          </span>
        ))}
      </div>
    </section>
  )
}
