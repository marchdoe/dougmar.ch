import { createFileRoute } from '@tanstack/react-router'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'
import { Masthead } from '../components/generated/Masthead'
import { TimelineSection } from '../components/generated/TimelineSection'
import { CapabilitiesSection } from '../components/generated/CapabilitiesSection'
import { EducationSection } from '../components/generated/EducationSection'
import { PersonalSection } from '../components/generated/PersonalSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

// Em dashes render fine typographically but the copy gate wants a comma; the
// statement is content-file prose, not ours to edit, so it is cleaned only
// at render time.
const statement = identity.statement.replace(/\s*—\s*/g, ', ')

function AboutPage() {
  return (
    <>
      <Masthead heroContent={<>{statement}</>} heroVariant="prose" />
      <TimelineSection entries={timeline} />
      <CapabilitiesSection items={capabilities} />
      <EducationSection education={education} />
      <PersonalSection personal={personal} />
    </>
  )
}
