import { css } from '../../../styled-system/css'

export function CapabilitiesSection({ items }: { items: string[] }) {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bgAlt',
        paddingTop: { base: '6', md: '8' },
        paddingBottom: { base: '8', md: '10' },
        paddingLeft: { base: '5', md: '6vw' },
        paddingRight: { base: '5', md: '6vw' },
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
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'accent',
          marginBottom: '5',
        })}
      >
        capabilities
      </div>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '3' })}>
        {items.map((item) => (
          <span
            key={item}
            className={css({
              fontFamily: 'display',
              fontSize: 'xs',
              textTransform: 'lowercase',
              color: 'text',
              border: '1px solid',
              borderColor: 'border',
              borderRadius: 'sm',
              paddingTop: '2',
              paddingBottom: '2',
              paddingLeft: '3',
              paddingRight: '3',
            })}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
