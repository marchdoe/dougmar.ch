import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { projects } from '../content/projects'
import { WhitePaper } from '../components/WhitePaper'
import { WorkHero } from '../components/generated/WorkHero'
import { CaseStudyBody } from '../components/generated/CaseStudyBody'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return (
      <section
        className={css({
          bg: 'bg',
          paddingInline: '6vw',
          paddingBlock: '9',
          minHeight: '46vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: '3xl',
            color: 'text',
          })}
        >
          Not found.
        </h1>
      </section>
    )
  }

  return (
    <>
      <WorkHero
        title={project.title}
        meta={{
          type: project.type,
          year: project.year,
          role: project.role,
          timeline: undefined,
          status: undefined,
        }}
      />
      {project.slug === 'dougmar-ch' ? (
        <WhitePaper />
      ) : (
        <CaseStudyBody
          study={{
            problem: project.problem,
            approach: project.approach,
            outcome: project.outcome,
            stack: project.stack,
            liveUrl: project.liveUrl,
          }}
        />
      )}
    </>
  )
}
