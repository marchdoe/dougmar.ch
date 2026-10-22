import { createFileRoute } from '@tanstack/react-router'
import { SiteCallout } from '../components/SiteCallout'
import { HomeHeading } from '../components/generated/Headings'
import { SplitGrid } from '../components/generated/Panel'
import { ThesisPanel } from '../components/generated/Thesis'
import { WorkIndex } from '../components/generated/WorkIndex'
import { experiments, featuredProject, selectedWork } from '../content/projects'

export const Route = createFileRoute('/')({ component: HomePage })

const items = [...(featuredProject ? [featuredProject] : []), ...selectedWork, ...experiments]

function HomePage() {
  return (
    <>
      <SplitGrid>
        <ThesisPanel pinned>
          <HomeHeading />
        </ThesisPanel>
        <WorkIndex items={items} />
      </SplitGrid>
      <SiteCallout />
    </>
  )
}
