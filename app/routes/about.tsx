import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { AboutSpine } from '../components/generated/AboutSpine'
import { Reveal } from '../components/generated/Reveal'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero />
      <Reveal>
        <AboutSpine />
      </Reveal>
      <Reveal>
        <AboutPersonal />
      </Reveal>
    </>
  )
}
