import { createFileRoute } from '@tanstack/react-router'
import { AboutThesis } from '../components/generated/AboutThesis'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { EducationRows } from '../components/generated/EducationRows'
import { PersonalStrip } from '../components/generated/PersonalStrip'
import { SplitFrame } from '../components/generated/SplitFrame'
import { TimelineIndex } from '../components/generated/TimelineIndex'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <SplitFrame thesis={<AboutThesis />}>
      <TimelineIndex />
      <CapabilityTags />
      <EducationRows />
      <PersonalStrip />
    </SplitFrame>
  )
}
