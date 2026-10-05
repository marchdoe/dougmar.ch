import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { HustleChart } from './HustleChart'
import { WorkRows } from './WorkRows'

export function WorkIndex() {
  const work = selectedWork.map((p) => ({
    key: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: `/work/${p.slug}`,
  }))
  const quests = experiments.map((p) => ({
    key: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: p.externalUrl ?? `/work/${p.slug}`,
  }))
  return (
    <section
      id="work"
      className={css({
        bg: 'surface',
        borderTopWidth: '3px',
        borderTopStyle: 'solid',
        borderTopColor: 'field',
        paddingBlock: 'clamp(22px, 6vw, 56px)',
        paddingInline: 'clamp(20px, 6vw, 80px)',
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
          display: { base: 'block', lg: 'grid' },
          gridTemplateColumns: { lg: '7fr 5fr' },
          gap: { lg: 'clamp(32px, 5vw, 72px)' },
          alignItems: { lg: 'start' },
        })}
      >
        <div>
          <WorkRows heading="Selected work" unit="projects" rows={work} />
          <WorkRows heading="Experiments" unit="side quests" rows={quests} />
        </div>
        <HustleChart />
      </div>
    </section>
  )
}
