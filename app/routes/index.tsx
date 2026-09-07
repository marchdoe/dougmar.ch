import { createFileRoute } from '@tanstack/react-router'
import { HeroIntro } from '../components/generated/HeroIntro'
import { FeaturedInterjection } from '../components/generated/FeaturedInterjection'
import { HomeFieldPayoff } from '../components/generated/HomeFieldPayoff'
import { SiteColophon } from '../components/generated/SiteColophon'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroIntro />
      <FeaturedInterjection />
      <HomeFieldPayoff />
      <SiteColophon />
    </>
  )
}
