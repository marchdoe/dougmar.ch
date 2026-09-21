import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { projects } from '../content/projects'
import { WhitePaper } from '../components/WhitePaper'
import { CaseStudyHero } from '../components/generated/CaseStudyHero'
import { CaseStudyBody } from '../components/generated/CaseStudyBody'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((item) => item.slug === slug)

  if (!project) {
    return (
      <section
        className={css({
          bg: 'field',
          paddingBlock: '9',
          paddingInline: { base: '6vw', lg: '5vw' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: '3xl',
            color: 'fieldInk',
          })}
        >
          Project not found.
        </h1>
      </section>
    )
  }

  return (
    <>
      <CaseStudyHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudyBody project={project} />}
    </>
  )
}
