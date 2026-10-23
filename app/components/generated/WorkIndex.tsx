import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { IndexBlock } from './IndexBlock'

const selected = selectedWork.map((p) => ({
  slug: p.slug,
  title: p.title,
  type: p.type,
  year: p.year,
  href: `/work/${p.slug}`,
}))
const things = experiments.map((p) => ({
  slug: p.slug,
  title: p.title,
  type: p.type,
  year: p.year,
  href: p.externalUrl ?? `/work/${p.slug}`,
}))

export function WorkIndex() {
  return (
    <section
      id="work"
      className={css({
        paddingBlock: 'clamp(48px, 7vw, 112px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <IndexBlock
        heading="selected work"
        count={`${String(selected.length).padStart(2, '0')} projects`}
        items={selected}
      />
      <IndexBlock
        heading="experiments"
        count={`${String(things.length).padStart(2, '0')} things`}
        items={things}
      />
    </section>
  )
}
