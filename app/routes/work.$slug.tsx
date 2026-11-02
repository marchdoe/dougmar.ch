import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseHero } from '../components/generated/CaseHero'
import { CaseStudy } from '../components/generated/CaseStudy'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function NotFound() {
  return (
    <section className={css({ paddingBlock: '64px', paddingInline: { base: '6vw', lg: '5vw' } })}>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(36px, 6vw, 72px)',
          lineHeight: '1',
          color: 'text',
        })}
      >
        No project by that name.
      </h1>
      <a
        href="/#work"
        className={css({ display: 'inline-block', marginTop: '24px', fontWeight: 'bold' })}
      >
        Back to the work index
      </a>
    </section>
  )
}

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <NotFound />
  return (
    <>
      <CaseHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
