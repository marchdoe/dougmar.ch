import { capabilities } from '../../content/timeline'
import { css } from '../../../styled-system/css'

export function CapabilityBand() {
  return (
    <section
      aria-label="Capabilities"
      className={css({
        bg: 'bgAlt',
        paddingInline: 'clamp(20px, 6vw, 96px)',
        paddingBlock: 'clamp(28px, 4vw, 48px)',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
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
          fontVariant: 'small-caps',
          textStyle: '2xl',
          letterSpacing: 'wide',
          color: 'text',
          marginBottom: '4',
        })}
      >
        Capabilities
      </h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              paddingBlock: '1',
              paddingInline: '3',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              bg: 'surface',
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  )
}
