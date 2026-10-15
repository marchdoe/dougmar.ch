import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { CaseHead } from '../components/generated/CaseHead'
import { CaseRail } from '../components/generated/CaseRail'
import { FieldHero } from '../components/generated/FieldHero'
import { HeroGrid } from '../components/generated/HeroGrid'
import { Rail } from '../components/generated/Rail'
import { Reveal } from '../components/generated/Reveal'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkDetailPage })

function WorkDetailPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) {
    return (
      <FieldHero>
        <CaseHead title="Project not found" type="Work" />
      </FieldHero>
    )
  }
  return (
    <>
      <HeroGrid
        field={
          <FieldHero>
            <CaseHead title={project.title} type={project.type} />
          </FieldHero>
        }
        rail={
          <Rail label="Project">
            <CaseRail project={project} />
          </Rail>
        }
      />
      {project.slug === 'dougmar-ch' ? (
        <WhitePaper />
      ) : (
        <Reveal>
          <CaseBody project={project} />
        </Reveal>
      )}
    </>
  )
}
