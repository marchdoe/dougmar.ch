import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHero } from '../components/generated/CaseHero'
import { FootIndex } from '../components/generated/FootIndex'
import { Masthead } from '../components/generated/Masthead'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetail })

type Project = (typeof projects)[number]

function CaseStudy({ project }: { project: Project }) {
  return (
    <>
      <CaseHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseBody project={project} />}
      <FootIndex />
    </>
  )
}

function CaseMissing() {
  return (
    <>
      <Masthead>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'clamp(38px, 9vw, 128px)',
            lineHeight: '0.9',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            color: 'fieldInk',
          })}
        >
          Not found
        </h1>
      </Masthead>
      <FootIndex />
    </>
  )
}

function WorkDetail() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  return project ? <CaseStudy project={project} /> : <CaseMissing />
}
