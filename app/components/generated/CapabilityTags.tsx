import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionLabel } from './SectionLabel'

export function CapabilityTags() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: '6',
        paddingInline: 'clamp(40px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel>Capabilities</SectionLabel>
      <ul
        className={css({
          listStyle: 'none',
          padding: '0',
          margin: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {capabilities.map((cap) => (
          <li
            key={cap}
            className={css({
              fontFamily: 'display',
              fontVariant: 'small-caps',
              textTransform: 'lowercase',
              letterSpacing: 'wide',
              fontSize: 'base',
              color: 'text',
              paddingBlock: '2',
              paddingInline: '3',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'fieldBorder',
              borderRadius: 'sm',
            })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </section>
  )
}
