import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { FieldHero } from '../components/generated/FieldHero'
import { HeroGrid } from '../components/generated/HeroGrid'
import { HomeHero } from '../components/generated/HomeHero'
import { HomeSignals } from '../components/generated/HomeSignals'
import { Rail } from '../components/generated/Rail'
import { Reveal } from '../components/generated/Reveal'
import { WorkIndex } from '../components/generated/WorkIndex'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <HeroGrid
        field={
          <FieldHero>
            <HomeHero />
          </FieldHero>
        }
        rail={
          <Rail label="The day · Oct 15">
            <HomeSignals />
          </Rail>
        }
      />
      <SiteCallout />
      <Reveal>
        <WorkIndex />
      </Reveal>
    </>
  )
}
