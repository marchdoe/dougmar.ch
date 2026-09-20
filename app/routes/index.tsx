import { createFileRoute } from '@tanstack/react-router'
import { featuredProject, selectedWork, experiments } from '../content/projects'
import { Masthead } from '../components/generated/Masthead'
import { WorkIndex } from '../components/generated/WorkIndex'
import { RunningFoot } from '../components/generated/RunningFoot'
import { css } from '../../styled-system/css'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const rest = [...selectedWork, ...experiments]
  return (
    <>
      <Masthead
        heroContent={
          <>
            <span className={css({ color: 'accent' })}>ten years independent.</span> still the
            vehicle for the next experiment.
          </>
        }
      />
      <WorkIndex featured={featuredProject} rest={rest} />
      <RunningFoot />
    </>
  )
}
