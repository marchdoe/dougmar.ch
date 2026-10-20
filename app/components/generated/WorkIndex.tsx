import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { WorkList } from './WorkList'

export function WorkIndex() {
  const work = selectedWork.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: `/work/${p.slug}`,
  }))
  const lab = experiments.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: p.externalUrl ?? `/work/${p.slug}`,
  }))
  return (
    <section
      id="work"
      className={css({
        bg: 'bgAlt',
        paddingBlock: 'clamp(48px, 6vw, 88px)',
        paddingInline: 'clamp(28px, 6vw, 112px)',
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
          display: 'grid',
          gap: 'clamp(36px, 5vw, 72px)',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', md: '1fr 1fr' },
        })}
      >
        <WorkList label="Selected Work" items={work} />
        <WorkList label="Experiments" items={lab} />
      </div>
    </section>
  )
}
