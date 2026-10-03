import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionHeading } from './SectionHeading'

export function CapabilitiesSection() {
  return (
    <section
      className={css({
        maxWidth: '720px',
        marginInline: 'auto',
        paddingTop: '64px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        boxSizing: 'content-box',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHeading label="in the bag" title="capabilities" flush />
      <ul
        className={css({
          listStyle: 'none',
          padding: '0',
          margin: '0',
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '8px',
          columnGap: '20px',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              fontSize: 'sm',
              color: 'text',
              textTransform: 'lowercase',
              paddingBottom: '2px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  )
}
