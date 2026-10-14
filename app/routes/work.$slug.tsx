import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHeader } from '../components/generated/CaseHeader'
import { WorkIndex } from '../components/generated/WorkIndex'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function NotFound() {
  return (
    <section
      className={css({
        paddingTop: { base: '14px', lg: '52px' },
        paddingBottom: '7',
        paddingLeft: { base: '20px', lg: '48px' },
        paddingRight: { base: '20px', lg: '6vw' },
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          textStyle: '4xl',
          color: 'accent',
        })}
      >
        not found
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-block',
          minHeight: '44px',
          lineHeight: '44px',
          fontSize: 'sm',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'accentAlt',
        })}
      >
        Back to the work
      </a>
    </section>
  )
}

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <NotFound />
  const others = projects.filter((p) => p.slug !== slug)
  return (
    <>
      <CaseHeader project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
      <WorkIndex heading="more work" items={others} />
    </>
  )
}
