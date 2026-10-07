import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionLabel } from './SectionLabel'

export function Capabilities() {
  return (
    <section
      aria-label="Capabilities"
      className={css({
        width: '100%',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel>Capabilities</SectionLabel>
      <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2', paddingTop: '4' })}>
        {capabilities.map((cap) => (
          <span
            key={cap}
            className={css({
              display: 'inline-flex',
              maxWidth: '100%',
              fontFamily: 'body',
              textStyle: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'wider',
              textTransform: 'uppercase',
              color: 'textMuted',
              paddingBlock: '2',
              paddingInline: '3',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'border',
              borderRadius: 'sm',
            })}
          >
            {cap}
          </span>
        ))}
      </div>
    </section>
  )
}
