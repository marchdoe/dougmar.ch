import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseLinks, CaseSections } from '../components/generated/CaseSections'
import { EvidenceHead } from '../components/generated/EvidenceHead'
import { HeroStatement } from '../components/generated/HeroStatement'
import { MetaRows } from '../components/generated/MetaRows'
import { EvidencePanel, Split } from '../components/generated/Split'
import { Thesis } from '../components/generated/Thesis'
import { projects } from '../content/projects'

type Project = (typeof projects)[number]

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkHero({ project }: { project: Project }) {
  return (
    <Thesis>
      <HeroStatement scale="work" eyebrow={`Case record · ${project.type}`} word={project.title}>
        <MetaRows project={project} />
      </HeroStatement>
    </Thesis>
  )
}

function CaseStudy({ project }: { project: Project }) {
  return (
    <Split>
      <WorkHero project={project} />
      <EvidencePanel>
        <EvidenceHead title="Case record" count={String(project.year)} />
        <CaseSections project={project} />
        <CaseLinks project={project} />
      </EvidencePanel>
    </Split>
  )
}

function Missing() {
  return (
    <Thesis>
      <HeroStatement scale="work" eyebrow="Case record" word="Not found">
        <a
          href="/work"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            color: 'fieldInk',
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: 'sm',
            _hover: { color: 'fieldInkMuted' },
          })}
        >
          Back to the work index
        </a>
      </HeroStatement>
    </Thesis>
  )
}

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <Missing />
  return project.slug === 'dougmar-ch' ? (
    <>
      <WorkHero project={project} />
      <WhitePaper />
    </>
  ) : (
    <CaseStudy project={project} />
  )
}
