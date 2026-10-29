import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseHero } from '../components/generated/CaseHero'
import { CaseMeta } from '../components/generated/CaseMeta'
import { CaseStudy } from '../components/generated/CaseStudy'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function NotFound() {
  return (
    <section
      className={css({
        paddingInline: { base: '7vw', md: '6vw' },
        paddingTop: '7',
        paddingBottom: '8',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(38px, 7vw, 96px)',
          lineHeight: '0.98',
          color: 'text',
        })}
      >
        No such project.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '4',
          color: 'accent',
        })}
      >
        Back to the work →
      </a>
    </section>
  )
}

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <NotFound />
  const isPaper = project.slug === 'dougmar-ch'
  return (
    <>
      <CaseHero title={project.title}>{isPaper ? null : <CaseMeta project={project} />}</CaseHero>
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
