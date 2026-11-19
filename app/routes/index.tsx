import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { ClientLedger } from '../components/generated/ClientLedger'
import { HeroArtifact, HeroPhrase } from '../components/generated/HeroArtifact'
import { WorkSection } from '../components/generated/WorkSection'
import { featuredProject } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      {featuredProject ? <HeroArtifact project={featuredProject} /> : <HeroPhrase />}
      {featuredProject && <ClientLedger project={featuredProject} />}
      <WorkSection />
      <SiteCallout />
    </>
  )
}
