import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

export function CapabilitiesSection() {
  return (
    <section
      className={css({
        paddingBlock: '6',
        paddingInline: '24px',
        borderTop: '2px solid',
        borderColor: 'borderStrong',
        marginTop: '6',
        lg: { paddingInline: '4vw' },
        xl: { paddingInline: '5vw' },
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
          fontStyle: 'italic',
          fontWeight: 'normal',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          fontSize: { base: 'lg', lg: 'xl' },
          color: 'text',
          marginBottom: '4',
        })}
      >
        Capabilities
      </h2>
      <ul className={css({ display: 'flex', flexWrap: 'wrap', rowGap: '2', columnGap: '20px' })}>
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              fontSize: 'sm',
              color: 'textMuted',
              fontVariant: 'small-caps',
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
