import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilitiesBand() {
  return (
    <section
      aria-label="Capabilities"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(40px, 5vw, 72px)',
        paddingInline: '5vw',
        display: 'grid',
        gridTemplateColumns: {
          base: '1fr',
          md: 'repeat(2, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        columnGap: 'clamp(24px, 3vw, 48px)',
        rowGap: '14px',
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
          gridColumn: '1 / -1',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(40px, 5vw, 72px)',
          lineHeight: '1',
          marginBottom: '10px',
          color: 'fieldInk',
        })}
      >
        Capabilities
      </h2>
      {capabilities.map((item) => (
        <span
          key={item}
          className={css({
            display: 'block',
            fontSize: '18px',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontWeight: 'bold',
            color: 'fieldInk',
            paddingBottom: '6px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'fieldBorder',
          })}
        >
          {item}
        </span>
      ))}
    </section>
  )
}
