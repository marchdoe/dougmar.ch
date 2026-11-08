import { createFileRoute } from '@tanstack/react-router'
import { AboutCredentials } from '../components/generated/AboutCredentials'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { AboutStatement } from '../components/generated/AboutStatement'
import { AboutTimeline } from '../components/generated/AboutTimeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutStatement />
      <AboutTimeline />
      <AboutCredentials />
      <AboutPersonal />
    </>
  )
}
