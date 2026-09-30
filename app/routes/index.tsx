import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { FeaturedArtifact, FeaturedMeta } from '../components/generated/FeaturedArtifact'
import { HeroField } from '../components/generated/HeroField'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroField tall meta={<FeaturedMeta />}>
        <FeaturedArtifact />
      </HeroField>
      <SiteCallout />
      <WorkIndex />
    </>
  )
}
