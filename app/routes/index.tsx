import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { Field } from '../components/generated/Field'
import { HomeHero } from '../components/generated/HomeHero'
import { HomeSignals } from '../components/generated/HomeSignals'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <Field>
        <HomeHero />
        <HomeSignals />
      </Field>
      <SiteCallout />
    </>
  )
}
