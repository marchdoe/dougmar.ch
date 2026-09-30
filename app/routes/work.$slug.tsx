import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { WhitePaper } from '../components/WhitePaper'
import { CaseStudy } from '../components/generated/CaseStudy'
import { HeroField } from '../components/generated/HeroField'
import { HeroMeta } from '../components/generated/HeroMeta'
import { WorkHero } from '../components/generated/WorkHero'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function MissingProject() {
  return (
    <HeroField meta={<HeroMeta kicker="Case study" line="" />}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
          marginTop: 'auto',
          paddingTop: '8',
        })}
      >
        <h1 className={css({ fontFamily: 'display', fontWeight: 'normal', textStyle: '4xl' })}>
          Project not found
        </h1>
        <a
          href="/"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '4',
            color: 'textMuted',
          })}
        >
          Back to the work
        </a>
      </div>
    </HeroField>
  )
}

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <MissingProject />
  return (
    <>
      <WorkHero project={project} />
      {project.slug === 'dougmar-ch' ? <WhitePaper /> : <CaseStudy project={project} />}
    </>
  )
}
