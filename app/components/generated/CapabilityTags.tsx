import { css } from '../../../styled-system/css'

export function CapabilityTags({ items }: { items: string[] }) {
  return (
    <section
      aria-label="Capabilities"
      className={css({
        bg: 'bgAlt',
        paddingBlock: 'clamp(40px, 6vw, 64px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        borderTopWidth: '1px',
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
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'accent',
          marginBottom: '18px',
        })}
      >
        Capabilities
      </div>
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3',
        })}
      >
        {items.map((item) => (
          <li
            key={item}
            className={css({
              fontFamily: 'body',
              textStyle: 'sm',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              color: 'text',
              bg: 'surface',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              paddingBlock: '2',
              paddingInline: '3',
            })}
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}
