import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityTags() {
  return (
    <section
      className={css({
        paddingTop: { base: '48px', lg: '96px' },
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
          fontSize: '13px',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textFaint',
          marginBottom: '20px',
        })}
      >
        Capabilities
      </div>
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          listStyle: 'none',
          padding: '0',
          margin: '0',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              fontSize: '14px',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: { base: 'accent', _light: 'text' },
              border: '1px solid',
              borderColor: { base: 'border', _light: 'borderStrong' },
              paddingBlock: '6px',
              paddingInline: '10px',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  )
}
