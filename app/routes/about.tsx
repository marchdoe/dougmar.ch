import { createFileRoute } from '@tanstack/react-router'
import { AboutCapabilities } from '../components/generated/AboutCapabilities'
import { AboutEducation } from '../components/generated/AboutEducation'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { AboutStatement } from '../components/generated/AboutStatement'
import { AboutTimeline } from '../components/generated/AboutTimeline'
import { FieldHero } from '../components/generated/FieldHero'
import { HeroGrid } from '../components/generated/HeroGrid'
import { Rail } from '../components/generated/Rail'
import { Reveal } from '../components/generated/Reveal'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <HeroGrid
        field={
          <FieldHero>
            <AboutStatement />
          </FieldHero>
        }
        rail={
          <Rail label="Off the clock">
            <AboutPersonal />
          </Rail>
        }
      />
      <Reveal>
        <AboutTimeline />
      </Reveal>
      <Reveal>
        <AboutCapabilities />
      </Reveal>
      <Reveal>
        <AboutEducation />
      </Reveal>
    </>
  )
}
