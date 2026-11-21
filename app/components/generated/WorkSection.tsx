import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedWork } from './FeaturedWork'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'
import { WorkIndex } from './WorkIndex'

export function WorkSection() {
  return (
    <Reveal
      className={css({
        paddingTop: { base: '48px', lg: '72px' },
        paddingInline: '6vw',
        paddingBottom: { base: '40px', lg: '56px' },
      })}
    >
      <SectionHead title="Selected Work" note="Build and design, one desk" />
      {featuredProject ? <FeaturedWork project={featuredProject} /> : null}
      <WorkIndex label="Projects" items={selectedWork} />
      <WorkIndex label="Experiments" items={experiments} />
    </Reveal>
  )
}
