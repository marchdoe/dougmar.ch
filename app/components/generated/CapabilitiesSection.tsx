import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilitiesSection() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(40px, 6vh, 88px)',
        paddingInline: 'clamp(24px, 6vw, 96px)',
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
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(26px, 3.4vw, 38px)',
          color: 'text',
          marginBottom: '5',
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
              bg: 'surface',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'sm',
              paddingBlock: '1',
              paddingInline: '3',
              fontFamily: 'body',
              fontSize: 'sm',
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
