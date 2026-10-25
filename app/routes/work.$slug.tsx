import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseStudy, caseMeta } from '../components/generated/CaseStudy'
import type { CaseProject } from '../components/generated/CaseStudy'
import { InteriorHead } from '../components/generated/InteriorHead'
import { KeyValueGrid } from '../components/generated/KeyValueGrid'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

const titleCls = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'light',
  textStyle: '4xl',
  color: 'text',
  maxWidth: '18ch',
})

const backLink = css({
  color: 'accent',
  fontWeight: '500',
  fontSize: 'base',
  _hover: { color: 'accentAlt' },
})

function NotFound() {
  return (
    <InteriorHead
      eyebrow="Work"
      title="No project by that name"
      titleClassName={titleCls}
      meta={
        <a href="/work" className={backLink}>
          See all the work
        </a>
      }
    />
  )
}

function WorkPage() {
  const { slug } = Route.useParams()
  const project: CaseProject | undefined = projects.find((p) => p.slug === slug)
  if (!project) return <NotFound />
  return (
    <>
      <InteriorHead
        eyebrow={project.type}
        title={project.title}
        titleClassName={titleCls}
        meta={<KeyValueGrid items={caseMeta(project)} />}
      />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
