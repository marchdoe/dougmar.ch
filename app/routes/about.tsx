import { createFileRoute } from '@tanstack/react-router'
import { AboutBody } from '../components/generated/AboutBody'
import { AboutHero } from '../components/generated/AboutHero'
import { SignalLedger } from '../components/generated/SignalLedger'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutBody />
      <SignalLedger />
    </>
  )
}
