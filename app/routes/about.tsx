import { createFileRoute } from '@tanstack/react-router'
import { AboutBody } from '../components/generated/AboutBody'
import { AboutHero } from '../components/generated/AboutHero'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutBody />
    </>
  )
}
