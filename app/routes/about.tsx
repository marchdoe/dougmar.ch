import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/generated/Hero'
import { BodyGrid } from '../components/generated/BodyGrid'
import { DesignedPanel, BuiltPanel } from '../components/generated/Panel'
import { TimelineList } from '../components/generated/TimelineList'
import { CapabilityTags } from '../components/generated/CapabilityTags'
import { EducationLedger } from '../components/generated/EducationLedger'
import { PersonalStats } from '../components/generated/PersonalStats'
import { ClosingLine } from '../components/generated/ClosingLine'
import { identity, personal } from '../content/about'
import { timeline, capabilities, education } from '../content/timeline'
import { selectedWork, featuredProject } from '../content/projects'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const workHref = selectedWork[0]
    ? `/work/${selectedWork[0].slug}`
    : featuredProject
      ? `/work/${featuredProject.slug}`
      : '/'

  return (
    <>
      <Hero
        word="INTERSECTION"
        eyebrow={identity.name}
        eyebrowHref="/about"
        deck={identity.statement}
      />
      <BodyGrid
        left={
          <DesignedPanel note="a working record">
            <TimelineList items={timeline} />
          </DesignedPanel>
        }
        right={
          <BuiltPanel note="capability and count">
            <CapabilityTags items={capabilities} />
            <EducationLedger
              school={education.school}
              degree={education.degree}
              concentration={education.concentration}
              years={education.years}
            />
            <PersonalStats
              holesInOne={personal.holesInOne}
              sport={personal.sport}
              teams={personal.teams}
              currentFocus={personal.currentFocus}
            />
            <ClosingLine
              firstHref={workHref}
              firstLabel="the work"
              secondHref="/"
              secondLabel="the front page"
              email={identity.email}
            />
          </BuiltPanel>
        }
      />
    </>
  )
}
