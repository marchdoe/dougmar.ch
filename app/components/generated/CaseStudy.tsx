import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { LiveLink, Lede, ProseBlock, StackRow } from './CaseParts'
import { PeerList } from './PeerList'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  return (
    <section
      className={css({
        paddingInline: { base: '7vw', md: '6vw' },
        paddingTop: '4',
        paddingBottom: '8',
      })}
    >
      <Lede text={project.problem} />
      <ProseBlock heading="Overview" text={project.description} />
      <ProseBlock heading="Approach" text={project.approach} />
      <ProseBlock heading="Outcome" text={project.outcome} />
      <StackRow stack={project.stack} />
      <LiveLink url={project.liveUrl ?? project.externalUrl} />
      <PeerList current={project.slug} />
    </section>
  )
}
