import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHero } from '../components/generated/CaseHero'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function MissingCase() {
  return (
    <section
      className={css({ bg: 'field', color: 'fieldInk', paddingInline: '6vw', paddingBlock: '8' })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '3xl',
          lineHeight: '0.95',
          color: 'fieldInk',
        })}
      >
        Case not found
      </h1>
      <a
        href="/#work"
        className={css({
          display: 'inline-block',
          marginTop: '5',
          paddingBlock: '2',
          color: 'fieldInk',
          borderBottom: '1px solid',
          borderColor: 'fieldBorder',
        })}
      >
        Back to the work index
      </a>
    </section>
  )
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <MissingCase />
  return (
    <>
      <CaseHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
    </>
  )
}
