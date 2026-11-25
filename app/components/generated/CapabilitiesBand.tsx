import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilitiesBand() {
  return (
    <section
      aria-labelledby="capabilities"
      className={css({
        marginTop: '7',
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        paddingTop: '14px',
        paddingBottom: '6',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <h2
        id="capabilities"
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontWeight: 'bold',
          textStyle: 'xs',
          color: 'accent',
          marginBottom: '14px',
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
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              textStyle: 'sm',
              color: 'text',
              border: '1px solid',
              borderColor: 'border',
              bg: 'surface',
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
