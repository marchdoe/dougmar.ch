import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { Experiments } from '../components/generated/Experiments'
import { HomeStage } from '../components/generated/HomeStage'
import { PageLinks } from '../components/generated/PageLinks'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HomeStage />
      <Experiments />
      <PageLinks />
      <SiteCallout />
    </>
  )
}
