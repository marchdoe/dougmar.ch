import { createFileRoute } from '@tanstack/react-router'
import { AboutHead } from '../components/generated/AboutHead'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { EducationBlock } from '../components/generated/EducationBlock'
import { PersonalStrip } from '../components/generated/PersonalStrip'
import { TimelineList } from '../components/generated/TimelineList'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutHead />
      <TimelineList />
      <CapabilityTags />
      <EducationBlock />
      <PersonalStrip />
    </>
  )
}
