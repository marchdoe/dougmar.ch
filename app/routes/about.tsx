import { createFileRoute } from '@tanstack/react-router'
import { AboutEducation } from '../components/generated/AboutEducation'
import { AboutIntro } from '../components/generated/AboutIntro'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { AboutTimeline } from '../components/generated/AboutTimeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutIntro />
      <AboutTimeline />
      <AboutEducation />
      <AboutPersonal />
    </>
  )
}
