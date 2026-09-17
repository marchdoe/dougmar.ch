import { createFileRoute } from '@tanstack/react-router'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'
import { AboutHero } from '../components/generated/AboutHero'
import { Timeline } from '../components/generated/Timeline'
import { Capabilities } from '../components/generated/Capabilities'
import { EducationRow } from '../components/generated/EducationRow'
import { PersonalStrip } from '../components/generated/PersonalStrip'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHero name={identity.name} role={identity.role} statement={identity.statement} />
      <Timeline entries={timeline} />
      <Capabilities items={capabilities} />
      <EducationRow education={education} />
      <PersonalStrip personal={personal} />
    </>
  )
}
