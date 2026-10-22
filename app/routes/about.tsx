import { createFileRoute } from '@tanstack/react-router'
import { Capabilities, EducationBlock, PersonalCluster } from '../components/generated/AboutDetails'
import { StatementHeading } from '../components/generated/Headings'
import { BonePanel, SplitGrid } from '../components/generated/Panel'
import { ThesisPanel } from '../components/generated/Thesis'
import { TimelineList } from '../components/generated/TimelineList'
import { identity, personal } from '../content/about'
import { capabilities, education, timeline } from '../content/timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <SplitGrid>
      <ThesisPanel pinned>
        <StatementHeading statement={identity.statement} />
      </ThesisPanel>
      <BonePanel id="about" label="Directory">
        <TimelineList entries={timeline} />
        <Capabilities items={capabilities} />
        <EducationBlock school={education} />
        <PersonalCluster data={personal} />
      </BonePanel>
    </SplitGrid>
  )
}
