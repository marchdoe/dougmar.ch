import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilitiesSection() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(40px, 6vw, 80px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        bg: 'bgAlt',
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
          fontWeight: 'bold',
          fontStyle: 'italic',
          textTransform: 'uppercase',
          fontSize: 'clamp(18px, 1.5vw, 22px)',
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
          columnGap: '5',
          rowGap: '3',
        })}
      >
        {capabilities.map((cap) => (
          <li
            key={cap}
            className={css({
              fontSize: 'sm',
              textTransform: 'uppercase',
              letterSpacing: 'wide',
              color: 'text',
              display: 'inline-flex',
              alignItems: 'center',
              _before: {
                content: '""',
                display: 'inline-block',
                width: '6px',
                height: '6px',
                bg: 'accent',
                marginRight: '2',
                flexShrink: '0',
              },
            })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </section>
  )
}
