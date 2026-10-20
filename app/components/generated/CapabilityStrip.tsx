import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityStrip() {
  return (
    <section
      className={css({
        bg: 'surface',
        paddingBlock: 'clamp(36px, 5vw, 64px)',
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
          color: 'text',
          marginBottom: '16px',
        })}
      >
        Capabilities
      </h2>
      <ul className={css({ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '10px' })}>
        {capabilities.map((cap) => (
          <li
            key={cap}
            className={css({
              fontFamily: 'display',
              fontSize: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              paddingInline: '12px',
              paddingBlock: '6px',
            })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </section>
  )
}
