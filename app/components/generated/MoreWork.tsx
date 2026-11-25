import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { WorkList } from './WorkList'

export function MoreWork({ slug }: { slug: string }) {
  const others = projects.filter((p) => p.slug !== slug)
  return (
    <section
      aria-label="More work"
      className={css({
        paddingTop: '28px',
        paddingBottom: '6',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <WorkList heading="More work" items={others} />
    </section>
  )
}
