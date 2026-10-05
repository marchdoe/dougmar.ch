import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilityStrip() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(22px, 6vw, 56px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
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
          fontVariant: 'all-small-caps',
          letterSpacing: '0.03em',
          fontSize: '2xl',
          color: 'text',
          marginBottom: '12px',
        })}
      >
        Capabilities
      </h2>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          paddingTop: '16px',
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'field',
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '28px',
          rowGap: '10px',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              fontSize: 'md',
              color: 'textMuted',
              fontVariant: 'all-small-caps',
              letterSpacing: 'wide',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  )
}
