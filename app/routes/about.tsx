import { createFileRoute } from '@tanstack/react-router'
import { AboutIntro } from '../components/generated/AboutIntro'
import { AboutSection } from '../components/generated/AboutSection'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { NumbersGrid } from '../components/generated/NumbersGrid'
import { TimelineRows } from '../components/generated/TimelineRows'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <>
      <AboutIntro />
      <AboutSection eyebrow="The record" title="Where I’ve worked">
        <TimelineRows />
      </AboutSection>
      <AboutSection eyebrow="Capabilities" title="What I do">
        <CapabilityTags />
      </AboutSection>
      <AboutSection eyebrow="By the numbers" title="Off the clock">
        <NumbersGrid />
      </AboutSection>
    </>
  )
}
