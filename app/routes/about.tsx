import { createFileRoute } from '@tanstack/react-router'
import { AboutCapabilities } from '../components/generated/AboutCapabilities'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { AboutTimeline } from '../components/generated/AboutTimeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutTimeline />
      <AboutCapabilities />
      <AboutPersonal />
    </>
  )
}
