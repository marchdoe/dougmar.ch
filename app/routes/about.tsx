import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutLedger } from '../components/generated/AboutLedger'
import { AboutRecord } from '../components/generated/AboutRecord'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutLedger />
      <AboutRecord />
    </>
  )
}
