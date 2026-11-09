import { createFileRoute } from '@tanstack/react-router'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { AboutSplit } from '../components/generated/AboutSplit'
import { Reveal } from '../components/generated/Reveal'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutSplit />
      <Reveal>
        <AboutPersonal />
      </Reveal>
    </>
  )
}
