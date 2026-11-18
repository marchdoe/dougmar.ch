import { createFileRoute } from '@tanstack/react-router'
import { AboutBand } from '../components/generated/AboutBand'
import { AboutDetails } from '../components/generated/AboutDetails'
import { AboutStatement } from '../components/generated/AboutStatement'
import { AboutTimeline } from '../components/generated/AboutTimeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutStatement />
      <AboutBand />
      <AboutTimeline />
      <AboutDetails />
    </>
  )
}
