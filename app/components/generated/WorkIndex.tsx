import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedEntry } from './FeaturedEntry'
import { WorkRows } from './WorkRows'

export function WorkIndex() {
  return (
    <section
      id="work"
      className={css({
        bg: 'surface',
        color: 'text',
        borderTop: '2px solid',
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
          paddingBlock: 'clamp(32px, 5vw, 72px)',
          paddingInline: 'clamp(18px, 6vw, 96px)',
        })}
      >
        <div
          className={css({
            fontFamily: 'body',
            textTransform: 'uppercase',
            letterSpacing: '0.11em',
            fontSize: '2xs',
            fontWeight: 'bold',
            color: 'textMuted',
            marginBottom: '4',
          })}
        >
          Featured
        </div>
        {featuredProject ? <FeaturedEntry project={featuredProject} /> : null}
        <WorkRows label="Selected work" items={selectedWork} external={false} />
        <WorkRows label="Experiments" items={experiments} external />
      </div>
    </section>
  )
}
