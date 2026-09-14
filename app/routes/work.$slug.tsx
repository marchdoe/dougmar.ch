import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { projects } from '../content/projects'
import { CaseStudyHero } from '../components/generated/CaseStudyHero'
import { CaseStudyNarrative } from '../components/generated/CaseStudyNarrative'
import { CaseStudyStack } from '../components/generated/CaseStudyStack'
import { ClientLedger } from '../components/generated/ClientLedger'
import { WhitePaperContext } from '../components/generated/WhitePaperContext'
import { WhitePaperProcess } from '../components/generated/WhitePaperProcess'
import { WhitePaperDecisions } from '../components/generated/WhitePaperDecisions'
import { WhitePaperReferences } from '../components/generated/WhitePaperReferences'
import { Section } from '../components/generated/Section'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

type WhitePaper = {
  context?: string
  constraints?: string[]
  process?: { phase: string; does: string; produces: string }[]
  decisions?: { decision: string; why: string }[]
  references?: { title: string; url: string; note?: string }[]
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <section className={css({ bg: 'bg', padding: '10 5' })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '4xl',
            color: 'text',
          })}
        >
          Not found
        </h1>
      </section>
    )
  }

  const wp = project as typeof project & WhitePaper

  return (
    <>
      <CaseStudyHero project={project} />
      <Section>
        <CaseStudyNarrative
          problem={project.problem}
          approach={project.approach}
          outcome={project.outcome}
        />
      </Section>
      <Section>
        <WhitePaperContext context={wp.context} constraints={wp.constraints} />
      </Section>
      <Section>
        <WhitePaperProcess process={wp.process} />
      </Section>
      <Section>
        <WhitePaperDecisions decisions={wp.decisions} />
      </Section>
      <Section>
        <WhitePaperReferences references={wp.references} />
      </Section>
      <Section>
        <CaseStudyStack stack={project.stack} liveUrl={project.liveUrl} />
      </Section>
      {project.clients && (
        <Section>
          <ClientLedger clients={project.clients} />
        </Section>
      )}
    </>
  )
}
