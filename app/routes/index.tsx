import { createFileRoute } from '@tanstack/react-router'
import { HeroThesis } from '../components/generated/HeroThesis'
import { ClientLedger } from '../components/generated/ClientLedger'
import { WorkIndex } from '../components/generated/WorkIndex'
import { Section } from '../components/generated/Section'
import { featuredProject, selectedWork, experiments } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroThesis project={featuredProject} />
      <Section>
        <ClientLedger clients={featuredProject?.clients ?? []} />
      </Section>
      <Section>
        <WorkIndex selectedWork={selectedWork} experiments={experiments} studio={featuredProject} />
      </Section>
    </>
  )
}
