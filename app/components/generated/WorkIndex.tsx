import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedCard } from './FeaturedCard'
import { SectionHead } from './SectionHead'
import { WorkRow } from './WorkRow'

const rows = css({ display: 'flex', flexDirection: 'column' })

export function WorkIndex() {
  const offset = selectedWork.length
  return (
    <section
      id="work"
      aria-labelledby="work-head"
      className={css({
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
        paddingBottom: '56px',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead id="work-head" title="Selected work" meta="2008–2026" />
      {featuredProject ? <FeaturedCard project={featuredProject} /> : null}
      <div className={rows}>
        {selectedWork.map((p, i) => (
          <WorkRow
            key={p.slug}
            num={String(i + 1).padStart(2, '0')}
            title={p.title}
            type={p.type}
            year={p.year}
            href={`/work/${p.slug}`}
          />
        ))}
      </div>
      <SectionHead tight title="Experiments" meta="Smaller swings" />
      <div className={rows}>
        {experiments.map((p, i) => (
          <WorkRow
            key={p.slug}
            num={String(offset + i + 1).padStart(2, '0')}
            title={p.title}
            type={p.type}
            year={p.year}
            href={p.externalUrl ?? `/work/${p.slug}`}
          />
        ))}
      </div>
    </section>
  )
}
