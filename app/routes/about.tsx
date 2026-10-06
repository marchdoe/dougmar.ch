import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutRail } from '../components/generated/AboutRail'
import { SplitHero } from '../components/generated/SplitHero'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <SplitHero rail={<AboutRail />}>
      <AboutHero />
    </SplitHero>
  )
}
