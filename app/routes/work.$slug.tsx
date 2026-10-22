import { createFileRoute } from '@tanstack/react-router'
import { WhitePaper } from '../components/WhitePaper'
import { CaseBody } from '../components/generated/CaseBody'
import { TitleHeading } from '../components/generated/Headings'
import { MissingProject } from '../components/generated/MissingProject'
import { SplitGrid } from '../components/generated/Panel'
import { ThesisPanel } from '../components/generated/Thesis'
import { projects } from '../content/projects'

export const Route = createFileRoute('/work/$slug')({ component: WorkPage })

function WorkPage() {
  const { slug } = Route.useParams()
  const project = projects.find((p) => p.slug === slug)
  if (!project) return <MissingProject />
  const facts = [String(project.year), project.type, project.role ?? '']
  if (project.slug === 'dougmar-ch') {
    return (
      <>
        <ThesisPanel>
          <TitleHeading title={project.title} facts={facts} />
        </ThesisPanel>
        <WhitePaper />
      </>
    )
  }
  return (
    <SplitGrid>
      <ThesisPanel pinned>
        <TitleHeading title={project.title} facts={facts} />
      </ThesisPanel>
      <CaseBody project={project} />
    </SplitGrid>
  )
}
