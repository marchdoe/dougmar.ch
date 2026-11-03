import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { CaseStudy } from '../components/generated/CaseStudy'
import { WorkHeader } from '../components/generated/WorkHeader'
import { WhitePaper } from '../components/WhitePaper'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkMissing() {
  return (
    <section
      className={css({
        textAlign: 'right',
        paddingBlock: '64px',
        paddingLeft: { base: '20px', md: '48px', lg: '40px' },
        paddingRight: { base: '20px', md: '48px', lg: '5vw' },
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontSize: { base: 'clamp(28px,8.5vw,34px)', lg: 'clamp(40px,4.4vw,60px)' },
          textTransform: 'lowercase',
          fontVariant: 'small-caps',
          letterSpacing: '0.02em',
          fontWeight: 'normal',
          color: 'accent',
        })}
      >
        No such project.
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-block',
          marginTop: '16px',
          fontSize: 'sm',
          fontWeight: '600',
          color: 'text',
        })}
      >
        Back to the work
      </a>
    </section>
  )
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((candidate) => candidate.slug === slug)
  if (!project) return <WorkMissing />
  return (
    <>
      <WorkHeader project={project} showLabels={project.slug !== 'dougmar-ch'} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
