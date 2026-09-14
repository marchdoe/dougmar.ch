import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '../components/generated/AboutHero'
import { Timeline } from '../components/generated/Timeline'
import { AboutPersonal } from '../components/generated/AboutPersonal'
import { Section } from '../components/generated/Section'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero
        name={identity.name}
        role={identity.role}
        statement={identity.statement}
        capabilities={capabilities}
      />
      <Section>
        <Timeline entries={timeline} education={education} />
      </Section>
      <Section>
        <AboutPersonal personal={personal} />
      </Section>
    </>
  )
}
