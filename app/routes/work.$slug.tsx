import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { Hero } from '../components/generated/Hero'
import { BodyGrid } from '../components/generated/BodyGrid'
import { DesignedPanel, BuiltPanel } from '../components/generated/Panel'
import { CaseNarrative } from '../components/generated/CaseNarrative'
import { WhitePaper } from '../components/generated/WhitePaper'
import { SpecLedger } from '../components/generated/SpecLedger'
import { PrevNext } from '../components/generated/PrevNext'
import { ClosingLine } from '../components/generated/ClosingLine'
import { projects } from '../content/projects'
import { identity } from '../content/about'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

type WhitePaperFields = {
  context?: string
  constraints?: string[]
  process?: { phase: string; does: string; produces: string }[]
  decisions?: { decision: string; why: string }[]
  references?: { title: string; url: string; note?: string }[]
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]

  if (!project) {
    return (
      <div className={css({ px: '4', py: '9' })}>
        <h1 className={css({ textStyle: 'hero' })}>Not found</h1>
      </div>
    )
  }

  const prev = index > 0 ? projects[index - 1] : undefined
  const next = index < projects.length - 1 ? projects[index + 1] : undefined
  const wp = project as typeof project & WhitePaperFields

  return (
    <>
      <Hero
        word={project.title}
        eyebrow={`${project.type}. ${project.year}.`}
        deck={project.problem ?? project.description ?? ''}
      />
      <BodyGrid
        left={
          <DesignedPanel note="the case">
            <CaseNarrative
              problem={project.problem}
              approach={project.approach}
              outcome={project.outcome}
            />
            <WhitePaper
              context={wp.context}
              constraints={wp.constraints}
              process={wp.process}
              decisions={wp.decisions}
              references={wp.references}
            />
          </DesignedPanel>
        }
        right={
          <BuiltPanel note="the spec">
            <SpecLedger
              role={project.role}
              year={project.year}
              type={project.type}
              stack={project.stack}
              liveUrl={project.liveUrl}
            />
            <PrevNext
              prevHref={prev ? `/work/${prev.slug}` : undefined}
              prevLabel={prev?.title}
              nextHref={next ? `/work/${next.slug}` : undefined}
              nextLabel={next?.title}
            />
            <ClosingLine
              firstHref="/"
              firstLabel="all the work"
              secondHref="/about"
              secondLabel="about"
              email={identity.email}
            />
          </BuiltPanel>
        }
      />
    </>
  )
}
