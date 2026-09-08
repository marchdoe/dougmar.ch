import { createFileRoute } from '@tanstack/react-router'
import { Stage } from '../components/generated/Stage'
import { WorkIndexSection } from '../components/generated/WorkIndexSection'
import { featuredProject, selectedWork, experiments } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <Stage />
      <WorkIndexSection
        featured={featuredProject}
        selected={selectedWork}
        experiments={experiments}
      />
    </>
  )
}
