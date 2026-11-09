import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { CaseRail } from '../components/generated/CaseRail'
import { ClientSet } from '../components/generated/ClientSet'
import { Reveal } from '../components/generated/Reveal'
import { WorkHero } from '../components/generated/WorkHero'
import { WhitePaper } from '../components/WhitePaper'
import { projects } from '../content/projects'

type Project = (typeof projects)[number]

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkMissing() {
  return (
    <section
      className={css({
        paddingBlock: 'clamp(44px, 6vw, 88px)',
        paddingInline: 'clamp(16px, 5vw, 80px)',
      })}
    >
      <h1
        className={css({
          textStyle: '3xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'text',
          marginBottom: '16px',
        })}
      >
        Nothing at this address
      </h1>
      <a
        href="/work"
        className={css({ textStyle: 'sm', color: 'accent', textDecoration: 'underline' })}
      >
        See the work
      </a>
    </section>
  )
}

function CaseClients({ project }: { project: Project }) {
  return (
    <Reveal>
      <ClientSet project={project} />
    </Reveal>
  )
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return <WorkMissing />
  return (
    <>
      <WorkHero project={project}>
        {project.slug === 'dougmar-ch' ? null : <CaseRail project={project} />}
      </WorkHero>
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseClients project={project} />}
    </>
  )
}
