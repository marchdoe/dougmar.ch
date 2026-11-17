import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionHead } from './SectionHead'

export function CapabilityTags() {
  return (
    <section
      className={css({
        marginTop: 'clamp(32px, 5vw, 56px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead label="Capabilities" aside={`${capabilities.length} disciplines`} />
      <ul
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          listStyle: 'none',
          padding: '0',
          margin: '0',
          maxWidth: 'none',
        })}
      >
        {capabilities.map((cap) => (
          <li
            key={cap}
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              textStyle: 'sm',
              color: 'accentText',
              bg: 'accent',
              borderRadius: 'sm',
              paddingBlock: '4px',
              paddingInline: '10px',
              lineHeight: '1.4',
            })}
          >
            {cap}
          </li>
        ))}
      </ul>
    </section>
  )
}
