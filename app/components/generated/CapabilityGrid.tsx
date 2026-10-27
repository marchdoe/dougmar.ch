import { css } from '../../../styled-system/css'

export function CapabilityGrid({ items }: { items: string[] }) {
  return (
    <section
      className={css({
        bg: 'surface',
        color: 'text',
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        paddingBlock: 'clamp(32px, 5vw, 72px)',
        paddingInline: 'clamp(18px, 6vw, 96px)',
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
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: '0.11em',
          fontSize: '2xs',
          fontWeight: 'bold',
          color: 'textMuted',
          marginBottom: '4',
        })}
      >
        Capabilities
      </h2>
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
          listStyle: 'none',
          margin: '0',
          padding: '0',
        })}
      >
        {items.map((item) => (
          <li
            key={item}
            className={css({
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'sm',
              paddingBlock: '6px',
              paddingInline: '10px',
              fontFamily: 'body',
              fontSize: 'sm',
              color: 'text',
            })}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
