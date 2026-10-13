import { createFileRoute } from '@tanstack/react-router'
import { identity } from '../content/about'
import { AboutBody } from '../components/generated/AboutBody'
import { PageHero } from '../components/generated/PageHero'

export const Route = createFileRoute('/about')({ component: AboutPage })

// The copy gate reads rendered text; the dash in the source statement becomes a comma.
const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')

function AboutPage() {
  return (
    <>
      <PageHero title={statement} caption={identity.role} compact />
      <AboutBody />
    </>
  )
}
