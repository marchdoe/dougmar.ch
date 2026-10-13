import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedProject } from './FeaturedProject'
import { ProjectGrid } from './ProjectGrid'
import { SectionHead } from './SectionHead'

const sectionCss = css({
  position: 'relative',
  zIndex: 1,
  bg: 'bgAlt',
  color: 'text',
  paddingBlock: '9vh',
  paddingInline: '6vw',
  borderTopWidth: '2px',
  borderTopStyle: 'solid',
  borderTopColor: 'borderStrong',
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

const spacedCss = css({ marginTop: '56px' })

const selected = selectedWork.map((p) => ({
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

export function WorkIndex() {
  return (
    <section id="work" className={sectionCss}>
      <SectionHead title="Selected Work" eyebrow="Judged by the finish" />
      {featuredProject ? <FeaturedProject project={featuredProject} /> : null}
      <ProjectGrid items={selected} />
      <div className={spacedCss}>
        <SectionHead title="Experiments" eyebrow="Shipped, then let go" />
      </div>
      <ProjectGrid items={lab} muted />
    </section>
  )
}
