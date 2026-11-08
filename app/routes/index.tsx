import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HeroSplit } from '../components/generated/HeroSplit'
import { Standfirst } from '../components/generated/Standfirst'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroSplit />
      <Standfirst />
      <WorkIndex />
      <SiteCallout />
    </>
  )
}
