import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutRecord } from '../components/generated/AboutRecord'
import { PersonalLedger } from '../components/generated/PersonalLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutRecord />
      <PersonalLedger />
    </>
  )
}
