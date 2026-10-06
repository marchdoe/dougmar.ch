import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHero } from '../components/generated/HomeHero'
import { Ledger } from '../components/generated/Ledger'
import { SplitHero } from '../components/generated/SplitHero'
import { WorkSection } from '../components/generated/WorkSection'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <SplitHero rail={<Ledger />}>
        <HomeHero />
      </SplitHero>
      <WorkSection />
      <SiteCallout />
    </>
  )
}
