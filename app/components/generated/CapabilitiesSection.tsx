import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { Kicker } from './Kicker'

export function CapabilitiesSection() {
  return (
    <section
      className={css({
        paddingInline: '5vw',
        paddingBottom: '8',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={css({ maxWidth: '1180px', marginInline: 'auto' })}>
        <Kicker>Capabilities</Kicker>
        <ul className={css({ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {capabilities.map((cap) => (
            <li
              key={cap}
              className={css({
                textStyle: 'sm',
                fontWeight: 'bold',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'text',
                border: '1px solid',
                borderColor: 'borderStrong',
                borderRadius: 'sm',
                paddingBlock: '1',
                paddingInline: '3',
              })}
            >
              {cap}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
