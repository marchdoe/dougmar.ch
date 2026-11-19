import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionHead } from './SectionHead'

export function CapabilitiesSection() {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        color: 'text',
        paddingInline: '6vw',
        paddingTop: '6',
        paddingBottom: '40px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead title="Capabilities" tag={`${capabilities.length} disciplines`} />
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          rowGap: '3',
          columnGap: '5',
          marginTop: '5',
        })}
      >
        {capabilities.map((c) => (
          <span
            key={c}
            className={css({
              fontSize: 'sm',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              color: 'text',
              borderBottom: '1px solid',
              borderColor: 'borderStrong',
              paddingBottom: '1',
            })}
          >
            {c}
          </span>
        ))}
      </div>
    </section>
  )
}
