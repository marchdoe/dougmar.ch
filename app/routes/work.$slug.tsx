import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHero } from '../components/generated/CaseHero'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function MissingProject() {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: 'clamp(44px,5vw,80px)',
        paddingInline: 'var(--pad)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'uppercase',
          textStyle: '3xl',
          color: 'text',
        })}
      >
        Project not found
      </h1>
      <a
        href="/#work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          textStyle: 'base',
          color: 'text',
          textDecoration: 'underline',
        })}
      >
        Back to selected work
      </a>
    </section>
  )
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return <MissingProject />

  return (
    <>
      <CaseHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
    </>
  )
}
